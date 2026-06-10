"""
ShareMate Parking — Python backend (FastAPI)
React -> this API -> Supabase. Secret key stays server-side only.
"""

import os
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY.")


# Create a fresh client per request, forcing HTTP/1.1.
# Vercel's serverless environment resets HTTP/2 streams (StreamReset),
# so we tell the underlying httpx client not to use HTTP/2.
from supabase.client import ClientOptions
import httpx

def get_supabase() -> Client:
    client = create_client(
        SUPABASE_URL,
        SUPABASE_SERVICE_KEY,
        options=ClientOptions(httpx_client=httpx.Client(http2=False)),
    )
    return client

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
        supabase = get_supabase()
        res = supabase.table("spots").select("*").order("price").execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not load spots: {e}")


@app.post("/api/bookings")
def create_booking(booking: Booking):
    try:
        supabase = get_supabase()
        res = supabase.table("bookings").insert(booking.model_dump()).execute()
        if not res.data:
            raise HTTPException(status_code=500, detail="Booking was not saved")
        return res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save booking: {e}")


@app.get("/api/bookings")
def list_bookings():
    try:
        supabase = get_supabase()
        res = supabase.table("bookings").select("*").order("created_at", desc=True).execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not load bookings: {e}")