import React from 'react';
import { Activity, AlertTriangle, CheckCircle, ArrowRight, RefreshCw, Sparkles, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { mockUnitHealth } from '../../mock/mockData';

export const QuestionHealthView: React.FC = () => {
  const { setActiveTab, addToast } = useApp();

  const handleImproveUnit = (unitNumber: number) => {
    addToast(`Triggered AI question generation recommendation for Unit ${unitNumber}. Redirecting to AI Generator...`, 'info');
    setActiveTab('ai-generator');
  };

  return (
    <div className="health-container">
      <Breadcrumb />

      <div className="page-header">
        <div>
          <h2 className="page-title">
            <Activity size={22} className="text-blue-600 inline-block mr-2" />
            Question Bank Health Diagnostics
          </h2>
          <p className="page-subtitle">
            Unit-by-unit question pool health, Bloom distribution gaps, and automated quality recommendations.
          </p>
        </div>

        <button className="btn-secondary" onClick={() => addToast('Re-running unit health diagnostic scans...', 'success')}>
          <RefreshCw size={15} /> Re-scan Unit Health
        </button>
      </div>

      {/* Health Overview Cards */}
      <div className="health-cards-grid">
        {mockUnitHealth.map((uh) => (
          <div key={uh.unit} className={`health-card health-${uh.status.toLowerCase().replace(' ', '-')}`}>
            <div className="health-card-header">
              <div>
                <span className="unit-title-lbl">Unit {uh.unit}</span>
                <h4 className="unit-name">{uh.title}</h4>
              </div>
              <div className="health-score-badge">{uh.healthScore}%</div>
            </div>

            <div className="health-status-row">
              <span className={`badge badge-${uh.status.toLowerCase().replace(' ', '-')}`}>
                {uh.status === 'Healthy' && <CheckCircle size={12} />}
                {uh.status === 'Needs Attention' && <AlertTriangle size={12} />}
                {uh.status === 'Weak' && <ShieldAlert size={12} />}
                {uh.status}
              </span>
              <span className="text-xs text-muted">{uh.totalQuestions} questions in pool</span>
            </div>

            {/* Health Bar */}
            <div className="health-bar-track">
              <div
                className="health-bar-fill"
                style={{
                  width: `${uh.healthScore}%`,
                  background:
                    uh.healthScore > 80 ? 'var(--success)' : uh.healthScore > 70 ? 'var(--warning)' : 'var(--danger)'
                }}
              ></div>
            </div>

            {/* Issues & Recommendations */}
            <div className="issues-list">
              {uh.issues.map((issue, idx) => (
                <div key={idx} className="issue-bullet">
                  <AlertTriangle size={13} className="text-amber-600 shrink-0" />
                  <span>{issue}</span>
                </div>
              ))}

              {uh.recommendations.map((rec, idx) => (
                <div key={idx} className="rec-bullet">
                  <Sparkles size={13} className="text-indigo-600 shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>

            <div className="health-card-footer">
              <button className="btn-improve-bank" onClick={() => handleImproveUnit(uh.unit)}>
                Improve Question Bank <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .health-container {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .health-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .health-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 20px;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: transform 0.15s ease;
        }

        .health-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .health-weak {
          border-left: 4px solid var(--danger);
        }

        .health-needs-attention {
          border-left: 4px solid var(--warning);
        }

        .health-healthy {
          border-left: 4px solid var(--success);
        }

        .health-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .unit-title-lbl {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .unit-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.3;
          margin-top: 2px;
        }

        .health-score-badge {
          font-size: 18px;
          font-weight: 800;
          padding: 4px 10px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          color: var(--text-primary);
        }

        .health-status-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .health-bar-track {
          height: 6px;
          background: var(--bg-tertiary);
          border-radius: 3px;
          overflow: hidden;
        }

        .health-bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .issues-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .issue-bullet {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .rec-bullet {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12px;
          color: var(--brand-indigo);
          font-weight: 500;
        }

        .health-card-footer {
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px solid var(--border-color);
        }

        .btn-improve-bank {
          width: 100%;
          padding: 8px 12px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 12px;
          font-weight: 600;
          color: var(--brand-accent);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.15s ease;
        }

        .btn-improve-bank:hover {
          background: var(--brand-accent);
          color: white;
          border-color: var(--brand-accent);
        }

        @media (max-width: 1024px) {
          .health-cards-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};
