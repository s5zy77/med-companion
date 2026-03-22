import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '20mb' }));

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// ─── POST /api/chat — Conversational AI (Streaming) ────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const systemInstruction = `You are a helpful medicine assistant for elderly patients. Always respond in very simple language. Keep answers under 4 sentences. Support English and Bengali based on the user's question language. If the user writes in Bengali, respond in Bengali. If in English, respond in English. Be warm, caring, and use simple words. Add relevant emojis to make responses friendly.`;

    // Build chat history, ensuring it starts with a 'user' message
    let history = messages.slice(0, -1).map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));
    
    // Gemini API requires history to start with user
    while (history.length > 0 && history[0].role !== 'user') {
      history.shift();
    }

    const chat = model.startChat({
      history,
      systemInstruction,
    });

    const lastMessage = messages[messages.length - 1].text;

    // Stream response
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const result = await chat.sendMessageStream(lastMessage);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        res.write(text);
      }
    }
    res.end();
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ error: 'Failed to get AI response. Please try again.' });
  }
});

// ─── POST /api/scan — Medicine Image Analysis ──────────────────────────
app.post('/api/scan', async (req, res) => {
  try {
    const { image, mimeType } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'image (base64) is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a medicine identification expert. Analyze this medicine image (strip, bottle, or box) carefully.

Identify and return a JSON object with these fields:
{
  "name": "Medicine name with dosage (e.g., Metformin 500mg)",
  "category": "Category (e.g., Diabetes, Blood Pressure, Pain Relief)",
  "use": "What this medicine is used for, explained in very simple language for elderly patients (2-3 sentences)",
  "dosage": "How to take it, explained simply (1-2 sentences)",
  "warnings": ["Warning 1", "Warning 2", "Warning 3"],
  "sideEffects": "Common side effects in simple language (1 sentence)",
  "icon": "A single relevant emoji",
  "color": "A hex color code that represents this medicine category"
}

IMPORTANT: Return ONLY the JSON object, no markdown formatting, no code blocks, just pure JSON.`;

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: image,
        },
      },
    ]);

    const text = result.response.text();
    // Try to parse JSON from response
    let parsed;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch {
      parsed = { raw: text };
    }

    res.json(parsed);
  } catch (error) {
    console.error('Scan error:', error.message);
    res.status(500).json({ error: 'Failed to analyze medicine image. Please try again.' });
  }
});

// ─── POST /api/prescription — Prescription OCR ─────────────────────────
app.post('/api/prescription', async (req, res) => {
  try {
    const { image, mimeType } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'image (base64) is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a medical prescription reader. Analyze this prescription image carefully.

Extract ALL medicine names, dosages, and frequencies from this prescription.

Return a JSON object with this structure:
{
  "medicines": [
    {
      "name": "Medicine Name with Dosage (e.g., Metformin 500mg)",
      "dosage": "How to take it (e.g., 1 tablet twice daily after meals)",
      "frequency": "When to take (e.g., Morning and Evening)",
      "category": "Category (e.g., Diabetes, Blood Pressure)",
      "use": "Brief explanation in simple language",
      "warnings": ["Key warning 1"],
      "sideEffects": "Common side effects",
      "icon": "Relevant emoji",
      "color": "Hex color for the category"
    }
  ]
}

IMPORTANT: Return ONLY the JSON object, no markdown formatting, no code blocks, just pure JSON. If you cannot read the prescription clearly, return what you can identify.`;

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: image,
        },
      },
    ]);

    const text = result.response.text();
    let parsed;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch {
      parsed = { medicines: [], raw: text };
    }

    res.json(parsed);
  } catch (error) {
    console.error('Prescription error:', error.message);
    res.status(500).json({ error: 'Failed to read prescription. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`MedNote API server running on http://localhost:${PORT}`);
});
