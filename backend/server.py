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
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "Second Salary Capital")
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
OWNER_NOTIFY_EMAIL = os.environ.get("OWNER_NOTIFY_EMAIL") or None

# ---------------- Admin ----------------
ADMIN_EMAILS = {e.strip().lower() for e in os.environ.get("ADMIN_EMAILS", "").split(",") if e.strip()}

# ---------------- Object storage (Emergent) ----------------
STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = "second-salary-capital"
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


@api_router.patch("/admin/founder-applications/{application_id}")
async def admin_update_founder_status(application_id: str, payload: StatusUpdate, request: Request):
    await require_admin(request)
    if payload.status not in FOUNDER_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")
    res = await db.founder_applications.update_one(
        {"application_id": application_id}, {"$set": {"status": payload.status}}
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
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
    res = await db.investor_registrations.update_one(
        {"registration_id": registration_id}, {"$set": {"status": payload.status}}
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Registration not found")
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


SEED_INSIGHTS = [
    {
        "slug": "why-second-salary", "category": "Origin Story", "title": "Why Second Salary?", "read": "4 min",
        "excerpt": "The name is not about a second income. It is the true story of two salaries, gratitude, and a leap into company building.",
        "body": "After college, our founders took their first jobs like everyone else. The first salary went to their parents and to God — gratitude before ambition. The second salary went somewhere unusual: it became seed capital for their own company. That decision, made with one month's pay, is the entire philosophy of Second Salary Capital. You do not need permission, inheritance or a fund behind you to start building. You need conviction and one month's courage. We built this studio so that the next founder gets more than a month's salary behind their leap — they get capital, technology, and a full operating ecosystem.",
    },
    {
        "slug": "how-we-evaluate", "category": "Investment Education", "title": "How We Evaluate Opportunities", "read": "6 min",
        "excerpt": "Market size, founder fit, unit economics and timing — the four questions every venture must answer before capital moves.",
        "body": "Before a single rupee moves, every proposed company passes through defined stages: idea, screen, market research, validation, founder match, business model and capital planning. We ask four questions. Is the market real and measurable? Is the founder the right person — with domain expertise and full-time commitment? Do the unit economics work at small scale before they work at big scale? And why is now the right time? Most ideas fail one of these. That is the point of a studio: kill weak ideas cheaply, and pour shared resources into the ones that survive.",
    },
    {
        "slug": "build-in-public-validation", "category": "Company Building", "title": "What We Learned Validating Ventures", "read": "5 min",
        "excerpt": "Customer conversations beat spreadsheets. Lessons from taking ideas through our validation process.",
        "body": "Every venture in our pipeline goes through structured validation: customer interviews, competitor teardown, pricing tests and market sizing from the bottom up. The consistent lesson: founders fall in love with solutions, but markets only pay for problems. Our validation stage forces the problem first — who hurts, how much, and what they already pay to make it stop. When we cannot find the pain, we do not build. When we find it and the founder can reach it, we move fast: capital, technology and business support arrive together, not sequentially.",
    },
    {
        "slug": "ai-traditional-business", "category": "Technology", "title": "How AI Changes Traditional Businesses", "read": "5 min",
        "excerpt": "Automation is not about replacing people — it is about letting a five-person venture operate like a fifty-person company.",
        "body": "Through EPOHTECH, every venture in our ecosystem gets access to applied AI and automation from day one. The biggest gains are unglamorous: automated follow-ups in sales, intelligent document processing in operations, forecasting in finance, and support systems that answer before a human wakes up. A traditional business with modern tooling does not just move faster — it compounds. Data from every process feeds the next decision. That is the technology dividend we build into every company we create.",
    },
    {
        "slug": "what-we-look-for-founders", "category": "Founder Stories", "title": "What We Look For in a Founder", "read": "4 min",
        "excerpt": "Domain depth, full-time commitment and coachability matter more than a polished pitch deck.",
        "body": "We have reviewed founders with beautiful decks and no customers, and founders with grease on their hands and a waiting list. We choose the second kind. What we look for: real domain expertise earned inside an industry, the willingness to go full-time, the humility to be challenged during validation, and the stamina for a multi-year build. Equity in our ventures is not a fixed formula — it reflects what the founder brings: idea, experience, customers, capital and commitment. Bring more, own more.",
    },
    {
        "slug": "inside-the-ecosystem", "category": "Behind the Scenes", "title": "Inside the Second Salary Ecosystem", "read": "7 min",
        "excerpt": "How founders, investors, EPOHTECH and our operating team fit together to build companies repeatedly.",
        "body": "Second Salary Capital sits at the centre of four forces. Founders bring leadership and execution. Investors — 80+ onboarded today — bring capital and strategic support. EPOHTECH brings technology: software, AI, cloud, ERP and IT operations. And the studio itself brings the operating framework: market research, strategy, legal and CA coordination, marketing, recruitment and business development. Every venture draws from all four. That is what makes it a studio rather than a fund — we do not write cheques and wait. We build, launch, grow, and stay in the trenches through scale and, eventually, liquidity.",
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
