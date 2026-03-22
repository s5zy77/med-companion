import React, { useState, useRef } from 'react';
import Icon from '../components/Icon';
import { SkeletonCard } from '../components/Skeleton';
import { useToast } from '../components/Toast';
import { scanMedicine, fileToBase64 } from '../utils/api';

export default function Scanner({ medicines, setMedicines, setPage, setSelectedMed }) {
  const [stage, setStage] = useState('idle'); // idle, scanning, result, error
  const [result, setResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [manualName, setManualName] = useState('');
  const fileRef = useRef();
  const { addToast } = useToast();

  const processImage = async (file) => {
    try {
      setStage('scanning');
      setError(null);
      const { base64, mimeType } = await fileToBase64(file);
      const previewURL = URL.createObjectURL(file);
      setPreviewUrl(previewURL);

      const data = await scanMedicine(base64, mimeType);

      if (data.error || data.raw) {
        throw new Error(data.error || 'Could not identify the medicine. Please try again.');
      }

      // Ensure result has required fields
      const result = {
        name: data.name || 'Unknown Medicine',
        category: data.category || 'General',
        use: data.use || 'No description available.',
        dosage: data.dosage || 'Follow doctor\'s instructions.',
        warnings: data.warnings || ['Consult your doctor before use.'],
        sideEffects: data.sideEffects || 'Consult your doctor.',
        icon: data.icon || '💊',
        color: data.color || '#2f6b4f',
        tags: data.tags || [data.category || 'General'],
      };

      setResult(result);
      setStage('result');
      addToast('Medicine identified successfully!', 'success');
    } catch (err) {
      console.error('Scan error:', err);
      setError(err.message);
      setStage('error');
      addToast('Failed to scan medicine. Try again.', 'error');

      // Try Tesseract.js fallback
      tryTesseractFallback(file);
    }
  };

  const tryTesseractFallback = async (file) => {
    try {
      addToast('Trying OCR fallback...', 'info');
      const Tesseract = await import('tesseract.js');
      const { data } = await Tesseract.recognize(file, 'eng');
      if (data.text.trim()) {
        const extractedText = data.text.trim();
        setManualName(extractedText.split('\n')[0]);
        setStage('idle');
        addToast('Text extracted! Review and search.', 'warning');
      }
    } catch {
      // Tesseract also failed, stay on error state
    }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processImage(file);
  };

  const handleManualSearch = async () => {
    if (!manualName.trim()) return;
    setStage('scanning');
    setPreviewUrl(null);
    try {
      // Use chat endpoint for manual search
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            text: `Give me information about the medicine "${manualName}". Return ONLY a JSON object with these fields: name (medicine name with dosage), category, use (simple explanation for elderly patients, 2-3 sentences), dosage (how to take it, 1-2 sentences), warnings (array of 3 warning strings), sideEffects (1 sentence), icon (single emoji), color (hex color code for the category). Return ONLY the JSON, no code blocks.`
          }]
        }),
      });
      const text = await response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        setResult({
          name: data.name || manualName,
          category: data.category || 'General',
          use: data.use || 'No description available.',
          dosage: data.dosage || "Follow doctor's instructions.",
          warnings: data.warnings || ['Consult your doctor before use.'],
          sideEffects: data.sideEffects || 'Consult your doctor.',
          icon: data.icon || '💊',
          color: data.color || '#2f6b4f',
          tags: [data.category || 'General'],
        });
        setStage('result');
        addToast('Medicine found!', 'success');
      } else {
        throw new Error('Could not parse response');
      }
    } catch (err) {
      setError('Could not find information. Please check the spelling.');
      setStage('error');
      addToast('Search failed. Try again.', 'error');
    }
  };

  const addMedicine = () => {
    if (!result) return;
    const newMed = {
      id: Date.now(),
      ...result,
      notes: '',
      reminder: { enabled: false, times: ['08:00'] },
      addedDate: new Date().toISOString().split('T')[0],
    };
    setMedicines((prev) => [...prev, newMed]);
    setSelectedMed(newMed);
    setPage('medicines');
    addToast(`${result.name} added to your medicines!`, 'success');
  };

  const reset = () => {
    setStage('idle');
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setManualName('');
  };

  return (
    <div className="fade-in page-container" style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8, fontFamily: "'Lora', serif" }}>Medicine Scanner</h1>
      <p style={{ color: 'var(--text2)', marginBottom: 32, fontSize: 16 }}>Upload a photo of your medicine and we'll explain it in simple words.</p>

      {stage === 'idle' && (
        <>
          <div className="upload-zone" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileRef.current.click()} role="button" tabIndex={0} aria-label="Upload medicine photo" onKeyDown={(e) => { if (e.key === 'Enter') fileRef.current.click(); }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📷</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Upload Medicine Photo</div>
            <div style={{ fontSize: 15, color: 'var(--text2)', marginBottom: 20 }}>Drag & drop or click to select. Supports JPG, PNG</div>
            <button className="btn btn-primary" style={{ fontSize: 16, padding: '12px 24px', minHeight: 48 }}>
              <Icon name="camera" size={18} /> Choose Photo
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} aria-label="Choose medicine photo" />
          </div>

          <div style={{ textAlign: 'center', margin: '20px 0', color: 'var(--text3)', fontSize: 14 }}>— or type medicine name directly —</div>

          <div style={{ display: 'flex', gap: 12 }}>
            <input
              placeholder="e.g. Metformin, Amlodipine, Paracetamol..."
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && manualName) handleManualSearch(); }}
              style={{ flex: 1 }}
              aria-label="Type medicine name"
            />
            <button className="btn btn-primary" style={{ padding: '10px 20px', minHeight: 48 }} onClick={handleManualSearch} disabled={!manualName.trim()} aria-label="Search medicine">
              <Icon name="search" size={16} /> Search
            </button>
          </div>
        </>
      )}

      {stage === 'scanning' && (
        <div className="card fade-in" style={{ padding: '48px 32px', textAlign: 'center' }}>
          {previewUrl && <img src={previewUrl} alt="Medicine being analyzed" style={{ width: 200, height: 140, objectFit: 'cover', borderRadius: 12, marginBottom: 24, border: '1px solid var(--border)' }} />}
          <div style={{ fontSize: 22, marginBottom: 8 }}>🔍</div>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 6 }}>Analyzing Medicine...</div>
          <div style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 24 }}>Using AI to identify medicine and gather information</div>
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
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8, fontFamily: "'Lora', serif" }}>Couldn't identify medicine</div>
          <p style={{ color: 'var(--text2)', marginBottom: 24 }}>{error}</p>
          <button className="btn btn-primary" style={{ minHeight: 48, fontSize: 15 }} onClick={reset} aria-label="Try scanning again">
            Try Again
          </button>
        </div>
      )}

      {stage === 'result' && result && (
        <div className="fade-in">
          <div className="card" style={{ padding: '28px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
              <div style={{ width: 56, height: 56, background: (result.color || '#2f6b4f') + '22', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                {result.icon}
              </div>
              <div style={{ flex: 1, minWidth: 150 }}>
                <div style={{ fontFamily: 'Lora', fontSize: 22, fontWeight: 600, color: 'var(--text)' }}>{result.name}</div>
                <div style={{ fontSize: 14, color: 'var(--text2)', marginTop: 3 }}>{result.category}</div>
              </div>
              <div style={{ background: '#d4edda', color: '#1a6b3a', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>✓ Identified</div>
            </div>

            <div style={{ background: 'var(--accent-light)', borderRadius: 10, padding: '16px', marginBottom: 14 }}>
              <div style={{ fontWeight: 600, color: 'var(--accent)', fontSize: 14, marginBottom: 6 }}>💊 What is it for?</div>
              <div style={{ fontSize: 16, color: 'var(--text)', lineHeight: 1.6 }}>{result.use}</div>
            </div>

            <div style={{ background: 'var(--info-light)', borderRadius: 10, padding: '16px', marginBottom: 14 }}>
              <div style={{ fontWeight: 600, color: 'var(--info)', fontSize: 14, marginBottom: 6 }}>🕐 How to take it?</div>
              <div style={{ fontSize: 16, color: 'var(--text)', lineHeight: 1.6 }}>{result.dosage}</div>
            </div>

            <div style={{ background: 'var(--warn-light)', borderRadius: 10, padding: '16px', marginBottom: 14 }}>
              <div style={{ fontWeight: 600, color: 'var(--warn)', fontSize: 14, marginBottom: 8 }}>⚠️ Important Warnings</div>
              {(result.warnings || []).map((w, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 15, color: 'var(--text)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--warn)', flexShrink: 0 }}>•</span> {w}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 16, padding: '14px', minHeight: 48 }} onClick={addMedicine} aria-label="Add to my medicines">
                <Icon name="plus" size={18} /> Add to My Medicines
              </button>
              <button className="btn btn-outline" style={{ padding: '14px 20px', minHeight: 48 }} onClick={reset} aria-label="Scan another medicine">
                Scan Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
