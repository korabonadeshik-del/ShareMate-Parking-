export default function SecondaryButton({ children, onClick, color = 'cyan' }) {
  return (
    <button
      className={`btn-secondary${color === 'coral' ? ' btn-secondary--coral' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
