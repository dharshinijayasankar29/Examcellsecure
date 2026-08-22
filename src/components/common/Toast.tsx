import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item toast-${toast.type}`}>
          {toast.type === 'success' && <CheckCircle size={18} className="toast-icon" />}
          {toast.type === 'danger' && <AlertCircle size={18} className="toast-icon" />}
          {toast.type === 'warning' && <AlertCircle size={18} className="toast-icon" />}
          {toast.type === 'info' && <Info size={18} className="toast-icon" />}
          <span className="toast-msg">{toast.message}</span>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>
            <X size={14} />
          </button>
        </div>
      ))}

      <style>{`
        .toast-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 120;
          display: flex;
          flex-direction: column;
          gap: 8px;
          pointer-events: none;
        }

        .toast-item {
          pointer-events: auto;
          min-width: 280px;
          max-width: 400px;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--text-primary);
          animation: toastIn 0.2s ease-out;
        }

        @keyframes toastIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .toast-success { border-left: 4px solid var(--success); }
        .toast-danger { border-left: 4px solid var(--danger); }
        .toast-warning { border-left: 4px solid var(--warning); }
        .toast-info { border-left: 4px solid var(--brand-accent); }

        .toast-msg {
          flex: 1;
        }

        .toast-close {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};
