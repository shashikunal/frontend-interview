import type { MockQuestion, ExperienceTier } from '../types/questionBank.types';
import type { ConceptComparisonResult } from '../types/mock.types';
import { ollamaProvider } from './providers/ollamaProvider';

export interface FollowUpDecision {
  shouldAskFollowUp: boolean;
  followUpQuestion?: string;
  reason?: string;
  targetConcept?: string;
}

export const followUpService = {
  async generateFollowUp(
    question: MockQuestion,
    candidateTranscript: string,
    comparison: ConceptComparisonResult,
    experienceLevel: ExperienceTier
  ): Promise<FollowUpDecision> {
    const transcript = candidateTranscript.trim();
    if (transcript.length < 20) {
      return {
        shouldAskFollowUp: false,
        reason: 'Answer is too short or omitted; advancing directly to evaluation.',
      };
    }

    // Check if Ollama is running locally for dynamic LLM follow-up generation
    const ollamaStatus = await ollamaProvider.isAvailable();
    if (ollamaStatus.available) {
      try {
        const prompt = `You are a Principal Technical Interviewer conducting a voice interview for a candidate with ${experienceLevel} level in ${question.technology}.
The original question was: "${question.question}".
The candidate answered: "${transcript}".
Expected concepts: ${question.expectedConcepts.join(', ')}.
Demonstrated concepts: ${comparison.correctConcepts.join(', ')}.
Missing concepts: ${comparison.missingConcepts.join(', ')}.

Decide if a deeper technical follow-up is warranted to test edge cases, runtime trade-offs, or production failure scenarios.
Output JSON ONLY in this exact format:
{
  "shouldAskFollowUp": true,
  "followUpQuestion": "A concise, conversational 1-sentence follow-up question probing deeper.",
  "reason": "Why this follow-up is critical for seniority evaluation",
  "targetConcept": "Concept being probed"
}`;

        const res = await ollamaProvider.generateCompletion(prompt, {
          jsonMode: true,
          temperature: 0.3,
        });

        const parsed = JSON.parse(res.content);
        if (parsed && typeof parsed.shouldAskFollowUp === 'boolean' && parsed.followUpQuestion) {
          return {
            shouldAskFollowUp: parsed.shouldAskFollowUp,
            followUpQuestion: parsed.followUpQuestion,
            reason: parsed.reason || 'Probing deeper architecture implications.',
            targetConcept: parsed.targetConcept,
          };
        }
      } catch (err) {
        console.warn('Ollama follow-up generation failed, using deterministic probing:', err);
      }
    }

    // Deterministic Rule Engine for Follow-Ups
    // If the candidate demonstrated some correct concepts but left out critical edge cases
    if (comparison.correctConcepts.length > 0 && comparison.missingConcepts.length > 0) {
      const missingConcept = comparison.missingConcepts[0];
      const followUpTemplates = [
        `You touched on ${comparison.correctConcepts[0]}, but how would you handle ${missingConcept} in high-throughput production environments?`,
        `Now suppose edge cases occur around ${missingConcept}—what happens at the browser engine level, and how would you diagnose it?`,
        `That explains the happy path, but what are the performance and memory trade-offs when dealing with ${missingConcept}?`,
        `Can you give a concrete production example of how ${missingConcept} affects application scalability or user experience?`,
      ];

      const template = followUpTemplates[Math.floor(Math.random() * followUpTemplates.length)];

      return {
        shouldAskFollowUp: true,
        followUpQuestion: template,
        reason: `Candidate mastered basic principles but omitted ${missingConcept}. Probing depth.`,
        targetConcept: missingConcept,
      };
    }

    // If candidate answered comprehensively
    if (comparison.missingConcepts.length === 0 && comparison.correctConcepts.length >= 2) {
      return {
        shouldAskFollowUp: true,
        followUpQuestion: `Excellent coverage. At a senior architecture level, what is the single biggest architectural trade-off or failure scenario associated with this design?`,
        reason: 'Mastery confirmed. Probing senior failure scenario reasoning.',
        targetConcept: 'Architecture Trade-offs',
      };
    }

    return {
      shouldAskFollowUp: false,
      reason: 'Sufficient evidence collected for this question.',
    };
  },
};
