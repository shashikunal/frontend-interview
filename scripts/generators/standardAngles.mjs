// scripts/generators/standardAngles.mjs
// 8 Orthogonal Interview Lenses guaranteeing distinct, non-repetitive question titles and difficulty tiers

function getCleanTopicName(name) {
  if (!name) return 'Concept';
  return name
    .replace(/^(ES\d+\s+)?(Specification Feature|Advanced Architecture Pattern|Pattern)\s*#?\d*:\s*/i, '')
    .replace(/^HTML5?\s+Advanced Architecture Pattern \d+/i, 'HTML Modern Feature')
    .replace(/^CSS3?\s+Advanced Architecture Pattern \d+/i, 'CSS Modern Layout Feature')
    .replace(/^JavaScript\s+Advanced Architecture Pattern \d+/i, 'JS Engine Feature')
    .trim();
}

function getVariedTitle(lensType, t, subjectName) {
  const cleanName = getCleanTopicName(t.name);

  let hash = 0;
  for (let i = 0; i < t.name.length; i++) {
    hash = (hash << 5) - hash + t.name.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash);

  switch (lensType) {
    case 'DEFINITION': {
      const templates = [
        `What is ${cleanName}, and what is its primary role in ${subjectName}?`,
        `Explain ${cleanName} in ${subjectName}: Core Purpose & Key Principles`,
        `Understanding ${cleanName}: Why was it introduced in ${subjectName}?`,
        `What problem does ${cleanName} solve in modern ${subjectName}?`,
        `First Principles of ${cleanName} in ${subjectName}: Core Mechanics`,
        `Comprehensive Guide to ${cleanName} in ${subjectName}`,
      ];
      return templates[idx % templates.length];
    }
    case 'CODE': {
      const templates = [
        `How do you correctly declare and use ${cleanName} in practical ${subjectName} code?`,
        `Code Breakdown: Implementing ${cleanName} with idiomatic ${subjectName} syntax`,
        `Practical Syntax Guide: Writing and calling ${cleanName} in ${subjectName}`,
        `Step-by-Step Code Walkthrough: Working with ${cleanName} in ${subjectName}`,
        `Hands-on Examples: Best practices for ${cleanName} in ${subjectName}`,
      ];
      return templates[idx % templates.length];
    }
    case 'CONCEPTUAL': {
      const templates = [
        `What are the key differences between ${cleanName} and related alternatives in ${subjectName}?`,
        `Comparing ${cleanName} with traditional patterns in ${subjectName}`,
        `When should you choose ${cleanName} over alternative approaches in ${subjectName}?`,
        `Architectural Trade-offs: ${cleanName} vs Legacy Standards in ${subjectName}`,
      ];
      return templates[idx % templates.length];
    }
    case 'DEBUGGING': {
      const templates = [
        `What are the most frequent beginner mistakes and bugs encountered with ${cleanName}?`,
        `Common Pitfalls & Debugging Strategies for ${cleanName} in ${subjectName}`,
        `How to identify and resolve subtle runtime errors with ${cleanName}`,
        `Code Review Guide: Catching common mistakes in ${cleanName} early`,
      ];
      return templates[idx % templates.length];
    }
    case 'OUTPUT': {
      const templates = [
        `How does the browser or runtime engine process and evaluate ${cleanName} under the hood?`,
        `Under the Hood: Engine parsing and memory execution of ${cleanName} in ${subjectName}`,
        `AST & Execution Context: How ${cleanName} is evaluated internally`,
        `Deep Dive into Runtime Evaluation & JIT heuristics for ${cleanName}`,
      ];
      return templates[idx % templates.length];
    }
    case 'SCENARIO': {
      const templates = [
        `Interview Trap: What subtle edge cases or trick scenarios surround ${cleanName}?`,
        `Tricky Interview Scenario: Deconstructing edge cases in ${cleanName}`,
        `Specification Quirks & Coercion Trap Scenarios in ${cleanName}`,
      ];
      return templates[idx % templates.length];
    }
    case 'PERFORMANCE': {
      const templates = [
        `What are the performance implications, memory footprint, and optimization techniques for ${cleanName}?`,
        `High-Performance ${subjectName}: Optimizing memory footprint & latency of ${cleanName}`,
        `Benchmarking & Profiling ${cleanName} in High-Scale Production Apps`,
      ];
      return templates[idx % templates.length];
    }
    case 'ARCHITECTURE': {
      const templates = [
        `Enterprise Architecture: How should ${cleanName} be structured for large-scale production applications?`,
        `Production Guidelines: Standardizing ${cleanName} in enterprise ${subjectName} codebases`,
        `Design Patterns & Scaling Considerations for ${cleanName} in Production`,
      ];
      return templates[idx % templates.length];
    }
    default:
      return `What is ${cleanName}, and what is its primary role in ${subjectName}?`;
  }
}

export function getStandardAngles(subjectName) {
  return [
    {
      lensName: 'Fresher Fundamentals',
      difficulty: 'EASY',
      experienceLevel: 'FRESHER',
      questionType: 'DEFINITION',
      title: (t) => getVariedTitle('DEFINITION', t, subjectName),
      shortAnswer: (t) => `${getCleanTopicName(t.name)} is a core construct in ${subjectName} used for ${t.purpose || 'improving codebase structure and execution predictability'}. It ensures clean syntax, maintainability, and standard-compliant runtime behavior.`,
      interviewAnswer: (t) => `When asked about ${getCleanTopicName(t.name)} in a technical interview, I highlight: 1) Its primary role in ${subjectName}. 2) Key advantages over legacy approaches. 3) Practical implementation patterns and production considerations.`,
      detailedExplanation: (t) => `### Core Overview of ${getCleanTopicName(t.name)}\n\n1. **Definition**: ${getCleanTopicName(t.name)} represents ${t.purpose || 'a fundamental mechanism in the language ecosystem'}.\n2. **Importance**: Correct usage prevents runtime anomalies, reduces maintenance overhead, and ensures code readability.\n3. **Application**: Essential across modern web development workflows and enterprise architecture setups.`,
      why: (t) => `${getCleanTopicName(t.name)} was established in ${subjectName} to provide a standardized, deterministic approach to ${t.purpose || 'modern web development'}.`,
      howItWorks: (t) => `1. The ${subjectName} execution environment parses and tokenizes ${getCleanTopicName(t.name)}.\n2. Standard evaluation rules apply to bind properties, state, or elements.\n3. Results commit to memory or the browser render pipeline seamlessly.`,
      realWorldExample: (t) => `In production systems, applying ${getCleanTopicName(t.name)} ensures fast development cycles, zero-regression refactoring, and full spec compliance.`,
    },
    {
      lensName: 'Syntax & Implementation',
      difficulty: 'EASY',
      experienceLevel: 'FRESHER',
      questionType: 'CODE',
      title: (t) => getVariedTitle('CODE', t, subjectName),
      shortAnswer: (t) => `To implement ${getCleanTopicName(t.name)}, write standard ${subjectName} syntax following official specifications, ensuring proper parameters and clean formatting.`,
      interviewAnswer: (t) => `I demonstrate ${getCleanTopicName(t.name)} by writing clean, readable code with proper formatting, appropriate options/attributes, and clear variable naming.`,
      detailedExplanation: (t) => `### Practical Implementation of ${getCleanTopicName(t.name)}\n\n- **Syntax Requirements**: Adheres strictly to modern ${subjectName} conventions.\n- **Readability**: Keeps code self-documenting for team members.\n- **Error Prevention**: Avoids legacy anti-patterns and unhandled edge cases.`,
      why: (t) => `Standardized syntax for ${getCleanTopicName(t.name)} guarantees cross-platform compatibility and simplifies automated linting and testing.`,
      howItWorks: (t) => `1. Source code is ingested and tokenized.\n2. The compiler/engine verifies syntax validity for ${getCleanTopicName(t.name)}.\n3. Execution proceeds according to runtime specifications.`,
      realWorldExample: (t) => `Every day in production codebases, developers write ${getCleanTopicName(t.name)} following linted style guides to keep the codebase maintainable.`,
    },
    {
      lensName: 'Nuances & Comparisons',
      difficulty: 'EASY',
      experienceLevel: '1_3_YEARS',
      questionType: 'CONCEPTUAL',
      title: (t) => getVariedTitle('CONCEPTUAL', t, subjectName),
      shortAnswer: (t) => `${getCleanTopicName(t.name)} differs from alternative techniques primarily in syntax conciseness, performance characteristics, and scope of application.`,
      interviewAnswer: (t) => `In interviews, comparing ${getCleanTopicName(t.name)} with alternatives shows conceptual depth. I contrast syntax overhead, runtime trade-offs, and typical use cases.`,
      detailedExplanation: (t) => `### Comparative Analysis: ${getCleanTopicName(t.name)}\n\n- **Direct Alternative**: Older or competing constructs in ${subjectName}.\n- **Advantages**: More expressive, less boilerplate, better developer ergonomics.\n- **When to choose which**: Choose ${getCleanTopicName(t.name)} for modern standard workflows.`,
      why: (t) => `Understanding differences helps engineers make informed architectural choices rather than blindly copying patterns.`,
      howItWorks: (t) => `1. Comparing AST representations shows differences in instruction sets.\n2. Memory and execution steps vary based on the chosen pattern.\n3. Modern engines optimize ${getCleanTopicName(t.name)} with specialized JIT/pipeline heuristics.`,
      realWorldExample: (t) => `Migrating legacy constructs to ${getCleanTopicName(t.name)} reduced boilerplate by 30% and eliminated subtle regressions during client onboarding.`,
    },
    {
      lensName: 'Common Mistakes & Debugging',
      difficulty: 'INTERMEDIATE',
      experienceLevel: '1_3_YEARS',
      questionType: 'DEBUGGING',
      title: (t) => getVariedTitle('DEBUGGING', t, subjectName),
      shortAnswer: (t) => `Frequent mistakes with ${getCleanTopicName(t.name)} stem from misunderstanding its scope, omitting necessary configurations, and improper lifecycle handling.`,
      interviewAnswer: (t) => `During code reviews, common issues with ${getCleanTopicName(t.name)} include incorrect assumptions about mutability, missing null checks, or incorrect binding.`,
      detailedExplanation: (t) => `### Debugging & Common Mistakes in ${getCleanTopicName(t.name)}\n\n1. **Misconception**: Assuming ${getCleanTopicName(t.name)} behaves like a different construct.\n2. **Detection**: Identifying subtle issues through unit tests and browser DevTools.\n3. **Resolution**: Applying idiomatic defensive coding patterns.`,
      why: (t) => `Mastering the failure modes of ${getCleanTopicName(t.name)} prevents production outages and lowers mean time to resolution (MTTR).`,
      howItWorks: (t) => `1. Flawed code triggers runtime warnings or invalid states.\n2. Defensive guards or validation intercept errors before state corruption.\n3. Correct implementation restores deterministic behavior.`,
      realWorldExample: (t) => `Catching a silent failure in ${getCleanTopicName(t.name)} during pre-commit linting prevented a critical regression from reaching production users.`,
    },
    {
      lensName: 'Engine Internals & Evaluation',
      difficulty: 'INTERMEDIATE',
      experienceLevel: '3_5_YEARS',
      questionType: 'OUTPUT',
      title: (t) => getVariedTitle('OUTPUT', t, subjectName),
      shortAnswer: (t) => `Under the hood, the runtime engine tokenizes ${getCleanTopicName(t.name)}, parses it into an AST or internal data structure, and executes it via optimized bytecode or render pipelines.`,
      interviewAnswer: (t) => `I explain the internal lifecycle of ${getCleanTopicName(t.name)}: 1) Parsing and tokenization. 2) Memory allocation and scope/render registration. 3) Execution and garbage collection/cleanup.`,
      detailedExplanation: (t) => `### Internal Mechanics of ${getCleanTopicName(t.name)}\n\n- **Compilation/Parsing Phase**: AST generation and static validation.\n- **Execution Phase**: Runtime bytecode evaluation or DOM/CSSOM tree updates.\n- **Optimization**: Hot-path inline caching and layout tree batching.`,
      why: (t) => `Knowledge of runtime internals enables developers to write performant code that aligns with engine optimizations rather than fighting them.`,
      howItWorks: (t) => `1. Bytecode compiler generates intermediate representations.\n2. JIT compiler or layout engine processes instructions.\n3. Execution completes in microsecond timelines with minimal memory allocations.`,
      realWorldExample: (t) => `Understanding how the engine optimizes ${getCleanTopicName(t.name)} allowed our team to achieve a 60 FPS animation target on low-end Android mobile devices.`,
    },
    {
      lensName: 'Interview Traps & Quirks',
      difficulty: 'INTERMEDIATE',
      experienceLevel: '3_5_YEARS',
      questionType: 'SCENARIO',
      title: (t) => getVariedTitle('SCENARIO', t, subjectName),
      shortAnswer: (t) => `The trickiest aspect of ${getCleanTopicName(t.name)} involves coercion, asynchronous timing, or unexpected fallback behaviors under non-standard conditions.`,
      interviewAnswer: (t) => `Interviewers often ask edge-case questions about ${getCleanTopicName(t.name)} to check if candidates truly understand the specification or just memorized high-level syntax.`,
      detailedExplanation: (t) => `### Deconstructing Interview Traps for ${getCleanTopicName(t.name)}\n\n- **The Trap**: What looks intuitive on the surface produces counter-intuitive results.\n- **The Root Cause**: Underlying specification rules and implicit conversions.\n- **How to Answer**: State the specification rationale and provide the exact output.`,
      why: (t) => `Edge cases test depth of knowledge and indicate an engineer capable of debugging high-severity esoteric bugs in production.`,
      howItWorks: (t) => `1. Edge input arrives at the boundary of ${getCleanTopicName(t.name)}.\n2. Engine falls back to specification fallback algorithms.\n3. Result reflects the exact W3C / ECMA standard specification.`,
      realWorldExample: (t) => `An unexpected edge case in ${getCleanTopicName(t.name)} caused intermittent test flakiness until an explicit defensive guard was introduced.`,
    },
    {
      lensName: 'Performance & Optimization',
      difficulty: 'DIFFICULT',
      experienceLevel: '5_8_YEARS',
      questionType: 'PERFORMANCE',
      title: (t) => getVariedTitle('PERFORMANCE', t, subjectName),
      shortAnswer: (t) => `Performance with ${getCleanTopicName(t.name)} depends on avoiding excessive allocations, preventing layout thrashing or unneeded re-renders, and enabling cache reuse.`,
      interviewAnswer: (t) => `In high-scale systems, I optimize ${getCleanTopicName(t.name)} by profiling CPU and memory with DevTools, minimizing object churn, and batching heavy operations.`,
      detailedExplanation: (t) => `### High-Performance ${getCleanTopicName(t.name)} Engineering\n\n- **Resource Cost**: Computational complexity and allocation overhead.\n- **Optimization Levers**: Memoization, lazy evaluation, and off-main-thread processing.\n- **Benchmarking**: Validating throughput with Chrome Performance profiler and Lighthouse.`,
      why: (t) => `At scale, unoptimized usage of ${getCleanTopicName(t.name)} aggregates into sluggish user interactions, frame drops, and battery drain.`,
      howItWorks: (t) => `1. Bottleneck identification using flame graphs.\n2. Refactoring ${getCleanTopicName(t.name)} to minimize synchronous work.\n3. Engine skips redundant passes, lowering CPU utilization.`,
      realWorldExample: (t) => `Refactoring ${getCleanTopicName(t.name)} across our feed list reduced peak heap memory by 45MB and improved interaction latency by 35ms.`,
    },
    {
      lensName: 'Production Architecture',
      difficulty: 'DIFFICULT',
      experienceLevel: '8_PLUS_YEARS',
      questionType: 'ARCHITECTURE',
      title: (t) => getVariedTitle('ARCHITECTURE', t, subjectName),
      shortAnswer: (t) => `In enterprise systems, ${getCleanTopicName(t.name)} must be encapsulated behind clean abstractions, guarded by automated testing, and monitored with observability metrics.`,
      interviewAnswer: (t) => `For production architectures serving millions of users, I treat ${getCleanTopicName(t.name)} as a first-class citizen: enforced via ESLint rules, covered by unit/integration tests, and tracked via real user monitoring (RUM).`,
      detailedExplanation: (t) => `### Enterprise System Design for ${getCleanTopicName(t.name)}\n\n- **Modularity & Contracts**: Decoupling ${getCleanTopicName(t.name)} behind clear interfaces.\n- **Resilience**: Graceful degradation and circuit breakers.\n- **Scalability**: Ensuring zero-regression deployments across multi-team codebases.`,
      why: (t) => `Large enterprises require predictable patterns so hundreds of engineers can contribute safely without degrading the core system.`,
      howItWorks: (t) => `1. Architectural boundaries isolate ${getCleanTopicName(t.name)}.\n2. CI/CD pipelines run automated audits.\n3. Production telemetries monitor health in real time.`,
      realWorldExample: (t) => `Standardizing ${getCleanTopicName(t.name)} within our core platform package cut cross-team onboarding time by half and achieved 99.99% frontend uptime.`,
    },
  ];
}
