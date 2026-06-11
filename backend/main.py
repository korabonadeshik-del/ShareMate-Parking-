""""
ShareMate Parking — Python backend (FastAPI)
Calls Supabase's REST API directly with `requests`.
React -> this API -> Supabase. Secret key stays server-side only.
"""

import os
from typing import Optional
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
load_dotenv()
# app must always be defined at import time so Vercel can find it.
app = FastAPI(title="ShareMate Parking API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def _supabase_request(method: str, path: str, **kwargs):
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_KEY")
    if not url or not key:
        raise HTTPException(status_code=500, detail="Server missing Supabase env vars")
    key = key.strip()
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }
    if kwargs.get("_return"):
        headers["Prefer"] = "return=representation"
        kwargs.pop("_return")
    r = requests.request(method, f"{url}/rest/v1{path}", headers=headers, timeout=10, **kwargs)
    r.raise_for_status()
    return r.json()


class SignupBody(BaseModel):
    full_name: str
    email: str
    password: str


class Booking(BaseModel):
    spot_id: str
    spot_name: str
    spot_address: Optional[str] = None
    booking_date: Optional[str] = None
    booking_time: Optional[str] = None
    duration: Optional[str] = None
    guarantee_added: bool = False
    total_price: Optional[float] = None
    booking_ref: Optional[str] = None
    customer_name: Optional[str] = None


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/spots")
def get_spots():
    try:
        return _supabase_request("GET", "/spots", params={"select": "*", "order": "price"})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not load spots: {e}")


@app.post("/api/signup")
def create_user(body: SignupBody):
    supabase_url = os.environ.get("SUPABASE_URL")
    service_key = os.environ.get("SUPABASE_SERVICE_KEY")

    if not supabase_url or not service_key:
        raise HTTPException(status_code=500, detail="Server missing Supabase env vars")

    service_key = service_key.strip()

    print(f"[signup] Attempting to create Supabase Auth user for email: {body.email}")

    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "email": body.email,
        "password": body.password,
        "user_metadata": {
            "full_name": body.full_name,
        },
    }

    try:
        r = requests.post(
            f"{supabase_url}/auth/v1/admin/users",
            headers=headers,
            json=payload,
            timeout=10,
        )

        print(f"[signup] Supabase response status: {r.status_code}")
        print(f"[signup] Supabase response body: {r.text}")

        if not r.ok:
            # Extract the real Supabase error message safely
            try:
                err_body = r.json()
                err_msg = err_body.get("msg") or err_body.get("message") or err_body.get("error_description") or r.text
            except Exception:
                err_msg = r.text or "Supabase returned an error"
            raise HTTPException(status_code=r.status_code, detail=err_msg)

        user_data = r.json()
        print(f"[signup] User created successfully: {user_data.get('id')}")
        return {"message": "Account created successfully. You can now log in.", "user_id": user_data.get("id")}

    except HTTPException:
        raise
    except requests.RequestException as e:
        print(f"[signup] Network error calling Supabase: {e}")
        raise HTTPException(status_code=500, detail=f"Could not reach Supabase: {e}")
    except Exception as e:
        print(f"[signup] Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=f"Unexpected error during signup: {e}")


@app.post("/api/bookings")
def create_booking(booking: Booking):
    try:
        data = _supabase_request("POST", "/bookings", json=booking.model_dump(), _return=True)
        if not data:
            raise HTTPException(status_code=500, detail="Booking was not saved")
        return data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save booking: {e}")


@app.get("/api/bookings")
def list_bookings():
    try:
        return _supabase_request("GET", "/bookings", params={"select": "*", "order": "created_at.desc"})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not load bookings: {e}")
