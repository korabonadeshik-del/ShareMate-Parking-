"""
ShareMate Parking — Python backend (FastAPI)
Calls Supabase's REST API directly with `requests` (reliable on serverless).
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

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY.")

REST = f"{SUPABASE_URL}/rest/v1"
HEADERS = {
    "apikey": SUPABASE_SERVICE_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
    "Content-Type": "application/json",
}

app = FastAPI(title="ShareMate Parking API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


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
        r = requests.get(
            f"{REST}/spots",
            headers=HEADERS,
            params={"select": "*", "order": "price"},
            timeout=10,
        )
        r.raise_for_status()
        return r.json()