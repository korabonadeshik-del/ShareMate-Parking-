export default function HostBadge({ host, showResponse = false }) {
  return (
    <div className="host-badge">
      <div className="host-avatar">
        <div className="host-avatar__circle">{host.initials}</div>
        <div className="host-avatar__dot" />
      </div>
      <div>
        <div className="host-info__name">{host.name}</div>
        <div className="host-info__meta">
          Verified Host · {host.rating}★ · {host.bookings} bookings · Hosting since {host.since}
        </div>
        {showResponse && (
          <div className="host-info__response">
            Typically responds in {host.responseTime}
          </div>
        )}
      </div>
    </div>
  )
}
