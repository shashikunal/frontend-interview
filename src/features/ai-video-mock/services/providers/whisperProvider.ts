import type { TranscriptionProvider, TranscriptionResult, TranscriptionHealth } from '../../types/provider.types';

export interface WhisperConfig {
  /** 'local-whisper' (default) — browser never assumes Web Speech as primary. */
  provider: string;
  baseUrl: string;
  /** Model is NEVER assumed; empty means unconfigured (honest Offline state). */
  model: string;
  language: string;
}

export function resolveWhisperConfig(env: Record<string, string | undefined> = {}): WhisperConfig {
  const read = (viteKey: string, plainKey: string, fallback: string): string => {
    const v = env[viteKey] ?? (typeof import.meta !== 'undefined' ? (import.meta as any).env?.[viteKey] : undefined) ?? env[plainKey] ?? fallback;
    return String(v || '').trim() || fallback;
  };
  return {
    provider: read('VITE_TRANSCRIPTION_PROVIDER', 'TRANSCRIPTION_PROVIDER', 'local-whisper'),
    baseUrl: read('VITE_WHISPER_BASE_URL', 'WHISPER_BASE_URL', 'http://localhost:9000').replace(/\/+$/, ''),
    model: read('VITE_WHISPER_MODEL', 'WHISPER_MODEL', ''),
    language: read('VITE_WHISPER_LANGUAGE', 'WHISPER_LANGUAGE', 'en'),
  };
}

/**
 * LocalWhisperProvider — browser posts recorded audio to a local
 * faster-whisper REST sidecar. Never fabricates transcripts: failures throw
 * structured errors so the caller falls through the chain honestly.
 *
 * Start the sidecar (example, faster-whisper server on :9000 exposing /asr):
 *   pip install faster-whisper uvicorn python-multipart && \
 *   uvicorn faster_whisper_server:app --host 127.0.0.1 --port 9000
 */
export class LocalWhisperProvider implements TranscriptionProvider {
  name = 'Local Whisper (faster-whisper sidecar)';
  private config: WhisperConfig;

  constructor(config?: Partial<WhisperConfig>) {
    this.config = { ...resolveWhisperConfig(), ...(config || {}) };
  }

  getConfig(): WhisperConfig {
    return { ...this.config };
  }

  async isAvailable(): Promise<boolean> {
    const h = await this.healthCheck();
    return h.status === 'connected';
  }

  async healthCheck(): Promise<TranscriptionHealth> {
    const checkedAt = new Date().toISOString();
    const base = { endpoint: this.config.baseUrl, model: this.config.model || 'not-configured', checkedAt };
    const start = Date.now();
    try {
      const res = await fetch(`${this.config.baseUrl}/asr`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) {
        return { ...base, status: 'offline', latencyMs: Date.now() - start, message: `Sidecar responded HTTP ${res.status}; expected faster-whisper /asr.` };
      }
      return {
        ...base,
        status: 'connected',
        latencyMs: Date.now() - start,
        message: this.config.model
          ? `Sidecar reachable; configured model "${this.config.model}".`
          : 'Sidecar reachable; WHISPER_MODEL is not configured — set it to the loaded model name.',
      };
    } catch (e) {
      return {
        ...base,
        status: 'offline',
        latencyMs: null,
        message: e instanceof Error ? `Unreachable: ${e.message}` : 'Sidecar unreachable at configured endpoint.',
      };
    }
  }

  async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
    const startTime = Date.now();
    if (!audioBlob || audioBlob.size === 0) {
      throw new Error('local-whisper: empty audio blob, nothing to transcribe');
    }
    let res: Response;
    try {
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'candidate_answer.webm');
      if (this.config.model) formData.append('model', this.config.model);
      if (this.config.language) formData.append('language', this.config.language);

      res = await fetch(`${this.config.baseUrl}/asr`, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(60000),
      });
    } catch (e) {
      throw new Error(`local-whisper: sidecar unreachable (${e instanceof Error ? e.message : 'network error'})`);
    }

    if (!res.ok) {
      throw new Error(`local-whisper: sidecar responded HTTP ${res.status}`);
    }

    let data: any = {};
    try {
      data = await res.json();
    } catch {
      throw new Error('local-whisper: sidecar returned non-JSON response');
    }

    const text = String(data.text || '').trim();
    if (!text) {
      throw new Error('local-whisper: sidecar returned an empty transcript');
    }

    return {
      text,
      cleanedText: this.cleanTranscript(text),
      confidence: typeof data.confidence === 'number' ? data.confidence : 0.9,
      language: data.language || this.config.language,
      durationSeconds: Math.round((Date.now() - startTime) / 1000),
      provider: 'local-whisper',
      model: this.config.model || data.model || 'server-default',
      timestamp: new Date().toISOString(),
      version: 1,
    };
  }

  cleanTranscript(raw: string): string {
    return raw
      .replace(/\s+/g, ' ')
      .replace(/\b(um|uh|er|ah|like|you know)\b/gi, '')
      .replace(/\s+,/g, ',')
      .replace(/\s+\./g, '.')
      .trim();
  }
}

export const whisperProvider = new LocalWhisperProvider();
