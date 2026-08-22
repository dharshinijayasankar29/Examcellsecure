import React from 'react';
import { Printer, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';

export const OfficialPaperPreview: React.FC = () => {
  const { paper, setActiveTab } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="official-export-page">
      <div className="no-print">
        <Breadcrumb />

        <div className="page-header">
          <div>
            <h2 className="page-title">
              <Printer size={22} className="text-blue-600 inline-block mr-2" />
              Official Institution Question Paper Print Format
            </h2>
            <p className="page-subtitle">
              Format previewed exactly according to Controller of Examinations official publication standards.
            </p>
          </div>

          <div className="header-actions">
            <button className="btn-secondary" onClick={() => setActiveTab('review-workspace')}>
              <ArrowLeft size={16} /> Back to Review Workspace
            </button>
            <button className="btn-primary" onClick={handlePrint}>
              <Printer size={16} /> Print / Export Official PDF
            </button>
          </div>
        </div>
      </div>

      {/* Printable Paper Document Sheet */}
      <div className="printable-paper-sheet">
        <div className="paper-watermark">CONFIDENTIAL • EXAM CELL</div>

        {/* Register Number Box */}
        <div className="reg-num-container">
          <span className="reg-lbl">Reg. No. :</span>
          <div className="reg-boxes">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="reg-box"></div>
            ))}
          </div>
        </div>

        {/* Institution Header */}
        <div className="inst-header-block">
          <h1 className="inst-title">ANNA UNIVERSITY :: CHENNAI - 600 025</h1>
          <h2 className="exam-title">
            B.E. / B.TECH. DEGREE END SEMESTER EXAMINATIONS - NOV / DEC 2026
          </h2>
          <div className="sem-info">Fifth Semester — Computer Science and Engineering</div>
          <h3 className="course-code-title">
            {paper.subjectCode} — {paper.subjectName.toUpperCase()}
          </h3>
          <div className="reg-duration-row">
            <span>(Regulation {paper.regulation})</span>
          </div>
          <div className="time-marks-row">
            <span>Time : {paper.durationHours}</span>
            <span>Maximum : {paper.maxMarks} Marks</span>
          </div>
        </div>

        <hr className="header-divider" />

        {/* Answer All Questions Notice */}
        <div className="instruction-box">
          <strong>Answer ALL Questions</strong>
        </div>

        {/* Part A */}
        <div className="part-header-block">
          PART A — (10 × 2 = 20 Marks)
        </div>
        <div className="part-questions-list">
          {paper.questions
            .filter((q) => q.section === 'Part A')
            .map((q) => (
              <div key={q.id} className="official-q-row">
                <span className="q-num">{q.questionNumber}.</span>
                <span className="q-text">{q.text}</span>
                <span className="q-co-bloom">({q.co}, {q.bloom})</span>
                <span className="q-marks">(2)</span>
              </div>
            ))}
        </div>

        {/* Part B */}
        <div className="part-header-block mt-6">
          PART B — (5 × 13 = 65 Marks)
        </div>
        <div className="part-questions-list">
          {Array.from({ length: 5 }).map((_, idx) => {
            const qNum = 11 + idx;
            const qA = paper.questions.find((q) => q.questionNumber === qNum && q.subNumber === '(a)');
            const qB = paper.questions.find((q) => q.questionNumber === qNum && q.subNumber === '(b)');

            return (
              <div key={qNum} className="official-choice-block">
                {qA && (
                  <div className="official-q-row">
                    <span className="q-num">{qNum}. (a)</span>
                    <span className="q-text">{qA.text}</span>
                    <span className="q-co-bloom">({qA.co}, {qA.bloom})</span>
                    <span className="q-marks">(13)</span>
                  </div>
                )}

                <div className="choice-or-label">OR</div>

                {qB && (
                  <div className="official-q-row">
                    <span className="q-num">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(b)</span>
                    <span className="q-text">{qB.text}</span>
                    <span className="q-co-bloom">({qB.co}, {qB.bloom})</span>
                    <span className="q-marks">(13)</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Part C */}
        <div className="part-header-block mt-6">
          PART C — (1 × 15 = 15 Marks)
        </div>
        <div className="part-questions-list">
          {paper.questions
            .filter((q) => q.section === 'Part C')
            .map((q) => (
              <div key={q.id} className="official-q-row">
                <span className="q-num">{q.questionNumber}.</span>
                <span className="q-text">{q.text}</span>
                <span className="q-co-bloom">({q.co}, {q.bloom})</span>
                <span className="q-marks">(15)</span>
              </div>
            ))}
        </div>

        {/* Signature & Security Seal Footer */}
        <div className="official-signature-block mt-12">
          <div className="sig-box">
            <span className="sig-line"></span>
            <span className="sig-title">Question Paper Setter</span>
          </div>
          <div className="sig-box">
            <span className="sig-line"></span>
            <span className="sig-title">HOD / Chief Examiner</span>
          </div>
          <div className="sig-box">
            <span className="sig-line"></span>
            <span className="sig-title">Controller of Examinations</span>
          </div>
        </div>
      </div>

      <style>{`
        .official-export-page {
          padding: 24px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .printable-paper-sheet {
          background: #ffffff;
          color: #000000;
          padding: 40px;
          border-radius: 4px;
          box-shadow: var(--shadow-lg);
          font-family: 'Times New Roman', Times, serif;
          position: relative;
          border: 1px solid #cbd5e1;
        }

        .paper-watermark {
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-30deg);
          font-size: 42px;
          font-weight: 900;
          color: rgba(226, 232, 240, 0.5);
          pointer-events: none;
          user-select: none;
          letter-spacing: 0.1em;
        }

        .reg-num-container {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-bottom: 20px;
        }

        .reg-lbl {
          font-size: 14px;
          font-weight: bold;
        }

        .reg-boxes {
          display: flex;
          gap: 2px;
        }

        .reg-box {
          width: 20px;
          height: 24px;
          border: 1px solid #000000;
        }

        .inst-header-block {
          text-align: center;
          line-height: 1.4;
        }

        .inst-title {
          font-size: 18px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .exam-title {
          font-size: 15px;
          font-weight: bold;
          margin-top: 4px;
        }

        .sem-info {
          font-size: 14px;
          font-style: italic;
        }

        .course-code-title {
          font-size: 16px;
          font-weight: bold;
          margin-top: 8px;
        }

        .reg-duration-row {
          font-size: 13px;
          margin-top: 2px;
        }

        .time-marks-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          font-weight: bold;
          margin-top: 14px;
        }

        .header-divider {
          border: none;
          border-top: 2px solid #000000;
          margin: 10px 0;
        }

        .instruction-box {
          text-align: center;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .part-header-block {
          text-align: center;
          font-size: 15px;
          font-weight: bold;
          margin-bottom: 14px;
          text-decoration: underline;
        }

        .part-questions-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .official-q-row {
          display: flex;
          font-size: 14px;
          line-height: 1.5;
        }

        .q-num {
          width: 50px;
          font-weight: bold;
          shrink: 0;
        }

        .q-text {
          flex: 1;
          padding-right: 12px;
        }

        .q-co-bloom {
          font-size: 12px;
          font-style: italic;
          padding-right: 12px;
          white-space: nowrap;
        }

        .q-marks {
          font-weight: bold;
          width: 30px;
          text-align: right;
        }

        .official-choice-block {
          margin-bottom: 8px;
        }

        .choice-or-label {
          text-align: center;
          font-weight: bold;
          font-size: 13px;
          margin: 6px 0;
        }

        .official-signature-block {
          display: flex;
          justify-content: space-between;
          padding-top: 50px;
        }

        .sig-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 180px;
        }

        .sig-line {
          width: 100%;
          border-bottom: 1px solid #000000;
          margin-bottom: 6px;
        }

        .sig-title {
          font-size: 12px;
          font-weight: bold;
        }

        /* Print Media Query */
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .printable-paper-sheet {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};
