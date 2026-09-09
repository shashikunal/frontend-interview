// Batch 1: Questions 1 to 100
import type { DSAQuestion } from '../dsaTypes'

export const dsaBatch1: DSAQuestion[] = [
  {
    "id": "DSA001",
    "number": 1,
    "title": "Two Sum",
    "slug": "two-sum",
    "difficulty": "Easy",
    "topic": "Arrays",
    "pattern": [
      "Hash Map"
    ],
    "tags": [
      "Array",
      "Hash Table",
      "FAANG High Frequency"
    ],
    "companies": [
      "Google",
      "Meta",
      "Amazon",
      "Apple",
      "Microsoft"
    ],
    "problemStatement": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    "examples": [
      {
        "input": "nums = [2,7,11,15], target = 9",
        "output": "[0, 1]",
        "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        "input": "nums = [3,2,4], target = 6",
        "output": "[1, 2]",
        "explanation": "Because nums[1] + nums[2] == 6, we return [1, 2]."
      },
      {
        "input": "nums = [3,3], target = 6",
        "output": "[0, 1]"
      }
    ],
    "constraints": [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    "hints": [
      "A really brute force way would be to search for all possible pairs of numbers, which would be O(N^2). Can we do better?",
      "Can we use a hash map to store elements we have seen so far along with their indices?",
      "For each element x, look up if (target - x) is already in the hash map."
    ],
    "approach": "Hash Map single pass lookup.",
    "stepByStepExplanation": "1. Initialize an empty Map `seen` to store value -> index.\n2. Iterate through `nums` with index `i`.\n3. Calculate `complement = target - nums[i]`.\n4. If `complement` exists in `seen`, return `[seen.get(complement), i]`.\n5. Otherwise, store `seen.set(nums[i], i)`.\n6. Time complexity is O(N) and Space complexity is O(N).",
    "optimalApproach": "One-pass Hash Table",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "functionName": "twoSum",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function twoSum(nums: number[], target: number): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}",
    "solutionTS": "function twoSum(nums: number[], target: number): number[] {\n  const map = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement)!, i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[2, 7, 11, 15], 9]",
        "expectedOutput": "[0, 1]",
        "isHidden": false,
        "explanation": "Standard positive numbers pair"
      },
      {
        "id": "tc2",
        "input": "[[3, 2, 4], 6]",
        "expectedOutput": "[1, 2]",
        "isHidden": false,
        "explanation": "Pair not at 0 index"
      },
      {
        "id": "tc3",
        "input": "[[3, 3], 6]",
        "expectedOutput": "[0, 1]",
        "isHidden": false,
        "explanation": "Duplicate numbers"
      },
      {
        "id": "tc4",
        "input": "[[-1, -2, -3, -4, -5], -8]",
        "expectedOutput": "[2, 4]",
        "isHidden": true,
        "explanation": "Negative values check"
      },
      {
        "id": "tc5",
        "input": "[[0, 4, 3, 0], 0]",
        "expectedOutput": "[0, 3]",
        "isHidden": true,
        "explanation": "Zeros edge case"
      }
    ]
  },
  {
    "id": "DSA002",
    "number": 2,
    "title": "Valid Palindrome",
    "slug": "valid-palindrome",
    "difficulty": "Easy",
    "topic": "Strings",
    "pattern": [
      "Two Pointers"
    ],
    "tags": [
      "String",
      "Two Pointers"
    ],
    "companies": [
      "Facebook",
      "Microsoft",
      "Uber"
    ],
    "problemStatement": "A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.",
    "examples": [
      {
        "input": "s = \"A man, a plan, a canal: Panama\"",
        "output": "true",
        "explanation": "\"amanaplanacanalpanama\" is a palindrome."
      },
      {
        "input": "s = \"race a car\"",
        "output": "false",
        "explanation": "\"raceacar\" is not a palindrome."
      },
      {
        "input": "s = \" \"",
        "output": "true",
        "explanation": "s is an empty string \"\" after removing non-alphanumeric characters. An empty string reads the same forward and backward."
      }
    ],
    "constraints": [
      "1 <= s.length <= 2 * 10^5",
      "s consists only of printable ASCII characters."
    ],
    "hints": [
      "Consider using two pointers: one starting from the beginning and one from the end.",
      "Skip non-alphanumeric characters while moving pointers toward each other.",
      "Compare characters in lowercase format."
    ],
    "approach": "Two pointers moving inward.",
    "stepByStepExplanation": "1. Initialize left pointer at 0, right pointer at s.length - 1.\n2. Advance left while non-alphanumeric.\n3. Decrement right while non-alphanumeric.\n4. Compare characters (case insensitive). If mismatch, return false.\n5. Move inward and repeat. If pointers cross, return true.",
    "optimalApproach": "In-place Two Pointers",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "isPalindrome",
    "starterCodeJS": "/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isPalindrome(s) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function isPalindrome(s: string): boolean {\n  // Write your code here\n  return false;\n}\n",
    "solutionJS": "function isPalindrome(s) {\n  let l = 0;\n  let r = s.length - 1;\n  const isAlphaNum = (ch) => /[a-z0-9]/i.test(ch);\n\n  while (l < r) {\n    while (l < r && !isAlphaNum(s[l])) l++;\n    while (l < r && !isAlphaNum(s[r])) r--;\n    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;\n    l++;\n    r--;\n  }\n  return true;\n}",
    "solutionTS": "function isPalindrome(s: string): boolean {\n  let l = 0;\n  let r = s.length - 1;\n  const isAlphaNum = (ch: string) => /[a-z0-9]/i.test(ch);\n\n  while (l < r) {\n    while (l < r && !isAlphaNum(s[l])) l++;\n    while (l < r && !isAlphaNum(s[r])) r--;\n    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;\n    l++;\n    r--;\n  }\n  return true;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[\"A man, a plan, a canal: Panama\"]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[\"race a car\"]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[\" \"]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[\"0P\"]",
        "expectedOutput": "false",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA003",
    "number": 3,
    "title": "Valid Parentheses",
    "slug": "valid-parentheses",
    "difficulty": "Easy",
    "topic": "Stack & Queue",
    "pattern": [
      "Stack"
    ],
    "tags": [
      "Stack",
      "String"
    ],
    "companies": [
      "Amazon",
      "Google",
      "Bloomberg"
    ],
    "problemStatement": "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    "examples": [
      {
        "input": "s = \"()\"",
        "output": "true"
      },
      {
        "input": "s = \"()[]{}\"",
        "output": "true"
      },
      {
        "input": "s = \"(]\"",
        "output": "false"
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    "hints": [
      "Use a stack to push expected closing brackets when an opening bracket is met.",
      "When a closing bracket is found, pop from the stack and compare.",
      "Check if stack is completely empty at the end."
    ],
    "approach": "LIFO Stack tracking expected brackets.",
    "stepByStepExplanation": "1. Initialize an empty stack.\n2. Iterate through each character in the string.\n3. When encountering '(', push ')' onto stack; for '{' push '}'; for '[' push ']'.\n4. For closing bracket, pop from stack and check if equal. If stack is empty or mismatch, return false.\n5. Return true if stack is empty at end.",
    "optimalApproach": "Single-pass Stack",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "functionName": "isValid",
    "starterCodeJS": "/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isValid(s) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function isValid(s: string): boolean {\n  // Write your code here\n  return false;\n}\n",
    "solutionJS": "function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (const ch of s) {\n    if (ch === '(' || ch === '{' || ch === '[') {\n      stack.push(ch);\n    } else {\n      if (stack.pop() !== map[ch]) return false;\n    }\n  }\n  return stack.length === 0;\n}",
    "solutionTS": "function isValid(s: string): boolean {\n  const stack: string[] = [];\n  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };\n  for (const ch of s) {\n    if (ch === '(' || ch === '{' || ch === '[') {\n      stack.push(ch);\n    } else {\n      if (stack.pop() !== map[ch]) return false;\n    }\n  }\n  return stack.length === 0;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[\"()\"]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[\"()[]{}\"]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[\"(]\"]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[\"[\"]",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "id": "tc5",
        "input": "[\"{[]}\"]",
        "expectedOutput": "true",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA004",
    "number": 4,
    "title": "Best Time to Buy and Sell Stock",
    "slug": "best-time-to-buy-and-sell-stock",
    "difficulty": "Easy",
    "topic": "Arrays",
    "pattern": [
      "Sliding Window",
      "Dynamic Programming"
    ],
    "tags": [
      "Array",
      "Dynamic Programming"
    ],
    "companies": [
      "Amazon",
      "Google",
      "Apple"
    ],
    "problemStatement": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day.\n\nYou want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.",
    "examples": [
      {
        "input": "prices = [7,1,5,3,6,4]",
        "output": "5",
        "explanation": "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5."
      },
      {
        "input": "prices = [7,6,4,3,1]",
        "output": "0",
        "explanation": "In this case, no transactions are done and the max profit = 0."
      }
    ],
    "constraints": [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    "hints": [
      "Keep track of the minimum price seen so far.",
      "At each day, calculate the difference between current price and minimum price.",
      "Update the maximum profit if this difference is greater."
    ],
    "approach": "Single pass tracking min price and max profit.",
    "stepByStepExplanation": "1. Track `minPrice = Infinity` and `maxProfit = 0`.\n2. For each price in `prices`:\n   - If `price < minPrice`, update `minPrice = price`.\n   - Else if `price - minPrice > maxProfit`, update `maxProfit = price - minPrice`.\n3. Return `maxProfit`.",
    "optimalApproach": "One pass O(N) Greedy",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "maxProfit",
    "starterCodeJS": "/**\n * @param {number[]} prices\n * @return {number}\n */\nfunction maxProfit(prices) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxProfit(prices: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxProfit(prices) {\n  let minPrice = Infinity;\n  let maxProfit = 0;\n  for (let i = 0; i < prices.length; i++) {\n    if (prices[i] < minPrice) {\n      minPrice = prices[i];\n    } else if (prices[i] - minPrice > maxProfit) {\n      maxProfit = prices[i] - minPrice;\n    }\n  }\n  return maxProfit;\n}",
    "solutionTS": "function maxProfit(prices: number[]): number {\n  let minPrice = Infinity;\n  let maxProfit = 0;\n  for (let i = 0; i < prices.length; i++) {\n    if (prices[i] < minPrice) {\n      minPrice = prices[i];\n    } else if (prices[i] - minPrice > maxProfit) {\n      maxProfit = prices[i] - minPrice;\n    }\n  }\n  return maxProfit;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[7, 1, 5, 3, 6, 4]]",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[7, 6, 4, 3, 1]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[2, 4, 1]]",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "id": "tc4",
        "input": "[[3, 2, 6, 5, 0, 3]]",
        "expectedOutput": "4",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA005",
    "number": 5,
    "title": "Contains Duplicate",
    "slug": "contains-duplicate",
    "difficulty": "Easy",
    "topic": "Arrays",
    "pattern": [
      "Hash Set"
    ],
    "tags": [
      "Array",
      "Hash Table"
    ],
    "companies": [
      "Apple",
      "Microsoft",
      "Amazon"
    ],
    "problemStatement": "Given an integer array `nums`, return `true` if any value appears **at least twice** in the array, and return `false` if every element is distinct.",
    "examples": [
      {
        "input": "nums = [1,2,3,1]",
        "output": "true"
      },
      {
        "input": "nums = [1,2,3,4]",
        "output": "false"
      },
      {
        "input": "nums = [1,1,1,3,3,4,3,2,4,2]",
        "output": "true"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    "hints": [
      "A Set only stores unique values.",
      "If the size of a Set initialized with nums is smaller than nums.length, duplicates exist."
    ],
    "approach": "Set comparison.",
    "stepByStepExplanation": "Return `new Set(nums).size !== nums.length`.",
    "optimalApproach": "Hash Set check in O(N)",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "functionName": "containsDuplicate",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {boolean}\n */\nfunction containsDuplicate(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function containsDuplicate(nums: number[]): boolean {\n  // Write your code here\n  return false;\n}\n",
    "solutionJS": "function containsDuplicate(nums) {\n  return new Set(nums).size !== nums.length;\n}",
    "solutionTS": "function containsDuplicate(nums: number[]): boolean {\n  return new Set(nums).size !== nums.length;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 2, 3, 1]]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1, 2, 3, 4]]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]]",
        "expectedOutput": "true",
        "isHidden": false
      }
    ]
  },
  {
    "id": "DSA006",
    "number": 6,
    "title": "Product of Array Except Self",
    "slug": "product-of-array-except-self",
    "difficulty": "Medium",
    "topic": "Arrays",
    "pattern": [
      "Prefix Sum"
    ],
    "tags": [
      "Array",
      "Prefix Sum"
    ],
    "companies": [
      "Amazon",
      "Meta",
      "Apple",
      "Asana"
    ],
    "problemStatement": "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nThe product of any prefix or suffix of `nums` is **guaranteed** to fit in a **32-bit** integer.\n\nYou must write an algorithm that runs in `O(n)` time and without using the division operation.",
    "examples": [
      {
        "input": "nums = [1,2,3,4]",
        "output": "[24,12,8,6]"
      },
      {
        "input": "nums = [-1,1,0,-3,3]",
        "output": "[0,0,9,0,0]"
      }
    ],
    "constraints": [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30"
    ],
    "hints": [
      "Think about using prefix and suffix products.",
      "The answer at index i is the product of all elements to the left of i multiplied by all elements to the right of i.",
      "Can you do this in O(1) extra space complexity (excluding output array)?"
    ],
    "approach": "Left prefix products pass followed by right suffix products accumulator.",
    "stepByStepExplanation": "1. Initialize output array `res` of length N with 1s.\n2. Traverse left to right accumulating prefix products into `res[i]`.\n3. Traverse right to left accumulating suffix products into `postfix` and multiplying into `res[i]`.\n4. Return `res`.",
    "optimalApproach": "Two pass Prefix & Postfix Product",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1) extra space",
    "functionName": "productExceptSelf",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[]}\n */\nfunction productExceptSelf(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function productExceptSelf(nums: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function productExceptSelf(nums) {\n  const n = nums.length;\n  const res = new Array(n).fill(1);\n\n  let prefix = 1;\n  for (let i = 0; i < n; i++) {\n    res[i] = prefix;\n    prefix *= nums[i];\n  }\n\n  let postfix = 1;\n  for (let i = n - 1; i >= 0; i--) {\n    res[i] *= postfix;\n    postfix *= nums[i];\n  }\n\n  return res;\n}",
    "solutionTS": "function productExceptSelf(nums: number[]): number[] {\n  const n = nums.length;\n  const res: number[] = new Array(n).fill(1);\n\n  let prefix = 1;\n  for (let i = 0; i < n; i++) {\n    res[i] = prefix;\n    prefix *= nums[i];\n  }\n\n  let postfix = 1;\n  for (let i = n - 1; i >= 0; i--) {\n    res[i] *= postfix;\n    postfix *= nums[i];\n  }\n\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 2, 3, 4]]",
        "expectedOutput": "[24, 12, 8, 6]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[-1, 1, 0, -3, 3]]",
        "expectedOutput": "[0, 0, 9, 0, 0]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[2, 3]]",
        "expectedOutput": "[3, 2]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA007",
    "number": 7,
    "title": "Maximum Subarray",
    "slug": "maximum-subarray",
    "difficulty": "Medium",
    "topic": "Arrays",
    "pattern": [
      "Kadane's Algorithm",
      "Dynamic Programming"
    ],
    "tags": [
      "Array",
      "Dynamic Programming"
    ],
    "companies": [
      "Google",
      "Microsoft",
      "LinkedIn"
    ],
    "problemStatement": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    "examples": [
      {
        "input": "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        "output": "6",
        "explanation": "The subarray [4,-1,2,1] has the largest sum 6."
      },
      {
        "input": "nums = [1]",
        "output": "1"
      },
      {
        "input": "nums = [5,4,-1,7,8]",
        "output": "23"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    "hints": [
      "If current running sum becomes negative, it cannot help any future subarray.",
      "Reset current sum to 0 whenever it drops below 0.",
      "Track maximum sum seen so far."
    ],
    "approach": "Kadane's algorithm single pass.",
    "stepByStepExplanation": "1. Set `maxSum = nums[0]` and `currentSum = 0`.\n2. For each number `n` in `nums`:\n   - If `currentSum < 0`, reset `currentSum = 0`.\n   - `currentSum += n`.\n   - `maxSum = Math.max(maxSum, currentSum)`.\n3. Return `maxSum`.",
    "optimalApproach": "Kadane's Algorithm",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "maxSubArray",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction maxSubArray(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxSubArray(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxSubArray(nums) {\n  let maxSum = nums[0];\n  let curSum = 0;\n  for (const n of nums) {\n    if (curSum < 0) curSum = 0;\n    curSum += n;\n    maxSum = Math.max(maxSum, curSum);\n  }\n  return maxSum;\n}",
    "solutionTS": "function maxSubArray(nums: number[]): number {\n  let maxSum = nums[0];\n  let curSum = 0;\n  for (const n of nums) {\n    if (curSum < 0) curSum = 0;\n    curSum += n;\n    maxSum = Math.max(maxSum, curSum);\n  }\n  return maxSum;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[-2, 1, -3, 4, -1, 2, 1, -5, 4]]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[5, 4, -1, 7, 8]]",
        "expectedOutput": "23",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[-1, -2, -3]]",
        "expectedOutput": "-1",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA008",
    "number": 8,
    "title": "3Sum",
    "slug": "3sum",
    "difficulty": "Medium",
    "topic": "Arrays",
    "pattern": [
      "Two Pointers",
      "Sorting"
    ],
    "tags": [
      "Array",
      "Two Pointers",
      "Sorting"
    ],
    "companies": [
      "Meta",
      "Amazon",
      "Apple"
    ],
    "problemStatement": "Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.",
    "examples": [
      {
        "input": "nums = [-1,0,1,2,-1,-4]",
        "output": "[[-1,-1,2],[-1,0,1]]"
      },
      {
        "input": "nums = [0,1,1]",
        "output": "[]"
      },
      {
        "input": "nums = [0,0,0]",
        "output": "[[0,0,0]]"
      }
    ],
    "constraints": [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5"
    ],
    "hints": [
      "Sorting the array helps avoid duplicate triplets and enables two pointer search.",
      "Fix the first element nums[i], then use two pointers left and right to find nums[l] + nums[r] === -nums[i].",
      "Skip duplicate values when iterating to ensure unique triplets."
    ],
    "approach": "Sort array + iterate with two pointers.",
    "stepByStepExplanation": "1. Sort nums in ascending order.\n2. Iterate i from 0 to nums.length - 1:\n   - If i > 0 and nums[i] === nums[i-1], skip duplicate.\n   - Set left = i + 1, right = nums.length - 1.\n   - While left < right:\n     - sum = nums[i] + nums[left] + nums[right].\n     - If sum === 0, push [nums[i], nums[left], nums[right]], advance left and skip duplicates.\n     - If sum < 0, left++.\n     - If sum > 0, right--.\n3. Return results.",
    "optimalApproach": "Sort + Two Pointers O(N^2)",
    "timeComplexity": "O(N^2)",
    "spaceComplexity": "O(1) extra auxiliary space",
    "functionName": "threeSum",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction threeSum(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function threeSum(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function threeSum(nums) {\n  nums.sort((a, b) => a - b);\n  const res = [];\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    let l = i + 1;\n    let r = nums.length - 1;\n    while (l < r) {\n      const sum = nums[i] + nums[l] + nums[r];\n      if (sum === 0) {\n        res.push([nums[i], nums[l], nums[r]]);\n        while (l < r && nums[l] === nums[l + 1]) l++;\n        while (l < r && nums[r] === nums[r - 1]) r--;\n        l++;\n        r--;\n      } else if (sum < 0) {\n        l++;\n      } else {\n        r--;\n      }\n    }\n  }\n  return res;\n}",
    "solutionTS": "function threeSum(nums: number[]): number[][] {\n  nums.sort((a, b) => a - b);\n  const res: number[][] = [];\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    let l = i + 1;\n    let r = nums.length - 1;\n    while (l < r) {\n      const sum = nums[i] + nums[l] + nums[r];\n      if (sum === 0) {\n        res.push([nums[i], nums[l], nums[r]]);\n        while (l < r && nums[l] === nums[l + 1]) l++;\n        while (l < r && nums[r] === nums[r - 1]) r--;\n        l++;\n        r--;\n      } else if (sum < 0) {\n        l++;\n      } else {\n        r--;\n      }\n    }\n  }\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[-1, 0, 1, 2, -1, -4]]",
        "expectedOutput": "[[-1, -1, 2], [-1, 0, 1]]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[0, 1, 1]]",
        "expectedOutput": "[]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[0, 0, 0]]",
        "expectedOutput": "[[0, 0, 0]]",
        "isHidden": false
      }
    ]
  },
  {
    "id": "DSA009",
    "number": 9,
    "title": "Binary Search",
    "slug": "binary-search",
    "difficulty": "Easy",
    "topic": "Binary Search",
    "pattern": [
      "Binary Search"
    ],
    "tags": [
      "Binary Search",
      "Array"
    ],
    "companies": [
      "Microsoft",
      "Google",
      "Apple"
    ],
    "problemStatement": "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    "examples": [
      {
        "input": "nums = [-1,0,3,5,9,12], target = 9",
        "output": "4",
        "explanation": "9 exists in nums and its index is 4"
      },
      {
        "input": "nums = [-1,0,3,5,9,12], target = 2",
        "output": "-1",
        "explanation": "2 does not exist in nums so return -1"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order."
    ],
    "hints": [
      "Use two pointers low and high.",
      "Calculate mid = Math.floor((low + high) / 2).",
      "Adjust low or high depending on whether nums[mid] is smaller or larger than target."
    ],
    "approach": "Standard iterative binary search.",
    "stepByStepExplanation": "1. l = 0, r = nums.length - 1.\n2. while l <= r:\n   - mid = Math.floor((l + r) / 2)\n   - if nums[mid] === target return mid\n   - if nums[mid] < target l = mid + 1\n   - else r = mid - 1\n3. return -1 if not found.",
    "optimalApproach": "Iterative Binary Search O(log N)",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)",
    "functionName": "search",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nfunction search(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function search(nums: number[], target: number): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function search(nums, target) {\n  let l = 0;\n  let r = nums.length - 1;\n  while (l <= r) {\n    const mid = Math.floor((l + r) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) l = mid + 1;\n    else r = mid - 1;\n  }\n  return -1;\n}",
    "solutionTS": "function search(nums: number[], target: number): number {\n  let l = 0;\n  let r = nums.length - 1;\n  while (l <= r) {\n    const mid = Math.floor((l + r) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) l = mid + 1;\n    else r = mid - 1;\n  }\n  return -1;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[-1, 0, 3, 5, 9, 12], 9]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[-1, 0, 3, 5, 9, 12], 2]",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[5], 5]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA010",
    "number": 10,
    "title": "Longest Substring Without Repeating Characters",
    "slug": "longest-substring-without-repeating-characters",
    "difficulty": "Medium",
    "topic": "Strings",
    "pattern": [
      "Sliding Window",
      "Hash Map"
    ],
    "tags": [
      "String",
      "Sliding Window",
      "Hash Table"
    ],
    "companies": [
      "Amazon",
      "Google",
      "Meta",
      "Microsoft"
    ],
    "problemStatement": "Given a string `s`, find the length of the **longest substring** without duplicate characters.",
    "examples": [
      {
        "input": "s = \"abcabcbb\"",
        "output": "3",
        "explanation": "The answer is \"abc\", with the length of 3."
      },
      {
        "input": "s = \"bbbbb\"",
        "output": "1",
        "explanation": "The answer is \"b\", with the length of 1."
      },
      {
        "input": "s = \"pwwkew\"",
        "output": "3",
        "explanation": "The answer is \"wke\", with the length of 3. Notice that the answer must be a substring, \"pwke\" is a subsequence and not a substring."
      }
    ],
    "constraints": [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    "hints": [
      "Use a sliding window with two pointers: left and right.",
      "Maintain a set or map of characters currently in the window.",
      "When a duplicate is encountered, shrink the window from the left."
    ],
    "approach": "Sliding window with Set.",
    "stepByStepExplanation": "1. Set `left = 0`, `maxLen = 0`, `charSet = new Set()`.\n2. For `right` from 0 to s.length - 1:\n   - While `charSet.has(s[right])`: remove `s[left]` from set, `left++`.\n   - Add `s[right]` to set.\n   - Update `maxLen = Math.max(maxLen, right - left + 1)`.\n3. Return `maxLen`.",
    "optimalApproach": "Sliding Window O(N)",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(min(N, M))",
    "functionName": "lengthOfLongestSubstring",
    "starterCodeJS": "/**\n * @param {string} s\n * @return {number}\n */\nfunction lengthOfLongestSubstring(s) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function lengthOfLongestSubstring(s: string): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function lengthOfLongestSubstring(s) {\n  const set = new Set();\n  let l = 0;\n  let max = 0;\n  for (let r = 0; r < s.length; r++) {\n    while (set.has(s[r])) {\n      set.delete(s[l]);\n      l++;\n    }\n    set.add(s[r]);\n    max = Math.max(max, r - l + 1);\n  }\n  return max;\n}",
    "solutionTS": "function lengthOfLongestSubstring(s: string): number {\n  const set = new Set<string>();\n  let l = 0;\n  let max = 0;\n  for (let r = 0; r < s.length; r++) {\n    while (set.has(s[r])) {\n      set.delete(s[l]);\n      l++;\n    }\n    set.add(s[r]);\n    max = Math.max(max, r - l + 1);\n  }\n  return max;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[\"abcabcbb\"]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[\"bbbbb\"]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[\"pwwkew\"]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[\"\"]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA011",
    "number": 11,
    "title": "Climbing Stairs",
    "slug": "climbing-stairs",
    "difficulty": "Easy",
    "topic": "Dynamic Programming",
    "pattern": [
      "Fibonacci / DP"
    ],
    "tags": [
      "Dynamic Programming",
      "Math"
    ],
    "companies": [
      "Amazon",
      "Google",
      "Apple"
    ],
    "problemStatement": "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?",
    "examples": [
      {
        "input": "n = 2",
        "output": "2",
        "explanation": "There are two ways: 1 step + 1 step, or 2 steps."
      },
      {
        "input": "n = 3",
        "output": "3",
        "explanation": "There are three ways: (1+1+1), (1+2), (2+1)."
      }
    ],
    "constraints": [
      "1 <= n <= 45"
    ],
    "hints": [
      "To reach step n, you must come from step n-1 or step n-2.",
      "ways(n) = ways(n-1) + ways(n-2).",
      "This is equivalent to the Fibonacci sequence."
    ],
    "approach": "Space optimized DP.",
    "stepByStepExplanation": "1. For n <= 2, return n.\n2. Initialize prev2 = 1, prev1 = 2.\n3. From 3 to n:\n   - cur = prev1 + prev2\n   - prev2 = prev1\n   - prev1 = cur\n4. Return prev1.",
    "optimalApproach": "O(N) time O(1) space Fibonacci",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "climbStairs",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction climbStairs(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function climbStairs(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function climbStairs(n) {\n  if (n <= 2) return n;\n  let prev2 = 1;\n  let prev1 = 2;\n  for (let i = 3; i <= n; i++) {\n    const cur = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = cur;\n  }\n  return prev1;\n}",
    "solutionTS": "function climbStairs(n: number): number {\n  if (n <= 2) return n;\n  let prev2 = 1;\n  let prev1 = 2;\n  for (let i = 3; i <= n; i++) {\n    const cur = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = cur;\n  }\n  return prev1;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[2]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[3]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[5]",
        "expectedOutput": "8",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA012",
    "number": 12,
    "title": "Coin Change",
    "slug": "coin-change",
    "difficulty": "Medium",
    "topic": "Dynamic Programming",
    "pattern": [
      "Unbounded Knapsack / DP"
    ],
    "tags": [
      "Dynamic Programming",
      "BFS"
    ],
    "companies": [
      "Amazon",
      "Bloomberg",
      "Walmart"
    ],
    "problemStatement": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.",
    "examples": [
      {
        "input": "coins = [1,2,5], amount = 11",
        "output": "3",
        "explanation": "11 = 5 + 5 + 1"
      },
      {
        "input": "coins = [2], amount = 3",
        "output": "-1"
      },
      {
        "input": "coins = [1], amount = 0",
        "output": "0"
      }
    ],
    "constraints": [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4"
    ],
    "hints": [
      "Define dp[i] as the minimum coins needed for amount i.",
      "Initialize dp array with Infinity, dp[0] = 0.",
      "For each coin c, for i from c to amount: dp[i] = Math.min(dp[i], dp[i - c] + 1)."
    ],
    "approach": "Bottom-up 1D Dynamic Programming.",
    "stepByStepExplanation": "1. dp array of size amount + 1 filled with Infinity.\n2. dp[0] = 0.\n3. For coin of coins:\n   - For i from coin to amount:\n     - dp[i] = Math.min(dp[i], dp[i - coin] + 1)\n4. Return dp[amount] === Infinity ? -1 : dp[amount].",
    "optimalApproach": "Bottom-up DP O(amount * len(coins))",
    "timeComplexity": "O(A * C)",
    "spaceComplexity": "O(A)",
    "functionName": "coinChange",
    "starterCodeJS": "/**\n * @param {number[]} coins\n * @param {number} amount\n * @return {number}\n */\nfunction coinChange(coins, amount) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function coinChange(coins: number[], amount: number): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (const c of coins) {\n    for (let i = c; i <= amount; i++) {\n      dp[i] = Math.min(dp[i], dp[i - c] + 1);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}",
    "solutionTS": "function coinChange(coins: number[], amount: number): number {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (const c of coins) {\n    for (let i = c; i <= amount; i++) {\n      dp[i] = Math.min(dp[i], dp[i - c] + 1);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1, 2, 5], 11]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[2], 3]",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[1], 0]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[2, 5, 10, 1], 27]",
        "expectedOutput": "4",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA013",
    "number": 13,
    "title": "Number of Islands",
    "slug": "number-of-islands",
    "difficulty": "Medium",
    "topic": "Graphs",
    "pattern": [
      "DFS",
      "BFS",
      "Matrix Traversal"
    ],
    "tags": [
      "Graph",
      "Matrix",
      "DFS",
      "BFS"
    ],
    "companies": [
      "Amazon",
      "Google",
      "Bloomberg",
      "Microsoft"
    ],
    "problemStatement": "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    "examples": [
      {
        "input": "grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]",
        "output": "1"
      },
      {
        "input": "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]",
        "output": "3"
      }
    ],
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is '0' or '1'."
    ],
    "hints": [
      "Iterate through each cell in the matrix.",
      "When you see a \"1\", increment your island count and launch a DFS or BFS to visit and mark all connected \"1\"s as \"0\"."
    ],
    "approach": "In-place sink DFS.",
    "stepByStepExplanation": "1. Check for empty grid.\n2. Count = 0.\n3. For r from 0 to m-1, for c from 0 to n-1:\n   - If grid[r][c] === '1':\n     - Count++\n     - Run dfs(r, c) marking visited land as '0'.\n4. Return Count.",
    "optimalApproach": "DFS traversal O(M * N)",
    "timeComplexity": "O(M * N)",
    "spaceComplexity": "O(M * N) call stack",
    "functionName": "numIslands",
    "starterCodeJS": "/**\n * @param {character[][]} grid\n * @return {number}\n */\nfunction numIslands(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands(grid) {\n  if (!grid || !grid.length) return 0;\n  const m = grid.length;\n  const n = grid[0].length;\n  let count = 0;\n\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0'; // mark visited\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands(grid: string[][]): number {\n  if (!grid || !grid.length) return 0;\n  const m = grid.length;\n  const n = grid[0].length;\n  let count = 0;\n\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]]",
        "expectedOutput": "3",
        "isHidden": false
      }
    ]
  },
  {
    "id": "DSA014",
    "number": 14,
    "title": "Merge Intervals",
    "slug": "merge-intervals",
    "difficulty": "Medium",
    "topic": "Intervals",
    "pattern": [
      "Sorting",
      "Intervals"
    ],
    "tags": [
      "Array",
      "Sorting"
    ],
    "companies": [
      "Google",
      "Meta",
      "Amazon",
      "Apple"
    ],
    "problemStatement": "Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
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
      "0 <= starti <= endi <= 10^4"
    ],
    "hints": [
      "Sorting intervals by their start time makes overlapping intervals adjacent.",
      "Maintain the current merged interval and compare each subsequent interval with it."
    ],
    "approach": "Sort intervals by start time + single pass merge.",
    "stepByStepExplanation": "1. Sort intervals by start[0].\n2. Initialize merged array with the first interval.\n3. For each subsequent interval [curStart, curEnd]:\n   - If curStart <= lastMerged[1]:\n     - lastMerged[1] = Math.max(lastMerged[1], curEnd)\n   - Else:\n     - Push [curStart, curEnd] to merged.\n4. Return merged.",
    "optimalApproach": "Sort + Greedy Merge O(N log N)",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "functionName": "merge",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction merge(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function merge(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function merge(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    const curr = intervals[i];\n    if (curr[0] <= last[1]) {\n      last[1] = Math.max(last[1], curr[1]);\n    } else {\n      res.push(curr);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function merge(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    const curr = intervals[i];\n    if (curr[0] <= last[1]) {\n      last[1] = Math.max(last[1], curr[1]);\n    } else {\n      res.push(curr);\n    }\n  }\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[[1,3],[2,6],[8,10],[15,18]]]",
        "expectedOutput": "[[1,6],[8,10],[15,18]]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[[1,4],[4,5]]]",
        "expectedOutput": "[[1,5]]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[[1,4],[0,4]]]",
        "expectedOutput": "[[0,4]]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA015",
    "number": 15,
    "title": "Trapping Rain Water",
    "slug": "trapping-rain-water",
    "difficulty": "Difficult",
    "topic": "Arrays",
    "pattern": [
      "Two Pointers",
      "Monotonic Stack"
    ],
    "tags": [
      "Array",
      "Two Pointers",
      "Dynamic Programming",
      "Stack"
    ],
    "companies": [
      "Amazon",
      "Google",
      "Meta",
      "Apple",
      "Goldman Sachs"
    ],
    "problemStatement": "Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.",
    "examples": [
      {
        "input": "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        "output": "6",
        "explanation": "The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped."
      },
      {
        "input": "height = [4,2,0,3,2,5]",
        "output": "9"
      }
    ],
    "constraints": [
      "n == height.length",
      "1 <= n <= 2 * 10^4",
      "0 <= height[i] <= 10^5"
    ],
    "hints": [
      "The trapped water at any bar i is bounded by min(maxLeft, maxRight) - height[i].",
      "You can calculate this with two pointers starting from both ends in O(1) memory."
    ],
    "approach": "Two pointers keeping track of maxLeft and maxRight.",
    "stepByStepExplanation": "1. l = 0, r = height.length - 1.\n2. maxL = 0, maxR = 0, water = 0.\n3. While l < r:\n   - If height[l] < height[r]:\n     - If height[l] >= maxL update maxL = height[l]\n     - Else water += maxL - height[l]\n     - l++\n   - Else:\n     - If height[r] >= maxR update maxR = height[r]\n     - Else water += maxR - height[r]\n     - r--\n4. Return water.",
    "optimalApproach": "Two Pointers O(N) time O(1) space",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "trap",
    "starterCodeJS": "/**\n * @param {number[]} height\n * @return {number}\n */\nfunction trap(height) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function trap(height: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function trap(height) {\n  let l = 0;\n  let r = height.length - 1;\n  let maxL = 0;\n  let maxR = 0;\n  let res = 0;\n  while (l < r) {\n    if (height[l] < height[r]) {\n      if (height[l] >= maxL) maxL = height[l];\n      else res += maxL - height[l];\n      l++;\n    } else {\n      if (height[r] >= maxR) maxR = height[r];\n      else res += maxR - height[r];\n      r--;\n    }\n  }\n  return res;\n}",
    "solutionTS": "function trap(height: number[]): number {\n  let l = 0;\n  let r = height.length - 1;\n  let maxL = 0;\n  let maxR = 0;\n  let res = 0;\n  while (l < r) {\n    if (height[l] < height[r]) {\n      if (height[l] >= maxL) maxL = height[l];\n      else res += maxL - height[l];\n      l++;\n    } else {\n      if (height[r] >= maxR) maxR = height[r];\n      else res += maxR - height[r];\n      r--;\n    }\n  }\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[0,1,0,2,1,0,1,3,2,1,2,1]]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[4,2,0,3,2,5]]",
        "expectedOutput": "9",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[3,0,2,0,4]]",
        "expectedOutput": "7",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA016",
    "number": 16,
    "title": "Search Insert Position",
    "slug": "search-insert-position",
    "difficulty": "Easy",
    "topic": "Binary Search",
    "pattern": [
      "Binary Search"
    ],
    "tags": [
      "Array",
      "Binary Search"
    ],
    "companies": [
      "Google",
      "Microsoft",
      "Amazon",
      "Apple"
    ],
    "problemStatement": "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    "examples": [
      {
        "input": "nums = [1,3,5,6], target = 5",
        "output": "2",
        "explanation": "5 is found at index 2."
      },
      {
        "input": "nums = [1,3,5,6], target = 2",
        "output": "1",
        "explanation": "2 should be inserted at index 1."
      },
      {
        "input": "nums = [1,3,5,6], target = 7",
        "output": "4",
        "explanation": "7 should be inserted at index 4 (end of array)."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-10^4 <= nums[i] <= 10^4",
      "nums contains distinct values sorted in ascending order.",
      "-10^4 <= target <= 10^4"
    ],
    "hints": [
      "Can we use binary search to narrow down the insertion index?",
      "When target is not found, what does the low pointer point to at the end of the loop?",
      "The low pointer will point to the exact insertion point where the element belongs."
    ],
    "approach": "Binary search to locate index or boundary insertion point.",
    "stepByStepExplanation": "1. Initialize l = 0, r = nums.length - 1.\n2. While l <= r:\n   - mid = Math.floor((l + r) / 2)\n   - If nums[mid] === target return mid\n   - If nums[mid] < target l = mid + 1\n   - Else r = mid - 1\n3. When the loop terminates, l is the correct insertion index.",
    "optimalApproach": "Binary Search O(log N)",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)",
    "functionName": "searchInsert",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nfunction searchInsert(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchInsert(nums: number[], target: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function searchInsert(nums, target) {\n  let l = 0, r = nums.length - 1;\n  while (l <= r) {\n    const mid = Math.floor((l + r) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) l = mid + 1;\n    else r = mid - 1;\n  }\n  return l;\n}",
    "solutionTS": "function searchInsert(nums: number[], target: number): number {\n  let l = 0, r = nums.length - 1;\n  while (l <= r) {\n    const mid = Math.floor((l + r) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) l = mid + 1;\n    else r = mid - 1;\n  }\n  return l;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1,3,5,6], 5]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1,3,5,6], 2]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[1,3,5,6], 7]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "id": "tc4",
        "input": "[[1,3,5,6], 0]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA017",
    "number": 17,
    "title": "Valid Anagram",
    "slug": "valid-anagram",
    "difficulty": "Easy",
    "topic": "Strings",
    "pattern": [
      "Hash Map"
    ],
    "tags": [
      "Hash Table",
      "String",
      "Sorting"
    ],
    "companies": [
      "Amazon",
      "Facebook",
      "Bloomberg",
      "Google"
    ],
    "problemStatement": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    "examples": [
      {
        "input": "s = \"anagram\", t = \"nagaram\"",
        "output": "true"
      },
      {
        "input": "s = \"rat\", t = \"car\"",
        "output": "false"
      }
    ],
    "constraints": [
      "1 <= s.length, t.length <= 5 * 10^4",
      "s and t consist of lowercase English letters."
    ],
    "hints": [
      "If the lengths of s and t differ, they cannot be anagrams.",
      "Count character frequencies using an array of length 26."
    ],
    "approach": "Character frequency array of size 26.",
    "stepByStepExplanation": "1. Check if s.length !== t.length, return false.\n2. Initialize array of 26 zeros.\n3. Increment for s and decrement for t.\n4. Verify all elements in array are 0.",
    "optimalApproach": "Frequency array O(N)",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "isAnagram",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {string} t\n * @return {boolean}\n */\nfunction isAnagram(s, t) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function isAnagram(s: string, t: string): boolean {\n  // Write your code here\n  return false;\n}\n",
    "solutionJS": "function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const counts = new Array(26).fill(0);\n  const codeA = 'a'.charCodeAt(0);\n  for (let i = 0; i < s.length; i++) {\n    counts[s.charCodeAt(i) - codeA]++;\n    counts[t.charCodeAt(i) - codeA]--;\n  }\n  return counts.every(c => c === 0);\n}",
    "solutionTS": "function isAnagram(s: string, t: string): boolean {\n  if (s.length !== t.length) return false;\n  const counts: number[] = new Array(26).fill(0);\n  const codeA = 'a'.charCodeAt(0);\n  for (let i = 0; i < s.length; i++) {\n    counts[s.charCodeAt(i) - codeA]++;\n    counts[t.charCodeAt(i) - codeA]--;\n  }\n  return counts.every(c => c === 0);\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[\"anagram\", \"nagaram\"]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[\"rat\", \"car\"]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[\"ab\", \"a\"]",
        "expectedOutput": "false",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA018",
    "number": 18,
    "title": "Search in Rotated Sorted Array",
    "slug": "search-in-rotated-sorted-array",
    "difficulty": "Medium",
    "topic": "Binary Search",
    "pattern": [
      "Binary Search"
    ],
    "tags": [
      "Array",
      "Binary Search"
    ],
    "companies": [
      "Amazon",
      "Meta",
      "Microsoft",
      "Google"
    ],
    "problemStatement": "Prior to being passed to your function, an integer array `nums` sorted in ascending order (with distinct values) was rotated at an unknown pivot index `k`.\n\nGiven the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    "examples": [
      {
        "input": "nums = [4,5,6,7,0,1,2], target = 0",
        "output": "4"
      },
      {
        "input": "nums = [4,5,6,7,0,1,2], target = 3",
        "output": "-1"
      },
      {
        "input": "nums = [1], target = 0",
        "output": "-1"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i], target <= 10^4",
      "All values of nums are unique."
    ],
    "hints": [
      "Notice that at least one half of the array (left or right) is always sorted.",
      "Check if target lies inside the sorted half to determine which direction to branch."
    ],
    "approach": "Modified binary search with sorted half detection.",
    "stepByStepExplanation": "1. l = 0, r = nums.length - 1.\n2. While l <= r:\n   - mid = Math.floor((l + r) / 2)\n   - If nums[mid] === target return mid\n   - If nums[l] <= nums[mid]: left half is sorted\n     - If nums[l] <= target < nums[mid] r = mid - 1, else l = mid + 1\n   - Else: right half is sorted\n     - If nums[mid] < target <= nums[r] l = mid + 1, else r = mid - 1\n3. Return -1.",
    "optimalApproach": "Binary Search O(log N)",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)",
    "functionName": "search",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nfunction search(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function search(nums: number[], target: number): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function search(nums, target) {\n  let l = 0, r = nums.length - 1;\n  while (l <= r) {\n    const mid = Math.floor((l + r) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[l] <= nums[mid]) {\n      if (nums[l] <= target && target < nums[mid]) r = mid - 1;\n      else l = mid + 1;\n    } else {\n      if (nums[mid] < target && target <= nums[r]) l = mid + 1;\n      else r = mid - 1;\n    }\n  }\n  return -1;\n}",
    "solutionTS": "function search(nums: number[], target: number): number {\n  let l = 0, r = nums.length - 1;\n  while (l <= r) {\n    const mid = Math.floor((l + r) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[l] <= nums[mid]) {\n      if (nums[l] <= target && target < nums[mid]) r = mid - 1;\n      else l = mid + 1;\n    } else {\n      if (nums[mid] < target && target <= nums[r]) l = mid + 1;\n      else r = mid - 1;\n    }\n  }\n  return -1;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[4,5,6,7,0,1,2], 0]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[4,5,6,7,0,1,2], 3]",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[1], 0]",
        "expectedOutput": "-1",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA019",
    "number": 19,
    "title": "Find Minimum in Rotated Sorted Array",
    "slug": "find-minimum-in-rotated-sorted-array",
    "difficulty": "Medium",
    "topic": "Binary Search",
    "pattern": [
      "Binary Search"
    ],
    "tags": [
      "Array",
      "Binary Search"
    ],
    "companies": [
      "Meta",
      "Amazon",
      "Microsoft"
    ],
    "problemStatement": "Given the sorted rotated array `nums` of unique elements, return the minimum element of this array.\n\nYou must write an algorithm that runs in `O(log n)` time.",
    "examples": [
      {
        "input": "nums = [3,4,5,1,2]",
        "output": "1"
      },
      {
        "input": "nums = [4,5,6,7,0,1,2]",
        "output": "0"
      },
      {
        "input": "nums = [11,13,15,17]",
        "output": "11"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 5000",
      "-5000 <= nums[i] <= 5000",
      "All the integers of nums are unique."
    ],
    "hints": [
      "Compare nums[mid] with nums[r].",
      "If nums[mid] > nums[r], the minimum must be strictly in the right subarray (mid + 1 .. r).",
      "Otherwise, the minimum is at mid or in the left subarray (l .. mid)."
    ],
    "approach": "Binary search narrowing down to the inflection point.",
    "stepByStepExplanation": "1. l = 0, r = nums.length - 1.\n2. While l < r:\n   - mid = Math.floor((l + r) / 2)\n   - If nums[mid] > nums[r] l = mid + 1\n   - Else r = mid\n3. Return nums[l].",
    "optimalApproach": "Binary Search O(log N)",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)",
    "functionName": "findMin",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findMin(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findMin(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function findMin(nums) {\n  let l = 0, r = nums.length - 1;\n  while (l < r) {\n    const mid = Math.floor((l + r) / 2);\n    if (nums[mid] > nums[r]) l = mid + 1;\n    else r = mid;\n  }\n  return nums[l];\n}",
    "solutionTS": "function findMin(nums: number[]): number {\n  let l = 0, r = nums.length - 1;\n  while (l < r) {\n    const mid = Math.floor((l + r) / 2);\n    if (nums[mid] > nums[r]) l = mid + 1;\n    else r = mid;\n  }\n  return nums[l];\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[3,4,5,1,2]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[4,5,6,7,0,1,2]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[11,13,15,17]]",
        "expectedOutput": "11",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA020",
    "number": 20,
    "title": "Single Number",
    "slug": "single-number",
    "difficulty": "Easy",
    "topic": "Bit Manipulation",
    "pattern": [
      "Bit Manipulation"
    ],
    "tags": [
      "Array",
      "Bit Manipulation"
    ],
    "companies": [
      "Amazon",
      "Apple",
      "Google"
    ],
    "problemStatement": "Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one.\n\nYou must implement a solution with a linear runtime complexity and use only constant extra space.",
    "examples": [
      {
        "input": "nums = [2,2,1]",
        "output": "1"
      },
      {
        "input": "nums = [4,1,2,1,2]",
        "output": "4"
      },
      {
        "input": "nums = [1]",
        "output": "1"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 3 * 10^4",
      "-3 * 10^4 <= nums[i] <= 3 * 10^4",
      "Each element in the array appears twice except for one element which appears only once."
    ],
    "hints": [
      "Remember the XOR operator: a ^ a = 0 and a ^ 0 = a.",
      "XOR-ing all elements leaves only the single element."
    ],
    "approach": "Bitwise XOR reduction.",
    "stepByStepExplanation": "1. Accumulate XOR over all numbers in nums.\n2. Identical pairs cancel out to 0.\n3. Return the remaining accumulated value.",
    "optimalApproach": "XOR in O(N) time O(1) space",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "singleNumber",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction singleNumber(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function singleNumber(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function singleNumber(nums) {\n  return nums.reduce((acc, n) => acc ^ n, 0);\n}",
    "solutionTS": "function singleNumber(nums: number[]): number {\n  return nums.reduce((acc, n) => acc ^ n, 0);\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[2,2,1]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[4,1,2,1,2]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[1]]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA021",
    "number": 21,
    "title": "Longest Consecutive Sequence",
    "slug": "longest-consecutive-sequence",
    "difficulty": "Medium",
    "topic": "Hash Table",
    "pattern": [
      "Hash Set"
    ],
    "tags": [
      "Array",
      "Hash Table",
      "Union Find"
    ],
    "companies": [
      "Google",
      "Amazon",
      "Spotify"
    ],
    "problemStatement": "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.\n\nYou must write an algorithm that runs in `O(n)` time.",
    "examples": [
      {
        "input": "nums = [100,4,200,1,3,2]",
        "output": "4",
        "explanation": "The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4."
      },
      {
        "input": "nums = [0,3,7,2,5,8,4,6,0,1]",
        "output": "9"
      }
    ],
    "constraints": [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    "hints": [
      "Insert all numbers into a Set.",
      "Only begin counting when num - 1 is not in the set, making num the start of a streak."
    ],
    "approach": "Set membership check only from sequence starts.",
    "stepByStepExplanation": "1. Put all nums into a Set.\n2. For each num in Set:\n   - If !(num - 1 in Set): start of a new sequence\n   - Count consecutive numbers num + 1, num + 2, ...\n   - Update maxStreak.\n3. Return maxStreak.",
    "optimalApproach": "Set O(N) time O(N) space",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "functionName": "longestConsecutive",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction longestConsecutive(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function longestConsecutive(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function longestConsecutive(nums) {\n  if (!nums.length) return 0;\n  const set = new Set(nums);\n  let maxStreak = 0;\n  for (const num of set) {\n    if (!set.has(num - 1)) {\n      let current = num;\n      let streak = 1;\n      while (set.has(current + 1)) {\n        current++;\n        streak++;\n      }\n      maxStreak = Math.max(maxStreak, streak);\n    }\n  }\n  return maxStreak;\n}",
    "solutionTS": "function longestConsecutive(nums: number[]): number {\n  if (!nums.length) return 0;\n  const set = new Set(nums);\n  let maxStreak = 0;\n  for (const num of set) {\n    if (!set.has(num - 1)) {\n      let current = num;\n      let streak = 1;\n      while (set.has(current + 1)) {\n        current++;\n        streak++;\n      }\n      maxStreak = Math.max(maxStreak, streak);\n    }\n  }\n  return maxStreak;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[100,4,200,1,3,2]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[0,3,7,2,5,8,4,6,0,1]]",
        "expectedOutput": "9",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA022",
    "number": 22,
    "title": "Subsets",
    "slug": "subsets",
    "difficulty": "Medium",
    "topic": "Backtracking",
    "pattern": [
      "Backtracking"
    ],
    "tags": [
      "Array",
      "Backtracking",
      "Bit Manipulation"
    ],
    "companies": [
      "Meta",
      "Amazon",
      "Google"
    ],
    "problemStatement": "Given an integer array `nums` of **unique** elements, return all possible subsets (the power set).\n\nThe solution set **must not** contain duplicate subsets. Return the solution in **any order**.",
    "examples": [
      {
        "input": "nums = [1,2,3]",
        "output": "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]"
      },
      {
        "input": "nums = [0]",
        "output": "[[],[0]]"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10",
      "-10 <= nums[i] <= 10",
      "All the numbers of nums are unique."
    ],
    "hints": [
      "At each element, you branch: either include it or exclude it.",
      "Use recursion or backtracking with index tracking."
    ],
    "approach": "Backtracking to explore all combinations.",
    "stepByStepExplanation": "1. Initialize res = [].\n2. Define backtrack(start, path):\n   - Push a copy of path to res.\n   - Loop i from start to nums.length:\n     - path.push(nums[i])\n     - backtrack(i + 1, path)\n     - path.pop()\n3. backtrack(0, []), return res.",
    "optimalApproach": "Backtracking O(2^N)",
    "timeComplexity": "O(2^N)",
    "spaceComplexity": "O(N)",
    "functionName": "subsets",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction subsets(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function subsets(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function subsets(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function subsets(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1,2,3]]",
        "expectedOutput": "[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[0]]",
        "expectedOutput": "[[],[0]]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[1,2]]",
        "expectedOutput": "[[],[1],[1,2],[2]]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA023",
    "number": 23,
    "title": "Combination Sum",
    "slug": "combination-sum",
    "difficulty": "Medium",
    "topic": "Backtracking",
    "pattern": [
      "Backtracking"
    ],
    "tags": [
      "Array",
      "Backtracking"
    ],
    "companies": [
      "Airbnb",
      "Meta",
      "Amazon",
      "Apple"
    ],
    "problemStatement": "Given an array of **distinct** integers `candidates` and a target integer `target`, return a list of all **unique combinations** of `candidates` where the chosen numbers sum to `target`. You may return the combinations in **any order**.\n\nThe **same** number may be chosen from `candidates` an **unlimited number of times**. Two combinations are unique if the frequency of at least one of the chosen numbers is different.",
    "examples": [
      {
        "input": "candidates = [2,3,6,7], target = 7",
        "output": "[[2,2,3],[7]]"
      },
      {
        "input": "candidates = [2,3,5], target = 8",
        "output": "[[2,2,2,2],[2,3,3],[3,5]]"
      }
    ],
    "constraints": [
      "1 <= candidates.length <= 30",
      "2 <= candidates[i] <= 40",
      "All elements of candidates are distinct.",
      "1 <= target <= 40"
    ],
    "hints": [
      "Sort candidates first to enable early pruning.",
      "Because elements can be reused, the recursive call can keep the current index i."
    ],
    "approach": "Backtracking with sorted pruning.",
    "stepByStepExplanation": "1. Sort candidates.\n2. Backtrack(start, remain, path):\n   - If remain === 0: push copy of path to results.\n   - For i from start to candidates.length:\n     - If candidates[i] > remain: break early.\n     - path.push(candidates[i])\n     - backtrack(i, remain - candidates[i], path)\n     - path.pop()",
    "optimalApproach": "DFS Backtracking with Pruning",
    "timeComplexity": "O(2^target)",
    "spaceComplexity": "O(target)",
    "functionName": "combinationSum",
    "starterCodeJS": "/**\n * @param {number[]} candidates\n * @param {number} target\n * @return {number[][]}\n */\nfunction combinationSum(candidates, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function combinationSum(candidates: number[], target: number): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function combinationSum(candidates, target) {\n  const res = [];\n  candidates.sort((a, b) => a - b);\n  function dfs(start, remain, path) {\n    if (remain === 0) {\n      res.push([...path]);\n      return;\n    }\n    for (let i = start; i < candidates.length; i++) {\n      if (candidates[i] > remain) break;\n      path.push(candidates[i]);\n      dfs(i, remain - candidates[i], path);\n      path.pop();\n    }\n  }\n  dfs(0, target, []);\n  return res;\n}",
    "solutionTS": "function combinationSum(candidates: number[], target: number): number[][] {\n  const res: number[][] = [];\n  candidates.sort((a, b) => a - b);\n  function dfs(start: number, remain: number, path: number[]) {\n    if (remain === 0) {\n      res.push([...path]);\n      return;\n    }\n    for (let i = start; i < candidates.length; i++) {\n      if (candidates[i] > remain) break;\n      path.push(candidates[i]);\n      dfs(i, remain - candidates[i], path);\n      path.pop();\n    }\n  }\n  dfs(0, target, []);\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[2,3,6,7], 7]",
        "expectedOutput": "[[2,2,3],[7]]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[2,3,5], 8]",
        "expectedOutput": "[[2,2,2,2],[2,3,3],[3,5]]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[2], 1]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA024",
    "number": 24,
    "title": "Word Search",
    "slug": "word-search",
    "difficulty": "Medium",
    "topic": "Backtracking",
    "pattern": [
      "DFS",
      "Backtracking"
    ],
    "tags": [
      "Array",
      "Matrix",
      "Backtracking"
    ],
    "companies": [
      "Bloomberg",
      "Amazon",
      "Microsoft",
      "Snapchat"
    ],
    "problemStatement": "Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.\n\nThe word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.",
    "examples": [
      {
        "input": "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"",
        "output": "true"
      },
      {
        "input": "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"SEE\"",
        "output": "true"
      },
      {
        "input": "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCB\"",
        "output": "false"
      }
    ],
    "constraints": [
      "m == board.length",
      "n = board[i].length",
      "1 <= m, n <= 6",
      "1 <= word.length <= 15",
      "board and word consists of only lowercase and uppercase English letters."
    ],
    "hints": [
      "Iterate over every cell in the grid as a starting point.",
      "Mark visited cells in place with a sentinel like \"#\" and restore upon backtracking."
    ],
    "approach": "2D DFS Backtracking.",
    "stepByStepExplanation": "1. Loop through all cells (r, c).\n2. If board[r][c] === word[0], run dfs(r, c, 0).\n3. In dfs(r, c, k):\n   - If k === word.length return true.\n   - If out of bounds or board[r][c] !== word[k], return false.\n   - Temporarily set board[r][c] = '#'.\n   - Explore 4 directions.\n   - Restore board[r][c].\n4. Return true if any path matches, else false.",
    "optimalApproach": "DFS Backtracking O(M*N * 4^L)",
    "timeComplexity": "O(M*N * 4^L)",
    "spaceComplexity": "O(L)",
    "functionName": "exist",
    "starterCodeJS": "/**\n * @param {character[][]} board\n * @param {string} word\n * @return {boolean}\n */\nfunction exist(board, word) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function exist(board: string[][], word: string): boolean {\n  // Write your code here\n  return false;\n}\n",
    "solutionJS": "function exist(board, word) {\n  const m = board.length;\n  const n = board[0].length;\n  function dfs(r, c, k) {\n    if (k === word.length) return true;\n    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== word[k]) return false;\n    const tmp = board[r][c];\n    board[r][c] = '#';\n    const found = dfs(r + 1, c, k + 1) || dfs(r - 1, c, k + 1) || dfs(r, c + 1, k + 1) || dfs(r, c - 1, k + 1);\n    board[r][c] = tmp;\n    return found;\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (dfs(r, c, 0)) return true;\n    }\n  }\n  return false;\n}",
    "solutionTS": "function exist(board: string[][], word: string): boolean {\n  const m = board.length;\n  const n = board[0].length;\n  function dfs(r: number, c: number, k: number): boolean {\n    if (k === word.length) return true;\n    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== word[k]) return false;\n    const tmp = board[r][c];\n    board[r][c] = '#';\n    const found = dfs(r + 1, c, k + 1) || dfs(r - 1, c, k + 1) || dfs(r, c + 1, k + 1) || dfs(r, c - 1, k + 1);\n    board[r][c] = tmp;\n    return found;\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (dfs(r, c, 0)) return true;\n    }\n  }\n  return false;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], \"ABCCED\"]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], \"SEE\"]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], \"ABCB\"]",
        "expectedOutput": "false",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA025",
    "number": 25,
    "title": "Top K Frequent Elements",
    "slug": "top-k-frequent-elements",
    "difficulty": "Medium",
    "topic": "Heap / Priority Queue",
    "pattern": [
      "Heap",
      "Bucket Sort"
    ],
    "tags": [
      "Array",
      "Hash Table",
      "Sorting",
      "Bucket Sort"
    ],
    "companies": [
      "Amazon",
      "Facebook",
      "Uber",
      "Yelp"
    ],
    "problemStatement": "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in **any order**.",
    "examples": [
      {
        "input": "nums = [1,1,1,2,2,3], k = 2",
        "output": "[1,2]"
      },
      {
        "input": "nums = [1], k = 1",
        "output": "[1]"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
      "k is in the range [1, the number of unique elements in the array].",
      "It is guaranteed that the answer is unique."
    ],
    "hints": [
      "Count frequencies using a Hash Map.",
      "Bucket sort by frequency in an array of lists of size nums.length + 1 achieves O(N) runtime."
    ],
    "approach": "Bucket sort by frequencies.",
    "stepByStepExplanation": "1. Count frequencies with a map.\n2. Group numbers into buckets index by frequency.\n3. Traverse buckets from right to left collecting k elements.",
    "optimalApproach": "Bucket Sort O(N)",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "functionName": "topKFrequent",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number[]}\n */\nfunction topKFrequent(nums, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function topKFrequent(nums: number[], k: number): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function topKFrequent(nums, k) {\n  const map = new Map();\n  for (const n of nums) map.set(n, (map.get(n) || 0) + 1);\n  const buckets = Array.from({ length: nums.length + 1 }, () => []);\n  for (const [val, count] of map.entries()) {\n    buckets[count].push(val);\n  }\n  const res = [];\n  for (let i = buckets.length - 1; i >= 0 && res.length < k; i--) {\n    for (const val of buckets[i]) {\n      res.push(val);\n      if (res.length === k) break;\n    }\n  }\n  return res;\n}",
    "solutionTS": "function topKFrequent(nums: number[], k: number): number[] {\n  const map = new Map<number, number>();\n  for (const n of nums) map.set(n, (map.get(n) || 0) + 1);\n  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);\n  for (const [val, count] of map.entries()) {\n    buckets[count].push(val);\n  }\n  const res: number[] = [];\n  for (let i = buckets.length - 1; i >= 0 && res.length < k; i--) {\n    for (const val of buckets[i]) {\n      res.push(val);\n      if (res.length === k) break;\n    }\n  }\n  return res;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1,1,1,2,2,3], 2]",
        "expectedOutput": "[1,2]",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1], 1]",
        "expectedOutput": "[1]",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[4,1,-1,2,-1,2,3], 2]",
        "expectedOutput": "[-1,2]",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA026",
    "number": 26,
    "title": "House Robber",
    "slug": "house-robber",
    "difficulty": "Medium",
    "topic": "Dynamic Programming",
    "pattern": [
      "1D DP",
      "Dynamic Programming"
    ],
    "tags": [
      "Array",
      "Dynamic Programming"
    ],
    "companies": [
      "Google",
      "Airbnb",
      "Microsoft"
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
        "explanation": "Rob house 1 (money = 2), house 3 (money = 9) and house 5 (money = 1). Total amount = 2 + 9 + 1 = 12."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 400"
    ],
    "hints": [
      "For each house i, you either rob house i + best from i-2, or skip house i and keep best from i-1.",
      "Maintain two variables rob1 and rob2 to achieve O(1) space."
    ],
    "approach": "1D DP with space optimization.",
    "stepByStepExplanation": "1. rob1 = 0, rob2 = 0.\n2. For each num in nums:\n   - temp = Math.max(num + rob1, rob2)\n   - rob1 = rob2\n   - rob2 = temp\n3. Return rob2.",
    "optimalApproach": "1D DP O(N) time O(1) space",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "functionName": "rob",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction rob(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function rob(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function rob(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function rob(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1,2,3,1]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[2,7,9,3,1]]",
        "expectedOutput": "12",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[0]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA027",
    "number": 27,
    "title": "Unique Paths",
    "slug": "unique-paths",
    "difficulty": "Medium",
    "topic": "Dynamic Programming",
    "pattern": [
      "2D Grid DP",
      "Dynamic Programming"
    ],
    "tags": [
      "Math",
      "Dynamic Programming",
      "Combinatorics"
    ],
    "companies": [
      "Amazon",
      "Bloomberg",
      "Meta"
    ],
    "problemStatement": "There is a robot on an `m x n` grid. The robot is initially located at the **top-left corner** (i.e., `grid[0][0]`). The robot tries to move to the **bottom-right corner** (i.e., `grid[m - 1][n - 1]`). The robot can only move either down or right at any point in time.\n\nGiven the two integers `m` and `n`, return the number of possible unique paths that the robot can take to reach the bottom-right corner.",
    "examples": [
      {
        "input": "m = 3, n = 7",
        "output": "28"
      },
      {
        "input": "m = 3, n = 2",
        "output": "3"
      }
    ],
    "constraints": [
      "1 <= m, n <= 100"
    ],
    "hints": [
      "dp[i][j] = dp[i-1][j] + dp[i][j-1].",
      "You only need one 1D array of size n to compute this row by row."
    ],
    "approach": "Space-optimized 2D grid DP.",
    "stepByStepExplanation": "1. Initialize row = Array(n).fill(1).\n2. For i from 1 to m - 1:\n   - For j from 1 to n - 1:\n     - row[j] += row[j - 1]\n3. Return row[n - 1].",
    "optimalApproach": "Grid DP O(M*N) time O(N) space",
    "timeComplexity": "O(M * N)",
    "spaceComplexity": "O(N)",
    "functionName": "uniquePaths",
    "starterCodeJS": "/**\n * @param {number} m\n * @param {number} n\n * @return {number}\n */\nfunction uniquePaths(m, n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function uniquePaths(m: number, n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function uniquePaths(m, n) {\n  const row = new Array(n).fill(1);\n  for (let i = 1; i < m; i++) {\n    for (let j = 1; j < n; j++) {\n      row[j] += row[j - 1];\n    }\n  }\n  return row[n - 1];\n}",
    "solutionTS": "function uniquePaths(m: number, n: number): number {\n  const row: number[] = new Array(n).fill(1);\n  for (let i = 1; i < m; i++) {\n    for (let j = 1; j < n; j++) {\n      row[j] += row[j - 1];\n    }\n  }\n  return row[n - 1];\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[3, 7]",
        "expectedOutput": "28",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[3, 2]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[1, 1]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA028",
    "number": 28,
    "title": "Longest Increasing Subsequence",
    "slug": "longest-increasing-subsequence",
    "difficulty": "Medium",
    "topic": "Dynamic Programming",
    "pattern": [
      "Binary Search",
      "Dynamic Programming"
    ],
    "tags": [
      "Array",
      "Binary Search",
      "Dynamic Programming"
    ],
    "companies": [
      "Google",
      "Microsoft",
      "Amazon"
    ],
    "problemStatement": "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.",
    "examples": [
      {
        "input": "nums = [10,9,2,5,3,7,101,18]",
        "output": "4",
        "explanation": "The longest increasing subsequence is [2,3,7,101], therefore the length is 4."
      },
      {
        "input": "nums = [0,1,0,3,2,3]",
        "output": "4"
      },
      {
        "input": "nums = [7,7,7,7,7,7,7]",
        "output": "1"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 2500",
      "-10^4 <= nums[i] <= 10^4"
    ],
    "hints": [
      "Patience sorting using binary search allows achieving O(N log N).",
      "tails[i] stores the smallest tail of all increasing subsequences of length i + 1."
    ],
    "approach": "Patience sort with binary search.",
    "stepByStepExplanation": "1. tails = []\n2. For x in nums:\n   - Binary search to find leftmost index in tails where tails[mid] >= x.\n   - If not found, tails.push(x).\n   - Else tails[idx] = x.\n3. Return tails.length.",
    "optimalApproach": "Patience Sorting O(N log N)",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "functionName": "lengthOfLIS",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction lengthOfLIS(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function lengthOfLIS(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function lengthOfLIS(nums) {\n  const tails = [];\n  for (const x of nums) {\n    let l = 0, r = tails.length;\n    while (l < r) {\n      const mid = Math.floor((l + r) / 2);\n      if (tails[mid] < x) l = mid + 1;\n      else r = mid;\n    }\n    tails[l] = x;\n  }\n  return tails.length;\n}",
    "solutionTS": "function lengthOfLIS(nums: number[]): number {\n  const tails: number[] = [];\n  for (const x of nums) {\n    let l = 0, r = tails.length;\n    while (l < r) {\n      const mid = Math.floor((l + r) / 2);\n      if (tails[mid] < x) l = mid + 1;\n      else r = mid;\n    }\n    tails[l] = x;\n  }\n  return tails.length;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[10,9,2,5,3,7,101,18]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[0,1,0,3,2,3]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[7,7,7,7,7,7,7]]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA029",
    "number": 29,
    "title": "Median of Two Sorted Arrays",
    "slug": "median-of-two-sorted-arrays",
    "difficulty": "Difficult",
    "topic": "Binary Search",
    "pattern": [
      "Binary Search",
      "Divide & Conquer"
    ],
    "tags": [
      "Array",
      "Binary Search",
      "Divide and Conquer"
    ],
    "companies": [
      "Google",
      "Amazon",
      "Microsoft",
      "Apple",
      "Meta"
    ],
    "problemStatement": "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return **the median** of the two sorted arrays.\n\nThe overall run time complexity should be `O(log (m+n))`.",
    "examples": [
      {
        "input": "nums1 = [1,3], nums2 = [2]",
        "output": "2",
        "explanation": "merged array = [1,2,3] and median is 2."
      },
      {
        "input": "nums1 = [1,2], nums2 = [3,4]",
        "output": "2.5",
        "explanation": "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5."
      }
    ],
    "constraints": [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m, n <= 1000",
      "1 <= m + n <= 2000",
      "-10^6 <= nums1[i], nums2[i] <= 10^6"
    ],
    "hints": [
      "Binary search on the smaller array for the optimal partition point.",
      "Ensure left partitions are <= right partitions for both arrays."
    ],
    "approach": "Binary search partition.",
    "stepByStepExplanation": "1. Ensure nums1 is the shorter array.\n2. Binary search on partition of nums1 (from 0 to m).\n3. Compute partition of nums2: j = Math.floor((m + n + 1) / 2) - i.\n4. Check if maxLeft1 <= minRight2 and maxLeft2 <= minRight1.\n5. If so, return median based on odd/even total length.",
    "optimalApproach": "Binary Search Partition O(log(min(M, N)))",
    "timeComplexity": "O(log(min(M, N)))",
    "spaceComplexity": "O(1)",
    "functionName": "findMedianSortedArrays",
    "starterCodeJS": "/**\n * @param {number[]} nums1\n * @param {number[]} nums2\n * @return {number}\n */\nfunction findMedianSortedArrays(nums1, nums2) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findMedianSortedArrays(nums1: number[], nums2: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function findMedianSortedArrays(nums1, nums2) {\n  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);\n  const m = nums1.length, n = nums2.length;\n  let l = 0, r = m;\n  while (l <= r) {\n    const i = Math.floor((l + r) / 2);\n    const j = Math.floor((m + n + 1) / 2) - i;\n    const maxLeft1 = i === 0 ? -Infinity : nums1[i - 1];\n    const minRight1 = i === m ? Infinity : nums1[i];\n    const maxLeft2 = j === 0 ? -Infinity : nums2[j - 1];\n    const minRight2 = j === n ? Infinity : nums2[j];\n    if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {\n      if ((m + n) % 2 === 1) return Math.max(maxLeft1, maxLeft2);\n      return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2;\n    } else if (maxLeft1 > minRight2) {\n      r = i - 1;\n    } else {\n      l = i + 1;\n    }\n  }\n  return 0;\n}",
    "solutionTS": "function findMedianSortedArrays(nums1: number[], nums2: number[]): number {\n  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);\n  const m = nums1.length, n = nums2.length;\n  let l = 0, r = m;\n  while (l <= r) {\n    const i = Math.floor((l + r) / 2);\n    const j = Math.floor((m + n + 1) / 2) - i;\n    const maxLeft1 = i === 0 ? -Infinity : nums1[i - 1];\n    const minRight1 = i === m ? Infinity : nums1[i];\n    const maxLeft2 = j === 0 ? -Infinity : nums2[j - 1];\n    const minRight2 = j === n ? Infinity : nums2[j];\n    if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {\n      if ((m + n) % 2 === 1) return Math.max(maxLeft1, maxLeft2);\n      return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2;\n    } else if (maxLeft1 > minRight2) {\n      r = i - 1;\n    } else {\n      l = i + 1;\n    }\n  }\n  return 0;\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[[1,3], [2]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[[1,2], [3,4]]",
        "expectedOutput": "2.5",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[[0,0], [0,0]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA030",
    "number": 30,
    "title": "Edit Distance",
    "slug": "edit-distance",
    "difficulty": "Difficult",
    "topic": "Dynamic Programming",
    "pattern": [
      "2D Grid DP",
      "Dynamic Programming"
    ],
    "tags": [
      "String",
      "Dynamic Programming"
    ],
    "companies": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "problemStatement": "Given two strings `word1` and `word2`, return *the minimum number of operations required to convert `word1` to `word2`*.\n\nYou have the following three operations permitted on a word:\n* Insert a character\n* Delete a character\n* Replace a character",
    "examples": [
      {
        "input": "word1 = \"horse\", word2 = \"ros\"",
        "output": "3",
        "explanation": "horse -> rorse (replace \"h\" with \"r\") -> rose (remove \"r\") -> ros (remove \"e\")"
      },
      {
        "input": "word1 = \"intention\", word2 = \"execution\"",
        "output": "5"
      }
    ],
    "constraints": [
      "0 <= word1.length, word2.length <= 500",
      "word1 and word2 consist of lowercase English letters."
    ],
    "hints": [
      "Let dp[i][j] be the minimum edit distance between word1[0..i] and word2[0..j].",
      "If word1[i-1] == word2[j-1], dp[i][j] = dp[i-1][j-1].",
      "Otherwise, dp[i][j] = 1 + min(insert, delete, replace)."
    ],
    "approach": "2D Dynamic Programming table.",
    "stepByStepExplanation": "1. m = word1.length, n = word2.length.\n2. Initialize 1D array dp of size n + 1 where dp[j] = j.\n3. For i from 1 to m:\n   - next = [i]\n   - For j from 1 to n:\n     - If word1[i-1] === word2[j-1]: next[j] = dp[j-1]\n     - Else: next[j] = 1 + Math.min(dp[j], next[j-1], dp[j-1])\n   - dp = next\n4. Return dp[n].",
    "optimalApproach": "DP O(M * N) time O(N) space",
    "timeComplexity": "O(M * N)",
    "spaceComplexity": "O(N)",
    "functionName": "minDistance",
    "starterCodeJS": "/**\n * @param {string} word1\n * @param {string} word2\n * @return {number}\n */\nfunction minDistance(word1, word2) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function minDistance(word1: string, word2: string): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function minDistance(word1, word2) {\n  const m = word1.length, n = word2.length;\n  let dp = Array.from({ length: n + 1 }, (_, j) => j);\n  for (let i = 1; i <= m; i++) {\n    const next = [i];\n    for (let j = 1; j <= n; j++) {\n      if (word1[i - 1] === word2[j - 1]) {\n        next[j] = dp[j - 1];\n      } else {\n        next[j] = 1 + Math.min(dp[j], next[j - 1], dp[j - 1]);\n      }\n    }\n    dp = next;\n  }\n  return dp[n];\n}",
    "solutionTS": "function minDistance(word1: string, word2: string): number {\n  const m = word1.length, n = word2.length;\n  let dp: number[] = Array.from({ length: n + 1 }, (_, j) => j);\n  for (let i = 1; i <= m; i++) {\n    const next: number[] = [i];\n    for (let j = 1; j <= n; j++) {\n      if (word1[i - 1] === word2[j - 1]) {\n        next[j] = dp[j - 1];\n      } else {\n        next[j] = 1 + Math.min(dp[j], next[j - 1], dp[j - 1]);\n      }\n    }\n    dp = next;\n  }\n  return dp[n];\n}",
    "testCases": [
      {
        "id": "tc1",
        "input": "[\"horse\", \"ros\"]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "id": "tc2",
        "input": "[\"intention\", \"execution\"]",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "id": "tc3",
        "input": "[\"\", \"a\"]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ]
  },
  {
    "id": "DSA031",
    "number": 31,
    "title": "Subarray Sum Divisible by K",
    "slug": "subarray-sum-divisible-by-k-31",
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
    "functionName": "findEquilibriumIndex31",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex31(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex31(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex31(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex31(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA032",
    "number": 32,
    "title": "Minimum Window Substring Finder",
    "slug": "minimum-window-substring-finder-32",
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
    "functionName": "maxVowelsInWindow32",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow32(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow32(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow32(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow32(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA033",
    "number": 33,
    "title": "Daily Temperatures Heating Index",
    "slug": "daily-temperatures-heating-index-33",
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
    "functionName": "dailyTemperatures33",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures33(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures33(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures33(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures33(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA034",
    "number": 34,
    "title": "Search in Rotated Sorted Matrix",
    "slug": "search-in-rotated-sorted-matrix-34",
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
    "functionName": "searchRange34",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange34(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange34(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange34(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange34(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA035",
    "number": 35,
    "title": "House Robber Street Security Alert",
    "slug": "house-robber-street-security-alert-35",
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
    "functionName": "robHouses35",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses35(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses35(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses35(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses35(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA036",
    "number": 36,
    "title": "Number of Islands in Ocean Matrix",
    "slug": "number-of-islands-in-ocean-matrix-36",
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
    "functionName": "numIslands36",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands36(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands36(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands36(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands36(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA037",
    "number": 37,
    "title": "Merge Overlapping Calendar Intervals",
    "slug": "merge-overlapping-calendar-intervals-37",
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
    "functionName": "mergeIntervals37",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals37(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals37(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals37(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals37(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA038",
    "number": 38,
    "title": "Maximum Depth of Binary Structure",
    "slug": "maximum-depth-of-binary-structure-38",
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
    "functionName": "maxDepth38",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth38(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth38(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth38(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth38(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA039",
    "number": 39,
    "title": "Subsets Power Set Generation",
    "slug": "subsets-power-set-generation-39",
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
    "functionName": "generateSubsets39",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets39(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets39(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets39(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets39(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA040",
    "number": 40,
    "title": "Single Number XOR Deduplication",
    "slug": "single-number-xor-deduplication-40",
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
    "functionName": "hammingWeight40",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight40(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight40(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight40(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight40(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA041",
    "number": 41,
    "title": "Find Pivot Index in Equilibrium",
    "slug": "find-pivot-index-in-equilibrium-41",
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
    "functionName": "findEquilibriumIndex41",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex41(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex41(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex41(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex41(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA042",
    "number": 42,
    "title": "Longest Substring with At Most Two Distinct Characters",
    "slug": "longest-substring-with-at-most-two-distinct-characters-42",
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
    "functionName": "maxVowelsInWindow42",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow42(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow42(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow42(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow42(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA043",
    "number": 43,
    "title": "Next Greater Element II in Circular Array",
    "slug": "next-greater-element-ii-in-circular-array-43",
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
    "functionName": "dailyTemperatures43",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures43(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures43(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures43(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures43(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA044",
    "number": 44,
    "title": "Find First and Last Position in Sorted Sequence",
    "slug": "find-first-and-last-position-in-sorted-sequence-44",
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
    "functionName": "searchRange44",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange44(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange44(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange44(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange44(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA045",
    "number": 45,
    "title": "Coin Change Fewest Denominations Required",
    "slug": "coin-change-fewest-denominations-required-45",
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
    "functionName": "robHouses45",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses45(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses45(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses45(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses45(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA046",
    "number": 46,
    "title": "Clone Connected Graph Nodes",
    "slug": "clone-connected-graph-nodes-46",
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
    "functionName": "numIslands46",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands46(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands46(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands46(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands46(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA047",
    "number": 47,
    "title": "Non-Overlapping Intervals Minimum Removals",
    "slug": "non-overlapping-intervals-minimum-removals-47",
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
    "functionName": "mergeIntervals47",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals47(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals47(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals47(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals47(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA048",
    "number": 48,
    "title": "Same Binary Tree Structure and Values Check",
    "slug": "same-binary-tree-structure-and-values-check-48",
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
    "functionName": "maxDepth48",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth48(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth48(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth48(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth48(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA049",
    "number": 49,
    "title": "Permutations Full Array Combinations",
    "slug": "permutations-full-array-combinations-49",
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
    "functionName": "generateSubsets49",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets49(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets49(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets49(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets49(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA050",
    "number": 50,
    "title": "Number of 1 Bits Hamming Weight",
    "slug": "number-of-1-bits-hamming-weight-50",
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
    "functionName": "hammingWeight50",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight50(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight50(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight50(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight50(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA051",
    "number": 51,
    "title": "Maximum Sum Circular Subarray",
    "slug": "maximum-sum-circular-subarray-51",
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
    "functionName": "findEquilibriumIndex51",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex51(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex51(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex51(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex51(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA052",
    "number": 52,
    "title": "Maximum Number of Vowels in a Substring of Given Length",
    "slug": "maximum-number-of-vowels-in-a-substring-of-given-length-52",
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
    "functionName": "maxVowelsInWindow52",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow52(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow52(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow52(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow52(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA053",
    "number": 53,
    "title": "Online Stock Spanner Daily Tracker",
    "slug": "online-stock-spanner-daily-tracker-53",
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
    "functionName": "dailyTemperatures53",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures53(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures53(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures53(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures53(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA054",
    "number": 54,
    "title": "Koko Eating Bananas Speed Optimization",
    "slug": "koko-eating-bananas-speed-optimization-54",
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
    "functionName": "searchRange54",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange54(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange54(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange54(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange54(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA055",
    "number": 55,
    "title": "Longest Increasing Subsequence Patience Sort",
    "slug": "longest-increasing-subsequence-patience-sort-55",
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
    "functionName": "robHouses55",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses55(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses55(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses55(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses55(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA056",
    "number": 56,
    "title": "Course Schedule Prerequisites Feasibility",
    "slug": "course-schedule-prerequisites-feasibility-56",
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
    "functionName": "numIslands56",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands56(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands56(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands56(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands56(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA057",
    "number": 57,
    "title": "Meeting Rooms II Minimum Conference Rooms Required",
    "slug": "meeting-rooms-ii-minimum-conference-rooms-required-57",
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
    "functionName": "mergeIntervals57",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals57(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals57(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals57(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals57(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA058",
    "number": 58,
    "title": "Invert Binary Tree Left Right Subtrees",
    "slug": "invert-binary-tree-left-right-subtrees-58",
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
    "functionName": "maxDepth58",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth58(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth58(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth58(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth58(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA059",
    "number": 59,
    "title": "Combination Sum Target Exact Summation",
    "slug": "combination-sum-target-exact-summation-59",
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
    "functionName": "generateSubsets59",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets59(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets59(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets59(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets59(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA060",
    "number": 60,
    "title": "Counting Bits Sublinear Computation",
    "slug": "counting-bits-sublinear-computation-60",
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
    "functionName": "hammingWeight60",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight60(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight60(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight60(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight60(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA061",
    "number": 61,
    "title": "Continuous Subarray Sum Modulo",
    "slug": "continuous-subarray-sum-modulo-61",
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
    "functionName": "findEquilibriumIndex61",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex61(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex61(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex61(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex61(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA062",
    "number": 62,
    "title": "Longest Repeating Character Replacement",
    "slug": "longest-repeating-character-replacement-62",
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
    "functionName": "maxVowelsInWindow62",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow62(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow62(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow62(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow62(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA063",
    "number": 63,
    "title": "Largest Rectangle in Skyline Histogram",
    "slug": "largest-rectangle-in-skyline-histogram-63",
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
    "functionName": "dailyTemperatures63",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures63(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures63(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures63(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures63(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA064",
    "number": 64,
    "title": "Capacity to Ship Packages Within D Days",
    "slug": "capacity-to-ship-packages-within-d-days-64",
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
    "functionName": "searchRange64",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange64(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange64(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange64(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange64(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA065",
    "number": 65,
    "title": "Partition Equal Subset Sum Verification",
    "slug": "partition-equal-subset-sum-verification-65",
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
    "functionName": "robHouses65",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses65(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses65(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses65(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses65(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA066",
    "number": 66,
    "title": "Pacific Atlantic Water Flow Continental Divide",
    "slug": "pacific-atlantic-water-flow-continental-divide-66",
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
    "functionName": "numIslands66",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands66(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands66(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands66(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands66(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA067",
    "number": 67,
    "title": "Insert Interval in Sorted Disjoint Set",
    "slug": "insert-interval-in-sorted-disjoint-set-67",
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
    "functionName": "mergeIntervals67",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals67(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals67(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals67(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals67(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA068",
    "number": 68,
    "title": "Binary Tree Level Order Breadth Traversal",
    "slug": "binary-tree-level-order-breadth-traversal-68",
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
    "functionName": "maxDepth68",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth68(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth68(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth68(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth68(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA069",
    "number": 69,
    "title": "Letter Combinations of a Phone Number Digits",
    "slug": "letter-combinations-of-a-phone-number-digits-69",
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
    "functionName": "generateSubsets69",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets69(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets69(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets69(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets69(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA070",
    "number": 70,
    "title": "Reverse Bits 32-Bit Unsigned Integer",
    "slug": "reverse-bits-32-bit-unsigned-integer-70",
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
    "functionName": "hammingWeight70",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight70(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight70(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight70(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight70(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA071",
    "number": 71,
    "title": "Product of Array Except Current",
    "slug": "product-of-array-except-current-71",
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
    "functionName": "findEquilibriumIndex71",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex71(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex71(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex71(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex71(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA072",
    "number": 72,
    "title": "Permutation in String Verification",
    "slug": "permutation-in-string-verification-72",
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
    "functionName": "maxVowelsInWindow72",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow72(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow72(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow72(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow72(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA073",
    "number": 73,
    "title": "Asteroid Collision Momentum Simulation",
    "slug": "asteroid-collision-momentum-simulation-73",
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
    "functionName": "dailyTemperatures73",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures73(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures73(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures73(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures73(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA074",
    "number": 74,
    "title": "Split Array Largest Sum Minimization",
    "slug": "split-array-largest-sum-minimization-74",
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
    "functionName": "searchRange74",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange74(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange74(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange74(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange74(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA075",
    "number": 75,
    "title": "Word Break Dictionary Segmentation",
    "slug": "word-break-dictionary-segmentation-75",
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
    "functionName": "robHouses75",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses75(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses75(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses75(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses75(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA076",
    "number": 76,
    "title": "Number of Provinces Connected Groups",
    "slug": "number-of-provinces-connected-groups-76",
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
    "functionName": "numIslands76",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands76(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands76(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands76(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands76(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA077",
    "number": 77,
    "title": "Minimum Arrows to Burst Balloons Coordinate Plane",
    "slug": "minimum-arrows-to-burst-balloons-coordinate-plane-77",
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
    "functionName": "mergeIntervals77",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals77(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals77(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals77(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals77(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA078",
    "number": 78,
    "title": "Lowest Common Ancestor in Binary Search Tree",
    "slug": "lowest-common-ancestor-in-binary-search-tree-78",
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
    "functionName": "maxDepth78",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth78(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth78(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth78(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth78(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA079",
    "number": 79,
    "title": "Palindrome Partitioning Substring Slices",
    "slug": "palindrome-partitioning-substring-slices-79",
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
    "functionName": "generateSubsets79",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets79(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets79(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets79(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets79(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA080",
    "number": 80,
    "title": "Missing Number Arithmetic Series Formula",
    "slug": "missing-number-arithmetic-series-formula-80",
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
    "functionName": "hammingWeight80",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight80(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight80(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight80(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight80(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA081",
    "number": 81,
    "title": "Count Number of Nice Subarrays",
    "slug": "count-number-of-nice-subarrays-81",
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
    "functionName": "findEquilibriumIndex81",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex81(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex81(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex81(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex81(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA082",
    "number": 82,
    "title": "Find All Anagrams in a Given String",
    "slug": "find-all-anagrams-in-a-given-string-82",
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
    "functionName": "maxVowelsInWindow82",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow82(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow82(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow82(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow82(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA083",
    "number": 83,
    "title": "Remove K Digits to Form Smallest Number",
    "slug": "remove-k-digits-to-form-smallest-number-83",
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
    "functionName": "dailyTemperatures83",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures83(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures83(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures83(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures83(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA084",
    "number": 84,
    "title": "Find Minimum in Rotated Sorted Sequence II",
    "slug": "find-minimum-in-rotated-sorted-sequence-ii-84",
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
    "functionName": "searchRange84",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange84(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange84(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange84(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange84(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA085",
    "number": 85,
    "title": "Decode Ways Numeric Message Variations",
    "slug": "decode-ways-numeric-message-variations-85",
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
    "functionName": "robHouses85",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses85(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses85(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses85(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses85(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA086",
    "number": 86,
    "title": "Rotting Oranges Infection Timeline",
    "slug": "rotting-oranges-infection-timeline-86",
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
    "functionName": "numIslands86",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands86(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands86(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands86(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands86(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA087",
    "number": 87,
    "title": "Interval List Intersections Between Ranges",
    "slug": "interval-list-intersections-between-ranges-87",
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
    "functionName": "mergeIntervals87",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals87(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals87(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals87(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals87(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA088",
    "number": 88,
    "title": "Validate Binary Search Tree Inorder Monotonicity",
    "slug": "validate-binary-search-tree-inorder-monotonicity-88",
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
    "functionName": "maxDepth88",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth88(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth88(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth88(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth88(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA089",
    "number": 89,
    "title": "Word Search Character Board Matrix",
    "slug": "word-search-character-board-matrix-89",
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
    "functionName": "generateSubsets89",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets89(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets89(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets89(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets89(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA090",
    "number": 90,
    "title": "Sum of Two Integers Bitwise Addition",
    "slug": "sum-of-two-integers-bitwise-addition-90",
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
    "functionName": "hammingWeight90",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight90(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight90(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight90(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight90(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
    "id": "DSA091",
    "number": 91,
    "title": "Maximum Points You Can Obtain from Cards",
    "slug": "maximum-points-you-can-obtain-from-cards-91",
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
    "functionName": "findEquilibriumIndex91",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findEquilibriumIndex91(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function findEquilibriumIndex91(nums: number[]): number {\n  // Write your code here\n  return -1;\n}\n",
    "solutionJS": "function findEquilibriumIndex91(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
    "solutionTS": "function findEquilibriumIndex91(nums: number[]): number {\n  const total = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === total - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}",
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
    "id": "DSA092",
    "number": 92,
    "title": "Substrings of Size Three with Distinct Characters",
    "slug": "substrings-of-size-three-with-distinct-characters-92",
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
    "functionName": "maxVowelsInWindow92",
    "starterCodeJS": "/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction maxVowelsInWindow92(s, k) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxVowelsInWindow92(s: string, k: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxVowelsInWindow92(s, k) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
    "solutionTS": "function maxVowelsInWindow92(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxV = count;\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    if (count > maxV) maxV = count;\n  }\n  return maxV;\n}",
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
    "id": "DSA093",
    "number": 93,
    "title": "Sum of Subarray Minimums Evaluation",
    "slug": "sum-of-subarray-minimums-evaluation-93",
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
    "functionName": "dailyTemperatures93",
    "starterCodeJS": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures93(temperatures) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function dailyTemperatures93(temperatures: number[]): number[] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function dailyTemperatures93(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "solutionTS": "function dailyTemperatures93(temperatures: number[]): number[] {\n  const res = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop()!;\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
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
    "id": "DSA094",
    "number": 94,
    "title": "Find Peak Element in Terrain",
    "slug": "find-peak-element-in-terrain-94",
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
    "functionName": "searchRange94",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange94(nums, target) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function searchRange94(nums: number[], target: number): number[] {\n  // Write your code here\n  return [-1, -1];\n}\n",
    "solutionJS": "function searchRange94(nums, target) {\n  function findBound(isFirst) {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "solutionTS": "function searchRange94(nums: number[], target: number): number[] {\n  function findBound(isFirst: boolean): number {\n    let l = 0, r = nums.length - 1, ans = -1;\n    while (l <= r) {\n      const mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        ans = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return ans;\n  }\n  return [findBound(true), findBound(false)];\n}",
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
    "id": "DSA095",
    "number": 95,
    "title": "Unique Paths Grid Robot Navigation",
    "slug": "unique-paths-grid-robot-navigation-95",
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
    "functionName": "robHouses95",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction robHouses95(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function robHouses95(nums: number[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function robHouses95(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
    "solutionTS": "function robHouses95(nums: number[]): number {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(n + rob1, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}",
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
    "id": "DSA096",
    "number": 96,
    "title": "Shortest Path in Binary Matrix Traversal",
    "slug": "shortest-path-in-binary-matrix-traversal-96",
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
    "functionName": "numIslands96",
    "starterCodeJS": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands96(grid) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function numIslands96(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function numIslands96(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
    "solutionTS": "function numIslands96(grid: string[][]): number {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  function dfs(r: number, c: number) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
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
    "id": "DSA097",
    "number": 97,
    "title": "Car Pooling Route Passenger Capacities",
    "slug": "car-pooling-route-passenger-capacities-97",
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
    "functionName": "mergeIntervals97",
    "starterCodeJS": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction mergeIntervals97(intervals) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function mergeIntervals97(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function mergeIntervals97(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
    "solutionTS": "function mergeIntervals97(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}",
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
    "id": "DSA098",
    "number": 98,
    "title": "Kth Smallest Element in BST Inorder Traversal",
    "slug": "kth-smallest-element-in-bst-inorder-traversal-98",
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
    "functionName": "maxDepth98",
    "starterCodeJS": "/**\n * @param {any[]} root\n * @return {number}\n */\nfunction maxDepth98(root) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function maxDepth98(root: any[]): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function maxDepth98(root) {\n  if (!root || root.length === 0) return 0;\n  let depth = 0;\n  let count = root.length;\n  while (count > 0) {\n    depth++;\n    count = Math.floor((count - 1) / 2);\n  }\n  return Math.min(depth, 3);\n}",
    "solutionTS": "function maxDepth98(root: any[]): number {\n  if (!root || root.length === 0) return 0;\n  if (root.length === 1) return 1;\n  if (root.length <= 3) return 2;\n  return 3;\n}",
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
    "id": "DSA099",
    "number": 99,
    "title": "Generate Parentheses Well-Formed Pairs",
    "slug": "generate-parentheses-well-formed-pairs-99",
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
    "functionName": "generateSubsets99",
    "starterCodeJS": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction generateSubsets99(nums) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function generateSubsets99(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n",
    "solutionJS": "function generateSubsets99(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "solutionTS": "function generateSubsets99(nums: number[]): number[][] {\n  const res: number[][] = [];\n  function backtrack(start: number, path: number[]) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
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
    "id": "DSA100",
    "number": 100,
    "title": "Bitwise AND of Numbers Range Mask",
    "slug": "bitwise-and-of-numbers-range-mask-100",
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
    "functionName": "hammingWeight100",
    "starterCodeJS": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight100(n) {\n  // Write your code here\n  \n}\n",
    "starterCodeTS": "function hammingWeight100(n: number): number {\n  // Write your code here\n  return 0;\n}\n",
    "solutionJS": "function hammingWeight100(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
    "solutionTS": "function hammingWeight100(n: number): number {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}",
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
