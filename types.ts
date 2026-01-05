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

export interface UserState {
  xp: number;
  readSections: string[]; 
  masteredSections: string[];
}