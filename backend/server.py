from fastapi import FastAPI, APIRouter, HTTPException, Request, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import uuid
import logging
import ipaddress
import asyncio
from pathlib import Path
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timezone, timedelta
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logger = logging.getLogger(__name__)

# ---------------- Email (Emergent managed Resend proxy) ----------------
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "Second Salary Capital")
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
OWNER_NOTIFY_EMAIL = os.environ.get("OWNER_NOTIFY_EMAIL") or None

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: Optional[str] = None) -> Optional[str]:
    _assert_safe_email(subject, html)
    if not EMAIL_KEY:
        logger.warning("EMERGENT_EMAIL_KEY not set; skipping email send")
        return None
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except Exception as e:
        logger.error(f"Email send error: {str(e)}")
        return None


def _email_shell(title: str, body_html: str) -> str:
    return (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        'style="background:#0B0C0E;padding:32px 16px"><tr><td align="center">'
        '<table role="presentation" width="560" cellpadding="0" cellspacing="0" '
        'style="background:#13151A;border:1px solid #222630;border-radius:16px;overflow:hidden">'
        '<tr><td style="padding:28px 32px;border-bottom:1px solid #222630">'
        '<span style="font-family:Arial,sans-serif;font-size:13px;letter-spacing:3px;'
        'text-transform:uppercase;color:#E6C280">Second Salary Capital</span></td></tr>'
        f'<tr><td style="padding:32px;font-family:Arial,sans-serif;color:#F4F5F7">'
        f'<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3">{title}</h1>'
        f'{body_html}'
        '</td></tr>'
        '<tr><td style="padding:20px 32px;border-top:1px solid #222630">'
        '<p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#64748B">'
        f'Sent by {escape(EMAIL_FROM_NAME)}. It started with our second salary. '
        'We never ask for passwords, OTPs or card details by email.</p></td></tr>'
        '</table></td></tr></table>'
    )


def _kv_rows(data: dict) -> str:
    rows = "".join(
        f'<tr><td style="padding:6px 0;font-size:12px;color:#9CA3AF;vertical-align:top;'
        f'text-transform:capitalize">{escape(k.replace("_", " "))}</td>'
        f'<td style="padding:6px 0 6px 16px;font-size:13px;color:#F4F5F7">{escape(str(v) or "-")}</td></tr>'
        for k, v in data.items()
    )
    return f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0">{rows}</table>'


# ---------------- Models ----------------
class SessionExchange(BaseModel):
    session_id: str


class FounderApplication(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    location: Optional[str] = ""
    linkedin: Optional[str] = ""
    occupation: Optional[str] = ""
    experience: Optional[str] = ""
    industry: Optional[str] = ""
    idea: str
    problem: Optional[str] = ""
    target_customer: Optional[str] = ""
    solution: Optional[str] = ""
    existing_business: Optional[str] = ""
    existing_customers: Optional[str] = ""
    revenue: Optional[str] = ""
    team: Optional[str] = ""
    capital_required: Optional[str] = ""
    capital_invested: Optional[str] = ""
    full_time: Optional[str] = ""
    why_build: Optional[str] = ""
    deck_link: Optional[str] = ""


class InvestorRegistration(BaseModel):
    name: str
    company: Optional[str] = ""
    email: EmailStr
    phone: Optional[str] = ""
    location: Optional[str] = ""
    investment_range: Optional[str] = ""
    preferred_sectors: Optional[str] = ""
    preferred_geography: Optional[str] = ""
    investment_stage: Optional[str] = ""
    investment_experience: Optional[str] = ""
    strategic_expertise: Optional[str] = ""
    linkedin: Optional[str] = ""
    notes: Optional[str] = ""


class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    topic: Optional[str] = "General"
    message: str


# ---------------- Auth helpers ----------------
async def _user_from_token(token: Optional[str]):
    if not token:
        return None
    session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session:
        return None
    expires_at = session["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        return None
    return await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})


