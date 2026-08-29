// Locally-generated interview question bank, styled after LeetCode (algorithms /
// data structures) and FrontendMasters (frontend interview tracks). No network
// access — everything is produced from template families with seeded variation.
//
// Output:
//   public/data/leetcode-style.json      (~6,000 algorithm/DS&A questions)
//   public/data/frontendmasters-style.json (~4,000 frontend questions)
//
// Run:  node scripts/generate-bank.mjs

import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = resolve(__dirname, '..', 'public', 'data')

// ---------- deterministic RNG ----------
function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const ri = (rng, min, max) => Math.floor(rng() * (max - min + 1)) + min
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)]
function randArr(rng, n, min, max) {
  return Array.from({ length: n }, () => ri(rng, min, max))
}
const WORDS = 'apple banana cat dog east fog good hill iron jet kite lemon moon nest oak pear quilt rose sun tree urn vine wind xray yoyo zebra bolt cloud dash echo flame grain'.split(' ')
const randWord = (rng) => pick(rng, WORDS)
function randWords(rng, n) {
  return Array.from({ length: n }, () => randWord(rng))
}

// ---------- algorithm families ----------
// Each: c(category), d(difficulty), stem, sample(rng)->{ text, call }, sol(code), explain
const ALGO = [
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to target.',
    sample: r => {
      const a = randArr(r, 4, 1, 20);
      const t = a[0] + a[1];
      return {
        text: `nums = [${a.join(', ')}], target = ${t}`,
        call: `console.log(twoSum([${a.join(', ')}], ${t}));`
      };
    },
    sol: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
    explain: 'Use a hash map to record each value\'s index as you scan. For the current number, check whether (target - num) was already seen; if so you have the pair. O(n) time, O(n) space.'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'Reverse a string in place and return it.',
    sample: r => {
      const w = randWord(r);
      return {
        text: `s = "${w}"`,
        call: `console.log(reverseString("${w}"));`
      };
    },
    sol: `function reverseString(s) {
  return s.split('').reverse().join('');
}`,
    explain: 'Convert to an array, reverse, and join. For true in-place reversal on a character array, swap from both ends toward the middle.'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'Return true if a string is a palindrome (ignoring non-alphanumerics and case).',
    sample: r => {
      const w1 = randWord(r), w2 = randWord(r);
      return {
        text: `s = "${w1}${w2}"`,
        call: `console.log(isPalindrome("${w1}${w2}"));`
      };
    },
    sol: `function isPalindrome(s) {
  const t = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return t === t.split('').reverse().join('');
}`,
    explain: 'Normalize the string (lowercase, strip non-alphanumerics) then compare it to its reverse.'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'For numbers 1 to n, print "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for both, else the number.',
    sample: r => {
      const n = ri(r, 10, 30);
      return {
        text: `n = ${n}`,
        call: `console.log(fizzBuzz(${n}));`
      };
    },
    sol: `function fizzBuzz(n) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) out.push('FizzBuzz');
    else if (i % 3 === 0) out.push('Fizz');
    else if (i % 5 === 0) out.push('Buzz');
    else out.push(String(i));
  }
  return out;
}`,
    explain: 'Check divisibility in order, testing 15 (3 and 5) before the individual rules.'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'Return the nth Fibonacci number (0-indexed: fib(0)=0, fib(1)=1).',
    sample: r => {
      const n = ri(r, 6, 20);
      return {
        text: `n = ${n}`,
        call: `console.log(fib(${n}));`
      };
    },
    sol: `function fib(n) {
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) [a, b] = [b, a + b];
  return a;
}`,
    explain: 'Iterate with two rolling variables to avoid the exponential cost of naive recursion.'
  },
  {
    c: 'Algorithms',
    d: 'Medium',
    stem: 'Find the contiguous subarray with the largest sum and return that sum (Kadane\'s algorithm).',
    sample: r => {
      const a = randArr(r, 6, -8, 8);
      return {
        text: `nums = [${a.join(', ')}]`,
        call: `console.log(maxSubArray([${a.join(', ')}]));`
      };
    },
    sol: `function maxSubArray(nums) {
  let best = nums[0], cur = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}`,
    explain: 'Track the maximum ending at each position; extend the running sum only when it helps.'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'Merge two sorted integer arrays into one sorted array (nums1 has enough trailing space).',
    sample: r => {
      const a = randArr(r, 3, 0, 9).sort((x, y) => x - y);
      const b = randArr(r, 3, 0, 9).sort((x, y) => x - y);
      return {
        text: `a = [${a.join(', ')}], b = [${b.join(', ')}]`,
        call: `const nums1 = [${a.join(', ')}, ...new Array(${b.length}).fill(0)];\nmerge(nums1, ${a.length}, [${b.join(', ')}], ${b.length});\nconsole.log(nums1);`
      };
    },
    sol: `function merge(nums1, m, nums2, n) {
  let i = m - 1, j = n - 1, k = m + n - 1;
  while (j >= 0) {
    nums1[k--] = i >= 0 && nums1[i] > nums2[j] ? nums1[i--] : nums2[j--];
  }
  return nums1;
}`,
    explain: 'Fill from the back using three pointers so you never overwrite unread values.'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'Determine if a string of brackets "()[]{}" is valid (properly closed and nested).',
    sample: r => {
      const s = pick(r, ['()[]{}', '([)]', '{[]}', '(((']);
      return {
        text: `s = "${s}"`,
        call: `console.log(isValid("${s}"));`
      };
    },
    sol: `function isValid(s) {
  const st = []; const m = { ')': '(', ']': '[', '}': '{' };
  for (const c of s) {
    if (c in m) { if (st.pop() !== m[c]) return false; }
    else st.push(c);
  }
  return st.length === 0;
}`,
    explain: 'Push open brackets; on a close, the top of the stack must match its opener.'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'Implement binary search on a sorted array; return the index of `target` or -1.',
    sample: r => {
      const arr = randArr(r, 6, 1, 30).sort((a, b) => a - b);
      const target = ri(r, 1, 30);
      return {
        text: `arr = [${arr.join(', ')}], target = ${target}`,
        call: `console.log(binarySearch([${arr.join(', ')}], ${target}));`
      };
    },
    sol: `function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;
  }
  return -1;
}`,
    explain: 'Repeatedly halve the search space; keep the half that could still contain the target.'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'You can climb n stairs taking 1 or 2 steps at a time. Return the number of distinct ways.',
    sample: r => {
      const n = ri(r, 5, 25);
      return {
        text: `n = ${n}`,
        call: `console.log(climbStairs(${n}));`
      };
    },
    sol: `function climbStairs(n) {
  let a = 1, b = 1;
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}`,
    explain: 'Ways(n) = Ways(n-1) + Ways(n-2), the Fibonacci recurrence; compute iteratively.'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'Count the prime numbers less than n.',
    sample: r => {
      const n = ri(r, 20, 100);
      return {
        text: `n = ${n}`,
        call: `console.log(countPrimes(${n}));`
      };
    },
    sol: `function countPrimes(n) {
  const s = new Uint8Array(n).fill(1);
  let count = 0;
  for (let i = 2; i < n; i++) {
    if (s[i]) {
      count++;
      for (let j = i * i; j < n; j += i) s[j] = 0;
    }
  }
  return count;
}`,
    explain: 'Sieve of Eratosthenes: mark multiples of each prime starting at its square.'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'Return true if two strings are anagrams (same characters, same counts).',
    sample: r => {
      const a = randWord(r), b = randWord(r);
      return {
        text: `a = "${a}", b = "${b}"`,
        call: `console.log(isAnagram("${a}", "${b}"));`
      };
    },
    sol: `function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const m = {};
  for (const c of a) m[c] = (m[c] || 0) + 1;
  for (const c of b) { if (!m[c]) return false; m[c]--; }
  return true;
}`,
    explain: 'Count frequencies in one string, decrement with the other; any mismatch means not an anagram.'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'Find the first character in a string that does not repeat.',
    sample: r => {
      const s = randWords(r, 3).join('');
      return {
        text: `s = "${s}"`,
        call: `console.log(firstUniqChar("${s}"));`
      };
    },
    sol: `function firstUniqChar(s) {
  const m = {};
  for (const c of s) m[c] = (m[c] || 0) + 1;
  for (let i = 0; i < s.length; i++) if (m[s[i]] === 1) return i;
  return -1;
}`,
    explain: 'Two passes: count all characters, then return the first index whose count is 1.'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'Move all zeroes in an array to the end while preserving the order of non-zero elements.',
    sample: r => {
      const nums = randArr(r, 6, 0, 5);
      return {
        text: `nums = [${nums.join(', ')}]`,
        call: `const nums = [${nums.join(', ')}];\nmoveZeroes(nums);\nconsole.log(nums);`
      };
    },
    sol: `function moveZeroes(nums) {
  let p = 0;
  for (const v of nums) if (v !== 0) nums[p++] = v;
  while (p < nums.length) nums[p++] = 0;
}`,
    explain: 'Write non-zeros into the front with a pointer, then fill the remainder with zeroes.'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'Increment a non-negative integer represented as a digits array by one.',
    sample: r => {
      const digits = randArr(r, 4, 0, 9);
      if (digits[0] === 0) digits[0] = 1;
      return {
        text: `digits = [${digits.join(', ')}]`,
        call: `console.log(plusOne([${digits.join(', ')}]));`
      };
    },
    sol: `function plusOne(digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) { digits[i]++; return digits; }
    digits[i] = 0;
  }
  return [1, ...digits];
}`,
    explain: 'Add one from the units end, carrying as needed; if all were 9, prepend a 1.'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'Convert a Roman numeral string to an integer.',
    sample: r => {
      const s = pick(r, ['III', 'IV', 'IX', 'LVIII', 'MCMXCIV']);
      return {
        text: `s = "${s}"`,
        call: `console.log(romanToInt("${s}"));`
      };
    },
    sol: `function romanToInt(s) {
  const v = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = v[s[i]], nxt = v[s[i + 1]] || 0;
    total += cur < nxt ? -cur : cur;
  }
  return total;
}`,
    explain: 'Add each symbol\'s value, but subtract it when the following symbol is larger (e.g., IV = 4).'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'Find the longest common prefix among an array of strings.',
    sample: r => {
      const strs = randWords(r, 3);
      return {
        text: `strs = [${strs.map(w => `"${w}"`).join(', ')}]`,
        call: `console.log(longestCommonPrefix([${strs.map(w => `"${w}"`).join(', ')}]));`
      };
    },
    sol: `function longestCommonPrefix(strs) {
  if (!strs.length) return '';
  let pre = strs[0];
  for (const s of strs) {
    while (!s.startsWith(pre)) pre = pre.slice(0, -1);
    if (!pre) return '';
  }
  return pre;
}`,
    explain: 'Start from the first string and shorten the prefix until every other string starts with it.'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'Return the intersection of two arrays (elements appearing in both).',
    sample: r => {
      const a = randArr(r, 4, 1, 9), b = randArr(r, 4, 1, 9);
      return {
        text: `a = [${a.join(', ')}], b = [${b.join(', ')}]`,
        call: `console.log(intersection([${a.join(', ')}], [${b.join(', ')}]));`
      };
    },
    sol: `function intersection(a, b) {
  const set = new Set(a);
  return [...new Set(b.filter(x => set.has(x)))];
}`,
    explain: 'Put one array in a set, then keep distinct elements of the other that are present.'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'Every element appears twice except one. Find the single one.',
    sample: r => {
      const a = randArr(r, 4, 1, 9);
      const unique = ri(r, 10, 20);
      const nums = [...a, ...a, unique].sort(() => r() - 0.5);
      return {
        text: `nums = [${nums.join(', ')}]`,
        call: `console.log(singleNumber([${nums.join(', ')}]));`
      };
    },
    sol: `function singleNumber(nums) {
  let x = 0;
  for (const n of nums) x ^= n;
  return x;
}`,
    explain: 'XOR cancels identical pairs (a ^ a = 0), leaving the unique element.'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'Find the majority element (appears more than n/2 times).',
    sample: r => {
      const maj = ri(r, 1, 4);
      const nums = [maj, maj, maj, maj, ri(r, 5, 9), ri(r, 5, 9), maj].sort(() => r() - 0.5);
      return {
        text: `nums = [${nums.join(', ')}]`,
        call: `console.log(majorityElement([${nums.join(', ')}]));`
      };
    },
    sol: `function majorityElement(nums) {
  let count = 0, cand = 0;
  for (const n of nums) {
    if (count === 0) cand = n;
    count += n === cand ? 1 : -1;
  }
  return cand;
}`,
    explain: 'Boyer-Moore voting: cancel out different elements; the survivor is the majority if one exists.'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'Rotate an array to the right by k steps.',
    sample: r => {
      const nums = randArr(r, 5, 1, 9);
      const k = ri(r, 1, 4);
      return {
        text: `nums = [${nums.join(', ')}], k = ${k}`,
        call: `const nums = [${nums.join(', ')}];\nconsole.log(rotate(nums, ${k}));`
      };
    },
    sol: `function rotate(nums, k) {
  k %= nums.length;
  nums.reverse();
  nums.reverse(0, k);
  nums.reverse(k);
  return nums;
}`,
    explain: 'Reverse the whole array, then reverse the first k and the rest separately.'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'Return true if the array contains any duplicates.',
    sample: r => {
      const nums = randArr(r, 5, 1, 5);
      return {
        text: `nums = [${nums.join(', ')}]`,
        call: `console.log(containsDuplicate([${nums.join(', ')}]));`
      };
    },
    sol: `function containsDuplicate(nums) {
  const s = new Set();
  for (const n of nums) { if (s.has(n)) return true; s.add(n); }
  return false;
}`,
    explain: 'Insert into a set; a re-insert indicates a duplicate.'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'Given an array of 0..n with one missing, find the missing number.',
    sample: r => {
      const n = ri(r, 4, 9);
      const a = Array.from({ length: n + 1 }, (_, i) => i);
      a.splice(ri(r, 0, n), 1);
      return {
        text: `nums = [${a.join(', ')}]`,
        call: `console.log(missingNumber([${a.join(', ')}]));`
      };
    },
    sol: `function missingNumber(nums) {
  const n = nums.length;
  let total = (n * (n + 1)) / 2;
  for (const x of nums) total -= x;
  return total;
}`,
    explain: 'Subtract every value from the expected sum 0..n; the remainder is the missing number.'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'Return true if a number is "happy" (repeatedly sum squares of digits reaches 1).',
    sample: r => {
      const n = ri(r, 10, 200);
      return {
        text: `n = ${n}`,
        call: `console.log(isHappy(${n}));`
      };
    },
    sol: `function isHappy(n) {
  const seen = new Set();
  while (n !== 1 && !seen.has(n)) {
    seen.add(n);
    let s = 0;
    while (n) { const d = n % 10; s += d * d; n = Math.floor(n / 10); }
    n = s;
  }
  return n === 1;
}`,
    explain: 'A cycle that is not 1 means the number is unhappy; track visited values with a set.'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'Return true if n is a power of two.',
    sample: r => {
      const n = pick(r, [1, 2, 4, 8, 16, 31, 64, 100]);
      return {
        text: `n = ${n}`,
        call: `console.log(isPowerOfTwo(${n}));`
      };
    },
    sol: `function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}`,
    explain: 'Powers of two have exactly one 1-bit, so n & (n-1) clears it to 0.'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'Add two non-negative integers given as string digits, return as string.',
    sample: r => {
      const a = String(ri(r, 100, 999)), b = String(ri(r, 100, 999));
      return {
        text: `a = "${a}", b = "${b}"`,
        call: `console.log(addStrings("${a}", "${b}"));`
      };
    },
    sol: `function addStrings(a, b) {
  let i = a.length - 1, j = b.length - 1, carry = 0, res = '';
  while (i >= 0 || j >= 0 || carry) {
    const s = (i >= 0 ? +a[i--] : 0) + (j >= 0 ? +b[j--] : 0) + carry;
    res = (s % 10) + res; carry = Math.floor(s / 10);
  }
  return res;
}`,
    explain: 'Simulate grade-school addition digit by digit from the right, tracking the carry.'
  },
  {
    c: 'Algorithms',
    d: 'Easy',
    stem: 'Convert a positive integer to its Excel column title (1->A, 28->AB).',
    sample: r => {
      const n = ri(r, 27, 700);
      return {
        text: `n = ${n}`,
        call: `console.log(convertToTitle(${n}));`
      };
    },
    sol: `function convertToTitle(n) {
  let s = '';
  while (n > 0) {
    n--;
    s = String.fromCharCode((n % 26) + 65) + s;
    n = Math.floor(n / 26);
  }
  return s;
}`,
    explain: 'It is base-26 but 1-indexed, so decrement before taking the modulo each step.'
  },
  {
    c: 'Data Structures',
    d: 'Medium',
    stem: 'Evaluate an arithmetic expression in reverse Polish notation.',
    sample: r => {
      const tokens = pick(r, [['2', '1', '+', '3', '*'], ['4', '13', '5', '/', '+'], ['10', '6', '9', '3', '+', '-', '11', '*', '/', '*', '17', '+', '5', '+']]);
      return {
        text: `tokens = [${tokens.map(t => `"${t}"`).join(', ')}]`,
        call: `console.log(evalRPN([${tokens.map(t => `"${t}"`).join(', ')}]));`
      };
    },
    sol: `function evalRPN(tokens) {
  const st = [];
  for (const t of tokens) {
    if (['+','-','*','/'].includes(t)) {
      const b = st.pop(), a = st.pop();
      st.push(t === '+' ? a + b : t === '-' ? a - b : t === '*' ? a * b : Math.trunc(a / b));
    } else st.push(+t);
  }
  return st[0];
}`,
    explain: 'Push operands; when an operator appears, pop two, apply it, and push the result.'
  },
  {
    c: 'Data Structures',
    d: 'Medium',
    stem: 'Design a stack that supports push, pop, top, and getMin in O(1).',
    sample: () => ({
      text: 'ops = push/pop/min',
      call: `const s = new MinStack();\ns.push(-2);\ns.push(0);\ns.push(-3);\nconsole.log("min:", s.getMin());\ns.pop();\nconsole.log("top:", s.top());\nconsole.log("min:", s.getMin());`
    }),
    sol: `class MinStack {
  constructor() { this.a = []; this.m = []; }
  push(x) { this.a.push(x); this.m.push(this.m.length ? Math.min(x, this.m.at(-1)) : x); }
  pop() { this.a.pop(); this.m.pop(); }
  top() { return this.a.at(-1); }
  getMin() { return this.m.at(-1); }
}`,
    explain: 'Keep a parallel stack of running minimums so the current min is always on top.'
  },
  {
    c: 'Data Structures',
    d: 'Medium',
    stem: 'Implement a queue using two stacks.',
    sample: () => ({
      text: 'ops = enqueue/dequeue',
      call: `const q = new Queue();\nq.enqueue(10);\nq.enqueue(20);\nconsole.log("dequeue:", q.dequeue());\nconsole.log("dequeue:", q.dequeue());`
    }),
    sol: `class Queue {
  constructor() { this.in = []; this.out = []; }
  enqueue(x) { this.in.push(x); }
  dequeue() {
    if (!this.out.length) while (this.in.length) this.out.push(this.in.pop());
    return this.out.pop();
  }
}`,
    explain: 'Push to the "in" stack; pop from "out", refilling it by reversing "in" only when empty.'
  },
  {
    c: 'Algorithms',
    d: 'Medium',
    stem: 'Group anagrams: return arrays of strings that are anagrams of each other.',
    sample: r => {
      const strs = randWords(r, 4);
      const combined = [strs[0], strs[0].split('').reverse().join(''), strs[1], strs[1].split('').reverse().join('')];
      return {
        text: `strs = [${combined.map(w => `"${w}"`).join(', ')}]`,
        call: `console.log(groupAnagrams([${combined.map(w => `"${w}"`).join(', ')}]));`
      };
    },
    sol: `function groupAnagrams(strs) {
  const m = {};
  for (const s of strs) {
    const key = s.split('').sort().join('');
    (m[key] = m[key] || []).push(s);
  }
  return Object.values(m);
}`,
    explain: 'Anagrams share a sorted-character key; bucket strings by that key.'
  },
  {
    c: 'Algorithms',
    d: 'Medium',
    stem: 'Return the k most frequent elements.',
    sample: r => {
      const nums = randArr(r, 8, 1, 6);
      const k = ri(r, 1, 3);
      return {
        text: `nums = [${nums.join(', ')}], k = ${k}`,
        call: `console.log(topKFrequent([${nums.join(', ')}], ${k}));`
      };
    },
    sol: `function topKFrequent(nums, k) {
  const m = {};
  for (const n of nums) m[n] = (m[n] || 0) + 1;
  return Object.keys(m).sort((a, b) => m[b] - m[a]).slice(0, k).map(Number);
}`,
    explain: 'Count frequencies, then sort by frequency and take the top k (a heap gives better complexity).'
  },
  {
    c: 'Algorithms',
    d: 'Medium',
    stem: 'Return true if `s` can be segmented into words from a dictionary.',
    sample: r => {
      const w1 = randWord(r), w2 = randWord(r);
      return {
        text: `s = "${w1}${w2}", wordDict = ["${w1}", "${w2}"]`,
        call: `console.log(wordBreak("${w1}${w2}", ["${w1}", "${w2}"]));`
      };
    },
    sol: `function wordBreak(s, wordDict) {
  const set = new Set(wordDict), dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++)
    for (let j = 0; j < i; j++)
      if (dp[j] && set.has(s.slice(j, i))) { dp[i] = true; break; }
  return dp[s.length];
}`,
    explain: 'dp[i] = can the prefix of length i be built; check every split where the left part is valid and the right word exists.'
  },
  {
    c: 'Algorithms',
    d: 'Medium',
    stem: 'Given coin denominations and an amount, return the fewest coins needed (or -1).',
    sample: r => {
      const coins = pick(r, [[1, 2, 5], [1, 3, 4], [2, 5, 10]]);
      const amount = ri(r, 8, 40);
      return {
        text: `coins = [${coins.join(', ')}], amount = ${amount}`,
        call: `console.log(coinChange([${coins.join(', ')}], ${amount}));`
      };
    },
    sol: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++)
    for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    explain: 'Classic unbounded knapsack: dp[a] is the min coins for amount a, built from dp[a-coin]+1.'
  },
  {
    c: 'Algorithms',
    d: 'Medium',
    stem: 'You may rob houses (cannot rob adjacent ones). Return the maximum loot.',
    sample: r => {
      const nums = randArr(r, 6, 1, 20);
      return {
        text: `nums = [${nums.join(', ')}]`,
        call: `console.log(rob([${nums.join(', ')}]));`
      };
    },
    sol: `function rob(nums) {
  let prev = 0, cur = 0;
  for (const n of nums) { const t = Math.max(cur, prev + n); prev = cur; cur = t; }
  return cur;
}`,
    explain: 'At each house decide: skip it (keep current) or rob it (add to the result two houses back).'
  },
  {
    c: 'Algorithms',
    d: 'Medium',
    stem: 'Given an array of stock prices, return the maximum profit from one buy and one sell.',
    sample: r => {
      const prices = randArr(r, 6, 1, 30);
      return {
        text: `prices = [${prices.join(', ')}]`,
        call: `console.log(maxProfit([${prices.join(', ')}]));`
      };
    },
    sol: `function maxProfit(prices) {
  let min = Infinity, best = 0;
  for (const p of prices) { min = Math.min(min, p); best = Math.max(best, p - min); }
  return best;
}`,
    explain: 'Track the lowest price seen so far and the best margin achievable by selling today.'
  },
  {
    c: 'Data Structures',
    d: 'Easy',
    stem: 'Detect a cycle in a linked list (return true if one exists).',
    sample: r => {
      const has = pick(r, [true, false]);
      return {
        text: `list has cycle = ${has}`,
        call: `const n1 = { val: 3, next: null };\nconst n2 = { val: 2, next: null };\nconst n3 = { val: 0, next: null };\nconst n4 = { val: -4, next: null };\nn1.next = n2;\nn2.next = n3;\nn3.next = n4;\n${has ? 'n4.next = n2;\n' : ''}console.log("hasCycle:", hasCycle(n1));`
      };
    },
    sol: `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; if (slow === fast) return true; }
  return false;
}`,
    explain: 'Floyd\'s tortoise and hare: a slow and a fast pointer meet iff there is a cycle.'
  },
  {
    c: 'Data Structures',
    d: 'Easy',
    stem: 'Reverse a singly linked list.',
    sample: () => ({
      text: '1 -> 2 -> 3 -> null',
      call: `const list = { val: 1, next: { val: 2, next: { val: 3, next: null } } };\nconsole.log(reverseList(list));`
    }),
    sol: `function reverseList(head) {
  let prev = null, cur = head;
  while (cur) { const nxt = cur.next; cur.next = prev; prev = cur; cur = nxt; }
  return prev;
}`,
    explain: 'Iteratively rewire each node\'s next pointer to the previous node.'
  },
  {
    c: 'Data Structures',
    d: 'Easy',
    stem: 'Merge two sorted linked lists into one sorted list.',
    sample: () => ({
      text: 'l1 = 1->2->4, l2 = 1->3->4',
      call: `const l1 = { val: 1, next: { val: 2, next: { val: 4, next: null } } };\nconst l2 = { val: 1, next: { val: 3, next: { val: 4, next: null } } };\nconsole.log(mergeTwoLists(l1, l2));`
    }),
    sol: `function mergeTwoLists(a, b) {
  const dummy = {}; let cur = dummy;
  while (a && b) { if (a.val < b.val) { cur.next = a; a = a.next; } else { cur.next = b; b = b.next; } cur = cur.next; }
  cur.next = a || b;
  return dummy.next;
}`,
    explain: 'Pick the smaller head each step and append it, advancing that list\'s pointer.'
  },
  {
    c: 'Data Structures',
    d: 'Easy',
    stem: 'Return the maximum depth (height) of a binary tree.',
    sample: () => ({
      text: 'root = [3, 9, 20, null, null, 15, 7]',
      call: `const tree = { val: 3, left: { val: 9, left: null, right: null }, right: { val: 20, left: { val: 15, left: null, right: null }, right: { val: 7, left: null, right: null } } };\nconsole.log("maxDepth:", maxDepth(tree));`
    }),
    sol: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    explain: 'Recursively the depth is 1 plus the max depth of the two subtrees.'
  },
  {
    c: 'Data Structures',
    d: 'Easy',
    stem: 'Invert (mirror) a binary tree.',
    sample: () => ({
      text: 'root = [4, 2, 7, 1, 3, 6, 9]',
      call: `const tree = { val: 4, left: { val: 2, left: null, right: null }, right: { val: 7, left: null, right: null } };\nconsole.log(invertTree(tree));`
    }),
    sol: `function invertTree(root) {
  if (!root) return null;
  [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];
  return root;
}`,
    explain: 'Swap the left and right children of every node via post-order recursion.'
  },
  {
    c: 'Data Structures',
    d: 'Easy',
    stem: 'Check whether a binary tree is symmetric around its center.',
    sample: () => ({
      text: 'root = [1, 2, 2, 3, 4, 4, 3]',
      call: `const tree = { val: 1, left: { val: 2, left: null, right: null }, right: { val: 2, left: null, right: null } };\nconsole.log("isSymmetric:", isSymmetric(tree));`
    }),
    sol: `function isSymmetric(root) {
  const eq = (a, b) => !a && !b ? true : a && b && a.val === b.val && eq(a.left, b.right) && eq(a.right, b.left);
  return eq(root?.left, root?.right);
}`,
    explain: 'A tree is symmetric if its left subtree mirrors its right subtree.'
  },
  {
    c: 'Data Structures',
    d: 'Easy',
    stem: 'Return true if a binary tree has a root-to-leaf path summing to `target`.',
    sample: r => {
      const target = ri(r, 5, 20);
      return {
        text: `target = ${target}`,
        call: `const tree = { val: 5, left: { val: 4, left: { val: 11, left: null, right: null }, right: null }, right: { val: 8, left: null, right: null } };\nconsole.log("hasPathSum:", hasPathSum(tree, ${target}));`
      };
    },
    sol: `function hasPathSum(root, target) {
  if (!root) return false;
  if (!root.left && !root.right) return root.val === target;
  return hasPathSum(root.left, target - root.val) || hasPathSum(root.right, target - root.val);
}`,
    explain: 'Subtract the node\'s value as you descend; a leaf with the remaining target is a match.'
  },
  {
    c: 'Data Structures',
    d: 'Medium',
    stem: 'Validate that a binary tree is a proper Binary Search Tree.',
    sample: () => ({
      text: 'root = [2, 1, 3]',
      call: `const tree = { val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } };\nconsole.log("isValidBST:", isValidBST(tree));`
    }),
    sol: `function isValidBST(root, lo = -Infinity, hi = Infinity) {
  if (!root) return true;
  if (root.val <= lo || root.val >= hi) return false;
  return isValidBST(root.left, lo, root.val) && isValidBST(root.right, root.val, hi);
}`,
    explain: 'Each node must stay within an ever-tightening (lo, hi) window from its ancestors.'
  },
  {
    c: 'Algorithms',
    d: 'Medium',
    stem: 'Count the number of islands (connected 1s horizontally/vertically) in a grid.',
    sample: () => ({
      text: 'grid = 4x5 binary grid',
      call: `const grid = [\n  ['1', '1', '0', '0', '0'],\n  ['1', '1', '0', '0', '0'],\n  ['0', '0', '1', '0', '0'],\n  ['0', '0', '0', '1', '1']\n];\nconsole.log("numIslands:", numIslands(grid));`
    }),
    sol: `function numIslands(grid) {
  let count = 0;
  const dfs = (r, c) => {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] === '0') return;
    grid[r][c] = '0';
    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);
  };
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[0].length; c++)
      if (grid[r][c] === '1') { count++; dfs(r, c); }
  return count;
}`,
    explain: 'For each land cell, run DFS to sink the whole island, then count the starts.'
  },
  {
    c: 'Algorithms',
    d: 'Medium',
    stem: 'Return the order to take all courses given prerequisite pairs (topological sort).',
    sample: r => {
      const n = ri(r, 3, 5);
      return {
        text: `numCourses = ${n}, prerequisites = [[1, 0]]`,
        call: `console.log("canFinish:", canFinish(${n}, [[1, 0]]));`
      };
    },
    sol: `function canFinish(n, pre) {
  const adj = Array.from({ length: n }, () => []);
  const indeg = new Array(n).fill(0);
  for (const [a, b] of pre) { adj[b].push(a); indeg[a]++; }
  const q = []; for (let i = 0; i < n; i++) if (!indeg[i]) q.push(i);
  let seen = 0;
  while (q.length) { const u = q.shift(); seen++; for (const v of adj[u]) if (--indeg[v] === 0) q.push(v); }
  return seen === n;
}`,
    explain: 'Kahn\'s algorithm: repeatedly take courses with no remaining prerequisites; a cycle leaves some unvisited.'
  },
  {
    c: 'Data Structures',
    d: 'Medium',
    stem: 'Return the level-order (breadth-first) traversal of a binary tree.',
    sample: () => ({
      text: 'root = [3, 9, 20, null, null, 15, 7]',
      call: `const tree = { val: 3, left: { val: 9, left: null, right: null }, right: { val: 20, left: { val: 15, left: null, right: null }, right: { val: 7, left: null, right: null } } };\nconsole.log("levelOrder:", levelOrder(tree));`
    }),
    sol: `function levelOrder(root) {
  const out = []; if (!root) return out;
  const q = [root];
  while (q.length) {
    const n = q.length, level = [];
    for (let i = 0; i < n; i++) {
      const node = q.shift(); level.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    out.push(level);
  }
  return out;
}`,
    explain: 'Use a queue; process nodes level by level, enqueuing children as you go.'
  },
  {
    c: 'Data Structures',
    d: 'Medium',
    stem: 'Return the diameter of a binary tree (longest path between any two nodes).',
    sample: () => ({
      text: 'root = [1, 2, 3, 4, 5]',
      call: `const tree = { val: 1, left: { val: 2, left: { val: 4, left: null, right: null }, right: { val: 5, left: null, right: null } }, right: { val: 3, left: null, right: null } };\nconsole.log("diameter:", diameterOfBinaryTree(tree));`
    }),
    sol: `function diameterOfBinaryTree(root) {
  let best = 0;
  const depth = (n) => {
    if (!n) return 0;
    const l = depth(n.left), r = depth(n.right);
    best = Math.max(best, l + r);
    return 1 + Math.max(l, r);
  };
  depth(root);
  return best;
}`,
    explain: 'For each node the path through it is leftDepth+rightDepth; track the maximum while computing depths.'
  },
  {
    c: 'Algorithms',
    d: 'Medium',
    stem: 'Search a target in a rotated sorted array; return its index or -1.',
    sample: r => {
      const target = ri(r, 0, 7);
      return {
        text: `nums = [4, 5, 6, 7, 0, 1, 2], target = ${target}`,
        call: `console.log(search([4, 5, 6, 7, 0, 1, 2], ${target}));`
      };
    },
    sol: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      if (target >= nums[lo] && target < nums[mid]) hi = mid - 1; else lo = mid + 1;
    } else {
      if (target > nums[mid] && target <= nums[hi]) lo = mid + 1; else hi = mid - 1;
    }
  }
  return -1;
}`,
    explain: 'One half is always sorted; decide which half could contain the target and binary-search there.'
  },
  {
    c: 'Algorithms',
    d: 'Hard',
    stem: 'Compute how much water is trapped after raining given bar heights.',
    sample: r => {
      const height = randArr(r, 7, 0, 8);
      return {
        text: `height = [${height.join(', ')}]`,
        call: `console.log("Trapped water:", trap([${height.join(', ')}]));`
      };
    },
    sol: `function trap(height) {
  let l = 0, r = height.length - 1, lw = 0, rw = 0, water = 0;
  while (l < r) {
    if (height[l] < height[r]) { lw = Math.max(lw, height[l]); water += lw - height[l++]; }
    else { rw = Math.max(rw, height[r]); water += rw - height[r--]; }
  }
  return water;
}`,
    explain: 'Two pointers: water at a side is limited by the smaller of the two running max walls.'
  },
  {
    c: 'Algorithms',
    d: 'Medium',
    stem: 'Find the longest palindromic substring.',
    sample: r => {
      const s = randWord(r) + randWord(r);
      return {
        text: `s = "${s}"`,
        call: `console.log(longestPalindrome("${s}"));`
      };
    },
    sol: `function longestPalindrome(s) {
  let start = 0, max = 0;
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) { if (r - l + 1 > max) { max = r - l + 1; start = l; } l--; r++; }
  };
  for (let i = 0; i < s.length; i++) { expand(i, i); expand(i, i + 1); }
  return s.slice(start, start + max);
}`,
    explain: 'Expand around each center (odd and even) and keep the widest palindrome found.'
  },
  {
    c: 'Algorithms',
    d: 'Medium',
    stem: 'Given a string, find the length of the longest substring without repeating characters.',
    sample: r => {
      const s = randWords(r, 3).join('');
      return {
        text: `s = "${s}"`,
        call: `console.log(lengthOfLongestSubstring("${s}"));`
      };
    },
    sol: `function lengthOfLongestSubstring(s) {
  let set = new Set(), l = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    while (set.has(s[r])) set.delete(s[l++]);
    set.add(s[r]);
    best = Math.max(best, r - l + 1);
  }
  return best;
}`,
    explain: 'Sliding window: shrink from the left whenever a duplicate enters, then grow from the right.'
  },
  {
    c: 'Algorithms',
    d: 'Medium',
    stem: 'Given an integer array, return the contiguous subarray of length k with the maximum average.',
    sample: r => {
      const nums = randArr(r, 6, 1, 20);
      const k = ri(r, 2, 4);
      return {
        text: `nums = [${nums.join(', ')}], k = ${k}`,
        call: `console.log(findMaxAverage([${nums.join(', ')}], ${k}));`
      };
    },
    sol: `function findMaxAverage(nums, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let i = k; i < nums.length; i++) { sum += nums[i] - nums[i - k]; best = Math.max(best, sum); }
  return best / k;
}`,
    explain: 'Sliding window sum: add the incoming element and drop the outgoing one as the window moves.'
  },
  {
    c: 'Algorithms',
    d: 'Hard',
    stem: 'Given a set of non-negative integers and a target, return all unique combinations that sum to target (reuse allowed).',
    sample: r => {
      const candidates = pick(r, [[2, 3, 6, 7], [2, 5, 3, 7], [3, 4, 5]]);
      const target = ri(r, 7, 15);
      return {
        text: `candidates = [${candidates.join(', ')}], target = ${target}`,
        call: `console.log(combinationSum([${candidates.join(', ')}], ${target}));`
      };
    },
    sol: `function combinationSum(c, target) {
  const out = [];
  const dfs = (i, cur, sum) => {
    if (sum === target) { out.push([...cur]); return; }
    if (sum > target || i === c.length) return;
    cur.push(c[i]); dfs(i, cur, sum + c[i]); cur.pop();
    dfs(i + 1, cur, sum);
  };
  dfs(0, [], 0);
  return out;
}`,
    explain: 'Backtrack: at each candidate either take it again (reuse) or move to the next, pruning when the sum exceeds target.'
  },
]

// ---------- frontend (FrontendMasters-style) families ----------
const FE = [
  {
    c: 'JavaScript',
    d: 'Medium',
    q: r => `Explain JavaScript closures and give a practical use case${randWord(r) ? ' (e.g., with "' + randWord(r) + '")' : ''}.`,
    a: 'A closure is a function that retains access to variables from its lexical scope even after the outer function has returned. They power data privacy, currying, and event handlers.',
    s: `function counter() {
  let n = 0;
  return () => ++n;
}
const c = counter();
console.log('counter:', c(), c(), c());`
  },
  {
    c: 'JavaScript',
    d: 'Easy',
    q: r => `What is hoisting in JavaScript, and how do let/const differ from var${r() > 0.5 ? ' with temporal dead zone' : ''}?`,
    a: 'Declarations are moved to the top of their scope at compile time. var is initialized to undefined; let/const are hoisted but not initialized, causing a temporal dead zone until declaration.',
    s: `console.log('var before init:', typeof x, x); // undefined
