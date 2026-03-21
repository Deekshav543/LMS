export default function ProgressBar({ percentage }) {
  const pct = Math.min(100, Math.max(0, Number(percentage) || 0))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
        <span>Progress</span>
        <span style={{ color: pct === 100 ? '#059669' : 'var(--brand-primary)', fontWeight: 700 }}>
          {pct.toFixed(0)}%
        </span>
      </div>
      <div className="lf-progress-track">
        <div
          className="lf-progress-fill"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
