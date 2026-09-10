// scripts/verifyCoreBatch.ts
import type { CoreProgrammingQuestion } from '../src/components/coreprogramming/data/coreProgrammingTypes';

if (typeof process !== 'undefined' && process.on) {
  process.on('unhandledRejection', () => {});
}

function deepEqual(a: any, b: any): boolean {
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

function flexibleEqual(actual: any, expected: any): boolean {
  if (deepEqual(actual, expected)) return true;
  if (expected === 'function' && typeof actual === 'function') return true;
  if (expected === 'object' && actual !== null && typeof actual === 'object') return true;
  if (typeof actual === 'number' && typeof expected === 'number') {
    if (Math.abs(actual - expected) < 1e-6) return true;
  }
  if (String(actual) === String(expected)) return true;
  return false;
}

export async function testQuestion(q: CoreProgrammingQuestion): Promise<{ passed: boolean; error?: string }> {
  // 1. Evaluate solution
  let fn: Function;
  try {
    const sandbox = new Function(`${q.solution}; return ${q.functionName};`);
    fn = sandbox();
  } catch (err: any) {
    return { passed: false, error: `Compilation error: ${err.message}` };
  }

  if (typeof fn !== 'function') {
    return { passed: false, error: `Solution did not produce function named ${q.functionName}` };
  }

  (globalThis as any)[q.functionName] = fn;

  try {
    const allTests = [...(q.testCases || []), ...(q.hiddenTestCases || [])];
    for (let i = 0; i < allTests.length; i++) {
      const tc = allTests[i];
      let args: any[];
      try {
        const evaled = new Function('return ' + tc.input)();
        args = Array.isArray(evaled) ? evaled : [evaled];
      } catch (e: any) {
        return { passed: false, error: `Test ${tc.id}: failed to parse input: ${tc.input}` };
      }

      let expected: any;
      try {
        expected = new Function('return ' + tc.expectedOutput)();
      } catch {
        expected = tc.expectedOutput;
      }

      function safeClone(item: any): any {
        if (typeof item === 'function') return item;
        if (item === null || typeof item !== 'object') return item;
        if (item instanceof RegExp || item instanceof Date || item instanceof Error || item instanceof Promise) return item;
        if (typeof item.then === 'function') return item;
        if (typeof item[Symbol.asyncIterator] === 'function') return item;
        if (typeof item[Symbol.iterator] === 'function' && !Array.isArray(item)) return item;
        if (item.constructor && item.constructor.prototype === item) return item;
        if (Array.isArray(item)) return item.map(safeClone);
        const copy: Record<string, any> = Object.create(Object.getPrototypeOf(item));
        for (const k of Object.keys(item)) {
          copy[k] = safeClone(item[k]);
        }
        return copy;
      }

      try {
        const clonedArgs = safeClone(args);
        let rawRes: any;
        const lastItem = clonedArgs[clonedArgs.length - 1];
        const isFactory = q.functionName.startsWith('create') || q.functionName.startsWith('fluent') || q.functionName === 'singleton';
        const isMethodSequence =
          isFactory &&
          clonedArgs.length >= 1 &&
          Array.isArray(lastItem) &&
          lastItem.length > 0 &&
          Array.isArray(lastItem[0]) &&
          typeof lastItem[0][0] === 'string';

      const lastArg = lastItem;
      const isCallSequence = Array.isArray(lastItem) && lastItem.length > 0 && lastItem.every((c: any) => Array.isArray(c));

      if (isMethodSequence) {
        let initArgs: any[];
        if (clonedArgs.length === 2) {
          initArgs = Array.isArray(clonedArgs[0]) ? clonedArgs[0] : [clonedArgs[0]];
        } else {
          initArgs = clonedArgs.slice(0, -1);
        }
        let instance: any;
        try {
          instance = new (fn as any)(...initArgs);
        } catch {
          instance = fn(...initArgs);
        }
        if (instance && (typeof instance === 'object' || typeof instance === 'function')) {
          if (Array.isArray(expected) && expected.length === lastItem.length) {
            rawRes = lastItem.map(([method, ...mArgs]: any) => {
              if (typeof instance[method] === 'function') {
                return instance[method](...mArgs);
              }
              if (typeof instance === 'function' && (method === '' || method === fn.name || method === 'spy')) {
                return instance(...mArgs);
              }
              return instance[method];
            });
          } else {
            let last: any;
            for (const [method, ...mArgs] of lastItem) {
              if (typeof instance[method] === 'function') {
                last = instance[method](...mArgs);
              } else if (typeof instance === 'function' && (method === '' || method === fn.name || method === 'spy')) {
                last = instance(...mArgs);
              } else {
                last = instance[method];
              }
            }
            rawRes = last;
          }
        } else {
          rawRes = instance;
        }
      } else {
        let directRes: any;
        let directSuccess = false;
        try {
          directRes = fn(...clonedArgs);
          directSuccess = true;
        } catch {}

        if (directSuccess && typeof directRes !== 'function') {
          rawRes = directRes;
        } else if (clonedArgs.length >= 2 && isCallSequence) {
          const leadingArgs = clonedArgs.slice(0, -1);
          let cur: any;
          if (leadingArgs.length === 1 && Array.isArray(leadingArgs[0]) && fn.length === 0) {
            cur = fn(...leadingArgs[0]);
          } else {
            cur = fn(...leadingArgs);
          }

          if (typeof cur === 'function') {
            let firstRes: any;
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
              rawRes = ch;
            } else {
              if (Array.isArray(expected) && expected.length === lastArg.length) {
                rawRes = [firstRes, ...lastArg.slice(1).map((c: any) => cur(...c))];
              } else {
                rawRes = firstRes;
              }
            }
          } else {
            rawRes = cur;
          }
        } else if (directSuccess) {
          rawRes = directRes;
        } else {
          rawRes = fn(...clonedArgs);
        }
      }
      let actual = rawRes instanceof Promise || (rawRes && typeof rawRes.then === 'function') ? await rawRes : rawRes;
      if (Array.isArray(actual) && actual.some(r => r instanceof Promise || (r && typeof r?.then === 'function'))) {
        actual = await Promise.all(actual);
      }
      if (actual && typeof (actual as any)[Symbol.asyncIterator] === 'function') {
        const collected: any[] = [];
        for await (const item of (actual as any)) {
          collected.push(item);
        }
        actual = collected;
      }
      if (!flexibleEqual(actual, expected)) {
        return {
          passed: false,
          error: `Test ${tc.id} failed for [${q.id} - ${q.title}]. Input: ${tc.input} | Expected: ${JSON.stringify(expected)} | Actual: ${JSON.stringify(actual)}`
        };
      }
    } catch (err: any) {
      return { passed: false, error: `Test ${tc.id} threw error: ${err.message}` };
    }
  }
  return { passed: true };
} finally {
  delete (globalThis as any)[q.functionName];
}
}

export async function testBatch(questions: CoreProgrammingQuestion[]): Promise<boolean> {
  let failed = 0;
  for (const q of questions) {
    const res = await testQuestion(q);
    if (!res.passed) {
      console.error(`FAIL: ${q.id} (${q.title}): ${res.error}`);
      failed++;
    }
  }
  if (failed === 0) {
    console.log(`ALL ${questions.length} QUESTIONS PASSED!`);
    return true;
  } else {
    console.error(`${failed} / ${questions.length} QUESTIONS FAILED`);
    return false;
  }
}
