import type { MCQuestion } from '../machineCodingQuestions.ts';
import { generateQuestionStarter, generateDynamicCss, isGenericBoilerplateStarter } from './mcStarterGenerator.ts';

export type MCLanguage = 'javascript' | 'react' | 'dom' | 'typescript' | 'leetcode';

export interface LanguageOption {
  id: MCLanguage;
  label: string;
  badge: string;
  icon: string;
  primaryFile: string;
  description: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    id: 'javascript',
    label: 'JavaScript',
    badge: 'Vanilla JS',
    icon: '🟨',
    primaryFile: 'script.js',
    description: 'Clean Vanilla JS + HTML & CSS without React dependencies',
  },
  {
    id: 'react',
    label: 'ReactJS',
    badge: 'React 19',
    icon: '⚛️',
    primaryFile: 'App.tsx',
    description: 'Modern React component with state hooks and JSX',
  },
  {
    id: 'dom',
    label: 'Vanilla DOM',
    badge: 'DOM APIs',
    icon: '🌐',
    primaryFile: 'index.html',
    description: 'Interactive HTML5 semantics, native DOM events & styles',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    badge: 'Typed JS',
    icon: '🔷',
    primaryFile: 'script.ts',
    description: 'Strict TypeScript interfaces, models, and typed DOM handlers',
  },
  {
    id: 'leetcode',
    label: 'Algorithms',
    badge: 'Algo / DS',
    icon: '💡',
    primaryFile: 'solution.js',
    description: 'Pure algorithmic data structures & functions with assertion tests',
  },
];

export function detectDefaultLanguage(_category?: string, _title?: string): MCLanguage {
  return 'react';
}

/**
 * Builds tailored boilerplate files for a given language and challenge.
 * Strictly avoids generic boilerplate and delegates to the dynamic question starter generator.
 */
export function buildStarterFilesForLanguage(
  question: MCQuestion,
  lang: MCLanguage
): Record<string, string> {
  // 1. REACT MODE
  if (lang === 'react') {
    if (question.starterCode && !isGenericBoilerplateStarter(question.starterCode) && !question.starterCode.includes('#1e222d')) {
      return {
        'App.tsx': question.starterCode,
        'styles.css': generateDynamicCss(question),
      };
    }
    return generateQuestionStarter(question, 'react');
  }

  // 2. TYPESCRIPT MODE
  if (lang === 'typescript') {
    return generateQuestionStarter(question, 'typescript');
  }

  // 3. JAVASCRIPT & DOM MODES
  if (lang === 'javascript' || lang === 'dom') {
    return generateQuestionStarter(question, lang);
  }

  // 4. LEETCODE / ALGORITHM MODE
  if (lang === 'leetcode') {
    return generateQuestionStarter(question, 'leetcode');
  }

  return generateQuestionStarter(question, 'react');
}

/**
 * Returns the reference solution code matching the candidate's active environment.
 */
export function getSolutionCodeForLanguage(
  question: MCQuestion,
  _lang: MCLanguage
): string {
  return question.solutionCode || '';
}

/**
 * Returns the reference solution code for a specific file in the active language.
 */
export function getSolutionCodeForFile(
  question: MCQuestion,
  lang: MCLanguage,
  fileName: string
): string {
  if (lang === 'react') {
    return fileName === 'App.tsx' ? question.solutionCode : '';
  }
  return question.solutionCode || '';
}
