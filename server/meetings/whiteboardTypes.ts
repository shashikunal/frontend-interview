/**
 * Collaborative Whiteboard Domain Types & Models
 * Phase 6: In-Meeting Collaborative Vector Whiteboard
 */

export type WhiteboardElementType =
  | 'RECTANGLE'
  | 'CIRCLE'
  | 'DIAMOND'
  | 'ARROW'
  | 'LINE'
  | 'TEXT'
  | 'DRAW';

export interface Point {
  x: number;
  y: number;
}

export interface WhiteboardElement {
  id: string;
  meetingId: string;
  type: WhiteboardElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  points?: Point[]; // For freehand pen drawing
  text?: string;
  strokeColor: string;
  fillColor?: string;
  strokeWidth: number;
  createdBy: string;
  creatorName: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface WhiteboardSnapshot {
  meetingId: string;
  elements: WhiteboardElement[];
  version: number;
  updatedAt: string;
}

export interface UpdateWhiteboardRequest {
  meetingId: string;
  action: 'UPSERT' | 'DELETE' | 'CLEAR';
  element?: Partial<WhiteboardElement> & { id: string; type: WhiteboardElementType };
  elementId?: string;
}
