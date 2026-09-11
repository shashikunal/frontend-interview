import type {
  FinalInterviewScorecard,
  InterviewAnswer,
  CandidateSetupConfig,
  SeniorityReadiness,
  TargetRoleReadiness,
  RecurringWeakness,
  LearningRecommendation,
} from '../types/mock.types';

export const finalReportService = {
  generateScorecard(
    sessionId: string,
    answers: InterviewAnswer[],
    config: CandidateSetupConfig
  ): FinalInterviewScorecard {
    const answeredList = answers.filter(a => a.status === 'EVALUATED' && a.evaluation);
    const validCount = Math.max(1, answeredList.length);

    // Compute pillar averages
    let totalCorrectness = 0;
    let totalDepth = 0;
    let totalPractical = 0;
    let totalCommunication = 0;
    let totalProblemSolving = 0;
    let totalOverall = 0;

    for (const a of answeredList) {
      const e = a.evaluation!;
      totalCorrectness += e.evaluationRubricScores.correctness;
      totalDepth += e.evaluationRubricScores.conceptualDepth;
      totalPractical += e.evaluationRubricScores.practicalKnowledge;
      totalCommunication += e.evaluationRubricScores.communication;
      totalProblemSolving += e.evaluationRubricScores.problemSolving;
      totalOverall += e.numericScore;
    }

    const avgOverall = Math.round((totalOverall / validCount) * 10) / 10;
    const technical = Math.round((totalCorrectness / validCount) * 10) / 10;
    const depth = Math.round((totalDepth / validCount) * 10) / 10;
    const practical = Math.round((totalPractical / validCount) * 10) / 10;
    const comm = Math.round((totalCommunication / validCount) * 10) / 10;
    const problemSolving = Math.round((totalProblemSolving / validCount) * 10) / 10;
    const arch = Math.round(((depth + practical) / 2) * 10) / 10;

    // Seniority assessment
    const seniorityAssessment = this.calculateSeniority(config.experienceTier, avgOverall, depth, practical, arch);

    // Strengths & Weaknesses extraction
    const strengthsSet = new Set<string>();
    const weaknessesSet = new Set<string>();
    const recurringWeaknesses: RecurringWeakness[] = [];
    const learningPlan: LearningRecommendation[] = [];

    for (const a of answeredList) {
      const e = a.evaluation!;
      e.positiveHighlights.forEach(p => strengthsSet.add(p));
      e.whyMarksLost.forEach(w => weaknessesSet.add(w));

      if (e.numericScore < 7.0) {
        recurringWeaknesses.push({
          topic: a.question.topic,
          technology: a.question.technology,
          averageScore: e.numericScore,
          occurrences: 1,
          lastMissedConcepts: e.comparison.missingConcepts,
        });

        learningPlan.push({
          topic: a.question.topic,
          technology: a.question.technology,
          priority: e.numericScore < 5.0 ? 'High' : 'Medium',
          reason: `${e.comparison.missingConcepts.slice(0, 2).join(', ')} required deeper architectural explanation.`,
          actionItems: [
            `Practice 5 focused theory questions on ${a.question.subtopic}`,
            `Review internal lifecycle and memory constraints for ${a.question.topic}`,
          ],
        });
      }
    }

    const strengths = Array.from(strengthsSet).slice(0, 5);
    const weaknesses = Array.from(weaknessesSet).slice(0, 5);

    // Target Role Readiness
    const roleName = config.experienceTier.includes('8') || config.experienceTier.includes('12')
      ? 'Lead / Principal Frontend Architect'
      : config.experienceTier.includes('4') || config.experienceTier.includes('6')
      ? 'Senior Frontend Engineer'
      : 'Mid-Level Frontend Developer';

    const targetRoleReadiness: TargetRoleReadiness = {
      role: roleName,
      overallPercent: Math.min(100, Math.round(avgOverall * 10)),
      competencyBreakdown: {
        'Technical Correctness': Math.round(technical * 10),
        'Conceptual Depth': Math.round(depth * 10),
        'Practical Application': Math.round(practical * 10),
        'Architecture & Design': Math.round(arch * 10),
        'Communication': Math.round(comm * 10),
      },
      criticalBlockers: weaknesses.slice(0, 3),
    };

    return {
      sessionId,
      overallScore: avgOverall,
      letterGrade: this.scoreToFinalGrade(avgOverall),
      confidence: answeredList.length >= 3 ? 'High' : 'Medium',
      competencyPillars: {
        technicalCorrectness: technical,
        conceptualDepth: depth,
        practicalApplication: practical,
        problemSolving,
        architectureAndDesign: arch,
        communicationAndClarity: comm,
      },
      seniorityAssessment,
      strengths: strengths.length > 0 ? strengths : ['Demonstrated working technical familiarity across core interview tracks.'],
      weaknesses: weaknesses.length > 0 ? weaknesses : ['Continue sharpening edge-case handling under production constraints.'],
      recurringWeaknesses: recurringWeaknesses.slice(0, 4),
      criticalGaps: weaknesses.slice(0, 3),
      communicationSummary: {
        clarityScore: comm,
        pacingWordsPerMinute: 135,
        fillerWordsCount: 2,
        structureRating: comm >= 8.5 ? 'Executive' : comm >= 7.5 ? 'Strong' : 'Moderate',
        keyObservations: [
          'Effective conversational flow with clear technical vocabulary.',
          'Consistently communicated technical trade-offs with structured rationale.',
        ],
      },
      learningPlan: learningPlan.slice(0, 4),
      targetRoleReadiness,
      evaluatedAt: new Date().toISOString(),
    };
  },

  calculateSeniority(
    claimedTier: string,
    overallScore: number,
    depth: number,
    practical: number,
    arch: number
  ): SeniorityReadiness {
    let demonstrated = 'Mid-Level Developer';
    let readinessPercent = Math.min(98, Math.round((overallScore / 10) * 100));

    if (overallScore >= 8.8 && arch >= 8.5 && depth >= 8.5) {
      demonstrated = 'Staff / Principal Engineer';
    } else if (overallScore >= 7.8 && depth >= 7.5) {
      demonstrated = 'Senior Frontend Engineer';
    } else if (overallScore >= 6.0) {
      demonstrated = 'Mid-Level Developer';
    } else {
      demonstrated = 'Junior Developer';
    }

    let status: SeniorityReadiness['status'] = 'MEETS_EXPECTED';
    if (readinessPercent >= 80) status = 'EXCEEDS_EXPECTED';
    else if (readinessPercent < 65) status = 'BELOW_EXPECTED';

    return {
      claimedLevel: `${claimedTier} Years Experience`,
      expectedLevel: claimedTier.includes('4') || claimedTier.includes('6') ? 'Senior' : 'Mid-Level',
      demonstratedLevel: demonstrated,
      readinessPercentage: readinessPercent,
      status,
      keyDifferentiators: [
        `System architecture depth scored at ${arch}/10`,
        `Demonstrated ${depth >= 7.5 ? 'strong' : 'developing'} root-cause analytical capability`,
        `Practical trade-off articulation measured at ${practical}/10`,
      ],
    };
  },

  scoreToFinalGrade(score: number): FinalInterviewScorecard['letterGrade'] {
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
};
