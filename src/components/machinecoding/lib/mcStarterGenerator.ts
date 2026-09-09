/**
 * Dynamic Question-Specific Starter Code Generator (Phase 2 Architecture)
 * 
 * Generates minimal, domain-relevant scaffolding (classes, interfaces, enums,
 * method stubs, and consumer mounting harnesses) derived from FULL question context:
 * Title, Description, Requirements, Constraints, Category, and Difficulty.
 * 
 * CORE PRINCIPLES:
 * 1. Starter Code != Solution.
 * 2. Scaffolding, not implementation: generates structural boundaries and contracts with `TODO`s.
 * 3. Never hardcodes generic cards or repetitive button counters.
 * 4. Difficulty-aware:
 *    - Easy: guided props, default state shape, and clear step-by-step TODOs.
 *    - Medium: domain entities, contracts, method signatures, leaving state design to candidate.
 *    - Hard / Senior: minimal architectural boundaries, interfaces, and contracts only.
 * 5. Multi-language idiomatic support: React (TSX), TypeScript (DOM+TS), JavaScript (ES6+), Vanilla DOM, Algorithms.
 */

import type { MCQuestion } from '../machineCodingQuestions.ts';
import type { MCLanguage } from './languageStarters.ts';

export const GENERATOR_VERSION = '2.4.0-phase2';

export interface StarterMetadata {
  questionId: string;
  language: MCLanguage;
  starterHash: string;
  generatedAt: number;
  generatorVersion: string;
  domainType: QuestionDomainType;
  difficulty: string;
  isCustomModified?: boolean;
}

export interface GeneratedStarterFiles {
  primaryFile: string;
  files: Record<string, string>;
  metadata: StarterMetadata;
}

/**
 * Checks if code is the generic fallback placeholder that should be upgraded.
 */
export function isGenericBoilerplateStarter(code?: string): boolean {
  if (!code || !code.trim()) return true;
  return (
    code.includes('Interactive Challenge Canvas') ||
    code.includes('Candidate workspace canvas') ||
    code.includes('Write your component implementation here') ||
    code.includes('Component Status: Active') ||
    code.includes('Component Status: <strong') ||
    (code.includes('Increment Counter') && code.includes('Deactivate / Activate')) ||
    (code.includes('Increment Counter') && code.includes('Deactivate')) ||
    (code.includes('Increment Counter') && code.includes('Reset') && code.includes('display-container')) ||
    code.includes("active ? 'Toggle Off' : 'Toggle On'") ||
    code.includes('id="primary-action-btn"') && code.includes('id="display-container"')
  );
}

/**
 * Clean question title by removing prefixes like [Q001]
 */
export function cleanTitle(rawTitle: string): string {
  return rawTitle.replace(/^\[[^\]]+\]\s*/, '').trim();
}

/**
 * Convert string to PascalCase
 */
