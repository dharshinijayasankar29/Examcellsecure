import React, { useState } from 'react';
import { ShieldCheck, Lock, User as UserIcon, ArrowRight, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import mvitLogo from '../../assets/mvit-logo.png';

export const LoginPage: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const { addToast } = useApp();
  const [staffId, setStaffId] = useState('dharshini.j@examcell.edu');
  const [password, setPassword] = useState('••••••••••••');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Authentication successful. Welcome to ExamSecure.', 'success');
    onLoginSuccess();
  };

  return (
    <div className="login-screen-container">
      <div className="login-box-wrapper">
        {/* Left Branding Box */}
        <div className="login-brand-side">
          <div className="brand-header-group">
            <div className="brand-icon-box" style={{ background: '#ffffff', padding: 2 }}>
              <img src={mvitLogo} alt="MVIT Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">ExamSecure</h2>
              <span className="text-xs text-blue-200">MVIT Examination Management</span>
            </div>
          </div>

          <div className="brand-hero-content">
            <h3 className="text-lg font-bold text-white mb-2">
              Authorized Examination Cell Access Only
            </h3>
            <p className="text-xs text-blue-100 line-height-relaxed">
              This system processes confidential university question banks, AI blueprint calculations,
              and tamper-proof question paper locking.
            </p>
          </div>

          <div className="security-trust-badge">
            <Shield size={16} /> 256-Bit Encrypted Institutional Environment
          </div>
        </div>

        {/* Right Form Side */}
        <div className="login-form-side">
          <div className="form-header">
            <h3 className="text-lg font-bold text-primary">Staff & Faculty Sign In</h3>
            <p className="text-xs text-muted">Enter your institutional credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Staff Email or ID</label>
              <div className="input-with-icon">
                <UserIcon size={16} className="text-muted" />
                <input
                  type="email"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-extra-row">
              <label className="text-xs text-muted flex items-center gap-1">
                <input type="checkbox" defaultChecked /> Remember session
              </label>
              <a href="#forgot" className="text-xs text-blue-600 font-semibold" onClick={(e) => e.preventDefault()}>
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="btn-login-submit">
              Sign In to ExamCell Portal <ArrowRight size={16} />
            </button>
          </form>

          <div className="login-footer text-center text-xs text-muted mt-6">
            © 2026 Controller of Examinations. All rights reserved.
          </div>
        </div>
      </div>

      <style>{`
        .login-screen-container {
          min-height: 100vh;
          background: var(--bg-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .login-box-wrapper {
          width: 850px;
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-xl);
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          overflow: hidden;
        }

        .login-brand-side {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: white;
        }

        .brand-header-group {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .brand-icon-box {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .security-trust-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: #93c5fd;
          background: rgba(255, 255, 255, 0.08);
          padding: 8px 12px;
          border-radius: var(--radius-md);
          width: fit-content;
        }

        .login-form-side {
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .login-form {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-with-icon {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
        }

        .input-with-icon input {
          border: none;
          background: transparent;
          outline: none;
          font-size: 13px;
          width: 100%;
          color: var(--text-primary);
        }

        .form-extra-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .btn-login-submit {
          width: 100%;
          padding: 12px;
          background: var(--brand-accent);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.15s ease;
        }

        .btn-login-submit:hover {
          background: var(--brand-hover);
        }

        @media (max-width: 768px) {
          .login-box-wrapper { grid-template-columns: 1fr; }
          .login-brand-side { display: none; }
        }
      `}</style>
    </div>
  );
};
