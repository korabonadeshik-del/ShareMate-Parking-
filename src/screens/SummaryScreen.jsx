import { useState, useRef } from 'react'
import { Shield, Umbrella, Zap, Lock, Calendar, Clock, Timer, Bell } from 'lucide-react'
import TopBar from '../components/TopBar'
import Chip from '../components/Chip'
import PrimaryButton from '../components/PrimaryButton'
import { createBooking } from '../api'

const AMENITY_CONFIG = {
  'Secure':     { color: 'green', Icon: Shield },
  'Covered':    { color: 'amber', Icon: Umbrella },
  'EV Charger': { color: 'info',  Icon: Zap },
}

export default function SummaryScreen({ spot, navigate, goBack }) {
  const [guaranteeOn, setGuaranteeOn] = useState(true)
  const [customerName, setCustomerName] = useState('')
  const savedRef = useRef(false)
  if (!spot) return null

  const hourlyRate = spot.basePrice
  const hours = 3
  const subtotal = hourlyRate * hours
  const guaranteeFee = guaranteeOn ? spot.guaranteeFee : 0
  const total = subtotal + guaranteeFee

  const handleConfirm = () => {
    if (!savedRef.current) {
      savedRef.current = true
      createBooking({
        spot_id: spot.id,
        spot_name: spot.name,
        spot_address: spot.address,
        booking_date: spot.date,
        booking_time: spot.time,
        duration: spot.duration,
        guarantee_added: guaranteeOn,
        total_price: total,
        booking_ref: spot.bookingId,
        customer_name: customerName || null,
      }).catch(err => console.error('Booking save failed:', err))
    }
    navigate('confirm')
  }

  return (
    <div className="screen">
      <TopBar title="Booking Summary" subtitle="Review before you confirm" onBack={goBack} />

      <div className="screen-content stagger-list">

        {/* Spot card */}
        <div className="summary-spot-card">
          <div className="summary-spot-logo">P</div>
          <div className="summary-spot-info">
            <div className="summary-spot-info__name">{spot.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
              {spot.address}
            </div>
            <div className="summary-spot-info__chips">
              {spot.amenities.map(a => {
                const cfg = AMENITY_CONFIG[a] || {}
                return <Chip key={a} label={a} icon={cfg.Icon} color={cfg.color} />
              })}
            </div>
          </div>
        </div>

        {/* Your Booking */}
        <div className="detail-card">
          <div className="detail-card__heading">Your Booking</div>
          <div className="detail-row">
            <span className="detail-row__label"><Calendar size={15} strokeWidth={2} />Date</span>
            <span className="detail-row__value">{spot.date}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row__label"><Clock size={15} strokeWidth={2} />Time</span>
            <span className="detail-row__value">{spot.time}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row__label"><Timer size={15} strokeWidth={2} />Duration</span>
            <span className="detail-row__value">{spot.duration}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row__label"><Bell size={15} strokeWidth={2} />Arrival window</span>
            <span className="detail-row__value" style={{ fontSize: 13 }}>{spot.arrivalWindow}</span>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="detail-card">
          <div className="detail-card__heading">Payment Breakdown</div>
          <div className="detail-row">
            <span className="detail-row__label">Price per hour</span>
            <span className="detail-row__value">${hourlyRate.toFixed(2)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row__label">Duration ({hours} hours)</span>
            <span className="detail-row__value">${subtotal.toFixed(2)}</span>
          </div>
          <div className="detail-row">
            <div className="detail-row__label toggle-row" style={{ gap: 10, flex: 1 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Shield size={15} strokeWidth={2} style={{ color: 'var(--brand)' }} />
                Booking Guarantee
              </span>
              <div
                className={`toggle-switch${guaranteeOn ? '' : ' toggle-switch--off'}`}
                onClick={() => setGuaranteeOn(g => !g)}
                role="switch"
                aria-checked={guaranteeOn}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setGuaranteeOn(g => !g)}
              >
                <div className="toggle-switch__knob" />
              </div>
            </div>
            <span className="detail-row__value">{guaranteeOn ? '+$0.50' : '$0.00'}</span>
          </div>
          <div className="divider" />
          <div className="detail-row detail-row--total">
            <span className="detail-row__label">Total Amount</span>
            <span className="detail-row__value">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Your name */}
        <div className="detail-card">
          <div className="detail-card__heading">Your Details</div>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Your name"
            style={{
              width: '100%', padding: '10px 12px', fontSize: 14,
              border: '1px solid var(--border)', borderRadius: 10,
              background: 'var(--bg-surface)', color: 'var(--text-primary)',
              fontFamily: 'inherit', outline: 'none',
            }}
          />
        </div>

        {/* Payment method */}
        <div className="payment-method-card">
          <div className="visa-logo">VISA</div>
          <span className="payment-number">•••• •••• •••• 1234</span>
          <span className="payment-change">Change ›</span>
        </div>

        {/* Reassurance */}
        <div className="reassurance-row">
          <Lock size={15} strokeWidth={2} style={{ color: 'var(--success)', flexShrink: 0 }} />
          Your payment is secure and encrypted
        </div>

        <PrimaryButton pulse onClick={handleConfirm}>
          Confirm Booking
        </PrimaryButton>
      </div>
    </div>
  )
}