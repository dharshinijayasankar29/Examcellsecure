export type Role = 'ADMIN' | 'HOD' | 'FACULTY' | 'REVIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  avatarUrl?: string;
}

export type BloomLevel = 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
export type Difficulty = 'Easy' | 'Moderate' | 'Hard';
export type QuestionType = 'Part A (Short)' | 'Part B (Long)' | 'Part C (Analytical)';
export type ImportanceLevel = 'Important' | 'Moderate' | 'Rare';

export interface Question {
  id: string;
  subjectCode: string;
  subjectName: string;
  unit: number;
  unitTitle: string;
  text: string;
  marks: number;
  type: QuestionType;
  difficulty: Difficulty;
  importance: ImportanceLevel;
  bloom: BloomLevel;
  co: string; // e.g. CO1, CO2, CO3
  topic: string;
  noveltyScore: number; // Percentage 0-100%
  duplicateRisk: 'Low' | 'Medium' | 'High';
  source: 'Faculty Question Bank' | 'Previous Paper References' | 'Concept Synthesis';
  status: 'Approved' | 'Under Review' | 'Draft' | 'Flagged';
  createdAt: string;
  author: string;
}

export interface UnitHealth {
  unit: number;
  title: string;
  totalQuestions: number;
  healthScore: number; // 0-100%
  status: 'Healthy' | 'Needs Attention' | 'Weak';
  issues: string[];
  recommendations: string[];
}

export interface Examination {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  department: string;
  semester: number;
  regulation: string; // e.g., "R2021"
  examDate: string;
  durationMinutes: number;
  maxMarks: number;
  status: 'Blueprint Setup' | 'Question Bank Ready' | 'AI Generation' | 'Under Review' | 'Approved' | 'Locked';
  createdDate: string;
  assignedFaculty: string;
}

export interface PartDistribution {
  partName: 'Part A' | 'Part B' | 'Part C';
  questionCount: number;
  marksPerQuestion: number;
  choice: string; // e.g. "Answer all" or "Either/Or"
  totalMarks: number;
}

export interface ExaminationBlueprint {
  examId: string;
  parts: PartDistribution[];
  difficultySplit: {
    easy: number; // Percentage
    moderate: number;
    hard: number;
  };
  bloomSplit: {
    remember: number;
    understand: number;
    apply: number;
    analyze: number;
    evaluate: number;
  };
  unitDistribution: { unit: number; markPercentage: number }[];
  status: 'Draft' | 'Finalized';
}

export interface GeneratedPaperQuestion extends Question {
  questionNumber: number;
  section: 'Part A' | 'Part B' | 'Part C';
  subNumber?: string;
  isApprovedByReviewer?: boolean;
  reviewerNotes?: string;
}

export type PaperStatus = 'Draft' | 'Under Review' | 'Reviewed' | 'Approved' | 'Locked' | 'Archived';

export interface ExaminationPaper {
  id: string;
  examId: string;
  subjectCode: string;
  subjectName: string;
  semester: number;
  regulation: string;
  examDate: string;
  durationHours: string;
  maxMarks: number;
  version: string;
  status: PaperStatus;
  questions: GeneratedPaperQuestion[];
  createdDate: string;
  reviewer1: { name: string; date?: string; status: 'Pending' | 'Approved' | 'Rejected' };
  reviewer2: { name: string; date?: string; status: 'Pending' | 'Approved' | 'Rejected' };
  lockedBy?: string;
  lockedAt?: string;
  securityHash?: string;
}

export interface PaperValidationRule {
  id: string;
  rule: string;
  passed: boolean;
  details: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: Role;
  action: string;
  module: string;
  objectRef: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  ipAddress: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  read: boolean;
  actionLink?: string;
}

export interface Subject {
  code: string;
  name: string;
  department: string;
  semester: number;
  regulation: string;
  totalQuestions: number;
  units: { number: number; name: string }[];
}
