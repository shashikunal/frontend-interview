import type {
  SubjectId,
  InterviewSessionConfig,
  InterviewSessionState,
} from '../types/docs.types';
import { ALL_QUESTIONS_REGISTRY } from '../data/docsRegistry';
import { ALL_SUBJECTS_CATALOG } from '../data/subjectsCatalog';

class InterviewSimulatorService {
  /**
   * Generates a realistic mock interview session with balanced questions and follow-ups.
   */
  createInterviewSession(config: InterviewSessionConfig): InterviewSessionState {
    const candidateQuestions = ALL_QUESTIONS_REGISTRY.filter(q => {
      const subjectMatch = config.subjectIds.includes(q.subjectId);
      const difficultyMatch = config.difficulty === 'mixed' || q.difficulty === config.difficulty;
      return subjectMatch && difficultyMatch;
    });

    // Shuffle questions
    const shuffled = [...candidateQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(config.questionCount, shuffled.length));

    return {
      id: `session_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      config,
      questions: selected,
      currentIndex: 0,
      activeFollowUpIndex: -1, // -1 means main question
      userRatings: {},
      notes: {},
      startedAt: new Date().toISOString(),
      isFinished: false,
    };
  }

  /**
   * Evaluates the completed interview session, calculating readiness grade and weak topics.
   */
  evaluateSession(session: InterviewSessionState): InterviewSessionState['scoreSummary'] {
    const ratings = Object.values(session.userRatings);
    const totalPoints = ratings.reduce((sum, r) => sum + r, 0);
    const maxPoints = session.questions.length * 5;
    const overallPercentage = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;

    let readinessGrade: 'Strong Hire' | 'Hire' | 'Borderline' | 'Needs Practice' = 'Needs Practice';
    if (overallPercentage >= 85) readinessGrade = 'Strong Hire';
    else if (overallPercentage >= 70) readinessGrade = 'Hire';
    else if (overallPercentage >= 50) readinessGrade = 'Borderline';

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendedTopics: { subjectId: SubjectId; topicId: string; title: string }[] = [];

    session.questions.forEach(q => {
      const score = session.userRatings[q.id] || 0;
      const subject = ALL_SUBJECTS_CATALOG.find(s => s.id === q.subjectId);
      const subjectName = subject?.title || q.subjectId;

      if (score >= 4) {
        if (!strengths.includes(subjectName)) strengths.push(subjectName);
      } else {
        if (!weaknesses.includes(subjectName)) weaknesses.push(subjectName);
        recommendedTopics.push({
          subjectId: q.subjectId,
          topicId: q.topicId,
          title: q.question.slice(0, 60) + '...',
        });
      }
    });

    return {
      overallPercentage,
      readinessGrade,
      strengths: strengths.slice(0, 4),
      weaknesses: weaknesses.slice(0, 4),
      recommendedTopics: recommendedTopics.slice(0, 5),
    };
  }
}

export const interviewSimulatorService = new InterviewSimulatorService();
