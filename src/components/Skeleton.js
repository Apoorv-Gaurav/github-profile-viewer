'use client';

export function SkeletonText({ width = '100%', height = '16px' }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: 'var(--radius-sm)' }}
    />
  );
}

export function SkeletonCircle({ size = '48px' }) {
  return (
    <div
      className="skeleton"
      style={{ width: size, height: size, borderRadius: '50%' }}
    />
  );
}

export function SkeletonProfile() {
  return (
    <div className="skeleton-profile" style={{ padding: '2rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        <SkeletonCircle size="120px" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <SkeletonText width="200px" height="28px" />
          <SkeletonText width="140px" height="18px" />
          <SkeletonText width="100%" height="16px" />
          <SkeletonText width="80%" height="16px" />
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <SkeletonText width="100px" height="16px" />
            <SkeletonText width="100px" height="16px" />
            <SkeletonText width="100px" height="16px" />
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
            <SkeletonText width="80px" height="50px" />
            <SkeletonText width="80px" height="50px" />
            <SkeletonText width="80px" height="50px" />
            <SkeletonText width="80px" height="50px" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonRepoCard() {
  return (
    <div style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
      <SkeletonText width="60%" height="20px" />
      <div style={{ marginTop: '0.75rem' }}>
        <SkeletonText width="100%" height="14px" />
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <SkeletonText width="85%" height="14px" />
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <SkeletonText width="60px" height="14px" />
        <SkeletonText width="50px" height="14px" />
        <SkeletonText width="80px" height="14px" />
      </div>
    </div>
  );
}

export function SkeletonRepoList({ count = 6 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRepoCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonHeatmap() {
  return (
    <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
      <SkeletonText width="250px" height="20px" />
      <div style={{ marginTop: '1rem', display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
        {Array.from({ length: 52 * 7 }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '2px',
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
}
