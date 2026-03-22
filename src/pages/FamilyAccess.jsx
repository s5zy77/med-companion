import React, { useState } from 'react';
import Icon from '../components/Icon';
import { useToast } from '../components/Toast';

export default function FamilyAccess({ medicines }) {
  const [members, setMembers] = useState([
    { id: 1, name: 'Priya Das', relation: 'Daughter', phone: '+91 98765 43210', access: 'view', avatar: 'P', color: '#7a4fb5' },
    { id: 2, name: 'Suresh Das', relation: 'Son', phone: '+91 87654 32109', access: 'view', avatar: 'S', color: '#2a6b9b' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', relation: '', phone: '' });
  const { addToast } = useToast();

  const addMember = () => {
    if (!newMember.name) return;
    const colors = ['#7a4fb5', '#2a6b9b', '#2f6b4f', '#b85c2a'];
    setMembers((prev) => [...prev, {
      id: Date.now(),
      ...newMember,
      access: 'view',
      avatar: newMember.name[0]?.toUpperCase(),
      color: colors[prev.length % colors.length],
    }]);
    setNewMember({ name: '', relation: '', phone: '' });
    setShowModal(false);
    addToast('Family member added!', 'success');
  };

  const generateShareLink = () => {
    const shareData = medicines.map((m) => ({
      name: m.name,
      category: m.category,
      dosage: m.dosage,
      use: m.use,
      icon: m.icon,
      reminder: m.reminder,
      tags: m.tags,
    }));
    const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
    const url = `${window.location.origin}?shared=${encoded}`;

    // Copy to clipboard
    navigator.clipboard.writeText(url).then(() => {
      addToast('Share link copied to clipboard!', 'success');
    }).catch(() => {
      // Fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      addToast('Share link copied!', 'success');
    });
  };

  return (
    <div className="fade-in page-container" style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, fontFamily: "'Lora', serif" }}>Family Access</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={generateShareLink} style={{ minHeight: 48 }} aria-label="Share medicine list">
            <Icon name="share" size={16} /> Share Link
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ minHeight: 48 }} aria-label="Add family member">
            <Icon name="plus" size={16} /> Add Member
          </button>
        </div>
      </div>
      <p style={{ color: 'var(--text2)', marginBottom: 28, fontSize: 16 }}>Allow family members to monitor your medicines. Share a read-only link.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
        {members.map((m) => (
          <div key={m.id} className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ width: 48, height: 48, background: m.color + '22', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: m.color, flexShrink: 0 }}>{m.avatar}</div>
              <div style={{ flex: 1, minWidth: 150 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{m.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)' }}>{m.relation} · {m.phone}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: 12, padding: '3px 10px', borderRadius: 8, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icon name="shield" size={12} /> Can View
                </span>
                <button className="btn btn-ghost" style={{ padding: '6px 10px', color: '#c9732a', fontSize: 13, minHeight: 48 }} onClick={() => setMembers((prev) => prev.filter((x) => x.id !== m.id))} aria-label={`Remove ${m.name}`}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Medicine Summary */}
      <div className="card" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, fontFamily: "'Lora', serif" }}>📱 Medicine Summary (Family View)</h2>
        {medicines.length === 0 ? (
          <p style={{ color: 'var(--text3)', fontSize: 14 }}>No medicines to share yet.</p>
        ) : (
          <>
            {medicines.slice(0, 5).map((m) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 20 }}>{m.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.dosage}</div>
                </div>
                {m.reminder?.enabled && <span style={{ fontSize: 12, color: 'var(--accent)' }}>⏰ Active</span>}
              </div>
            ))}
            <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text3)' }}>Showing {Math.min(5, medicines.length)} of {medicines.length} medicines</div>
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-bg" onClick={() => setShowModal(false)} role="dialog" aria-modal="true" aria-label="Add family member">
          <div className="modal fade-in" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 20, fontFamily: "'Lora', serif" }}>Add Family Member</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <input placeholder="Full Name" value={newMember.name} onChange={(e) => setNewMember((p) => ({ ...p, name: e.target.value }))} aria-label="Family member name" />
              <input placeholder="Relation (e.g. Son, Daughter)" value={newMember.relation} onChange={(e) => setNewMember((p) => ({ ...p, relation: e.target.value }))} aria-label="Relation" />
              <input placeholder="Phone Number" value={newMember.phone} onChange={(e) => setNewMember((p) => ({ ...p, phone: e.target.value }))} aria-label="Phone number" />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', minHeight: 48 }} onClick={addMember}>Add Member</button>
              <button className="btn btn-outline" onClick={() => setShowModal(false)} style={{ minHeight: 48 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
