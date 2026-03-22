import React from 'react';
import Icon from '../components/Icon';

export default function SharedView({ data }) {
  let medicines = [];
  try {
    medicines = JSON.parse(decodeURIComponent(atob(data)));
  } catch {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🔗</div>
          <h1 style={{ fontSize: 24, fontWeight: 600, fontFamily: "'Lora', serif", marginBottom: 12 }}>Invalid Share Link</h1>
          <p style={{ color: 'var(--text2)' }}>This link appears to be broken or expired. Please ask for a new link.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '32px 20px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>M</span>
            </div>
            <span style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: 22, color: 'var(--text)' }}>MedNote</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 600, fontFamily: "'Lora', serif", marginBottom: 8, color: 'var(--text)' }}>
            Medicine List
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 15 }}>
            Shared medicine information • Read-only view
          </p>
          <div style={{ background: 'var(--accent-light)', color: 'var(--accent)', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
            <Icon name="shield" size={14} /> {medicines.length} Medicine{medicines.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Medicine Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {medicines.map((m, i) => (
            <div key={i} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>{m.icon || '💊'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 18, color: 'var(--text)', fontFamily: "'Lora', serif" }}>{m.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text3)' }}>{m.category}</div>
                </div>
                {m.reminder?.enabled && (
                  <span style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: 12, padding: '3px 10px', borderRadius: 8, fontWeight: 500 }}>
                    ⏰ Reminder On
                  </span>
                )}
              </div>

              <div style={{ background: 'var(--surface2)', borderRadius: 8, padding: '12px 14px', marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text3)', marginBottom: 4 }}>DOSAGE</div>
                <div style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.5 }}>{m.dosage}</div>
              </div>

              {m.use && (
                <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 10 }}>
                  {m.use}
                </div>
              )}

              {m.reminder?.enabled && m.reminder.times?.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {m.reminder.times.map((t) => (
                    <span key={t} style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: 13, padding: '3px 10px', borderRadius: 8, fontWeight: 500 }}>⏰ {t}</span>
                  ))}
                </div>
              )}

              {m.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                  {m.tags.map((t) => (
                    <span key={t} style={{ background: 'var(--surface2)', color: 'var(--text2)', fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 32, padding: '20px', color: 'var(--text3)', fontSize: 13 }}>
          Shared via MedNote — AI Medicine Companion
        </div>
      </div>
    </div>
  );
}
