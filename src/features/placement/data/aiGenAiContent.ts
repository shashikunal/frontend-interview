export interface AIGenAITopic {
  id: string
  name: string
  theory: string
  keyPoints: string[]
  practicalTasks: string[]
  interviewQuestions: string[]
  followUps: string[]
}

export interface AIGenAIChapter {
  id: string
  name: string
  topics: AIGenAITopic[]
}

export const AI_GENAI_CONTENT: AIGenAIChapter[] = [
  {
    id: 'ai-fundamentals',
    name: 'AI Fundamentals',
    topics: [
      {
        id: 'ai-vs-ml-vs-genai',
        name: 'AI vs ML vs GenAI',
        theory: 'Artificial Intelligence (AI) is the broad field of creating intelligent machines. Machine Learning (ML) is a subset of AI where systems learn from data. Generative AI (GenAI) is a subset of ML that generates new content like text, images, or code.',
        keyPoints: [
          'AI: Broad field of intelligent machines',
          'ML: Systems that learn from data',
          'GenAI: ML that generates new content',
          'LLMs: Large Language Models power GenAI',
        ],
        practicalTasks: [
          'Compare outputs from different AI models',
          'Identify AI vs ML vs GenAI use cases',
        ],
        interviewQuestions: [
          'What is the difference between AI, ML, and GenAI?',
          'What are the limitations of current AI systems?',
        ],
        followUps: [
          'How do LLMs differ from traditional ML models?',
          'What are the ethical implications of GenAI?',
        ],
      },
      {
        id: 'llm-basics',
        name: 'LLM Fundamentals',
        theory: 'Large Language Models (LLMs) are neural networks trained on vast amounts of text data. They use transformer architecture with attention mechanisms to understand and generate human-like text. Key concepts include tokens, context windows, and temperature.',
        keyPoints: [
          'Transformer architecture with attention',
          'Tokens: Basic units of text (words/subwords)',
          'Context window: Maximum tokens the model can process',
          'Temperature: Controls randomness in output',
        ],
        practicalTasks: [
          'Use an LLM API to generate text',
          'Experiment with different temperature values',
        ],
        interviewQuestions: [
          'What is a token in the context of LLMs?',
          'What is a context window and why does it matter?',
        ],
        followUps: [
          'How does temperature affect LLM output?',
          'What are the limitations of context windows?',
        ],
      },
      {
        id: 'prompt-engineering',
        name: 'Prompt Engineering',
        theory: 'Prompt engineering is the craft of designing inputs to LLMs to get desired outputs. Key techniques include few-shot learning, chain-of-thought prompting, and system prompts. Good prompts are clear, specific, and provide context.',
        keyPoints: [
          'System prompt: Sets behavior and context',
          'Few-shot learning: Providing examples in the prompt',
          'Chain-of-thought: Asking the model to think step by step',
          'Clear and specific instructions yield better results',
        ],
        practicalTasks: [
          'Write prompts for different use cases',
          'Compare zero-shot vs few-shot prompting',
        ],
        interviewQuestions: [
          'What is prompt engineering?',
          'How do you write effective prompts?',
        ],
        followUps: [
          'What is chain-of-thought prompting?',
          'How do you handle prompt injection attacks?',
        ],
      },
    ],
  },
  {
    id: 'ai-apis',
    name: 'AI APIs & Integration',
    topics: [
      {
        id: 'llm-api-basics',
        name: 'LLM API Basics',
        theory: 'LLM APIs provide programmatic access to language models. Common APIs include OpenAI, Anthropic, and open-source alternatives. Key concepts include API keys, rate limits, streaming, and structured output.',
        keyPoints: [
          'API keys for authentication',
          'Rate limits and quotas',
          'Streaming responses for real-time output',
          'Structured output with JSON schemas',
        ],
        practicalTasks: [
          'Make API calls to an LLM',
          'Implement streaming responses',
        ],
        interviewQuestions: [
          'How do you integrate an LLM API into an application?',
          'What are the challenges of using LLM APIs in production?',
        ],
        followUps: [
          'How do you handle API failures and retries?',
          'What are the cost considerations for LLM APIs?',
        ],
      },
      {
        id: 'structured-output',
        name: 'Structured Output',
        theory: 'Structured output allows LLMs to return data in a specific format like JSON. This is essential for building reliable AI applications. Techniques include JSON mode, function calling, and schema validation.',
        keyPoints: [
          'JSON mode: Forces valid JSON output',
          'Function calling: LLM can call predefined functions',
          'Schema validation: Ensures output matches expected format',
          'Zod/JSON Schema for type safety',
        ],
        practicalTasks: [
          'Implement structured output with validation',
          'Build a function calling system',
        ],
        interviewQuestions: [
          'What is structured output and why is it important?',
          'How do you validate LLM output?',
        ],
        followUps: [
          'What is function calling?',
          'How do you handle malformed LLM output?',
        ],
      },
    ],
  },
  {
    id: 'rag',
    name: 'RAG & Vector Databases',
    topics: [
      {
        id: 'rag-basics',
        name: 'RAG Fundamentals',
        theory: 'Retrieval-Augmented Generation (RAG) combines LLMs with external knowledge. It retrieves relevant documents using vector search, then includes them in the prompt. This reduces hallucinations and provides up-to-date information.',
        keyPoints: [
          'Retrieval: Find relevant documents using embeddings',
          'Augmentation: Include retrieved context in the prompt',
          'Generation: LLM generates response with context',
          'Reduces hallucinations and improves accuracy',
        ],
        practicalTasks: [
          'Build a simple RAG pipeline',
          'Implement document chunking and embedding',
        ],
        interviewQuestions: [
          'What is RAG and how does it work?',
          'What are the benefits of RAG over fine-tuning?',
        ],
        followUps: [
          'How do you choose the right chunk size?',
          'What are the challenges of RAG in production?',
        ],
      },
      {
        id: 'embeddings',
        name: 'Embeddings & Vector Search',
        theory: 'Embeddings are numerical representations of text that capture semantic meaning. Vector databases store and search these embeddings efficiently. Similar texts have similar embeddings, enabling semantic search.',
        keyPoints: [
          'Embeddings: Dense vector representations of text',
          'Vector databases: Optimized for similarity search',
          'Cosine similarity: Measures similarity between vectors',
          'Semantic search: Find meaningfully similar content',
        ],
        practicalTasks: [
          'Generate embeddings for text',
          'Implement semantic search',
        ],
        interviewQuestions: [
          'What are embeddings?',
          'How do vector databases work?',
        ],
        followUps: [
          'What is cosine similarity?',
          'How do you choose a vector database?',
        ],
      },
    ],
  },
  {
    id: 'ai-security',
    name: 'AI Security',
    topics: [
      {
        id: 'prompt-injection',
        name: 'Prompt Injection',
        theory: 'Prompt injection is an attack where malicious input manipulates an LLM into performing unintended actions. Defense techniques include input validation, system prompts, and output filtering.',
        keyPoints: [
          'Direct injection: Malicious input in user prompts',
          'Indirect injection: Malicious content in retrieved data',
          'Defense: Input validation and system prompts',
          'Output filtering: Sanitize LLM responses',
        ],
        practicalTasks: [
          'Identify prompt injection vulnerabilities',
          'Implement input validation',
        ],
        interviewQuestions: [
          'What is prompt injection?',
          'How do you defend against prompt injection attacks?',
        ],
        followUps: [
          'What is the difference between direct and indirect injection?',
          'How do you test for prompt injection vulnerabilities?',
        ],
      },
      {
        id: 'ai-ethics',
        name: 'AI Ethics & Bias',
        theory: 'AI systems can perpetuate biases present in training data. Ethical AI requires transparency, fairness, and accountability. Key concerns include bias, privacy, and misuse.',
        keyPoints: [
          'Bias: AI can reflect training data biases',
          'Transparency: Users should know when they interact with AI',
          'Privacy: AI systems must protect user data',
          'Accountability: Clear responsibility for AI decisions',
        ],
        practicalTasks: [
          'Identify potential biases in AI outputs',
          'Implement transparency measures',
        ],
        interviewQuestions: [
          'What are the ethical concerns with AI?',
          'How do you address bias in AI systems?',
        ],
        followUps: [
          'What is algorithmic fairness?',
          'How do you ensure AI transparency?',
        ],
      },
    ],
  },
  {
    id: 'ai-applications',
    name: 'AI Applications',
    topics: [
      {
        id: 'ai-chat',
        name: 'Building AI Chat',
        theory: 'AI chat applications combine LLMs with conversation management. Key features include message history, streaming responses, and context management. Production apps need error handling and rate limiting.',
        keyPoints: [
          'Message history: Store conversation context',
          'Streaming: Real-time response display',
          'Context management: Handle long conversations',
          'Error handling: Graceful failure recovery',
        ],
        practicalTasks: [
          'Build a chat interface with streaming',
          'Implement conversation history',
        ],
        interviewQuestions: [
          'How do you build an AI chat application?',
          'What are the challenges of streaming LLM responses?',
        ],
        followUps: [
          'How do you handle long conversations?',
          'What are the cost considerations for AI chat?',
        ],
      },
      {
        id: 'ai-code-assistant',
        name: 'AI Code Assistants',
        theory: 'AI code assistants help developers write, review, and debug code. They use LLMs trained on code to provide suggestions, explanations, and automated fixes.',
        keyPoints: [
          'Code completion: Suggest code as you type',
          'Code explanation: Explain complex code',
          'Code review: Identify potential issues',
          'Debugging: Suggest fixes for errors',
        ],
        practicalTasks: [
          'Use an AI assistant to debug code',
          'Implement code explanation feature',
        ],
        interviewQuestions: [
          'How do AI code assistants work?',
          'What are the limitations of AI code generation?',
        ],
        followUps: [
          'How do you ensure AI-generated code quality?',
          'What are the security concerns with AI code assistants?',
        ],
      },
    ],
  },
]

export function getAIGenAIChapter(id: string): AIGenAIChapter | undefined {
  return AI_GENAI_CONTENT.find((c) => c.id === id)
}

export function getAIGenAITopic(chapterId: string, topicId: string): AIGenAITopic | undefined {
  return getAIGenAIChapter(chapterId)?.topics.find((t) => t.id === topicId)
}

export function getAllAIGenAITopics(): AIGenAITopic[] {
  return AI_GENAI_CONTENT.flatMap((c) => c.topics)
}
