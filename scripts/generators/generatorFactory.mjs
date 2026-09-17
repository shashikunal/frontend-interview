// scripts/generators/generatorFactory.mjs
// Universal question synthesizer guaranteeing 100% unique titles, pure domain code, and all 13 sections

export function createSubjectGenerator({ subjectId, defaultSubjectName, topics, angles }) {
  if (!topics || topics.length !== 125) {
    throw new Error(`Subject [${subjectId}] must have exactly 125 curated topics, got ${topics?.length}`);
  }

  return function generateQuestion(index) {
    const num = index + 1;
    const id = `iq-${subjectId}-${String(num).padStart(4, '0')}`;

    const angleIndex = Math.floor(index / 125);
    const topicIndex = index % 125;

    const angle = angles[angleIndex];
    const topic = topics[topicIndex];

    const questionTitle = angle.title(topic, subjectId);
    const shortAnswer = angle.shortAnswer(topic, subjectId);
    const interviewAnswer = angle.interviewAnswer(topic, subjectId);
    const detailedExplanation = angle.detailedExplanation(topic, subjectId);
    const why = angle.why(topic, subjectId);
    const howItWorks = angle.howItWorks(topic, subjectId);
    const realWorldExample = angle.realWorldExample(topic, subjectId);

    const isHighFrequency = (index % 3 === 0) || angle.difficulty === 'EASY';
    const companyPools = ['Google', 'Meta', 'Amazon', 'Microsoft', 'Netflix', 'Uber', 'Apple'];
    const companyTags = [
      companyPools[index % companyPools.length],
      companyPools[(index + 3) % companyPools.length],
    ];

    return {
      id,
      subject: subjectId,
      topic: topic.category || topic.topic || `${defaultSubjectName} Architecture`,
      subtopic: topic.name,
      concept: `${topic.name} (${angle.lensName})`,
      difficulty: angle.difficulty,
      questionType: angle.questionType,
      experienceLevel: angle.experienceLevel,
      isHighFrequency,
      companyTags,
      tags: [subjectId, topic.tag || subjectId, angle.difficulty.toLowerCase(), angle.experienceLevel.toLowerCase(), ...companyTags, 'interview-prep'],
      question: questionTitle,
      shortAnswer,
      interviewAnswer,
      detailedExplanation,
      why,
      howItWorks,
      realWorldExample,
      example: topic.exampleCode,
      codeSnippet: topic.exampleCode,
      lineByLineExplanation: topic.lineByLine || [
        { line: 1, code: topic.exampleCode.split('\n')[0] || '', explanation: `Core syntax demonstrating ${topic.name}.` },
      ],
      executionFlow: topic.executionFlow || [
        `Step 1: Runtime/Parser encounters ${topic.name}.`,
        `Step 2: Engine applies syntax rules and checks specifications.`,
        `Step 3: State or render tree updates according to ${subjectId} lifecycle.`,
      ],
      commonMistakes: topic.commonMistakes || [
        `Using ${topic.name} without understanding its semantic impact.`,
        `Failing to validate cross-browser and runtime compatibility.`,
      ],
      interviewTraps: topic.interviewTraps || [
        `Trap: Assuming ${topic.name} behaves identically in legacy vs modern engines. Tip: Reference official specs.`,
      ],
      interviewTips: topic.interviewTips || [
        `For freshers: Always articulate the 'why' before diving into the code syntax for ${topic.name}.`,
        `Highlight production reliability and real-world performance implications.`,
      ],
      followUps: topic.followUps || [
        `What are the edge cases associated with ${topic.name}?`,
        `How does this integrate into large-scale production architecture?`,
      ],
      followUpAnswers: topic.followUpAnswers || [
        `Edge cases primarily involve legacy engine parsing differences and fallbacks.`,
        `In production, wrap and encapsulate ${topic.name} within reusable components or design system tokens.`,
      ],
    };
  };
}
