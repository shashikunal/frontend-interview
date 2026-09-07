import type { MCQuestion } from '../machineCodingQuestions';

export type MCLanguage = 'javascript' | 'react' | 'dom' | 'typescript' | 'leetcode';

export interface LanguageOption {
  id: MCLanguage;
  label: string;
  badge: string;
  icon: string;
  primaryFile: string;
  description: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    id: 'javascript',
    label: 'JavaScript',
    badge: 'Vanilla JS',
    icon: '🟨',
    primaryFile: 'script.js',
    description: 'Clean Vanilla JS + HTML & CSS without React dependencies',
  },
  {
    id: 'react',
    label: 'ReactJS',
    badge: 'React 19',
    icon: '⚛️',
    primaryFile: 'App.tsx',
    description: 'Modern React component with state hooks and JSX',
  },
  {
    id: 'dom',
    label: 'Vanilla DOM',
    badge: 'DOM APIs',
    icon: '🌐',
    primaryFile: 'index.html',
    description: 'Interactive HTML5 semantics, native DOM events & styles',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    badge: 'Typed JS',
    icon: '🔷',
    primaryFile: 'script.ts',
    description: 'Strict TypeScript interfaces, models, and typed DOM handlers',
  },
  {
    id: 'leetcode',
    label: 'Algorithms',
    badge: 'Algo / DS',
    icon: '💡',
    primaryFile: 'solution.js',
    description: 'Pure algorithmic data structures & functions with assertion tests',
  },
];

export function detectDefaultLanguage(_category?: string, _title?: string): MCLanguage {
  return 'react';
}

const DEFAULT_CSS = `/* Modern UI Stylesheet */
:root {
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --bg-surface: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border: #e2e8f0;
  --radius: 10px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-surface: #1e293b;
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --border: #334155;
  }
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text-main);
  background: transparent;
}

.container {
  padding: 1rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: inherit;
}

.card {
  max-width: 540px;
  margin: 0 auto;
  padding: 24px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

h2 {
  margin: 0 0 8px;
  font-size: 1.3rem;
  color: var(--text-main);
}

p.subtitle {
  margin: 0 0 20px;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.button-group {
  display: flex;
  gap: 10px;
  margin: 16px 0;
  flex-wrap: wrap;
}

button {
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--primary);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.15s ease;
}

button:hover {
  background: var(--primary-hover);
}

button.secondary {
  background: transparent;
  color: var(--text-main);
}

button.secondary:hover {
  background: rgba(148, 163, 184, 0.15);
}

input, select, textarea {
  width: 100%;
  padding: 8px 12px;
  font-size: 0.9rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg-surface);
  color: var(--text-main);
  margin-bottom: 12px;
}

.display-box {
  padding: 16px;
  border-radius: 8px;
  background: rgba(59, 130, 246, 0.08);
  border: 1px dashed var(--primary);
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 16px 0;
  color: var(--primary);
}

.item-list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
}

.item-list li {
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
`;

function getQuestionCleanTitle(title: string): string {
  return title.replace(/^[Q0-9\s\-:]+/i, '').trim();
}

/**
 * Builds tailored boilerplate files for a given language and challenge.
 */
