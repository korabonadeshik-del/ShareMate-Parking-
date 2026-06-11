import { useState, useCallback } from 'react'
import { Home, Search, ShieldCheck, Database, Lock, Trash2, AlertTriangle } from 'lucide-react'

import './index.css'

import PhoneFrame from './components/PhoneFrame'
import Modal from './components/Modal'
import PrimaryButton from './components/PrimaryButton'
import SecondaryButton from './components/SecondaryButton'

import WelcomeScreen from './screens/WelcomeScreen'
import SignupScreen from './screens/SignupScreen'
import SearchScreen from './screens/SearchScreen'
import DetailsScreen from './screens/DetailsScreen'
import SummaryScreen from './screens/SummaryScreen'
import ConfirmationScreen from './screens/ConfirmationScreen'

import { alternatives } from './data'

// ── Screen IDs ──
const SCREENS = { WELCOME: 'welcome', SIGNUP: 'signup', SEARCH: 'search', DETAILS: 'details', SUMMARY: 'summary', CONFIRM: 'confirm' }

export default function App() {
  const [screen, setScreen]           = useState(SCREENS.WELCOME)
  const [history, setHistory]         = useState([])
  const [selectedSpot, setSelectedSpot] = useState(null)
  const [activeModal, setActiveModal] = useState(null) // 'howItWorks' | 'arrived' | 'help'

  // ── Navigation ──
  const navigate = useCallback((next, spotData) => {
    setHistory(h => [...h, screen])
    if (spotData) setSelectedSpot(spotData)
    setScreen(next)
  }, [screen])

  const goBack = useCallback(() => {
    setHistory(h => {
      const prev = h[h.length - 1]
      setScreen(prev)
      return h.slice(0, -1)
    })
  }, [])

  const openModal  = useCallback((name) => setActiveModal(name), [])
  const closeModal = useCallback(() => setActiveModal(null), [])

  // ── Active screen ──
  const renderScreen = () => {
    switch (screen) {
      case SCREENS.WELCOME:
        return <WelcomeScreen navigate={navigate} openModal={openModal} />
      case SCREENS.SIGNUP:
        return <SignupScreen navigate={navigate} goBack={goBack} />
      case SCREENS.SEARCH:
        return <SearchScreen navigate={navigate} goBack={goBack} />
      case SCREENS.DETAILS:
        return <DetailsScreen spot={selectedSpot} navigate={navigate} goBack={goBack} />
      case SCREENS.SUMMARY:
        return <SummaryScreen spot={selectedSpot} navigate={navigate} goBack={goBack} />
      case SCREENS.CONFIRM:
        return <ConfirmationScreen spot={selectedSpot} openModal={openModal} />
      default:
        return <WelcomeScreen navigate={navigate} openModal={openModal} />
    }
  }

  return (
    <>
      <PhoneFrame>
        {renderScreen()}
      </PhoneFrame>

      {/* ════════════════════════════════════════
          MODAL — How It Works
      ════════════════════════════════════════ */}
      <Modal isOpen={activeModal === 'howItWorks'} onClose={closeModal}>
        <div className="modal-header">
          <h2 className="modal-title">How ShareMate works</h2>
        </div>
        <div className="modal-body">
          <div className="stagger-list" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="how-step-card">
              <div className="how-step-num">
                <Home size={18} strokeWidth={2} />
              </div>
              <div className="how-step-content">
                <div className="how-step-content__title">Hosts list their unused bays</div>
                <div className="how-step-content__desc">
                  Homeowners and renters earn passive income from driveways and garages sitting empty.
                </div>
              </div>
            </div>
            <div className="how-step-card">
              <div className="how-step-num">
                <Search size={18} strokeWidth={2} />
              </div>
              <div className="how-step-content">
                <div className="how-step-content__title">You search, reserve, and pay in seconds</div>
                <div className="how-step-content__desc">
                  Filter by location, time, price, and features. Instant confirmation, no back-and-forth.
                </div>
              </div>
            </div>
            <div className="how-step-card">
              <div className="how-step-num">
                <ShieldCheck size={18} strokeWidth={2} />
              </div>
              <div className="how-step-content">
                <div className="how-step-content__title">Booking Guarantee covers you, always</div>
                <div className="how-step-content__desc">
                  Spot taken on arrival? Instant refund plus 3 nearby alternatives, no stress.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <PrimaryButton onClick={closeModal}>Got it</PrimaryButton>
        </div>
      </Modal>

      {/* ════════════════════════════════════════
          MODAL — I've Arrived
      ════════════════════════════════════════ */}
      <Modal isOpen={activeModal === 'arrived'} onClose={closeModal}>
        <div className="modal-header">
          <h2 className="modal-title">Welcome to your spot 👋</h2>
        </div>
        <div className="modal-body">
          {selectedSpot && (
            <div className="arrived-code-box">
              <div style={{ fontSize: 12, color: 'var(--text-hint)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Your verification code
              </div>
              <div className="arrived-code-text">{selectedSpot.verifyCode}</div>
              <div style={{ fontSize: 12, color: 'var(--brand-deep)', marginTop: 4 }}>
                Show this at the bay if needed
              </div>
            </div>
          )}
          <p className="arrived-host-note" style={{ marginTop: 12 }}>
            {selectedSpot?.host?.name} has been notified and is ready for you.
          </p>
        </div>
        <div className="modal-footer">
          <PrimaryButton onClick={closeModal}>Got it</PrimaryButton>
        </div>
      </Modal>

      {/* ════════════════════════════════════════
          MODAL — Spot Unavailable / Get Help
      ════════════════════════════════════════ */}
      <Modal isOpen={activeModal === 'help'} onClose={closeModal}>
        <div className="modal-header">
          <h2 className="modal-title">We've got you covered</h2>
        </div>
        <div className="modal-body">
          {/* Refund status */}
          <div className="status-row status-row--success" style={{ marginBottom: 12 }}>
            <ShieldCheck size={17} strokeWidth={2} />
            Refund processing — {selectedSpot?.totalPrice ?? '$15.50'} returned within 1 hour
          </div>

          {/* Alternatives */}
          <div className="section-label">3 spots within 5 mins walk</div>
          <div className="stagger-list" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alternatives.map(alt => (
              <div key={alt.id} className="alt-card">
                <div>
                  <div className="alt-card__name">{alt.name}</div>
                  <div className="alt-card__meta">{alt.walk}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="alt-card__price">{alt.price}</div>
                  <div className="alt-card__per">/ {alt.duration}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Guarantee credit */}
          <div className="status-row status-row--brand" style={{ marginTop: 14 }}>
            <ShieldCheck size={17} strokeWidth={2} />
            Booking Guarantee credit added: {selectedSpot?.totalPrice ?? '$15.50'}
          </div>
        </div>

        <div className="modal-footer" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PrimaryButton onClick={closeModal}>Book an alternative</PrimaryButton>
          <SecondaryButton onClick={closeModal}>Close</SecondaryButton>
        </div>
      </Modal>

      {/* ════════════════════════════════════════
          MODAL — Privacy
      ════════════════════════════════════════ */}
      <Modal isOpen={activeModal === 'privacy'} onClose={closeModal}>
        <div className="modal-header">
          <h2 className="modal-title">Your privacy</h2>
        </div>
        <div className="modal-body">
          <div className="stagger-list" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            <div className="how-step-card">
              <div className="how-step-num">
                <Database size={18} strokeWidth={2} />
              </div>
              <div className="how-step-content">
                <div className="how-step-content__title">What we collect</div>
                <div className="how-step-content__desc">
                  Only your location, booking time window, and payment info — exactly what's needed to complete a reservation. No browsing data, no contacts, no advertising IDs.
                </div>
              </div>
            </div>

            <div className="how-step-card">
              <div className="how-step-num">
                <Lock size={18} strokeWidth={2} />
              </div>
              <div className="how-step-content">
                <div className="how-step-content__title">How we use it</div>
                <div className="how-step-content__desc">
                  Your data is used only to match you with a host and process the booking. We never sell your data or share it with advertisers.
                </div>
              </div>
            </div>

            <div className="how-step-card">
              <div className="how-step-num">
                <Trash2 size={18} strokeWidth={2} />
              </div>
              <div className="how-step-content">
                <div className="how-step-content__title">Your control</div>
                <div className="how-step-content__desc">
                  Delete your booking history at any time from your profile. ShareMate does not retain any data after you complete or cancel a booking.
                </div>
              </div>
            </div>

            <div className="how-step-card">
              <div className="how-step-num" style={{ background: 'var(--warning-tint)', color: 'var(--warning-text)' }}>
                <AlertTriangle size={18} strokeWidth={2} />
              </div>
              <div className="how-step-content">
                <div className="how-step-content__title">Risks</div>
                <div className="how-step-content__desc">
                  No system is perfect. Verified-host badges and the Booking Guarantee are designed to cover the highest-impact failure modes — a host no-showing or a spot being unavailable on arrival.
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className="modal-footer">
          <PrimaryButton onClick={closeModal}>Got it</PrimaryButton>
        </div>
      </Modal>
    </>
  )
}
