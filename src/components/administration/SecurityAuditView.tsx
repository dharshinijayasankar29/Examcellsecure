import React, { useState } from 'react';
import {
  ShieldCheck,
  Key,
  Search,
  Users,
  UserCheck,
  Activity,
  Lock,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Breadcrumb } from '../common/Breadcrumb';
import { mockAuditLogs } from '../../mock/mockData';

export const SecurityAuditView: React.FC = () => {
  const [adminSubTab, setAdminSubTab] = useState<'audit' | 'users'>('audit');
  const [logFilter, setLogFilter] = useState('');

  const filteredLogs = mockAuditLogs.filter(
    (log) =>
      log.user.toLowerCase().includes(logFilter.toLowerCase()) ||
      log.action.toLowerCase().includes(logFilter.toLowerCase()) ||
      log.objectRef.toLowerCase().includes(logFilter.toLowerCase())
  );

  const mockUsers = [
    {
      id: 'USR-01',
      name: 'Dr. Dharshini J',
      email: 'dharshini@university.edu',
      role: 'ADMIN',
      dept: 'Exam Cell',
      status: 'Active'
    },
    {
      id: 'USR-02',
      name: 'Prof. K. Ramanathan',
      email: 'ramanathan@university.edu',
      role: 'HOD',
      dept: 'Computer Science',
      status: 'Active'
    },
    {
      id: 'USR-03',
      name: 'Dr. S. Anitha',
      email: 'anitha@university.edu',
      role: 'FACULTY',
      dept: 'Computer Science',
      status: 'Active'
    },
    {
      id: 'USR-04',
      name: 'Dr. V. Rajesh',
      email: 'rajesh@university.edu',
      role: 'REVIEWER',
      dept: 'External Audit Board',
      status: 'Active'
    }
  ];

  const roleColors: Record<string, string> = {
    ADMIN: 'role-pill-admin',
    HOD: 'role-pill-hod',
    FACULTY: 'role-pill-faculty',
    REVIEWER: 'role-pill-reviewer'
  };

  const systemHealth = [
    {
      label: 'Login Security',
      value: 'Healthy',
      detail: 'Multi-factor authentication is active',
      icon: <ShieldCheck size={20} />,
      color: 'health-green'
    },
    {
      label: 'Access Control',
      value: 'Enforced',
      detail: 'Role-based access is active for all users',
      icon: <Lock size={20} />,
      color: 'health-green'
    },
    {
      label: 'Activity Logs',
      value: 'Recording',
      detail: 'All user actions are being logged',
      icon: <Activity size={20} />,
      color: 'health-green'
    },
    {
      label: 'Paper Security',
      value: 'Sealed',
      detail: 'Encryption keys last rotated 18 Aug',
      icon: <Key size={20} />,
      color: 'health-indigo'
    }
  ];

  const friendlyAction = (action: string) => {
    const map: Record<string, string> = {
      PAPER_REVIEW_INITIATED: 'Started paper review',
      REVIEWER_APPROVE: 'Approved paper',
      PAPER_LOCKED: 'Locked paper',
      QUESTION_UPLOADED: 'Uploaded questions',
      BLUEPRINT_SAVED: 'Saved blueprint',
      USER_LOGIN: 'Logged in',
      PAPER_EXPORTED: 'Exported paper'
    };
    return map[action] || action.replace(/_/g, ' ').toLowerCase();
  };

  return (
    <div className="admin-container">
      <Breadcrumb />

      {/* Page Header */}
      <div className="module-header-area">
        <div className="module-header-title">
          <div>
            <h2 className="page-title">
              <ShieldCheck size={20} className="text-blue-600" />
              Admin Settings
            </h2>
            <p className="page-subtitle">
              Manage users, view activity logs, and monitor system security.
            </p>
          </div>
        </div>

        <div className="module-subnav-bar">
          <button
            className={`subnav-btn ${adminSubTab === 'audit' ? 'active' : ''}`}
            onClick={() => setAdminSubTab('audit')}
          >
            <Activity size={15} /> Activity Log
          </button>
          <button
            className={`subnav-btn ${adminSubTab === 'users' ? 'active' : ''}`}
            onClick={() => setAdminSubTab('users')}
          >
            <Users size={15} /> Manage Users
          </button>
        </div>
      </div>

      {/* ── AUDIT LOG TAB ── */}
      {adminSubTab === 'audit' && (
        <>
          {/* System Health Cards */}
          <div className="health-grid">
            {systemHealth.map((item, idx) => (
              <div key={idx} className={`health-card ${item.color}`}>
                <div className="health-card-top">
                  <div className="health-icon-wrap">{item.icon}</div>
                  <span className="health-status-pill">✓ {item.value}</span>
                </div>
                <div className="health-label">{item.label}</div>
                <div className="health-detail">{item.detail}</div>
              </div>
            ))}
          </div>

          {/* Activity Log Table */}
          <div className="card-panel" style={{ marginTop: '24px' }}>
            <div className="card-panel-header">
              <div className="panel-title">
                <Clock size={16} className="text-blue-600" />
                <h3>Recent Activity Log</h3>
              </div>
              <div className="log-search-box">
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Search by user, action, or paper ID..."
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value)}
                />
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date &amp; Time</th>
                    <th>User</th>
                    <th>Role</th>
                    <th>What Happened</th>
                    <th>Section</th>
                    <th>Paper / Record</th>
                    <th>Result</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-muted">
                        No activity records match your search.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <span className="log-timestamp">{log.timestamp}</span>
                        </td>
                        <td>
                          <strong>{log.user}</strong>
                        </td>
                        <td>
                          <span className={`role-pill ${roleColors[log.role] || 'role-pill-default'}`}>
                            {log.role}
                          </span>
                        </td>
                        <td>
                          <span className="action-text">{friendlyAction(log.action)}</span>
                        </td>
                        <td>
                          <span className="section-text">{log.module}</span>
                        </td>
                        <td>
                          <span className="paper-ref">{log.objectRef}</span>
                        </td>
                        <td>
                          <span className="badge badge-success">
                            <CheckCircle size={11} /> {log.status}
                          </span>
                        </td>
                        <td>
                          <span className="ip-text">{log.ipAddress}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── USERS TAB ── */}
      {adminSubTab === 'users' && (
        <div className="card-panel">
          <div className="card-panel-header">
            <div className="panel-title">
              <Users size={16} className="text-blue-600" />
              <h3>Staff Directory</h3>
            </div>
            <span className="badge badge-success">
              <UserCheck size={12} /> {mockUsers.length} Active Users
            </span>
          </div>

          <div className="users-grid">
            {mockUsers.map((u) => (
              <div key={u.id} className="user-card">
                <div className="user-card-top">
                  <div className="user-avatar-initials">
                    {u.name
                      .split(' ')
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <div className="user-card-name">{u.name}</div>
                    <div className="user-card-email">{u.email}</div>
                  </div>
                </div>
                <div className="user-card-footer">
                  <span className={`role-pill ${roleColors[u.role] || 'role-pill-default'}`}>
                    {u.role}
                  </span>
                  <span className="user-dept">{u.dept}</span>
                  <span className="badge badge-success" style={{ marginLeft: 'auto' }}>
                    ✓ Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .admin-container {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Health Cards */
        .health-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 4px;
        }

        .health-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 20px;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: box-shadow 0.15s ease;
        }

        .health-card:hover {
          box-shadow: var(--shadow-md);
        }

        .health-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .health-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .health-green .health-icon-wrap {
          background: var(--success-bg);
          color: var(--success);
          border: 1px solid var(--success-border);
        }

        .health-indigo .health-icon-wrap {
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .health-status-pill {
          font-size: 11px;
          font-weight: 700;
          color: var(--success);
          background: var(--success-bg);
          border: 1px solid var(--success-border);
          border-radius: var(--radius-full);
          padding: 2px 8px;
        }

        .health-indigo .health-status-pill {
          color: #6366f1;
          background: rgba(99, 102, 241, 0.1);
          border-color: rgba(99, 102, 241, 0.3);
        }

        .health-label {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .health-detail {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.4;
        }

        /* Log Search */
        .log-search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 6px 12px;
          min-width: 260px;
          color: var(--text-muted);
          transition: border-color 0.15s;
        }

        .log-search-box:focus-within {
          border-color: var(--border-focus);
        }

        .log-search-box input {
          border: none;
          background: transparent;
          font-size: 12px;
          outline: none;
          width: 100%;
          color: var(--text-primary);
        }

        /* Table cell formatting */
        .log-timestamp {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .action-text {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          text-transform: capitalize;
        }

        .section-text {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .paper-ref {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--brand-accent);
          font-weight: 600;
        }

        .ip-text {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-muted);
        }

        /* Role Pills */
        .role-pill {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .role-pill-admin {
          background: rgba(37, 99, 235, 0.12);
          color: #1d4ed8;
          border: 1px solid rgba(37, 99, 235, 0.25);
        }

        .role-pill-hod {
          background: rgba(5, 150, 105, 0.12);
          color: #047857;
          border: 1px solid rgba(5, 150, 105, 0.25);
        }

        .role-pill-faculty {
          background: rgba(217, 119, 6, 0.12);
          color: #b45309;
          border: 1px solid rgba(217, 119, 6, 0.25);
        }

        .role-pill-reviewer {
          background: rgba(109, 40, 217, 0.12);
          color: #6d28d9;
          border: 1px solid rgba(109, 40, 217, 0.25);
        }

        .role-pill-default {
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
        }

        /* Dark mode role pills */
        html.dark-theme .role-pill-admin { color: #93c5fd; background: rgba(37, 99, 235, 0.2); }
        html.dark-theme .role-pill-hod { color: #6ee7b7; background: rgba(5, 150, 105, 0.2); }
        html.dark-theme .role-pill-faculty { color: #fcd34d; background: rgba(217, 119, 6, 0.2); }
        html.dark-theme .role-pill-reviewer { color: #c4b5fd; background: rgba(109, 40, 217, 0.2); }

        /* Users Grid */
        .users-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          padding: 20px;
        }

        .user-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: box-shadow 0.15s ease, border-color 0.15s ease;
        }

        .user-card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--border-focus);
        }

        .user-card-top {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .user-avatar-initials {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #2563eb, #6366f1);
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 800;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        }

        .user-card-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.3;
        }

        .user-card-email {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .user-card-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
          flex-wrap: wrap;
        }

        .user-dept {
          font-size: 12px;
          color: var(--text-muted);
        }

        /* Table utilities */
        .mt-6 { margin-top: 24px; }
        .text-center { text-align: center; }
        .py-8 { padding: 32px 0; }
        .text-muted { color: var(--text-muted); }

        @media (max-width: 1024px) {
          .health-grid { grid-template-columns: repeat(2, 1fr); }
          .users-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};
