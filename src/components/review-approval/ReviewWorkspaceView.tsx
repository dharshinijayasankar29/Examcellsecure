import React, { useState } from 'react';
import {
  CheckSquare,
  CheckCircle,
  RefreshCw,
  Lock,
  Printer,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import type { GeneratedPaperQuestion } from '../../types';
import { mockValidationRules } from '../../mock/mockData';

export const ReviewWorkspaceView: React.FC = () => {
  const { paper, regenerateQuestion, approvePaper, lockPaper, setActiveTab } = useApp();
  const [selectedPaperQ, setSelectedPaperQ] = useState<GeneratedPaperQuestion | null>(paper.questions[0]);

  // Single Question Regenerate Modal State
  const [isRegenModalOpen, setIsRegenModalOpen] = useState(false);
  const [regenReason, setRegenReason] = useState('Too similar to previous question');
  const [customInstruction, setCustomInstruction] = useState('');

  const handleOpenRegenModal = (q: GeneratedPaperQuestion) => {
    setSelectedPaperQ(q);
    setIsRegenModalOpen(true);
  };

  const handleConfirmRegenerate = () => {
    if (!selectedPaperQ) return;
    regenerateQuestion(selectedPaperQ.id, regenReason, customInstruction);
    setIsRegenModalOpen(false);
    setCustomInstruction('');
  };

  return (
    <div className="review-workspace-container">
      <Breadcrumb />

      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="header-title-row">
            <h2 className="page-title">
              <CheckSquare size={20} className="text-blue-600" />
              Review &amp; Approve Paper
            </h2>
            <span className="badge badge-warning">{paper.status}</span>
            <span className="badge badge-draft">Version {paper.version}</span>
          </div>
          <p className="page-subtitle">
            {paper.subjectCode} — {paper.subjectName} ({paper.regulation}) &bull; Exam Date: {paper.examDate}
          </p>
        </div>

        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setActiveTab('official-export')}>
            <Printer size={15} /> Export &amp; Preview
          </button>
          {paper.status !== 'Locked' && (
            <button className="btn-lock-paper" onClick={lockPaper}>
              <Lock size={15} /> Lock Paper
            </button>
          )}
        </div>
      </div>

      {/* Reviewer Sign-off Card */}
      <div className="card-panel signoff-card">
        <div className="signoff-grid">
          <div className="signoff-box">
            <span className="signoff-label">Reviewer 1 (Head of Department)</span>
            <span className="signoff-name">{paper.reviewer1.name}</span>
            {paper.reviewer1.status === 'Approved' ? (
              <span className="badge badge-approved">✓ Approved on {paper.reviewer1.date}</span>
            ) : (
              <button className="btn-approve-action" onClick={() => approvePaper('reviewer1')}>
                Approve as Reviewer 1
              </button>
            )}
          </div>

          <div className="signoff-box">
            <span className="signoff-label">Reviewer 2 (Senior Coordinator)</span>
            <span className="signoff-name">{paper.reviewer2.name}</span>
            {paper.reviewer2.status === 'Approved' ? (
              <span className="badge badge-approved">✓ Approved on {paper.reviewer2.date}</span>
            ) : (
              <button className="btn-approve-action" onClick={() => approvePaper('reviewer2')}>
                Approve as Reviewer 2
              </button>
            )}
          </div>

          <div className="signoff-box lock-status-box">
            <span className="signoff-label">Final Lock Status</span>
            {paper.status === 'Locked' ? (
              <span className="badge badge-locked">🔒 Securely Locked</span>
            ) : (
              <span className="badge badge-warning">○ Awaiting Both Approvals</span>
            )}
          </div>
        </div>
      </div>

      {/* Split Layout */}
      <div className="review-split-grid">
        {/* Left: Draft Paper */}
        <div className="card-panel paper-render-panel">
          <div className="card-panel-header">
            <h3>Draft Paper ({paper.questions.length} Questions)</h3>
            <span className="text-muted text-xs">Click a question to inspect or replace it</span>
          </div>

          <div className="paper-draft-body">
            {/* Part A Header */}
            <div className="section-divider">
              PART A — (10 × 2 = 20 Marks) — Answer ALL Questions
            </div>
            {paper.questions
              .filter((q) => q.section === 'Part A')
              .map((q) => (
                <div
                  key={q.id}
                  className={`paper-q-item ${selectedPaperQ?.id === q.id ? 'active-q' : ''}`}
                  onClick={() => setSelectedPaperQ(q)}
                >
                  <div className="q-num-col">{q.questionNumber}.</div>
                  <div className="q-text-col">
                    <p>{q.text}</p>
                    <div className="q-item-meta font-mono text-xs">
                      [Unit {q.unit} • {q.bloom} • {q.co} • Novelty {q.noveltyScore}%]
                    </div>
                  </div>
                  <div className="q-marks-col">{q.marks} M</div>
                </div>
              ))}

            {/* Part B Header */}
            <div className="section-divider mt-6">
              PART B — (5 × 13 = 65 Marks) — Either / Or Choice
            </div>
            {paper.questions
              .filter((q) => q.section === 'Part B')
              .map((q) => (
                <div
                  key={q.id}
                  className={`paper-q-item ${selectedPaperQ?.id === q.id ? 'active-q' : ''}`}
                  onClick={() => setSelectedPaperQ(q)}
                >
                  <div className="q-num-col">
                    {q.questionNumber}
                    {q.subNumber}.
                  </div>
                  <div className="q-text-col">
                    <p>{q.text}</p>
                    <div className="q-item-meta font-mono text-xs">
                      [Unit {q.unit} • {q.bloom} • {q.co} • Novelty {q.noveltyScore}%]
                    </div>
                  </div>
                  <div className="q-marks-col">{q.marks} M</div>
                </div>
              ))}

            {/* Part C Header */}
            <div className="section-divider mt-6">
              PART C — (1 × 15 = 15 Marks) — Compulsory Analytical
            </div>
            {paper.questions
              .filter((q) => q.section === 'Part C')
              .map((q) => (
                <div
                  key={q.id}
                  className={`paper-q-item ${selectedPaperQ?.id === q.id ? 'active-q' : ''}`}
                  onClick={() => setSelectedPaperQ(q)}
                >
                  <div className="q-num-col">{q.questionNumber}.</div>
                  <div className="q-text-col">
                    <p>{q.text}</p>
                    <div className="q-item-meta font-mono text-xs">
                      [Unit {q.unit} • {q.bloom} • {q.co} • Novelty {q.noveltyScore}%]
                    </div>
                  </div>
                  <div className="q-marks-col">{q.marks} M</div>
                </div>
              ))}
          </div>
        </div>

        {/* Right: Inspector + Validation */}
        <div className="review-right-column">
          {/* Question Inspector Card */}
          {selectedPaperQ ? (
            <div className="card-panel">
              <div className="card-panel-header">
                <h3>Question {selectedPaperQ.questionNumber} Details</h3>
                <span className="badge badge-info">{selectedPaperQ.section}</span>
              </div>

              <div className="q-inspector-body">
                <div className="q-preview-box font-medium text-sm text-primary mb-3">
                  "{selectedPaperQ.text}"
                </div>

                <div className="inspector-stats-grid">
                  <div className="stat-card">
                    <span className="lbl">Originality</span>
                    <span className="val text-green-600">{selectedPaperQ.noveltyScore}%</span>
                  </div>
                  <div className="stat-card">
                    <span className="lbl">Duplicate Risk</span>
                    <span className="val text-blue-600">{selectedPaperQ.duplicateRisk}</span>
                  </div>
                  <div className="stat-card">
                    <span className="lbl">Difficulty</span>
                    <span className="val">{selectedPaperQ.difficulty}</span>
                  </div>
                  <div className="stat-card">
                    <span className="lbl">Cognitive Level</span>
                    <span className="val">{selectedPaperQ.bloom}</span>
                  </div>
                  <div className="stat-card">
                    <span className="lbl">Course Goal</span>
                    <span className="val">{selectedPaperQ.co}</span>
                  </div>
                  <div className="stat-card">
                    <span className="lbl">Syllabus Match</span>
                    <span className="val text-green-600">✓ 100%</span>
                  </div>
                </div>

                {paper.status !== 'Locked' && (
                  <div className="inspector-actions mt-4">
                    <button
                      className="btn-secondary"
                      style={{width:'100%', justifyContent:'center'}}
                      onClick={() => handleOpenRegenModal(selectedPaperQ)}
                    >
                      <RefreshCw size={14} /> Replace This Question
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card-panel p-6 text-center text-muted">
              Select any question on the left to inspect AI metrics or regenerate.
            </div>
          )}

          {/* Validation Checklist */}
          <div className="card-panel">
            <div className="card-panel-header">
              <h3>Paper Quality Checklist</h3>
              <span className="badge badge-success">9/9 Passed</span>
            </div>

            <div className="validation-list">
              {mockValidationRules.map((v) => (
                <div key={v.id} className="validation-item">
                  <CheckCircle size={16} className="text-green-600 shrink-0" />
                  <div>
                    <span className="val-rule-title">{v.rule}</span>
                    <p className="val-rule-desc">{v.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Regenerate Single Question Modal */}
      {isRegenModalOpen && selectedPaperQ && (
        <div className="modal-overlay" onClick={() => setIsRegenModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Regenerate Question {selectedPaperQ.questionNumber}</h3>
              <button className="btn-icon" onClick={() => setIsRegenModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p className="text-xs text-muted">
                This operation replaces ONLY question {selectedPaperQ.questionNumber} while preserving
                blueprint constraints (Unit {selectedPaperQ.unit}, {selectedPaperQ.marks} Marks, {selectedPaperQ.bloom}).
              </p>

              <div className="form-group">
                <label>Why are you replacing this question?</label>
                <select value={regenReason} onChange={(e) => setRegenReason(e.target.value)}>
                  <option value="Too similar to previous question">Too similar to a previous question</option>
                  <option value="Difficulty inappropriate">Difficulty level is inappropriate</option>
                  <option value="Ambiguous wording">Wording is unclear or ambiguous</option>
                  <option value="Wrong Bloom level">Wrong cognitive level</option>
                  <option value="Wrong Course Outcome">Wrong course goal</option>
                </select>
              </div>

              <div className="form-group">
                <label>Additional Instructions (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="e.g., Focus on pumping lemma proof steps..."
                  value={customInstruction}
                  onChange={(e) => setCustomInstruction(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsRegenModalOpen(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleConfirmRegenerate}>
                <RefreshCw size={15} /> Replace Question
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .review-workspace-container {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .header-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .signoff-card {
          margin-bottom: 20px;
          background: var(--bg-secondary);
        }

        .signoff-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
          padding: 16px 20px;
        }

        .signoff-box {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .signoff-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .signoff-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .btn-approve-action {
          padding: 6px 14px;
          background: linear-gradient(135deg, #059669, #047857);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          width: fit-content;
          margin-top: 4px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s ease;
          box-shadow: 0 2px 6px rgba(5, 150, 105, 0.3);
        }

        .btn-approve-action:hover {
          background: linear-gradient(135deg, #047857, #065f46);
          box-shadow: 0 4px 10px rgba(5, 150, 105, 0.4);
          transform: translateY(-1px);
        }

        .btn-lock-paper {
          background: linear-gradient(135deg, #1e1b4b, #312e81);
          color: #c7d2fe;
          border: 1px solid #4338ca;
          padding: 9px 16px;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.18s ease;
          box-shadow: 0 2px 8px rgba(67, 56, 202, 0.3);
        }

        .btn-lock-paper:hover {
          background: linear-gradient(135deg, #312e81, #3730a3);
          box-shadow: 0 4px 14px rgba(67, 56, 202, 0.45);
          transform: translateY(-1px);
        }

        .review-split-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 20px;
        }

        .paper-draft-body {
          padding: 20px;
          max-height: 600px;
          overflow-y: auto;
        }

        .section-divider {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          padding: 8px 12px;
          font-weight: 700;
          font-size: 12px;
          color: var(--text-primary);
          border-radius: var(--radius-sm);
          margin-bottom: 10px;
        }

        .paper-q-item {
          display: flex;
          gap: 12px;
          padding: 10px 12px;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          transition: background 0.15s ease;
          border-radius: var(--radius-sm);
        }

        .paper-q-item:hover {
          background: var(--bg-tertiary);
        }

        .paper-q-item.active-q {
          background: var(--info-bg);
          border-left: 3px solid var(--brand-accent);
        }

        .q-num-col {
          font-weight: 700;
          width: 28px;
          font-size: 13px;
        }

        .q-text-col {
          flex: 1;
          font-size: 13px;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .q-item-meta {
          color: var(--text-muted);
          margin-top: 4px;
        }

        .q-marks-col {
          font-weight: 700;
          font-size: 12px;
          color: var(--text-muted);
          width: 35px;
          text-align: right;
        }

        .review-right-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .q-inspector-body {
          padding: 18px;
        }

        .q-preview-box {
          background: var(--bg-tertiary);
          padding: 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          line-height: 1.4;
        }

        .inspector-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .stat-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          padding: 8px 10px;
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
        }

        .stat-card .lbl {
          font-size: 10px;
          color: var(--text-muted);
        }

        .stat-card .val {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .btn-regen-item {
          width: 100%;
          padding: 9px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 12px;
          font-weight: 700;
          color: var(--brand-accent);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .btn-regen-item:hover {
          background: var(--brand-accent);
          color: white;
        }

        .validation-list {
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .validation-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .val-rule-title {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .val-rule-desc {
          font-size: 11.5px;
          color: var(--text-muted);
        }

        @media (max-width: 1024px) {
          .review-split-grid { grid-template-columns: 1fr; }
          .signoff-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};
