/**
 * Client Collaborative Code Editor Service
 * Phase 7: Real-Time Collaborative Monaco Code Editor & Execution Sandbox
 */

import type {
  MeetingEditorDocument,
  SupportedLanguage,
  ProblemTemplate,
  CodeExecutionResult,
} from '../../../../server/meetings/editorTypes.ts';

export interface EditorBroadcastMessage {
  type:
    | 'CODE_CHANGED'
    | 'LANGUAGE_CHANGED'
    | 'LOCK_TOGGLED'
    | 'TEMPLATE_LOADED'
    | 'CODE_RESET'
    | 'CODE_EXECUTED'
    | 'PRESENCE_UPDATED';
  meetingId: string;
  userId: string;
  userName: string;
  document?: MeetingEditorDocument;
  result?: CodeExecutionResult;
  cursorLine?: number;
  cursorColumn?: number;
}

export class EditorClientService {
  private broadcastChannels: Map<string, BroadcastChannel> = new Map();

  /**
   * Get or create native BroadcastChannel for cross-tab realtime sync
   */
  private getBroadcastChannel(meetingId: string): BroadcastChannel | null {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
      return null;
    }

    if (!this.broadcastChannels.has(meetingId)) {
      const channel = new BroadcastChannel(`meet_editor_${meetingId}`);
      this.broadcastChannels.set(meetingId, channel);
    }

