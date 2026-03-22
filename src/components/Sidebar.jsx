import React from 'react';
import Icon from './Icon';
import { SIDEBAR_ITEMS, FONT_SIZES } from '../utils/constants';

export default function Sidebar({ page, setPage, dark, setDark, medicines, open, setOpen, fontSize, setFontSize, highContrast, setHighContrast }) {
  return (
    <aside className={`sidebar flex flex-col ${open ? 'open' : ''}`} role="navigation" aria-label="Sidebar navigation">
      <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>M</span>
          </div>
          <div>
            <div style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>MedNote</div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>Medicine Companion</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 8px', flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', letterSpacing: '0.08em', padding: '4px 8px 8px', textTransform: 'uppercase' }}>Navigation</div>
        {SIDEBAR_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`sidebar-item ${page === item.id ? 'active' : ''}`}
            onClick={() => { setPage(item.id); setOpen(false); }}
            role="button"
            tabIndex={0}
            aria-label={item.label}
            aria-current={page === item.id ? 'page' : undefined}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setPage(item.id); setOpen(false); } }}
          >
            <Icon name={item.icon} size={16} />
            <span style={{ flex: 1, fontSize: 14 }}>{item.label}</span>
            {item.id === 'medicines' && (
              <span style={{ background: 'var(--accent)', color: 'white', borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 600 }}>
                {medicines.length}
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)' }}>
        {/* Font size toggle */}
        <div style={{ padding: '6px 8px', marginBottom: 4 }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="font" size={12} /> Font Size
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {Object.entries(FONT_SIZES).map(([key, val]) => (
              <button
                key={key}
                className={`btn ${fontSize === key ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '4px 8px', fontSize: 11, flex: 1, justifyContent: 'center', minHeight: 32 }}
                onClick={() => setFontSize(key)}
                aria-label={`Set font size to ${val.label}`}
              >
                {val.label === 'Extra Large' ? 'XL' : val.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px' }}>
          <span style={{ fontSize: 13, color: 'var(--text2)' }}>Dark mode</span>
          <button onClick={() => setDark(!dark)} className="btn btn-ghost" style={{ padding: '6px 8px', minHeight: 36 }} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
            <Icon name={dark ? 'sun' : 'moon'} size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px' }}>
          <span style={{ fontSize: 13, color: 'var(--text2)' }}>High contrast</span>
          <button onClick={() => setHighContrast(!highContrast)} className="btn btn-ghost" style={{ padding: '6px 8px', minHeight: 36 }} aria-label="Toggle high contrast mode">
            <Icon name="contrast" size={16} />
          </button>
        </div>

        {/* User info */}
        <div style={{ padding: '8px', background: 'var(--surface2)', borderRadius: 8, marginTop: 8 }}>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 4 }}>Logged in as</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700 }}>R</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Ramesh Das</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>Patient</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
