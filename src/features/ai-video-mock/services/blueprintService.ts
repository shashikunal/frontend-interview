import type { CandidateSetupConfig, InterviewBlueprint, QuestionDifficulty } from '../types/mock.types';
import { TRACK_QUESTIONS_MAP } from '../data/questionBankRegistry';
import type { MockQuestion } from '../types/questionBank.types';

export const blueprintService = {
  generateBlueprint(sessionId: string, config: CandidateSetupConfig): InterviewBlueprint {
    const totalQ = Math.max(1, config.questionCount || 5);

    // Calculate difficulty distribution based on experience and selection
    let basicCount = 0;
    let intermediateCount = 0;
    let advancedCount = 0;
    let expertCount = 0;

    if (config.difficulty === 'Basic') {
      basicCount = totalQ;
    } else if (config.difficulty === 'Intermediate') {
      intermediateCount = totalQ;
    } else if (config.difficulty === 'Advanced') {
      advancedCount = totalQ;
    } else if (config.difficulty === 'Expert') {
      expertCount = totalQ;
    } else {
      // Adaptive distribution based on experience tier
      switch (config.experienceTier) {
        case '0-1':
        case '1-2':
          basicCount = Math.round(totalQ * 0.7);
          intermediateCount = totalQ - basicCount;
          break;
        case '2-4':
          basicCount = Math.round(totalQ * 0.2);
          intermediateCount = Math.round(totalQ * 0.6);
          advancedCount = totalQ - (basicCount + intermediateCount);
          break;
        case '4-6':
        case '6-8':
          intermediateCount = Math.round(totalQ * 0.3);
          advancedCount = Math.round(totalQ * 0.5);
          expertCount = totalQ - (intermediateCount + advancedCount);
          break;
        case '8-12':
        case '12+':
          intermediateCount = Math.round(totalQ * 0.1);
          advancedCount = Math.round(totalQ * 0.4);
          expertCount = totalQ - (intermediateCount + advancedCount);
          break;
        default:
          intermediateCount = totalQ;
      }
    }

    // Reserve Questions
    const pool = TRACK_QUESTIONS_MAP[config.primaryTechnology] || TRACK_QUESTIONS_MAP['javascript'];
    const reserved: MockQuestion[] = [];

    const getQuestionsByDiff = (diff: QuestionDifficulty, needed: number) => {
      const candidates = pool.filter(q => q.difficulty === diff);
      const shuffled = [...candidates].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, needed);
    };

    reserved.push(...getQuestionsByDiff('Basic', basicCount));
    reserved.push(...getQuestionsByDiff('Intermediate', intermediateCount));
    reserved.push(...getQuestionsByDiff('Advanced', advancedCount));
    reserved.push(...getQuestionsByDiff('Expert', expertCount));

    // Fallback if reserve count didn't match total
    if (reserved.length < totalQ) {
      const remaining = pool.filter(q => !reserved.some(r => r.id === q.id));
      reserved.push(...remaining.slice(0, totalQ - reserved.length));
    }

    const reservedIds = reserved.slice(0, totalQ).map(q => q.id);

    const difficultyDistribution: Record<QuestionDifficulty, number> = {
      Basic: basicCount,
      Intermediate: intermediateCount,
      Advanced: advancedCount,
      Expert: expertCount,
    };

    const topicDistribution: Record<string, number> = {};
    const typeDistribution: Record<string, number> = {};

    reserved.slice(0, totalQ).forEach(q => {
      topicDistribution[q.topic] = (topicDistribution[q.topic] || 0) + 1;
      typeDistribution[q.questionType] = (typeDistribution[q.questionType] || 0) + 1;
    });

    return {
      id: `bp_${sessionId.slice(0, 8)}_${Date.now()}`,
      sessionId,
      questionCount: totalQ,
      difficultyDistribution,
      topicDistribution,
      typeDistribution,
      reservedQuestionIds: reservedIds,
      expectedLevel: config.experienceTier,
      scoringRubricWeights: {
        correctness: 0.25,
        depth: 0.20,
        practical: 0.20,
        communication: 0.15,
        problemSolving: 0.10,
        architecture: 0.10,
      },
      timeLimitTotalMinutes: totalQ * 5,
      perQuestionTimeLimitSeconds: 300,
      createdAt: new Date().toISOString(),
    };
  },
};
