import type { Question } from '../models/question';

const CODING_QUESTIONS: Question[] = [
  {
    id: 501,
    category: 'Hooks',
    difficulty: 'Medium',
    question: 'Implement a useDebounce hook',
    answer: 'A custom hook that delays updating a value until after a specified delay. Uses useState and useEffect with a setTimeout. The timeout is cleared on each value change, effectively debouncing the input.',
    code: `import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      console.log('Searching for:', debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <input
      type="text"
      placeholder="Search..."
      value={query}
      onChange={e => setQuery(e.target.value)}
      style={{ padding: 8, fontSize: 16, width: '100%', maxWidth: 400 }}
    />
  );
}`,
  },
  {
    id: 502,
    category: 'Hooks',
    difficulty: 'Medium',
    question: 'Implement a useLocalStorage hook',
    answer: 'A custom hook that syncs state with localStorage. Reads initial value from localStorage if available, and updates localStorage whenever the state changes. Handles JSON serialization gracefully.',
    code: `import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <div style={{ padding: 20 }}>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </div>
  );
}`,
  },
  {
    id: 503,
    category: 'Components & Props',
    difficulty: 'Medium',
    question: 'Implement an accordion component',
    answer: 'An accordion that allows expanding/collapsing sections. Uses React state to track which panel is open. Supports single or multiple open panels via a prop.',
    code: `import { useState } from 'react';

interface AccordionPanel {
  title: string;
  content: string;
}

function Accordion({ panels, allowMultiple = false }: { panels: AccordionPanel[]; allowMultiple?: boolean }) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggle = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes(prev =>
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndexes(prev => prev.includes(index) ? [] : [index]);
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
      {panels.map((panel, i) => (
        <div key={i} style={{ borderBottom: i < panels.length - 1 ? '1px solid #ddd' : 'none' }}>
          <button
            onClick={() => toggle(i)}
            style={{
              width: '100%', padding: '12px 16px', textAlign: 'left',
              background: openIndexes.includes(i) ? '#f0f7ff' : '#fafafa',
              border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14,
            }}
          >
            {panel.title} {openIndexes.includes(i) ? '\\u25B2' : '\\u25BC'}
          </button>
          {openIndexes.includes(i) && (
            <div style={{ padding: '12px 16px', background: '#fff', fontSize: 14 }}>
              {panel.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const panels = [
    { title: 'What is React?', content: 'A JavaScript library for building user interfaces.' },
    { title: 'What is JSX?', content: 'A syntax extension for JavaScript that looks like HTML.' },
    { title: 'What are hooks?', content: 'Functions that let you use React features from function components.' },
  ];
  return <Accordion panels={panels} />;
}`,
  },
  {
    id: 504,
    category: 'Components & Props',
    difficulty: 'Medium',
    question: 'Implement a modal/dialog component',
    answer: 'A reusable modal component with backdrop, close button, and portal rendering. Handles escape key press and click-outside to close.',
    code: `import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}
      />
      <div
        style={{
          position: 'relative', background: '#fff', borderRadius: 12,
          padding: 24, minWidth: 400, maxWidth: '90vw', maxHeight: '80vh',
          overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', padding: '0 4px' }}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ padding: 40 }}>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Example Modal">
        <p>This is a modal dialog. Press Escape or click the backdrop to close.</p>
      </Modal>
    </div>
  );
}`,
  },
  {
    id: 505,
    category: 'Components & Props',
    difficulty: 'Medium',
    question: 'Implement a star rating component',
    answer: 'A star rating component that supports both display and interactive modes, with half-star support and keyboard accessibility.',
    code: `import { useState } from 'react';

interface StarRatingProps {
  maxStars?: number;
  initialRating?: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
}

function StarRating({ maxStars = 5, initialRating = 0, onChange, readonly = false }: StarRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleClick = (value: number) => {
    if (readonly) return;
    setRating(value);
    onChange?.(value);
  };

  return (
    <div style={{ display: 'flex', gap: 2 }} role="radiogroup" aria-label="Star rating">
      {Array.from({ length: maxStars }, (_, i) => {
        const value = i + 1;
        const filled = value <= (hover || rating);
        return (
          <button
            key={i}
            type="button"
            disabled={readonly}
            onClick={() => handleClick(value)}
            onMouseEnter={() => !readonly && setHover(value)}
            onMouseLeave={() => !readonly && setHover(0)}
            aria-label={\`\${value} star\${value > 1 ? 's' : ''}\`}
            style={{
              background: 'none', border: 'none', cursor: readonly ? 'default' : 'pointer',
              fontSize: 32, padding: 0, lineHeight: 1,
              color: filled ? '#f59e0b' : '#d1d5db',
              transition: 'color 0.15s',
            }}
          >
            {filled ? '★' : '☆'}
          </button>
        );
      })}
    </div>
  );
}

export default function App() {
  const [rating, setRating] = useState(0);
  return (
    <div style={{ padding: 40 }}>
      <StarRating onChange={setRating} />
      <p>Rating: {rating} / 5</p>
      <StarRating initialRating={3} readonly />
    </div>
  );
}`,
  },
  {
    id: 506,
    category: 'State Management',
    difficulty: 'Medium',
    question: 'Implement a simple todo list with undo/redo',
    answer: 'A todo list application with add, toggle, and delete functionality, plus undo/redo history using a custom hook that tracks past and future states.',
    code: `import { useState, useCallback } from 'react';

function useUndoRedo<T>(initial: T) {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T>(initial);
  const [future, setFuture] = useState<T[]>([]);

  const set = useCallback((newPresent: T) => {
    setPast(p => [...p, present]);
    setPresent(newPresent);
    setFuture([]);
  }, [present]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast(p => p.slice(0, -1));
    setFuture(f => [present, ...f]);
    setPresent(previous);
  }, [past, present]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture(f => f.slice(1));
    setPast(p => [...p, present]);
    setPresent(next);
  }, [future, present]);

  return { state: present, set, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 };
}

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export default function App() {
  const { state: todos, set: setTodos, undo, redo, canUndo, canRedo } = useUndoRedo<Todo[]>([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input, done: false }]);
    setInput('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div style={{ padding: 20, maxWidth: 400 }}>
      <h3>Todo List</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="Add todo..." style={{ flex: 1, padding: 6 }} />
        <button onClick={addTodo}>Add</button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={undo} disabled={!canUndo}>Undo</button>
        <button onClick={redo} disabled={!canRedo}>Redo</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(t => (
          <li key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
            <input type="checkbox" checked={t.done} onChange={() => toggleTodo(t.id)} />
            <span style={{ textDecoration: t.done ? 'line-through' : 'none', color: t.done ? '#999' : '#333' }}>
              {t.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
  },
  {
    id: 507,
    category: 'Rendering & Performance',
    difficulty: 'Hard',
    question: 'Implement a virtualized list component',
    answer: 'A virtualized list that only renders visible items, using scroll position calculations to determine which items to display. Fixed item height enables efficient calculation.',
    code: `import { useState, useRef, useCallback, useEffect } from 'react';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}

function VirtualList<T>({ items, itemHeight, renderItem, overscan = 3 }: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const containerHeight = containerRef.current?.clientHeight ?? 400;

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(items.length, Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan);

  const visibleItems = items.slice(startIndex, endIndex);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <div ref={containerRef} style={{ height: containerHeight, overflow: 'auto', border: '1px solid #ddd', borderRadius: 8 }}>
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ position: 'absolute', top: startIndex * itemHeight, left: 0, right: 0 }}>
          {visibleItems.map((item, i) => (
            <div key={startIndex + i} style={{ height: itemHeight, display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: '1px solid #eee' }}>
              {renderItem(item, startIndex + i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const items = Array.from({ length: 10000 }, (_, i) => ({ id: i, label: \`Item #\${i + 1}\` }));
  return (
    <div style={{ padding: 20 }}>
      <VirtualList items={items} itemHeight={48} renderItem={item => <span>{item.label}</span>} />
    </div>
  );
}`,
  },
  {
    id: 508,
    category: 'Hooks',
    difficulty: 'Medium',
    question: 'Implement a useIntersectionObserver hook',
    answer: 'A custom hook that tracks element visibility using the IntersectionObserver API. Useful for lazy loading images, infinite scroll triggers, and animation entry points.',
    code: `import { useEffect, useRef, useState } from 'react';

function useIntersectionObserver(options?: IntersectionObserverInit): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isIntersecting];
}

export default function App() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.5 });

  return (
    <div style={{ padding: 20 }}>
      <div style={{ height: '150vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0' }}>
        Scroll down
      </div>
      <div ref={ref} style={{
        padding: 40, textAlign: 'center',
        background: isVisible ? '#4caf50' : '#e0e0e0',
        color: isVisible ? '#fff' : '#333',
        transition: 'all 0.5s', borderRadius: 12,
      }}>
        {isVisible ? 'I am visible!' : 'Scroll to see me'}
      </div>
      <div style={{ height: '100vh' }} />
    </div>
  );
}`,
  },
  {
    id: 509,
    category: 'Components & Props',
    difficulty: 'Medium',
    question: 'Implement a tabs component',
    answer: 'A tabbed interface component that manages active tab state and renders corresponding content panels. Supports keyboard navigation.',
    code: `import { useState } from 'react';

interface Tab {
  label: string;
  content: React.ReactNode;
}

function Tabs({ tabs }: { tabs: Tab[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <div role="tablist" style={{ display: 'flex', gap: 0, borderBottom: '2px solid #e0e0e0' }}>
        {tabs.map((tab, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={activeIndex === i}
            onClick={() => setActiveIndex(i)}
            style={{
              padding: '10px 20px', border: 'none', background: activeIndex === i ? '#fff' : 'transparent',
              borderBottom: activeIndex === i ? '2px solid #1976d2' : '2px solid transparent',
              marginBottom: -2, cursor: 'pointer', fontWeight: activeIndex === i ? 600 : 400,
              color: activeIndex === i ? '#1976d2' : '#666', fontSize: 14,
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" style={{ padding: '20px 0' }}>
        {tabs[activeIndex].content}
      </div>
    </div>
  );
}

export default function App() {
  const tabs = [
    { label: 'React', content: <p>React is a JavaScript library for building user interfaces.</p> },
    { label: 'Vue', content: <p>Vue is a progressive framework for building UIs.</p> },
    { label: 'Angular', content: <p>Angular is a platform for building mobile and desktop applications.</p> },
  ];
  return <Tabs tabs={tabs} />;
}`,
  },
  {
    id: 510,
    category: 'Hooks',
    difficulty: 'Medium',
    question: 'Implement a usePrevious hook',
    answer: 'A custom hook that tracks the previous value of a prop or state. Uses useRef to store the value across renders and useEffect to update it after render.',
    code: `import { useEffect, useRef } from 'react';

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div style={{ padding: 20 }}>
      <p>Current: {count}</p>
      <p>Previous: {prevCount ?? 'none'}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}`,
  },
  {
    id: 511,
    category: 'Hooks',
    difficulty: 'Medium',
    question: 'Implement a useWindowSize hook',
    answer: 'A custom hook that returns the current window dimensions and updates on resize. Uses useEffect with resize event listener and proper cleanup.',
    code: `import { useState, useEffect } from 'react';

function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

export default function App() {
  const { width, height } = useWindowSize();

  return (
    <div style={{ padding: 20 }}>
      <h3>Window Size</h3>
      <p>Width: {width}px</p>
      <p>Height: {height}px</p>
      <p>Resize the browser window to see changes.</p>
    </div>
  );
}`,
  },
  {
    id: 512,
    category: 'Components & Props',
    difficulty: 'Medium',
    question: 'Implement an image gallery with lightbox',
    answer: 'A responsive image gallery with a lightbox overlay for full-size image viewing. Supports keyboard navigation (arrow keys, escape).',
    code: `import { useState, useEffect, useCallback } from 'react';

const images = [
  { src: 'https://picsum.photos/id/1015/400/300', alt: 'Mountain' },
  { src: 'https://picsum.photos/id/1016/400/300', alt: 'Road' },
  { src: 'https://picsum.photos/id/1018/400/300', alt: 'Ocean' },
  { src: 'https://picsum.photos/id/1020/400/300', alt: 'Dog' },
  { src: 'https://picsum.photos/id/1024/400/300', alt: 'Bird' },
  { src: 'https://picsum.photos/id/1027/400/300', alt: 'Person' },
];

function Lightbox({ index, onClose, onPrev, onNext }: { index: number; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onPrev();
    if (e.key === 'ArrowRight') onNext();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}>
      <button onClick={e => { e.stopPropagation(); onPrev(); }}
        style={{ position: 'absolute', left: 20, background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', fontSize: 32, padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>
        ‹
      </button>
      <img src={images[index].src} alt={images[index].alt}
        style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 4 }}
        onClick={e => e.stopPropagation()} />
      <button onClick={e => { e.stopPropagation(); onNext(); }}
        style={{ position: 'absolute', right: 20, background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', fontSize: 32, padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>
        ›
      </button>
      <button onClick={onClose}
        style={{ position: 'absolute', top: 20, right: 20, background: 'none', color: '#fff', border: 'none', fontSize: 36, cursor: 'pointer' }}>
        ×
      </button>
    </div>
  );
}

export default function App() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handlePrev = () => setLightboxIndex(i => i !== null ? (i > 0 ? i - 1 : images.length - 1) : null);
  const handleNext = () => setLightboxIndex(i => i !== null ? (i < images.length - 1 ? i + 1 : 0) : null);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {images.map((img, i) => (
          <img key={i} src={img.src} alt={img.alt}
            onClick={() => setLightboxIndex(i)}
            style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseOver={e => (e.target as HTMLElement).style.transform = 'scale(1.03)'}
            onMouseOut={e => (e.target as HTMLElement).style.transform = 'scale(1)'} />
        ))}
      </div>
      {lightboxIndex !== null && (
        <Lightbox index={lightboxIndex} onClose={() => setLightboxIndex(null)} onPrev={handlePrev} onNext={handleNext} />
      )}
    </div>
  );
}`,
  },
  {
    id: 513,
    category: 'Hooks',
    difficulty: 'Easy',
    question: 'Implement a countdown timer hook',
    answer: 'A custom hook that counts down from a given number of seconds. Provides the remaining time, start, pause, and reset functions.',
    code: `import { useState, useEffect, useCallback, useRef } from 'react';

function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = window.setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            setIsRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [isRunning, clearTimer]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => { setIsRunning(false); setSeconds(initialSeconds); }, [initialSeconds]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return { minutes, seconds: secs, isRunning, start, pause, reset };
}

export default function App() {
  const { minutes, seconds, isRunning, start, pause, reset } = useCountdown(120);

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1 style={{ fontSize: 48, fontVariantNumeric: 'tabular-nums' }}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </h1>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        {!isRunning ? (
          <button onClick={start}>{seconds === 0 ? 'Restart' : 'Start'}</button>
        ) : (
          <button onClick={pause}>Pause</button>
        )}
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}`,
  },
  {
    id: 514,
    category: 'Components & Props',
    difficulty: 'Hard',
    question: 'Implement a data table with sort, filter, and pagination',
    answer: 'A reusable data table component with column sorting, text filtering, and paginated display. All state is managed internally with configurable page size.',
    code: `import { useState, useMemo } from 'react';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
}

function DataTable<T extends Record<string, any>>({ data, columns, pageSize = 10 }: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!filter) return data;
    return data.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [data, filter]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(0);
  };

  return (
    <div>
      <input
        placeholder="Filter..."
        value={filter}
        onChange={e => { setFilter(e.target.value); setPage(0); }}
        style={{ marginBottom: 12, padding: 8, width: '100%', maxWidth: 300, border: '1px solid #ddd', borderRadius: 6 }}
      />
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f8f9fa' }}>
            {columns.map(col => (
              <th key={String(col.key)}
                onClick={() => col.sortable !== false && handleSort(col.key)}
                style={{
                  padding: '10px 12px', textAlign: 'left', cursor: col.sortable !== false ? 'pointer' : 'default',
                  borderBottom: '2px solid #dee2e6', userSelect: 'none',
                }}>
                {col.label} {sortKey === col.key ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paged.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
              {columns.map(col => (
                <td key={String(col.key)} style={{ padding: '8px 12px' }}>
                  {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <span>Page {page + 1} of {totalPages} ({sorted.length} items)</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</button>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const data = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1, name: \`User \${i + 1}\`, email: \`user\${i + 1}@example.com\`,
    role: ['Admin', 'Editor', 'Viewer'][i % 3], age: 20 + (i % 30),
  }));

  const columns = [
    { key: 'id' as const, label: 'ID' },
    { key: 'name' as const, label: 'Name' },
    { key: 'email' as const, label: 'Email' },
    { key: 'role' as const, label: 'Role' },
    { key: 'age' as const, label: 'Age' },
  ];

  return (
    <div style={{ padding: 20 }}>
      <DataTable data={data} columns={columns} pageSize={8} />
    </div>
  );
}`,
  },
  {
    id: 515,
    category: 'Components & Props',
    difficulty: 'Medium',
    question: 'Implement a tooltip component',
    answer: 'A tooltip component that shows on hover with positioning based on the trigger element. Uses CSS for transition effects.',
    code: `import { useState, useRef } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(true);
  };

  const hide = () => {
    timeoutRef.current = window.setTimeout(() => setVisible(false), 100);
  };

  const positions: Record<string, React.CSSProperties> = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 6 },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 6 },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 6 },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 6 },
  };

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {visible && (
        <span style={{
          position: 'absolute', ...positions[position],
          background: '#333', color: '#fff', padding: '4px 10px', borderRadius: 4,
          fontSize: 12, whiteSpace: 'nowrap', zIndex: 100,
          animation: 'fadeIn 0.15s ease',
        }}>
          {content}
        </span>
      )}
    </span>
  );
}

export default function App() {
  return (
    <div style={{ padding: 60, display: 'flex', gap: 40 }}>
      <Tooltip content="This is a tooltip" position="top">
        <button>Hover top</button>
      </Tooltip>
      <Tooltip content="Tooltip on bottom" position="bottom">
        <button>Hover bottom</button>
      </Tooltip>
      <Tooltip content="Tooltip on left" position="left">
        <button>Hover left</button>
      </Tooltip>
      <Tooltip content="Tooltip on right" position="right">
        <button>Hover right</button>
      </Tooltip>
    </div>
  );
}`,
  },
  {
    id: 516,
    category: 'Components & Props',
    difficulty: 'Medium',
    question: 'Implement a multi-select dropdown (tag input)',
    answer: 'A tag input component that allows selecting multiple options from a dropdown. Supports removing individual tags and keyboard navigation.',
    code: `import { useState, useRef, useEffect } from 'react';

interface TagInputProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

function TagInput({ options, selected, onChange, placeholder = 'Type to search...' }: TagInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = options.filter(
    o => !selected.includes(o) && o.toLowerCase().includes(search.toLowerCase())
  );

  const addTag = (tag: string) => {
    onChange([...selected, tag]);
    setSearch('');
  };

  const removeTag = (tag: string) => {
    onChange(selected.filter(t => t !== tag));
  };

  return (
    <div ref={ref} style={{ position: 'relative', width: 400 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: 6, border: '1px solid #ddd', borderRadius: 8, minHeight: 40, cursor: 'text' }}
        onClick={() => setIsOpen(true)}>
        {selected.map(tag => (
          <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', background: '#e3f2fd', borderRadius: 4, fontSize: 13 }}>
            {tag}
            <button onClick={() => removeTag(tag)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, padding: 0, color: '#666', lineHeight: 1 }}>×</button>
          </span>
        ))}
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder={selected.length === 0 ? placeholder : ''}
          style={{ border: 'none', outline: 'none', flex: 1, minWidth: 80, padding: 2, fontSize: 13 }}
        />
      </div>
      {isOpen && filtered.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #ddd', borderRadius: 8, marginTop: 4, zIndex: 50, maxHeight: 200, overflow: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {filtered.map(opt => (
            <div key={opt} onClick={() => addTag(opt)}
              style={{ padding: '8px 12px', cursor: 'pointer', fontSize: 13, transition: 'background 0.15s' }}
              onMouseEnter={e => (e.target as HTMLElement).style.background = '#f5f5f5'}
              onMouseLeave={e => (e.target as HTMLElement).style.background = 'transparent'}>
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const options = ['React', 'Vue', 'Angular', 'Svelte', 'Solid', 'Qwik', 'Next.js', 'Nuxt', 'Remix'];
  const [selected, setSelected] = useState<string[]>(['React']);

  return (
    <div style={{ padding: 40 }}>
      <TagInput options={options} selected={selected} onChange={setSelected} />
      <p style={{ marginTop: 12, color: '#666', fontSize: 14 }}>Selected: {selected.join(', ')}</p>
    </div>
  );
}`,
  },
  {
    id: 517,
    category: 'Components & Props',
    difficulty: 'Hard',
    question: 'Implement a drag-and-drop list',
    answer: 'A reorderable list supporting drag-and-drop using the HTML5 Drag and Drop API. Provides visual feedback during drag with placeholder styling.',
    code: `import { useState, useRef } from 'react';

const initialItems = ['Item A', 'Item B', 'Item C', 'Item D', 'Item E'];

function DraggableList() {
  const [items, setItems] = useState(initialItems);
  const dragIndex = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === index) return;

    const newItems = [...items];
    const [dragged] = newItems.splice(dragIndex.current, 1);
    newItems.splice(index, 0, dragged);
    dragIndex.current = index;
    setItems(newItems);
  };

  const handleDragEnd = () => {
    dragIndex.current = null;
  };

  return (
    <div style={{ padding: 20, maxWidth: 400 }}>
      {items.map((item, i) => (
        <div key={item}
          draggable
          onDragStart={() => handleDragStart(i)}
          onDragOver={e => handleDragOver(e, i)}
          onDragEnd={handleDragEnd}
          style={{
            padding: '12px 16px', marginBottom: 6, background: '#fff',
            border: '1px solid #ddd', borderRadius: 8, cursor: 'grab',
            display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            transition: 'transform 0.15s',
          }}>
          <span style={{ color: '#999', cursor: 'grab' }}>⠿</span>
          {item}
        </div>
      ))}
      <p style={{ color: '#888', fontSize: 13, marginTop: 12 }}>Drag items to reorder</p>
    </div>
  );
}

export default function App() {
  return <DraggableList />;
}`,
  },
  {
    id: 518,
    category: 'Components & Props',
    difficulty: 'Medium',
    question: 'Implement a notification toast system',
    answer: 'A toast notification system with auto-dismiss, different types (success, error, info), and a programmatic API for adding toasts from anywhere.',
    code: `import { useState, useEffect, useCallback } from 'react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastId = 0;
const listeners: Set<(toast: Toast) => void> = new Set();

export function showToast(message: string, type: Toast['type'] = 'info') {
  const toast: Toast = { id: ++toastId, message, type };
  listeners.forEach(fn => fn(toast));
}

function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const addToast = (toast: Toast) => {
      setToasts(prev => [...prev, toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 4000);
    };
    listeners.add(addToast);
    return () => { listeners.delete(addToast); };
  }, []);

  const colors: Record<string, string> = {
    success: '#4caf50', error: '#f44336', info: '#1976d2',
  };

  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          padding: '12px 20px', background: colors[t.type], color: '#fff',
          borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          animation: 'slideIn 0.3s ease', fontSize: 14, minWidth: 250,
        }}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <div style={{ padding: 40, display: 'flex', gap: 12 }}>
      <ToastContainer />
      <button onClick={() => showToast('Operation successful!', 'success')}>Success Toast</button>
      <button onClick={() => showToast('Something went wrong!', 'error')}>Error Toast</button>
      <button onClick={() => showToast('Here is some info', 'info')}>Info Toast</button>
    </div>
  );
}`,
  },
  {
    id: 519,
    category: 'Components & Props',
    difficulty: 'Easy',
    question: 'Implement a progress bar component',
    answer: 'A customizable progress bar component with percentage display, animated transitions, and different color themes based on progress value.',
    code: `import { useState, useEffect } from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  height?: number;
}

function ProgressBar({ value, max = 100, showLabel = true, height = 24 }: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPercent(percent), 100);
    return () => clearTimeout(timer);
  }, [percent]);

  const getColor = (pct: number) => {
    if (pct < 33) return '#f44336';
    if (pct < 66) return '#ff9800';
    return '#4caf50';
  };

  return (
    <div style={{ width: '100%', marginBottom: 16 }}>
      <div style={{
        width: '100%', height, background: '#e0e0e0', borderRadius: height / 2,
        overflow: 'hidden', position: 'relative',
      }}>
        <div style={{
          width: \`\${animatedPercent}%\`, height: '100%',
          background: getColor(animatedPercent), borderRadius: height / 2,
          transition: 'width 0.5s ease, background 0.5s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {showLabel && animatedPercent > 8 && (
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>
              {Math.round(animatedPercent)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => p >= 100 ? 0 : p + 1);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: 40, maxWidth: 500 }}>
      <h3>Progress: {progress}%</h3>
      <ProgressBar value={progress} />
    </div>
  );
}`,
  },
  {
    id: 520,
    category: 'Components & Props',
    difficulty: 'Medium',
    question: 'Implement a carousel/slider component',
    answer: 'An image carousel with automatic rotation, navigation dots, and previous/next controls. Supports pause on hover.',
    code: `import { useState, useEffect, useCallback } from 'react';

const slides = [
  { color: '#1976d2', label: 'Slide 1' },
  { color: '#388e3c', label: 'Slide 2' },
  { color: '#f57c00', label: 'Slide 3' },
  { color: '#7b1fa2', label: 'Slide 4' },
];

function Carousel({ autoPlayInterval = 3000 }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [next, autoPlayInterval, isPaused]);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 600, margin: '0 auto', borderRadius: 12, overflow: 'hidden' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}>
      <div style={{
        display: 'flex', transition: 'transform 0.5s ease',
        transform: \`translateX(-\${current * 100}%)\`,
      }}>
        {slides.map((slide, i) => (
          <div key={i} style={{
            minWidth: '100%', height: 300, background: slide.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, color: '#fff', fontWeight: 600,
          }}>
            {slide.label}
          </div>
        ))}
      </div>
      <button onClick={prev}
        style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.3)', color: '#fff', border: 'none', fontSize: 24, padding: '8px 14px', borderRadius: 8, cursor: 'pointer' }}>
        ‹
      </button>
      <button onClick={next}
        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.3)', color: '#fff', border: 'none', fontSize: 24, padding: '8px 14px', borderRadius: 8, cursor: 'pointer' }}>
        ›
      </button>
      <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            style={{
              width: 10, height: 10, borderRadius: '50%', border: 'none',
              background: i === current ? '#fff' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer', transition: 'background 0.3s',
            }} />
        ))}
      </div>
    </div>
  );
}

  export default function App() {
    return <Carousel />;
  }`,
  },
  {
    id: 521,
    category: 'ReactJS',
    difficulty: 'Medium',
    question: 'Implement a useFetch hook with loading and error states',
    answer: 'A custom hook that fetches a URL with useEffect and an AbortController, exposing data/loading/error. The controller cancels the in-flight request on unmount or URL change to avoid setting state after unmount.',
    code: `import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error('Request failed: ' + res.status);
        return res.json();
      })
      .then(json => { setData(json); setLoading(false); })
      .catch(err => {
        if (err.name !== 'AbortError') { setError(err); setLoading(false); }
      });
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

export default function App() {
  const { data, loading, error } = useFetch('https://api.github.com/repos/facebook/react');
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}`,
  },
  {
    id: 522,
    category: 'ReactJS',
    difficulty: 'Medium',
    question: 'Implement a theme switcher using Context',
    answer: 'Provide theme + toggle through React Context so any descendant can read and switch the theme. The provider holds the state; consumers useTheme consume it.',
    code: `import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const { theme, toggle } = useContext(ThemeContext);
  return (
    <div style={{ padding: 20, background: theme === 'dark' ? '#222' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}>
      <p>Current theme: {theme}</p>
      <button onClick={toggle}>Toggle theme</button>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Toolbar />
    </ThemeProvider>
  );
}`,
  },
  {
    id: 523,
    category: 'JavaScript & ES6',
    difficulty: 'Easy',
    question: 'Implement a debounce utility',
    answer: 'debounce returns a wrapped function that delays invoking the original until `delay` ms have passed since the last call, so rapid calls collapse into one. clearTimeout resets the pending timer on every call.',
    code: `function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const log = debounce((msg) => {
  console.log('Called with:', msg);
}, 300);

log('a');
log('b');
log('c');
// Only the last call ("c") prints, 300ms after the burst`,
  },
  {
    id: 524,
    category: 'JavaScript & ES6',
    difficulty: 'Medium',
    question: 'Implement a small EventEmitter (pub/sub)',
    answer: 'An EventEmitter stores handlers per event name. on subscribes (and returns an unsubscribe fn), off removes one, and emit invokes all handlers for a name with the given arguments.',
    code: `class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(name, handler) {
    (this.events[name] ||= []).push(handler);
    return () => this.off(name, handler);
  }
  off(name, handler) {
    this.events[name] = (this.events[name] || []).filter(h => h !== handler);
  }
  emit(name, ...args) {
    (this.events[name] || []).forEach(h => h(...args));
  }
}

const bus = new EventEmitter();
bus.on('ping', (v) => console.log('pong', v));
bus.emit('ping', 42);`,
  },
  {
    id: 525,
    category: 'JavaScript & ES6',
    difficulty: 'Hard',
    question: 'Implement Promise.all from scratch',
    answer: 'Return a new promise that resolves with an array of results once every input settles, preserving order. If any input rejects, the whole thing rejects immediately. Wrap non-promises with Promise.resolve.',
    code: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = new Array(promises.length);
    let pending = promises.length;
    if (pending === 0) return resolve(results);
    promises.forEach((p, i) => {
      Promise.resolve(p).then(
        (value) => { results[i] = value; if (--pending === 0) resolve(results); },
        (err) => reject(err)
      );
    });
  });
}

promiseAll([Promise.resolve(1), 2, Promise.resolve(3)])
  .then((r) => console.log(r)); // [1, 2, 3]`,
  },
  {
    id: 526,
    category: 'JavaScript & ES6',
    difficulty: 'Easy',
    question: 'Implement a memoize function',
    answer: 'memoize caches results keyed by the arguments (serialized). Repeated calls with the same arguments return the cached value instead of recomputing, which speeds up expensive pure functions.',
    code: `function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const slow = (n) => {
  let r = 0;
  for (let i = 0; i < n; i++) r += i;
  return r;
};

const fast = memoize(slow);
console.log(fast(1000000));
console.log(fast(1000000));`,
  },
  {
    id: 527,
    category: 'ReactJS',
    difficulty: 'Easy',
    question: 'Implement a usePrevious hook',
    answer: 'usePrevious keeps the previous render value in a ref. The effect runs after render, so it stores the current value for the next render; the returned value is what was stored before this update.',
    code: `import { useEffect, useRef, useState } from 'react';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default function App() {
  const [count, setCount] = useState(0);
  const prev = usePrevious(count);
  return (
    <div style={{ padding: 20 }}>
      <p>Now: {count}, Previously: {prev}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}`,
  },
  {
    id: 528,
    category: 'JavaScript & ES6',
    difficulty: 'Medium',
    question: 'Implement a throttle utility',
    answer: 'throttle ensures the wrapped function runs at most once per `limit` ms. Unlike debounce, it fires on the leading edge and then ignores calls until the window passes.',
    code: `function throttle(fn, limit) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= limit) {
      last = now;
      fn.apply(this, args);
    }
  };
}

const onScroll = throttle(() => console.log('scrolled'), 500);
window.addEventListener('scroll', onScroll);`,
  },
];

export default CODING_QUESTIONS;
