import React, { useState, useEffect } from 'react';
import { Layers, Sparkles, CheckSquare, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BlueprintView } from '../blueprint/BlueprintView';
import { ReviewWorkspaceView } from '../review-approval/ReviewWorkspaceView';
import { LockedPaperView } from '../review-approval/LockedPaperView';

type ExamPaperSubTab = 'blueprint-ai' | 'review' | 'locked-export';

export const ExamPapersView: React.FC = () => {
  const { activeTab } = useApp();
  const [subTab, setSubTab] = useState<ExamPaperSubTab>('blueprint-ai');

  useEffect(() => {
    if (
      activeTab === 'blueprint' ||
      activeTab === 'ai-generator' ||
      activeTab === 'examinations' ||
      activeTab === 'question-intelligence'
    ) {
      setSubTab('blueprint-ai');
    } else if (activeTab === 'review-workspace') {
      setSubTab('review');
    } else if (activeTab === 'locked-papers' || activeTab === 'official-export') {
      setSubTab('locked-export');
    }
  }, [activeTab]);

  return (
    <div className="exam-papers-module-container">
      {/* Page Header */}
      <div className="module-header-area">
        <div className="module-header-title">
          <div>
            <h2>
              <Layers className="text-blue-600 inline-block mr-2" size={22} />
              Exam Papers
            </h2>
            <p>Create exam papers, review drafts, and download finalized question sets.</p>
          </div>
        </div>

        {/* Sub-navigation */}
        <div className="module-subnav-bar">
          <button
            className={`subnav-btn ${subTab === 'blueprint-ai' ? 'active' : ''}`}
            onClick={() => setSubTab('blueprint-ai')}
          >
            <Sparkles size={15} /> Create Paper
          </button>
          <button
            className={`subnav-btn ${subTab === 'review' ? 'active' : ''}`}
            onClick={() => setSubTab('review')}
          >
            <CheckSquare size={15} /> Review Papers
          </button>
          <button
            className={`subnav-btn ${subTab === 'locked-export' ? 'active' : ''}`}
            onClick={() => setSubTab('locked-export')}
          >
            <Lock size={15} /> Finalize & Export
          </button>
        </div>
      </div>

      {/* Sub-tab content */}
      <div className="subtab-content">
        {subTab === 'blueprint-ai' && (
          <div className="blueprint-ai-wrapper">
            <BlueprintView />
          </div>
        )}

        {subTab === 'review' && (
          <div className="review-wrapper">
            <ReviewWorkspaceView />
          </div>
        )}

        {subTab === 'locked-export' && (
          <div className="locked-export-wrapper">
            <LockedPaperView />
          </div>
        )}
      </div>

      <style>{`
        .exam-papers-module-container {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .module-header-area {
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};
