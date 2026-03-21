export default function Spinner({ label = '', size = 20 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{ animation: 'spin 0.75s linear infinite', flexShrink: 0 }}
      >
        <circle
          cx="12" cy="12" r="10"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          opacity="0.25"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {label && <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{label}</span>}
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}
