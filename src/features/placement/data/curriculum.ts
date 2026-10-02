import type {
  PlacementCategory,
  PlacementDay,
  PlacementProgram,
  PlacementTopic,
} from '../types/placement.types'

/**
 * 30-day fresher placement curriculum.
 *
 * This file is the single source of truth for curriculum wording. The
 * placement_days / placement_topics Supabase tables are a synced projection so
 * admins can manage and report on the curriculum; the app reads this file and
 * falls back to it whenever the database projection is unavailable.
 */

export const PLACEMENT_PROGRAM: PlacementProgram = {
  id: 'placement-30-day',
  slug: '30-day-fresher-placement',
  name: '40-Day Fresher Placement Program',
  description:
    'A focused 40-day system that takes a fresher from interview-ready to actively applying, interviewing, learning from rejections and getting selected. Days 1-30 cover technical depth. Days 31-40 focus on startup interview preparation, product thinking, and application strategy. Targets Bengaluru startups, product and service companies for Frontend, Frontend + Java, Frontend + Python, Junior Software Engineer and Junior Full Stack roles.',
  durationDays: 40,
  targetRoles: [
    'Frontend Developer',
    'Frontend + Java Developer',
    'Frontend + Python Developer',
    'Junior Software Engineer',
    'Junior Full Stack Developer',
  ],
  targetRegions: ['Bengaluru', 'Remote India'],
  status: 'active',
}

export interface PlacementDayDefinition {
  dayNumber: number
  phase: string
  title: string
  focus: string
  description: string
  goals: string[]
  isMilestone: boolean
  topics: {
    name: string
    category: PlacementCategory
    subcategory: string
    description: string
    resourceRoute: string
    expectedMinutes: number
  }[]
}

