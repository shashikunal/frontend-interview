/**
 * Collaborative Meeting Editor Types & Domain Models
 * Phase 7: Collaborative Monaco Code Editor & Execution Sandbox
 */

export type SupportedLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'html'
  | 'css'
  | 'json'
  | 'sql'
  | 'cpp'
  | 'java'
  | 'go';

export interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed?: boolean;
  durationMs?: number;
}

export interface ProblemTemplate {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  language: SupportedLanguage;
  starterCode: string;
  testCases: TestCase[];
}

export interface CodeExecutionResult {
  success: boolean;
  output: string[];
  returnValue?: string;
  error?: string;
  durationMs: number;
  testCases?: TestCase[];
  allPassed?: boolean;
  executedAt: string;
  executedBy: string;
}

export interface MeetingEditorDocument {
  meetingId: string;
  code: string;
  language: SupportedLanguage;
  version: number;
  readOnly: boolean;
  problemTemplateId?: string;
  lastModifiedBy: string;
  lastModifiedByName: string;
  lastModifiedAt: string;
  activeUsers: {
    userId: string;
    userName: string;
    cursorLine?: number;
    cursorColumn?: number;
    lastSeenAt: string;
  }[];
  latestExecution?: CodeExecutionResult;
}

export type EditorActionType =
  | 'SYNC_CODE'
  | 'SET_LANGUAGE'
  | 'TOGGLE_LOCK'
  | 'LOAD_TEMPLATE'
  | 'RESET_CODE'
  | 'RUN_CODE'
  | 'PRESENCE_UPDATE';

export interface EditorActionPayload {
  action: EditorActionType;
  meetingId: string;
  userId: string;
  userName: string;
  code?: string;
  language?: SupportedLanguage;
  version?: number;
  readOnly?: boolean;
  templateId?: string;
  cursorLine?: number;
  cursorColumn?: number;
}
