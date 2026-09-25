from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, UploadFile, File
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
import requests

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
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "Anvaya Partners")
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
OWNER_NOTIFY_EMAIL = os.environ.get("OWNER_NOTIFY_EMAIL") or None

# ---------------- Admin ----------------
ADMIN_EMAILS = {e.strip().lower() for e in os.environ.get("ADMIN_EMAILS", "").split(",") if e.strip()}

# ---------------- Object storage (Emergent) ----------------
STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = "anvaya-partners"
storage_key = None


def init_storage(force: bool = False):
    global storage_key
    if storage_key and not force:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120,
    )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    key = init_storage()
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")

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
        'text-transform:uppercase;color:#E6C280">Anvaya Partners</span></td></tr>'
        f'<tr><td style="padding:32px;font-family:Arial,sans-serif;color:#F4F5F7">'
        f'<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3">{title}</h1>'
        f'{body_html}'
        '</td></tr>'
        '<tr><td style="padding:20px 32px;border-top:1px solid #222630">'
        '<p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#64748B">'
        f'{escape(EMAIL_FROM_NAME)} Private Limited · [City], India — where capital meets founders. '
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
    return {"message": "Anvaya Partners API"}


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
        f'Hi {escape(doc["name"])}, thank you for applying to Anvaya Partners. '
        'Your application has been received and is now <strong style="color:#E6C280">under review</strong>.</p>'
        f'<p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#D1D5DB">'
        'Every application is read personally. If there is a fit, we will reach out directly '
        'for a conversation.</p>'
        f'<p style="margin:0;font-size:14px;line-height:1.7;color:#D1D5DB">'
        'We invest our own capital and work hands-on with the founders we back.</p>',
    )
    asyncio.create_task(send_email(
        to=doc["email"],
        subject="Your application to Anvaya Partners is under review",
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
        "Your network application is under review",
        f'<p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#D1D5DB">'
        f'Hi {escape(doc["name"])}, thank you for applying to join the Anvaya Partners investor '
        'network. Your application is now in <strong style="color:#E6C280">verification</strong> — '
        'every member is reviewed manually, and our team will follow up with you directly.</p>'
        f'<p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#D1D5DB">'
        'The network is private. Curated opportunities are shared only with verified members, '
        'who invest directly in the companies they individually choose. Anvaya Partners does not '
        'manage or pool investors\' money.</p>'
        f'<p style="margin:0;font-size:12px;line-height:1.7;color:#9CA3AF">'
        'Anvaya Partners Private Limited is not a stock exchange, is not registered with SEBI as an '
        'intermediary, and does not solicit investment from the public. Nothing here is an offer or '
        'solicitation of securities. Early-stage investing involves high risk, including possible '
        'loss of the entire amount invested.</p>',
    )
    asyncio.create_task(send_email(
        to=doc["email"],
        subject="Your investor network application — Anvaya Partners",
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
        f'Hi {escape(doc["name"])}, thank you for reaching out to Anvaya Partners '
        f'about <strong style="color:#E6C280">{escape(doc["topic"])}</strong>. '
        'Our team will get back to you shortly.</p>',
    )
    asyncio.create_task(send_email(
        to=doc["email"],
        subject="We received your message — Anvaya Partners",
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


# ---------------- Admin & platform models ----------------
FOUNDER_STATUSES = {"submitted", "screening", "shortlisted", "discovery", "validation", "founder_review", "approved", "rejected"}
INVESTOR_STATUSES = {"verification_pending", "verified", "approved", "rejected"}
ALLOWED_DECK_EXT = {"pdf", "ppt", "pptx", "doc", "docx"}
MAX_DECK_SIZE = 15 * 1024 * 1024


class StatusUpdate(BaseModel):
    status: str


class InsightIn(BaseModel):
    title: str
    category: Optional[str] = "Company Building"
    read: Optional[str] = "4 min"
    excerpt: Optional[str] = ""
    body: Optional[str] = ""
    published: bool = True


async def require_admin(request: Request):
    user = await get_current_user(request)
    if user["email"].lower() not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# ---------------- Public insights ----------------
@api_router.get("/insights")
async def list_insights():
    items = await db.insights.find({"published": True}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return {"insights": items}


# ---------------- Pitch deck upload ----------------
@api_router.post("/applications/founder/{application_id}/deck")
async def upload_deck(application_id: str, file: UploadFile = File(...)):
    app_doc = await db.founder_applications.find_one({"application_id": application_id}, {"_id": 0})
    if not app_doc:
        raise HTTPException(status_code=404, detail="Application not found")
    if app_doc.get("deck_file_id"):
        raise HTTPException(status_code=409, detail="A deck is already attached to this application")
    ext = (file.filename or "").rsplit(".", 1)[-1].lower() if "." in (file.filename or "") else ""
    if ext not in ALLOWED_DECK_EXT:
        raise HTTPException(status_code=400, detail="Only PDF, PPT, PPTX, DOC or DOCX files are allowed")
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty file")
    if len(data) > MAX_DECK_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 15MB)")
    path = f"{APP_NAME}/decks/{application_id}/{uuid.uuid4().hex}.{ext}"
    try:
        result = await asyncio.to_thread(put_object, path, data, file.content_type or "application/octet-stream")
    except Exception as e:
        logger.error(f"Deck upload failed: {e}")
        raise HTTPException(status_code=502, detail="File storage unavailable")
    file_id = f"file_{uuid.uuid4().hex[:12]}"
    await db.files.insert_one({
        "file_id": file_id,
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": file.content_type,
        "size": result["size"],
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    await db.founder_applications.update_one(
        {"application_id": application_id},
        {"$set": {"deck_file_id": file_id, "deck_filename": file.filename}},
    )
    return {"status": "success", "file_id": file_id, "filename": file.filename}


# ---------------- Admin endpoints ----------------
@api_router.get("/admin/overview")
async def admin_overview(request: Request):
    await require_admin(request)
    return {
        "founder_applications": await db.founder_applications.count_documents({}),
        "investor_registrations": await db.investor_registrations.count_documents({}),
        "contact_messages": await db.contact_messages.count_documents({}),
        "insights": await db.insights.count_documents({}),
        "users": await db.users.count_documents({}),
        "files": await db.files.count_documents({"is_deleted": False}),
    }


@api_router.get("/admin/founder-applications")
async def admin_founder_applications(request: Request):
    await require_admin(request)
    items = await db.founder_applications.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return {"applications": items}


_STATUS_LABELS = {
    "submitted": "Submitted", "screening": "Screening", "shortlisted": "Shortlisted",
    "discovery": "Discovery", "validation": "Validation", "founder_review": "Founder Review",
    "approved": "Approved", "rejected": "Rejected",
    "verification_pending": "Verification Pending", "verified": "Verified",
}


async def send_status_email(kind: str, doc: dict, new_status: str):
    label = _STATUS_LABELS.get(new_status, new_status.replace("_", " ").title())
    name = escape(doc.get("name", "there"))
    ref = escape(doc.get("application_id") or doc.get("registration_id") or "")
    if kind == "founder":
        subject = f"Application update: {label} — Anvaya Partners"
        detail = ("Your founder application has moved to "
                  f'<strong style="color:#E6C280">{escape(label)}</strong>. '
                  "Our team will reach out directly whenever the next step involves you.")
    else:
        subject = f"Investor network update: {label} — Anvaya Partners"
        detail = ("Your investor network application status is now "
                  f'<strong style="color:#E6C280">{escape(label)}</strong>.')
        if new_status in ("verified", "approved"):
            detail += (" You now have access to privately shared opportunities — sign in to your "
                       "Anvaya Partners account to review them.")
    html = _email_shell(
        "Pipeline update",
        f'<p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#D1D5DB">Hi {name},</p>'
        f'<p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#D1D5DB">{detail}</p>'
        f'<p style="margin:0;font-size:12px;color:#9CA3AF">Reference: <span style="font-family:monospace">{ref}</span></p>',
    )
    await send_email(to=doc["email"], subject=subject, html=html)


@api_router.patch("/admin/founder-applications/{application_id}")
async def admin_update_founder_status(application_id: str, payload: StatusUpdate, request: Request):
    await require_admin(request)
    if payload.status not in FOUNDER_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")
    doc = await db.founder_applications.find_one({"application_id": application_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Application not found")
    if doc.get("status") != payload.status:
        await db.founder_applications.update_one(
            {"application_id": application_id}, {"$set": {"status": payload.status}}
        )
        asyncio.create_task(send_status_email("founder", doc, payload.status))
    return {"status": "success", "application_id": application_id, "new_status": payload.status}


@api_router.get("/admin/investor-registrations")
async def admin_investor_registrations(request: Request):
    await require_admin(request)
    items = await db.investor_registrations.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return {"registrations": items}


@api_router.patch("/admin/investor-registrations/{registration_id}")
async def admin_update_investor_status(registration_id: str, payload: StatusUpdate, request: Request):
    await require_admin(request)
    if payload.status not in INVESTOR_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")
    doc = await db.investor_registrations.find_one({"registration_id": registration_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Registration not found")
    if doc.get("status") != payload.status:
        await db.investor_registrations.update_one(
            {"registration_id": registration_id}, {"$set": {"status": payload.status}}
        )
        asyncio.create_task(send_status_email("investor", doc, payload.status))
    return {"status": "success", "registration_id": registration_id, "new_status": payload.status}


@api_router.get("/admin/contacts")
async def admin_contacts(request: Request):
    await require_admin(request)
    items = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return {"messages": items}


@api_router.get("/admin/insights")
async def admin_list_insights(request: Request):
    await require_admin(request)
    items = await db.insights.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return {"insights": items}


@api_router.post("/admin/insights")
async def admin_create_insight(payload: InsightIn, request: Request):
    await require_admin(request)
    slug = re.sub(r"[^a-z0-9]+", "-", payload.title.lower()).strip("-") or uuid.uuid4().hex[:8]
    if await db.insights.find_one({"slug": slug}):
        slug = f"{slug}-{uuid.uuid4().hex[:4]}"
    doc = payload.model_dump()
    doc.update({
        "insight_id": f"in_{uuid.uuid4().hex[:12]}",
        "slug": slug,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    await db.insights.insert_one(dict(doc))
    return {k: v for k, v in doc.items()}


@api_router.put("/admin/insights/{insight_id}")
async def admin_update_insight(insight_id: str, payload: InsightIn, request: Request):
    await require_admin(request)
    res = await db.insights.update_one({"insight_id": insight_id}, {"$set": payload.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Insight not found")
    doc = await db.insights.find_one({"insight_id": insight_id}, {"_id": 0})
    return doc


@api_router.delete("/admin/insights/{insight_id}")
async def admin_delete_insight(insight_id: str, request: Request):
    await require_admin(request)
    res = await db.insights.delete_one({"insight_id": insight_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Insight not found")
    return {"status": "success"}


@api_router.get("/admin/files/{file_id}/download")
async def admin_download_file(file_id: str, request: Request):
    await require_admin(request)
    record = await db.files.find_one({"file_id": file_id, "is_deleted": False}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    try:
        data, content_type = await asyncio.to_thread(get_object, record["storage_path"])
    except Exception as e:
        logger.error(f"File download failed: {e}")
        raise HTTPException(status_code=502, detail="File storage unavailable")
    return Response(
        content=data,
        media_type=record.get("content_type") or content_type,
        headers={"Content-Disposition": f'attachment; filename="{record["original_filename"]}"'},
    )


# ---------------- Ventures, milestones, cap tables ----------------
class VentureIn(BaseModel):
    name: str
    industry: Optional[str] = ""
    stage: Optional[str] = "Validation"
    description: Optional[str] = ""
    capital_required: Optional[str] = ""
    founder_name: Optional[str] = ""
    founder_email: Optional[str] = ""
    status: Optional[str] = "active"
    visible_to_investors: bool = False


class MilestoneIn(BaseModel):
    title: str
    due_date: Optional[str] = ""
    done: bool = False


class OwnershipIn(BaseModel):
    party_name: str
    party_type: Optional[str] = "founder"
    percentage: float = 0


class InterestIn(BaseModel):
    note: Optional[str] = ""


@api_router.get("/admin/ventures")
async def admin_list_ventures(request: Request):
    await require_admin(request)
    ventures = await db.ventures.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    for v in ventures:
        v["milestones"] = await db.milestones.find({"venture_id": v["venture_id"]}, {"_id": 0}).sort("created_at", 1).to_list(200)
        v["ownership"] = await db.ownership.find({"venture_id": v["venture_id"]}, {"_id": 0}).to_list(100)
        v["kpis"] = await db.kpis.find({"venture_id": v["venture_id"]}, {"_id": 0}).sort("month", 1).to_list(100)
        v["tasks"] = await db.tasks.find({"venture_id": v["venture_id"]}, {"_id": 0}).sort("created_at", 1).to_list(200)
        v["documents"] = await db.documents.find(
            {"venture_id": v["venture_id"], "is_deleted": False},
            {"_id": 0, "storage_path": 0},
        ).sort("created_at", -1).to_list(100)
        v["interests_count"] = await db.interests.count_documents({"venture_id": v["venture_id"]})
    return {"ventures": ventures}


@api_router.post("/admin/ventures")
async def admin_create_venture(payload: VentureIn, request: Request):
    await require_admin(request)
    doc = payload.model_dump()
    doc.update({"venture_id": f"vn_{uuid.uuid4().hex[:12]}", "created_at": datetime.now(timezone.utc).isoformat()})
    await db.ventures.insert_one(dict(doc))
    return doc


@api_router.put("/admin/ventures/{venture_id}")
async def admin_update_venture(venture_id: str, payload: VentureIn, request: Request):
    await require_admin(request)
    res = await db.ventures.update_one({"venture_id": venture_id}, {"$set": payload.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Venture not found")
    return await db.ventures.find_one({"venture_id": venture_id}, {"_id": 0})


@api_router.delete("/admin/ventures/{venture_id}")
async def admin_delete_venture(venture_id: str, request: Request):
    await require_admin(request)
    res = await db.ventures.delete_one({"venture_id": venture_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Venture not found")
    await db.milestones.delete_many({"venture_id": venture_id})
    await db.ownership.delete_many({"venture_id": venture_id})
    await db.interests.delete_many({"venture_id": venture_id})
    return {"status": "success"}


@api_router.post("/admin/ventures/{venture_id}/milestones")
async def admin_add_milestone(venture_id: str, payload: MilestoneIn, request: Request):
    await require_admin(request)
    if not await db.ventures.find_one({"venture_id": venture_id}):
        raise HTTPException(status_code=404, detail="Venture not found")
    doc = payload.model_dump()
    doc.update({
        "milestone_id": f"ms_{uuid.uuid4().hex[:12]}",
        "venture_id": venture_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    await db.milestones.insert_one(dict(doc))
    return doc


@api_router.patch("/admin/milestones/{milestone_id}")
async def admin_update_milestone(milestone_id: str, payload: MilestoneIn, request: Request):
    await require_admin(request)
    res = await db.milestones.update_one({"milestone_id": milestone_id}, {"$set": payload.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Milestone not found")
    return await db.milestones.find_one({"milestone_id": milestone_id}, {"_id": 0})


@api_router.delete("/admin/milestones/{milestone_id}")
async def admin_delete_milestone(milestone_id: str, request: Request):
    await require_admin(request)
    res = await db.milestones.delete_one({"milestone_id": milestone_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Milestone not found")
    return {"status": "success"}


@api_router.post("/admin/ventures/{venture_id}/ownership")
async def admin_add_ownership(venture_id: str, payload: OwnershipIn, request: Request):
    await require_admin(request)
    if not await db.ventures.find_one({"venture_id": venture_id}):
        raise HTTPException(status_code=404, detail="Venture not found")
    doc = payload.model_dump()
    doc.update({
        "ownership_id": f"ow_{uuid.uuid4().hex[:12]}",
        "venture_id": venture_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    await db.ownership.insert_one(dict(doc))
    return doc


@api_router.delete("/admin/ownership/{ownership_id}")
async def admin_delete_ownership(ownership_id: str, request: Request):
    await require_admin(request)
    res = await db.ownership.delete_one({"ownership_id": ownership_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Ownership record not found")
    return {"status": "success"}


@api_router.get("/admin/interests")
async def admin_list_interests(request: Request):
    await require_admin(request)
    items = await db.interests.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return {"interests": items}


# ---------------- Investor portal ----------------
async def require_verified_investor(request: Request):
    user = await get_current_user(request)
    if user["email"].lower() in ADMIN_EMAILS:
        return user
    reg = await db.investor_registrations.find_one({"email": user["email"]}, {"_id": 0})
    if not reg or reg.get("status") not in ("verified", "approved"):
        raise HTTPException(status_code=403, detail="Investor verification required")
    return user


@api_router.get("/opportunities")
async def list_opportunities(request: Request):
    user = await require_verified_investor(request)
    ventures = await db.ventures.find(
        {"visible_to_investors": True, "status": {"$ne": "exited"}}, {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    out = []
    for v in ventures:
        total = await db.milestones.count_documents({"venture_id": v["venture_id"]})
        done = await db.milestones.count_documents({"venture_id": v["venture_id"], "done": True})
        mine = await db.interests.find_one({"venture_id": v["venture_id"], "investor_email": user["email"]})
        docs = await db.documents.find(
            {"venture_id": v["venture_id"], "is_deleted": False},
            {"_id": 0, "document_id": 1, "filename": 1, "kind": 1, "size": 1},
        ).to_list(50)
        out.append({
            "venture_id": v["venture_id"],
            "name": v["name"],
            "industry": v.get("industry", ""),
            "stage": v.get("stage", ""),
            "description": v.get("description", ""),
            "capital_required": v.get("capital_required", ""),
            "founder_name": v.get("founder_name", ""),
            "milestones_total": total,
            "milestones_done": done,
            "my_interest": bool(mine),
            "documents": docs,
        })
    return {"opportunities": out}


async def generate_interest_alert(user: dict, venture: dict, note: str) -> str:
    from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

    chat = LlmChat(
        api_key=EMERGENT_KEY,
        session_id=f"jarvis-alert-{uuid.uuid4().hex[:8]}",
        system_message=(
            "You are JARVIS, internal operations AI of Anvaya Partners, an early-stage investment firm. "
            "In 2-3 sharp sentences, summarize a new investor-interest event for the team "
            "and suggest one concrete next step. No greeting, no sign-off, no fluff."
        ),
    ).with_model("openai", "gpt-5.4")
    prompt = (
        f"Venture: {venture['name']} (industry {venture.get('industry') or 'n/a'}, stage {venture.get('stage') or 'n/a'}, "
        f"capital required {venture.get('capital_required') or 'TBD'}). "
        f"Investor: {user.get('name') or 'Unknown'} <{user['email']}>. Note from investor: {note or 'none'}."
    )
    parts = []
    async for ev in chat.stream_message(UserMessage(text=prompt)):
        if isinstance(ev, TextDelta):
            parts.append(ev.content)
        elif isinstance(ev, StreamDone):
            break
    return "".join(parts).strip()


@api_router.post("/opportunities/{venture_id}/interest")
async def express_interest(venture_id: str, payload: InterestIn, request: Request):
    user = await require_verified_investor(request)
    venture = await db.ventures.find_one({"venture_id": venture_id, "visible_to_investors": True}, {"_id": 0})
    if not venture:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    existing = await db.interests.find_one({"venture_id": venture_id, "investor_email": user["email"]})
    if existing:
        return {"status": "success", "interest_id": existing["interest_id"], "already": True}
    doc = {
        "interest_id": f"int_{uuid.uuid4().hex[:12]}",
        "venture_id": venture_id,
        "venture_name": venture["name"],
        "investor_email": user["email"],
        "investor_name": user.get("name", ""),
        "note": payload.note,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.interests.insert_one(dict(doc))
    if OWNER_NOTIFY_EMAIL:
        try:
            alert = await generate_interest_alert(user, venture, payload.note)
        except Exception as e:
            logger.error(f"JARVIS interest alert LLM failed: {e}")
            alert = ""
        alert_html = (
            f'<p style="margin:0 0 18px;font-size:13px;line-height:1.7;color:#F4F5F7;'
            f'border-left:2px solid #E6C280;padding-left:14px">{escape(alert)}</p>'
        ) if alert else ""
        notify_html = _email_shell(
            f'Investor interest: {escape(venture["name"])}',
            alert_html + _kv_rows({
                "venture": venture["name"], "investor": user.get("name", ""),
                "email": user["email"], "note": payload.note or "-",
            }),
        )
        await send_email(
            to=OWNER_NOTIFY_EMAIL,
            subject=f'Investor interest in {venture["name"]} — {user.get("name") or user["email"]}',
            html=notify_html,
        )
    return {"status": "success", "interest_id": doc["interest_id"]}


# ---------------- JARVIS daily digest ----------------
async def build_digest_context() -> dict:
    now = datetime.now(timezone.utc)
    since = (now - timedelta(hours=24)).isoformat()
    today = now.date().isoformat()
    week = (now + timedelta(days=7)).date().isoformat()
    ventures = {v["venture_id"]: v["name"] for v in await db.ventures.find({}, {"_id": 0}).to_list(100)}

    def with_venture(items):
        return [{**{k: v for k, v in m.items()}, "venture": ventures.get(m.get("venture_id"), "?")} for m in items]

    founder_apps = await db.founder_applications.find({}, {"_id": 0}).to_list(500)
    pipeline = {}
    for a in founder_apps:
        pipeline[a.get("status", "submitted")] = pipeline.get(a.get("status", "submitted"), 0) + 1

    return {
        "date": today,
        "new_founder_applications_24h": await db.founder_applications.find(
            {"created_at": {"$gte": since}}, {"_id": 0, "name": 1, "industry": 1, "idea": 1, "capital_required": 1, "created_at": 1}).to_list(50),
        "new_investor_registrations_24h": await db.investor_registrations.find(
            {"created_at": {"$gte": since}}, {"_id": 0, "name": 1, "investment_range": 1, "preferred_sectors": 1, "created_at": 1}).to_list(50),
        "new_contact_messages_24h": await db.contact_messages.find(
            {"created_at": {"$gte": since}}, {"_id": 0, "name": 1, "topic": 1, "created_at": 1}).to_list(50),
        "new_investor_interests_24h": with_venture(await db.interests.find(
            {"created_at": {"$gte": since}}, {"_id": 0}).to_list(50)),
        "overdue_milestones": with_venture(await db.milestones.find(
            {"done": False, "due_date": {"$ne": "", "$lt": today}}, {"_id": 0}).to_list(100)),
        "milestones_due_next_7_days": with_venture(await db.milestones.find(
            {"done": False, "due_date": {"$gte": today, "$lte": week}}, {"_id": 0}).to_list(100)),
        "founder_pipeline_counts": pipeline,
        "active_ventures": await db.ventures.count_documents({"status": "active"}),
    }


async def generate_digest_text(context: dict) -> str:
    import json
    from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

    chat = LlmChat(
        api_key=EMERGENT_KEY,
        session_id=f"jarvis-{uuid.uuid4().hex[:8]}",
        system_message=(
            "You are JARVIS, the internal operations AI of Anvaya Partners, an early-stage investment firm. "
            "Write the daily operations digest for the team. Plain text, short headed sections "
            "with bullets, under 250 words. Lead with anything needing attention (overdue milestones, "
            "new investor interest). No greeting, no sign-off, no fluff. If a section has no activity, skip it."
        ),
    ).with_model("openai", "gpt-5.4")
    prompt = (
        "Last-24-hour activity data (JSON):\n"
        + json.dumps(context, indent=1, default=str)
        + "\n\nWrite today's JARVIS digest: what happened, what needs attention, and suggested follow-ups."
    )
    parts = []
    async for ev in chat.stream_message(UserMessage(text=prompt)):
        if isinstance(ev, TextDelta):
            parts.append(ev.content)
        elif isinstance(ev, StreamDone):
            break
    return "".join(parts).strip()


def _fallback_digest(context: dict) -> str:
    lines = [f"JARVIS DIGEST — {context['date']}", ""]
    lines.append(f"New founder applications (24h): {len(context['new_founder_applications_24h'])}")
    for a in context["new_founder_applications_24h"]:
        lines.append(f"- {a.get('name')} ({a.get('industry') or 'general'})")
    lines.append(f"New investor registrations (24h): {len(context['new_investor_registrations_24h'])}")
    for r in context["new_investor_registrations_24h"]:
        lines.append(f"- {r.get('name')} ({r.get('investment_range') or 'range TBD'})")
    lines.append(f"New messages (24h): {len(context['new_contact_messages_24h'])}")
    lines.append(f"New investor interest (24h): {len(context['new_investor_interests_24h'])}")
    for it in context["new_investor_interests_24h"]:
        lines.append(f"- {it.get('investor_name') or it.get('investor_email')} → {it.get('venture')}")
    if context["overdue_milestones"]:
        lines.append("")
        lines.append("OVERDUE MILESTONES:")
        for m in context["overdue_milestones"]:
            lines.append(f"- [{m.get('venture')}] {m.get('title')} (due {m.get('due_date')})")
    if context["milestones_due_next_7_days"]:
        lines.append("")
        lines.append("DUE IN THE NEXT 7 DAYS:")
        for m in context["milestones_due_next_7_days"]:
            lines.append(f"- [{m.get('venture')}] {m.get('title')} (due {m.get('due_date')})")
    return "\n".join(lines)


async def send_jarvis_digest(trigger: str = "manual") -> str:
    context = await build_digest_context()
    try:
        text = await generate_digest_text(context)
        if not text:
            raise ValueError("empty digest")
    except Exception as e:
        logger.error(f"JARVIS LLM failed, using fallback: {e}")
        text = _fallback_digest(context)
    await db.jarvis_runs.insert_one({
        "run_id": f"jar_{uuid.uuid4().hex[:12]}",
        "trigger": trigger,
        "preview": text,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    if OWNER_NOTIFY_EMAIL:
        body = "".join(
            f'<p style="margin:0 0 6px;font-size:13px;line-height:1.7;color:#D1D5DB">{escape(line)}</p>'
            if line.strip() else '<div style="height:10px"></div>'
            for line in text.split("\n")
        )
        await send_email(
            to=OWNER_NOTIFY_EMAIL,
            subject=f"JARVIS Daily Digest — {context['date']}",
            html=_email_shell("JARVIS Daily Digest", body),
        )
    return text


@api_router.post("/admin/jarvis/digest")
async def admin_send_digest(request: Request):
    await require_admin(request)
    text = await send_jarvis_digest(trigger="manual")
    return {"status": "success", "preview": text}


async def _jarvis_loop():
    while True:
        now = datetime.now(timezone.utc)
        next_run = now.replace(hour=7, minute=0, second=0, microsecond=0)
        if next_run <= now:
            next_run += timedelta(days=1)
        await asyncio.sleep((next_run - now).total_seconds())
        try:
            await send_jarvis_digest(trigger="scheduled")
            logger.info("JARVIS scheduled digest sent")
        except Exception as e:
            logger.error(f"JARVIS scheduled digest failed: {e}")


@app.on_event("startup")
async def jarvis_scheduler_start():
    if OWNER_NOTIFY_EMAIL:
        asyncio.create_task(_jarvis_loop())
        logger.info("JARVIS daily digest scheduler started (07:00 UTC)")


# ---------------- Venture documents, KPIs, tasks, founder portal ----------------
ALLOWED_DOC_EXT = {"pdf", "ppt", "pptx", "doc", "docx", "xls", "xlsx", "csv"}
MAX_DOC_SIZE = 25 * 1024 * 1024


class KpiIn(BaseModel):
    month: str
    revenue: float = 0
    growth: Optional[float] = None


class TaskIn(BaseModel):
    title: str
    due_date: Optional[str] = ""
    done: bool = False


class TaskToggle(BaseModel):
    done: bool


@api_router.post("/admin/ventures/{venture_id}/documents")
async def admin_upload_document(venture_id: str, request: Request, kind: str = "document", file: UploadFile = File(...)):
    await require_admin(request)
    if not await db.ventures.find_one({"venture_id": venture_id}):
        raise HTTPException(status_code=404, detail="Venture not found")
    if kind not in ("deck", "financial", "document"):
        kind = "document"
    ext = (file.filename or "").rsplit(".", 1)[-1].lower() if "." in (file.filename or "") else ""
    if ext not in ALLOWED_DOC_EXT:
        raise HTTPException(status_code=400, detail="Allowed: PDF, PPT, DOC, XLS, CSV")
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty file")
    if len(data) > MAX_DOC_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 25MB)")
    path = f"{APP_NAME}/venture-docs/{venture_id}/{uuid.uuid4().hex}.{ext}"
    try:
        result = await asyncio.to_thread(put_object, path, data, file.content_type or "application/octet-stream")
    except Exception as e:
        logger.error(f"Document upload failed: {e}")
        raise HTTPException(status_code=502, detail="File storage unavailable")
    doc = {
        "document_id": f"doc_{uuid.uuid4().hex[:12]}",
        "venture_id": venture_id,
        "kind": kind,
        "filename": file.filename,
        "size": result["size"],
        "storage_path": result["path"],
        "content_type": file.content_type,
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.documents.insert_one(dict(doc))
    return {k: v for k, v in doc.items() if k != "storage_path"}


@api_router.delete("/admin/documents/{document_id}")
async def admin_delete_document(document_id: str, request: Request):
    await require_admin(request)
    res = await db.documents.update_one({"document_id": document_id}, {"$set": {"is_deleted": True}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"status": "success"}


async def _stream_document(record) -> Response:
    try:
        data, content_type = await asyncio.to_thread(get_object, record["storage_path"])
    except Exception as e:
        logger.error(f"Document download failed: {e}")
        raise HTTPException(status_code=502, detail="File storage unavailable")
    return Response(
        content=data,
        media_type=record.get("content_type") or content_type,
        headers={"Content-Disposition": f'attachment; filename="{record["filename"]}"'},
    )


@api_router.get("/admin/documents/{document_id}/download")
async def admin_download_document(document_id: str, request: Request):
    await require_admin(request)
    record = await db.documents.find_one({"document_id": document_id, "is_deleted": False}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="Document not found")
    return await _stream_document(record)


@api_router.get("/documents/{document_id}/download")
async def investor_download_document(document_id: str, request: Request):
    await require_verified_investor(request)
    record = await db.documents.find_one({"document_id": document_id, "is_deleted": False}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="Document not found")
    venture = await db.ventures.find_one({"venture_id": record["venture_id"]})
    if not venture or not venture.get("visible_to_investors"):
        raise HTTPException(status_code=403, detail="Not available")
    return await _stream_document(record)


@api_router.post("/admin/ventures/{venture_id}/kpis")
async def admin_add_kpi(venture_id: str, payload: KpiIn, request: Request):
    await require_admin(request)
    if not await db.ventures.find_one({"venture_id": venture_id}):
        raise HTTPException(status_code=404, detail="Venture not found")
    doc = payload.model_dump()
    doc.update({
        "kpi_id": f"kpi_{uuid.uuid4().hex[:12]}",
        "venture_id": venture_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    await db.kpis.insert_one(dict(doc))
    return doc


@api_router.delete("/admin/kpis/{kpi_id}")
async def admin_delete_kpi(kpi_id: str, request: Request):
    await require_admin(request)
    res = await db.kpis.delete_one({"kpi_id": kpi_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="KPI not found")
    return {"status": "success"}


@api_router.post("/admin/ventures/{venture_id}/tasks")
async def admin_add_task(venture_id: str, payload: TaskIn, request: Request):
    await require_admin(request)
    if not await db.ventures.find_one({"venture_id": venture_id}):
        raise HTTPException(status_code=404, detail="Venture not found")
    doc = payload.model_dump()
    doc.update({
        "task_id": f"task_{uuid.uuid4().hex[:12]}",
        "venture_id": venture_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    await db.tasks.insert_one(dict(doc))
    return doc


@api_router.patch("/admin/tasks/{task_id}")
async def admin_update_task(task_id: str, payload: TaskIn, request: Request):
    await require_admin(request)
    res = await db.tasks.update_one({"task_id": task_id}, {"$set": payload.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return await db.tasks.find_one({"task_id": task_id}, {"_id": 0})


@api_router.delete("/admin/tasks/{task_id}")
async def admin_delete_task(task_id: str, request: Request):
    await require_admin(request)
    res = await db.tasks.delete_one({"task_id": task_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"status": "success"}


@api_router.get("/my/venture")
async def my_venture(request: Request):
    user = await get_current_user(request)
    venture = await db.ventures.find_one({"founder_email": user["email"]}, {"_id": 0})
    if not venture:
        raise HTTPException(status_code=404, detail="No venture linked to this account yet")
    venture["milestones"] = await db.milestones.find(
        {"venture_id": venture["venture_id"]}, {"_id": 0}).sort("created_at", 1).to_list(200)
    venture["tasks"] = await db.tasks.find(
        {"venture_id": venture["venture_id"]}, {"_id": 0}).sort("created_at", 1).to_list(200)
    return venture


@api_router.patch("/my/tasks/{task_id}")
async def my_task_toggle(task_id: str, payload: TaskToggle, request: Request):
    user = await get_current_user(request)
    task = await db.tasks.find_one({"task_id": task_id}, {"_id": 0})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    venture = await db.ventures.find_one({"venture_id": task["venture_id"]})
    is_admin = user["email"].lower() in ADMIN_EMAILS
    if not is_admin and (not venture or venture.get("founder_email") != user["email"]):
        raise HTTPException(status_code=403, detail="Not your venture")
    await db.tasks.update_one({"task_id": task_id}, {"$set": {"done": payload.done}})
    return {"status": "success", "task_id": task_id, "done": payload.done}


SEED_INSIGHTS = [
    {
        "slug": "why-anvaya", "category": "The Firm", "title": "Why 'Anvaya'?", "read": "3 min",
        "excerpt": "Anvaya is Sanskrit for 'bringing together' — founders with ambition, investors with conviction, and a partner committed to both.",
        "body": "Names carry intent. Anvaya (अन्वय) is Sanskrit for 'bringing together' — and that is precisely what this firm exists to do. On one side, founders with ambition: people building real companies who need more than money. On the other, investors with conviction: people who want to back real businesses, not lottery tickets. Anvaya Partners stands between them, committed to both — investing our own capital first, and then working hands-on inside every company we back. Bringing together is not a slogan. It is the operating model.",
    },
    {
        "slug": "capital-efficient-by-design", "category": "Approach", "title": "Capital-Efficient by Design", "read": "4 min",
        "excerpt": "We back businesses built to reach sustainable revenue early — not ones that burn cash chasing growth.",
        "body": "Burn is a choice, not a strategy. When we evaluate a company, the first question is not 'how fast can it grow with unlimited capital' but 'how soon can it sustain itself'. Businesses built to reach sustainable revenue early make better decisions: they price honestly, they hire carefully, and they listen to customers because they have to. Capital then accelerates what already works instead of subsidising what doesn't. That is what capital-efficient means in practice — and it is the only kind of company we back.",
    },
    {
        "slug": "what-operator-led-means", "category": "Approach", "title": "What Operator-Led Actually Means", "read": "4 min",
        "excerpt": "A decade of building and integrating enterprise systems — applied to every company we back.",
        "body": "Many investors advise. Fewer operate. Our team spent a decade building and integrating enterprise systems for large organisations — the unglamorous work of making strategy survive contact with reality. In every company we back, that experience shows up as real work: designing the go-to-market, setting up the finance stack, choosing the technology, building the operating rhythm. We work inside the company, next to the founder — not around it, from a distance.",
    },
    {
        "slug": "how-we-evaluate", "category": "Investment Notes", "title": "How We Evaluate a Company", "read": "5 min",
        "excerpt": "Discover, Evaluate, Invest, Build together — what we actually test at each stage.",
        "body": "Our process has four stages. Discover: we understand the opportunity in its own terms — the market, the problem, the person. Evaluate: we test all three rigorously — is the market real, does the model sustain itself early, is this the founder who will outlast the hard years? If the evidence is not there, we say so early and honestly. Invest: we commit our own capital with a structure both sides understand completely. Build together: then the real work begins — strategy, technology, finance, operations, go-to-market — side by side with the founder, for years.",
    },
    {
        "slug": "what-we-look-for", "category": "Founders", "title": "What We Look For in a Founder", "read": "4 min",
        "excerpt": "Clarity of thought, capital discipline, domain depth — and a years-not-quarters mindset.",
        "body": "We look for four things. Clarity of thought: the founder can explain the business simply, because they understand it deeply. Capital discipline: they treat money as something earned, not something to spend. Domain depth: they know their industry from the inside — its customers, its inefficiencies, its unwritten rules. And temperament: building takes years, and we partner with people whose horizon matches ours. Decks matter less than conversations. If you have these four, we would like to meet you.",
    },
    {
        "slug": "beyond-the-first-cheque", "category": "Partnership", "title": "A Partner Beyond the First Cheque", "read": "3 min",
        "excerpt": "Introductions to our verified investor network, follow-on support, and a relationship measured in years.",
        "body": "The first cheque is the beginning, not the product. As companies mature, they need more than our own capital — so we make introductions to our verified investor network, privately and deliberately. We stay involved through the hard middle: hiring, pricing, systems, the second product, the second city. Our horizon is years, not quarters, because that is how long real companies take. Partnership, for us, is a duration — not a sentiment.",
    },
]


@app.on_event("startup")
async def startup_event():
    try:
        await asyncio.to_thread(init_storage)
        logger.info("Object storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
    if await db.insights.count_documents({}) == 0:
        now = datetime.now(timezone.utc).isoformat()
        await db.insights.insert_many([
            {**a, "insight_id": f"in_{uuid.uuid4().hex[:12]}", "published": True, "created_at": now}
            for a in SEED_INSIGHTS
        ])
        logger.info("Seeded insights articles")


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
