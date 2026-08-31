import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  GraduationCap,
  Check,
  Layers,
  Search,
  ChevronDown,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { mockUnitHealth, mockSubjects } from '../../mock/mockData';
import type { UnitHealth } from '../../types';

// Subject-specific health diagnostic dataset
const subjectHealthData: Record<string, UnitHealth[]> = {
  CS3501: mockUnitHealth,
  CS3492: [
    {
      unit: 1,
      title: 'Relational Model & ER Diagrams',
      totalQuestions: 46,
      healthScore: 91,
      status: 'Healthy',
      issues: [],
      recommendations: ['Maintain strong coverage of ER-to-Relational mapping problems.']
    },
    {
      unit: 2,
      title: 'SQL & Advanced Querying',
      totalQuestions: 54,
      healthScore: 96,
      status: 'Healthy',
      issues: [],
      recommendations: ['Optimal balance across complex nested queries, triggers, and joins.']
    },
    {
      unit: 3,
      title: 'Normalization & Functional Dependencies',
      totalQuestions: 28,
      healthScore: 68,
      status: 'Weak',
      issues: [
        'Low ratio of BCNF vs 3NF decomposition questions.',
        'Missing multi-valued dependency (4NF) numerical problems.'
      ],
      recommendations: ['Generate 5 new hard-level questions for Lossless Join & Dependency Preservation.']
    },
    {
      unit: 4,
      title: 'Transaction Processing & Concurrency Control',
      totalQuestions: 37,
      healthScore: 76,
      status: 'Needs Attention',
      issues: [
        'Need more scenario-based questions on Strict 2PL and Deadlock recovery.',
        'Limited questions on Timestamp Ordering protocol.'
      ],
      recommendations: ['Add 4 Part-B analytical questions covering Serializable Schedules.']
    },
    {
      unit: 5,
      title: 'NoSQL & Distributed Databases',
      totalQuestions: 50,
      healthScore: 84,
      status: 'Healthy',
      issues: ['Slightly lower count of CAP theorem application questions.'],
      recommendations: ['Add 3 questions on MongoDB aggregation pipelines & Sharding.']
    }
  ],
  CS3591: [
    {
      unit: 1,
      title: 'Physical Layer & Data Link Controls',
      totalQuestions: 40,
      healthScore: 90,
      status: 'Healthy',
      issues: [],
      recommendations: ['Strong pool of CRC and Hamming code calculation questions.']
    },
    {
      unit: 2,
      title: 'Medium Access & Wireless Networks',
      totalQuestions: 36,
      healthScore: 85,
      status: 'Healthy',
      issues: ['Minor gap in CSMA/CA binary exponential backoff questions.'],
      recommendations: ['Include 3 additional numericals on sliding window protocol efficiency.']
    },
    {
      unit: 3,
      title: 'Network Layer & Routing Protocols',
      totalQuestions: 26,
      healthScore: 64,
      status: 'Weak',
      issues: [
        'Shortage of CIDR subnetting and supernetting numericals.',
        'Limited Link State vs Distance Vector comparison proofs.'
      ],
      recommendations: ['Add 6 high-rigor questions for Dijkstra routing & IPv6 transition.']
    },
    {
      unit: 4,
      title: 'Transport Layer Protocols (TCP/UDP)',
      totalQuestions: 38,
      healthScore: 79,
      status: 'Needs Attention',
      issues: ['Low proportion of TCP congestion control slow-start graph problems.'],
      recommendations: ['Generate 4 analytical questions on AIMD and TCP Reno vs Tahoe.']
    },
    {
      unit: 5,
      title: 'Application Layer & Network Security',
      totalQuestions: 42,
      healthScore: 93,
      status: 'Healthy',
      issues: [],
      recommendations: ['Well-distributed questions covering DNS, SMTP, RSA and TLS handshake.']
    }
  ],
  CS3401: [
    {
      unit: 1,
      title: 'Software Process Models & Agile',
      totalQuestions: 32,
      healthScore: 94,
      status: 'Healthy',
      issues: [],
      recommendations: ['Comprehensive question bank across Scrum, Kanban, and Waterfall models.']
    },
    {
      unit: 2,
      title: 'Requirements Engineering & Modeling',
      totalQuestions: 28,
      healthScore: 86,
      status: 'Healthy',
      issues: ['Few questions testing Use-Case narrative specifications.'],
      recommendations: ['Add 2 case study questions on DFD level-2 modeling.']
    },
    {
      unit: 3,
      title: 'Architectural & Component Design',
      totalQuestions: 22,
      healthScore: 71,
      status: 'Needs Attention',
      issues: ['Under-represented Microservices and Event-Driven architecture patterns.'],
      recommendations: ['Upload 4 design pattern questions (Factory, Observer, Singleton).']
    },
    {
      unit: 4,
      title: 'Software Testing & Verification',
      totalQuestions: 18,
      healthScore: 62,
      status: 'Weak',
      issues: [
        'Critical shortage of Basis Path testing and Cyclomatic complexity problems.',
        'Zero mutation testing questions.'
      ],
      recommendations: ['Generate 5 Part-B questions for Control Flow Graph and Boundary Value Analysis.']
    },
    {
      unit: 5,
      title: 'Project Management & DevOps',
      totalQuestions: 20,
      healthScore: 87,
      status: 'Healthy',
      issues: [],
      recommendations: ['Good coverage of COCOMO II estimation and CI/CD pipelines.']
    }
  ]
};

