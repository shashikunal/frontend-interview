export interface ProgrammingProblem {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  examples: { input: string; output: string }[]
  constraints: string[]
  starterCode: string
  solution: string
  hints: string[]
  timeComplexity: string
  spaceComplexity: string
}

export const PROGRAMMING_PROBLEMS: ProgrammingProblem[] = [
  {
    id: 'prog-reverse-string',
    title: 'Reverse a String',
    description: 'Write a function that reverses a string without using the built-in reverse method.',
    difficulty: 'easy',
    category: 'strings',
    examples: [
      { input: '"hello"', output: '"olleh"' },
      { input: '"world"', output: '"dlrow"' },
    ],
    constraints: ['Do not use String.prototype.reverse', 'Do not use built-in reverse methods'],
    starterCode: `function reverseString(str) {
  // Your code here
}`,
    solution: `function reverseString(str) {
  let result = '';
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  return result;
}`,
    hints: ['Use a loop from end to start', 'Build result string character by character', 'Consider using split, reverse, join'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
  },
  {
    id: 'prog-palindrome',
    title: 'Check Palindrome',
    description: 'Write a function that checks if a string is a palindrome (reads the same forwards and backwards).',
    difficulty: 'easy',
    category: 'strings',
    examples: [
      { input: '"racecar"', output: 'true' },
      { input: '"hello"', output: 'false"' },
    ],
    constraints: ['Ignore case', 'Ignore non-alphanumeric characters'],
    starterCode: `function isPalindrome(str) {
  // Your code here
}`,
    solution: `function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}`,
    hints: ['Clean the string first', 'Compare with reversed version', 'Use two pointers approach'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
  },
  {
    id: 'prog-two-sum',
    title: 'Two Sum',
    description: 'Given an array of integers and a target, return indices of two numbers that add up to target.',
    difficulty: 'easy',
    category: 'arrays',
    examples: [
      { input: '[2, 7, 11, 15], 9', output: '[0, 1]' },
      { input: '[3, 2, 4], 6', output: '[1, 2]' },
    ],
    constraints: ['Each input has exactly one solution', 'Cannot use same element twice'],
    starterCode: `function twoSum(nums, target) {
  // Your code here
}`,
    solution: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
}`,
    hints: ['Use a hash map for O(1) lookups', 'Store value as key and index as value', 'Check for complement before adding'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
  },
  {
    id: 'prog-max-subarray',
    title: 'Maximum Subarray Sum',
    description: 'Find the contiguous subarray with the largest sum and return its sum.',
    difficulty: 'medium',
    category: 'arrays',
    examples: [
      { input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6' },
      { input: '[1]', output: '1' },
    ],
    constraints: ['Array contains at least one number', 'Subarray must be contiguous'],
    starterCode: `function maxSubArray(nums) {
  // Your code here
}`,
    solution: `function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
    hints: ['Use Kadane\'s algorithm', 'Track current sum and max sum', 'Reset current sum if it becomes negative'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
  },
  {
    id: 'prog-fizzbuzz',
    title: 'FizzBuzz',
    description: 'Print numbers from 1 to n, but for multiples of 3 print "Fizz", for multiples of 5 print "Buzz", and for multiples of both print "FizzBuzz".',
    difficulty: 'easy',
    category: 'logic',
    examples: [
      { input: '15', output: '1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz' },
    ],
    constraints: ['Return an array of strings', 'Numbers as strings except for Fizz/Buzz cases'],
    starterCode: `function fizzBuzz(n) {
  // Your code here
}`,
    solution: `function fizzBuzz(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) result.push('FizzBuzz');
    else if (i % 3 === 0) result.push('Fizz');
    else if (i % 5 === 0) result.push('Buzz');
    else result.push(String(i));
  }
  return result;
}`,
    hints: ['Check for 15 first (both 3 and 5)', 'Use modulo operator', 'Build result array'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
  },
  {
    id: 'prog-anagram',
    title: 'Valid Anagram',
    description: 'Given two strings, determine if they are anagrams of each other.',
    difficulty: 'easy',
    category: 'strings',
    examples: [
      { input: '"anagram", "nagaram"', output: 'true' },
      { input: '"rat", "car"', output: 'false"' },
    ],
    constraints: ['Strings contain only lowercase letters', 'Same length for valid anagrams'],
    starterCode: `function isAnagram(s, t) {
  // Your code here
}`,
    solution: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (const char of s) {
    count[char] = (count[char] || 0) + 1;
  }
  for (const char of t) {
    if (!count[char]) return false;
    count[char]--;
  }
  return true;
}`,
    hints: ['Check length first', 'Use a frequency map', 'Count characters in both strings'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
  },
  {
    id: 'prog-binary-search',
    title: 'Binary Search',
    description: 'Implement binary search on a sorted array. Return the index of the target or -1 if not found.',
    difficulty: 'easy',
    category: 'searching',
    examples: [
      { input: '[-1, 0, 3, 5, 9, 12], 9', output: '4' },
      { input: '[-1, 0, 3, 5, 9, 12], 2', output: '-1' },
    ],
    constraints: ['Array is sorted in ascending order', 'O(log n) time complexity required'],
    starterCode: `function binarySearch(nums, target) {
  // Your code here
}`,
    solution: `function binarySearch(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    hints: ['Use two pointers', 'Calculate mid point', 'Adjust pointers based on comparison'],
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
  },
  {
    id: 'prog-linked-list-cycle',
    title: 'Linked List Cycle Detection',
    description: 'Determine if a linked list has a cycle using Floyd\'s algorithm.',
    difficulty: 'medium',
    category: 'linked-list',
    examples: [
      { input: '[3, 2, 0, -4], pos = 1', output: 'true' },
      { input: '[1, 2], pos = 0', output: 'true' },
    ],
    constraints: ['Use O(1) space', 'Do not modify the linked list'],
    starterCode: `function hasCycle(head) {
  // Your code here
}`,
    solution: `function hasCycle(head) {
  if (!head || !head.next) return false;
  let slow = head;
  let fast = head.next;
  while (slow !== fast) {
    if (!fast || !fast.next) return false;
    slow = slow.next;
    fast = fast.next.next;
  }
  return true;
}`,
    hints: ['Use two pointers (slow and fast)', 'Fast moves twice as slow', 'If they meet, there is a cycle'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
  },
  {
    id: 'prog-stack-implementation',
    title: 'Implement Stack',
    description: 'Implement a stack with push, pop, peek, and isEmpty operations.',
    difficulty: 'easy',
    category: 'data-structures',
    examples: [
      { input: 'push(1), push(2), pop(), peek()', output: '2, 1' },
    ],
    constraints: ['All operations should be O(1)', 'Handle empty stack cases'],
    starterCode: `class Stack {
  // Your code here
}`,
    solution: `class Stack {
  constructor() {
    this.items = [];
  }
  push(item) {
    this.items.push(item);
  }
  pop() {
    if (this.isEmpty()) return undefined;
    return this.items.pop();
  }
  peek() {
    if (this.isEmpty()) return undefined;
    return this.items[this.items.length - 1];
  }
  isEmpty() {
    return this.items.length === 0;
  }
}`,
    hints: ['Use an array internally', 'push/pop from end of array', 'Check isEmpty before pop/peek'],
    timeComplexity: 'O(1) for all operations',
    spaceComplexity: 'O(n)',
  },
]

export function getProgrammingProblem(id: string): ProgrammingProblem | undefined {
  return PROGRAMMING_PROBLEMS.find((p) => p.id === id)
}

export function getProgrammingProblemsByCategory(category: string): ProgrammingProblem[] {
  return PROGRAMMING_PROBLEMS.filter((p) => p.category === category)
}

export function getProgrammingProblemsByDifficulty(difficulty: string): ProgrammingProblem[] {
  return PROGRAMMING_PROBLEMS.filter((p) => p.difficulty === difficulty)
}
