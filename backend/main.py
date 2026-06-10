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