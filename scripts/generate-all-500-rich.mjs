import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateArchetypeCode } from './archetype-generator.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetFile = path.join(__dirname, '../src/components/machinecoding/machineCodingQuestions.ts');
const sourceContent = fs.readFileSync(targetFile, 'utf8');

// 1. Extract Q001 to Q020 as literal source code block
const q001_to_q020_match = sourceContent.match(/export const MACHINE_CODING_QUESTIONS: MCQuestion\[\] = \[([\s\S]*?)(\n\s*\{\s*"id":\s*"Q021"|\n\s*\{\s*id:\s*'Q021')/);

if (!q001_to_q020_match) {
  console.error("Could not find Q001-Q020 boundary in machineCodingQuestions.ts");
  process.exit(1);
}

const q001_to_q020_raw = q001_to_q020_match[1].trim();
console.log("Preserved Q001-Q020 block, length:", q001_to_q020_raw.length);

// 2. Read TIERS and questions list from generate-500-mc.mjs
const genScript = fs.readFileSync(path.join(__dirname, './generate-500-mc.mjs'), 'utf8');
const tiersMatch = genScript.match(/const TIERS = (\[[\s\S]*?\n\];)/);

if (!tiersMatch) {
  console.error("Could not extract TIERS from generate-500-mc.mjs");
  process.exit(1);
}

// Evaluate TIERS safely
const TIERS = eval(`(${tiersMatch[1].replace(/;$/, '')})`);
console.log(`Loaded ${TIERS.length} tiers`);

function buildCandidateStarterTemplate(topic, id, difficulty, category, timeEstimate, requirements) {
  const reqList = requirements.map((r, i) => ` * ${i + 1}. ${r}`).join('\n');
  return `import React, { useState, useEffect } from 'react';

/**
 * [${id}] ${topic}
 * Difficulty: ${difficulty} | Category: ${category} | Time: ${timeEstimate}
 * 
 * Key Requirements:
${reqList}
 */
export default function App() {
  // TODO: Declare your component state, hooks, and event handlers here

  return (
    <div style={{
      maxWidth: '520px',
      margin: '24px auto',
      padding: '24px',
      background: 'var(--surface, #1e222d)',
      border: '1px solid var(--border, #334155)',
      borderRadius: '16px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: 'var(--text-primary, #f8fafc)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
    }}>
      <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--border, #334155)', paddingBottom: '12px' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '18px', color: 'var(--accent, #60a5fa)' }}>
          ${topic}
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary, #94a3b8)' }}>
          Build your solution according to the requirements in the problem specs.
        </p>
      </div>

      {/* Candidate workspace canvas */}
      <div style={{
        padding: '36px 20px',
        textAlign: 'center',
        border: '2px dashed var(--border, #475569)',
        borderRadius: '12px',
        background: 'var(--bg, #0f172a)',
        color: 'var(--text-secondary, #94a3b8)'
      }}>
        <div style={{ fontSize: '28px', marginBottom: '8px' }}>⚡</div>
        <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary, #fff)', marginBottom: '4px' }}>
          Interactive Challenge Canvas
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted, #64748b)' }}>
          Write your component implementation here, or click "💡 Load Solution" to review reference architecture.
        </div>
      </div>
    </div>
  );
}`;
}

const questions = [];

for (const tier of TIERS) {
  const [start, end] = tier.range;
  const count = end - start + 1;

  for (let i = 0; i < count; i++) {
    const num = start + i;
    if (num <= 20) continue; // Skip first 20 as they are handcrafted

    const id = `Q${String(num).padStart(3, '0')}`;
    const topic = tier.topics[i] || `${tier.name} Challenge #${num}`;
    const category = tier.category;
    const difficulty = tier.difficulty;
    const timeEstimate = tier.time;

    const { solution } = generateArchetypeCode(topic, id, category, difficulty);

    const requirements = [
      `Initialize ${topic} state with sensible defaults and error boundaries.`,
      'Handle primary user events (clicks, keypresses, input changes) with zero UI lag.',
      'Implement clean lifecycle and effect cleanup to avoid memory leaks.',
      'Deliver a polished, accessible, modern UI with clear feedback states.'
    ];

    const starter = buildCandidateStarterTemplate(topic, id, difficulty, category, timeEstimate, requirements);

    const qObj = {
      id,
      title: topic,
      category,
      difficulty,
      timeEstimate,
      summary: `Master hands-on implementation of ${topic} with complete state lifecycle, edge-case resilience, and interviewer follow-ups.`,
      description: `Build a production-ready ${topic} component in React conforming to modern best practices.\n\nKey Capabilities:\n1. Resilient state architecture using React 19 functional patterns.\n2. Smooth user interactions, event handling, and accessible controls.\n3. Production-grade error resilience, cleanup handling, and clean UX feedback.`,
      requirements,
      interviewTips: [
        'Think about component decoupling and custom hook abstraction early.',
        'Always verify effect dependencies to avoid stale state closures.',
        'Design with edge cases in mind (empty states, rapid input, rapid toggling).'
      ],
      commonMistakes: [
        'Failing to clean up timers, intervals, or event listeners on unmount.',
        'Mutating state directly rather than using functional state setters.',
        'Missing keyboard accessibility or accessible contrast.'
      ],
      starterCode: starter,
      solutionCode: solution
    };

    questions.push(qObj);
  }
}

console.log(`Generated ${questions.length} rich questions for Q021-Q500`);

// Build final TypeScript file content
const header = `export interface MCQuestion {
  id: string
  title: string
  category: 'State Management' | 'Interactive UI' | 'Custom Hooks' | 'Async & Performance' | 'Architecture'
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Senior'
  timeEstimate: string
  summary: string
  description: string
  requirements: string[]
  interviewTips: string[]
  commonMistakes: string[]
  starterCode: string
  solutionCode: string
}

export const MACHINE_CODING_QUESTIONS: MCQuestion[] = [
${q001_to_q020_raw},
`;

const q21_to_q500_str = questions.map(q => JSON.stringify(q, null, 2)).join(',\n');
const footer = `\n];\n`;

const finalFileContent = header + q21_to_q500_str + footer;
fs.writeFileSync(targetFile, finalFileContent, 'utf8');

console.log(`Successfully written machineCodingQuestions.ts (${(finalFileContent.length / 1024 / 1024).toFixed(2)} MB)`);
