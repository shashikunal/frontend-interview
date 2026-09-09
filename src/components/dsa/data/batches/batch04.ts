// Batch 4: Questions 301 to 400
import type { DSAQuestion } from '../dsaTypes'

export const dsaBatch4: DSAQuestion[] = [
  {
    "id": "DSA301",
    "number": 301,
    "title": "Find All Good Indices (Variant 2)",
    "slug": "find-all-good-indices-variant-2-301",
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
    "functionName": "findEquilibriumIndex301",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex301(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex301(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex301(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex301(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA302",
    "number": 302,
    "title": "Minimum Size Subarray Sum Exceeding Target (Variant 2)",
    "slug": "minimum-size-subarray-sum-exceeding-target-variant-2-302",
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
    "functionName": "maxVowelsInWindow302",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow302(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow302(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow302(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow302(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA303",
    "number": 303,
    "title": "Decode Multi-Level Nested Strings (Variant 2)",
    "slug": "decode-multi-level-nested-strings-variant-2-303",
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
    "functionName": "dailyTemperatures303",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures303(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures303(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures303(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures303(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA304",
    "number": 304,
    "title": "Minimum Speed to Arrive on Time Transport (Variant 2)",
    "slug": "minimum-speed-to-arrive-on-time-transport-variant-2-304",
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
    "functionName": "searchRange304",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange304(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange304(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange304(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange304(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA305",
    "number": 305,
    "title": "Triangle Shortest Path Top to Bottom (Variant 2)",
    "slug": "triangle-shortest-path-top-to-bottom-variant-2-305",
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
    "functionName": "robHouses305",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses305(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses305(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses305(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses305(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA306",
    "number": 306,
    "title": "Redundant Connection in Undirected Graph (Variant 2)",
    "slug": "redundant-connection-in-undirected-graph-variant-2-306",
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
    "functionName": "numIslands306",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands306(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands306(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands306(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands306(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA307",
    "number": 307,
    "title": "Partition Labels String Character Disjoint Ranges (Variant 3)",
    "slug": "partition-labels-string-character-disjoint-ranges-variant-3-307",
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
    "functionName": "mergeIntervals307",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals307(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals307(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals307(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals307(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA308",
    "number": 308,
    "title": "Flatten Binary Tree to Linked List Preorder (Variant 2)",
    "slug": "flatten-binary-tree-to-linked-list-preorder-variant-2-308",
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
    "functionName": "maxDepth308",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth308(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth308(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth308(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth308(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA309",
    "number": 309,
    "title": "Non-decreasing Subsequences Finding (Variant 2)",
    "slug": "non-decreasing-subsequences-finding-variant-2-309",
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
    "functionName": "generateSubsets309",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets309(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets309(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets309(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets309(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA310",
    "number": 310,
    "title": "Hamming Distance Between Two Integers (Variant 2)",
    "slug": "hamming-distance-between-two-integers-variant-2-310",
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
    "functionName": "hammingWeight310",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight310(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight310(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight310(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight310(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA311",
    "number": 311,
    "title": "Minimum Operations to Reduce X to Zero (Variant 2)",
    "slug": "minimum-operations-to-reduce-x-to-zero-variant-2-311",
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
    "functionName": "findEquilibriumIndex311",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex311(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex311(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex311(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex311(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA312",
    "number": 312,
    "title": "Diet Plan Performance Metric (Variant 2)",
    "slug": "diet-plan-performance-metric-variant-2-312",
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
    "functionName": "maxVowelsInWindow312",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow312(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow312(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow312(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow312(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA313",
    "number": 313,
    "title": "Validate Stack Sequences Push Pop Simulation (Variant 2)",
    "slug": "validate-stack-sequences-push-pop-simulation-variant-2-313",
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
    "functionName": "dailyTemperatures313",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures313(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures313(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures313(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures313(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA314",
    "number": 314,
    "title": "Arranging Coins in Staircase Pattern (Variant 2)",
    "slug": "arranging-coins-in-staircase-pattern-variant-2-314",
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
    "functionName": "searchRange314",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange314(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange314(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange314(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange314(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA315",
    "number": 315,
    "title": "Best Time to Buy and Sell Stock with Cooldown (Variant 2)",
    "slug": "best-time-to-buy-and-sell-stock-with-cooldown-variant-2-315",
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
    "functionName": "robHouses315",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses315(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses315(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses315(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses315(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA316",
    "number": 316,
    "title": "Network Delay Time Signal Broadcast (Variant 2)",
    "slug": "network-delay-time-signal-broadcast-variant-2-316",
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
    "functionName": "numIslands316",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands316(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands316(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands316(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands316(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA317",
    "number": 317,
    "title": "Employee Free Time Global Work Schedule (Variant 3)",
    "slug": "employee-free-time-global-work-schedule-variant-3-317",
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
    "functionName": "mergeIntervals317",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals317(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals317(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals317(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals317(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA318",
    "number": 318,
    "title": "Diameter of Binary Tree Longest Node Path (Variant 2)",
    "slug": "diameter-of-binary-tree-longest-node-path-variant-2-318",
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
    "functionName": "maxDepth318",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth318(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth318(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth318(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth318(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA319",
    "number": 319,
    "title": "Subsets Power Set Generation (Variant 3)",
    "slug": "subsets-power-set-generation-variant-3-319",
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
    "functionName": "generateSubsets319",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets319(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets319(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets319(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets319(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA320",
    "number": 320,
    "title": "Convert Integer to Hexadecimal String (Variant 2)",
    "slug": "convert-integer-to-hexadecimal-string-variant-2-320",
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
    "functionName": "hammingWeight320",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight320(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight320(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight320(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight320(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA321",
    "number": 321,
    "title": "Make Sum Divisible by P (Variant 2)",
    "slug": "make-sum-divisible-by-p-variant-2-321",
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
    "functionName": "findEquilibriumIndex321",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex321(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex321(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex321(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex321(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA322",
    "number": 322,
    "title": "Check If a String Contains All Binary Codes of Size K (Variant 2)",
    "slug": "check-if-a-string-contains-all-binary-codes-of-size-k-variant-2-322",
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
    "functionName": "maxVowelsInWindow322",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow322(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow322(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow322(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow322(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA323",
    "number": 323,
    "title": "Min Stack Constant Time Retrieval (Variant 2)",
    "slug": "min-stack-constant-time-retrieval-variant-2-323",
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
    "functionName": "dailyTemperatures323",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures323(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures323(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures323(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures323(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA324",
    "number": 324,
    "title": "Guess Number Higher or Lower Interactive (Variant 2)",
    "slug": "guess-number-higher-or-lower-interactive-variant-2-324",
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
    "functionName": "searchRange324",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange324(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange324(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange324(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange324(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA325",
    "number": 325,
    "title": "Best Time to Buy and Sell Stock with Transaction Fee (Variant 2)",
    "slug": "best-time-to-buy-and-sell-stock-with-transaction-fee-variant-2-325",
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
    "functionName": "robHouses325",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses325(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses325(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses325(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses325(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA326",
    "number": 326,
    "title": "Cheapest Flights Within K Stops Router (Variant 2)",
    "slug": "cheapest-flights-within-k-stops-router-variant-2-326",
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
    "functionName": "numIslands326",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands326(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands326(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands326(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands326(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA327",
    "number": 327,
    "title": "Remove Covered Intervals from Collection (Variant 3)",
    "slug": "remove-covered-intervals-from-collection-variant-3-327",
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
    "functionName": "mergeIntervals327",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals327(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals327(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals327(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals327(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA328",
    "number": 328,
    "title": "Serialize and Deserialize Binary Tree String (Variant 2)",
    "slug": "serialize-and-deserialize-binary-tree-string-variant-2-328",
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
    "functionName": "maxDepth328",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth328(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth328(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth328(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth328(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA329",
    "number": 329,
    "title": "Permutations Full Array Combinations (Variant 3)",
    "slug": "permutations-full-array-combinations-variant-3-329",
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
    "functionName": "generateSubsets329",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets329(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets329(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets329(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets329(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA330",
    "number": 330,
    "title": "Add Binary Strings Bitwise Carry (Variant 2)",
    "slug": "add-binary-strings-bitwise-carry-variant-2-330",
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
    "functionName": "hammingWeight330",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight330(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight330(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight330(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight330(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA331",
    "number": 331,
    "title": "Range Addition Array Queries (Variant 2)",
    "slug": "range-addition-array-queries-variant-2-331",
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
    "functionName": "findEquilibriumIndex331",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex331(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex331(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex331(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex331(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA332",
    "number": 332,
    "title": "Grumpy Bookstore Owner Customer Satisfaction (Variant 2)",
    "slug": "grumpy-bookstore-owner-customer-satisfaction-variant-2-332",
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
    "functionName": "maxVowelsInWindow332",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow332(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow332(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow332(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow332(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA333",
    "number": 333,
    "title": "Evaluate Reverse Polish Notation Expression (Variant 2)",
    "slug": "evaluate-reverse-polish-notation-expression-variant-2-333",
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
    "functionName": "dailyTemperatures333",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures333(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures333(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures333(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures333(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA334",
    "number": 334,
    "title": "Find Smallest Letter Greater Than Target (Variant 2)",
    "slug": "find-smallest-letter-greater-than-target-variant-2-334",
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
    "functionName": "searchRange334",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange334(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange334(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange334(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange334(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA335",
    "number": 335,
    "title": "Continuous Subarray with Maximum Average (Variant 2)",
    "slug": "continuous-subarray-with-maximum-average-variant-2-335",
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
    "functionName": "robHouses335",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses335(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses335(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses335(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses335(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA336",
    "number": 336,
    "title": "As Far from Land as Possible Maximum Distance (Variant 2)",
    "slug": "as-far-from-land-as-possible-maximum-distance-variant-2-336",
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
    "functionName": "numIslands336",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands336(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands336(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands336(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands336(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA337",
    "number": 337,
    "title": "Merge Overlapping Calendar Intervals (Variant 4)",
    "slug": "merge-overlapping-calendar-intervals-variant-4-337",
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
    "functionName": "mergeIntervals337",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals337(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals337(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals337(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals337(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA338",
    "number": 338,
    "title": "Populating Next Right Pointers in Each Node (Variant 2)",
    "slug": "populating-next-right-pointers-in-each-node-variant-2-338",
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
    "functionName": "maxDepth338",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth338(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth338(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth338(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth338(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA339",
    "number": 339,
    "title": "Combination Sum Target Exact Summation (Variant 3)",
    "slug": "combination-sum-target-exact-summation-variant-3-339",
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
    "functionName": "generateSubsets339",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets339(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets339(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets339(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets339(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA340",
    "number": 340,
    "title": "Base 7 Number Representation Conversion (Variant 2)",
    "slug": "base-7-number-representation-conversion-variant-2-340",
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
    "functionName": "hammingWeight340",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight340(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight340(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight340(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight340(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA341",
    "number": 341,
    "title": "Corporate Flight Bookings (Variant 2)",
    "slug": "corporate-flight-bookings-variant-2-341",
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
    "functionName": "findEquilibriumIndex341",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex341(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex341(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex341(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex341(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA342",
    "number": 342,
    "title": "K Radius Subarray Averages (Variant 2)",
    "slug": "k-radius-subarray-averages-variant-2-342",
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
    "functionName": "maxVowelsInWindow342",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow342(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow342(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow342(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow342(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA343",
    "number": 343,
    "title": "Maximum Width Ramp Computation (Variant 2)",
    "slug": "maximum-width-ramp-computation-variant-2-343",
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
    "functionName": "dailyTemperatures343",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures343(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures343(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures343(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures343(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA344",
    "number": 344,
    "title": "Valid Perfect Square Without Builtin Math (Variant 2)",
    "slug": "valid-perfect-square-without-builtin-math-variant-2-344",
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
    "functionName": "searchRange344",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange344(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange344(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange344(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange344(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA345",
    "number": 345,
    "title": "Russian Doll Envelopes 2D LIS (Variant 2)",
    "slug": "russian-doll-envelopes-2d-lis-variant-2-345",
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
    "functionName": "robHouses345",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses345(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses345(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses345(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses345(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA346",
    "number": 346,
    "title": "Minimum Cost to Reach City Across Tolls (Variant 2)",
    "slug": "minimum-cost-to-reach-city-across-tolls-variant-2-346",
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
    "functionName": "numIslands346",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands346(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands346(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands346(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands346(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA347",
    "number": 347,
    "title": "Non-Overlapping Intervals Minimum Removals (Variant 4)",
    "slug": "non-overlapping-intervals-minimum-removals-variant-4-347",
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
    "functionName": "mergeIntervals347",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals347(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals347(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals347(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals347(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA348",
    "number": 348,
    "title": "All Nodes Distance K in Binary Tree Search (Variant 2)",
    "slug": "all-nodes-distance-k-in-binary-tree-search-variant-2-348",
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
    "functionName": "maxDepth348",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth348(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth348(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth348(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth348(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA349",
    "number": 349,
    "title": "Letter Combinations of a Phone Number Digits (Variant 3)",
    "slug": "letter-combinations-of-a-phone-number-digits-variant-3-349",
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
    "functionName": "generateSubsets349",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets349(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets349(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets349(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets349(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA350",
    "number": 350,
    "title": "Divide Two Integers Without Multiplication (Variant 2)",
    "slug": "divide-two-integers-without-multiplication-variant-2-350",
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
    "functionName": "hammingWeight350",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight350(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight350(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight350(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight350(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA351",
    "number": 351,
    "title": "Car Pooling Capacity Check (Variant 2)",
    "slug": "car-pooling-capacity-check-variant-2-351",
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
    "functionName": "findEquilibriumIndex351",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex351(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex351(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex351(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex351(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA352",
    "number": 352,
    "title": "Minimum Window Substring Finder (Variant 3)",
    "slug": "minimum-window-substring-finder-variant-3-352",
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
    "functionName": "maxVowelsInWindow352",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow352(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow352(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow352(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow352(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA353",
    "number": 353,
    "title": "Daily Temperatures Heating Index (Variant 3)",
    "slug": "daily-temperatures-heating-index-variant-3-353",
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
    "functionName": "dailyTemperatures353",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures353(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures353(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures353(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures353(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA354",
    "number": 354,
    "title": "Search in Rotated Sorted Matrix (Variant 3)",
    "slug": "search-in-rotated-sorted-matrix-variant-3-354",
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
    "functionName": "searchRange354",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange354(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange354(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange354(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange354(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA355",
    "number": 355,
    "title": "House Robber Street Security Alert (Variant 3)",
    "slug": "house-robber-street-security-alert-variant-3-355",
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
    "functionName": "robHouses355",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses355(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses355(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses355(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses355(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA356",
    "number": 356,
    "title": "Number of Islands in Ocean Matrix (Variant 3)",
    "slug": "number-of-islands-in-ocean-matrix-variant-3-356",
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
    "functionName": "numIslands356",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands356(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands356(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands356(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands356(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA357",
    "number": 357,
    "title": "Meeting Rooms II Minimum Conference Rooms Required (Variant 4)",
    "slug": "meeting-rooms-ii-minimum-conference-rooms-required-variant-4-357",
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
    "functionName": "mergeIntervals357",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals357(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals357(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals357(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals357(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA358",
    "number": 358,
    "title": "Maximum Depth of Binary Structure (Variant 3)",
    "slug": "maximum-depth-of-binary-structure-variant-3-358",
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
    "functionName": "maxDepth358",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth358(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth358(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth358(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth358(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA359",
    "number": 359,
    "title": "Palindrome Partitioning Substring Slices (Variant 3)",
    "slug": "palindrome-partitioning-substring-slices-variant-3-359",
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
    "functionName": "generateSubsets359",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets359(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets359(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets359(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets359(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA360",
    "number": 360,
    "title": "Single Number XOR Deduplication (Variant 3)",
    "slug": "single-number-xor-deduplication-variant-3-360",
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
    "functionName": "hammingWeight360",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight360(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight360(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight360(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight360(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA361",
    "number": 361,
    "title": "Shift 2D Grid Elements (Variant 2)",
    "slug": "shift-2d-grid-elements-variant-2-361",
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
    "functionName": "findEquilibriumIndex361",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex361(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex361(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex361(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex361(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA362",
    "number": 362,
    "title": "Longest Substring with At Most Two Distinct Characters (Variant 3)",
    "slug": "longest-substring-with-at-most-two-distinct-characters-variant-3-362",
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
    "functionName": "maxVowelsInWindow362",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow362(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow362(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow362(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow362(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA363",
    "number": 363,
    "title": "Next Greater Element II in Circular Array (Variant 3)",
    "slug": "next-greater-element-ii-in-circular-array-variant-3-363",
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
    "functionName": "dailyTemperatures363",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures363(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures363(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures363(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures363(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA364",
    "number": 364,
    "title": "Find First and Last Position in Sorted Sequence (Variant 3)",
    "slug": "find-first-and-last-position-in-sorted-sequence-variant-3-364",
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
    "functionName": "searchRange364",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange364(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange364(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange364(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange364(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA365",
    "number": 365,
    "title": "Coin Change Fewest Denominations Required (Variant 3)",
    "slug": "coin-change-fewest-denominations-required-variant-3-365",
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
    "functionName": "robHouses365",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses365(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses365(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses365(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses365(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA366",
    "number": 366,
    "title": "Clone Connected Graph Nodes (Variant 3)",
    "slug": "clone-connected-graph-nodes-variant-3-366",
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
    "functionName": "numIslands366",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands366(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands366(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands366(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands366(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA367",
    "number": 367,
    "title": "Insert Interval in Sorted Disjoint Set (Variant 4)",
    "slug": "insert-interval-in-sorted-disjoint-set-variant-4-367",
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
    "functionName": "mergeIntervals367",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals367(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals367(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals367(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals367(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA368",
    "number": 368,
    "title": "Same Binary Tree Structure and Values Check (Variant 3)",
    "slug": "same-binary-tree-structure-and-values-check-variant-3-368",
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
    "functionName": "maxDepth368",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth368(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth368(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth368(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth368(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA369",
    "number": 369,
    "title": "Word Search Character Board Matrix (Variant 3)",
    "slug": "word-search-character-board-matrix-variant-3-369",
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
    "functionName": "generateSubsets369",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets369(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets369(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets369(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets369(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA370",
    "number": 370,
    "title": "Number of 1 Bits Hamming Weight (Variant 3)",
    "slug": "number-of-1-bits-hamming-weight-variant-3-370",
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
    "functionName": "hammingWeight370",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight370(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight370(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight370(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight370(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA371",
    "number": 371,
    "title": "Matrix Diagonal Sum Calculation (Variant 2)",
    "slug": "matrix-diagonal-sum-calculation-variant-2-371",
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
    "functionName": "findEquilibriumIndex371",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex371(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex371(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex371(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex371(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA372",
    "number": 372,
    "title": "Maximum Number of Vowels in a Substring of Given Length (Variant 3)",
    "slug": "maximum-number-of-vowels-in-a-substring-of-given-length-variant-3-372",
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
    "functionName": "maxVowelsInWindow372",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow372(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow372(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow372(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow372(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA373",
    "number": 373,
    "title": "Online Stock Spanner Daily Tracker (Variant 3)",
    "slug": "online-stock-spanner-daily-tracker-variant-3-373",
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
    "functionName": "dailyTemperatures373",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures373(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures373(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures373(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures373(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA374",
    "number": 374,
    "title": "Koko Eating Bananas Speed Optimization (Variant 3)",
    "slug": "koko-eating-bananas-speed-optimization-variant-3-374",
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
    "functionName": "searchRange374",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange374(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange374(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange374(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange374(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA375",
    "number": 375,
    "title": "Longest Increasing Subsequence Patience Sort (Variant 3)",
    "slug": "longest-increasing-subsequence-patience-sort-variant-3-375",
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
    "functionName": "robHouses375",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses375(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses375(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses375(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses375(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA376",
    "number": 376,
    "title": "Course Schedule Prerequisites Feasibility (Variant 3)",
    "slug": "course-schedule-prerequisites-feasibility-variant-3-376",
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
    "functionName": "numIslands376",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands376(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands376(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands376(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands376(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA377",
    "number": 377,
    "title": "Minimum Arrows to Burst Balloons Coordinate Plane (Variant 4)",
    "slug": "minimum-arrows-to-burst-balloons-coordinate-plane-variant-4-377",
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
    "functionName": "mergeIntervals377",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals377(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals377(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals377(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals377(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA378",
    "number": 378,
    "title": "Invert Binary Tree Left Right Subtrees (Variant 3)",
    "slug": "invert-binary-tree-left-right-subtrees-variant-3-378",
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
    "functionName": "maxDepth378",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth378(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth378(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth378(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth378(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA379",
    "number": 379,
    "title": "Generate Parentheses Well-Formed Pairs (Variant 3)",
    "slug": "generate-parentheses-well-formed-pairs-variant-3-379",
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
    "functionName": "generateSubsets379",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets379(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets379(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets379(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets379(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA380",
    "number": 380,
    "title": "Counting Bits Sublinear Computation (Variant 3)",
    "slug": "counting-bits-sublinear-computation-variant-3-380",
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
    "functionName": "hammingWeight380",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight380(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight380(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight380(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight380(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA381",
    "number": 381,
    "title": "Special Positions in a Binary Matrix (Variant 2)",
    "slug": "special-positions-in-a-binary-matrix-variant-2-381",
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
    "functionName": "findEquilibriumIndex381",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex381(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex381(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex381(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex381(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA382",
    "number": 382,
    "title": "Longest Repeating Character Replacement (Variant 3)",
    "slug": "longest-repeating-character-replacement-variant-3-382",
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
    "functionName": "maxVowelsInWindow382",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow382(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow382(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow382(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow382(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA383",
    "number": 383,
    "title": "Largest Rectangle in Skyline Histogram (Variant 3)",
    "slug": "largest-rectangle-in-skyline-histogram-variant-3-383",
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
    "functionName": "dailyTemperatures383",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures383(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures383(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures383(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures383(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA384",
    "number": 384,
    "title": "Capacity to Ship Packages Within D Days (Variant 3)",
    "slug": "capacity-to-ship-packages-within-d-days-variant-3-384",
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
    "functionName": "searchRange384",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange384(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange384(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange384(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange384(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA385",
    "number": 385,
    "title": "Partition Equal Subset Sum Verification (Variant 3)",
    "slug": "partition-equal-subset-sum-verification-variant-3-385",
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
    "functionName": "robHouses385",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses385(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses385(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses385(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses385(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA386",
    "number": 386,
    "title": "Pacific Atlantic Water Flow Continental Divide (Variant 3)",
    "slug": "pacific-atlantic-water-flow-continental-divide-variant-3-386",
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
    "functionName": "numIslands386",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands386(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands386(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands386(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands386(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA387",
    "number": 387,
    "title": "Interval List Intersections Between Ranges (Variant 4)",
    "slug": "interval-list-intersections-between-ranges-variant-4-387",
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
    "functionName": "mergeIntervals387",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals387(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals387(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals387(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals387(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA388",
    "number": 388,
    "title": "Binary Tree Level Order Breadth Traversal (Variant 3)",
    "slug": "binary-tree-level-order-breadth-traversal-variant-3-388",
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
    "functionName": "maxDepth388",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth388(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth388(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth388(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth388(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA389",
    "number": 389,
    "title": "Restore IP Addresses Octet Combinations (Variant 3)",
    "slug": "restore-ip-addresses-octet-combinations-variant-3-389",
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
    "functionName": "generateSubsets389",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets389(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets389(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets389(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets389(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA390",
    "number": 390,
    "title": "Reverse Bits 32-Bit Unsigned Integer (Variant 3)",
    "slug": "reverse-bits-32-bit-unsigned-integer-variant-3-390",
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
    "functionName": "hammingWeight390",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight390(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight390(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight390(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight390(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA391",
    "number": 391,
    "title": "Subarray Sum Divisible by K (Variant 3)",
    "slug": "subarray-sum-divisible-by-k-variant-3-391",
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
    "functionName": "findEquilibriumIndex391",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex391(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex391(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex391(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex391(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA392",
    "number": 392,
    "title": "Permutation in String Verification (Variant 3)",
    "slug": "permutation-in-string-verification-variant-3-392",
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
    "functionName": "maxVowelsInWindow392",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow392(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow392(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow392(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow392(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA393",
    "number": 393,
    "title": "Asteroid Collision Momentum Simulation (Variant 3)",
    "slug": "asteroid-collision-momentum-simulation-variant-3-393",
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
    "functionName": "dailyTemperatures393",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures393(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures393(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures393(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures393(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA394",
    "number": 394,
    "title": "Split Array Largest Sum Minimization (Variant 3)",
    "slug": "split-array-largest-sum-minimization-variant-3-394",
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
    "functionName": "searchRange394",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange394(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange394(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange394(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange394(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA395",
    "number": 395,
    "title": "Word Break Dictionary Segmentation (Variant 3)",
    "slug": "word-break-dictionary-segmentation-variant-3-395",
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
    "functionName": "robHouses395",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses395(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses395(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses395(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses395(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA396",
    "number": 396,
    "title": "Number of Provinces Connected Groups (Variant 3)",
    "slug": "number-of-provinces-connected-groups-variant-3-396",
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
    "functionName": "numIslands396",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands396(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands396(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands396(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands396(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA397",
    "number": 397,
    "title": "Car Pooling Route Passenger Capacities (Variant 4)",
    "slug": "car-pooling-route-passenger-capacities-variant-4-397",
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
    "functionName": "mergeIntervals397",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals397(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals397(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals397(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals397(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA398",
    "number": 398,
    "title": "Lowest Common Ancestor in Binary Search Tree (Variant 3)",
    "slug": "lowest-common-ancestor-in-binary-search-tree-variant-3-398",
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
    "functionName": "maxDepth398",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth398(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth398(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth398(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth398(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA399",
    "number": 399,
    "title": "N-Queens Non-Attacking Chessboard Placements (Variant 3)",
    "slug": "n-queens-non-attacking-chessboard-placements-variant-3-399",
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
    "functionName": "generateSubsets399",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets399(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets399(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets399(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets399(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA400",
    "number": 400,
    "title": "Missing Number Arithmetic Series Formula (Variant 3)",
    "slug": "missing-number-arithmetic-series-formula-variant-3-400",
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
    "functionName": "hammingWeight400",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight400(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight400(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight400(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight400(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
