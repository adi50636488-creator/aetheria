import React from 'react';
import { ShieldCheck, ShieldAlert, Info, X } from 'lucide-react';

export const SecurityToast = ({ toast, onClose }) => {
  if (!toast) return null;

  const isError = toast.type === 'error';
  const isSuccess = toast.type === 'success';

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 2000,
      background: isError ? 'rgba(239, 68, 68, 0.95)' : isSuccess ? 'rgba(16, 185, 129, 0.95)' : 'rgba(30, 41, 59, 0.95)',
      color: '#ffffff',
      padding: '14px 20px',
      borderRadius: 'var(--radius-md)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      maxWidth: '420px',
      backdropFilter: 'blur(12px)',
      border: `1px solid ${isError ? '#f87171' : isSuccess ? '#34d399' : 'rgba(255,255,255,0.2)'}`,
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{ marginTop: '2px' }}>
        {isError && <ShieldAlert size={20} />}
        {isSuccess && <ShieldCheck size={20} />}
        {!isError && !isSuccess && <Info size={20} />}
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '2px' }}>{toast.title}</h4>
        <p style={{ fontSize: '0.82rem', opacity: 0.9, lineHeight: 1.4 }}>{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', opacity: 0.7 }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
