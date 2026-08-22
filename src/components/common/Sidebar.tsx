import React from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Database,
  UploadCloud,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Role } from '../../types';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: Role[];
  variant?: 'default' | 'upload';
  description?: string;
}

export const Sidebar: React.FC = () => {
  const { role, activeTab, setActiveTab, sidebarCollapsed, setSidebarCollapsed } = useApp();

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />,
      roles: ['ADMIN', 'HOD', 'FACULTY', 'REVIEWER'],
    },
    {
      id: 'question-bank',
      label: 'Question Bank',
      icon: <Database size={18} />,
      roles: ['ADMIN', 'HOD', 'FACULTY', 'REVIEWER'],
    },
    {
      id: 'exam-papers',
      label: 'Exam Papers',
      icon: <FileSpreadsheet size={18} />,
      roles: ['ADMIN', 'HOD', 'FACULTY', 'REVIEWER'],
    },
    {
      id: 'administration',
      label: 'Admin Settings',
      icon: <ShieldAlert size={18} />,
      roles: ['ADMIN', 'HOD'],
    },
  ];

  const isItemActive = (id: string) => {
    if (id === 'dashboard') return activeTab === 'dashboard';
    if (id === 'question-bank')
      return ['question-bank', 'upload-bank', 'question-health'].includes(activeTab);
    if (id === 'exam-papers')
      return [
        'exam-papers',
        'blueprint',
        'ai-generator',
        'review-workspace',
        'locked-papers',
        'official-export',
        'examinations',
        'question-intelligence',
      ].includes(activeTab);
    if (id === 'administration')
      return ['administration', 'security-audit', 'users'].includes(activeTab);
    return false;
  };

  const visibleItems = navItems.filter((item) => item.roles.includes(role));
  const showUploadBtn = (['FACULTY', 'ADMIN'] as Role[]).includes(role);

  return (
    <aside className={`app-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <button
        className="collapse-toggle-btn"
        onClick={() => setSidebarCollapsed((prev) => !prev)}
        title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className="sidebar-nav-content">
        {!sidebarCollapsed && <div className="nav-group-title">Main Navigation</div>}
        <ul className="nav-list">
          {visibleItems.map((item) => {
            const isActive = isItemActive(item.id);
            return (
              <li key={item.id}>
                <button
                  className={`nav-item-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Quick Upload Button for Faculty & Admin */}
        {showUploadBtn && (
          <div className={`upload-section ${sidebarCollapsed ? 'collapsed' : ''}`}>
            {!sidebarCollapsed && (
              <div className="nav-group-title" style={{ marginTop: '8px' }}>
                Quick Actions
              </div>
            )}
            <button
              className="upload-quick-btn"
              onClick={() => setActiveTab('upload-bank')}
              title={sidebarCollapsed ? 'Upload Questions' : undefined}
            >
              <UploadCloud size={18} className="upload-icon" />
              {!sidebarCollapsed && (
                <div className="upload-btn-text">
                  <span className="upload-btn-label">Upload Questions</span>
                  <span className="upload-btn-sub">Add to Question Bank</span>
                </div>
              )}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .app-sidebar {
          width: 220px;
          background-color: var(--sidebar-bg);
          height: calc(100vh - 64px);
          position: sticky;
          top: 64px;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          transition: width 0.22s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 30;
          user-select: none;
        }

        .app-sidebar.collapsed {
          width: 64px;
        }

        .collapse-toggle-btn {
          position: absolute;
          top: 14px;
          right: -13px;
          width: 26px;
          height: 26px;
          background: #1e293b;
          border: 1px solid #334155;
          color: #94a3b8;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 35;
          transition: all 0.15s ease;
        }

        .collapse-toggle-btn:hover {
          background: #334155;
          color: #ffffff;
        }

        .sidebar-nav-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 16px 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-group-title {
          font-size: 10px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          padding: 0 8px 8px 8px;
        }

        .nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-bottom: 4px;
        }

        .nav-item-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 9px 12px;
          border-radius: var(--radius-md);
          border: none;
          background: transparent;
          color: var(--sidebar-text);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }

        .nav-item-btn:hover {
          background-color: rgba(255,255,255,0.06);
          color: #e2e8f0;
        }

        .nav-item-btn.active {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: #ffffff;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35);
        }

        .collapsed .nav-item-btn {
          justify-content: center;
          padding: 10px 0;
        }

        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .nav-label {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Upload Quick Button */
        .upload-section {
          margin-top: 8px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .upload-quick-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          border: 1px solid rgba(16, 185, 129, 0.35);
          background: rgba(16, 185, 129, 0.12);
          color: #34d399;
          cursor: pointer;
          transition: all 0.18s ease;
          text-align: left;
        }

        .upload-quick-btn:hover {
          background: rgba(16, 185, 129, 0.22);
          border-color: rgba(16, 185, 129, 0.6);
          color: #6ee7b7;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
        }

        .upload-icon {
          flex-shrink: 0;
        }

        .upload-btn-text {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .upload-btn-label {
          font-size: 13px;
          font-weight: 700;
          color: #34d399;
          white-space: nowrap;
        }

        .upload-btn-sub {
          font-size: 10px;
          color: rgba(52, 211, 153, 0.7);
          white-space: nowrap;
        }

        .upload-section.collapsed .upload-quick-btn {
          justify-content: center;
          padding: 10px 0;
        }
      `}</style>
    </aside>
  );
};
