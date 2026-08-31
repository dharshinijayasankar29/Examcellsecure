import React, { useState, useMemo } from 'react';
import {
  UploadCloud,
  CheckCircle,
  AlertTriangle,
  FileText,
  ArrowRight,
  ArrowLeft,
  Database,
  FileCheck,
  Sparkles,
  GraduationCap,
  Layers,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockSubjects } from '../../mock/mockData';

export const UploadWizardModal: React.FC = () => {
  const { setActiveTab, addToast } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState(mockSubjects[0].code);
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');
  const [fileName, setFileName] = useState('CS3501_Unit4_Import.docx');
  const [isDragOver, setIsDragOver] = useState(false);

  const selectedSubject = useMemo(
    () => mockSubjects.find((s) => s.code === selectedSubjectCode) || mockSubjects[0],
    [selectedSubjectCode]
  );

  const [issueFixes, setIssueFixes] = useState<{ [key: string]: string }>({
    issue1: 'Unit 4',
    issue2: 'Option A (Reworded)',
    issue3: '13 Marks'
  });

  const steps = [
    { num: 1, label: 'Choose File', icon: <UploadCloud size={16} /> },
    { num: 2, label: 'Preview Questions', icon: <FileText size={16} /> },
    { num: 3, label: 'AI Quality Check', icon: <Sparkles size={16} /> },
    { num: 4, label: 'Fix Issues', icon: <AlertTriangle size={16} /> },
    { num: 5, label: 'Confirm & Submit', icon: <FileCheck size={16} /> }
  ];

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      addToast('32 questions have been successfully uploaded to the Question Bank!', 'success');
      setActiveTab('question-bank');
    }
  };

  return (
    <div className="upload-wizard-wrapper">
      {/* Page Header */}
      <div className="upload-page-header">
        <div className="upload-header-icon">
          <UploadCloud size={28} />
        </div>
        <div>
          <h2 className="upload-page-title">Upload Your Questions</h2>
          <p className="upload-page-subtitle">
            Upload a file with your exam questions. We'll check and organise them for you automatically.
          </p>
        </div>
      </div>

      <div className="card-panel">
        {/* Step Progress Bar */}
        <div className="wizard-stepper">
          {steps.map((step, idx) => (
            <React.Fragment key={step.num}>
              <div
                className={`wizard-step ${
                  currentStep > step.num
                    ? 'completed'
                    : currentStep === step.num
                    ? 'current'
                    : 'pending'
                }`}
              >
                <div className="step-circle">
                  {currentStep > step.num ? (
                    <CheckCircle size={14} />
                  ) : (
                    <span className="step-num-text">{step.num}</span>
                  )}
                </div>
                <span className="step-name">{step.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`wizard-line ${currentStep > step.num ? 'line-done' : ''}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="wizard-body">
          {/* Step 1: Choose File */}
          {currentStep === 1 && (
            <div className="step-content">
              <div className="step-intro">
                <span className="step-label-pill">Step 1 of 5</span>
                <h4 className="step-heading">Select Your Question File</h4>
                <p className="step-desc">
                  Choose the target subject and syllabus unit, then upload your question document.
                </p>
              </div>

              {/* Faculty Subject & Unit Assignment Controls */}
              <div className="upload-target-selection-card">
                <div className="selection-header-row">
                  <div className="selection-section-title">
                    <GraduationCap size={16} className="text-blue-600" />
                    <span>Select Target Subject &amp; Syllabus Unit</span>
                  </div>
                  <span className="selection-badge">Faculty Assignment</span>
                </div>

                <div className="selection-controls-grid">
                  {/* Subject Name & Subject Code Picker */}
                  <div className="selection-field-group">
                    <label className="field-label">
                      <BookOpen size={13} /> Subject Name &amp; Code
                    </label>
                    <div className="subject-select-wrapper">
                      <select
                        className="subject-dropdown-select"
                        value={selectedSubjectCode}
                        onChange={(e) => {
                          const code = e.target.value;
                          setSelectedSubjectCode(code);
                          setSelectedUnit('all');
                          setFileName(`${code}_Questions_Import.docx`);
                        }}
                      >
                        {mockSubjects.map((sub) => (
                          <option key={sub.code} value={sub.code}>
                            {sub.code} — {sub.name} (Sem {sub.semester})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Syllabus Unit Selector Buttons */}
                  <div className="selection-field-group">
                    <label className="field-label">
                      <Layers size={13} /> Target Syllabus Unit
                    </label>
                    <div className="unit-pills-row">
                      <button
                        type="button"
                        className={`unit-pill-btn ${selectedUnit === 'all' ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedUnit('all');
                          setFileName(`${selectedSubjectCode}_AllUnits_Import.docx`);
                        }}
                      >
                        All Units (Auto)
                      </button>
                      {selectedSubject.units.map((u) => (
                        <button
                          key={u.number}
                          type="button"
                          className={`unit-pill-btn ${selectedUnit === u.number ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedUnit(u.number);
                            setFileName(`${selectedSubjectCode}_Unit${u.number}_Import.docx`);
                          }}
                          title={`Unit ${u.number}: ${u.name}`}
                        >
                          Unit {u.number}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Active Context Banner */}
                <div className="selected-context-banner">
                  <span className="context-chip">{selectedSubject.code}</span>
                  <span className="context-subject-name">{selectedSubject.name}</span>
                  <span className="context-separator">•</span>
                  <span className="context-unit-info">
                    {selectedUnit === 'all'
                      ? 'All Syllabus Units (AI Auto-Distribution)'
                      : `Unit ${selectedUnit}: ${selectedSubject.units.find((u) => u.number === selectedUnit)?.name || ''}`}
                  </span>
                </div>
              </div>

              <div
                className={`dropzone ${isDragOver ? 'drag-over' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files.length > 0) {
                    setFileName(e.dataTransfer.files[0].name);
                  }
                }}
              >
                <div className="dropzone-icon-wrap">
                  <UploadCloud size={52} className="dropzone-icon" />
                </div>
                <p className="dropzone-heading">Drag and drop your file here</p>
                <p className="dropzone-sub">or click anywhere in this box to browse your files</p>
                <div className="file-format-tags">
                  {['PDF', 'DOCX', 'XLSX', 'CSV'].map((fmt) => (
                    <span key={fmt} className="format-tag">{fmt}</span>
                  ))}
                </div>
                {fileName && (
                  <div className="selected-file-pill">
                    <FileText size={14} />
                    <span>{fileName}</span>
                    <span className="file-ready-badge">Ready</span>
                  </div>
                )}
              </div>

              <p className="upload-tip">
                💡 <strong>Tip:</strong> Use our template for the best results.{' '}
                <span className="link-style">Download sample template →</span>
              </p>
            </div>
          )}

          {/* Step 2: Preview Questions */}
          {currentStep === 2 && (
            <div className="step-content">
              <div className="step-intro">
                <span className="step-label-pill">Step 2 of 5</span>
                <h4 className="step-heading">Preview Detected Questions</h4>
                <p className="step-desc">
                  We found <strong>32 questions</strong> in your file. Review the preview below
                  and check that everything looks correct before continuing.
                </p>
              </div>

              <div className="stats-summary-box">
                <div className="stat-pill stat-total">
                  <span className="stat-num">32</span>
                  <span className="stat-lbl">Total Questions</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-num">6</span>
                  <span className="stat-lbl">Unit 1</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-num">8</span>
                  <span className="stat-lbl">Unit 2</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-num">5</span>
                  <span className="stat-lbl">Unit 3</span>
                </div>
                <div className="stat-pill stat-highlight">
                  <span className="stat-num">9</span>
                  <span className="stat-lbl">Unit 4</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-num">4</span>
                  <span className="stat-lbl">Unit 5</span>
                </div>
              </div>

              <div className="table-container mt-4">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Question Text</th>
                      <th>Unit</th>
                      <th>Marks</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Explain Rice Theorem and its application in undecidability proofs...</td>
                      <td>Unit 4</td>
                      <td>13 Marks</td>
                      <td><span className="badge badge-success">Valid</span></td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>State the halting problem for Turing Machines with an example...</td>
                      <td>Unit 4</td>
                      <td>2 Marks</td>
                      <td><span className="badge badge-success">Valid</span></td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Construct PCP solution matrix for instance pairs...</td>
                      <td><span className="text-warning font-bold">Not Assigned</span></td>
                      <td>13 Marks</td>
                      <td><span className="badge badge-warning">Needs Review</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Step 3: AI Quality Check */}
          {currentStep === 3 && (
            <div className="step-content">
              <div className="step-intro">
                <span className="step-label-pill">Step 3 of 5</span>
                <h4 className="step-heading">AI Quality Check Results</h4>
                <p className="step-desc">
                  Our AI has automatically checked each question for originality,
                  difficulty level, and syllabus alignment.
                </p>
              </div>

              <div className="ai-analysis-banner">
                <CheckCircle size={22} className="text-green-600" />
                <div>
                  <h5 className="font-semibold text-primary">All 32 Questions Passed</h5>
                  <p className="text-xs text-secondary">
                    Every question has been checked against the syllabus and existing question bank.
                    No major issues were found.
                  </p>
                </div>
              </div>

              <div className="ai-metrics-grid mt-4">
                <div className="ai-metric-card">
                  <div className="metric-icon-wrap metric-blue">
                    <Sparkles size={20} />
                  </div>
                  <span className="metric-val">94.2%</span>
                  <span className="metric-lbl">Average Originality</span>
                  <span className="metric-sub">Questions are unique and not duplicated</span>
                </div>
                <div className="ai-metric-card">
                  <div className="metric-icon-wrap metric-green">
                    <CheckCircle size={20} />
                  </div>
                  <span className="metric-val">0</span>
                  <span className="metric-lbl">Duplicate Questions</span>
                  <span className="metric-sub">No repeated questions found</span>
                </div>
                <div className="ai-metric-card">
                  <div className="metric-icon-wrap metric-indigo">
                    <Database size={20} />
                  </div>
                  <span className="metric-val">100%</span>
                  <span className="metric-lbl">Syllabus Coverage</span>
                  <span className="metric-sub">All questions match the curriculum</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Fix Issues */}
          {currentStep === 4 && (
            <div className="step-content">
              <div className="step-intro">
                <span className="step-label-pill">Step 4 of 5</span>
                <h4 className="step-heading">Fix the Following Issues</h4>
                <p className="step-desc">
                  We found <strong>1 issue</strong> that needs your attention before uploading.
                  Please review and fix it below.
                </p>
              </div>

              <div className="issues-list">
                <div className="issue-card">
                  <div className="issue-header">
                    <div className="issue-icon-wrap">
                      <AlertTriangle size={16} />
                    </div>
                    <div>
                      <span className="issue-title">Question 3 — Missing Unit Assignment</span>
                      <p className="issue-desc">
                        "Construct PCP solution matrix for instance pairs..." — This question has no
                        unit assigned. Please select the correct unit below.
                      </p>
                    </div>
                  </div>
                  <div className="issue-fix-row">
                    <label className="fix-label">Assign to Unit:</label>
                    <select
                      value={issueFixes.issue1}
                      onChange={(e) =>
                        setIssueFixes({ ...issueFixes, issue1: e.target.value })
                      }
                      className="fix-select"
                    >
                      <option value="Unit 4">Unit 4 — Undecidability</option>
                      <option value="Unit 3">Unit 3 — Turing Machines</option>
                    </select>
                    <span className="badge badge-success">✓ Fixed</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Confirm & Submit */}
          {currentStep === 5 && (
            <div className="step-content final-step">
              <div className="final-icon-wrap">
                <CheckCircle size={64} />
              </div>
              <h4 className="final-heading">Ready to Upload!</h4>
              <p className="final-desc">
                <strong>32 questions</strong> have been reviewed, quality-checked, and are ready
                to be added to the Question Bank for{' '}
                <strong>{selectedSubject.code} — {selectedSubject.name}</strong>
                {selectedUnit !== 'all' ? ` (Unit ${selectedUnit})` : ''}.
              </p>
              <div className="final-summary-pills">
                <span className="summary-pill">32 Questions</span>
                <span className="summary-pill">
                  {selectedUnit === 'all' ? `${selectedSubject.units.length} Units Covered` : `Unit ${selectedUnit}`}
                </span>
                <span className="summary-pill">94.2% Avg. Originality</span>
                <span className="summary-pill">0 Duplicates</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="wizard-footer">
          {currentStep > 1 && (
            <button
              className="btn-secondary"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              <ArrowLeft size={15} /> Back
            </button>
          )}

          <button
            className={`btn-primary ml-auto ${currentStep === 5 ? 'btn-submit-final' : ''}`}
            onClick={handleNextStep}
          >
            {currentStep === 5 ? (
              <>
                <Database size={16} /> Upload 32 Questions to Bank
              </>
            ) : (
              <>
                Continue <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .upload-wizard-wrapper {
          padding: 24px;
          max-width: 1000px;
          margin: 0 auto;
        }

        /* Page Header */
        .upload-page-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .upload-header-icon {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #2563eb, #6366f1);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
        }

        .upload-page-title {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 4px 0;
        }

        .upload-page-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          margin: 0;
        }

        /* Stepper */
        .wizard-stepper {
          display: flex;
          align-items: center;
          padding: 20px 28px;
          background: var(--bg-tertiary);
          border-bottom: 1px solid var(--border-color);
          gap: 0;
          overflow-x: auto;
        }

        .wizard-step {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .step-circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .wizard-step.pending .step-circle {
          background: var(--bg-hover);
          color: var(--text-muted);
          border: 2px solid var(--border-color);
        }

        .wizard-step.current .step-circle {
          background: linear-gradient(135deg, #2563eb, #6366f1);
          color: white;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);
        }

        .wizard-step.completed .step-circle {
          background: #059669;
          color: white;
        }

        .step-num-text {
          font-size: 13px;
          font-weight: 700;
        }

        .step-name {
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .wizard-step.pending .step-name {
          color: var(--text-muted);
        }

        .wizard-step.current .step-name {
          color: var(--brand-accent);
        }

        .wizard-step.completed .step-name {
          color: var(--success);
        }

        .wizard-line {
          flex: 1;
          height: 2px;
          background: var(--border-color);
          margin: 0 12px;
          min-width: 24px;
          transition: background 0.2s ease;
        }

        .wizard-line.line-done {
          background: var(--success);
        }

        /* Step Content */
        .wizard-body {
          padding: 28px;
          min-height: 300px;
        }

        .step-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .step-intro {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .step-label-pill {
          display: inline-flex;
          align-items: center;
          background: var(--info-bg);
          color: var(--info);
          border: 1px solid var(--info-border);
          border-radius: var(--radius-full);
          padding: 2px 10px;
          font-size: 11px;
          font-weight: 700;
          width: fit-content;
        }

        .step-heading {
          font-size: 17px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .step-desc {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.6;
          margin: 0;
        }

        /* Subject & Unit Selection Card in Upload Wizard */
        .upload-target-selection-card {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          box-shadow: var(--shadow-sm);
        }

        .selection-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
        }

        .selection-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .selection-badge {
          font-size: 11px;
          font-weight: 700;
          color: var(--brand-accent);
          background: rgba(37, 99, 235, 0.08);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(37, 99, 235, 0.2);
        }

        .selection-controls-grid {
          display: grid;
          grid-template-columns: 1.3fr 1.7fr;
          gap: 16px;
          align-items: start;
        }

        @media (max-width: 768px) {
          .selection-controls-grid {
            grid-template-columns: 1fr;
          }
        }

        .selection-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-label {
          font-size: 11.5px;
          font-weight: 700;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .subject-dropdown-select {
          width: 100%;
          padding: 8px 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 600;
          outline: none;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .subject-dropdown-select:hover,
        .subject-dropdown-select:focus {
          border-color: var(--brand-accent);
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
        }

        .unit-pills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .unit-pill-btn {
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .unit-pill-btn:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
          border-color: var(--brand-accent);
        }

        .unit-pill-btn.active {
          background: var(--brand-accent);
          color: #ffffff;
          border-color: var(--brand-accent);
          font-weight: 700;
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.35);
        }

        .selected-context-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-secondary);
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-md);
          padding: 8px 12px;
          font-size: 12px;
          flex-wrap: wrap;
        }

        .context-chip {
          background: var(--brand-accent);
          color: white;
          font-size: 11px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: var(--radius-sm);
        }

        .context-subject-name {
          font-weight: 700;
          color: var(--text-primary);
        }

        .context-separator {
          color: var(--text-muted);
        }

        .context-unit-info {
          color: var(--text-secondary);
          font-weight: 500;
        }

        /* Dropzone */
        .dropzone {
          border: 2px dashed #93c5fd;
          background: linear-gradient(135deg, #eff6ff, #f0f9ff);
          border-radius: var(--radius-lg);
          padding: 48px 32px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .dropzone:hover, .dropzone.drag-over {
          background: linear-gradient(135deg, #dbeafe, #e0f2fe);
          border-color: var(--brand-accent);
          transform: scale(1.005);
          box-shadow: 0 4px 20px rgba(37, 99, 235, 0.12);
        }

        .dropzone-icon-wrap {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #2563eb, #6366f1);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.35);
          margin-bottom: 4px;
        }

        .dropzone-icon {
          color: white;
        }

        .dropzone-heading {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .dropzone-sub {
          font-size: 13px;
          color: var(--text-muted);
          margin: 0;
        }

        .file-format-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 4px;
        }

        .format-tag {
          background: white;
          border: 1px solid #bfdbfe;
          color: #1d4ed8;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 700;
        }

        .selected-file-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          padding: 8px 16px;
          background: white;
          border: 1px solid #93c5fd;
          border-radius: var(--radius-md);
          font-size: 12px;
          font-weight: 600;
          color: var(--brand-accent);
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.1);
        }

        .file-ready-badge {
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
          border-radius: var(--radius-full);
          padding: 2px 8px;
          font-size: 10px;
          font-weight: 700;
        }

        .upload-tip {
          font-size: 12px;
          color: var(--text-muted);
          padding: 10px 14px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          margin: 0;
        }

        .link-style {
          color: var(--brand-accent);
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        /* Stats Summary */
        .stats-summary-box {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .stat-pill {
          padding: 10px 16px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          min-width: 70px;
        }

        .stat-num {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1;
        }

        .stat-lbl {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .stat-total {
          background: var(--info-bg);
          border-color: var(--info-border);
        }

        .stat-total .stat-num {
          color: var(--info);
        }

        .stat-highlight {
          background: var(--warning-bg);
          border-color: var(--warning-border);
        }

        .stat-highlight .stat-num {
          color: var(--warning);
        }

        .text-warning {
          color: var(--warning);
        }

        /* AI Banner */
        .ai-analysis-banner {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px 20px;
          background: var(--success-bg);
          border: 1px solid var(--success-border);
          border-radius: var(--radius-md);
        }

        /* AI Metrics */
        .ai-metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .ai-metric-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          padding: 20px 16px;
          border-radius: var(--radius-md);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          box-shadow: var(--shadow-sm);
          transition: box-shadow 0.15s ease;
        }

        .ai-metric-card:hover {
          box-shadow: var(--shadow-md);
        }

        .metric-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 4px;
        }

        .metric-blue { background: linear-gradient(135deg, #3b82f6, #6366f1); }
        .metric-green { background: linear-gradient(135deg, #10b981, #059669); }
        .metric-indigo { background: linear-gradient(135deg, #6366f1, #4f46e5); }

        .metric-val {
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
          display: block;
          line-height: 1;
        }

        .metric-lbl {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          display: block;
        }

        .metric-sub {
          font-size: 11px;
          color: var(--text-muted);
          display: block;
        }

        /* Issues */
        .issues-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .issue-card {
          background: var(--bg-secondary);
          border: 1px solid var(--warning-border);
          border-left: 4px solid var(--warning);
          border-radius: var(--radius-md);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .issue-header {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .issue-icon-wrap {
          width: 32px;
          height: 32px;
          background: var(--warning-bg);
          border: 1px solid var(--warning-border);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--warning);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .issue-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          display: block;
          margin-bottom: 4px;
        }

        .issue-desc {
          font-size: 12px;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }

        .issue-fix-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }

        .fix-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .fix-select {
          padding: 6px 10px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 12px;
          background: var(--bg-secondary);
          color: var(--text-primary);
          outline: none;
          flex: 1;
          cursor: pointer;
        }

        /* Final Step */
        .final-step {
          align-items: center;
          text-align: center;
          padding: 20px 0;
        }

        .final-icon-wrap {
          width: 88px;
          height: 88px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
          animation: bounceIn 0.4s ease;
        }

        @keyframes bounceIn {
          0% { transform: scale(0.6); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        .final-heading {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
        }

        .final-desc {
          font-size: 14px;
          color: var(--text-muted);
          max-width: 480px;
          line-height: 1.6;
          margin: 0;
        }

        .final-summary-pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .summary-pill {
          background: var(--success-bg);
          border: 1px solid var(--success-border);
          color: var(--success);
          padding: 4px 14px;
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 700;
        }

        /* Footer */
        .wizard-footer {
          padding: 16px 28px;
          border-top: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-tertiary);
        }

        .btn-submit-final {
          background: linear-gradient(135deg, #10b981, #059669) !important;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.45) !important;
          padding: 10px 24px !important;
          font-size: 14px !important;
        }

        .btn-submit-final:hover {
          background: linear-gradient(135deg, #059669, #047857) !important;
          box-shadow: 0 6px 18px rgba(16, 185, 129, 0.55) !important;
        }

        .mt-4 { margin-top: 16px; }
        .ml-auto { margin-left: auto; }
      `}</style>
    </div>
  );
};
