import { Check, CheckCircle, Shield, Share2 } from 'lucide-react'
import Confetti from '../components/Confetti'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'

export default function ConfirmationScreen({ spot, openModal }) {
  if (!spot) return null

  const handleShare = () => {
    const text = `I just booked ${spot.name} on ShareMate Parking!\n` +
      `📍 ${spot.address}\n` +
      `📅 ${spot.date} · ${spot.time}\n` +
      `🔑 Booking ID: ${spot.bookingId}`

    if (navigator.share) {
      navigator.share({ title: 'ShareMate Booking', text }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert('Booking details copied to clipboard!')
      }).catch(() => {})
    }
  }

  return (
    <div className="screen" style={{ background: 'var(--bg-surface)', position: 'relative' }}>
      <Confetti />

      {/* Hero section */}
      <div className="confirm-hero">
        <div className="check-badge">
          <Check size={38} strokeWidth={3} />
        </div>
        <h1 className="confirm-title" style={{ marginTop: 20 }}>You're sorted! ✨</h1>
        <p className="confirm-subtitle">Your parking is reserved and waiting.</p>
      </div>

      <div className="screen-content stagger-list" style={{ paddingTop: 4 }}>

        {/* Booking details glassmorphism card */}
        <div className="card-glass booking-details-glass">
          <div className="booking-detail-row">
            <span className="booking-detail-row__label">Date</span>
            <span className="booking-detail-row__value">{spot.date}</span>
          </div>
          <div className="booking-detail-row">
            <span className="booking-detail-row__label">Duration</span>
            <span className="booking-detail-row__value">{spot.duration}</span>
          </div>
          <div className="booking-detail-row">
            <span className="booking-detail-row__label">Booking ID</span>
            <span className="booking-detail-row__value" style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
              {spot.bookingId}
            </span>
          </div>

          {/* Verification code box */}
          <div className="verify-code-box">
            <div className="verify-code-label">Show this code at the bay</div>
            <div className="verify-code-value">{spot.verifyCode}</div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="action-buttons">
          <PrimaryButton onClick={() => openModal('arrived')}>
            <CheckCircle size={18} strokeWidth={2} />
            I've Arrived
          </PrimaryButton>

          <SecondaryButton color="coral" onClick={() => openModal('help')}>
            Spot Unavailable — Get Help
          </SecondaryButton>

          <SecondaryButton color="cyan" onClick={handleShare}>
            <Share2 size={17} strokeWidth={2} />
            Share Booking
          </SecondaryButton>
        </div>
      </div>
    </div>
  )
}
