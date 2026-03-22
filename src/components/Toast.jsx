import React, { useState, useEffect, useCallback } from 'react';
import Icon from './Icon';

let toastIdCounter = 0;

const ToastContext = React.createContext(null);

export function useToast() {
  return React.useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container" style={{ position: 'fixed', top: 20, right: 20, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 380 }}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const colors = {
    success: { bg: '#d4edda', border: '#28a745', icon: 'check', color: '#155724' },
    error: { bg: '#f8d7da', border: '#dc3545', icon: 'x', color: '#721c24' },
    warning: { bg: '#fff3cd', border: '#ffc107', icon: 'warn', color: '#856404' },
    info: { bg: '#d1ecf1', border: '#17a2b8', icon: 'info', color: '#0c5460' },
  };

  const c = colors[toast.type] || colors.success;

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        background: c.bg,
        border: `1.5px solid ${c.border}`,
        borderRadius: 10,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        transform: visible ? 'translateX(0)' : 'translateX(120%)',
        opacity: visible ? 1 : 0,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onClick={onDismiss}
    >
      <Icon name={c.icon} size={18} className={`text-[${c.color}]`} />
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: c.color }}>{toast.message}</span>
      <button onClick={onDismiss} aria-label="Dismiss notification" style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.color, padding: 2, lineHeight: 1 }}>
        <Icon name="x" size={14} />
      </button>
    </div>
  );
}
