import { PersonStanding } from 'lucide-react'
import PricingBadge from './PricingBadge'

export default function ResultCard({ spot, onClick }) {
  return (
    <div className="result-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}>
      <div className="result-card__photo">
        <div className="result-card__photo-icon">P</div>
      </div>
      <div className="result-card__body">
        <div className="result-card__row">
          <span className="result-card__name">{spot.name}</span>
          <PricingBadge type={spot.pricing} />
        </div>
        <div className="result-card__meta" style={{ marginBottom: 6 }}>
          <PersonStanding size={14} strokeWidth={2} />
          {spot.distance} away
        </div>
        <div className="result-card__meta">
          <div className="host-avatar" style={{ display: 'inline-flex', position: 'relative', marginRight: 2 }}>
            <div className="host-avatar__circle" style={{ width: 22, height: 22, fontSize: 10 }}>
              {spot.host.initials}
            </div>
            <div className="host-avatar__dot" style={{ width: 7, height: 7 }} />
          </div>
          {spot.host.name} · {spot.host.rating}★ · {spot.host.bookings} bookings
        </div>
        <div className="result-card__price-row">
          <div>
            <span className="result-card__price">{spot.price}</span>
            <span className="result-card__price-per">/ {spot.pricePer}</span>
          </div>
          <span className="result-card__link">view details ›</span>
        </div>
      </div>
    </div>
  )
}
