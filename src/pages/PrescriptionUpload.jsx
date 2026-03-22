import React, { useState, useRef } from 'react';
import Icon from '../components/Icon';
import { useToast } from '../components/Toast';
import { scanPrescription, fileToBase64 } from '../utils/api';

export default function PrescriptionUpload({ setMedicines, setPage }) {
  const [stage, setStage] = useState('idle');
  const [extracted, setExtracted] = useState([]);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileRef = useRef();
  const { addToast } = useToast();

  const processImage = async (file) => {
    try {
      setStage('scanning');
      setError(null);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      const { base64, mimeType } = await fileToBase64(file);

      const data = await scanPrescription(base64, mimeType);

      if (data.error) {
        throw new Error(data.error);
      }

      const meds = data.medicines || [];
      if (meds.length === 0) {
        throw new Error('No medicines were found in this prescription. Please try a clearer image.');
      }

      // Ensure each medicine has required fields
      const processed = meds.map((m) => ({
        name: m.name || 'Unknown Medicine',
        category: m.category || 'General',
        use: m.use || 'As prescribed by doctor.',
        dosage: m.dosage || "Follow doctor's instructions.",
        warnings: m.warnings || ['Consult your doctor.'],
        sideEffects: m.sideEffects || 'Consult your doctor.',
        icon: m.icon || '💊',
        color: m.color || '#2f6b4f',
        tags: [m.category || 'Prescription'],
      }));

      setExtracted(processed);
      setSelected(processed.map((_, i) => i));
      setStage('result');
      addToast(`Found ${processed.length} medicine(s) in prescription!`, 'success');
    } catch (err) {
      console.error('Prescription error:', err);
      setError(err.message);
      setStage('error');
      addToast('Failed to read prescription.', 'error');
    }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const addSelected = () => {
    const toAdd = extracted
      .filter((_, i) => selected.includes(i))
      .map((m) => ({
        id: Date.now() + Math.random(),
        ...m,
        notes: 'Added from prescription.',
        reminder: { enabled: false, times: ['08:00'] },
        addedDate: new Date().toISOString().split('T')[0],
      }));

    setMedicines((prev) => {
      const existNames = prev.map((x) => x.name.toLowerCase());
      const newMeds = toAdd.filter((m) => !existNames.includes(m.name.toLowerCase()));
      return [...prev, ...newMeds];
    });
    setPage('medicines');
    addToast(`Added ${toAdd.length} medicine(s) from prescription!`, 'success');
  };

  const reset = () => {
    setStage('idle');
    setExtracted([]);
    setSelected([]);
    setError(null);
    setPreviewUrl(null);
  };

  return (
    <div className="fade-in page-container" style={{ maxWidth: 680 }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 6, fontFamily: "'Lora', serif" }}>Upload Prescription</h1>
      <p style={{ color: 'var(--text2)', marginBottom: 28, fontSize: 16 }}>Scan your doctor's prescription to automatically add medicines.</p>

      {stage === 'idle' && (
        <div className="upload-zone" onClick={() => fileRef.current.click()} role="button" tabIndex={0} aria-label="Upload prescription" onKeyDown={(e) => { if (e.key === 'Enter') fileRef.current.click(); }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>📋</div>
          <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Upload Prescription</div>
          <div style={{ color: 'var(--text2)', marginBottom: 20 }}>A photo or scanned image of your doctor's prescription</div>
          <button className="btn btn-primary" style={{ fontSize: 16, padding: '12px 28px', minHeight: 48 }}>
            <Icon name="upload" size={18} /> Choose File
          </button>
          <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleFile} aria-label="Choose prescription file" />
        </div>
      )}

      {stage === 'scanning' && (
        <div className="card fade-in" style={{ padding: '48px 32px', textAlign: 'center' }}>
          {previewUrl && <img src={previewUrl} alt="Prescription being analyzed" style={{ maxWidth: 280, maxHeight: 200, objectFit: 'contain', borderRadius: 12, marginBottom: 24, border: '1px solid var(--border)' }} />}
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
          <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>Reading Prescription...</div>
          <div style={{ color: 'var(--text2)', marginBottom: 24 }}>AI is analyzing your prescription to extract medicine details</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} className="pulse" style={{ width: 10, height: 10, background: 'var(--accent)', borderRadius: '50%', animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      )}

      {stage === 'error' && (
        <div className="card fade-in" style={{ padding: '40px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>😔</div>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8, fontFamily: "'Lora', serif" }}>Couldn't read prescription</div>
          <p style={{ color: 'var(--text2)', marginBottom: 24 }}>{error}</p>
          <button className="btn btn-primary" style={{ minHeight: 48, fontSize: 15 }} onClick={reset}>
            Try Again
          </button>
        </div>
      )}

      {stage === 'result' && (
        <div className="fade-in">
          <div style={{ background: 'var(--accent-light)', border: '1.5px solid var(--accent)', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="check" size={18} />
            <span style={{ fontWeight: 600, color: 'var(--accent)' }}>Found {extracted.length} medicine{extracted.length !== 1 ? 's' : ''} in your prescription</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {extracted.map((m, i) => (
              <div
                key={i}
                className="card"
                style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', border: selected.includes(i) ? '2px solid var(--accent)' : '1px solid var(--border)' }}
                onClick={() => setSelected((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))}
                role="checkbox"
                aria-checked={selected.includes(i)}
                tabIndex={0}
                aria-label={`Select ${m.name}`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i])); } }}
              >
                <div style={{ width: 40, height: 40, background: (m.color || '#2f6b4f') + '22', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{m.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{m.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.use}</div>
                </div>
                <div style={{ width: 24, height: 24, borderRadius: 6, border: `2px solid ${selected.includes(i) ? 'var(--accent)' : 'var(--border)'}`, background: selected.includes(i) ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {selected.includes(i) && <Icon name="check" size={14} />}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 16, padding: '14px', minHeight: 48 }} onClick={addSelected} disabled={selected.length === 0} aria-label={`Add ${selected.length} medicine(s)`}>
              <Icon name="plus" size={18} /> Add {selected.length} Medicine{selected.length !== 1 ? 's' : ''}
            </button>
            <button className="btn btn-outline" onClick={reset} style={{ minHeight: 48 }}>Try Again</button>
          </div>
        </div>
      )}
    </div>
  );
}
