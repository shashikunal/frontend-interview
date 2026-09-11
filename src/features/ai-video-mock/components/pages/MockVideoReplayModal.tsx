import { useState, useEffect, useRef } from 'react';
import type { InterviewAnswer } from '../../types/mock.types';
import { videoStorageService, type VideoRecordingEntry } from '../../services/providers/videoStorageService';

interface MockVideoReplayModalProps {
  answer: InterviewAnswer;
  onClose: () => void;
}

export default function MockVideoReplayModal({ answer, onClose }: MockVideoReplayModalProps) {
  const [recording, setRecording] = useState<VideoRecordingEntry | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let activeUrl: string | null = null;

    async function loadRecording() {
      setIsLoading(true);
      const rec = await videoStorageService.getRecording(answer.id);
      if (rec && rec.blob) {
        setRecording(rec);
        activeUrl = URL.createObjectURL(rec.blob);
        setVideoUrl(activeUrl);
      }
      setIsLoading(false);
    }

    loadRecording();

    return () => {
      if (activeUrl) {
        URL.revokeObjectURL(activeUrl);
      }
    };
  }, [answer.id]);

  const e = answer.evaluation;

  return (
    <div className="ai-vm-modal-overlay">
      <div className="ai-vm-modal-card" style={{ maxWidth: 960, width: '95%' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>
              Recording Replay · Question #{answer.questionNumber}
            </div>
            <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>
              {answer.question.question}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
            aria-label="Close replay modal"
          >
            ✕
          </button>
        </div>

        {/* Side-by-side Video Player + Evaluation Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 20 }}>
          {/* Left Column: Video Player */}
          <div>
            <div style={{ background: '#000', borderRadius: 12, overflow: 'hidden', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
              {isLoading ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading recorded video...</div>
              ) : videoUrl ? (
                <video
                  ref={videoPlayerRef}
                  src={videoUrl}
                  controls
                  autoPlay
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>📹</div>
                  <div style={{ fontSize: '0.85rem' }}>No camera video captured for this answer.</div>
                  <div style={{ fontSize: '0.75rem', marginTop: 4 }}>Speech transcript and rubric evaluation are available below.</div>
                </div>
              )}
            </div>

            {recording && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8, padding: '0 4px' }}>
                <span>Format: {recording.mimeType}</span>
                <span>Size: {(recording.sizeBytes / 1024).toFixed(1)} KB</span>
                <span>Duration: {recording.durationSeconds}s</span>
              </div>
            )}
          </div>

          {/* Right Column: Score, Concept Feedback & Why Marks Lost */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Score Pill */}
            {e && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)', padding: '10px 16px', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Score: </span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: e.numericScore >= 8.0 ? '#10b981' : '#f59e0b' }}>
                    {e.numericScore} / 10
                  </span>
                </div>
                <span className="ai-vm-badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontWeight: 700 }}>
                  Grade: {e.letterGrade}
                </span>
              </div>
            )}

            {/* Transcript */}
            <div style={{ background: 'var(--bg)', padding: 12, borderRadius: 10, border: '1px solid var(--border)', flex: 1 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                TRANSCRIBED CANDIDATE ANSWER:
              </div>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.5, margin: 0, color: 'var(--text-primary)', whiteSpace: 'pre-wrap', maxHeight: 120, overflowY: 'auto' }}>
                {answer.transcript?.cleanedText || answer.transcript?.rawTranscript || answer.submittedCode || 'No transcript recorded.'}
              </p>
            </div>

            {/* Concept Comparison */}
            {e && (
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  CONCEPTUAL COVERAGE:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {e.comparison.correctConcepts.map(c => (
                    <span key={c} className="ai-vm-concept-pill correct" style={{ fontSize: '0.72rem' }}>
                      ✓ {c}
                    </span>
                  ))}
                  {e.comparison.missingConcepts.map(c => (
                    <span key={c} className="ai-vm-concept-pill missing" style={{ fontSize: '0.72rem' }}>
                      ✗ {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Improved Senior Answer Box */}
        {e && (
          <div style={{ background: 'rgba(99, 102, 241, 0.06)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: 14, borderRadius: 10, marginBottom: 20 }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#818cf8', marginBottom: 4 }}>
              💡 Senior Production Standard:
            </div>
            <p style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>
              {e.improvedAnswer}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="ai-vm-btn-primary" onClick={onClose}>
            Done Watching
          </button>
        </div>
      </div>
    </div>
  );
}
