import { useState, useMemo, useRef, useEffect } from 'react'
import { MapPin, Calendar, Clock, SearchX } from 'lucide-react'
import TopBar from '../components/TopBar'
import LiveTicker from '../components/LiveTicker'
import Chip from '../components/Chip'
import ResultCard from '../components/ResultCard'
import ResultCardSkeleton from '../components/ResultCardSkeleton'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'
import { spots as localSpots, FILTER_CHIPS } from '../data'
import { getSpots } from '../api'
// Building heights for Melbourne CSS skyline
const BUILDINGS = [
  { w: 18, h: 28 }, { w: 14, h: 44 }, { w: 20, h: 36 }, { w: 16, h: 56 },
  { w: 22, h: 48 }, { w: 12, h: 32 }, { w: 18, h: 62 }, { w: 14, h: 38 },
  { w: 24, h: 52 }, { w: 16, h: 30 }, { w: 20, h: 46 }, { w: 14, h: 40 },
  { w: 18, h: 34 }, { w: 22, h: 58 }, { w: 16, h: 44 }, { w: 12, h: 26 },
  { w: 20, h: 50 }, { w: 18, h: 36 },
]

export default function SearchScreen({ navigate, goBack }) {
  const [activeFilters, setActiveFilters] = useState([])
  const [isSearching, setIsSearching]     = useState(false)
  const [spots, setSpots]                 = useState(localSpots)
  const timerRef = useRef(null)

  // Load spots from the Python backend; merge with local data so the UI keeps
  // every field it needs. Falls back to local data if the API fails.
  useEffect(() => {
    getSpots()
      .then(apiSpots => {
        const merged = localSpots.map(local => {
          const match = apiSpots.find(a => a.name === local.name)
          return match ? { ...local, pricing: match.pricing, address: match.address } : local
        })
        setSpots(merged)
      })
      .catch(() => setSpots(localSpots))
  }, [])

  // ── Filter logic ──
  const filteredSpots = useMemo(() => {
    if (activeFilters.length === 0) return spots
    return spots.filter(spot =>
      activeFilters.every(f => {
        if (f === 'Under $10') return spot.priceNum < 10
        return spot.amenities.includes(f)
      })
    )
  }, [activeFilters, spots])

  // ── Chip toggle (keyed by label string) ──
  const toggleFilter = (label) =>
    setActiveFilters(f =>
      f.includes(label) ? f.filter(x => x !== label) : [...f, label]
    )

  // ── Search button handler ──
  const handleSearch = () => {
    if (isSearching) return
    clearTimeout(timerRef.current)
    setIsSearching(true)
    timerRef.current = setTimeout(() => setIsSearching(false), 700)
  }

  return (
    <div className="screen">
      <TopBar title="Find Parking" onBack={goBack} />

      {/* Melbourne skyline strip */}
      <div className="skyline-strip">
        <div className="skyline-sun" />
        <div className="skyline-buildings">
          {BUILDINGS.map((b, i) => (
            <div key={i} className="skyline-bld" style={{ width: b.w, height: b.h }} />
          ))}
        </div>
      </div>

      <div className="screen-content">
        {/* Availability banner — glassmorphism */}
        <div className="avail-banner card-glass">
          <div className="avail-dot" />
          <div>
            <div className="avail-text">47 spots available near Melbourne CBD</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <LiveTicker />
          </div>
        </div>

        {/* Search input card */}
        <div className="search-card">
          <div className="search-row">
            <div className="search-row__icon"><MapPin size={18} strokeWidth={2} /></div>
            <div>
              <div className="search-row__label">Location</div>
              <div className="search-row__value">Collins St, CBD</div>
            </div>
          </div>
          <div className="search-row">
            <div className="search-row__icon"><Calendar size={18} strokeWidth={2} /></div>
            <div>
              <div className="search-row__label">Date</div>
              <div className="search-row__value">29 Mar 2026</div>
            </div>
          </div>
          <div className="search-row">
            <div className="search-row__icon"><Clock size={18} strokeWidth={2} /></div>
            <div>
              <div className="search-row__label">Time</div>
              <div className="search-row__value">9 AM – 5 PM</div>
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div className="filter-scroll">
          {FILTER_CHIPS.map(chip => (
            <Chip
              key={chip.id}
              label={chip.label}
              active={activeFilters.includes(chip.label)}
              onClick={() => toggleFilter(chip.label)}
            />
          ))}
        </div>

        <PrimaryButton onClick={handleSearch} disabled={isSearching}>
          {isSearching ? 'Just a sec…' : 'Search'}
        </PrimaryButton>

        {/* Active filter indicator */}
        {activeFilters.length > 0 && (
          <p className="filter-indicator">
            Filtered by: {activeFilters.join(' · ')}
          </p>
        )}

        {/* Results section heading */}
        <div className="section-heading">
          <span className="section-heading__title">Nearby Parking</span>
          <span className="section-heading__label">
            {isSearching ? '' : `${filteredSpots.length} result${filteredSpots.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {/* Results area: skeleton | empty state | cards */}
        {isSearching ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filteredSpots.map((_, i) => (
              <ResultCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredSpots.length === 0 ? (
          <div className="empty-state">
            <SearchX size={36} strokeWidth={1.5} style={{ color: 'var(--text-hint)' }} />
            <p className="empty-state__heading">No spots match</p>
            <p className="empty-state__body">
              Try removing a filter to see more options.
            </p>
            <SecondaryButton onClick={() => setActiveFilters([])}>
              Clear filters
            </SecondaryButton>
          </div>
        ) : (
          <div
            className="stagger-list"
            key={activeFilters.join(',')}
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            {filteredSpots.map(spot => (
              <ResultCard
                key={spot.id}
                spot={spot}
                onClick={() => navigate('details', spot)}
              />
            ))}
          </div>
        )}

        {/* Scarcity nudge — hide when empty or loading */}
        {!isSearching && filteredSpots.length > 0 && (
          <div className="scarcity-nudge">
            <div className="scarcity-nudge__text">
              ✨ Only {filteredSpots.length} spot{filteredSpots.length !== 1 ? 's' : ''} left at these prices for this time slot
            </div>
          </div>
        )}
      </div>
    </div>
  )
}