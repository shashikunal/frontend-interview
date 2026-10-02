/**
 * Central on-demand registry for heavy question catalogs.
 *
 * The catalog datasets (MC facade + DSA/CP/FJS batches + 3.6MB masterCatalog +
 * 4.5MB machineCodingQuestions) must never be statically imported by shared
 * services — that drags ~9MB into every consumer bundle (e.g. Dashboard).
 * Instead services read the sync cache below (empty until loaded, with
 * ID-based fallbacks at call sites) and page-level boundaries preload via
 * ensureCatalog().
 *
 * All type imports are `import type` (fully erased) — zero bundle cost.
 */
import type { MCQuestionCatalogItem } from '../components/machinecoding/data/machineCodingCatalog';
import type { DSAQuestion } from '../components/dsa/data/dsaTypes';
import type { CoreProgrammingQuestion } from '../components/coreprogramming/data/coreProgrammingTypes';
import type { FrontendJsQuestion } from '../components/frontendjs/data/frontendJsTypes';
import type { MCQuestion as MasterMCQuestion } from '../components/machinecoding/data/masterCatalog';
import type { MCQuestion as FullMCQuestion } from '../components/machinecoding/machineCodingQuestions';

export type CatalogName = 'mc' | 'dsa' | 'cp' | 'fjs' | 'master' | 'mcFull';

interface CatalogCache {
  mc: MCQuestionCatalogItem[];
  dsa: DSAQuestion[];
  cp: CoreProgrammingQuestion[];
  fjs: FrontendJsQuestion[];
  master: MasterMCQuestion[];
  mcFull: FullMCQuestion[];
}

const cache: CatalogCache = {
  mc: [],
  dsa: [],
  cp: [],
  fjs: [],
  master: [],
  mcFull: [],
};

const loaded = new Set<CatalogName>();
const pending = new Map<CatalogName, Promise<unknown>>();

const loaders: Record<CatalogName, () => Promise<unknown>> = {
  mc: () => import('../components/machinecoding/data/machineCodingCatalog').then(m => m.MACHINE_CODING_CATALOG),
  dsa: () => import('../components/dsa/data/dsaQuestions').then(m => m.DSA_QUESTIONS),
  cp: () => import('../components/coreprogramming/data/coreProgrammingQuestions').then(m => m.CORE_PROGRAMMING_QUESTIONS),
  fjs: () => import('../components/frontendjs/data/frontendJsQuestions').then(m => m.FRONTEND_JS_QUESTIONS),
  master: () => import('../components/machinecoding/data/masterCatalog').then(m => m.MASTER_500_QUESTIONS),
  mcFull: () => import('../components/machinecoding/machineCodingQuestions').then(m => m.MACHINE_CODING_QUESTIONS),
};

export function isCatalogLoaded(name: CatalogName): boolean {
  return loaded.has(name);
}

export function ensureCatalog<K extends CatalogName>(name: K): Promise<CatalogCache[K]> {
  if (loaded.has(name)) return Promise.resolve(cache[name]);
  const p = pending.get(name);
  if (p) return p as Promise<CatalogCache[K]>;
  const task = loaders[name]().then(list => {
    cache[name] = list as never;
    loaded.add(name);
    pending.delete(name);
    return cache[name];
  });
  pending.set(name, task);
  return task;
}

export async function ensureCatalogs(names: CatalogName[]): Promise<void> {
  await Promise.all(names.map(n => ensureCatalog(n)));
}

/** Sync cache reads — empty arrays until the matching ensureCatalog() resolves. */
export function getMCCatalog(): MCQuestionCatalogItem[] {
  return cache.mc;
}
export function getDSACatalog(): DSAQuestion[] {
  return cache.dsa;
}
export function getCPCatalog(): CoreProgrammingQuestion[] {
  return cache.cp;
}
export function getFJSCatalog(): FrontendJsQuestion[] {
  return cache.fjs;
}
export function getMasterCatalog(): MasterMCQuestion[] {
  return cache.master;
}
export function getMCFullCatalog(): FullMCQuestion[] {
  return cache.mcFull;
}

/** Mirrors getCoreProgrammingQuestion() semantics over the CP cache. */
export function getCachedCPQuestion(idOrSlug: string): CoreProgrammingQuestion | undefined {
  if (!idOrSlug) return undefined;
  const list = cache.cp;
  return (
    list.find(q => q.id === idOrSlug) ||
    list.find(q => q.slug === idOrSlug) ||
    list.find(q => q.id.toUpperCase() === idOrSlug.toUpperCase())
  );
}

export function catalogCounts(): Record<'mc' | 'dsa' | 'cp' | 'fjs', number> {
  return { mc: cache.mc.length, dsa: cache.dsa.length, cp: cache.cp.length, fjs: cache.fjs.length };
}
