import type { InterviewerPersona } from '../../types/mock.types';

export interface VoiceSynthesisOptions {
  pitch?: number;
  rate?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export const voiceSynthesisService = {
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  },

  isSpeaking(): boolean {
    if (!this.isSupported()) return false;
    return window.speechSynthesis.speaking;
  },

  stop(): void {
    if (!this.isSupported()) return;
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn('Failed to cancel speech synthesis:', e);
    }
  },

  speak(text: string, persona?: InterviewerPersona, options?: VoiceSynthesisOptions): Promise<void> {
    return new Promise((resolve) => {
      if (!this.isSupported()) {
        console.warn('Speech synthesis not supported in this browser environment.');
        options?.onEnd?.();
        resolve();
        return;
      }

      this.stop();

      const cleanText = text.replace(/[*_#`~[\]]/g, '').trim();
      if (!cleanText) {
        options?.onEnd?.();
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = options?.rate ?? (persona?.voiceRate ?? 1.0);
      utterance.pitch = options?.pitch ?? (persona?.voicePitch ?? 1.0);
      utterance.volume = options?.volume ?? 1.0;
      utterance.lang = 'en-US';

      // Pick an English voice if available
      try {
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => 
          (v.lang === 'en-US' || v.lang.startsWith('en')) &&
          (persona?.name?.includes('Sarah') ? v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Zira') : true)
        ) || voices.find(v => v.lang.startsWith('en'));

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      } catch {}

      utterance.onstart = () => {
        options?.onStart?.();
      };

      utterance.onend = () => {
        options?.onEnd?.();
        resolve();
      };

      utterance.onerror = (err) => {
        console.warn('Speech synthesis error or interrupted:', err);
        options?.onError?.(err);
        options?.onEnd?.();
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  },
};
