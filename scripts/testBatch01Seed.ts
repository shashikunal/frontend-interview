// scripts/testBatch01Seed.ts
import { batch01Questions } from './generateBatch01';
import { testBatch } from './verifyCoreBatch';

async function run() {
  const ok = await testBatch(batch01Questions);
  process.exit(ok ? 0 : 1);
}
run();
