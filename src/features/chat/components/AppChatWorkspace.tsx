import React, { useState, useEffect, useRef } from 'react';
import { appChatClientService } from '../services/appChatClientService.ts';
import type { AppConversation, AppMessage, UserPresence } from '../types.ts';

// Clean inline SVG icons
const Icons = {
  MessageSquare: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  Users: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Search: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Plus: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Send: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  Trash2: ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  ChevronLeft: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  Info: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  LogOut: ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  X: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Sparkles: ({ className = 'w-8 h-8' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
};

interface AppChatWorkspaceProps {
  currentUser?: {
    id: string;
    name: string;
    email?: string;
    role?: string;
  };
  token?: string;
}

export const AppChatWorkspace: React.FC<AppChatWorkspaceProps> = ({
  currentUser = { id: 'usr_candidate_dev', name: 'Developer User', role: 'candidate' },
  token = 'dev_mock_token',
}) => {
  const [conversations, setConversations] = useState<AppConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AppMessage[]>([]);
  const [inputContent, setInputContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState<Record<string, string>>({});
  const [presences, setPresences] = useState<Record<string, UserPresence>>({});
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newChatType, setNewChatType] = useState<'DIRECT' | 'GROUP'>('DIRECT');
  const [newTargetUserId, setNewTargetUserId] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMobileList, setShowMobileList] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<any>(null);

  useEffect(() => {
    appChatClientService.connect(token, currentUser);

    const cleanup = appChatClientService.registerHandlers({
      onMessageCreated: (msg) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id || (m.clientMessageId && m.clientMessageId === msg.clientMessageId))) {
            return prev;
          }
          if (msg.conversationId === activeConvId) {
            return [...prev, msg];
          }
          return prev;
        });

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === msg.conversationId) {
              const isCurrent = c.id === activeConvId;
              return {
                ...c,
                lastMessagePreview: msg.content,
                lastMessageAt: msg.createdAt,
                unreadCount: isCurrent ? 0 : (c.unreadCount || 0) + 1,
              };
            }
            return c;
          })
        );
      },

      onMessageDeleted: ({ conversationId, messageId }) => {
        if (conversationId === activeConvId) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === messageId ? { ...m, isDeleted: true, content: 'This message was deleted.' } : m
            )
          );
        }
      },

      onTypingUpdate: ({ conversationId, userId, userName, isTyping: typingStatus }) => {
        if (userId === currentUser.id) return;
        setIsTyping((prev) => {
          const next = { ...prev };
          if (typingStatus) next[conversationId] = userName;
          else delete next[conversationId];
          return next;
        });
      },

      onPresenceUpdate: ({ userId, status, lastSeen }) => {
        setPresences((prev) => ({
          ...prev,
          [userId]: { userId, status, lastSeen },
        }));
      },
    });

    loadConversations();

    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, currentUser.id, activeConvId]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await appChatClientService.fetchConversations();
      setConversations(data.conversations);
      if (data.conversations.length > 0 && !activeConvId) {
        selectConversation(data.conversations[0].id);
      }
    } catch (err) {
      console.warn('Could not load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (convId: string) => {
    setActiveConvId(convId);
    setShowMobileList(false);
    appChatClientService.setActiveConversation(convId);

    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c))
    );
    appChatClientService.markAsRead(convId);

    try {
      const data = await appChatClientService.fetchMessages(convId);
      setMessages(data.messages || []);
      scrollToBottom();
    } catch (err) {
      console.error('Failed to fetch messages for conv:', err);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputContent(e.target.value);
    if (!activeConvId) return;

    appChatClientService.startTyping(activeConvId);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      if (activeConvId) appChatClientService.stopTyping(activeConvId);
    }, 2000);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputContent.trim() || !activeConvId) return;

    const content = inputContent.trim();
    setInputContent('');
    const clientMessageId = `cmsg_${Date.now()}`;

    try {
      const sent = await appChatClientService.sendMessage(activeConvId, content, clientMessageId);
      setMessages((prev) => (prev.some((m) => m.id === sent.id) ? prev : [...prev, sent]));
      scrollToBottom();
    } catch (err: any) {
      console.error('Failed to send message:', err);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!activeConvId) return;
    try {
      await appChatClientService.deleteMessage(activeConvId, messageId);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, isDeleted: true, content: 'This message was deleted.' } : m
        )
      );
    } catch (err: any) {
      alert(err.message || 'Could not delete message');
    }
  };

  const handleCreateNewConversation = async () => {
    if (newChatType === 'DIRECT') {
      if (!newTargetUserId.trim()) {
        alert('Please enter a target User ID');
        return;
      }
      try {
        const { conversation } = await appChatClientService.createConversation({
          type: 'DIRECT',
          participantIds: [newTargetUserId.trim()],
        });
        setShowNewModal(false);
        setNewTargetUserId('');
        await loadConversations();
        selectConversation(conversation.id);
      } catch (err: any) {
        alert(err.message || 'Failed to create DM');
      }
    } else {
      if (!newGroupName.trim()) {
        alert('Please enter a group name');
        return;
      }
      try {
        const participantIds = newTargetUserId
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        const { conversation } = await appChatClientService.createConversation({
          type: 'GROUP',
          name: newGroupName.trim(),
          participantIds,
        });
        setShowNewModal(false);
        setNewGroupName('');
        setNewTargetUserId('');
        await loadConversations();
        selectConversation(conversation.id);
      } catch (err: any) {
        alert(err.message || 'Failed to create group');
      }
    }
  };

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const otherParticipant = activeConv?.participants?.find((p) => p.userId !== currentUser.id);
  const isDirect = activeConv?.type === 'DIRECT';
  const displayName = isDirect
    ? otherParticipant?.userName || 'Direct Message'
    : activeConv?.name || 'Group Conversation';

  const isOtherOnline = otherParticipant ? presences[otherParticipant.userId]?.status === 'ONLINE' : false;

  const filteredConversations = conversations.filter((c) => {
    const name = c.name || c.participants?.map((p) => p.userName).join(' ') || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-[88vh] bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-sans">
      {/* ── COLUMN 1: CONVERSATIONS LIST ─────────────────────────────────── */}
      <div
        className={`${
          showMobileList ? 'flex' : 'hidden md:flex'
        } w-full md:w-80 lg:w-96 flex-col border-r border-slate-800/80 bg-slate-900/60 backdrop-blur-md`}
      >
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Icons.MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">Messages</h2>
              <p className="text-xs text-slate-400">Direct & Team Chats</p>
            </div>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1 text-xs font-medium"
            title="Start conversation"
          >
            <Icons.Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>

        <div className="p-3 border-b border-slate-800/50">
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-500">
              <Icons.Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-800/50 border border-slate-700/60 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/30">
          {loading && conversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">Loading conversations...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No conversations found. Click &quot;New Chat&quot; to start one.
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConvId;
              const other = conv.participants?.find((p) => p.userId !== currentUser.id);
              const title = conv.type === 'DIRECT' ? other?.userName || 'Direct Chat' : conv.name;
              const online = other ? presences[other.userId]?.status === 'ONLINE' : false;

              return (
                <button
                  key={conv.id}
                  onClick={() => selectConversation(conv.id)}
                  className={`w-full p-3.5 flex items-start gap-3 transition-colors text-left ${
                    isSelected ? 'bg-indigo-600/15 border-l-4 border-indigo-500' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-medium text-slate-200 text-sm">
                      {conv.type === 'GROUP' ? <Icons.Users className="w-5 h-5 text-indigo-400" /> : title?.[0]?.toUpperCase() || 'U'}
                    </div>
                    {conv.type === 'DIRECT' && (
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                          online ? 'bg-emerald-500' : 'bg-slate-600'
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-200 truncate">{title}</span>
                      {conv.lastMessageAt && (
                        <span className="text-[10px] text-slate-500">
                          {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-400 truncate max-w-[180px]">
                        {isTyping[conv.id] ? (
                          <span className="text-indigo-400 italic font-medium">{isTyping[conv.id]} is typing...</span>
                        ) : (
                          conv.lastMessagePreview || 'No messages yet'
                        )}
                      </p>
                      {Boolean(conv.unreadCount && conv.unreadCount > 0) && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500 text-white">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── COLUMN 2: ACTIVE CONVERSATION WORKSPACE ──────────────────────── */}
      <div className={`${!showMobileList ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-slate-950/80`}>
        {activeConv ? (
          <>
            <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/40 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMobileList(true)}
                  className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <Icons.ChevronLeft className="w-5 h-5" />
                </button>
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-medium text-slate-200 text-xs">
                    {isDirect ? displayName?.[0]?.toUpperCase() : <Icons.Users className="w-4 h-4 text-indigo-400" />}
                  </div>
                  {isDirect && (
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-950 ${
                        isOtherOnline ? 'bg-emerald-500' : 'bg-slate-600'
                      }`}
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                    {displayName}
                    {!isDirect && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">
                        {activeConv.participants?.length || 0} members
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isTyping[activeConv.id] ? (
                      <span className="text-indigo-400 italic">{isTyping[activeConv.id]} is typing...</span>
                    ) : isDirect ? (
                      isOtherOnline ? 'Online' : 'Offline'
                    ) : (
                      'Group'
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {!isDirect && (
                  <button
                    onClick={() => setShowDetailsPanel(!showDetailsPanel)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                    title="Group details"
                  >
                    <Icons.Info className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
                  <Icons.Sparkles className="w-8 h-8 text-indigo-500/40 mb-2" />
                  <p>No messages yet. Send a greeting to start chatting!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.senderId === currentUser.id;
                  const isSystem = msg.messageType === 'SYSTEM_MESSAGE';

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="flex justify-center my-2">
                        <span className="px-3 py-1 rounded-full text-[11px] bg-slate-800/80 text-slate-400 border border-slate-700/50">
                          {msg.content}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col group ${isOwn ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-baseline gap-1.5 mb-1 px-1">
                        {!isOwn && (
                          <span className="text-[11px] font-semibold text-indigo-300">
                            {msg.senderName}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 max-w-[80%]">
                        {isOwn && !msg.isDeleted && (
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-opacity"
                            title="Delete message"
                          >
                            <Icons.Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <div
                          className={`px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                            msg.isDeleted
                              ? 'bg-slate-900 border border-slate-800 text-slate-500 italic'
                              : isOwn
                              ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md shadow-indigo-600/10'
                              : 'bg-slate-800/90 text-slate-200 border border-slate-700/50 rounded-tl-sm'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-800/80 bg-slate-900/30">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <textarea
                  value={inputContent}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message (Enter to send, Shift+Enter for newline)..."
                  rows={1}
                  className="flex-1 max-h-28 min-h-[38px] p-2.5 text-xs bg-slate-800/70 border border-slate-700/70 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputContent.trim()}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all shadow-md shadow-indigo-600/20"
                >
                  <Icons.Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
            <Icons.MessageSquare className="w-12 h-12 text-slate-800 mb-3" />
            <p>Select a conversation or start a new chat</p>
          </div>
        )}
      </div>

      {/* ── COLUMN 3: GROUP DETAILS & MEMBERS PANEL (COLLAPSIBLE) ───────── */}
      {showDetailsPanel && activeConv && !isDirect && (
        <div className="w-72 border-l border-slate-800/80 bg-slate-900/70 p-4 flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Group Info</h4>
            <button
              onClick={() => setShowDetailsPanel(false)}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <Icons.X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h5 className="text-xs text-slate-400 mb-2 font-medium">
              Members ({activeConv.participants?.length || 0})
            </h5>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {activeConv.participants?.map((p) => (
                <div key={p.userId} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-300 font-semibold">
                      {p.userName?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-slate-200">{p.userName}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    {p.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/60">
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to leave this group?')) {
                  try {
                    await appChatClientService.leaveGroup(activeConv.id);
                    await loadConversations();
                    setActiveConvId(null);
                  } catch (err: any) {
                    alert(err.message || 'Could not leave group');
                  }
                }
              }}
              className="w-full py-2 px-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Icons.LogOut className="w-3.5 h-3.5" />
              Leave Group
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL: CREATE DIRECT MESSAGE OR GROUP ────────────────────────── */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-white">Start New Conversation</h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <Icons.X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800/60 rounded-xl">
              <button
                onClick={() => setNewChatType('DIRECT')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  newChatType === 'DIRECT' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Direct Message
              </button>
              <button
                onClick={() => setNewChatType('GROUP')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  newChatType === 'GROUP' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Group Chat
              </button>
            </div>

            {newChatType === 'GROUP' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Group Name</label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Team"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {newChatType === 'DIRECT' ? 'Recipient User ID' : 'Participant User IDs (comma-separated)'}
              </label>
              <input
                type="text"
                placeholder={newChatType === 'DIRECT' ? 'e.g. usr_candidate_bob' : 'usr_bob, usr_alice'}
                value={newTargetUserId}
                onChange={(e) => setNewTargetUserId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-3.5 py-1.5 text-xs rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewConversation}
                className="px-4 py-1.5 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-600/20"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppChatWorkspace;
