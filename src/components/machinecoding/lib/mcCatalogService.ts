import { MACHINE_CODING_CATALOG, type MCQuestionCatalogItem } from '../data/machineCodingCatalog';
import { MACHINE_CODING_QUESTIONS, type MCQuestion } from '../machineCodingQuestions';
import { getEnrichedQuestionSpec, type EnrichedMCQuestion } from './mcQuestionSpecService';

// O(1) Fast Index Maps
const catalogMap = new Map<string, MCQuestionCatalogItem>();
MACHINE_CODING_CATALOG.forEach(q => {
  catalogMap.set(q.id.toUpperCase(), q);
});

const detailMap = new Map<string, MCQuestion>();
MACHINE_CODING_QUESTIONS.forEach(q => {
  detailMap.set(q.id.toUpperCase(), q);
});

export { MACHINE_CODING_CATALOG, type MCQuestionCatalogItem };

export function getCatalogItemById(id: string): MCQuestionCatalogItem | undefined {
  if (!id) return undefined;
  const cleanId = id.toUpperCase();
  if (catalogMap.has(cleanId)) return catalogMap.get(cleanId);
  const padded = `Q${id.replace(/\D/g, '').padStart(3, '0')}`.toUpperCase();
  return catalogMap.get(padded);
}

export function getQuestionDetailById(id: string): EnrichedMCQuestion | null {
  if (!id) return null;
  const cleanId = id.toUpperCase();
  let raw = detailMap.get(cleanId);
  if (!raw) {
    const padded = `Q${id.replace(/\D/g, '').padStart(3, '0')}`.toUpperCase();
    raw = detailMap.get(padded);
  }
  if (!raw) return null;
  return getEnrichedQuestionSpec(raw);
}
