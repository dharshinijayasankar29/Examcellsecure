import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Breadcrumb: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const getBreadcrumbTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Institutional Dashboard';
      case 'examinations': return 'Examination Management';
      case 'blueprint': return 'Examination Blueprint Studio';
      case 'question-bank': return 'Question Bank Repository';
      case 'upload-bank': return 'Guided Upload Bank Wizard';
      case 'question-health': return 'Question Bank Health Analyzer';
      case 'question-intelligence': return 'Question Intelligence & Analytics';
      case 'ai-generator': return 'AI Question Paper Generator';
      case 'review-workspace': return 'Question Paper Review Queue';
      case 'locked-papers': return 'Locked Examination Papers 🔒';
      case 'official-export': return 'Official Question Paper Export';
      case 'security-audit': return 'Security Center & Audit Logs';
      case 'users': return 'User Access Management';
      default: return 'Dashboard';
    }
  };

  return (
    <nav className="breadcrumb-nav">
      <button className="breadcrumb-home-btn" onClick={() => setActiveTab('dashboard')}>
        <Home size={14} />
        <span>Exam Cell</span>
      </button>
      <ChevronRight size={14} className="text-muted" />
      <span className="breadcrumb-current">{getBreadcrumbTitle(activeTab)}</span>

      <style>{`
        .breadcrumb-nav {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          font-size: 13px;
          color: var(--text-muted);
        }

        .breadcrumb-home-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 13px;
          padding: 2px 6px;
          border-radius: var(--radius-sm);
          transition: background 0.15s ease;
        }

        .breadcrumb-home-btn:hover {
          background: var(--bg-tertiary);
          color: var(--brand-accent);
        }

        .breadcrumb-current {
          font-weight: 600;
          color: var(--text-primary);
        }
      `}</style>
    </nav>
  );
};
