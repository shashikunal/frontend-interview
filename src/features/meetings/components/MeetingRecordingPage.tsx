import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { MeetingRecordingViewer } from './MeetingRecordingViewer';
import type { MeetingTranscriptRecord } from '../../../../server/media/recordingTypes.ts';

export const MeetingRecordingPage: React.FC = () => {
  const { meetingId, recordingId } = useParams<{ meetingId: string; recordingId: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const token = session?.access_token || (typeof window !== 'undefined' ? localStorage.getItem('meeting_token') : null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playbackUrl, setPlaybackUrl] = useState<string>('');
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [meetingTitle, setMeetingTitle] = useState<string>('Meeting Recording');
  const [transcript, setTranscript] = useState<MeetingTranscriptRecord | null>(null);

  useEffect(() => {
    if (!meetingId || !recordingId) {
      setError('Invalid meeting or recording parameters.');
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchRecordingData = async () => {
      try {
        setLoading(true);
        setError(null);

        const authHeaders: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        // 1. Fetch access presigned playback URL
        const accessRes = await fetch(`/api/v1/meetings/${meetingId}/recording/access/${recordingId}`, {
          headers: authHeaders,
        });

        if (!accessRes.ok) {
          const errData = await accessRes.json().catch(() => ({}));
          throw new Error(errData.message || `Access failed with HTTP ${accessRes.status}`);
        }

        const accessData = await accessRes.json();
        if (!isMounted) return;

        setPlaybackUrl(accessData.playbackUrl || accessData.url || '');
        setDurationSeconds(accessData.durationSeconds || 0);
        if (accessData.meetingTitle) {
          setMeetingTitle(accessData.meetingTitle);
        }

        // 2. Fetch transcript if available
        try {
          const transcriptRes = await fetch(`/api/v1/meetings/${meetingId}/recording/transcript/${recordingId}`, {
            headers: authHeaders,
          });
          if (transcriptRes.ok) {
            const transcriptData = await transcriptRes.json();
            if (isMounted && transcriptData.transcript) {
              setTranscript(transcriptData.transcript);
            }
          }
        } catch {
          // Transcript failure is non-fatal to playback
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Unable to load recording session.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRecordingData();

    return () => {
      isMounted = false;
    };
  }, [meetingId, recordingId, token]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', color: '#94a3b8' }}>
        <div className="app-route-spinner" style={{ marginBottom: '16px' }} />
        <p>Loading secure recording stream & synchronized transcript...</p>
      </div>
    );
  }

  if (error || !playbackUrl) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ color: '#f8fafc', marginBottom: '8px' }}>Recording Unavailable</h2>
        <p style={{ color: '#94a3b8', maxWidth: '480px', marginBottom: '24px' }}>
          {error || 'The requested recording could not be found or access has been restricted.'}
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Return to previous page"
          style={{
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Return to Previous Page
        </button>
      </div>
    );
  }

  return (
    <div
      aria-label="Meeting recording playback viewer"
      style={{ height: 'calc(100vh - 80px)', padding: '16px', boxSizing: 'border-box' }}
    >
      <MeetingRecordingViewer
        meetingTitle={meetingTitle}
        playbackUrl={playbackUrl}
        durationSeconds={durationSeconds}
        transcript={transcript}
        onClose={() => navigate(-1)}
      />
    </div>
  );
};

export default MeetingRecordingPage;
