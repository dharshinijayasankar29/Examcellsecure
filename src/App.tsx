import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { Toast } from './components/common/Toast';

import { LoginPage } from './components/auth/LoginPage';
import { DashboardView } from './components/dashboard/DashboardView';
import { QuestionBankView } from './components/question-bank/QuestionBankView';
import { ExamPapersView } from './components/export/ExamPapersView';
import { SecurityAuditView } from './components/administration/SecurityAuditView';

import './styles/design-tokens.css';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'question-bank':
      case 'upload-bank':
      case 'question-health':
        return <QuestionBankView />;
      case 'exam-papers':
      case 'examinations':
      case 'blueprint':
      case 'ai-generator':
      case 'question-intelligence':
      case 'review-workspace':
      case 'locked-papers':
      case 'official-export':
        return <ExamPapersView />;
      case 'administration':
      case 'security-audit':
      case 'users':
        return <SecurityAuditView />;
      default:
        return <DashboardView />;
    }
  };

  return <main className="main-viewport-content">{renderActiveView()}</main>;
};

const AppShell: React.FC = () => {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <Toast />
      </>
    );
  }

  return (
    <div className="app-layout-shell">
      <Header />
      <div className="app-body-layout">
        <Sidebar />
        <MainContent />
      </div>

      <NotificationDrawer />
      <GlobalSearchModal />
      <Toast />

      <style>{`
        .app-layout-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-primary);
        }

        .app-body-layout {
          display: flex;
          flex: 1;
        }

        .main-viewport-content {
          flex: 1;
          overflow-y: auto;
          background-color: var(--bg-primary);
          min-height: calc(100vh - 64px);
        }
      `}</style>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
