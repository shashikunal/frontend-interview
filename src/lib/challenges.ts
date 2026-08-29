// Seeded-random practice challenge generator with runnable test cases.
// Tests call user functions via thunks so failures are reported per-case.

import type { Question } from '../models/question'

export interface GeneratedChallenge {
  title: string
  instructions: string
  starter: string
  solution: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

type Rng = () => number

function mulberry32(seed: number): Rng {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pick = <T,>(rng: Rng, arr: T[]): T => arr[Math.floor(rng() * arr.length)]
const randInt = (rng: Rng, min: number, max: number) => min + Math.floor(rng() * (max - min + 1))
const randWord = (rng: Rng, len: number) =>
  Array.from({ length: len }, () => String.fromCharCode(97 + randInt(rng, 0, 25))).join('')
const randArr = (rng: Rng, len: number, max = 50) => Array.from({ length: len }, () => randInt(rng, -max, max))

// [name, argsForUserFn, expected]
type Check = [string, unknown[], unknown]

interface Template {
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  fnName: string
  solution: string
  make: (rng: Rng) => { instructions: string; checks: Check[] }
}

const TEMPLATES: Template[] = [
  {
    title: 'Reverse a String',
    difficulty: 'Easy',
    fnName: 'reverseString',
    solution: `// Reverse a string by splitting into characters, reversing, and joining back.
function reverseString(s) {
  return s.split('').reverse().join('')
}

// --- Demo ---
console.log(reverseString('hello')) // "olleh"
console.log(reverseString(''))      // ""
console.log(reverseString('a'))     // "a"`,
    make: rng => {
      const s = randWord(rng, randInt(rng, 4, 10))
      return {
        instructions: `Implement reverseString(s) returning the reversed string.\n\nExample: reverseString("hello") → "olleh"`,
        checks: [
          [`reverseString(${JSON.stringify(s)})`, [s], s.split('').reverse().join('')],
          ['empty string', [''], ''],
          ['single char', ['a'], 'a'],
        ],
      }
    },
  },
  {
    title: 'FizzBuzz Array',
    difficulty: 'Easy',
    fnName: 'fizzBuzz',
    solution: `// Build an array of 1..n, replacing multiples of 3/5 with Fizz/Buzz.
function fizzBuzz(n) {
  const res = []
  for (let i = 1; i <= n; i++) {
    res.push(i % 15 === 0 ? 'FizzBuzz' : i % 3 === 0 ? 'Fizz' : i % 5 === 0 ? 'Buzz' : String(i))
  }
  return res
}

// --- Demo ---
console.log(fizzBuzz(5))  // ["1","2","Fizz","4","Buzz"]
console.log(fizzBuzz(15).slice(0, 6)) // ["1","2","Fizz","4","Buzz","Fizz"]`,
    make: rng => {
      const n = randInt(rng, 15, 30)
      const expected = Array.from({ length: n }, (_, i) => {
        const x = i + 1
        return x % 15 === 0 ? 'FizzBuzz' : x % 3 === 0 ? 'Fizz' : x % 5 === 0 ? 'Buzz' : String(x)
      })
      return {
        instructions: `Implement fizzBuzz(n) returning an array of 1..n where multiples of 3 → "Fizz", multiples of 5 → "Buzz", both → "FizzBuzz", else the number as a STRING.\n\nExample: fizzBuzz(5) → ["1","2","Fizz","4","Buzz"]`,
        checks: [
          [`fizzBuzz(${n})`, [n], expected],
          ['fizzBuzz(5)', [5], ['1', '2', 'Fizz', '4', 'Buzz']],
        ],
      }
    },
  },
  {
    title: 'Palindrome Check',
    difficulty: 'Easy',
    fnName: 'isPalindrome',
    solution: `// A string is a palindrome when it reads the same forwards and backwards.
function isPalindrome(s) {
  return s === s.split('').reverse().join('')
}

// --- Demo ---
console.log(isPalindrome('racecar')) // true
console.log(isPalindrome('hello'))   // false
console.log(isPalindrome(''))        // true`,
    make: rng => {
      const base = randWord(rng, randInt(rng, 3, 5))
      const pal = base + base.split('').reverse().join('')
      return {
        instructions: `Implement isPalindrome(s) returning true if s reads the same forwards and backwards.\n\nExample: isPalindrome("racecar") → true`,
        checks: [
          [`"${pal}"`, [pal], true],
          ['"racecar"', ['racecar'], true],
          ['"hello"', ['hello'], false],
          ['empty string', [''], true],
        ],
      }
    },
  },
  {
    title: 'Two Sum Indices',
    difficulty: 'Medium',
    fnName: 'twoSum',
    solution: `// Brute-force: check every pair until their sum equals the target.
// (A hash-map approach runs in O(n) instead of O(n^2).)
function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j]
    }
  }
}

// --- Demo ---
console.log(twoSum([2, 7, 11, 15], 9)) // [0, 1]
console.log(twoSum([3, 2, 4], 6))      // [1, 2]`,
    make: rng => {
      const nums = randArr(rng, randInt(rng, 5, 8), 20)
      const i = randInt(rng, 0, nums.length - 2)
      const j = randInt(rng, i + 1, nums.length - 1)
      const target = nums[i] + nums[j]
      return {
        instructions: `Implement twoSum(nums, target) returning indices [i, j] (i < j) of two numbers summing to target. Exactly one solution exists.\n\nExample: twoSum([2,7,11,15], 9) → [0,1]`,
        checks: [
          [`target ${target} in ${JSON.stringify(nums)}`, [nums, target], [i, j]],
          ['[2,7,11,15] target 9', [[2, 7, 11, 15], 9], [0, 1]],
        ],
      }
    },
  },
  {
    title: 'Max Subarray Sum (Kadane)',
    difficulty: 'Medium',
    fnName: 'maxSubarraySum',
    solution: `// Kadane's algorithm: track the best sum ending at the current position.
function maxSubarraySum(nums) {
  let best = -Infinity, cur = 0
  for (const x of nums) {
    cur = Math.max(x, cur + x)
    best = Math.max(best, cur)
  }
  return best
}

// --- Demo ---
console.log(maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4])) // 6
console.log(maxSubarraySum([-3, -1, -4]))                    // -1`,
    make: rng => {
      const nums = randArr(rng, randInt(rng, 5, 10), 15)
      let best = -Infinity
      let cur = 0
      for (const x of nums) {
        cur = Math.max(x, cur + x)
        best = Math.max(best, cur)
      }
      return {
        instructions: `Implement maxSubarraySum(nums) returning the largest sum of any contiguous subarray.\n\nExample: maxSubarraySum([-2,1,-3,4,-1,2,1,-5,4]) → 6`,
        checks: [
          [`${JSON.stringify(nums)}`, [nums], best],
          ['mixed classic', [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], 6],
          ['all negative', [[-3, -1, -4]], -1],
        ],
      }
    },
  },
  {
    title: 'Fibonacci Nth',
    difficulty: 'Easy',
    fnName: 'fib',
    solution: `// Iterative O(n) fibonacci — avoids the exponential cost of naive recursion.
function fib(n) {
  if (n < 2) return n
  let a = 0, b = 1
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b]
  return b
}

// --- Demo ---
console.log(fib(0))  // 0
console.log(fib(10)) // 55
console.log(fib(20)) // 6765`,
    make: rng => {
      const n = randInt(rng, 8, 30)
      const memo: number[] = [0, 1]
      for (let i = 2; i <= 40; i++) memo[i] = memo[i - 1] + memo[i - 2]
      return {
        instructions: `Implement fib(n): fib(0)=0, fib(1)=1.\n\nExample: fib(10) → 55`,
        checks: [
          [`fib(${n})`, [n], memo[n]],
          ['fib(0)', [0], 0],
          ['fib(10)', [10], 55],
        ],
      }
    },
  },
  {
    title: 'Chunk an Array',
    difficulty: 'Easy',
    fnName: 'chunk',
    solution: `// Split an array into chunks of the given size (last chunk may be shorter).
function chunk(arr, size) {
  const res = []
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size))
  return res
}

// --- Demo ---
console.log(chunk([1, 2, 3, 4, 5], 2))     // [[1,2],[3,4],[5]]
console.log(chunk([1, 2, 3, 4, 5], 3))     // [[1,2,3],[4,5]]`,
    make: rng => {
      const size = randInt(rng, 2, 4)
      const arr = randArr(rng, randInt(rng, 6, 11), 9)
      const expected: number[][] = []
      for (let i = 0; i < arr.length; i += size) expected.push(arr.slice(i, i + size))
      return {
        instructions: `Implement chunk(arr, size) splitting arr into sub-arrays of length size (last may be shorter).\n\nExample: chunk([1,2,3,4,5], 2) → [[1,2],[3,4],[5]]`,
        checks: [
          [`${JSON.stringify(arr)} by ${size}`, [arr, size], expected],
          ['[1,2,3,4,5] by 2', [[1, 2, 3, 4, 5], 2], [[1, 2], [3, 4], [5]]],
        ],
      }
    },
  },
  {
    title: 'First Non-Repeating Character',
    difficulty: 'Medium',
    fnName: 'firstUniqueChar',
    solution: `// The first character whose first and last index in the string match is unique.
function firstUniqueChar(s) {
  for (const ch of s) {
    if (s.indexOf(ch) === s.lastIndexOf(ch)) return ch
  }
  return ''
}

// --- Demo ---
console.log(firstUniqueChar('swiss')) // "w"
console.log(firstUniqueChar('aabb'))  // ""`,
    make: rng => {
      const w = randWord(rng, 6) + randWord(rng, 3)
      let expected = ''
      for (const ch of w) if (w.indexOf(ch) === w.lastIndexOf(ch)) { expected = ch; break }
      return {
        instructions: `Implement firstUniqueChar(s) returning the first char appearing exactly once, or "" if none.\n\nExample: firstUniqueChar("swiss") → "w"`,
        checks: [
          [`"${w}"`, [w], expected],
          ['"swiss"', ['swiss'], 'w'],
          ['"aabb"', ['aabb'], ''],
        ],
      }
    },
  },
  {
    title: 'Move Zeros to End',
    difficulty: 'Easy',
    fnName: 'moveZeros',
    solution: `// Keep non-zeros in order, then append all zeros at the end (new array).
function moveZeros(arr) {
  const others = arr.filter(x => x !== 0)
  return [...others, ...arr.filter(x => x === 0)]
}

// --- Demo ---
console.log(moveZeros([0, 1, 0, 3, 12])) // [1, 3, 12, 0, 0]
console.log(moveZeros([1, 2, 3]))        // [1, 2, 3]`,
    make: rng => {
      const arr = randArr(rng, randInt(rng, 6, 10), 6)
      for (let k = 0; k < 3; k++) arr[randInt(rng, 0, arr.length - 1)] = 0
      const expected = [...arr.filter(x => x !== 0), ...arr.filter(x => x === 0)]
      return {
        instructions: `Implement moveZeros(arr) moving all zeros to the end while preserving order of other elements. Return a NEW array.\n\nExample: moveZeros([0,1,0,3,12]) → [1,3,12,0,0]`,
        checks: [
          [`${JSON.stringify(arr)}`, [arr], expected],
          ['[0,1,0,3,12]', [[0, 1, 0, 3, 12]], [1, 3, 12, 0, 0]],
        ],
      }
    },
  },
  {
    title: 'Count Vowels',
    difficulty: 'Easy',
    fnName: 'countVowels',
    solution: `// Count a/e/i/o/u case-insensitively using a regular expression.
function countVowels(s) {
  return (s.match(/[aeiou]/gi) || []).length
}

// --- Demo ---
console.log(countVowels('Hello World')) // 3
console.log(countVowels('rhythm'))      // 0`,
    make: rng => {
      const vowels = 'aeiou'
      const s = Array.from({ length: randInt(rng, 8, 14) }, () =>
        rng() > 0.6 ? pick(rng, vowels.split('')) : randWord(rng, 1)
      ).join('')
      const expected = s.split('').filter(c => vowels.includes(c)).length
      return {
        instructions: `Implement countVowels(s) counting a/e/i/o/u case-insensitively.\n\nExample: countVowels("Hello World") → 3`,
        checks: [
          [`"${s}"`, [s], expected],
          ['"Hello World"', ['Hello World'], 3],
        ],
      }
    },
  },
  {
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    fnName: 'containsDuplicate',
    solution: `// True if any value appears at least twice. A Set removes duplicates.
function containsDuplicate(nums) {
  return new Set(nums).size !== nums.length
}

// --- Demo ---
console.log(containsDuplicate([1, 2, 3, 1])) // true
console.log(containsDuplicate([1, 2, 3, 4])) // false`,
    make: rng => {
      const n = randInt(rng, 4, 8)
      const base = Array.from({ length: n }, () => randInt(rng, 1, n))
      const dup = [...base.slice(0, -1), base[0]]
      return {
        instructions: 'Implement containsDuplicate(nums) returning true if any number appears more than once.\\n\\nExample: containsDuplicate([1,2,3,1]) → true',
        checks: [
          [`${JSON.stringify(dup)}`, [dup], true],
          ['[1,2,3,4]', [[1, 2, 3, 4]], false],
        ],
      }
    },
  },
  {
    title: 'Valid Anagram',
    difficulty: 'Easy',
    fnName: 'isAnagram',
    solution: `// Two strings are anagrams when they share the same character counts.
function isAnagram(a, b) {
  if (a.length !== b.length) return false
  const count = {}
  for (const ch of a) count[ch] = (count[ch] || 0) + 1
  for (const ch of b) {
    if (!count[ch]) return false
    count[ch]--
  }
  return true
}

// --- Demo ---
console.log(isAnagram('listen', 'silent')) // true
console.log(isAnagram('rat', 'car'))       // false`,
    make: rng => {
      const w = randWord(rng, 5)
      const chars = w.split('')
      for (let i = chars.length - 1; i > 0; i--) {
        const j = randInt(rng, 0, i)
        ;[chars[i], chars[j]] = [chars[j], chars[i]]
      }
      const anag = chars.join('')
      return {
        instructions: 'Implement isAnagram(a, b) returning true if b is an anagram of a (same letters, different order).\\n\\nExample: isAnagram("listen","silent") → true',
        checks: [
          [`"${w}" vs "${anag}"`, [w, anag], true],
          ['"rat" vs "car"', ['rat', 'car'], false],
        ],
      }
    },
  },
  {
    title: 'Power of Two',
    difficulty: 'Easy',
    fnName: 'isPowerOfTwo',
    solution: `// A power of two has exactly one bit set: n > 0 && (n & (n - 1)) === 0.
function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0
}

// --- Demo ---
console.log(isPowerOfTwo(16)) // true
console.log(isPowerOfTwo(3))  // false`,
    make: rng => {
      const p = 2 ** randInt(rng, 1, 6)
      return {
        instructions: 'Implement isPowerOfTwo(n) returning true if n is a power of two (1, 2, 4, 8, ...).\\n\\nExample: isPowerOfTwo(16) → true',
        checks: [
          [`${p}`, [p], true],
          ['3', [3], false],
          ['0', [0], false],
        ],
      }
    },
  },
  {
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    fnName: 'climbStairs',
    solution: `// Ways to climb n steps (1 or 2 at a time) follow the Fibonacci sequence.
function climbStairs(n) {
  let a = 1, b = 1
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b]
  return b
}

// --- Demo ---
console.log(climbStairs(2)) // 2
console.log(climbStairs(3)) // 3`,
    make: rng => {
      const n = randInt(rng, 3, 8)
      let a = 1, b = 1
      for (let i = 2; i <= n; i++) [a, b] = [b, a + b]
      const expected = b
      return {
        instructions: 'Implement climbStairs(n): number of distinct ways to reach step n taking 1 or 2 steps at a time.\\n\\nExample: climbStairs(3) → 3',
        checks: [
          [`climbStairs(${n})`, [n], expected],
          ['climbStairs(2)', [2], 2],
          ['climbStairs(3)', [3], 3],
        ],
      }
    },
  },
  {
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    fnName: 'maxProfit',
    solution: `// Track the lowest price seen; profit at each day is price - min so far.
function maxProfit(prices) {
  let min = Infinity, best = 0
  for (const p of prices) {
    min = Math.min(min, p)
    best = Math.max(best, p - min)
  }
  return best
}

// --- Demo ---
console.log(maxProfit([7,1,5,3,6,4])) // 5
console.log(maxProfit([7,6,4,3,1]))   // 0`,
    make: rng => {
      const prices = randArr(rng, randInt(rng, 4, 7), 20).map(x => Math.abs(x) + 1)
      let min = Infinity, best = 0
      for (const p of prices) {
        min = Math.min(min, p)
        best = Math.max(best, p - min)
      }
      return {
        instructions: 'Implement maxProfit(prices): maximum profit from one buy and one sell. Return 0 if none.\\n\\nExample: maxProfit([7,1,5,3,6,4]) → 5',
        checks: [
          [`${JSON.stringify(prices)}`, [prices], best],
          ['[7,6,4,3,1]', [[7, 6, 4, 3, 1]], 0],
        ],
      }
    },
  },
  {
    title: 'Single Number',
    difficulty: 'Easy',
    fnName: 'singleNumber',
    solution: `// XOR cancels out duplicate values, leaving only the unique element.
function singleNumber(nums) {
  return nums.reduce((acc, x) => acc ^ x, 0)
}

// --- Demo ---
console.log(singleNumber([4, 1, 2, 1, 2])) // 4`,
    make: rng => {
      const pair = randArr(rng, 3, 9)
      const single = randInt(rng, 1, 20)
      const nums = [...pair, ...pair, single].sort(() => rng() - 0.5)
      return {
        instructions: 'Implement singleNumber(nums): every element appears twice except one. Return the unique one.\\n\\nExample: singleNumber([4,1,2,1,2]) → 4',
        checks: [
          [`${JSON.stringify(nums)}`, [nums], single],
        ],
      }
    },
  },
  {
    title: 'Remove Duplicates from Sorted Array',
    difficulty: 'Easy',
    fnName: 'removeDuplicates',
    solution: `// Two pointers: keep unique elements at the front, return their count.
function removeDuplicates(nums) {
  if (nums.length === 0) return 0
  let k = 0
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[k]) nums[++k] = nums[i]
  }
  return k + 1
}

// --- Demo ---
console.log(removeDuplicates([1, 1, 2]))           // 2
console.log(removeDuplicates([0, 0, 1, 1, 2, 2, 3])) // 4`,
    make: () => {
      const nums = [0, 0, 1, 1, 2, 2, 3]
      return {
        instructions: 'Implement removeDuplicates(nums) (already sorted): return the count of unique elements kept at the front.\\n\\nExample: removeDuplicates([0,0,1,1,2,2,3]) → 4',
        checks: [
          [`${JSON.stringify(nums)}`, [nums], 4],
          ['[1,1,2]', [[1, 1, 2]], 2],
        ],
      }
    },
  },
  {
    title: 'Roman to Integer',
    difficulty: 'Easy',
    fnName: 'romanToInt',
    solution: `// Subtract when a smaller value precedes a larger one, otherwise add.
function romanToInt(s) {
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  let total = 0
  for (let i = 0; i < s.length; i++) {
    const cur = map[s[i]]
    const next = map[s[i + 1]] || 0
    total += cur < next ? -cur : cur
  }
  return total
}

// --- Demo ---
console.log(romanToInt('III'))   // 3
console.log(romanToInt('LVIII')) // 58
console.log(romanToInt('MCMXCIV')) // 1994`,
    make: () => ({
      instructions: 'Implement romanToInt(s): convert a Roman numeral string to its integer value.\\n\\nExample: romanToInt("III") → 3',
      checks: [
        ['"III"', ['III'], 3],
        ['"LVIII"', ['LVIII'], 58],
        ['"MCMXCIV"', ['MCMXCIV'], 1994],
      ],
    }),
  },
  {
    title: 'Valid Parentheses',
    difficulty: 'Medium',
    fnName: 'isValid',
    solution: `// Use a stack; every closer must match the most recently opened bracket.
function isValid(s) {
  const map = { ')': '(', ']': '[', '}': '{' }
  const stack = []
  for (const ch of s) {
    if (ch in map) {
      if (stack.pop() !== map[ch]) return false
    } else {
      stack.push(ch)
    }
  }
  return stack.length === 0
}

// --- Demo ---
console.log(isValid('()[]{}')) // true
console.log(isValid('(]'))     // false`,
    make: rng => {
      const samples = ['()[]{}', '()[{}]', '(]', '([)]', '{[]}']
      const s = samples[randInt(rng, 0, samples.length - 1)]
      const valid = s === '()[]{}' || s === '()[{}]' || s === '{[]}'
      return {
        instructions: 'Implement isValid(s): true if every bracket is closed in the correct order.\\n\\nExample: isValid("()[]{}") → true',
        checks: [
          [`"${s}"`, [s], valid],
          ['"(]"', ['(]'], false],
        ],
      }
    },
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    fnName: 'lengthOfLongestSubstring',
    solution: `// Sliding window with a Set; shrink from the left when a duplicate appears.
function lengthOfLongestSubstring(s) {
  const seen = new Set()
  let left = 0, best = 0
  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) seen.delete(s[left++])
    seen.add(s[right])
    best = Math.max(best, seen.size)
  }
  return best
}

// --- Demo ---
console.log(lengthOfLongestSubstring('abcabcbb')) // 3
console.log(lengthOfLongestSubstring('bbbbb'))    // 1`,
    make: () => ({
      instructions: 'Implement lengthOfLongestSubstring(s): length of the longest substring with all unique characters.\\n\\nExample: lengthOfLongestSubstring("abcabcbb") → 3',
      checks: [
        ['"abcabcbb"', ['abcabcbb'], 3],
        ['"bbbbb"', ['bbbbb'], 1],
        ['"pwwkew"', ['pwwkew'], 3],
      ],
    }),
  },
  {
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    fnName: 'productExceptSelf',
    solution: `// Combine left and right prefix products without using division.
function productExceptSelf(nums) {
  const n = nums.length
  const res = new Array(n).fill(1)
  let left = 1
  for (let i = 0; i < n; i++) { res[i] = left; left *= nums[i] }
  let right = 1
  for (let i = n - 1; i >= 0; i--) { res[i] *= right; right *= nums[i] }
  return res
}

// --- Demo ---
console.log(productExceptSelf([1, 2, 3, 4])) // [24, 12, 8, 6]`,
    make: rng => {
      const nums = randArr(rng, randInt(rng, 4, 6), 5).map(x => Math.abs(x) + 1)
      const n = nums.length
      const res = new Array(n).fill(1)
      let left = 1
      for (let i = 0; i < n; i++) { res[i] = left; left *= nums[i] }
      let right = 1
      for (let i = n - 1; i >= 0; i--) { res[i] *= right; right *= nums[i] }
      return {
        instructions: 'Implement productExceptSelf(nums): array where each element is the product of all others (no division).\\n\\nExample: productExceptSelf([1,2,3,4]) → [24,12,8,6]',
        checks: [
          [`${JSON.stringify(nums)}`, [nums], res],
        ],
      }
    },
  },
  {
    title: 'Merge Intervals',
    difficulty: 'Medium',
    fnName: 'merge',
    solution: `// Sort by start, then merge each interval into the previous when overlapping.
function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0])
  const res = [intervals[0]]
  for (let i = 1; i < intervals.length; i++) {
    const last = res[res.length - 1]
    if (intervals[i][0] <= last[1]) last[1] = Math.max(last[1], intervals[i][1])
    else res.push(intervals[i])
  }
  return res
}

// --- Demo ---
console.log(merge([[1, 3], [2, 6], [8, 10], [15, 18]])) // [[1,6],[8,10],[15,18]]`,
    make: () => ({
      instructions: 'Implement merge(intervals): merge all overlapping intervals into one.\\n\\nExample: merge([[1,3],[2,6],[8,10],[15,18]]) → [[1,6],[8,10],[15,18]]',
      checks: [
        ['[[1,3],[2,6],[8,10],[15,18]]', [[[1, 3], [2, 6], [8, 10], [15, 18]]], [[1, 6], [8, 10], [15, 18]]],
        ['[[1,4],[4,5]]', [[[1, 4], [4, 5]]], [[1, 5]]],
      ],
    }),
  },
  {
    title: 'Coin Change',
    difficulty: 'Medium',
    fnName: 'coinChange',
    solution: `// DP: dp[a] = minimum coins to make amount a, or -1 if impossible.
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity)
  dp[0] = 0
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1)
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount]
}

// --- Demo ---
console.log(coinChange([1, 2, 5], 11)) // 3
console.log(coinChange([2], 3))       // -1`,
    make: () => ({
      instructions: 'Implement coinChange(coins, amount): fewest coins to make amount, or -1 if impossible.\\n\\nExample: coinChange([1,2,5], 11) → 3',
      checks: [
        ['coins [1,2,5] amount 11', [[1, 2, 5], 11], 3],
        ['coins [2] amount 3', [[2], 3], -1],
      ],
    }),
  },
  {
    title: 'Number of Islands',
    difficulty: 'Medium',
    fnName: 'numIslands',
    solution: `// DFS from each '1' to sink its whole island, counting each start.
function numIslands(grid) {
  if (!grid.length) return 0
  const rows = grid.length, cols = grid[0].length
  let count = 0
  const sink = (r, c) => {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] === '0') return
    grid[r][c] = '0'
    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1)
  }
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (grid[r][c] === '1') { sink(r, c); count++ }
  return count
}

// --- Demo ---
console.log(numIslands([
  ['1','1','0','0','0'],
  ['1','1','0','0','0'],
  ['0','0','1','0','0'],
  ['0','0','0','1','1'],
])) // 3`,
    make: () => {
      const grid = [
        ['1', '1', '0', '0', '0'],
        ['1', '1', '0', '0', '0'],
        ['0', '0', '1', '0', '0'],
        ['0', '0', '0', '1', '1'],
      ]
      return {
        instructions: 'Implement numIslands(grid): count connected groups of "1"s (4-directionally adjacent) in a 2D grid.\\n\\nExample returns 3 for the classic sample grid.',
        checks: [
          ['sample grid', [grid], 3],
        ],
      }
    },
  },
  {
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    fnName: 'trap',
    solution: `// Two-pointer: water above i is min(maxLeft, maxRight) - height[i].
function trap(height) {
  let l = 0, r = height.length - 1, leftMax = 0, rightMax = 0, total = 0
  while (l < r) {
    if (height[l] < height[r]) {
      leftMax = Math.max(leftMax, height[l])
      total += leftMax - height[l]
      l++
    } else {
      rightMax = Math.max(rightMax, height[r])
      total += rightMax - height[r]
      r--
    }
  }
  return total
}

// --- Demo ---
console.log(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])) // 6`,
    make: () => ({
      instructions: 'Implement trap(height): total water trapped after raining.\\n\\nExample: trap([0,1,0,2,1,0,1,3,2,1,2,1]) → 6',
      checks: [
        ['[0,1,0,2,1,0,1,3,2,1,2,1]', [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], 6],
        ['[4,2,0,3,2,5]', [[4, 2, 0, 3, 2, 5]], 9],
      ],
    }),
  },
]

function buildStarter(tpl: Template, checks: Check[], instructions: string): string {
  const lines = checks.map(
    ([name, args, expected]) =>
      `check(${JSON.stringify(name)}, () => ${tpl.fnName}(${args.map(a => JSON.stringify(a)).join(', ')}), ${JSON.stringify(expected)});`
  )
  return `/**
 * ${tpl.title}
 *
${instructions.split('\n').map(l => ' * ' + l).join('\n')}
 */

function ${tpl.fnName}() {
  // TODO: implement — arguments shown in the test calls below
}

/* ---- Tests (do not modify) ---- */
${lines.join('\n')}
`
}

export function generateChallenge(seed: number): GeneratedChallenge {
  const rng = mulberry32(seed)
  const tpl = pick(rng, TEMPLATES)
  const { instructions, checks } = tpl.make(rng)
  return { title: tpl.title, instructions, starter: buildStarter(tpl, checks, instructions), solution: tpl.solution, difficulty: tpl.difficulty }
}

// Build a large catalog of LeetCode-style challenges by instantiating the
// template pool with many different seeds. Each entry is a complete, valid
// challenge with a correct reference solution and difficulty tier.
export function buildLeetCodeCatalog(count = 500): Question[] {
  const out: Question[] = []
  const total = TEMPLATES.length
  for (let i = 0; i < count; i++) {
    const rng = mulberry32((7919 + i * 2654435761) >>> 0)
    const tpl = TEMPLATES[i % total]
    const { instructions } = tpl.make(rng)
    const variant = Math.floor(i / total) + 1
    const tier = tpl.difficulty === 'Hard' ? 'Hard' : tpl.difficulty === 'Medium' ? 'Medium' : 'Easy'
    out.push({
      id: 5000 + i,
      category: `Algorithms · ${tier}`,
      difficulty: tpl.difficulty,
      question: `${tpl.title} — practice set ${variant}`,
      answer: instructions,
      code: tpl.solution,
    })
  }
  return out
}
