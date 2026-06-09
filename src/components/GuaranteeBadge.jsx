import { ShieldCheck } from 'lucide-react'

export default function GuaranteeBadge() {
  return (
    <div className="guarantee-badge">
      <div className="guarantee-badge__icon">
        <ShieldCheck size={22} strokeWidth={2} />
      </div>
      <div>
        <div className="guarantee-badge__title">Booking Guarantee</div>
        <div className="guarantee-badge__desc">
          Covered if unavailable on arrival — instant refund + 3 nearby alternatives
        </div>
      </div>
    </div>
  )
}
