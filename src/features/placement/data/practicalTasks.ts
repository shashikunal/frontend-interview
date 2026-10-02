export interface PracticalTask {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  requirements: string[]
  starterCode: string
  expectedOutput: string
  hints: string[]
  timeLimit: number
}

export const PRACTICAL_TASKS: PracticalTask[] = [
  {
    id: 'practical-debounce',
    title: 'Implement Debounce Function',
    description: 'Create a debounce function that delays invoking a function until after a specified wait time has elapsed since the last invocation.',
    difficulty: 'easy',
    category: 'javascript',
    requirements: [
      'Function should accept a function and delay time',
      'Should return a new function that delays execution',
      'Should cancel previous pending executions',
      'Should pass through arguments',
    ],
    starterCode: `function debounce(func, wait) {
  // Your code here
}

// Test
const debounced = debounce(() => console.log('Hello'), 1000);
debounced();
debounced();
debounced();`,
    expectedOutput: 'Hello (printed once after 1 second)',
    hints: ['Use setTimeout', 'Clear previous timeout with clearTimeout', 'Use closure to store timeout ID'],
    timeLimit: 15,
  },
  {
    id: 'practical-throttle',
    title: 'Implement Throttle Function',
    description: 'Create a throttle function that ensures a function is called at most once per specified time period.',
    difficulty: 'easy',
    category: 'javascript',
    requirements: [
      'Function should accept a function and limit time',
      'Should return a new function that throttles execution',
      'Should execute immediately on first call',
      'Should ignore calls within the limit period',
    ],
    starterCode: `function throttle(func, limit) {
  // Your code here
}

// Test
const throttled = throttle(() => console.log('Tick'), 1000);
throttled();
throttled();
throttled();`,
    expectedOutput: 'Tick (printed once immediately)',
    hints: ['Track last execution time', 'Compare current time with last execution', 'Use Date.now()'],
    timeLimit: 15,
  },
  {
    id: 'practical-promise-all',
    title: 'Implement Promise.all',
    description: 'Create a function that takes an array of promises and returns a single promise that resolves when all promises resolve.',
    difficulty: 'medium',
    category: 'javascript',
    requirements: [
      'Should accept an array of promises',
      'Should return a promise that resolves with array of results',
      'Should reject if any promise rejects',
      'Should handle empty array',
    ],
    starterCode: `function promiseAll(promises) {
  // Your code here
}

// Test
promiseAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
]).then(console.log);`,
    expectedOutput: '[1, 2, 3]',
    hints: ['Use a counter to track completions', 'Store results in array', 'Reject immediately on first error'],
    timeLimit: 20,
  },
  {
    id: 'practical-array-flatten',
    title: 'Implement Array Flatten',
    description: 'Create a function that flattens a nested array to a specified depth.',
    difficulty: 'easy',
    category: 'javascript',
    requirements: [
      'Should accept an array and depth parameter',
      'Should flatten nested arrays to the specified depth',
      'Should handle edge cases (empty arrays, non-array elements)',
      'Should not mutate the original array',
    ],
    starterCode: `function flatten(arr, depth = 1) {
  // Your code here
}

// Test
console.log(flatten([1, [2, [3, [4]]]], 2));`,
    expectedOutput: '[1, 2, 3, [4]]',
    hints: ['Use recursion', 'Check if element is an array', 'Use depth parameter to control recursion'],
    timeLimit: 15,
  },
  {
    id: 'practical-event-emitter',
    title: 'Implement Event Emitter',
    description: 'Create a simple event emitter class with on, off, and emit methods.',
    difficulty: 'medium',
    category: 'javascript',
    requirements: [
      'Should have on(event, listener) method',
      'Should have off(event, listener) method',
      'Should have emit(event, ...args) method',
      'Should support multiple listeners per event',
    ],
    starterCode: `class EventEmitter {
  // Your code here
}

// Test
const emitter = new EventEmitter();
emitter.on('test', (msg) => console.log(msg));
emitter.emit('test', 'Hello');`,
    expectedOutput: 'Hello',
    hints: ['Use a Map or object to store listeners', 'Store listeners in arrays', 'Use apply or spread for emit'],
    timeLimit: 20,
  },
  {
    id: 'practical-localstorage',
    title: 'Implement localStorage Wrapper',
    description: 'Create a wrapper around localStorage with JSON serialization, error handling, and expiration.',
    difficulty: 'easy',
    category: 'javascript',
    requirements: [
      'Should set items with JSON serialization',
      'Should get items with JSON parsing',
      'Should handle errors gracefully',
      'Should support expiration time',
    ],
    starterCode: `const storage = {
  set(key, value, ttl) {
    // Your code here
  },
  get(key) {
    // Your code here
  },
  remove(key) {
    // Your code here
  }
};`,
    expectedOutput: 'Values stored and retrieved correctly',
    hints: ['Use JSON.stringify and JSON.parse', 'Store timestamp for expiration', 'Wrap in try/catch'],
    timeLimit: 15,
  },
  {
    id: 'practical-infinite-scroll',
    title: 'Implement Infinite Scroll',
    description: 'Create a React component that loads more data when the user scrolls to the bottom.',
    difficulty: 'medium',
    category: 'react',
    requirements: [
      'Should detect when user scrolls to bottom',
      'Should load more data automatically',
      'Should show loading indicator',
      'Should handle errors',
    ],
    starterCode: `function InfiniteScroll({ fetchData }) {
  // Your code here
}`,
    expectedOutput: 'New data loads when scrolling to bottom',
    hints: ['Use IntersectionObserver or scroll event', 'Track loading state', 'Append new data to existing data'],
    timeLimit: 30,
  },
  {
    id: 'practical-form-validation',
    title: 'Implement Form Validation',
    description: 'Create a React form with validation for email, password, and confirm password fields.',
    difficulty: 'medium',
    category: 'react',
    requirements: [
      'Should validate email format',
      'Should validate password strength',
      'Should validate password confirmation match',
      'Should show error messages',
    ],
    starterCode: `function RegistrationForm() {
  // Your code here
}`,
    expectedOutput: 'Form validates and shows appropriate errors',
    hints: ['Use controlled components', 'Validate on blur and submit', 'Show errors below fields'],
    timeLimit: 30,
  },
]

export function getPracticalTask(id: string): PracticalTask | undefined {
  return PRACTICAL_TASKS.find((t) => t.id === id)
}

export function getPracticalTasksByCategory(category: string): PracticalTask[] {
  return PRACTICAL_TASKS.filter((t) => t.category === category)
}
