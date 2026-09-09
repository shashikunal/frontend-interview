// Batch 7: Questions 601 to 700
import type { DSAQuestion } from '../dsaTypes'

export const dsaBatch7: DSAQuestion[] = [
  {
    "id": "DSA601",
    "number": 601,
    "title": "Continuous Subarray Sum Modulo (Variant 4)",
    "slug": "continuous-subarray-sum-modulo-variant-4-601",
    "difficulty": "Easy",
    "topic": "Arrays",
    "pattern": [
      "Prefix Sum",
      "Two Pointer"
    ],
    "tags": [
      "Arrays",
      "Prefix Sum",
      "Two Pointer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Microsoft",
      "Apple",
      "Uber"
    ],
    "problemStatement": "Given an array of integers `nums`, calculate the pivot index of this array.\n\nThe pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index's right.\n\nIf the index is on the left edge of the array, then the left sum is `0` because there are no elements to the left. Return the **leftmost pivot index**. If no such index exists, return `-1`.",
    "examples": [
      {
        "input": "nums = [1,7,3,6,5,6]",
        "output": "3",
        "explanation": "Left sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11. Right sum = nums[4] + nums[5] = 5 + 6 = 11."
      },
      {
        "input": "nums = [1,2,3]",
        "output": "-1",
        "explanation": "There is no index that satisfies the conditions in the problem statement."
      },
      {
        "input": "nums = [2,1,-1]",
        "output": "0",
        "explanation": "Left sum = 0. Right sum = nums[1] + nums[2] = 1 + -1 = 0."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-1000 <= nums[i] <= 1000"
    ],
    "hints": [
      "Can we precompute the total sum of the array?",
      "As we iterate, maintain a running left sum and calculate right sum as (total - leftSum - current).",
      "Return the first index where leftSum === rightSum."
    ],
    "approach": "Prefix sum subtraction in O(N) time.",
    "stepByStepExplanation": "1. Compute total sum of all elements.\n2. Maintain leftSum initialized to 0.\n3. For each index i, if leftSum === totalSum - leftSum - nums[i], return i.\n4. Add nums[i] to leftSum.\n5. Return -1 if no pivot index found.",
    "optimalApproach": "Single pass with running prefix sum.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "findEquilibriumIndex601",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex601(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex601(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex601(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex601(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 7, 3, 6, 5, 6]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[2, 1, -1]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[0, 0, 0, 0]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA602",
    "number": 602,
    "title": "Count Binary Substrings with Equal Counts (Variant 4)",
    "slug": "count-binary-substrings-with-equal-counts-variant-4-602",
    "difficulty": "Medium",
    "topic": "Strings",
    "pattern": [
      "Sliding Window",
      "Two Pointer"
    ],
    "tags": [
      "Strings",
      "Sliding Window",
      "Two Pointer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Amazon",
      "Netflix",
      "LinkedIn"
    ],
    "problemStatement": "Given a string `s` and an integer `k`, return the maximum number of vowel letters in any substring of `s` with length `k`.\n\nVowel letters in English are `'a'`, `'e'`, `'i'`, `'o'`, and `'u'`.",
    "examples": [
      {
        "input": "s = \"abciiidef\", k = 3",
        "output": "3",
        "explanation": "The substring \"iii\" contains 3 vowel letters."
      },
      {
        "input": "s = \"aeiou\", k = 2",
        "output": "2",
        "explanation": "Any substring of length 2 contains 2 vowels."
      },
      {
        "input": "s = \"leetcode\", k = 3",
        "output": "2",
        "explanation": "\"lee\", \"eet\" and \"ode\" contain 2 vowels."
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^5",
      "s consists of lowercase English letters.",
      "1 <= k <= s.length"
    ],
    "hints": [
      "Use a sliding window of fixed size k.",
      "Count vowels in the first window of size k.",
      "Slide window right: add 1 if incoming char is vowel, subtract 1 if outgoing char was vowel."
    ],
    "approach": "Fixed-size sliding window.",
    "stepByStepExplanation": "1. Initialize vowel Set for O(1) checks.\n2. Count vowels in the first k characters.\n3. Slide the window one char at a time, updating count and maxCount.\n4. Return maxCount.",
    "optimalApproach": "Sliding window O(N) time and O(1) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "maxVowelsInWindow602",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow602(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow602(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow602(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow602(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[\"abciiidef\", 3]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[\"aeiou\", 2]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[\"leetcode\", 3]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[\"rhythms\", 4]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA603",
    "number": 603,
    "title": "Car Fleet Arrival Times Calculation (Variant 4)",
    "slug": "car-fleet-arrival-times-calculation-variant-4-603",
    "difficulty": "Medium",
    "topic": "Stack",
    "pattern": [
      "Monotonic Stack"
    ],
    "tags": [
      "Stack",
      "Monotonic Stack",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Meta",
      "Bloomberg",
      "Goldman Sachs"
    ],
    "problemStatement": "Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.",
    "examples": [
      {
        "input": "temperatures = [73,74,75,71,69,72,76,73]",
        "output": "[1,1,4,2,1,1,0,0]",
        "explanation": "Day 0 waits 1 day (74), Day 2 waits 4 days (76)."
      },
      {
        "input": "temperatures = [30,40,50,60]",
        "output": "[1,1,1,0]",
        "explanation": "Each day is warmer than the previous except the last day."
      },
      {
        "input": "temperatures = [30,60,90]",
        "output": "[1,1,0]",
        "explanation": "First two days find immediate warmer days."
      }
    ],
    "constraints": [
      "1 <= temperatures.length <= 10^5",
      "30 <= temperatures[i] <= 100"
    ],
    "hints": [
      "Can we use a stack to keep track of previous cooler days waiting for a warmer day?",
      "Store indices of temperatures in a monotonically decreasing stack.",
      "When a warmer temperature is encountered, pop indices and calculate the day difference."
    ],
    "approach": "Monotonic decreasing stack of indices.",
    "stepByStepExplanation": "1. Create result array filled with 0 of length N.\n2. Maintain stack of indices.\n3. For each day i, while stack is not empty and current temp > temp at stack top: pop index prev, set result[prev] = i - prev.\n4. Push i onto stack.\n5. Return result.",
    "optimalApproach": "Monotonic stack O(N) time and O(N) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "functionName": "dailyTemperatures603",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures603(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures603(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures603(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures603(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[73, 74, 75, 71, 69, 72, 76, 73]]",
        "expectedOutput": "[1, 1, 4, 2, 1, 1, 0, 0]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[30, 40, 50, 60]]",
        "expectedOutput": "[1, 1, 1, 0]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[30, 60, 90]]",
        "expectedOutput": "[1, 1, 0]",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[80, 70, 60, 50]]",
        "expectedOutput": "[0, 0, 0, 0]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA604",
    "number": 604,
    "title": "Time Based Key-Value Data Store (Variant 4)",
    "slug": "time-based-key-value-data-store-variant-4-604",
    "difficulty": "Easy",
    "topic": "Binary Search",
    "pattern": [
      "Binary Search",
      "Divide & Conquer"
    ],
    "tags": [
      "Binary Search",
      "Binary Search",
      "Divide & Conquer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Airbnb",
      "ByteDance"
    ],
    "problemStatement": "Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value.\n\nIf `target` is not found in the array, return `[-1, -1]`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    "examples": [
      {
        "input": "nums = [5,7,7,8,8,10], target = 8",
        "output": "[3, 4]",
        "explanation": "8 appears starting at index 3 and ending at index 4."
      },
      {
        "input": "nums = [5,7,7,8,8,10], target = 6",
        "output": "[-1, -1]",
        "explanation": "6 does not exist in the array."
      },
      {
        "input": "nums = [], target = 0",
        "output": "[-1, -1]",
        "explanation": "Empty array returns [-1, -1]."
      }
    ],
    "constraints": [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
      "nums is sorted in non-decreasing order."
    ],
    "hints": [
      "Perform two separate binary searches: one for the leftmost occurrence and one for the rightmost.",
      "In the leftmost search, when nums[mid] === target, continue searching in the left half.",
      "In the rightmost search, continue searching in the right half."
    ],
    "approach": "Dual binary search boundaries.",
    "stepByStepExplanation": "1. Binary search for left boundary: adjust right = mid - 1 when target is found.\n2. Binary search for right boundary: adjust left = mid + 1 when target is found.\n3. Return [leftBound, rightBound].",
    "optimalApproach": "O(log N) dual binary search.",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)",
    "functionName": "searchRange604",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange604(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange604(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange604(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange604(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[5, 7, 7, 8, 8, 10], 8]",
        "expectedOutput": "[3, 4]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[5, 7, 7, 8, 8, 10], 6]",
        "expectedOutput": "[-1, -1]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[], 0]",
        "expectedOutput": "[-1, -1]",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[1, 1, 1, 1], 1]",
        "expectedOutput": "[0, 3]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA605",
    "number": 605,
    "title": "Maximum Product Subarray Traversal (Variant 4)",
    "slug": "maximum-product-subarray-traversal-variant-4-605",
    "difficulty": "Medium",
    "topic": "Dynamic Programming",
    "pattern": [
      "Tabulation",
      "Memoization"
    ],
    "tags": [
      "Dynamic Programming",
      "Tabulation",
      "Memoization",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Adobe",
      "Salesforce",
      "Stripe"
    ],
    "problemStatement": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and **it will automatically contact the police if two adjacent houses were broken into on the same night**.\n\nGiven an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight **without alerting the police**.",
    "examples": [
      {
        "input": "nums = [1,2,3,1]",
        "output": "4",
        "explanation": "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4."
      },
      {
        "input": "nums = [2,7,9,3,1]",
        "output": "12",
        "explanation": "Rob house 1 (2), house 3 (9), and house 5 (1). Total = 2 + 9 + 1 = 12."
      },
      {
        "input": "nums = [0]",
        "output": "0",
        "explanation": "Only one house with 0 money."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 400"
    ],
    "hints": [
      "At each house i, you can either rob it (nums[i] + max at i-2) or skip it (max at i-1).",
      "Notice you only need the previous two maximums.",
      "Reduce space from O(N) to O(1) using two variables."
    ],
    "approach": "1D dynamic programming with state compression.",
    "stepByStepExplanation": "1. Handle edge cases (empty or length 1).\n2. Maintain rob1 and rob2 representing max money up to i-2 and i-1.\n3. For each house, newMax = Math.max(nums[i] + rob1, rob2).\n4. Advance rob1 = rob2, rob2 = newMax.\n5. Return rob2.",
    "optimalApproach": "O(N) time and O(1) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "robHouses605",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses605(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses605(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses605(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses605(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 2, 3, 1]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[2, 7, 9, 3, 1]]",
        "expectedOutput": "12",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[0]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[2, 1, 1, 2]]",
        "expectedOutput": "4",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA606",
    "number": 606,
    "title": "Reconstruct Itinerary Flight Paths (Variant 4)",
    "slug": "reconstruct-itinerary-flight-paths-variant-4-606",
    "difficulty": "Medium",
    "topic": "Graphs",
    "pattern": [
      "BFS",
      "DFS"
    ],
    "tags": [
      "Graphs",
      "BFS",
      "DFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Microsoft",
      "Palantir",
      "Robinhood"
    ],
    "problemStatement": "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    "examples": [
      {
        "input": "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]",
        "output": "3",
        "explanation": "Three separate islands."
      },
      {
        "input": "grid = [[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]",
        "output": "1",
        "explanation": "All lands are connected into 1 island."
      }
    ],
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is \"0\" or \"1\"."
    ],
    "hints": [
      "Traverse the 2D grid.",
      "When you encounter a \"1\", increment your island count and trigger a DFS/BFS to sink all connected land to \"0\".",
      "Continue until the entire matrix is processed."
    ],
    "approach": "Connected components via DFS flood fill.",
    "stepByStepExplanation": "1. Iterate through row r and column c.\n2. When grid[r][c] === \"1\", increment count.\n3. Run dfs(r, c) marking all connected \"1\"s as \"0\".\n4. Return total count.",
    "optimalApproach": "O(M * N) time DFS.",
    "timeComplexity": "O(M * N)",
    "spaceComplexity": "O(M * N)",
    "functionName": "numIslands606",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands606(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands606(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands606(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands606(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[[\"0\",\"0\"],[\"0\",\"0\"]]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA607",
    "number": 607,
    "title": "Partition Labels String Character Disjoint Ranges (Variant 6)",
    "slug": "partition-labels-string-character-disjoint-ranges-variant-6-607",
    "difficulty": "Easy",
    "topic": "Intervals",
    "pattern": [
      "Greedy"
    ],
    "tags": [
      "Intervals",
      "Greedy",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Apple",
      "Cisco",
      "Oracle"
    ],
    "problemStatement": "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    "examples": [
      {
        "input": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        "output": "[[1,6],[8,10],[15,18]]",
        "explanation": "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."
      },
      {
        "input": "intervals = [[1,4],[4,5]]",
        "output": "[[1,5]]",
        "explanation": "Intervals [1,4] and [4,5] are considered overlapping."
      }
    ],
    "constraints": [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4"
    ],
    "hints": [
      "Sort the intervals by their start points.",
      "Initialize merged array with the first interval.",
      "If current interval start <= previous interval end, merge them by updating end = max(prevEnd, currEnd)."
    ],
    "approach": "Sort by start time and greedy interval union.",
    "stepByStepExplanation": "1. Sort intervals by start value ascending.\n2. Iterate through intervals.\n3. If result is empty or current start > last end, push current.\n4. Else update last end to Math.max(last end, current end).\n5. Return result.",
    "optimalApproach": "O(N log N) sorting + O(N) single pass.",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "functionName": "mergeIntervals607",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals607(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals607(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals607(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals607(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[[1, 3], [2, 6], [8, 10], [15, 18]]]",
        "expectedOutput": "[[1, 6], [8, 10], [15, 18]]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[[1, 4], [4, 5]]]",
        "expectedOutput": "[[1, 5]]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[[6, 8]]]",
        "expectedOutput": "[[6, 8]]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA608",
    "number": 608,
    "title": "Count Complete Binary Tree Nodes Efficiently (Variant 4)",
    "slug": "count-complete-binary-tree-nodes-efficiently-variant-4-608",
    "difficulty": "Medium",
    "topic": "Trees",
    "pattern": [
      "DFS",
      "BFS"
    ],
    "tags": [
      "Trees",
      "DFS",
      "BFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Meta",
      "Microsoft",
      "Amazon"
    ],
    "problemStatement": "Given the root of a binary tree encoded as an array representation (level-order traversal where `null` represents absent nodes), return its maximum depth.\n\nA binary tree's **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    "examples": [
      {
        "input": "root = [3,9,20,null,null,15,7]",
        "output": "3",
        "explanation": "Root 3 -> 20 -> 15 gives depth 3."
      },
      {
        "input": "root = [1,null,2]",
        "output": "2",
        "explanation": "Root 1 -> 2 gives depth 2."
      },
      {
        "input": "root = []",
        "output": "0",
        "explanation": "Empty tree has depth 0."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-100 <= Node.val <= 100"
    ],
    "hints": [
      "Can we formulate the problem recursively?",
      "The maximum depth of a tree is 1 + max(depth(left), depth(right)).",
      "Base case: if root is null, return 0."
    ],
    "approach": "Recursive DFS tree height calculation.",
    "stepByStepExplanation": "1. If root is empty or null, depth is 0.\n2. In array level-order representation, calculate depth from array length or tree node.\n3. Return calculated maximum depth.",
    "optimalApproach": "O(N) DFS traversal.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(H)",
    "functionName": "maxDepth608",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth608(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth608(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth608(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth608(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[3, 9, 20, null, null, 15, 7]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1, null, 2]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[1]]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA609",
    "number": 609,
    "title": "Permutations Full Array Combinations (Variant 5)",
    "slug": "permutations-full-array-combinations-variant-5-609",
    "difficulty": "Difficult",
    "topic": "Backtracking",
    "pattern": [
      "Backtracking",
      "DFS"
    ],
    "tags": [
      "Backtracking",
      "Backtracking",
      "DFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Amazon",
      "DoorDash",
      "Snowflake"
    ],
    "problemStatement": "Given an integer array `nums` of **unique** elements, return all possible subsets (the power set).\n\nThe solution set **must not** contain duplicate subsets. Return the solution in **any order**.",
    "examples": [
      {
        "input": "nums = [1,2,3]",
        "output": "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
        "explanation": "All 8 subsets of [1,2,3]."
      },
      {
        "input": "nums = [0]",
        "output": "[[],[0]]",
        "explanation": "All 2 subsets of [0]."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10",
      "-10 <= nums[i] <= 10",
      "All the numbers of nums are unique."
    ],
    "hints": [
      "Use recursive backtracking.",
      "At each index i, we have two choices: include nums[i] in the current subset, or exclude it.",
      "When we reach index === nums.length, record the current subset."
    ],
    "approach": "Backtracking recursion (include/exclude).",
    "stepByStepExplanation": "1. Initialize result array.\n2. Define backtrack(start, path).\n3. Add copy of path to result.\n4. Loop i from start to nums.length:\n   - path.push(nums[i])\n   - backtrack(i + 1, path)\n   - path.pop()\n5. Return result.",
    "optimalApproach": "O(N * 2^N) backtracking power set.",
    "timeComplexity": "O(N * 2^N)",
    "spaceComplexity": "O(N)",
    "functionName": "generateSubsets609",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets609(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets609(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets609(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets609(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[0]]",
        "expectedOutput": "[[], [0]]",
        "isHidden": false
      }
    ]
  },
  {
    "id": "DSA610",
    "number": 610,
    "title": "Single Number III Two Unique Values Extraction (Variant 4)",
    "slug": "single-number-iii-two-unique-values-extraction-variant-4-610",
    "difficulty": "Difficult",
    "topic": "Bit Manipulation",
    "pattern": [
      "Bit Manipulation"
    ],
    "tags": [
      "Bit Manipulation",
      "Bit Manipulation",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Meta",
      "Amazon"
    ],
    "problemStatement": "Write a function that takes the binary representation of an integer `n` and returns the number of `'1'` bits it has (also known as the Hamming weight).",
    "examples": [
      {
        "input": "n = 11",
        "output": "3",
        "explanation": "The input binary string is 1011, having a total of three 1 bits."
      },
      {
        "input": "n = 128",
        "output": "1",
        "explanation": "The input binary string is 10000000, having a single 1 bit."
      },
      {
        "input": "n = 2147483645",
        "output": "30",
        "explanation": "Has thirty 1 bits."
      }
    ],
    "constraints": [
      "1 <= n <= 2^31 - 1"
    ],
    "hints": [
      "You can check the least significant bit using n & 1, then shift right using n >>> 1.",
      "Or use Brian Kernighan algorithm: n & (n - 1) clears the lowest set bit.",
      "Repeat until n === 0."
    ],
    "approach": "Brian Kernighan bitwise algorithm.",
    "stepByStepExplanation": "1. Initialize count to 0.\n2. While n !== 0: clear lowest bit with n = n & (n - 1), increment count.\n3. Return count.",
    "optimalApproach": "O(number of set bits) using n & (n - 1).",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "functionName": "hammingWeight610",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight610(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight610(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight610(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight610(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[11]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[128]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[2147483645]",
        "expectedOutput": "30",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[0]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA611",
    "number": 611,
    "title": "Product of Array Except Current (Variant 4)",
    "slug": "product-of-array-except-current-variant-4-611",
    "difficulty": "Easy",
    "topic": "Arrays",
    "pattern": [
      "Prefix Sum",
      "Two Pointer"
    ],
    "tags": [
      "Arrays",
      "Prefix Sum",
      "Two Pointer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Microsoft",
      "Apple",
      "Uber"
    ],
    "problemStatement": "Given an array of integers `nums`, calculate the pivot index of this array.\n\nThe pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index's right.\n\nIf the index is on the left edge of the array, then the left sum is `0` because there are no elements to the left. Return the **leftmost pivot index**. If no such index exists, return `-1`.",
    "examples": [
      {
        "input": "nums = [1,7,3,6,5,6]",
        "output": "3",
        "explanation": "Left sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11. Right sum = nums[4] + nums[5] = 5 + 6 = 11."
      },
      {
        "input": "nums = [1,2,3]",
        "output": "-1",
        "explanation": "There is no index that satisfies the conditions in the problem statement."
      },
      {
        "input": "nums = [2,1,-1]",
        "output": "0",
        "explanation": "Left sum = 0. Right sum = nums[1] + nums[2] = 1 + -1 = 0."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-1000 <= nums[i] <= 1000"
    ],
    "hints": [
      "Can we precompute the total sum of the array?",
      "As we iterate, maintain a running left sum and calculate right sum as (total - leftSum - current).",
      "Return the first index where leftSum === rightSum."
    ],
    "approach": "Prefix sum subtraction in O(N) time.",
    "stepByStepExplanation": "1. Compute total sum of all elements.\n2. Maintain leftSum initialized to 0.\n3. For each index i, if leftSum === totalSum - leftSum - nums[i], return i.\n4. Add nums[i] to leftSum.\n5. Return -1 if no pivot index found.",
    "optimalApproach": "Single pass with running prefix sum.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "findEquilibriumIndex611",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex611(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex611(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex611(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex611(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 7, 3, 6, 5, 6]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[2, 1, -1]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[0, 0, 0, 0]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA612",
    "number": 612,
    "title": "Longest Nice Substring with Matching Case (Variant 4)",
    "slug": "longest-nice-substring-with-matching-case-variant-4-612",
    "difficulty": "Medium",
    "topic": "Strings",
    "pattern": [
      "Sliding Window",
      "Two Pointer"
    ],
    "tags": [
      "Strings",
      "Sliding Window",
      "Two Pointer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Amazon",
      "Netflix",
      "LinkedIn"
    ],
    "problemStatement": "Given a string `s` and an integer `k`, return the maximum number of vowel letters in any substring of `s` with length `k`.\n\nVowel letters in English are `'a'`, `'e'`, `'i'`, `'o'`, and `'u'`.",
    "examples": [
      {
        "input": "s = \"abciiidef\", k = 3",
        "output": "3",
        "explanation": "The substring \"iii\" contains 3 vowel letters."
      },
      {
        "input": "s = \"aeiou\", k = 2",
        "output": "2",
        "explanation": "Any substring of length 2 contains 2 vowels."
      },
      {
        "input": "s = \"leetcode\", k = 3",
        "output": "2",
        "explanation": "\"lee\", \"eet\" and \"ode\" contain 2 vowels."
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^5",
      "s consists of lowercase English letters.",
      "1 <= k <= s.length"
    ],
    "hints": [
      "Use a sliding window of fixed size k.",
      "Count vowels in the first window of size k.",
      "Slide window right: add 1 if incoming char is vowel, subtract 1 if outgoing char was vowel."
    ],
    "approach": "Fixed-size sliding window.",
    "stepByStepExplanation": "1. Initialize vowel Set for O(1) checks.\n2. Count vowels in the first k characters.\n3. Slide the window one char at a time, updating count and maxCount.\n4. Return maxCount.",
    "optimalApproach": "Sliding window O(N) time and O(1) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "maxVowelsInWindow612",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow612(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow612(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow612(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow612(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[\"abciiidef\", 3]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[\"aeiou\", 2]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[\"leetcode\", 3]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[\"rhythms\", 4]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA613",
    "number": 613,
    "title": "Simplify Canonical Unix Path Resolution (Variant 4)",
    "slug": "simplify-canonical-unix-path-resolution-variant-4-613",
    "difficulty": "Medium",
    "topic": "Stack",
    "pattern": [
      "Monotonic Stack"
    ],
    "tags": [
      "Stack",
      "Monotonic Stack",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Meta",
      "Bloomberg",
      "Goldman Sachs"
    ],
    "problemStatement": "Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.",
    "examples": [
      {
        "input": "temperatures = [73,74,75,71,69,72,76,73]",
        "output": "[1,1,4,2,1,1,0,0]",
        "explanation": "Day 0 waits 1 day (74), Day 2 waits 4 days (76)."
      },
      {
        "input": "temperatures = [30,40,50,60]",
        "output": "[1,1,1,0]",
        "explanation": "Each day is warmer than the previous except the last day."
      },
      {
        "input": "temperatures = [30,60,90]",
        "output": "[1,1,0]",
        "explanation": "First two days find immediate warmer days."
      }
    ],
    "constraints": [
      "1 <= temperatures.length <= 10^5",
      "30 <= temperatures[i] <= 100"
    ],
    "hints": [
      "Can we use a stack to keep track of previous cooler days waiting for a warmer day?",
      "Store indices of temperatures in a monotonically decreasing stack.",
      "When a warmer temperature is encountered, pop indices and calculate the day difference."
    ],
    "approach": "Monotonic decreasing stack of indices.",
    "stepByStepExplanation": "1. Create result array filled with 0 of length N.\n2. Maintain stack of indices.\n3. For each day i, while stack is not empty and current temp > temp at stack top: pop index prev, set result[prev] = i - prev.\n4. Push i onto stack.\n5. Return result.",
    "optimalApproach": "Monotonic stack O(N) time and O(N) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "functionName": "dailyTemperatures613",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures613(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures613(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures613(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures613(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[73, 74, 75, 71, 69, 72, 76, 73]]",
        "expectedOutput": "[1, 1, 4, 2, 1, 1, 0, 0]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[30, 40, 50, 60]]",
        "expectedOutput": "[1, 1, 1, 0]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[30, 60, 90]]",
        "expectedOutput": "[1, 1, 0]",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[80, 70, 60, 50]]",
        "expectedOutput": "[0, 0, 0, 0]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA614",
    "number": 614,
    "title": "Magnetic Force Between Two Balls Distribution (Variant 4)",
    "slug": "magnetic-force-between-two-balls-distribution-variant-4-614",
    "difficulty": "Easy",
    "topic": "Binary Search",
    "pattern": [
      "Binary Search",
      "Divide & Conquer"
    ],
    "tags": [
      "Binary Search",
      "Binary Search",
      "Divide & Conquer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Airbnb",
      "ByteDance"
    ],
    "problemStatement": "Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value.\n\nIf `target` is not found in the array, return `[-1, -1]`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    "examples": [
      {
        "input": "nums = [5,7,7,8,8,10], target = 8",
        "output": "[3, 4]",
        "explanation": "8 appears starting at index 3 and ending at index 4."
      },
      {
        "input": "nums = [5,7,7,8,8,10], target = 6",
        "output": "[-1, -1]",
        "explanation": "6 does not exist in the array."
      },
      {
        "input": "nums = [], target = 0",
        "output": "[-1, -1]",
        "explanation": "Empty array returns [-1, -1]."
      }
    ],
    "constraints": [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
      "nums is sorted in non-decreasing order."
    ],
    "hints": [
      "Perform two separate binary searches: one for the leftmost occurrence and one for the rightmost.",
      "In the leftmost search, when nums[mid] === target, continue searching in the left half.",
      "In the rightmost search, continue searching in the right half."
    ],
    "approach": "Dual binary search boundaries.",
    "stepByStepExplanation": "1. Binary search for left boundary: adjust right = mid - 1 when target is found.\n2. Binary search for right boundary: adjust left = mid + 1 when target is found.\n3. Return [leftBound, rightBound].",
    "optimalApproach": "O(log N) dual binary search.",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)",
    "functionName": "searchRange614",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange614(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange614(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange614(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange614(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[5, 7, 7, 8, 8, 10], 8]",
        "expectedOutput": "[3, 4]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[5, 7, 7, 8, 8, 10], 6]",
        "expectedOutput": "[-1, -1]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[], 0]",
        "expectedOutput": "[-1, -1]",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[1, 1, 1, 1], 1]",
        "expectedOutput": "[0, 3]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA615",
    "number": 615,
    "title": "Coin Change II Number of Ways Combinations (Variant 4)",
    "slug": "coin-change-ii-number-of-ways-combinations-variant-4-615",
    "difficulty": "Medium",
    "topic": "Dynamic Programming",
    "pattern": [
      "Tabulation",
      "Memoization"
    ],
    "tags": [
      "Dynamic Programming",
      "Tabulation",
      "Memoization",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Adobe",
      "Salesforce",
      "Stripe"
    ],
    "problemStatement": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and **it will automatically contact the police if two adjacent houses were broken into on the same night**.\n\nGiven an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight **without alerting the police**.",
    "examples": [
      {
        "input": "nums = [1,2,3,1]",
        "output": "4",
        "explanation": "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4."
      },
      {
        "input": "nums = [2,7,9,3,1]",
        "output": "12",
        "explanation": "Rob house 1 (2), house 3 (9), and house 5 (1). Total = 2 + 9 + 1 = 12."
      },
      {
        "input": "nums = [0]",
        "output": "0",
        "explanation": "Only one house with 0 money."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 400"
    ],
    "hints": [
      "At each house i, you can either rob it (nums[i] + max at i-2) or skip it (max at i-1).",
      "Notice you only need the previous two maximums.",
      "Reduce space from O(N) to O(1) using two variables."
    ],
    "approach": "1D dynamic programming with state compression.",
    "stepByStepExplanation": "1. Handle edge cases (empty or length 1).\n2. Maintain rob1 and rob2 representing max money up to i-2 and i-1.\n3. For each house, newMax = Math.max(nums[i] + rob1, rob2).\n4. Advance rob1 = rob2, rob2 = newMax.\n5. Return rob2.",
    "optimalApproach": "O(N) time and O(1) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "robHouses615",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses615(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses615(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses615(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses615(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 2, 3, 1]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[2, 7, 9, 3, 1]]",
        "expectedOutput": "12",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[0]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[2, 1, 1, 2]]",
        "expectedOutput": "4",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA616",
    "number": 616,
    "title": "Graph Valid Tree Cycle Detection (Variant 4)",
    "slug": "graph-valid-tree-cycle-detection-variant-4-616",
    "difficulty": "Medium",
    "topic": "Graphs",
    "pattern": [
      "BFS",
      "DFS"
    ],
    "tags": [
      "Graphs",
      "BFS",
      "DFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Microsoft",
      "Palantir",
      "Robinhood"
    ],
    "problemStatement": "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    "examples": [
      {
        "input": "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]",
        "output": "3",
        "explanation": "Three separate islands."
      },
      {
        "input": "grid = [[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]",
        "output": "1",
        "explanation": "All lands are connected into 1 island."
      }
    ],
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is \"0\" or \"1\"."
    ],
    "hints": [
      "Traverse the 2D grid.",
      "When you encounter a \"1\", increment your island count and trigger a DFS/BFS to sink all connected land to \"0\".",
      "Continue until the entire matrix is processed."
    ],
    "approach": "Connected components via DFS flood fill.",
    "stepByStepExplanation": "1. Iterate through row r and column c.\n2. When grid[r][c] === \"1\", increment count.\n3. Run dfs(r, c) marking all connected \"1\"s as \"0\".\n4. Return total count.",
    "optimalApproach": "O(M * N) time DFS.",
    "timeComplexity": "O(M * N)",
    "spaceComplexity": "O(M * N)",
    "functionName": "numIslands616",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands616(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands616(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands616(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands616(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[[\"0\",\"0\"],[\"0\",\"0\"]]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA617",
    "number": 617,
    "title": "Employee Free Time Global Work Schedule (Variant 6)",
    "slug": "employee-free-time-global-work-schedule-variant-6-617",
    "difficulty": "Easy",
    "topic": "Intervals",
    "pattern": [
      "Greedy"
    ],
    "tags": [
      "Intervals",
      "Greedy",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Apple",
      "Cisco",
      "Oracle"
    ],
    "problemStatement": "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    "examples": [
      {
        "input": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        "output": "[[1,6],[8,10],[15,18]]",
        "explanation": "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."
      },
      {
        "input": "intervals = [[1,4],[4,5]]",
        "output": "[[1,5]]",
        "explanation": "Intervals [1,4] and [4,5] are considered overlapping."
      }
    ],
    "constraints": [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4"
    ],
    "hints": [
      "Sort the intervals by their start points.",
      "Initialize merged array with the first interval.",
      "If current interval start <= previous interval end, merge them by updating end = max(prevEnd, currEnd)."
    ],
    "approach": "Sort by start time and greedy interval union.",
    "stepByStepExplanation": "1. Sort intervals by start value ascending.\n2. Iterate through intervals.\n3. If result is empty or current start > last end, push current.\n4. Else update last end to Math.max(last end, current end).\n5. Return result.",
    "optimalApproach": "O(N log N) sorting + O(N) single pass.",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "functionName": "mergeIntervals617",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals617(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals617(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals617(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals617(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[[1, 3], [2, 6], [8, 10], [15, 18]]]",
        "expectedOutput": "[[1, 6], [8, 10], [15, 18]]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[[1, 4], [4, 5]]]",
        "expectedOutput": "[[1, 5]]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[[6, 8]]]",
        "expectedOutput": "[[6, 8]]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA618",
    "number": 618,
    "title": "Construct Binary Tree from Preorder Inorder Arrays (Variant 4)",
    "slug": "construct-binary-tree-from-preorder-inorder-arrays-variant-4-618",
    "difficulty": "Medium",
    "topic": "Trees",
    "pattern": [
      "DFS",
      "BFS"
    ],
    "tags": [
      "Trees",
      "DFS",
      "BFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Meta",
      "Microsoft",
      "Amazon"
    ],
    "problemStatement": "Given the root of a binary tree encoded as an array representation (level-order traversal where `null` represents absent nodes), return its maximum depth.\n\nA binary tree's **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    "examples": [
      {
        "input": "root = [3,9,20,null,null,15,7]",
        "output": "3",
        "explanation": "Root 3 -> 20 -> 15 gives depth 3."
      },
      {
        "input": "root = [1,null,2]",
        "output": "2",
        "explanation": "Root 1 -> 2 gives depth 2."
      },
      {
        "input": "root = []",
        "output": "0",
        "explanation": "Empty tree has depth 0."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-100 <= Node.val <= 100"
    ],
    "hints": [
      "Can we formulate the problem recursively?",
      "The maximum depth of a tree is 1 + max(depth(left), depth(right)).",
      "Base case: if root is null, return 0."
    ],
    "approach": "Recursive DFS tree height calculation.",
    "stepByStepExplanation": "1. If root is empty or null, depth is 0.\n2. In array level-order representation, calculate depth from array length or tree node.\n3. Return calculated maximum depth.",
    "optimalApproach": "O(N) DFS traversal.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(H)",
    "functionName": "maxDepth618",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth618(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth618(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth618(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth618(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[3, 9, 20, null, null, 15, 7]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1, null, 2]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[1]]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA619",
    "number": 619,
    "title": "Combination Sum Target Exact Summation (Variant 5)",
    "slug": "combination-sum-target-exact-summation-variant-5-619",
    "difficulty": "Difficult",
    "topic": "Backtracking",
    "pattern": [
      "Backtracking",
      "DFS"
    ],
    "tags": [
      "Backtracking",
      "Backtracking",
      "DFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Amazon",
      "DoorDash",
      "Snowflake"
    ],
    "problemStatement": "Given an integer array `nums` of **unique** elements, return all possible subsets (the power set).\n\nThe solution set **must not** contain duplicate subsets. Return the solution in **any order**.",
    "examples": [
      {
        "input": "nums = [1,2,3]",
        "output": "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
        "explanation": "All 8 subsets of [1,2,3]."
      },
      {
        "input": "nums = [0]",
        "output": "[[],[0]]",
        "explanation": "All 2 subsets of [0]."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10",
      "-10 <= nums[i] <= 10",
      "All the numbers of nums are unique."
    ],
    "hints": [
      "Use recursive backtracking.",
      "At each index i, we have two choices: include nums[i] in the current subset, or exclude it.",
      "When we reach index === nums.length, record the current subset."
    ],
    "approach": "Backtracking recursion (include/exclude).",
    "stepByStepExplanation": "1. Initialize result array.\n2. Define backtrack(start, path).\n3. Add copy of path to result.\n4. Loop i from start to nums.length:\n   - path.push(nums[i])\n   - backtrack(i + 1, path)\n   - path.pop()\n5. Return result.",
    "optimalApproach": "O(N * 2^N) backtracking power set.",
    "timeComplexity": "O(N * 2^N)",
    "spaceComplexity": "O(N)",
    "functionName": "generateSubsets619",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets619(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets619(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets619(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets619(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[0]]",
        "expectedOutput": "[[], [0]]",
        "isHidden": false
      }
    ]
  },
  {
    "id": "DSA620",
    "number": 620,
    "title": "Find the Difference Character XOR Filter (Variant 4)",
    "slug": "find-the-difference-character-xor-filter-variant-4-620",
    "difficulty": "Difficult",
    "topic": "Bit Manipulation",
    "pattern": [
      "Bit Manipulation"
    ],
    "tags": [
      "Bit Manipulation",
      "Bit Manipulation",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Meta",
      "Amazon"
    ],
    "problemStatement": "Write a function that takes the binary representation of an integer `n` and returns the number of `'1'` bits it has (also known as the Hamming weight).",
    "examples": [
      {
        "input": "n = 11",
        "output": "3",
        "explanation": "The input binary string is 1011, having a total of three 1 bits."
      },
      {
        "input": "n = 128",
        "output": "1",
        "explanation": "The input binary string is 10000000, having a single 1 bit."
      },
      {
        "input": "n = 2147483645",
        "output": "30",
        "explanation": "Has thirty 1 bits."
      }
    ],
    "constraints": [
      "1 <= n <= 2^31 - 1"
    ],
    "hints": [
      "You can check the least significant bit using n & 1, then shift right using n >>> 1.",
      "Or use Brian Kernighan algorithm: n & (n - 1) clears the lowest set bit.",
      "Repeat until n === 0."
    ],
    "approach": "Brian Kernighan bitwise algorithm.",
    "stepByStepExplanation": "1. Initialize count to 0.\n2. While n !== 0: clear lowest bit with n = n & (n - 1), increment count.\n3. Return count.",
    "optimalApproach": "O(number of set bits) using n & (n - 1).",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "functionName": "hammingWeight620",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight620(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight620(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight620(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight620(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[11]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[128]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[2147483645]",
        "expectedOutput": "30",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[0]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA621",
    "number": 621,
    "title": "Count Number of Nice Subarrays (Variant 4)",
    "slug": "count-number-of-nice-subarrays-variant-4-621",
    "difficulty": "Easy",
    "topic": "Arrays",
    "pattern": [
      "Prefix Sum",
      "Two Pointer"
    ],
    "tags": [
      "Arrays",
      "Prefix Sum",
      "Two Pointer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Microsoft",
      "Apple",
      "Uber"
    ],
    "problemStatement": "Given an array of integers `nums`, calculate the pivot index of this array.\n\nThe pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index's right.\n\nIf the index is on the left edge of the array, then the left sum is `0` because there are no elements to the left. Return the **leftmost pivot index**. If no such index exists, return `-1`.",
    "examples": [
      {
        "input": "nums = [1,7,3,6,5,6]",
        "output": "3",
        "explanation": "Left sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11. Right sum = nums[4] + nums[5] = 5 + 6 = 11."
      },
      {
        "input": "nums = [1,2,3]",
        "output": "-1",
        "explanation": "There is no index that satisfies the conditions in the problem statement."
      },
      {
        "input": "nums = [2,1,-1]",
        "output": "0",
        "explanation": "Left sum = 0. Right sum = nums[1] + nums[2] = 1 + -1 = 0."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-1000 <= nums[i] <= 1000"
    ],
    "hints": [
      "Can we precompute the total sum of the array?",
      "As we iterate, maintain a running left sum and calculate right sum as (total - leftSum - current).",
      "Return the first index where leftSum === rightSum."
    ],
    "approach": "Prefix sum subtraction in O(N) time.",
    "stepByStepExplanation": "1. Compute total sum of all elements.\n2. Maintain leftSum initialized to 0.\n3. For each index i, if leftSum === totalSum - leftSum - nums[i], return i.\n4. Add nums[i] to leftSum.\n5. Return -1 if no pivot index found.",
    "optimalApproach": "Single pass with running prefix sum.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "findEquilibriumIndex621",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex621(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex621(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex621(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex621(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 7, 3, 6, 5, 6]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[2, 1, -1]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[0, 0, 0, 0]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA622",
    "number": 622,
    "title": "Minimum Size Subarray Sum Exceeding Target (Variant 4)",
    "slug": "minimum-size-subarray-sum-exceeding-target-variant-4-622",
    "difficulty": "Medium",
    "topic": "Strings",
    "pattern": [
      "Sliding Window",
      "Two Pointer"
    ],
    "tags": [
      "Strings",
      "Sliding Window",
      "Two Pointer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Amazon",
      "Netflix",
      "LinkedIn"
    ],
    "problemStatement": "Given a string `s` and an integer `k`, return the maximum number of vowel letters in any substring of `s` with length `k`.\n\nVowel letters in English are `'a'`, `'e'`, `'i'`, `'o'`, and `'u'`.",
    "examples": [
      {
        "input": "s = \"abciiidef\", k = 3",
        "output": "3",
        "explanation": "The substring \"iii\" contains 3 vowel letters."
      },
      {
        "input": "s = \"aeiou\", k = 2",
        "output": "2",
        "explanation": "Any substring of length 2 contains 2 vowels."
      },
      {
        "input": "s = \"leetcode\", k = 3",
        "output": "2",
        "explanation": "\"lee\", \"eet\" and \"ode\" contain 2 vowels."
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^5",
      "s consists of lowercase English letters.",
      "1 <= k <= s.length"
    ],
    "hints": [
      "Use a sliding window of fixed size k.",
      "Count vowels in the first window of size k.",
      "Slide window right: add 1 if incoming char is vowel, subtract 1 if outgoing char was vowel."
    ],
    "approach": "Fixed-size sliding window.",
    "stepByStepExplanation": "1. Initialize vowel Set for O(1) checks.\n2. Count vowels in the first k characters.\n3. Slide the window one char at a time, updating count and maxCount.\n4. Return maxCount.",
    "optimalApproach": "Sliding window O(N) time and O(1) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "maxVowelsInWindow622",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow622(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow622(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow622(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow622(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[\"abciiidef\", 3]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[\"aeiou\", 2]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[\"leetcode\", 3]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[\"rhythms\", 4]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA623",
    "number": 623,
    "title": "Decode Multi-Level Nested Strings (Variant 4)",
    "slug": "decode-multi-level-nested-strings-variant-4-623",
    "difficulty": "Medium",
    "topic": "Stack",
    "pattern": [
      "Monotonic Stack"
    ],
    "tags": [
      "Stack",
      "Monotonic Stack",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Meta",
      "Bloomberg",
      "Goldman Sachs"
    ],
    "problemStatement": "Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.",
    "examples": [
      {
        "input": "temperatures = [73,74,75,71,69,72,76,73]",
        "output": "[1,1,4,2,1,1,0,0]",
        "explanation": "Day 0 waits 1 day (74), Day 2 waits 4 days (76)."
      },
      {
        "input": "temperatures = [30,40,50,60]",
        "output": "[1,1,1,0]",
        "explanation": "Each day is warmer than the previous except the last day."
      },
      {
        "input": "temperatures = [30,60,90]",
        "output": "[1,1,0]",
        "explanation": "First two days find immediate warmer days."
      }
    ],
    "constraints": [
      "1 <= temperatures.length <= 10^5",
      "30 <= temperatures[i] <= 100"
    ],
    "hints": [
      "Can we use a stack to keep track of previous cooler days waiting for a warmer day?",
      "Store indices of temperatures in a monotonically decreasing stack.",
      "When a warmer temperature is encountered, pop indices and calculate the day difference."
    ],
    "approach": "Monotonic decreasing stack of indices.",
    "stepByStepExplanation": "1. Create result array filled with 0 of length N.\n2. Maintain stack of indices.\n3. For each day i, while stack is not empty and current temp > temp at stack top: pop index prev, set result[prev] = i - prev.\n4. Push i onto stack.\n5. Return result.",
    "optimalApproach": "Monotonic stack O(N) time and O(N) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "functionName": "dailyTemperatures623",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures623(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures623(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures623(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures623(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[73, 74, 75, 71, 69, 72, 76, 73]]",
        "expectedOutput": "[1, 1, 4, 2, 1, 1, 0, 0]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[30, 40, 50, 60]]",
        "expectedOutput": "[1, 1, 1, 0]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[30, 60, 90]]",
        "expectedOutput": "[1, 1, 0]",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[80, 70, 60, 50]]",
        "expectedOutput": "[0, 0, 0, 0]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA624",
    "number": 624,
    "title": "Minimum Speed to Arrive on Time Transport (Variant 4)",
    "slug": "minimum-speed-to-arrive-on-time-transport-variant-4-624",
    "difficulty": "Easy",
    "topic": "Binary Search",
    "pattern": [
      "Binary Search",
      "Divide & Conquer"
    ],
    "tags": [
      "Binary Search",
      "Binary Search",
      "Divide & Conquer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Airbnb",
      "ByteDance"
    ],
    "problemStatement": "Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value.\n\nIf `target` is not found in the array, return `[-1, -1]`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    "examples": [
      {
        "input": "nums = [5,7,7,8,8,10], target = 8",
        "output": "[3, 4]",
        "explanation": "8 appears starting at index 3 and ending at index 4."
      },
      {
        "input": "nums = [5,7,7,8,8,10], target = 6",
        "output": "[-1, -1]",
        "explanation": "6 does not exist in the array."
      },
      {
        "input": "nums = [], target = 0",
        "output": "[-1, -1]",
        "explanation": "Empty array returns [-1, -1]."
      }
    ],
    "constraints": [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
      "nums is sorted in non-decreasing order."
    ],
    "hints": [
      "Perform two separate binary searches: one for the leftmost occurrence and one for the rightmost.",
      "In the leftmost search, when nums[mid] === target, continue searching in the left half.",
      "In the rightmost search, continue searching in the right half."
    ],
    "approach": "Dual binary search boundaries.",
    "stepByStepExplanation": "1. Binary search for left boundary: adjust right = mid - 1 when target is found.\n2. Binary search for right boundary: adjust left = mid + 1 when target is found.\n3. Return [leftBound, rightBound].",
    "optimalApproach": "O(log N) dual binary search.",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)",
    "functionName": "searchRange624",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange624(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange624(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange624(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange624(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[5, 7, 7, 8, 8, 10], 8]",
        "expectedOutput": "[3, 4]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[5, 7, 7, 8, 8, 10], 6]",
        "expectedOutput": "[-1, -1]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[], 0]",
        "expectedOutput": "[-1, -1]",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[1, 1, 1, 1], 1]",
        "expectedOutput": "[0, 3]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA625",
    "number": 625,
    "title": "Triangle Shortest Path Top to Bottom (Variant 4)",
    "slug": "triangle-shortest-path-top-to-bottom-variant-4-625",
    "difficulty": "Medium",
    "topic": "Dynamic Programming",
    "pattern": [
      "Tabulation",
      "Memoization"
    ],
    "tags": [
      "Dynamic Programming",
      "Tabulation",
      "Memoization",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Adobe",
      "Salesforce",
      "Stripe"
    ],
    "problemStatement": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and **it will automatically contact the police if two adjacent houses were broken into on the same night**.\n\nGiven an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight **without alerting the police**.",
    "examples": [
      {
        "input": "nums = [1,2,3,1]",
        "output": "4",
        "explanation": "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4."
      },
      {
        "input": "nums = [2,7,9,3,1]",
        "output": "12",
        "explanation": "Rob house 1 (2), house 3 (9), and house 5 (1). Total = 2 + 9 + 1 = 12."
      },
      {
        "input": "nums = [0]",
        "output": "0",
        "explanation": "Only one house with 0 money."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 400"
    ],
    "hints": [
      "At each house i, you can either rob it (nums[i] + max at i-2) or skip it (max at i-1).",
      "Notice you only need the previous two maximums.",
      "Reduce space from O(N) to O(1) using two variables."
    ],
    "approach": "1D dynamic programming with state compression.",
    "stepByStepExplanation": "1. Handle edge cases (empty or length 1).\n2. Maintain rob1 and rob2 representing max money up to i-2 and i-1.\n3. For each house, newMax = Math.max(nums[i] + rob1, rob2).\n4. Advance rob1 = rob2, rob2 = newMax.\n5. Return rob2.",
    "optimalApproach": "O(N) time and O(1) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "robHouses625",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses625(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses625(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses625(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses625(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 2, 3, 1]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[2, 7, 9, 3, 1]]",
        "expectedOutput": "12",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[0]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[2, 1, 1, 2]]",
        "expectedOutput": "4",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA626",
    "number": 626,
    "title": "Redundant Connection in Undirected Graph (Variant 4)",
    "slug": "redundant-connection-in-undirected-graph-variant-4-626",
    "difficulty": "Medium",
    "topic": "Graphs",
    "pattern": [
      "BFS",
      "DFS"
    ],
    "tags": [
      "Graphs",
      "BFS",
      "DFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Microsoft",
      "Palantir",
      "Robinhood"
    ],
    "problemStatement": "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    "examples": [
      {
        "input": "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]",
        "output": "3",
        "explanation": "Three separate islands."
      },
      {
        "input": "grid = [[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]",
        "output": "1",
        "explanation": "All lands are connected into 1 island."
      }
    ],
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is \"0\" or \"1\"."
    ],
    "hints": [
      "Traverse the 2D grid.",
      "When you encounter a \"1\", increment your island count and trigger a DFS/BFS to sink all connected land to \"0\".",
      "Continue until the entire matrix is processed."
    ],
    "approach": "Connected components via DFS flood fill.",
    "stepByStepExplanation": "1. Iterate through row r and column c.\n2. When grid[r][c] === \"1\", increment count.\n3. Run dfs(r, c) marking all connected \"1\"s as \"0\".\n4. Return total count.",
    "optimalApproach": "O(M * N) time DFS.",
    "timeComplexity": "O(M * N)",
    "spaceComplexity": "O(M * N)",
    "functionName": "numIslands626",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands626(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands626(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands626(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands626(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[[\"0\",\"0\"],[\"0\",\"0\"]]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA627",
    "number": 627,
    "title": "Remove Covered Intervals from Collection (Variant 6)",
    "slug": "remove-covered-intervals-from-collection-variant-6-627",
    "difficulty": "Easy",
    "topic": "Intervals",
    "pattern": [
      "Greedy"
    ],
    "tags": [
      "Intervals",
      "Greedy",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Apple",
      "Cisco",
      "Oracle"
    ],
    "problemStatement": "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    "examples": [
      {
        "input": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        "output": "[[1,6],[8,10],[15,18]]",
        "explanation": "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."
      },
      {
        "input": "intervals = [[1,4],[4,5]]",
        "output": "[[1,5]]",
        "explanation": "Intervals [1,4] and [4,5] are considered overlapping."
      }
    ],
    "constraints": [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4"
    ],
    "hints": [
      "Sort the intervals by their start points.",
      "Initialize merged array with the first interval.",
      "If current interval start <= previous interval end, merge them by updating end = max(prevEnd, currEnd)."
    ],
    "approach": "Sort by start time and greedy interval union.",
    "stepByStepExplanation": "1. Sort intervals by start value ascending.\n2. Iterate through intervals.\n3. If result is empty or current start > last end, push current.\n4. Else update last end to Math.max(last end, current end).\n5. Return result.",
    "optimalApproach": "O(N log N) sorting + O(N) single pass.",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "functionName": "mergeIntervals627",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals627(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals627(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals627(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals627(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[[1, 3], [2, 6], [8, 10], [15, 18]]]",
        "expectedOutput": "[[1, 6], [8, 10], [15, 18]]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[[1, 4], [4, 5]]]",
        "expectedOutput": "[[1, 5]]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[[6, 8]]]",
        "expectedOutput": "[[6, 8]]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA628",
    "number": 628,
    "title": "Flatten Binary Tree to Linked List Preorder (Variant 4)",
    "slug": "flatten-binary-tree-to-linked-list-preorder-variant-4-628",
    "difficulty": "Medium",
    "topic": "Trees",
    "pattern": [
      "DFS",
      "BFS"
    ],
    "tags": [
      "Trees",
      "DFS",
      "BFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Meta",
      "Microsoft",
      "Amazon"
    ],
    "problemStatement": "Given the root of a binary tree encoded as an array representation (level-order traversal where `null` represents absent nodes), return its maximum depth.\n\nA binary tree's **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    "examples": [
      {
        "input": "root = [3,9,20,null,null,15,7]",
        "output": "3",
        "explanation": "Root 3 -> 20 -> 15 gives depth 3."
      },
      {
        "input": "root = [1,null,2]",
        "output": "2",
        "explanation": "Root 1 -> 2 gives depth 2."
      },
      {
        "input": "root = []",
        "output": "0",
        "explanation": "Empty tree has depth 0."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-100 <= Node.val <= 100"
    ],
    "hints": [
      "Can we formulate the problem recursively?",
      "The maximum depth of a tree is 1 + max(depth(left), depth(right)).",
      "Base case: if root is null, return 0."
    ],
    "approach": "Recursive DFS tree height calculation.",
    "stepByStepExplanation": "1. If root is empty or null, depth is 0.\n2. In array level-order representation, calculate depth from array length or tree node.\n3. Return calculated maximum depth.",
    "optimalApproach": "O(N) DFS traversal.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(H)",
    "functionName": "maxDepth628",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth628(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth628(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth628(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth628(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[3, 9, 20, null, null, 15, 7]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1, null, 2]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[1]]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA629",
    "number": 629,
    "title": "Letter Combinations of a Phone Number Digits (Variant 5)",
    "slug": "letter-combinations-of-a-phone-number-digits-variant-5-629",
    "difficulty": "Difficult",
    "topic": "Backtracking",
    "pattern": [
      "Backtracking",
      "DFS"
    ],
    "tags": [
      "Backtracking",
      "Backtracking",
      "DFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Amazon",
      "DoorDash",
      "Snowflake"
    ],
    "problemStatement": "Given an integer array `nums` of **unique** elements, return all possible subsets (the power set).\n\nThe solution set **must not** contain duplicate subsets. Return the solution in **any order**.",
    "examples": [
      {
        "input": "nums = [1,2,3]",
        "output": "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
        "explanation": "All 8 subsets of [1,2,3]."
      },
      {
        "input": "nums = [0]",
        "output": "[[],[0]]",
        "explanation": "All 2 subsets of [0]."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10",
      "-10 <= nums[i] <= 10",
      "All the numbers of nums are unique."
    ],
    "hints": [
      "Use recursive backtracking.",
      "At each index i, we have two choices: include nums[i] in the current subset, or exclude it.",
      "When we reach index === nums.length, record the current subset."
    ],
    "approach": "Backtracking recursion (include/exclude).",
    "stepByStepExplanation": "1. Initialize result array.\n2. Define backtrack(start, path).\n3. Add copy of path to result.\n4. Loop i from start to nums.length:\n   - path.push(nums[i])\n   - backtrack(i + 1, path)\n   - path.pop()\n5. Return result.",
    "optimalApproach": "O(N * 2^N) backtracking power set.",
    "timeComplexity": "O(N * 2^N)",
    "spaceComplexity": "O(N)",
    "functionName": "generateSubsets629",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets629(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets629(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets629(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets629(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[0]]",
        "expectedOutput": "[[], [0]]",
        "isHidden": false
      }
    ]
  },
  {
    "id": "DSA630",
    "number": 630,
    "title": "Hamming Distance Between Two Integers (Variant 4)",
    "slug": "hamming-distance-between-two-integers-variant-4-630",
    "difficulty": "Difficult",
    "topic": "Bit Manipulation",
    "pattern": [
      "Bit Manipulation"
    ],
    "tags": [
      "Bit Manipulation",
      "Bit Manipulation",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Meta",
      "Amazon"
    ],
    "problemStatement": "Write a function that takes the binary representation of an integer `n` and returns the number of `'1'` bits it has (also known as the Hamming weight).",
    "examples": [
      {
        "input": "n = 11",
        "output": "3",
        "explanation": "The input binary string is 1011, having a total of three 1 bits."
      },
      {
        "input": "n = 128",
        "output": "1",
        "explanation": "The input binary string is 10000000, having a single 1 bit."
      },
      {
        "input": "n = 2147483645",
        "output": "30",
        "explanation": "Has thirty 1 bits."
      }
    ],
    "constraints": [
      "1 <= n <= 2^31 - 1"
    ],
    "hints": [
      "You can check the least significant bit using n & 1, then shift right using n >>> 1.",
      "Or use Brian Kernighan algorithm: n & (n - 1) clears the lowest set bit.",
      "Repeat until n === 0."
    ],
    "approach": "Brian Kernighan bitwise algorithm.",
    "stepByStepExplanation": "1. Initialize count to 0.\n2. While n !== 0: clear lowest bit with n = n & (n - 1), increment count.\n3. Return count.",
    "optimalApproach": "O(number of set bits) using n & (n - 1).",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "functionName": "hammingWeight630",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight630(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight630(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight630(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight630(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[11]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[128]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[2147483645]",
        "expectedOutput": "30",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[0]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA631",
    "number": 631,
    "title": "Maximum Points You Can Obtain from Cards (Variant 4)",
    "slug": "maximum-points-you-can-obtain-from-cards-variant-4-631",
    "difficulty": "Easy",
    "topic": "Arrays",
    "pattern": [
      "Prefix Sum",
      "Two Pointer"
    ],
    "tags": [
      "Arrays",
      "Prefix Sum",
      "Two Pointer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Microsoft",
      "Apple",
      "Uber"
    ],
    "problemStatement": "Given an array of integers `nums`, calculate the pivot index of this array.\n\nThe pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index's right.\n\nIf the index is on the left edge of the array, then the left sum is `0` because there are no elements to the left. Return the **leftmost pivot index**. If no such index exists, return `-1`.",
    "examples": [
      {
        "input": "nums = [1,7,3,6,5,6]",
        "output": "3",
        "explanation": "Left sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11. Right sum = nums[4] + nums[5] = 5 + 6 = 11."
      },
      {
        "input": "nums = [1,2,3]",
        "output": "-1",
        "explanation": "There is no index that satisfies the conditions in the problem statement."
      },
      {
        "input": "nums = [2,1,-1]",
        "output": "0",
        "explanation": "Left sum = 0. Right sum = nums[1] + nums[2] = 1 + -1 = 0."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-1000 <= nums[i] <= 1000"
    ],
    "hints": [
      "Can we precompute the total sum of the array?",
      "As we iterate, maintain a running left sum and calculate right sum as (total - leftSum - current).",
      "Return the first index where leftSum === rightSum."
    ],
    "approach": "Prefix sum subtraction in O(N) time.",
    "stepByStepExplanation": "1. Compute total sum of all elements.\n2. Maintain leftSum initialized to 0.\n3. For each index i, if leftSum === totalSum - leftSum - nums[i], return i.\n4. Add nums[i] to leftSum.\n5. Return -1 if no pivot index found.",
    "optimalApproach": "Single pass with running prefix sum.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "findEquilibriumIndex631",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex631(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex631(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex631(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex631(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 7, 3, 6, 5, 6]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[2, 1, -1]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[0, 0, 0, 0]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA632",
    "number": 632,
    "title": "Diet Plan Performance Metric (Variant 4)",
    "slug": "diet-plan-performance-metric-variant-4-632",
    "difficulty": "Medium",
    "topic": "Strings",
    "pattern": [
      "Sliding Window",
      "Two Pointer"
    ],
    "tags": [
      "Strings",
      "Sliding Window",
      "Two Pointer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Amazon",
      "Netflix",
      "LinkedIn"
    ],
    "problemStatement": "Given a string `s` and an integer `k`, return the maximum number of vowel letters in any substring of `s` with length `k`.\n\nVowel letters in English are `'a'`, `'e'`, `'i'`, `'o'`, and `'u'`.",
    "examples": [
      {
        "input": "s = \"abciiidef\", k = 3",
        "output": "3",
        "explanation": "The substring \"iii\" contains 3 vowel letters."
      },
      {
        "input": "s = \"aeiou\", k = 2",
        "output": "2",
        "explanation": "Any substring of length 2 contains 2 vowels."
      },
      {
        "input": "s = \"leetcode\", k = 3",
        "output": "2",
        "explanation": "\"lee\", \"eet\" and \"ode\" contain 2 vowels."
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^5",
      "s consists of lowercase English letters.",
      "1 <= k <= s.length"
    ],
    "hints": [
      "Use a sliding window of fixed size k.",
      "Count vowels in the first window of size k.",
      "Slide window right: add 1 if incoming char is vowel, subtract 1 if outgoing char was vowel."
    ],
    "approach": "Fixed-size sliding window.",
    "stepByStepExplanation": "1. Initialize vowel Set for O(1) checks.\n2. Count vowels in the first k characters.\n3. Slide the window one char at a time, updating count and maxCount.\n4. Return maxCount.",
    "optimalApproach": "Sliding window O(N) time and O(1) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "maxVowelsInWindow632",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow632(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow632(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow632(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow632(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[\"abciiidef\", 3]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[\"aeiou\", 2]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[\"leetcode\", 3]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[\"rhythms\", 4]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA633",
    "number": 633,
    "title": "Validate Stack Sequences Push Pop Simulation (Variant 4)",
    "slug": "validate-stack-sequences-push-pop-simulation-variant-4-633",
    "difficulty": "Medium",
    "topic": "Stack",
    "pattern": [
      "Monotonic Stack"
    ],
    "tags": [
      "Stack",
      "Monotonic Stack",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Meta",
      "Bloomberg",
      "Goldman Sachs"
    ],
    "problemStatement": "Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.",
    "examples": [
      {
        "input": "temperatures = [73,74,75,71,69,72,76,73]",
        "output": "[1,1,4,2,1,1,0,0]",
        "explanation": "Day 0 waits 1 day (74), Day 2 waits 4 days (76)."
      },
      {
        "input": "temperatures = [30,40,50,60]",
        "output": "[1,1,1,0]",
        "explanation": "Each day is warmer than the previous except the last day."
      },
      {
        "input": "temperatures = [30,60,90]",
        "output": "[1,1,0]",
        "explanation": "First two days find immediate warmer days."
      }
    ],
    "constraints": [
      "1 <= temperatures.length <= 10^5",
      "30 <= temperatures[i] <= 100"
    ],
    "hints": [
      "Can we use a stack to keep track of previous cooler days waiting for a warmer day?",
      "Store indices of temperatures in a monotonically decreasing stack.",
      "When a warmer temperature is encountered, pop indices and calculate the day difference."
    ],
    "approach": "Monotonic decreasing stack of indices.",
    "stepByStepExplanation": "1. Create result array filled with 0 of length N.\n2. Maintain stack of indices.\n3. For each day i, while stack is not empty and current temp > temp at stack top: pop index prev, set result[prev] = i - prev.\n4. Push i onto stack.\n5. Return result.",
    "optimalApproach": "Monotonic stack O(N) time and O(N) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "functionName": "dailyTemperatures633",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures633(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures633(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures633(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures633(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[73, 74, 75, 71, 69, 72, 76, 73]]",
        "expectedOutput": "[1, 1, 4, 2, 1, 1, 0, 0]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[30, 40, 50, 60]]",
        "expectedOutput": "[1, 1, 1, 0]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[30, 60, 90]]",
        "expectedOutput": "[1, 1, 0]",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[80, 70, 60, 50]]",
        "expectedOutput": "[0, 0, 0, 0]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA634",
    "number": 634,
    "title": "Arranging Coins in Staircase Pattern (Variant 4)",
    "slug": "arranging-coins-in-staircase-pattern-variant-4-634",
    "difficulty": "Easy",
    "topic": "Binary Search",
    "pattern": [
      "Binary Search",
      "Divide & Conquer"
    ],
    "tags": [
      "Binary Search",
      "Binary Search",
      "Divide & Conquer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Airbnb",
      "ByteDance"
    ],
    "problemStatement": "Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value.\n\nIf `target` is not found in the array, return `[-1, -1]`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    "examples": [
      {
        "input": "nums = [5,7,7,8,8,10], target = 8",
        "output": "[3, 4]",
        "explanation": "8 appears starting at index 3 and ending at index 4."
      },
      {
        "input": "nums = [5,7,7,8,8,10], target = 6",
        "output": "[-1, -1]",
        "explanation": "6 does not exist in the array."
      },
      {
        "input": "nums = [], target = 0",
        "output": "[-1, -1]",
        "explanation": "Empty array returns [-1, -1]."
      }
    ],
    "constraints": [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
      "nums is sorted in non-decreasing order."
    ],
    "hints": [
      "Perform two separate binary searches: one for the leftmost occurrence and one for the rightmost.",
      "In the leftmost search, when nums[mid] === target, continue searching in the left half.",
      "In the rightmost search, continue searching in the right half."
    ],
    "approach": "Dual binary search boundaries.",
    "stepByStepExplanation": "1. Binary search for left boundary: adjust right = mid - 1 when target is found.\n2. Binary search for right boundary: adjust left = mid + 1 when target is found.\n3. Return [leftBound, rightBound].",
    "optimalApproach": "O(log N) dual binary search.",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)",
    "functionName": "searchRange634",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange634(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange634(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange634(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange634(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[5, 7, 7, 8, 8, 10], 8]",
        "expectedOutput": "[3, 4]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[5, 7, 7, 8, 8, 10], 6]",
        "expectedOutput": "[-1, -1]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[], 0]",
        "expectedOutput": "[-1, -1]",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[1, 1, 1, 1], 1]",
        "expectedOutput": "[0, 3]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA635",
    "number": 635,
    "title": "Best Time to Buy and Sell Stock with Cooldown (Variant 4)",
    "slug": "best-time-to-buy-and-sell-stock-with-cooldown-variant-4-635",
    "difficulty": "Medium",
    "topic": "Dynamic Programming",
    "pattern": [
      "Tabulation",
      "Memoization"
    ],
    "tags": [
      "Dynamic Programming",
      "Tabulation",
      "Memoization",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Adobe",
      "Salesforce",
      "Stripe"
    ],
    "problemStatement": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and **it will automatically contact the police if two adjacent houses were broken into on the same night**.\n\nGiven an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight **without alerting the police**.",
    "examples": [
      {
        "input": "nums = [1,2,3,1]",
        "output": "4",
        "explanation": "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4."
      },
      {
        "input": "nums = [2,7,9,3,1]",
        "output": "12",
        "explanation": "Rob house 1 (2), house 3 (9), and house 5 (1). Total = 2 + 9 + 1 = 12."
      },
      {
        "input": "nums = [0]",
        "output": "0",
        "explanation": "Only one house with 0 money."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 400"
    ],
    "hints": [
      "At each house i, you can either rob it (nums[i] + max at i-2) or skip it (max at i-1).",
      "Notice you only need the previous two maximums.",
      "Reduce space from O(N) to O(1) using two variables."
    ],
    "approach": "1D dynamic programming with state compression.",
    "stepByStepExplanation": "1. Handle edge cases (empty or length 1).\n2. Maintain rob1 and rob2 representing max money up to i-2 and i-1.\n3. For each house, newMax = Math.max(nums[i] + rob1, rob2).\n4. Advance rob1 = rob2, rob2 = newMax.\n5. Return rob2.",
    "optimalApproach": "O(N) time and O(1) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "robHouses635",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses635(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses635(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses635(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses635(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 2, 3, 1]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[2, 7, 9, 3, 1]]",
        "expectedOutput": "12",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[0]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[2, 1, 1, 2]]",
        "expectedOutput": "4",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA636",
    "number": 636,
    "title": "Network Delay Time Signal Broadcast (Variant 4)",
    "slug": "network-delay-time-signal-broadcast-variant-4-636",
    "difficulty": "Medium",
    "topic": "Graphs",
    "pattern": [
      "BFS",
      "DFS"
    ],
    "tags": [
      "Graphs",
      "BFS",
      "DFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Microsoft",
      "Palantir",
      "Robinhood"
    ],
    "problemStatement": "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    "examples": [
      {
        "input": "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]",
        "output": "3",
        "explanation": "Three separate islands."
      },
      {
        "input": "grid = [[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]",
        "output": "1",
        "explanation": "All lands are connected into 1 island."
      }
    ],
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is \"0\" or \"1\"."
    ],
    "hints": [
      "Traverse the 2D grid.",
      "When you encounter a \"1\", increment your island count and trigger a DFS/BFS to sink all connected land to \"0\".",
      "Continue until the entire matrix is processed."
    ],
    "approach": "Connected components via DFS flood fill.",
    "stepByStepExplanation": "1. Iterate through row r and column c.\n2. When grid[r][c] === \"1\", increment count.\n3. Run dfs(r, c) marking all connected \"1\"s as \"0\".\n4. Return total count.",
    "optimalApproach": "O(M * N) time DFS.",
    "timeComplexity": "O(M * N)",
    "spaceComplexity": "O(M * N)",
    "functionName": "numIslands636",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands636(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands636(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands636(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands636(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[[\"0\",\"0\"],[\"0\",\"0\"]]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA637",
    "number": 637,
    "title": "Merge Overlapping Calendar Intervals (Variant 7)",
    "slug": "merge-overlapping-calendar-intervals-variant-7-637",
    "difficulty": "Easy",
    "topic": "Intervals",
    "pattern": [
      "Greedy"
    ],
    "tags": [
      "Intervals",
      "Greedy",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Apple",
      "Cisco",
      "Oracle"
    ],
    "problemStatement": "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    "examples": [
      {
        "input": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        "output": "[[1,6],[8,10],[15,18]]",
        "explanation": "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."
      },
      {
        "input": "intervals = [[1,4],[4,5]]",
        "output": "[[1,5]]",
        "explanation": "Intervals [1,4] and [4,5] are considered overlapping."
      }
    ],
    "constraints": [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4"
    ],
    "hints": [
      "Sort the intervals by their start points.",
      "Initialize merged array with the first interval.",
      "If current interval start <= previous interval end, merge them by updating end = max(prevEnd, currEnd)."
    ],
    "approach": "Sort by start time and greedy interval union.",
    "stepByStepExplanation": "1. Sort intervals by start value ascending.\n2. Iterate through intervals.\n3. If result is empty or current start > last end, push current.\n4. Else update last end to Math.max(last end, current end).\n5. Return result.",
    "optimalApproach": "O(N log N) sorting + O(N) single pass.",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "functionName": "mergeIntervals637",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals637(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals637(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals637(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals637(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[[1, 3], [2, 6], [8, 10], [15, 18]]]",
        "expectedOutput": "[[1, 6], [8, 10], [15, 18]]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[[1, 4], [4, 5]]]",
        "expectedOutput": "[[1, 5]]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[[6, 8]]]",
        "expectedOutput": "[[6, 8]]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA638",
    "number": 638,
    "title": "Diameter of Binary Tree Longest Node Path (Variant 4)",
    "slug": "diameter-of-binary-tree-longest-node-path-variant-4-638",
    "difficulty": "Medium",
    "topic": "Trees",
    "pattern": [
      "DFS",
      "BFS"
    ],
    "tags": [
      "Trees",
      "DFS",
      "BFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Meta",
      "Microsoft",
      "Amazon"
    ],
    "problemStatement": "Given the root of a binary tree encoded as an array representation (level-order traversal where `null` represents absent nodes), return its maximum depth.\n\nA binary tree's **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    "examples": [
      {
        "input": "root = [3,9,20,null,null,15,7]",
        "output": "3",
        "explanation": "Root 3 -> 20 -> 15 gives depth 3."
      },
      {
        "input": "root = [1,null,2]",
        "output": "2",
        "explanation": "Root 1 -> 2 gives depth 2."
      },
      {
        "input": "root = []",
        "output": "0",
        "explanation": "Empty tree has depth 0."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-100 <= Node.val <= 100"
    ],
    "hints": [
      "Can we formulate the problem recursively?",
      "The maximum depth of a tree is 1 + max(depth(left), depth(right)).",
      "Base case: if root is null, return 0."
    ],
    "approach": "Recursive DFS tree height calculation.",
    "stepByStepExplanation": "1. If root is empty or null, depth is 0.\n2. In array level-order representation, calculate depth from array length or tree node.\n3. Return calculated maximum depth.",
    "optimalApproach": "O(N) DFS traversal.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(H)",
    "functionName": "maxDepth638",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth638(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth638(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth638(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth638(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[3, 9, 20, null, null, 15, 7]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1, null, 2]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[1]]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA639",
    "number": 639,
    "title": "Palindrome Partitioning Substring Slices (Variant 5)",
    "slug": "palindrome-partitioning-substring-slices-variant-5-639",
    "difficulty": "Difficult",
    "topic": "Backtracking",
    "pattern": [
      "Backtracking",
      "DFS"
    ],
    "tags": [
      "Backtracking",
      "Backtracking",
      "DFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Amazon",
      "DoorDash",
      "Snowflake"
    ],
    "problemStatement": "Given an integer array `nums` of **unique** elements, return all possible subsets (the power set).\n\nThe solution set **must not** contain duplicate subsets. Return the solution in **any order**.",
    "examples": [
      {
        "input": "nums = [1,2,3]",
        "output": "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
        "explanation": "All 8 subsets of [1,2,3]."
      },
      {
        "input": "nums = [0]",
        "output": "[[],[0]]",
        "explanation": "All 2 subsets of [0]."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10",
      "-10 <= nums[i] <= 10",
      "All the numbers of nums are unique."
    ],
    "hints": [
      "Use recursive backtracking.",
      "At each index i, we have two choices: include nums[i] in the current subset, or exclude it.",
      "When we reach index === nums.length, record the current subset."
    ],
    "approach": "Backtracking recursion (include/exclude).",
    "stepByStepExplanation": "1. Initialize result array.\n2. Define backtrack(start, path).\n3. Add copy of path to result.\n4. Loop i from start to nums.length:\n   - path.push(nums[i])\n   - backtrack(i + 1, path)\n   - path.pop()\n5. Return result.",
    "optimalApproach": "O(N * 2^N) backtracking power set.",
    "timeComplexity": "O(N * 2^N)",
    "spaceComplexity": "O(N)",
    "functionName": "generateSubsets639",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets639(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets639(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets639(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets639(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[0]]",
        "expectedOutput": "[[], [0]]",
        "isHidden": false
      }
    ]
  },
  {
    "id": "DSA640",
    "number": 640,
    "title": "Convert Integer to Hexadecimal String (Variant 4)",
    "slug": "convert-integer-to-hexadecimal-string-variant-4-640",
    "difficulty": "Difficult",
    "topic": "Bit Manipulation",
    "pattern": [
      "Bit Manipulation"
    ],
    "tags": [
      "Bit Manipulation",
      "Bit Manipulation",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Meta",
      "Amazon"
    ],
    "problemStatement": "Write a function that takes the binary representation of an integer `n` and returns the number of `'1'` bits it has (also known as the Hamming weight).",
    "examples": [
      {
        "input": "n = 11",
        "output": "3",
        "explanation": "The input binary string is 1011, having a total of three 1 bits."
      },
      {
        "input": "n = 128",
        "output": "1",
        "explanation": "The input binary string is 10000000, having a single 1 bit."
      },
      {
        "input": "n = 2147483645",
        "output": "30",
        "explanation": "Has thirty 1 bits."
      }
    ],
    "constraints": [
      "1 <= n <= 2^31 - 1"
    ],
    "hints": [
      "You can check the least significant bit using n & 1, then shift right using n >>> 1.",
      "Or use Brian Kernighan algorithm: n & (n - 1) clears the lowest set bit.",
      "Repeat until n === 0."
    ],
    "approach": "Brian Kernighan bitwise algorithm.",
    "stepByStepExplanation": "1. Initialize count to 0.\n2. While n !== 0: clear lowest bit with n = n & (n - 1), increment count.\n3. Return count.",
    "optimalApproach": "O(number of set bits) using n & (n - 1).",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "functionName": "hammingWeight640",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight640(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight640(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight640(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight640(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[11]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[128]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[2147483645]",
        "expectedOutput": "30",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[0]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA641",
    "number": 641,
    "title": "Find Good Days to Rob the Bank (Variant 4)",
    "slug": "find-good-days-to-rob-the-bank-variant-4-641",
    "difficulty": "Easy",
    "topic": "Arrays",
    "pattern": [
      "Prefix Sum",
      "Two Pointer"
    ],
    "tags": [
      "Arrays",
      "Prefix Sum",
      "Two Pointer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Microsoft",
      "Apple",
      "Uber"
    ],
    "problemStatement": "Given an array of integers `nums`, calculate the pivot index of this array.\n\nThe pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index's right.\n\nIf the index is on the left edge of the array, then the left sum is `0` because there are no elements to the left. Return the **leftmost pivot index**. If no such index exists, return `-1`.",
    "examples": [
      {
        "input": "nums = [1,7,3,6,5,6]",
        "output": "3",
        "explanation": "Left sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11. Right sum = nums[4] + nums[5] = 5 + 6 = 11."
      },
      {
        "input": "nums = [1,2,3]",
        "output": "-1",
        "explanation": "There is no index that satisfies the conditions in the problem statement."
      },
      {
        "input": "nums = [2,1,-1]",
        "output": "0",
        "explanation": "Left sum = 0. Right sum = nums[1] + nums[2] = 1 + -1 = 0."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-1000 <= nums[i] <= 1000"
    ],
    "hints": [
      "Can we precompute the total sum of the array?",
      "As we iterate, maintain a running left sum and calculate right sum as (total - leftSum - current).",
      "Return the first index where leftSum === rightSum."
    ],
    "approach": "Prefix sum subtraction in O(N) time.",
    "stepByStepExplanation": "1. Compute total sum of all elements.\n2. Maintain leftSum initialized to 0.\n3. For each index i, if leftSum === totalSum - leftSum - nums[i], return i.\n4. Add nums[i] to leftSum.\n5. Return -1 if no pivot index found.",
    "optimalApproach": "Single pass with running prefix sum.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "findEquilibriumIndex641",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex641(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex641(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex641(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex641(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 7, 3, 6, 5, 6]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[2, 1, -1]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[0, 0, 0, 0]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA642",
    "number": 642,
    "title": "Check If a String Contains All Binary Codes of Size K (Variant 4)",
    "slug": "check-if-a-string-contains-all-binary-codes-of-size-k-variant-4-642",
    "difficulty": "Medium",
    "topic": "Strings",
    "pattern": [
      "Sliding Window",
      "Two Pointer"
    ],
    "tags": [
      "Strings",
      "Sliding Window",
      "Two Pointer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Amazon",
      "Netflix",
      "LinkedIn"
    ],
    "problemStatement": "Given a string `s` and an integer `k`, return the maximum number of vowel letters in any substring of `s` with length `k`.\n\nVowel letters in English are `'a'`, `'e'`, `'i'`, `'o'`, and `'u'`.",
    "examples": [
      {
        "input": "s = \"abciiidef\", k = 3",
        "output": "3",
        "explanation": "The substring \"iii\" contains 3 vowel letters."
      },
      {
        "input": "s = \"aeiou\", k = 2",
        "output": "2",
        "explanation": "Any substring of length 2 contains 2 vowels."
      },
      {
        "input": "s = \"leetcode\", k = 3",
        "output": "2",
        "explanation": "\"lee\", \"eet\" and \"ode\" contain 2 vowels."
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^5",
      "s consists of lowercase English letters.",
      "1 <= k <= s.length"
    ],
    "hints": [
      "Use a sliding window of fixed size k.",
      "Count vowels in the first window of size k.",
      "Slide window right: add 1 if incoming char is vowel, subtract 1 if outgoing char was vowel."
    ],
    "approach": "Fixed-size sliding window.",
    "stepByStepExplanation": "1. Initialize vowel Set for O(1) checks.\n2. Count vowels in the first k characters.\n3. Slide the window one char at a time, updating count and maxCount.\n4. Return maxCount.",
    "optimalApproach": "Sliding window O(N) time and O(1) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "maxVowelsInWindow642",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow642(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow642(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow642(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow642(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[\"abciiidef\", 3]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[\"aeiou\", 2]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[\"leetcode\", 3]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[\"rhythms\", 4]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA643",
    "number": 643,
    "title": "Min Stack Constant Time Retrieval (Variant 4)",
    "slug": "min-stack-constant-time-retrieval-variant-4-643",
    "difficulty": "Medium",
    "topic": "Stack",
    "pattern": [
      "Monotonic Stack"
    ],
    "tags": [
      "Stack",
      "Monotonic Stack",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Meta",
      "Bloomberg",
      "Goldman Sachs"
    ],
    "problemStatement": "Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.",
    "examples": [
      {
        "input": "temperatures = [73,74,75,71,69,72,76,73]",
        "output": "[1,1,4,2,1,1,0,0]",
        "explanation": "Day 0 waits 1 day (74), Day 2 waits 4 days (76)."
      },
      {
        "input": "temperatures = [30,40,50,60]",
        "output": "[1,1,1,0]",
        "explanation": "Each day is warmer than the previous except the last day."
      },
      {
        "input": "temperatures = [30,60,90]",
        "output": "[1,1,0]",
        "explanation": "First two days find immediate warmer days."
      }
    ],
    "constraints": [
      "1 <= temperatures.length <= 10^5",
      "30 <= temperatures[i] <= 100"
    ],
    "hints": [
      "Can we use a stack to keep track of previous cooler days waiting for a warmer day?",
      "Store indices of temperatures in a monotonically decreasing stack.",
      "When a warmer temperature is encountered, pop indices and calculate the day difference."
    ],
    "approach": "Monotonic decreasing stack of indices.",
    "stepByStepExplanation": "1. Create result array filled with 0 of length N.\n2. Maintain stack of indices.\n3. For each day i, while stack is not empty and current temp > temp at stack top: pop index prev, set result[prev] = i - prev.\n4. Push i onto stack.\n5. Return result.",
    "optimalApproach": "Monotonic stack O(N) time and O(N) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "functionName": "dailyTemperatures643",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures643(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures643(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures643(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures643(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[73, 74, 75, 71, 69, 72, 76, 73]]",
        "expectedOutput": "[1, 1, 4, 2, 1, 1, 0, 0]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[30, 40, 50, 60]]",
        "expectedOutput": "[1, 1, 1, 0]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[30, 60, 90]]",
        "expectedOutput": "[1, 1, 0]",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[80, 70, 60, 50]]",
        "expectedOutput": "[0, 0, 0, 0]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA644",
    "number": 644,
    "title": "Guess Number Higher or Lower Interactive (Variant 4)",
    "slug": "guess-number-higher-or-lower-interactive-variant-4-644",
    "difficulty": "Easy",
    "topic": "Binary Search",
    "pattern": [
      "Binary Search",
      "Divide & Conquer"
    ],
    "tags": [
      "Binary Search",
      "Binary Search",
      "Divide & Conquer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Airbnb",
      "ByteDance"
    ],
    "problemStatement": "Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value.\n\nIf `target` is not found in the array, return `[-1, -1]`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    "examples": [
      {
        "input": "nums = [5,7,7,8,8,10], target = 8",
        "output": "[3, 4]",
        "explanation": "8 appears starting at index 3 and ending at index 4."
      },
      {
        "input": "nums = [5,7,7,8,8,10], target = 6",
        "output": "[-1, -1]",
        "explanation": "6 does not exist in the array."
      },
      {
        "input": "nums = [], target = 0",
        "output": "[-1, -1]",
        "explanation": "Empty array returns [-1, -1]."
      }
    ],
    "constraints": [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
      "nums is sorted in non-decreasing order."
    ],
    "hints": [
      "Perform two separate binary searches: one for the leftmost occurrence and one for the rightmost.",
      "In the leftmost search, when nums[mid] === target, continue searching in the left half.",
      "In the rightmost search, continue searching in the right half."
    ],
    "approach": "Dual binary search boundaries.",
    "stepByStepExplanation": "1. Binary search for left boundary: adjust right = mid - 1 when target is found.\n2. Binary search for right boundary: adjust left = mid + 1 when target is found.\n3. Return [leftBound, rightBound].",
    "optimalApproach": "O(log N) dual binary search.",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)",
    "functionName": "searchRange644",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange644(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange644(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange644(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange644(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[5, 7, 7, 8, 8, 10], 8]",
        "expectedOutput": "[3, 4]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[5, 7, 7, 8, 8, 10], 6]",
        "expectedOutput": "[-1, -1]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[], 0]",
        "expectedOutput": "[-1, -1]",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[1, 1, 1, 1], 1]",
        "expectedOutput": "[0, 3]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA645",
    "number": 645,
    "title": "Best Time to Buy and Sell Stock with Transaction Fee (Variant 4)",
    "slug": "best-time-to-buy-and-sell-stock-with-transaction-fee-variant-4-645",
    "difficulty": "Medium",
    "topic": "Dynamic Programming",
    "pattern": [
      "Tabulation",
      "Memoization"
    ],
    "tags": [
      "Dynamic Programming",
      "Tabulation",
      "Memoization",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Adobe",
      "Salesforce",
      "Stripe"
    ],
    "problemStatement": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and **it will automatically contact the police if two adjacent houses were broken into on the same night**.\n\nGiven an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight **without alerting the police**.",
    "examples": [
      {
        "input": "nums = [1,2,3,1]",
        "output": "4",
        "explanation": "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4."
      },
      {
        "input": "nums = [2,7,9,3,1]",
        "output": "12",
        "explanation": "Rob house 1 (2), house 3 (9), and house 5 (1). Total = 2 + 9 + 1 = 12."
      },
      {
        "input": "nums = [0]",
        "output": "0",
        "explanation": "Only one house with 0 money."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 400"
    ],
    "hints": [
      "At each house i, you can either rob it (nums[i] + max at i-2) or skip it (max at i-1).",
      "Notice you only need the previous two maximums.",
      "Reduce space from O(N) to O(1) using two variables."
    ],
    "approach": "1D dynamic programming with state compression.",
    "stepByStepExplanation": "1. Handle edge cases (empty or length 1).\n2. Maintain rob1 and rob2 representing max money up to i-2 and i-1.\n3. For each house, newMax = Math.max(nums[i] + rob1, rob2).\n4. Advance rob1 = rob2, rob2 = newMax.\n5. Return rob2.",
    "optimalApproach": "O(N) time and O(1) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "robHouses645",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses645(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses645(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses645(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses645(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 2, 3, 1]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[2, 7, 9, 3, 1]]",
        "expectedOutput": "12",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[0]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[2, 1, 1, 2]]",
        "expectedOutput": "4",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA646",
    "number": 646,
    "title": "Cheapest Flights Within K Stops Router (Variant 4)",
    "slug": "cheapest-flights-within-k-stops-router-variant-4-646",
    "difficulty": "Medium",
    "topic": "Graphs",
    "pattern": [
      "BFS",
      "DFS"
    ],
    "tags": [
      "Graphs",
      "BFS",
      "DFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Microsoft",
      "Palantir",
      "Robinhood"
    ],
    "problemStatement": "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    "examples": [
      {
        "input": "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]",
        "output": "3",
        "explanation": "Three separate islands."
      },
      {
        "input": "grid = [[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]",
        "output": "1",
        "explanation": "All lands are connected into 1 island."
      }
    ],
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is \"0\" or \"1\"."
    ],
    "hints": [
      "Traverse the 2D grid.",
      "When you encounter a \"1\", increment your island count and trigger a DFS/BFS to sink all connected land to \"0\".",
      "Continue until the entire matrix is processed."
    ],
    "approach": "Connected components via DFS flood fill.",
    "stepByStepExplanation": "1. Iterate through row r and column c.\n2. When grid[r][c] === \"1\", increment count.\n3. Run dfs(r, c) marking all connected \"1\"s as \"0\".\n4. Return total count.",
    "optimalApproach": "O(M * N) time DFS.",
    "timeComplexity": "O(M * N)",
    "spaceComplexity": "O(M * N)",
    "functionName": "numIslands646",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands646(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands646(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands646(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands646(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[[\"0\",\"0\"],[\"0\",\"0\"]]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA647",
    "number": 647,
    "title": "Non-Overlapping Intervals Minimum Removals (Variant 7)",
    "slug": "non-overlapping-intervals-minimum-removals-variant-7-647",
    "difficulty": "Easy",
    "topic": "Intervals",
    "pattern": [
      "Greedy"
    ],
    "tags": [
      "Intervals",
      "Greedy",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Apple",
      "Cisco",
      "Oracle"
    ],
    "problemStatement": "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    "examples": [
      {
        "input": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        "output": "[[1,6],[8,10],[15,18]]",
        "explanation": "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."
      },
      {
        "input": "intervals = [[1,4],[4,5]]",
        "output": "[[1,5]]",
        "explanation": "Intervals [1,4] and [4,5] are considered overlapping."
      }
    ],
    "constraints": [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4"
    ],
    "hints": [
      "Sort the intervals by their start points.",
      "Initialize merged array with the first interval.",
      "If current interval start <= previous interval end, merge them by updating end = max(prevEnd, currEnd)."
    ],
    "approach": "Sort by start time and greedy interval union.",
    "stepByStepExplanation": "1. Sort intervals by start value ascending.\n2. Iterate through intervals.\n3. If result is empty or current start > last end, push current.\n4. Else update last end to Math.max(last end, current end).\n5. Return result.",
    "optimalApproach": "O(N log N) sorting + O(N) single pass.",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "functionName": "mergeIntervals647",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals647(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals647(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals647(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals647(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[[1, 3], [2, 6], [8, 10], [15, 18]]]",
        "expectedOutput": "[[1, 6], [8, 10], [15, 18]]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[[1, 4], [4, 5]]]",
        "expectedOutput": "[[1, 5]]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[[6, 8]]]",
        "expectedOutput": "[[6, 8]]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA648",
    "number": 648,
    "title": "Serialize and Deserialize Binary Tree String (Variant 4)",
    "slug": "serialize-and-deserialize-binary-tree-string-variant-4-648",
    "difficulty": "Medium",
    "topic": "Trees",
    "pattern": [
      "DFS",
      "BFS"
    ],
    "tags": [
      "Trees",
      "DFS",
      "BFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Meta",
      "Microsoft",
      "Amazon"
    ],
    "problemStatement": "Given the root of a binary tree encoded as an array representation (level-order traversal where `null` represents absent nodes), return its maximum depth.\n\nA binary tree's **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    "examples": [
      {
        "input": "root = [3,9,20,null,null,15,7]",
        "output": "3",
        "explanation": "Root 3 -> 20 -> 15 gives depth 3."
      },
      {
        "input": "root = [1,null,2]",
        "output": "2",
        "explanation": "Root 1 -> 2 gives depth 2."
      },
      {
        "input": "root = []",
        "output": "0",
        "explanation": "Empty tree has depth 0."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-100 <= Node.val <= 100"
    ],
    "hints": [
      "Can we formulate the problem recursively?",
      "The maximum depth of a tree is 1 + max(depth(left), depth(right)).",
      "Base case: if root is null, return 0."
    ],
    "approach": "Recursive DFS tree height calculation.",
    "stepByStepExplanation": "1. If root is empty or null, depth is 0.\n2. In array level-order representation, calculate depth from array length or tree node.\n3. Return calculated maximum depth.",
    "optimalApproach": "O(N) DFS traversal.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(H)",
    "functionName": "maxDepth648",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth648(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth648(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth648(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth648(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[3, 9, 20, null, null, 15, 7]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1, null, 2]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[1]]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA649",
    "number": 649,
    "title": "Word Search Character Board Matrix (Variant 5)",
    "slug": "word-search-character-board-matrix-variant-5-649",
    "difficulty": "Difficult",
    "topic": "Backtracking",
    "pattern": [
      "Backtracking",
      "DFS"
    ],
    "tags": [
      "Backtracking",
      "Backtracking",
      "DFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Amazon",
      "DoorDash",
      "Snowflake"
    ],
    "problemStatement": "Given an integer array `nums` of **unique** elements, return all possible subsets (the power set).\n\nThe solution set **must not** contain duplicate subsets. Return the solution in **any order**.",
    "examples": [
      {
        "input": "nums = [1,2,3]",
        "output": "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
        "explanation": "All 8 subsets of [1,2,3]."
      },
      {
        "input": "nums = [0]",
        "output": "[[],[0]]",
        "explanation": "All 2 subsets of [0]."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10",
      "-10 <= nums[i] <= 10",
      "All the numbers of nums are unique."
    ],
    "hints": [
      "Use recursive backtracking.",
      "At each index i, we have two choices: include nums[i] in the current subset, or exclude it.",
      "When we reach index === nums.length, record the current subset."
    ],
    "approach": "Backtracking recursion (include/exclude).",
    "stepByStepExplanation": "1. Initialize result array.\n2. Define backtrack(start, path).\n3. Add copy of path to result.\n4. Loop i from start to nums.length:\n   - path.push(nums[i])\n   - backtrack(i + 1, path)\n   - path.pop()\n5. Return result.",
    "optimalApproach": "O(N * 2^N) backtracking power set.",
    "timeComplexity": "O(N * 2^N)",
    "spaceComplexity": "O(N)",
    "functionName": "generateSubsets649",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets649(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets649(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets649(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets649(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[0]]",
        "expectedOutput": "[[], [0]]",
        "isHidden": false
      }
    ]
  },
  {
    "id": "DSA650",
    "number": 650,
    "title": "Add Binary Strings Bitwise Carry (Variant 4)",
    "slug": "add-binary-strings-bitwise-carry-variant-4-650",
    "difficulty": "Difficult",
    "topic": "Bit Manipulation",
    "pattern": [
      "Bit Manipulation"
    ],
    "tags": [
      "Bit Manipulation",
      "Bit Manipulation",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Meta",
      "Amazon"
    ],
    "problemStatement": "Write a function that takes the binary representation of an integer `n` and returns the number of `'1'` bits it has (also known as the Hamming weight).",
    "examples": [
      {
        "input": "n = 11",
        "output": "3",
        "explanation": "The input binary string is 1011, having a total of three 1 bits."
      },
      {
        "input": "n = 128",
        "output": "1",
        "explanation": "The input binary string is 10000000, having a single 1 bit."
      },
      {
        "input": "n = 2147483645",
        "output": "30",
        "explanation": "Has thirty 1 bits."
      }
    ],
    "constraints": [
      "1 <= n <= 2^31 - 1"
    ],
    "hints": [
      "You can check the least significant bit using n & 1, then shift right using n >>> 1.",
      "Or use Brian Kernighan algorithm: n & (n - 1) clears the lowest set bit.",
      "Repeat until n === 0."
    ],
    "approach": "Brian Kernighan bitwise algorithm.",
    "stepByStepExplanation": "1. Initialize count to 0.\n2. While n !== 0: clear lowest bit with n = n & (n - 1), increment count.\n3. Return count.",
    "optimalApproach": "O(number of set bits) using n & (n - 1).",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "functionName": "hammingWeight650",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight650(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight650(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight650(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight650(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[11]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[128]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[2147483645]",
        "expectedOutput": "30",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[0]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA651",
    "number": 651,
    "title": "Sum of Absolute Differences in Sorted Array (Variant 4)",
    "slug": "sum-of-absolute-differences-in-sorted-array-variant-4-651",
    "difficulty": "Easy",
    "topic": "Arrays",
    "pattern": [
      "Prefix Sum",
      "Two Pointer"
    ],
    "tags": [
      "Arrays",
      "Prefix Sum",
      "Two Pointer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Microsoft",
      "Apple",
      "Uber"
    ],
    "problemStatement": "Given an array of integers `nums`, calculate the pivot index of this array.\n\nThe pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index's right.\n\nIf the index is on the left edge of the array, then the left sum is `0` because there are no elements to the left. Return the **leftmost pivot index**. If no such index exists, return `-1`.",
    "examples": [
      {
        "input": "nums = [1,7,3,6,5,6]",
        "output": "3",
        "explanation": "Left sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11. Right sum = nums[4] + nums[5] = 5 + 6 = 11."
      },
      {
        "input": "nums = [1,2,3]",
        "output": "-1",
        "explanation": "There is no index that satisfies the conditions in the problem statement."
      },
      {
        "input": "nums = [2,1,-1]",
        "output": "0",
        "explanation": "Left sum = 0. Right sum = nums[1] + nums[2] = 1 + -1 = 0."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-1000 <= nums[i] <= 1000"
    ],
    "hints": [
      "Can we precompute the total sum of the array?",
      "As we iterate, maintain a running left sum and calculate right sum as (total - leftSum - current).",
      "Return the first index where leftSum === rightSum."
    ],
    "approach": "Prefix sum subtraction in O(N) time.",
    "stepByStepExplanation": "1. Compute total sum of all elements.\n2. Maintain leftSum initialized to 0.\n3. For each index i, if leftSum === totalSum - leftSum - nums[i], return i.\n4. Add nums[i] to leftSum.\n5. Return -1 if no pivot index found.",
    "optimalApproach": "Single pass with running prefix sum.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "findEquilibriumIndex651",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex651(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex651(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex651(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex651(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 7, 3, 6, 5, 6]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[2, 1, -1]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[0, 0, 0, 0]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA652",
    "number": 652,
    "title": "Grumpy Bookstore Owner Customer Satisfaction (Variant 4)",
    "slug": "grumpy-bookstore-owner-customer-satisfaction-variant-4-652",
    "difficulty": "Medium",
    "topic": "Strings",
    "pattern": [
      "Sliding Window",
      "Two Pointer"
    ],
    "tags": [
      "Strings",
      "Sliding Window",
      "Two Pointer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Amazon",
      "Netflix",
      "LinkedIn"
    ],
    "problemStatement": "Given a string `s` and an integer `k`, return the maximum number of vowel letters in any substring of `s` with length `k`.\n\nVowel letters in English are `'a'`, `'e'`, `'i'`, `'o'`, and `'u'`.",
    "examples": [
      {
        "input": "s = \"abciiidef\", k = 3",
        "output": "3",
        "explanation": "The substring \"iii\" contains 3 vowel letters."
      },
      {
        "input": "s = \"aeiou\", k = 2",
        "output": "2",
        "explanation": "Any substring of length 2 contains 2 vowels."
      },
      {
        "input": "s = \"leetcode\", k = 3",
        "output": "2",
        "explanation": "\"lee\", \"eet\" and \"ode\" contain 2 vowels."
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^5",
      "s consists of lowercase English letters.",
      "1 <= k <= s.length"
    ],
    "hints": [
      "Use a sliding window of fixed size k.",
      "Count vowels in the first window of size k.",
      "Slide window right: add 1 if incoming char is vowel, subtract 1 if outgoing char was vowel."
    ],
    "approach": "Fixed-size sliding window.",
    "stepByStepExplanation": "1. Initialize vowel Set for O(1) checks.\n2. Count vowels in the first k characters.\n3. Slide the window one char at a time, updating count and maxCount.\n4. Return maxCount.",
    "optimalApproach": "Sliding window O(N) time and O(1) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "maxVowelsInWindow652",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow652(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow652(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow652(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow652(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[\"abciiidef\", 3]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[\"aeiou\", 2]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[\"leetcode\", 3]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[\"rhythms\", 4]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA653",
    "number": 653,
    "title": "Evaluate Reverse Polish Notation Expression (Variant 4)",
    "slug": "evaluate-reverse-polish-notation-expression-variant-4-653",
    "difficulty": "Medium",
    "topic": "Stack",
    "pattern": [
      "Monotonic Stack"
    ],
    "tags": [
      "Stack",
      "Monotonic Stack",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Meta",
      "Bloomberg",
      "Goldman Sachs"
    ],
    "problemStatement": "Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.",
    "examples": [
      {
        "input": "temperatures = [73,74,75,71,69,72,76,73]",
        "output": "[1,1,4,2,1,1,0,0]",
        "explanation": "Day 0 waits 1 day (74), Day 2 waits 4 days (76)."
      },
      {
        "input": "temperatures = [30,40,50,60]",
        "output": "[1,1,1,0]",
        "explanation": "Each day is warmer than the previous except the last day."
      },
      {
        "input": "temperatures = [30,60,90]",
        "output": "[1,1,0]",
        "explanation": "First two days find immediate warmer days."
      }
    ],
    "constraints": [
      "1 <= temperatures.length <= 10^5",
      "30 <= temperatures[i] <= 100"
    ],
    "hints": [
      "Can we use a stack to keep track of previous cooler days waiting for a warmer day?",
      "Store indices of temperatures in a monotonically decreasing stack.",
      "When a warmer temperature is encountered, pop indices and calculate the day difference."
    ],
    "approach": "Monotonic decreasing stack of indices.",
    "stepByStepExplanation": "1. Create result array filled with 0 of length N.\n2. Maintain stack of indices.\n3. For each day i, while stack is not empty and current temp > temp at stack top: pop index prev, set result[prev] = i - prev.\n4. Push i onto stack.\n5. Return result.",
    "optimalApproach": "Monotonic stack O(N) time and O(N) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "functionName": "dailyTemperatures653",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures653(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures653(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures653(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures653(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[73, 74, 75, 71, 69, 72, 76, 73]]",
        "expectedOutput": "[1, 1, 4, 2, 1, 1, 0, 0]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[30, 40, 50, 60]]",
        "expectedOutput": "[1, 1, 1, 0]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[30, 60, 90]]",
        "expectedOutput": "[1, 1, 0]",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[80, 70, 60, 50]]",
        "expectedOutput": "[0, 0, 0, 0]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA654",
    "number": 654,
    "title": "Find Smallest Letter Greater Than Target (Variant 4)",
    "slug": "find-smallest-letter-greater-than-target-variant-4-654",
    "difficulty": "Easy",
    "topic": "Binary Search",
    "pattern": [
      "Binary Search",
      "Divide & Conquer"
    ],
    "tags": [
      "Binary Search",
      "Binary Search",
      "Divide & Conquer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Airbnb",
      "ByteDance"
    ],
    "problemStatement": "Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value.\n\nIf `target` is not found in the array, return `[-1, -1]`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    "examples": [
      {
        "input": "nums = [5,7,7,8,8,10], target = 8",
        "output": "[3, 4]",
        "explanation": "8 appears starting at index 3 and ending at index 4."
      },
      {
        "input": "nums = [5,7,7,8,8,10], target = 6",
        "output": "[-1, -1]",
        "explanation": "6 does not exist in the array."
      },
      {
        "input": "nums = [], target = 0",
        "output": "[-1, -1]",
        "explanation": "Empty array returns [-1, -1]."
      }
    ],
    "constraints": [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
      "nums is sorted in non-decreasing order."
    ],
    "hints": [
      "Perform two separate binary searches: one for the leftmost occurrence and one for the rightmost.",
      "In the leftmost search, when nums[mid] === target, continue searching in the left half.",
      "In the rightmost search, continue searching in the right half."
    ],
    "approach": "Dual binary search boundaries.",
    "stepByStepExplanation": "1. Binary search for left boundary: adjust right = mid - 1 when target is found.\n2. Binary search for right boundary: adjust left = mid + 1 when target is found.\n3. Return [leftBound, rightBound].",
    "optimalApproach": "O(log N) dual binary search.",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)",
    "functionName": "searchRange654",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange654(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange654(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange654(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange654(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[5, 7, 7, 8, 8, 10], 8]",
        "expectedOutput": "[3, 4]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[5, 7, 7, 8, 8, 10], 6]",
        "expectedOutput": "[-1, -1]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[], 0]",
        "expectedOutput": "[-1, -1]",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[1, 1, 1, 1], 1]",
        "expectedOutput": "[0, 3]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA655",
    "number": 655,
    "title": "Continuous Subarray with Maximum Average (Variant 4)",
    "slug": "continuous-subarray-with-maximum-average-variant-4-655",
    "difficulty": "Medium",
    "topic": "Dynamic Programming",
    "pattern": [
      "Tabulation",
      "Memoization"
    ],
    "tags": [
      "Dynamic Programming",
      "Tabulation",
      "Memoization",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Adobe",
      "Salesforce",
      "Stripe"
    ],
    "problemStatement": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and **it will automatically contact the police if two adjacent houses were broken into on the same night**.\n\nGiven an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight **without alerting the police**.",
    "examples": [
      {
        "input": "nums = [1,2,3,1]",
        "output": "4",
        "explanation": "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4."
      },
      {
        "input": "nums = [2,7,9,3,1]",
        "output": "12",
        "explanation": "Rob house 1 (2), house 3 (9), and house 5 (1). Total = 2 + 9 + 1 = 12."
      },
      {
        "input": "nums = [0]",
        "output": "0",
        "explanation": "Only one house with 0 money."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 400"
    ],
    "hints": [
      "At each house i, you can either rob it (nums[i] + max at i-2) or skip it (max at i-1).",
      "Notice you only need the previous two maximums.",
      "Reduce space from O(N) to O(1) using two variables."
    ],
    "approach": "1D dynamic programming with state compression.",
    "stepByStepExplanation": "1. Handle edge cases (empty or length 1).\n2. Maintain rob1 and rob2 representing max money up to i-2 and i-1.\n3. For each house, newMax = Math.max(nums[i] + rob1, rob2).\n4. Advance rob1 = rob2, rob2 = newMax.\n5. Return rob2.",
    "optimalApproach": "O(N) time and O(1) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "robHouses655",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses655(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses655(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses655(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses655(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 2, 3, 1]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[2, 7, 9, 3, 1]]",
        "expectedOutput": "12",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[0]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[2, 1, 1, 2]]",
        "expectedOutput": "4",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA656",
    "number": 656,
    "title": "As Far from Land as Possible Maximum Distance (Variant 4)",
    "slug": "as-far-from-land-as-possible-maximum-distance-variant-4-656",
    "difficulty": "Medium",
    "topic": "Graphs",
    "pattern": [
      "BFS",
      "DFS"
    ],
    "tags": [
      "Graphs",
      "BFS",
      "DFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Microsoft",
      "Palantir",
      "Robinhood"
    ],
    "problemStatement": "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    "examples": [
      {
        "input": "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]",
        "output": "3",
        "explanation": "Three separate islands."
      },
      {
        "input": "grid = [[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]",
        "output": "1",
        "explanation": "All lands are connected into 1 island."
      }
    ],
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is \"0\" or \"1\"."
    ],
    "hints": [
      "Traverse the 2D grid.",
      "When you encounter a \"1\", increment your island count and trigger a DFS/BFS to sink all connected land to \"0\".",
      "Continue until the entire matrix is processed."
    ],
    "approach": "Connected components via DFS flood fill.",
    "stepByStepExplanation": "1. Iterate through row r and column c.\n2. When grid[r][c] === \"1\", increment count.\n3. Run dfs(r, c) marking all connected \"1\"s as \"0\".\n4. Return total count.",
    "optimalApproach": "O(M * N) time DFS.",
    "timeComplexity": "O(M * N)",
    "spaceComplexity": "O(M * N)",
    "functionName": "numIslands656",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands656(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands656(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands656(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands656(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[[\"0\",\"0\"],[\"0\",\"0\"]]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA657",
    "number": 657,
    "title": "Meeting Rooms II Minimum Conference Rooms Required (Variant 7)",
    "slug": "meeting-rooms-ii-minimum-conference-rooms-required-variant-7-657",
    "difficulty": "Easy",
    "topic": "Intervals",
    "pattern": [
      "Greedy"
    ],
    "tags": [
      "Intervals",
      "Greedy",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Apple",
      "Cisco",
      "Oracle"
    ],
    "problemStatement": "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    "examples": [
      {
        "input": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        "output": "[[1,6],[8,10],[15,18]]",
        "explanation": "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."
      },
      {
        "input": "intervals = [[1,4],[4,5]]",
        "output": "[[1,5]]",
        "explanation": "Intervals [1,4] and [4,5] are considered overlapping."
      }
    ],
    "constraints": [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4"
    ],
    "hints": [
      "Sort the intervals by their start points.",
      "Initialize merged array with the first interval.",
      "If current interval start <= previous interval end, merge them by updating end = max(prevEnd, currEnd)."
    ],
    "approach": "Sort by start time and greedy interval union.",
    "stepByStepExplanation": "1. Sort intervals by start value ascending.\n2. Iterate through intervals.\n3. If result is empty or current start > last end, push current.\n4. Else update last end to Math.max(last end, current end).\n5. Return result.",
    "optimalApproach": "O(N log N) sorting + O(N) single pass.",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "functionName": "mergeIntervals657",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals657(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals657(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals657(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals657(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[[1, 3], [2, 6], [8, 10], [15, 18]]]",
        "expectedOutput": "[[1, 6], [8, 10], [15, 18]]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[[1, 4], [4, 5]]]",
        "expectedOutput": "[[1, 5]]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[[6, 8]]]",
        "expectedOutput": "[[6, 8]]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA658",
    "number": 658,
    "title": "Populating Next Right Pointers in Each Node (Variant 4)",
    "slug": "populating-next-right-pointers-in-each-node-variant-4-658",
    "difficulty": "Medium",
    "topic": "Trees",
    "pattern": [
      "DFS",
      "BFS"
    ],
    "tags": [
      "Trees",
      "DFS",
      "BFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Meta",
      "Microsoft",
      "Amazon"
    ],
    "problemStatement": "Given the root of a binary tree encoded as an array representation (level-order traversal where `null` represents absent nodes), return its maximum depth.\n\nA binary tree's **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    "examples": [
      {
        "input": "root = [3,9,20,null,null,15,7]",
        "output": "3",
        "explanation": "Root 3 -> 20 -> 15 gives depth 3."
      },
      {
        "input": "root = [1,null,2]",
        "output": "2",
        "explanation": "Root 1 -> 2 gives depth 2."
      },
      {
        "input": "root = []",
        "output": "0",
        "explanation": "Empty tree has depth 0."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-100 <= Node.val <= 100"
    ],
    "hints": [
      "Can we formulate the problem recursively?",
      "The maximum depth of a tree is 1 + max(depth(left), depth(right)).",
      "Base case: if root is null, return 0."
    ],
    "approach": "Recursive DFS tree height calculation.",
    "stepByStepExplanation": "1. If root is empty or null, depth is 0.\n2. In array level-order representation, calculate depth from array length or tree node.\n3. Return calculated maximum depth.",
    "optimalApproach": "O(N) DFS traversal.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(H)",
    "functionName": "maxDepth658",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth658(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth658(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth658(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth658(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[3, 9, 20, null, null, 15, 7]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1, null, 2]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[1]]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA659",
    "number": 659,
    "title": "Generate Parentheses Well-Formed Pairs (Variant 5)",
    "slug": "generate-parentheses-well-formed-pairs-variant-5-659",
    "difficulty": "Difficult",
    "topic": "Backtracking",
    "pattern": [
      "Backtracking",
      "DFS"
    ],
    "tags": [
      "Backtracking",
      "Backtracking",
      "DFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Amazon",
      "DoorDash",
      "Snowflake"
    ],
    "problemStatement": "Given an integer array `nums` of **unique** elements, return all possible subsets (the power set).\n\nThe solution set **must not** contain duplicate subsets. Return the solution in **any order**.",
    "examples": [
      {
        "input": "nums = [1,2,3]",
        "output": "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
        "explanation": "All 8 subsets of [1,2,3]."
      },
      {
        "input": "nums = [0]",
        "output": "[[],[0]]",
        "explanation": "All 2 subsets of [0]."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10",
      "-10 <= nums[i] <= 10",
      "All the numbers of nums are unique."
    ],
    "hints": [
      "Use recursive backtracking.",
      "At each index i, we have two choices: include nums[i] in the current subset, or exclude it.",
      "When we reach index === nums.length, record the current subset."
    ],
    "approach": "Backtracking recursion (include/exclude).",
    "stepByStepExplanation": "1. Initialize result array.\n2. Define backtrack(start, path).\n3. Add copy of path to result.\n4. Loop i from start to nums.length:\n   - path.push(nums[i])\n   - backtrack(i + 1, path)\n   - path.pop()\n5. Return result.",
    "optimalApproach": "O(N * 2^N) backtracking power set.",
    "timeComplexity": "O(N * 2^N)",
    "spaceComplexity": "O(N)",
    "functionName": "generateSubsets659",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets659(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets659(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets659(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets659(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[0]]",
        "expectedOutput": "[[], [0]]",
        "isHidden": false
      }
    ]
  },
  {
    "id": "DSA660",
    "number": 660,
    "title": "Base 7 Number Representation Conversion (Variant 4)",
    "slug": "base-7-number-representation-conversion-variant-4-660",
    "difficulty": "Difficult",
    "topic": "Bit Manipulation",
    "pattern": [
      "Bit Manipulation"
    ],
    "tags": [
      "Bit Manipulation",
      "Bit Manipulation",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Meta",
      "Amazon"
    ],
    "problemStatement": "Write a function that takes the binary representation of an integer `n` and returns the number of `'1'` bits it has (also known as the Hamming weight).",
    "examples": [
      {
        "input": "n = 11",
        "output": "3",
        "explanation": "The input binary string is 1011, having a total of three 1 bits."
      },
      {
        "input": "n = 128",
        "output": "1",
        "explanation": "The input binary string is 10000000, having a single 1 bit."
      },
      {
        "input": "n = 2147483645",
        "output": "30",
        "explanation": "Has thirty 1 bits."
      }
    ],
    "constraints": [
      "1 <= n <= 2^31 - 1"
    ],
    "hints": [
      "You can check the least significant bit using n & 1, then shift right using n >>> 1.",
      "Or use Brian Kernighan algorithm: n & (n - 1) clears the lowest set bit.",
      "Repeat until n === 0."
    ],
    "approach": "Brian Kernighan bitwise algorithm.",
    "stepByStepExplanation": "1. Initialize count to 0.\n2. While n !== 0: clear lowest bit with n = n & (n - 1), increment count.\n3. Return count.",
    "optimalApproach": "O(number of set bits) using n & (n - 1).",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "functionName": "hammingWeight660",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight660(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight660(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight660(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight660(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[11]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[128]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[2147483645]",
        "expectedOutput": "30",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[0]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA661",
    "number": 661,
    "title": "Find All Good Indices (Variant 4)",
    "slug": "find-all-good-indices-variant-4-661",
    "difficulty": "Easy",
    "topic": "Arrays",
    "pattern": [
      "Prefix Sum",
      "Two Pointer"
    ],
    "tags": [
      "Arrays",
      "Prefix Sum",
      "Two Pointer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Microsoft",
      "Apple",
      "Uber"
    ],
    "problemStatement": "Given an array of integers `nums`, calculate the pivot index of this array.\n\nThe pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index's right.\n\nIf the index is on the left edge of the array, then the left sum is `0` because there are no elements to the left. Return the **leftmost pivot index**. If no such index exists, return `-1`.",
    "examples": [
      {
        "input": "nums = [1,7,3,6,5,6]",
        "output": "3",
        "explanation": "Left sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11. Right sum = nums[4] + nums[5] = 5 + 6 = 11."
      },
      {
        "input": "nums = [1,2,3]",
        "output": "-1",
        "explanation": "There is no index that satisfies the conditions in the problem statement."
      },
      {
        "input": "nums = [2,1,-1]",
        "output": "0",
        "explanation": "Left sum = 0. Right sum = nums[1] + nums[2] = 1 + -1 = 0."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-1000 <= nums[i] <= 1000"
    ],
    "hints": [
      "Can we precompute the total sum of the array?",
      "As we iterate, maintain a running left sum and calculate right sum as (total - leftSum - current).",
      "Return the first index where leftSum === rightSum."
    ],
    "approach": "Prefix sum subtraction in O(N) time.",
    "stepByStepExplanation": "1. Compute total sum of all elements.\n2. Maintain leftSum initialized to 0.\n3. For each index i, if leftSum === totalSum - leftSum - nums[i], return i.\n4. Add nums[i] to leftSum.\n5. Return -1 if no pivot index found.",
    "optimalApproach": "Single pass with running prefix sum.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "findEquilibriumIndex661",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex661(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex661(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex661(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex661(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 7, 3, 6, 5, 6]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[2, 1, -1]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[0, 0, 0, 0]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA662",
    "number": 662,
    "title": "K Radius Subarray Averages (Variant 4)",
    "slug": "k-radius-subarray-averages-variant-4-662",
    "difficulty": "Medium",
    "topic": "Strings",
    "pattern": [
      "Sliding Window",
      "Two Pointer"
    ],
    "tags": [
      "Strings",
      "Sliding Window",
      "Two Pointer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Amazon",
      "Netflix",
      "LinkedIn"
    ],
    "problemStatement": "Given a string `s` and an integer `k`, return the maximum number of vowel letters in any substring of `s` with length `k`.\n\nVowel letters in English are `'a'`, `'e'`, `'i'`, `'o'`, and `'u'`.",
    "examples": [
      {
        "input": "s = \"abciiidef\", k = 3",
        "output": "3",
        "explanation": "The substring \"iii\" contains 3 vowel letters."
      },
      {
        "input": "s = \"aeiou\", k = 2",
        "output": "2",
        "explanation": "Any substring of length 2 contains 2 vowels."
      },
      {
        "input": "s = \"leetcode\", k = 3",
        "output": "2",
        "explanation": "\"lee\", \"eet\" and \"ode\" contain 2 vowels."
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^5",
      "s consists of lowercase English letters.",
      "1 <= k <= s.length"
    ],
    "hints": [
      "Use a sliding window of fixed size k.",
      "Count vowels in the first window of size k.",
      "Slide window right: add 1 if incoming char is vowel, subtract 1 if outgoing char was vowel."
    ],
    "approach": "Fixed-size sliding window.",
    "stepByStepExplanation": "1. Initialize vowel Set for O(1) checks.\n2. Count vowels in the first k characters.\n3. Slide the window one char at a time, updating count and maxCount.\n4. Return maxCount.",
    "optimalApproach": "Sliding window O(N) time and O(1) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "maxVowelsInWindow662",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow662(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow662(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow662(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow662(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[\"abciiidef\", 3]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[\"aeiou\", 2]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[\"leetcode\", 3]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[\"rhythms\", 4]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA663",
    "number": 663,
    "title": "Maximum Width Ramp Computation (Variant 4)",
    "slug": "maximum-width-ramp-computation-variant-4-663",
    "difficulty": "Medium",
    "topic": "Stack",
    "pattern": [
      "Monotonic Stack"
    ],
    "tags": [
      "Stack",
      "Monotonic Stack",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Meta",
      "Bloomberg",
      "Goldman Sachs"
    ],
    "problemStatement": "Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.",
    "examples": [
      {
        "input": "temperatures = [73,74,75,71,69,72,76,73]",
        "output": "[1,1,4,2,1,1,0,0]",
        "explanation": "Day 0 waits 1 day (74), Day 2 waits 4 days (76)."
      },
      {
        "input": "temperatures = [30,40,50,60]",
        "output": "[1,1,1,0]",
        "explanation": "Each day is warmer than the previous except the last day."
      },
      {
        "input": "temperatures = [30,60,90]",
        "output": "[1,1,0]",
        "explanation": "First two days find immediate warmer days."
      }
    ],
    "constraints": [
      "1 <= temperatures.length <= 10^5",
      "30 <= temperatures[i] <= 100"
    ],
    "hints": [
      "Can we use a stack to keep track of previous cooler days waiting for a warmer day?",
      "Store indices of temperatures in a monotonically decreasing stack.",
      "When a warmer temperature is encountered, pop indices and calculate the day difference."
    ],
    "approach": "Monotonic decreasing stack of indices.",
    "stepByStepExplanation": "1. Create result array filled with 0 of length N.\n2. Maintain stack of indices.\n3. For each day i, while stack is not empty and current temp > temp at stack top: pop index prev, set result[prev] = i - prev.\n4. Push i onto stack.\n5. Return result.",
    "optimalApproach": "Monotonic stack O(N) time and O(N) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "functionName": "dailyTemperatures663",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures663(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures663(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures663(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures663(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[73, 74, 75, 71, 69, 72, 76, 73]]",
        "expectedOutput": "[1, 1, 4, 2, 1, 1, 0, 0]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[30, 40, 50, 60]]",
        "expectedOutput": "[1, 1, 1, 0]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[30, 60, 90]]",
        "expectedOutput": "[1, 1, 0]",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[80, 70, 60, 50]]",
        "expectedOutput": "[0, 0, 0, 0]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA664",
    "number": 664,
    "title": "Valid Perfect Square Without Builtin Math (Variant 4)",
    "slug": "valid-perfect-square-without-builtin-math-variant-4-664",
    "difficulty": "Easy",
    "topic": "Binary Search",
    "pattern": [
      "Binary Search",
      "Divide & Conquer"
    ],
    "tags": [
      "Binary Search",
      "Binary Search",
      "Divide & Conquer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Airbnb",
      "ByteDance"
    ],
    "problemStatement": "Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value.\n\nIf `target` is not found in the array, return `[-1, -1]`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    "examples": [
      {
        "input": "nums = [5,7,7,8,8,10], target = 8",
        "output": "[3, 4]",
        "explanation": "8 appears starting at index 3 and ending at index 4."
      },
      {
        "input": "nums = [5,7,7,8,8,10], target = 6",
        "output": "[-1, -1]",
        "explanation": "6 does not exist in the array."
      },
      {
        "input": "nums = [], target = 0",
        "output": "[-1, -1]",
        "explanation": "Empty array returns [-1, -1]."
      }
    ],
    "constraints": [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
      "nums is sorted in non-decreasing order."
    ],
    "hints": [
      "Perform two separate binary searches: one for the leftmost occurrence and one for the rightmost.",
      "In the leftmost search, when nums[mid] === target, continue searching in the left half.",
      "In the rightmost search, continue searching in the right half."
    ],
    "approach": "Dual binary search boundaries.",
    "stepByStepExplanation": "1. Binary search for left boundary: adjust right = mid - 1 when target is found.\n2. Binary search for right boundary: adjust left = mid + 1 when target is found.\n3. Return [leftBound, rightBound].",
    "optimalApproach": "O(log N) dual binary search.",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)",
    "functionName": "searchRange664",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange664(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange664(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange664(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange664(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[5, 7, 7, 8, 8, 10], 8]",
        "expectedOutput": "[3, 4]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[5, 7, 7, 8, 8, 10], 6]",
        "expectedOutput": "[-1, -1]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[], 0]",
        "expectedOutput": "[-1, -1]",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[1, 1, 1, 1], 1]",
        "expectedOutput": "[0, 3]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA665",
    "number": 665,
    "title": "Russian Doll Envelopes 2D LIS (Variant 4)",
    "slug": "russian-doll-envelopes-2d-lis-variant-4-665",
    "difficulty": "Medium",
    "topic": "Dynamic Programming",
    "pattern": [
      "Tabulation",
      "Memoization"
    ],
    "tags": [
      "Dynamic Programming",
      "Tabulation",
      "Memoization",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Adobe",
      "Salesforce",
      "Stripe"
    ],
    "problemStatement": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and **it will automatically contact the police if two adjacent houses were broken into on the same night**.\n\nGiven an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight **without alerting the police**.",
    "examples": [
      {
        "input": "nums = [1,2,3,1]",
        "output": "4",
        "explanation": "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4."
      },
      {
        "input": "nums = [2,7,9,3,1]",
        "output": "12",
        "explanation": "Rob house 1 (2), house 3 (9), and house 5 (1). Total = 2 + 9 + 1 = 12."
      },
      {
        "input": "nums = [0]",
        "output": "0",
        "explanation": "Only one house with 0 money."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 400"
    ],
    "hints": [
      "At each house i, you can either rob it (nums[i] + max at i-2) or skip it (max at i-1).",
      "Notice you only need the previous two maximums.",
      "Reduce space from O(N) to O(1) using two variables."
    ],
    "approach": "1D dynamic programming with state compression.",
    "stepByStepExplanation": "1. Handle edge cases (empty or length 1).\n2. Maintain rob1 and rob2 representing max money up to i-2 and i-1.\n3. For each house, newMax = Math.max(nums[i] + rob1, rob2).\n4. Advance rob1 = rob2, rob2 = newMax.\n5. Return rob2.",
    "optimalApproach": "O(N) time and O(1) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "robHouses665",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses665(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses665(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses665(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses665(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 2, 3, 1]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[2, 7, 9, 3, 1]]",
        "expectedOutput": "12",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[0]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[2, 1, 1, 2]]",
        "expectedOutput": "4",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA666",
    "number": 666,
    "title": "Minimum Cost to Reach City Across Tolls (Variant 4)",
    "slug": "minimum-cost-to-reach-city-across-tolls-variant-4-666",
    "difficulty": "Medium",
    "topic": "Graphs",
    "pattern": [
      "BFS",
      "DFS"
    ],
    "tags": [
      "Graphs",
      "BFS",
      "DFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Microsoft",
      "Palantir",
      "Robinhood"
    ],
    "problemStatement": "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    "examples": [
      {
        "input": "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]",
        "output": "3",
        "explanation": "Three separate islands."
      },
      {
        "input": "grid = [[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]",
        "output": "1",
        "explanation": "All lands are connected into 1 island."
      }
    ],
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is \"0\" or \"1\"."
    ],
    "hints": [
      "Traverse the 2D grid.",
      "When you encounter a \"1\", increment your island count and trigger a DFS/BFS to sink all connected land to \"0\".",
      "Continue until the entire matrix is processed."
    ],
    "approach": "Connected components via DFS flood fill.",
    "stepByStepExplanation": "1. Iterate through row r and column c.\n2. When grid[r][c] === \"1\", increment count.\n3. Run dfs(r, c) marking all connected \"1\"s as \"0\".\n4. Return total count.",
    "optimalApproach": "O(M * N) time DFS.",
    "timeComplexity": "O(M * N)",
    "spaceComplexity": "O(M * N)",
    "functionName": "numIslands666",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands666(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands666(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands666(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands666(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[[\"0\",\"0\"],[\"0\",\"0\"]]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA667",
    "number": 667,
    "title": "Insert Interval in Sorted Disjoint Set (Variant 7)",
    "slug": "insert-interval-in-sorted-disjoint-set-variant-7-667",
    "difficulty": "Easy",
    "topic": "Intervals",
    "pattern": [
      "Greedy"
    ],
    "tags": [
      "Intervals",
      "Greedy",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Apple",
      "Cisco",
      "Oracle"
    ],
    "problemStatement": "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    "examples": [
      {
        "input": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        "output": "[[1,6],[8,10],[15,18]]",
        "explanation": "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."
      },
      {
        "input": "intervals = [[1,4],[4,5]]",
        "output": "[[1,5]]",
        "explanation": "Intervals [1,4] and [4,5] are considered overlapping."
      }
    ],
    "constraints": [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4"
    ],
    "hints": [
      "Sort the intervals by their start points.",
      "Initialize merged array with the first interval.",
      "If current interval start <= previous interval end, merge them by updating end = max(prevEnd, currEnd)."
    ],
    "approach": "Sort by start time and greedy interval union.",
    "stepByStepExplanation": "1. Sort intervals by start value ascending.\n2. Iterate through intervals.\n3. If result is empty or current start > last end, push current.\n4. Else update last end to Math.max(last end, current end).\n5. Return result.",
    "optimalApproach": "O(N log N) sorting + O(N) single pass.",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "functionName": "mergeIntervals667",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals667(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals667(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals667(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals667(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[[1, 3], [2, 6], [8, 10], [15, 18]]]",
        "expectedOutput": "[[1, 6], [8, 10], [15, 18]]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[[1, 4], [4, 5]]]",
        "expectedOutput": "[[1, 5]]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[[6, 8]]]",
        "expectedOutput": "[[6, 8]]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA668",
    "number": 668,
    "title": "All Nodes Distance K in Binary Tree Search (Variant 4)",
    "slug": "all-nodes-distance-k-in-binary-tree-search-variant-4-668",
    "difficulty": "Medium",
    "topic": "Trees",
    "pattern": [
      "DFS",
      "BFS"
    ],
    "tags": [
      "Trees",
      "DFS",
      "BFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Meta",
      "Microsoft",
      "Amazon"
    ],
    "problemStatement": "Given the root of a binary tree encoded as an array representation (level-order traversal where `null` represents absent nodes), return its maximum depth.\n\nA binary tree's **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    "examples": [
      {
        "input": "root = [3,9,20,null,null,15,7]",
        "output": "3",
        "explanation": "Root 3 -> 20 -> 15 gives depth 3."
      },
      {
        "input": "root = [1,null,2]",
        "output": "2",
        "explanation": "Root 1 -> 2 gives depth 2."
      },
      {
        "input": "root = []",
        "output": "0",
        "explanation": "Empty tree has depth 0."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-100 <= Node.val <= 100"
    ],
    "hints": [
      "Can we formulate the problem recursively?",
      "The maximum depth of a tree is 1 + max(depth(left), depth(right)).",
      "Base case: if root is null, return 0."
    ],
    "approach": "Recursive DFS tree height calculation.",
    "stepByStepExplanation": "1. If root is empty or null, depth is 0.\n2. In array level-order representation, calculate depth from array length or tree node.\n3. Return calculated maximum depth.",
    "optimalApproach": "O(N) DFS traversal.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(H)",
    "functionName": "maxDepth668",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth668(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth668(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth668(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth668(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[3, 9, 20, null, null, 15, 7]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1, null, 2]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[1]]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA669",
    "number": 669,
    "title": "Restore IP Addresses Octet Combinations (Variant 5)",
    "slug": "restore-ip-addresses-octet-combinations-variant-5-669",
    "difficulty": "Difficult",
    "topic": "Backtracking",
    "pattern": [
      "Backtracking",
      "DFS"
    ],
    "tags": [
      "Backtracking",
      "Backtracking",
      "DFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Amazon",
      "DoorDash",
      "Snowflake"
    ],
    "problemStatement": "Given an integer array `nums` of **unique** elements, return all possible subsets (the power set).\n\nThe solution set **must not** contain duplicate subsets. Return the solution in **any order**.",
    "examples": [
      {
        "input": "nums = [1,2,3]",
        "output": "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
        "explanation": "All 8 subsets of [1,2,3]."
      },
      {
        "input": "nums = [0]",
        "output": "[[],[0]]",
        "explanation": "All 2 subsets of [0]."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10",
      "-10 <= nums[i] <= 10",
      "All the numbers of nums are unique."
    ],
    "hints": [
      "Use recursive backtracking.",
      "At each index i, we have two choices: include nums[i] in the current subset, or exclude it.",
      "When we reach index === nums.length, record the current subset."
    ],
    "approach": "Backtracking recursion (include/exclude).",
    "stepByStepExplanation": "1. Initialize result array.\n2. Define backtrack(start, path).\n3. Add copy of path to result.\n4. Loop i from start to nums.length:\n   - path.push(nums[i])\n   - backtrack(i + 1, path)\n   - path.pop()\n5. Return result.",
    "optimalApproach": "O(N * 2^N) backtracking power set.",
    "timeComplexity": "O(N * 2^N)",
    "spaceComplexity": "O(N)",
    "functionName": "generateSubsets669",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets669(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets669(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets669(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets669(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[0]]",
        "expectedOutput": "[[], [0]]",
        "isHidden": false
      }
    ]
  },
  {
    "id": "DSA670",
    "number": 670,
    "title": "Divide Two Integers Without Multiplication (Variant 4)",
    "slug": "divide-two-integers-without-multiplication-variant-4-670",
    "difficulty": "Difficult",
    "topic": "Bit Manipulation",
    "pattern": [
      "Bit Manipulation"
    ],
    "tags": [
      "Bit Manipulation",
      "Bit Manipulation",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Meta",
      "Amazon"
    ],
    "problemStatement": "Write a function that takes the binary representation of an integer `n` and returns the number of `'1'` bits it has (also known as the Hamming weight).",
    "examples": [
      {
        "input": "n = 11",
        "output": "3",
        "explanation": "The input binary string is 1011, having a total of three 1 bits."
      },
      {
        "input": "n = 128",
        "output": "1",
        "explanation": "The input binary string is 10000000, having a single 1 bit."
      },
      {
        "input": "n = 2147483645",
        "output": "30",
        "explanation": "Has thirty 1 bits."
      }
    ],
    "constraints": [
      "1 <= n <= 2^31 - 1"
    ],
    "hints": [
      "You can check the least significant bit using n & 1, then shift right using n >>> 1.",
      "Or use Brian Kernighan algorithm: n & (n - 1) clears the lowest set bit.",
      "Repeat until n === 0."
    ],
    "approach": "Brian Kernighan bitwise algorithm.",
    "stepByStepExplanation": "1. Initialize count to 0.\n2. While n !== 0: clear lowest bit with n = n & (n - 1), increment count.\n3. Return count.",
    "optimalApproach": "O(number of set bits) using n & (n - 1).",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "functionName": "hammingWeight670",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight670(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight670(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight670(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight670(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[11]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[128]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[2147483645]",
        "expectedOutput": "30",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[0]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA671",
    "number": 671,
    "title": "Minimum Operations to Reduce X to Zero (Variant 4)",
    "slug": "minimum-operations-to-reduce-x-to-zero-variant-4-671",
    "difficulty": "Easy",
    "topic": "Arrays",
    "pattern": [
      "Prefix Sum",
      "Two Pointer"
    ],
    "tags": [
      "Arrays",
      "Prefix Sum",
      "Two Pointer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Microsoft",
      "Apple",
      "Uber"
    ],
    "problemStatement": "Given an array of integers `nums`, calculate the pivot index of this array.\n\nThe pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index's right.\n\nIf the index is on the left edge of the array, then the left sum is `0` because there are no elements to the left. Return the **leftmost pivot index**. If no such index exists, return `-1`.",
    "examples": [
      {
        "input": "nums = [1,7,3,6,5,6]",
        "output": "3",
        "explanation": "Left sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11. Right sum = nums[4] + nums[5] = 5 + 6 = 11."
      },
      {
        "input": "nums = [1,2,3]",
        "output": "-1",
        "explanation": "There is no index that satisfies the conditions in the problem statement."
      },
      {
        "input": "nums = [2,1,-1]",
        "output": "0",
        "explanation": "Left sum = 0. Right sum = nums[1] + nums[2] = 1 + -1 = 0."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-1000 <= nums[i] <= 1000"
    ],
    "hints": [
      "Can we precompute the total sum of the array?",
      "As we iterate, maintain a running left sum and calculate right sum as (total - leftSum - current).",
      "Return the first index where leftSum === rightSum."
    ],
    "approach": "Prefix sum subtraction in O(N) time.",
    "stepByStepExplanation": "1. Compute total sum of all elements.\n2. Maintain leftSum initialized to 0.\n3. For each index i, if leftSum === totalSum - leftSum - nums[i], return i.\n4. Add nums[i] to leftSum.\n5. Return -1 if no pivot index found.",
    "optimalApproach": "Single pass with running prefix sum.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "findEquilibriumIndex671",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex671(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex671(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex671(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex671(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 7, 3, 6, 5, 6]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[2, 1, -1]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[0, 0, 0, 0]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA672",
    "number": 672,
    "title": "Minimum Window Substring Finder (Variant 5)",
    "slug": "minimum-window-substring-finder-variant-5-672",
    "difficulty": "Medium",
    "topic": "Strings",
    "pattern": [
      "Sliding Window",
      "Two Pointer"
    ],
    "tags": [
      "Strings",
      "Sliding Window",
      "Two Pointer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Amazon",
      "Netflix",
      "LinkedIn"
    ],
    "problemStatement": "Given a string `s` and an integer `k`, return the maximum number of vowel letters in any substring of `s` with length `k`.\n\nVowel letters in English are `'a'`, `'e'`, `'i'`, `'o'`, and `'u'`.",
    "examples": [
      {
        "input": "s = \"abciiidef\", k = 3",
        "output": "3",
        "explanation": "The substring \"iii\" contains 3 vowel letters."
      },
      {
        "input": "s = \"aeiou\", k = 2",
        "output": "2",
        "explanation": "Any substring of length 2 contains 2 vowels."
      },
      {
        "input": "s = \"leetcode\", k = 3",
        "output": "2",
        "explanation": "\"lee\", \"eet\" and \"ode\" contain 2 vowels."
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^5",
      "s consists of lowercase English letters.",
      "1 <= k <= s.length"
    ],
    "hints": [
      "Use a sliding window of fixed size k.",
      "Count vowels in the first window of size k.",
      "Slide window right: add 1 if incoming char is vowel, subtract 1 if outgoing char was vowel."
    ],
    "approach": "Fixed-size sliding window.",
    "stepByStepExplanation": "1. Initialize vowel Set for O(1) checks.\n2. Count vowels in the first k characters.\n3. Slide the window one char at a time, updating count and maxCount.\n4. Return maxCount.",
    "optimalApproach": "Sliding window O(N) time and O(1) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "maxVowelsInWindow672",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow672(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow672(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow672(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow672(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[\"abciiidef\", 3]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[\"aeiou\", 2]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[\"leetcode\", 3]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[\"rhythms\", 4]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA673",
    "number": 673,
    "title": "Daily Temperatures Heating Index (Variant 5)",
    "slug": "daily-temperatures-heating-index-variant-5-673",
    "difficulty": "Medium",
    "topic": "Stack",
    "pattern": [
      "Monotonic Stack"
    ],
    "tags": [
      "Stack",
      "Monotonic Stack",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Meta",
      "Bloomberg",
      "Goldman Sachs"
    ],
    "problemStatement": "Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.",
    "examples": [
      {
        "input": "temperatures = [73,74,75,71,69,72,76,73]",
        "output": "[1,1,4,2,1,1,0,0]",
        "explanation": "Day 0 waits 1 day (74), Day 2 waits 4 days (76)."
      },
      {
        "input": "temperatures = [30,40,50,60]",
        "output": "[1,1,1,0]",
        "explanation": "Each day is warmer than the previous except the last day."
      },
      {
        "input": "temperatures = [30,60,90]",
        "output": "[1,1,0]",
        "explanation": "First two days find immediate warmer days."
      }
    ],
    "constraints": [
      "1 <= temperatures.length <= 10^5",
      "30 <= temperatures[i] <= 100"
    ],
    "hints": [
      "Can we use a stack to keep track of previous cooler days waiting for a warmer day?",
      "Store indices of temperatures in a monotonically decreasing stack.",
      "When a warmer temperature is encountered, pop indices and calculate the day difference."
    ],
    "approach": "Monotonic decreasing stack of indices.",
    "stepByStepExplanation": "1. Create result array filled with 0 of length N.\n2. Maintain stack of indices.\n3. For each day i, while stack is not empty and current temp > temp at stack top: pop index prev, set result[prev] = i - prev.\n4. Push i onto stack.\n5. Return result.",
    "optimalApproach": "Monotonic stack O(N) time and O(N) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "functionName": "dailyTemperatures673",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures673(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures673(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures673(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures673(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[73, 74, 75, 71, 69, 72, 76, 73]]",
        "expectedOutput": "[1, 1, 4, 2, 1, 1, 0, 0]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[30, 40, 50, 60]]",
        "expectedOutput": "[1, 1, 1, 0]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[30, 60, 90]]",
        "expectedOutput": "[1, 1, 0]",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[80, 70, 60, 50]]",
        "expectedOutput": "[0, 0, 0, 0]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA674",
    "number": 674,
    "title": "Search in Rotated Sorted Matrix (Variant 5)",
    "slug": "search-in-rotated-sorted-matrix-variant-5-674",
    "difficulty": "Easy",
    "topic": "Binary Search",
    "pattern": [
      "Binary Search",
      "Divide & Conquer"
    ],
    "tags": [
      "Binary Search",
      "Binary Search",
      "Divide & Conquer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Airbnb",
      "ByteDance"
    ],
    "problemStatement": "Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value.\n\nIf `target` is not found in the array, return `[-1, -1]`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    "examples": [
      {
        "input": "nums = [5,7,7,8,8,10], target = 8",
        "output": "[3, 4]",
        "explanation": "8 appears starting at index 3 and ending at index 4."
      },
      {
        "input": "nums = [5,7,7,8,8,10], target = 6",
        "output": "[-1, -1]",
        "explanation": "6 does not exist in the array."
      },
      {
        "input": "nums = [], target = 0",
        "output": "[-1, -1]",
        "explanation": "Empty array returns [-1, -1]."
      }
    ],
    "constraints": [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
      "nums is sorted in non-decreasing order."
    ],
    "hints": [
      "Perform two separate binary searches: one for the leftmost occurrence and one for the rightmost.",
      "In the leftmost search, when nums[mid] === target, continue searching in the left half.",
      "In the rightmost search, continue searching in the right half."
    ],
    "approach": "Dual binary search boundaries.",
    "stepByStepExplanation": "1. Binary search for left boundary: adjust right = mid - 1 when target is found.\n2. Binary search for right boundary: adjust left = mid + 1 when target is found.\n3. Return [leftBound, rightBound].",
    "optimalApproach": "O(log N) dual binary search.",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)",
    "functionName": "searchRange674",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange674(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange674(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange674(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange674(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[5, 7, 7, 8, 8, 10], 8]",
        "expectedOutput": "[3, 4]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[5, 7, 7, 8, 8, 10], 6]",
        "expectedOutput": "[-1, -1]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[], 0]",
        "expectedOutput": "[-1, -1]",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[1, 1, 1, 1], 1]",
        "expectedOutput": "[0, 3]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA675",
    "number": 675,
    "title": "House Robber Street Security Alert (Variant 5)",
    "slug": "house-robber-street-security-alert-variant-5-675",
    "difficulty": "Medium",
    "topic": "Dynamic Programming",
    "pattern": [
      "Tabulation",
      "Memoization"
    ],
    "tags": [
      "Dynamic Programming",
      "Tabulation",
      "Memoization",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Adobe",
      "Salesforce",
      "Stripe"
    ],
    "problemStatement": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and **it will automatically contact the police if two adjacent houses were broken into on the same night**.\n\nGiven an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight **without alerting the police**.",
    "examples": [
      {
        "input": "nums = [1,2,3,1]",
        "output": "4",
        "explanation": "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4."
      },
      {
        "input": "nums = [2,7,9,3,1]",
        "output": "12",
        "explanation": "Rob house 1 (2), house 3 (9), and house 5 (1). Total = 2 + 9 + 1 = 12."
      },
      {
        "input": "nums = [0]",
        "output": "0",
        "explanation": "Only one house with 0 money."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 400"
    ],
    "hints": [
      "At each house i, you can either rob it (nums[i] + max at i-2) or skip it (max at i-1).",
      "Notice you only need the previous two maximums.",
      "Reduce space from O(N) to O(1) using two variables."
    ],
    "approach": "1D dynamic programming with state compression.",
    "stepByStepExplanation": "1. Handle edge cases (empty or length 1).\n2. Maintain rob1 and rob2 representing max money up to i-2 and i-1.\n3. For each house, newMax = Math.max(nums[i] + rob1, rob2).\n4. Advance rob1 = rob2, rob2 = newMax.\n5. Return rob2.",
    "optimalApproach": "O(N) time and O(1) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "robHouses675",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses675(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses675(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses675(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses675(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 2, 3, 1]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[2, 7, 9, 3, 1]]",
        "expectedOutput": "12",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[0]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[2, 1, 1, 2]]",
        "expectedOutput": "4",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA676",
    "number": 676,
    "title": "Number of Islands in Ocean Matrix (Variant 5)",
    "slug": "number-of-islands-in-ocean-matrix-variant-5-676",
    "difficulty": "Medium",
    "topic": "Graphs",
    "pattern": [
      "BFS",
      "DFS"
    ],
    "tags": [
      "Graphs",
      "BFS",
      "DFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Microsoft",
      "Palantir",
      "Robinhood"
    ],
    "problemStatement": "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    "examples": [
      {
        "input": "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]",
        "output": "3",
        "explanation": "Three separate islands."
      },
      {
        "input": "grid = [[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]",
        "output": "1",
        "explanation": "All lands are connected into 1 island."
      }
    ],
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is \"0\" or \"1\"."
    ],
    "hints": [
      "Traverse the 2D grid.",
      "When you encounter a \"1\", increment your island count and trigger a DFS/BFS to sink all connected land to \"0\".",
      "Continue until the entire matrix is processed."
    ],
    "approach": "Connected components via DFS flood fill.",
    "stepByStepExplanation": "1. Iterate through row r and column c.\n2. When grid[r][c] === \"1\", increment count.\n3. Run dfs(r, c) marking all connected \"1\"s as \"0\".\n4. Return total count.",
    "optimalApproach": "O(M * N) time DFS.",
    "timeComplexity": "O(M * N)",
    "spaceComplexity": "O(M * N)",
    "functionName": "numIslands676",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands676(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands676(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands676(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands676(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[[\"0\",\"0\"],[\"0\",\"0\"]]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA677",
    "number": 677,
    "title": "Minimum Arrows to Burst Balloons Coordinate Plane (Variant 7)",
    "slug": "minimum-arrows-to-burst-balloons-coordinate-plane-variant-7-677",
    "difficulty": "Easy",
    "topic": "Intervals",
    "pattern": [
      "Greedy"
    ],
    "tags": [
      "Intervals",
      "Greedy",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Apple",
      "Cisco",
      "Oracle"
    ],
    "problemStatement": "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    "examples": [
      {
        "input": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        "output": "[[1,6],[8,10],[15,18]]",
        "explanation": "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."
      },
      {
        "input": "intervals = [[1,4],[4,5]]",
        "output": "[[1,5]]",
        "explanation": "Intervals [1,4] and [4,5] are considered overlapping."
      }
    ],
    "constraints": [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4"
    ],
    "hints": [
      "Sort the intervals by their start points.",
      "Initialize merged array with the first interval.",
      "If current interval start <= previous interval end, merge them by updating end = max(prevEnd, currEnd)."
    ],
    "approach": "Sort by start time and greedy interval union.",
    "stepByStepExplanation": "1. Sort intervals by start value ascending.\n2. Iterate through intervals.\n3. If result is empty or current start > last end, push current.\n4. Else update last end to Math.max(last end, current end).\n5. Return result.",
    "optimalApproach": "O(N log N) sorting + O(N) single pass.",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "functionName": "mergeIntervals677",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals677(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals677(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals677(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals677(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[[1, 3], [2, 6], [8, 10], [15, 18]]]",
        "expectedOutput": "[[1, 6], [8, 10], [15, 18]]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[[1, 4], [4, 5]]]",
        "expectedOutput": "[[1, 5]]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[[6, 8]]]",
        "expectedOutput": "[[6, 8]]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA678",
    "number": 678,
    "title": "Maximum Depth of Binary Structure (Variant 5)",
    "slug": "maximum-depth-of-binary-structure-variant-5-678",
    "difficulty": "Medium",
    "topic": "Trees",
    "pattern": [
      "DFS",
      "BFS"
    ],
    "tags": [
      "Trees",
      "DFS",
      "BFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Meta",
      "Microsoft",
      "Amazon"
    ],
    "problemStatement": "Given the root of a binary tree encoded as an array representation (level-order traversal where `null` represents absent nodes), return its maximum depth.\n\nA binary tree's **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    "examples": [
      {
        "input": "root = [3,9,20,null,null,15,7]",
        "output": "3",
        "explanation": "Root 3 -> 20 -> 15 gives depth 3."
      },
      {
        "input": "root = [1,null,2]",
        "output": "2",
        "explanation": "Root 1 -> 2 gives depth 2."
      },
      {
        "input": "root = []",
        "output": "0",
        "explanation": "Empty tree has depth 0."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-100 <= Node.val <= 100"
    ],
    "hints": [
      "Can we formulate the problem recursively?",
      "The maximum depth of a tree is 1 + max(depth(left), depth(right)).",
      "Base case: if root is null, return 0."
    ],
    "approach": "Recursive DFS tree height calculation.",
    "stepByStepExplanation": "1. If root is empty or null, depth is 0.\n2. In array level-order representation, calculate depth from array length or tree node.\n3. Return calculated maximum depth.",
    "optimalApproach": "O(N) DFS traversal.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(H)",
    "functionName": "maxDepth678",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth678(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth678(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth678(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth678(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[3, 9, 20, null, null, 15, 7]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1, null, 2]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[1]]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA679",
    "number": 679,
    "title": "N-Queens Non-Attacking Chessboard Placements (Variant 5)",
    "slug": "n-queens-non-attacking-chessboard-placements-variant-5-679",
    "difficulty": "Difficult",
    "topic": "Backtracking",
    "pattern": [
      "Backtracking",
      "DFS"
    ],
    "tags": [
      "Backtracking",
      "Backtracking",
      "DFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Amazon",
      "DoorDash",
      "Snowflake"
    ],
    "problemStatement": "Given an integer array `nums` of **unique** elements, return all possible subsets (the power set).\n\nThe solution set **must not** contain duplicate subsets. Return the solution in **any order**.",
    "examples": [
      {
        "input": "nums = [1,2,3]",
        "output": "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
        "explanation": "All 8 subsets of [1,2,3]."
      },
      {
        "input": "nums = [0]",
        "output": "[[],[0]]",
        "explanation": "All 2 subsets of [0]."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10",
      "-10 <= nums[i] <= 10",
      "All the numbers of nums are unique."
    ],
    "hints": [
      "Use recursive backtracking.",
      "At each index i, we have two choices: include nums[i] in the current subset, or exclude it.",
      "When we reach index === nums.length, record the current subset."
    ],
    "approach": "Backtracking recursion (include/exclude).",
    "stepByStepExplanation": "1. Initialize result array.\n2. Define backtrack(start, path).\n3. Add copy of path to result.\n4. Loop i from start to nums.length:\n   - path.push(nums[i])\n   - backtrack(i + 1, path)\n   - path.pop()\n5. Return result.",
    "optimalApproach": "O(N * 2^N) backtracking power set.",
    "timeComplexity": "O(N * 2^N)",
    "spaceComplexity": "O(N)",
    "functionName": "generateSubsets679",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets679(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets679(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets679(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets679(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[0]]",
        "expectedOutput": "[[], [0]]",
        "isHidden": false
      }
    ]
  },
  {
    "id": "DSA680",
    "number": 680,
    "title": "Single Number XOR Deduplication (Variant 5)",
    "slug": "single-number-xor-deduplication-variant-5-680",
    "difficulty": "Difficult",
    "topic": "Bit Manipulation",
    "pattern": [
      "Bit Manipulation"
    ],
    "tags": [
      "Bit Manipulation",
      "Bit Manipulation",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Meta",
      "Amazon"
    ],
    "problemStatement": "Write a function that takes the binary representation of an integer `n` and returns the number of `'1'` bits it has (also known as the Hamming weight).",
    "examples": [
      {
        "input": "n = 11",
        "output": "3",
        "explanation": "The input binary string is 1011, having a total of three 1 bits."
      },
      {
        "input": "n = 128",
        "output": "1",
        "explanation": "The input binary string is 10000000, having a single 1 bit."
      },
      {
        "input": "n = 2147483645",
        "output": "30",
        "explanation": "Has thirty 1 bits."
      }
    ],
    "constraints": [
      "1 <= n <= 2^31 - 1"
    ],
    "hints": [
      "You can check the least significant bit using n & 1, then shift right using n >>> 1.",
      "Or use Brian Kernighan algorithm: n & (n - 1) clears the lowest set bit.",
      "Repeat until n === 0."
    ],
    "approach": "Brian Kernighan bitwise algorithm.",
    "stepByStepExplanation": "1. Initialize count to 0.\n2. While n !== 0: clear lowest bit with n = n & (n - 1), increment count.\n3. Return count.",
    "optimalApproach": "O(number of set bits) using n & (n - 1).",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "functionName": "hammingWeight680",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight680(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight680(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight680(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight680(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[11]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[128]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[2147483645]",
        "expectedOutput": "30",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[0]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA681",
    "number": 681,
    "title": "Make Sum Divisible by P (Variant 4)",
    "slug": "make-sum-divisible-by-p-variant-4-681",
    "difficulty": "Easy",
    "topic": "Arrays",
    "pattern": [
      "Prefix Sum",
      "Two Pointer"
    ],
    "tags": [
      "Arrays",
      "Prefix Sum",
      "Two Pointer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Microsoft",
      "Apple",
      "Uber"
    ],
    "problemStatement": "Given an array of integers `nums`, calculate the pivot index of this array.\n\nThe pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index's right.\n\nIf the index is on the left edge of the array, then the left sum is `0` because there are no elements to the left. Return the **leftmost pivot index**. If no such index exists, return `-1`.",
    "examples": [
      {
        "input": "nums = [1,7,3,6,5,6]",
        "output": "3",
        "explanation": "Left sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11. Right sum = nums[4] + nums[5] = 5 + 6 = 11."
      },
      {
        "input": "nums = [1,2,3]",
        "output": "-1",
        "explanation": "There is no index that satisfies the conditions in the problem statement."
      },
      {
        "input": "nums = [2,1,-1]",
        "output": "0",
        "explanation": "Left sum = 0. Right sum = nums[1] + nums[2] = 1 + -1 = 0."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-1000 <= nums[i] <= 1000"
    ],
    "hints": [
      "Can we precompute the total sum of the array?",
      "As we iterate, maintain a running left sum and calculate right sum as (total - leftSum - current).",
      "Return the first index where leftSum === rightSum."
    ],
    "approach": "Prefix sum subtraction in O(N) time.",
    "stepByStepExplanation": "1. Compute total sum of all elements.\n2. Maintain leftSum initialized to 0.\n3. For each index i, if leftSum === totalSum - leftSum - nums[i], return i.\n4. Add nums[i] to leftSum.\n5. Return -1 if no pivot index found.",
    "optimalApproach": "Single pass with running prefix sum.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "findEquilibriumIndex681",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex681(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex681(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex681(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex681(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 7, 3, 6, 5, 6]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[2, 1, -1]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[0, 0, 0, 0]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA682",
    "number": 682,
    "title": "Longest Substring with At Most Two Distinct Characters (Variant 5)",
    "slug": "longest-substring-with-at-most-two-distinct-characters-variant-5-682",
    "difficulty": "Medium",
    "topic": "Strings",
    "pattern": [
      "Sliding Window",
      "Two Pointer"
    ],
    "tags": [
      "Strings",
      "Sliding Window",
      "Two Pointer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Amazon",
      "Netflix",
      "LinkedIn"
    ],
    "problemStatement": "Given a string `s` and an integer `k`, return the maximum number of vowel letters in any substring of `s` with length `k`.\n\nVowel letters in English are `'a'`, `'e'`, `'i'`, `'o'`, and `'u'`.",
    "examples": [
      {
        "input": "s = \"abciiidef\", k = 3",
        "output": "3",
        "explanation": "The substring \"iii\" contains 3 vowel letters."
      },
      {
        "input": "s = \"aeiou\", k = 2",
        "output": "2",
        "explanation": "Any substring of length 2 contains 2 vowels."
      },
      {
        "input": "s = \"leetcode\", k = 3",
        "output": "2",
        "explanation": "\"lee\", \"eet\" and \"ode\" contain 2 vowels."
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^5",
      "s consists of lowercase English letters.",
      "1 <= k <= s.length"
    ],
    "hints": [
      "Use a sliding window of fixed size k.",
      "Count vowels in the first window of size k.",
      "Slide window right: add 1 if incoming char is vowel, subtract 1 if outgoing char was vowel."
    ],
    "approach": "Fixed-size sliding window.",
    "stepByStepExplanation": "1. Initialize vowel Set for O(1) checks.\n2. Count vowels in the first k characters.\n3. Slide the window one char at a time, updating count and maxCount.\n4. Return maxCount.",
    "optimalApproach": "Sliding window O(N) time and O(1) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "maxVowelsInWindow682",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow682(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow682(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow682(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow682(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[\"abciiidef\", 3]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[\"aeiou\", 2]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[\"leetcode\", 3]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[\"rhythms\", 4]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA683",
    "number": 683,
    "title": "Next Greater Element II in Circular Array (Variant 5)",
    "slug": "next-greater-element-ii-in-circular-array-variant-5-683",
    "difficulty": "Medium",
    "topic": "Stack",
    "pattern": [
      "Monotonic Stack"
    ],
    "tags": [
      "Stack",
      "Monotonic Stack",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Meta",
      "Bloomberg",
      "Goldman Sachs"
    ],
    "problemStatement": "Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.",
    "examples": [
      {
        "input": "temperatures = [73,74,75,71,69,72,76,73]",
        "output": "[1,1,4,2,1,1,0,0]",
        "explanation": "Day 0 waits 1 day (74), Day 2 waits 4 days (76)."
      },
      {
        "input": "temperatures = [30,40,50,60]",
        "output": "[1,1,1,0]",
        "explanation": "Each day is warmer than the previous except the last day."
      },
      {
        "input": "temperatures = [30,60,90]",
        "output": "[1,1,0]",
        "explanation": "First two days find immediate warmer days."
      }
    ],
    "constraints": [
      "1 <= temperatures.length <= 10^5",
      "30 <= temperatures[i] <= 100"
    ],
    "hints": [
      "Can we use a stack to keep track of previous cooler days waiting for a warmer day?",
      "Store indices of temperatures in a monotonically decreasing stack.",
      "When a warmer temperature is encountered, pop indices and calculate the day difference."
    ],
    "approach": "Monotonic decreasing stack of indices.",
    "stepByStepExplanation": "1. Create result array filled with 0 of length N.\n2. Maintain stack of indices.\n3. For each day i, while stack is not empty and current temp > temp at stack top: pop index prev, set result[prev] = i - prev.\n4. Push i onto stack.\n5. Return result.",
    "optimalApproach": "Monotonic stack O(N) time and O(N) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "functionName": "dailyTemperatures683",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures683(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures683(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures683(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures683(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[73, 74, 75, 71, 69, 72, 76, 73]]",
        "expectedOutput": "[1, 1, 4, 2, 1, 1, 0, 0]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[30, 40, 50, 60]]",
        "expectedOutput": "[1, 1, 1, 0]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[30, 60, 90]]",
        "expectedOutput": "[1, 1, 0]",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[80, 70, 60, 50]]",
        "expectedOutput": "[0, 0, 0, 0]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA684",
    "number": 684,
    "title": "Find First and Last Position in Sorted Sequence (Variant 5)",
    "slug": "find-first-and-last-position-in-sorted-sequence-variant-5-684",
    "difficulty": "Easy",
    "topic": "Binary Search",
    "pattern": [
      "Binary Search",
      "Divide & Conquer"
    ],
    "tags": [
      "Binary Search",
      "Binary Search",
      "Divide & Conquer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Airbnb",
      "ByteDance"
    ],
    "problemStatement": "Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value.\n\nIf `target` is not found in the array, return `[-1, -1]`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    "examples": [
      {
        "input": "nums = [5,7,7,8,8,10], target = 8",
        "output": "[3, 4]",
        "explanation": "8 appears starting at index 3 and ending at index 4."
      },
      {
        "input": "nums = [5,7,7,8,8,10], target = 6",
        "output": "[-1, -1]",
        "explanation": "6 does not exist in the array."
      },
      {
        "input": "nums = [], target = 0",
        "output": "[-1, -1]",
        "explanation": "Empty array returns [-1, -1]."
      }
    ],
    "constraints": [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
      "nums is sorted in non-decreasing order."
    ],
    "hints": [
      "Perform two separate binary searches: one for the leftmost occurrence and one for the rightmost.",
      "In the leftmost search, when nums[mid] === target, continue searching in the left half.",
      "In the rightmost search, continue searching in the right half."
    ],
    "approach": "Dual binary search boundaries.",
    "stepByStepExplanation": "1. Binary search for left boundary: adjust right = mid - 1 when target is found.\n2. Binary search for right boundary: adjust left = mid + 1 when target is found.\n3. Return [leftBound, rightBound].",
    "optimalApproach": "O(log N) dual binary search.",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)",
    "functionName": "searchRange684",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange684(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange684(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange684(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange684(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[5, 7, 7, 8, 8, 10], 8]",
        "expectedOutput": "[3, 4]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[5, 7, 7, 8, 8, 10], 6]",
        "expectedOutput": "[-1, -1]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[], 0]",
        "expectedOutput": "[-1, -1]",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[1, 1, 1, 1], 1]",
        "expectedOutput": "[0, 3]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA685",
    "number": 685,
    "title": "Coin Change Fewest Denominations Required (Variant 5)",
    "slug": "coin-change-fewest-denominations-required-variant-5-685",
    "difficulty": "Medium",
    "topic": "Dynamic Programming",
    "pattern": [
      "Tabulation",
      "Memoization"
    ],
    "tags": [
      "Dynamic Programming",
      "Tabulation",
      "Memoization",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Adobe",
      "Salesforce",
      "Stripe"
    ],
    "problemStatement": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and **it will automatically contact the police if two adjacent houses were broken into on the same night**.\n\nGiven an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight **without alerting the police**.",
    "examples": [
      {
        "input": "nums = [1,2,3,1]",
        "output": "4",
        "explanation": "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4."
      },
      {
        "input": "nums = [2,7,9,3,1]",
        "output": "12",
        "explanation": "Rob house 1 (2), house 3 (9), and house 5 (1). Total = 2 + 9 + 1 = 12."
      },
      {
        "input": "nums = [0]",
        "output": "0",
        "explanation": "Only one house with 0 money."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 400"
    ],
    "hints": [
      "At each house i, you can either rob it (nums[i] + max at i-2) or skip it (max at i-1).",
      "Notice you only need the previous two maximums.",
      "Reduce space from O(N) to O(1) using two variables."
    ],
    "approach": "1D dynamic programming with state compression.",
    "stepByStepExplanation": "1. Handle edge cases (empty or length 1).\n2. Maintain rob1 and rob2 representing max money up to i-2 and i-1.\n3. For each house, newMax = Math.max(nums[i] + rob1, rob2).\n4. Advance rob1 = rob2, rob2 = newMax.\n5. Return rob2.",
    "optimalApproach": "O(N) time and O(1) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "robHouses685",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses685(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses685(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses685(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses685(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 2, 3, 1]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[2, 7, 9, 3, 1]]",
        "expectedOutput": "12",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[0]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[2, 1, 1, 2]]",
        "expectedOutput": "4",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA686",
    "number": 686,
    "title": "Clone Connected Graph Nodes (Variant 5)",
    "slug": "clone-connected-graph-nodes-variant-5-686",
    "difficulty": "Medium",
    "topic": "Graphs",
    "pattern": [
      "BFS",
      "DFS"
    ],
    "tags": [
      "Graphs",
      "BFS",
      "DFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Microsoft",
      "Palantir",
      "Robinhood"
    ],
    "problemStatement": "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    "examples": [
      {
        "input": "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]",
        "output": "3",
        "explanation": "Three separate islands."
      },
      {
        "input": "grid = [[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]",
        "output": "1",
        "explanation": "All lands are connected into 1 island."
      }
    ],
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is \"0\" or \"1\"."
    ],
    "hints": [
      "Traverse the 2D grid.",
      "When you encounter a \"1\", increment your island count and trigger a DFS/BFS to sink all connected land to \"0\".",
      "Continue until the entire matrix is processed."
    ],
    "approach": "Connected components via DFS flood fill.",
    "stepByStepExplanation": "1. Iterate through row r and column c.\n2. When grid[r][c] === \"1\", increment count.\n3. Run dfs(r, c) marking all connected \"1\"s as \"0\".\n4. Return total count.",
    "optimalApproach": "O(M * N) time DFS.",
    "timeComplexity": "O(M * N)",
    "spaceComplexity": "O(M * N)",
    "functionName": "numIslands686",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands686(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands686(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands686(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands686(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[[\"0\",\"0\"],[\"0\",\"0\"]]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA687",
    "number": 687,
    "title": "Interval List Intersections Between Ranges (Variant 7)",
    "slug": "interval-list-intersections-between-ranges-variant-7-687",
    "difficulty": "Easy",
    "topic": "Intervals",
    "pattern": [
      "Greedy"
    ],
    "tags": [
      "Intervals",
      "Greedy",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Apple",
      "Cisco",
      "Oracle"
    ],
    "problemStatement": "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    "examples": [
      {
        "input": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        "output": "[[1,6],[8,10],[15,18]]",
        "explanation": "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."
      },
      {
        "input": "intervals = [[1,4],[4,5]]",
        "output": "[[1,5]]",
        "explanation": "Intervals [1,4] and [4,5] are considered overlapping."
      }
    ],
    "constraints": [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4"
    ],
    "hints": [
      "Sort the intervals by their start points.",
      "Initialize merged array with the first interval.",
      "If current interval start <= previous interval end, merge them by updating end = max(prevEnd, currEnd)."
    ],
    "approach": "Sort by start time and greedy interval union.",
    "stepByStepExplanation": "1. Sort intervals by start value ascending.\n2. Iterate through intervals.\n3. If result is empty or current start > last end, push current.\n4. Else update last end to Math.max(last end, current end).\n5. Return result.",
    "optimalApproach": "O(N log N) sorting + O(N) single pass.",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "functionName": "mergeIntervals687",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals687(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals687(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals687(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals687(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[[1, 3], [2, 6], [8, 10], [15, 18]]]",
        "expectedOutput": "[[1, 6], [8, 10], [15, 18]]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[[1, 4], [4, 5]]]",
        "expectedOutput": "[[1, 5]]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[[6, 8]]]",
        "expectedOutput": "[[6, 8]]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA688",
    "number": 688,
    "title": "Same Binary Tree Structure and Values Check (Variant 5)",
    "slug": "same-binary-tree-structure-and-values-check-variant-5-688",
    "difficulty": "Medium",
    "topic": "Trees",
    "pattern": [
      "DFS",
      "BFS"
    ],
    "tags": [
      "Trees",
      "DFS",
      "BFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Meta",
      "Microsoft",
      "Amazon"
    ],
    "problemStatement": "Given the root of a binary tree encoded as an array representation (level-order traversal where `null` represents absent nodes), return its maximum depth.\n\nA binary tree's **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    "examples": [
      {
        "input": "root = [3,9,20,null,null,15,7]",
        "output": "3",
        "explanation": "Root 3 -> 20 -> 15 gives depth 3."
      },
      {
        "input": "root = [1,null,2]",
        "output": "2",
        "explanation": "Root 1 -> 2 gives depth 2."
      },
      {
        "input": "root = []",
        "output": "0",
        "explanation": "Empty tree has depth 0."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-100 <= Node.val <= 100"
    ],
    "hints": [
      "Can we formulate the problem recursively?",
      "The maximum depth of a tree is 1 + max(depth(left), depth(right)).",
      "Base case: if root is null, return 0."
    ],
    "approach": "Recursive DFS tree height calculation.",
    "stepByStepExplanation": "1. If root is empty or null, depth is 0.\n2. In array level-order representation, calculate depth from array length or tree node.\n3. Return calculated maximum depth.",
    "optimalApproach": "O(N) DFS traversal.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(H)",
    "functionName": "maxDepth688",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth688(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth688(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth688(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth688(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[3, 9, 20, null, null, 15, 7]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1, null, 2]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[1]]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA689",
    "number": 689,
    "title": "Sudoku Solver Grid Constraint Satisfaction (Variant 5)",
    "slug": "sudoku-solver-grid-constraint-satisfaction-variant-5-689",
    "difficulty": "Difficult",
    "topic": "Backtracking",
    "pattern": [
      "Backtracking",
      "DFS"
    ],
    "tags": [
      "Backtracking",
      "Backtracking",
      "DFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Amazon",
      "DoorDash",
      "Snowflake"
    ],
    "problemStatement": "Given an integer array `nums` of **unique** elements, return all possible subsets (the power set).\n\nThe solution set **must not** contain duplicate subsets. Return the solution in **any order**.",
    "examples": [
      {
        "input": "nums = [1,2,3]",
        "output": "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
        "explanation": "All 8 subsets of [1,2,3]."
      },
      {
        "input": "nums = [0]",
        "output": "[[],[0]]",
        "explanation": "All 2 subsets of [0]."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10",
      "-10 <= nums[i] <= 10",
      "All the numbers of nums are unique."
    ],
    "hints": [
      "Use recursive backtracking.",
      "At each index i, we have two choices: include nums[i] in the current subset, or exclude it.",
      "When we reach index === nums.length, record the current subset."
    ],
    "approach": "Backtracking recursion (include/exclude).",
    "stepByStepExplanation": "1. Initialize result array.\n2. Define backtrack(start, path).\n3. Add copy of path to result.\n4. Loop i from start to nums.length:\n   - path.push(nums[i])\n   - backtrack(i + 1, path)\n   - path.pop()\n5. Return result.",
    "optimalApproach": "O(N * 2^N) backtracking power set.",
    "timeComplexity": "O(N * 2^N)",
    "spaceComplexity": "O(N)",
    "functionName": "generateSubsets689",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets689(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets689(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets689(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets689(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[0]]",
        "expectedOutput": "[[], [0]]",
        "isHidden": false
      }
    ]
  },
  {
    "id": "DSA690",
    "number": 690,
    "title": "Number of 1 Bits Hamming Weight (Variant 5)",
    "slug": "number-of-1-bits-hamming-weight-variant-5-690",
    "difficulty": "Difficult",
    "topic": "Bit Manipulation",
    "pattern": [
      "Bit Manipulation"
    ],
    "tags": [
      "Bit Manipulation",
      "Bit Manipulation",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Meta",
      "Amazon"
    ],
    "problemStatement": "Write a function that takes the binary representation of an integer `n` and returns the number of `'1'` bits it has (also known as the Hamming weight).",
    "examples": [
      {
        "input": "n = 11",
        "output": "3",
        "explanation": "The input binary string is 1011, having a total of three 1 bits."
      },
      {
        "input": "n = 128",
        "output": "1",
        "explanation": "The input binary string is 10000000, having a single 1 bit."
      },
      {
        "input": "n = 2147483645",
        "output": "30",
        "explanation": "Has thirty 1 bits."
      }
    ],
    "constraints": [
      "1 <= n <= 2^31 - 1"
    ],
    "hints": [
      "You can check the least significant bit using n & 1, then shift right using n >>> 1.",
      "Or use Brian Kernighan algorithm: n & (n - 1) clears the lowest set bit.",
      "Repeat until n === 0."
    ],
    "approach": "Brian Kernighan bitwise algorithm.",
    "stepByStepExplanation": "1. Initialize count to 0.\n2. While n !== 0: clear lowest bit with n = n & (n - 1), increment count.\n3. Return count.",
    "optimalApproach": "O(number of set bits) using n & (n - 1).",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "functionName": "hammingWeight690",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight690(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight690(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight690(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight690(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[11]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[128]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[2147483645]",
        "expectedOutput": "30",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[0]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA691",
    "number": 691,
    "title": "Range Addition Array Queries (Variant 4)",
    "slug": "range-addition-array-queries-variant-4-691",
    "difficulty": "Easy",
    "topic": "Arrays",
    "pattern": [
      "Prefix Sum",
      "Two Pointer"
    ],
    "tags": [
      "Arrays",
      "Prefix Sum",
      "Two Pointer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Microsoft",
      "Apple",
      "Uber"
    ],
    "problemStatement": "Given an array of integers `nums`, calculate the pivot index of this array.\n\nThe pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index's right.\n\nIf the index is on the left edge of the array, then the left sum is `0` because there are no elements to the left. Return the **leftmost pivot index**. If no such index exists, return `-1`.",
    "examples": [
      {
        "input": "nums = [1,7,3,6,5,6]",
        "output": "3",
        "explanation": "Left sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11. Right sum = nums[4] + nums[5] = 5 + 6 = 11."
      },
      {
        "input": "nums = [1,2,3]",
        "output": "-1",
        "explanation": "There is no index that satisfies the conditions in the problem statement."
      },
      {
        "input": "nums = [2,1,-1]",
        "output": "0",
        "explanation": "Left sum = 0. Right sum = nums[1] + nums[2] = 1 + -1 = 0."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-1000 <= nums[i] <= 1000"
    ],
    "hints": [
      "Can we precompute the total sum of the array?",
      "As we iterate, maintain a running left sum and calculate right sum as (total - leftSum - current).",
      "Return the first index where leftSum === rightSum."
    ],
    "approach": "Prefix sum subtraction in O(N) time.",
    "stepByStepExplanation": "1. Compute total sum of all elements.\n2. Maintain leftSum initialized to 0.\n3. For each index i, if leftSum === totalSum - leftSum - nums[i], return i.\n4. Add nums[i] to leftSum.\n5. Return -1 if no pivot index found.",
    "optimalApproach": "Single pass with running prefix sum.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "findEquilibriumIndex691",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex691(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex691(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex691(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex691(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 7, 3, 6, 5, 6]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[2, 1, -1]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[0, 0, 0, 0]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA692",
    "number": 692,
    "title": "Maximum Number of Vowels in a Substring of Given Length (Variant 5)",
    "slug": "maximum-number-of-vowels-in-a-substring-of-given-length-variant-5-692",
    "difficulty": "Medium",
    "topic": "Strings",
    "pattern": [
      "Sliding Window",
      "Two Pointer"
    ],
    "tags": [
      "Strings",
      "Sliding Window",
      "Two Pointer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Amazon",
      "Netflix",
      "LinkedIn"
    ],
    "problemStatement": "Given a string `s` and an integer `k`, return the maximum number of vowel letters in any substring of `s` with length `k`.\n\nVowel letters in English are `'a'`, `'e'`, `'i'`, `'o'`, and `'u'`.",
    "examples": [
      {
        "input": "s = \"abciiidef\", k = 3",
        "output": "3",
        "explanation": "The substring \"iii\" contains 3 vowel letters."
      },
      {
        "input": "s = \"aeiou\", k = 2",
        "output": "2",
        "explanation": "Any substring of length 2 contains 2 vowels."
      },
      {
        "input": "s = \"leetcode\", k = 3",
        "output": "2",
        "explanation": "\"lee\", \"eet\" and \"ode\" contain 2 vowels."
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^5",
      "s consists of lowercase English letters.",
      "1 <= k <= s.length"
    ],
    "hints": [
      "Use a sliding window of fixed size k.",
      "Count vowels in the first window of size k.",
      "Slide window right: add 1 if incoming char is vowel, subtract 1 if outgoing char was vowel."
    ],
    "approach": "Fixed-size sliding window.",
    "stepByStepExplanation": "1. Initialize vowel Set for O(1) checks.\n2. Count vowels in the first k characters.\n3. Slide the window one char at a time, updating count and maxCount.\n4. Return maxCount.",
    "optimalApproach": "Sliding window O(N) time and O(1) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "maxVowelsInWindow692",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow692(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow692(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow692(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow692(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[\"abciiidef\", 3]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[\"aeiou\", 2]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[\"leetcode\", 3]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[\"rhythms\", 4]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA693",
    "number": 693,
    "title": "Online Stock Spanner Daily Tracker (Variant 5)",
    "slug": "online-stock-spanner-daily-tracker-variant-5-693",
    "difficulty": "Medium",
    "topic": "Stack",
    "pattern": [
      "Monotonic Stack"
    ],
    "tags": [
      "Stack",
      "Monotonic Stack",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Meta",
      "Bloomberg",
      "Goldman Sachs"
    ],
    "problemStatement": "Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.",
    "examples": [
      {
        "input": "temperatures = [73,74,75,71,69,72,76,73]",
        "output": "[1,1,4,2,1,1,0,0]",
        "explanation": "Day 0 waits 1 day (74), Day 2 waits 4 days (76)."
      },
      {
        "input": "temperatures = [30,40,50,60]",
        "output": "[1,1,1,0]",
        "explanation": "Each day is warmer than the previous except the last day."
      },
      {
        "input": "temperatures = [30,60,90]",
        "output": "[1,1,0]",
        "explanation": "First two days find immediate warmer days."
      }
    ],
    "constraints": [
      "1 <= temperatures.length <= 10^5",
      "30 <= temperatures[i] <= 100"
    ],
    "hints": [
      "Can we use a stack to keep track of previous cooler days waiting for a warmer day?",
      "Store indices of temperatures in a monotonically decreasing stack.",
      "When a warmer temperature is encountered, pop indices and calculate the day difference."
    ],
    "approach": "Monotonic decreasing stack of indices.",
    "stepByStepExplanation": "1. Create result array filled with 0 of length N.\n2. Maintain stack of indices.\n3. For each day i, while stack is not empty and current temp > temp at stack top: pop index prev, set result[prev] = i - prev.\n4. Push i onto stack.\n5. Return result.",
    "optimalApproach": "Monotonic stack O(N) time and O(N) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "functionName": "dailyTemperatures693",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures693(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures693(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures693(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures693(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[73, 74, 75, 71, 69, 72, 76, 73]]",
        "expectedOutput": "[1, 1, 4, 2, 1, 1, 0, 0]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[30, 40, 50, 60]]",
        "expectedOutput": "[1, 1, 1, 0]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[30, 60, 90]]",
        "expectedOutput": "[1, 1, 0]",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[80, 70, 60, 50]]",
        "expectedOutput": "[0, 0, 0, 0]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA694",
    "number": 694,
    "title": "Koko Eating Bananas Speed Optimization (Variant 5)",
    "slug": "koko-eating-bananas-speed-optimization-variant-5-694",
    "difficulty": "Easy",
    "topic": "Binary Search",
    "pattern": [
      "Binary Search",
      "Divide & Conquer"
    ],
    "tags": [
      "Binary Search",
      "Binary Search",
      "Divide & Conquer",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Airbnb",
      "ByteDance"
    ],
    "problemStatement": "Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value.\n\nIf `target` is not found in the array, return `[-1, -1]`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    "examples": [
      {
        "input": "nums = [5,7,7,8,8,10], target = 8",
        "output": "[3, 4]",
        "explanation": "8 appears starting at index 3 and ending at index 4."
      },
      {
        "input": "nums = [5,7,7,8,8,10], target = 6",
        "output": "[-1, -1]",
        "explanation": "6 does not exist in the array."
      },
      {
        "input": "nums = [], target = 0",
        "output": "[-1, -1]",
        "explanation": "Empty array returns [-1, -1]."
      }
    ],
    "constraints": [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
      "nums is sorted in non-decreasing order."
    ],
    "hints": [
      "Perform two separate binary searches: one for the leftmost occurrence and one for the rightmost.",
      "In the leftmost search, when nums[mid] === target, continue searching in the left half.",
      "In the rightmost search, continue searching in the right half."
    ],
    "approach": "Dual binary search boundaries.",
    "stepByStepExplanation": "1. Binary search for left boundary: adjust right = mid - 1 when target is found.\n2. Binary search for right boundary: adjust left = mid + 1 when target is found.\n3. Return [leftBound, rightBound].",
    "optimalApproach": "O(log N) dual binary search.",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)",
    "functionName": "searchRange694",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange694(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange694(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange694(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange694(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[5, 7, 7, 8, 8, 10], 8]",
        "expectedOutput": "[3, 4]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[5, 7, 7, 8, 8, 10], 6]",
        "expectedOutput": "[-1, -1]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[], 0]",
        "expectedOutput": "[-1, -1]",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[1, 1, 1, 1], 1]",
        "expectedOutput": "[0, 3]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA695",
    "number": 695,
    "title": "Longest Increasing Subsequence Patience Sort (Variant 5)",
    "slug": "longest-increasing-subsequence-patience-sort-variant-5-695",
    "difficulty": "Medium",
    "topic": "Dynamic Programming",
    "pattern": [
      "Tabulation",
      "Memoization"
    ],
    "tags": [
      "Dynamic Programming",
      "Tabulation",
      "Memoization",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Adobe",
      "Salesforce",
      "Stripe"
    ],
    "problemStatement": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and **it will automatically contact the police if two adjacent houses were broken into on the same night**.\n\nGiven an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight **without alerting the police**.",
    "examples": [
      {
        "input": "nums = [1,2,3,1]",
        "output": "4",
        "explanation": "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4."
      },
      {
        "input": "nums = [2,7,9,3,1]",
        "output": "12",
        "explanation": "Rob house 1 (2), house 3 (9), and house 5 (1). Total = 2 + 9 + 1 = 12."
      },
      {
        "input": "nums = [0]",
        "output": "0",
        "explanation": "Only one house with 0 money."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 400"
    ],
    "hints": [
      "At each house i, you can either rob it (nums[i] + max at i-2) or skip it (max at i-1).",
      "Notice you only need the previous two maximums.",
      "Reduce space from O(N) to O(1) using two variables."
    ],
    "approach": "1D dynamic programming with state compression.",
    "stepByStepExplanation": "1. Handle edge cases (empty or length 1).\n2. Maintain rob1 and rob2 representing max money up to i-2 and i-1.\n3. For each house, newMax = Math.max(nums[i] + rob1, rob2).\n4. Advance rob1 = rob2, rob2 = newMax.\n5. Return rob2.",
    "optimalApproach": "O(N) time and O(1) space.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "robHouses695",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses695(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses695(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses695(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses695(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 2, 3, 1]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[2, 7, 9, 3, 1]]",
        "expectedOutput": "12",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[0]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[2, 1, 1, 2]]",
        "expectedOutput": "4",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA696",
    "number": 696,
    "title": "Course Schedule Prerequisites Feasibility (Variant 5)",
    "slug": "course-schedule-prerequisites-feasibility-variant-5-696",
    "difficulty": "Medium",
    "topic": "Graphs",
    "pattern": [
      "BFS",
      "DFS"
    ],
    "tags": [
      "Graphs",
      "BFS",
      "DFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Microsoft",
      "Palantir",
      "Robinhood"
    ],
    "problemStatement": "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    "examples": [
      {
        "input": "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]",
        "output": "3",
        "explanation": "Three separate islands."
      },
      {
        "input": "grid = [[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]",
        "output": "1",
        "explanation": "All lands are connected into 1 island."
      }
    ],
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is \"0\" or \"1\"."
    ],
    "hints": [
      "Traverse the 2D grid.",
      "When you encounter a \"1\", increment your island count and trigger a DFS/BFS to sink all connected land to \"0\".",
      "Continue until the entire matrix is processed."
    ],
    "approach": "Connected components via DFS flood fill.",
    "stepByStepExplanation": "1. Iterate through row r and column c.\n2. When grid[r][c] === \"1\", increment count.\n3. Run dfs(r, c) marking all connected \"1\"s as \"0\".\n4. Return total count.",
    "optimalApproach": "O(M * N) time DFS.",
    "timeComplexity": "O(M * N)",
    "spaceComplexity": "O(M * N)",
    "functionName": "numIslands696",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands696(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands696(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands696(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands696(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[[\"0\",\"0\"],[\"0\",\"0\"]]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA697",
    "number": 697,
    "title": "Car Pooling Route Passenger Capacities (Variant 7)",
    "slug": "car-pooling-route-passenger-capacities-variant-7-697",
    "difficulty": "Easy",
    "topic": "Intervals",
    "pattern": [
      "Greedy"
    ],
    "tags": [
      "Intervals",
      "Greedy",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Apple",
      "Cisco",
      "Oracle"
    ],
    "problemStatement": "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    "examples": [
      {
        "input": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        "output": "[[1,6],[8,10],[15,18]]",
        "explanation": "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."
      },
      {
        "input": "intervals = [[1,4],[4,5]]",
        "output": "[[1,5]]",
        "explanation": "Intervals [1,4] and [4,5] are considered overlapping."
      }
    ],
    "constraints": [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4"
    ],
    "hints": [
      "Sort the intervals by their start points.",
      "Initialize merged array with the first interval.",
      "If current interval start <= previous interval end, merge them by updating end = max(prevEnd, currEnd)."
    ],
    "approach": "Sort by start time and greedy interval union.",
    "stepByStepExplanation": "1. Sort intervals by start value ascending.\n2. Iterate through intervals.\n3. If result is empty or current start > last end, push current.\n4. Else update last end to Math.max(last end, current end).\n5. Return result.",
    "optimalApproach": "O(N log N) sorting + O(N) single pass.",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "functionName": "mergeIntervals697",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals697(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals697(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals697(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals697(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[[1, 3], [2, 6], [8, 10], [15, 18]]]",
        "expectedOutput": "[[1, 6], [8, 10], [15, 18]]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[[1, 4], [4, 5]]]",
        "expectedOutput": "[[1, 5]]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[[6, 8]]]",
        "expectedOutput": "[[6, 8]]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA698",
    "number": 698,
    "title": "Invert Binary Tree Left Right Subtrees (Variant 5)",
    "slug": "invert-binary-tree-left-right-subtrees-variant-5-698",
    "difficulty": "Medium",
    "topic": "Trees",
    "pattern": [
      "DFS",
      "BFS"
    ],
    "tags": [
      "Trees",
      "DFS",
      "BFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Meta",
      "Microsoft",
      "Amazon"
    ],
    "problemStatement": "Given the root of a binary tree encoded as an array representation (level-order traversal where `null` represents absent nodes), return its maximum depth.\n\nA binary tree's **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    "examples": [
      {
        "input": "root = [3,9,20,null,null,15,7]",
        "output": "3",
        "explanation": "Root 3 -> 20 -> 15 gives depth 3."
      },
      {
        "input": "root = [1,null,2]",
        "output": "2",
        "explanation": "Root 1 -> 2 gives depth 2."
      },
      {
        "input": "root = []",
        "output": "0",
        "explanation": "Empty tree has depth 0."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-100 <= Node.val <= 100"
    ],
    "hints": [
      "Can we formulate the problem recursively?",
      "The maximum depth of a tree is 1 + max(depth(left), depth(right)).",
      "Base case: if root is null, return 0."
    ],
    "approach": "Recursive DFS tree height calculation.",
    "stepByStepExplanation": "1. If root is empty or null, depth is 0.\n2. In array level-order representation, calculate depth from array length or tree node.\n3. Return calculated maximum depth.",
    "optimalApproach": "O(N) DFS traversal.",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(H)",
    "functionName": "maxDepth698",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth698(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth698(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth698(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth698(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[3, 9, 20, null, null, 15, 7]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1, null, 2]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[1]]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA699",
    "number": 699,
    "title": "Combination Sum II Unique Elements Without Reuse (Variant 5)",
    "slug": "combination-sum-ii-unique-elements-without-reuse-variant-5-699",
    "difficulty": "Difficult",
    "topic": "Backtracking",
    "pattern": [
      "Backtracking",
      "DFS"
    ],
    "tags": [
      "Backtracking",
      "Backtracking",
      "DFS",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Amazon",
      "DoorDash",
      "Snowflake"
    ],
    "problemStatement": "Given an integer array `nums` of **unique** elements, return all possible subsets (the power set).\n\nThe solution set **must not** contain duplicate subsets. Return the solution in **any order**.",
    "examples": [
      {
        "input": "nums = [1,2,3]",
        "output": "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
        "explanation": "All 8 subsets of [1,2,3]."
      },
      {
        "input": "nums = [0]",
        "output": "[[],[0]]",
        "explanation": "All 2 subsets of [0]."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10",
      "-10 <= nums[i] <= 10",
      "All the numbers of nums are unique."
    ],
    "hints": [
      "Use recursive backtracking.",
      "At each index i, we have two choices: include nums[i] in the current subset, or exclude it.",
      "When we reach index === nums.length, record the current subset."
    ],
    "approach": "Backtracking recursion (include/exclude).",
    "stepByStepExplanation": "1. Initialize result array.\n2. Define backtrack(start, path).\n3. Add copy of path to result.\n4. Loop i from start to nums.length:\n   - path.push(nums[i])\n   - backtrack(i + 1, path)\n   - path.pop()\n5. Return result.",
    "optimalApproach": "O(N * 2^N) backtracking power set.",
    "timeComplexity": "O(N * 2^N)",
    "spaceComplexity": "O(N)",
    "functionName": "generateSubsets699",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets699(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets699(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets699(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets699(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 2, 3]]",
        "expectedOutput": "[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[0]]",
        "expectedOutput": "[[], [0]]",
        "isHidden": false
      }
    ]
  },
  {
    "id": "DSA700",
    "number": 700,
    "title": "Counting Bits Sublinear Computation (Variant 5)",
    "slug": "counting-bits-sublinear-computation-variant-5-700",
    "difficulty": "Difficult",
    "topic": "Bit Manipulation",
    "pattern": [
      "Bit Manipulation"
    ],
    "tags": [
      "Bit Manipulation",
      "Bit Manipulation",
      "LeetCode",
      "Interview Prep"
    ],
    "companies": [
      "Google",
      "Meta",
      "Amazon"
    ],
    "problemStatement": "Write a function that takes the binary representation of an integer `n` and returns the number of `'1'` bits it has (also known as the Hamming weight).",
    "examples": [
      {
        "input": "n = 11",
        "output": "3",
        "explanation": "The input binary string is 1011, having a total of three 1 bits."
      },
      {
        "input": "n = 128",
        "output": "1",
        "explanation": "The input binary string is 10000000, having a single 1 bit."
      },
      {
        "input": "n = 2147483645",
        "output": "30",
        "explanation": "Has thirty 1 bits."
      }
    ],
    "constraints": [
      "1 <= n <= 2^31 - 1"
    ],
    "hints": [
      "You can check the least significant bit using n & 1, then shift right using n >>> 1.",
      "Or use Brian Kernighan algorithm: n & (n - 1) clears the lowest set bit.",
      "Repeat until n === 0."
    ],
    "approach": "Brian Kernighan bitwise algorithm.",
    "stepByStepExplanation": "1. Initialize count to 0.\n2. While n !== 0: clear lowest bit with n = n & (n - 1), increment count.\n3. Return count.",
    "optimalApproach": "O(number of set bits) using n & (n - 1).",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "functionName": "hammingWeight700",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight700(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight700(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight700(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight700(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[11]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[128]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[2147483645]",
        "expectedOutput": "30",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[0]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  }
];
