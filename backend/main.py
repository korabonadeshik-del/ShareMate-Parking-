"""
ShareMate Parking — Python backend (FastAPI)

This is the ONLY thing that talks to Supabase. The React frontend calls this
API; this API talks to Supabase using the secret service key. The frontend
never sees the key.

    React  ->  this API  ->  Supabase

Endpoints:
    GET  /api/health    -> quick check the server is alive
    GET  /api/spots     -> read the 6 parking spots from Supabase
    POST /api/bookings  -> save a booking the user submitted
    GET  /api/bookings  -> read bookings back (handy for the demo / Table Editor cross-check)

Run locally:
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000
"""

import os
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

# Load SUPABASE_URL and SUPABASE_SERVICE_KEY from a local .env file.
# On Vercel these come from the project's Environment Variables instead.
load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise RuntimeError(
        "Missing SUPABASE_URL or SUPABASE_SERVICE_KEY. "
        "Create a .env file (see .env.example) before running."
    )

# The service key bypasses RLS, so this backend can read/write the locked tables.
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

app = FastAPI(title="ShareMate Parking API")

# Allow the React dev server (and your future Vercel URL) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],     # fine for an assignment; you can list exact origins later
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---- Shape of a booking coming from the frontend -------------------------
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


# ---- Endpoints -----------------------------------------------------------
@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/spots")
def get_spots():
    """Read all parking spots from Supabase, cheapest first."""
    try:
        res = supabase.table("spots").select("*").order("price").execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not load spots: {e}")


@app.post("/api/bookings")
def create_booking(booking: Booking):
    """Save a user-submitted booking into Supabase, return the saved row."""
    try:
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
    """Read bookings back, newest first."""
    try:
        res = supabase.table("bookings").select("*").order("created_at", desc=True).execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not load bookings: {e}")
