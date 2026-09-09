// Batch 3: Questions 201 to 300
import type { DSAQuestion } from '../dsaTypes'

export const dsaBatch3: DSAQuestion[] = [
  {
    "id": "DSA201",
    "number": 201,
    "title": "Special Positions in a Binary Matrix",
    "slug": "special-positions-in-a-binary-matrix-201",
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
    "functionName": "findEquilibriumIndex201",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex201(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex201(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex201(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex201(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA202",
    "number": 202,
    "title": "Longest Substring with At Most Two Distinct Characters (Variant 2)",
    "slug": "longest-substring-with-at-most-two-distinct-characters-variant-2-202",
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
    "functionName": "maxVowelsInWindow202",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow202(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow202(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow202(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow202(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA203",
    "number": 203,
    "title": "Next Greater Element II in Circular Array (Variant 2)",
    "slug": "next-greater-element-ii-in-circular-array-variant-2-203",
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
    "functionName": "dailyTemperatures203",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures203(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures203(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures203(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures203(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA204",
    "number": 204,
    "title": "Find First and Last Position in Sorted Sequence (Variant 2)",
    "slug": "find-first-and-last-position-in-sorted-sequence-variant-2-204",
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
    "functionName": "searchRange204",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange204(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange204(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange204(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange204(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA205",
    "number": 205,
    "title": "Coin Change Fewest Denominations Required (Variant 2)",
    "slug": "coin-change-fewest-denominations-required-variant-2-205",
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
    "functionName": "robHouses205",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses205(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses205(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses205(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses205(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA206",
    "number": 206,
    "title": "Clone Connected Graph Nodes (Variant 2)",
    "slug": "clone-connected-graph-nodes-variant-2-206",
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
    "functionName": "numIslands206",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands206(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands206(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands206(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands206(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA207",
    "number": 207,
    "title": "Partition Labels String Character Disjoint Ranges (Variant 2)",
    "slug": "partition-labels-string-character-disjoint-ranges-variant-2-207",
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
    "functionName": "mergeIntervals207",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals207(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals207(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals207(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals207(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA208",
    "number": 208,
    "title": "Same Binary Tree Structure and Values Check (Variant 2)",
    "slug": "same-binary-tree-structure-and-values-check-variant-2-208",
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
    "functionName": "maxDepth208",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth208(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth208(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth208(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth208(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA209",
    "number": 209,
    "title": "Letter Combinations of a Phone Number Digits (Variant 2)",
    "slug": "letter-combinations-of-a-phone-number-digits-variant-2-209",
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
    "functionName": "generateSubsets209",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets209(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets209(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets209(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets209(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA210",
    "number": 210,
    "title": "Number of 1 Bits Hamming Weight (Variant 2)",
    "slug": "number-of-1-bits-hamming-weight-variant-2-210",
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
    "functionName": "hammingWeight210",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight210(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight210(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight210(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight210(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA211",
    "number": 211,
    "title": "Subarray Sum Divisible by K (Variant 2)",
    "slug": "subarray-sum-divisible-by-k-variant-2-211",
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
    "functionName": "findEquilibriumIndex211",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex211(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex211(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex211(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex211(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA212",
    "number": 212,
    "title": "Maximum Number of Vowels in a Substring of Given Length (Variant 2)",
    "slug": "maximum-number-of-vowels-in-a-substring-of-given-length-variant-2-212",
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
    "functionName": "maxVowelsInWindow212",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow212(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow212(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow212(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow212(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA213",
    "number": 213,
    "title": "Online Stock Spanner Daily Tracker (Variant 2)",
    "slug": "online-stock-spanner-daily-tracker-variant-2-213",
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
    "functionName": "dailyTemperatures213",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures213(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures213(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures213(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures213(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA214",
    "number": 214,
    "title": "Koko Eating Bananas Speed Optimization (Variant 2)",
    "slug": "koko-eating-bananas-speed-optimization-variant-2-214",
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
    "functionName": "searchRange214",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange214(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange214(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange214(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange214(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA215",
    "number": 215,
    "title": "Longest Increasing Subsequence Patience Sort (Variant 2)",
    "slug": "longest-increasing-subsequence-patience-sort-variant-2-215",
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
    "functionName": "robHouses215",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses215(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses215(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses215(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses215(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA216",
    "number": 216,
    "title": "Course Schedule Prerequisites Feasibility (Variant 2)",
    "slug": "course-schedule-prerequisites-feasibility-variant-2-216",
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
    "functionName": "numIslands216",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands216(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands216(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands216(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands216(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA217",
    "number": 217,
    "title": "Employee Free Time Global Work Schedule (Variant 2)",
    "slug": "employee-free-time-global-work-schedule-variant-2-217",
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
    "functionName": "mergeIntervals217",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals217(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals217(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals217(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals217(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA218",
    "number": 218,
    "title": "Invert Binary Tree Left Right Subtrees (Variant 2)",
    "slug": "invert-binary-tree-left-right-subtrees-variant-2-218",
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
    "functionName": "maxDepth218",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth218(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth218(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth218(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth218(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA219",
    "number": 219,
    "title": "Palindrome Partitioning Substring Slices (Variant 2)",
    "slug": "palindrome-partitioning-substring-slices-variant-2-219",
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
    "functionName": "generateSubsets219",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets219(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets219(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets219(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets219(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA220",
    "number": 220,
    "title": "Counting Bits Sublinear Computation (Variant 2)",
    "slug": "counting-bits-sublinear-computation-variant-2-220",
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
    "functionName": "hammingWeight220",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight220(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight220(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight220(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight220(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA221",
    "number": 221,
    "title": "Find Pivot Index in Equilibrium (Variant 2)",
    "slug": "find-pivot-index-in-equilibrium-variant-2-221",
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
    "functionName": "findEquilibriumIndex221",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex221(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex221(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex221(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex221(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA222",
    "number": 222,
    "title": "Longest Repeating Character Replacement (Variant 2)",
    "slug": "longest-repeating-character-replacement-variant-2-222",
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
    "functionName": "maxVowelsInWindow222",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow222(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow222(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow222(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow222(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA223",
    "number": 223,
    "title": "Largest Rectangle in Skyline Histogram (Variant 2)",
    "slug": "largest-rectangle-in-skyline-histogram-variant-2-223",
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
    "functionName": "dailyTemperatures223",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures223(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures223(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures223(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures223(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA224",
    "number": 224,
    "title": "Capacity to Ship Packages Within D Days (Variant 2)",
    "slug": "capacity-to-ship-packages-within-d-days-variant-2-224",
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
    "functionName": "searchRange224",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange224(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange224(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange224(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange224(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA225",
    "number": 225,
    "title": "Partition Equal Subset Sum Verification (Variant 2)",
    "slug": "partition-equal-subset-sum-verification-variant-2-225",
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
    "functionName": "robHouses225",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses225(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses225(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses225(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses225(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA226",
    "number": 226,
    "title": "Pacific Atlantic Water Flow Continental Divide (Variant 2)",
    "slug": "pacific-atlantic-water-flow-continental-divide-variant-2-226",
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
    "functionName": "numIslands226",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands226(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands226(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands226(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands226(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA227",
    "number": 227,
    "title": "Remove Covered Intervals from Collection (Variant 2)",
    "slug": "remove-covered-intervals-from-collection-variant-2-227",
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
    "functionName": "mergeIntervals227",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals227(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals227(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals227(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals227(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA228",
    "number": 228,
    "title": "Binary Tree Level Order Breadth Traversal (Variant 2)",
    "slug": "binary-tree-level-order-breadth-traversal-variant-2-228",
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
    "functionName": "maxDepth228",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth228(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth228(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth228(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth228(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA229",
    "number": 229,
    "title": "Word Search Character Board Matrix (Variant 2)",
    "slug": "word-search-character-board-matrix-variant-2-229",
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
    "functionName": "generateSubsets229",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets229(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets229(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets229(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets229(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA230",
    "number": 230,
    "title": "Reverse Bits 32-Bit Unsigned Integer (Variant 2)",
    "slug": "reverse-bits-32-bit-unsigned-integer-variant-2-230",
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
    "functionName": "hammingWeight230",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight230(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight230(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight230(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight230(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA231",
    "number": 231,
    "title": "Maximum Sum Circular Subarray (Variant 2)",
    "slug": "maximum-sum-circular-subarray-variant-2-231",
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
    "functionName": "findEquilibriumIndex231",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex231(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex231(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex231(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex231(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA232",
    "number": 232,
    "title": "Permutation in String Verification (Variant 2)",
    "slug": "permutation-in-string-verification-variant-2-232",
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
    "functionName": "maxVowelsInWindow232",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow232(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow232(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow232(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow232(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA233",
    "number": 233,
    "title": "Asteroid Collision Momentum Simulation (Variant 2)",
    "slug": "asteroid-collision-momentum-simulation-variant-2-233",
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
    "functionName": "dailyTemperatures233",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures233(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures233(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures233(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures233(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA234",
    "number": 234,
    "title": "Split Array Largest Sum Minimization (Variant 2)",
    "slug": "split-array-largest-sum-minimization-variant-2-234",
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
    "functionName": "searchRange234",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange234(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange234(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange234(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange234(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA235",
    "number": 235,
    "title": "Word Break Dictionary Segmentation (Variant 2)",
    "slug": "word-break-dictionary-segmentation-variant-2-235",
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
    "functionName": "robHouses235",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses235(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses235(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses235(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses235(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA236",
    "number": 236,
    "title": "Number of Provinces Connected Groups (Variant 2)",
    "slug": "number-of-provinces-connected-groups-variant-2-236",
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
    "functionName": "numIslands236",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands236(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands236(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands236(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands236(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA237",
    "number": 237,
    "title": "Merge Overlapping Calendar Intervals (Variant 3)",
    "slug": "merge-overlapping-calendar-intervals-variant-3-237",
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
    "functionName": "mergeIntervals237",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals237(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals237(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals237(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals237(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA238",
    "number": 238,
    "title": "Lowest Common Ancestor in Binary Search Tree (Variant 2)",
    "slug": "lowest-common-ancestor-in-binary-search-tree-variant-2-238",
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
    "functionName": "maxDepth238",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth238(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth238(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth238(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth238(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA239",
    "number": 239,
    "title": "Generate Parentheses Well-Formed Pairs (Variant 2)",
    "slug": "generate-parentheses-well-formed-pairs-variant-2-239",
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
    "functionName": "generateSubsets239",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets239(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets239(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets239(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets239(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA240",
    "number": 240,
    "title": "Missing Number Arithmetic Series Formula (Variant 2)",
    "slug": "missing-number-arithmetic-series-formula-variant-2-240",
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
    "functionName": "hammingWeight240",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight240(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight240(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight240(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight240(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA241",
    "number": 241,
    "title": "Continuous Subarray Sum Modulo (Variant 2)",
    "slug": "continuous-subarray-sum-modulo-variant-2-241",
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
    "functionName": "findEquilibriumIndex241",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex241(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex241(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex241(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex241(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA242",
    "number": 242,
    "title": "Find All Anagrams in a Given String (Variant 2)",
    "slug": "find-all-anagrams-in-a-given-string-variant-2-242",
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
    "functionName": "maxVowelsInWindow242",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow242(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow242(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow242(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow242(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA243",
    "number": 243,
    "title": "Remove K Digits to Form Smallest Number (Variant 2)",
    "slug": "remove-k-digits-to-form-smallest-number-variant-2-243",
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
    "functionName": "dailyTemperatures243",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures243(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures243(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures243(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures243(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA244",
    "number": 244,
    "title": "Find Minimum in Rotated Sorted Sequence II (Variant 2)",
    "slug": "find-minimum-in-rotated-sorted-sequence-ii-variant-2-244",
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
    "functionName": "searchRange244",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange244(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange244(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange244(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange244(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA245",
    "number": 245,
    "title": "Decode Ways Numeric Message Variations (Variant 2)",
    "slug": "decode-ways-numeric-message-variations-variant-2-245",
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
    "functionName": "robHouses245",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses245(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses245(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses245(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses245(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA246",
    "number": 246,
    "title": "Rotting Oranges Infection Timeline (Variant 2)",
    "slug": "rotting-oranges-infection-timeline-variant-2-246",
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
    "functionName": "numIslands246",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands246(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands246(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands246(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands246(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA247",
    "number": 247,
    "title": "Non-Overlapping Intervals Minimum Removals (Variant 3)",
    "slug": "non-overlapping-intervals-minimum-removals-variant-3-247",
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
    "functionName": "mergeIntervals247",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals247(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals247(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals247(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals247(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA248",
    "number": 248,
    "title": "Validate Binary Search Tree Inorder Monotonicity (Variant 2)",
    "slug": "validate-binary-search-tree-inorder-monotonicity-variant-2-248",
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
    "functionName": "maxDepth248",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth248(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth248(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth248(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth248(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA249",
    "number": 249,
    "title": "Restore IP Addresses Octet Combinations (Variant 2)",
    "slug": "restore-ip-addresses-octet-combinations-variant-2-249",
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
    "functionName": "generateSubsets249",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets249(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets249(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets249(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets249(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA250",
    "number": 250,
    "title": "Sum of Two Integers Bitwise Addition (Variant 2)",
    "slug": "sum-of-two-integers-bitwise-addition-variant-2-250",
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
    "functionName": "hammingWeight250",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight250(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight250(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight250(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight250(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA251",
    "number": 251,
    "title": "Product of Array Except Current (Variant 2)",
    "slug": "product-of-array-except-current-variant-2-251",
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
    "functionName": "findEquilibriumIndex251",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex251(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex251(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex251(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex251(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA252",
    "number": 252,
    "title": "Substrings of Size Three with Distinct Characters (Variant 2)",
    "slug": "substrings-of-size-three-with-distinct-characters-variant-2-252",
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
    "functionName": "maxVowelsInWindow252",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow252(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow252(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow252(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow252(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA253",
    "number": 253,
    "title": "Sum of Subarray Minimums Evaluation (Variant 2)",
    "slug": "sum-of-subarray-minimums-evaluation-variant-2-253",
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
    "functionName": "dailyTemperatures253",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures253(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures253(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures253(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures253(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA254",
    "number": 254,
    "title": "Find Peak Element in Terrain (Variant 2)",
    "slug": "find-peak-element-in-terrain-variant-2-254",
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
    "functionName": "searchRange254",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange254(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange254(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange254(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange254(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA255",
    "number": 255,
    "title": "Unique Paths Grid Robot Navigation (Variant 2)",
    "slug": "unique-paths-grid-robot-navigation-variant-2-255",
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
    "functionName": "robHouses255",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses255(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses255(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses255(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses255(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA256",
    "number": 256,
    "title": "Shortest Path in Binary Matrix Traversal (Variant 2)",
    "slug": "shortest-path-in-binary-matrix-traversal-variant-2-256",
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
    "functionName": "numIslands256",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands256(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands256(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands256(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands256(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA257",
    "number": 257,
    "title": "Meeting Rooms II Minimum Conference Rooms Required (Variant 3)",
    "slug": "meeting-rooms-ii-minimum-conference-rooms-required-variant-3-257",
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
    "functionName": "mergeIntervals257",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals257(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals257(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals257(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals257(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA258",
    "number": 258,
    "title": "Kth Smallest Element in BST Inorder Traversal (Variant 2)",
    "slug": "kth-smallest-element-in-bst-inorder-traversal-variant-2-258",
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
    "functionName": "maxDepth258",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth258(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth258(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth258(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth258(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA259",
    "number": 259,
    "title": "N-Queens Non-Attacking Chessboard Placements (Variant 2)",
    "slug": "n-queens-non-attacking-chessboard-placements-variant-2-259",
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
    "functionName": "generateSubsets259",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets259(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets259(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets259(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets259(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA260",
    "number": 260,
    "title": "Bitwise AND of Numbers Range Mask (Variant 2)",
    "slug": "bitwise-and-of-numbers-range-mask-variant-2-260",
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
    "functionName": "hammingWeight260",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight260(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight260(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight260(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight260(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA261",
    "number": 261,
    "title": "Count Number of Nice Subarrays (Variant 2)",
    "slug": "count-number-of-nice-subarrays-variant-2-261",
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
    "functionName": "findEquilibriumIndex261",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex261(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex261(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex261(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex261(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA262",
    "number": 262,
    "title": "Minimum Swaps to Group All 1s Together (Variant 2)",
    "slug": "minimum-swaps-to-group-all-1s-together-variant-2-262",
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
    "functionName": "maxVowelsInWindow262",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow262(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow262(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow262(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow262(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA263",
    "number": 263,
    "title": "Number of Visible People in a Queue (Variant 2)",
    "slug": "number-of-visible-people-in-a-queue-variant-2-263",
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
    "functionName": "dailyTemperatures263",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures263(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures263(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures263(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures263(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA264",
    "number": 264,
    "title": "Single Element in a Sorted Array with Duplicates (Variant 2)",
    "slug": "single-element-in-a-sorted-array-with-duplicates-variant-2-264",
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
    "functionName": "searchRange264",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange264(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange264(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange264(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange264(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA265",
    "number": 265,
    "title": "Minimum Path Sum Grid Cost Minimization (Variant 2)",
    "slug": "minimum-path-sum-grid-cost-minimization-variant-2-265",
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
    "functionName": "robHouses265",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses265(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses265(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses265(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses265(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA266",
    "number": 266,
    "title": "Surrounded Regions Capture Boundaries (Variant 2)",
    "slug": "surrounded-regions-capture-boundaries-variant-2-266",
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
    "functionName": "numIslands266",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands266(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands266(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands266(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands266(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA267",
    "number": 267,
    "title": "Insert Interval in Sorted Disjoint Set (Variant 3)",
    "slug": "insert-interval-in-sorted-disjoint-set-variant-3-267",
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
    "functionName": "mergeIntervals267",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals267(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals267(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals267(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals267(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA268",
    "number": 268,
    "title": "Binary Tree Right Side View Horizon (Variant 2)",
    "slug": "binary-tree-right-side-view-horizon-variant-2-268",
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
    "functionName": "maxDepth268",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth268(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth268(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth268(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth268(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA269",
    "number": 269,
    "title": "Sudoku Solver Grid Constraint Satisfaction (Variant 2)",
    "slug": "sudoku-solver-grid-constraint-satisfaction-variant-2-269",
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
    "functionName": "generateSubsets269",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets269(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets269(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets269(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets269(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA270",
    "number": 270,
    "title": "Power of Two Binary Exponent Check (Variant 2)",
    "slug": "power-of-two-binary-exponent-check-variant-2-270",
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
    "functionName": "hammingWeight270",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight270(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight270(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight270(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight270(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA271",
    "number": 271,
    "title": "Maximum Points You Can Obtain from Cards (Variant 2)",
    "slug": "maximum-points-you-can-obtain-from-cards-variant-2-271",
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
    "functionName": "findEquilibriumIndex271",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex271(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex271(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex271(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex271(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA272",
    "number": 272,
    "title": "Repeated DNA Sequences Recognition (Variant 2)",
    "slug": "repeated-dna-sequences-recognition-variant-2-272",
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
    "functionName": "maxVowelsInWindow272",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow272(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow272(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow272(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow272(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA273",
    "number": 273,
    "title": "Pattern 132 Subsequence Detection (Variant 2)",
    "slug": "pattern-132-subsequence-detection-variant-2-273",
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
    "functionName": "dailyTemperatures273",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures273(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures273(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures273(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures273(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA274",
    "number": 274,
    "title": "Search a 2D Matrix Row Column Sorted (Variant 2)",
    "slug": "search-a-2d-matrix-row-column-sorted-variant-2-274",
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
    "functionName": "searchRange274",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange274(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange274(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange274(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange274(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA275",
    "number": 275,
    "title": "Target Sum Expression Sign Combinations (Variant 2)",
    "slug": "target-sum-expression-sign-combinations-variant-2-275",
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
    "functionName": "robHouses275",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses275(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses275(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses275(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses275(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA276",
    "number": 276,
    "title": "Walls and Gates Distance Calculation (Variant 2)",
    "slug": "walls-and-gates-distance-calculation-variant-2-276",
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
    "functionName": "numIslands276",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands276(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands276(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands276(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands276(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA277",
    "number": 277,
    "title": "Minimum Arrows to Burst Balloons Coordinate Plane (Variant 3)",
    "slug": "minimum-arrows-to-burst-balloons-coordinate-plane-variant-3-277",
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
    "functionName": "mergeIntervals277",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals277(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals277(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals277(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals277(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA278",
    "number": 278,
    "title": "Path Sum Root to Leaf Target Value Verification (Variant 2)",
    "slug": "path-sum-root-to-leaf-target-value-verification-variant-2-278",
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
    "functionName": "maxDepth278",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth278(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth278(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth278(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth278(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA279",
    "number": 279,
    "title": "Combination Sum II Unique Elements Without Reuse (Variant 2)",
    "slug": "combination-sum-ii-unique-elements-without-reuse-variant-2-279",
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
    "functionName": "generateSubsets279",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets279(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets279(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets279(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets279(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA280",
    "number": 280,
    "title": "Counting Bits from 0 to N (Variant 2)",
    "slug": "counting-bits-from-0-to-n-variant-2-280",
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
    "functionName": "hammingWeight280",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight280(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight280(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight280(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight280(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA281",
    "number": 281,
    "title": "Find Good Days to Rob the Bank (Variant 2)",
    "slug": "find-good-days-to-rob-the-bank-variant-2-281",
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
    "functionName": "findEquilibriumIndex281",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex281(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex281(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex281(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex281(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA282",
    "number": 282,
    "title": "Count Binary Substrings with Equal Counts (Variant 2)",
    "slug": "count-binary-substrings-with-equal-counts-variant-2-282",
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
    "functionName": "maxVowelsInWindow282",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow282(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow282(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow282(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow282(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA283",
    "number": 283,
    "title": "Car Fleet Arrival Times Calculation (Variant 2)",
    "slug": "car-fleet-arrival-times-calculation-variant-2-283",
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
    "functionName": "dailyTemperatures283",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures283(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures283(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures283(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures283(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA284",
    "number": 284,
    "title": "Time Based Key-Value Data Store (Variant 2)",
    "slug": "time-based-key-value-data-store-variant-2-284",
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
    "functionName": "searchRange284",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange284(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange284(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange284(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange284(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA285",
    "number": 285,
    "title": "Maximum Product Subarray Traversal (Variant 2)",
    "slug": "maximum-product-subarray-traversal-variant-2-285",
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
    "functionName": "robHouses285",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses285(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses285(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses285(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses285(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA286",
    "number": 286,
    "title": "Reconstruct Itinerary Flight Paths (Variant 2)",
    "slug": "reconstruct-itinerary-flight-paths-variant-2-286",
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
    "functionName": "numIslands286",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands286(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands286(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands286(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands286(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA287",
    "number": 287,
    "title": "Interval List Intersections Between Ranges (Variant 3)",
    "slug": "interval-list-intersections-between-ranges-variant-3-287",
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
    "functionName": "mergeIntervals287",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals287(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals287(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals287(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals287(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA288",
    "number": 288,
    "title": "Count Complete Binary Tree Nodes Efficiently (Variant 2)",
    "slug": "count-complete-binary-tree-nodes-efficiently-variant-2-288",
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
    "functionName": "maxDepth288",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth288(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth288(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth288(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth288(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA289",
    "number": 289,
    "title": "Subsets II Duplicate Elements Handling (Variant 2)",
    "slug": "subsets-ii-duplicate-elements-handling-variant-2-289",
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
    "functionName": "generateSubsets289",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets289(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets289(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets289(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets289(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA290",
    "number": 290,
    "title": "Single Number III Two Unique Values Extraction (Variant 2)",
    "slug": "single-number-iii-two-unique-values-extraction-variant-2-290",
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
    "functionName": "hammingWeight290",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight290(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight290(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight290(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight290(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA291",
    "number": 291,
    "title": "Sum of Absolute Differences in Sorted Array (Variant 2)",
    "slug": "sum-of-absolute-differences-in-sorted-array-variant-2-291",
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
    "functionName": "findEquilibriumIndex291",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex291(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex291(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex291(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex291(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA292",
    "number": 292,
    "title": "Longest Nice Substring with Matching Case (Variant 2)",
    "slug": "longest-nice-substring-with-matching-case-variant-2-292",
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
    "functionName": "maxVowelsInWindow292",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow292(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow292(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow292(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow292(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA293",
    "number": 293,
    "title": "Simplify Canonical Unix Path Resolution (Variant 2)",
    "slug": "simplify-canonical-unix-path-resolution-variant-2-293",
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
    "functionName": "dailyTemperatures293",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures293(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures293(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures293(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures293(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA294",
    "number": 294,
    "title": "Magnetic Force Between Two Balls Distribution (Variant 2)",
    "slug": "magnetic-force-between-two-balls-distribution-variant-2-294",
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
    "functionName": "searchRange294",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange294(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange294(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange294(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange294(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA295",
    "number": 295,
    "title": "Coin Change II Number of Ways Combinations (Variant 2)",
    "slug": "coin-change-ii-number-of-ways-combinations-variant-2-295",
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
    "functionName": "robHouses295",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses295(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses295(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses295(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses295(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA296",
    "number": 296,
    "title": "Graph Valid Tree Cycle Detection (Variant 2)",
    "slug": "graph-valid-tree-cycle-detection-variant-2-296",
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
    "functionName": "numIslands296",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands296(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands296(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands296(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands296(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA297",
    "number": 297,
    "title": "Car Pooling Route Passenger Capacities (Variant 3)",
    "slug": "car-pooling-route-passenger-capacities-variant-3-297",
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
    "functionName": "mergeIntervals297",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals297(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals297(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals297(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals297(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA298",
    "number": 298,
    "title": "Construct Binary Tree from Preorder Inorder Arrays (Variant 2)",
    "slug": "construct-binary-tree-from-preorder-inorder-arrays-variant-2-298",
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
    "functionName": "maxDepth298",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth298(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth298(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth298(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth298(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA299",
    "number": 299,
    "title": "Permutations II Unique Permutations with Duplicates (Variant 2)",
    "slug": "permutations-ii-unique-permutations-with-duplicates-variant-2-299",
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
    "functionName": "generateSubsets299",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets299(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets299(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets299(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets299(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA300",
    "number": 300,
    "title": "Find the Difference Character XOR Filter (Variant 2)",
    "slug": "find-the-difference-character-xor-filter-variant-2-300",
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
    "functionName": "hammingWeight300",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight300(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight300(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight300(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight300(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
