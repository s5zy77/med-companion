import React, { useState } from 'react';
import Icon from '../components/Icon';
import { useToast } from '../components/Toast';

export default function Reminders({ medicines, setMedicines }) {
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tempTimes, setTempTimes] = useState([]);
  const { addToast } = useToast();

  const openEdit = (med) => {
    setSelected(med);
    setTempTimes([...(med.reminder?.times || ['08:00'])]);
    setShowModal(true);
  };

  const saveReminder = () => {
    setMedicines((prev) => prev.map((m) => (m.id === selected.id ? { ...m, reminder: { enabled: true, times: tempTimes } } : m)));
    setShowModal(false);
    addToast(`Reminder set for ${selected.name}!`, 'success');

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const toggleReminder = (id) => {
    setMedicines((prev) => prev.map((m) => {
      if (m.id !== id) return m;
      const newEnabled = !m.reminder?.enabled;
      if (newEnabled && 'Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
      return { ...m, reminder: { ...m.reminder, enabled: newEnabled } };
    }));
  };

  const upcomingTimes = medicines
    .filter((m) => m.reminder?.enabled)
    .flatMap((m) => (m.reminder.times || []).map((t) => ({ med: m, time: t })))
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="fade-in page-container" style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 6, fontFamily: "'Lora', serif" }}>Medicine Reminders</h1>
      <p style={{ color: 'var(--text2)', marginBottom: 28, fontSize: 16 }}>Never miss a dose. Set up alerts for your medicines.</p>

      {/* Browser notification status */}
      {'Notification' in window && (
        <div style={{
          background: Notification.permission === 'granted' ? '#d4edda' : Notification.permission === 'denied' ? '#f8d7da' : 'var(--warn-light)',
          border: `1.5px solid ${Notification.permission === 'granted' ? '#28a745' : Notification.permission === 'denied' ? '#dc3545' : 'var(--warn)'}`,
          borderRadius: 10, padding: '10px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, fontSize: 14
        }}>
          <span>{Notification.permission === 'granted' ? '🔔' : Notification.permission === 'denied' ? '🔕' : '⚠️'}</span>
          <span style={{ flex: 1, color: 'var(--text)' }}>
            {Notification.permission === 'granted'
              ? 'Browser notifications are enabled!'
              : Notification.permission === 'denied'
                ? 'Notifications are blocked. Please enable them in your browser settings.'
                : 'Enable notifications to get medicine reminders.'}
          </span>
          {Notification.permission === 'default' && (
            <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: 13, minHeight: 36 }} onClick={() => Notification.requestPermission()}>
              Enable
            </button>
          )}
        </div>
      )}

      {upcomingTimes.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14, color: 'var(--text)', fontFamily: "'Lora', serif" }}>📅 Today's Schedule</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {upcomingTimes.map(({ med, time }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--accent-light)', border: '1.5px solid var(--accent)', borderRadius: 12, padding: '14px 18px' }}>
                <div style={{ fontSize: 22 }}>{med.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text)' }}>{med.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text2)' }}>{med.dosage?.split('.')[0]}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)', fontFamily: 'Lora' }}>{time}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>Today</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14, color: 'var(--text)', fontFamily: "'Lora', serif" }}>💊 Manage Reminders</h2>

      {medicines.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⏰</div>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8, fontFamily: "'Lora', serif" }}>No medicines to remind</div>
          <p style={{ color: 'var(--text2)' }}>Add medicines first, then set reminders here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {medicines.map((m) => (
            <div key={m.id} className="reminder-card" role="group" aria-label={`Reminder for ${m.name}`}>
              <div style={{ fontSize: 24 }}>{m.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 3 }}>{m.name}</div>
                {m.reminder?.enabled && m.reminder.times?.length > 0 ? (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {m.reminder.times.map((t) => (
                      <span key={t} style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: 13, padding: '2px 10px', borderRadius: 8, fontWeight: 500 }}>⏰ {t}</span>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: 'var(--text3)' }}>No reminder set</div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button className="btn btn-outline" style={{ fontSize: 13, padding: '7px 14px', minHeight: 48 }} onClick={() => openEdit(m)} aria-label={`Set reminder time for ${m.name}`}>
                  <Icon name="clock" size={14} /> Set Time
                </button>
                <div
                  onClick={() => toggleReminder(m.id)}
                  role="switch"
                  aria-checked={m.reminder?.enabled || false}
                  aria-label={`Toggle reminder for ${m.name}`}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleReminder(m.id); } }}
                  style={{ width: 44, height: 24, borderRadius: 12, background: m.reminder?.enabled ? 'var(--accent)' : 'var(--border)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}
                >
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: m.reminder?.enabled ? 22 : 2, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selected && (
        <div className="modal-bg" onClick={() => setShowModal(false)} role="dialog" aria-modal="true" aria-label="Set reminder times">
          <div className="modal fade-in" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6, fontFamily: "'Lora', serif" }}>Set Reminder Times</h2>
            <div style={{ fontSize: 15, color: 'var(--text2)', marginBottom: 20 }}>{selected.name}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {tempTimes.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input type="time" value={t} onChange={(e) => { const tt = [...tempTimes]; tt[i] = e.target.value; setTempTimes(tt); }} style={{ flex: 1 }} aria-label={`Reminder time ${i + 1}`} />
                  <button className="btn btn-ghost" style={{ padding: '8px 10px', color: '#c9732a', minHeight: 48 }} onClick={() => setTempTimes((prev) => prev.filter((_, j) => j !== i))} aria-label="Remove this time">
                    <Icon name="x" size={16} />
                  </button>
                </div>
              ))}
              <button className="btn btn-outline" onClick={() => setTempTimes((prev) => [...prev, '08:00'])} style={{ justifyContent: 'center', minHeight: 48 }} aria-label="Add another reminder time">
                <Icon name="plus" size={16} /> Add Time
              </button>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', minHeight: 48 }} onClick={saveReminder}>Save Reminders</button>
              <button className="btn btn-outline" onClick={() => setShowModal(false)} style={{ minHeight: 48 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
