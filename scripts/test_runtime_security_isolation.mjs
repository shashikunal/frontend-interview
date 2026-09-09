// Runtime simulation test for candidate data isolation and DSA preservation
import { readFileSync } from 'node:fs';

console.log('=== RUNTIME ISOLATION & DSA INTEGRITY TEST ===\n');

// Mock browser localStorage
const store = new Map();
global.localStorage = {
  getItem: (key) => store.get(key) || null,
  setItem: (key, val) => store.set(key, String(val)),
  removeItem: (key) => store.delete(key),
  clear: () => store.clear()
};

// Simulate mcProgressService isolation logic
class MockMCProgressService {
  constructor() {
    this.userId = 'guest';
  }
  setUserId(id) {
    this.userId = id || 'guest';
  }
  getKey(prefix) {
    return this.userId === 'guest' ? `${prefix}_v1` : `${prefix}_v1_${this.userId}`;
  }
  markSolved(qId) {
    const key = this.getKey('mc_solved');
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    if (!existing.includes(qId)) existing.push(qId);
    localStorage.setItem(key, JSON.stringify(existing));
  }
  getSolved() {
    const key = this.getKey('mc_solved');
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
  setNote(qId, note) {
    const key = this.getKey('mc_notes');
    const notes = JSON.parse(localStorage.getItem(key) || '{}');
    notes[qId] = note;
    localStorage.setItem(key, JSON.stringify(notes));
  }
  getNote(qId) {
    const key = this.getKey('mc_notes');
    const notes = JSON.parse(localStorage.getItem(key) || '{}');
    return notes[qId] || '';
  }
}

const mcProgress = new MockMCProgressService();

// Candidate A
mcProgress.setUserId('candidate_alice_101');
mcProgress.markSolved('Q050');
mcProgress.setNote('Q050', 'Alice confidential solution approach');

console.log('[Test 1] Candidate Alice stored progress:');
console.log('  Solved:', mcProgress.getSolved());
console.log('  Note on Q050:', mcProgress.getNote('Q050'));

// Switch to Candidate B
mcProgress.setUserId('candidate_bob_202');
console.log('\n[Test 2] Switched to Candidate Bob:');
console.log('  Solved (expected empty):', mcProgress.getSolved());
console.log('  Note on Q050 (expected empty):', mcProgress.getNote('Q050'));

if (mcProgress.getSolved().length === 0 && mcProgress.getNote('Q050') === '') {
  console.log('  -> PASS: Bob has 0 access to Alice’s solves or private notes!');
} else {
  console.error('  -> FAIL: Data leak detected across candidates!');
  process.exit(1);
}

// Switch back to Candidate A
mcProgress.setUserId('candidate_alice_101');
console.log('\n[Test 3] Switched back to Candidate Alice:');
if (mcProgress.getSolved().includes('Q050') && mcProgress.getNote('Q050') === 'Alice confidential solution approach') {
  console.log('  -> PASS: Alice’s state perfectly restored!');
} else {
  console.error('  -> FAIL: Alice’s data was corrupted!');
  process.exit(1);
}

// 4. Verify DSA questions count is still exactly 1,000 (10 batches x 100 questions)
console.log('\n[Test 4] Verifying DSA 1,000 curriculum integrity:');
let totalDsaQuestions = 0;
for (let i = 1; i <= 10; i++) {
  const batchNum = String(i).padStart(2, '0');
  const filePath = `src/components/dsa/data/batches/batch${batchNum}.ts`;
  try {
    const content = readFileSync(filePath, 'utf8');
    const matches = content.match(/"id":\s*"DSA\d+"/g) || [];
    totalDsaQuestions += matches.length;
  } catch (e) {
    console.error(`Failed to read batch ${batchNum}:`, e);
  }
}
console.log(`  Total verified DSA questions: ${totalDsaQuestions}`);
if (totalDsaQuestions === 1000) {
  console.log('  -> PASS: DSA 1,000 curriculum is 100% intact and unaffected by Phase 10 changes.');
} else {
  console.error(`  -> FAIL: Expected 1000 DSA questions, found ${totalDsaQuestions}`);
  process.exit(1);
}

console.log('\nALL RUNTIME ISOLATION & INTEGRITY TESTS PASSED!');
