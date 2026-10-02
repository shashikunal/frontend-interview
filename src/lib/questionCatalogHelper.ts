import { getCPCatalog, getDSACatalog, getFJSCatalog, getMCCatalog, getCachedCPQuestion } from './catalogRegistry';

export interface UnifiedQuestionMetadata {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  trackKind: 'cp' | 'dsa' | 'fjs' | 'mc' | 'other';
  trackName: string;
  courseName: string;
  programName: string;
  description?: string;
  orderNumber: number;
  totalInTrack: number;
  questionsInTrack: Array<{ id: string; title: string; order: number }>;
}

export function getUnifiedQuestionMetadata(questionId?: string): UnifiedQuestionMetadata {
  const qid = String(questionId || '').trim();
  const upper = qid.toUpperCase();

  // 1. Core Programming (JS-Pxxx, JSPxxx, CPxxx)
  if (upper.startsWith('JS-P') || upper.startsWith('JSP') || upper.startsWith('CP')) {
    const cp = getCachedCPQuestion(qid);
    const questionsList = getCPCatalog().map((q, idx) => ({
      id: q.id,
      title: q.title,
      order: idx + 1,
    }));
    const orderIdx = getCPCatalog().findIndex(q => q.id.toUpperCase() === upper);
    const orderNumber = orderIdx >= 0 ? orderIdx + 1 : 1;

    return {
      id: cp?.id || qid,
      title: cp?.title || questionId || 'Core JavaScript Challenge',
      difficulty: (cp?.difficulty as any) || 'Medium',
      category: cp?.category || 'JavaScript Fundamentals',
      trackKind: 'cp',
      trackName: 'Core Programming',
      courseName: 'JavaScript Core Mastery',
      programName: 'Full Stack Web Engineering',
      description: (cp as any)?.prompt || 'Implement the required algorithmic logic matching all edge cases and unit tests.',
      orderNumber,
      totalInTrack: getCPCatalog().length || 10,
      questionsInTrack: questionsList,
    };
  }

  // 2. DSA Masterclass (DSAxxx)
  if (upper.startsWith('DSA')) {
    const dsa = getDSACatalog().find(q => q.id.toUpperCase() === upper);
    const questionsList = getDSACatalog().map((q, idx) => ({
      id: q.id,
      title: q.title,
      order: idx + 1,
    }));
    const orderIdx = getDSACatalog().findIndex(q => q.id.toUpperCase() === upper);
    const orderNumber = orderIdx >= 0 ? orderIdx + 1 : 1;

    return {
      id: dsa?.id || qid,
      title: dsa?.title || questionId || 'Data Structures & Algorithms',
      difficulty: (dsa?.difficulty as any) || 'Medium',
      category: (dsa as any)?.pattern || (dsa as any)?.category || 'Algorithms',
      trackKind: 'dsa',
      trackName: 'DSA Masterclass',
      courseName: 'Algorithms & Data Structures',
      programName: 'Computer Science & Software Engineering',
      description: (dsa as any)?.summary || 'Implement the optimal time and space complexity solution.',
      orderNumber,
      totalInTrack: getDSACatalog().length || 75,
      questionsInTrack: questionsList,
    };
  }

  // 3. Frontend JS (FJPxxx)
  if (upper.startsWith('FJP') || upper.startsWith('FJ')) {
    const fjs = getFJSCatalog().find(q => q.id.toUpperCase() === upper);
    const questionsList = getFJSCatalog().map((q, idx) => ({
      id: q.id,
      title: q.title,
      order: idx + 1,
    }));
    const orderIdx = getFJSCatalog().findIndex(q => q.id.toUpperCase() === upper);
    const orderNumber = orderIdx >= 0 ? orderIdx + 1 : 1;

    return {
      id: fjs?.id || qid,
      title: fjs?.title || questionId || 'Frontend JavaScript Challenge',
      difficulty: (fjs?.difficulty as any) || 'Medium',
      category: (fjs as any)?.category || 'Web APIs & DOM',
      trackKind: 'fjs',
      trackName: 'Frontend JavaScript',
      courseName: 'Frontend Web Engineering',
      programName: 'Modern Frontend Architecture',
      description: (fjs as any)?.summary || 'Implement the interactive browser functionality using modern JavaScript APIs.',
      orderNumber,
      totalInTrack: getFJSCatalog().length || 20,
      questionsInTrack: questionsList,
    };
  }

  // 4. Machine Coding (MC / Projects)
  const mc = getMCCatalog().find((p: any) => p.id === qid || p.id.toUpperCase() === upper);
  const questionsList = getMCCatalog().map((p: any, idx: number) => ({
    id: p.id,
    title: p.title,
    order: idx + 1,
  }));
  const orderIdx = getMCCatalog().findIndex((p: any) => p.id === qid || p.id.toUpperCase() === upper);
  const orderNumber = orderIdx >= 0 ? orderIdx + 1 : 1;

  return {
    id: mc?.id || qid,
    title: mc?.title || questionId || 'Machine Coding Assessment',
    difficulty: (mc?.difficulty as any) || 'Medium',
    category: mc?.category || 'React Architecture',
    trackKind: 'mc',
    trackName: 'Machine Coding',
    courseName: 'React Component & System Design',
    programName: 'Senior Frontend Engineering',
    description: mc?.summary || 'Architect and build the complete interactive application component.',
    orderNumber,
    totalInTrack: getMCCatalog().length || 15,
    questionsInTrack: questionsList,
  };
}
