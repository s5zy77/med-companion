import React from 'react';

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card" style={{ padding: 20 }} aria-busy="true" aria-label="Loading content">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div className="pulse" style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--surface2)' }} />
        <div style={{ flex: 1 }}>
          <div className="pulse" style={{ height: 16, width: '60%', borderRadius: 6, background: 'var(--surface2)', marginBottom: 8 }} />
          <div className="pulse" style={{ height: 12, width: '40%', borderRadius: 6, background: 'var(--surface2)' }} />
        </div>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="pulse" style={{ height: 12, width: `${90 - i * 15}%`, borderRadius: 6, background: 'var(--surface2)', marginBottom: 8 }} />
      ))}
    </div>
  );
}

export function SkeletonLine({ width = '100%', height = 14 }) {
  return (
    <div className="pulse" style={{ height, width, borderRadius: 6, background: 'var(--surface2)' }} aria-busy="true" />
  );
}
