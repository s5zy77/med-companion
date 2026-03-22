import React from 'react';
import { TAG_COLORS } from '../utils/constants';

export default function Tag({ label, onRemove }) {
  const colors = TAG_COLORS[label] || { bg: 'var(--surface2)', text: 'var(--text2)' };
  return (
    <span className="tag" style={{ background: colors.bg, color: colors.text }} role="status" aria-label={`Tag: ${label}`}>
      {label}
      {onRemove && (
        <button onClick={onRemove} aria-label={`Remove ${label} tag`} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, lineHeight: 1, minWidth: 'auto', minHeight: 'auto' }}>
          ×
        </button>
      )}
    </span>
  );
}