var x = 10;
console.log('var after init:', x);`
  },
  {
    c: 'JavaScript',
    d: 'Medium',
    q: r => `Explain the four ways "this" is bound in JavaScript${r() > 0.5 ? ' and how arrow functions change it' : ''}.`,
    a: 'this is set by: (1) the call site for a method, (2) call/apply/bind, (3) new for constructors, (4) the global/undefined in loose/strict mode. Arrow functions inherit this lexically from their enclosing scope.',
    s: `const obj = { v: 42, f() { return () => this.v; } };
const g = obj.f();
console.log('arrow function this:', g()); // 42`
  },
  {
    c: 'JavaScript',
    d: 'Medium',
    q: r => `Explain prototypal inheritance and how the prototype chain resolves a property.`,
    a: 'Objects have an internal [[Prototype]]; when a property is not found on the object, JS walks the chain. Class syntax is sugar over this mechanism.',
    s: `function Animal(name) { this.name = name; }
Animal.prototype.speak = function () { return this.name + ' makes a sound'; };
const d = new Animal('Dog');
console.log(d.speak());`
  },
  {
    c: 'JavaScript',
    d: 'Hard',
    q: r => `Explain the event loop, macrotasks, and microtasks, including Promise and setTimeout ordering.`,
    a: 'The call stack runs synchronous code; when empty, the runtime drains the microtask queue (Promises, queueMicrotask) before one macrotask (setTimeout, I/O). Microtasks run to completion before the next macrotask.',
    s: `console.log('1 (sync)');
setTimeout(() => console.log('4 (macro)'), 0);
Promise.resolve().then(() => console.log('3 (micro)'));
console.log('2 (sync)');`
  },
  {
    c: 'JavaScript',
    d: 'Easy',
    q: r => `What are Promises and how do you handle errors with then/catch?`,
    a: 'A Promise represents a future value with pending/fulfilled/rejected states. Use .then for success, .catch for rejection; the chain short-circuits to the nearest catch.',
    s: `const fakeFetch = () => Promise.resolve({ data: 'Success' });
fakeFetch()
  .then(res => console.log('Result:', res.data))
  .catch(e => console.error(e));`
  },
  {
    c: 'JavaScript',
    d: 'Medium',
    q: r => `Compare async/await error handling with try/catch versus .catch().`,
    a: 'async/await lets you use synchronous-style try/catch around awaited calls, which reads cleanly; .catch() is still needed for unawaited promises to avoid unhandled rejections.',
    s: `async function run() {
  try {
    const res = await Promise.resolve('Data fetched');
    console.log('async/await output:', res);
  } catch (e) {
    console.error(e);
  }
}
run();`
  },
  {
    c: 'JavaScript',
    d: 'Medium',
    q: r => `Implement a debounce function${r() > 0.5 ? ' with an immediate option' : ''}.`,
    a: 'Debouncing delays invoking a function until input stops for a wait period; useful for search boxes and resize handlers.',
    s: `function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

const log = debounce((msg) => console.log('Debounced:', msg), 100);
log('Call 1');
log('Call 2 (only this runs)');`
  },
  {
    c: 'JavaScript',
    d: 'Medium',
    q: r => `Implement a throttle function.`,
    a: 'Throttling ensures a function runs at most once per interval, regardless of how often it is called — ideal for scroll and mousemove.',
    s: `function throttle(fn, wait) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) { last = now; fn(...args); }
  };
}

const log = throttle((msg) => console.log('Throttled:', msg), 100);
log('Call 1 (runs immediately)');
log('Call 2 (dropped)');`
  },
  {
    c: 'JavaScript',
    d: 'Medium',
    q: r => `Implement a curry function that supports both f(a,b) and f(a)(b).`,
    a: 'Currying transforms a multi-argument function into a sequence of single-argument functions, returning a function until all arguments are collected.',
    s: `function curry(fn) {
  return function curried(...args) {
    return args.length >= fn.length ? fn(...args) : (...next) => curried(...args, ...next);
  };
}

const sum = curry((a, b, c) => a + b + c);
console.log('sum(1)(2)(3):', sum(1)(2)(3));
console.log('sum(1, 2)(3):', sum(1, 2)(3));`
  },
  {
    c: 'JavaScript',
    d: 'Medium',
    q: r => `Implement a memoize function for expensive pure functions.`,
    a: 'Memoization caches results keyed by arguments so repeated calls return instantly; relies on the function being pure.',
    s: `function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const k = JSON.stringify(args);
    return cache.has(k) ? cache.get(k) : (cache.set(k, fn(...args)), cache.get(k));
  };
}

const fast = memoize(x => { console.log('Computing', x); return x * x; });
console.log(fast(5));
console.log(fast(5)); // from cache`
  },
  {
    c: 'JavaScript',
    d: 'Medium',
    q: r => `Implement a deep clone for plain objects and arrays${r() > 0.5 ? ' (handle nested structures)' : ''}.`,
    a: 'Recursively copy objects/arrays; for production use structuredClone or a library that handles cycles, Dates, and special types.',
    s: `function deepClone(v) {
  if (Array.isArray(v)) return v.map(deepClone);
  if (v && typeof v === 'object') {
    const o = {};
    for (const k in v) o[k] = deepClone(v[k]);
    return o;
  }
  return v;
}

const obj = { a: 1, b: { c: 2 } };
const cloned = deepClone(obj);
cloned.b.c = 99;
console.log('Original:', obj);
console.log('Cloned:', cloned);`
  },
  {
    c: 'JavaScript',
    d: 'Easy',
    q: r => `Implement a flatten function for nested arrays${r() > 0.5 ? ' (to a given depth)' : ''}.`,
    a: 'Recursively concatenate nested arrays; Array.prototype.flat(depth) does this natively.',
    s: `function flatten(a, d = Infinity) {
  return d ? a.reduce((acc, x) => acc.concat(Array.isArray(x) ? flatten(x, d - 1) : x), []) : a;
}

console.log(flatten([1, [2, [3, [4]], 5]]));`
  },
  {
    c: 'JavaScript',
    d: 'Easy',
    q: () => `Explain map, filter, and reduce with a short example.`,
    a: 'map transforms each element, filter keeps matches, reduce accumulates to a single value. They avoid manual loops and are chainable.',
    s: `const nums = [1, 2, 3, 4];
const sum = nums.filter(n => n % 2 === 0).map(n => n * 10).reduce((a, b) => a + b, 0);
console.log('Sum of doubled evens:', sum); // 60`
  },
  {
    c: 'JavaScript',
    d: 'Easy',
    q: () => `Explain destructuring and its use with objects and arrays.`,
    a: 'Destructuring extracts values into variables by position (arrays) or name (objects), and supports defaults and renaming.',
    s: `const [a, , b] = [1, 2, 3];
const { name: n, age = 0 } = { name: 'Ada' };
console.log('Destructured:', { a, b, n, age });`
  },
  {
    c: 'JavaScript',
    d: 'Easy',
    q: () => `What is optional chaining (?.) and the nullish coalescing operator (??)?`,
    a: '?. safely accesses nested properties that may be null/undefined; ?? returns its right operand only when the left is null or undefined (unlike || which also triggers on 0/"").',
    s: `const user = { name: 'Alice', address: null };
const city = user?.address?.city ?? 'Default City';
console.log('City:', city);`
  },
  {
    c: 'JavaScript',
    d: 'Medium',
    q: () => `Explain ES modules vs CommonJS and how imports/exports work.`,
    a: 'ES modules use static import/export and are the standard for browsers and modern bundlers; CommonJS uses require/module.exports and is runtime-evaluated (Node).',
    s: `const math = { add: (a, b) => a + b };
console.log('math.add(5, 3):', math.add(5, 3));`
  },
  {
    c: 'JavaScript',
    d: 'Hard',
    q: () => `Explain generators and where they are useful.`,
    a: 'Generators (function*) return iterators that can pause with yield and resume, enabling lazy sequences and cooperative concurrency.',
    s: `function* range(n) {
  for (let i = 0; i < n; i++) yield i;
}
console.log('Generated range:', [...range(5)]);`
  },
  {
    c: 'JavaScript',
    d: 'Hard',
    q: () => `What are Proxy and Reflect used for?`,
    a: 'Proxy intercepts operations on an object (get/set/apply), enabling validation, logging, and reactivity; Reflect provides default traps that keep invariants intact.',
    s: `const p = new Proxy({}, {
  set(t, k, v) { console.log('Setting key', k, 'to', v); t[k] = v; return true; }
});
p.count = 42;
console.log('Proxy object:', p);`
  },
  {
    c: 'TypeScript',
    d: 'Medium',
    q: () => `Explain TypeScript generics with an example.`,
    a: 'Generics parameterize types so functions and containers stay type-safe across many inputs without resorting to any.',
    s: `function first(arr) {
  return arr[0];
}
console.log('first element:', first([10, 20, 30]));`
  },
  {
    c: 'TypeScript',
    d: 'Medium',
    q: () => `What are utility types like Partial, Pick, and Record?`,
    a: 'Built-in mapped/conditional types transform existing types: Partial makes all optional, Pick selects keys, Record maps keys to a value type.',
    s: `const user = { id: 1, name: 'Alex' };
console.log('User preview:', { id: user.id, name: user.name });`
  },
  {
    c: 'TypeScript',
    d: 'Hard',
    q: () => `Explain conditional types and the infer keyword.`,
    a: 'Conditional types select a branch with T extends U ? X : Y; infer captures a type inside the checked branch, e.g. to unwrap a Promise.',
    s: `const value = Promise.resolve(100);
value.then(v => console.log('Resolved value:', v));`
  },
  {
    c: 'TypeScript',
    d: 'Medium',
    q: () => `How do function overloads work in TypeScript?`,
    a: 'Overloads declare several call signatures; the implementation signature is not visible to callers, so each call resolves to a specific overload.',
    s: `function fmt(x) { return String(x); }
console.log('fmt number:', fmt(42));
console.log('fmt string:', fmt('hello'));`
  },
  {
    c: 'TypeScript',
    d: 'Medium',
    q: () => `Explain discriminated unions and exhaustiveness checking.`,
    a: 'A common literal property (the discriminant) lets narrowing switch over members; a never check ensures all cases are handled.',
    s: `function area(s) {
  switch (s.kind) {
    case 'circle': return Math.PI * s.r ** 2;
    case 'rect': return s.w * s.h;
  }
}
console.log('Circle area:', area({ kind: 'circle', r: 5 }));
console.log('Rect area:', area({ kind: 'rect', w: 4, h: 6 }));`
  },
  {
    c: 'TypeScript',
    d: 'Medium',
    q: () => `What are type guards and how do you write a user-defined one?`,
    a: 'Type guards narrow a union at runtime; a function returning x is T lets TS narrow after an if.',
    s: `function isAdmin(u) {
  return u && u.role === 'admin';
}
console.log('isAdmin admin:', isAdmin({ name: 'Alice', role: 'admin' }));
console.log('isAdmin user:', isAdmin({ name: 'Bob', role: 'user' }));`
  },
  {
    c: 'TypeScript',
    d: 'Hard',
    q: () => `Explain mapped types and how to make properties readonly or optional.`,
    a: 'Mapped types iterate keys with "in keyof T" and can add modifiers (readonly/?), enabling transforms like Frozen<T> or DeepPartial<T>.',
    s: `const p = Object.freeze({ x: 1, y: 2 });
console.log('Frozen object:', p);`
  },
  {
    c: 'ReactJS',
    d: 'Easy',
    q: () => `Explain useState and when to use functional updates.`,
    a: 'useState holds component state; use the functional updater form when the next state depends on the previous value to avoid stale closures.',
    s: `import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ padding: 16 }}>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}`
  },
  {
    c: 'ReactJS',
    d: 'Medium',
    q: () => `Explain useEffect and the dependency array, including cleanup.`,
    a: 'useEffect runs side effects after render; the dependency array controls when it re-runs, and a returned function cleans up (e.g., abort fetch, unsubscribe).',
    s: `import { useState, useEffect } from 'react';

export default function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return <div style={{ padding: 16 }}>Seconds active: {seconds}</div>;
}`
  },
  {
    c: 'ReactJS',
    d: 'Medium',
    q: () => `When should you use useMemo and useCallback?`,
    a: 'useMemo caches an expensive computation; useCallback caches a function identity so memoized children do not re-render. Overusing them adds complexity without benefit.',
    s: `import { useState, useMemo } from 'react';

export default function MemoExample() {
  const [count, setCount] = useState(5);
  const squared = useMemo(() => count * count, [count]);

  return (
    <div style={{ padding: 16 }}>
      <p>{count} squared is {squared}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}`
  },
  {
    c: 'ReactJS',
    d: 'Medium',
    q: () => `What is the purpose of useRef and how does it differ from state?`,
    a: 'useRef holds a mutable value that persists across renders without triggering re-renders; commonly used for DOM nodes and previous values.',
    s: `import { useRef, useEffect } from 'react';

export default function AutoFocusInput() {
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);

  return (
    <div style={{ padding: 16 }}>
      <input ref={ref} placeholder="Auto-focused on mount" style={{ padding: 8 }} />
    </div>
  );
}`
  },
  {
    c: 'ReactJS',
    d: 'Medium',
    q: () => `Explain useContext and how to avoid unnecessary re-renders.`,
    a: 'useContext subscribes a component to a provider value; splitting contexts and memoizing values prevents broad re-renders when only part changes.',
    s: `import { createContext, useContext } from 'react';

const ThemeCtx = createContext('dark');

function Display() {
  const theme = useContext(ThemeCtx);
  return <p>Current theme: {theme}</p>;
}

export default function App() {
  return (
    <ThemeCtx.Provider value="emerald-dark">
      <Display />
    </ThemeCtx.Provider>
  );
}`
  },
  {
    c: 'ReactJS',
    d: 'Medium',
    q: () => `How do you build a reusable custom hook?`,
    a: 'Extract stateful logic into a function prefixed use* that calls other hooks; return the state and handlers so multiple components share behavior.',
    s: `import { useState } from 'react';

function useToggle(init = false) {
  const [on, setOn] = useState(init);
  return [on, () => setOn(v => !v)];
}

export default function App() {
  const [on, toggle] = useToggle(false);
  return (
    <div style={{ padding: 16 }}>
      <p>Status: {on ? 'ACTIVE' : 'INACTIVE'}</p>
      <button onClick={toggle}>Toggle Status</button>
    </div>
  );
}`
  },
  {
    c: 'ReactJS',
    d: 'Hard',
    q: () => `Explain React reconciliation, keys, and why stable keys matter.`,
    a: 'React diffs the virtual DOM tree; stable, unique keys let it match elements across renders and preserve state, while array indices as keys cause bugs on reorder.',
    s: `import { useState } from 'react';

export default function ListExample() {
  const [items, setItems] = useState([
    { id: 1, text: 'First task' },
    { id: 2, text: 'Second task' }
  ]);

  return (
    <ul style={{ padding: 16 }}>
      {items.map(it => <li key={it.id}>{it.text}</li>)}
    </ul>
  );
}`
  },
  {
    c: 'ReactJS',
    d: 'Medium',
    q: () => `What is the difference between controlled and uncontrolled components?`,
    a: 'Controlled components store form state in React (value + onChange); uncontrolled read from the DOM via refs/defaultValue. Controlled gives a single source of truth.',
    s: `import { useState } from 'react';

export default function FormExample() {
  const [name, setName] = useState('Alice');
  return (
    <div style={{ padding: 16 }}>
      <input value={name} onChange={e => setName(e.target.value)} style={{ padding: 6 }} />
      <p>Hello, {name}!</p>
    </div>
  );
}`
  },
  {
    c: 'ReactJS',
    d: 'Hard',
    q: () => `How do error boundaries work and what can they catch?`,
    a: 'Class components with getDerivedStateFromError/componentDidCatch catch render and lifecycle errors in their subtree and show a fallback; they cannot catch event-handler errors.',
    s: `import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div style={{ color: 'red', padding: 16 }}>Something went wrong.</div>;
    return <div style={{ padding: 16 }}>All systems normal.</div>;
  }
}

export default ErrorBoundary;`
  },
  {
    c: 'ReactJS',
    d: 'Hard',
    q: () => `Explain React portals and a good use case.`,
    a: 'createPortal renders children into a DOM node outside the parent (e.g., document.body), escaping overflow/stacking contexts for modals and tooltips.',
    s: `import { createPortal } from 'react-dom';

export default function PortalModal() {
  return createPortal(
    <div style={{ padding: 12, border: '1px solid #333', background: '#f5f5f5' }}>
      Portal content rendered at document body
    </div>,
    document.body
  );
}`
  },
  {
    c: 'ReactJS',
    d: 'Hard',
    q: () => `What are Suspense and React.lazy used for?`,
    a: 'React.lazy code-splits a component; Suspense shows a fallback while the chunk loads, improving initial bundle size.',
    s: `import { Suspense } from 'react';

function HeavyComponent() {
  return <div>Loaded component content</div>;
}

export default function App() {
  return (
    <Suspense fallback={<div>Loading component...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}`
  },
  {
    c: 'CSS',
    d: 'Easy',
    q: r => `How do you center an element both horizontally and vertically (${pick(r, ['flexbox', 'grid', 'absolute + transform'])}).`,
    a: 'Flexbox: display:flex; align-items:center; justify-content:center. Grid: place-items:center. Absolute: top/left 50% + translate(-50%,-50%).',
    s: `document.body.innerHTML = \`
  <div style="display: flex; align-items: center; justify-content: center; height: 120px; background: #e0f2fe; border-radius: 8px;">
    <strong>Centered Element</strong>
  </div>
\`;
console.log('DOM updated with centered box.');`
  },
  {
    c: 'CSS',
    d: 'Medium',
    q: () => `Explain CSS Grid vs Flexbox and when to use each.`,
    a: 'Flexbox lays out items in one dimension (row or column); Grid handles two-dimensional layouts. Use Flex for components, Grid for page regions.',
    s: `document.body.innerHTML = \`
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
    <div style="background: #e2e8f0; padding: 12px;">Col 1</div>
    <div style="background: #e2e8f0; padding: 12px;">Col 2</div>
    <div style="background: #e2e8f0; padding: 12px;">Col 3</div>
  </div>
\`;
console.log('Rendered 3-column grid.');`
  },
  {
    c: 'CSS',
    d: 'Medium',
    q: () => `How does CSS specificity decide which rule wins?`,
    a: 'Specificity is (inline, IDs, classes/attributes/pseudo-classes, elements). Later rules with equal specificity win; !important overrides all but other !important.',
    s: `console.log('Specificity calculation:');
console.log('ID (#header): [0, 1, 0, 0]');
console.log('Class (.btn): [0, 0, 1, 0]');
console.log('Element (div): [0, 0, 0, 1]');`
  },
  {
    c: 'CSS',
    d: 'Easy',
    q: () => `Explain the CSS box model.`,
    a: 'Each element is content + padding + border + margin. box-sizing: border-box includes padding/border in the declared width, easing layout math.',
    s: `document.body.innerHTML = \`
  <div style="box-sizing: border-box; width: 200px; padding: 16px; border: 2px solid #6366f1; background: #f8fafc;">
    Border-box width: 200px
  </div>
\`;
console.log('Rendered box model element.');`
  },
  {
    c: 'CSS',
    d: 'Medium',
    q: () => `Explain position: static/relative/absolute/fixed/sticky.`,
    a: 'static is normal flow; relative offsets without leaving flow; absolute is placed relative to the nearest positioned ancestor; fixed to the viewport; sticky toggles between relative and fixed.',
    s: `document.body.innerHTML = \`
  <div style="position: sticky; top: 0; background: #fbbf24; padding: 8px;">Sticky Header</div>
  <div style="height: 200px; padding: 8px;">Scrollable area</div>
\`;
console.log('Rendered sticky header container.');`
  },
  {
    c: 'CSS',
    d: 'Medium',
    q: () => `How do CSS transitions and animations differ?`,
    a: 'Transitions animate between two states triggered by a change; keyframe animations run a sequence on a loop or once with finer control.',
    s: `document.body.innerHTML = \`
  <button style="transition: transform 0.2s; padding: 8px 16px;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
    Hover Me
  </button>
\`;
console.log('Rendered interactive transition button.');`
  },
  {
    c: 'CSS',
    d: 'Medium',
    q: () => `What are CSS custom properties and how do they enable theming?`,
    a: 'Custom properties (--var) are runtime CSS variables that cascade and can be redefined on ancestors, making theming and dark mode straightforward.',
    s: `document.documentElement.style.setProperty('--main-theme', '#10b981');
console.log('CSS Variable set: --main-theme =', document.documentElement.style.getPropertyValue('--main-theme'));`
  },
  {
    c: 'CSS',
    d: 'Easy',
    q: () => `Explain the BEM naming convention.`,
    a: 'Block__Element--Modifier keeps class names flat and predictable: block, block__element, block--modifier.',
    s: `const html = '<div class="card card--featured"><h2 class="card__title">Title</h2></div>';
console.log('BEM structure HTML:', html);`
  },
  {
    c: 'DOM & Web APIs',
    d: 'Easy',
    q: () => `Compare querySelector and getElementById, and classList usage.`,
    a: 'getElementById is fastest for an id; querySelector accepts any CSS selector. classList adds/removes/toggles classes cleanly.',
    s: `document.body.innerHTML = '<div id="item" class="base">Initial Item</div>';
const el = document.getElementById('item');
el.classList.add('active');
console.log('classList after toggle:', el.className);`
  },
  {
    c: 'DOM & Web APIs',
    d: 'Medium',
    q: () => `Explain event delegation and why it is useful.`,
    a: 'Attach one listener to a parent and use event.target to handle children, which works for dynamically added nodes and reduces listener count.',
    s: `document.body.innerHTML = \`
  <ul id="list" style="cursor: pointer;">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
\`;
const list = document.getElementById('list');
list.addEventListener('click', e => {
  if (e.target.matches('li')) console.log('Clicked:', e.target.textContent);
});
console.log('Triggering synthetic click on Item 2:');
list.children[1].click();`
  },
  {
    c: 'DOM & Web APIs',
    d: 'Medium',
    q: () => `How do you fetch data and handle errors and cancellation?`,
    a: 'Use fetch with async/await; check res.ok, parse json, and abort with AbortController to avoid setting state after unmount.',
    s: `const ctrl = new AbortController();
console.log('AbortController created with signal:', ctrl.signal.aborted ? 'Aborted' : 'Active');
ctrl.abort();
console.log('Signal state after abort:', ctrl.signal.aborted ? 'Aborted' : 'Active');`
  },
  {
    c: 'DOM & Web APIs',
    d: 'Easy',
    q: () => `Compare localStorage, sessionStorage, and cookies.`,
    a: 'localStorage persists until cleared; sessionStorage lasts the tab; cookies are sent with requests and have size/expiry controls.',
    s: `localStorage.setItem('demo_key', 'demo_value');
const val = localStorage.getItem('demo_key');
console.log('localStorage retrieved:', val);`
  },
  {
    c: 'DOM & Web APIs',
    d: 'Medium',
    q: () => `What is IntersectionObserver and a common use?`,
    a: 'It efficiently reports when an element enters/leaves the viewport, enabling lazy loading and infinite scroll without scroll listeners.',
    s: `const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => console.log('Intersecting:', e.isIntersecting));
});
console.log('IntersectionObserver initialized successfully.');`
  },
  {
    c: 'Frontend Performance',
    d: 'Medium',
    q: () => `Explain reflow (layout) vs repaint and how to minimize them.`,
    a: 'Reflow recomputes layout (geometry); repaint redraws pixels. Batch DOM reads/writes, avoid layout thrashing, and prefer transforms/opacity which can be GPU-composited.',
    s: `document.body.innerHTML = '<div id="box" style="height: 50px; background: #e2e8f0;">Box</div>';
const box = document.getElementById('box');
const h = box.offsetHeight; // Read (reflow)
box.style.height = (h + 20) + 'px'; // Write
console.log('Batch updated height from', h, 'to', box.offsetHeight);`
  },
  {
    c: 'Frontend Performance',
    d: 'Hard',
    q: () => `How would you reduce a large JavaScript bundle?`,
    a: 'Code-split with dynamic import, tree-shake by importing named exports, lazy-load routes/components, and remove unused dependencies; analyze with a bundle tool.',
    s: `console.log('Bundle optimization strategies:');
console.log('1. Dynamic import() for route-based code splitting');
console.log('2. Tree-shaking unused lodash/date functions');
console.log('3. Analyzing chunks with vite-bundle-visualizer');`
  },
  {
    c: 'Frontend Performance',
    d: 'Medium',
    q: () => `Explain Core Web Vitals (LCP, CLS, INP).`,
    a: 'LCP measures largest content paint; CLS measures layout shift stability; INP measures interaction responsiveness. Optimize images, reserve space, and keep handlers fast.',
    s: `console.log('Core Web Vitals targets:');
console.log('LCP (Largest Contentful Paint) <= 2.5s');
console.log('INP (Interaction to Next Paint) <= 200ms');
console.log('CLS (Cumulative Layout Shift) <= 0.1');`
  },
  {
    c: 'Web Security',
    d: 'Medium',
    q: () => `Explain Cross-Site Scripting (XSS) and how to prevent it.`,
    a: 'XSS injects malicious scripts; prevent by escaping output, using safe frameworks that auto-escape, sanitizing rich text, and setting a Content-Security-Policy.',
    s: `function sanitizeText(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
const userInput = '<script>alert("xss")</script><b>Hello</b>';
console.log('Sanitized output:', sanitizeText(userInput));`
  },
  {
    c: 'Web Security',
    d: 'Medium',
    q: () => `Explain CSRF and how tokens/Cookies defend against it.`,
    a: 'CSRF tricks a logged-in user\'s browser into making unwanted requests; defend with same-site cookies, anti-CSRF tokens, and checking the Origin/Referer.',
    s: `const headers = { 'X-CSRF-Token': 'csrf-token-abc123xyz' };
console.log('Request headers with CSRF protection:', headers);`
  },
  {
    c: 'Web Security',
    d: 'Hard',
    q: () => `Explain CORS and when a preflight request is sent.`,
    a: 'CORS lets a server permit cross-origin reads. A preflight (OPTIONS) is sent for non-simple requests (custom headers, non-GET/POST or special content types).',
    s: `const responseHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};
console.log('CORS headers:', responseHeaders);`
  },
  {
    c: 'Web Security',
    d: 'Medium',
    q: () => `What is a Content Security Policy and why use it?`,
    a: 'CSP whitelists trusted sources for scripts/styles/etc., drastically reducing XSS impact by blocking unauthorized code execution.',
    s: `const csp = "default-src 'self'; script-src 'self' https://trusted.cdn.com";
console.log('Configured CSP:', csp);`
  },
  {
    c: 'Accessibility',
    d: 'Medium',
    q: () => `Explain ARIA roles and when (not) to use them.`,
    a: 'ARIA adds semantics for screen readers but native HTML elements are preferred. Use roles only when no native element fits, and manage focus for dynamic widgets.',
    s: `document.body.innerHTML = \`
  <button aria-expanded="false" aria-controls="menu-list" onclick="this.setAttribute('aria-expanded', this.getAttribute('aria-expanded')==='true'?'false':'true')">
    Toggle Menu
  </button>
  <ul id="menu-list" role="menu">
    <li role="menuitem">Option A</li>
  </ul>
\`;
console.log('Accessible menu rendered.');`
  },
  {
    c: 'Accessibility',
    d: 'Easy',
    q: () => `How do you make an interactive element keyboard accessible?`,
    a: 'Use native focusable elements (button, a), manage focus order, support Enter/Space, and show a visible focus indicator.',
    s: `document.body.innerHTML = \`
  <div tabindex="0" role="button" onkeydown="if(event.key==='Enter'||event.key===' ') console.log('Activated via keyboard!')" style="display:inline-block; padding:8px 16px; background:#e2e8f0; cursor:pointer;">
    Custom Focusable Button
  </div>
\`;
console.log('Focusable button attached with keyboard listener.');`
  },
  {
    c: 'System Design',
    d: 'Hard',
    q: () => `How would you structure state management in a large React app?`,
    a: 'Start with local state and context; introduce a store (Redux/Zustand/Jotai) for shared cross-cutting state, keep server state in a cache (React Query), and colocate feature state.',
    s: `console.log('State architecture layers:');
console.log('- Local Component State: useState / useReducer');
console.log('- Server State & Caching: TanStack React Query');
console.log('- Global Client State: Zustand / Redux Toolkit');`
  },
  {
    c: 'System Design',
    d: 'Hard',
    q: () => `Compare Client-Side Rendering and Server-Side Rendering tradeoffs.`,
    a: 'SSR improves first paint and SEO but shifts work to the server; CSR is simpler and interactive after hydration. Many apps use a hybrid (SSR + hydration or streaming).',
    s: `console.log('Rendering Tradeoffs:');
console.log('CSR: Fast client navigations, heavier initial JS payload.');
console.log('SSR: Faster FCP/LCP, excellent SEO, requires server compute.');`
  },
  {
    c: 'System Design',
    d: 'Hard',
    q: () => `What is a micro-frontend architecture and when is it worth it?`,
    a: 'Micro-frontends split a UI into independently built/deployed pieces, enabling team autonomy, but add complexity in integration, shared deps, and consistency.',
    s: `console.log('Micro-frontends pattern:');
console.log('Host App -> dynamic import("remoteApp/HeaderComponent")');`
  },
]

