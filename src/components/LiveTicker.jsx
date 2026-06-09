import { useState, useEffect, useRef } from 'react'
import { TICKER_START } from '../data'

export default function LiveTicker() {
  const [count, setCount] = useState(TICKER_START)
  const [key, setKey] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    function scheduleNext() {
      const delay = 4000 + Math.random() * 2000 // 4–6 seconds
      timerRef.current = setTimeout(() => {
        setCount(c => c + 1)
        setKey(k => k + 1)
        scheduleNext()
      }, delay)
    }
    scheduleNext()
    return () => clearTimeout(timerRef.current)
  }, [])

  return (
    <span className="live-ticker">
      🔥&nbsp;
      <span className="live-ticker__count" key={key}>{count}</span>
      &nbsp;drivers booked today
    </span>
  )
}
