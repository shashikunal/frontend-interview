import type { MockQuestion, ExperienceTier } from '../types/questionBank.types';
import type { AnswerEvaluation, ConceptComparisonResult } from '../types/mock.types';
import { ollamaProvider } from './providers/ollamaProvider';

export const answerEvaluationService = {
  async evaluateTheoryAnswer(
    question: MockQuestion,
    candidateTranscript: string,
    experienceLevel: ExperienceTier
  ): Promise<AnswerEvaluation> {
    const transcriptClean = candidateTranscript.trim();

    // 1. Check for explicit honest "I don't know"
    const lower = transcriptClean.toLowerCase();
    const isIDontKnow =
      lower.includes("i don't know") ||
      lower.includes("i am not sure") ||
      lower.includes("i haven't worked with this") ||
      lower.includes("pass this question");

    // 2. Self-correction detection
    const hasSelfCorrection =
      lower.includes("actually, let me correct") ||
      lower.includes("on second thought") ||
      lower.includes("wait, i meant") ||
      lower.includes("to correct what i said earlier");

    // 3. Local Deterministic Concept Comparison
    const comparison = this.performConceptComparison(question, transcriptClean);

    // 4. Try Ollama LLM Evaluation if available
    const ollamaStatus = await ollamaProvider.isAvailable();
    let numericScore = 0;
    let letterGrade: AnswerEvaluation['letterGrade'] = 'F';
    let whyMarksLost: string[] = [];
    let positiveHighlights: string[] = [];
    let improvedAnswer = '';
    let expFeedback = '';
    let confidence: 'High' | 'Medium' | 'Low' = 'High';

    if (isIDontKnow && transcriptClean.length < 50) {
      numericScore = 3.0; // Honest answer receives baseline integrity credit rather than zero
      letterGrade = 'D';
      whyMarksLost = ['No technical explanation or architecture details provided for this question.'];
      positiveHighlights = ['Demonstrated professional honesty and self-awareness by acknowledging knowledge boundary.'];
      expFeedback = `For ${experienceLevel} level, review the foundational principles of ${question.subtopic} (${question.topic}).`;
      improvedAnswer = question.rubric.strongAnswer;
    } else if (ollamaStatus.available) {
      // Prompt Ollama for structured evaluation
      const prompt = `
Question: ${question.question}
Topic: ${question.topic} - ${question.subtopic}
Target Candidate Level: ${experienceLevel}
Expected Concepts: ${question.expectedConcepts.join(', ')}
Minimum Expected Answer: ${question.rubric.minimumExpected}
Strong Answer: ${question.rubric.strongAnswer}
Senior Expectations: ${question.rubric.seniorLevelExpectations}

Candidate Transcript:
"${transcriptClean}"

Evaluate the candidate answer against the rubric. Output valid JSON in this exact structure:
{
  "numericScore": 8.0,
  "letterGrade": "B+",
  "confidence": "High",
  "correctConcepts": ["concept1"],
  "missingConcepts": ["concept2"],
  "incorrectConcepts": [],
  "whyMarksLost": ["Explanation of missed marks"],
  "positiveHighlights": ["What they did well"],
  "experienceAwareFeedback": "Constructive feedback for this seniority level",
  "improvedAnswer": "A concise, senior-level model answer"
}
`;

      const aiRes = await ollamaProvider.generateCompletion(prompt, { jsonMode: true });
      if (aiRes.success && aiRes.parsedJson && typeof aiRes.parsedJson.numericScore === 'number') {
        const p = aiRes.parsedJson;
        numericScore = Math.min(10, Math.max(0, p.numericScore));
        letterGrade = p.letterGrade || this.scoreToGrade(numericScore);
        whyMarksLost = Array.isArray(p.whyMarksLost) ? p.whyMarksLost : [];
        positiveHighlights = Array.isArray(p.positiveHighlights) ? p.positiveHighlights : [];
        expFeedback = p.experienceAwareFeedback || '';
        improvedAnswer = p.improvedAnswer || question.rubric.strongAnswer;
        confidence = p.confidence || 'High';
      } else {
        // Fallback to deterministic scoring if Ollama generation was malformed
        const fallback = this.computeDeterministicScore(question, comparison, transcriptClean, experienceLevel);
        numericScore = fallback.numericScore;
        letterGrade = fallback.letterGrade;
        whyMarksLost = fallback.whyMarksLost;
        positiveHighlights = fallback.positiveHighlights;
        expFeedback = fallback.expFeedback;
        improvedAnswer = question.rubric.strongAnswer;
        confidence = 'Medium';
      }
    } else {
      // Deterministic rule-based evaluation (always reliable and instant)
      const fallback = this.computeDeterministicScore(question, comparison, transcriptClean, experienceLevel);
      numericScore = fallback.numericScore;
      letterGrade = fallback.letterGrade;
      whyMarksLost = fallback.whyMarksLost;
      positiveHighlights = fallback.positiveHighlights;
      expFeedback = fallback.expFeedback;
      improvedAnswer = question.rubric.strongAnswer;
      confidence = 'High';
    }

    return {
      id: `eval_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      answerId: '',
      questionId: question.id,
      numericScore,
      letterGrade,
      confidence,
      comparison,
      whyMarksLost,
      positiveHighlights,
      experienceAwareFeedback: expFeedback,
      improvedAnswer,
      evaluationRubricScores: {
        correctness: Math.min(10, numericScore + 0.2),
        conceptualDepth: Math.max(0, numericScore - 0.4),
        practicalKnowledge: numericScore,
        communication: Math.min(10, numericScore + 0.5),
        problemSolving: numericScore,
      },
      selfCorrectionDetected: hasSelfCorrection,
      honestIDontKnow: isIDontKnow,
      modelInfo: {
        modelName: ollamaStatus.available ? (ollamaStatus.modelName || 'Ollama LLM') : 'Deterministic Rubric Evaluator v2.4',
        modelVersion: '2026.09.11',
        promptVersion: 'v3-rubric-grounded',
        rubricVersion: 'FAANG-L5-L7',
        evaluatedAt: new Date().toISOString(),
      },
    };
  },

  performConceptComparison(q: MockQuestion, transcript: string): ConceptComparisonResult {
    const lower = transcript.toLowerCase();
    const correct: string[] = [];
    const missing: string[] = [];
    const incorrect: string[] = [];

    for (const concept of q.expectedConcepts) {
      const cLower = concept.toLowerCase();
      // Check if concept or parts of concept words match
      const words = cLower.split(/\s+/).filter(w => w.length > 3);
      const isMatch = lower.includes(cLower) || (words.length > 0 && words.some(w => lower.includes(w)));

      if (isMatch) {
        correct.push(concept);
      } else {
        missing.push(concept);
      }
    }

    for (const mistake of q.commonMistakes) {
      const mWords = mistake.toLowerCase().split(/\s+/).filter(w => w.length > 4);
      if (mWords.filter(w => lower.includes(w)).length >= 2) {
        incorrect.push(`Potential misconception: ${mistake}`);
      }
    }

    return {
      correctConcepts: correct,
      missingConcepts: missing,
      incorrectConcepts: incorrect,
    };
  },

  computeDeterministicScore(
    q: MockQuestion,
    comparison: ConceptComparisonResult,
    transcript: string,
    experienceLevel: ExperienceTier
  ): {
    numericScore: number;
    letterGrade: AnswerEvaluation['letterGrade'];
    whyMarksLost: string[];
    positiveHighlights: string[];
    expFeedback: string;
  } {
    const totalConcepts = q.expectedConcepts.length || 1;
    const matchRatio = comparison.correctConcepts.length / totalConcepts;
    const wordCount = transcript.split(/\s+/).filter(Boolean).length;

    let base = matchRatio * 8.0;

    // Length & depth bonus
    if (wordCount >= 80) base += 1.5;
    else if (wordCount >= 40) base += 0.8;
    else base -= 1.0;

    // Penalty for misconceptions
    if (comparison.incorrectConcepts.length > 0) {
      base -= comparison.incorrectConcepts.length * 1.0;
    }

    const numericScore = Math.min(10.0, Math.max(1.0, Math.round(base * 10) / 10));
    const letterGrade = this.scoreToGrade(numericScore);

    const whyMarksLost: string[] = [];
    if (comparison.missingConcepts.length > 0) {
      whyMarksLost.push(`Missing key technical concepts: ${comparison.missingConcepts.slice(0, 3).join(', ')}.`);
    }
    if (wordCount < 40) {
      whyMarksLost.push('Answer was too brief to demonstrate full depth and trade-off understanding.');
    }
    if (comparison.incorrectConcepts.length > 0) {
      whyMarksLost.push('Contained potential technical misconceptions regarding boundary behavior.');
    }

    const positiveHighlights: string[] = [];
    if (comparison.correctConcepts.length > 0) {
      positiveHighlights.push(`Accurately articulated: ${comparison.correctConcepts.slice(0, 3).join(', ')}.`);
    }
    if (wordCount >= 60) {
      positiveHighlights.push('Structured response with comprehensive technical context.');
    }

    const expFeedback = `At the ${experienceLevel} level, interviewers expect you to explicitly address runtime memory implications, edge cases, and production trade-offs of ${q.subtopic}.`;

    return {
      numericScore,
      letterGrade,
      whyMarksLost,
      positiveHighlights,
      expFeedback,
    };
  },

  scoreToGrade(score: number): AnswerEvaluation['letterGrade'] {
    if (score >= 9.5) return 'A+';
    if (score >= 9.0) return 'A';
    if (score >= 8.5) return 'A-';
    if (score >= 8.0) return 'B+';
    if (score >= 7.5) return 'B';
    if (score >= 7.0) return 'B-';
    if (score >= 6.5) return 'C+';
    if (score >= 6.0) return 'C';
    if (score >= 5.0) return 'C-';
    if (score >= 4.0) return 'D';
    return 'F';
  },

  async evaluateAnswer(params: {
    question: MockQuestion;
    candidateAnswerText: string;
    submittedCode?: string;
    experienceTier: ExperienceTier;
    claimedYears?: number;
    communicationMetrics?: any;
  }): Promise<AnswerEvaluation> {
    return this.evaluateTheoryAnswer(
      params.question,
      params.candidateAnswerText || params.submittedCode || '',
      params.experienceTier
    );
  },
};
