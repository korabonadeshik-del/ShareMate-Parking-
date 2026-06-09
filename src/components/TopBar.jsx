import { ChevronLeft } from 'lucide-react'

export default function TopBar({ title, subtitle, onBack }) {
  return (
    <div className="top-bar">
      {onBack && (
        <button className="top-bar__back" onClick={onBack} aria-label="Go back">
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
      )}
      {(title || subtitle) && (
        <div className="top-bar__titles">
          {title && <div className="top-bar__title">{title}</div>}
          {subtitle && <div className="top-bar__subtitle">{subtitle}</div>}
        </div>
      )}
    </div>
  )
}
