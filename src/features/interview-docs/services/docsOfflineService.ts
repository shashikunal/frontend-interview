/**
 * MasterDocs Offline Service
 * Coordinates Service Worker registration, network state, storage estimations,
 * and pre-caching across all 21 Frontend tracks for zero-network study.
 */

import { ALL_SUBJECTS_CATALOG, TOPICS_BY_SUBJECT } from '../data/subjectsCatalog';

export interface OfflineCacheProgress {
  cached: number;
  total: number;
  percent: number;
  currentTrack: string;
  isComplete: boolean;
}

export interface OfflinePlatformStatus {
  isOnline: boolean;
  isSwSupported: boolean;
  isSwRegistered: boolean;
  isPrecached: boolean;
  lastCachedAt: string | null;
  storageUsageMB: number | null;
  storageQuotaMB: number | null;
}

type StatusSubscriber = (status: OfflinePlatformStatus) => void;
type ProgressSubscriber = (progress: OfflineCacheProgress) => void;

class DocsOfflineService {
  private statusSubscribers = new Set<StatusSubscriber>();
  private progressSubscribers = new Set<ProgressSubscriber>();
  private _swRegistration: ServiceWorkerRegistration | null = null;

  public getRegistration(): ServiceWorkerRegistration | null {
    return this._swRegistration;
  }

