// Zero-dependency offline Speech Synthesis service for technical interview questions & answers

type AudioStateListener = (isPlaying: boolean, activeId: string | null) => void;

class DocsAudioService {
  private synth: SpeechSynthesis | null = null;
  private activeId: string | null = null;
  private listeners: Set<AudioStateListener> = new Set();
  private preferredVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices(): void {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (voices.length === 0) return;

    // Prefer natural English voices (Google, Microsoft, Samantha, Daniel, etc.)
    const naturalEn = voices.find(
      v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online'))
    );
    const standardEn = voices.find(v => v.lang.startsWith('en-US') || v.lang.startsWith('en-GB') || v.lang.startsWith('en'));
    this.preferredVoice = naturalEn || standardEn || voices[0];
  }

  isSupported(): boolean {
    return this.synth !== null;
  }

  subscribe(listener: AudioStateListener): () => void {
    this.listeners.add(listener);
    // Initial emit
    listener(this.activeId !== null, this.activeId);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const isPlaying = this.activeId !== null;
    this.listeners.forEach(l => l(isPlaying, this.activeId));
  }

  speak(text: string, id: string = 'general', onEnd?: () => void): void {
    if (!this.synth) return;

    // Clean up Markdown symbols and backticks for smoother narration
    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Code snippet omitted for audio.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[#*_~>]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // If currently speaking this same ID, stop it (toggle behavior)
    if (this.activeId === id) {
      this.stop();
      return;
    }

    // Stop any current utterance
    this.stop();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice;
    }
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.activeId = id;
      this.notify();
    };

    utterance.onend = () => {
      this.activeId = null;
      this.notify();
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.activeId = null;
      this.notify();
    };

    this.synth.speak(utterance);
  }

  stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
    this.activeId = null;
    this.notify();
  }

  getActiveId(): string | null {
    return this.activeId;
  }
}

export const docsAudioService = new DocsAudioService();
