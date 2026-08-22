import React, { useState, useEffect } from 'react';
import {
  Database,
  Plus,
  UploadCloud,
  Activity,
  Search,
  Eye,
  Sparkles,
  X,
  Brain
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import type { Question, BloomLevel, Difficulty, QuestionType } from '../../types';
import { mockSubjects } from '../../mock/mockData';
import { UploadWizardModal } from './UploadWizardModal';
import { QuestionHealthView } from './QuestionHealthView';

type QBankSubTab = 'repository' | 'upload' | 'health';

export const QuestionBankView: React.FC = () => {
  const {
    questions,
    selectedQuestion,
    setSelectedQuestion,
    addQuestion,
    activeTab,
    addToast
  } = useApp();

  const [subTab, setSubTab] = useState<QBankSubTab>('repository');

  useEffect(() => {
    if (activeTab === 'upload-bank') {
      setSubTab('upload');
    } else if (activeTab === 'question-health') {
      setSubTab('health');
    } else if (activeTab === 'question-bank') {
      setSubTab('repository');
    }
  }, [activeTab]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('CS3501');
  const [selectedUnit, setSelectedUnit] = useState<number | 'ALL'>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedBloom, setSelectedBloom] = useState<string>('ALL');

  // Modal State for Add Question
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newText, setNewText] = useState('');
  const [newUnit, setNewUnit] = useState(1);
  const [newMarks, setNewMarks] = useState(13);
  const [newType, setNewType] = useState<QuestionType>('Part B (Long)');

  // AI Analysis trigger state
  const [aiAnalysis, setAiAnalysis] = useState<{
    difficulty: Difficulty;
    bloom: BloomLevel;
    co: string;
    novelty: number;
    duplicateRisk: 'Low' | 'Medium' | 'High';
  } | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Filtered Questions list
  const filteredQuestions = questions.filter((q) => {
    if (selectedSubject !== 'ALL' && q.subjectCode !== selectedSubject) return false;
    if (selectedUnit !== 'ALL' && q.unit !== selectedUnit) return false;
    if (selectedDifficulty !== 'ALL' && q.difficulty !== selectedDifficulty) return false;
    if (selectedBloom !== 'ALL' && q.bloom !== selectedBloom) return false;
    if (
      searchQuery.trim() &&
      !q.text.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !q.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !q.topic.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleRunAiAnalysis = () => {
    if (!newText.trim()) {
      addToast('Please enter question text before running AI analysis.', 'warning');
      return;
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAiAnalysis({
        difficulty: newText.length > 120 ? 'Hard' : 'Moderate',
        bloom: newText.includes('Prove') || newText.includes('Evaluate') ? 'Evaluate' : 'Apply',
        co: `CO${newUnit}`,
        novelty: 95,
        duplicateRisk: 'Low'
      });
      addToast('AI analysis complete. Results are shown below.', 'success');
    }, 1200);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newQ: Question = {
      id: `Q-${selectedSubject}-${Math.floor(Math.random() * 900 + 100)}`,
      subjectCode: selectedSubject,
      subjectName: mockSubjects.find((s) => s.code === selectedSubject)?.name || 'Theory of Computation',
      unit: newUnit,
      unitTitle: `Unit ${newUnit} Topics`,
      text: newText,
      marks: newMarks,
      type: newType,
      difficulty: aiAnalysis ? aiAnalysis.difficulty : 'Moderate',
      importance: 'Important',
      bloom: aiAnalysis ? aiAnalysis.bloom : 'Apply',
      co: aiAnalysis ? aiAnalysis.co : `CO${newUnit}`,
      topic: 'Faculty Contribution',
      noveltyScore: aiAnalysis ? aiAnalysis.novelty : 91,
      duplicateRisk: aiAnalysis ? aiAnalysis.duplicateRisk : 'Low',
      source: 'Faculty Question Bank',
      status: 'Approved',
      createdAt: new Date().toISOString().split('T')[0],
      author: 'Dharshini J'
    };

    addQuestion(newQ);
    setIsAddModalOpen(false);
    setNewText('');
    setAiAnalysis(null);
    addToast('Question added to the bank successfully!', 'success');
  };

  return (
    <div className="question-bank-container">
      <Breadcrumb />

      {/* Page Header */}
      <div className="page-header flex-col align-start gap-3">
        <div className="module-header-title w-full">
          <div>
            <h2 className="page-title">
              <Database size={22} className="text-blue-600 inline-block mr-2" />
              Question Bank
            </h2>
            <p className="page-subtitle">
              Browse, search, and manage all exam questions in one place.
            </p>
          </div>
        </div>

        {/* Sub-navigation tabs */}
        <div className="module-subnav-bar w-full">
          <button
            className={`subnav-btn ${subTab === 'repository' ? 'active' : ''}`}
            onClick={() => setSubTab('repository')}
          >
            <Database size={15} /> All Questions
          </button>
          <button
            className={`subnav-btn ${subTab === 'upload' ? 'active' : ''}`}
            onClick={() => setSubTab('upload')}
          >
            <UploadCloud size={15} /> Upload Questions
          </button>
          <button
            className={`subnav-btn ${subTab === 'health' ? 'active' : ''}`}
            onClick={() => setSubTab('health')}
          >
            <Activity size={15} /> Health & Stats
          </button>
        </div>
      </div>

      {subTab === 'upload' && <UploadWizardModal />}
      {subTab === 'health' && <QuestionHealthView />}

      {subTab === 'repository' && (
        <>
          {/* Action bar above filter */}
          <div className="qbank-action-bar">
            <div className="qbank-action-info">
              <span className="qbank-count">{filteredQuestions.length} questions found</span>
            </div>
            <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={15} /> Add Single Question
            </button>
          </div>
          {/* Filter Bar */}
          <div className="filter-bar-card">
            <div className="filter-group">
              <label>Subject:</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="filter-select"
              >
                {mockSubjects.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Unit:</label>
              <select
                value={selectedUnit}
                onChange={(e) =>
                  setSelectedUnit(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))
                }
                className="filter-select"
              >
                <option value="ALL">All Units</option>
                <option value={1}>Unit 1</option>
                <option value={2}>Unit 2</option>
                <option value={3}>Unit 3</option>
                <option value={4}>Unit 4</option>
                <option value={5}>Unit 5</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Difficulty:</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Cognitive Level:</label>
              <select
                value={selectedBloom}
                onChange={(e) => setSelectedBloom(e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All Levels</option>
                <option value="Remember">Remember</option>
                <option value="Understand">Understand</option>
                <option value="Apply">Apply</option>
                <option value="Analyze">Analyze</option>
                <option value="Evaluate">Evaluate</option>
                <option value="Create">Create</option>
              </select>
            </div>

            <div className="filter-search-input">
              <Search size={14} className="text-muted" />
              <input
                type="text"
                placeholder="Search by question text or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Questions Table */}
          <div className="table-container shadow-sm">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Question ID & Text</th>
                  <th>Unit</th>
                  <th>Marks</th>
                  <th>Difficulty</th>
                  <th>Cognitive Level</th>
                  <th>Course Goal</th>
                  <th>Originality</th>
                  <th>Status</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-muted">
                      No questions match your selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredQuestions.map((q) => (
                    <tr key={q.id} className={selectedQuestion?.id === q.id ? 'row-selected' : ''}>
                      <td style={{ maxWidth: '400px' }}>
                        <div className="font-semibold text-primary mb-1">{q.id}</div>
                        <div className="text-xs text-secondary question-snippet">{q.text}</div>
                      </td>
                      <td>
                        <span className="unit-badge">Unit {q.unit}</span>
                      </td>
                      <td>
                        <strong>{q.marks} M</strong>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            q.difficulty === 'Easy'
                              ? 'badge-success'
                              : q.difficulty === 'Moderate'
                              ? 'badge-warning'
                              : 'badge-danger'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-info">{q.bloom}</span>
                      </td>
                      <td>
                        <span className="co-badge">{q.co}</span>
                      </td>
                      <td>
                        <span className="novelty-score">{q.noveltyScore}%</span>
                      </td>
                      <td>
                        <span className="badge badge-approved">✓ Approved</span>
                      </td>
                      <td>
                        <button
                          className="btn-icon"
                          onClick={() => setSelectedQuestion(q)}
                          title="View Question Details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Question Details Drawer */}
          {selectedQuestion && (
            <div className="drawer-overlay" onClick={() => setSelectedQuestion(null)}>
              <div className="drawer-box" onClick={(e) => e.stopPropagation()}>
                <div className="drawer-header">
                  <h3>Question Details</h3>
                  <button className="btn-icon" onClick={() => setSelectedQuestion(null)}>
                    <X size={18} />
                  </button>
                </div>

                <div className="drawer-content">
                  <div className="drawer-section">
                    <span className="drawer-section-title">Question Text</span>
                    <div className="question-text-box">{selectedQuestion.text}</div>
                  </div>

                  <div className="drawer-section">
                    <span className="drawer-section-title">Question Info</span>
                    <div className="meta-grid">
                      <div className="meta-item">
                        <span className="meta-label">ID</span>
                        <span className="meta-val">{selectedQuestion.id}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Subject</span>
                        <span className="meta-val">{selectedQuestion.subjectCode}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Unit</span>
                        <span className="meta-val">Unit {selectedQuestion.unit}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Marks</span>
                        <span className="meta-val">{selectedQuestion.marks} Marks</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Difficulty</span>
                        <span className="meta-val">{selectedQuestion.difficulty}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Cognitive Level</span>
                        <span className="meta-val">{selectedQuestion.bloom}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Course Goal</span>
                        <span className="meta-val">{selectedQuestion.co}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Added By</span>
                        <span className="meta-val">{selectedQuestion.author}</span>
                      </div>
                    </div>
                  </div>

                  <div className="drawer-section ai-analysis-card">
                    <div className="ai-card-title">
                      <Brain size={18} className="text-indigo-600" />
                      <span>AI Quality Check</span>
                    </div>
                    <div className="ai-stats-row">
                      <div className="ai-stat-box">
                        <span className="ai-stat-num">{selectedQuestion.noveltyScore}%</span>
                        <span className="ai-stat-label">Originality Score</span>
                      </div>
                      <div className="ai-stat-box">
                        <span className="ai-stat-num text-green-600">
                          {selectedQuestion.duplicateRisk}
                        </span>
                        <span className="ai-stat-label">Duplicate Risk</span>
                      </div>
                      <div className="ai-stat-box">
                        <span className="ai-stat-num">100%</span>
                        <span className="ai-stat-label">Syllabus Match</span>
                      </div>
                    </div>
                    <div className="ai-source-tag">
                      Source: <strong>{selectedQuestion.source}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Single Question Modal */}
          {isAddModalOpen && (
            <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
              <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Add a New Question</h3>
                  <button className="btn-icon" onClick={() => setIsAddModalOpen(false)}>
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveQuestion}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Subject</label>
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                      >
                        {mockSubjects.map((s) => (
                          <option key={s.code} value={s.code}>
                            {s.code} - {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-grid-3">
                      <div className="form-group">
                        <label>Unit</label>
                        <select
                          value={newUnit}
                          onChange={(e) => setNewUnit(Number(e.target.value))}
                        >
                          <option value={1}>Unit 1</option>
                          <option value={2}>Unit 2</option>
                          <option value={3}>Unit 3</option>
                          <option value={4}>Unit 4</option>
                          <option value={5}>Unit 5</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Marks</label>
                        <input
                          type="number"
                          value={newMarks}
                          onChange={(e) => setNewMarks(Number(e.target.value))}
                        />
                      </div>

                      <div className="form-group">
                        <label>Question Type</label>
                        <select
                          value={newType}
                          onChange={(e) => setNewType(e.target.value as QuestionType)}
                        >
                          <option value="Part A (Short)">Part A — Short Answer</option>
                          <option value="Part B (Long)">Part B — Long Answer</option>
                          <option value="Part C (Analytical)">Part C — Analytical</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Question Text</label>
                      <textarea
                        rows={4}
                        placeholder="Type the full question here..."
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    {/* AI Analysis */}
                    <div className="ai-trigger-section">
                      <button
                        type="button"
                        className="btn-ai-analyze"
                        onClick={handleRunAiAnalysis}
                        disabled={isAnalyzing}
                      >
                        <Sparkles size={16} />
                        {isAnalyzing
                          ? 'Analyzing...'
                          : 'Check Question Quality with AI'}
                      </button>

                      {aiAnalysis && (
                        <div className="ai-result-panel">
                          <div className="font-semibold text-xs text-indigo-700 mb-1">
                            ✓ AI Analysis Complete:
                          </div>
                          <div className="ai-tags">
                            <span>
                              Difficulty: <strong>{aiAnalysis.difficulty}</strong>
                            </span>
                            <span>
                              Cognitive Level: <strong>{aiAnalysis.bloom}</strong>
                            </span>
                            <span>
                              Course Goal: <strong>{aiAnalysis.co}</strong>
                            </span>
                            <span>
                              Originality: <strong>{aiAnalysis.novelty}%</strong>
                            </span>
                            <span>
                              Duplicate Risk: <strong>{aiAnalysis.duplicateRisk}</strong>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setIsAddModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Save Question
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      <style>{`
        .question-bank-container {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .page-title {
          font-size: 21px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .page-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          margin-top: 3px;
        }

        .qbank-action-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          padding: 10px 0 4px 0;
        }

        .qbank-action-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .qbank-count {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
        }

        .filter-bar-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
          box-shadow: var(--shadow-sm);
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .filter-group label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .filter-select {
          padding: 6px 10px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background: var(--bg-tertiary);
          font-size: 12px;
          color: var(--text-primary);
          outline: none;
          cursor: pointer;
          transition: border-color 0.15s;
        }

        .filter-select:focus {
          border-color: var(--border-focus);
        }

        .filter-search-input {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 7px 12px;
          min-width: 220px;
          transition: border-color 0.15s;
        }

        .filter-search-input:focus-within {
          border-color: var(--border-focus);
        }

        .filter-search-input input {
          border: none;
          background: transparent;
          font-size: 12px;
          outline: none;
          width: 100%;
          color: var(--text-primary);
        }

        .question-snippet {
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .unit-badge {
          background: var(--bg-tertiary);
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .co-badge {
          background: #e0e7ff;
          color: #3730a3;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
        }

        .novelty-score {
          font-size: 13px;
          font-weight: 700;
          color: var(--success);
        }

        .row-selected {
          background-color: var(--info-bg) !important;
        }

        /* Drawer & Modal Overlay */
        .drawer-overlay, .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(3px);
          z-index: 100;
          display: flex;
          justify-content: flex-end;
        }

        .modal-overlay {
          justify-content: center;
          align-items: center;
        }

        .drawer-box {
          width: 440px;
          height: 100%;
          background: var(--bg-secondary);
          border-left: 1px solid var(--border-color);
          box-shadow: var(--shadow-xl);
          display: flex;
          flex-direction: column;
          animation: slideInDrawer 0.22s ease;
        }

        @keyframes slideInDrawer {
          from { transform: translateX(40px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .drawer-header, .modal-header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--bg-tertiary);
        }

        .drawer-header h3, .modal-header h3 {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .drawer-content {
          padding: 20px;
          overflow-y: auto;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .drawer-section-title {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 8px;
        }

        .question-text-box {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          padding: 14px;
          border-radius: var(--radius-md);
          font-size: 13px;
          line-height: 1.6;
          color: var(--text-primary);
        }

        .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .meta-item {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          padding: 8px 10px;
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .meta-label {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .meta-val {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .ai-analysis-card {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
          border: 1px solid #bae6fd;
          padding: 16px;
          border-radius: var(--radius-md);
        }

        .ai-card-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #0369a1;
          margin-bottom: 12px;
        }

        .ai-stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 10px;
        }

        .ai-stat-box {
          background: white;
          padding: 8px;
          border-radius: var(--radius-sm);
          text-align: center;
          border: 1px solid rgba(186, 230, 253, 0.5);
        }

        .ai-stat-num {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-primary);
          display: block;
        }

        .ai-stat-label {
          font-size: 10px;
          color: var(--text-muted);
          display: block;
          margin-top: 2px;
        }

        .ai-source-tag {
          font-size: 11px;
          color: #0369a1;
          padding-top: 6px;
          border-top: 1px solid rgba(186, 230, 253, 0.5);
          margin-top: 4px;
        }

        /* Modal */
        .modal-box {
          width: 560px;
          max-width: 95vw;
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--border-color);
          animation: popIn 0.2s ease;
        }

        @keyframes popIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .modal-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .modal-footer {
          padding: 14px 20px;
          border-top: 1px solid var(--border-color);
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          background: var(--bg-tertiary);
          border-radius: 0 0 var(--radius-lg) var(--radius-lg);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .form-group label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 8px 10px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background: var(--bg-tertiary);
          font-size: 13px;
          color: var(--text-primary);
          outline: none;
          resize: vertical;
          transition: border-color 0.15s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: var(--border-focus);
        }

        .form-grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
        }

        .ai-trigger-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ai-result-panel {
          background: linear-gradient(135deg, #eef2ff, #e0e7ff);
          border: 1px solid #c7d2fe;
          border-radius: var(--radius-md);
          padding: 12px;
        }

        .ai-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 6px;
        }

        .ai-tags span {
          background: white;
          border: 1px solid #c7d2fe;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          font-size: 11px;
          color: #4338ca;
        }
      `}</style>
    </div>
  );
};
