import { MapPin, Clock, Shield, Umbrella, Zap } from 'lucide-react'
import TopBar from '../components/TopBar'
import HostBadge from '../components/HostBadge'
import GuaranteeBadge from '../components/GuaranteeBadge'
import PricingBadge from '../components/PricingBadge'
import Chip from '../components/Chip'
import PrimaryButton from '../components/PrimaryButton'

const AMENITY_CONFIG = {
  'Secure':     { color: 'green', Icon: Shield },
  'Covered':    { color: 'amber', Icon: Umbrella },
  'EV Charger': { color: 'info',  Icon: Zap },
}

export default function DetailsScreen({ spot, navigate, goBack }) {
  if (!spot) return null

  return (
    <div className="screen">
      <TopBar onBack={goBack} />

      {/* CSS Map placeholder */}
      <div className="map-placeholder">
        <div className="map-grid" />
        {/* Horizontal roads */}
        <div className="map-road-h" style={{ top: '30%' }} />
        <div className="map-road-h" style={{ top: '65%' }} />
        {/* Vertical roads */}
        <div className="map-road-v" style={{ left: '28%' }} />
        <div className="map-road-v" style={{ left: '62%' }} />
        {/* Bouncing pin */}
        <div className="map-pin">
          <div className="map-pin__circle">
            <MapPin size={16} className="map-pin__icon" strokeWidth={2.5} />
          </div>
          <div className="map-pin__shadow" />
        </div>
      </div>

      <div className="screen-content">
        {/* Location label */}
        <div className="location-label">
          <MapPin size={16} strokeWidth={2} style={{ color: 'var(--success)', flexShrink: 0 }} />
          {spot.address}
        </div>

        {/* Spot name */}
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700,
          letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
          {spot.name}
        </div>

        {/* Photo placeholder */}
        <div className="photo-placeholder">
          <div className="photo-placeholder__p">P</div>
        </div>

        {/* Host card */}
        <div className="card" style={{ padding: '14px 16px' }}>
          <HostBadge host={spot.host} showResponse={true} />
        </div>

        {/* Hours */}
        <div className="info-row">
          <Clock size={17} strokeWidth={2} style={{ color: 'var(--brand)', flexShrink: 0 }} />
          <span>Available <strong>{spot.hours}</strong></span>
        </div>

        {/* Smart Pricing */}
        <div className="info-row info-row--large">
          <span className="info-row__price">{spot.price}</span>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 6px' }}>
            / {spot.pricePer}
          </span>
          <PricingBadge type={spot.pricing} />
          <span style={{ fontSize: 13, color: 'var(--text-hint)', marginLeft: 4 }}>rate</span>
        </div>

        {/* Amenity chips */}
        <div className="amenity-chips">
          {spot.amenities.map(a => {
            const cfg = AMENITY_CONFIG[a] || {}
            return (
              <Chip key={a} label={a} icon={cfg.Icon} color={cfg.color} />
            )
          })}
        </div>

        {/* Booking Guarantee */}
        <GuaranteeBadge />

        {/* Cancellation */}
        <p className="cancel-note">Free cancellation up to 1 hour before</p>

        <PrimaryButton onClick={() => navigate('summary')}>
          Reserve Spot
        </PrimaryButton>
      </div>
    </div>
  )
}
