import type { DSATestCase, DSARunResult } from '../data/dsaTypes'

let babel: typeof import('@babel/standalone') | null = null

async function transpileTypeScript(code: string): Promise<string> {
  if (!babel) {
    babel = await import('@babel/standalone')
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = (babel as any).transform(code, {
    filename: 'solution.ts',
    presets: ['typescript'],
  })
  return res.code || code
}

function buildWorkerScript(jsCode: string, functionName: string, testCases: DSATestCase[]): string {
  const testsJson = JSON.stringify(testCases)
  const fnNameJson = JSON.stringify(functionName)

  return `
  const __tests = ${testsJson};
  const __fnName = ${fnNameJson};
  const __logs = [];

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
    if (v instanceof Error) return v.message || String(v);
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  }

  function deepEqual(a, b) {
    if (a === b) return true;
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

    // If both are arrays of numbers or strings, compare sorted version
    if (Array.isArray(actual) && Array.isArray(expected) && actual.length === expected.length) {
      if (actual.every(x => typeof x === 'number') && expected.every(x => typeof x === 'number')) {
        const sA = [...actual].sort((x, y) => x - y);
        const sE = [...expected].sort((x, y) => x - y);
        if (deepEqual(sA, sE)) return true;
      }
      if (actual.every(x => typeof x === 'string') && expected.every(x => typeof x === 'string')) {
        const sA = [...actual].sort();
        const sE = [...expected].sort();
        if (deepEqual(sA, sE)) return true;
      }
    }

    return false;
  }

  try {
    // 1. Evaluate user code
    ${jsCode}

    // 2. Resolve user target function
    let targetFn;
    try {
      targetFn = eval(__fnName);
    } catch {
      targetFn = undefined;
    }

    if (typeof targetFn !== 'function') {
      throw new Error('Function "' + __fnName + '" is not defined. Please implement and export/declare function ' + __fnName + '(...).');
    }

    const results = [];
    let allPassed = true;
    let totalTime = 0;

    for (let i = 0; i < __tests.length; i++) {
      const tc = __tests[i];
      let args = [];
      try {
        const parsed = JSON.parse(tc.input);
        args = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        args = [tc.input];
      }

      let expected;
      try {
        expected = JSON.parse(tc.expectedOutput);
      } catch {
        expected = tc.expectedOutput;
      }

      const t0 = performance.now();
      let actual;
      let errStr;
      let passed = false;

      try {
        // Clone arguments so mutations don't corrupt unexpected things
        const clonedArgs = JSON.parse(JSON.stringify(args));
        actual = targetFn(...clonedArgs);
        passed = flexibleEqual(actual, expected);
      } catch (err) {
        errStr = err instanceof Error ? err.message : String(err);
        passed = false;
      }
      const t1 = performance.now();
      const elapsed = Math.max(0.1, Math.round((t1 - t0) * 10) / 10);
      totalTime += elapsed;

      if (!passed) {
        allPassed = false;
      }

      results.push({
        testCaseId: tc.id,
        passed,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: actual !== undefined ? JSON.stringify(actual) : undefined,
        error: errStr,
        runtimeMs: elapsed,
        isHidden: !!tc.isHidden
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
  `
}

export async function runDSACode(
  code: string,
  language: 'javascript' | 'typescript',
  functionName: string,
  testCases: DSATestCase[],
  timeoutMs = 4000
): Promise<DSARunResult> {
  // 1. Transpile TS if needed
  let executableCode = code
  if (language === 'typescript') {
    try {
      executableCode = await transpileTypeScript(code)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      return {
        success: false,
        status: 'Compile Error',
        passedCount: 0,
        totalCount: testCases.length,
        results: [],
        totalRuntimeMs: 0,
        consoleLogs: [],
        error: `TypeScript compilation error: ${msg}`,
      }
    }
  }

  return new Promise<DSARunResult>((resolve) => {
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
      const script = buildWorkerScript(executableCode, functionName, testCases)
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
