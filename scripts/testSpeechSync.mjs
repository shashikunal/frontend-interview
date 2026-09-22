import fs from 'fs';
import path from 'path';

function sanitizeForSpeech(rawText) {
  if (!rawText) return ''
  let text = rawText
  text = text.replace(/<[^>]+>/g, ' ')
  text = text.replace(/```[\s\S]*?```/g, ' ')
  text = text.replace(/^#{1,6}\s*(.+)$/gm, '$1.')
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1')
  text = text.replace(/\*([^*]+)\*/g, '$1')
  text = text.replace(/__([^_]+)__/g, '$1')
  text = text.replace(/_([^_]+)_/g, '$1')
  text = text.replace(/`([^`]+)`/g, '$1')
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  text = text.replace(/^\s*[-*+]\s+/gm, '')
  text = text.replace(/[\\#{}[\]()~>]/g, ' ')
  text = text.replace(/\s+/g, ' ').trim()
  text = text.replace(/\.+/g, '.')
  return text
}

function getUiSentences(text) {
  if (!text) return [];
  const paras = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  let sentences = [];
  for (const p of paras) {
    const lines = p.split('\n').map(l => l.trim()).filter(Boolean);
    const isNumbered = lines.length > 0 && lines.every(l => /^(\d+[\.\)]|Step\s+\d+:?)\s+/i.test(l));
    const isBullet = lines.length > 0 && lines.every(l => /^[-*•]\s+/.test(l));
    if (isNumbered || isBullet) {
      sentences.push(...lines);
    } else {
      sentences.push(...p.split(/(?<=[.!?])\s+/).filter(Boolean));
    }
  }
  return sentences;
}

const dir = path.resolve('public/data/interview-questions');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'catalog.json');

let totalShortMismatches = 0;
let totalExpMismatches = 0;
let totalHowItWorksMismatches = 0;
let mismatchExamples = [];

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  const questions = Array.isArray(data) ? data : (data.questions || []);

  for (const q of questions) {
    // 1. Short Answer
    if (q.shortAnswer) {
      const clean = sanitizeForSpeech(q.shortAnswer);
      const speechSentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean);
      const uiSentences = getUiSentences(q.shortAnswer);
      if (speechSentences.length !== uiSentences.length) {
        totalShortMismatches++;
        if (mismatchExamples.length < 5) {
          mismatchExamples.push({ file, field: 'shortAnswer', q: q.question, speech: speechSentences.length, ui: uiSentences.length, speechSentences, uiSentences });
        }
      }
    }

    // 2. Simple Explanation
    const exp = q.simpleExplanation || q.detailedAnswer || q.detailedExplanation;
    if (exp) {
      const clean = sanitizeForSpeech(exp);
      const speechSentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean);
      const uiSentences = getUiSentences(exp);
      if (speechSentences.length !== uiSentences.length) {
        totalExpMismatches++;
        if (mismatchExamples.length < 10) {
          mismatchExamples.push({ file, field: 'simpleExplanation', q: q.question, speech: speechSentences.length, ui: uiSentences.length, speechSentences, uiSentences });
        }
      }
    }

    // 3. How It Works
    if (q.howItWorks) {
      const clean = sanitizeForSpeech(q.howItWorks);
      const speechSentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean);
      const uiSentences = getUiSentences(q.howItWorks);
      if (speechSentences.length !== uiSentences.length) {
        totalHowItWorksMismatches++;
        if (mismatchExamples.length < 15) {
          mismatchExamples.push({ file, field: 'howItWorks', q: q.question, speech: speechSentences.length, ui: uiSentences.length, speechSentences, uiSentences });
        }
      }
    }
  }
}

console.log('Results across all files:');
console.log('Short Answer mismatches:', totalShortMismatches);
console.log('Simple Explanation mismatches:', totalExpMismatches);
console.log('How It Works mismatches:', totalHowItWorksMismatches);
console.log('Sample mismatches:');
console.dir(mismatchExamples.slice(0, 5), { depth: null });