  private currentStatus: OfflinePlatformStatus = {
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSwSupported: typeof navigator !== 'undefined' && 'serviceWorker' in navigator,
    isSwRegistered: false,
    isPrecached: typeof localStorage !== 'undefined' && localStorage.getItem('docs_offline_precached') === 'true',
    lastCachedAt: typeof localStorage !== 'undefined' ? localStorage.getItem('docs_offline_cached_at') : null,
    storageUsageMB: null,
    storageQuotaMB: null,
  };

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkChange(true));
      window.addEventListener('offline', () => this.handleNetworkChange(false));

      // Listen for messages from Service Worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (!event.data) return;

          if (event.data.type === 'CACHE_TRACKS_PROGRESS') {
            const progress: OfflineCacheProgress = {
              cached: event.data.cached,
              total: event.data.total,
              percent: event.data.percent,
              currentTrack: event.data.currentUrl,
              isComplete: event.data.done,
            };
            this.notifyProgress(progress);
            if (event.data.done) {
              this.markAsPrecached();
            }
          }

          if (event.data.type === 'CACHE_CLEARED_SUCCESS') {
            this.markAsCleared();
          }
        });
      }

      this.updateStorageEstimate();
    }
  }

  /**
   * Initializes and registers the service worker
   */
  public async register(): Promise<boolean> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      this._swRegistration = registration;
      this.currentStatus.isSwRegistered = true;
      this.notifyStatus();
      this.updateStorageEstimate();
      return true;
    } catch (err) {
      console.warn('[MasterDocs] ServiceWorker registration failed:', err);
      return false;
    }
  }

  /**
   * Generates comprehensive list of URLs to cache for all 21 tracks
   */
  public getTrackUrlsToCache(): string[] {
    const urls = new Set<string>();

    // Core application & docs hubs
    urls.add('/');
    urls.add('/docs');
    urls.add('/docs/practice');
    urls.add('/docs/flashcards');
    urls.add('/docs/revision');
    urls.add('/docs/comparisons');
    urls.add('/docs/interview');
    urls.add('/docs/study-plan');
    urls.add('/docs/diagrams');
    urls.add('/docs/readiness');

    // All 21 Subject Track Landings & First Topics
    ALL_SUBJECTS_CATALOG.forEach((subject) => {
      urls.add(`/docs/${subject.id}`);
      const subjectTopics = TOPICS_BY_SUBJECT[subject.id];
      if (subjectTopics && subjectTopics.length > 0) {
        urls.add(`/docs/${subject.id}/${subjectTopics[0].id}`);
        // Also add second topic if available for offline switching demo
        if (subjectTopics.length > 1) {
          urls.add(`/docs/${subject.id}/${subjectTopics[1].id}`);
        }
      }
    });

    return Array.from(urls);
  }

  /**
   * Downloads and pre-caches all 21 tracks into browser Cache Storage
   */
  public async precacheAllTracks(
    onProgress?: (progress: OfflineCacheProgress) => void
  ): Promise<{ success: boolean; totalCached: number }> {
    const urls = this.getTrackUrlsToCache();
    const total = urls.length;

    // Use direct Cache API in browser window (reliable across both SW and non-SW browsers)
    if (typeof window === 'undefined' || !('caches' in window)) {
      return { success: false, totalCached: 0 };
    }

    try {
      const cache = await window.caches.open('masterdocs-runtime-v1');
      let cachedCount = 0;

      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        try {
          const response = await fetch(url, { cache: 'reload' });
          if (response.ok) {
            await cache.put(url, response);
          }
        } catch (fetchErr) {
          console.warn(`[MasterDocs Offline] Non-fatal asset cache skip: ${url}`, fetchErr);
        }

        cachedCount++;
        const percent = Math.round((cachedCount / total) * 100);
        const progress: OfflineCacheProgress = {
          cached: cachedCount,
          total,
          percent,
          currentTrack: url.replace('/docs/', '').replace('/', ' ') || 'hub',
          isComplete: cachedCount === total,
        };

        if (onProgress) {
          onProgress(progress);
        }
        this.notifyProgress(progress);
      }

      this.markAsPrecached();
      await this.updateStorageEstimate();
      return { success: true, totalCached: cachedCount };
    } catch (err) {
      console.error('[MasterDocs Offline] Pre-caching process error:', err);
      return { success: false, totalCached: 0 };
    }
  }

  /**
   * Clears all offline caches and resets status
   */
  public async clearCache(): Promise<void> {
    if (typeof window !== 'undefined' && 'caches' in window) {
      await window.caches.delete('masterdocs-runtime-v1');
      await window.caches.delete('masterdocs-shell-v1');
    }

    this.markAsCleared();
    await this.updateStorageEstimate();
  }

  /**
   * Estimates current browser storage quota and MasterDocs usage
   */
  public async updateStorageEstimate(): Promise<{ usageMB: number; quotaMB: number } | null> {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        const usageMB = estimate.usage ? Number((estimate.usage / (1024 * 1024)).toFixed(1)) : 0;
        const quotaMB = estimate.quota ? Number((estimate.quota / (1024 * 1024)).toFixed(0)) : 0;

        this.currentStatus.storageUsageMB = usageMB;
        this.currentStatus.storageQuotaMB = quotaMB;
        this.notifyStatus();
        return { usageMB, quotaMB };
      } catch {
        return null;
      }
    }
    return null;
  }

  public getStatus(): OfflinePlatformStatus {
    return { ...this.currentStatus };
  }

  public subscribeStatus(subscriber: StatusSubscriber): () => void {
    this.statusSubscribers.add(subscriber);
    subscriber(this.getStatus());
    return () => {
      this.statusSubscribers.delete(subscriber);
    };
  }

  public subscribeProgress(subscriber: ProgressSubscriber): () => void {
    this.progressSubscribers.add(subscriber);
    return () => {
      this.progressSubscribers.delete(subscriber);
    };
  }

  private handleNetworkChange(isOnline: boolean) {
    this.currentStatus.isOnline = isOnline;
    this.notifyStatus();
  }

  private markAsPrecached() {
    this.currentStatus.isPrecached = true;
    const nowIso = new Date().toISOString();
    this.currentStatus.lastCachedAt = nowIso;
    try {
      localStorage.setItem('docs_offline_precached', 'true');
      localStorage.setItem('docs_offline_cached_at', nowIso);
    } catch {
      // ignore
    }
    this.notifyStatus();
  }

  private markAsCleared() {
    this.currentStatus.isPrecached = false;
    this.currentStatus.lastCachedAt = null;
    try {
      localStorage.removeItem('docs_offline_precached');
      localStorage.removeItem('docs_offline_cached_at');
    } catch {
      // ignore
    }
    this.notifyStatus();
  }

  private notifyStatus() {
    const status = this.getStatus();
    this.statusSubscribers.forEach((sub) => sub(status));
  }

  private notifyProgress(progress: OfflineCacheProgress) {
    this.progressSubscribers.forEach((sub) => sub(progress));
  }
}

export const docsOfflineService = new DocsOfflineService();
