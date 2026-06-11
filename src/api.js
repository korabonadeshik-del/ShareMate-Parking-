// Talks to the Python backend only. No Supabase, no keys here.
// In production, set VITE_API_URL to your deployed backend URL.
const BASE = import.meta.env.VITE_API_URL || ''

export async function getSpots() {
  const res = await fetch(`${BASE}/api/spots`)
  if (!res.ok) throw new Error('Failed to load spots')
  return res.json()
}

export async function signup(user) {
  const res = await fetch(`${BASE}/api/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
  if (!res.ok) {
    let msg = 'Failed to sign up'
    try {
      const errBody = await res.json()
      msg = errBody.detail || errBody.message || msg
    } catch (_) {}
    throw new Error(msg)
  }
  return res.json()
}

export async function createBooking(booking) {
  const res = await fetch(`${BASE}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  })
  if (!res.ok) throw new Error('Failed to save booking')
  return res.json()
}