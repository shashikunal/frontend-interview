export interface AIProviderResponse {
  success: boolean;
  content: string;
  parsedJson?: any;
  model: string;
  durationMs: number;
  error?: string;
}

export interface AIProvider {
  name: string;
  isAvailable(): Promise<{ available: boolean; statusMessage: string; modelName?: string }>;
  generateCompletion(prompt: string, options?: { systemPrompt?: string; temperature?: number; jsonMode?: boolean }): Promise<AIProviderResponse>;
}

export interface TranscriptionResult {
  text: string;
  cleanedText: string;
  confidence: number;
  language: string;
  durationSeconds: number;
}

export interface TranscriptionProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult>;
}

export interface VideoProcessorResult {
  compressedBlob: Blob;
  resolution: string;
  durationSeconds: number;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  compressionRatio: number;
}

export interface VideoProcessor {
  compressTo480p(videoBlob: Blob): Promise<VideoProcessorResult>;
}

export interface StorageUploadResult {
  storageKey: string;
  publicUrl?: string;
  signedUrl?: string;
}

export interface StorageProvider {
  name: string;
  uploadFile(path: string, blob: Blob, contentType: string): Promise<StorageUploadResult>;
  getSignedUrl(path: string, expiresInSeconds: number): Promise<string>;
  deleteFile(path: string): Promise<boolean>;
}

export interface CodeSandboxExecutionParams {
  code: string;
  language: 'javascript' | 'typescript';
  testCases: Array<{ id: string; input: string; expectedOutput: string }>;
  timeoutMs?: number;
}

export interface CodeSandboxResult {
  status: 'PASSED' | 'WRONG_ANSWER' | 'COMPILE_ERROR' | 'RUNTIME_ERROR' | 'TIMEOUT' | 'MEMORY_LIMIT' | 'SANDBOX_ERROR';
  testsPassed: number;
  testsTotal: number;
  executionTimeMs: number;
  failedCases: Array<{ input: string; expected: string; actual: string; error?: string }>;
  logs: Array<{ level: 'log' | 'info' | 'warn' | 'error'; message: string }>;
}

export interface CodeExecutionProvider {
  execute(params: CodeSandboxExecutionParams): Promise<CodeSandboxResult>;
}

export interface VoiceProvider {
  speak(text: string, options?: { pitch?: number; rate?: number; onEnd?: () => void }): void;
  stop(): void;
  isSupported(): boolean;
}
