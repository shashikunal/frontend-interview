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

  // Detect if code is React JSX or HTML
  const isReact = normLang.includes('react') || normLang.includes('jsx') || normLang.includes('tsx') || isReactCode(code);
  const isHtml = normLang.includes('html') || (code.trim().startsWith('<') && code.includes('</'));

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

  if (isHtml) {
    try {
      const runId = Date.now();
      const srcDoc = buildHtmlSrcDoc(code, '', runId);
      return {
        logs: [
          {
            id: `log-${Date.now()}`,
            level: 'info',
            parts: ['🌐 HTML DOM preview rendered.'],
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

  // Standard JavaScript / TypeScript Web Worker Sandbox Execution
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
      code,
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
