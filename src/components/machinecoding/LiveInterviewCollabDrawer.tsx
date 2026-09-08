import React, { useState, useEffect, useRef } from 'react';
import type { InterviewSession, SessionParticipant, SessionMessage } from '../../lib/interviewSessionService';
import './LiveInterviewCollabDrawer.css';

interface Props {
  session: InterviewSession | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    id: string;
    name: string;
    role: 'candidate' | 'admin' | 'interviewer' | 'observer';
  };
  participants: SessionParticipant[];
  messages: SessionMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onToggleAdminEdit?: () => void;
  canAdminEdit?: boolean;
  lastExecutionEvent?: any;
  onStartSession?: () => void;
  onSubmitSession?: () => void;
}

export default function LiveInterviewCollabDrawer({
  session,
  isOpen,
  onClose,
  currentUser,
  participants,
  messages,
  onSendMessage,
  onToggleAdminEdit,
  canAdminEdit,
  lastExecutionEvent,
  onStartSession,
  onSubmitSession,
}: Props) {
  const [activeTab, setActiveTab] = useState<'chat' | 'activity' | 'participants'>('chat');
  const [inputText, setInputText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    await onSendMessage(text);
  };

  const handleCopyInvite = () => {
    if (!session) return;
    const url = `${window.location.origin}/machine-coding?id=${session.question_id}&session=${session.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  if (!isOpen) return null;

  return (
    <aside className="collab-drawer page-enter" aria-label="Live Collaborative Interview Console">
      <div className="collab-drawer-header">
        <div className="collab-header-left">
          <span className="collab-live-pulse" />
          <div>
            <h3 className="collab-drawer-title">Live Interview Studio</h3>
            <span className="collab-session-id">
              {session ? `Session #${session.id.slice(0, 8)}` : 'Session Offline'}
            </span>
          </div>
        </div>

        <div className="collab-header-actions">
          {session && (
            <button
              type="button"
              className="collab-icon-btn"
              onClick={handleCopyInvite}
              title="Copy session invite URL for Admin/Candidate"
            >
              {copiedLink ? '✓ Copied' : '🔗 Share'}
            </button>
          )}
          <button type="button" className="collab-close-btn" onClick={onClose} aria-label="Close drawer">
            ✕
          </button>
        </div>
      </div>

      {/* Role & Mode Notice */}
      <div className={`collab-role-banner ${currentUser.role}`}>
        <div className="role-banner-left">
          <span className="role-badge">{currentUser.role.toUpperCase()}</span>
          <span className="role-desc">
            {currentUser.role === 'admin' || currentUser.role === 'interviewer'
              ? canAdminEdit
                ? 'Co-Editing Mode Active (Live Yjs)'
                : 'Observing Candidate Workspace'
              : 'Candidate Workspace (Live Sync Active)'}
          </span>
        </div>
        {(currentUser.role === 'admin' || currentUser.role === 'interviewer') && onToggleAdminEdit && (
          <button
            type="button"
            className={`admin-takeover-toggle-btn ${canAdminEdit ? 'active' : ''}`}
            onClick={onToggleAdminEdit}
          >
            {canAdminEdit ? 'Disable Takeover' : 'Take Over Editor'}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="collab-nav-tabs">
        <button
          type="button"
          className={`collab-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          💬 Live Chat {messages.length > 0 && <span className="tab-badge">{messages.length}</span>}
        </button>
        <button
          type="button"
          className={`collab-tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          ⚡ Realtime Telemetry
        </button>
        <button
          type="button"
          className={`collab-tab-btn ${activeTab === 'participants' ? 'active' : ''}`}
          onClick={() => setActiveTab('participants')}
        >
          👥 Peers ({participants.length || 1})
        </button>
      </div>

      {/* Tab Content */}
      <div className="collab-tab-body">
        {activeTab === 'chat' && (
          <div className="collab-chat-container">
            <div className="collab-chat-messages">
              {messages.length === 0 ? (
                <div className="collab-empty-chat">
                  <span className="empty-chat-icon">💡</span>
                  <p>No messages yet. Send a message to start communicating live during the evaluation.</p>
                </div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.sender_id === currentUser.id || msg.sender_role === currentUser.role;
                  return (
                    <div key={msg.id} className={`chat-message-bubble ${isMe ? 'outgoing' : 'incoming'} ${msg.sender_role}`}>
                      <div className="chat-message-meta">
                        <span className="chat-sender-name">{msg.sender_name}</span>
                        <span className={`chat-sender-pill ${msg.sender_role}`}>{msg.sender_role.toUpperCase()}</span>
                        <span className="chat-timestamp">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="chat-message-text">{msg.message}</div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="collab-chat-input-form">
              <input
                type="text"
                placeholder={currentUser.role === 'admin' ? 'Message candidate or ask clarifying questions...' : 'Message interviewer or explain your approach...'}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="collab-chat-input"
              />
              <button type="submit" disabled={!inputText.trim()} className="collab-send-btn">
                Send
              </button>
            </form>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="collab-telemetry-container">
            {lastExecutionEvent && (
              <div className={`telemetry-kpi-card ${lastExecutionEvent.status}`}>
                <div className="kpi-header">
                  <span className="kpi-title">Latest Execution Event</span>
                  <span className="kpi-status-tag">{lastExecutionEvent.status.toUpperCase()}</span>
                </div>
                <div className="kpi-details">
                  <span>Tests Passed: <strong>{lastExecutionEvent.testsPassed ?? 0} / {lastExecutionEvent.testsTotal ?? 0}</strong></span>
                  {lastExecutionEvent.executionTime && (
                    <span>Time: <strong>{Math.round(lastExecutionEvent.executionTime)}ms</strong></span>
                  )}
                </div>
                {lastExecutionEvent.stdout && (
                  <pre className="kpi-stdout">{lastExecutionEvent.stdout.slice(0, 240)}</pre>
                )}
              </div>
            )}

            <div className="collab-event-timeline">
              <div className="timeline-item">
                <span className="timeline-dot blue" />
                <div className="timeline-info">
                  <span className="timeline-label">Yjs Real-Time Synchronization</span>
                  <span className="timeline-time">Active & Broadcasting</span>
                </div>
              </div>
              <div className="timeline-item">
                <span className="timeline-dot green" />
                <div className="timeline-info">
                  <span className="timeline-label">Supabase Session Checkpoint</span>
                  <span className="timeline-time">Durable Snapshot Synced</span>
                </div>
              </div>
              <div className="timeline-item">
                <span className="timeline-dot purple" />
                <div className="timeline-info">
                  <span className="timeline-label">Client Sandbox Isolation</span>
                  <span className="timeline-time">Secure Execution Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'participants' && (
          <div className="collab-participants-list">
            <div className="participant-card me">
              <div className="part-avatar" style={{ backgroundColor: '#6366f1' }}>
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="part-info">
                <span className="part-name">{currentUser.name} (You)</span>
                <span className={`part-role-badge ${currentUser.role}`}>{currentUser.role.toUpperCase()}</span>
              </div>
              <span className="online-indicator">● Active</span>
            </div>

            {participants
              .filter(p => p.user_id !== currentUser.id)
              .map(part => (
                <div key={part.id || part.name} className="participant-card">
                  <div className="part-avatar" style={{ backgroundColor: part.role === 'admin' ? '#ef4444' : '#10b981' }}>
                    {part.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="part-info">
                    <span className="part-name">{part.name}</span>
                    <span className={`part-role-badge ${part.role}`}>{part.role.toUpperCase()}</span>
                  </div>
                  <span className="online-indicator">● Connected</span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="collab-drawer-footer">
        {currentUser.role === 'candidate' && onSubmitSession && (
          <button type="button" className="btn btn-primary collab-submit-btn" onClick={onSubmitSession}>
            🚀 Submit Final Solution to Admin
          </button>
        )}
        {!session && onStartSession && (
          <button type="button" className="btn btn-primary collab-submit-btn" onClick={onStartSession}>
            ⚡ Initialize Live Interview Session
          </button>
        )}
      </div>
    </aside>
  );
}
