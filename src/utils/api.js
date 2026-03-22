const API_BASE = '/api';

// ─── Stream chat response from Gemini ──────────────────────────────────
export async function chatStream(messages, onChunk) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || 'Failed to get AI response');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    fullText += chunk;
    onChunk(fullText);
  }

  return fullText;
}

// ─── Scan medicine image via Gemini Vision ─────────────────────────────
export async function scanMedicine(base64Image, mimeType = 'image/jpeg') {
  const response = await fetch(`${API_BASE}/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image, mimeType }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || 'Failed to scan medicine');
  }

  return response.json();
}

// ─── Scan prescription via Gemini Vision ───────────────────────────────
export async function scanPrescription(base64Image, mimeType = 'image/jpeg') {
  const response = await fetch(`${API_BASE}/prescription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image, mimeType }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || 'Failed to read prescription');
  }

  return response.json();
}

// ─── Convert file to base64 ───────────────────────────────────────────
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
