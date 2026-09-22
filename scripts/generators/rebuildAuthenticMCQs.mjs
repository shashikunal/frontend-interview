// scripts/generators/rebuildAuthenticMCQs.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../public/data/interview-questions');

const BOILERPLATE_PATTERNS = [
  'triggers a synchronous full document redraw',
  'disables the JavaScript microtask queue',
  'forces all asynchronous promises to evaluate as blocking',
  'standardized, predictable runtime execution for',
  'deterministic behavior for',
  'redraws the operating system desktop'
];

function isBoilerplateText(text) {
  if (!text) return true;
  return BOILERPLATE_PATTERNS.some(pat => text.toLowerCase().includes(pat.toLowerCase()));
}

function cleanText(t) {
  return (t || '')
    .replace(/[*_#`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getFirstSentence(text) {
  const clean = cleanText(text);
  const m = clean.match(/^.+?[.?!](?=\s|$)/);
  return m ? m[0].trim() : clean;
}

function formatOptionLength(text, maxLength = 190) {
  let clean = cleanText(text);
  if (!clean) return '';
  if (clean.length <= maxLength) return clean;

  const sentences = clean.split(/(?<=[.?!])\s+/);
  if (sentences[0] && sentences[0].length >= 50 && sentences[0].length <= maxLength) {
    return sentences[0];
  }

  // Truncate at last space before maxLength
  const truncated = clean.slice(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 40 ? truncated.slice(0, lastSpace) : truncated) + '...';
}

function cleanOptionText(text, concept) {
  let res = cleanText(text);
  const c = cleanText(concept);
  if (c && res.toLowerCase().startsWith(c.toLowerCase())) {
    res = res.slice(c.length).trim();
    res = res.replace(/^(is|are|refers to|defines|provides|enables|describes)\s+/i, '');
  }
  res = res.replace(/^in\s+[a-z0-9\s&,]+\s*,\s*/i, '');
  if (!res) res = cleanText(text);
  return formatOptionLength(res.charAt(0).toUpperCase() + res.slice(1));
}

function formatQuestionStem(q, subjectName) {
  if (q.question && q.question.trim().endsWith('?')) {
    return q.question.trim();
  }
  const conceptName = cleanText(q.concept || q.subtopic || q.question || 'this feature');
  return `Which statement accurately describes ${conceptName} in ${subjectName}?`;
}

const catalogPath = path.join(DATA_DIR, 'catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

console.log(`Starting authentic MCQ rebuild across ${catalog.subjects.length} subjects...`);

let totalQuestions = 0;
let updatedMCQs = 0;
let preservedMCQs = 0;

for (const sub of catalog.subjects) {
  const filePath = path.join(DATA_DIR, `${sub.id}.json`);
  if (!fs.existsSync(filePath)) continue;

  const rawQuestions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const subName = sub.name || sub.id;

  // Build subject concept bank for domain distractors
  const conceptBank = [];
  for (let i = 0; i < rawQuestions.length; i++) {
    const q = rawQuestions[i];
    const cName = cleanText(q.concept || q.subtopic || q.question);
    let def = cleanText(q.shortAnswer);
    if (!def || def.includes('is a core mechanism in JavaScript that governs how values are evaluated')) {
      def = (q.simpleExplanation && q.simpleExplanation.length > 30 ? getFirstSentence(q.simpleExplanation) : null) ||
        `${cName} provides dedicated functionality within ${subName}.`;
    }
    const cleanDef = cleanOptionText(def, cName);

    conceptBank.push({
      index: i,
      concept: cName,
      definition: cleanDef,
      firstSentence: getFirstSentence(q.shortAnswer || cleanDef)
    });
  }

  const updatedQuestions = rawQuestions.map((q, idx) => {
    totalQuestions++;
    const qNum = q.questionNumber || (idx + 1);
    const targetConcept = cleanText(q.concept || q.subtopic || q.question || 'Core Concept');

    // Check if question already has authentic, non-boilerplate MCQs
    const hasOptions = Array.isArray(q.options) && q.options.length === 4;
    const hasBoilerplate = hasOptions && q.options.some(o => isBoilerplateText(o.text) || isBoilerplateText(o.explanation));
    const isAuthentic = hasOptions && !hasBoilerplate && q.options.some(o => o.explanation && o.explanation.length > 15);

    if (isAuthentic) {
      preservedMCQs++;
      return q;
    }

    updatedMCQs++;

    // 1. Question stem
    const mcqQuestion = formatQuestionStem(q, subName);

    // 2. Correct option
    let rawCorrect = cleanText(q.shortAnswer);
    if (!rawCorrect || rawCorrect.includes('is a core mechanism in JavaScript that governs how values are evaluated')) {
      rawCorrect = `${targetConcept} defines core architectural behavior and runtime execution semantics in ${subName}.`;
    }
    const correctText = cleanOptionText(rawCorrect, targetConcept);
    const correctFirstSentence = getFirstSentence(q.shortAnswer || correctText);
    const correctExp = `Correct. ${correctFirstSentence}`;

    // 3. Assemble 3 distinct distractors from the subject domain
    const candidateDistractors = [];
    const usedTexts = new Set([correctText.toLowerCase()]);

    let step = 1;
    while (candidateDistractors.length < 3 && step < conceptBank.length) {
      const neighborIdx = (idx + step * 2) % conceptBank.length;
      step++;
      const candidate = conceptBank[neighborIdx];

      if (!candidate || candidate.concept.toLowerCase() === targetConcept.toLowerCase()) continue;
      const distText = candidate.definition;
      if (usedTexts.has(distText.toLowerCase()) || distText.length < 15) continue;

      usedTexts.add(distText.toLowerCase());
      candidateDistractors.push({
        text: distText,
        exp: `Incorrect. This describes ${candidate.concept}, not ${targetConcept}.`
      });
    }

    // Fallback if small bank
    while (candidateDistractors.length < 3) {
      const fallbackIdx = (idx + candidateDistractors.length + 1) % conceptBank.length;
      const c = conceptBank[fallbackIdx];
      const fallbackText = `It delegates all evaluation to ${c ? c.concept : 'external modules'} without local execution.`;
      candidateDistractors.push({
        text: fallbackText,
        exp: `Incorrect. This does not describe the actual behavior of ${targetConcept}.`
      });
    }

    // 4. Distribute options across A, B, C, D
    const correctIdx = (qNum - 1) % 4;
    const keys = ['A', 'B', 'C', 'D'];
    const correctKey = keys[correctIdx];

    const rawOptions = [];
    let distIdx = 0;

    for (let i = 0; i < 4; i++) {
      if (i === correctIdx) {
        rawOptions.push({
          key: keys[i],
          id: keys[i],
          text: correctText,
          explanation: correctExp
        });
      } else {
        const dist = candidateDistractors[distIdx++];
        rawOptions.push({
          key: keys[i],
          id: keys[i],
          text: dist.text,
          explanation: dist.exp
        });
      }
    }

    const wrongOptionExplanations = {};
    rawOptions.forEach(opt => {
      if (opt.key !== correctKey) {
        wrongOptionExplanations[opt.key] = opt.explanation;
      }
    });

    return {
      ...q,
      mcqQuestion,
      options: rawOptions,
      correctAnswer: correctKey,
      correctOption: correctKey,
      mcqExplanation: correctExp,
      explanation: correctExp,
      wrongOptionExplanations
    };
  });

  fs.writeFileSync(filePath, JSON.stringify(updatedQuestions, null, 2), 'utf8');
  console.log(`✓ ${sub.id.padEnd(24)}: Processed ${updatedQuestions.length} questions.`);
}

console.log('\n======================================================');
console.log(`🎉 REBUILD COMPLETE!`);
console.log(`TOTAL QUESTIONS:      ${totalQuestions}`);
console.log(`REBUILT WITH AUTHENTIC MCQS: ${updatedMCQs}`);
console.log(`PRESERVED AUTHENTIC MCQS:    ${preservedMCQs}`);
console.log('======================================================');
