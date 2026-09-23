/**
 * Meeting Chat Drawer Component
 * Phase 6: Production-Grade In-Meeting Realtime Chat
 * Phase 15: Virtual message list — only renders ~20 visible messages regardless of history size
 * Features:
 * - Realtime room messaging
 * - Host announcements & system messages
 * - Permission-based deletion (author & host) with tombstone rendering
 * - Host chat controls (enable/disable) with clear status banners
 * - Emoji reactions (toggle support)
 * - Load older message pagination
 * - Keyboard navigation & WCAG accessibility
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { ChatMessageRecord, ChatMessageType } from '../../../../server/meetings/chatTypes.ts';
import type { RemoteParticipant } from '../types/mediaRoomTypes.ts';

interface MeetingChatDrawerProps {
  meetingId: string;
  currentUserId: string;
  currentUserName: string;
  participants: RemoteParticipant[];
  messages: ChatMessageRecord[];
  isHost?: boolean;
  allowChat?: boolean;
  hasMoreOlderMessages?: boolean;
  onSendMessage: (
    content: string,
    recipientId: string,
    messageType: ChatMessageType,
    replyToMessageId?: string
  ) => Promise<void>;
  onAddReaction: (messageId: string, emoji: string) => Promise<void>;
  onDeleteMessage?: (messageId: string) => Promise<void>;
  onToggleChat?: (allowChat: boolean) => Promise<void>;
  onSendAnnouncement?: (content: string) => Promise<void>;
  onLoadOlderMessages?: () => Promise<void>;
  onClose: () => void;
}

const COMMON_REACTIONS = ['👍', '❤️', '👏', '🚀', '💡', '❓'];

export const MeetingChatDrawer: React.FC<MeetingChatDrawerProps> = ({
  currentUserId,
  participants,
  messages,
  isHost = false,
  allowChat = true,
  hasMoreOlderMessages = false,
  onSendMessage,
  onAddReaction,
  onDeleteMessage,
  onToggleChat,
  onSendAnnouncement,
  onLoadOlderMessages,
  onClose,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [recipientId, setRecipientId] = useState<string>('ALL');
  const [isCodeMode, setIsCodeMode] = useState<boolean>(false);
  const [isAnnouncementMode, setIsAnnouncementMode] = useState<boolean>(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessageRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState<boolean>(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Phase 15: Virtual message list — only DOM-renders the visible window of messages.
  // Caps DOM nodes to ~20 items regardless of conversation length.
  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => messagesContainerRef.current,
    estimateSize: useCallback(() => 72, []), // estimated px per message row
    overscan: 5,
  });

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (messages.length > 0) {
      virtualizer.scrollToIndex(messages.length - 1, { behavior: 'smooth' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      if (isAnnouncementMode && onSendAnnouncement && isHost) {
        await onSendAnnouncement(inputText.trim());
        setIsAnnouncementMode(false);
      } else {
        const msgType: ChatMessageType = isCodeMode ? 'CODE' : 'USER_MESSAGE';
        await onSendMessage(
          inputText.trim(),
          recipientId,
          msgType,
          replyingTo ? replyingTo.id : undefined
        );
      }
      setInputText('');
      setReplyingTo(null);
      setIsCodeMode(false);
    } catch (err: any) {
      setStatusFeedback(err?.message || 'Failed to send message.');
      setTimeout(() => setStatusFeedback(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!onDeleteMessage) return;
    try {
      await onDeleteMessage(messageId);
    } catch (err: any) {
      setStatusFeedback(err?.message || 'Failed to delete message.');
      setTimeout(() => setStatusFeedback(null), 3000);
    }
  };

  const handleToggleChatClick = async () => {
    if (!onToggleChat || !isHost) return;
    try {
      await onToggleChat(!allowChat);
    } catch (err: any) {
      setStatusFeedback(err?.message || 'Failed to toggle chat.');
      setTimeout(() => setStatusFeedback(null), 3000);
    }
  };

  const handleLoadOlder = async () => {
    if (!onLoadOlderMessages || isLoadingOlder) return;
    try {
      setIsLoadingOlder(true);
      await onLoadOlderMessages();
    } finally {
      setIsLoadingOlder(false);
    }
  };

  const formatTime = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const isInputDisabled = (!allowChat && !isHost) || isSubmitting;

  return (
    <aside
      className="rtc-side-drawer rtc-chat-drawer"
      aria-label="Meeting Chat Panel"
      role="region"
    >
      {/* Drawer Header */}
      <div className="rtc-drawer-header">
        <div className="rtc-chat-header-title-box">
          <h3>In-Call Messages</h3>
          <span className={`rtc-chat-badge ${allowChat ? 'active' : 'disabled'}`}>
            {allowChat ? 'Real-Time' : 'Disabled'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isHost && onToggleChat && (
            <button
              type="button"
              className="rtc-action-pill-btn"
              onClick={handleToggleChatClick}
              title={allowChat ? 'Disable chat for participants' : 'Enable chat for participants'}
              style={{
                fontSize: '0.75rem',
                padding: '4px 8px',
                borderRadius: '6px',
                background: allowChat ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: allowChat ? '#ef4444' : '#10b981',
                border: `1px solid ${allowChat ? '#ef4444' : '#10b981'}`,
                cursor: 'pointer',
              }}
            >
              {allowChat ? '🔒 Disable Chat' : '🔓 Enable Chat'}
            </button>
          )}
          <button
            type="button"
            className="rtc-drawer-close"
            onClick={onClose}
            title="Close chat"
            aria-label="Close meeting chat"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Chat Disabled Warning Banner */}
      {!allowChat && (
        <div
          role="alert"
          style={{
            background: 'rgba(239, 68, 68, 0.12)',
            borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '8px 14px',
            fontSize: '0.8rem',
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🔇</span>
          <span>
            {isHost
              ? 'Chat is disabled for participants. You can still post host announcements.'
              : 'Chat is currently disabled by the meeting host. Messages are read-only.'}
          </span>
        </div>
      )}

      {/* Feedback Toast */}
      {statusFeedback && (
        <div
          role="status"
          style={{
            background: 'rgba(245, 158, 11, 0.15)',
            borderBottom: '1px solid #f59e0b',
            padding: '6px 12px',
            fontSize: '0.78rem',
            color: '#f59e0b',
            textAlign: 'center',
          }}
        >
          {statusFeedback}
        </div>
      )}

      {/* Direct Messaging Target Filter Bar */}
      <div className="rtc-chat-recipient-bar">
        <label htmlFor="chat-recipient-select">To:</label>
        <select
          id="chat-recipient-select"
          value={recipientId}
          onChange={e => setRecipientId(e.target.value)}
          className="rtc-chat-recipient-select"
          disabled={!allowChat && !isHost}
        >
          <option value="ALL">Everyone in Call</option>
          {participants.map(p => (
            <option key={p.id} value={p.id}>
              Direct: {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Messages Scroll View — Phase 15: virtual list */}
      <div
        ref={messagesContainerRef}
        className="rtc-chat-messages-container"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        style={{ overflowY: 'auto', position: 'relative' }}
      >
        {/* Load older messages button */}
        {hasMoreOlderMessages && onLoadOlderMessages && (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <button
              type="button"
              onClick={handleLoadOlder}
              disabled={isLoadingOlder}
              className="rtc-action-pill-btn"
              style={{
                fontSize: '0.75rem',
                padding: '4px 12px',
                borderRadius: '12px',
                cursor: 'pointer',
              }}
            >
              {isLoadingOlder ? '⏳ Loading history...' : '↑ Load older messages'}
            </button>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="rtc-chat-empty-state">
            <span className="rtc-chat-empty-icon">💬</span>
            <p>No messages yet in this meeting.</p>
            <span className="rtc-chat-empty-sub">Send a question, note, or code snippet!</span>
          </div>
        ) : (
          // Phase 15: Virtual list — total height div + only visible items rendered
          <div style={{ height: `${virtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
            {virtualizer.getVirtualItems().map(virtualRow => {
              const msg = messages[virtualRow.index];
              if (!msg) return null;
              const isLocal = msg.senderId === currentUserId;
              const isDirect = msg.recipientId !== 'ALL';
              const isSystem = msg.messageType === 'SYSTEM_MESSAGE' || msg.messageType === 'SYSTEM';
              const isAnnouncement = msg.messageType === 'HOST_ANNOUNCEMENT';
              const canDelete = !msg.isDeleted && onDeleteMessage && (isLocal || isHost);

              const style: React.CSSProperties = {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              };

              // ── System Messages ───────────────────────────────────────────
              if (isSystem) {
                return (
                  <div
                    key={msg.id}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                    style={style}
                    className="rtc-chat-system-message"
                  >
                    <span style={{ fontSize: '0.85rem' }}>⚙️</span>
                    <span>{msg.content}</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>• {formatTime(msg.createdAt)}</span>
                  </div>
                );
              }

              // ── Host Announcements ────────────────────────────────────────
              if (isAnnouncement) {
                return (
                  <div
                    key={msg.id}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                    style={style}
                    className="rtc-chat-announcement-card"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        📢 Host Announcement
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--rtc-text-muted, #94a3b8)' }}>
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--rtc-text-primary, #ffffff)', lineHeight: 1.45 }}>
                      {msg.isDeleted ? 'This announcement was deleted.' : msg.content}
                    </p>
                  </div>
                );
              }

              // ── Standard User Messages ────────────────────────────────────
              return (
                <div
                  key={msg.id}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  style={style}
                  className={`rtc-chat-message-item ${isLocal ? 'is-local' : 'is-remote'} ${
                    isDirect ? 'is-direct' : ''
                  } ${msg.isDeleted ? 'is-deleted' : ''}`}
                >
                  <div className="rtc-chat-msg-header">
                    <span className="rtc-chat-msg-author">{isLocal ? 'You' : msg.senderName}</span>
                    {msg.senderRole === 'HOST' && <span className="rtc-role-pill rtc-role-host">Host</span>}
                    {msg.senderRole === 'CO_HOST' && <span className="rtc-role-pill rtc-role-cohost">Co-Host</span>}
                    {isDirect && (
                      <span className="rtc-chat-direct-pill">
                        🔒 Direct {isLocal ? `to ${msg.recipientName || 'Participant'}` : 'to You'}
                      </span>
                    )}
                    <span className="rtc-chat-msg-time">{formatTime(msg.createdAt)}</span>
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDelete(msg.id)}
                        title="Delete message"
                        aria-label={`Delete message from ${msg.senderName}`}
                        style={{ background: 'transparent', border: 'none', color: 'var(--rtc-text-muted, #94a3b8)', cursor: 'pointer', fontSize: '0.85rem', marginLeft: 'auto', padding: '2px 4px', borderRadius: '4px' }}
                      >🗑️</button>
                    )}
                  </div>
                  {msg.replyToSnippet && !msg.isDeleted && (
                    <div className="rtc-chat-reply-quote">
                      <span className="rtc-chat-reply-icon">↩</span>
                      <span className="rtc-chat-reply-text">{msg.replyToSnippet}...</span>
                    </div>
                  )}
                  <div className={`rtc-chat-msg-body ${msg.messageType === 'CODE' ? 'rtc-chat-code-snippet' : ''}`}>
                    {msg.isDeleted ? (
                      <p style={{ fontStyle: 'italic', color: 'var(--rtc-text-muted, #94a3b8)', margin: 0 }}>🚫 This message was deleted.</p>
                    ) : msg.messageType === 'CODE' ? (
                      <pre><code>{msg.content}</code></pre>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                  {!msg.isDeleted && (
                    <div className="rtc-chat-reactions-row">
                      {Object.entries(msg.reactions || {}).map(([emoji, userIds]) => {
                        const hasReacted = (userIds as string[]).includes(currentUserId);
                        return (
                          <button key={emoji} type="button" className={`rtc-chat-reaction-pill ${hasReacted ? 'active' : ''}`} onClick={() => onAddReaction(msg.id, emoji)}>
                            <span>{emoji}</span>
                            <span className="rtc-reaction-count">{(userIds as string[]).length}</span>
                          </button>
                        );
                      })}
                      <div className="rtc-reaction-hover-picker">
                        {COMMON_REACTIONS.map(emoji => (
                          <button key={emoji} type="button" className="rtc-quick-reaction-btn" onClick={() => onAddReaction(msg.id, emoji)}>{emoji}</button>
                        ))}
                        <button type="button" className="rtc-reply-action-btn" onClick={() => setReplyingTo(msg)} title="Reply to message">↩ Reply</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>


      {/* Reply Banner */}
      {replyingTo && (
        <div className="rtc-chat-active-reply-banner">
          <div>
            <span className="rtc-replying-to-label">Replying to {replyingTo.senderName}:</span>
            <span className="rtc-replying-to-snippet">
              {replyingTo.content.slice(0, 45)}...
            </span>
          </div>
          <button
            type="button"
            className="rtc-reply-cancel-btn"
            onClick={() => setReplyingTo(null)}
            aria-label="Cancel reply"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSend} className="rtc-chat-input-form">
        <div className="rtc-chat-input-tools">
          <button
            type="button"
            className={`rtc-chat-format-btn ${isCodeMode ? 'active' : ''}`}
            onClick={() => {
              setIsCodeMode(prev => !prev);
              setIsAnnouncementMode(false);
            }}
            disabled={isInputDisabled}
            title={isCodeMode ? 'Switch to Standard Text' : 'Format as Code Snippet'}
            aria-label={isCodeMode ? 'Switch to standard text' : 'Format as code snippet'}
          >
            &lt;/&gt; Code
          </button>

          {isHost && (
            <button
              type="button"
              className={`rtc-chat-format-btn ${isAnnouncementMode ? 'active' : ''}`}
              onClick={() => {
                setIsAnnouncementMode(prev => !prev);
                setIsCodeMode(false);
              }}
              title="Post as Host Announcement"
              aria-label="Post as host announcement"
              style={{
                color: isAnnouncementMode ? '#f59e0b' : undefined,
                borderColor: isAnnouncementMode ? '#f59e0b' : undefined,
              }}
            >
              📢 Announcement
            </button>
          )}

          {recipientId !== 'ALL' && (
            <span className="rtc-chat-direct-active-hint">🔒 Direct Mode Active</span>
          )}
        </div>

        <div className="rtc-chat-input-row">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={
              !allowChat && !isHost
                ? 'Chat is currently disabled by the host.'
                : isAnnouncementMode
                ? 'Post a priority announcement to all participants...'
                : isCodeMode
                ? 'Paste or type code snippet...'
                : recipientId === 'ALL'
                ? 'Send a message to everyone...'
                : 'Send private direct message...'
            }
            className="rtc-chat-text-input"
            disabled={isInputDisabled}
            aria-label="Chat message content"
            maxLength={4000}
          />
          <button
            type="submit"
            className="rtc-btn rtc-btn-primary rtc-chat-send-btn"
            disabled={!inputText.trim() || isInputDisabled}
            aria-label="Send message"
          >
            {isSubmitting ? '...' : isAnnouncementMode ? 'Post' : 'Send'}
          </button>
        </div>
      </form>
    </aside>
  );
};
