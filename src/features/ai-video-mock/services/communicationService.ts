export interface CommunicationMetrics {
  clarityScore: number; // 0 - 10
  pacingWordsPerMinute: number;
  wpm?: number;
  fillerWordsCount: number;
  detectedFillerWords: string[];
  structureRating: 'Weak' | 'Moderate' | 'Strong' | 'Executive';
  wordCount: number;
  observations: string[];
}

export const communicationService = {
  analyzeTranscript(transcript: string, durationSeconds: number): CommunicationMetrics {
    const clean = transcript.trim();
    if (!clean) {
      return {
        clarityScore: 3.0,
        pacingWordsPerMinute: 0,
        fillerWordsCount: 0,
        detectedFillerWords: [],
        structureRating: 'Weak',
        wordCount: 0,
        observations: ['No audio response detected.'],
      };
    }

    const words = clean.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const minutes = Math.max(0.2, durationSeconds / 60);
    const wpm = Math.round(wordCount / minutes);

    // Filler words detection
    const fillerRegex = /\b(um|uh|er|ah|like|you know|basically|actually|literally|sort of|kind of)\b/gi;
    const fillers = clean.match(fillerRegex) || [];

    // Structure indicators
    const hasIntro = /\b(first|to begin with|firstly|fundamentally|primarily|essentially)\b/i.test(clean);
    const hasExample = /\b(for example|for instance|in my experience|such as|in production)\b/i.test(clean);
    const hasConclusion = /\b(in conclusion|overall|therefore|to summarize|that is why|ultimately)\b/i.test(clean);

    let structureRating: CommunicationMetrics['structureRating'] = 'Moderate';
    let structurePoints = 0;
    if (hasIntro) structurePoints++;
    if (hasExample) structurePoints++;
    if (hasConclusion) structurePoints++;

    if (structurePoints >= 3 && wordCount >= 60) structureRating = 'Executive';
    else if (structurePoints >= 2) structureRating = 'Strong';
    else if (structurePoints === 1 || wordCount >= 40) structureRating = 'Moderate';
    else structureRating = 'Weak';

    // Clarity score calculation
    let clarity = 7.0;
    if (wpm >= 110 && wpm <= 160) clarity += 1.5; // Optimal conversational pace
    else if (wpm < 80) clarity -= 1.0; // Too slow
    else if (wpm > 190) clarity -= 1.0; // Too rushed

    if (fillers.length > 5) clarity -= 1.5;
    else if (fillers.length === 0) clarity += 1.0;

    if (structureRating === 'Executive') clarity += 1.0;
    else if (structureRating === 'Weak') clarity -= 1.5;

    const clarityScore = Math.min(10, Math.max(1, Math.round(clarity * 10) / 10));

    const observations: string[] = [];
    if (wpm >= 110 && wpm <= 160) {
      observations.push(`Excellent pacing at ${wpm} words per minute, allowing clear technical comprehension.`);
    } else if (wpm > 180) {
      observations.push(`Rapid delivery (${wpm} WPM). Practice intentional micro-pauses before key technical points.`);
    } else if (wpm < 90) {
      observations.push(`Measured pace (${wpm} WPM). Aim for more fluid transitions between concepts.`);
    }

    if (fillers.length > 3) {
      observations.push(`Detected ${fillers.length} conversational filler words (${Array.from(new Set(fillers.map(f => f.toLowerCase()))).join(', ')}). Replacing fillers with brief silence projects executive confidence.`);
    } else {
      observations.push('Crisp verbal delivery with minimal filler hesitations.');
    }

    if (hasExample) {
      observations.push('Strong use of practical concrete examples to ground theoretical explanations.');
    } else {
      observations.push('Consider concluding your response with a real-world production use-case (Answer → Reason → Example → Summary).');
    }

    return {
      clarityScore,
      pacingWordsPerMinute: wpm,
      wpm,
      fillerWordsCount: fillers.length,
      detectedFillerWords: Array.from(new Set(fillers.map(f => f.toLowerCase()))),
      structureRating,
      wordCount,
      observations,
    };
  },
};
