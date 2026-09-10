// src/components/coreprogramming/lib/coreProgrammingRunner.ts
import type { CoreProgrammingTestCase, CoreProgrammingRunResult } from '../data/coreProgrammingTypes';

function buildWorkerScript(jsCode: string, functionName: string, testCases: CoreProgrammingTestCase[]): string {
  const testsJson = JSON.stringify(testCases);
  const fnNameJson = JSON.stringify(functionName);

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

    // Type matches
    if (expected === 'function' && typeof actual === 'function') return true;
    if (expected === 'object' && actual !== null && typeof actual === 'object') return true;

    // Both arrays
    if (Array.isArray(actual) && Array.isArray(expected) && actual.length === expected.length) {
      if (deepEqual(actual, expected)) return true;
    }

    // Floating point tolerance
    if (typeof actual === 'number' && typeof expected === 'number') {
      if (Math.abs(actual - expected) < 1e-6) return true;
    }

    // String comparison fallback (e.g. JSON stringified values)
    if (String(actual) === String(expected)) return true;

    return false;
  }

  function safeClone(item) {
    if (typeof item === 'function') return item;
    if (item === null || typeof item !== 'object') return item;
    if (item instanceof RegExp || item instanceof Date || item instanceof Error || item instanceof Promise) return item;
    if (typeof item.then === 'function') return item;
    if (typeof item[Symbol.asyncIterator] === 'function') return item;
    if (typeof item[Symbol.iterator] === 'function' && !Array.isArray(item)) return item;
    if (item.constructor && item.constructor.prototype === item) return item;
    if (Array.isArray(item)) return item.map(safeClone);
    const copy = Object.create(Object.getPrototypeOf(item));
    for (const k of Object.keys(item)) {
      copy[k] = safeClone(item[k]);
    }
    return copy;
  }

  async function runAll() {
    try {
      // 1. Execute user script
      ${jsCode}

      // 2. Resolve target function
      let targetFn;
      try {
        targetFn = eval(__fnName);
      } catch {
        targetFn = undefined;
      }

      if (typeof targetFn !== 'function') {
        throw new Error('Target function "' + __fnName + '" is not defined. Please implement and export/define function ' + __fnName + '(...).');
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
          // Clone args to prevent cross-test mutations
          let clonedArgs;
          try {
            clonedArgs = safeClone(args);
          } catch {
            clonedArgs = args;
          }

          let rawReturn;
          const lastItem = clonedArgs[clonedArgs.length - 1];
          const isMethodSequence =
            clonedArgs.length >= 1 &&
            Array.isArray(lastItem) &&
            lastItem.length > 0 &&
            Array.isArray(lastItem[0]) &&
            typeof lastItem[0][0] === 'string';

          const lastArg = lastItem;
          const isCallSequence = Array.isArray(lastItem) && lastItem.length > 0 && lastItem.every(c => Array.isArray(c));

          if (isMethodSequence) {
            let initArgs;
            if (clonedArgs.length === 2) {
              initArgs = Array.isArray(clonedArgs[0]) ? clonedArgs[0] : [clonedArgs[0]];
            } else {
              initArgs = clonedArgs.slice(0, -1);
            }
            let instance;
            try {
              instance = new targetFn(...initArgs);
            } catch {
              instance = targetFn(...initArgs);
            }
            if (instance && (typeof instance === 'object' || typeof instance === 'function')) {
              if (Array.isArray(expected) && expected.length === lastItem.length) {
                rawReturn = lastItem.map(([method, ...mArgs]) => {
                  if (typeof instance[method] === 'function') {
                    return instance[method](...mArgs);
                  }
                  if (typeof instance === 'function' && (method === '' || method === targetFn.name || method === 'spy')) {
                    return instance(...mArgs);
                  }
                  return instance[method];
                });
              } else {
                let last;
                for (const [method, ...mArgs] of lastItem) {
                  if (typeof instance[method] === 'function') {
                    last = instance[method](...mArgs);
                  } else if (typeof instance === 'function' && (method === '' || method === targetFn.name || method === 'spy')) {
                    last = instance(...mArgs);
                  } else {
                    last = instance[method];
                  }
                }
                rawReturn = last;
              }
            } else {
              rawReturn = instance;
            }
          } else {
            let directRes;
            let directSuccess = false;
            try {
              directRes = targetFn(...clonedArgs);
              directSuccess = true;
            } catch {}

            if (directSuccess && typeof directRes !== 'function') {
              rawReturn = directRes;
            } else if (clonedArgs.length >= 2 && isCallSequence) {
              const leadingArgs = clonedArgs.slice(0, -1);
              let cur;
              if (leadingArgs.length === 1 && Array.isArray(leadingArgs[0]) && targetFn.length === 0) {
                cur = targetFn(...leadingArgs[0]);
              } else {
                cur = targetFn(...leadingArgs);
              }

              if (typeof cur === 'function') {
                let firstRes;
                try {
                  firstRes = cur(...lastArg[0]);
                } catch {
                  firstRes = undefined;
                }

                if (typeof firstRes === 'function') {
                  let ch = firstRes;
                  for (let k = 1; k < lastArg.length; k++) {
                    if (typeof ch === 'function') {
                      ch = ch(...lastArg[k]);
                    }
                  }
                  rawReturn = ch;
                } else {
                  if (Array.isArray(expected) && expected.length === lastArg.length) {
                    rawReturn = [firstRes, ...lastArg.slice(1).map(c => cur(...c))];
                  } else {
                    rawReturn = firstRes;
                  }
                }
              } else {
                rawReturn = cur;
              }
            } else if (directSuccess) {
              rawReturn = directRes;
            } else {
              rawReturn = targetFn(...clonedArgs);
            }
          }
          actual = rawReturn instanceof Promise || (rawReturn && typeof rawReturn.then === 'function') ? await rawReturn : rawReturn;
          if (Array.isArray(actual) && actual.some(r => r instanceof Promise || (r && typeof r?.then === 'function'))) {
            actual = await Promise.all(actual);
          }
          if (actual && typeof actual[Symbol.asyncIterator] === 'function') {
            const collected = [];
            for await (const item of actual) {
              collected.push(item);
            }
            actual = collected;
          }
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
  `;
}

export async function runCoreProgrammingCode(
  code: string,
  functionName: string,
  testCases: CoreProgrammingTestCase[],
  timeoutMs = 4000
): Promise<CoreProgrammingRunResult> {
  return new Promise<CoreProgrammingRunResult>((resolve) => {
    let worker: Worker | null = null;
    let objectUrl: string | null = null;
    let timer: number | null = null;

    const cleanup = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (worker) {
        worker.terminate();
        worker = null;
      }
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        objectUrl = null;
      }
    };

    try {
      const script = buildWorkerScript(code, functionName, testCases);
      const blob = new Blob([script], { type: 'application/javascript' });
      objectUrl = URL.createObjectURL(blob);
      worker = new Worker(objectUrl);

      timer = window.setTimeout(() => {
        cleanup();
        resolve({
          success: false,
          status: 'Time Limit Exceeded',
          passedCount: 0,
          totalCount: testCases.length,
          results: [],
          totalRuntimeMs: timeoutMs,
          consoleLogs: [],
          error: `Execution timed out (> ${timeoutMs}ms). Possible infinite loop or slow recursive algorithm.`,
        });
      }, timeoutMs);

      worker.onmessage = (e: MessageEvent) => {
        const { type, payload } = e.data;
        cleanup();

        if (type === 'COMPLETE') {
          resolve(payload);
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
          });
        }
      };

      worker.onerror = (err: ErrorEvent) => {
        cleanup();
        resolve({
          success: false,
          status: 'Runtime Error',
          passedCount: 0,
          totalCount: testCases.length,
          results: [],
          totalRuntimeMs: 0,
          consoleLogs: [],
          error: err.message || 'Worker thread error executing solution',
        });
      };
    } catch (err: unknown) {
      cleanup();
      const msg = err instanceof Error ? err.message : String(err);
      resolve({
        success: false,
        status: 'Runtime Error',
        passedCount: 0,
        totalCount: testCases.length,
        results: [],
        totalRuntimeMs: 0,
        consoleLogs: [],
        error: msg,
      });
    }
  });
}