export const QuestionHealthView: React.FC = () => {
  const { setActiveTab, addToast } = useApp();
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>(mockSubjects[0].code);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    };
    if (isSearchDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isSearchDropdownOpen]);

  const selectedSubject = useMemo(
    () => mockSubjects.find((s) => s.code === selectedSubjectCode) || mockSubjects[0],
    [selectedSubjectCode]
  );

  // Filter subjects based on query
  const filteredSubjects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return mockSubjects;
    return mockSubjects.filter(
      (s) =>
        s.code.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        `sem ${s.semester}`.includes(q) ||
        `semester ${s.semester}`.includes(q)
    );
  }, [searchQuery]);

  const currentUnitHealth = useMemo<UnitHealth[]>(() => {
    if (subjectHealthData[selectedSubjectCode]) {
      return subjectHealthData[selectedSubjectCode];
    }
    return selectedSubject.units.map((unit) => ({
      unit: unit.number,
      title: unit.name,
      totalQuestions: 30,
      healthScore: 85,
      status: 'Healthy',
      issues: [],
      recommendations: ['Question coverage matches curriculum guidelines.']
    }));
  }, [selectedSubjectCode, selectedSubject]);

  const handleImproveUnit = (unitNumber: number) => {
    addToast(
      `Triggered AI question generation recommendation for ${selectedSubject.code} Unit ${unitNumber}. Redirecting to AI Generator...`,
      'info'
    );
    setActiveTab('ai-generator');
  };

  const avgHealth = useMemo(() => {
    if (!currentUnitHealth.length) return 0;
    return Math.round(
      currentUnitHealth.reduce((sum, u) => sum + u.healthScore, 0) / currentUnitHealth.length
    );
  }, [currentUnitHealth]);

  const totalQuestionsInPool = useMemo(() => {
    return currentUnitHealth.reduce((sum, u) => sum + u.totalQuestions, 0);
  }, [currentUnitHealth]);

  return (
    <div className="health-container">
      <Breadcrumb />

      {/* Page Header */}
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

        <button
          className="btn-secondary"
          onClick={() =>
            addToast(`Re-running unit health diagnostic scans for ${selectedSubject.code}...`, 'success')
          }
        >
          <RefreshCw size={15} /> Re-scan Unit Health
        </button>
      </div>

      {/* ── SCALABLE SEARCH BAR SUBJECT SELECTOR BAR ── */}
      <div className="health-control-bar">
        <div className="search-selector-section" ref={dropdownRef}>
          <label className="selector-field-label">
            <GraduationCap size={14} className="text-blue-600" />
            <span>Search &amp; Select Subject:</span>
          </label>

          {/* Search Bar Type Trigger Button */}
          <div className="search-dropdown-wrapper">
            <button
              type="button"
              className={`subject-search-trigger-btn ${isSearchDropdownOpen ? 'open' : ''}`}
              onClick={() => setIsSearchDropdownOpen(!isSearchDropdownOpen)}
              title="Click to search and choose from all subjects"
            >
              <div className="trigger-left">
                <Search size={16} className="trigger-search-icon" />
                <span className="trigger-code-tag">{selectedSubject.code}</span>
                <span className="trigger-subject-name">{selectedSubject.name}</span>
                <span className="trigger-dept-badge">Sem {selectedSubject.semester}</span>
              </div>
              <div className="trigger-right">
                <span className="trigger-hint-text">Search any subject</span>
                <ChevronDown size={16} className={`chevron-arrow ${isSearchDropdownOpen ? 'rotated' : ''}`} />
              </div>
            </button>

            {/* Dropdown Popup with Live Filter Search */}
            {isSearchDropdownOpen && (
              <div className="subject-search-popup">
                <div className="popup-search-header">
                  <Search size={15} className="text-muted" />
                  <input
                    type="text"
                    className="popup-search-input"
                    placeholder="Search by code (e.g. CS3501), subject name, dept..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="popup-clear-btn"
                      onClick={() => setSearchQuery('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="popup-results-meta">
                  <span>Found {filteredSubjects.length} of {mockSubjects.length} subjects</span>
                </div>

                <div className="popup-subject-list">
                  {filteredSubjects.length === 0 ? (
                    <div className="no-results-box">
                      <p>No subjects matching "<strong>{searchQuery}</strong>"</p>
                      <span className="text-xs text-muted">Try searching by subject code or keyword</span>
                    </div>
                  ) : (
                    filteredSubjects.map((sub) => {
                      const isSelected = sub.code === selectedSubjectCode;
                      const healthUnits = subjectHealthData[sub.code] || [];
                      const subAvg = healthUnits.length > 0
                        ? Math.round(healthUnits.reduce((acc, u) => acc + u.healthScore, 0) / healthUnits.length)
                        : 85;

                      return (
                        <div
                          key={sub.code}
                          className={`subject-option-row ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedSubjectCode(sub.code);
                            setIsSearchDropdownOpen(false);
                            setSearchQuery('');
                            addToast(`Loaded diagnostics for ${sub.code} — ${sub.name}`, 'info');
                          }}
                        >
                          <div className="opt-left">
                            <span className="opt-code-tag">{sub.code}</span>
                            <div className="opt-details">
                              <span className="opt-title">{sub.name}</span>
                              <span className="opt-sub">
                                {sub.department} • Semester {sub.semester} • {sub.totalQuestions} Questions
                              </span>
                            </div>
                          </div>

                          <div className="opt-right">
                            <span className={`opt-health-pill ${subAvg >= 80 ? 'health-good' : subAvg >= 70 ? 'health-warn' : 'health-danger'}`}>
                              {subAvg}% Health
                            </span>
                            {isSelected && <Check size={16} className="text-blue-600 font-bold" />}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Switch Action */}
        <div className="quick-switch-pills">
          <span className="quick-label">Quick Presets:</span>
          {mockSubjects.map((sub) => (
            <button
              key={sub.code}
              type="button"
              className={`preset-chip-btn ${sub.code === selectedSubjectCode ? 'active' : ''}`}
              onClick={() => {
                setSelectedSubjectCode(sub.code);
                addToast(`Switched to ${sub.code}`, 'info');
              }}
            >
              {sub.code}
            </button>
          ))}
        </div>
      </div>

      {/* ── ACTIVE SUBJECT DIAGNOSTIC SUMMARY BAR ── */}
      <div className="active-subject-health-summary">
        <div className="summary-left">
          <span className="active-code-chip">{selectedSubject.code}</span>
          <div>
            <h3 className="active-subject-heading">{selectedSubject.name}</h3>
            <p className="active-subject-dept">
              {selectedSubject.department} • Regulation {selectedSubject.regulation} • Semester {selectedSubject.semester}
            </p>
          </div>
        </div>
        <div className="summary-right-metrics">
          <div className="metric-box">
            <span className="metric-label">TOTAL POOL</span>
            <span className="metric-val">{totalQuestionsInPool} Questions</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">AVERAGE HEALTH</span>
            <span className="metric-val text-blue-600 font-bold">{avgHealth}%</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">STATUS BREAKDOWN</span>
            <div className="status-counts-row">
              <span className="count-tag count-healthy">
                {currentUnitHealth.filter((u) => u.status === 'Healthy').length} Healthy
              </span>
              <span className="count-tag count-warn">
                {currentUnitHealth.filter((u) => u.status === 'Needs Attention').length} Attention
              </span>
              <span className="count-tag count-weak">
                {currentUnitHealth.filter((u) => u.status === 'Weak').length} Weak
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── UNIT HEALTH CARDS GRID FOR SELECTED SUBJECT ── */}
      <div className="section-units-header">
        <div className="units-header-title">
          <Layers size={16} className="text-blue-600" />
          <h4>Unit Health Breakdown for {selectedSubject.code} — {selectedSubject.name}</h4>
        </div>
        <span className="text-xs text-muted">
          Displaying {currentUnitHealth.length} syllabus units
        </span>
      </div>

      <div className="health-cards-grid">
        {currentUnitHealth.map((uh) => (
          <div
            key={uh.unit}
            className={`health-card health-${uh.status.toLowerCase().replace(' ', '-')}`}
          >
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
                    uh.healthScore > 80
                      ? 'var(--success)'
                      : uh.healthScore > 70
                      ? 'var(--warning)'
                      : 'var(--danger)'
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

        /* Scalable Search Control Bar */
        .health-control-bar {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 16px 20px;
          margin-bottom: 20px;
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .search-selector-section {
          flex: 1;
          min-width: 320px;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .selector-field-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .search-dropdown-wrapper {
          position: relative;
          width: 100%;
        }

        .subject-search-trigger-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background: var(--bg-tertiary);
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.15s ease;
          gap: 12px;
        }

        .subject-search-trigger-btn:hover,
        .subject-search-trigger-btn.open {
          border-color: var(--brand-accent);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
          background: var(--bg-hover);
        }

        .trigger-left {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
        }

        .trigger-search-icon {
          color: var(--brand-accent);
          flex-shrink: 0;
        }

        .trigger-code-tag {
          background: var(--brand-accent);
          color: white;
          font-size: 11px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          flex-shrink: 0;
        }

        .trigger-subject-name {
          font-size: 13.5px;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .trigger-dept-badge {
          font-size: 11px;
          color: var(--text-muted);
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          padding: 1px 6px;
          border-radius: var(--radius-sm);
          flex-shrink: 0;
        }

        .trigger-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .trigger-hint-text {
          font-size: 11.5px;
          color: var(--text-muted);
        }

        .chevron-arrow {
          color: var(--text-muted);
          transition: transform 0.2s ease;
        }

        .chevron-arrow.rotated {
          transform: rotate(180deg);
        }

        /* Search Dropdown Popup */
        .subject-search-popup {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          box-shadow: 0 16px 36px -4px rgba(0, 0, 0, 0.25), 0 6px 16px -2px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          overflow: hidden;
          animation: dropdownFade 0.15s ease;
        }

        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .popup-search-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: var(--bg-tertiary);
          border-bottom: 1px solid var(--border-color);
        }

        .popup-search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 13.5px;
          font-weight: 500;
        }

        .popup-clear-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .popup-results-meta {
          padding: 6px 16px;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
        }

        .popup-subject-list {
          max-height: 280px;
          overflow-y: auto;
          padding: 6px 0;
        }

        .no-results-box {
          padding: 24px;
          text-align: center;
          color: var(--text-secondary);
          font-size: 13px;
        }

        .subject-option-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          cursor: pointer;
          transition: background 0.12s ease;
          border-left: 3px solid transparent;
        }

        .subject-option-row:hover {
          background: var(--bg-hover);
        }

        .subject-option-row.selected {
          background: rgba(37, 99, 235, 0.08);
          border-left-color: var(--brand-accent);
        }

        .opt-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .opt-code-tag {
          background: var(--brand-accent);
          color: white;
          font-size: 11px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: var(--radius-sm);
        }

        .opt-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .opt-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .opt-sub {
          font-size: 11px;
          color: var(--text-muted);
        }

        .opt-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .opt-health-pill {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .health-good {
          background: rgba(16, 185, 129, 0.12);
          color: #059669;
        }

        .health-warn {
          background: rgba(245, 158, 11, 0.12);
          color: #d97706;
        }

        .health-danger {
          background: rgba(239, 68, 68, 0.12);
          color: #dc2626;
        }

        /* Quick Switch Pills */
        .quick-switch-pills {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .quick-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .preset-chip-btn {
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 700;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .preset-chip-btn:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
          border-color: var(--brand-accent);
        }

        .preset-chip-btn.active {
          background: var(--brand-accent);
          color: white;
          border-color: var(--brand-accent);
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
        }

        /* Active Subject Context Bar */
        .active-subject-health-summary {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 14px 18px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          box-shadow: var(--shadow-sm);
        }

        .summary-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .active-code-chip {
          background: linear-gradient(135deg, #2563eb, #6366f1);
          color: white;
          font-size: 13px;
          font-weight: 800;
          padding: 6px 12px;
          border-radius: var(--radius-md);
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
        }

        .active-subject-heading {
          font-size: 15px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 2px 0;
        }

        .active-subject-dept {
          font-size: 12px;
          color: var(--text-secondary);
          margin: 0;
        }

        .summary-right-metrics {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .metric-box {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .metric-label {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .metric-val {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .status-counts-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .count-tag {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: var(--radius-sm);
        }

        .count-healthy {
          background: rgba(16, 185, 129, 0.12);
          color: #059669;
        }

        .count-warn {
          background: rgba(245, 158, 11, 0.12);
          color: #d97706;
        }

        .count-weak {
          background: rgba(239, 68, 68, 0.12);
          color: #dc2626;
        }

        /* Section Units Header */
        .section-units-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          padding: 0 2px;
        }

        .units-header-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .units-header-title h4 {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        /* Health Cards Grid */
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
          .health-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
