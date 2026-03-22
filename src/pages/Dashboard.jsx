import React from 'react';
import Icon from '../components/Icon';
import Tag from '../components/Tag';

export default function Dashboard({ medicines, setPage, setSelectedMed }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';

  // Find next upcoming reminder
  const currentTime = `${String(hour).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const upcomingReminders = medicines
    .filter((m) => m.reminder?.enabled)
    .flatMap((m) => (m.reminder.times || []).map((t) => ({ med: m, time: t })))
    .filter((r) => r.time >= currentTime)
    .sort((a, b) => a.time.localeCompare(b.time));

  const nextReminder = upcomingReminders[0];
  const nextReminderText = nextReminder ? `${nextReminder.med.name} — ${nextReminder.time}` : 'No upcoming reminders today';

  const stats = [
    { label: 'Medicines', value: medicines.length, icon: 'pill', color: 'var(--accent)' },
    { label: 'Reminders Set', value: medicines.filter((m) => m.reminder?.enabled).length, icon: 'bell', color: '#2a6b9b' },
    { label: 'Tags', value: [...new Set(medicines.flatMap((m) => m.tags || []))].length, icon: 'star', color: '#b85c2a' },
  ];

  return (
    <div className="fade-in page-container">
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 14, color: 'var(--text3)', marginBottom: 4 }}>{dateStr}</div>
        <h1 style={{ fontSize: 32, fontWeight: 600, color: 'var(--text)', marginBottom: 8, fontFamily: "'Lora', serif" }}>
          Good {greeting}, Ramesh 👋
        </h1>
        <p style={{ fontSize: 17, color: 'var(--text2)' }}>Here's your health overview for today.</p>
      </div>

      {/* Reminder Banner */}
      <div style={{ background: 'var(--accent-light)', border: '1.5px solid var(--accent)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
        <div style={{ width: 40, height: 40, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="bell" size={18} />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, marginBottom: 2 }}>⏰ Next Reminder</div>
          <div style={{ fontSize: 16, color: 'var(--text)', fontWeight: 500 }}>{nextReminderText}</div>
        </div>
        <button className="btn btn-primary" style={{ padding: '8px 14px', fontSize: 13, minHeight: 48 }} onClick={() => setPage('reminders')} aria-label="View all reminders">
          View All
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 32 }}>
        {stats.map((s) => (
          <div key={s.label} className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ width: 44, height: 44, background: s.color + '22', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: s.color }}>
              <Icon name={s.icon} size={20} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', fontFamily: 'Lora' }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: 'var(--text)', fontFamily: "'Lora', serif" }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {[
            { id: 'scanner', icon: 'scan', label: 'Scan Medicine', desc: 'Upload or capture a medicine image', color: '#2f6b4f' },
            { id: 'assistant', icon: 'chat', label: 'Ask AI Assistant', desc: 'Get answers in simple language', color: '#2a6b9b' },
            { id: 'prescription', icon: 'upload', label: 'Upload Prescription', desc: 'Extract medicines automatically', color: '#b85c2a' },
            { id: 'reminders', icon: 'bell', label: 'Set Reminders', desc: 'Never miss a dose', color: '#7a4fb5' },
          ].map((a) => (
            <div
              key={a.id}
              className="card interactive-card"
              style={{ padding: '18px 20px', cursor: 'pointer' }}
              onClick={() => setPage(a.id)}
              role="button"
              tabIndex={0}
              aria-label={a.label}
              onKeyDown={(e) => { if (e.key === 'Enter') setPage(a.id); }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, background: a.color + '22', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.color, flexShrink: 0 }}>
                  <Icon name={a.icon} size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>{a.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 1 }}>{a.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Medicines */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', fontFamily: "'Lora', serif" }}>Recent Medicines</h2>
          <button className="btn btn-ghost" style={{ fontSize: 13, minHeight: 48 }} onClick={() => setPage('medicines')} aria-label="View all medicines">View All →</button>
        </div>
        {medicines.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💊</div>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8, fontFamily: "'Lora', serif" }}>No medicines yet</div>
            <p style={{ color: 'var(--text2)', marginBottom: 20 }}>Scan a medicine or add one manually to get started.</p>
            <button className="btn btn-primary" style={{ minHeight: 48, fontSize: 15 }} onClick={() => setPage('scanner')} aria-label="Scan your first medicine">
              <Icon name="scan" size={18} /> Scan Medicine
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {medicines.slice(0, 3).map((m) => (
              <div
                key={m.id}
                className="card interactive-card"
                style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
                onClick={() => { setSelectedMed(m); setPage('medicines'); }}
                role="button"
                tabIndex={0}
                aria-label={`View ${m.name}`}
                onKeyDown={(e) => { if (e.key === 'Enter') { setSelectedMed(m); setPage('medicines'); } }}
              >
                <div style={{ width: 44, height: 44, background: (m.color || '#2f6b4f') + '22', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                  {m.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)', marginBottom: 3 }}>{m.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.use}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flexShrink: 0 }}>
                  {(m.tags || []).slice(0, 2).map((t) => <Tag key={t} label={t} />)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
