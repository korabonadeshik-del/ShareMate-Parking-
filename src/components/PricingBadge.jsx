import { TrendingDown, TrendingUp } from 'lucide-react'

export default function PricingBadge({ type }) {
  const isOffPeak = type === 'Off-peak'
  return (
    <span className={`pricing-badge ${isOffPeak ? 'pricing-badge--off-peak' : 'pricing-badge--high-demand'}`}>
      {isOffPeak
        ? <TrendingDown size={11} strokeWidth={2} />
        : <TrendingUp size={11} strokeWidth={2} />
      }
      {type}
    </span>
  )
}
