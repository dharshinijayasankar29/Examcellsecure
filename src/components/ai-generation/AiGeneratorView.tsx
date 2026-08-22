import React, { useState } from 'react';
import { Sparkles, CheckCircle, ShieldCheck, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { mockSubjects } from '../../mock/mockData';

export const AiGeneratorView: React.FC = () => {
  const { setActiveTab, addToast } = useApp();

  const [selectedSubject, setSelectedSubject] = useState('CS3501');
  const [selectedUnits, setSelectedUnits] = useState([1, 2, 3, 4, 5]);
  const [noveltySetting, setNoveltySetting] = useState('High');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProgressStep, setCurrentProgressStep] = useState(0);

  const progressSteps = [
    'Loading syllabus & course outcomes for CS3501...',
    'Retrieving approved question bank pool (148 questions)...',
    'Analyzing difficulty & Bloom taxonomy blueprint constraints...',
    'Generating candidate question set with high novelty...',
    'Checking cross-question semantic similarity & duplicate risk...',
    'Validating total mark distribution & syllabus coverage...',
    'Finalizing examination paper draft (v2.4)...'
  ];

  const handleStartGeneration = () => {
    setIsGenerating(true);
    setCurrentProgressStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < progressSteps.length) {
        setCurrentProgressStep(step);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
          addToast('AI Question Paper draft (v2.4) generated successfully!', 'success');
          setActiveTab('review-workspace');
        }, 800);
      }
    }, 900);
  };

  const toggleUnit = (u: number) => {
    if (selectedUnits.includes(u)) {
      if (selectedUnits.length === 1) return; // Must keep at least 1
      setSelectedUnits(selectedUnits.filter((x) => x !== u));
    } else {
      setSelectedUnits([...selectedUnits, u]);
    }
  };

  return (
    <div className="generator-container">
      <Breadcrumb />

      <div className="page-header">
        <div>
          <h2 className="page-title">
            <Sparkles size={22} className="text-blue-600 inline-block mr-2" />
            AI Question Paper Generator
          </h2>
          <p className="page-subtitle">
            Generate controlled, non-repeating examination papers adhering strictly to institutional blueprint standards.
          </p>
        </div>
      </div>

      {!isGenerating ? (
        <div className="generator-grid">
          {/* Left Form Panel */}
          <div className="card-panel">
            <div className="card-panel-header">
              <h3>Generation Configuration Workspace</h3>
              <span className="badge badge-info">Blueprint Controlled</span>
            </div>

            <div className="panel-form-body">
              <div className="form-group">
                <label>Target Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="form-control"
                >
                  {mockSubjects.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.code} - {s.name} ({s.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Select Syllabus Units for Coverage</label>
                <div className="units-checkbox-grid">
                  {[1, 2, 3, 4, 5].map((u) => (
                    <label key={u} className={`unit-chip ${selectedUnits.includes(u) ? 'selected' : ''}`}>
                      <input
                        type="checkbox"
                        checked={selectedUnits.includes(u)}
                        onChange={() => toggleUnit(u)}
                      />
                      <span>Unit {u}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Novelty & Originality Threshold</label>
                <select
                  value={noveltySetting}
                  onChange={(e) => setNoveltySetting(e.target.value)}
                  className="form-control"
                >
                  <option value="Maximum">Maximum Originality (95%+ Novelty)</option>
                  <option value="High">High Novelty (90%+ Novelty)</option>
                  <option value="Standard">Standard Mix (Faculty Bank + AI Synthesis)</option>
                </select>
              </div>

              <div className="info-box">
                <ShieldCheck size={18} className="text-blue-600 shrink-0" />
                <p className="text-xs text-secondary">
                  Questions are synthesized exclusively using approved question-bank data, syllabus outcomes,
                  and examination blueprint rules. Prompt integrity is cryptographically enforced.
                </p>
              </div>

              <button className="btn-generate-submit" onClick={handleStartGeneration}>
                <Sparkles size={18} /> Generate Examination Paper
              </button>
            </div>
          </div>

          {/* Right Blueprint Constraints Preview */}
          <div className="card-panel">
            <div className="card-panel-header">
              <h3>Active Blueprint Constraints Summary</h3>
              <span className="badge badge-success">✓ Finalized</span>
            </div>

            <div className="constraints-body">
              <div className="constraint-item">
                <span className="constraint-label">Total Paper Marks:</span>
                <span className="constraint-value">100 Marks</span>
              </div>
              <div className="constraint-item">
                <span className="constraint-label">Part A Structure:</span>
                <span className="constraint-value">10 Questions × 2 Marks = 20 Marks</span>
              </div>
              <div className="constraint-item">
                <span className="constraint-label">Part B Structure:</span>
                <span className="constraint-value">5 Either/Or Pairs × 13 Marks = 65 Marks</span>
              </div>
              <div className="constraint-item">
                <span className="constraint-label">Part C Structure:</span>
                <span className="constraint-value">1 Compulsory Analytical × 15 Marks = 15 Marks</span>
              </div>
              <div className="constraint-item">
                <span className="constraint-label">Difficulty Balance:</span>
                <span className="constraint-value">20% Easy / 50% Moderate / 30% Hard</span>
              </div>
              <div className="constraint-item">
                <span className="constraint-label">Bloom Taxonomy Ratio:</span>
                <span className="constraint-value">K1(10%) K2(20%) K3(30%) K4(25%) K5(15%)</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Progress Screen during Generation */
        <div className="card-panel progress-card">
          <div className="progress-header text-center">
            <div className="spinner-icon">
              <RefreshCw size={36} className="animate-spin text-blue-600 mx-auto" />
            </div>
            <h3 className="text-lg font-bold text-primary mt-2">Generating Examination Paper</h3>
            <p className="text-xs text-muted">
              Running multi-stage AI question synthesis and blueprint alignment validation...
            </p>
          </div>

          <div className="progress-steps-list">
            {progressSteps.map((stepText, idx) => {
              const isDone = idx < currentProgressStep;
              const isCurrent = idx === currentProgressStep;
              return (
                <div
                  key={idx}
                  className={`progress-step-row ${
                    isDone ? 'step-done' : isCurrent ? 'step-current' : 'step-waiting'
                  }`}
                >
                  <div className="step-icon-cell">
                    {isDone && <CheckCircle size={18} className="text-green-600" />}
                    {isCurrent && <RefreshCw size={18} className="animate-spin text-blue-600" />}
                    {!isDone && !isCurrent && <span className="dot-waiting">○</span>}
                  </div>
                  <span className="step-text">{stepText}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        .generator-container {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .generator-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 20px;
        }

        .panel-form-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-control {
          width: 100%;
          padding: 9px 12px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 13px;
          background: var(--bg-tertiary);
          outline: none;
          color: var(--text-primary);
        }

        .units-checkbox-grid {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .unit-chip {
          padding: 8px 14px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .unit-chip.selected {
          background: var(--info-bg);
          border-color: var(--brand-accent);
          color: var(--brand-accent);
          font-weight: 700;
        }

        .info-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
        }

        .btn-generate-submit {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
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
          box-shadow: var(--shadow-md);
          transition: opacity 0.15s ease;
        }

        .btn-generate-submit:hover {
          opacity: 0.95;
        }

        .constraints-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .constraint-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 12px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 12.5px;
        }

        .constraint-label {
          color: var(--text-muted);
        }

        .constraint-value {
          font-weight: 700;
          color: var(--text-primary);
        }

        /* Progress Card */
        .progress-card {
          padding: 30px;
          max-width: 650px;
          margin: 40px auto;
        }

        .progress-steps-list {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .progress-step-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
        }

        .step-done {
          background: var(--success-bg);
          border-color: var(--success-border);
        }

        .step-current {
          background: var(--info-bg);
          border-color: var(--brand-accent);
          font-weight: 600;
        }

        .step-waiting {
          opacity: 0.5;
        }

        .step-text {
          font-size: 13px;
          color: var(--text-primary);
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
