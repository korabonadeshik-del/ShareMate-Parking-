import { useCallback } from 'react'

export default function PrimaryButton({ children, onClick, pulse = false, disabled = false }) {
  const handleClick = useCallback((e) => {
    // Ripple effect
    const btn = e.currentTarget
    const ripple = document.createElement('span')
    ripple.className = 'ripple-effect'
    const rect = btn.getBoundingClientRect()
    ripple.style.left = `${e.clientX - rect.left}px`
    ripple.style.top = `${e.clientY - rect.top}px`
    btn.appendChild(ripple)
    setTimeout(() => ripple.remove(), 520)

    if (onClick) onClick(e)
  }, [onClick])

  return (
    <button
      className={`btn-primary${pulse ? ' btn-primary--pulse' : ''}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