    return this.broadcastChannels.get(meetingId)!;
  }

  /**
   * Fetch code editor document snapshot and templates from server
   */
  public async getSnapshot(
    meetingId: string,
    meetingToken: string
  ): Promise<{ document: MeetingEditorDocument; templates: ProblemTemplate[] }> {
    const res = await fetch(`/api/v1/meetings/editor?meetingId=${encodeURIComponent(meetingId)}`, {
      headers: {
        Authorization: `Bearer ${meetingToken}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to fetch editor snapshot (${res.status})`);
    }

    const data = await res.json();
    return {
      document: data.document,
      templates: data.templates || [],
    };
  }

  /**
   * Synchronize code changes to server and broadcast to peers
   */
  public async syncCode(
    meetingId: string,
    meetingToken: string,
    code: string,
    userId: string,
    userName: string
  ): Promise<MeetingEditorDocument> {
    const res = await fetch('/api/v1/meetings/editor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${meetingToken}`,
      },
      body: JSON.stringify({
        meetingId,
        action: 'SYNC_CODE',
        code,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to sync code (${res.status})`);
    }

    const data = await res.json();
    const doc: MeetingEditorDocument = data.document;

    // Broadcast change to other local tabs
    const channel = this.getBroadcastChannel(meetingId);
    if (channel) {
      channel.postMessage({
        type: 'CODE_CHANGED',
        meetingId,
        userId,
        userName,
        document: doc,
      } as EditorBroadcastMessage);
    }

    return doc;
  }

  /**
   * Change programming language
   */
  public async setLanguage(
    meetingId: string,
    meetingToken: string,
    language: SupportedLanguage,
    userId: string,
    userName: string,
    replaceCodeWithStarter = false
  ): Promise<MeetingEditorDocument> {
    const res = await fetch('/api/v1/meetings/editor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${meetingToken}`,
      },
      body: JSON.stringify({
        meetingId,
        action: 'SET_LANGUAGE',
        language,
        replaceCodeWithStarter,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to set language (${res.status})`);
    }

    const data = await res.json();
    const doc: MeetingEditorDocument = data.document;

    const channel = this.getBroadcastChannel(meetingId);
    if (channel) {
      channel.postMessage({
        type: 'LANGUAGE_CHANGED',
        meetingId,
        userId,
        userName,
        document: doc,
      } as EditorBroadcastMessage);
    }

    return doc;
  }

  /**
   * Toggle Read-Only lock (Host/Co-host permission only)
   */
  public async toggleLock(
    meetingId: string,
    meetingToken: string,
    readOnly: boolean,
    userId: string,
    userName: string
  ): Promise<MeetingEditorDocument> {
    const res = await fetch('/api/v1/meetings/editor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${meetingToken}`,
      },
      body: JSON.stringify({
        meetingId,
        action: 'TOGGLE_LOCK',
        readOnly,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to toggle lock (${res.status})`);
    }

    const data = await res.json();
    const doc: MeetingEditorDocument = data.document;

    const channel = this.getBroadcastChannel(meetingId);
    if (channel) {
      channel.postMessage({
        type: 'LOCK_TOGGLED',
        meetingId,
        userId,
        userName,
        document: doc,
      } as EditorBroadcastMessage);
    }

    return doc;
  }

  /**
   * Load problem template
   */
  public async loadTemplate(
    meetingId: string,
    meetingToken: string,
    templateId: string,
    userId: string,
    userName: string
  ): Promise<{ document: MeetingEditorDocument; template: ProblemTemplate }> {
    const res = await fetch('/api/v1/meetings/editor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${meetingToken}`,
      },
      body: JSON.stringify({
        meetingId,
        action: 'LOAD_TEMPLATE',
        templateId,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to load template (${res.status})`);
    }

    const data = await res.json();
    const doc: MeetingEditorDocument = data.document;

    const channel = this.getBroadcastChannel(meetingId);
    if (channel) {
      channel.postMessage({
        type: 'TEMPLATE_LOADED',
        meetingId,
        userId,
        userName,
        document: doc,
      } as EditorBroadcastMessage);
    }

    return { document: doc, template: data.template };
  }

  /**
   * Reset code to initial template starter
   */
  public async resetCode(
    meetingId: string,
    meetingToken: string,
    userId: string,
    userName: string
  ): Promise<MeetingEditorDocument> {
    const res = await fetch('/api/v1/meetings/editor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${meetingToken}`,
      },
      body: JSON.stringify({
        meetingId,
        action: 'RESET_CODE',
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to reset code (${res.status})`);
    }

    const data = await res.json();
    const doc: MeetingEditorDocument = data.document;

    const channel = this.getBroadcastChannel(meetingId);
    if (channel) {
      channel.postMessage({
        type: 'CODE_RESET',
        meetingId,
        userId,
        userName,
        document: doc,
      } as EditorBroadcastMessage);
    }

    return doc;
  }

  /**
   * Execute code in sandboxed VM runner
   */
  public async runCode(
    meetingId: string,
    meetingToken: string,
    code: string,
    userId: string,
    userName: string
  ): Promise<CodeExecutionResult> {
    const res = await fetch('/api/v1/meetings/editor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${meetingToken}`,
      },
      body: JSON.stringify({
        meetingId,
        action: 'RUN_CODE',
        code,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to run code (${res.status})`);
    }

    const data = await res.json();
    const result: CodeExecutionResult = data.result;

    const channel = this.getBroadcastChannel(meetingId);
    if (channel) {
      channel.postMessage({
        type: 'CODE_EXECUTED',
        meetingId,
        userId,
        userName,
        result,
      } as EditorBroadcastMessage);
    }

    return result;
  }

  /**
   * Broadcast presence (cursor location)
   */
  public broadcastPresence(
    meetingId: string,
    userId: string,
    userName: string,
    cursorLine: number,
    cursorColumn: number
  ): void {
    const channel = this.getBroadcastChannel(meetingId);
    if (channel) {
      channel.postMessage({
        type: 'PRESENCE_UPDATED',
        meetingId,
        userId,
        userName,
        cursorLine,
        cursorColumn,
      } as EditorBroadcastMessage);
    }
  }

  /**
   * Subscribe to real-time editor broadcasts
   */
  public subscribe(
    meetingId: string,
    callback: (message: EditorBroadcastMessage) => void
  ): () => void {
    const channel = this.getBroadcastChannel(meetingId);
    if (!channel) {
      return () => {};
    }

    const handler = (event: MessageEvent<EditorBroadcastMessage>) => {
      if (event.data && event.data.meetingId === meetingId) {
        callback(event.data);
      }
    };

    channel.addEventListener('message', handler);
    return () => {
      channel.removeEventListener('message', handler);
    };
  }

  /**
   * Teardown channel on meeting exit
   */
  public cleanup(meetingId: string): void {
    const channel = this.broadcastChannels.get(meetingId);
    if (channel) {
      channel.close();
      this.broadcastChannels.delete(meetingId);
    }
  }
}

export const editorClientService = new EditorClientService();
