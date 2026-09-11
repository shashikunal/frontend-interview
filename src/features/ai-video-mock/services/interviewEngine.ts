import type {
  MockInterviewSession,
  InterviewAnswer,
  QuestionDifficulty,
} from '../types/mock.types';
import type { MockQuestion, TechnologyTrack, ExperienceTier } from '../types/questionBank.types';
import { TRACK_QUESTIONS_MAP } from '../data/questionBankRegistry';

export type EngineInterviewState =
  | 'SETUP'
  | 'BLUEPRINT'
  | 'AI_SPEAKING'
  | 'CANDIDATE_LISTENING'
  | 'CANDIDATE_ANSWERING'
  | 'TRANSCRIBING'
  | 'EVALUATING'
  | 'FOLLOW_UP_ACTIVE'
  | 'FOLLOW_UP_SPEAKING'
  | 'FOLLOW_UP_ANSWERING'
  | 'ADAPTING_DIFFICULTY'
  | 'NEXT_QUESTION'
  | 'COMPLETED';

export interface AdaptiveStepResult {
  nextDifficulty: QuestionDifficulty;
  reasoning: string;
  nextQuestion: MockQuestion;
  demonstratedMastery: boolean;
  untestedConcepts: string[];
}

export const interviewEngine = {
  /**
   * Determine initial calibration question difficulty based on claimed seniority.
   */
  getInitialDifficulty(experienceTier: ExperienceTier): QuestionDifficulty {
    switch (experienceTier) {
      case '0-1':
      case '1-2':
        return 'Basic';
      case '2-4':
        return 'Intermediate';
      case '4-6':
      case '6-8':
        return 'Intermediate'; // Senior starts with high-calibration intermediate, quickly jumps to Advanced/Expert
      case '8-12':
      case '12+':
        return 'Advanced';
      default:
        return 'Intermediate';
    }
  },

  /**
   * Select the initial question for an interview session.
   */
  selectInitialQuestion(
    track: TechnologyTrack,
    experienceTier: ExperienceTier,
    selectedTopic?: string
  ): MockQuestion {
    const questions = TRACK_QUESTIONS_MAP[track] || TRACK_QUESTIONS_MAP.javascript;
    const targetDiff = this.getInitialDifficulty(experienceTier);

    let candidates = questions.filter(q => q.difficulty === targetDiff);
    if (selectedTopic) {
      const topicMatches = candidates.filter(q => q.topic.toLowerCase() === selectedTopic.toLowerCase());
      if (topicMatches.length > 0) candidates = topicMatches;
    }

    if (candidates.length === 0) {
      candidates = questions;
    }

    // Pick a high-quality calibration question
    const sorted = [...candidates].sort((a, b) => b.qualityScore - a.qualityScore);
    return sorted[Math.floor(Math.random() * Math.min(sorted.length, 5))] || sorted[0];
  },

  /**
   * Core Adaptive Decision Engine:
   * Analyzes the previous answer score, missing concepts, and seniority expectation,
   * then adaptively selects the NEXT question (raising/lowering difficulty or targeting weak concepts).
   */
  async decideNextQuestion(
    session: MockInterviewSession,
    lastAnswer: InterviewAnswer
  ): Promise<AdaptiveStepResult> {
    const track = session.config.primaryTechnology;
    const expTier = session.config.experienceTier;
    const pool = TRACK_QUESTIONS_MAP[track] || TRACK_QUESTIONS_MAP.javascript;
    const answeredIds = new Set(session.answers.map(a => a.questionId));
    const previousScore = lastAnswer.evaluation?.numericScore ?? 6.0;
    const currentDiff = lastAnswer.question.difficulty;

    // 1. Difficulty Progression Rules
    let nextDifficulty: QuestionDifficulty = currentDiff;
    let reasoning = '';

    const isSenior = ['4-6', '6-8', '8-12', '12+'].includes(expTier);

    if (previousScore >= 7.8) {
      // Strong performance: promote difficulty
      if (currentDiff === 'Basic') {
        nextDifficulty = isSenior ? 'Advanced' : 'Intermediate';
        reasoning = `Demonstrated solid fundamentals (${previousScore}/10). Advancing difficulty to ${nextDifficulty}.`;
      } else if (currentDiff === 'Intermediate') {
        nextDifficulty = 'Advanced';
        reasoning = `Strong grasp of intermediate concepts (${previousScore}/10). Moving to Advanced production scenarios.`;
      } else if (currentDiff === 'Advanced') {
        nextDifficulty = 'Expert';
        reasoning = `Mastered advanced technical concepts (${previousScore}/10). Escalating to Expert architectural tradeoffs.`;
      } else {
        nextDifficulty = 'Expert';
        reasoning = `Maintained exceptional expert performance (${previousScore}/10). Continuing high-caliber architectural probing.`;
      }
    } else if (previousScore < 5.0) {
      // Struggling: recalibrate difficulty down to assess fundamentals
      if (currentDiff === 'Expert') {
        nextDifficulty = 'Advanced';
        reasoning = `Encountered friction at Expert level (${previousScore}/10). Recalibrating to Advanced.`;
      } else if (currentDiff === 'Advanced') {
        nextDifficulty = 'Intermediate';
        reasoning = `Concept gaps identified (${previousScore}/10). Testing foundational mechanics at Intermediate level.`;
      } else {
        nextDifficulty = 'Basic';
        reasoning = `Calibrating baseline understanding at Basic level.`;
      }
    } else {
      // Moderate score (5.0 - 7.7): Stay at current difficulty or escalate if Senior candidate is on basic/intermediate
      if (isSenior && currentDiff === 'Basic') {
        nextDifficulty = 'Intermediate';
        reasoning = `Senior candidate calibration complete. Moving to ${nextDifficulty} to probe production scenarios.`;
      } else {
        nextDifficulty = currentDiff;
        reasoning = `Stable performance (${previousScore}/10). Continuing at ${currentDiff} level across complementary topics.`;
      }
    }

    // 2. Select next question candidate
    // Filter out already answered questions
    let candidatePool = pool.filter(q => !answeredIds.has(q.id) && q.difficulty === nextDifficulty);

    // Prefer questions testing topics not yet tested in this session
    const testedTopics = new Set(session.answers.map(a => a.question.topic));
    const freshTopicCandidates = candidatePool.filter(q => !testedTopics.has(q.topic));

    if (freshTopicCandidates.length > 0) {
      candidatePool = freshTopicCandidates;
    }

    // If candidate had missing concepts, try to find a question targeting that subtopic
    const missingConcepts = lastAnswer.evaluation?.comparison?.missingConcepts || [];
    if (missingConcepts.length > 0 && candidatePool.length > 3) {
      const targeted = candidatePool.filter(q =>
        q.expectedConcepts.some(c => missingConcepts.some(m => m.toLowerCase().includes(c.toLowerCase())))
      );
      if (targeted.length > 0) {
        candidatePool = targeted;
      }
    }

    // Fallback if pool exhausted
    if (candidatePool.length === 0) {
      candidatePool = pool.filter(q => !answeredIds.has(q.id));
    }
    if (candidatePool.length === 0) {
      candidatePool = pool;
    }

    // Sort by quality score
    const selected = candidatePool.sort((a, b) => b.qualityScore - a.qualityScore)[0] || pool[0];

    return {
      nextDifficulty,
      reasoning,
      nextQuestion: selected,
      demonstratedMastery: previousScore >= 7.8,
      untestedConcepts: missingConcepts,
    };
  },
};
