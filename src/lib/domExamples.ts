// Template pool of DOM / BOM / Window (browser API) coding examples.
// Instantiated by buildDomApiCatalog(count) to produce many scenario
// variations, then merged into the questions feed by useQuestions.

import type { Question } from '../models/question'

type DomTemplate = Omit<Question, 'id'>

const DOM_TEMPLATES: DomTemplate[] = [
  {
    category: 'DOM & Web APIs',
    difficulty: 'Medium',
    question: 'Debounced search input with fetch and AbortController',
    answer: 'Attach a debounced input handler that cancels the previous in-flight request via AbortController before starting a new fetch, so only the latest keystroke query resolves.',
    code: `function debounce(fn, delay) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

let controller;
async function search(query) {
  const res = await fetch('https://api.github.com/search/users?q=' + encodeURIComponent(query), {
    signal: controller.signal,
  });
  const data = await res.json();
  return data.items.slice(0, 5).map(u => u.login);
}

const run = debounce(async (q) => {
  controller?.abort();
  controller = new AbortController();
  const users = await search(q);
  console.log('Results:', users);
}, 300);

document.getElementById('search').addEventListener('input', (e) => run(e.target.value));`,
  },
  {
    category: 'DOM & Web APIs',
    difficulty: 'Medium',
    question: 'Infinite scroll with IntersectionObserver',
    answer: 'Observe a sentinel element; when it scrolls into view, fetch the next page and append items. Guard against duplicate fetches with a loading flag.',
    code: `const sentinel = document.getElementById('sentinel');
let page = 0;
let loading = false;

const observer = new IntersectionObserver(async (entries) => {
  if (!entries[0].isIntersecting || loading) return;
  loading = true;
  page += 1;
  const res = await fetch('https://api.example.com/items?page=' + page);
  const items = await res.json();
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item.name;
    document.getElementById('list').appendChild(li);
  });
  loading = false;
});

observer.observe(sentinel);`,
  },
  {
    category: 'DOM & Web APIs',
    difficulty: 'Medium',
    question: 'Drag-and-drop file upload with FileReader',
    answer: 'Prevent default on dragover/drop, read dropped files via file.text(), and process their contents. Highlight the drop zone on dragover for feedback.',
    code: `const drop = document.getElementById('drop');
drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('over'); });
drop.addEventListener('dragleave', () => drop.classList.remove('over'));
drop.addEventListener('drop', async (e) => {
  e.preventDefault();
  drop.classList.remove('over');
  const files = [...e.dataTransfer.files];
  for (const file of files) {
    const text = await file.text();
    console.log(file.name, text.slice(0, 50));
  }
});`,
  },
  {
    category: 'DOM & Web APIs',
    difficulty: 'Medium',
    question: 'Theme switcher with matchMedia and localStorage',
    answer: 'Read the saved theme from localStorage, fall back to prefers-color-scheme via matchMedia, apply it to <html data-theme>, and react to OS and cross-tab changes.',
    code: `const stored = localStorage.getItem('theme');
const mq = window.matchMedia('(prefers-color-scheme: dark)');
const getTheme = () => stored || (mq.matches ? 'dark' : 'light');

function applyTheme() {
  document.documentElement.dataset.theme = getTheme();
}

mq.addEventListener('change', applyTheme);
window.addEventListener('storage', applyTheme);
applyTheme();`,
  },
  {
    category: 'DOM & Web APIs',
    difficulty: 'Medium',
    question: 'Copy to clipboard with a secure-context fallback',
    answer: 'Prefer navigator.clipboard.writeText when available and in a secure context; otherwise fall back to a hidden <textarea> + document.execCommand("copy").',
    code: `async function copy(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return 'copied via Clipboard API';
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  ta.remove();
  return 'copied via fallback';
}

document.getElementById('copy').addEventListener('click', async () => {
  console.log(await copy('hello'));
});`,
  },
  {
    category: 'DOM & Web APIs',
    difficulty: 'Medium',
    question: 'Lazy-load images with IntersectionObserver',
    answer: 'Hold the real URL in data-src and swap it into src only when the image scrolls into view, then unobserve so each image loads once.',
    code: `const io = new IntersectionObserver((entries, obs) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const img = entry.target;
    img.src = img.dataset.src;
    img.addEventListener('load', () => img.classList.add('loaded'));
    obs.unobserve(img);
  }
});

document.querySelectorAll('img[data-src]').forEach((img) => io.observe(img));`,
  },
  {
    category: 'DOM & Web APIs',
    difficulty: 'Medium',
    question: 'Track element size with ResizeObserver',
    answer: 'Observe a box and update a label with its contentRect width/height whenever the element is resized, without polling.',
    code: `const box = document.getElementById('box');
const label = document.getElementById('size');

const ro = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect;
    label.textContent = width.toFixed(0) + ' x ' + height.toFixed(0);
  }
});

ro.observe(box);`,
  },
  {
    category: 'DOM Advanced APIs',
    difficulty: 'Hard',
    question: 'Live log over a WebSocket connection',
    answer: 'Open a WebSocket, send messages on open/click, append incoming messages to the DOM, and handle error/close. Reconnect logic can be layered on top of the close handler.',
    code: `const ws = new WebSocket('wss://echo.websocket.events');
const log = document.getElementById('log');

ws.addEventListener('open', () => ws.send('hello'));
ws.addEventListener('message', (e) => {
  const line = document.createElement('div');
  line.textContent = '> ' + e.data;
  log.appendChild(line);
});
ws.addEventListener('error', () => console.error('socket error'));
ws.addEventListener('close', () => console.log('disconnected'));

document.getElementById('send').addEventListener('click', () => {
  ws.send('ping ' + Date.now());
});`,
  },
  {
    category: 'DOM Advanced APIs',
    difficulty: 'Hard',
    question: 'Canvas particle animation with requestAnimationFrame',
    answer: 'Maintain an array of particles with velocity, advance them each frame, bounce off the canvas edges, and redraw via requestAnimationFrame for a smooth loop.',
    code: `const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const dots = Array.from({ length: 60 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - 0.5) * 2,
  vy: (Math.random() - 0.5) * 2,
}));

function frame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const d of dots) {
    d.x += d.vx; d.y += d.vy;
    if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
    if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
    ctx.beginPath();
    ctx.arc(d.x, d.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(frame);
}

frame();`,
  },
  {
    category: 'DOM Advanced APIs',
    difficulty: 'Hard',
    question: 'Client-side SPA router with the History API',
    answer: 'Intercept link clicks, pushState the new path, render the matching view, and listen to popstate for back/forward. This is the core of history-based routing.',
    code: `const routes = {
  '/': () => '<h1>Home</h1>',
  '/about': () => '<h1>About</h1>',
};

function render() {
  const view = routes[location.pathname] || (() => '<h1>404</h1>');
  document.getElementById('app').innerHTML = view();
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[data-link]');
  if (!link) return;
  e.preventDefault();
  history.pushState(null, '', link.getAttribute('href'));
  render();
});

window.addEventListener('popstate', render);
render();`,
  },
  {
    category: 'DOM & Web APIs',
    difficulty: 'Medium',
    question: 'Watch geolocation position and stop on demand',
    answer: 'Use navigator.geolocation.watchPosition to stream coordinates, handle errors with high-accuracy options, and clearWatch from a button to stop tracking.',
    code: `const out = document.getElementById('out');
const id = navigator.geolocation.watchPosition(
  (pos) => {
    out.textContent = pos.coords.latitude.toFixed(4) + ', ' + pos.coords.longitude.toFixed(4);
  },
  (err) => console.error(err.message),
  { enableHighAccuracy: true, maximumAge: 10000 }
);

document.getElementById('stop').addEventListener('click', () => navigator.geolocation.clearWatch(id));`,
  },
  {
    category: 'DOM Advanced APIs',
    difficulty: 'Hard',
    question: 'Offload heavy computation to a Web Worker',
    answer: 'Create a worker from an inline Blob, post a large number to it, and receive the computed sum without blocking the main thread.',
    code: `const worker = new Worker(URL.createObjectURL(new Blob([\`
  onmessage = (e) => {
    let sum = 0;
    for (let i = 0; i < e.data; i++) sum += i;
    postMessage(sum);
  }
\`], { type: 'application/javascript' })));

worker.onmessage = (e) => console.log('result', e.data);
worker.postMessage(1e8);
console.log('computing off the main thread...');`,
  },
  {
    category: 'DOM Advanced APIs',
    difficulty: 'Hard',
    question: 'Persist data with IndexedDB (open, upgrade, add, read)',
    answer: 'Open a database, create an object store in onupgradeneeded, add a record on success, and read all records via a transaction. IndexedDB is the right store for structured client-side data.',
    code: `const db = indexedDB.open('AppDB', 1);
db.onupgradeneeded = (e) => {
  e.target.result.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
};
db.onsuccess = (e) => {
  const store = e.target.result.transaction('notes', 'readwrite').objectStore('notes');
  store.add({ text: 'Hello IndexedDB', done: false });
};
function getAll(cb) {
  const tx = db.result.transaction('notes').objectStore('notes').getAll();
  tx.onsuccess = () => cb(tx.result);
}`,
  },
  {
    category: 'DOM & Web APIs',
    difficulty: 'Medium',
    question: 'Smooth animation with the Web Animations API',
    answer: 'Drive animations declaratively with element.animate, returning a promise via finished so you can sequence or await them instead of hand-writing keyframes in CSS.',
    code: `const box = document.getElementById('box');
const anim = box.animate(
  [
    { transform: 'translateX(0)', opacity: 1 },
    { transform: 'translateX(200px)', opacity: 0.3 },
  ],
  { duration: 800, easing: 'ease-in-out', fill: 'forwards' }
);

anim.finished.then(() => console.log('animation done'));`,
  },
  {
    category: 'DOM & Web APIs',
    difficulty: 'Medium',
    question: 'Batch DOM reads/writes with requestAnimationFrame',
    answer: 'Avoid layout thrash by reading all sizes first, then writing in a single rAF callback. This pattern keeps reads and writes separated for performance.',
    code: `const items = [...document.querySelectorAll('.item')];
const heights = items.map((el) => el.getBoundingClientRect().height);

requestAnimationFrame(() => {
  items.forEach((el, i) => {
    el.style.height = heights[i] + 'px';
    el.classList.add('measured');
  });
});`,
  },
]

export function buildDomApiCatalog(count = DOM_TEMPLATES.length): Question[] {
  const out: Question[] = []
  for (let i = 0; i < count; i++) {
    const t = DOM_TEMPLATES[i % DOM_TEMPLATES.length]
    const variant = Math.floor(i / DOM_TEMPLATES.length) + 1
    out.push({ ...t, id: 0, question: `${t.question} — scenario ${variant}` })
  }
  return out
}
