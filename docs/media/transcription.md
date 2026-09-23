# Phase 17 — Speech-to-Text Transcription & Open-Source Evaluation

## 1. Provider Abstraction Architecture

The transcription system employs a pluggable provider interface `TranscriptionProvider`:

```typescript
export interface TranscriptionResult {
  language: string;
  durationSeconds: number;
  fullText: string;
  confidence: number;
  segments: Array<{
    startTime: number;
    endTime: number;
    text: string;
    confidence: number;
    speakerId?: string;
    speakerName?: string;
  }>;
}

export interface TranscriptionProvider {
  name: string;
  transcribeAudio(audioBuffer: Buffer, options?: { language?: string }): Promise<TranscriptionResult>;
}
```

---

## 2. Open-Source-First Technology Evaluation

In accordance with Phase 17 requirements, self-hostable open-source speech-to-text models were rigorously evaluated:

| Technology | License | Accuracy (WER) | Hardware Requirements | Processing Speed | Operational Complexity | Recommendation |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **OpenAI Whisper (base/medium)** | MIT | High (English/Multilingual) | GPU recommended (4GB+ VRAM) or multi-core CPU | ~0.5x–1.0x realtime | Moderate (Python/PyTorch container) | Recommended secondary fallback |
| **faster-whisper (CTranslate2)** | MIT | High (matches Whisper) | Low–Moderate (4x faster on CPU/GPU, quantized) | ~0.15x–0.25x realtime | Low (Optimized C++ inference engine) | **Selected Open-Source Engine** |
| **Whisper.cpp** | MIT | High | Extremely low (runs on embedded/CPU with AVX) | ~0.3x realtime | Minimal (single standalone binary) | Viable for lightweight local nodes |

**Decision**: `faster-whisper` represents the optimal production balance: MIT licensed, 4x faster execution than vanilla PyTorch Whisper, native 8-bit quantization for minimal memory footprints, and high word accuracy.

---

## 3. Speaker Diarization Policy

* **Truthful Participant Alignment**: If the meeting presence timeline accurately correlates active speaker audio energy to verified user IDs, segments are labeled with the participant's name.
* **No Guessing**: If diarization or speaker mapping is ambiguous or unavailable, the segment is labeled `"Speaker identification unavailable"`. Fabricated or random speaker names are strictly prohibited.

---

## 4. Full-Text Search Implementation

Transcripts are indexed in PostgreSQL using GiST / GIN inverted indexes over `to_tsvector('english', full_text)` and granular `transcript_segments.text`:
* Supports keyword matching with case-insensitive tokenization and stemming.
* Returns matched segments with `startTime` so users can jump directly to the relevant moment in the video recording.
