/* Skeleton Components for LearnFlow */

export function SkeletonCard() {
  return (
    <div style={{
      borderRadius: 14, overflow: 'hidden',
      border: '1px solid var(--border-color)',
      background: 'var(--bg-card)',
    }}>
      <div className="skeleton" style={{ height: 180 }} />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="skeleton" style={{ height: 14, width: '30%' }} />
        <div className="skeleton" style={{ height: 18, width: '90%' }} />
        <div className="skeleton" style={{ height: 18, width: '70%' }} />
        <div className="skeleton" style={{ height: 12, width: '50%' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <div className="skeleton" style={{ height: 24, width: '20%' }} />
          <div className="skeleton" style={{ height: 36, width: '35%', borderRadius: 8 }} />
        </div>
      </div>
    </div>
  )
}

export function CourseCatalogSkeleton({ count = 6 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 24,
      marginTop: 32,
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function CourseDetailsHeaderSkeleton() {
  return (
    <div style={{
      borderRadius: 14, overflow: 'hidden',
      border: '1px solid var(--border-color)',
      background: 'var(--bg-card)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 0,
    }}>
      <div className="skeleton" style={{ height: 320 }} />
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="skeleton" style={{ height: 14, width: '25%' }} />
        <div className="skeleton" style={{ height: 28, width: '85%' }} />
        <div className="skeleton" style={{ height: 14, width: '40%' }} />
        <div className="skeleton" style={{ height: 100, width: '100%' }} />
      </div>
    </div>
  )
}

export function CoursePlayerSkeleton() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, marginTop: 24,
    }}>
      <div style={{ borderRadius: 14, border: '1px solid var(--border-color)', background: 'var(--bg-card)', padding: 16 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
            <div className="skeleton" style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div className="skeleton" style={{ height: 12, width: '80%' }} />
              <div className="skeleton" style={{ height: 10, width: '50%' }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderRadius: 14, border: '1px solid var(--border-color)', background: 'var(--bg-card)', padding: 16 }}>
        <div className="skeleton" style={{ height: 360, borderRadius: 10 }} />
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="skeleton" style={{ height: 18, width: '60%' }} />
          <div className="skeleton" style={{ height: 14, width: '40%' }} />
        </div>
      </div>
    </div>
  )
}

export function DashboardSkeleton({ count = 4 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 24 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ borderRadius: 14, border: '1px solid var(--border-color)', background: 'var(--bg-card)', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="skeleton" style={{ height: 18, width: '75%' }} />
              <div className="skeleton" style={{ height: 12, width: '40%' }} />
            </div>
            <div className="skeleton" style={{ width: 56, height: 36, borderRadius: 8 }} />
          </div>
          <div className="skeleton" style={{ height: 8, width: '100%', borderRadius: 999 }} />
        </div>
      ))}
    </div>
  )
}
