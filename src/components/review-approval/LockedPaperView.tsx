import React from 'react';
import { Lock, Printer, Eye, CheckCircle2, ShieldCheck, FileCheck2, Hash, Calendar, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';

export const LockedPaperView: React.FC = () => {
  const { paper, setActiveTab } = useApp();

  return (
    <div className="locked-container">
      <Breadcrumb />

      <div className="page-header">
        <div>
          <h2 className="page-title">
            <Lock size={20} className="text-blue-600" />
            Sealed &amp; Locked Papers
          </h2>
          <p className="page-subtitle">
            These papers have been officially approved, sealed, and locked by the Exam Cell. They cannot be edited.
          </p>
        </div>
      </div>

      <div className="card-panel lockbox-card">
        {/* Banner with high-contrast, beautiful gradient */}
        <div className="lockbox-header">
          <div className="lockbox-badge">
            <div className="lockbox-icon-wrap">
              <ShieldCheck size={26} className="text-white" />
            </div>
            <div>
              <span className="lockbox-sub-badge">OFFICIAL SEALED PAPER</span>
              <h3 className="lockbox-title">
                {paper.id} — {paper.subjectCode} ({paper.subjectName})
              </h3>
            </div>
          </div>
          <span className="lockbox-status-pill">
            <Lock size={13} /> Officially Locked
          </span>
        </div>

        {/* Details Grid */}
        <div className="lockbox-details-grid">
          <div className="detail-item">
            <span className="lbl">
              <FileCheck2 size={13} /> Paper ID
            </span>
            <span className="val font-mono">{paper.id}</span>
          </div>

          <div className="detail-item">
            <span className="lbl">Version</span>
            <span className="val">v{paper.version} (Final)</span>
          </div>

          <div className="detail-item">
            <span className="lbl">
              <Calendar size={13} /> Locked On
            </span>
            <span className="val">{paper.lockedAt || '19 Aug 2026 11:45 AM'}</span>
          </div>

          <div className="detail-item">
            <span className="lbl">
              <UserCheck size={13} /> Locked By
            </span>
            <span className="val">{paper.lockedBy || 'Dharshini J (Exam Cell Admin)'}</span>
          </div>

          <div className="detail-item full-width">
            <span className="lbl">
              <Hash size={13} /> Security Verification Code (SHA-256)
            </span>
            <span className="val-hash font-mono">
              {paper.securityHash || '8f94a2e1d03b47c92e1058f9104b2c86'}
            </span>
          </div>
        </div>

        {/* Signoff verification row */}
        <div className="lockbox-signoff-row">
          <div className="sign-badge">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>Reviewer 1: <strong>{paper.reviewer1.name}</strong> (Approved)</span>
          </div>
          <div className="sign-badge">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>Reviewer 2: <strong>{paper.reviewer2.name}</strong> (Approved)</span>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="lockbox-footer">
          <button className="btn-secondary" onClick={() => setActiveTab('review-workspace')}>
            <Eye size={15} /> View Draft
          </button>
          <button className="btn-primary ml-auto" onClick={() => setActiveTab('official-export')}>
            <Printer size={15} /> Export Official PDF
          </button>
        </div>
      </div>

      <style>{`
        .locked-container {
          padding: 24px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .lockbox-card {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }

        .lockbox-header {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          padding: 22px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .lockbox-badge {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .lockbox-icon-wrap {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
        }

        .lockbox-sub-badge {
          font-size: 10.5px;
          font-weight: 800;
          color: #93c5fd !important;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          display: block;
        }

        .lockbox-title {
          font-size: 18px !important;
          font-weight: 800 !important;
          color: #ffffff !important;
          margin: 2px 0 0 0 !important;
          letter-spacing: -0.2px;
        }

        .lockbox-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(16, 185, 129, 0.15);
          color: #34d399 !important;
          border: 1px solid rgba(16, 185, 129, 0.4);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        .lockbox-details-grid {
          padding: 24px 28px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .detail-item.full-width {
          grid-column: span 4;
        }

        .detail-item .lbl {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .detail-item .val {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .val-hash {
          background: var(--bg-tertiary);
          color: var(--brand-accent);
          padding: 10px 14px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          font-size: 12px;
          font-weight: 600;
          display: block;
          word-break: break-all;
        }

        .lockbox-signoff-row {
          padding: 16px 28px;
          background: var(--bg-tertiary);
          display: flex;
          gap: 32px;
          border-bottom: 1px solid var(--border-color);
          flex-wrap: wrap;
        }

        .sign-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--text-primary);
        }

        .lockbox-footer {
          padding: 18px 28px;
          background: var(--bg-secondary);
          display: flex;
          align-items: center;
        }

        .ml-auto {
          margin-left: auto;
        }

        @media (max-width: 900px) {
          .lockbox-details-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .detail-item.full-width {
            grid-column: span 2;
          }
        }
      `}</style>
    </div>
  );
};
