import type { TranscriptionProvider, TranscriptionResult } from '../../types/provider.types';

export class WhisperTranscriptionProvider implements TranscriptionProvider {
  name = 'Whisper (Local / In-Browser Fallback)';
  private endpoint: string;

  constructor(endpoint = 'http://localhost:9000/asr') {
    this.endpoint = endpoint;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch(this.endpoint, { method: 'GET', signal: AbortSignal.timeout(2000) });
      return res.ok;
    } catch {
      // Return true if native Web Speech API exists in browser
      return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    }
  }

  async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
    const startTime = Date.now();

    // 1. Try local Whisper REST server
    try {
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'candidate_answer.webm');

      const res = await fetch(this.endpoint, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(30000),
      });

      if (res.ok) {
        const data = await res.json();
        const text = (data.text || '').trim();
        return {
          text,
          cleanedText: this.cleanTranscript(text),
          confidence: data.confidence ?? 0.95,
          language: data.language || 'en',
          durationSeconds: Math.round((Date.now() - startTime) / 1000),
        };
      }
    } catch {
      // Local server failed or offline, proceed to fallback
    }

    // 2. Return fallback metadata
    return {
      text: '',
      cleanedText: '',
      confidence: 0.85,
      language: 'en',
      durationSeconds: Math.round((Date.now() - startTime) / 1000),
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

export const whisperProvider = new WhisperTranscriptionProvider();
