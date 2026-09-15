import { JsRunner, buildReactSrcDoc, buildHtmlSrcDoc, isReactCode, type LogLevel } from '../../../lib/runner';

export interface PlaygroundLogItem {
  id: string;
  level: LogLevel;
  parts: string[];
  timestamp: number;
}

export interface PlaygroundRunResult {
  logs: PlaygroundLogItem[];
  executionTimeMs: number;
  error?: string;
  previewSrcDoc?: string;
  isVisual: boolean;
}

export interface RunPlaygroundOptions {
  onLog?: (log: PlaygroundLogItem) => void;
  timeoutMs?: number;
  companionHtml?: string;
  canvasTheme?: 'dark' | 'light';
}

let babelModule: typeof import('@babel/standalone') | null = null;

/**
 * Builds a sandboxed HTML5 document injecting user CSS and companion HTML elements.
 */
export function buildCssSrcDoc(
  cssCode: string,
  companionHtml?: string,
  runId: number = Date.now(),
  canvasTheme: 'dark' | 'light' = 'dark'
): string {
  const isDark = canvasTheme === 'dark';
  const htmlBody = companionHtml && companionHtml.trim() ? companionHtml : generateDefaultHtmlForCss(cssCode);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CSS Playground Sandbox</title>
  <style>
    /* Base Preview Reset & Canvas Environment */
    :root {
      --canvas-bg: ${isDark ? '#0b0f19' : '#f8fafc'};
      --canvas-surface: ${isDark ? '#131929' : '#ffffff'};
      --canvas-text: ${isDark ? '#ededf4' : '#1e293b'};
      --canvas-muted: ${isDark ? '#94a3b8' : '#64748b'};
      --canvas-border: ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'};
      --canvas-accent: #6366f1;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 24px;
      background-color: var(--canvas-bg);
      color: var(--canvas-text);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      min-height: 100vh;
      line-height: 1.5;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    /* Injected User CSS Rules */
    ${cssCode}
  </style>
  <script>
    window.__RUN_ID__ = ${runId};
    window.addEventListener('error', function(e) {
      window.parent.postMessage({ t: 'error', message: e.message || 'CSS/DOM runtime error' }, '*');
    });
    const _log = console.log;
    console.log = function(...args) {
      _log.apply(console, args);
      window.parent.postMessage({ t: 'log', level: 'log', parts: args.map(String) }, '*');
    };
  </script>
</head>
<body>
  ${htmlBody}
</body>
</html>`;
}

/**
 * Synthesizes appropriate companion HTML based on selectors discovered in the CSS snippet.
 */
export function generateDefaultHtmlForCss(cssCode: string): string {
  const lower = cssCode.toLowerCase();
  const hasCard = lower.includes('card');
  const hasGrid = lower.includes('grid');
  const hasFlex = lower.includes('flex');
  const hasNav = lower.includes('nav');

  if (hasNav) {
    return `<nav class="navbar nav">
  <div class="nav-brand">Platform Logo</div>
  <ul class="nav-links">
    <li class="nav-item"><a href="#" class="nav-link active">Home</a></li>
    <li class="nav-item"><a href="#" class="nav-link">Syllabus</a></li>
    <li class="nav-item"><a href="#" class="nav-link">Documentation</a></li>
  </ul>
</nav>
<main class="content" style="padding: 24px 0;">
  <h1>CSS Navigation Showcase</h1>
  <p>Your navigation and layout styles rendered live above.</p>
</main>`;
  }

  if (hasCard || hasGrid || hasFlex) {
    return `<div class="${hasGrid ? 'feature-grid grid' : hasFlex ? 'flex-container' : 'container'}">
  <div class="feature-card card">
    <h2 class="card-title">Interactive CSS Card</h2>
    <p class="card-desc">This live preview reflects your CSS rules in real time. Hover over elements, inspect box model dimensions, or test responsiveness.</p>
    <div class="card-actions">
      <button class="btn btn-primary button">Action 1</button>
      <button class="btn btn-secondary button">Action 2</button>
    </div>
  </div>
  <div class="feature-card card">
    <h2 class="card-title">Responsive Grid Item</h2>
    <p class="card-desc">Flexbox, CSS Grid, variables, transitions, and media queries are rendered natively by your browser engine.</p>
    <div class="card-actions">
      <button class="btn btn-primary button">Explore →</button>
    </div>
  </div>
</div>`;
  }

  return `<div class="container demo-wrapper">
  <header>
    <h1>CSS Syntax Demonstration</h1>
    <p class="lead">Styled with authentic live CSS rules from the editor.</p>
  </header>
  <section class="demo-section feature-card card">
    <h2 class="section-heading">Featured Component</h2>
    <p>This paragraph demonstrates font sizing, line height, letter spacing, colors, and margins.</p>
    <div class="component-box">
      <button class="btn button">Interactive Button</button>
    </div>
  </section>
</div>`;
}

/**
 * Strips ES module export / import syntax so snippets can run safely inside standard function body / eval environments.
 */
export function cleanModuleSyntax(rawCode: string): string {
  let cleaned = rawCode;
  // Replace import statements with comments so line positions remain consistent
  cleaned = cleaned.replace(/^\s*import\s+[^;\n]+;?/gm, '// [module import]');
  // Replace export default named functions/classes
  cleaned = cleaned.replace(/^\s*export\s+default\s+async\s+function\b/gm, 'async function');
  cleaned = cleaned.replace(/^\s*export\s+default\s+function\b/gm, 'function');
  cleaned = cleaned.replace(/^\s*export\s+default\s+class\b/gm, 'class');
  // Replace export default expressions (e.g. export default () => { ... } or export default 42;)
  cleaned = cleaned.replace(/^\s*export\s+default\s+/gm, 'const __defaultExport = ');
  // Replace export declarations: export const / let / var / function / async function / class
  cleaned = cleaned.replace(/^\s*export\s+(const|let|var|function|async\s+function|class)\b/gm, '$1');
  // Replace named export lists: export { a, b, c as d };
  cleaned = cleaned.replace(/^\s*export\s*\{[^}]*\}\s*;?/gm, '// [export statement]');
  // Replace re-exports: export * from '...';
  cleaned = cleaned.replace(/^\s*export\s*\*\s*from\s*['"][^'"]+['"]\s*;?/gm, '// [re-export]');
  return cleaned;
}

/**
 * Prepares JavaScript/TypeScript code for execution, transforming types via Babel if present
 * and stripping unsupported export syntax.
 */
export async function preprocessPlaygroundCode(rawCode: string, lang: string): Promise<string> {
  let code = cleanModuleSyntax(rawCode);

  const isTs =
    lang.includes('ts') ||
    lang.includes('typescript') ||
    /:\s*[A-Za-z0-9_<>[\]]+|interface\s+[A-Za-z0-9_]|type\s+[A-Za-z0-9_]/.test(code);

  if (isTs) {
    try {
      if (!babelModule) {
        babelModule = await import('@babel/standalone');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = (babelModule as any).transform(code, {
        filename: 'playground.ts',
        presets: ['typescript'],
      });
      if (res && res.code) {
        code = cleanModuleSyntax(res.code);
      }
    } catch {
      // Fallback to cleaned code if Babel fails
    }
  }

  return code;
}

/**
 * Sandboxed code executor for documentation playgrounds.
 * Supports vanilla JS/TS, React (JSX/TSX), and HTML snippets.
 */
export async function executePlayground(
  code: string,
  language: string = 'javascript',
  _options: RunPlaygroundOptions = {}
): Promise<PlaygroundRunResult> {
  const startTime = performance.now();
  const logs: PlaygroundLogItem[] = [];
  const normLang = language.toLowerCase();

  // 0. Detect CSS: explicit language css, scss, or less
  const isCss =
    normLang.includes('css') ||
    normLang === 'scss' ||
    normLang === 'less';

  if (isCss) {
    try {
      const runId = Date.now();
      const companionHtml = _options.companionHtml || generateDefaultHtmlForCss(code);
      const srcDoc = buildCssSrcDoc(code, companionHtml, runId, _options.canvasTheme || 'dark');
      return {
        logs: [
          {
            id: `log-${Date.now()}`,
            level: 'info',
            parts: ['🎨 Live CSS compiled and applied to preview DOM.'],
            timestamp: Date.now(),
          },
        ],
        executionTimeMs: Math.round(performance.now() - startTime),
        previewSrcDoc: srcDoc,
        isVisual: true,
      };
    } catch (err: any) {
      return {
        logs: [
          {
            id: `err-${Date.now()}`,
            level: 'error',
            parts: [err?.message || 'CSS compilation error'],
            timestamp: Date.now(),
          },
        ],
        executionTimeMs: Math.round(performance.now() - startTime),
        error: err?.message || 'CSS compilation failed',
        isVisual: true,
      };
    }
  }

  const trimmed = code.trim();

  // 1. Detect HTML: starts with <!DOCTYPE, <html, or contains standard HTML tags without React
  const isExplicitHtml =
    normLang.includes('html') ||
    /^<!doctype\s+html/i.test(trimmed) ||
    /^<html[\s>]/i.test(trimmed) ||
    (/^<(!DOCTYPE|html|head|body|div|p|span|section|main|h[1-6]|style|script|table|form|button|ul|ol|li)\b/i.test(trimmed) &&
      !/\bfrom\s+['"]react['"]|\bReact\b|\buseState\b|\buseEffect\b|\bclassName=/.test(code));

  // 2. Detect React JSX: explicit language or isReactCode and NOT explicit HTML
  const isReact =
    !isExplicitHtml &&
    (normLang.includes('react') || normLang.includes('jsx') || normLang.includes('tsx') || isReactCode(code));

  // 3. Fallback to HTML if not React but contains markup
  const isHtml = isExplicitHtml || (!isReact && trimmed.startsWith('<') && trimmed.includes('>'));

  if (isHtml) {
    try {
      const runId = Date.now();
      const srcDoc = buildHtmlSrcDoc(code, '', runId);
      return {
        logs: [
          {
            id: `log-${Date.now()}`,
            level: 'info',
            parts: ['🌐 Live HTML DOM preview rendered.'],
            timestamp: Date.now(),
          },
        ],
        executionTimeMs: Math.round(performance.now() - startTime),
        previewSrcDoc: srcDoc,
        isVisual: true,
      };
    } catch (err: any) {
      return {
        logs: [
          {
            id: `err-${Date.now()}`,
            level: 'error',
            parts: [err?.message || 'HTML rendering error'],
            timestamp: Date.now(),
          },
        ],
        executionTimeMs: Math.round(performance.now() - startTime),
        error: err?.message || 'HTML failed',
        isVisual: true,
      };
    }
  }

  if (isReact) {
    try {
      const runId = Date.now();
      const files: Record<string, string> = {
        'App.tsx': code,
      };
      const srcDoc = await buildReactSrcDoc(files, 'App.tsx', runId);
      return {
        logs: [
          {
            id: `log-${Date.now()}`,
            level: 'info',
            parts: ['⚡ React sandbox ready. Live DOM rendered in preview tab.'],
            timestamp: Date.now(),
          },
        ],
        executionTimeMs: Math.round(performance.now() - startTime),
        previewSrcDoc: srcDoc,
        isVisual: true,
      };
    } catch (err: any) {
      return {
        logs: [
          {
            id: `err-${Date.now()}`,
            level: 'error',
            parts: [err?.message || 'Babel compilation error'],
            timestamp: Date.now(),
          },
        ],
        executionTimeMs: Math.round(performance.now() - startTime),
        error: err?.message || 'Compilation failed',
        isVisual: true,
      };
    }
  }

  // Standard JavaScript / TypeScript Web Worker Sandbox Execution
  const executableCode = await preprocessPlaygroundCode(code, language);

  return new Promise<PlaygroundRunResult>((resolve) => {
    const runner = new JsRunner();
    let isSettled = false;

    const timer = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        runner.stop();
        resolve({
          logs: [
            ...logs,
            {
              id: `timeout-${Date.now()}`,
              level: 'error',
              parts: ['⏱️ Execution Timed Out (> 3000ms). Possible infinite loop detected.'],
              timestamp: Date.now(),
            },
          ],
          executionTimeMs: 3000,
          error: 'Execution timed out',
          isVisual: false,
        });
      }
    }, 3500);

    runner.run(
      {},
      executableCode,
      {
        onLog: (level: LogLevel, parts: string[]) => {
          const item: PlaygroundLogItem = {
            id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            level,
            parts,
            timestamp: Date.now(),
          };
          logs.push(item);
        },
        onFiles: () => {},
        onDone: (ms: number) => {
          if (!isSettled) {
            isSettled = true;
            clearTimeout(timer);
            runner.stop();
            resolve({
              logs: logs.length > 0 ? logs : [
                {
                  id: `done-${Date.now()}`,
                  level: 'info',
                  parts: ['✓ Code executed successfully (no console output)'],
                  timestamp: Date.now(),
                },
              ],
              executionTimeMs: ms || Math.round(performance.now() - startTime),
              isVisual: false,
            });
          }
        },
        onError: (message: string) => {
          if (!isSettled) {
            isSettled = true;
            clearTimeout(timer);
            runner.stop();
            resolve({
              logs: [
                ...logs,
                {
                  id: `err-${Date.now()}`,
                  level: 'error',
                  parts: [message],
                  timestamp: Date.now(),
                },
              ],
              executionTimeMs: Math.round(performance.now() - startTime),
              error: message,
              isVisual: false,
            });
          }
        },
      }
    );
  });
}
