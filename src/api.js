// Talks to the Python backend only. No Supabase, no keys here.

export async function getSpots() {
  const res = await fetch('/api/spots')
  if (!res.ok) throw new Error('Failed to load spots')
  return res.json()
}

export async function createBooking(booking) {
  const res = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  })
  if (!res.ok) throw new Error('Failed to save booking')
  return res.json()
}