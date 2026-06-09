# ShareMate Parking — React MVP

A polished, clickable React prototype demonstrating the end-to-end booking journey for ShareMate Parking, a peer-to-peer parking marketplace for Melbourne.

---

## Setup

```bash
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## Screen Flow

```
Welcome ──────────────────────────────────────────────────────────
  │  "Login" or "Sign up"         → Search Parking
  │  "How it works →"             → opens How It Works modal
  └─────────────────────────────────────────────────────────────

Search Parking ────────────────────────────────────────────────────
  │  Tap any result card          → Parking Details
  └─────────────────────────────────────────────────────────────

Parking Details ───────────────────────────────────────────────────
  │  "Reserve Spot"               → Booking Summary
  └─────────────────────────────────────────────────────────────

Booking Summary ───────────────────────────────────────────────────
  │  Toggle Booking Guarantee on/off (updates total live)
  │  "Confirm Booking" (pulsing)  → Booking Confirmation
  └─────────────────────────────────────────────────────────────

Booking Confirmation ──────────────────────────────────────────────
  │  Confetti burst on mount
  │  "I've Arrived"               → opens Arrived modal
  │  "Spot Unavailable — Get Help"→ opens Help modal (3 alternatives + refund)
  │  "Share Booking"              → native share / clipboard fallback
  └─────────────────────────────────────────────────────────────
```

Back navigation is available on every screen except Welcome, via the top-left arrow.

---

## Three Modals

| Modal | Trigger | Content |
|---|---|---|
| How it works | Welcome → "How it works →" | 3 numbered step cards (list, search, guarantee) |
| I've Arrived | Confirmation → "I've Arrived" | Verification code + host notification line |
| Spot Unavailable — Get Help | Confirmation → "Spot Unavailable — Get Help" | Instant refund status + 3 nearby alternatives + Guarantee credit |

---

## Tech Stack

| Concern | Choice |
|---|---|
| Bundler | Vite 5 |
| Framework | React 18 (JavaScript, functional components + hooks) |
| Icons | lucide-react (stroke-width 2, consistent sizing) |
| Styling | Plain global CSS with custom properties (`src/index.css`) |
| Animations | CSS keyframes only — no animation libraries |
| Fonts | Plus Jakarta Sans (display), Inter (body), JetBrains Mono (code) — Google Fonts |
| Router | None — single `useState` screen machine in `App.jsx` |
| Backend / API | None — all data mocked in `src/data.js` |

---

## File Structure

```
src/
├── App.jsx                  screen state machine + modal rendering
├── main.jsx                 Vite entry point
├── data.js                  mock spots, host info, alternatives, ticker constant
├── index.css                design tokens (CSS vars) + keyframes + all styles
├── components/
│   ├── PhoneFrame.jsx       390×844 device shell
│   ├── TopBar.jsx           sticky nav bar with optional back arrow
│   ├── PrimaryButton.jsx    cyan filled button with ripple + optional pulse
│   ├── SecondaryButton.jsx  outlined cyan or coral button
│   ├── Chip.jsx             pill chip (filter / amenity variants)
│   ├── HostBadge.jsx        avatar + online dot + host stats
│   ├── GuaranteeBadge.jsx   shield-check card with cyan glow
│   ├── PricingBadge.jsx     Off-peak (green) / High demand (amber) pill
│   ├── ResultCard.jsx       clickable parking result card
│   ├── LiveTicker.jsx       coral counter that increments every 4–6 s
│   ├── Confetti.jsx         24-piece CSS confetti burst on mount
│   └── Modal.jsx            bottom-sheet modal wrapper
└── screens/
    ├── WelcomeScreen.jsx
    ├── SearchScreen.jsx
    ├── DetailsScreen.jsx
    ├── SummaryScreen.jsx
    └── ConfirmationScreen.jsx
```

---

## Key Design Decisions

- **Warm cyan + coral palette** on a warm paper background (`#FAFAF9`) — friendly, never corporate.
- **Glassmorphism** used exactly twice (availability banner, confirmation details card) to highlight key surfaces.
- **Booking Guarantee** surfaces on three screens (Details badge, Summary toggle, Help modal) to reinforce the differentiator visually.
- **Live ticker** increments every 4–6 seconds with a smooth digit-roll animation — creates urgency without feeling fake.
- **Pulsing Confirm button** draws the eye to the primary CTA on the Summary screen with a 2.5 s cyan glow loop.
- **Staggered mount animations** on list screens give a polished "alive" feel with pure CSS nth-child delays.
- All tap targets are ≥ 44 px; focus rings are 2 px cyan `#06B6D4` at 3 px offset for WCAG AA compliance.
