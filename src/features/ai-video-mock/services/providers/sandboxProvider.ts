import type { CodeExecutionProvider, CodeSandboxExecutionParams, CodeSandboxResult } from '../../types/provider.types';

export class WebWorkerSandboxProvider implements CodeExecutionProvider {
  async execute(params: CodeSandboxExecutionParams): Promise<CodeSandboxResult> {
    const startTime = performance.now();
    const timeoutMs = params.timeoutMs || 3000;

    return new Promise(resolve => {
      let isSettled = false;

      const workerCode = `
        self.onmessage = function(e) {
          const { code, testCases } = e.data;
          const logs = [];
          const customConsole = {
            log: (...args) => logs.push({ level: 'log', message: args.join(' ') }),
            info: (...args) => logs.push({ level: 'info', message: args.join(' ') }),
            warn: (...args) => logs.push({ level: 'warn', message: args.join(' ') }),
            error: (...args) => logs.push({ level: 'error', message: args.join(' ') }),
          };

          try {
            // Safe evaluation wrapper
            const fnWrapper = new Function('console', code + '; return (typeof solve !== "undefined" ? solve : null);');
            const userFn = fnWrapper(customConsole);

            if (!userFn || typeof userFn !== 'function') {
              self.postMessage({
                status: 'WRONG_ANSWER',
                testsPassed: 0,
                testsTotal: testCases.length,
                failedCases: [{ input: 'N/A', expected: 'Function definition', actual: 'No solve() function found', error: 'Please define and export a solve() function.' }],
                logs
              });
              return;
            }

            let passed = 0;
            const failed = [];

            for (const tc of testCases) {
              try {
                let parsedInput;
                try {
                  parsedInput = JSON.parse(tc.input);
                } catch {
                  parsedInput = tc.input;
                }

                const result = userFn(parsedInput);
                const strResult = typeof result === 'object' ? JSON.stringify(result) : String(result);

                if (strResult === tc.expectedOutput || String(result) === String(tc.expectedOutput)) {
                  passed++;
                } else {
                  failed.push({
                    input: String(tc.input),
                    expected: String(tc.expectedOutput),
                    actual: strResult
                  });
                }
              } catch (tcErr) {
                failed.push({
                  input: String(tc.input),
                  expected: String(tc.expectedOutput),
                  actual: 'RUNTIME_ERROR',
                  error: tcErr.message
                });
              }
            }

            self.postMessage({
              status: failed.length === 0 ? 'PASSED' : 'WRONG_ANSWER',
              testsPassed: passed,
              testsTotal: testCases.length,
              failedCases: failed,
              logs
            });
          } catch (err) {
            self.postMessage({
              status: 'COMPILE_ERROR',
              testsPassed: 0,
              testsTotal: testCases.length,
              failedCases: [{ input: 'Syntax / Compilation', expected: 'Valid JS', actual: 'Error', error: err.message }],
              logs
            });
          }
        };
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const worker = new Worker(URL.createObjectURL(blob));

      const timer = setTimeout(() => {
        if (!isSettled) {
          isSettled = true;
          worker.terminate();
          resolve({
            status: 'TIMEOUT',
            testsPassed: 0,
            testsTotal: params.testCases.length,
            executionTimeMs: timeoutMs,
            failedCases: [{ input: 'Timeout', expected: 'Completion within ' + timeoutMs + 'ms', actual: 'Exceeded time limit', error: 'Infinite loop or long-running computation detected.' }],
            logs: [{ level: 'error', message: 'Execution terminated: time limit exceeded.' }],
          });
        }
      }, timeoutMs);

      worker.onmessage = e => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);
          worker.terminate();
          const data = e.data;
          resolve({
            status: data.status,
            testsPassed: data.testsPassed,
            testsTotal: data.testsTotal,
            executionTimeMs: Math.round(performance.now() - startTime),
            failedCases: data.failedCases || [],
            logs: data.logs || [],
          });
        }
      };

      worker.onerror = err => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);
          worker.terminate();
          resolve({
            status: 'SANDBOX_ERROR',
            testsPassed: 0,
            testsTotal: params.testCases.length,
            executionTimeMs: Math.round(performance.now() - startTime),
            failedCases: [{ input: 'Worker', expected: 'Normal execution', actual: 'Sandbox Crash', error: err.message }],
            logs: [{ level: 'error', message: err.message }],
          });
        }
      };

      worker.postMessage({
        code: params.code,
        testCases: params.testCases,
      });
    });
  }

  async reviewCodeWithAI(
    code: string,
    problemStatement: string,
    testResult: CodeSandboxResult
  ): Promise<{
    codeQualityScore: number;
    timeComplexityDemonstrated: string;
    spaceComplexityDemonstrated: string;
    cleanCodeNotes: string[];
    potentialBugs: string[];
    suggestedRefactoring: string;
  }> {
    // Check if Ollama is available
    const { ollamaProvider } = await import('./ollamaProvider');
    const status = await ollamaProvider.isAvailable();

    if (status.available) {
      const prompt = `You are a Senior Staff Software Engineer conducting an algorithmic & machine-coding review.
Problem: ${problemStatement}
Candidate Code:
\`\`\`javascript
${code}
\`\`\`
Test Results: ${testResult.testsPassed}/${testResult.testsTotal} passed (${testResult.status}).

Provide a rigorous technical code review. Output JSON ONLY in this format:
{
  "codeQualityScore": 8.5,
  "timeComplexityDemonstrated": "O(N log N)",
  "spaceComplexityDemonstrated": "O(1) auxiliary",
  "cleanCodeNotes": ["Clear naming", "Proper boundary checks"],
  "potentialBugs": ["Edge case when input array is empty"],
  "suggestedRefactoring": "Use early return guard clauses to reduce indentation."
}`;

      try {
        const res = await ollamaProvider.generateCompletion(prompt, { jsonMode: true, temperature: 0.2 });
        if (res.success && res.parsedJson && typeof res.parsedJson.codeQualityScore === 'number') {
          return {
            codeQualityScore: Math.min(10, Math.max(1, res.parsedJson.codeQualityScore)),
            timeComplexityDemonstrated: res.parsedJson.timeComplexityDemonstrated || 'O(N)',
            spaceComplexityDemonstrated: res.parsedJson.spaceComplexityDemonstrated || 'O(1)',
            cleanCodeNotes: Array.isArray(res.parsedJson.cleanCodeNotes) ? res.parsedJson.cleanCodeNotes : ['Code runs as expected'],
            potentialBugs: Array.isArray(res.parsedJson.potentialBugs) ? res.parsedJson.potentialBugs : [],
            suggestedRefactoring: res.parsedJson.suggestedRefactoring || 'Follow standard style guide.',
          };
        }
      } catch {}
    }

    // Deterministic Rule-Based Fallback
    const passRatio = testResult.testsTotal > 0 ? testResult.testsPassed / testResult.testsTotal : 0;
    const cleanNotes: string[] = [];
    const bugs: string[] = [];

    if (passRatio === 1) {
      cleanNotes.push('All public and boundary test cases passed successfully.');
    } else {
      bugs.push(`Failed ${testResult.testsTotal - testResult.testsPassed} test cases on edge values.`);
    }

    if (code.includes('const ') || code.includes('let ')) {
      cleanNotes.push('Modern ES6 block-scoped variable declarations utilized.');
    }
    if (code.includes('//')) {
      cleanNotes.push('Helpful inline comments clarifying reasoning.');
    }

    return {
      codeQualityScore: Math.min(10, Math.max(2, Math.round(passRatio * 8.5 * 10) / 10 + 1)),
      timeComplexityDemonstrated: code.includes('for (') && code.lastIndexOf('for (') > code.indexOf('for (') ? 'O(N²)' : 'O(N)',
      spaceComplexityDemonstrated: 'O(1) Auxiliary',
      cleanCodeNotes: cleanNotes.length > 0 ? cleanNotes : ['Solution executed in isolated sandbox'],
      potentialBugs: bugs,
      suggestedRefactoring: 'Consider abstracting helper logic and verifying empty/null parameter edge cases.',
    };
  }
}

export const sandboxProvider = new WebWorkerSandboxProvider();
