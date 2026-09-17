/**
 * In-Meeting Collaborative Whiteboard Service
 * Phase 6: Collaborative Whiteboard & Vector Canvas
 */

import type { AuthContextUser } from '../auth/tokenTypes.ts';
import { meetingService } from './meetingService.ts';
import type {
  WhiteboardElement,
  WhiteboardSnapshot,
} from './whiteboardTypes.ts';

export class WhiteboardService {
  // meetingId -> (elementId -> WhiteboardElement)
  private boards: Map<string, Map<string, WhiteboardElement>> = new Map();
  // meetingId -> version
  private versions: Map<string, number> = new Map();

  /**
   * Get complete whiteboard snapshot for a meeting
   */
  public getSnapshot(meetingId: string): WhiteboardSnapshot {
    const board = this.boards.get(meetingId);
    const elements = board ? Array.from(board.values()) : [];
    const version = this.versions.get(meetingId) || 1;

    return {
      meetingId,
      elements,
      version,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Upsert a whiteboard vector element (create or update)
   */
  public upsertElement(
    caller: AuthContextUser,
    meetingId: string,
    elementData: Partial<WhiteboardElement> & { id: string; type: WhiteboardElement['type'] }
  ): { success: boolean; element?: WhiteboardElement; version?: number; error?: string; code?: string } {
    // 1. Validate Meeting State
    const meeting = meetingService.getMeetingById(meetingId);
    if (!meeting) {
      return { success: false, error: 'Meeting not found.', code: 'MEETING_NOT_FOUND' };
    }

    if (meeting.status === 'ENDED' || meeting.status === 'CANCELLED' || meeting.status === 'ARCHIVED') {
      return { success: false, error: `Meeting has concluded (${meeting.status}).`, code: `MEETING_${meeting.status}` };
    }

    if (!this.boards.has(meetingId)) {
      this.boards.set(meetingId, new Map());
      this.versions.set(meetingId, 1);
    }

    const board = this.boards.get(meetingId)!;
    const now = new Date().toISOString();
    const existing = board.get(elementData.id);

    const updatedVersion = (this.versions.get(meetingId) || 1) + 1;
    this.versions.set(meetingId, updatedVersion);

    const element: WhiteboardElement = {
      id: elementData.id,
      meetingId,
      type: elementData.type,
      x: elementData.x ?? (existing?.x || 0),
      y: elementData.y ?? (existing?.y || 0),
      width: elementData.width ?? (existing?.width || 120),
      height: elementData.height ?? (existing?.height || 80),
      points: elementData.points || existing?.points,
      text: elementData.text ?? existing?.text,
      strokeColor: elementData.strokeColor || existing?.strokeColor || '#4318ff',
      fillColor: elementData.fillColor ?? existing?.fillColor,
      strokeWidth: elementData.strokeWidth ?? (existing?.strokeWidth || 2),
      createdBy: existing ? existing.createdBy : caller.id,
      creatorName: existing ? existing.creatorName : caller.name,
      version: updatedVersion,
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now,
    };

    board.set(element.id, element);

    return {
      success: true,
      element,
      version: updatedVersion,
    };
  }

  /**
   * Delete a whiteboard element by ID
   */
  public deleteElement(
    caller: AuthContextUser,
    meetingId: string,
    elementId: string
  ): { success: boolean; version?: number; error?: string; code?: string } {
    const meeting = meetingService.getMeetingById(meetingId);
    if (!meeting) {
      return { success: false, error: 'Meeting not found.', code: 'MEETING_NOT_FOUND' };
    }

    const board = this.boards.get(meetingId);
    if (!board || !board.has(elementId)) {
      return { success: false, error: 'Element not found.', code: 'ELEMENT_NOT_FOUND' };
    }

    board.delete(elementId);
    const updatedVersion = (this.versions.get(meetingId) || 1) + 1;
    this.versions.set(meetingId, updatedVersion);

    return { success: true, version: updatedVersion };
  }

  /**
   * Clear the entire collaborative canvas
   */
  public clearBoard(
    caller: AuthContextUser,
    meetingId: string
  ): { success: boolean; version?: number; error?: string; code?: string } {
    const meeting = meetingService.getMeetingById(meetingId);
    if (!meeting) {
      return { success: false, error: 'Meeting not found.', code: 'MEETING_NOT_FOUND' };
    }

    const board = this.boards.get(meetingId);
    if (board) {
      board.clear();
    }

    const updatedVersion = (this.versions.get(meetingId) || 1) + 1;
    this.versions.set(meetingId, updatedVersion);

    return { success: true, version: updatedVersion };
  }

  /**
   * Reset all boards (for clean test environment)
   */
  public clearStore(): void {
    this.boards.clear();
    this.versions.clear();
  }
}

export const whiteboardService = new WhiteboardService();
