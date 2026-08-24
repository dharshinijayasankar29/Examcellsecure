import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  FileCheck,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockUsers, type UserAccount } from '../../mock/mockData';
import mvitLogo from '../../assets/mvit-logo.png';
import type { Role } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, addToast } = useApp();

  const [selectedRole, setSelectedRole] = useState<Role>('ADMIN');
  const currentUserObj = mockUsers.find((u) => u.role === selectedRole) || mockUsers[0];

  const [email, setEmail] = useState<string>(currentUserObj.email);
  const [password, setPassword] = useState<string>(currentUserObj.password);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // When selecting a role tab, update inputs
  const handleRoleSelect = (userAcc: UserAccount) => {
    setSelectedRole(userAcc.role);
    setEmail(userAcc.email);
    setPassword(userAcc.password);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const matchedUser = mockUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (matchedUser) {
        if (password === matchedUser.password || password.length >= 4) {
          login(matchedUser);
        } else {
          addToast('Invalid password for this account.', 'danger');
        }
      } else {
        login({
          ...currentUserObj,
          email: email.trim()
        });
      }
      setIsLoading(false);
    }, 350);
  };

  return (
    <div className="login-light-root">
      {/* Subtle soft backdrop accents */}
      <div className="light-ambient-glow" />

      <div className="login-light-card">
        {/* LEFT COLUMN: MVIT Institutional Branding */}
        <div className="light-brand-column">
          <div className="brand-badge-pill">
            <span className="live-pulse-dot" />
            <span>MVIT Autonomous Examination Cell</span>
          </div>

          <div className="brand-hero-group">
            {/* Prominent Large Logo */}
            <div className="mvit-logo-light-wrapper">
              <img
                src={mvitLogo}
                alt="Manakula Vinayagar Institute of Technology"
                className="mvit-logo-light-img"
              />
            </div>

            <h1 className="brand-title-light">ExamSecure</h1>
            <p className="brand-subtitle-light">
              Autonomous Examination & Question Paper Security Management
            </p>
          </div>

          <div className="brand-highlights-card">
            <div className="highlight-row">
              <div className="highlight-icon-box icon-blue">
                <Sparkles size={15} />
              </div>
              <div className="highlight-text">
                <strong>AI Blueprint & Bloom Balancing</strong>
                <span>Automatic CO-PO mapping & difficulty splits</span>
              </div>
            </div>

            <div className="highlight-row">
              <div className="highlight-icon-box icon-emerald">
                <ShieldCheck size={15} />
              </div>
              <div className="highlight-text">
                <strong>Tamper-Proof Paper Vault</strong>
                <span>SHA-256 cryptographic paper locking</span>
              </div>
            </div>

            <div className="highlight-row">
              <div className="highlight-icon-box icon-amber">
                <FileCheck size={15} />
              </div>
              <div className="highlight-text">
                <strong>Multi-Stage Review Workflow</strong>
                <span>Governed signoffs for CoE, HOD & Reviewers</span>
              </div>
            </div>
          </div>

          <div className="brand-footer-trust">
            <Shield size={14} className="text-blue-600" />
            <span>Institutional ISO 27001 Security Standard</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Clean Light-Themed Login Form */}
        <div className="light-form-column">
          <div className="form-header-light">
            <div className="header-title-flex">
              <h2>Staff & Reviewer Login</h2>
              <span className="active-role-chip">
                {currentUserObj.designation || selectedRole}
              </span>
            </div>
            <p className="header-subtitle-light">
              Select your role tab below to auto-fill credentials or enter your staff ID.
            </p>
          </div>

          {/* Clean 4-Role Switcher Tabs */}
          <div className="role-switcher-light-bar">
            {mockUsers.map((u) => {
              const isActive = selectedRole === u.role;
              return (
                <button
                  key={u.id}
                  type="button"
                  className={`role-tab-light ${isActive ? 'active' : ''}`}
                  onClick={() => handleRoleSelect(u)}
                >
                  {u.role}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="light-form">
            <div className="light-form-group">
              <label className="light-field-label">Institutional Email / Staff ID</label>
              <div className="light-input-container">
                <Mail size={16} className="input-leading-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@examcell.edu"
                  required
                  className="light-input"
                />
              </div>
            </div>

            <div className="light-form-group">
              <label className="light-field-label">Password</label>
              <div className="light-input-container">
                <Lock size={16} className="input-leading-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="light-input"
                />
                <button
                  type="button"
                  className="password-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="light-form-row">
              <label className="light-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember session</span>
              </label>

              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  addToast('Please contact CoE Administration for credential assistance.', 'info');
                }}
                className="light-forgot-link"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="light-btn-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Authenticating Session...</span>
              ) : (
                <>
                  <span>Sign In as {selectedRole}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Simple Credentials Helper Bar */}
          <div className="light-credentials-helper">
            <span className="helper-tag">Active Account:</span>
            <code className="helper-email">{currentUserObj.email}</code>
            <span className="helper-sep">|</span>
            <code className="helper-pwd">{currentUserObj.password}</code>
            <span className="helper-dest">→ {currentUserObj.defaultTab}</span>
          </div>
        </div>
      </div>

      <style>{`
        /* Full viewport, zero scroll container (Light Theme) */
        .login-light-root {
          width: 100vw;
          height: 100vh;
          max-height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f0f4f9 0%, #e2e8f0 50%, #dbeafe 100%);
          position: relative;
          padding: 20px;
          box-sizing: border-box;
          font-family: var(--font-family, 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
        }

        .light-ambient-glow {
          position: absolute;
          width: 800px;
          height: 800px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, rgba(240, 244, 249, 0) 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        /* Centered Card - perfectly sized for 100vh without scroll */
        .login-light-card {
          width: 960px;
          max-width: 96vw;
          height: 560px;
          max-height: 90vh;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
          display: grid;
          grid-template-columns: 410px 1fr;
          overflow: hidden;
          position: relative;
          z-index: 10;
        }

        /* Left Brand Column (Light Slate Theme) */
        .light-brand-column {
          background: linear-gradient(170deg, #f8fafc 0%, #f1f5f9 60%, #e2e8f0 100%);
          border-right: 1px solid #e2e8f0;
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .brand-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #1e3a8a;
          font-size: 11px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 9999px;
          width: fit-content;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .live-pulse-dot {
          width: 6px;
          height: 6px;
          background: #059669;
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(5, 150, 105, 0.6);
        }

        .brand-hero-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin: 6px 0;
        }

        /* Prominent Enlarged Logo */
        .mvit-logo-light-wrapper {
          width: 84px;
          height: 84px;
          background: #ffffff;
          border-radius: 18px;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
          border: 1.5px solid #e2e8f0;
          margin-bottom: 16px;
        }

        .mvit-logo-light-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .brand-title-light {
          font-size: 25px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.4px;
          margin: 0 0 4px 0;
          line-height: 1.1;
        }

        .brand-subtitle-light {
          font-size: 12px;
          color: #64748b;
          line-height: 1.45;
          margin: 0;
        }

        .brand-highlights-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 12px 14px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
        }

        .highlight-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .highlight-icon-box {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .icon-blue { background: #eff6ff; color: #2563eb; }
        .icon-emerald { background: #ecfdf5; color: #059669; }
        .icon-amber { background: #fffbeb; color: #d97706; }

        .highlight-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .highlight-text strong {
          font-size: 11.5px;
          font-weight: 600;
          color: #1e293b;
        }

        .highlight-text span {
          font-size: 10px;
          color: #64748b;
        }

        .brand-footer-trust {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10.5px;
          color: #64748b;
          font-weight: 600;
        }

        /* Right Form Column (Crisp White) */
        .light-form-column {
          padding: 34px 38px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: #ffffff;
        }

        .form-header-light {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .header-title-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-title-flex h2 {
          font-size: 21px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.3px;
        }

        .active-role-chip {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 9999px;
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
          max-width: 220px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .header-subtitle-light {
          font-size: 12px;
          color: #64748b;
          margin: 0;
        }

        /* 4-Role Switcher Tabs (Light) */
        .role-switcher-light-bar {
          display: flex;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 3px;
          gap: 3px;
          margin-top: 8px;
          margin-bottom: 8px;
        }

        .role-tab-light {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 7px 10px;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
          border-radius: 7px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .role-tab-light:hover {
          color: #0f172a;
          background: rgba(255, 255, 255, 0.7);
        }

        .role-tab-light.active {
          background: #2563eb;
          color: #ffffff;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
        }

        /* Form Controls */
        .light-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .light-form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .light-field-label {
          font-size: 11.5px;
          font-weight: 600;
          color: #334155;
        }

        .light-input-container {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 9px 12px;
          gap: 10px;
          transition: all 0.15s ease;
        }

        .light-input-container:focus-within {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
          background: #ffffff;
        }

        .input-leading-icon {
          color: #64748b;
          flex-shrink: 0;
        }

        .light-input {
          border: none;
          background: transparent;
          outline: none;
          color: #0f172a;
          font-size: 13px;
          width: 100%;
        }

        .light-input::placeholder {
          color: #94a3b8;
        }

        .password-eye-btn {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0;
        }

        .password-eye-btn:hover {
          color: #1e293b;
        }

        .light-form-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .light-checkbox-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          color: #64748b;
          cursor: pointer;
        }

        .light-forgot-link {
          font-size: 11.5px;
          color: #2563eb;
          font-weight: 600;
          text-decoration: none;
        }

        .light-forgot-link:hover {
          text-decoration: underline;
        }

        .light-btn-submit {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          border: none;
          color: #ffffff;
          padding: 11px 18px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
          transition: all 0.15s ease;
        }

        .light-btn-submit:hover:not(:disabled) {
          background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
        }

        .light-btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Credentials Helper Strip (Light) */
        .light-credentials-helper {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10.5px;
          padding: 6px 10px;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 8px;
          color: #64748b;
          overflow: hidden;
        }

        .helper-tag {
          font-weight: 700;
          color: #334155;
        }

        .helper-email {
          color: #1d4ed8;
          font-family: var(--font-mono, monospace);
          font-size: 10.5px;
          font-weight: 600;
        }

        .helper-sep {
          color: #94a3b8;
        }

        .helper-pwd {
          color: #475569;
          font-family: var(--font-mono, monospace);
          font-size: 10.5px;
        }

        .helper-dest {
          color: #059669;
          margin-left: auto;
          font-weight: 600;
        }

        @media (max-width: 820px) {
          .login-light-card {
            grid-template-columns: 1fr;
            height: auto;
            max-height: none;
          }
          .light-brand-column {
            display: none;
          }
          .login-light-root {
            height: auto;
            min-height: 100vh;
            overflow-y: auto;
          }
        }
      `}</style>
    </div>
  );
};
