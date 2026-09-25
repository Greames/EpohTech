"""Backend tests for the EPOHTECH microsite endpoints."""
import os
import time
import pytest
import requests
from pymongo import MongoClient

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # Fallback: read from frontend/.env
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().strip('"').rstrip("/")

MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "test_database"
ADMIN_EMAIL = "tulasi.reddy@theepoh.com"

pytestmark = pytest.mark.usefixtures("admin_session")


@pytest.fixture(scope="session")
def mongo():
    return MongoClient(MONGO_URL)[DB_NAME]


@pytest.fixture(scope="session")
def admin_session(mongo):
    """Create an admin session for testing admin endpoints."""
    token = f"test_session_admin_{int(time.time())}"
    user_id = f"test-admin-{int(time.time())}"
    mongo.users.update_one(
        {"email": ADMIN_EMAIL},
        {"$setOnInsert": {"user_id": user_id, "email": ADMIN_EMAIL, "name": "Admin QA"}},
        upsert=True,
    )
    existing = mongo.users.find_one({"email": ADMIN_EMAIL})
    from datetime import datetime, timedelta, timezone
    mongo.user_sessions.insert_one({
        "user_id": existing["user_id"],
        "session_token": token,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=1),
        "created_at": datetime.now(timezone.utc),
    })
    yield token
    mongo.user_sessions.delete_one({"session_token": token})


# ---------- POST /api/epoh/enquiry ----------

def test_epoh_enquiry_submit_success(mongo):
    payload = {
        "name": "QA Tester Epoh",
        "email": "delivered@resend.dev",
        "phone": "+91 9999999999",
        "interest": "Big Data Engineering Program",
        "message": "TEST_ automated pytest submission",
        "consent": True,
    }
    r = requests.post(f"{BASE_URL}/api/epoh/enquiry", json=payload, timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["status"] == "success"
    assert data["enquiry_id"].startswith("eq_")

    # Verify persistence
    doc = mongo.epoh_enquiries.find_one({"enquiry_id": data["enquiry_id"]})
    assert doc is not None
    assert doc["name"] == "QA Tester Epoh"
    assert doc["interest"] == "Big Data Engineering Program"
    assert doc["consent"] is True


def test_epoh_enquiry_missing_required_fields():
    r = requests.post(f"{BASE_URL}/api/epoh/enquiry", json={"name": "x"}, timeout=15)
    assert r.status_code == 422


def test_epoh_enquiry_invalid_email():
    payload = {"name": "QA", "email": "not-an-email", "message": "hi", "consent": True}
    r = requests.post(f"{BASE_URL}/api/epoh/enquiry", json=payload, timeout=15)
    assert r.status_code == 422


# ---------- GET /api/admin/epoh-enquiries ----------

def test_admin_epoh_enquiries_unauthorized():
    r = requests.get(f"{BASE_URL}/api/admin/epoh-enquiries", timeout=15)
    assert r.status_code in (401, 403), f"Expected 401/403, got {r.status_code}"


def test_admin_epoh_enquiries_authorized(admin_session):
    r = requests.get(
        f"{BASE_URL}/api/admin/epoh-enquiries",
        headers={"Authorization": f"Bearer {admin_session}"},
        timeout=20,
    )
    assert r.status_code == 200, r.text
    data = r.json()
    assert "enquiries" in data
    assert isinstance(data["enquiries"], list)
    # No mongo _id leaks
    for e in data["enquiries"]:
        assert "_id" not in e
    # QA test enquiry should be present
    names = [e.get("name") for e in data["enquiries"]]
    assert "QA Tester Epoh" in names, f"QA test enquiry missing. Names: {names[:10]}"
