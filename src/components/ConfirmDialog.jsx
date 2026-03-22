import React from 'react';
import Icon from './Icon';

export default function ConfirmDialog({ open, title, message, confirmText = 'Delete', cancelText = 'Cancel', onConfirm, onCancel, danger = true }) {
  if (!open) return null;

  return (
    <div className="modal-bg" onClick={onCancel} role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420, textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, background: danger ? '#fef3e8' : 'var(--accent-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Icon name={danger ? 'warn' : 'info'} size={28} className={danger ? 'text-orange-600' : ''} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, fontFamily: 'Lora, serif' }}>{title}</h2>
        <p style={{ color: 'var(--text2)', fontSize: 15, marginBottom: 24, lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', padding: '12px', fontSize: 15, minHeight: 48 }} onClick={onCancel} aria-label={cancelText}>
            {cancelText}
          </button>
          <button
            className="btn"
            style={{
              flex: 1, justifyContent: 'center', padding: '12px', fontSize: 15, minHeight: 48,
              background: danger ? '#dc3545' : 'var(--accent)', color: 'white',
            }}
            onClick={onConfirm}
            aria-label={confirmText}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
