/**
 * DSA pattern catalog.
 *
 * Placement DSA preparation is pattern-first: 20 patterns, 80–100 curated
 * problems. Execution happens in the existing DSA studio (`/dsa`) — this file
 * is the syllabus and progress map, not a second coding environment.
 */
export interface PlacementDSAProblem {
  id: string
  title: string
  difficulty: 'easy' | 'easy-medium' | 'medium' | 'hard'
  hint: string
  route: string
}

export interface PlacementDSAPattern {
  id: string
  name: string
  subcategory: string
  summary: string
  whenToUse: string
  timeComplexity: string
  spaceComplexity: string
  dayNumber: number
  problems: PlacementDSAProblem[]
}

export const PLACEMENT_DSA_PATTERNS: PlacementDSAPattern[] = [
  {
    id: 'pat-arrays',
    name: 'Arrays & Hashing',
    subcategory: 'arrays',
    summary: 'Linear scans, in-place updates and frequency maps.',
    whenToUse: 'The problem mentions counts, duplicates, pair sums or grouping.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    dayNumber: 2,
    problems: [
      { id: 'dsa-arr-1', title: 'Two Sum', difficulty: 'easy', hint: 'Store seen values in a map and look for the complement.', route: '/dsa/questions' },
      { id: 'dsa-arr-2', title: 'Contains Duplicate', difficulty: 'easy', hint: 'A set gives O(n) duplicate detection.', route: '/dsa/questions' },
      { id: 'dsa-arr-3', title: 'Best Time to Buy and Sell Stock', difficulty: 'easy', hint: 'Track the minimum price seen so far while scanning.', route: '/dsa/questions' },
      { id: 'dsa-arr-4', title: 'Product of Array Except Self', difficulty: 'medium', hint: 'Prefix products from both directions, no division.', route: '/dsa/questions' },
      { id: 'dsa-arr-5', title: 'Majority Element', difficulty: 'easy', hint: 'Boyer-Moore voting or a frequency map.', route: '/dsa/questions' },
    ],
  },
  {
    id: 'pat-strings',
    name: 'Strings',
    subcategory: 'strings',
    summary: 'Character windows, frequency tables and two-pointer checks.',
    whenToUse: 'The input is text and the answer involves substrings, anagrams or palindromes.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k) for a fixed alphabet',
    dayNumber: 2,
    problems: [
      { id: 'dsa-str-1', title: 'Valid Anagram', difficulty: 'easy', hint: 'Compare two frequency tables.', route: '/dsa/questions' },
      { id: 'dsa-str-2', title: 'Valid Palindrome', difficulty: 'easy', hint: 'Two pointers moving inward, skipping non-alphanumerics.', route: '/dsa/questions' },
      { id: 'dsa-str-3', title: 'Longest Common Prefix', difficulty: 'easy', hint: 'Compare character by character across all strings.', route: '/dsa/questions' },
      { id: 'dsa-str-4', title: 'Longest Substring Without Repeating Characters', difficulty: 'medium', hint: 'Variable window with a last-seen index map.', route: '/dsa/questions' },
    ],
  },
  {
    id: 'pat-hashmap',
    name: 'HashMap & HashSet',
    subcategory: 'hashmap',
    summary: 'Frequency counting, grouping and O(1) lookups.',
    whenToUse: 'You need to count, group, or look up a complement in one pass.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    dayNumber: 6,
    problems: [
      { id: 'dsa-map-1', title: 'Group Anagrams', difficulty: 'medium', hint: 'Use the sorted string (or a character count key) as the group key.', route: '/dsa/questions' },
      { id: 'dsa-map-2', title: 'Top K Frequent Elements', difficulty: 'medium', hint: 'Count with a map, then bucket sort or use a heap.', route: '/dsa/questions' },
      { id: 'dsa-map-3', title: 'Longest Consecutive Sequence', difficulty: 'medium', hint: 'Only start counting at numbers whose predecessor is missing.', route: '/dsa/questions' },
      { id: 'dsa-map-4', title: 'Subarray Sum Equals K', difficulty: 'medium', hint: 'Prefix sums with a frequency map of earlier sums.', route: '/dsa/questions' },
      { id: 'dsa-map-5', title: 'Intersection of Two Arrays', difficulty: 'easy', hint: 'Put one array in a set and filter the other.', route: '/dsa/questions' },
    ],
  },
  {
    id: 'pat-two-pointer',
    name: 'Two Pointer',
    subcategory: 'two-pointer',
    summary: 'Opposite ends, fast/slow or same-direction pointers on sorted input.',
    whenToUse: 'The input is sorted, or you are comparing pairs, or you need in-place compaction.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    dayNumber: 7,
    problems: [
      { id: 'dsa-tp-1', title: 'Two Sum II (sorted input)', difficulty: 'easy', hint: 'Move the pointer on the side that reduces the sum.', route: '/dsa/questions' },
      { id: 'dsa-tp-2', title: 'Container With Most Water', difficulty: 'medium', hint: 'Move the shorter line inward — that is the only way to possibly improve.', route: '/dsa/questions' },
      { id: 'dsa-tp-3', title: 'Remove Duplicates from Sorted Array', difficulty: 'easy', hint: 'A slow pointer marks the write position.', route: '/dsa/questions' },
      { id: 'dsa-tp-4', title: '3Sum', difficulty: 'medium', hint: 'Sort, fix one element, then two-sum the rest.', route: '/dsa/questions' },
    ],
  },
  {
    id: 'pat-sliding-window',
    name: 'Sliding Window',
    subcategory: 'sliding-window',
    summary: 'Expand the right edge, contract the left edge to maintain an invariant.',
    whenToUse: 'The problem asks for a contiguous subarray or substring with a constraint.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k)',
    dayNumber: 7,
    problems: [
      { id: 'dsa-sw-1', title: 'Maximum Average Subarray I', difficulty: 'easy', hint: 'Fixed window of size k, slide and subtract the outgoing value.', route: '/dsa/questions' },
      { id: 'dsa-sw-2', title: 'Longest Substring Without Repeating Characters', difficulty: 'medium', hint: 'Variable window with a seen-index map.', route: '/dsa/questions' },
      { id: 'dsa-sw-3', title: 'Minimum Size Subarray Sum', difficulty: 'medium', hint: 'Expand while sum is too small, contract while it is enough.', route: '/dsa/questions' },
      { id: 'dsa-sw-4', title: 'Permutation in String', difficulty: 'medium', hint: 'Fixed window of length n with a character count comparison.', route: '/dsa/questions' },
    ],
  },
  {
    id: 'pat-binary-search',
    name: 'Binary Search',
    subcategory: 'binary-search',
    summary: 'Halve a monotone search space; also "binary search on the answer".',
    whenToUse: 'The search space is sorted, or the answer is monotone (feasible above a threshold).',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    dayNumber: 8,
    problems: [
      { id: 'dsa-bs-1', title: 'Binary Search', difficulty: 'easy', hint: 'Keep the invariant: the target, if present, stays inside [lo, hi].', route: '/dsa/questions' },
      { id: 'dsa-bs-2', title: 'Search Insert Position', difficulty: 'easy', hint: 'Find the first index where the value is not less than the target.', route: '/dsa/questions' },
      { id: 'dsa-bs-3', title: 'First and Last Position in Sorted Array', difficulty: 'medium', hint: 'Run binary search twice — lower bound and upper bound.', route: '/dsa/questions' },
      { id: 'dsa-bs-4', title: 'Search in Rotated Sorted Array', difficulty: 'medium', hint: 'At every step one half is sorted; decide with that half.', route: '/dsa/questions' },
      { id: 'dsa-bs-5', title: 'Find Minimum in Rotated Sorted Array', difficulty: 'medium', hint: 'Compare mid with the right edge to choose a direction.', route: '/dsa/questions' },
    ],
  },
  {
    id: 'pat-stack',
    name: 'Stack & Monotonic Stack',
    subcategory: 'stack',
    summary: 'LIFO matching and "next greater element" patterns.',
    whenToUse: 'Nested structures, matching pairs, or "next greater/smaller" questions.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    dayNumber: 11,
    problems: [
      { id: 'dsa-st-1', title: 'Valid Parentheses', difficulty: 'easy', hint: 'Push opening brackets; pop and compare on closing ones.', route: '/dsa/questions' },
      { id: 'dsa-st-2', title: 'Min Stack', difficulty: 'medium', hint: 'Keep a parallel stack of running minimums.', route: '/dsa/questions' },
      { id: 'dsa-st-3', title: 'Daily Temperatures', difficulty: 'medium', hint: 'Monotonic decreasing stack of indices.', route: '/dsa/questions' },
      { id: 'dsa-st-4', title: 'Next Greater Element', difficulty: 'medium', hint: 'Same monotonic stack, store results by index.', route: '/dsa/questions' },
      { id: 'dsa-st-5', title: 'Evaluate Reverse Polish Notation', difficulty: 'medium', hint: 'Push operands; apply operators to the top two.', route: '/dsa/questions' },
    ],
  },
  {
    id: 'pat-queue',
    name: 'Queue & Deque',
    subcategory: 'queue',
    summary: 'FIFO processing and sliding-window maximum with a monotonic deque.',
    whenToUse: 'Level-order processing, scheduling, or a windowed maximum/minimum.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    dayNumber: 11,
    problems: [
      { id: 'dsa-q-1', title: 'Implement Queue using Stacks', difficulty: 'easy', hint: 'Two stacks; make the amortised cost O(1).', route: '/dsa/questions' },
      { id: 'dsa-q-2', title: 'Sliding Window Maximum', difficulty: 'hard', hint: 'Monotonic deque of indices; pop from the back when smaller.', route: '/dsa/questions' },
      { id: 'dsa-q-3', title: 'Number of Recent Calls', difficulty: 'easy', hint: 'A plain queue with timestamps is enough.', route: '/dsa/questions' },
    ],
  },
  {
    id: 'pat-linked-list',
    name: 'Linked Lists',
    subcategory: 'linked-list',
    summary: 'Pointer rewiring, dummy heads and fast/slow pointers.',
    whenToUse: 'The input is a linked list, or the problem asks about cycles and midpoints.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    dayNumber: 12,
    problems: [
      { id: 'dsa-ll-1', title: 'Reverse Linked List', difficulty: 'easy', hint: 'prev, curr, next — rewire then advance.', route: '/dsa/questions' },
      { id: 'dsa-ll-2', title: 'Merge Two Sorted Lists', difficulty: 'easy', hint: 'A dummy head removes all the null edge cases.', route: '/dsa/questions' },
      { id: 'dsa-ll-3', title: 'Linked List Cycle', difficulty: 'easy', hint: 'Floyd\'s tortoise and hare.', route: '/dsa/questions' },
      { id: 'dsa-ll-4', title: 'Middle of the Linked List', difficulty: 'easy', hint: 'Slow moves 1, fast moves 2.', route: '/dsa/questions' },
      { id: 'dsa-ll-5', title: 'Remove Nth Node From End', difficulty: 'medium', hint: 'Advance a fast pointer by n, then move both.', route: '/dsa/questions' },
      { id: 'dsa-ll-6', title: 'Add Two Numbers', difficulty: 'medium', hint: 'Walk both lists with a carry.', route: '/dsa/questions' },
    ],
  },
  {
    id: 'pat-recursion',
    name: 'Recursion & Backtracking',
    subcategory: 'recursion',
    summary: 'Define the base case first, then the choice/undo pair.',
    whenToUse: 'The problem asks for all combinations, permutations or a decision tree.',
    timeComplexity: 'O(2^n) to O(n!) typically',
    spaceComplexity: 'O(n) for the recursion depth',
    dayNumber: 13,
    problems: [
      { id: 'dsa-rec-1', title: 'Subsets', difficulty: 'medium', hint: 'Include or exclude each element; carry a path array.', route: '/dsa/questions' },
      { id: 'dsa-rec-2', title: 'Permutations', difficulty: 'medium', hint: 'Swap-based backtracking with a used[] array.', route: '/dsa/questions' },
      { id: 'dsa-rec-3', title: 'Combination Sum', difficulty: 'medium', hint: 'Recurse with the same index to allow reuse.', route: '/dsa/questions' },
      { id: 'dsa-rec-4', title: 'Generate Parentheses', difficulty: 'medium', hint: 'Track open and close counts as the pruning condition.', route: '/dsa/questions' },
    ],
  },
  {
    id: 'pat-prefix-sum',
    name: 'Prefix Sum & Intervals',
    subcategory: 'prefix-sum',
    summary: 'Precomputed ranges and sorted-interval merging.',
    whenToUse: 'Repeated range queries, or the input is a list of intervals.',
    timeComplexity: 'O(n) build, O(1) query',
    spaceComplexity: 'O(n)',
    dayNumber: 13,
    problems: [
      { id: 'dsa-pf-1', title: 'Range Sum Query', difficulty: 'easy', hint: 'prefix[i] = sum of the first i elements.', route: '/dsa/questions' },
      { id: 'dsa-pf-2', title: 'Find Pivot Index', difficulty: 'easy', hint: 'Left sum = total - left sum - nums[i].', route: '/dsa/questions' },
      { id: 'dsa-pf-3', title: 'Merge Intervals', difficulty: 'medium', hint: 'Sort by start, then merge while overlapping.', route: '/dsa/questions' },
      { id: 'dsa-pf-4', title: 'Insert Interval', difficulty: 'medium', hint: 'Copy non-overlapping left, merge the middle, copy the right.', route: '/dsa/questions' },
    ],
  },
  {
    id: 'pat-trees',
    name: 'Trees',
    subcategory: 'trees',
    summary: 'Recursive traversals, level-order BFS and BST invariants.',
    whenToUse: 'Hierarchical data, or the problem mentions BST, depth or levels.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) for recursion, O(w) for BFS',
    dayNumber: 14,
    problems: [
      { id: 'dsa-tr-1', title: 'Binary Tree Inorder Traversal', difficulty: 'easy', hint: 'Left, node, right — recursive then iterative with a stack.', route: '/dsa/questions' },
      { id: 'dsa-tr-2', title: 'Maximum Depth of Binary Tree', difficulty: 'easy', hint: '1 + max(left, right).', route: '/dsa/questions' },
      { id: 'dsa-tr-3', title: 'Level Order Traversal', difficulty: 'medium', hint: 'BFS with a queue, process one level per iteration.', route: '/dsa/questions' },
      { id: 'dsa-tr-4', title: 'Invert Binary Tree', difficulty: 'easy', hint: 'Swap children recursively.', route: '/dsa/questions' },
      { id: 'dsa-tr-5', title: 'Validate Binary Search Tree', difficulty: 'medium', hint: 'Carry a valid (min, max) range down the recursion.', route: '/dsa/questions' },
      { id: 'dsa-tr-6', title: 'Lowest Common Ancestor of a BST', difficulty: 'medium', hint: 'Walk down until the split happens.', route: '/dsa/questions' },
    ],
  },
  {
    id: 'pat-heap',
    name: 'Heap / Priority Queue',
    subcategory: 'heap',
    summary: 'Top-K selection and streaming median.',
    whenToUse: 'The problem says "kth largest", "top k" or "median of a stream".',
    timeComplexity: 'O(n log k)',
    spaceComplexity: 'O(k)',
    dayNumber: 16,
    problems: [
      { id: 'dsa-hp-1', title: 'Kth Largest Element in an Array', difficulty: 'medium', hint: 'A min-heap of size k.', route: '/dsa/questions' },
      { id: 'dsa-hp-2', title: 'Top K Frequent Elements', difficulty: 'medium', hint: 'Frequency map then a heap of size k.', route: '/dsa/questions' },
      { id: 'dsa-hp-3', title: 'Last Stone Weight', difficulty: 'easy', hint: 'A max-heap; repeatedly smash the two heaviest.', route: '/dsa/questions' },
      { id: 'dsa-hp-4', title: 'Find Median from Data Stream', difficulty: 'hard', hint: 'Two heaps: a max-heap for the lower half and a min-heap for the upper half.', route: '/dsa/questions' },
    ],
  },
  {
    id: 'pat-graphs',
    name: 'Graphs — BFS & DFS',
    subcategory: 'graphs',
    summary: 'Adjacency lists, visited sets and grid traversal.',
    whenToUse: 'Connected components, shortest unweighted path, or a grid of cells.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    dayNumber: 17,
    problems: [
      { id: 'dsa-gr-1', title: 'Number of Islands', difficulty: 'medium', hint: 'DFS or BFS flood fill; count the times you start a traversal.', route: '/dsa/questions' },
      { id: 'dsa-gr-2', title: 'Clone Graph', difficulty: 'medium', hint: 'BFS with a map from original node to clone.', route: '/dsa/questions' },
      { id: 'dsa-gr-3', title: 'Course Schedule', difficulty: 'medium', hint: 'Topological sort; detect a cycle with DFS colours or indegrees.', route: '/dsa/questions' },
      { id: 'dsa-gr-4', title: 'Max Area of Island', difficulty: 'medium', hint: 'Flood fill and track the largest component size.', route: '/dsa/questions' },
      { id: 'dsa-gr-5', title: 'Rotting Oranges', difficulty: 'medium', hint: 'Multi-source BFS from every rotten orange.', route: '/dsa/questions' },
    ],
  },
  {
    id: 'pat-greedy',
    name: 'Greedy',
    subcategory: 'greedy',
    summary: 'Make the locally optimal choice and prove it stays optimal.',
    whenToUse: 'Interval scheduling, resource allocation or "minimum/maximum" with a sort.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1) to O(n)',
    dayNumber: 18,
    problems: [
      { id: 'dsa-gd-1', title: 'Best Time to Buy and Sell Stock II', difficulty: 'medium', hint: 'Take every upward step.', route: '/dsa/questions' },
      { id: 'dsa-gd-2', title: 'Jump Game', difficulty: 'medium', hint: 'Track the farthest reachable index.', route: '/dsa/questions' },
      { id: 'dsa-gd-3', title: 'Assign Cookies', difficulty: 'easy', hint: 'Sort both; satisfy the greediest child you can.', route: '/dsa/questions' },
      { id: 'dsa-gd-4', title: 'Non-overlapping Intervals', difficulty: 'medium', hint: 'Sort by end time and always keep the earliest finishing interval.', route: '/dsa/questions' },
    ],
  },
  {
    id: 'pat-dp',
    name: 'Dynamic Programming — 1D',
    subcategory: 'dynamic-programming',
    summary: 'Define the state, write the recurrence, then tabulate.',
    whenToUse: 'Optimal value over choices with overlapping subproblems (ways to reach, min/max cost).',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n), optimisable to O(1)',
    dayNumber: 18,
    problems: [
      { id: 'dsa-dp-1', title: 'Climbing Stairs', difficulty: 'easy', hint: 'dp[i] = dp[i-1] + dp[i-2].', route: '/dsa/questions' },
      { id: 'dsa-dp-2', title: 'House Robber', difficulty: 'medium', hint: 'dp[i] = max(dp[i-1], dp[i-2] + nums[i]).', route: '/dsa/questions' },
      { id: 'dsa-dp-3', title: 'Coin Change', difficulty: 'medium', hint: 'dp[a] = min coins for amount a; iterate amounts outer, coins inner.', route: '/dsa/questions' },
      { id: 'dsa-dp-4', title: 'Maximum Subarray (Kadane)', difficulty: 'medium', hint: 'Local best ending here vs starting fresh.', route: '/dsa/questions' },
    ],
  },
  {
    id: 'pat-matrix',
    name: 'Matrices',
    subcategory: 'arrays',
    summary: 'In-place rotation, spiral order and boundary walks.',
    whenToUse: 'The input is a 2D grid with structural operations.',
    timeComplexity: 'O(m x n)',
    spaceComplexity: 'O(1) when in place',
    dayNumber: 15,
    problems: [
      { id: 'dsa-mx-1', title: 'Rotate Image', difficulty: 'medium', hint: 'Transpose then reverse each row.', route: '/dsa/questions' },
      { id: 'dsa-mx-2', title: 'Set Matrix Zeroes', difficulty: 'medium', hint: 'Use the first row and column as marker storage.', route: '/dsa/questions' },
      { id: 'dsa-mx-3', title: 'Spiral Matrix', difficulty: 'medium', hint: 'Shrink four boundaries after each pass.', route: '/dsa/questions' },
    ],
  },
  {
    id: 'pat-bit',
    name: 'Bit Manipulation',
    subcategory: 'arrays',
    summary: 'XOR identities and bit masks.',
    whenToUse: 'The problem mentions duplicates, missing numbers or powers of two.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    dayNumber: 15,
    problems: [
      { id: 'dsa-bit-1', title: 'Single Number', difficulty: 'easy', hint: 'XOR of a number with itself is 0.', route: '/dsa/questions' },
      { id: 'dsa-bit-2', title: 'Number of 1 Bits', difficulty: 'easy', hint: 'n = n & (n - 1) clears the lowest set bit.', route: '/dsa/questions' },
      { id: 'dsa-bit-3', title: 'Missing Number', difficulty: 'easy', hint: 'XOR all indices and all values.', route: '/dsa/questions' },
    ],
  },
  {
    id: 'pat-design',
    name: 'Data Structure Design',
    subcategory: 'stack-queue',
    summary: 'Combine existing structures to satisfy an API.',
    whenToUse: 'The problem asks you to implement a class with several operations.',
    timeComplexity: 'Depends on the operation mix',
    spaceComplexity: 'O(n)',
    dayNumber: 16,
    problems: [
      { id: 'dsa-ds-1', title: 'LRU Cache', difficulty: 'medium', hint: 'HashMap for lookup plus a doubly linked list for recency.', route: '/dsa/questions' },
      { id: 'dsa-ds-2', title: 'Min Stack', difficulty: 'medium', hint: 'Store the running minimum alongside each entry.', route: '/dsa/questions' },
      { id: 'dsa-ds-3', title: 'Two Sum — data structure version', difficulty: 'medium', hint: 'Store value to index in a map as you add.', route: '/dsa/questions' },
    ],
  },
  {
    id: 'pat-misc',
    name: 'Math & Miscellaneous',
    subcategory: 'arrays',
    summary: 'Floyd cycle detection, string parsing and simple simulation.',
    whenToUse: 'None of the standard patterns apply and the problem is algorithmic but small.',
    timeComplexity: 'Problem dependent',
    spaceComplexity: 'Problem dependent',
    dayNumber: 19,
    problems: [
      { id: 'dsa-ms-1', title: 'Happy Number', difficulty: 'easy', hint: 'Cycle detection with a set or Floyd\'s algorithm.', route: '/dsa/questions' },
      { id: 'dsa-ms-2', title: 'Plus One', difficulty: 'easy', hint: 'Handle the carry propagating through trailing nines.', route: '/dsa/questions' },
      { id: 'dsa-ms-3', title: 'Reverse Integer', difficulty: 'medium', hint: 'Pop digits and check for overflow before pushing.', route: '/dsa/questions' },
      { id: 'dsa-ms-4', title: 'Valid Sudoku', difficulty: 'medium', hint: 'Three sets per row/column/box while scanning once.', route: '/dsa/questions' },
    ],
  },
]

export const PLACEMENT_DSA_PROBLEM_COUNT = PLACEMENT_DSA_PATTERNS.reduce(
  (total, pattern) => total + pattern.problems.length,
  0,
)

export function getDSAPatternBySubcategory(subcategory: string): PlacementDSAPattern[] {
  return PLACEMENT_DSA_PATTERNS.filter((p) => p.subcategory === subcategory)
}

export function getDSAPatternsForDay(dayNumber: number): PlacementDSAPattern[] {
  return PLACEMENT_DSA_PATTERNS.filter((p) => p.dayNumber === dayNumber)
}
