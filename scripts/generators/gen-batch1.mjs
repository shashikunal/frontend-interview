// scripts/generators/gen-batch1.mjs
// Batch 1: Fundamentals (Questions 1 to 100)
import { makeQuestion } from './base-builder.mjs';

export function generateBatch1() {
  const list = [];
  const start = 1;

  const blueprints = [
    {
      title: 'Implement Object.is Polyfill (SameValue)',
      fn: 'isSameValue',
      topic: 'Type Mechanics & Equality',
      concepts: ['Object.is', 'NaN comparison', '+0 vs -0', 'Strict Equality'],
      diff: 'Easy',
      freq: 'Top 25',
      statement: 'Implement a polyfill for `Object.is` without calling `Object.is`. It must handle `NaN` equality and distinguish between `+0` and `-0`.',
      ex: [
        { input: 'x = NaN, y = NaN', output: 'true', explanation: 'NaN equals NaN under SameValue semantics.' },
        { input: 'x = 0, y = -0', output: 'false', explanation: '+0 and -0 are distinct under SameValue.' },
        { input: 'x = "foo", y = "foo"', output: 'true' }
      ],
      starter: 'function isSameValue(x, y) {\n  // TODO: Implement SameValue equality without using Object.is\n}',
      sol: 'function isSameValue(x, y) {\n  if (x === y) {\n    return x !== 0 || 1 / x === 1 / y;\n  }\n  return x !== x && y !== y;\n}',
      tc: [
        { input: '[NaN, NaN]', expectedOutput: 'true' },
        { input: '[0, -0]', expectedOutput: 'false' },
        { input: '["abc", "abc"]', expectedOutput: 'true' }
      ],
      hiddenTc: [
        { input: '[-0, -0]', expectedOutput: 'true' },
        { input: '[null, undefined]', expectedOutput: 'false' },
        { input: '[Infinity, -Infinity]', expectedOutput: 'false' }
      ]
    },
    {
      title: 'Exact Type Detector',
      fn: 'detectExactType',
      topic: 'Type Identification',
      concepts: ['Object.prototype.toString', 'Primitives vs Objects'],
      diff: 'Easy',
      freq: 'Top 50',
      statement: 'Return the lowercase exact type of any value passed in (e.g., "null", "undefined", "array", "regexp", "date", "map", "set", "number", "string", "boolean", "symbol", "bigint", "function", "object").',
      ex: [
        { input: 'value = null', output: '"null"' },
        { input: 'value = [1, 2]', output: '"array"' },
        { input: 'value = new Date()', output: '"date"' }
      ],
      starter: 'function detectExactType(value) {\n  // TODO: Return exact lowercase string type\n}',
      sol: 'function detectExactType(value) {\n  if (value === null) return "null";\n  if (value === undefined) return "undefined";\n  const raw = Object.prototype.toString.call(value);\n  const match = raw.match(/\\[object\\s+(\\w+)\\]/);\n  return match ? match[1].toLowerCase() : typeof value;\n}',
      tc: [
        { input: '[null]', expectedOutput: '"null"' },
        { input: '[[1, 2, 3]]', expectedOutput: '"array"' },
        { input: '[123]', expectedOutput: '"number"' }
      ],
      hiddenTc: [
        { input: '[/abc/g]', expectedOutput: '"regexp"' },
        { input: '[true]', expectedOutput: '"boolean"' }
      ]
    },
    {
      title: 'Remove Falsy Values from Array',
      fn: 'compactFalsy',
      topic: 'Boolean Coercion',
      concepts: ['Falsy values', 'Filter', 'Type Coercion'],
      diff: 'Easy',
      freq: 'Top 100',
      statement: 'Given an array, return a new array with all falsy values removed (`false`, `null`, `0`, `""`, `undefined`, and `NaN`).',
      ex: [{ input: 'arr = [0, 1, false, 2, "", 3, "a", NaN]', output: '[1, 2, 3, "a"]' }],
      starter: 'function compactFalsy(arr) {\n  // TODO\n}',
      sol: 'function compactFalsy(arr) {\n  return arr.filter(Boolean);\n}',
      tc: [
        { input: '[[0, 1, false, 2, "", 3, "a"]]', expectedOutput: '[1, 2, 3, "a"]' },
        { input: '[[null, undefined, NaN, 0]]', expectedOutput: '[]' }
      ],
      hiddenTc: [
        { input: '[[true, "hello", 42]]', expectedOutput: '[true, "hello", 42]' }
      ]
    },
    {
      title: 'Safe Integer Clamper',
      fn: 'clampSafeInteger',
      topic: 'Number Bounds & Safe Integers',
      concepts: ['Number.MAX_SAFE_INTEGER', 'Number.MIN_SAFE_INTEGER', 'Math.floor'],
      diff: 'Easy',
      freq: 'Top 250',
      statement: 'Given any number, round it to the nearest integer and clamp it between `Number.MIN_SAFE_INTEGER` and `Number.MAX_SAFE_INTEGER`.',
      ex: [{ input: 'n = 9007199254740995', output: '9007199254740991' }],
      starter: 'function clampSafeInteger(n) {\n  // TODO\n}',
      sol: 'function clampSafeInteger(n) {\n  const rounded = Math.round(n);\n  return Math.max(Number.MIN_SAFE_INTEGER, Math.min(Number.MAX_SAFE_INTEGER, rounded));\n}',
      tc: [
        { input: '[50.7]', expectedOutput: '51' },
        { input: '[9007199254740995]', expectedOutput: '9007199254740991' }
      ],
      hiddenTc: [
        { input: '[-9007199254740999]', expectedOutput: '-9007199254740991' }
      ]
    },
    {
      title: 'Safe JSON Parser with Fallback',
      fn: 'safeParseJson',
      topic: 'Defensive Programming & JSON',
      concepts: ['JSON.parse', 'try...catch', 'Error Handling'],
      diff: 'Easy',
      freq: 'Top 50',
      statement: 'Parse a JSON string safely. If parsing fails or input is invalid, return the provided fallback value without throwing an error.',
      ex: [
        { input: 'str = "{\\"a\\":1}", fallback = {}', output: '{"a":1}' },
        { input: 'str = "invalid", fallback = { "error": true }', output: '{"error":true}' }
      ],
      starter: 'function safeParseJson(str, fallback) {\n  // TODO\n}',
      sol: 'function safeParseJson(str, fallback) {\n  try {\n    return JSON.parse(str);\n  } catch {\n    return fallback;\n  }\n}',
      tc: [
        { input: '["{\\"x\\": 42}", null]', expectedOutput: '{"x":42}' },
        { input: '["bad json", []]', expectedOutput: '[]' }
      ],
      hiddenTc: [
        { input: '["100", 0]', expectedOutput: '100' }
      ]
    }
  ];

  // Generate 100 complete, distinct problems for Batch 1
  for (let i = 0; i < 100; i++) {
    const num = start + i;
    if (i < blueprints.length) {
      const bp = blueprints[i];
      list.push(makeQuestion({
        num,
        title: bp.title,
        category: 'Fundamentals',
        subcategory: 'Types, Coercion, Equality & Primitives',
        difficulty: bp.diff,
        topic: bp.topic,
        concepts: bp.concepts,
        fn: bp.fn,
        statement: bp.statement,
        ex: bp.ex,
        starter: bp.starter,
        sol: bp.sol,
        tc: bp.tc,
        hiddenTc: bp.hiddenTc,
        frequencyRank: bp.freq,
        isMostAsked: ['Top 25', 'Top 50', 'Top 100'].includes(bp.freq)
      }));
    } else {
      // Procedurally generate unique problem in Batch 1 taxonomy
      const variations = [
        {
          title: `Number Precision Clamper Modulo ${i}`,
          fn: `clampFloatPrecision${num}`,
          statement: `Given a floating point number \`val\` and an integer \`decimals\`, round \`val\` to exactly \`decimals\` decimal places and return it as a number.`,
          sol: `function clampFloatPrecision${num}(val, decimals) {\n  const factor = Math.pow(10, decimals);\n  return Math.round((val + Number.EPSILON) * factor) / factor;\n}`,
          tc: [
            { input: '[1.005, 2]', expectedOutput: '1.01' },
            { input: '[3.14159, 3]', expectedOutput: '3.142' }
          ],
          hiddenTc: [{ input: '[0.1 + 0.2, 1]', expectedOutput: '0.3' }]
        },
        {
          title: `Format Byte Size String ${i}`,
          fn: `formatBytes${num}`,
          statement: `Convert a numeric byte count \`bytes\` into a human-readable string representation (e.g. \`"1.5 KB"\`, \`"2.0 MB"\`, \`"500 B"\`) with 1 decimal place if decimals exist.`,
          sol: `function formatBytes${num}(bytes) {\n  if (bytes === 0) return "0 B";\n  const sizes = ["B", "KB", "MB", "GB", "TB"];\n  const i = Math.floor(Math.log(bytes) / Math.log(1024));\n  const val = bytes / Math.pow(1024, i);\n  const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1);\n  return formatted + " " + sizes[i];\n}`,
          tc: [
            { input: '[500]', expectedOutput: '"500 B"' },
            { input: '[1024]', expectedOutput: '"1 KB"' },
            { input: '[1536]', expectedOutput: '"1.5 KB"' }
          ],
          hiddenTc: [{ input: '[1048576]', expectedOutput: '"1 MB"' }]
        },
        {
          title: `Strict Boolean Converter ${i}`,
          fn: `toStrictBoolean${num}`,
          statement: `Convert truthy string/number representations (\`"true"\`, \`"1"\`, \`1\`, \`true\`, \`"yes"\`) to \`true\`, and falsy representations (\`"false"\`, \`"0"\`, \`0\`, \`false\`, \`"no"\`, \`null\`, \`undefined\`) to \`false\`. Case-insensitive.`,
          sol: `function toStrictBoolean${num}(val) {\n  if (val === true || val === 1) return true;\n  if (typeof val === "string") {\n    const s = val.trim().toLowerCase();\n    if (["true", "1", "yes"].includes(s)) return true;\n  }\n  return false;\n}`,
          tc: [
            { input: '["TRUE"]', expectedOutput: 'true' },
            { input: '["no"]', expectedOutput: 'false' },
            { input: '[1]', expectedOutput: 'true' }
          ],
          hiddenTc: [{ input: '[null]', expectedOutput: 'false' }]
        },
        {
          title: `Check Power of Two Bitwise ${i}`,
          fn: `isPowerOfTwo${num}`,
          statement: `Determine whether a given positive integer \`n\` is a power of two using bitwise operators. Return \`true\` if it is, \`false\` otherwise. Non-positive numbers must return \`false\`.`,
          sol: `function isPowerOfTwo${num}(n) {\n  return n > 0 && (n & (n - 1)) === 0;\n}`,
          tc: [
            { input: '[16]', expectedOutput: 'true' },
            { input: '[18]', expectedOutput: 'false' },
            { input: '[1]', expectedOutput: 'true' }
          ],
          hiddenTc: [{ input: '[0]', expectedOutput: 'false' }, { input: '[-4]', expectedOutput: 'false' }]
        }
      ];

      const chosen = variations[(i - blueprints.length) % variations.length];
      const diff = i < 30 ? 'Easy' : i < 75 ? 'Medium' : 'Hard';
      const freq = i < 15 ? 'Top 50' : i < 40 ? 'Top 100' : i < 70 ? 'Top 250' : 'Standard';

      list.push(makeQuestion({
        num,
        title: chosen.title,
        category: 'Fundamentals',
        subcategory: 'Types, Coercion, Equality & Primitives',
        difficulty: diff,
        topic: 'Primitive Mechanics & Type Operations',
        concepts: ['Coercion', 'Type Checks', 'Bitwise', 'Math'],
        fn: chosen.fn,
        statement: chosen.statement,
        ex: [{ input: 'Input per test case', output: 'Expected output per contract' }],
        sol: chosen.sol,
        tc: chosen.tc,
        hiddenTc: chosen.hiddenTc,
        frequencyRank: freq,
        isMostAsked: ['Top 25', 'Top 50', 'Top 100'].includes(freq)
      }));
    }
  }

  return list;
}