export const PLACEMENT_DAY_DEFINITIONS: PlacementDayDefinition[] = [
  {
    dayNumber: 1,
    phase: 'Foundation',
    title: 'JavaScript fundamentals & baseline assessment',
    focus: 'Establish the JavaScript baseline and record where you actually stand.',
    description:
      'Start with a baseline diagnostic so every later score is measured against real data, not guesswork. Then cover execution context, scope and the type system.',
    goals: [
      'Complete the placement baseline diagnostic',
      'Understand var / let / const and block scope',
      'Predict output for 10 scope + hoisting questions',
    ],
    isMilestone: true,
    topics: [
      { name: 'Baseline diagnostic', category: 'technical_mcq', subcategory: 'javascript', description: 'Untimed diagnostic across aptitude, JS, HTML, CSS and reasoning used only to set your starting scores.', resourceRoute: '/placement?view=assessments', expectedMinutes: 30 },
      { name: 'var / let / const and scope', category: 'technical_mcq', subcategory: 'javascript', description: 'Function scope vs block scope, temporal dead zone, redeclaration rules.', resourceRoute: '/interview-questions/javascript', expectedMinutes: 45 },
      { name: 'Hoisting and execution context', category: 'technical_mcq', subcategory: 'javascript', description: 'How declarations, functions and classes are hoisted, and why output prediction depends on it.', resourceRoute: '/interview-questions/javascript', expectedMinutes: 45 },
      { name: 'JS output drill', category: 'dsa', subcategory: 'javascript-fundamentals', description: '10 output-prediction questions scored and explained.', resourceRoute: '/placement?view=practice', expectedMinutes: 30 },
    ],
  },
  {
    dayNumber: 2,
    phase: 'Foundation',
    title: 'Programming fundamentals, arrays and strings',
    focus: 'Array and string manipulation without frameworks.',
    description:
      'Fresher interviews always include array and string warm-ups. Practice them as patterns, not as one-off puzzles.',
    goals: [
      'Solve 5 array problems using loops, maps and in-place techniques',
      'Solve 3 string problems (reverse, palindrome, frequency count)',
      'Explain time complexity of each solution out loud',
    ],
    isMilestone: false,
    topics: [
      { name: 'Array fundamentals', category: 'dsa', subcategory: 'arrays', description: 'Traversal, insertion, deletion, in-place updates, prefix technique intro.', resourceRoute: '/dsa/questions', expectedMinutes: 60 },
      { name: 'String fundamentals', category: 'dsa', subcategory: 'strings', description: 'Character frequency, two-pointer string checks, substring vs subsequence.', resourceRoute: '/dsa/questions', expectedMinutes: 45 },
      { name: 'Time and space complexity', category: 'cs_fundamentals', subcategory: 'complexity', description: 'Big-O for the patterns you just used. Interviewers always ask "what is the complexity?"', resourceRoute: '/docs', expectedMinutes: 30 },
      { name: 'Programming fundamentals drill', category: 'programming', subcategory: 'fundamentals', description: 'Variables, conditionals, loops, functions in your primary language track.', resourceRoute: '/core-programming', expectedMinutes: 45 },
    ],
  },
  {
    dayNumber: 3,
    phase: 'Foundation',
    title: 'HTML & CSS foundations',
    focus: 'Semantic markup, forms, box model and layout.',
    description:
      'Frontend interviews start with markup and layout. Weak HTML/CSS is the most common reason juniors fail round one.',
    goals: [
      'Build a semantic page skeleton with accessible form markup',
      'Explain the box model and box-sizing out loud',
      'Lay out a responsive card grid with Flexbox and Grid',
    ],
    isMilestone: false,
    topics: [
      { name: 'Semantic HTML and accessibility', category: 'frontend', subcategory: 'html', description: 'landmark elements, heading order, labels, alt text, ARIA only when needed.', resourceRoute: '/interview-questions/html', expectedMinutes: 45 },
      { name: 'Forms and input types', category: 'frontend', subcategory: 'html', description: 'Form semantics, validation attributes, required, pattern, autocomplete.', resourceRoute: '/interview-questions/html', expectedMinutes: 30 },
      { name: 'Box model, display and positioning', category: 'frontend', subcategory: 'css', description: 'margin collapse, stacking context, position values, z-index rules.', resourceRoute: '/interview-questions/css', expectedMinutes: 45 },
      { name: 'Flexbox and Grid layout', category: 'frontend', subcategory: 'css', description: 'When to use which, alignment, responsive grid without media query hacks.', resourceRoute: '/interview-questions/css', expectedMinutes: 45 },
    ],
  },
  {
    dayNumber: 4,
    phase: 'Foundation',
    title: 'Basic aptitude — arithmetic core',
    focus: 'Percentages, profit & loss, ratio, average.',
    description:
      'Aptitude is a screening filter at many Bengaluru service companies. These four topics cover the majority of first-round arithmetic.',
    goals: [
      'Solve 20 aptitude questions across percentages, profit & loss, ratio, average',
      'Keep average solve time under 60 seconds per question',
      'Log every wrong answer with the reason it went wrong',
    ],
    isMilestone: false,
    topics: [
      { name: 'Percentages', category: 'aptitude', subcategory: 'percentages', description: 'Percentage change, successive percentage, base value traps.', resourceRoute: '/placement?view=practice', expectedMinutes: 30 },
      { name: 'Profit & Loss', category: 'aptitude', subcategory: 'profit-loss', description: 'Cost price, selling price, discount, marked price chains.', resourceRoute: '/placement?view=practice', expectedMinutes: 30 },
      { name: 'Ratio & Proportion', category: 'aptitude', subcategory: 'ratio-proportion', description: 'Compounding ratios, direct and inverse proportion.', resourceRoute: '/placement?view=practice', expectedMinutes: 25 },
      { name: 'Average', category: 'aptitude', subcategory: 'average', description: 'Weighted average, replacement problems, group averages.', resourceRoute: '/placement?view=practice', expectedMinutes: 25 },
    ],
  },
  {
    dayNumber: 5,
    phase: 'Foundation',
    title: 'Logical reasoning & technical MCQ habit',
    focus: 'Number series, coding-decoding, and the daily MCQ habit.',
    description:
      'Reasoning speed is trainable. Build the daily habit of 10 aptitude + 10 reasoning + 10 technical MCQs from today onward.',
    goals: [
      'Solve 15 reasoning questions (series, coding-decoding, blood relations)',
      'Complete 10 technical MCQs across HTML/CSS/JS',
      'Start the daily practice routine that continues to Day 30',
    ],
    isMilestone: true,
    topics: [
      { name: 'Number & alphabet series', category: 'reasoning', subcategory: 'series', description: 'Arithmetic, geometric, alternating and difference patterns.', resourceRoute: '/placement?view=practice', expectedMinutes: 30 },
      { name: 'Coding-decoding', category: 'reasoning', subcategory: 'coding-decoding', description: 'Letter shifting, word coding, conditional coding.', resourceRoute: '/placement?view=practice', expectedMinutes: 25 },
      { name: 'Blood relations & direction sense', category: 'reasoning', subcategory: 'blood-relations', description: 'Diagram-first approach. Never solve blood relations in your head.', resourceRoute: '/placement?view=practice', expectedMinutes: 30 },
      { name: 'Technical MCQ habit', category: 'technical_mcq', subcategory: 'mixed', description: 'Daily mixed MCQ set — this habit continues every day of the program.', resourceRoute: '/placement?view=practice', expectedMinutes: 25 },
    ],
  },
  {
    dayNumber: 6,
    phase: 'Core Programming',
    title: 'HashMap & HashSet patterns',
    focus: 'Frequency maps, set membership, grouping.',
    description:
      'HashMap is the single highest-value DSA pattern for fresher interviews. Learn it as a pattern with named use cases.',
    goals: [
      'Solve 5 HashMap problems (two sum, group anagrams, longest substring)',
      'Explain when a HashSet beats sorting',
      'Note the HashMap pattern in your pattern notebook',
    ],
    isMilestone: false,
    topics: [
      { name: 'HashMap pattern: frequency counting', category: 'dsa', subcategory: 'hashmap', description: 'Count occurrences, find duplicates, character frequency windows.', resourceRoute: '/dsa/questions', expectedMinutes: 45 },
      { name: 'HashMap pattern: grouping & lookup', category: 'dsa', subcategory: 'hashmap', description: 'Group anagrams, two sum, subarray sum equals k.', resourceRoute: '/dsa/questions', expectedMinutes: 45 },
      { name: 'HashSet pattern: membership', category: 'dsa', subcategory: 'hashset', description: 'Duplicate detection, longest consecutive sequence.', resourceRoute: '/dsa/questions', expectedMinutes: 35 },
      { name: 'Language collections', category: 'programming', subcategory: 'collections', description: 'Java HashMap/HashSet or Python dict/set — whichever is your primary track.', resourceRoute: '/core-programming', expectedMinutes: 40 },
    ],
  },
  {
    dayNumber: 7,
    phase: 'Core Programming',
    title: 'Two pointer & sliding window',
    focus: 'The two patterns behind most array interview questions.',
    description:
      'Two pointer and sliding window look similar and are constantly confused. Learn the trigger conditions for each.',
    goals: [
      'Solve 4 two-pointer problems (pair sum, container with most water, remove duplicates)',
      'Solve 3 sliding window problems (max sum subarray, longest substring without repeat, anagram check)',
      'Write the trigger condition for each pattern from memory',
    ],
    isMilestone: true,
    topics: [
      { name: 'Two pointer pattern', category: 'dsa', subcategory: 'two-pointer', description: 'Opposite ends, fast/slow, and same-direction pointers.', resourceRoute: '/dsa/questions', expectedMinutes: 50 },
      { name: 'Sliding window pattern', category: 'dsa', subcategory: 'sliding-window', description: 'Fixed and variable window, expand/contract invariant.', resourceRoute: '/dsa/questions', expectedMinutes: 50 },
      { name: 'Sorting & searching fundamentals', category: 'dsa', subcategory: 'sorting-searching', description: 'Built-in sort cost, binary search on answer space.', resourceRoute: '/dsa/questions', expectedMinutes: 40 },
      { name: 'Week 1 checkpoint', category: 'technical_mcq', subcategory: 'weekly', description: 'First weekly assessment: 50 questions, 60 minutes.', resourceRoute: '/placement?view=assessments', expectedMinutes: 60 },
    ],
  },
  {
    dayNumber: 8,
    phase: 'Core Programming',
    title: 'Sorting, searching & language fundamentals',
    focus: 'Java/Python fundamentals and SQL basics.',
    description:
      'You choose ONE primary language track. Do not attempt to learn Java and Python at the same time.',
    goals: [
      'Complete the fundamentals module of your primary language track',
      'Write 3 SQL queries from scratch (SELECT, WHERE, ORDER BY, GROUP BY)',
      'Solve 2 searching problems using binary search',
    ],
    isMilestone: false,
    topics: [
      { name: 'Primary language fundamentals', category: 'programming', subcategory: 'language-fundamentals', description: 'Syntax, data types, control flow, functions for Java or Python.', resourceRoute: '/core-programming', expectedMinutes: 60 },
      { name: 'SQL: SELECT, WHERE, ORDER BY', category: 'sql', subcategory: 'basics', description: 'Filtering, sorting, NULL handling, DISTINCT.', resourceRoute: '/interview-questions/sql', expectedMinutes: 40 },
      { name: 'SQL: GROUP BY & aggregates', category: 'sql', subcategory: 'aggregates', description: 'COUNT, SUM, AVG, MIN, MAX with HAVING vs WHERE.', resourceRoute: '/interview-questions/sql', expectedMinutes: 40 },
      { name: 'Binary search pattern', category: 'dsa', subcategory: 'binary-search', description: 'Search on sorted arrays and search on answer space.', resourceRoute: '/dsa/questions', expectedMinutes: 45 },
    ],
  },
  {
    dayNumber: 9,
    phase: 'Core Programming',
    title: 'JavaScript interview questions & React fundamentals',
    focus: 'Closures, this, promises, and React component basics.',
    description:
      'Frontend interviews test JavaScript depth and React fundamentals in the same round. Cover both deliberately.',
    goals: [
      'Answer 10 JavaScript interview questions out loud with examples',
      'Explain closures, this-binding and the event loop on a whiteboard',
      'Build a small React component with props, state and a list render',
    ],
    isMilestone: false,
    topics: [
      { name: 'Closures, scope and this', category: 'technical_mcq', subcategory: 'javascript', description: 'Lexical scope, closure counters, call/apply/bind, arrow vs regular functions.', resourceRoute: '/interview-questions/javascript', expectedMinutes: 50 },
      { name: 'Promises, async/await and the event loop', category: 'technical_mcq', subcategory: 'javascript', description: 'Microtasks vs macrotasks, ordering of console output.', resourceRoute: '/interview-questions/javascript', expectedMinutes: 50 },
      { name: 'React fundamentals', category: 'frontend', subcategory: 'react', description: 'Components, props, state, rendering, keys in lists.', resourceRoute: '/interview-questions/react', expectedMinutes: 50 },
      { name: 'Frontend JS practice', category: 'frontend', subcategory: 'javascript', description: 'Hands-on frontend JavaScript problems in the existing studio.', resourceRoute: '/frontend-javascript', expectedMinutes: 45 },
    ],
  },
  {
    dayNumber: 10,
    phase: 'Core Programming',
    title: 'React fundamentals & week 2 checkpoint',
    focus: 'State, events, forms and the weekly assessment.',
    description:
      'Consolidate React fundamentals and take the week 2 checkpoint so readiness numbers become real.',
    goals: [
      'Handle form state and events in React',
      'Complete the week 2 assessment under time pressure',
      'Review every wrong answer and file it under a topic',
    ],
    isMilestone: true,
    topics: [
      { name: 'React state and events', category: 'frontend', subcategory: 'react', description: 'useState, controlled components, event handling, lifting state.', resourceRoute: '/interview-questions/react', expectedMinutes: 50 },
      { name: 'React rendering and keys', category: 'frontend', subcategory: 'react', description: 'Re-render triggers, list keys, avoiding unnecessary renders.', resourceRoute: '/interview-questions/react', expectedMinutes: 40 },
      { name: 'JavaScript output questions', category: 'technical_mcq', subcategory: 'javascript', description: 'Output prediction on map/filter/reduce, spread/rest, destructuring.', resourceRoute: '/placement?view=practice', expectedMinutes: 35 },
      { name: 'Week 2 checkpoint', category: 'technical_mcq', subcategory: 'weekly', description: '50 questions, 60 minutes. Feeds directly into readiness scoring.', resourceRoute: '/placement?view=assessments', expectedMinutes: 60 },
    ],
  },
  {
    dayNumber: 11,
    phase: 'Intermediate DSA',
    title: 'Stack & Queue',
    focus: 'LIFO/FIFO patterns and monotonic thinking.',
    description:
      'Stack and queue questions are short but pattern-dense. Learn the four classic stack patterns.',
    goals: [
      'Solve 5 stack problems (valid parentheses, min stack, daily temperatures)',
      'Solve 2 queue/deque problems',
      'Implement a stack and queue from scratch in your language track',
    ],
    isMilestone: false,
    topics: [
      { name: 'Stack pattern', category: 'dsa', subcategory: 'stack', description: 'Matching, monotonic stack, expression evaluation, next greater element.', resourceRoute: '/dsa/questions', expectedMinutes: 55 },
      { name: 'Queue & deque pattern', category: 'dsa', subcategory: 'queue', description: 'BFS-ready queue, sliding window maximum with deque.', resourceRoute: '/dsa/questions', expectedMinutes: 45 },
      { name: 'Language data structures', category: 'programming', subcategory: 'collections', description: 'Stack/queue implementations in Java collections or Python collections.', resourceRoute: '/core-programming', expectedMinutes: 40 },
      { name: 'Daily reasoning set', category: 'reasoning', subcategory: 'syllogisms', description: 'Syllogisms, statements & conclusions — keep the daily habit running.', resourceRoute: '/placement?view=practice', expectedMinutes: 25 },
    ],
  },
  {
    dayNumber: 12,
    phase: 'Intermediate DSA',
    title: 'Linked lists',
    focus: 'Pointer manipulation without arrays as a crutch.',
    description:
      'Linked list questions test pointer discipline. Draw the pointers before you write code.',
    goals: [
      'Solve 5 linked list problems (reverse, cycle detection, merge, middle node)',
      'Draw pointer states for reverse-linked-list on paper',
      'Explain why Floyd cycle detection is O(n) time and O(1) space',
    ],
    isMilestone: false,
    topics: [
      { name: 'Linked list traversal & reversal', category: 'dsa', subcategory: 'linked-list', description: 'Iterative and recursive reversal, prev/curr/next discipline.', resourceRoute: '/dsa/questions', expectedMinutes: 55 },
      { name: 'Fast & slow pointers', category: 'dsa', subcategory: 'linked-list', description: 'Cycle detection, middle node, palindrome linked list.', resourceRoute: '/dsa/questions', expectedMinutes: 45 },
      { name: 'React hooks', category: 'frontend', subcategory: 'react', description: 'useState, useEffect, useMemo, useCallback, useRef — what each is for and when it is overuse.', resourceRoute: '/interview-questions/react', expectedMinutes: 50 },
      { name: 'TypeScript basics', category: 'technical_mcq', subcategory: 'typescript', description: 'Type annotations, inference, interfaces vs type aliases, unions.', resourceRoute: '/interview-questions/typescript', expectedMinutes: 45 },
    ],
  },
  {
    dayNumber: 13,
    phase: 'Intermediate DSA',
    title: 'Binary search & recursion',
    focus: 'Divide, define the invariant, then recurse.',
    description:
      'Recursion fails interviews when the base case is fuzzy. Write the base case first, every time.',
    goals: [
      'Solve 4 recursion problems (factorial, subsets, permutations, power)',
      'Solve 3 binary search problems including rotated array search',
      'Write the recurrence for each recursion solution',
    ],
    isMilestone: false,
    topics: [
      { name: 'Recursion pattern', category: 'dsa', subcategory: 'recursion', description: 'Base case, recursive case, call stack depth, recursion to iteration.', resourceRoute: '/dsa/questions', expectedMinutes: 55 },
      { name: 'Binary search deep dive', category: 'dsa', subcategory: 'binary-search', description: 'Rotated sorted array, first/last occurrence, search on answer.', resourceRoute: '/dsa/questions', expectedMinutes: 50 },
      { name: 'Prefix sum & intervals', category: 'dsa', subcategory: 'prefix-sum', description: 'Range sum queries, merge intervals, insert interval.', resourceRoute: '/dsa/questions', expectedMinutes: 45 },
      { name: 'Browser APIs', category: 'frontend', subcategory: 'browser', description: 'localStorage, sessionStorage, fetch, IntersectionObserver, timers.', resourceRoute: '/interview-questions/dom', expectedMinutes: 40 },
    ],
  },
  {
    dayNumber: 14,
    phase: 'Intermediate DSA',
    title: 'Trees basics',
    focus: 'Traversals, height, and recursive tree thinking.',
    description:
      'Almost every product-company fresher round includes one tree question. Traversals must be automatic.',
    goals: [
      'Implement all four traversals recursively and one iteratively',
      'Solve 4 tree problems (max depth, level order, invert, validate BST)',
      'Draw the recursion tree for level-order traversal',
    ],
    isMilestone: false,
    topics: [
      { name: 'Tree traversals', category: 'dsa', subcategory: 'trees', description: 'Inorder, preorder, postorder, level-order and their use cases.', resourceRoute: '/dsa/questions', expectedMinutes: 55 },
      { name: 'Binary tree properties', category: 'dsa', subcategory: 'trees', description: 'Height, diameter, balanced check, path sum.', resourceRoute: '/dsa/questions', expectedMinutes: 45 },
      { name: 'TypeScript type system', category: 'technical_mcq', subcategory: 'typescript', description: 'Generics, unknown vs any, utility types, narrowing and guards.', resourceRoute: '/interview-questions/typescript', expectedMinutes: 45 },
      { name: 'Week 3 checkpoint', category: 'technical_mcq', subcategory: 'weekly', description: '50 questions, 60 minutes covering DSA, JS, React and reasoning.', resourceRoute: '/placement?view=assessments', expectedMinutes: 60 },
    ],
  },
  {
    dayNumber: 15,
    phase: 'Intermediate DSA',
    title: 'Intervals, prefix sum & hooks mastery',
    focus: 'Interval merging and production-grade React hooks.',
    description:
      'Finish the intermediate DSA block and lock in React hooks understanding with performance reasoning.',
    goals: [
      'Solve merge intervals and insert interval',
      'Explain useMemo vs useCallback with a concrete re-render example',
      'Refactor a component to remove an unnecessary re-render',
    ],
    isMilestone: true,
    topics: [
      { name: 'Intervals pattern', category: 'dsa', subcategory: 'intervals', description: 'Sort-by-start, merge, overlap detection, meeting rooms.', resourceRoute: '/dsa/questions', expectedMinutes: 45 },
      { name: 'Prefix sum pattern', category: 'dsa', subcategory: 'prefix-sum', description: 'Subarray sums, equilibrium index, product except self.', resourceRoute: '/dsa/questions', expectedMinutes: 45 },
      { name: 'Hooks performance', category: 'frontend', subcategory: 'react', description: 'Memoization, dependency arrays, stale closures, ref-based values.', resourceRoute: '/interview-questions/react', expectedMinutes: 50 },
      { name: 'Interview answer practice', category: 'communication', subcategory: 'technical-explanation', description: 'Explain "how does useEffect work" in 60 seconds and 2 minutes.', resourceRoute: '/placement?view=interview-prep', expectedMinutes: 25 },
    ],
  },
  {
    dayNumber: 16,
    phase: 'Interview Depth',
    title: 'Trees & heaps',
    focus: 'Priority queues and top-K patterns.',
    description:
      'Heap questions are short and formulaic once you know the top-K pattern.',
    goals: [
      'Solve 4 heap problems (kth largest, top k frequent, merge k lists, median stream)',
      'Implement a min-heap insert and extract-min',
      'Explain heap vs sorted array tradeoff',
    ],
    isMilestone: false,
    topics: [
      { name: 'Heap / priority queue pattern', category: 'dsa', subcategory: 'heap', description: 'Top-K, two-heap median, scheduling with priority.', resourceRoute: '/dsa/questions', expectedMinutes: 55 },
      { name: 'BST operations', category: 'dsa', subcategory: 'trees', description: 'Search, insert, delete, validate BST, kth smallest.', resourceRoute: '/dsa/questions', expectedMinutes: 45 },
      { name: 'OOP concepts', category: 'cs_fundamentals', subcategory: 'oop', description: 'Encapsulation, inheritance, polymorphism, abstraction with real examples.', resourceRoute: '/interview-questions/oop', expectedMinutes: 45 },
      { name: 'DBMS fundamentals', category: 'cs_fundamentals', subcategory: 'dbms', description: 'Keys, normalization, indexing, transactions, ACID.', resourceRoute: '/interview-questions/dbms', expectedMinutes: 45 },
    ],
  },
  {
    dayNumber: 17,
    phase: 'Interview Depth',
    title: 'Graphs, DFS & BFS',
    focus: 'Grid traversal and connected components.',
    description:
      'Graphs are intimidating until you see that most fresher problems are grid BFS or DFS.',
    goals: [
      'Solve 4 graph problems (number of islands, clone graph, course schedule, word ladder-lite)',
      'Implement BFS and DFS from memory',
      'Explain adjacency list vs adjacency matrix tradeoffs',
    ],
    isMilestone: false,
    topics: [
      { name: 'Graph representation & BFS', category: 'dsa', subcategory: 'graphs', description: 'Adjacency list, queue-based BFS, shortest path in unweighted graphs.', resourceRoute: '/dsa/questions', expectedMinutes: 55 },
      { name: 'DFS & backtracking intro', category: 'dsa', subcategory: 'graphs', description: 'Recursive DFS, visited sets, backtracking template.', resourceRoute: '/dsa/questions', expectedMinutes: 55 },
      { name: 'Operating systems basics', category: 'cs_fundamentals', subcategory: 'operating-systems', description: 'Processes vs threads, scheduling, deadlock, memory management.', resourceRoute: '/interview-questions/operating-systems', expectedMinutes: 45 },
      { name: 'Networking basics', category: 'cs_fundamentals', subcategory: 'networking', description: 'OSI/TCP-IP, TCP vs UDP, DNS, HTTP request lifecycle.', resourceRoute: '/interview-questions/networking', expectedMinutes: 40 },
    ],
  },
  {
    dayNumber: 18,
    phase: 'Interview Depth',
    title: 'Greedy & DP basics',
    focus: 'Interval scheduling, coin change, and knowing when DP applies.',
    description:
      'For fresher rounds, DP is about recognizing optimal substructure — not solving hard LeetCode.',
    goals: [
      'Solve 3 greedy problems (activity selection, jump game, assign cookies)',
      'Solve 3 DP problems (climb stairs, coin change, house robber)',
      'Write the DP state definition for each DP problem before coding',
    ],
    isMilestone: false,
    topics: [
      { name: 'Greedy pattern', category: 'dsa', subcategory: 'greedy', description: 'Local choice, exchange argument, interval scheduling.', resourceRoute: '/dsa/questions', expectedMinutes: 50 },
      { name: 'DP basics', category: 'dsa', subcategory: 'dynamic-programming', description: '1D DP, memoization vs tabulation, state definition discipline.', resourceRoute: '/dsa/questions', expectedMinutes: 55 },
      { name: 'SQL joins', category: 'sql', subcategory: 'joins', description: 'INNER, LEFT, RIGHT, FULL, SELF join with classic interview problems.', resourceRoute: '/interview-questions/sql', expectedMinutes: 50 },
      { name: 'Language interview questions', category: 'programming', subcategory: 'interview', description: 'Java or Python interview questions matched to your primary track.', resourceRoute: '/core-programming', expectedMinutes: 45 },
    ],
  },
  {
    dayNumber: 19,
    phase: 'Interview Depth',
    title: 'SQL interview problems & CS fundamentals',
    focus: 'The SQL questions that actually get asked.',
    description:
      'Second highest salary, duplicate records and department-wise counts appear in almost every service-company round.',
    goals: [
      'Solve 5 classic SQL interview problems',
      'Explain normalization up to 3NF with an example',
      'Explain indexing and when it hurts writes',
    ],
    isMilestone: false,
    topics: [
      { name: 'Classic SQL problems', category: 'sql', subcategory: 'interview-problems', description: 'Second highest salary, duplicates, employees without department, top N per group.', resourceRoute: '/interview-questions/sql', expectedMinutes: 55 },
      { name: 'Subqueries & indexes', category: 'sql', subcategory: 'advanced', description: 'Correlated subqueries, EXISTS, index types, query plans.', resourceRoute: '/interview-questions/sql', expectedMinutes: 45 },
      { name: 'Git & HTTP', category: 'cs_fundamentals', subcategory: 'git-http', description: 'Branching, merge vs rebase, HTTP methods, status codes, headers.', resourceRoute: '/interview-questions/http', expectedMinutes: 40 },
      { name: 'Frontend performance', category: 'frontend', subcategory: 'performance', description: 'Core Web Vitals, bundle size, lazy loading, memoization, rendering cost.', resourceRoute: '/interview-questions/javascript', expectedMinutes: 45 },
    ],
  },
  {
    dayNumber: 20,
    phase: 'Interview Depth',
    title: 'Depth consolidation & week 4 checkpoint',
    focus: 'Consolidate DSA + CS fundamentals before the frontend intensive.',
    description:
      'This checkpoint tells you which topics will need weakness-correction work on Day 29.',
    goals: [
      'Complete the week 4 assessment',
      'List your 5 weakest topics from assessment data',
      'Schedule those topics into Day 29 weakness correction',
    ],
    isMilestone: true,
    topics: [
      { name: 'Mixed DSA timed set', category: 'dsa', subcategory: 'mixed', description: 'Timed mixed set across arrays, trees, graphs and DP.', resourceRoute: '/placement?view=practice', expectedMinutes: 50 },
      { name: 'CS fundamentals rapid fire', category: 'cs_fundamentals', subcategory: 'mixed', description: 'OOP, DBMS, OS, networking rapid-fire questions.', resourceRoute: '/placement?view=practice', expectedMinutes: 35 },
      { name: 'Language track review', category: 'programming', subcategory: 'interview', description: 'Collections / data structures review for your primary language.', resourceRoute: '/core-programming', expectedMinutes: 40 },
      { name: 'Week 4 checkpoint', category: 'technical_mcq', subcategory: 'weekly', description: '50 questions, 60 minutes.', resourceRoute: '/placement?view=assessments', expectedMinutes: 60 },
    ],
  },
  {
    dayNumber: 21,
    phase: 'Frontend Interview Intensive',
    title: 'HTML & CSS interview day',
    focus: 'Answer frontend questions like a developer, not a textbook.',
    description:
      'Frontend interviews reward precise answers with examples. Practice saying them out loud.',
    goals: [
      'Answer 15 HTML/CSS interview questions out loud',
      'Explain specificity, inheritance and the cascade with a concrete example',
      'Build a responsive layout in 20 minutes without a framework',
    ],
    isMilestone: false,
    topics: [
      { name: 'HTML interview', category: 'frontend', subcategory: 'html', description: 'Semantic HTML, accessibility, SEO basics, HTML5 APIs.', resourceRoute: '/interview-questions/html', expectedMinutes: 50 },
      { name: 'CSS interview', category: 'frontend', subcategory: 'css', description: 'Box model, Flexbox, Grid, specificity, responsive design, units, z-index.', resourceRoute: '/interview-questions/css', expectedMinutes: 50 },
      { name: 'Responsive UI drill', category: 'machine_coding', subcategory: 'responsive', description: 'Build a responsive component in the existing machine coding studio.', resourceRoute: '/machine-coding', expectedMinutes: 60 },
      { name: 'Interview answer practice', category: 'communication', subcategory: 'technical-explanation', description: 'Explain CSS specificity in 60 seconds.', resourceRoute: '/placement?view=interview-prep', expectedMinutes: 20 },
    ],
  },
  {
    dayNumber: 22,
    phase: 'Frontend Interview Intensive',
    title: 'JavaScript & React interview day',
    focus: 'Output prediction, hook rules, and performance reasoning.',
    description:
      'The JavaScript and React round is where most fresher frontend candidates get filtered.',
    goals: [
      'Predict output for 15 JavaScript questions under 30 seconds each',
      'Answer 10 React interview questions including useEffect pitfalls',
      'Explain re-rendering and how to diagnose it',
    ],
    isMilestone: false,
    topics: [
      { name: 'JavaScript interview', category: 'technical_mcq', subcategory: 'javascript', description: 'Closures, event loop, hoisting, this, prototypes, copy semantics.', resourceRoute: '/interview-questions/javascript', expectedMinutes: 55 },
      { name: 'React interview', category: 'frontend', subcategory: 'react', description: 'Hooks rules, context, custom hooks, forms, routing, API integration.', resourceRoute: '/interview-questions/react', expectedMinutes: 55 },
      { name: 'TypeScript interview', category: 'technical_mcq', subcategory: 'typescript', description: 'Generics, narrowing, utility types, any vs unknown vs never.', resourceRoute: '/interview-questions/typescript', expectedMinutes: 40 },
      { name: 'Debugging practice', category: 'frontend', subcategory: 'debugging', description: 'Debug a failing React component from a bug report.', resourceRoute: '/frontend-javascript', expectedMinutes: 40 },
    ],
  },
  {
    dayNumber: 23,
    phase: 'Frontend Interview Intensive',
    title: 'HTTP, REST, auth & state management',
    focus: 'The "how does your app talk to the backend" round.',
    description:
      'Juniors who can explain API integration, auth flow and error handling stand out immediately.',
    goals: [
      'Explain an HTTP request lifecycle end to end',
      'Explain JWT-based auth flow with refresh/expiry handling',
      'Answer 10 questions on REST, caching and state management',
    ],
    isMilestone: true,
    topics: [
      { name: 'HTTP & REST', category: 'frontend', subcategory: 'http', description: 'Methods, status codes, headers, caching, REST constraints, idempotency.', resourceRoute: '/interview-questions/http', expectedMinutes: 50 },
      { name: 'Authentication', category: 'frontend', subcategory: 'auth', description: 'Sessions vs tokens, JWT, OAuth basics, secure storage, protected routes.', resourceRoute: '/interview-questions/javascript', expectedMinutes: 45 },
      { name: 'State management', category: 'frontend', subcategory: 'state', description: 'Local state, context, server state, URL state — choosing the right layer.', resourceRoute: '/interview-questions/react', expectedMinutes: 45 },
      { name: 'Mock interview — frontend', category: 'communication', subcategory: 'mock', description: 'Run a frontend mock interview round and record the result.', resourceRoute: '/mock-interview', expectedMinutes: 45 },
    ],
  },
  {
    dayNumber: 24,
    phase: 'Machine Coding',
    title: 'Machine coding — component design & API integration',
    focus: 'Reuse the existing Machine Coding studio. Do not rebuild it.',
    description:
      'Machine coding is the highest-signal round for frontend roles. Practice component design, API integration, loading and error states.',
    goals: [
      'Complete 2 machine coding tasks from the existing studio',
      'Every task must include loading, error and empty states',
      'Get a scorecard for at least one task',
    ],
    isMilestone: false,
    topics: [
      { name: 'Component design & API integration', category: 'machine_coding', subcategory: 'component-design', description: 'Fetch data, render list, handle loading/error/empty states.', resourceRoute: '/machine-coding', expectedMinutes: 60 },
      { name: 'Forms & validation', category: 'machine_coding', subcategory: 'forms', description: 'Controlled forms, field validation, submit handling, error messaging.', resourceRoute: '/machine-coding', expectedMinutes: 60 },
      { name: 'Search, filter & pagination', category: 'machine_coding', subcategory: 'list-ux', description: 'Debounced search, combined filters, pagination UX.', resourceRoute: '/machine-coding', expectedMinutes: 50 },
      { name: 'Mock coding round', category: 'machine_coding', subcategory: 'mock', description: 'Timed machine coding mock using the existing mock runner.', resourceRoute: '/mock-coding', expectedMinutes: 60 },
    ],
  },
  {
    dayNumber: 25,
    phase: 'Machine Coding',
    title: 'Machine coding — modals, autocomplete, debouncing',
    focus: 'The interactive components that decide the round.',
    description:
      'Modal focus traps, autocomplete with keyboard navigation and debounced inputs are the classic follow-up requirements.',
    goals: [
      'Build an autocomplete with keyboard navigation and debounced fetch',
      'Build a modal with focus trap and escape-to-close',
      'Make one task fully responsive on mobile',
    ],
    isMilestone: true,
    topics: [
      { name: 'Modal & focus management', category: 'machine_coding', subcategory: 'modal', description: 'Focus trap, escape handling, scroll lock, accessibility attributes.', resourceRoute: '/machine-coding', expectedMinutes: 50 },
      { name: 'Autocomplete & debouncing', category: 'machine_coding', subcategory: 'autocomplete', description: 'Debounce input, cancel stale requests, keyboard navigation.', resourceRoute: '/machine-coding', expectedMinutes: 55 },
      { name: 'Responsive UI & error handling', category: 'machine_coding', subcategory: 'responsive', description: 'Mobile-first layout, network error recovery, retry UX.', resourceRoute: '/machine-coding', expectedMinutes: 50 },
      { name: 'Machine coding scorecard review', category: 'machine_coding', subcategory: 'review', description: 'Review your scorecard and list the three weakest criteria.', resourceRoute: '/machine-coding', expectedMinutes: 25 },
    ],
  },
  {
    dayNumber: 26,
    phase: 'Project & Deployment',
    title: 'Project — build & document',
    focus: 'One real project, documented like a professional.',
    description:
      'The project is only worth points when it is real: repository, README, live URL and an explanation you can defend.',
    goals: [
      'Push the project to a public GitHub repository',
      'Write a README with stack, setup, architecture and screenshots',
      'Deploy to a live URL and verify it works on mobile',
    ],
    isMilestone: true,
    topics: [
      { name: 'Project repository & README', category: 'project', subcategory: 'documentation', description: 'Public repo, clear README, screenshots, setup instructions.', resourceRoute: '/placement?view=project', expectedMinutes: 90 },
      { name: 'Architecture & API documentation', category: 'project', subcategory: 'architecture', description: 'Document your data flow, API layer and database choices.', resourceRoute: '/placement?view=project', expectedMinutes: 60 },
      { name: 'Authentication & error handling', category: 'project', subcategory: 'reliability', description: 'Ensure auth, loading and error handling are implemented and explainable.', resourceRoute: '/placement?view=project', expectedMinutes: 60 },
      { name: 'Resume & profile checklist', category: 'project', subcategory: 'profile', description: 'Resume, GitHub, LinkedIn and portfolio links verified against real data.', resourceRoute: '/resume-optimizer', expectedMinutes: 45 },
    ],
  },
  {
    dayNumber: 27,
    phase: 'Project & Deployment',
    title: 'Project — deployment & defense rehearsal',
    focus: 'Deploy, then defend it like an interviewer is listening.',
    description:
      'Deployment is not done until you can answer what happens when 1000 users arrive and what your hardest bug was.',
    goals: [
      'Complete a self project defense with the full question set',
      'Answer "explain your project" in 2 minutes without notes',
      'Record the self-review score and list 3 improvements',
    ],
    isMilestone: false,
    topics: [
      { name: 'Deployment', category: 'project', subcategory: 'deployment', description: 'Hosting, environment variables, build process, CDN, monitoring basics.', resourceRoute: '/placement?view=project', expectedMinutes: 60 },
      { name: 'Project defense rehearsal', category: 'project', subcategory: 'defense', description: 'Answer why this stack, how auth works, hardest bug, what you would improve.', resourceRoute: '/placement?view=project', expectedMinutes: 60 },
      { name: 'Technical explanation practice', category: 'communication', subcategory: 'project-explanation', description: 'Explain your project in 2 minutes with structure.', resourceRoute: '/placement?view=interview-prep', expectedMinutes: 30 },
      { name: 'Scaling & failure scenarios', category: 'project', subcategory: 'scaling', description: 'What breaks at 1000 users? How do you handle API failure?', resourceRoute: '/placement?view=project', expectedMinutes: 30 },
    ],
  },
  {
    dayNumber: 28,
    phase: 'Full Mock',
    title: 'Full mock interview',
    focus: 'A complete simulation across every round type.',
    description:
      'One full mock covering aptitude, technical MCQ, DSA, frontend, language, SQL, project and communication. Treat it as real.',
    goals: [
      'Complete the full mock interview under timed conditions',
      'Record every question asked and every question failed',
      'Get a mentor or peer to score the communication round',
    ],
    isMilestone: true,
    topics: [
      { name: 'Aptitude + reasoning mock', category: 'aptitude', subcategory: 'mock', description: 'Timed aptitude and reasoning screening section.', resourceRoute: '/placement?view=mock-interviews', expectedMinutes: 30 },
      { name: 'Technical MCQ + DSA mock', category: 'dsa', subcategory: 'mock', description: 'Timed technical MCQ section plus one DSA coding problem.', resourceRoute: '/placement?view=mock-interviews', expectedMinutes: 45 },
      { name: 'Frontend + language + SQL mock', category: 'frontend', subcategory: 'mock', description: 'Frontend, primary language and SQL questioning.', resourceRoute: '/placement?view=mock-interviews', expectedMinutes: 45 },
      { name: 'Project + communication mock', category: 'communication', subcategory: 'mock', description: 'Project defense and behavioral communication round.', resourceRoute: '/placement?view=mock-interviews', expectedMinutes: 30 },
    ],
  },
  {
    dayNumber: 29,
    phase: 'Weakness Correction',
    title: 'Weakness correction from real data',
    focus: 'No random questions. Only the topics your data says are weak.',
    description:
      'The practice set for today is generated from your own assessment results, interview feedback and rejection analysis.',
    goals: [
      'Open the weak areas panel and confirm the generated plan',
      'Solve 3 problems in each weak topic',
      'Re-attempt the questions you previously failed',
    ],
    isMilestone: true,
    topics: [
      { name: 'Generated weakness practice', category: 'dsa', subcategory: 'weakness', description: 'Practice set generated from your actual performance data.', resourceRoute: '/placement?view=practice', expectedMinutes: 90 },
      { name: 'Failed question re-attempts', category: 'technical_mcq', subcategory: 'weakness', description: 'Re-attempt every question you answered incorrectly.', resourceRoute: '/placement?view=practice', expectedMinutes: 45 },
      { name: 'Interview failure analysis', category: 'communication', subcategory: 'rejection-analysis', description: 'Review rejection analysis and rehearse answers for failed questions.', resourceRoute: '/placement?view=applications', expectedMinutes: 40 },
      { name: 'Weakness checkpoint', category: 'technical_mcq', subcategory: 'weakness', description: 'Short targeted quiz on corrected topics only.', resourceRoute: '/placement?view=assessments', expectedMinutes: 30 },
    ],
  },
  {
    dayNumber: 30,
    phase: 'Final Assessment',
    title: 'Final placement assessment',
    focus: 'Full simulation and the readiness report.',
    description:
      'A 100-question screening plus DSA coding, frontend machine coding, project defense and communication. The output is a readiness report with exact blocking reasons.',
    goals: [
      'Complete the final assessment end to end',
      'Receive the readiness report with per-category scores',
      'Enter placement mode with a job application plan',
    ],
    isMilestone: true,
    topics: [
      { name: '100-question screening', category: 'technical_mcq', subcategory: 'final', description: 'Aptitude, reasoning, technical MCQ, SQL and CS fundamentals.', resourceRoute: '/placement?view=assessments', expectedMinutes: 90 },
      { name: 'DSA coding', category: 'dsa', subcategory: 'final', description: 'Timed DSA problem solved in the existing DSA studio.', resourceRoute: '/dsa/questions', expectedMinutes: 45 },
      { name: 'Frontend machine coding', category: 'machine_coding', subcategory: 'final', description: 'Timed machine coding task in the existing studio.', resourceRoute: '/machine-coding', expectedMinutes: 60 },
      { name: 'Project defense & communication', category: 'project', subcategory: 'final', description: 'Defend the project and complete the communication round.', resourceRoute: '/placement?view=project', expectedMinutes: 45 },
    ],
  },
  {
    dayNumber: 31,
    phase: 'Startup Interview Prep',
    title: 'Startup culture & mindset',
    focus: 'Understand and articulate startup values.',
    description: 'Startups operate differently from big companies. Learn to communicate your fit for a fast-paced, ownership-driven environment.',
    goals: [
      'Answer 10 startup culture questions out loud',
      'Explain why you want to work at a startup with specific evidence',
      'Demonstrate understanding of startup trade-offs',
    ],
    isMilestone: false,
    topics: [
      { name: 'Startup culture questions', category: 'communication', subcategory: 'startup-culture', description: 'Why startups, handling ambiguity, wearing many hats, prioritization.', resourceRoute: '/placement?view=interview-prep', expectedMinutes: 60 },
      { name: 'Startup mindset assessment', category: 'communication', subcategory: 'startup-culture', description: 'Self-assessment on risk tolerance, learning speed, and ownership.', resourceRoute: '/placement?view=interview-prep', expectedMinutes: 30 },
      { name: 'Research target companies', category: 'communication', subcategory: 'bangalore', description: 'Research 10 target startups — their product, team, funding, and recent news.', resourceRoute: '/placement?view=applications', expectedMinutes: 45 },
    ],
  },
  {
    dayNumber: 32,
    phase: 'Startup Interview Prep',
    title: 'Fresher-specific interview skills',
    focus: 'Handle the "no experience" objection confidently.',
    description: 'Freshers face unique interview challenges. Learn to pivot from lack of experience to evidence of potential.',
    goals: [
      'Answer "why hire you without experience" with confidence',
      'Present academic projects as professional evidence',
      'Demonstrate learning ability with concrete examples',
    ],
    isMilestone: false,
    topics: [
      { name: 'Fresher objection handling', category: 'communication', subcategory: 'fresher', description: 'No experience, weakness questions, gap in resume, career change.', resourceRoute: '/placement?view=interview-prep', expectedMinutes: 60 },
      { name: 'Academic project presentation', category: 'communication', subcategory: 'fresher', description: 'Present 3 college/internship projects in 2 minutes each with impact metrics.', resourceRoute: '/placement?view=interview-prep', expectedMinutes: 45 },
      { name: 'Learning speed evidence', category: 'communication', subcategory: 'fresher', description: 'Prepare examples of learning new technologies quickly.', resourceRoute: '/placement?view=interview-prep', expectedMinutes: 30 },
    ],
  },
  {
    dayNumber: 33,
    phase: 'Startup Interview Prep',
    title: 'Technical communication',
    focus: 'Explain technical concepts to non-technical audiences.',
    description: 'Startups have PMs, designers, and founders in technical discussions. Being able to explain simply is a superpower.',
    goals: [
      'Explain 10 technical concepts to a non-technical person',
      'Practice whiteboard explanation of your code',
      'Learn to narrate your problem-solving process',
    ],
    isMilestone: false,
    topics: [
      { name: 'Technical explanation practice', category: 'communication', subcategory: 'technical-explanation', description: 'Explain closures, APIs, React, event loop, databases simply.', resourceRoute: '/placement?view=interview-prep', expectedMinutes: 60 },
      { name: 'Code narration practice', category: 'communication', subcategory: 'technical-explanation', description: 'Explain a coding solution step by step as if on a whiteboard.', resourceRoute: '/placement?view=interview-prep', expectedMinutes: 45 },
      { name: 'System design basics', category: 'communication', subcategory: 'technical-explanation', description: 'Explain how a URL flows through a full-stack application.', resourceRoute: '/placement?view=interview-prep', expectedMinutes: 45 },
    ],
  },
  {
    dayNumber: 34,
    phase: 'Startup Interview Prep',
    title: 'Scenario-based problem solving',
    focus: 'Handle hypothetical startup scenarios.',
    description: 'Startup interviews often include scenario questions to test your thinking process and cultural fit.',
    goals: [
      'Answer 15 scenario questions with structured thinking',
      'Demonstrate product sense in hypothetical situations',
      'Show prioritization and communication skills',
    ],
    isMilestone: false,
    topics: [
      { name: 'Scenario question practice', category: 'communication', subcategory: 'scenario', description: 'Bug found before deadline, disagreeing with senior, stakeholder changes, production issues.', resourceRoute: '/placement?view=interview-prep', expectedMinutes: 60 },
      { name: 'Product scenario practice', category: 'communication', subcategory: 'scenario', description: 'How would you improve X, what would you build, how to measure success.', resourceRoute: '/placement?view=interview-prep', expectedMinutes: 45 },
      { name: 'Estimation practice', category: 'communication', subcategory: 'scenario', description: 'Estimate time for tasks, scope for features, and communicate uncertainty.', resourceRoute: '/placement?view=interview-prep', expectedMinutes: 30 },
    ],
  },
  {
    dayNumber: 35,
    phase: 'Startup Interview Prep',
    title: 'Product thinking',
    focus: 'Think like a product engineer, not just a coder.',
    description: 'Startups value engineers who understand users and business. Develop product intuition.',
    goals: [
      'Analyze 5 products and identify improvements',
      'Explain features vs benefits for common products',
      'Practice prioritization frameworks',
    ],
    isMilestone: false,
    topics: [
      { name: 'Product analysis practice', category: 'communication', subcategory: 'product-thinking', description: 'Analyze products you use — UX, features, business model.', resourceRoute: '/placement?view=interview-prep', expectedMinutes: 60 },
      { name: 'Feature vs benefit practice', category: 'communication', subcategory: 'product-thinking', description: 'Convert feature descriptions to user benefits for 10 products.', resourceRoute: '/placement?view=interview-prep', expectedMinutes: 30 },
      { name: 'Prioritization frameworks', category: 'communication', subcategory: 'product-thinking', description: 'RICE, impact-effort, and other prioritization methods.', resourceRoute: '/placement?view=interview-prep', expectedMinutes: 45 },
    ],
  },
  {
    dayNumber: 36,
    phase: 'Startup Interview Prep',
    title: 'Behavioral interview mastery',
    focus: 'Master the STAR method for behavioral questions.',
    description: 'Behavioral interviews are universal. Structure your stories for maximum impact.',
    goals: [
      'Prepare 10 STAR stories for common behavioral questions',
      'Practice delivering stories in 2 minutes',
      'Learn to adapt stories to different questions',
    ],
    isMilestone: false,
    topics: [
      { name: 'STAR story preparation', category: 'communication', subcategory: 'behavioral', description: 'Challenge, conflict, failure, leadership, teamwork stories.', resourceRoute: '/placement?view=interview-prep', expectedMinutes: 60 },
      { name: 'Story delivery practice', category: 'communication', subcategory: 'behavioral', description: 'Practice delivering stories out loud with timing.', resourceRoute: '/placement?view=interview-prep', expectedMinutes: 45 },
      { name: 'Question adaptation practice', category: 'communication', subcategory: 'behavioral', description: 'Adapt the same story to answer different behavioral questions.', resourceRoute: '/placement?view=interview-prep', expectedMinutes: 30 },
    ],
  },
  {
    dayNumber: 37,
    phase: 'Startup Interview Prep',
    title: 'Bangalore startup ecosystem',
    focus: 'Understand and leverage the local ecosystem.',
    description: 'Bangalore has a unique startup culture. Understanding it gives you an edge in interviews.',
    goals: [
      'Research the top 20 startups in Bangalore',
      'Understand the funding landscape and company stages',
      'Network with local developers and founders',
    ],
    isMilestone: false,
    topics: [
      { name: 'Ecosystem research', category: 'communication', subcategory: 'bangalore', description: 'Research startups by stage, sector, and funding. Identify your targets.', resourceRoute: '/placement?view=applications', expectedMinutes: 60 },
      { name: 'Networking preparation', category: 'communication', subcategory: 'bangalore', description: 'Prepare your intro, elevator pitch, and networking questions.', resourceRoute: '/placement?view=interview-prep', expectedMinutes: 30 },
      { name: 'Meetup and event plan', category: 'communication', subcategory: 'bangalore', description: 'Identify relevant meetups, hackathons, and events to attend.', resourceRoute: '/placement?view=applications', expectedMinutes: 30 },
    ],
  },
  {
    dayNumber: 38,
    phase: 'Startup Interview Prep',
    title: 'Salary negotiation & offer evaluation',
    focus: 'Navigate compensation discussions confidently.',
    description: 'Startup compensation includes equity, variable pay, and benefits. Learn to evaluate and negotiate.',
    goals: [
      'Research market rates for your role and experience',
      'Understand equity, ESOPs, and vesting schedules',
      'Practice salary negotiation conversations',
    ],
    isMilestone: false,
    topics: [
      { name: 'Compensation research', category: 'communication', subcategory: 'bangalore', description: 'Research salaries on AmbitionBox, Glassdoor, LinkedIn for target roles.', resourceRoute: '/placement?view=applications', expectedMinutes: 45 },
      { name: 'Equity and ESOP education', category: 'communication', subcategory: 'bangalore', description: 'Understand equity, vesting, dilution, and how to evaluate startup offers.', resourceRoute: '/placement?view=interview-prep', expectedMinutes: 45 },
      { name: 'Negotiation practice', category: 'communication', subcategory: 'bangalore', description: 'Practice salary negotiation scenarios with confidence and data.', resourceRoute: '/placement?view=interview-prep', expectedMinutes: 30 },
    ],
  },
  {
    dayNumber: 39,
    phase: 'Startup Interview Prep',
    title: 'Mock interview — full startup simulation',
    focus: 'Complete a full startup interview simulation.',
    description: 'Combine all skills in a realistic startup interview experience.',
    goals: [
      'Complete a full mock interview with technical and behavioral rounds',
      'Receive feedback on communication and technical answers',
      'Identify remaining weak areas for targeted practice',
    ],
    isMilestone: true,
    topics: [
      { name: 'Technical mock round', category: 'communication', subcategory: 'mock', description: 'DSA, frontend, and system design questions in interview format.', resourceRoute: '/placement?view=mock-interviews', expectedMinutes: 60 },
      { name: 'Behavioral mock round', category: 'communication', subcategory: 'mock', description: 'Behavioral questions with STAR evaluation and feedback.', resourceRoute: '/placement?view=mock-interviews', expectedMinutes: 45 },
      { name: 'Feedback and improvement plan', category: 'communication', subcategory: 'mock', description: 'Review mock results and create targeted improvement plan.', resourceRoute: '/placement?view=readiness', expectedMinutes: 30 },
    ],
  },
  {
    dayNumber: 40,
    phase: 'Startup Interview Prep',
    title: 'Final preparation & application strategy',
    focus: 'Launch your job search with confidence.',
    description: 'Finalize your materials, apply strategically, and prepare for ongoing interviews.',
    goals: [
      'Finalize resume, GitHub, and portfolio',
      'Apply to 20 target companies with tailored applications',
      'Prepare for ongoing interview practice',
    ],
    isMilestone: true,
    topics: [
      { name: 'Application materials finalization', category: 'project', subcategory: 'profile', description: 'Polish resume, GitHub profile, LinkedIn, and portfolio.', resourceRoute: '/resume-optimizer', expectedMinutes: 60 },
      { name: 'Application strategy', category: 'project', subcategory: 'profile', description: 'Apply to 20 companies with tailored resumes and cover letters.', resourceRoute: '/placement?view=applications', expectedMinutes: 90 },
      { name: 'Interview pipeline management', category: 'project', subcategory: 'profile', description: 'Track applications, follow-ups, and interview schedules.', resourceRoute: '/placement?view=applications', expectedMinutes: 30 },
    ],
  },
]

