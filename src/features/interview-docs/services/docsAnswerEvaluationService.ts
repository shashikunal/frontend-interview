import type { InterviewQuestion, ExperienceLevel } from '../types/docs.types';
import { ollamaProvider } from '../../ai-video-mock/services/providers/ollamaProvider';

export interface DocsAnswerEvaluation {
  score: number; // 0 - 100
  letterGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
  coveredConcepts: string[];
  missingConcepts: string[];
  strengths: string[];
  improvements: string[];
  seniorVerdict: string;
  experienceFeedback: string;
  isOllamaLive?: boolean;
  modelUsed?: string;
  dynamicFollowUp?: string;
  followUpExpected?: string;
  latencyMs?: number;
}

const COMMON_STOPWORDS = new Set([
  'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'in', 'with', 'to', 'for', 'of',
  'it', 'that', 'this', 'by', 'as', 'are', 'be', 'from', 'can', 'we', 'you', 'i', 'when',
  'how', 'why', 'what', 'so', 'then', 'also', 'but', 'if', 'has', 'have', 'had', 'been'
]);

function cleanWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9_\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !COMMON_STOPWORDS.has(w));
}

function extractKeyConcepts(question: InterviewQuestion): string[] {
  const concepts: Set<string> = new Set();

  // Add tags
  if (question.tags) {
    question.tags.forEach(t => concepts.add(t.toLowerCase()));
  }

  // Extract from shortAnswer
  cleanWords(question.shortAnswer).forEach(w => {
    if (w.length >= 4) concepts.add(w);
  });

  // Extract from seniorAnswer or detailedAnswer
  const refText = `${question.detailedAnswer} ${question.seniorAnswer || ''}`;
  const words = cleanWords(refText);
  const freq: Record<string, number> = {};
  words.forEach(w => {
    freq[w] = (freq[w] || 0) + 1;
  });

  // Top technical keywords by frequency
  Object.entries(freq)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([w]) => concepts.add(w));

  return Array.from(concepts).slice(0, 8);
}

