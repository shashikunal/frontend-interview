export interface AIGenAIPractical {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  requirements: string[]
  starterCode: string
  expectedOutput: string
  hints: string[]
  timeLimit: number
}

export const AI_GENAI_PRACTICALS: AIGenAIPractical[] = [
  {
    id: 'ai-practical-chat',
    title: 'Build AI Chat Interface',
    description: 'Create a React component that integrates with an LLM API to build a chat interface with streaming responses.',
    difficulty: 'medium',
    requirements: [
      'Create a chat UI with message history',
      'Integrate with an LLM API (OpenAI, Anthropic, or mock)',
      'Implement streaming responses',
      'Handle loading and error states',
      'Add retry functionality',
    ],
    starterCode: `function AIChat() {
  // Your code here
}`,
    expectedOutput: 'A working chat interface with streaming responses',
    hints: [
      'Use fetch with ReadableStream for streaming',
      'Store messages in state array',
      'Handle API errors gracefully',
    ],
    timeLimit: 45,
  },
  {
    id: 'ai-practical-structured-output',
    title: 'Implement Structured Output',
    description: 'Create a function that calls an LLM API and validates the response against a JSON schema.',
    difficulty: 'medium',
    requirements: [
      'Call an LLM API with structured output',
      'Validate response against a schema',
      'Handle malformed responses',
      'Implement retry logic',
    ],
    starterCode: `async function getStructuredOutput(prompt, schema) {
  // Your code here
}`,
    expectedOutput: 'Validated structured data from LLM',
    hints: [
      'Use JSON mode or function calling',
      'Validate with Zod or JSON Schema',
      'Implement exponential backoff for retries',
    ],
    timeLimit: 30,
  },
  {
    id: 'ai-practical-rag',
    title: 'Build Simple RAG Pipeline',
    description: 'Create a RAG pipeline that retrieves relevant documents and includes them in the LLM prompt.',
    difficulty: 'hard',
    requirements: [
      'Chunk documents into smaller pieces',
      'Generate embeddings for chunks',
      'Implement similarity search',
      'Include retrieved context in prompt',
      'Handle large documents',
    ],
    starterCode: `async function ragQuery(question, documents) {
  // Your code here
}`,
    expectedOutput: 'LLM response with retrieved context',
    hints: [
      'Use a simple embedding model or API',
      'Implement cosine similarity for search',
      'Chunk documents by paragraphs or fixed size',
    ],
    timeLimit: 60,
  },
  {
    id: 'ai-practical-prompt-optimization',
    title: 'Optimize Prompts for Better Output',
    description: 'Create a system that tests and optimizes prompts for specific tasks.',
    difficulty: 'easy',
    requirements: [
      'Create a prompt template system',
      'Test multiple prompt variations',
      'Evaluate output quality',
      'Select the best performing prompt',
    ],
    starterCode: `async function optimizePrompt(task, variations) {
  // Your code here
}`,
    expectedOutput: 'Best performing prompt for the task',
    hints: [
      'Use a scoring function to evaluate outputs',
      'Test with multiple examples',
      'Consider few-shot vs zero-shot approaches',
    ],
    timeLimit: 30,
  },
  {
    id: 'ai-practical-function-calling',
    title: 'Implement Function Calling',
    description: 'Create a system that allows an LLM to call predefined functions based on user input.',
    difficulty: 'hard',
    requirements: [
      'Define available functions with schemas',
      'Parse LLM function call requests',
      'Execute the requested function',
      'Return results to the LLM',
      'Handle errors and edge cases',
    ],
    starterCode: `async function functionCalling(userInput, functions) {
  // Your code here
}`,
    expectedOutput: 'LLM response with function execution results',
    hints: [
      'Use OpenAI or Anthropic function calling API',
      'Validate function arguments',
      'Handle missing or invalid parameters',
    ],
    timeLimit: 60,
  },
  {
    id: 'ai-practical-embeddings',
    title: 'Generate and Compare Embeddings',
    description: 'Create a function that generates embeddings for text and finds similar texts.',
    difficulty: 'medium',
    requirements: [
      'Generate embeddings for input texts',
      'Implement cosine similarity calculation',
      'Find the most similar text',
      'Handle batch processing',
    ],
    starterCode: `async function findSimilarTexts(query, texts) {
  // Your code here
}`,
    expectedOutput: 'Most similar text to the query',
    hints: [
      'Use an embedding API or library',
      'Implement cosine similarity: dot product / (magnitude * magnitude)',
      'Normalize vectors before comparison',
    ],
    timeLimit: 30,
  },
  {
    id: 'ai-practical-rate-limiter',
    title: 'Implement API Rate Limiter',
    description: 'Create a rate limiter for LLM API calls to prevent exceeding quotas.',
    difficulty: 'medium',
    requirements: [
      'Track API calls per time window',
      'Implement token bucket or sliding window',
      'Queue requests when limit is reached',
      'Handle burst traffic',
    ],
    starterCode: `class RateLimiter {
  // Your code here
}`,
    expectedOutput: 'Rate-limited API calls',
    hints: [
      'Use a queue for pending requests',
      'Track timestamps of recent calls',
      'Implement exponential backoff',
    ],
    timeLimit: 30,
  },
  {
    id: 'ai-practical-evaluation',
    title: 'Build LLM Output Evaluator',
    description: 'Create a system that evaluates LLM outputs for quality, accuracy, and relevance.',
    difficulty: 'medium',
    requirements: [
      'Define evaluation criteria',
      'Score outputs on multiple dimensions',
      'Aggregate scores',
      'Generate evaluation reports',
    ],
    starterCode: `async function evaluateOutput(output, criteria) {
  // Your code here
}`,
    expectedOutput: 'Evaluation scores and feedback',
    hints: [
      'Use another LLM for evaluation (LLM-as-judge)',
      'Define clear scoring rubrics',
      'Consider multiple evaluation dimensions',
    ],
    timeLimit: 45,
  },
]

export function getAIGenAIPractical(id: string): AIGenAIPractical | undefined {
  return AI_GENAI_PRACTICALS.find((p) => p.id === id)
}

export function getAIGenAIPracticalsByDifficulty(difficulty: string): AIGenAIPractical[] {
  return AI_GENAI_PRACTICALS.filter((p) => p.difficulty === difficulty)
}
