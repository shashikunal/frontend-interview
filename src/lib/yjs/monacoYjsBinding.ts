import * as Y from 'yjs';

export interface RemoteCursor {
  clientId: number | string;
  user: {
    name: string;
    role: string;
    color: string;
  };
  range?: {
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
  };
  activeFile?: string;
}

/**
 * High-performance, conflict-free binding between Yjs Y.Text and Monaco Editor model
 * with multi-cursor rendering and selection syncing.
 */
export class MonacoYjsBinding {
  private yText: Y.Text;
  private monacoModel: any;
  private editor: any;
  private doc: Y.Doc;
  private isApplyingRemote = false;
  private isApplyingLocal = false;
  private monacoListener: any = null;
  private ytextObserver: any = null;
  private remoteDecorationsMap = new Map<string, string[]>();

  constructor(
    yText: Y.Text,
    monacoModel: any,
    editor?: any
  ) {
    this.yText = yText;
    this.monacoModel = monacoModel;
    this.editor = editor;
    this.doc = yText.doc!;

    // Initial population if Y.Text has content but Monaco model doesn't, or vice-versa
    const yStr = this.yText.toString();
    const modelStr = this.monacoModel.getValue();

    if (yStr.length === 0 && modelStr.length > 0) {
      this.doc.transact(() => {
        this.yText.insert(0, modelStr);
      }, this);
    } else if (yStr.length > 0 && yStr !== modelStr) {
      this.isApplyingRemote = true;
      this.monacoModel.setValue(yStr);
      this.isApplyingRemote = false;
    }

    // 1. Listen to local Monaco edits and push into Y.Text
    this.monacoListener = this.monacoModel.onDidChangeContent((e: any) => {
      if (this.isApplyingRemote) return;

      this.isApplyingLocal = true;
      this.doc.transact(() => {
        // Apply changes in reverse order to preserve offsets
        const changes = e.changes.slice().sort((a: any, b: any) => b.rangeOffset - a.rangeOffset);
        for (const change of changes) {
          this.yText.delete(change.rangeOffset, change.rangeLength);
          if (change.text.length > 0) {
            this.yText.insert(change.rangeOffset, change.text);
          }
        }
      }, this);
      this.isApplyingLocal = false;
    });

    // 2. Listen to remote Yjs updates and apply into Monaco model
    this.ytextObserver = (event: Y.YTextEvent) => {
      if (event.transaction.origin === this || this.isApplyingLocal) return;

      this.isApplyingRemote = true;
      let index = 0;
      const edits: any[] = [];

      for (const delta of event.delta) {
        if (delta.retain !== undefined) {
          index += delta.retain;
        } else if (delta.delete !== undefined) {
          const startPos = this.monacoModel.getPositionAt(index);
          const endPos = this.monacoModel.getPositionAt(index + delta.delete);
          edits.push({
            range: {
              startLineNumber: startPos.lineNumber,
              startColumn: startPos.column,
              endLineNumber: endPos.lineNumber,
              endColumn: endPos.column,
            },
            text: '',
          });
        } else if (delta.insert !== undefined) {
          const pos = this.monacoModel.getPositionAt(index);
          const text = typeof delta.insert === 'string' ? delta.insert : '';
          edits.push({
            range: {
              startLineNumber: pos.lineNumber,
              startColumn: pos.column,
              endLineNumber: pos.lineNumber,
              endColumn: pos.column,
            },
            text,
          });
          index += text.length;
        }
      }

      if (edits.length > 0) {
        this.monacoModel.applyEdits(edits);
      }
      this.isApplyingRemote = false;
    };

    this.yText.observe(this.ytextObserver);
  }

  /**
   * Updates remote cursor decorations in Monaco
   */
  public updateRemoteCursors(cursors: RemoteCursor[], activeFile: string) {
    if (!this.editor || typeof this.editor.deltaDecorations !== 'function') return;

    const currentKeys = new Set<string>();

    for (const cur of cursors) {
      if (cur.activeFile && cur.activeFile !== activeFile) continue;
      if (!cur.range) continue;

      const key = String(cur.clientId);
      currentKeys.add(key);

      const oldDecorations = this.remoteDecorationsMap.get(key) || [];
      const newDecorations = this.editor.deltaDecorations(oldDecorations, [
        {
          range: cur.range,
          options: {
            className: `yRemoteSelection-${key}`,
            isWholeLine: false,
            stickiness: 1, // Track with text modifications
          },
        },
        {
          range: {
            startLineNumber: cur.range.endLineNumber,
            startColumn: cur.range.endColumn,
            endLineNumber: cur.range.endLineNumber,
            endColumn: cur.range.endColumn,
          },
          options: {
            className: `yRemoteCursor-${key}`,
            hoverMessage: { value: `${cur.user.name} (${cur.user.role.toUpperCase()})` },
            stickiness: 1,
          },
        },
      ]);
      this.remoteDecorationsMap.set(key, newDecorations);
    }

    // Clean up stale disconnected cursors
    for (const [key, decs] of this.remoteDecorationsMap.entries()) {
      if (!currentKeys.has(key)) {
        this.editor.deltaDecorations(decs, []);
        this.remoteDecorationsMap.delete(key);
      }
    }
  }

  public destroy() {
    if (this.monacoListener) {
      this.monacoListener.dispose();
      this.monacoListener = null;
    }
    if (this.ytextObserver) {
      this.yText.unobserve(this.ytextObserver);
      this.ytextObserver = null;
    }
    if (this.editor && typeof this.editor.deltaDecorations === 'function') {
      for (const decs of this.remoteDecorationsMap.values()) {
        this.editor.deltaDecorations(decs, []);
      }
      this.remoteDecorationsMap.clear();
    }
  }
}
