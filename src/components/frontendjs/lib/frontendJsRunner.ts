// src/components/frontendjs/lib/frontendJsRunner.ts
import type { FrontendJsTestCase, FrontendJsRunResult } from '../data/frontendJsTypes'

function buildWorkerScript(jsCode: string, functionName: string, testCases: FrontendJsTestCase[]): string {
  const testsJson = JSON.stringify(testCases)
  const fnNameJson = JSON.stringify(functionName)

  return `
  const __tests = ${testsJson};
  const __fnName = ${fnNameJson};
  const __logs = [];

  // Sandbox console
  const console = {
    log: (...args) => __logs.push({ level: 'log', message: args.map(formatVal).join(' ') }),
    info: (...args) => __logs.push({ level: 'info', message: args.map(formatVal).join(' ') }),
    warn: (...args) => __logs.push({ level: 'warn', message: args.map(formatVal).join(' ') }),
    error: (...args) => __logs.push({ level: 'error', message: args.map(formatVal).join(' ') }),
  };

  function formatVal(v) {
    if (typeof v === 'string') return v;
    if (v === undefined) return 'undefined';
    if (v === null) return 'null';
    if (typeof v === 'function') return '[Function: ' + (v.name || 'anonymous') + ']';
    if (v instanceof Error) return v.message || String(v);
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  }

  function deepEqual(a, b) {
    if (a === b) return true;
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;

    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i])) return false;
      }
      return true;
    }

    if (Array.isArray(a) !== Array.isArray(b)) return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }

  function flexibleEqual(actual, expected) {
    if (deepEqual(actual, expected)) return true;

    // Check if expected is string "function" and actual is function
    if (expected === 'function' && typeof actual === 'function') return true;
    if (expected === 'object' && actual !== null && typeof actual === 'object') return true;

    // If both are arrays, check if equal
    if (Array.isArray(actual) && Array.isArray(expected) && actual.length === expected.length) {
      if (deepEqual(actual, expected)) return true;
    }

    // Number conversion check (e.g. 1.01 vs 1.01)
    if (typeof actual === 'number' && typeof expected === 'number') {
      if (Math.abs(actual - expected) < 1e-6) return true;
    }

    return false;
  }

  async function runAll() {
    try {
      // 1. Evaluate candidate code
      ${jsCode}

      // 2. Resolve target function
      let targetFn;
      try {
        targetFn = eval(__fnName);
      } catch {
        targetFn = undefined;
      }

      if (typeof targetFn !== 'function') {
        throw new Error('Target function "' + __fnName + '" is not defined. Please implement and define function ' + __fnName + '(...).');
      }

      const results = [];
      let allPassed = true;
      let totalTime = 0;

      for (let i = 0; i < __tests.length; i++) {
        const tc = __tests[i];
        let args = [];
        try {
          const evaled = (new Function('return ' + tc.input))();
          args = Array.isArray(evaled) ? evaled : [evaled];
        } catch {
          try {
            const parsed = JSON.parse(tc.input);
            args = Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            args = [tc.input];
          }
        }

        let expected;
        try {
          expected = (new Function('return ' + tc.expectedOutput))();
        } catch {
          try {
            expected = JSON.parse(tc.expectedOutput);
          } catch {
            expected = tc.expectedOutput;
          }
        }

        const t0 = performance.now();
        let actual;
        let errStr;
        let passed = false;

        try {
          // Clone args to avoid mutations
          let clonedArgs;
          try {
            clonedArgs = JSON.parse(JSON.stringify(args));
          } catch {
            clonedArgs = args;
          }

          const rawReturn = targetFn(...clonedArgs);
          actual = rawReturn instanceof Promise ? await rawReturn : rawReturn;
          passed = flexibleEqual(actual, expected);
        } catch (err) {
          errStr = err instanceof Error ? err.message : String(err);
          passed = false;
        }

        const t1 = performance.now();
        const elapsed = Math.max(0.1, Math.round((t1 - t0) * 10) / 10);
        totalTime += elapsed;

        if (!passed) allPassed = false;

        results.push({
          testCaseId: tc.id,
          passed,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: actual !== undefined ? formatVal(actual) : undefined,
          error: errStr,
          runtimeMs: elapsed,
          isHidden: !!tc.isHidden,
          description: tc.description
        });
      }

      postMessage({
        type: 'COMPLETE',
        payload: {
          success: allPassed,
          status: allPassed ? 'Accepted' : 'Wrong Answer',
          passedCount: results.filter(r => r.passed).length,
          totalCount: results.length,
          results,
          totalRuntimeMs: Math.round(totalTime * 10) / 10,
          consoleLogs: __logs
        }
      });
    } catch (globalErr) {
      postMessage({
        type: 'ERROR',
        payload: {
          error: globalErr instanceof Error ? globalErr.message : String(globalErr),
          consoleLogs: __logs
        }
      });
    }
  }

  runAll();
  `
}

export async function runFrontendJsCode(
  code: string,
  functionName: string,
  testCases: FrontendJsTestCase[],
  timeoutMs = 4000
): Promise<FrontendJsRunResult> {
  return new Promise<FrontendJsRunResult>((resolve) => {
    let worker: Worker | null = null
    let objectUrl: string | null = null
    let timer: number | null = null

    const cleanup = () => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      if (worker) {
        worker.terminate()
        worker = null
      }
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
        objectUrl = null
      }
    }

    try {
      const script = buildWorkerScript(code, functionName, testCases)
      const blob = new Blob([script], { type: 'application/javascript' })
      objectUrl = URL.createObjectURL(blob)
      worker = new Worker(objectUrl)

      timer = window.setTimeout(() => {
        cleanup()
        resolve({
          success: false,
          status: 'Time Limit Exceeded',
          passedCount: 0,
          totalCount: testCases.length,
          results: [],
          totalRuntimeMs: timeoutMs,
          consoleLogs: [],
          error: `Execution timed out (> ${timeoutMs}ms). Possible infinite loop or slow recursive solution.`,
        })
      }, timeoutMs)

      worker.onmessage = (e: MessageEvent) => {
        const { type, payload } = e.data
        cleanup()

        if (type === 'COMPLETE') {
          resolve(payload)
        } else if (type === 'ERROR') {
          resolve({
            success: false,
            status: 'Runtime Error',
            passedCount: 0,
            totalCount: testCases.length,
            results: [],
            totalRuntimeMs: 0,
            consoleLogs: payload.consoleLogs || [],
            error: payload.error || 'Unknown runtime error occurred',
          })
        }
      }

      worker.onerror = (err: ErrorEvent) => {
        cleanup()
        resolve({
          success: false,
          status: 'Runtime Error',
          passedCount: 0,
          totalCount: testCases.length,
          results: [],
          totalRuntimeMs: 0,
          consoleLogs: [],
          error: err.message || 'Worker thread error executing solution',
        })
      }
    } catch (err: unknown) {
      cleanup()
      const msg = err instanceof Error ? err.message : String(err)
      resolve({
        success: false,
        status: 'Runtime Error',
        passedCount: 0,
        totalCount: testCases.length,
        results: [],
        totalRuntimeMs: 0,
        consoleLogs: [],
        error: msg,
      })
    }
  })
}
