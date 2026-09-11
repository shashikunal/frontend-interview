export interface VideoRecordingEntry {
  id: string;
  sessionId: string;
  answerId: string;
  questionNumber: number;
  blob: Blob;
  sizeBytes: number;
  durationSeconds: number;
  mimeType: string;
  recordedAt: string;
  streamUrl?: string;
  storagePath?: string;
}

const DB_NAME = 'ai_video_mock_recordings_db';
const STORE_NAME = 'video_recordings';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('sessionId', 'sessionId', { unique: false });
        store.createIndex('answerId', 'answerId', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const videoStorageService = {
  /**
   * Saves video to local developer disk via Vite backend endpoint,
   * with IndexedDB persistence as immediate browser cache.
   */
  async saveRecording(entry: VideoRecordingEntry, userId = 'candidate_local'): Promise<{ success: boolean; streamUrl?: string }> {
    let streamUrl = `/api/video/stream/${entry.answerId}?sessionId=${entry.sessionId}&userId=${userId}`;

    // 1. Try uploading to local disk backend
    try {
      const res = await fetch('/api/video/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'video/webm',
          'x-user-id': userId,
          'x-session-id': entry.sessionId,
          'x-answer-id': entry.answerId,
          'x-duration-seconds': String(entry.durationSeconds),
        },
        body: entry.blob,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.metadata?.streamUrl) {
          streamUrl = data.metadata.streamUrl;
          entry.streamUrl = streamUrl;
          entry.storagePath = data.metadata.storagePath;
        }
      }
    } catch (diskErr) {
      console.warn('Local disk storage endpoint unavailable, storing in IndexedDB:', diskErr);
    }

    // 2. Persist in browser IndexedDB for instant replay
    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put({
          ...entry,
          streamUrl,
        });

        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (idbErr) {
      console.warn('IndexedDB save warning:', idbErr);
    }

    return { success: true, streamUrl };
  },

  async getRecording(answerId: string): Promise<VideoRecordingEntry | null> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const index = store.index('answerId');
        const req = index.get(answerId);

        req.onsuccess = () => {
          const res = req.result;
          if (res && res.blob && !res.streamUrl) {
            res.streamUrl = URL.createObjectURL(res.blob);
          }
          resolve(res || null);
        };
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('Failed to retrieve video recording from IndexedDB:', err);
      return null;
    }
  },

  async getSessionRecordings(sessionId: string): Promise<VideoRecordingEntry[]> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const index = store.index('sessionId');
        const req = index.getAll(sessionId);

        req.onsuccess = () => {
          const list: VideoRecordingEntry[] = req.result || [];
          for (const item of list) {
            if (!item.streamUrl && item.blob) {
              item.streamUrl = URL.createObjectURL(item.blob);
            }
          }
          resolve(list);
        };
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('Failed to retrieve session recordings:', err);
      return [];
    }
  },

  async deleteRecording(id: string): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);

        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('Failed to delete recording from IndexedDB:', err);
    }
  },
};