// ---------- generation ----------
function buildAlgo(target) {
  const out = []
  let id = 1_000_000
  let idx = 0
  while (out.length < target) {
    const fam = ALGO[idx % ALGO.length]
    const seed = 1000 + idx
    const rng = mulberry32(seed)
    const sample = fam.sample(rng)
    const sampleText = typeof sample === 'string' ? sample : sample.text
    const callCode = typeof sample === 'object' && sample.call ? sample.call : (fam.call ? fam.call(rng, sampleText) : '')
    const fullCode = callCode ? `${fam.sol}\n\n// Example execution:\n${callCode}` : fam.sol

    out.push({
      id: id++,
      category: fam.c,
      difficulty: fam.d,
      question: `${fam.stem}\n\nExample: ${sampleText}.`,
      answer: fam.explain,
      code: fullCode,
      source: 'LeetCode-style',
    })
    idx++
  }
  return out
}

function buildFe(target) {
  const out = []
  let id = 2_000_000
  let idx = 0
  const leads = ['Explain', 'Describe', 'What is', 'How would you implement', 'Compare', 'Walk through']
  while (out.length < target) {
    const fam = FE[idx % FE.length]
    const rng = mulberry32(5000 + idx)
    const lead = pick(rng, leads)
    const q = fam.q(rng)
    const phrased = q.charAt(0).toLowerCase() + q.slice(1)
    out.push({
      id: id++,
      category: fam.c,
      difficulty: fam.d,
      question: `${lead} ${phrased.charAt(0).toUpperCase() + phrased.slice(1)}`,
      answer: fam.a,
      ...(fam.s ? { code: fam.s } : {}),
      source: 'FrontendMasters-style',
    })
    idx++
  }
  return out
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const algo = buildAlgo(6000)
  const fe = buildFe(4000)
  await writeFile(resolve(OUT_DIR, 'leetcode-style.json'), JSON.stringify(algo, null, 2) + '\n', 'utf8')
  await writeFile(resolve(OUT_DIR, 'frontendmasters-style.json'), JSON.stringify(fe, null, 2) + '\n', 'utf8')
  console.log(`Wrote ${algo.length} LeetCode-style + ${fe.length} FrontendMasters-style questions`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
