export default function Chip({ label, icon: Icon, color, active = false, onClick }) {
  const colorClass = active
    ? 'chip--active'
    : color === 'green'
    ? 'chip--green'
    : color === 'amber'
    ? 'chip--amber'
    : color === 'info'
    ? 'chip--info'
    : color === 'cyan'
    ? 'chip--cyan'
    : ''

  return (
    <span
      className={`chip ${colorClass}`}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : {}}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {Icon && <Icon size={13} strokeWidth={2} />}
      {label}
    </span>
  )
}