export const PLACEMENT_DAYS: PlacementDay[] = PLACEMENT_DAY_DEFINITIONS.map((d) => ({
  id: `day-${d.dayNumber}`,
  programId: PLACEMENT_PROGRAM.id,
  dayNumber: d.dayNumber,
  phase: d.phase,
  title: d.title,
  focus: d.focus,
  description: d.description,
  goals: d.goals,
  isMilestone: d.isMilestone,
}))

export const PLACEMENT_TOPICS: PlacementTopic[] = PLACEMENT_DAY_DEFINITIONS.flatMap((d) =>
  d.topics.map((t, index) => ({
    id: `topic-${d.dayNumber}-${index + 1}`,
    programId: PLACEMENT_PROGRAM.id,
    dayId: `day-${d.dayNumber}`,
    name: t.name,
    category: t.category,
    subcategory: t.subcategory,
    description: t.description,
    resourceRoute: t.resourceRoute,
    expectedMinutes: t.expectedMinutes,
    orderIndex: index,
  })),
)

export const PLACEMENT_PHASES = [
  'Foundation',
  'Core Programming',
  'Intermediate DSA',
  'Interview Depth',
  'Frontend Interview Intensive',
  'Machine Coding',
  'Project & Deployment',
  'Full Mock',
  'Weakness Correction',
  'Final Assessment',
  'Startup Interview Prep',
] as const

/** Daily workload target. Admin-configurable; used to build "Today's priority". */
export const DEFAULT_DAILY_WORKLOAD = {
  aptitude: 10,
  reasoning: 10,
  technicalMcq: 10,
  dsa: 5,
  programming: 5,
  frontendPractice: 1,
  interviewAnswer: 1,
}

export function getDayDefinition(dayNumber: number): PlacementDayDefinition | undefined {
  return PLACEMENT_DAY_DEFINITIONS.find((d) => d.dayNumber === dayNumber)
}

export function getDayRangeForPhase(phase: string): number[] {
  return PLACEMENT_DAY_DEFINITIONS.filter((d) => d.phase === phase).map((d) => d.dayNumber)
}
