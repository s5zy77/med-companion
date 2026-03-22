import React, { useState } from 'react';
import Icon from './Icon';

const STEPS = [
  {
    emoji: '💊',
    title: 'Welcome to MedNote',
    desc: 'Your AI-powered medicine companion. We help you understand and manage your medicines in simple words.',
  },
  {
    emoji: '📷',
    title: 'Scan Your Medicines',
    desc: 'Take a photo of any medicine strip or bottle. Our AI will identify it and explain what it does, how to take it, and important warnings.',
  },
  {
    emoji: '⏰',
    title: 'Never Miss a Dose',
    desc: "Set reminders for each medicine. We'll send you a notification when it's time to take your medicine.",
  },
];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const current = STEPS[step];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 440 }}>
        <div className="fade-in" key={step}>
          <div style={{ fontSize: 80, marginBottom: 24 }}>{current.emoji}</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Lora', serif", marginBottom: 12, color: 'var(--text)' }}>
            {current.title}
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 36, maxWidth: 360, margin: '0 auto 36px' }}>
            {current.desc}
          </p>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === step ? 'var(--accent)' : 'var(--border)',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            className="btn btn-ghost"
            onClick={handleSkip}
            style={{ fontSize: 15, padding: '12px 24px', minHeight: 48 }}
            aria-label="Skip onboarding"
          >
            Skip
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            style={{ fontSize: 16, padding: '12px 32px', minHeight: 48 }}
            aria-label={step < STEPS.length - 1 ? 'Next step' : 'Get started'}
          >
            {step < STEPS.length - 1 ? 'Next →' : "Let's Start! 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}
