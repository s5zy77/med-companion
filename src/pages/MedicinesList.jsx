import React, { useState } from 'react';
import Icon from '../components/Icon';
import Tag from '../components/Tag';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';

// ─── Medicine Detail Page ──────────────────────────────────────
function MedicinePage({ med, onUpdate, onDelete, onBack }) {
  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState(med.notes || '');
  const [tagInput, setTagInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { addToast } = useToast();

  const save = () => {
    onUpdate({ ...med, notes });
    setEditing(false);
    addToast('Notes saved!', 'success');
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      onUpdate({ ...med, tags: [...(med.tags || []), tagInput.trim()] });
      setTagInput('');
      addToast(`Tag "${tagInput.trim()}" added`, 'success');
    }
  };

  const removeTag = (t) => {
    onUpdate({ ...med, tags: med.tags.filter((x) => x !== t) });
  };

  return (
    <div className="fade-in page-container" style={{ maxWidth: 760 }}>
      <button className="btn btn-ghost" style={{ marginBottom: 20, fontSize: 14, padding: '6px 10px', minHeight: 48 }} onClick={onBack} aria-label="Back to medicines list">
        <Icon name="back" size={16} /> Back to Medicines
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <div style={{ width: 64, height: 64, background: (med.color || '#2f6b4f') + '22', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, flexShrink: 0 }}>
          {med.icon}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 4, fontFamily: "'Lora', serif" }}>{med.name}</h1>
          <div style={{ fontSize: 14, color: 'var(--text3)' }}>Added: {med.addedDate} · {med.category}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={() => setEditing(!editing)} style={{ padding: '8px 14px', fontSize: 13, minHeight: 48 }} aria-label="Edit medicine">
            <Icon name="edit" size={14} /> Edit
          </button>
          <button className="btn btn-ghost" onClick={() => setShowDeleteConfirm(true)} style={{ padding: '8px 12px', color: '#c9732a', minHeight: 48 }} aria-label="Delete medicine">
            <Icon name="trash" size={14} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontWeight: 600, color: 'var(--accent)', marginBottom: 10, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="info" size={15} /> What is it for?
          </div>
          <div style={{ fontSize: 16, color: 'var(--text)', lineHeight: 1.7 }}>{med.use}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontWeight: 600, color: 'var(--info)', marginBottom: 10, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="clock" size={15} /> Dosage
            </div>
            <div style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.6 }}>{med.dosage}</div>
          </div>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontWeight: 600, color: 'var(--warn)', marginBottom: 10, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="warn" size={15} /> Side Effects
            </div>
            <div style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.6 }}>{med.sideEffects}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontWeight: 600, color: 'var(--warn)', marginBottom: 12, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="warn" size={15} /> Warnings
          </div>
          {(med.warnings || []).map((w, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 15, color: 'var(--text)', lineHeight: 1.5 }}>
              <span style={{ width: 24, height: 24, background: 'var(--warn-light)', color: 'var(--warn)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
              {w}
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text)' }}>🏷️ Tags</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            {(med.tags || []).map((t) => <Tag key={t} label={t} onRemove={() => removeTag(t)} />)}
          </div>
          <input placeholder="Add tag... (press Enter)" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag} style={{ fontSize: 13, padding: '7px 12px' }} aria-label="Add a tag" />
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>📝 Notes</span>
            {editing ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost" style={{ fontSize: 13, padding: '4px 10px', minHeight: 36 }} onClick={() => setEditing(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ fontSize: 13, padding: '4px 10px', minHeight: 36 }} onClick={save}><Icon name="check" size={13} /> Save</button>
              </div>
            ) : (
              <button className="btn btn-ghost" style={{ fontSize: 13, padding: '4px 10px', minHeight: 36 }} onClick={() => setEditing(true)}><Icon name="edit" size={13} /> Edit</button>
            )}
          </div>
          {editing ? (
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Add your personal notes here..." style={{ resize: 'vertical' }} aria-label="Medicine notes" />
          ) : (
            <div style={{ fontSize: 15, color: notes ? 'var(--text)' : 'var(--text3)', lineHeight: 1.7, minHeight: 60, cursor: 'pointer', padding: '8px 0' }} onClick={() => setEditing(true)} role="button" tabIndex={0} aria-label="Click to add notes">
              {notes || 'Click to add notes...'}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Medicine?"
        message={`Are you sure you want to remove "${med.name}" from your medicines? This cannot be undone.`}
        confirmText="Delete"
        onConfirm={() => { onDelete(med.id); addToast(`${med.name} removed`, 'warning'); }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}

// ─── Medicines List ──────────────────────────────────────────
export default function MedicinesList({ medicines, setMedicines, selectedMed, setSelectedMed }) {
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const { addToast } = useToast();
  const allTags = [...new Set(medicines.flatMap((m) => m.tags || []))];
  const filtered = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterTag ? m.tags?.includes(filterTag) : true)
  );

  const updateMed = (updated) => setMedicines((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  const deleteMed = (id) => { setMedicines((prev) => prev.filter((m) => m.id !== id)); setSelectedMed(null); };

  const exportJSON = () => {
    const data = JSON.stringify(medicines, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mednote-medicines-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Medicines exported as JSON!', 'success');
  };

  if (selectedMed) {
    return (
      <MedicinePage
        med={selectedMed}
        onUpdate={(m) => { updateMed(m); setSelectedMed(m); }}
        onDelete={deleteMed}
        onBack={() => setSelectedMed(null)}
      />
    );
  }

  return (
    <div className="fade-in page-container" style={{ maxWidth: 860 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, fontFamily: "'Lora', serif" }}>My Medicines</h1>
          <p style={{ color: 'var(--text2)', fontSize: 16 }}>{medicines.length} medicine{medicines.length !== 1 ? 's' : ''} saved</p>
        </div>
        {medicines.length > 0 && (
          <button className="btn btn-outline" onClick={exportJSON} style={{ minHeight: 48, fontSize: 14 }} aria-label="Export medicines as JSON">
            <Icon name="download" size={16} /> Export JSON
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', marginTop: 16 }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Icon name="search" size={16} className="search-icon" />
          <input placeholder="Search medicines..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 38 }} aria-label="Search medicines" />
        </div>
        <select value={filterTag} onChange={(e) => setFilterTag(e.target.value)} aria-label="Filter by tag">
          <option value="">All Tags</option>
          {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💊</div>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8, fontFamily: "'Lora', serif" }}>No medicines found</div>
          <div style={{ color: 'var(--text2)' }}>Try a different search or scan a new medicine</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
          {filtered.map((m) => (
            <div
              key={m.id}
              className="card slide-in interactive-card"
              style={{ padding: '20px', cursor: 'pointer' }}
              onClick={() => setSelectedMed(m)}
              role="button"
              tabIndex={0}
              aria-label={`View ${m.name}`}
              onKeyDown={(e) => { if (e.key === 'Enter') setSelectedMed(m); }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 48, height: 48, background: (m.color || '#2f6b4f') + '22', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{m.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--text)' }}>{m.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text3)' }}>{m.category}</div>
                </div>
                {m.reminder?.enabled && <span style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: 11, padding: '3px 8px', borderRadius: 8, fontWeight: 600 }}>⏰</span>}
              </div>
              <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {m.use}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(m.tags || []).map((t) => <Tag key={t} label={t} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
