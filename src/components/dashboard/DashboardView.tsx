import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Database,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Search,
  Sparkles,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { mockExaminations } from '../../mock/mockData';

export const DashboardView: React.FC = () => {
  const { user, setActiveTab, questions } = useApp();
  const [examSearch, setExamSearch] = useState('');

  const filteredExams = mockExaminations.filter(
    (e) =>
      e.subjectName.toLowerCase().includes(examSearch.toLowerCase()) ||
      e.subjectCode.toLowerCase().includes(examSearch.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <Breadcrumb />

      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h2>Welcome back, {user.name} 👋</h2>
          <p>
            Overview of examination workflows and question bank repository status for{' '}
            <strong>{user.department}</strong>.
          </p>
        </div>
        <div className="welcome-actions">
          <button className="btn-primary" onClick={() => setActiveTab('exam-papers')}>
            <Sparkles size={15} /> Open Paper Workspace
          </button>
        </div>
      </div>

      {/* Metric KPI Grid */}
      <div className="kpi-grid">
        <div className="kpi-card" onClick={() => setActiveTab('examinations')}>
          <div className="kpi-header">
            <span className="kpi-title">Active Examinations</span>
            <div className="kpi-icon icon-blue">
              <FileSpreadsheet size={18} />
            </div>
          </div>
          <div className="kpi-value">12</div>
          <div className="kpi-context context-neutral">
            <span>4 Scheduled for Nov/Dec 2026</span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => setActiveTab('question-bank')}>
          <div className="kpi-header">
            <span className="kpi-title">Question Bank Pool</span>
            <div className="kpi-icon icon-indigo">
              <Database size={18} />
            </div>
          </div>
          <div className="kpi-value">2,486</div>
          <div className="kpi-context context-positive">
            <span>+32 added this week</span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => setActiveTab('review-workspace')}>
          <div className="kpi-header">
            <span className="kpi-title">Pending Reviews</span>
            <div className="kpi-icon icon-amber">
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value">08</div>
          <div className="kpi-context context-warning">
            <span>2 papers require 2nd signoff</span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => setActiveTab('locked-papers')}>
          <div className="kpi-header">
            <span className="kpi-title">Approved & Locked Papers</span>
            <div className="kpi-icon icon-green">
              <CheckCircle size={18} />
            </div>
          </div>
          <div className="kpi-value">24</div>
          <div className="kpi-context context-positive">
            <span>🔒 Tamper-evident sealed</span>
          </div>
        </div>
      </div>

      {/* Workflow Tracker Section */}
      <div className="card-panel">
        <div className="card-panel-header">
          <div className="panel-title">
            <Layers size={18} className="text-blue-600" />
            <h3>Active Exam Workflow Pipeline</h3>
          </div>
          <span className="text-muted text-xs">Subject: CS3501 - Theory of Computation</span>
        </div>
        <div className="card-panel-body">
          <div className="workflow-stepper">
            <div className="step-item step-completed">
              <div className="step-badge">✓</div>
              <div className="step-info">
                <span className="step-label">Blueprint</span>
                <span className="step-sub">Finalized</span>
              </div>
            </div>
            <div className="step-line step-line-active"></div>

            <div className="step-item step-completed">
              <div className="step-badge">✓</div>
              <div className="step-info">
                <span className="step-label">Question Bank</span>
                <span className="step-sub">Verified</span>
              </div>
            </div>
            <div className="step-line step-line-active"></div>

            <div className="step-item step-completed">
              <div className="step-badge">✓</div>
              <div className="step-info">
                <span className="step-label">AI Generation</span>
                <span className="step-sub">Complete</span>
              </div>
            </div>
            <div className="step-line step-line-active"></div>

            <div className="step-item step-current">
              <div className="step-badge">●</div>
              <div className="step-info">
                <span className="step-label">Review Queue</span>
                <span className="step-sub">In Progress</span>
              </div>
            </div>
            <div className="step-line"></div>

            <div className="step-item step-pending">
              <div className="step-badge">○</div>
              <div className="step-info">
                <span className="step-label">HOD Approval</span>
                <span className="step-sub">Pending Signoff</span>
              </div>
            </div>
            <div className="step-line"></div>

            <div className="step-item step-pending">
              <div className="step-badge">🔒</div>
              <div className="step-info">
                <span className="step-label">Locked State</span>
                <span className="step-sub">Vault Seal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Action Center + Upcoming Exams Table */}
      <div className="dashboard-dual-grid">
        {/* Action Center */}
        <div className="card-panel action-center-card">
          <div className="card-panel-header">
            <div className="panel-title">
              <AlertTriangle size={18} className="text-amber-600" />
              <h3>Needs Your Attention</h3>
            </div>
            <span className="badge badge-warning">4 Actions Required</span>
          </div>

          <div className="action-items-list">
            <div className="action-item" onClick={() => setActiveTab('review-workspace')}>
              <div className="action-indicator warning-ind">●</div>
              <div className="action-details">
                <span className="action-text">2 papers awaiting 2nd reviewer approval signoff</span>
                <span className="action-sub">PPR-2026-CS3501-003 (Theory of Computation)</span>
              </div>
              <button className="action-link-btn">
                Review Paper <ArrowRight size={14} />
              </button>
            </div>

            <div className="action-item" onClick={() => setActiveTab('question-health')}>
              <div className="action-indicator alert-ind">⚠</div>
              <div className="action-details">
                <span className="action-text">Unit 4 (CS3501) has insufficient Hard difficulty questions</span>
                <span className="action-sub">Health Score: 61% (Weak unit coverage)</span>
              </div>
              <button className="action-link-btn">
                Improve Bank <ArrowRight size={14} />
              </button>
            </div>

            <div className="action-item" onClick={() => setActiveTab('question-bank')}>
              <div className="action-indicator warning-ind">●</div>
              <div className="action-details">
                <span className="action-text">3 new questions submitted by Faculty require verification</span>
                <span className="action-sub">Dr. K. Ramanathan • Submitted yesterday</span>
              </div>
              <button className="action-link-btn">
                Verify Questions <ArrowRight size={14} />
              </button>
            </div>

            <div className="action-item">
              <div className="action-indicator success-ind">✓</div>
              <div className="action-details">
                <span className="action-text">Question bank batch upload completed successfully</span>
                <span className="action-sub">32 questions imported into CS3501</span>
              </div>
              <span className="text-muted text-xs">Completed</span>
            </div>
          </div>
        </div>

        {/* Upcoming Examinations Table */}
        <div className="card-panel exams-table-card">
          <div className="card-panel-header">
            <div className="panel-title">
              <FileSpreadsheet size={18} className="text-blue-600" />
              <h3>Upcoming Departmental Examinations</h3>
            </div>
            <div className="table-search-box">
              <Search size={14} className="text-muted" />
              <input
                type="text"
                placeholder="Search examination..."
                value={examSearch}
                onChange={(e) => setExamSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Exam Type</th>
                  <th>Exam Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredExams.map((exam) => (
                  <tr key={exam.id}>
                    <td>
                      <div>
                        <strong>{exam.subjectCode}</strong>
                        <div className="text-muted text-xs">{exam.subjectName}</div>
                      </div>
                    </td>
                    <td>{exam.title.split('-')[0]}</td>
                    <td>{exam.examDate}</td>
                    <td>
                      <span
                        className={`badge ${
                          exam.status === 'Locked'
                            ? 'badge-locked'
                            : exam.status === 'Under Review'
                            ? 'badge-warning'
                            : exam.status === 'AI Generation'
                            ? 'badge-info'
                            : 'badge-draft'
                        }`}
                      >
                        {exam.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-table-action"
                        onClick={() => {
                          if (exam.status === 'Locked') setActiveTab('locked-papers');
                          else if (exam.status === 'Under Review') setActiveTab('review-workspace');
                          else setActiveTab('blueprint');
                        }}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-container {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .welcome-banner {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
          color: white;
          padding: 20px 24px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          box-shadow: var(--shadow-md);
        }

        .welcome-text h2 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .welcome-text p {
          font-size: 13px;
          color: #94a3b8;
        }

        .welcome-actions {
          display: flex;
          gap: 12px;
        }

        .btn-primary {
          background: var(--brand-accent);
          color: white;
          border: none;
          padding: 9px 16px;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.15s ease;
        }

        .btn-primary:hover {
          background: var(--brand-hover);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 9px 16px;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.15s ease;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .kpi-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 18px;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: var(--shadow-sm);
        }

        .kpi-card:hover {
          transform: translateY(-2px);
          border-color: var(--brand-accent);
          box-shadow: var(--shadow-md);
        }

        .kpi-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .kpi-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .kpi-icon {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-blue { background: #dbeafe; color: #1e40af; }
        .icon-indigo { background: #e0e7ff; color: #3730a3; }
        .icon-amber { background: #fef3c7; color: #92400e; }
        .icon-green { background: #d1fae5; color: #065f46; }

        .kpi-value {
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.1;
          margin-bottom: 6px;
        }

        .kpi-context {
          font-size: 11px;
          font-weight: 500;
        }

        .context-positive { color: var(--success); }
        .context-warning { color: var(--warning); }
        .context-neutral { color: var(--text-muted); }

        .card-panel {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          margin-bottom: 24px;
          overflow: hidden;
        }

        .card-panel-header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .panel-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .panel-title h3 {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .card-panel-body {
          padding: 20px;
        }

        /* Stepper Styling */
        .workflow-stepper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
        }

        .step-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .step-badge {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
        }

        .step-completed .step-badge {
          background: var(--success-bg);
          color: var(--success);
          border: 1px solid var(--success-border);
        }

        .step-current .step-badge {
          background: #dbeafe;
          color: #1d4ed8;
          border: 2px solid #2563eb;
        }

        .step-pending .step-badge {
          background: var(--bg-tertiary);
          color: var(--text-muted);
          border: 1px solid var(--border-color);
        }

        .step-info {
          display: flex;
          flex-direction: column;
        }

        .step-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .step-sub {
          font-size: 10px;
          color: var(--text-muted);
        }

        .step-line {
          flex: 1;
          height: 2px;
          background: var(--border-color);
          margin: 0 12px;
        }

        .step-line-active {
          background: var(--success);
        }

        .dashboard-dual-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 20px;
        }

        .action-center-card, .exams-table-card {
          margin-bottom: 0;
        }

        .action-items-list {
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .action-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          transition: background 0.15s ease;
        }

        .action-item:hover {
          background: var(--bg-tertiary);
        }

        .action-indicator {
          font-weight: 800;
          font-size: 14px;
        }

        .warning-ind { color: var(--warning); }
        .alert-ind { color: var(--danger); }
        .success-ind { color: var(--success); }

        .action-details {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .action-text {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .action-sub {
          font-size: 11px;
          color: var(--text-muted);
        }

        .action-link-btn {
          background: none;
          border: none;
          color: var(--brand-accent);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .action-link-btn:hover {
          text-decoration: underline;
        }

        .table-search-box {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 4px 10px;
        }

        .table-search-box input {
          border: none;
          background: transparent;
          font-size: 12px;
          outline: none;
          color: var(--text-primary);
        }

        .btn-table-action {
          padding: 4px 10px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          color: var(--text-secondary);
        }

        .btn-table-action:hover {
          background: var(--brand-accent);
          color: white;
          border-color: var(--brand-accent);
        }

        @media (max-width: 1024px) {
          .kpi-grid { grid-template-columns: repeat(2, 1fr); }
          .dashboard-dual-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};
