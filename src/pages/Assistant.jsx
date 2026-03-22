import React, { useState, useEffect, useRef } from 'react';
import Icon from '../components/Icon';
import { chatStream } from '../utils/api';

export default function Assistant({ medicines }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Namaskar! 🙏 I'm your MedNote assistant.\n\nAsk me anything about your medicines in simple words.\n\nআপনি বাংলায়ও জিজ্ঞাসা করতে পারেন! (You can ask in Bengali too!)", time: new Date().toISOString() },
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState('');
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamText]);

  const send = async () => {
    if (!input.trim() || streaming) return;
    const userMsg = { role: 'user', text: input.trim(), time: new Date().toISOString() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    const query = input.trim();
    setInput('');
    setStreaming(true);
    setStreamText('');

    try {
      // Build context — include medicine list for context
      const medContext = medicines.length > 0
        ? `\n\nThe user currently has these medicines saved:\n${medicines.map((m) => `- ${m.name} (${m.category}): ${m.dosage}`).join('\n')}`
        : '';

      // Keep last 10 messages for context
      const chatHistory = newMessages.slice(-10).map((m) => ({
        role: m.role === 'ai' ? 'model' : 'user',
        text: m.role === 'ai' ? m.text : m.text,
      }));

      // Inject medicine context into the last user message
      if (chatHistory.length > 0) {
        const last = chatHistory[chatHistory.length - 1];
        if (last.role === 'user' && medContext) {
          chatHistory[chatHistory.length - 1] = {
            ...last,
            text: last.text + medContext,
          };
        }
      }

      const fullText = await chatStream(chatHistory, (partial) => {
        setStreamText(partial);
      });

      setMessages((prev) => [...prev, { role: 'ai', text: fullText, time: new Date().toISOString() }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [...prev, {
        role: 'ai',
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. 🙏",
        time: new Date().toISOString(),
      }]);
    } finally {
      setStreaming(false);
      setStreamText('');
    }
  };

  const quickQuestions = ['What is Metformin for?', 'Can I take with food?', 'What medicines do I have?', 'Side effects?'];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '24px 40px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, marginBottom: 2, fontFamily: "'Lora', serif" }}>AI Assistant</h1>
          <p style={{ color: 'var(--text2)', fontSize: 15 }}>Ask anything about your medicines</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text3)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28a745', display: 'inline-block' }} />
          Powered by Gemini AI
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {quickQuestions.map((q) => (
          <button key={q} className="btn btn-outline" style={{ fontSize: 13, padding: '6px 14px', minHeight: 36 }} onClick={() => setInput(q)} aria-label={q}>
            {q}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 16 }} role="log" aria-label="Chat messages" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {m.role === 'ai' && (
              <div style={{ width: 36, height: 36, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 10, flexShrink: 0, fontSize: 16 }}>🤖</div>
            )}
            <div className={m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'} style={{ whiteSpace: 'pre-line' }}>
              {m.text}
              <div style={{ fontSize: 11, marginTop: 6, opacity: 0.6 }}>
                {new Date(m.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {/* Streaming response */}
        {streaming && (
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ width: 36, height: 36, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 10, flexShrink: 0, fontSize: 16 }}>🤖</div>
            <div className="chat-bubble-ai" style={{ whiteSpace: 'pre-line' }}>
              {streamText || (
                <div style={{ display: 'flex', gap: 4 }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{ width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%', animation: 'pulse 1.4s infinite', animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: '16px 0 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
          placeholder="Ask about your medicines..."
          style={{ flex: 1, fontSize: 16, padding: '12px 16px' }}
          aria-label="Type your question"
          disabled={streaming}
        />
        <button className="btn btn-primary" onClick={send} style={{ padding: '12px 20px', minHeight: 48 }} disabled={streaming || !input.trim()} aria-label="Send message">
          <Icon name="send" size={18} />
        </button>
      </div>
    </div>
  );
}
