import React from 'react';
import { PieChart } from 'lucide-react';
import { Breadcrumb } from '../common/Breadcrumb';

export const QuestionIntelligenceView: React.FC = () => {
  return (
    <div className="analytics-container">
      <Breadcrumb />

      <div className="page-header">
        <div>
          <h2 className="page-title">
            <PieChart size={22} className="text-blue-600 inline-block mr-2" />
            Question Intelligence & Cognitive Analytics
          </h2>
          <p className="page-subtitle">
            Statistical distribution of cognitive complexity, difficulty levels, and course outcome coverage.
          </p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="analytics-kpi-grid">
        <div className="card-panel p-4">
          <span className="text-xs text-muted font-bold uppercase">Total Question Pool</span>
          <div className="text-2xl font-extrabold text-primary mt-1">2,486</div>
          <span className="text-xs text-green-600 font-semibold mt-1 block">✓ 100% Syllabus Coverage</span>
        </div>

        <div className="card-panel p-4">
          <span className="text-xs text-muted font-bold uppercase">Important Questions</span>
          <div className="text-2xl font-extrabold text-primary mt-1">1,042 (42%)</div>
          <span className="text-xs text-muted block mt-1">Core exam topics</span>
        </div>

        <div className="card-panel p-4">
          <span className="text-xs text-muted font-bold uppercase">Moderate Frequency</span>
          <div className="text-2xl font-extrabold text-primary mt-1">932 (37%)</div>
          <span className="text-xs text-muted block mt-1">Application problems</span>
        </div>

        <div className="card-panel p-4">
          <span className="text-xs text-muted font-bold uppercase">Rare / High Difficulty</span>
          <div className="text-2xl font-extrabold text-primary mt-1">512 (21%)</div>
          <span className="text-xs text-muted block mt-1">Analytical & proofs</span>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="analytics-charts-grid mt-6">
        {/* Difficulty Distribution */}
        <div className="card-panel">
          <div className="card-panel-header">
            <h3>Difficulty Distribution Breakdown</h3>
          </div>
          <div className="chart-body">
            <div className="chart-bar-item">
              <div className="bar-label-row">
                <span>Easy (21%)</span>
                <span>522 Questions</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill bg-emerald-500" style={{ width: '21%' }}></div>
              </div>
            </div>

            <div className="chart-bar-item">
              <div className="bar-label-row">
                <span>Moderate (54%)</span>
                <span>1,342 Questions</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill bg-amber-500" style={{ width: '54%' }}></div>
              </div>
            </div>

            <div className="chart-bar-item">
              <div className="bar-label-row">
                <span>Hard (25%)</span>
                <span>622 Questions</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill bg-red-500" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bloom Taxonomy Spectrum */}
        <div className="card-panel">
          <div className="card-panel-header">
            <h3>Bloom's Taxonomy Spectrum</h3>
          </div>
          <div className="chart-body">
            <div className="chart-bar-item">
              <div className="bar-label-row"><span>Remember (K1)</span><span>12%</span></div>
              <div className="bar-track"><div className="bar-fill bg-blue-400" style={{ width: '12%' }}></div></div>
            </div>
            <div className="chart-bar-item">
              <div className="bar-label-row"><span>Understand (K2)</span><span>22%</span></div>
              <div className="bar-track"><div className="bar-fill bg-indigo-400" style={{ width: '22%' }}></div></div>
            </div>
            <div className="chart-bar-item">
              <div className="bar-label-row"><span>Apply (K3)</span><span>28%</span></div>
              <div className="bar-track"><div className="bar-fill bg-indigo-600" style={{ width: '28%' }}></div></div>
            </div>
            <div className="chart-bar-item">
              <div className="bar-label-row"><span>Analyze (K4)</span><span>24%</span></div>
              <div className="bar-track"><div className="bar-fill bg-purple-600" style={{ width: '24%' }}></div></div>
            </div>
            <div className="chart-bar-item">
              <div className="bar-label-row"><span>Evaluate & Create (K5/K6)</span><span>14%</span></div>
              <div className="bar-track"><div className="bar-fill bg-pink-600" style={{ width: '14%' }}></div></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .analytics-container {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .analytics-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .analytics-charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .chart-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .chart-bar-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .bar-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .bar-track {
          height: 10px;
          background: var(--bg-tertiary);
          border-radius: 5px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 5px;
        }

        .bg-emerald-500 { background: #10b981; }
        .bg-amber-500 { background: #f59e0b; }
        .bg-red-500 { background: #ef4444; }
        .bg-blue-400 { background: #60a5fa; }
        .bg-indigo-400 { background: #818cf8; }
        .bg-indigo-600 { background: #4f46e5; }
        .bg-purple-600 { background: #9333ea; }
        .bg-pink-600 { background: #db2777; }

        @media (max-width: 1024px) {
          .analytics-kpi-grid { grid-template-columns: repeat(2, 1fr); }
          .analytics-charts-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};
