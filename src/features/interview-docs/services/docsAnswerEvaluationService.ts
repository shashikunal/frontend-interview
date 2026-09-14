import type { InterviewQuestion, ExperienceLevel } from '../types/docs.types';

export interface DocsAnswerEvaluation {
  score: number; // 0 - 100
  letterGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
  coveredConcepts: string[];
  missingConcepts: string[];
  strengths: string[];
  improvements: string[];
  seniorVerdict: string;
  experienceFeedback: string;
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
  evaluateCandidateAnswer(
    question: InterviewQuestion,
    transcript: string,
    experienceLevel: ExperienceLevel = 'senior'
  ): DocsAnswerEvaluation {
    const cleanTranscript = transcript.trim();
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
        experienceFeedback: `For ${experienceLevel} level, review the standard benchmark answer below and practice articulating the core concepts out loud.`
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
        experienceFeedback: 'Elaborate on how the platform operates under the hood.'
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
      // Penalize missing deep concepts more strictly for staff/senior
      if (covered.length < 2) rawScore = Math.min(rawScore, 45);
    } else if (experienceLevel === 'junior') {
      // Generous curve for juniors
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

    return {
      score: finalScore,
      letterGrade,
      coveredConcepts: covered,
      missingConcepts: missing,
      strengths,
      improvements,
      seniorVerdict,
      experienceFeedback,
    };
  }
};
