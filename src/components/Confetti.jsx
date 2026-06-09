import { useMemo } from 'react'

const COLORS = ['#06B6D4', '#F97373', '#16C098', '#F59E0B', '#0891B2', '#E55A5A']
const SHAPES = ['2px', '50%', '4px']

export default function Confetti() {
  const pieces = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 400}ms`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      radius: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      width: `${6 + Math.random() * 6}px`,
      height: `${6 + Math.random() * 6}px`,
      duration: `${700 + Math.random() * 300}ms`,
    }))
  }, [])

  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            background: p.color,
            borderRadius: p.radius,
            width: p.width,
            height: p.height,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  )
}
