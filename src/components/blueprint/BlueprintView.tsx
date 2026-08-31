import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Layers,
  Sparkles,
  Save,
  ArrowRight,
  BookOpen,
  Search,
  Calendar,
  Clock,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Plus,
  Trash2,
  RotateCcw,
  Sliders,
  FileSpreadsheet,
  BrainCircuit,
  Gauge
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { mockBlueprint, mockSubjects } from '../../mock/mockData';

interface ExamPart {
  id: string;
  partName: string;
  choice: string;
  questionCount: number;
  marksPerQuestion: number;
}

export const BlueprintView: React.FC = () => {
  const { setActiveTab, addToast } = useApp();

  // ── Subject selection state ────────────────────────────
  const [selectedSubjectCode, setSelectedSubjectCode] = useState(mockSubjects[0].code);
  const [subjectSearchQuery, setSubjectSearchQuery] = useState('');
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);

  // ── Exam Date state (Allows typing + theme calendar) ────
  const [examDate, setExamDate] = useState('2026-11-14');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Parse current date for calendar navigation
  const parsedDate = useMemo(() => {
    const d = new Date(examDate);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [examDate]);

  const [calendarViewYear, setCalendarViewYear] = useState(parsedDate.getFullYear() || 2026);
  const [calendarViewMonth, setCalendarViewMonth] = useState(parsedDate.getMonth() || 10); // 0-indexed (10 = Nov)

  // ── Exam Duration state (Allows typing + quick presets) ──
  const [examDuration, setExamDuration] = useState('3 Hours');

  // Selected subject object
  const selectedSubject = useMemo(
    () => mockSubjects.find((s) => s.code === selectedSubjectCode) || mockSubjects[0],
    [selectedSubjectCode]
  );

  // Filtered subjects based on search query
  const filteredSubjects = useMemo(() => {
    if (!subjectSearchQuery.trim()) return mockSubjects;
    const q = subjectSearchQuery.toLowerCase();
    return mockSubjects.filter(
      (s) =>
        s.code.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
    );
  }, [subjectSearchQuery]);

  // ── 1. QUESTION STRUCTURE (Customizable & Editable) ─────
  const [examParts, setExamParts] = useState<ExamPart[]>([
    { id: 'p-1', partName: 'Part A', choice: 'Compulsory Short Answers', questionCount: 10, marksPerQuestion: 2 },
    { id: 'p-2', partName: 'Part B', choice: 'Either / Or Choice (5 Units)', questionCount: 5, marksPerQuestion: 13 },
    { id: 'p-3', partName: 'Part C', choice: 'Compulsory Analytical / Case Study', questionCount: 1, marksPerQuestion: 15 },
  ]);

  const totalCalculatedMarks = useMemo(() => {
    return examParts.reduce((sum, p) => sum + (p.questionCount * p.marksPerQuestion), 0);
  }, [examParts]);

  const handleUpdatePart = (id: string, field: keyof ExamPart, value: string | number) => {
    setExamParts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleAddPart = () => {
    const nextLetter = String.fromCharCode(65 + examParts.length); // D, E, etc.
    setExamParts((prev) => [
      ...prev,
      {
        id: `p-${Date.now()}`,
        partName: `Part ${nextLetter}`,
        choice: 'Optional / Additional Questions',
        questionCount: 2,
        marksPerQuestion: 5
      }
    ]);
  };

  const handleRemovePart = (id: string) => {
    if (examParts.length <= 1) {
      addToast('Examination must have at least one section.', 'warning');
      return;
    }
    setExamParts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleResetParts = () => {
    setExamParts([
      { id: 'p-1', partName: 'Part A', choice: 'Compulsory Short Answers', questionCount: 10, marksPerQuestion: 2 },
      { id: 'p-2', partName: 'Part B', choice: 'Either / Or Choice (5 Units)', questionCount: 5, marksPerQuestion: 13 },
      { id: 'p-3', partName: 'Part C', choice: 'Compulsory Analytical / Case Study', questionCount: 1, marksPerQuestion: 15 },
    ]);
    addToast('Reset to standard university 100-mark template.', 'info');
  };

  // ── 2. DIFFICULTY DISTRIBUTION ─────────────────────────
  const [easyPct, setEasyPct] = useState(mockBlueprint.difficultySplit.easy);
  const [modPct, setModPct] = useState(mockBlueprint.difficultySplit.moderate);
  const [hardPct, setHardPct] = useState(mockBlueprint.difficultySplit.hard);
  const difficultyTotal = easyPct + modPct + hardPct;

  const setDifficultyPreset = (easy: number, mod: number, hard: number) => {
    setEasyPct(easy);
    setModPct(mod);
    setHardPct(hard);
  };

  // ── 3. BLOOM TAXONOMY ──────────────────────────────────
  const [remPct, setRemPct] = useState(mockBlueprint.bloomSplit.remember);
  const [undPct, setUndPct] = useState(mockBlueprint.bloomSplit.understand);
  const [appPct, setAppPct] = useState(mockBlueprint.bloomSplit.apply);
  const [anaPct, setAnaPct] = useState(mockBlueprint.bloomSplit.analyze);
  const [evaPct, setEvaPct] = useState(mockBlueprint.bloomSplit.evaluate);
  const bloomTotal = remPct + undPct + appPct + anaPct + evaPct;

  // ── 4. UNIT COVERAGE (Customizable & Editable) ──────────
  const [unitWeights, setUnitWeights] = useState<{ [unitNum: number]: number }>({
    1: 20,
    2: 20,
    3: 20,
    4: 20,
    5: 20
  });

  // Re-sync unit weights when subject changes if unit count differs
  useEffect(() => {
    const count = selectedSubject.units.length || 5;
    const defaultWeight = Math.floor(100 / count);
    const initial: { [unitNum: number]: number } = {};
    selectedSubject.units.forEach((u, i) => {
      initial[u.number] = i === count - 1 ? 100 - defaultWeight * (count - 1) : defaultWeight;
    });
    setUnitWeights(initial);
  }, [selectedSubjectCode]);

  const totalUnitCoverage = useMemo(() => {
    return Object.values(unitWeights).reduce((sum, val) => sum + (val || 0), 0);
  }, [unitWeights]);

  const handleUpdateUnitWeight = (unitNum: number, weight: number) => {
    setUnitWeights((prev) => ({
      ...prev,
      [unitNum]: Math.max(0, Math.min(100, weight))
    }));
  };

  const handleResetUnitWeightsEqual = () => {
    const count = selectedSubject.units.length || 5;
    const equalWeight = Math.floor(100 / count);
    const updated: { [unitNum: number]: number } = {};
    selectedSubject.units.forEach((u, i) => {
      updated[u.number] = i === count - 1 ? 100 - equalWeight * (count - 1) : equalWeight;
    });
    setUnitWeights(updated);
    addToast('Distributed weights equally across all syllabus units.', 'info');
  };

  // Close calendar popup on outside click and sync month/year
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      const d = new Date(examDate);
      if (!isNaN(d.getTime())) {
        setCalendarViewYear(d.getFullYear());
        setCalendarViewMonth(d.getMonth());
      }
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isCalendarOpen, examDate]);

  // Calendar date generator
  const daysInMonth = new Date(calendarViewYear, calendarViewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(calendarViewYear, calendarViewMonth, 1).getDay(); // 0 = Sun
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleSelectCalendarDate = (day: number) => {
    const formattedMonth = String(calendarViewMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    setExamDate(`${calendarViewYear}-${formattedMonth}-${formattedDay}`);
    setIsCalendarOpen(false);
  };

  const handleSaveBlueprint = () => {
    if (difficultyTotal !== 100 || bloomTotal !== 100 || totalUnitCoverage !== 100) {
      addToast('Cannot save blueprint: Difficulty, Bloom, and Unit distributions must all equal 100%.', 'danger');
      return;
    }
    addToast(`Examination Blueprint for ${selectedSubject.code} (${totalCalculatedMarks} Marks) saved successfully.`, 'success');
  };

  const handleProceedToGeneration = () => {
    if (difficultyTotal !== 100 || bloomTotal !== 100 || totalUnitCoverage !== 100) {
      addToast('Please ensure total percentages equal 100% before proceeding.', 'warning');
      return;
    }
    setActiveTab('ai-generator');
  };

  const quickDurationPresets = ['3 Hours', '2 Hours', '1.5 Hours', '1 Hour'];

  return (
    <div className="blueprint-container">
      <Breadcrumb />

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <Layers size={20} className="text-blue-600" />
            Set Up Exam Paper
          </h2>
          <p className="page-subtitle">
            Configure examination structure, difficulty ratios, and syllabus distribution for{' '}
            <strong className="text-primary">{selectedSubject.code} — {selectedSubject.name}</strong>.
          </p>
        </div>

        <div className="header-actions">
          <button className="btn-secondary" onClick={handleSaveBlueprint}>
            <Save size={15} /> Save Blueprint
          </button>
          <button className="btn-primary" onClick={handleProceedToGeneration}>
            <Sparkles size={15} /> Generate Paper <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ── STEP 1: Choose Subject & Exam Schedule ── */}
      <div className="card-panel step-card">
        <div className="card-panel-header">
          <div className="panel-title">
            <BookOpen size={17} className="text-blue-600" />
            <h3>Step 1 — Choose Subject &amp; Exam Schedule</h3>
          </div>
          <span className="badge badge-info">Step 1 of 2</span>
        </div>

        <div className="step1-body">
          <div className="step1-controls-grid">
            {/* Searchable Subject Selector */}
            <div className="control-group subject-searchable-group">
              <label className="control-label">
                <GraduationCap size={14} /> Select Subject
              </label>

              <div className="searchable-dropdown-wrapper">
                <div
                  className="subject-selector-trigger"
                  onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
                >
                  <div className="selected-subject-meta">
                    <span className="subject-code-tag">{selectedSubject.code}</span>
                    <span className="subject-title-text">{selectedSubject.name}</span>
                  </div>
                  <ChevronDown size={16} className={`chevron-icon ${isSubjectDropdownOpen ? 'open' : ''}`} />
                </div>

                {isSubjectDropdownOpen && (
                  <div className="subject-dropdown-menu">
                    <div className="dropdown-search-bar">
                      <Search size={14} className="text-muted" />
                      <input
                        type="text"
                        placeholder="Search by code, subject name, or dept..."
                        value={subjectSearchQuery}
                        onChange={(e) => setSubjectSearchQuery(e.target.value)}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    <div className="dropdown-list-items">
                      {filteredSubjects.length === 0 ? (
                        <div className="no-subjects-found">No matching subjects found</div>
                      ) : (
                        filteredSubjects.map((sub) => (
                          <div
                            key={sub.code}
                            className={`subject-option-item ${sub.code === selectedSubjectCode ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedSubjectCode(sub.code);
                              setIsSubjectDropdownOpen(false);
                            }}
                          >
                            <div className="option-code-row">
                              <span className="opt-code">{sub.code}</span>
                              <span className="opt-sem">Semester {sub.semester}</span>
                              <span className="opt-bank-count">{sub.totalQuestions} Questions</span>
                            </div>
                            <div className="opt-name">{sub.name}</div>
                            <div className="opt-dept">{sub.department}</div>
                            {sub.code === selectedSubjectCode && (
                              <Check size={14} className="check-active-icon" />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Exam Date: Typeable + Theme-Merged Custom Calendar Picker */}
            <div className="control-group" ref={calendarRef}>
              <label className="control-label">
                <Calendar size={14} /> Exam Date
              </label>
              <div className="theme-date-picker-wrapper">
                <input
                  type="text"
                  className="typeable-input date-text-input"
                  placeholder="YYYY-MM-DD or e.g. 14-Nov-2026"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                />
                <button
                  type="button"
                  className="theme-calendar-trigger-btn"
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  title="Open themed calendar"
                >
                  <Calendar size={16} />
                </button>

                {/* THEME-MERGED CUSTOM POPUP CALENDAR */}
                {isCalendarOpen && (
                  <div className="theme-calendar-popup">
                    <div className="cal-header">
                      <button
                        type="button"
                        className="cal-nav-btn"
                        onClick={() => {
                          if (calendarViewMonth === 0) {
                            setCalendarViewMonth(11);
                            setCalendarViewYear((y) => y - 1);
                          } else {
                            setCalendarViewMonth((m) => m - 1);
                          }
                        }}
                      >
                        <ChevronLeft size={16} />
                      </button>

                      <div className="cal-month-title">
                        {monthNames[calendarViewMonth]} {calendarViewYear}
                      </div>

                      <button
                        type="button"
                        className="cal-nav-btn"
                        onClick={() => {
                          if (calendarViewMonth === 11) {
                            setCalendarViewMonth(0);
                            setCalendarViewYear((y) => y + 1);
                          } else {
                            setCalendarViewMonth((m) => m + 1);
                          }
                        }}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    <div className="cal-day-names">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                        <span key={d} className="cal-day-name">{d}</span>
                      ))}
                    </div>

                    <div className="cal-grid">
                      {Array.from({ length: firstDayIndex }).map((_, i) => (
                        <span key={`empty-${i}`} className="cal-cell empty" />
                      ))}

                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dayNum = i + 1;
                        const formattedMonth = String(calendarViewMonth + 1).padStart(2, '0');
                        const formattedDay = String(dayNum).padStart(2, '0');
                        const dateString = `${calendarViewYear}-${formattedMonth}-${formattedDay}`;
                        const isSelected = examDate.startsWith(dateString);

                        return (
                          <button
                            key={dayNum}
                            type="button"
                            className={`cal-cell day-cell ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleSelectCalendarDate(dayNum)}
                          >
                            {dayNum}
                          </button>
                        );
                      })}
                    </div>

                    <div className="cal-footer">
                      <button
                        type="button"
                        className="cal-quick-btn"
                        onClick={() => {
                          const today = new Date();
                          setExamDate(today.toISOString().split('T')[0]);
                          setIsCalendarOpen(false);
                        }}
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        className="cal-quick-btn"
                        onClick={() => {
                          const nextMonth = new Date();
                          nextMonth.setDate(nextMonth.getDate() + 30);
                          setExamDate(nextMonth.toISOString().split('T')[0]);
                          setIsCalendarOpen(false);
                        }}
                      >
                        +30 Days (Exam)
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <span className="control-hint">Type directly or click calendar icon to pick</span>
            </div>

            {/* Exam Duration: Typeable + Quick Preset Buttons */}
            <div className="control-group">
              <label className="control-label">
                <Clock size={14} /> Duration
              </label>
              <input
                type="text"
                className="typeable-input"
                placeholder="e.g. 3 Hours, 90 mins"
                value={examDuration}
                onChange={(e) => setExamDuration(e.target.value)}
              />
              <div className="quick-presets-row">
                {quickDurationPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className={`preset-pill ${examDuration === preset ? 'active' : ''}`}
                    onClick={() => setExamDuration(preset)}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Subject Info Summary Bar */}
          <div className="active-subject-card">
            <div className="info-chip">
              <span className="chip-lbl">DEPARTMENT</span>
              <span className="chip-val">{selectedSubject.department}</span>
            </div>
            <div className="info-chip">
              <span className="chip-lbl">REGULATION</span>
              <span className="chip-val">{selectedSubject.regulation}</span>
            </div>
            <div className="info-chip">
              <span className="chip-lbl">SEMESTER</span>
              <span className="chip-val">Semester {selectedSubject.semester}</span>
            </div>
            <div className="info-chip">
              <span className="chip-lbl">QUESTION BANK</span>
              <span className="chip-val text-emerald-500 font-bold">{selectedSubject.totalQuestions} Available</span>
            </div>
            <div className="info-chip">
              <span className="chip-lbl">SYLLABUS UNITS</span>
              <span className="chip-val">{selectedSubject.units.length} Units Defined</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── STEP 2: Balanced 2-Column Blueprint Layout (ZERO WASTED SPACE) ── */}
      <div className="section-step-label">
        <Layers size={17} className="text-blue-600" /> Step 2 — Configure Question Distribution &amp; Blueprint
      </div>

      <div className="blueprint-two-col-layout">
        {/* ── LEFT COLUMN: Structural Configuration ── */}
        <div className="blueprint-column">
          {/* Section 1: Question Structure (Editable) */}
          <div className="card-panel">
            <div className="card-panel-header">
              <div className="panel-title">
                <FileSpreadsheet size={16} className="text-blue-600" />
                <h3>1. Question Structure (Editable)</h3>
              </div>
              <div className="header-badge-actions">
                <button
                  type="button"
                  className="btn-tiny-reset"
                  onClick={handleResetParts}
                  title="Reset to 100-mark template"
                >
                  <RotateCcw size={12} /> Standard 100M
                </button>
                <span className={`badge ${totalCalculatedMarks === 100 ? 'badge-success' : 'badge-warning'}`}>
                  Total: {totalCalculatedMarks} Marks {totalCalculatedMarks === 100 ? '✓' : ''}
                </span>
              </div>
            </div>

            <div className="structure-editor-body">
              <p className="section-subtext">
                Customize question counts, section formats, and mark weightage for each section.
              </p>

              <div className="editable-parts-list">
                {examParts.map((part) => {
                  const rowTotal = (part.questionCount || 0) * (part.marksPerQuestion || 0);

                  return (
                    <div key={part.id} className="part-editor-card">
                      <div className="part-header-row">
                        <input
                          type="text"
                          className="part-name-input"
                          value={part.partName}
                          onChange={(e) => handleUpdatePart(part.id, 'partName', e.target.value)}
                          placeholder="Section Name (e.g. Part A)"
                        />
                        <span className="part-total-badge font-mono font-bold">
                          = {rowTotal} Marks
                        </span>
                        <button
                          type="button"
                          className="btn-remove-part"
                          onClick={() => handleRemovePart(part.id)}
                          title="Remove section"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="part-fields-grid">
                        <div className="part-field">
                          <label className="field-lbl">Format / Instructions</label>
                          <input
                            type="text"
                            className="field-input"
                            value={part.choice}
                            onChange={(e) => handleUpdatePart(part.id, 'choice', e.target.value)}
                            placeholder="e.g. Compulsory, Either / Or"
                          />
                        </div>

                        <div className="part-field-small">
                          <label className="field-lbl">Questions</label>
                          <input
                            type="number"
                            min={1}
                            max={50}
                            className="field-input-num"
                            value={part.questionCount}
                            onChange={(e) => handleUpdatePart(part.id, 'questionCount', parseInt(e.target.value) || 0)}
                          />
                        </div>

                        <div className="part-field-small">
                          <label className="field-lbl">Marks/Q</label>
                          <input
                            type="number"
                            min={1}
                            max={50}
                            className="field-input-num"
                            value={part.marksPerQuestion}
                            onChange={(e) => handleUpdatePart(part.id, 'marksPerQuestion', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button type="button" className="btn-add-section" onClick={handleAddPart}>
                <Plus size={14} /> Add Another Section / Part
              </button>
            </div>
          </div>

          {/* Section 4: Unit Allocation (Editable) */}
          <div className="card-panel">
            <div className="card-panel-header">
              <div className="panel-title">
                <Sliders size={16} className="text-blue-600" />
                <h3>4. Unit Coverage Target (Editable)</h3>
              </div>
              <div className="header-badge-actions">
                <button
                  type="button"
                  className="btn-tiny-reset"
                  onClick={handleResetUnitWeightsEqual}
                  title="Distribute evenly"
                >
                  <RotateCcw size={12} /> Equal (20%)
                </button>
                <span className={`badge ${totalUnitCoverage === 100 ? 'badge-success' : 'badge-danger'}`}>
                  Total: {totalUnitCoverage}% {totalUnitCoverage === 100 ? '✓' : '— Must equal 100%'}
                </span>
              </div>
            </div>

            <div className="unit-coverage-editor-body">
              <p className="section-subtext">
                Set custom mark percentage weights for each syllabus unit using the sliders or inputs.
              </p>

              <div className="unit-coverage-list">
                {selectedSubject.units.map((u) => {
                  const currentWeight = unitWeights[u.number] ?? 20;

                  return (
                    <div key={u.number} className="unit-coverage-row-card">
                      <div className="unit-meta-col">
                        <div className="unit-tag-pill">Unit {u.number}</div>
                        <span className="unit-name-text" title={u.name}>{u.name}</span>
                      </div>

                      <div className="unit-slider-col">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={currentWeight}
                          onChange={(e) => handleUpdateUnitWeight(u.number, Number(e.target.value))}
                          className="unit-weight-range"
                        />
                      </div>

                      <div className="unit-val-col">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={currentWeight}
                          onChange={(e) => handleUpdateUnitWeight(u.number, Number(e.target.value))}
                          className="unit-val-input"
                        />
                        <span className="unit-pct-symbol">% Marks</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Cognitive & AI Quality Distribution ── */}
        <div className="blueprint-column">
          {/* Section 2: Difficulty Mix (Balanced, Rich & Compact) */}
          <div className="card-panel">
            <div className="card-panel-header">
              <div className="panel-title">
                <Gauge size={16} className="text-blue-600" />
                <h3>2. Difficulty Mix</h3>
              </div>
              <span className={`badge ${difficultyTotal === 100 ? 'badge-success' : 'badge-danger'}`}>
                Total: {difficultyTotal}% {difficultyTotal === 100 ? '✓' : '— Must equal 100%'}
              </span>
            </div>

            <div className="difficulty-body">
              {/* Quick Preset Buttons */}
              <div className="preset-row-container">
                <span className="preset-label-text">Quick Presets:</span>
                <div className="diff-preset-buttons">
                  <button
                    type="button"
                    className={`btn-diff-preset ${easyPct === 20 && modPct === 50 && hardPct === 30 ? 'active' : ''}`}
                    onClick={() => setDifficultyPreset(20, 50, 30)}
                  >
                    Standard (20/50/30)
                  </button>
                  <button
                    type="button"
                    className={`btn-diff-preset ${easyPct === 30 && modPct === 50 && hardPct === 20 ? 'active' : ''}`}
                    onClick={() => setDifficultyPreset(30, 50, 20)}
                  >
                    Balanced (30/50/20)
                  </button>
                  <button
                    type="button"
                    className={`btn-diff-preset ${easyPct === 15 && modPct === 45 && hardPct === 40 ? 'active' : ''}`}
                    onClick={() => setDifficultyPreset(15, 45, 40)}
                  >
                    Challenging (15/45/40)
                  </button>
                </div>
              </div>

              {/* Visual Multi-Segment Distribution Bar */}
              <div className="difficulty-visual-bar">
                <div
                  className="bar-segment bar-easy"
                  style={{ width: `${easyPct}%` }}
                  title={`Easy: ${easyPct}%`}
                >
                  {easyPct > 12 && <span>Easy {easyPct}%</span>}
                </div>
                <div
                  className="bar-segment bar-mod"
                  style={{ width: `${modPct}%` }}
                  title={`Moderate: ${modPct}%`}
                >
                  {modPct > 12 && <span>Moderate {modPct}%</span>}
                </div>
                <div
                  className="bar-segment bar-hard"
                  style={{ width: `${hardPct}%` }}
                  title={`Hard: ${hardPct}%`}
                >
                  {hardPct > 12 && <span>Hard {hardPct}%</span>}
                </div>
              </div>

              {/* Sliders */}
              <div className="slider-box-list">
                <div className="slider-item">
                  <div className="slider-label-row">
                    <span className="diff-indicator-label easy-text">
                      <span className="dot dot-easy" /> Easy Questions
                    </span>
                    <span className="font-bold">{easyPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={easyPct}
                    onChange={(e) => setEasyPct(Number(e.target.value))}
                    className="slider-easy"
                  />
                </div>

                <div className="slider-item">
                  <div className="slider-label-row">
                    <span className="diff-indicator-label mod-text">
                      <span className="dot dot-mod" /> Moderate Questions
                    </span>
                    <span className="font-bold">{modPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={modPct}
                    onChange={(e) => setModPct(Number(e.target.value))}
                    className="slider-mod"
                  />
                </div>

                <div className="slider-item">
                  <div className="slider-label-row">
                    <span className="diff-indicator-label hard-text">
                      <span className="dot dot-hard" /> Hard / Analytical Questions
                    </span>
                    <span className="font-bold">{hardPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={hardPct}
                    onChange={(e) => setHardPct(Number(e.target.value))}
                    className="slider-hard"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Cognitive Level Split (Bloom's Taxonomy) */}
          <div className="card-panel">
            <div className="card-panel-header">
              <div className="panel-title">
                <BrainCircuit size={16} className="text-blue-600" />
                <h3>3. Cognitive Level Split (Bloom's Taxonomy)</h3>
              </div>
              <span className={`badge ${bloomTotal === 100 ? 'badge-success' : 'badge-danger'}`}>
                Total: {bloomTotal}% {bloomTotal === 100 ? '✓' : '— Must equal 100%'}
              </span>
            </div>

            <div className="bloom-body">
              <p className="section-subtext">
                Target cognitive levels according to NBA / AICTE Outcome Based Education (OBE).
              </p>

              <div className="slider-box-list">
                <div className="slider-item">
                  <div className="slider-label-row">
                    <span>Remember (K1) — Recall facts &amp; definitions</span>
                    <span className="font-bold">{remPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={remPct}
                    onChange={(e) => setRemPct(Number(e.target.value))}
                  />
                </div>

                <div className="slider-item">
                  <div className="slider-label-row">
                    <span>Understand (K2) — Explain concepts &amp; ideas</span>
                    <span className="font-bold">{undPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={undPct}
                    onChange={(e) => setUndPct(Number(e.target.value))}
                  />
                </div>

                <div className="slider-item">
                  <div className="slider-label-row">
                    <span>Apply (K3) — Solve problems &amp; use formulas</span>
                    <span className="font-bold">{appPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={appPct}
                    onChange={(e) => setAppPct(Number(e.target.value))}
                  />
                </div>

                <div className="slider-item">
                  <div className="slider-label-row">
                    <span>Analyze (K4) — Draw connections &amp; compare</span>
                    <span className="font-bold">{anaPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={anaPct}
                    onChange={(e) => setAnaPct(Number(e.target.value))}
                  />
                </div>

                <div className="slider-item">
                  <div className="slider-label-row">
                    <span>Evaluate &amp; Create (K5/K6) — Design &amp; justify</span>
                    <span className="font-bold">{evaPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={evaPct}
                    onChange={(e) => setEvaPct(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .blueprint-container {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .step-card {
          margin-bottom: 28px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
          overflow: visible !important;
        }

        .step1-body {
          padding: 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          overflow: visible !important;
        }

        .step1-controls-grid {
          display: grid;
          grid-template-columns: 2fr 1.2fr 1.2fr;
          gap: 20px;
          align-items: start;
          position: relative;
          z-index: 25;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          position: relative;
        }

        .control-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .control-hint {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        /* Searchable Subject Trigger */
        .searchable-dropdown-wrapper {
          position: relative;
        }

        .subject-selector-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 14px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.15s ease;
          min-height: 42px;
        }

        .subject-selector-trigger:hover {
          border-color: var(--brand-accent);
        }

        .selected-subject-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
        }

        .subject-code-tag {
          background: var(--brand-accent);
          color: white;
          font-size: 11px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          flex-shrink: 0;
        }

        .subject-title-text {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .chevron-icon {
          color: var(--text-muted);
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }

        .chevron-icon.open {
          transform: rotate(180deg);
        }

        /* Subject Dropdown Menu */
        .subject-dropdown-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          z-index: 50;
          overflow: hidden;
          animation: dropdownFade 0.15s ease;
        }

        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dropdown-search-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-tertiary);
        }

        .dropdown-search-bar input {
          border: none;
          background: transparent;
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
          width: 100%;
        }

        .dropdown-list-items {
          max-height: 240px;
          overflow-y: auto;
        }

        .no-subjects-found {
          padding: 20px;
          text-align: center;
          font-size: 12.5px;
          color: var(--text-muted);
        }

        .subject-option-item {
          padding: 10px 14px;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          position: relative;
          transition: background 0.15s ease;
        }

        .subject-option-item:last-child {
          border-bottom: none;
        }

        .subject-option-item:hover {
          background: var(--bg-tertiary);
        }

        .subject-option-item.active {
          background: var(--info-bg);
          border-left: 3px solid var(--brand-accent);
        }

        .option-code-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 2px;
        }

        .opt-code {
          font-weight: 800;
          font-size: 12px;
          color: var(--brand-accent);
        }

        .opt-sem, .opt-bank-count {
          font-size: 11px;
          color: var(--text-muted);
          background: var(--bg-tertiary);
          padding: 1px 6px;
          border-radius: 4px;
        }

        .opt-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .opt-dept {
          font-size: 11px;
          color: var(--text-muted);
        }

        .check-active-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--brand-accent);
        }

        /* Typeable inputs */
        .typeable-input {
          padding: 9px 12px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 500;
          outline: none;
          transition: border-color 0.15s ease;
          width: 100%;
        }

        .typeable-input:focus {
          border-color: var(--brand-accent);
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
        }

        /* ── THEME-MERGED CUSTOM POPUP CALENDAR ── */
        .theme-date-picker-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .theme-calendar-trigger-btn {
          position: absolute;
          right: 6px;
          width: 30px;
          height: 30px;
          border-radius: var(--radius-sm);
          background: transparent;
          border: none;
          color: var(--brand-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .theme-calendar-trigger-btn:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }

        .theme-calendar-popup {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 310px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          box-shadow: 0 16px 36px -4px rgba(0, 0, 0, 0.28), 0 6px 16px -2px rgba(0, 0, 0, 0.18);
          z-index: 100;
          padding: 16px;
          animation: dropdownFade 0.15s ease;
        }

        .cal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .cal-month-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .cal-nav-btn {
          width: 30px;
          height: 30px;
          border-radius: var(--radius-sm);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .cal-nav-btn:hover {
          background: var(--brand-accent);
          color: white;
          border-color: var(--brand-accent);
        }

        .cal-day-names {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          text-align: center;
          margin-bottom: 8px;
        }

        .cal-day-name {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .cal-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }

        .cal-cell {
          height: 34px;
          min-height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12.5px;
          border-radius: var(--radius-sm);
        }

        .day-cell {
          background: var(--bg-tertiary);
          border: 1px solid transparent;
          color: var(--text-primary);
          cursor: pointer;
          font-weight: 500;
          transition: all 0.12s ease;
        }

        .day-cell:hover {
          background: var(--bg-hover);
          border-color: var(--brand-accent);
          color: var(--brand-accent);
        }

        .day-cell.selected {
          background: var(--brand-accent) !important;
          color: #ffffff !important;
          font-weight: 800;
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.4);
        }

        .cal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 14px;
          padding-top: 10px;
          border-top: 1px solid var(--border-color);
        }

        .cal-quick-btn {
          font-size: 11.5px;
          font-weight: 700;
          color: var(--brand-accent);
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
        }

        .cal-quick-btn:hover {
          background: var(--bg-tertiary);
        }

        /* Duration Quick Presets */
        .quick-presets-row {
          display: flex;
          gap: 6px;
          margin-top: 6px;
          flex-wrap: wrap;
        }

        .preset-pill {
          padding: 3px 9px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .preset-pill:hover {
          border-color: var(--brand-accent);
          color: var(--text-primary);
        }

        .preset-pill.active {
          background: var(--brand-accent);
          color: white;
          border-color: var(--brand-accent);
        }

        /* Active Subject Details Showcase Card */
        .active-subject-card {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          padding: 14px 18px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
        }

        .info-chip {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .chip-lbl {
          font-size: 10px;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.6px;
        }

        .chip-val {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        /* Step 2 Section Header */
        .section-step-label {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* ── BALANCED 2-COLUMN BLUEPRINT LAYOUT ── */
        .blueprint-two-col-layout {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 24px;
          align-items: start;
        }

        .blueprint-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .header-badge-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-tiny-reset {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-tiny-reset:hover {
          color: var(--brand-accent);
          border-color: var(--brand-accent);
        }

        .section-subtext {
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 14px;
        }

        /* ── SECTION 1: QUESTION STRUCTURE EDITOR ── */
        .structure-editor-body {
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .editable-parts-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .part-editor-card {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: border-color 0.15s ease;
        }

        .part-editor-card:hover {
          border-color: var(--border-focus);
        }

        .part-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .part-name-input {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 4px 8px;
          width: 140px;
          outline: none;
        }

        .part-name-input:focus {
          border-color: var(--brand-accent);
        }

        .part-total-badge {
          font-size: 12px;
          color: var(--brand-accent);
          background: var(--info-bg);
          border: 1px solid var(--info-border);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          margin-left: auto;
        }

        .btn-remove-part {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
        }

        .btn-remove-part:hover {
          color: var(--danger);
          background: var(--danger-bg);
        }

        .part-fields-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 10px;
        }

        .part-field, .part-field-small {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .field-lbl {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .field-input {
          padding: 6px 8px;
          font-size: 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          outline: none;
        }

        .field-input-num {
          padding: 6px 8px;
          font-size: 12px;
          font-weight: 700;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          outline: none;
          width: 100%;
        }

        .field-input:focus, .field-input-num:focus {
          border-color: var(--brand-accent);
        }

        .btn-add-section {
          padding: 8px 12px;
          background: var(--bg-tertiary);
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-md);
          color: var(--brand-accent);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.15s ease;
        }

        .btn-add-section:hover {
          background: var(--info-bg);
          border-color: var(--brand-accent);
        }

        /* ── SECTION 2: DIFFICULTY MIX BODY ── */
        .difficulty-body {
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .preset-row-container {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .preset-label-text {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .diff-preset-buttons {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .btn-diff-preset {
          padding: 3px 8px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-diff-preset:hover {
          border-color: var(--brand-accent);
          color: var(--brand-accent);
        }

        .btn-diff-preset.active {
          background: var(--brand-accent);
          color: white;
          border-color: var(--brand-accent);
        }

        /* Visual Distribution Bar */
        .difficulty-visual-bar {
          display: flex;
          height: 22px;
          border-radius: var(--radius-full);
          overflow: hidden;
          border: 1px solid var(--border-color);
          background: var(--bg-tertiary);
        }

        .bar-segment {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 800;
          color: white;
          transition: width 0.2s ease;
          overflow: hidden;
          white-space: nowrap;
        }

        .bar-easy { background: linear-gradient(135deg, #10b981, #059669); }
        .bar-mod { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .bar-hard { background: linear-gradient(135deg, #f59e0b, #d97706); }

        .diff-indicator-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }

        .dot-easy { background: #10b981; }
        .dot-mod { background: #3b82f6; }
        .dot-hard { background: #f59e0b; }

        .easy-text { color: #059669; }
        .mod-text { color: #2563eb; }
        .hard-text { color: #d97706; }

        html.dark-theme .easy-text { color: #34d399; }
        html.dark-theme .mod-text { color: #60a5fa; }
        html.dark-theme .hard-text { color: #fbbf24; }

        /* Sliders with custom thumb accents */
        .slider-easy { accent-color: #10b981 !important; }
        .slider-mod { accent-color: #3b82f6 !important; }
        .slider-hard { accent-color: #f59e0b !important; }

        /* ── SECTION 3: BLOOM BODY ── */
        .bloom-body {
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* ── SECTION 4: UNIT COVERAGE EDITOR ── */
        .unit-coverage-editor-body {
          padding: 18px 20px;
        }

        .unit-coverage-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .unit-coverage-row-card {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 10px 14px;
          display: grid;
          grid-template-columns: 2.2fr 2fr 1fr;
          gap: 14px;
          align-items: center;
          transition: border-color 0.15s ease;
        }

        .unit-coverage-row-card:hover {
          border-color: var(--border-focus);
        }

        .unit-meta-col {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .unit-tag-pill {
          background: var(--brand-accent);
          color: white;
          font-size: 11px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          flex-shrink: 0;
        }

        .unit-name-text {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .unit-slider-col {
          display: flex;
          align-items: center;
        }

        .unit-weight-range {
          width: 100%;
          accent-color: var(--brand-accent);
          cursor: pointer;
        }

        .unit-val-col {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 4px;
        }

        .unit-val-input {
          width: 50px;
          padding: 4px 6px;
          font-size: 12px;
          font-weight: 800;
          text-align: center;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--brand-accent);
          outline: none;
        }

        .unit-val-input:focus {
          border-color: var(--brand-accent);
        }

        .unit-pct-symbol {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
        }

        /* Shared Sliders */
        .slider-box-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .slider-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .slider-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 12.5px;
          color: var(--text-primary);
        }

        .slider-item input[type='range'] {
          width: 100%;
          accent-color: var(--brand-accent);
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .step1-controls-grid { grid-template-columns: 1fr; }
          .active-subject-card { grid-template-columns: repeat(2, 1fr); }
          .blueprint-two-col-layout { grid-template-columns: 1fr; }
          .unit-coverage-row-card { grid-template-columns: 1fr; gap: 8px; }
        }
      `}</style>
    </div>
  );
};
