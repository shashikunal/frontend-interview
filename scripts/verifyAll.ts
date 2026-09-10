// scripts/verifyAll.ts
import { CORE_PROGRAMMING_QUESTIONS } from '../src/components/coreprogramming/data/coreProgrammingQuestions';
import { testBatch } from './verifyCoreBatch';

async function main() {
  console.log(`Verifying all ${CORE_PROGRAMMING_QUESTIONS.length} Core Programming Questions...`);
  const success = await testBatch(CORE_PROGRAMMING_QUESTIONS);
  process.exit(success ? 0 : 1);
}

main();
