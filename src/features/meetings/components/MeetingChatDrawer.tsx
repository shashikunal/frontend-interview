/**
 * Meeting Chat Drawer Component
 * Phase 5: Real-Time In-Meeting Chat & Direct Messaging
 */

import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessageRecord, ChatMessageType } from '../../../../server/meetings/chatTypes.ts';
import type { RemoteParticipant } from '../types/mediaRoomTypes.ts';

interface MeetingChatDrawerProps {
  meetingId: string;
  currentUserId: string;
  currentUserName: string;
  participants: RemoteParticipant[];
  messages: ChatMessageRecord[];
  onSendMessage: (
    content: string,
    recipientId: string,
    messageType: ChatMessageType,
    replyToMessageId?: string
  ) => Promise<void>;
  onAddReaction: (messageId: string, emoji: string) => Promise<void>;
  onClose: () => void;
}

const COMMON_REACTIONS = ['👍', '❤️', '👏', '🚀', '💡', '❓'];

export const MeetingChatDrawer: React.FC<MeetingChatDrawerProps> = ({
  currentUserId,
  participants,
  messages,
  onSendMessage,
  onAddReaction,
  onClose,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [recipientId, setRecipientId] = useState<string>('ALL');
  const [isCodeMode, setIsCodeMode] = useState<boolean>(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessageRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSendMessage(
        inputText.trim(),
        recipientId,
        isCodeMode ? 'CODE' : 'TEXT',
        replyingTo ? replyingTo.id : undefined
      );
      setInputText('');
      setReplyingTo(null);
      setIsCodeMode(false);
    } finally {
      setIsSubmitting(false);
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

  return (
    <aside className="rtc-side-drawer rtc-chat-drawer">
      {/* Drawer Header */}
      <div className="rtc-drawer-header">
        <div className="rtc-chat-header-title-box">
          <h3>In-Call Messages</h3>
          <span className="rtc-chat-badge">Real-Time</span>
        </div>
        <button
          type="button"
          className="rtc-drawer-close"
          onClick={onClose}
          title="Close chat"
        >
          ✕
        </button>
      </div>

      {/* Direct Messaging Target Filter Bar */}
      <div className="rtc-chat-recipient-bar">
        <label>To:</label>
        <select
          value={recipientId}
          onChange={e => setRecipientId(e.target.value)}
          className="rtc-chat-recipient-select"
        >
          <option value="ALL">Everyone in Call</option>
          {participants.map(p => (
            <option key={p.id} value={p.id}>
              Direct: {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Messages Scroll View */}
      <div className="rtc-chat-messages-container">
        {messages.length === 0 ? (
          <div className="rtc-chat-empty-state">
            <span className="rtc-chat-empty-icon">💬</span>
            <p>No messages yet in this meeting.</p>
            <span className="rtc-chat-empty-sub">Send a question, note, or code snippet!</span>
          </div>
        ) : (
          messages.map(msg => {
            const isLocal = msg.senderId === currentUserId;
            const isDirect = msg.recipientId !== 'ALL';

            return (
              <div
                key={msg.id}
                className={`rtc-chat-message-item ${isLocal ? 'is-local' : 'is-remote'} ${
                  isDirect ? 'is-direct' : ''
                }`}
              >
                {/* Message Header */}
                <div className="rtc-chat-msg-header">
                  <span className="rtc-chat-msg-author">
                    {isLocal ? 'You' : msg.senderName}
                  </span>
                  {msg.senderRole === 'HOST' && (
                    <span className="rtc-role-pill rtc-role-host">Host</span>
                  )}
                  {msg.senderRole === 'CO_HOST' && (
                    <span className="rtc-role-pill rtc-role-cohost">Co-Host</span>
                  )}
                  {isDirect && (
                    <span className="rtc-chat-direct-pill">
                      🔒 Direct {isLocal ? `to ${msg.recipientName || 'Participant'}` : 'to You'}
                    </span>
                  )}
                  <span className="rtc-chat-msg-time">{formatTime(msg.createdAt)}</span>
                </div>

                {/* Reply To Reference Banner */}
                {msg.replyToSnippet && (
                  <div className="rtc-chat-reply-quote">
                    <span className="rtc-chat-reply-icon">↩</span>
                    <span className="rtc-chat-reply-text">{msg.replyToSnippet}...</span>
                  </div>
                )}

                {/* Message Body Content */}
                <div
                  className={`rtc-chat-msg-body ${
                    msg.messageType === 'CODE' ? 'rtc-chat-code-snippet' : ''
                  }`}
                >
                  {msg.messageType === 'CODE' ? (
                    <pre>
                      <code>{msg.content}</code>
                    </pre>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>

                {/* Reactions Row */}
                <div className="rtc-chat-reactions-row">
                  {Object.entries(msg.reactions || {}).map(([emoji, userIds]) => {
                    const hasReacted = userIds.includes(currentUserId);
                    return (
                      <button
                        key={emoji}
                        type="button"
                        className={`rtc-chat-reaction-pill ${hasReacted ? 'active' : ''}`}
                        onClick={() => onAddReaction(msg.id, emoji)}
                        title={`${userIds.length} reaction${userIds.length > 1 ? 's' : ''}`}
                      >
                        <span>{emoji}</span>
                        <span className="rtc-reaction-count">{userIds.length}</span>
                      </button>
                    );
                  })}

                  {/* Reaction Picker Button */}
                  <div className="rtc-reaction-hover-picker">
                    {COMMON_REACTIONS.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        className="rtc-quick-reaction-btn"
                        onClick={() => onAddReaction(msg.id, emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="rtc-reply-action-btn"
                      onClick={() => setReplyingTo(msg)}
                      title="Reply to message"
                    >
                      ↩ Reply
                    </button>
                  </div>
                </div>
              </div>
            );
          })
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
            onClick={() => setIsCodeMode(prev => !prev)}
            title={isCodeMode ? 'Switch to Standard Text' : 'Format as Code Snippet'}
          >
            &lt;/&gt; Code
          </button>
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
              isCodeMode
                ? 'Paste or type code snippet...'
                : recipientId === 'ALL'
                ? 'Send a message to everyone...'
                : 'Send private direct message...'
            }
            className="rtc-chat-text-input"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="rtc-btn rtc-btn-primary rtc-chat-send-btn"
            disabled={!inputText.trim() || isSubmitting}
          >
            {isSubmitting ? '...' : 'Send'}
          </button>
        </div>
      </form>
    </aside>
  );
};