async def get_current_user(request: Request):
    token = request.cookies.get("session_token")
    auth = request.headers.get("Authorization")
    if not token and auth and auth.startswith("Bearer "):
        token = auth.split(" ", 1)[1]
    user = await _user_from_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


async def get_optional_user(request: Request):
    token = request.cookies.get("session_token")
    auth = request.headers.get("Authorization")
    if not token and auth and auth.startswith("Bearer "):
        token = auth.split(" ", 1)[1]
    return await _user_from_token(token)


def _public_user(user: dict) -> dict:
    return {
        "user_id": user["user_id"],
        "email": user["email"],
        "name": user.get("name", ""),
        "picture": user.get("picture", ""),
    }


# ---------------- Routes ----------------
@api_router.get("/")
async def root():
    return {"message": "Second Salary Capital API"}


@api_router.post("/auth/session")
async def exchange_session(payload: SessionExchange, response: Response):
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": payload.session_id},
            )
    except Exception:
        raise HTTPException(status_code=502, detail="Auth provider unreachable")
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid session_id")
    data = r.json()
    email = data["email"]
    now = datetime.now(timezone.utc)
    user = await db.users.find_one({"email": email}, {"_id": 0})
    if not user:
        user = {
            "user_id": f"user_{uuid.uuid4().hex[:12]}",
            "email": email,
            "name": data.get("name", ""),
            "picture": data.get("picture", ""),
            "created_at": now,
        }
        await db.users.insert_one(dict(user))
    else:
        await db.users.update_one(
            {"email": email},
            {"$set": {"name": data.get("name", user.get("name", "")),
                      "picture": data.get("picture", user.get("picture", ""))}},
        )
        user["name"] = data.get("name", user.get("name", ""))
        user["picture"] = data.get("picture", user.get("picture", ""))
    token = data["session_token"]
    await db.user_sessions.insert_one({
        "user_id": user["user_id"],
        "session_token": token,
        "expires_at": now + timedelta(days=7),
        "created_at": now,
    })
    response.set_cookie(
        "session_token", token, httponly=True, secure=True,
        samesite="none", path="/", max_age=7 * 24 * 3600,
    )
    return _public_user(user)


@api_router.get("/auth/me")
async def auth_me(request: Request):
    user = await get_current_user(request)
    return _public_user(user)


@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    token = request.cookies.get("session_token")
    if token:
        await db.user_sessions.delete_many({"session_token": token})
    response.delete_cookie("session_token", path="/")
    return {"status": "ok"}


@api_router.post("/applications/founder")
async def submit_founder_application(payload: FounderApplication, request: Request):
    user = await get_optional_user(request)
    now = datetime.now(timezone.utc)
    doc = payload.model_dump()
    doc.update({
        "application_id": f"fa_{uuid.uuid4().hex[:12]}",
        "status": "submitted",
        "user_id": user["user_id"] if user else None,
        "created_at": now.isoformat(),
    })
    await db.founder_applications.insert_one(dict(doc))

    confirm_html = _email_shell(
        "We received your application",
        f'<p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#D1D5DB">'
        f'Hi {escape(doc["name"])}, thank you for choosing to build with Second Salary Capital. '
        'Your founder application has been received and is now in <strong style="color:#E6C280">screening</strong>.</p>'
        f'<p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#D1D5DB">'
        'Our team reviews every application against market research, founder fit and capital '
        'readiness. If your idea is shortlisted, we will reach out for a discovery conversation.</p>'
        f'<p style="margin:0;font-size:14px;line-height:1.7;color:#D1D5DB">'
        'You don\'t have to build every part of a company alone.</p>',
    )
    asyncio.create_task(send_email(
        to=doc["email"],
        subject="Your founder application is in screening — Second Salary Capital",
        html=confirm_html,
    ))
    if OWNER_NOTIFY_EMAIL:
        notify_html = _email_shell(
            f'New founder application: {escape(doc["name"])}',
            _kv_rows({k: v for k, v in doc.items() if k not in ("user_id",)}),
        )
        asyncio.create_task(send_email(
            to=OWNER_NOTIFY_EMAIL,
            subject=f'New founder application — {doc["name"]}',
            html=notify_html,
        ))
    return {"status": "success", "application_id": doc["application_id"], "application_status": "submitted"}


