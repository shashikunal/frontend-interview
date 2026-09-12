import { LocalWhisperProvider, resolveWhisperConfig } from './providers/whisperProvider';
import { whisperProvider } from './providers/whisperProvider';

export type TranscriptSource = 'local-whisper' | 'web-speech-api' | 'manual-text';

export interface ResolvedTranscript {
  rawTranscript: string;
  cleanedTranscript: string;
  provider: TranscriptSource;
  model: string;
  language: string;
  confidence: number;
  timestamp: string;
  version: number;
  /** Honest trail of what was tried (never fake). */
  attempts: Array<{ provider: string; ok: boolean; error?: string }>;
}

function webSpeechSupported(): boolean {
  return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
}

/**
 * Fallback order (spec): Local Whisper → Web Speech API → typed answer.
 * Raw text is never overwritten or fabricated: the winning source's text is
 * kept verbatim and stamped with its real provider/model.
 */
export const transcriptionService = {
  fallbackOrder(): TranscriptSource[] {
    const cfg = resolveWhisperConfig();
    const order: TranscriptSource[] = [];
    if ((cfg.provider || 'local-whisper') === 'local-whisper') order.push('local-whisper');
    if (webSpeechSupported()) order.push('web-speech-api');
    order.push('manual-text');
    return order;
  },

  async transcribe(input: {
    audioBlob?: Blob | null;
    webSpeechText?: string;
    typedText?: string;
    previousVersion?: number;
  }): Promise<ResolvedTranscript> {
    const attempts: ResolvedTranscript['attempts'] = [];
    const version = (input.previousVersion || 0) + 1;
    const timestamp = new Date().toISOString();

    // 1. Local Whisper (recorded audio → sidecar)
    if (input.audioBlob && input.audioBlob.size > 0) {
      try {
        const provider: LocalWhisperProvider = whisperProvider as LocalWhisperProvider;
        const res = await provider.transcribeAudio(input.audioBlob);
        attempts.push({ provider: 'local-whisper', ok: true });
        return {
          rawTranscript: res.text,
          cleanedTranscript: res.cleanedText,
          provider: 'local-whisper',
          model: res.model,
          language: res.language,
          confidence: res.confidence,
          timestamp,
          version,
          attempts,
        };
      } catch (e) {
        attempts.push({
          provider: 'local-whisper',
          ok: false,
          error: e instanceof Error ? e.message : 'whisper failed',
        });
      }
    } else {
      attempts.push({ provider: 'local-whisper', ok: false, error: 'no recorded audio available' });
    }

    // 2. Web Speech API live transcript (already captured in UI state)
    const live = (input.webSpeechText || '').trim();
    if (live) {
      attempts.push({ provider: 'web-speech-api', ok: true });
      return {
        rawTranscript: live,
        cleanedTranscript: live.replace(/\s+/g, ' ').trim(),
        provider: 'web-speech-api',
        model: 'browser-native',
        language: 'en',
        confidence: 0.85,
        timestamp,
        version,
        attempts,
      };
    }
    attempts.push({ provider: 'web-speech-api', ok: false, error: 'no live speech text captured' });

    // 3. Typed answer (honest manual fallback)
    const typed = (input.typedText || '').trim();
    attempts.push({ provider: 'manual-text', ok: !!typed, error: typed ? undefined : 'no typed text provided' });
    return {
      rawTranscript: typed,
      cleanedTranscript: typed.replace(/\s+/g, ' ').trim(),
      provider: 'manual-text',
      model: 'manual-entry',
      language: 'en',
      confidence: typed ? 1 : 0,
      timestamp,
      version,
      attempts,
    };
  },
};
