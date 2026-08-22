import React, { useState, useEffect } from 'react';
import { Search, X, FileText, Database, Layers, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockSubjects } from '../../mock/mockData';

export const GlobalSearchModal: React.FC = () => {
  const { isGlobalSearchOpen, setIsGlobalSearchOpen, questions, setActiveTab, setSelectedQuestion } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsGlobalSearchOpen]);

  if (!isGlobalSearchOpen) return null;

  const filteredQuestions = query.trim()
    ? questions.filter(
        (q) =>
          q.text.toLowerCase().includes(query.toLowerCase()) ||
          q.id.toLowerCase().includes(query.toLowerCase()) ||
          q.topic.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const filteredSubjects = query.trim()
    ? mockSubjects.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.code.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="search-modal-overlay" onClick={() => setIsGlobalSearchOpen(false)}>
      <div className="search-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-header">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            className="search-modal-input"
            placeholder="Search questions, subjects, examinations, audit logs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button className="close-btn" onClick={() => setIsGlobalSearchOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="search-results-body">
          {!query.trim() ? (
            <div className="search-suggestions">
              <span className="suggestion-title">Quick Jumps</span>
              <div className="suggestion-chips">
                <button
                  onClick={() => {
                    setActiveTab('question-bank');
                    setIsGlobalSearchOpen(false);
                  }}
                >
                  <Database size={14} /> Question Bank Repository
                </button>
                <button
                  onClick={() => {
                    setActiveTab('blueprint');
                    setIsGlobalSearchOpen(false);
                  }}
                >
                  <Layers size={14} /> Blueprint Studio
                </button>
                <button
                  onClick={() => {
                    setActiveTab('review-workspace');
                    setIsGlobalSearchOpen(false);
                  }}
                >
                  <FileText size={14} /> Review Queue
                </button>
                <button
                  onClick={() => {
                    setActiveTab('security-audit');
                    setIsGlobalSearchOpen(false);
                  }}
                >
                  <Shield size={14} /> Audit Logs
                </button>
              </div>
            </div>
          ) : (
            <div className="results-list">
              {filteredSubjects.length > 0 && (
                <div className="result-group">
                  <div className="result-group-title">Subjects ({filteredSubjects.length})</div>
                  {filteredSubjects.map((s) => (
                    <div
                      key={s.code}
                      className="result-item"
                      onClick={() => {
                        setActiveTab('question-bank');
                        setIsGlobalSearchOpen(false);
                      }}
                    >
                      <Layers size={16} className="text-blue-600" />
                      <div>
                        <div className="item-title">{s.code} - {s.name}</div>
                        <div className="item-sub">{s.department} • Semester {s.semester}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredQuestions.length > 0 && (
                <div className="result-group">
                  <div className="result-group-title">Questions ({filteredQuestions.length})</div>
                  {filteredQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="result-item"
                      onClick={() => {
                        setSelectedQuestion(q);
                        setActiveTab('question-bank');
                        setIsGlobalSearchOpen(false);
                      }}
                    >
                      <Database size={16} className="text-indigo-600" />
                      <div>
                        <div className="item-title">{q.id} ({q.bloom} • {q.difficulty})</div>
                        <div className="item-sub">{q.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredSubjects.length === 0 && filteredQuestions.length === 0 && (
                <div className="no-results">No matching records found for "{query}".</div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .search-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(3px);
          z-index: 110;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 80px;
        }

        .search-modal-box {
          width: 580px;
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-xl);
          overflow: hidden;
        }

        .search-input-header {
          display: flex;
          align-items: center;
          padding: 14px 18px;
          border-bottom: 1px solid var(--border-color);
          gap: 12px;
        }

        .search-icon {
          color: var(--text-muted);
        }

        .search-modal-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 15px;
          color: var(--text-primary);
        }

        .search-results-body {
          max-height: 380px;
          overflow-y: auto;
          padding: 16px;
        }

        .suggestion-title {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          display: block;
          margin-bottom: 10px;
        }

        .suggestion-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .suggestion-chips button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          cursor: pointer;
          font-size: 13px;
          color: var(--text-secondary);
          transition: all 0.15s ease;
        }

        .suggestion-chips button:hover {
          border-color: var(--brand-accent);
          color: var(--brand-accent);
          background: var(--bg-secondary);
        }

        .result-group {
          margin-bottom: 14px;
        }

        .result-group-title {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .result-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .result-item:hover {
          background: var(--bg-tertiary);
        }

        .item-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .item-sub {
          font-size: 12px;
          color: var(--text-muted);
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .no-results {
          text-align: center;
          color: var(--text-muted);
          padding: 30px 0;
        }
      `}</style>
    </div>
  );
};
