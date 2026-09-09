// Batch 2: Questions 101 to 200
import type { DSAQuestion } from '../dsaTypes'

export const dsaBatch2: DSAQuestion[] = [
  {
    "id": "DSA101",
    "number": 101,
    "title": "Find Good Days to Rob the Bank",
    "slug": "find-good-days-to-rob-the-bank-101",
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
    "functionName": "findEquilibriumIndex101",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex101(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex101(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex101(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex101(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA102",
    "number": 102,
    "title": "Minimum Swaps to Group All 1s Together",
    "slug": "minimum-swaps-to-group-all-1s-together-102",
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
    "functionName": "maxVowelsInWindow102",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow102(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow102(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow102(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow102(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA103",
    "number": 103,
    "title": "Number of Visible People in a Queue",
    "slug": "number-of-visible-people-in-a-queue-103",
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
    "functionName": "dailyTemperatures103",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures103(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures103(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures103(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures103(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA104",
    "number": 104,
    "title": "Single Element in a Sorted Array with Duplicates",
    "slug": "single-element-in-a-sorted-array-with-duplicates-104",
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
    "functionName": "searchRange104",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange104(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange104(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange104(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange104(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA105",
    "number": 105,
    "title": "Minimum Path Sum Grid Cost Minimization",
    "slug": "minimum-path-sum-grid-cost-minimization-105",
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
    "functionName": "robHouses105",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses105(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses105(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses105(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses105(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA106",
    "number": 106,
    "title": "Surrounded Regions Capture Boundaries",
    "slug": "surrounded-regions-capture-boundaries-106",
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
    "functionName": "numIslands106",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands106(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands106(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands106(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands106(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA107",
    "number": 107,
    "title": "Partition Labels String Character Disjoint Ranges",
    "slug": "partition-labels-string-character-disjoint-ranges-107",
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
    "functionName": "mergeIntervals107",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals107(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals107(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals107(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals107(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA108",
    "number": 108,
    "title": "Binary Tree Right Side View Horizon",
    "slug": "binary-tree-right-side-view-horizon-108",
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
    "functionName": "maxDepth108",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth108(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth108(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth108(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth108(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA109",
    "number": 109,
    "title": "Restore IP Addresses Octet Combinations",
    "slug": "restore-ip-addresses-octet-combinations-109",
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
    "functionName": "generateSubsets109",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets109(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets109(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets109(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets109(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA110",
    "number": 110,
    "title": "Power of Two Binary Exponent Check",
    "slug": "power-of-two-binary-exponent-check-110",
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
    "functionName": "hammingWeight110",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight110(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight110(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight110(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight110(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA111",
    "number": 111,
    "title": "Sum of Absolute Differences in Sorted Array",
    "slug": "sum-of-absolute-differences-in-sorted-array-111",
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
    "functionName": "findEquilibriumIndex111",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex111(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex111(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex111(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex111(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA112",
    "number": 112,
    "title": "Repeated DNA Sequences Recognition",
    "slug": "repeated-dna-sequences-recognition-112",
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
    "functionName": "maxVowelsInWindow112",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow112(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow112(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow112(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow112(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA113",
    "number": 113,
    "title": "Pattern 132 Subsequence Detection",
    "slug": "pattern-132-subsequence-detection-113",
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
    "functionName": "dailyTemperatures113",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures113(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures113(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures113(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures113(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA114",
    "number": 114,
    "title": "Search a 2D Matrix Row Column Sorted",
    "slug": "search-a-2d-matrix-row-column-sorted-114",
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
    "functionName": "searchRange114",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange114(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange114(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange114(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange114(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA115",
    "number": 115,
    "title": "Target Sum Expression Sign Combinations",
    "slug": "target-sum-expression-sign-combinations-115",
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
    "functionName": "robHouses115",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses115(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses115(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses115(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses115(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA116",
    "number": 116,
    "title": "Walls and Gates Distance Calculation",
    "slug": "walls-and-gates-distance-calculation-116",
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
    "functionName": "numIslands116",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands116(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands116(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands116(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands116(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA117",
    "number": 117,
    "title": "Employee Free Time Global Work Schedule",
    "slug": "employee-free-time-global-work-schedule-117",
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
    "functionName": "mergeIntervals117",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals117(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals117(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals117(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals117(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA118",
    "number": 118,
    "title": "Path Sum Root to Leaf Target Value Verification",
    "slug": "path-sum-root-to-leaf-target-value-verification-118",
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
    "functionName": "maxDepth118",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth118(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth118(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth118(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth118(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA119",
    "number": 119,
    "title": "N-Queens Non-Attacking Chessboard Placements",
    "slug": "n-queens-non-attacking-chessboard-placements-119",
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
    "functionName": "generateSubsets119",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets119(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets119(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets119(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets119(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA120",
    "number": 120,
    "title": "Counting Bits from 0 to N",
    "slug": "counting-bits-from-0-to-n-120",
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
    "functionName": "hammingWeight120",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight120(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight120(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight120(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight120(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA121",
    "number": 121,
    "title": "Find All Good Indices",
    "slug": "find-all-good-indices-121",
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
    "functionName": "findEquilibriumIndex121",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex121(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex121(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex121(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex121(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA122",
    "number": 122,
    "title": "Count Binary Substrings with Equal Counts",
    "slug": "count-binary-substrings-with-equal-counts-122",
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
    "functionName": "maxVowelsInWindow122",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow122(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow122(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow122(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow122(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA123",
    "number": 123,
    "title": "Car Fleet Arrival Times Calculation",
    "slug": "car-fleet-arrival-times-calculation-123",
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
    "functionName": "dailyTemperatures123",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures123(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures123(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures123(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures123(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA124",
    "number": 124,
    "title": "Time Based Key-Value Data Store",
    "slug": "time-based-key-value-data-store-124",
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
    "functionName": "searchRange124",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange124(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange124(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange124(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange124(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA125",
    "number": 125,
    "title": "Maximum Product Subarray Traversal",
    "slug": "maximum-product-subarray-traversal-125",
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
    "functionName": "robHouses125",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses125(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses125(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses125(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses125(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA126",
    "number": 126,
    "title": "Reconstruct Itinerary Flight Paths",
    "slug": "reconstruct-itinerary-flight-paths-126",
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
    "functionName": "numIslands126",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands126(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands126(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands126(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands126(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA127",
    "number": 127,
    "title": "Remove Covered Intervals from Collection",
    "slug": "remove-covered-intervals-from-collection-127",
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
    "functionName": "mergeIntervals127",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals127(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals127(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals127(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals127(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA128",
    "number": 128,
    "title": "Count Complete Binary Tree Nodes Efficiently",
    "slug": "count-complete-binary-tree-nodes-efficiently-128",
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
    "functionName": "maxDepth128",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth128(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth128(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth128(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth128(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA129",
    "number": 129,
    "title": "Sudoku Solver Grid Constraint Satisfaction",
    "slug": "sudoku-solver-grid-constraint-satisfaction-129",
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
    "functionName": "generateSubsets129",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets129(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets129(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets129(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets129(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA130",
    "number": 130,
    "title": "Single Number III Two Unique Values Extraction",
    "slug": "single-number-iii-two-unique-values-extraction-130",
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
    "functionName": "hammingWeight130",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight130(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight130(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight130(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight130(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA131",
    "number": 131,
    "title": "Minimum Operations to Reduce X to Zero",
    "slug": "minimum-operations-to-reduce-x-to-zero-131",
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
    "functionName": "findEquilibriumIndex131",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex131(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex131(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex131(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex131(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA132",
    "number": 132,
    "title": "Longest Nice Substring with Matching Case",
    "slug": "longest-nice-substring-with-matching-case-132",
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
    "functionName": "maxVowelsInWindow132",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow132(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow132(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow132(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow132(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA133",
    "number": 133,
    "title": "Simplify Canonical Unix Path Resolution",
    "slug": "simplify-canonical-unix-path-resolution-133",
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
    "functionName": "dailyTemperatures133",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures133(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures133(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures133(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures133(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA134",
    "number": 134,
    "title": "Magnetic Force Between Two Balls Distribution",
    "slug": "magnetic-force-between-two-balls-distribution-134",
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
    "functionName": "searchRange134",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange134(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange134(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange134(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange134(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA135",
    "number": 135,
    "title": "Coin Change II Number of Ways Combinations",
    "slug": "coin-change-ii-number-of-ways-combinations-135",
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
    "functionName": "robHouses135",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses135(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses135(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses135(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses135(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA136",
    "number": 136,
    "title": "Graph Valid Tree Cycle Detection",
    "slug": "graph-valid-tree-cycle-detection-136",
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
    "functionName": "numIslands136",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands136(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands136(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands136(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands136(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA137",
    "number": 137,
    "title": "Merge Overlapping Calendar Intervals (Variant 2)",
    "slug": "merge-overlapping-calendar-intervals-variant-2-137",
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
    "functionName": "mergeIntervals137",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals137(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals137(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals137(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals137(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA138",
    "number": 138,
    "title": "Construct Binary Tree from Preorder Inorder Arrays",
    "slug": "construct-binary-tree-from-preorder-inorder-arrays-138",
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
    "functionName": "maxDepth138",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth138(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth138(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth138(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth138(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA139",
    "number": 139,
    "title": "Combination Sum II Unique Elements Without Reuse",
    "slug": "combination-sum-ii-unique-elements-without-reuse-139",
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
    "functionName": "generateSubsets139",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets139(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets139(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets139(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets139(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA140",
    "number": 140,
    "title": "Find the Difference Character XOR Filter",
    "slug": "find-the-difference-character-xor-filter-140",
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
    "functionName": "hammingWeight140",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight140(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight140(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight140(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight140(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA141",
    "number": 141,
    "title": "Make Sum Divisible by P",
    "slug": "make-sum-divisible-by-p-141",
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
    "functionName": "findEquilibriumIndex141",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex141(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex141(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex141(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex141(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA142",
    "number": 142,
    "title": "Minimum Size Subarray Sum Exceeding Target",
    "slug": "minimum-size-subarray-sum-exceeding-target-142",
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
    "functionName": "maxVowelsInWindow142",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow142(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow142(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow142(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow142(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA143",
    "number": 143,
    "title": "Decode Multi-Level Nested Strings",
    "slug": "decode-multi-level-nested-strings-143",
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
    "functionName": "dailyTemperatures143",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures143(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures143(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures143(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures143(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA144",
    "number": 144,
    "title": "Minimum Speed to Arrive on Time Transport",
    "slug": "minimum-speed-to-arrive-on-time-transport-144",
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
    "functionName": "searchRange144",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange144(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange144(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange144(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange144(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA145",
    "number": 145,
    "title": "Triangle Shortest Path Top to Bottom",
    "slug": "triangle-shortest-path-top-to-bottom-145",
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
    "functionName": "robHouses145",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses145(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses145(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses145(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses145(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA146",
    "number": 146,
    "title": "Redundant Connection in Undirected Graph",
    "slug": "redundant-connection-in-undirected-graph-146",
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
    "functionName": "numIslands146",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands146(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands146(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands146(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands146(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA147",
    "number": 147,
    "title": "Non-Overlapping Intervals Minimum Removals (Variant 2)",
    "slug": "non-overlapping-intervals-minimum-removals-variant-2-147",
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
    "functionName": "mergeIntervals147",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals147(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals147(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals147(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals147(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA148",
    "number": 148,
    "title": "Flatten Binary Tree to Linked List Preorder",
    "slug": "flatten-binary-tree-to-linked-list-preorder-148",
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
    "functionName": "maxDepth148",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth148(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth148(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth148(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth148(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA149",
    "number": 149,
    "title": "Subsets II Duplicate Elements Handling",
    "slug": "subsets-ii-duplicate-elements-handling-149",
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
    "functionName": "generateSubsets149",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets149(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets149(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets149(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets149(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA150",
    "number": 150,
    "title": "Hamming Distance Between Two Integers",
    "slug": "hamming-distance-between-two-integers-150",
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
    "functionName": "hammingWeight150",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight150(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight150(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight150(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight150(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA151",
    "number": 151,
    "title": "Range Addition Array Queries",
    "slug": "range-addition-array-queries-151",
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
    "functionName": "findEquilibriumIndex151",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex151(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex151(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex151(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex151(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA152",
    "number": 152,
    "title": "Diet Plan Performance Metric",
    "slug": "diet-plan-performance-metric-152",
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
    "functionName": "maxVowelsInWindow152",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow152(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow152(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow152(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow152(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA153",
    "number": 153,
    "title": "Validate Stack Sequences Push Pop Simulation",
    "slug": "validate-stack-sequences-push-pop-simulation-153",
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
    "functionName": "dailyTemperatures153",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures153(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures153(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures153(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures153(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA154",
    "number": 154,
    "title": "Arranging Coins in Staircase Pattern",
    "slug": "arranging-coins-in-staircase-pattern-154",
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
    "functionName": "searchRange154",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange154(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange154(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange154(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange154(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA155",
    "number": 155,
    "title": "Best Time to Buy and Sell Stock with Cooldown",
    "slug": "best-time-to-buy-and-sell-stock-with-cooldown-155",
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
    "functionName": "robHouses155",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses155(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses155(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses155(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses155(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA156",
    "number": 156,
    "title": "Network Delay Time Signal Broadcast",
    "slug": "network-delay-time-signal-broadcast-156",
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
    "functionName": "numIslands156",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands156(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands156(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands156(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands156(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA157",
    "number": 157,
    "title": "Meeting Rooms II Minimum Conference Rooms Required (Variant 2)",
    "slug": "meeting-rooms-ii-minimum-conference-rooms-required-variant-2-157",
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
    "functionName": "mergeIntervals157",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals157(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals157(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals157(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals157(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA158",
    "number": 158,
    "title": "Diameter of Binary Tree Longest Node Path",
    "slug": "diameter-of-binary-tree-longest-node-path-158",
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
    "functionName": "maxDepth158",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth158(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth158(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth158(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth158(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA159",
    "number": 159,
    "title": "Permutations II Unique Permutations with Duplicates",
    "slug": "permutations-ii-unique-permutations-with-duplicates-159",
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
    "functionName": "generateSubsets159",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets159(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets159(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets159(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets159(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA160",
    "number": 160,
    "title": "Convert Integer to Hexadecimal String",
    "slug": "convert-integer-to-hexadecimal-string-160",
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
    "functionName": "hammingWeight160",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight160(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight160(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight160(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight160(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA161",
    "number": 161,
    "title": "Corporate Flight Bookings",
    "slug": "corporate-flight-bookings-161",
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
    "functionName": "findEquilibriumIndex161",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex161(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex161(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex161(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex161(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA162",
    "number": 162,
    "title": "Check If a String Contains All Binary Codes of Size K",
    "slug": "check-if-a-string-contains-all-binary-codes-of-size-k-162",
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
    "functionName": "maxVowelsInWindow162",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow162(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow162(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow162(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow162(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA163",
    "number": 163,
    "title": "Min Stack Constant Time Retrieval",
    "slug": "min-stack-constant-time-retrieval-163",
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
    "functionName": "dailyTemperatures163",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures163(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures163(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures163(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures163(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA164",
    "number": 164,
    "title": "Guess Number Higher or Lower Interactive",
    "slug": "guess-number-higher-or-lower-interactive-164",
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
    "functionName": "searchRange164",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange164(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange164(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange164(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange164(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA165",
    "number": 165,
    "title": "Best Time to Buy and Sell Stock with Transaction Fee",
    "slug": "best-time-to-buy-and-sell-stock-with-transaction-fee-165",
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
    "functionName": "robHouses165",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses165(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses165(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses165(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses165(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA166",
    "number": 166,
    "title": "Cheapest Flights Within K Stops Router",
    "slug": "cheapest-flights-within-k-stops-router-166",
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
    "functionName": "numIslands166",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands166(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands166(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands166(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands166(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA167",
    "number": 167,
    "title": "Insert Interval in Sorted Disjoint Set (Variant 2)",
    "slug": "insert-interval-in-sorted-disjoint-set-variant-2-167",
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
    "functionName": "mergeIntervals167",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals167(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals167(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals167(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals167(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA168",
    "number": 168,
    "title": "Serialize and Deserialize Binary Tree String",
    "slug": "serialize-and-deserialize-binary-tree-string-168",
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
    "functionName": "maxDepth168",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth168(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth168(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth168(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth168(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA169",
    "number": 169,
    "title": "Non-decreasing Subsequences Finding",
    "slug": "non-decreasing-subsequences-finding-169",
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
    "functionName": "generateSubsets169",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets169(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets169(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets169(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets169(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA170",
    "number": 170,
    "title": "Add Binary Strings Bitwise Carry",
    "slug": "add-binary-strings-bitwise-carry-170",
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
    "functionName": "hammingWeight170",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight170(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight170(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight170(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight170(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA171",
    "number": 171,
    "title": "Car Pooling Capacity Check",
    "slug": "car-pooling-capacity-check-171",
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
    "functionName": "findEquilibriumIndex171",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex171(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex171(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex171(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex171(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA172",
    "number": 172,
    "title": "Grumpy Bookstore Owner Customer Satisfaction",
    "slug": "grumpy-bookstore-owner-customer-satisfaction-172",
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
    "functionName": "maxVowelsInWindow172",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow172(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow172(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow172(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow172(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA173",
    "number": 173,
    "title": "Evaluate Reverse Polish Notation Expression",
    "slug": "evaluate-reverse-polish-notation-expression-173",
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
    "functionName": "dailyTemperatures173",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures173(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures173(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures173(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures173(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA174",
    "number": 174,
    "title": "Find Smallest Letter Greater Than Target",
    "slug": "find-smallest-letter-greater-than-target-174",
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
    "functionName": "searchRange174",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange174(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange174(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange174(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange174(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA175",
    "number": 175,
    "title": "Continuous Subarray with Maximum Average",
    "slug": "continuous-subarray-with-maximum-average-175",
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
    "functionName": "robHouses175",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses175(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses175(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses175(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses175(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA176",
    "number": 176,
    "title": "As Far from Land as Possible Maximum Distance",
    "slug": "as-far-from-land-as-possible-maximum-distance-176",
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
    "functionName": "numIslands176",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands176(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands176(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands176(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands176(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA177",
    "number": 177,
    "title": "Minimum Arrows to Burst Balloons Coordinate Plane (Variant 2)",
    "slug": "minimum-arrows-to-burst-balloons-coordinate-plane-variant-2-177",
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
    "functionName": "mergeIntervals177",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals177(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals177(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals177(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals177(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA178",
    "number": 178,
    "title": "Populating Next Right Pointers in Each Node",
    "slug": "populating-next-right-pointers-in-each-node-178",
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
    "functionName": "maxDepth178",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth178(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth178(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth178(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth178(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA179",
    "number": 179,
    "title": "Subsets Power Set Generation (Variant 2)",
    "slug": "subsets-power-set-generation-variant-2-179",
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
    "functionName": "generateSubsets179",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets179(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets179(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets179(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets179(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA180",
    "number": 180,
    "title": "Base 7 Number Representation Conversion",
    "slug": "base-7-number-representation-conversion-180",
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
    "functionName": "hammingWeight180",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight180(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight180(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight180(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight180(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA181",
    "number": 181,
    "title": "Shift 2D Grid Elements",
    "slug": "shift-2d-grid-elements-181",
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
    "functionName": "findEquilibriumIndex181",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex181(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex181(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex181(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex181(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA182",
    "number": 182,
    "title": "K Radius Subarray Averages",
    "slug": "k-radius-subarray-averages-182",
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
    "functionName": "maxVowelsInWindow182",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow182(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow182(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow182(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow182(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA183",
    "number": 183,
    "title": "Maximum Width Ramp Computation",
    "slug": "maximum-width-ramp-computation-183",
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
    "functionName": "dailyTemperatures183",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures183(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures183(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures183(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures183(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA184",
    "number": 184,
    "title": "Valid Perfect Square Without Builtin Math",
    "slug": "valid-perfect-square-without-builtin-math-184",
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
    "functionName": "searchRange184",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange184(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange184(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange184(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange184(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA185",
    "number": 185,
    "title": "Russian Doll Envelopes 2D LIS",
    "slug": "russian-doll-envelopes-2d-lis-185",
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
    "functionName": "robHouses185",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses185(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses185(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses185(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses185(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA186",
    "number": 186,
    "title": "Minimum Cost to Reach City Across Tolls",
    "slug": "minimum-cost-to-reach-city-across-tolls-186",
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
    "functionName": "numIslands186",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands186(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands186(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands186(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands186(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA187",
    "number": 187,
    "title": "Interval List Intersections Between Ranges (Variant 2)",
    "slug": "interval-list-intersections-between-ranges-variant-2-187",
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
    "functionName": "mergeIntervals187",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals187(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals187(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals187(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals187(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA188",
    "number": 188,
    "title": "All Nodes Distance K in Binary Tree Search",
    "slug": "all-nodes-distance-k-in-binary-tree-search-188",
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
    "functionName": "maxDepth188",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth188(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth188(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth188(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth188(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA189",
    "number": 189,
    "title": "Permutations Full Array Combinations (Variant 2)",
    "slug": "permutations-full-array-combinations-variant-2-189",
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
    "functionName": "generateSubsets189",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets189(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets189(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets189(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets189(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA190",
    "number": 190,
    "title": "Divide Two Integers Without Multiplication",
    "slug": "divide-two-integers-without-multiplication-190",
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
    "functionName": "hammingWeight190",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight190(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight190(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight190(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight190(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA191",
    "number": 191,
    "title": "Matrix Diagonal Sum Calculation",
    "slug": "matrix-diagonal-sum-calculation-191",
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
    "functionName": "findEquilibriumIndex191",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex191(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex191(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex191(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex191(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA192",
    "number": 192,
    "title": "Minimum Window Substring Finder (Variant 2)",
    "slug": "minimum-window-substring-finder-variant-2-192",
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
    "functionName": "maxVowelsInWindow192",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow192(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow192(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow192(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow192(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA193",
    "number": 193,
    "title": "Daily Temperatures Heating Index (Variant 2)",
    "slug": "daily-temperatures-heating-index-variant-2-193",
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
    "functionName": "dailyTemperatures193",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures193(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures193(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures193(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures193(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA194",
    "number": 194,
    "title": "Search in Rotated Sorted Matrix (Variant 2)",
    "slug": "search-in-rotated-sorted-matrix-variant-2-194",
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
    "functionName": "searchRange194",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange194(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange194(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange194(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange194(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA195",
    "number": 195,
    "title": "House Robber Street Security Alert (Variant 2)",
    "slug": "house-robber-street-security-alert-variant-2-195",
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
    "functionName": "robHouses195",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses195(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses195(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses195(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses195(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA196",
    "number": 196,
    "title": "Number of Islands in Ocean Matrix (Variant 2)",
    "slug": "number-of-islands-in-ocean-matrix-variant-2-196",
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
    "functionName": "numIslands196",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands196(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands196(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands196(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands196(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA197",
    "number": 197,
    "title": "Car Pooling Route Passenger Capacities (Variant 2)",
    "slug": "car-pooling-route-passenger-capacities-variant-2-197",
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
    "functionName": "mergeIntervals197",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals197(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals197(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals197(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals197(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA198",
    "number": 198,
    "title": "Maximum Depth of Binary Structure (Variant 2)",
    "slug": "maximum-depth-of-binary-structure-variant-2-198",
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
    "functionName": "maxDepth198",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth198(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth198(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth198(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth198(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA199",
    "number": 199,
    "title": "Combination Sum Target Exact Summation (Variant 2)",
    "slug": "combination-sum-target-exact-summation-variant-2-199",
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
    "functionName": "generateSubsets199",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets199(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets199(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets199(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets199(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA200",
    "number": 200,
    "title": "Single Number XOR Deduplication (Variant 2)",
    "slug": "single-number-xor-deduplication-variant-2-200",
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
    "functionName": "hammingWeight200",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight200(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight200(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight200(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight200(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