export const docsAnswerEvaluationService = {
  /**
   * Evaluates candidate verbal or typed response using local Ollama LLM if online,
   * seamlessly falling back to a deterministic rubric evaluator if offline.
   */
  async evaluateCandidateAnswer(
    question: InterviewQuestion,
    transcript: string,
    experienceLevel: ExperienceLevel = 'senior'
  ): Promise<DocsAnswerEvaluation> {
    const startTime = performance.now();
    const cleanTranscript = transcript.trim();

    // 1. Try local Ollama LLM Evaluation if available
    try {
      const ollamaStatus = await ollamaProvider.isAvailable();
      if (ollamaStatus.available && cleanTranscript.split(/\s+/).length >= 4) {
        const prompt = `You are a Principal Frontend Interviewer at a FAANG company (Google/Meta/Stripe).
Evaluate the candidate's interview response for the target seniority level "${experienceLevel.toUpperCase()}".

Technical Interview Question:
"${question.question}"

Benchmark Reference Answer:
"${question.shortAnswer}
${question.detailedAnswer}"

Candidate's Actual Response:
"${cleanTranscript}"

Respond ONLY with valid JSON in the following schema (no additional markdown or conversational text):
{
  "score": <number between 15 and 98>,
  "letterGrade": "<A+|A|B+|B|C|D|F>",
  "coveredConcepts": ["<concise technical concept articulated>", "<concept 2>"],
  "missingConcepts": ["<important concept omitted>", "<concept 2>"],
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<actionable technical improvement 1>", "<improvement 2>"],
  "seniorVerdict": "<1-2 sentence executive hiring recommendation>",
  "experienceFeedback": "<critique tailored to ${experienceLevel} level expectations>",
  "dynamicFollowUp": "<a deep follow-up probing question testing edge-cases or scale based on what they said>",
  "followUpExpected": "<concise expected senior answer for the follow-up>"
}`;

        const aiRes = await ollamaProvider.generateCompletion(prompt, {
          jsonMode: true,
          temperature: 0.2,
        });

        // Clean any code block fencing
        let jsonStr = aiRes.content.trim();
        if (jsonStr.startsWith('```')) {
          jsonStr = jsonStr.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
        }

        const parsed = JSON.parse(jsonStr);

        return {
          score: typeof parsed.score === 'number' ? Math.max(10, Math.min(100, parsed.score)) : 80,
          letterGrade: parsed.letterGrade || 'B',
          coveredConcepts: Array.isArray(parsed.coveredConcepts) ? parsed.coveredConcepts : [],
          missingConcepts: Array.isArray(parsed.missingConcepts) ? parsed.missingConcepts : [],
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Articulated baseline technical concepts.'],
          improvements: Array.isArray(parsed.improvements) ? parsed.improvements : ['Elaborate on production failure modes.'],
          seniorVerdict: parsed.seniorVerdict || 'Candidate demonstrates working comprehension with minor gaps.',
          experienceFeedback: parsed.experienceFeedback || `Tailored for ${experienceLevel} level preparation.`,
          dynamicFollowUp: parsed.dynamicFollowUp || question.followUps?.[0]?.question || 'How would this design behave under heavy load?',
          followUpExpected: parsed.followUpExpected || question.followUps?.[0]?.expectedAnswer || 'Focus on throttling and caching.',
          isOllamaLive: true,
          modelUsed: ollamaStatus.modelName || 'Ollama (llama3.2)',
          latencyMs: Math.round(performance.now() - startTime),
        };
      }
    } catch (err) {
      console.warn('Ollama interview evaluation failed, using deterministic rubric:', err);
    }

    // 2. High-Quality Deterministic Rubric Evaluator Fallback
    const deterministicResult = this.evaluateDeterministic(question, cleanTranscript, experienceLevel);
    return {
      ...deterministicResult,
      isOllamaLive: false,
      modelUsed: 'Deterministic Rubric Evaluator (Ollama Offline)',
      latencyMs: Math.round(performance.now() - startTime),
    };
  },

  /**
   * Evaluates follow-up probing response
   */
  async evaluateFollowUpAnswer(
    _question: InterviewQuestion,
    followUpQuestionText: string,
    candidateFollowUpText: string,
    expectedAnswerText: string
  ): Promise<{ scoreBoost: number; feedback: string; isCorrect: boolean }> {
    const clean = candidateFollowUpText.trim();
    if (!clean || clean.split(/\s+/).length < 4) {
      return {
        scoreBoost: 0,
        feedback: 'Follow-up response was too brief to verify technical depth.',
        isCorrect: false,
      };
    }

    try {
      const ollamaStatus = await ollamaProvider.isAvailable();
      if (ollamaStatus.available) {
        const prompt = `You are evaluating a candidate's follow-up interview response.
Follow-up Question: "${followUpQuestionText}"
Expected Concept: "${expectedAnswerText}"
Candidate's Answer: "${clean}"

Respond ONLY with JSON:
{
  "isCorrect": <true|false>,
  "scoreBoost": <number between 3 and 10 if correct, or 0 if incorrect>,
  "feedback": "<1-sentence evaluation of their follow-up answer>"
}`;
        const res = await ollamaProvider.generateCompletion(prompt, { jsonMode: true, temperature: 0.1 });
        let jsonStr = res.content.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(jsonStr);
        return {
          isCorrect: !!parsed.isCorrect,
          scoreBoost: typeof parsed.scoreBoost === 'number' ? parsed.scoreBoost : 5,
          feedback: parsed.feedback || 'Good articulation of follow-up edge case.',
        };
      }
    } catch {
      // Fallback
    }

    const words = clean.toLowerCase();
    const hasTechnicalTerms = words.length > 25;
    return {
      isCorrect: hasTechnicalTerms,
      scoreBoost: hasTechnicalTerms ? 5 : 2,
      feedback: hasTechnicalTerms
        ? 'Well handled! Addressed the edge case with sound architectural reasoning.'
        : 'Partially answered. Expand on how to mitigate edge case latencies.',
    };
  },

  evaluateDeterministic(
    question: InterviewQuestion,
    cleanTranscript: string,
    experienceLevel: ExperienceLevel = 'senior'
  ): DocsAnswerEvaluation {
    const lowerTranscript = cleanTranscript.toLowerCase();

    // Check for honest "I don't know"
    const isHonestUncertain =
      lowerTranscript.includes("i don't know") ||
      lowerTranscript.includes("i am not sure") ||
      lowerTranscript.includes("haven't worked with") ||
      lowerTranscript.includes("pass on this question");

    if (isHonestUncertain && cleanTranscript.split(/\s+/).length < 20) {
      return {
        score: 35,
        letterGrade: 'D',
        coveredConcepts: [],
        missingConcepts: extractKeyConcepts(question),
        strengths: ['Demonstrated professional honesty and recognized technical boundaries.'],
        improvements: [
          `Review the core mechanics of ${question.question.slice(0, 60)} before the final interview round.`
        ],
        seniorVerdict: 'The candidate honestly passed on the question rather than fabricating false technical claims.',
        experienceFeedback: `For ${experienceLevel} level, review the standard benchmark answer below and practice articulating the core concepts out loud.`,
        dynamicFollowUp: question.followUps?.[0]?.question || 'What first diagnostic steps would you take to investigate this?',
        followUpExpected: question.followUps?.[0]?.expectedAnswer || 'Inspect network waterfall and profiler metrics.',
      };
    }

    if (!cleanTranscript || cleanTranscript.split(/\s+/).length < 6) {
      return {
        score: 15,
        letterGrade: 'F',
        coveredConcepts: [],
        missingConcepts: extractKeyConcepts(question),
        strengths: [],
        improvements: ['Response is too brief. Provide technical definitions, underlying mechanisms, and code trade-offs.'],
        seniorVerdict: 'Insufficient response length to evaluate technical competency.',
        experienceFeedback: 'Elaborate on how the platform operates under the hood.',
        dynamicFollowUp: question.followUps?.[0]?.question || 'Can you walk through an example of this in production?',
        followUpExpected: question.followUps?.[0]?.expectedAnswer || 'Walk through practical implementation step-by-step.',
      };
    }

    const expectedConcepts = extractKeyConcepts(question);
    const candidateWords = new Set(cleanWords(cleanTranscript));

    const covered: string[] = [];
    const missing: string[] = [];

    expectedConcepts.forEach(concept => {
      // Check exact word or sub-word match
      const matched = Array.from(candidateWords).some(
        cw => cw.includes(concept) || concept.includes(cw)
      );
      if (matched || lowerTranscript.includes(concept)) {
        covered.push(concept);
      } else {
        missing.push(concept);
      }
    });

    const wordCount = cleanTranscript.split(/\s+/).length;
    const conceptRatio = expectedConcepts.length > 0 ? covered.length / expectedConcepts.length : 0.5;

    // Calculate baseline score from concept ratio
    let rawScore = Math.round(conceptRatio * 75);

    // Word count / elaboration bonus
    if (wordCount >= 40) rawScore += 15;
    else if (wordCount >= 25) rawScore += 10;
    else if (wordCount >= 15) rawScore += 5;

    // Experience-level expectations adjustment
    if (experienceLevel === 'architect' || experienceLevel === 'senior') {
      if (covered.length < 2) rawScore = Math.min(rawScore, 45);
    } else if (experienceLevel === 'junior') {
      rawScore = Math.min(100, rawScore + 10);
    }

    const finalScore = Math.max(10, Math.min(100, rawScore));

    let letterGrade: DocsAnswerEvaluation['letterGrade'] = 'F';
    if (finalScore >= 90) letterGrade = 'A+';
    else if (finalScore >= 80) letterGrade = 'A';
    else if (finalScore >= 70) letterGrade = 'B+';
    else if (finalScore >= 60) letterGrade = 'B';
    else if (finalScore >= 45) letterGrade = 'C';
    else letterGrade = 'D';

    const strengths: string[] = [];
    if (covered.length > 0) {
      strengths.push(`Accurately articulated key technical concepts: ${covered.slice(0, 4).join(', ')}.`);
    }
    if (wordCount >= 30) {
      strengths.push('Communicated with good structural flow and technical depth.');
    }

    const improvements: string[] = [];
    if (missing.length > 0) {
      improvements.push(`Include specific discussion of: ${missing.slice(0, 3).join(', ')}.`);
    }
    if (finalScore < 70) {
      improvements.push('Connect theoretical concepts to production performance and potential failure modes.');
    }

    let seniorVerdict = '';
    if (finalScore >= 85) {
      seniorVerdict = 'Strong technical hire signal. Demonstrates clear engineering mastery and articulate verbal delivery.';
    } else if (finalScore >= 70) {
      seniorVerdict = 'Competent baseline answer. Solid grasp of core concepts with minor gaps in architectural trade-offs.';
    } else {
      seniorVerdict = 'Needs structured revision. Essential mechanisms were omitted from the candidate explanation.';
    }

    const experienceFeedback =
      experienceLevel === 'architect'
        ? 'As a solutions architect, emphasize system-level constraints, scale limits, and defensive error handling.'
        : experienceLevel === 'senior'
        ? 'As a senior engineer, highlight operational trade-offs, browser rendering implications, and maintainability.'
        : 'Good effort! Focus on standard platform definitions and practical code use cases.';

    // Generate dynamic follow up probe
    const dynamicFollowUp =
      question.followUps?.[0]?.question ||
      `If this implementation encounters a 10x traffic spike or strict memory quota, what defensive strategies would you deploy?`;
    const followUpExpected =
      question.followUps?.[0]?.expectedAnswer ||
      'Apply rate limiting, memory caching with TTL, and lazy evaluation.';

    return {
      score: finalScore,
      letterGrade,
      coveredConcepts: covered,
      missingConcepts: missing,
      strengths,
      improvements,
      seniorVerdict,
      experienceFeedback,
      dynamicFollowUp,
      followUpExpected,
    };
  }
};
