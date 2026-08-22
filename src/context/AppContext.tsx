import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Role, Question, ExaminationPaper, NotificationItem, GeneratedPaperQuestion } from '../types';
import { mockQuestions, mockExaminationPaper, mockNotifications, currentUser } from '../mock/mockData';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'danger';
}

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean | ((prev: boolean) => boolean)) => void;
  
  questions: Question[];
  selectedQuestion: Question | null;
  setSelectedQuestion: (q: Question | null) => void;
  addQuestion: (q: Question) => void;
  updateQuestion: (q: Question) => void;
  
  paper: ExaminationPaper;
  setPaper: React.Dispatch<React.SetStateAction<ExaminationPaper>>;
  regenerateQuestion: (qId: string, reason: string, customText?: string) => void;
  approvePaper: (reviewer: 'reviewer1' | 'reviewer2') => void;
  lockPaper: () => void;
  
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
  
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'danger') => void;
  removeToast: (id: string) => void;

  user: typeof currentUser;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('ADMIN');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Apply dark-theme class to <html> so ALL CSS variables work globally
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark-theme');
    } else {
      root.classList.remove('dark-theme');
    }
  }, [darkMode]);

  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const [paper, setPaper] = useState<ExaminationPaper>(mockExaminationPaper);

  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'danger' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const addQuestion = (newQ: Question) => {
    setQuestions((prev) => [newQ, ...prev]);
    addToast(`Question "${newQ.id}" added successfully to Question Bank.`, 'success');
  };

  const updateQuestion = (updatedQ: Question) => {
    setQuestions((prev) => prev.map((q) => (q.id === updatedQ.id ? updatedQ : q)));
    if (selectedQuestion?.id === updatedQ.id) {
      setSelectedQuestion(updatedQ);
    }
    addToast(`Question "${updatedQ.id}" updated.`, 'info');
  };

  const regenerateQuestion = (targetId: string, reason: string, customText?: string) => {
    setPaper((prevPaper) => {
      const updatedQuestions = prevPaper.questions.map((q) => {
        if (q.id === targetId) {
          const replacementText = customText && customText.trim()
            ? customText
            : `[AI Regenerated - ${reason}] ${q.text.replace(/Construct|Design|State|Convert/, 'Formulate and evaluate')}`;
          
          const newQ: GeneratedPaperQuestion = {
            ...q,
            id: `Q-REGEN-${Date.now().toString().slice(-4)}`,
            text: replacementText,
            noveltyScore: Math.min(99, Math.floor(Math.random() * 8) + 92),
            duplicateRisk: 'Low',
            source: 'Concept Synthesis',
            createdAt: new Date().toISOString().split('T')[0],
            author: 'AI Regenerator Engine'
          };
          return newQ;
        }
        return q;
      });

      return {
        ...prevPaper,
        version: `v${(parseFloat(prevPaper.version.replace('v', '')) + 0.1).toFixed(1)}`,
        questions: updatedQuestions
      };
    });

    addToast(`Question ${targetId} successfully regenerated and replaced.`, 'success');
  };

  const approvePaper = (reviewer: 'reviewer1' | 'reviewer2') => {
    setPaper((prev) => {
      const nowStr = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
      const updatedReviewer = {
        ...prev[reviewer],
        status: 'Approved' as const,
        date: nowStr
      };

      const otherReviewerKey = reviewer === 'reviewer1' ? 'reviewer2' : 'reviewer1';
      const bothApproved = updatedReviewer.status === 'Approved' && prev[otherReviewerKey].status === 'Approved';

      return {
        ...prev,
        [reviewer]: updatedReviewer,
        status: bothApproved ? ('Approved' as const) : ('Under Review' as const)
      };
    });

    addToast(`Paper approval recorded for ${reviewer === 'reviewer1' ? 'Reviewer 1' : 'Reviewer 2'}.`, 'success');
  };

  const lockPaper = () => {
    setPaper((prev) => ({
      ...prev,
      status: 'Locked',
      lockedBy: currentUser.name,
      lockedAt: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
    }));
    addToast(`🔒 Examination Paper ${paper.id} has been LOCKED and tamper-sealed.`, 'warning');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        sidebarCollapsed,
        setSidebarCollapsed,
        darkMode,
        setDarkMode,
        questions,
        selectedQuestion,
        setSelectedQuestion,
        addQuestion,
        updateQuestion,
        paper,
        setPaper,
        regenerateQuestion,
        approvePaper,
        lockPaper,
        notifications,
        markNotificationAsRead,
        isNotificationOpen,
        setIsNotificationOpen,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        toasts,
        addToast,
        removeToast,
        user: currentUser
      }}
      >
        {children}
      </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