export function buildStarterFilesForLanguage(
  question: MCQuestion,
  lang: MCLanguage
): Record<string, string> {
  const cleanTitle = getQuestionCleanTitle(question.title);
  const qId = question.id;
  const tLower = cleanTitle.toLowerCase();

  // 1. REACT MODE
  if (lang === 'react') {
    return {
      'App.tsx': question.starterCode || `import React from 'react';\n\nexport default function App() {\n  return <div className="container">${cleanTitle}</div>;\n}\n`,
      'styles.css': DEFAULT_CSS,
    };
  }

  // 2. LEETCODE / ALGORITHM MODE
  if (lang === 'leetcode') {
    const fnName = cleanTitle.replace(/[^a-zA-Z0-9]/g, ' ').split(' ').filter(Boolean).map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('') || 'solve';

    const solutionJs = `/**
 * [${qId}] ${cleanTitle}
 * Difficulty: ${question.difficulty} | Category: Algorithms & Data Structures
 *
 * Requirements:
${question.requirements.map(r => ` * - ${r}`).join('\n')}
 */

/**
 * Solution implementation for: ${cleanTitle}
 * @param {any} input
 * @returns {any}
 */
function ${fnName}(input) {
  // TODO: Implement optimal algorithm here
  console.log('Running ${fnName} with input:', input);
  return input;
}

// --- Test Assertions & Console Verification ---
console.log('--- Executing Test Cases for: ${cleanTitle} ---');
console.log('Result 1:', ${fnName}('sample test'));
console.log('Result 2:', ${fnName}(42));

// Export for sandbox test assertions
if (typeof module !== 'undefined') {
  module.exports = { ${fnName} };
}
`;
    return {
      'solution.js': solutionJs,
    };
  }

  // 3. TYPESCRIPT (VANILLA DOM + TS)
  if (lang === 'typescript') {
    const scriptTs = `/**
 * [${qId}] ${cleanTitle}
 * TypeScript Implementation (Vanilla DOM + Strict Types)
 */

interface State {
  status: 'idle' | 'running' | 'completed';
  value: number;
}

const state: State = {
  status: 'idle',
  value: 0,
};

const displayEl = document.getElementById('display') as HTMLDivElement | null;
const actionBtn = document.getElementById('action-btn') as HTMLButtonElement | null;
const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement | null;

function render(): void {
  if (displayEl) {
    displayEl.textContent = \`Status: \${state.status} | Value: \${state.value}\`;
  }
}

if (actionBtn) {
  actionBtn.addEventListener('click', () => {
    state.status = 'running';
    state.value += 1;
    console.log('[TS Update]', state);
    render();
  });
}

if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    state.status = 'idle';
    state.value = 0;
    console.log('[TS Reset]', state);
    render();
  });
}

// Initial render
render();
console.log('✓ TypeScript component initialized for: ${cleanTitle}');
`;

    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${cleanTitle}</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="card" id="app">
    <h2>${cleanTitle}</h2>
    <p class="subtitle">${question.summary || 'Implement typed logic using native DOM APIs.'}</p>
    
    <div id="display" class="display-box">Loading...</div>
    
    <div class="button-group">
      <button id="action-btn">Increment</button>
      <button id="reset-btn" class="secondary">Reset</button>
    </div>
  </div>
  <script type="module" src="script.ts"></script>
</body>
</html>
`;

    return {
      'script.ts': scriptTs,
      'index.html': indexHtml,
      'styles.css': DEFAULT_CSS,
    };
  }

  // 4. JAVASCRIPT & DOM MODES (Vanilla JS)
  // Let's generate specialized HTML + JS for common question archetypes:
  let customHtml = '';
  let customJs = '';

  if (tLower.includes('stopwatch') || tLower.includes('timer')) {
    customHtml = `<div class="card" id="stopwatch-container">
  <h2>${cleanTitle}</h2>
  <p class="subtitle">High-precision milliseconds tracker without interval drift.</p>

  <div id="display" class="display-box">00:00.00</div>

  <div class="button-group">
    <button id="start-btn">Start</button>
    <button id="pause-btn" class="secondary" disabled>Pause</button>
    <button id="lap-btn" class="secondary" disabled>Lap</button>
    <button id="reset-btn" class="secondary">Reset</button>
  </div>

  <ul id="lap-list" class="item-list"></ul>
</div>`;

    customJs = `// [${qId}] ${cleanTitle}
// Native Vanilla JavaScript Implementation

const display = document.getElementById('display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const lapBtn = document.getElementById('lap-btn');
const resetBtn = document.getElementById('reset-btn');
const lapList = document.getElementById('lap-list');

let startTime = 0;
let elapsedTime = 0;
let animFrameId = null;
let isRunning = false;
let laps = [];

function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const millis = Math.floor((ms % 1000) / 10);
  return \`\${String(minutes).padStart(2, '0')}:\${String(seconds).padStart(2, '0')}.\${String(millis).padStart(2, '0')}\`;
}

function updateDisplay() {
  const current = Date.now() - startTime;
  display.textContent = formatTime(current);
  animFrameId = requestAnimationFrame(updateDisplay);
}

startBtn.addEventListener('click', () => {
  if (!isRunning) {
    isRunning = true;
    startTime = Date.now() - elapsedTime;
    animFrameId = requestAnimationFrame(updateDisplay);
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    lapBtn.disabled = false;
    console.log('Stopwatch started at:', formatTime(elapsedTime));
  }
});

pauseBtn.addEventListener('click', () => {
  if (isRunning) {
    isRunning = false;
    cancelAnimationFrame(animFrameId);
    elapsedTime = Date.now() - startTime;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    lapBtn.disabled = true;
    console.log('Stopwatch paused at:', formatTime(elapsedTime));
  }
});

lapBtn.addEventListener('click', () => {
  if (isRunning) {
    const current = Date.now() - startTime;
    laps.push(current);
    const li = document.createElement('li');
    li.innerHTML = \`<span>Lap #\${laps.length}</span><strong>\${formatTime(current)}</strong>\`;
    lapList.prepend(li);
    console.log(\`Lap #\${laps.length} recorded:\`, formatTime(current));
  }
});

resetBtn.addEventListener('click', () => {
  isRunning = false;
  cancelAnimationFrame(animFrameId);
  elapsedTime = 0;
  laps = [];
  display.textContent = '00:00.00';
  lapList.innerHTML = '';
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  lapBtn.disabled = true;
  console.log('Stopwatch reset');
});
`;
  } else if (tLower.includes('counter')) {
    customHtml = `<div class="card" id="counter-app">
  <h2>${cleanTitle}</h2>
  <p class="subtitle">Interactive numeric counter with bounds and step increments.</p>

  <div id="counter-value" class="display-box">0</div>

  <div style="margin-bottom: 12px;">
    <label for="step-input" style="font-size: 0.85rem; color: var(--text-muted);">Step Size: </label>
    <input type="number" id="step-input" value="1" min="1" max="100" style="width: 80px; display: inline-block;" />
  </div>

  <div class="button-group">
    <button id="decrement-btn">- Decrement</button>
    <button id="increment-btn">+ Increment</button>
    <button id="reset-btn" class="secondary">Reset</button>
  </div>
</div>`;

    customJs = `// [${qId}] ${cleanTitle}
// Native Vanilla JavaScript Implementation

const display = document.getElementById('counter-value');
const stepInput = document.getElementById('step-input');
const incBtn = document.getElementById('increment-btn');
const decBtn = document.getElementById('decrement-btn');
const resetBtn = document.getElementById('reset-btn');

let count = 0;
const min = -20;
const max = 50;

function updateUI() {
  display.textContent = count;
  decBtn.disabled = count <= min;
  incBtn.disabled = count >= max;
  console.log('Count updated:', count);
}

incBtn.addEventListener('click', () => {
  const step = Number(stepInput.value) || 1;
  count = Math.min(max, count + step);
  updateUI();
});

decBtn.addEventListener('click', () => {
  const step = Number(stepInput.value) || 1;
  count = Math.max(min, count - step);
  updateUI();
});

resetBtn.addEventListener('click', () => {
  count = 0;
  updateUI();
});

// Initial load
updateUI();
`;
  } else if (tLower.includes('todo') || tLower.includes('task')) {
    customHtml = `<div class="card" id="todo-app">
  <h2>${cleanTitle}</h2>
  <p class="subtitle">${question.summary || 'Manage items with add, toggle, and filter operations.'}</p>

  <form id="todo-form" style="display: flex; gap: 8px; margin-bottom: 16px;">
    <input type="text" id="todo-input" placeholder="Add a new task..." required style="margin: 0;" />
    <button type="submit" style="white-space: nowrap;">Add Task</button>
  </form>

  <ul id="todo-list" class="item-list"></ul>
</div>`;

    customJs = `// [${qId}] ${cleanTitle}
// Native Vanilla JavaScript Implementation

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

let todos = [
  { id: 1, text: 'Review core specifications', completed: true },
  { id: 2, text: 'Implement vanilla JavaScript DOM handlers', completed: false },
];

function render() {
  list.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.innerHTML = \`
      <span style="cursor: pointer; \${todo.completed ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">
        \${todo.completed ? '✓' : '○'} \${todo.text}
      </span>
      <button class="secondary" style="padding: 2px 8px; font-size: 0.8rem;" data-id="\${todo.id}">Delete</button>
    \`;

    li.querySelector('span').addEventListener('click', () => {
      todo.completed = !todo.completed;
      render();
    });

    li.querySelector('button').addEventListener('click', () => {
      todos = todos.filter(t => t.id !== todo.id);
      render();
    });

    list.appendChild(li);
  });
  console.log('Todos rendered:', todos.length, 'items');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  todos.push({ id: Date.now(), text, completed: false });
  input.value = '';
  render();
});

render();
`;
  } else if (tLower.includes('toast') || tLower.includes('notification')) {
    customHtml = `<div class="card" id="toast-app">
  <h2>${cleanTitle}</h2>
  <p class="subtitle">Interactive Notification Queue with auto-dismiss and stacking.</p>

  <div class="button-group">
    <button id="toast-success-btn">Success Toast</button>
    <button id="toast-error-btn" style="background: #ef4444;">Error Toast</button>
    <button id="toast-info-btn" class="secondary">Info Toast</button>
    <button id="clear-toasts-btn" class="secondary">Clear All</button>
  </div>

  <div id="toast-status" style="margin-top: 8px; font-size: 0.85rem; color: var(--text-muted);">Active notifications: 0</div>
  <div id="toast-container" style="position: fixed; top: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; z-index: 9999; max-width: 340px;"></div>
</div>`;

    customJs = `// [${qId}] ${cleanTitle}
// Native Vanilla JavaScript Toast Queue Implementation

const container = document.getElementById('toast-container');
const statusEl = document.getElementById('toast-status');
const successBtn = document.getElementById('toast-success-btn');
const errorBtn = document.getElementById('toast-error-btn');
const infoBtn = document.getElementById('toast-info-btn');
const clearBtn = document.getElementById('clear-toasts-btn');

let toasts = [];

function updateStatus() {
  if (statusEl) statusEl.textContent = \`Active notifications: \${toasts.length}\`;
}

function showToast(message, type = 'success', duration = 3500) {
  const id = Date.now() + Math.random();
  const toast = document.createElement('div');
  const bg = type === 'error' ? '#ef4444' : (type === 'info' ? '#3b82f6' : '#10b981');
  const icon = type === 'error' ? '✕' : (type === 'info' ? 'ℹ' : '✓');

  toast.style.cssText = \`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    background: \${bg};
    color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-size: 0.9rem;
    animation: fadeIn 0.2s ease;
  \`;
  toast.innerHTML = \`
    <span><strong>\${icon}</strong> \${message}</span>
    <button class="secondary" style="background: transparent; border: none; color: white; cursor: pointer; font-size: 1.1rem; padding: 0 4px;">&times;</button>
  \`;

  const dismiss = () => {
    toast.remove();
    toasts = toasts.filter(t => t.id !== id);
    updateStatus();
  };

  toast.querySelector('button').addEventListener('click', dismiss);
  const timer = setTimeout(dismiss, duration);

  container.appendChild(toast);
  toasts.push({ id, timer });
  updateStatus();
  console.log(\`Toast triggered [\${type}]:\`, message);
}

successBtn?.addEventListener('click', () => showToast('Operation completed successfully!', 'success'));
errorBtn?.addEventListener('click', () => showToast('Something went wrong. Please try again.', 'error'));
infoBtn?.addEventListener('click', () => showToast('Here is an informational notification update.', 'info'));
clearBtn?.addEventListener('click', () => {
  toasts.forEach(t => clearTimeout(t.timer));
  container.innerHTML = '';
  toasts = [];
  updateStatus();
});

showToast('Toast Notification Queue initialized!', 'info');
`;
  } else if (tLower.includes('tooltip')) {
    customHtml = `<div class="card" id="tooltip-app">
  <h2>${cleanTitle}</h2>
  <p class="subtitle">Custom tooltip with hover delay, keyboard focus, and smart positioning.</p>

  <div style="display: flex; gap: 12px; justify-content: center; margin: 32px 0; flex-wrap: wrap;">
    <button class="tooltip-trigger" data-tooltip="Top tooltip with delayed hover" data-position="top">Hover Me (Top)</button>
    <button class="tooltip-trigger" data-tooltip="Bottom tooltip informational detail" data-position="bottom">Hover Me (Bottom)</button>
  </div>

  <div id="tooltip-log" style="text-align: center; font-size: 0.85rem; color: var(--text-muted);">Hover or focus any button above to preview tooltip</div>
  <div id="floating-tooltip" style="display: none; position: fixed; background: #0f172a; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; pointer-events: none; z-index: 9999; box-shadow: 0 4px 10px rgba(0,0,0,0.2);"></div>
</div>`;

    customJs = `// [${qId}] ${cleanTitle}
// Native Vanilla JavaScript Tooltip Implementation

const triggers = document.querySelectorAll('.tooltip-trigger');
const tooltip = document.getElementById('floating-tooltip');
const logEl = document.getElementById('tooltip-log');

let hideTimer = null;

triggers.forEach(btn => {
  const show = () => {
    clearTimeout(hideTimer);
    const text = btn.getAttribute('data-tooltip') || 'Tooltip message';
    const pos = btn.getAttribute('data-position') || 'top';
    const rect = btn.getBoundingClientRect();

    tooltip.textContent = text;
    tooltip.style.display = 'block';

    const ttRect = tooltip.getBoundingClientRect();
    let top = pos === 'top' ? rect.top - ttRect.height - 8 : rect.bottom + 8;
    let left = rect.left + (rect.width - ttRect.width) / 2;

    tooltip.style.top = \`\${Math.max(8, top)}px\`;
    tooltip.style.left = \`\${Math.max(8, left)}px\`;
    if (logEl) logEl.textContent = \`Tooltip visible: "\${text}" (\${pos})\`;
  };

  const hide = () => {
    hideTimer = setTimeout(() => {
      tooltip.style.display = 'none';
      if (logEl) logEl.textContent = 'Hover or focus any button above to preview tooltip';
    }, 150);
  };

  btn.addEventListener('mouseenter', show);
  btn.addEventListener('mouseleave', hide);
  btn.addEventListener('focus', show);
  btn.addEventListener('blur', hide);
});
`;
  } else if (tLower.includes('modal') || tLower.includes('dialog')) {
    customHtml = `<div class="card" id="modal-app">
  <h2>${cleanTitle}</h2>
  <p class="subtitle">Modal Dialog with Escape key dismiss, backdrop click, and focus management.</p>

  <div class="button-group">
    <button id="open-modal-btn">Open Modal Dialog</button>
  </div>
  <div id="modal-log" style="font-size: 0.85rem; color: var(--text-muted); margin-top: 8px;">Modal is currently closed.</div>

  <div id="modal-overlay" style="display: none; position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(2px); align-items: center; justify-content: center; z-index: 9999; padding: 20px;">
    <div id="modal-box" class="card" style="width: 100%; max-width: 440px; margin: 0; background: var(--bg-surface); position: relative;">
      <h3>Interactive Dialog</h3>
      <p style="color: var(--text-muted); font-size: 0.9rem; margin: 12px 0;">Press <kbd>Escape</kbd> or click the darkened backdrop outside to close.</p>
      <div class="button-group" style="justify-content: flex-end; margin-top: 16px;">
        <button id="modal-confirm-btn">Confirm Action</button>
        <button id="modal-close-btn" class="secondary">Cancel</button>
      </div>
    </div>
  </div>
</div>`;

    customJs = `// [${qId}] ${cleanTitle}
// Native Vanilla JavaScript Modal Implementation

const openBtn = document.getElementById('open-modal-btn');
const overlay = document.getElementById('modal-overlay');
const modalBox = document.getElementById('modal-box');
const closeBtn = document.getElementById('modal-close-btn');
const confirmBtn = document.getElementById('modal-confirm-btn');
const logEl = document.getElementById('modal-log');

function openModal() {
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  if (logEl) logEl.textContent = 'Modal is open. (Press ESC or click outside)';
  closeBtn?.focus();
}

function closeModal(reason = 'closed') {
  overlay.style.display = 'none';
  document.body.style.overflow = '';
  if (logEl) logEl.textContent = \`Modal \${reason} at \${new Date().toLocaleTimeString()}\`;
  openBtn?.focus();
}

openBtn?.addEventListener('click', openModal);
closeBtn?.addEventListener('click', () => closeModal('cancelled'));
confirmBtn?.addEventListener('click', () => closeModal('confirmed'));

overlay?.addEventListener('click', (e) => {
  if (e.target === overlay) {
    closeModal('dismissed via backdrop click');
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay.style.display === 'flex') {
    closeModal('dismissed via Escape key');
  }
});
`;
  } else if (tLower.includes('accordion') || tLower.includes('collapse')) {
    customHtml = `<div class="card" id="accordion-app">
  <h2>${cleanTitle}</h2>
  <p class="subtitle">Expandable accordion with single and multi-expand toggle support.</p>

  <div style="margin-bottom: 16px;">
    <label style="font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 6px;">
      <input type="checkbox" id="multi-expand-toggle" style="width: auto; margin: 0;" />
      Allow multiple sections open simultaneously
    </label>
  </div>

  <div id="accordion-container" style="display: flex; flex-direction: column; gap: 8px;">
    <div class="accordion-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
      <button class="accordion-header secondary" style="width: 100%; text-align: left; display: flex; justify-content: space-between; border-radius: 0; padding: 12px 16px;">
        <span>What is Machine Coding?</span>
        <span class="icon">▼</span>
      </button>
      <div class="accordion-body" style="padding: 12px 16px; border-top: 1px solid var(--border); display: none; font-size: 0.9rem;">
        A practical live coding assessment where candidates build end-to-end interactive UI components.
      </div>
    </div>

    <div class="accordion-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
      <button class="accordion-header secondary" style="width: 100%; text-align: left; display: flex; justify-content: space-between; border-radius: 0; padding: 12px 16px;">
        <span>Why Vanilla JavaScript?</span>
        <span class="icon">▼</span>
      </button>
      <div class="accordion-body" style="padding: 12px 16px; border-top: 1px solid var(--border); display: none; font-size: 0.9rem;">
        Mastery over the native DOM, event bubbling, and browser APIs demonstrates deep fundamental engineering skills.
      </div>
    </div>
  </div>
</div>`;

    customJs = `// [${qId}] ${cleanTitle}
// Native Vanilla JavaScript Accordion Implementation

const items = document.querySelectorAll('.accordion-item');
const multiToggle = document.getElementById('multi-expand-toggle');

items.forEach(item => {
  const header = item.querySelector('.accordion-header');
  const body = item.querySelector('.accordion-body');
  const icon = item.querySelector('.icon');

  header.addEventListener('click', () => {
    const isCurrentlyOpen = body.style.display === 'block';

    if (!multiToggle.checked && !isCurrentlyOpen) {
      items.forEach(other => {
        other.querySelector('.accordion-body').style.display = 'none';
        other.querySelector('.icon').textContent = '▼';
      });
    }

    body.style.display = isCurrentlyOpen ? 'none' : 'block';
    icon.textContent = isCurrentlyOpen ? '▼' : '▲';
  });
});
`;
  } else if (tLower.includes('carousel') || tLower.includes('slider')) {
    customHtml = `<div class="card" id="carousel-app">
  <h2>${cleanTitle}</h2>
  <p class="subtitle">Interactive slider with touch swipe, indicators, and auto-play controls.</p>

  <div id="slide-viewport" style="position: relative; overflow: hidden; border-radius: 8px; background: #0f172a; color: #fff; height: 180px; display: flex; align-items: center; justify-content: center; text-align: center; margin: 16px 0;">
    <div id="slide-content" style="padding: 24px;">
      <h3 id="slide-title" style="margin: 0 0 8px; color: #38bdf8;">Slide #1</h3>
      <p id="slide-desc" style="margin: 0; color: #cbd5e1; font-size: 0.9rem;">Interactive slide banner showcase</p>
    </div>
  </div>

  <div class="button-group" style="justify-content: space-between; align-items: center;">
    <button id="prev-slide-btn" class="secondary">◀ Previous</button>
    <div id="slide-dots" style="display: flex; gap: 6px;"></div>
    <button id="next-slide-btn">Next ▶</button>
  </div>
</div>`;

    customJs = `// [${qId}] ${cleanTitle}
// Native Vanilla JavaScript Carousel Implementation

const slides = [
  { title: 'Slide #1: System Architecture', desc: 'High performance DOM element recycling and virtualization.' },
  { title: 'Slide #2: Reactive Events', desc: 'Custom synthetic event pipelines and keyboard traversal.' },
  { title: 'Slide #3: State Synchronization', desc: 'Smooth cross-tab synchronization and offline persistence.' },
];

let currentIndex = 0;
const titleEl = document.getElementById('slide-title');
const descEl = document.getElementById('slide-desc');
const prevBtn = document.getElementById('prev-slide-btn');
const nextBtn = document.getElementById('next-slide-btn');
const dotsContainer = document.getElementById('slide-dots');

function updateSlide(index) {
  currentIndex = (index + slides.length) % slides.length;
  const slide = slides[currentIndex];
  titleEl.textContent = slide.title;
  descEl.textContent = slide.desc;
  renderDots();
}

function renderDots() {
  dotsContainer.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.style.cssText = \`width: 8px; height: 8px; border-radius: 50%; background: \${i === currentIndex ? 'var(--primary)' : '#94a3b8'}; cursor: pointer;\`;
    dot.addEventListener('click', () => updateSlide(i));
    dotsContainer.appendChild(dot);
  });
}

prevBtn.addEventListener('click', () => updateSlide(currentIndex - 1));
nextBtn.addEventListener('click', () => updateSlide(currentIndex + 1));

updateSlide(0);
`;
  } else if (tLower.includes('star') || tLower.includes('rating')) {
    customHtml = `<div class="card" id="rating-app">
  <h2>${cleanTitle}</h2>
  <p class="subtitle">Interactive Star Rating with hover preview, keyboard selection, and persistent score.</p>

  <div id="stars-container" style="display: flex; gap: 8px; font-size: 2.2rem; cursor: pointer; margin: 20px 0; justify-content: center; user-select: none;">
    <span class="star" data-value="1">★</span>
    <span class="star" data-value="2">★</span>
    <span class="star" data-value="3">★</span>
    <span class="star" data-value="4">★</span>
    <span class="star" data-value="5">★</span>
  </div>

  <div id="rating-display" class="display-box">0 / 5 Stars</div>

  <div class="button-group" style="justify-content: center;">
    <button id="reset-rating-btn" class="secondary">Reset Rating</button>
  </div>
</div>`;

    customJs = `// [${qId}] ${cleanTitle}
// Native Vanilla JavaScript Star Rating Implementation

const stars = document.querySelectorAll('.star');
const display = document.getElementById('rating-display');
const resetBtn = document.getElementById('reset-rating-btn');

let currentRating = 0;
let hoverRating = 0;

function render() {
  const activeScore = hoverRating || currentRating;
  stars.forEach((star, i) => {
    star.style.color = i < activeScore ? '#f59e0b' : '#cbd5e1';
    star.style.transform = i < activeScore ? 'scale(1.1)' : 'scale(1)';
    star.style.transition = 'all 0.15s ease';
  });
  display.textContent = \`\${currentRating} / 5 Stars\`;
}

stars.forEach(star => {
  const val = Number(star.getAttribute('data-value'));
  star.addEventListener('mouseenter', () => {
    hoverRating = val;
    render();
  });
  star.addEventListener('mouseleave', () => {
    hoverRating = 0;
    render();
  });
  star.addEventListener('click', () => {
    currentRating = val;
    render();
    console.log('Rated:', currentRating, 'stars');
  });
});

resetBtn?.addEventListener('click', () => {
  currentRating = 0;
  hoverRating = 0;
  render();
});

render();
`;
  } else if (tLower.includes('tab')) {
    customHtml = `<div class="card" id="tabs-app">
  <h2>${cleanTitle}</h2>
  <p class="subtitle">Accessible Tab navigation with keyboard arrow keys and dynamic panels.</p>

  <div class="button-group" style="border-bottom: 2px solid var(--border); padding-bottom: 8px; margin-bottom: 16px;">
    <button class="tab-btn" data-tab="overview">Overview</button>
    <button class="tab-btn secondary" data-tab="specs">Specs</button>
    <button class="tab-btn secondary" data-tab="activity">Live Feed</button>
  </div>

  <div id="tab-content" style="padding: 12px 0;">
    <div id="panel-overview">
      <h3 style="margin-top: 0;">System Overview</h3>
      <p style="color: var(--text-muted);">High performance client workspace engineered for modern frontend evaluations.</p>
    </div>
    <div id="panel-specs" style="display: none;">
      <h3 style="margin-top: 0;">Technical Specifications</h3>
      <p style="color: var(--text-muted);">Implements WAI-ARIA tab list specifications with smooth key navigation.</p>
    </div>
    <div id="panel-activity" style="display: none;">
      <h3 style="margin-top: 0;">Live Activity Stream</h3>
      <p style="color: var(--text-muted);">Real-time telemetry event updates.</p>
    </div>
  </div>
</div>`;

    customJs = `// [${qId}] ${cleanTitle}
// Native Vanilla JavaScript Accessible Tabs Implementation

const tabs = document.querySelectorAll('.tab-btn');
const panels = {
  overview: document.getElementById('panel-overview'),
  specs: document.getElementById('panel-specs'),
  activity: document.getElementById('panel-activity'),
};

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.getAttribute('data-tab');
    tabs.forEach(t => {
      if (t === tab) {
        t.classList.remove('secondary');
      } else {
        t.classList.add('secondary');
      }
    });

    Object.entries(panels).forEach(([key, panel]) => {
      if (panel) panel.style.display = key === target ? 'block' : 'none';
    });
    console.log('Switched to tab:', target);
  });
});
`;
  } else {
    // Universal Rich Dynamic Starter for any other challenge
    customHtml = `<div class="card" id="app">
  <h2>${cleanTitle}</h2>
  <p class="subtitle">${question.summary || 'Interactive machine coding challenge conforming to problem specifications.'}</p>

  <!-- Interactive Dynamic Display -->
  <div id="display-container" class="display-box">
    Status: Initialized
  </div>

  <div class="button-group">
    <button id="primary-action-btn">Trigger Action</button>
    <button id="secondary-action-btn" class="secondary">Toggle State</button>
    <button id="reset-action-btn" class="secondary">Reset</button>
  </div>

  <div style="background: rgba(148, 163, 184, 0.08); border: 1px solid var(--border); border-radius: 6px; padding: 12px; margin-top: 16px;">
    <div style="font-weight: 600; font-size: 0.85rem; margin-bottom: 4px;">Live Component Telemetry:</div>
    <div id="output-log" style="font-size: 0.85rem; color: var(--text-muted);">Event Count: 0 | Status: Ready</div>
  </div>
</div>`;

    customJs = `// [${qId}] ${cleanTitle}
// Native Vanilla JavaScript Implementation

/**
 * Challenge Key Requirements:
${question.requirements.map(r => ` * - ${r}`).join('\n')}
 */

// 1. DOM Element Selectors
const display = document.getElementById('display-container');
const primaryBtn = document.getElementById('primary-action-btn');
const secondaryBtn = document.getElementById('secondary-action-btn');
const resetBtn = document.getElementById('reset-action-btn');
const logEl = document.getElementById('output-log');

// 2. Application Reactive State
const state = {
  active: false,
  counter: 0,
  lastUpdated: null,
};

// 3. Render / DOM Updates
function render() {
  if (display) {
    display.textContent = state.active ? \`Active Mode (\${state.counter})\` : \`Standard Mode (\${state.counter})\`;
  }
  if (logEl) {
    const timeStr = state.lastUpdated ? new Date(state.lastUpdated).toLocaleTimeString() : 'None';
    logEl.textContent = \`Event Count: \${state.counter} | Mode: \${state.active ? 'Active' : 'Standard'} | Last updated: \${timeStr}\`;
  }
}

// 4. Event Handlers
primaryBtn?.addEventListener('click', () => {
  state.counter += 1;
  state.lastUpdated = Date.now();
  console.log('[Action Triggered]', state);
  render();
});

secondaryBtn?.addEventListener('click', () => {
  state.active = !state.active;
  state.counter += 1;
  state.lastUpdated = Date.now();
  console.log('[State Toggled]', state);
  render();
});

resetBtn?.addEventListener('click', () => {
  state.active = false;
  state.counter = 0;
  state.lastUpdated = Date.now();
  console.log('[Reset Triggered]', state);
  render();
});

// Initial Render
render();
console.log('✓ Initialized dynamic JavaScript workspace for: ${cleanTitle}');
`;
  }

  return {
    'script.js': customJs,
    'index.html': customHtml,
    'styles.css': DEFAULT_CSS,
  };
}

/**
 * Returns the reference solution code matching the candidate's active environment.
 */
export function getSolutionCodeForLanguage(
  question: MCQuestion,
  lang: MCLanguage
): string {
  if (lang === 'react') {
    return question.solutionCode;
  }
  const solFiles = buildStarterFilesForLanguage(question, lang);
  return solFiles['script.js'] || solFiles['solution.js'] || solFiles['script.ts'] || question.solutionCode;
}

/**
 * Returns the reference solution code for a specific file in the active language.
 */
export function getSolutionCodeForFile(
  question: MCQuestion,
  lang: MCLanguage,
  fileName: string
): string {
  if (lang === 'react') {
    return fileName === 'App.tsx' ? question.solutionCode : '';
  }
  const solFiles = buildStarterFilesForLanguage(question, lang);
  return solFiles[fileName] || '';
}

