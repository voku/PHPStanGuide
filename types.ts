import { ReactNode } from 'react';

export interface QuizOption {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface MicroQuiz {
  question: string;
  options: QuizOption[];
}

export interface CodeBlockData {
  language: string;
  code: string;
  label?: string;
  explanation?: ReactNode; // Changed to optional for AI fallback
  playgroundUrl?: string;
}

export interface GuideSection {
  id: string;
  title: string;
  content: ReactNode; // Changed from markdown string to JSX
  codeBlocks: CodeBlockData[];
  quiz?: MicroQuiz;
}

export interface GuideExportTypeEntry {
  type: string;
  description: string;
  example?: string;
}

export interface GuideExportTypeCategory {
  title: string;
  types: GuideExportTypeEntry[];
}

export interface GuideExportBestPractice {
  title: string;
  description: string;
}

export interface GuideExportExample {
  sectionId: string;
  sectionTitle: string;
  label: string;
  code: string;
  explanation?: string;
}

export interface GuideExportPayload {
  title: string;
  description: string;
  usage?: string;
  generatedFrom: string;
  exportedAt?: string;
  bestPractices: GuideExportBestPractice[];
  typeCategories: GuideExportTypeCategory[];
  allTypes: string[];
  examples: GuideExportExample[];
}

export interface UserState {
  xp: number;
  readSections: string[]; 
  masteredSections: string[];
}
