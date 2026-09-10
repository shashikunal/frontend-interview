// scripts/problem-blueprints.mjs
// Comprehensive catalog of 1,000 distinct frontend JavaScript programming blueprints

import { getBatch1Problem } from './blueprints/batch1-blueprints.mjs';
import { getBatch2Problem } from './blueprints/batch2-blueprints.mjs';
import { getBatch3Problem } from './blueprints/batch3-blueprints.mjs';
import { getBatch4Problem } from './blueprints/batch4-blueprints.mjs';
import { getBatch5Problem } from './blueprints/batch5-blueprints.mjs';
import { getBatch6Problem } from './blueprints/batch6-blueprints.mjs';
import { getBatch7Problem } from './blueprints/batch7-blueprints.mjs';
import { getBatch8Problem } from './blueprints/batch8-blueprints.mjs';
import { getBatch9Problem } from './blueprints/batch9-blueprints.mjs';
import { getBatch10Problem } from './blueprints/batch10-blueprints.mjs';

export function getProblemDefinition(batchNum, idx, num) {
  switch (batchNum) {
    case 1:
      return getBatch1Problem(idx, num);
    case 2:
      return getBatch2Problem(idx, num);
    case 3:
      return getBatch3Problem(idx, num);
    case 4:
      return getBatch4Problem(idx, num);
    case 5:
      return getBatch5Problem(idx, num);
    case 6:
      return getBatch6Problem(idx, num);
    case 7:
      return getBatch7Problem(idx, num);
    case 8:
      return getBatch8Problem(idx, num);
    case 9:
      return getBatch9Problem(idx, num);
    case 10:
      return getBatch10Problem(idx, num);
    default:
      return getBatch1Problem(idx, num);
  }
}
