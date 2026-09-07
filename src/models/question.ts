export type TemplateType = 'machine-coding' | 'leetcode' | 'dom-browser' | 'concept';

export interface Question {
  id: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  answer: string;
  code?: string;
  example?: string;
  source?: string;
  templateType?: TemplateType;
}

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;

export interface QuestionStat {
  name: string;
  count: number;
}

export const CATEGORIES = [
  'JavaScript & ES6',
  'ReactJS',
  'TypeScript',
  'CSS',
  'Frontend Performance',
  'DOM & Web APIs',
  'DOM Advanced APIs',
] as const;