@api_router.post("/applications/investor")
async def submit_investor_registration(payload: InvestorRegistration, request: Request):
    user = await get_optional_user(request)
    now = datetime.now(timezone.utc)
    doc = payload.model_dump()
    doc.update({
        "registration_id": f"ir_{uuid.uuid4().hex[:12]}",
        "status": "verification_pending",
        "user_id": user["user_id"] if user else None,
        "created_at": now.isoformat(),
    })
    await db.investor_registrations.insert_one(dict(doc))

    confirm_html = _email_shell(
        "Welcome to the investor network",
        f'<p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#D1D5DB">'
        f'Hi {escape(doc["name"])}, your registration with the Second Salary Capital investor '
        'network has been received and is now in <strong style="color:#E6C280">verification</strong>.</p>'
        f'<p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#D1D5DB">'
        'Once verified, you will gain access to structured venture opportunities being developed '
        'through our ecosystem — founder information, business models, market research, capital '
        'requirements and progress updates.</p>'
        f'<p style="margin:0;font-size:12px;line-height:1.7;color:#9CA3AF">'
        'Nothing on this platform constitutes a promise of returns, exits or allocations. '
        'All opportunities involve risk.</p>',
    )
    asyncio.create_task(send_email(
        to=doc["email"],
        subject="Your investor registration is being verified — Second Salary Capital",
        html=confirm_html,
    ))
    if OWNER_NOTIFY_EMAIL:
        notify_html = _email_shell(
            f'New investor registration: {escape(doc["name"])}',
            _kv_rows({k: v for k, v in doc.items() if k not in ("user_id",)}),
        )
        asyncio.create_task(send_email(
            to=OWNER_NOTIFY_EMAIL,
            subject=f'New investor registration — {doc["name"]}',
            html=notify_html,
        ))
    return {"status": "success", "registration_id": doc["registration_id"], "registration_status": "verification_pending"}


@api_router.post("/contact")
async def submit_contact(payload: ContactMessage):
    now = datetime.now(timezone.utc)
    doc = payload.model_dump()
    doc.update({"message_id": f"cm_{uuid.uuid4().hex[:12]}", "created_at": now.isoformat()})
    await db.contact_messages.insert_one(dict(doc))

    confirm_html = _email_shell(
        "We received your message",
        f'<p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#D1D5DB">'
        f'Hi {escape(doc["name"])}, thank you for reaching out to Second Salary Capital '
        f'about <strong style="color:#E6C280">{escape(doc["topic"])}</strong>. '
        'Our team will get back to you shortly.</p>',
    )
    asyncio.create_task(send_email(
        to=doc["email"],
        subject="We received your message — Second Salary Capital",
        html=confirm_html,
    ))
    if OWNER_NOTIFY_EMAIL:
        notify_html = _email_shell(
            f'New contact message: {escape(doc["name"])} ({escape(doc["topic"])})',
            _kv_rows(doc),
        )
        asyncio.create_task(send_email(
            to=OWNER_NOTIFY_EMAIL,
            subject=f'New contact message — {doc["name"]}',
            html=notify_html,
        ))
    return {"status": "success", "message_id": doc["message_id"]}


@api_router.get("/my/activity")
async def my_activity(request: Request):
    user = await get_current_user(request)
    founder_apps = await db.founder_applications.find(
        {"$or": [{"user_id": user["user_id"]}, {"email": user["email"]}]},
        {"_id": 0},
    ).sort("created_at", -1).to_list(50)
    investor_regs = await db.investor_registrations.find(
        {"$or": [{"user_id": user["user_id"]}, {"email": user["email"]}]},
        {"_id": 0},
    ).sort("created_at", -1).to_list(50)
    return {
        "user": _public_user(user),
        "founder_applications": founder_apps,
        "investor_registrations": investor_regs,
    }


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