export function toPascalCase(str: string): string {
  const words = str
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return 'CustomComponent';
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

/**
 * Convert string to camelCase
 */
export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export type QuestionDomainType = 'hook' | 'system' | 'widget' | 'utility';

/**
 * Comprehensive question context analyzer inspecting title, category, description, and requirements.
 */
export function analyzeQuestionContext(q: MCQuestion): {
  cleanTitle: string;
  pascalName: string;
  camelName: string;
  domain: QuestionDomainType;
  hookKind?: string;
  systemKind?: string;
  widgetKind?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Senior';
  allText: string;
} {
  const cTitle = cleanTitle(q.title);
  const pascalName = toPascalCase(cTitle);
  const camelName = toCamelCase(cTitle);

  const desc = q.description || '';
  const reqs = (q.requirements || []).join(' ');
  const cat = q.category || '';
  const allText = `${cTitle} ${cat} ${desc} ${reqs} ${q.summary || ''}`.toLowerCase();

  // Normalize difficulty
  const rawDiff = (q.difficulty || 'Medium').toLowerCase();
  let difficulty: 'Easy' | 'Medium' | 'Hard' | 'Senior' = 'Medium';
  if (rawDiff.includes('easy') || rawDiff.includes('beginner')) difficulty = 'Easy';
  else if (rawDiff.includes('hard') || rawDiff.includes('advanced')) difficulty = 'Hard';
  else if (rawDiff.includes('senior') || rawDiff.includes('expert') || rawDiff.includes('staff')) difficulty = 'Senior';

  // 1. Hook Detection & Sub-classification
  const isHook =
    /^use[A-Z]/.test(cTitle) ||
    cTitle.toLowerCase().startsWith('use ') ||
    cTitle.toLowerCase().includes(' hook') ||
    cat.toLowerCase().includes('hook') ||
    allText.includes('custom hook') ||
    allText.includes('react hook');

  if (isHook) {
    let hookKind = 'generic';
    if (allText.includes('fetch') || allText.includes('request') || allText.includes('query') || allText.includes('axios') || allText.includes('retry')) {
      hookKind = 'fetch';
    } else if (allText.includes('async') || allText.includes('promise')) {
      hookKind = 'async';
    } else if (allText.includes('sessionstorage') || allText.includes('session storage')) {
      hookKind = 'sessionStorage';
    } else if (allText.includes('localstorage') || allText.includes('local storage')) {
      hookKind = 'localStorage';
    } else if (allText.includes('cookie')) {
      hookKind = 'cookie';
    } else if (allText.includes('eventlistener') || allText.includes('event listener') || allText.includes('window event') || allText.includes('dom event')) {
      hookKind = 'eventListener';
    } else if (allText.includes('hover') || allText.includes('mouse enter') || allText.includes('mouseleave')) {
      hookKind = 'hover';
    } else if (allText.includes('idle') || allText.includes('idletimer') || allText.includes('inactivity')) {
      hookKind = 'idleTimer';
    } else if (allText.includes('intersection') || allText.includes('viewport') || allText.includes('scroll spy')) {
      hookKind = 'intersectionObserver';
    } else if (allText.includes('debounce')) {
      hookKind = 'debounce';
    } else if (allText.includes('throttle')) {
      hookKind = 'throttle';
    } else if (allText.includes('interval') || allText.includes('countdown') || allText.includes('timer')) {
      hookKind = 'timer';
    } else if (allText.includes('mediaquery') || allText.includes('media query') || allText.includes('breakpoint')) {
      hookKind = 'mediaQuery';
    } else if (allText.includes('onclickoutside') || allText.includes('click outside') || allText.includes('outside click')) {
      hookKind = 'clickOutside';
    } else if (allText.includes('memocompare') || allText.includes('memo compare') || allText.includes('deep memo') || allText.includes('memo')) {
      hookKind = 'memoCompare';
    }

    return {
      cleanTitle: cTitle,
      pascalName,
      camelName,
      domain: 'hook',
      hookKind,
      difficulty,
      allText,
    };
  }

  // 2. System Design / Architecture Detection & Sub-classification
  const isSystem =
    ((allText.includes('system design') ||
      allText.includes('distributed system') ||
      allText.includes('parking lot') ||
      allText.includes('elevator') ||
      allText.includes('rate limiter') ||
      allText.includes('rate limit') ||
      allText.includes('lru cache') ||
      allText.includes('file system') ||
      allText.includes('filesystem') ||
      allText.includes('pub-sub') ||
      allText.includes('pub sub') ||
      allText.includes('event emitter') ||
      allText.includes('eventemitter') ||
      allText.includes('vending machine') ||
      allText.includes('task scheduler') ||
      allText.includes('circuit breaker') ||
      allText.includes('state machine') ||
      allText.includes('in-memory') ||
      allText.includes('database engine') ||
      allText.includes('logging framework') ||
      allText.includes('cloud cost') ||
      allText.includes('infrastructure')) &&
      !allText.includes('design system')) ||
    (allText.includes('system') && !allText.includes('design system') && !allText.includes('form') && !allText.includes('banner') && !allText.includes('accordion'));

  if (isSystem) {
    let systemKind = 'generic';
    if (allText.includes('parking')) systemKind = 'parkingLot';
    else if (allText.includes('elevator') || allText.includes('lift')) systemKind = 'elevator';
    else if (allText.includes('cache') || allText.includes('lru') || allText.includes('ttl')) systemKind = 'cache';
    else if (allText.includes('rate limit') || allText.includes('throttl') || allText.includes('token bucket')) systemKind = 'rateLimiter';
    else if (allText.includes('task') || allText.includes('scheduler') || allText.includes('priority queue') || allText.includes('job queue')) systemKind = 'taskScheduler';
    else if (allText.includes('file system') || allText.includes('filesystem') || allText.includes('folder') || allText.includes('directory')) systemKind = 'fileSystem';
    else if (allText.includes('pub-sub') || allText.includes('event emitter') || allText.includes('eventemitter') || allText.includes('event bus') || allText.includes('message bus')) systemKind = 'eventEmitter';
    else if (allText.includes('circuit breaker')) systemKind = 'circuitBreaker';
    else if (allText.includes('vending machine')) systemKind = 'vendingMachine';
    else if (allText.includes('state machine') || allText.includes('fsm')) systemKind = 'stateMachine';

    return {
      cleanTitle: cTitle,
      pascalName,
      camelName,
      domain: 'system',
      systemKind,
      difficulty,
      allText,
    };
  }

  // 3. UI Component / Interactive Widget
  const isWidget =
    allText.includes('banner') ||
    allText.includes('modal') ||
    allText.includes('dialog') ||
    allText.includes('accordion') ||
    allText.includes('carousel') ||
    allText.includes('slider') ||
    allText.includes('rating') ||
    allText.includes('picker') ||
    allText.includes('grid') ||
    allText.includes('table') ||
    allText.includes('list') ||
    allText.includes('tree') ||
    allText.includes('menu') ||
    allText.includes('dropdown') ||
    allText.includes('toast') ||
    allText.includes('notification') ||
    allText.includes('badge') ||
    allText.includes('form') ||
    allText.includes('wizard') ||
    allText.includes('stepper') ||
    allText.includes('tooltip') ||
    allText.includes('toggle') ||
    allText.includes('switch') ||
    allText.includes('counter') ||
    allText.includes('visualizer') ||
    allText.includes('player') ||
    allText.includes('kanban') ||
    allText.includes('board') ||
    allText.includes('dashboard') ||
    allText.includes('component') ||
    allText.includes('widget') ||
    allText.includes('editor') ||
    allText.includes('input') ||
    allText.includes('navbar') ||
    allText.includes('nav') ||
    allText.includes('comment') ||
    allText.includes('stopwatch') ||
    allText.includes('timer') ||
    allText.includes('clock') ||
    allText.includes('calculator') ||
    allText.includes('placeholder') ||
    allText.includes('previewer') ||
    allText.includes('search') ||
    allText.includes('feed') ||
    allText.includes('chat') ||
    cat.toLowerCase().includes('react') ||
    cat.toLowerCase().includes('dom');

  if (isWidget) {
    let widgetKind = 'generic';
    if (allText.includes('accordion') || allText.includes('collapse') || allText.includes('faq')) {
      widgetKind = 'accordion';
    } else if (allText.includes('audio') || allText.includes('video') || allText.includes('visualizer') || allText.includes('player')) {
      widgetKind = 'media';
    } else if (allText.includes('smart home') || allText.includes('iot') || allText.includes('device')) {
      widgetKind = 'iot';
    } else if (allText.includes('table') || allText.includes('grid') || allText.includes('virtual') || allText.includes('spreadsheet')) {
      widgetKind = 'table';
    } else if (allText.includes('modal') || allText.includes('dialog') || allText.includes('drawer') || allText.includes('banner') || allText.includes('toast') || allText.includes('notification') || allText.includes('consent')) {
      widgetKind = 'overlay';
    } else if (allText.includes('rating') || allText.includes('counter') || allText.includes('star')) {
      widgetKind = 'counter';
    } else if (allText.includes('tabs') || allText.includes('breadcrumb')) {
      widgetKind = 'navigation';
    } else if (allText.includes('chat') || allText.includes('feed')) {
      widgetKind = 'chat';
    } else if (allText.includes('rsvp') || allText.includes('wizard') || allText.includes('auth') || /\bforms?\b/i.test(allText)) {
      widgetKind = 'form';
    }

    return {
      cleanTitle: cTitle,
      pascalName,
      camelName,
      domain: 'widget',
      widgetKind,
      difficulty,
      allText,
    };
  }

  return {
    cleanTitle: cTitle,
    pascalName,
    camelName,
    domain: 'utility',
    difficulty,
    allText,
  };
}

/**
 * Extracts rich, domain-specific TypeScript interfaces and enums from full question context.
 */
export function extractDomainEntities(q: MCQuestion): { enums: string[]; interfaces: string[] } {
  const ctx = analyzeQuestionContext(q);
  const text = ctx.allText;
  const enums: string[] = [];
  const interfaces: string[] = [];

  // 1. Vehicle & Parking Systems
  if (text.includes('vehicle') || text.includes('parking') || text.includes('spot') || text.includes('ticket')) {
    enums.push(`export enum VehicleType {
  MOTORCYCLE = 'MOTORCYCLE',
  CAR = 'CAR',
  TRUCK = 'TRUCK',
  VAN = 'VAN',
}`);
    interfaces.push(`export interface Vehicle {
  licensePlate: string;
  type: VehicleType;
}`);
    interfaces.push(`export interface ParkingSpot {
  id: string;
  spotNumber: number;
  floor: number;
  type: VehicleType;
  isOccupied: boolean;
  vehicle?: Vehicle;
}`);
    interfaces.push(`export interface ParkingTicket {
  ticketId: string;
  spotId: string;
  entryTime: number;
  vehicleType: VehicleType;
}`);
  }

  // 2. Elevator Systems
  if (text.includes('elevator') || text.includes('lift') || text.includes('floor')) {
    enums.push(`export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  IDLE = 'IDLE',
}`);
    enums.push(`export enum ElevatorState {
  IDLE = 'IDLE',
  MOVING = 'MOVING',
  DOORS_OPEN = 'DOORS_OPEN',
  MAINTENANCE = 'MAINTENANCE',
}`);
    interfaces.push(`export interface ElevatorRequest {
  floor: number;
  direction?: Direction;
  timestamp: number;
}`);
    interfaces.push(`export interface ElevatorStatus {
  id: string;
  currentFloor: number;
  direction: Direction;
  state: ElevatorState;
}`);
  }

  // 3. Cookie & Privacy Consent
  if (text.includes('cookie') || text.includes('consent') || text.includes('gdpr')) {
    enums.push(`export enum CookieCategory {
  NECESSARY = 'NECESSARY',
  ANALYTICS = 'ANALYTICS',
  MARKETING = 'MARKETING',
  PREFERENCES = 'PREFERENCES',
}`);
    interfaces.push(`export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  timestamp?: number;
}`);
  }

  // 4. RSVP, Event & Form
  if (text.includes('rsvp') || text.includes('meal') || text.includes('guest') || text.includes('attendee')) {
    enums.push(`export enum MealPreference {
  VEGETARIAN = 'VEGETARIAN',
  NON_VEGETARIAN = 'NON_VEGETARIAN',
  VEGAN = 'VEGAN',
  GLUTEN_FREE = 'GLUTEN_FREE',
}`);
    interfaces.push(`export interface GuestRsvp {
  id: string;
  fullName: string;
  email: string;
  isAttending: boolean;
  guestsCount: number;
  meal: MealPreference;
  notes?: string;
}`);
  }

  // 5. Tasks, Kanban, Workflow
  if (text.includes('kanban') || text.includes('task') || text.includes('workflow') || text.includes('ticket')) {
    enums.push(`export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}`);
    enums.push(`export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
}`);
    interfaces.push(`export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  createdAt: number;
}`);
  }

  // 6. E-Commerce, Shopping Cart & Products
  if (text.includes('cart') || text.includes('ecommerce') || text.includes('checkout') || text.includes('product') || text.includes('catalog')) {
    interfaces.push(`export interface ProductItem {
  id: string;
  name: string;
  price: number;
  category?: string;
  inStock: boolean;
  imageUrl?: string;
}`);
    interfaces.push(`export interface CartEntry {
  product: ProductItem;
  quantity: number;
  subtotal: number;
}`);
  }

  // 7. Audio, Media Player & Visualizers
  if (text.includes('audio') || text.includes('player') || text.includes('media') || text.includes('visualizer') || text.includes('track')) {
    enums.push(`export enum PlaybackStatus {
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  STOPPED = 'STOPPED',
  BUFFERING = 'BUFFERING',
}`);
    interfaces.push(`export interface TrackMetadata {
  id: string;
  title: string;
  artist: string;
  durationSec: number;
  coverUrl?: string;
}`);
  }

  // 8. Notifications, Alerts & Badges
  if (text.includes('toast') || text.includes('notification') || text.includes('alert') || text.includes('badge')) {
    enums.push(`export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}`);
    interfaces.push(`export interface NotificationItem {
  id: string;
  title?: string;
  message: string;
  type: NotificationType;
  durationMs?: number;
  createdAt: number;
}`);
  }

  // 9. Chat, Comments & Social Feed
  if (text.includes('chat') || text.includes('comment') || text.includes('message') || text.includes('thread') || text.includes('feed')) {
    interfaces.push(`export interface ThreadMessage {
  id: string;
  author: string;
  text: string;
  timestamp: number;
  likesCount?: number;
  parentId?: string | null;
}`);
  }

  // 10. Data Table, Grid & Sort/Pagination
  if (text.includes('table') || text.includes('grid') || text.includes('pagination') || text.includes('spreadsheet')) {
    enums.push(`export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
  NONE = 'NONE',
}`);
    interfaces.push(`export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
}`);
    interfaces.push(`export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}`);
  }

  // 11. Smart Home, IoT & Device Controls
  if (text.includes('smart home') || text.includes('device') || text.includes('iot') || text.includes('sensor')) {
    enums.push(`export enum DeviceCategory {
  LIGHTING = 'LIGHTING',
  CLIMATE = 'CLIMATE',
  SECURITY = 'SECURITY',
  ENTERTAINMENT = 'ENTERTAINMENT',
}`);
    interfaces.push(`export interface SmartDevice {
  id: string;
  name: string;
  category: DeviceCategory;
  isOnline: boolean;
  powerState: boolean;
  value?: number;
}`);
  }

  // 12. File System & Tree Explorer
  if (text.includes('tree') || text.includes('explorer') || text.includes('filesystem') || text.includes('folder') || text.includes('directory')) {
    enums.push(`export enum EntryType {
  FILE = 'FILE',
  FOLDER = 'FOLDER',
}`);
    interfaces.push(`export interface FileSystemNode {
  id: string;
  name: string;
  type: EntryType;
  children?: FileSystemNode[];
  size?: number;
}`);
  }

  // 13. Cache & Eviction (LRU / LFU / TTL)
  if (text.includes('cache') || text.includes('lru') || text.includes('ttl') || text.includes('eviction')) {
    interfaces.push(`export interface CacheEntry<V> {
  key: string;
  value: V;
  createdAt: number;
  expiresAt?: number;
}`);
  }

  // 14. Rate Limiting & Throttling
  if (text.includes('rate limit') || text.includes('throttl') || text.includes('token bucket') || text.includes('leaky bucket')) {
    interfaces.push(`export interface RateLimitResult {
  isAllowed: boolean;
  remainingTokens: number;
  resetTimeMs: number;
}`);
  }

  // 15. Circuit Breaker
  if (text.includes('circuit breaker')) {
    enums.push(`export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}`);
  }

  // Fallbacks if no specific enums detected
  if (enums.length === 0 && (text.includes('priority') || text.includes('severity'))) {
    enums.push(`export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}`);
  }

  if (enums.length === 0 && (text.includes('status') || text.includes('state'))) {
    enums.push(`export enum Status {
  IDLE = 'IDLE',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}`);
  }

  return { enums, interfaces };
}

/**
 * 1. REACT STARTER CODE GENERATOR
 */
export function generateReactStarter(q: MCQuestion): string {
  const ctx = analyzeQuestionContext(q);
  const cTitle = ctx.cleanTitle;
  const theme = getQuestionTheme(q);
  const { enums, interfaces } = extractDomainEntities(q);
  const typesBlock = [...enums, ...interfaces].join('\n\n');

  const reqList = (q.requirements || []).slice(0, 5);
  const reqComments = reqList.length > 0
    ? reqList.map(r => ` * - ${r}`).join('\n')
    : ` * - Implement ${cTitle} conforming to the problem specifications.\n * - Manage reactive component state and user event handling.`;

  // === CASE A: CUSTOM HOOKS ===
  if (ctx.domain === 'hook') {
    let hookName = cTitle.split(/\s+/)[0];
    if (!hookName.startsWith('use')) {
      hookName = `use${ctx.pascalName}`;
    }

    // 1. Specialized: Data Fetching Hook (e.g. useFetch)
    if (ctx.hookKind === 'fetch') {
      return `import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * [${q.id}] ${cTitle}
 * Environment: React 19 (TypeScript) | Difficulty: ${ctx.difficulty}
 *
 * Key Requirements:
${reqComments}
 */

export interface UseFetchOptions {
  // TODO: Configure fetch parameters (timeout, retries, headers)
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
  headers?: Record<string, string>;
}

export interface UseFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  retryCount: number;
}

/**
 * Custom Hook: ${hookName}
 * Complete the data fetching, retry, and timeout logic below.
 */
export function ${hookName}<T = any>(
  url: string,
  options?: UseFetchOptions
): UseFetchResult<T> {
  // TODO: Declare reactive hook state
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  // TODO: Implement execution with cancellation and retry backoff
  const executeFetch = useCallback(async () => {
    // TODO: Handle abort controller, timeouts, and network retries
  }, [url]);

  useEffect(() => {
    // TODO: Trigger fetch on mount/url change with proper cleanup
  }, [executeFetch]);

  return {
    data,
    isLoading,
    error,
    refetch: executeFetch,
    retryCount,
  };
}

/**
 * Interactive Testing UI
 */
export default function App() {
  const [targetUrl, setTargetUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const { data, isLoading, error, refetch, retryCount } = ${hookName}(targetUrl);

  return (
    <div className="card">
      <div className="header">
        <span className="badge">${theme.badge}</span>
        <h2>${cTitle}</h2>
        <p>Complete the hook implementation above and verify execution below.</p>
      </div>

      <div className="button-group">
        <input
          type="text"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          placeholder="Enter endpoint URL..."
          style={{ flex: 1 }}
        />
        <button
          onClick={() => refetch()}
          disabled={isLoading}
        >
          {isLoading ? 'Fetching...' : 'Refetch'}
        </button>
      </div>

      <div className="display-box">
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Status: {isLoading ? 'Loading' : error ? 'Error' : 'Ready'} | Retries: {retryCount}</div>
        <pre style={{ margin: 0, fontSize: '12px', color: 'var(--accent)', overflowX: 'auto' }}>
          {JSON.stringify({ data, error: error?.message }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
`;
    }

    // 2. Specialized: Async Hook (e.g. useAsync)
    if (ctx.hookKind === 'async') {
      return `import React, { useState, useEffect, useCallback } from 'react';

/**
 * [${q.id}] ${cTitle}
 * Environment: React 19 (TypeScript) | Difficulty: ${ctx.difficulty}
 *
 * Key Requirements:
${reqComments}
 */

export type AsyncStatus = 'idle' | 'pending' | 'success' | 'error';

export interface UseAsyncState<T> {
  status: AsyncStatus;
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export interface UseAsyncReturn<T, Args extends any[] = any[]> extends UseAsyncState<T> {
  execute: (...args: Args) => Promise<T | null>;
  reset: () => void;
}

/**
 * Custom Hook: ${hookName}
 * Manages async execution lifecycle with status, data, and error state.
 */
export function ${hookName}<T, Args extends any[] = any[]>(
  asyncFn: (...args: Args) => Promise<T>,
  immediate = false
): UseAsyncReturn<T, Args> {
  // TODO: Declare status, data, error state
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // TODO: Implement async execution with race-condition protection
  const execute = useCallback(async (...args: Args): Promise<T | null> => {
    setStatus('pending');
    setError(null);
    // TODO: Await asyncFn execution and update status, data, error accordingly
    return null;
  }, [asyncFn]);

  const reset = useCallback(() => {
    // TODO: Reset state to initial idle state
    setStatus('idle');
    setData(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    execute,
    reset,
    status,
    data,
    error,
    isLoading: status === 'pending',
  };
}

/**
 * Interactive Testing UI
 */
export default function App() {
  const fetchMock = async (id: number) => {
    await new Promise(r => setTimeout(r, 600));
    if (id <= 0) throw new Error('Invalid ID parameter');
    return { id, title: 'Sample Asynchronous Record', timestamp: Date.now() };
  };

  const { execute, reset, status, data, error, isLoading } = ${hookName}(fetchMock);

  return (
    <div className="card">
      <div className="header">
        <span className="badge">${theme.badge}</span>
        <h2>${cTitle}</h2>
        <p>Test async state transitions (idle, pending, success, error).</p>
      </div>

      <div className="button-group">
        <button
          onClick={() => execute(1)}
          disabled={isLoading}
        >
          {isLoading ? 'Executing...' : 'Trigger Success'}
        </button>
        <button
          onClick={() => execute(-1)}
          disabled={isLoading}
          className="danger"
        >
          Trigger Error
        </button>
        <button
          onClick={reset}
          className="secondary"
        >
          Reset
        </button>
      </div>

      <div className="display-box">
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Execution Status: <strong style={{ color: 'var(--accent)' }}>{status}</strong></div>
        <pre style={{ margin: 0, fontSize: '12px', color: 'var(--accent)' }}>
          {JSON.stringify({ data, error: error?.message }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
`;
    }

    // 3. Specialized: Hover Hook (e.g. useHover)
    if (ctx.hookKind === 'hover') {
      return `import React, { useState, useEffect, useRef } from 'react';

/**
 * [${q.id}] ${cTitle}
 * Environment: React 19 (TypeScript) | Difficulty: ${ctx.difficulty}
 *
 * Key Requirements:
${reqComments}
 */

export interface UseHoverOptions {
  // TODO: Configure enter/leave delay or synthetic event options
  enterDelayMs?: number;
  leaveDelayMs?: number;
}

/**
 * Custom Hook: ${hookName}
 * Detects pointer hover state on a referenced DOM element with event cleanup.
 */
export function ${hookName}<T extends HTMLElement = HTMLElement>(
  options?: UseHoverOptions
): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // TODO: Register mouseenter / mouseleave event listeners with cleanup
    const handleMouseEnter = () => {
      // TODO: Handle hover enter with optional delay
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      // TODO: Handle hover leave with optional delay
      setIsHovered(false);
    };

    node.addEventListener('mouseenter', handleMouseEnter);
    node.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      node.removeEventListener('mouseenter', handleMouseEnter);
      node.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [options?.enterDelayMs, options?.leaveDelayMs]);

  return [ref, isHovered];
}

/**
 * Interactive Testing UI
 */
export default function App() {
  const [hoverRef, isHovered] = ${hookName}<HTMLDivElement>();

  return (
    <div className="card">
      <div className="header">
        <span className="badge">${theme.badge}</span>
        <h2>${cTitle}</h2>
        <p>Hover over the interactive target box below to verify reactive state.</p>
      </div>

      <div
        ref={hoverRef}
        style={{
          padding: '36px',
          borderRadius: 'var(--radius)',
          border: '2px dashed var(--border)',
          background: isHovered ? 'var(--primary)' : 'var(--bg-card)',
          color: isHovered ? '#ffffff' : 'var(--text-main)',
          textAlign: 'center',
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>{isHovered ? '✨' : '🎯'}</div>
        <div style={{ fontSize: '16px', fontWeight: 600 }}>
          {isHovered ? 'Pointer is Hovering!' : 'Hover Over Me'}
        </div>
      </div>
    </div>
  );
}
`;
    }

    // 4. Specialized: Idle Timer Hook (e.g. useIdleTimer)
    if (ctx.hookKind === 'idleTimer') {
      return `import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * [${q.id}] ${cTitle}
 * Environment: React 19 (TypeScript) | Difficulty: ${ctx.difficulty}
 *
 * Key Requirements:
${reqComments}
 */

export interface UseIdleTimerOptions {
  // TODO: Configure inactivity threshold and callback hooks
  timeoutMs?: number;
  onIdle?: () => void;
  onActive?: () => void;
  events?: (keyof WindowEventMap)[];
}

export interface UseIdleTimerResult {
  isIdle: boolean;
  reset: () => void;
  getRemainingTime: () => number;
}

/**
 * Custom Hook: ${hookName}
 * Monitors candidate interaction across mouse, keyboard, and touch events to detect inactivity.
 */
export function ${hookName}(options?: UseIdleTimerOptions): UseIdleTimerResult {
  const timeoutMs = options?.timeoutMs ?? 5000;
  const [isIdle, setIsIdle] = useState<boolean>(false);

  // TODO: Implement timer reset and activity listener
  const reset = useCallback(() => {
    // TODO: Clear existing timeout, reset idle state, and restart timer
  }, [timeoutMs, options?.onActive]);

  const getRemainingTime = useCallback(() => {
    // TODO: Calculate remaining milliseconds before idle state triggers
    return 0;
  }, []);

  useEffect(() => {
    // TODO: Register user interaction listeners (mousemove, keydown, click, scroll)
    // TODO: Clean up event listeners and timer on unmount
  }, [reset]);

  return {
    isIdle,
    reset,
    getRemainingTime,
  };
}

/**
 * Interactive Testing UI
 */
export default function App() {
  const [timeoutSecs, setTimeoutSecs] = useState(5);
  const { isIdle, reset } = ${hookName}({ timeoutMs: timeoutSecs * 1000 });

  return (
    <div className="card">
      <div className="header">
        <span className="badge">${theme.badge}</span>
        <h2>${cTitle}</h2>
        <p>Stop moving your mouse or typing to trigger idle status.</p>
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius)', textAlign: 'center', marginBottom: '16px', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>{isIdle ? '💤' : '⚡'}</div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: isIdle ? '#ef4444' : 'var(--accent)' }}>
          {isIdle ? 'User is IDLE' : 'User is ACTIVE'}
        </div>
      </div>

      <button onClick={reset}>
        Manually Reset Activity
      </button>
    </div>
  );
}
`;
    }

    // 5. Specialized: Event Listener Hook (useEventListener, useOnClickOutside)
    if (ctx.hookKind === 'eventListener' || ctx.hookKind === 'clickOutside') {
      return `import React, { useState, useEffect, useRef } from 'react';

/**
 * [${q.id}] ${cTitle}
 * Environment: React 19 (TypeScript) | Difficulty: ${ctx.difficulty}
 *
 * Key Requirements:
${reqComments}
 */

/**
 * Custom Hook: ${hookName}
 * Attaches dynamic event listeners with automatic lifecycle cleanup.
 */
export function ${hookName}<T extends HTMLElement = HTMLElement>(
  eventName: string,
  handler: (event: Event) => void,
  element?: React.RefObject<T> | T | Window | Document | null,
  options?: boolean | AddEventListenerOptions
): void {
  // TODO: Store latest handler in mutable ref to prevent unnecessary re-subscriptions
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // TODO: Resolve target element and register event listener
    // TODO: Return cleanup function to remove listener on unmount
  }, [eventName, element, options]);
}

/**
 * Interactive Testing UI
 */
export default function App() {
  const [clickCount, setClickCount] = useState(0);
  const [lastEvent, setLastEvent] = useState<string>('None');
  const targetRef = useRef<HTMLDivElement>(null);

  ${hookName}('click', (e) => {
    setClickCount(c => c + 1);
    setLastEvent(\`Click at \${(e as MouseEvent).clientX}, \${(e as MouseEvent).clientY}\`);
  }, targetRef);

  return (
    <div className="card">
      <div className="header">
        <span className="badge">${theme.badge}</span>
        <h2>${cTitle}</h2>
        <p>Verify listener registration and cleanup on target container.</p>
      </div>

      <div
        ref={targetRef}
        style={{
          padding: '32px',
          borderRadius: 'var(--radius)',
          border: '2px dashed var(--border)',
          background: 'var(--bg-card)',
          textAlign: 'center',
          cursor: 'pointer',
          marginBottom: '16px'
        }}
      >
        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>Click Inside This Target Area</div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Clicks detected: {clickCount}</div>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--accent)' }}>Last Event: {lastEvent}</div>
    </div>
  );
}
`;
    }

    // 6. Specialized: Cookie Hook (useCookie)
    if (ctx.hookKind === 'cookie') {
      return `import React, { useState, useEffect, useCallback } from 'react';

/**
 * [${q.id}] ${cTitle}
 * Environment: React 19 (TypeScript) | Difficulty: ${ctx.difficulty}
 *
 * Key Requirements:
${reqComments}
 */

export interface UseCookieOptions {
  // TODO: Configure cookie flags and expiry
  ttlSeconds?: number;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  path?: string;
}

/**
 * Custom Hook: ${hookName}
 * Manages reading, writing, and removing browser cookies with TTL and security flags.
 */
export function ${hookName}(
  name: string,
  initialValue?: string,
  options?: UseCookieOptions
): [string | undefined, (val: string) => void, () => void] {
  // TODO: Parse initial cookie from document.cookie
  const [cookieValue, setCookieValue] = useState<string | undefined>(() => {
    // TODO: Read document.cookie and match name
    return initialValue;
  });

  const updateCookie = useCallback((val: string) => {
    // TODO: Serialize cookie with name, val, Max-Age / ttlSeconds, and secure flags to document.cookie
    setCookieValue(val);
  }, [name, options?.ttlSeconds, options?.secure]);

  const deleteCookie = useCallback(() => {
    // TODO: Expire cookie by setting Max-Age=0 in document.cookie
    setCookieValue(undefined);
  }, [name]);

  return [cookieValue, updateCookie, deleteCookie];
}

/**
 * Interactive Testing UI
 */
export default function App() {
  const [cookieVal, updateCookie, deleteCookie] = ${hookName}('mc_token', 'initial_auth_token');
  const [inputVal, setInputVal] = useState('');

  return (
    <div className="card">
      <div className="header">
        <span className="badge">${theme.badge}</span>
        <h2>${cTitle}</h2>
        <p>Test document.cookie read/write with TTL and security flags.</p>
      </div>

      <div className="button-group">
        <input
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="Enter new cookie value..."
          style={{ flex: 1 }}
        />
        <button onClick={() => updateCookie(inputVal)}>
          Set Cookie
        </button>
        <button onClick={deleteCookie} className="secondary">
          Delete
        </button>
      </div>

      <div className="display-box">
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Current Cookie:</div>
        <div style={{ fontSize: '14px', color: 'var(--accent)', fontFamily: 'monospace' }}>{cookieVal ?? '(none)'}</div>
      </div>
    </div>
  );
}
`;
    }

    // 7. Specialized: Storage Hook (useSessionStorage, useLocalStorage)
    if (ctx.hookKind === 'sessionStorage' || ctx.hookKind === 'localStorage') {
      const storageType = ctx.hookKind === 'sessionStorage' ? 'sessionStorage' : 'localStorage';
      return `import React, { useState, useEffect, useCallback } from 'react';

/**
 * [${q.id}] ${cTitle}
 * Environment: React 19 (TypeScript) | Difficulty: ${ctx.difficulty}
 *
 * Key Requirements:
${reqComments}
 */

export interface ${ctx.pascalName}Options<T> {
  // TODO: Configure serialization and error handling
  serializer?: (val: T) => string;
  deserializer?: (raw: string) => T;
}

/**
 * Custom Hook: ${hookName}
 * Complete the ${storageType} persistence and synchronization logic below.
 */
export function ${hookName}<T = any>(
  key: string,
  initialValue?: T,
  options?: ${ctx.pascalName}Options<T>
) {
  // TODO: Read initial value from ${storageType} with deserializer fallback
  const [storedValue, setStoredValue] = useState<T | undefined>(() => {
    // TODO: Query window.${storageType}.getItem(key)
    return initialValue;
  });

  // TODO: Update ${storageType} and internal state
  const setValue = useCallback((value: T | ((prev: T | undefined) => T)) => {
    // TODO: Serialize with options?.serializer and write to window.${storageType}.setItem(key, ...)
    setStoredValue(value);
  }, [key]);

  // TODO: Remove key from ${storageType}
  const removeValue = useCallback(() => {
    // TODO: window.${storageType}.removeItem(key)
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}

/**
 * Interactive Testing UI
 */
export default function App() {
  const [inputVal, setInputVal] = useState('Active User Preferences');
  const [storedData, setStoredData, removeStoredData] = ${hookName}('mc_demo_key', inputVal);

  return (
    <div className="card">
      <div className="header">
        <span className="badge">${theme.badge}</span>
        <h2>${cTitle}</h2>
        <p>Test persistence, update reactivity, and ${storageType} cleanup.</p>
      </div>

      <div className="button-group">
        <input
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="Enter value to persist..."
          style={{ flex: 1 }}
        />
        <button onClick={() => setStoredData(inputVal)}>
          Persist
        </button>
        <button onClick={() => removeStoredData()} className="secondary">
          Clear
        </button>
      </div>

      <div className="display-box">
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Persisted in ${storageType}:</div>
        <div style={{ fontSize: '14px', color: 'var(--accent)', fontFamily: 'monospace' }}>
          {JSON.stringify(storedData)}
        </div>
      </div>
    </div>
  );
}
`;
    }

    // 4. General Custom Hook
    return `import React, { useState, useEffect, useCallback } from 'react';

/**
 * [${q.id}] ${cTitle}
 * Environment: React 19 (TypeScript) | Difficulty: ${ctx.difficulty}
 *
 * Key Requirements:
${reqComments}
 */

export interface ${ctx.pascalName}Config<T> {
  // TODO: Define configurable hook options
  initialValue?: T;
  onError?: (err: Error) => void;
}

/**
 * Custom Hook: ${hookName}
 * Complete the implementation adhering to requirements.
 */
export function ${hookName}<T = any>(
  keyOrParam: string | T,
  config?: ${ctx.pascalName}Config<T>
) {
  // TODO: Declare reactive state and references
  const [value, setValue] = useState<T | undefined>(config?.initialValue);

  // TODO: Implement updates and side-effect synchronization
  const update = useCallback((next: T) => {
    setValue(next);
  }, []);

  const reset = useCallback(() => {
    setValue(config?.initialValue);
  }, [config?.initialValue]);

  return {
    value,
    update,
    reset,
  };
}

/**
 * Interactive Testing UI
 */
export default function App() {
  const [sample, setSample] = useState('Demo State');
  const hookOutput = ${hookName}(sample);

  return (
    <div className="card">
      <div className="header">
        <span className="badge">${theme.badge}</span>
        <h2>${cTitle}</h2>
        <p>Complete the hook logic and verify interactions below.</p>
      </div>

      <div className="button-group">
        <input
          type="text"
          value={sample}
          onChange={e => setSample(e.target.value)}
          placeholder="Update input..."
          style={{ flex: 1 }}
        />
        <button onClick={() => hookOutput.update(sample)}>
          Apply
        </button>
        <button onClick={() => hookOutput.reset()} className="secondary">
          Reset
        </button>
      </div>

      <div className="display-box">
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Hook Output</div>
        <pre style={{ margin: 0, fontSize: '13px', color: 'var(--accent)', fontFamily: 'monospace' }}>
          {JSON.stringify(hookOutput, null, 2)}
        </pre>
      </div>
    </div>
  );
}
`;
  }

  // === CASE B: SYSTEM DESIGN & OOP ARCHITECTURES ===
  if (ctx.domain === 'system') {
    const className = ctx.pascalName.replace(/System$|Design$|Component$/, '') || 'SystemController';

    return `import React, { useState } from 'react';

/**
 * [${q.id}] ${cTitle}
 * Environment: React 19 (TypeScript) | Difficulty: ${ctx.difficulty}
 *
 * System Requirements:
${reqComments}
 */

${typesBlock ? typesBlock + '\n\n' : ''}/**
 * Core Domain Class: ${className}
 * Architect the state containers, concurrency boundaries, and operations below.
 */
export class ${className} {
  // TODO: Declare private collections, capacity, and status trackers

  constructor() {
    // TODO: Initialize system resources
  }

  public executeOperation(payload?: any): boolean {
    // TODO: Implement primary domain operation logic
    return true;
  }

  public getSystemMetrics(): Record<string, any> {
    // TODO: Return telemetry and status report
    return { status: 'nominal' };
  }

  public reset(): void {
    // TODO: Reset all system collections back to initial state
  }
}

/**
 * Interactive Simulation Harness
 */
export default function App() {
  const [system] = useState(() => new ${className}());
  const [metrics, setMetrics] = useState<Record<string, any>>(() => system.getSystemMetrics());
  const [logs, setLogs] = useState<string[]>(['System initialized.']);

  const handleExecute = () => {
    const success = system.executeOperation();
    setMetrics(system.getSystemMetrics());
    setLogs(prev => [\`Operation executed: \${success ? 'OK' : 'FAIL'}\`, ...prev.slice(0, 7)]);
  };

  const handleReset = () => {
    system.reset();
    setMetrics(system.getSystemMetrics());
    setLogs(['System state reset to baseline.']);
  };

  return (
    <div className="card">
      <div className="header">
        <span className="badge">${theme.badge}</span>
        <h2>${cTitle}</h2>
        <p>Object-Oriented Domain Architecture & Simulation</p>
      </div>

      <div className="button-group">
        <button onClick={handleExecute}>
          Execute Operation
        </button>
        <button onClick={handleReset} className="secondary">
          Reset
        </button>
      </div>

      <div className="display-box" style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>System Metrics</div>
        <pre style={{ margin: 0, fontSize: '12px', color: 'var(--accent)', fontFamily: 'monospace' }}>
          {JSON.stringify(metrics, null, 2)}
        </pre>
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>EVENT LOG:</div>
        <div style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-main)' }}>
          {logs.map((l, i) => <div key={i}>• {l}</div>)}
        </div>
      </div>
    </div>
  );
}
`;
  }

  // === CASE C: UI COMPONENTS & INTERACTIVE WIDGETS ===
  return `import React, { useState } from 'react';

/**
 * [${q.id}] ${cTitle}
 * Environment: React 19 (TypeScript) | Difficulty: ${ctx.difficulty}
 *
 * Component Requirements:
${reqComments}
 */

${typesBlock ? typesBlock + '\n\n' : ''}export interface ${ctx.pascalName}Props {
  // TODO: Define configurable props for ${cTitle}
  title?: string;
  initialValue?: any;
  onChange?: (value: any) => void;
  disabled?: boolean;
}

/**
 * Main Component: ${ctx.pascalName}
 */
export function ${ctx.pascalName}({
  title = '${cTitle}',
  initialValue,
  onChange,
  disabled = false,
}: ${ctx.pascalName}Props) {
  // TODO: Define component state
  const [value, setValue] = useState(initialValue);

  // TODO: Implement primary event handlers (clicks, keyboard, form submissions)
  const handleAction = () => {
    // TODO: Update state and notify parent
  };

  return (
    <div className="${ctx.camelName}-container" style={{ padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      <h3 style={{ margin: '0 0 12px', fontSize: '16px', color: 'var(--accent)' }}>{title}</h3>

      {/* TODO: Construct component UI elements below */}
      <div className="button-group">
        <button
          onClick={handleAction}
          disabled={disabled}
        >
          Trigger Action
        </button>
      </div>
    </div>
  );
}

/**
 * Interactive Demo Harness
 */
export default function App() {
  const [currentValue, setCurrentValue] = useState<any>(null);

  return (
    <div className="card">
      <div className="header">
        <span className="badge">${theme.badge}</span>
        <h2>${cTitle}</h2>
        <p>Build and verify your component implementation below.</p>
      </div>

      <${ctx.pascalName}
        onChange={(val) => setCurrentValue(val)}
      />

      <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
        State Output: <code style={{ color: 'var(--accent)', marginLeft: '4px' }}>{JSON.stringify(currentValue)}</code>
      </div>
    </div>
  );
}
`;
}

/**
 * 2. TYPESCRIPT STARTER CODE GENERATOR
 */
export function generateTypeScriptStarter(q: MCQuestion): { scriptTs: string; indexHtml: string } {
  const ctx = analyzeQuestionContext(q);
  const cTitle = ctx.cleanTitle;
  const { enums, interfaces } = extractDomainEntities(q);
  const typesBlock = [...enums, ...interfaces].join('\n\n');

  let bodyTs = '';
  let uiHtml = '';

  if (ctx.domain === 'system') {
    const className = ctx.pascalName.replace(/System$|Design$|Component$/, '') || 'SystemController';
    bodyTs = `/**
 * Core Domain Class: ${className}
 */
export class ${className} {
  // TODO: Define internal data structures and capacity

  constructor() {
    // TODO: Initialize system components
  }

  public executeOperation(payload?: any): boolean {
    // TODO: Implement primary operation
    return true;
  }

  public getStatus(): Record<string, any> {
    // TODO: Return current status metrics
    return { status: 'nominal' };
  }

  public reset(): void {
    // TODO: Reset state to baseline
  }
}

// Interactive Simulation Harness
const system = new ${className}();
const outputEl = document.getElementById('state-output') as HTMLElement | null;
const actionBtn = document.getElementById('action-btn') as HTMLButtonElement | null;
const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement | null;

function render(): void {
  if (outputEl) {
    outputEl.textContent = JSON.stringify(system.getStatus(), null, 2);
  }
}

actionBtn?.addEventListener('click', () => {
  system.executeOperation();
  render();
});

resetBtn?.addEventListener('click', () => {
  system.reset();
  render();
});

render();
`;
    uiHtml = `
    <div class="button-group">
      <button id="action-btn">Execute Operation</button>
      <button id="reset-btn" class="secondary">Reset System</button>
    </div>
    <div style="margin-top: 16px;">
      <label style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">System Metrics:</label>
      <pre id="state-output" class="display-box" style="text-align: left; font-size: 12px;"></pre>
    </div>`;
  } else if (ctx.domain === 'hook' || ctx.domain === 'utility') {
    const fnName = ctx.camelName;
    bodyTs = `/**
 * Implementation Function: ${fnName}
 */
export function ${fnName}<T = any>(input: T, options?: Record<string, any>): T {
  // TODO: Implement optimal logic conforming to specifications
  console.log('Running ${fnName} with:', input, options);
  return input;
}

// Interactive Testing Harness
const inputEl = document.getElementById('test-input') as HTMLInputElement | null;
const runBtn = document.getElementById('run-btn') as HTMLButtonElement | null;
const outputEl = document.getElementById('state-output') as HTMLElement | null;

function execute(): void {
  if (!outputEl) return;
  const val = inputEl?.value || 'Sample Input';
  const result = ${fnName}(val);
  outputEl.textContent = typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result);
}

runBtn?.addEventListener('click', execute);
execute();
`;
    uiHtml = `
    <div style="display: flex; flex-direction: column; gap: 8px; margin: 16px 0;">
      <input id="test-input" type="text" value="Sample Input" placeholder="Enter input data..." />
      <div class="button-group">
        <button id="run-btn">Run Execution</button>
      </div>
    </div>
    <div>
      <label style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Output Display:</label>
      <pre id="state-output" class="display-box" style="text-align: left; font-size: 12px;"></pre>
    </div>`;
  } else {
    bodyTs = `export interface ${ctx.pascalName}State {
  // TODO: Declare structured component state
  isInitialized: boolean;
  value: any;
}

const state: ${ctx.pascalName}State = {
  isInitialized: true,
  value: null,
};

const actionBtn = document.getElementById('action-btn') as HTMLButtonElement | null;
const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement | null;
const outputEl = document.getElementById('state-output') as HTMLElement | null;

function render(): void {
  if (outputEl) {
    outputEl.textContent = JSON.stringify(state, null, 2);
  }
}

actionBtn?.addEventListener('click', () => {
  // TODO: Implement primary action handler and mutate state
  render();
});

resetBtn?.addEventListener('click', () => {
  // TODO: Reset state to defaults
  render();
});

render();
`;
    uiHtml = `
    <div class="button-group">
      <button id="action-btn">Trigger Action</button>
      <button id="reset-btn" class="secondary">Reset</button>
    </div>
    <div style="margin-top: 16px;">
      <label style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">State Output:</label>
      <pre id="state-output" class="display-box" style="text-align: left; font-size: 12px;"></pre>
    </div>`;
  }

  const scriptTs = `/**
 * [${q.id}] ${cTitle}
 * Language: TypeScript (DOM) | Difficulty: ${ctx.difficulty} | Version: ${GENERATOR_VERSION}
 */

${typesBlock ? typesBlock + '\n\n' : ''}${bodyTs}
console.log('✓ [${q.id}] ${cTitle} initialized successfully');
`;

  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${cTitle}</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="card" id="app-container">
    <h2>${cTitle}</h2>
    <p class="subtitle">${q.summary || 'Implement typed logic using native DOM APIs.'}</p>
${uiHtml}
  </div>
  <script type="module" src="script.ts"></script>
</body>
</html>
`;

  return { scriptTs, indexHtml };
}

/**
 * 3. JAVASCRIPT & DOM STARTER GENERATOR
 */
export function generateJavaScriptStarter(q: MCQuestion): { scriptJs: string; indexHtml: string } {
  const ctx = analyzeQuestionContext(q);
  const cTitle = ctx.cleanTitle;

  let bodyJs = '';
  let uiHtml = '';

  if (ctx.domain === 'system') {
    const className = ctx.pascalName.replace(/System$|Design$|Component$/, '') || 'SystemController';
    bodyJs = `// Core Domain Class
class ${className} {
  constructor() {
    // TODO: Initialize system components and collections
  }

  executeOperation(payload) {
    // TODO: Implement primary operation logic
    return true;
  }

  getStatus() {
    // TODO: Return current status metrics
    return { status: 'nominal' };
  }

  reset() {
    // TODO: Reset system state
  }
}

const system = new ${className}();
const outputDisplay = document.getElementById('output-display');
const actionBtn = document.getElementById('action-btn');
const resetBtn = document.getElementById('reset-btn');

function render() {
  if (outputDisplay) {
    outputDisplay.textContent = JSON.stringify(system.getStatus(), null, 2);
  }
}

actionBtn?.addEventListener('click', () => {
  system.executeOperation();
  render();
});

resetBtn?.addEventListener('click', () => {
  system.reset();
  render();
});

render();
`;
    uiHtml = `
    <div class="button-group">
      <button id="action-btn">Execute Operation</button>
      <button id="reset-btn" class="secondary">Reset</button>
    </div>
    <div style="margin-top: 16px;">
      <pre id="output-display" class="display-box" style="text-align: left; font-size: 12px;"></pre>
    </div>`;
  } else if (ctx.domain === 'hook' || ctx.domain === 'utility') {
    const fnName = ctx.camelName;
    bodyJs = `function ${fnName}(input, options = {}) {
  // TODO: Implement function logic adhering to requirements
  console.log('Running ${fnName} with:', input);
  return input;
}

const inputEl = document.getElementById('test-input');
const runBtn = document.getElementById('run-btn');
const outputDisplay = document.getElementById('output-display');

function execute() {
  if (!outputDisplay) return;
  const val = inputEl?.value || 'Sample Input';
  const res = ${fnName}(val);
  outputDisplay.textContent = typeof res === 'object' ? JSON.stringify(res, null, 2) : String(res);
}

runBtn?.addEventListener('click', execute);
execute();
`;
    uiHtml = `
    <div style="display: flex; flex-direction: column; gap: 8px; margin: 16px 0;">
      <input id="test-input" type="text" value="Sample Input" placeholder="Enter input..." />
      <div class="button-group">
        <button id="run-btn">Execute Function</button>
      </div>
    </div>
    <div style="margin-top: 16px;">
      <pre id="output-display" class="display-box" style="text-align: left; font-size: 12px;"></pre>
    </div>`;
  } else {
    bodyJs = `// Application State
const state = {
  active: false,
  data: null,
};

const actionBtn = document.getElementById('action-btn');
const resetBtn = document.getElementById('reset-btn');
const outputDisplay = document.getElementById('output-display');

function updateView() {
  if (outputDisplay) {
    outputDisplay.textContent = JSON.stringify(state, null, 2);
  }
}

actionBtn?.addEventListener('click', () => {
  // TODO: Handle primary user interaction and state transition
  updateView();
});

resetBtn?.addEventListener('click', () => {
  // TODO: Reset state
  updateView();
});

updateView();
`;
    uiHtml = `
    <div class="button-group">
      <button id="action-btn">Trigger Action</button>
      <button id="reset-btn" class="secondary">Reset</button>
    </div>
    <div style="margin-top: 16px;">
      <pre id="output-display" class="display-box" style="text-align: left; font-size: 12px;"></pre>
    </div>`;
  }

  const scriptJs = `// [${q.id}] ${cTitle}
// Language: JavaScript | Difficulty: ${ctx.difficulty} | Version: ${GENERATOR_VERSION}

${bodyJs}
console.log('✓ Initialized [${q.id}] ${cTitle}');
`;

  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${cTitle}</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="card" id="app-container">
    <h2>${cTitle}</h2>
    <p class="subtitle">${q.summary || 'Vanilla JavaScript interactive application.'}</p>
${uiHtml}
  </div>
  <script src="script.js"></script>
</body>
</html>
`;

  return { scriptJs, indexHtml };
}

/**
 * 4. ALGORITHMIC / LEETCODE STARTER GENERATOR
 */
export function generateLeetCodeStarter(q: MCQuestion): string {
  const ctx = analyzeQuestionContext(q);
  const fnName = ctx.camelName || 'solve';
  const reqList = (q.requirements || []).slice(0, 4);

  return `/**
 * [${q.id}] ${ctx.cleanTitle}
 * Language: Algorithms (JS) | Difficulty: ${ctx.difficulty} | Version: ${GENERATOR_VERSION}
 *
 * Requirements:
${reqList.map(r => ` * - ${r}`).join('\n')}
 */

/**
 * Solution function for: ${ctx.cleanTitle}
 * @param {any} input
 * @returns {any}
 */
export function ${fnName}(input) {
  // TODO: Implement optimal algorithm with targeted time/space efficiency
  console.log('Executing ${fnName} with input:', input);
  return input;
}

// --- Console Verification ---
console.log('--- [${q.id}] ${ctx.cleanTitle} ---');
console.log('Result:', ${fnName}('sample'));
`;
}

export interface QuestionTheme {
  primary: string;
  primaryHover: string;
  accent: string;
  bgBody: string;
  bgSurface: string;
  bgCard: string;
  border: string;
  textMain: string;
  textMuted: string;
  badge: string;
  archetype: string;
  glow?: string;
}

/**
 * Computes a rich, tailored theme palette for each question.
 * Combines 13 dedicated domain archetypes with deterministic HSL palette generation
 * to ensure no two questions fall back to the same black & blue styling.
 */
export function getQuestionTheme(question: MCQuestion): QuestionTheme {
  const ctx = analyzeQuestionContext(question);
  const text = ctx.allText;

  const seedStr = question.id + '::' + question.title;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  const idHue = Math.abs(hash) % 360;

  // 1. Custom Hooks (e.g. Q101-Q150)
  if (ctx.domain === 'hook') {
    const hookHue = (idHue * 7 + 45) % 360;
    return {
      primary: `hsl(${hookHue}, 82%, 56%)`,
      primaryHover: `hsl(${hookHue}, 88%, 46%)`,
      accent: `hsl(${(hookHue + 45) % 360}, 92%, 65%)`,
      bgBody: `hsl(${hookHue}, 40%, 7%)`,
      bgSurface: `hsl(${hookHue}, 35%, 13%)`,
      bgCard: `hsl(${hookHue}, 40%, 9%)`,
      border: `hsl(${hookHue}, 32%, 24%)`,
      glow: `hsla(${hookHue}, 80%, 55%, 0.22)`,
      textMain: '#f8fafc',
      textMuted: `hsl(${hookHue}, 30%, 75%)`,
      badge: 'Custom Hook Inspector',
      archetype: 'hook',
    };
  }

  // 2. Chat, SSE & Real-Time Streams (e.g. Q301)
  if (/\b(chat|messaging|messenger|conversation|sse|eventsource|server-sent)\b/i.test(text)) {
    return {
      primary: '#0d9488',
      primaryHover: '#0f766e',
      accent: '#2dd4bf',
      bgBody: '#041716',
      bgSurface: '#082422',
      bgCard: '#051d1b',
      border: '#134743',
      glow: 'rgba(45, 212, 191, 0.22)',
      textMain: '#f0fdfa',
      textMuted: '#99f6e4',
      badge: 'Chat & Real-Time Stream',
      archetype: 'chat',
    };
  }

  // 3. Audio, Sound & Media Visualizers (e.g. Q350)
  if (ctx.widgetKind === 'media' || /\b(audio|visualizer|waveform|equalizer|sound|synthesizer)\b/i.test(text) || (/\bplayer\b/i.test(text) && !/\bgame\b/i.test(text))) {
    return {
      primary: '#8b5cf6',
      primaryHover: '#7c3aed',
      accent: '#ec4899',
      bgBody: '#13061d',
      bgSurface: '#210d32',
      bgCard: '#180826',
      border: '#461b69',
      glow: 'rgba(236, 72, 153, 0.22)',
      textMain: '#fdf4ff',
      textMuted: '#f0abfc',
      badge: 'Media & Audio Visualizer',
      archetype: 'media',
    };
  }

  // 4. Accordions, Collapse & Expandables (e.g. Q004)
  if (ctx.widgetKind === 'accordion' || /\b(accordion|collapse|expandable|faq)\b/i.test(text)) {
    return {
      primary: '#6366f1',
      primaryHover: '#4f46e5',
      accent: '#c084fc',
      bgBody: '#0b0820',
      bgSurface: '#16123b',
      bgCard: '#100c2c',
      border: '#322b75',
      glow: 'rgba(192, 132, 252, 0.2)',
      textMain: '#faf5ff',
      textMuted: '#e9d5ff',
      badge: 'Expandable Accordion & Nav',
      archetype: 'accordion',
    };
  }

  // 5. Forms, Surveys, RSVP & Auth (e.g. Q200)
  if (ctx.widgetKind === 'form' || /\b(forms?|survey|rsvp|checkout|registration|sign up|sign in)\b/i.test(text)) {
    return {
      primary: '#f97316',
      primaryHover: '#ea580c',
      accent: '#fbbf24',
      bgBody: '#1a0d06',
      bgSurface: '#2d180b',
      bgCard: '#221208',
      border: '#542d15',
      glow: 'rgba(249, 115, 22, 0.22)',
      textMain: '#fff7ed',
      textMuted: '#fed7aa',
      badge: 'Form & RSVP Flow',
      archetype: 'form',
    };
  }

  // 6. Overlays, Modals, Banners & Toasts (e.g. Q100)
  if (ctx.widgetKind === 'overlay' || /\b(modals?|dialogs?|drawers?|toasts?|banners?|consent|popups?|notification)\b/i.test(text)) {
    return {
      primary: '#818cf8',
      primaryHover: '#6366f1',
      accent: '#38bdf8',
      bgBody: '#0c0f24',
      bgSurface: '#161a3d',
      bgCard: '#101430',
      border: '#2e356e',
      glow: 'rgba(56, 189, 248, 0.2)',
      textMain: '#f0f9ff',
      textMuted: '#bae6fd',
      badge: 'Modal & Overlay Architecture',
      archetype: 'overlay',
    };
  }

  // 7. Data Tables, Grids & Spreadsheets
  if (ctx.widgetKind === 'table' || /\b(spreadsheet|data-table|virtual grid|virtual list)\b/i.test(text) || (/\btables?\b/i.test(text) && !/\btimetable\b/i.test(text))) {
    return {
      primary: '#0284c7',
      primaryHover: '#0369a1',
      accent: '#38bdf8',
      bgBody: '#071524',
      bgSurface: '#0f243c',
      bgCard: '#0a1a2c',
      border: '#1a3e64',
      glow: 'rgba(56, 189, 248, 0.2)',
      textMain: '#f0f9ff',
      textMuted: '#93c5fd',
      badge: 'Data Table & Virtual Grid',
      archetype: 'table',
    };
  }

  // 8. Performance, Metrics & Analytics Dashboards (e.g. Q250)
  if (/\b(metrics?|performance|vitals|analytics|telemetry|fcp|lcp|cls|fps|benchmarks?)\b/i.test(text) || (/\bdashboard\b/i.test(text) && !/\bcloud\b/i.test(text))) {
    return {
      primary: '#10b981',
      primaryHover: '#059669',
      accent: '#34d399',
      bgBody: '#041611',
      bgSurface: '#092920',
      bgCard: '#061f18',
      border: '#154e3d',
      glow: 'rgba(52, 211, 153, 0.22)',
      textMain: '#ecfdf5',
      textMuted: '#a7f3d0',
      badge: 'Performance & Vitals Dashboard',
      archetype: 'metric',
    };
  }

  // 9. Real-World Systems, IoT & Telemetry (e.g. Q300)
  if (ctx.domain === 'system' || ctx.widgetKind === 'iot' || /\b(smart home|devices?|iot|thermostat|elevator|parking|cache system|circuit breaker|rate limiter|load balancer|cloud|infrastructure)\b/i.test(text)) {
    return {
      primary: '#06b6d4',
      primaryHover: '#0891b2',
      accent: '#84cc16',
      bgBody: '#03141a',
      bgSurface: '#07242e',
      bgCard: '#051a21',
      border: '#104454',
      glow: 'rgba(132, 204, 22, 0.22)',
      textMain: '#ecfeff',
      textMuted: '#a5f3fc',
      badge: 'Systems & IoT Telemetry',
      archetype: 'system',
    };
  }

  // 10. Creative, Canvas, Drawing & Games
  if (/\b(games?|canvas|drawing|pixel art|paint|board game|puzzle|tictactoe|sudoku)\b/i.test(text)) {
    return {
      primary: '#f43f5e',
      primaryHover: '#e11d48',
      accent: '#fbbf24',
      bgBody: '#19060f',
      bgSurface: '#2d0c1b',
      bgCard: '#200813',
      border: '#5c1737',
      glow: 'rgba(244, 63, 94, 0.22)',
      textMain: '#fff1f2',
      textMuted: '#fecdd3',
      badge: 'Canvas & Game Studio',
      archetype: 'game',
    };
  }

  // 11. Timers, Clocks & Countdowns
  if (/\b(timers?|stopwatch|clocks?|countdown|interval|pomodoro)\b/i.test(text)) {
    return {
      primary: '#eab308',
      primaryHover: '#ca8a04',
      accent: '#38bdf8',
      bgBody: '#161103',
      bgSurface: '#292008',
      bgCard: '#1d1705',
      border: '#52400f',
      glow: 'rgba(234, 179, 8, 0.22)',
      textMain: '#fefce8',
      textMuted: '#fef08a',
      badge: 'Precision Timing & Clock',
      archetype: 'timer',
    };
  }

  // 12. Star Ratings & Reviews
  if (/\b(star rating|rating widget|star review|five star|ratings?)\b/i.test(text)) {
    return {
      primary: '#f59e0b',
      primaryHover: '#d97706',
      accent: '#fbbf24',
      bgBody: '#171004',
      bgSurface: '#2b1e0a',
      bgCard: '#1f1506',
      border: '#533c14',
      glow: 'rgba(251, 191, 36, 0.22)',
      textMain: '#fffbeb',
      textMuted: '#fde68a',
      badge: 'Interactive Rating & Review',
      archetype: 'rating',
    };
  }

  // 13. Dynamic Deterministic Seeded HSL Engine
  // Every question gets an individual hue, distinct background saturation, and tuned accent!
  const genHue = (idHue * 13 + 37) % 360;
  return {
    primary: `hsl(${genHue}, 78%, 52%)`,
    primaryHover: `hsl(${genHue}, 82%, 42%)`,
    accent: `hsl(${(genHue + 42) % 360}, 90%, 64%)`,
    bgBody: `hsl(${genHue}, 35%, 6%)`,
    bgSurface: `hsl(${genHue}, 30%, 12%)`,
    bgCard: `hsl(${genHue}, 35%, 8%)`,
    border: `hsl(${genHue}, 28%, 22%)`,
    glow: `hsla(${genHue}, 80%, 55%, 0.2)`,
    textMain: '#f8fafc',
    textMuted: `hsl(${genHue}, 24%, 74%)`,
    badge: question.category || 'Component Challenge',
    archetype: 'general',
  };
}

/**
 * Generates dynamic, question-specific, aesthetic CSS based on question domain, category, and widgets.
 */
export function generateDynamicCss(question: MCQuestion): string {
  const ctx = analyzeQuestionContext(question);
  const cTitle = ctx.cleanTitle;
  const theme = getQuestionTheme(question);

  // Component-specific CSS blocks
  let specializedBlock = '';

  if (theme.archetype === 'hook') {
    specializedBlock = `
/* Custom Hook Reactive Inspector */
.hook-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.hook-state-display {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
}
.state-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 13px;
}
.state-entry:last-child {
  border-bottom: none;
}
.state-name {
  color: var(--text-muted);
}
.state-value {
  color: var(--accent);
  font-family: monospace;
  font-weight: 600;
}
`;
  } else if (theme.archetype === 'chat') {
    specializedBlock = `
/* Real-Time Chat & Stream Layout */
.chat-stream-window {
  display: flex;
  flex-direction: column;
  height: 280px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}
.chat-stream-header {
  padding: 10px 14px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}
.chat-message-list {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.chat-bubble {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.4;
}
.chat-bubble.incoming {
  align-self: flex-start;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  color: var(--text-main);
}
.chat-bubble.outgoing {
  align-self: flex-end;
  background: var(--primary);
  color: #ffffff;
}
.stream-status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--accent);
  font-weight: 600;
}
.stream-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}
`;
  } else if (theme.archetype === 'accordion') {
    specializedBlock = `
/* Accordion Specific Layout & Micro-animations */
.accordion-root {
  width: 100%;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--bg-card);
}
.accordion-item {
  border-bottom: 1px solid var(--border);
  transition: background 0.2s ease;
}
.accordion-item:last-child {
  border-bottom: none;
}
.accordion-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: transparent;
  border: none;
  color: var(--text-main);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
}
.accordion-header:hover {
  background: rgba(255, 255, 255, 0.03);
}
.accordion-icon {
  display: inline-block;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--primary);
}
.accordion-item.open .accordion-icon,
.accordion-header[aria-expanded="true"] .accordion-icon {
  transform: rotate(180deg);
}
.accordion-body {
  padding: 14px 18px;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--text-muted);
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  background: rgba(0, 0, 0, 0.15);
}
`;
  } else if (theme.archetype === 'media') {
    specializedBlock = `
/* Audio Visualizer & Media Canvas */
.media-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}
.visualizer-canvas {
  width: 100%;
  height: 180px;
  background: #090d16;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
}
.playback-bar {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
}
.track-slider {
  flex: 1;
  accent-color: var(--primary);
  cursor: pointer;
}
.waveform-meter {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 60px;
  padding: 8px;
}
.meter-bar {
  width: 6px;
  background: linear-gradient(180deg, var(--accent), var(--primary));
  border-radius: 3px 3px 0 0;
}
`;
  } else if (theme.archetype === 'overlay') {
    specializedBlock = `
/* Modal, Drawer & Toast Overlays */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}
.modal-window {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  width: 90%;
  max-width: 520px;
  padding: 24px;
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.5);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}
.toast-stack {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1100;
}
.toast-notification {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: var(--radius);
  background: var(--bg-surface);
  border: 1px solid var(--border);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  font-size: 13px;
}
`;
  } else if (theme.archetype === 'form') {
    specializedBlock = `
/* Form Fields & Validation Styles */
.form-layout {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
}
.field-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-main);
  font-size: 14px;
  transition: all 0.15s ease;
  box-sizing: border-box;
}
.field-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.field-input.has-error {
  border-color: #ef4444;
}
.field-error-msg {
  font-size: 12px;
  color: #ef4444;
  margin-top: 2px;
}
.stepper-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
`;
  } else if (theme.archetype === 'table') {
    specializedBlock = `
/* Data Table & Grid Layout */
.data-table-wrapper {
  width: 100%;
  overflow-x: auto;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--bg-card);
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
  text-align: left;
}
.data-table th {
  background: var(--bg-surface);
  padding: 12px 16px;
  font-weight: 600;
  color: var(--text-main);
  border-bottom: 2px solid var(--border);
  user-select: none;
}
.data-table th.sortable {
  cursor: pointer;
}
.data-table th.sortable:hover {
  color: var(--accent);
}
.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  color: var(--text-main);
}
.data-table tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  font-size: 13px;
  color: var(--text-muted);
}
`;
  } else if (theme.archetype === 'metric') {
    specializedBlock = `
/* Analytics & Metrics Tiles */
.metrics-dashboard {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}
.stat-tile {
  padding: 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.stat-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
}
.stat-number {
  font-size: 22px;
  font-weight: 800;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}
`;
  } else if (theme.archetype === 'system') {
    specializedBlock = `
/* Real-World Systems & Telemetry Dashboard */
.system-metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}
.system-event-log {
  background: #090d16;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 14px;
  font-family: monospace;
  font-size: 12px;
  max-height: 180px;
  overflow-y: auto;
  color: #38bdf8;
  line-height: 1.5;
}
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}
.status-pill.online {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}
.status-pill.offline {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}
`;
  }

  return `/* [${question.id}] ${cTitle} - Dynamic Stylesheet */
:root {
  --primary: ${theme.primary};
  --primary-hover: ${theme.primaryHover};
  --accent: ${theme.accent};
  --surface: ${theme.bgSurface};
  --bg-surface: ${theme.bgSurface};
  --bg: ${theme.bgCard};
  --bg-card: ${theme.bgCard};
  --bg-body: ${theme.bgBody};
  --text-primary: ${theme.textMain};
  --text-secondary: ${theme.textMuted};
  --text-main: ${theme.textMain};
  --text-muted: ${theme.textMuted};
  --border: ${theme.border};
  --glow: ${theme.glow || 'rgba(255, 255, 255, 0.12)'};
  --radius: 14px;
}

@media (prefers-color-scheme: light) {
  :root {
    --bg-body: #f8fafc;
    --surface: #ffffff;
    --bg-surface: #ffffff;
    --bg: #f1f5f9;
    --bg-card: #f1f5f9;
    --text-primary: #0f172a;
    --text-secondary: #64748b;
    --text-main: #0f172a;
    --text-muted: #64748b;
    --border: #cbd5e1;
    --glow: rgba(0, 0, 0, 0.05);
  }
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 24px;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text-main);
  background-color: var(--bg-body, #0a0e17);
  background-image: radial-gradient(ellipse at 50% 0%, var(--glow) 0%, transparent 65%), linear-gradient(180deg, var(--bg-body) 0%, var(--bg-card) 100%);
  background-attachment: fixed;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

.card {
  max-width: 580px;
  margin: 0 auto;
  background: var(--surface, var(--bg-surface));
  border: 1px solid var(--border);
  border-top: 3px solid var(--accent);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: 0 12px 36px -6px rgba(0, 0, 0, 0.5), 0 0 24px -4px var(--glow);
  position: relative;
  overflow: hidden;
}

.header {
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 14px;
}

.header h2 {
  margin: 0 0 6px;
  font-size: 19px;
  color: var(--accent);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.header p {
  margin: 0;
  font-size: 13px;
  color: var(--text-muted);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.08);
  color: var(--accent);
  border: 1px solid var(--border);
  margin-bottom: 10px;
}

.button-group {
  display: flex;
  gap: 8px;
  margin: 16px 0;
  flex-wrap: wrap;
}

button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 18px;
  border-radius: 8px;
  border: none;
  background: var(--primary);
  color: #ffffff;
  font-weight: 600;
  font-size: 13.5px;
  cursor: pointer;
  transition: all 0.15s ease;
}

button:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button.secondary {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-main);
}

button.secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.05);
}

button.danger {
  background: #ef4444;
}

button.danger:hover:not(:disabled) {
  background: #dc2626;
}

input, select, textarea {
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-main);
  font-size: 13.5px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  box-sizing: border-box;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.display-box {
  background: var(--bg-card);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--border);
  color: var(--accent);
  font-family: monospace;
  font-size: 13px;
  margin: 14px 0;
}
${specializedBlock}
`;
}

/**
 * Primary export: Generates question-specific starter files and metadata for any question and language.
 */
export function generateQuestionStarter(question: MCQuestion, lang: MCLanguage = 'react'): Record<string, string> {
  const dynamicCss = generateDynamicCss(question);
  switch (lang) {
    case 'react': {
      return {
        'App.tsx': generateReactStarter(question),
        'styles.css': dynamicCss,
      };
    }
    case 'typescript': {
      const { scriptTs, indexHtml } = generateTypeScriptStarter(question);
      return {
        'script.ts': scriptTs,
        'index.html': indexHtml,
        'styles.css': dynamicCss,
      };
    }
    case 'javascript':
    case 'dom': {
      const { scriptJs, indexHtml } = generateJavaScriptStarter(question);
      return {
        'script.js': scriptJs,
        'index.html': indexHtml,
        'styles.css': dynamicCss,
      };
    }
    case 'leetcode': {
      return {
        'solution.js': generateLeetCodeStarter(question),
      };
    }
    default: {
      return {
        'App.tsx': generateReactStarter(question),
        'styles.css': dynamicCss,
      };
    }
  }
}

/**
 * Builds starter metadata for tracking generator version, questionId, and language isolation.
 */
export function buildStarterMetadata(
  question: MCQuestion,
  lang: MCLanguage,
  starterCode: string,
  isCustomModified = false
): StarterMetadata {
  const ctx = analyzeQuestionContext(question);
  let hash = 0;
  for (let i = 0; i < starterCode.length; i++) {
    hash = (hash << 5) - hash + starterCode.charCodeAt(i);
    hash |= 0;
  }

  return {
    questionId: question.id,
    language: lang,
    starterHash: String(hash),
    generatedAt: Date.now(),
    generatorVersion: GENERATOR_VERSION,
    domainType: ctx.domain,
    difficulty: ctx.difficulty,
    isCustomModified,
  };
}
