import fs from 'fs';

function extractSentencesFromStructuredText(rawText) {
  if (!rawText) return [];
  const paras = rawText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const segments = [];

  for (const para of paras) {
    const lines = para.split('\n').map(l => l.trim()).filter(Boolean);
    const isNumbered = lines.length > 0 && lines.every(l => /^(\d+[\.\)]|Step\s+\d+:?)\s+/i.test(l));
    const isBullet = lines.length > 0 && lines.every(l => /^[-*•]\s+/.test(l));

    if (isNumbered) {
      for (const line of lines) {
        // Clean line for speech
        const cleaned = line
          .replace(/^(\d+)[\.\)]\s*/, 'Step $1: ')
          .replace(/<[^>]+>/g, ' ')
          .replace(/`([^`]+)`/g, '$1')
          .replace(/\*\*([^*]+)\*\*/g, '$1')
          .replace(/\*([^*]+)\*/g, '$1')
          .replace(/\s+/g, ' ')
          .trim();
        if (cleaned) segments.push(cleaned);
      }
    } else if (isBullet) {
      for (const line of lines) {
        const cleaned = line
          .replace(/^[-*•]\s*/, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/`([^`]+)`/g, '$1')
          .replace(/\*\*([^*]+)\*\*/g, '$1')
          .replace(/\*([^*]+)\*/g, '$1')
          .replace(/\s+/g, ' ')
          .trim();
        if (cleaned) segments.push(cleaned);
      }
    } else {
      // Standard paragraph: split by sentence endings (.!?), ignoring periods in abbreviations or numbers like 1.0 or e.g.
      const rawSentences = para.split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/).filter(Boolean);
      for (const s of rawSentences) {
        const cleaned = s
          .replace(/<[^>]+>/g, ' ')
          .replace(/`([^`]+)`/g, '$1')
          .replace(/\*\*([^*]+)\*\*/g, '$1')
          .replace(/\*([^*]+)\*/g, '$1')
          .replace(/\s+/g, ' ')
          .trim();
        if (cleaned) segments.push(cleaned);
      }
    }
  }

  return segments;
}

const sampleHowItWorks = `1. The modal container gets role='dialog'.
2. When opened, JavaScript saves the previously focused element.
3. Keyboard Tab cycles only within modal elements.`;

const segments = extractSentencesFromStructuredText(sampleHowItWorks);
console.log('Extracted segments count:', segments.length);
console.log('Segments:', segments);
const fullSpeech = segments.join(' ');
console.log('Full speech:', fullSpeech);
