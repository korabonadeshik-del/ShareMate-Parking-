export default function ResultCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-photo" />
      <div className="skeleton-body">
        <div className="skeleton-bar skeleton-bar--wide" />
        <div className="skeleton-bar skeleton-bar--medium" />
        <div style={{ borderTop: '1px solid var(--border-hair)', paddingTop: 10, marginTop: 2 }}>
          <div className="skeleton-bar skeleton-bar--narrow" />
        </div>
      </div>
    </div>
  )
}
