import type { SubjectId, ExperienceLevel } from '../types/docs.types';
import { ALL_SUBJECTS_CATALOG, TOPICS_BY_SUBJECT } from '../data/subjectsCatalog';

export type CompanyArchetype = 'faang' | 'unicorn' | 'startup' | 'architect' | 'generalist';
export type PlanTimeline = '7-day' | '30-day' | '60-day' | '90-day';

export interface ArchetypeProfile {
  id: CompanyArchetype;
  title: string;
  badge: string;
  icon: string;
  targetCompanies: string[];
  summary: string;
  prioritySubjects: SubjectId[];
  keyFocusAreas: string[];
  recommendedHoursPerDay: number;
}

export interface StudyPlanConfig {
  archetype: CompanyArchetype;
  timeline: PlanTimeline;
  experience: ExperienceLevel;
  dailyHours: number;
  domainConfidence: Record<string, number>; // Domain name -> rating 1-5
}

export interface MilestoneTopic {
  id: string;
  title: string;
  subjectId: SubjectId;
}

export interface DailyMilestone {
  day: number;
  week: number;
  title: string;
  phase: string;
  subjectId: SubjectId;
  topics: MilestoneTopic[];
  practiceGoal: string;
  spacedRepetitionTopic?: {
    subjectId: SubjectId;
    topicId: string;
    title: string;
    reviewInterval: string;
  };
  estimatedMinutes: number;
  isCompleted: boolean;
}

export interface GeneratedStudyPlan {
  id: string;
  createdAt: string;
  config: StudyPlanConfig;
  archetypeMeta: ArchetypeProfile;
  milestones: DailyMilestone[];
  completedDays: number[];
  totalDays: number;
  totalEstimatedHours: number;
}

export const ARCHETYPE_PROFILES: Record<CompanyArchetype, ArchetypeProfile> = {
  faang: {
    id: 'faang',
    title: 'Tier-1 Tech & FAANG',
    badge: 'High Bar Systems & Algorithms',
    icon: '🏢',
    targetCompanies: ['Meta', 'Google', 'Amazon', 'Apple', 'Netflix', 'Microsoft'],
    summary: 'Deep dive into JavaScript engine internals (V8, Event Loop, memory management), React 19 reconciliation internals, high-performance DOM manipulation, and complex UI state machines.',
    prioritySubjects: ['javascript', 'es6', 'react', 'advanced-react', 'web-performance', 'typescript', 'microfrontends'],
    keyFocusAreas: ['V8 Internals & Event Loop', 'Fiber Architecture & Concurrent Mode', 'Memory Leaks & Profiling', 'Web Workers & Multithreading', 'Sub-second Hydration'],
    recommendedHoursPerDay: 2,
  },
  unicorn: {
    id: 'unicorn',
    title: 'High-Growth Unicorns',
    badge: 'Enterprise Scale & Clean Architecture',
    icon: '🦄',
    targetCompanies: ['Stripe', 'Airbnb', 'Uber', 'Coinbase', 'DoorDash', 'Canva'],
    summary: 'Master enterprise TypeScript strict mode, design system component libraries, advanced state machines (TanStack/Redux), resilient API integrations, and robust real-time communication.',
    prioritySubjects: ['typescript', 'react', 'tanstack-query', 'restful-apis', 'websockets', 'webhooks', 'tailwind'],
    keyFocusAreas: ['Strict TypeScript Generics', 'Optimistic UI & Cache Invalidation', 'Component Library Token Systems', 'Resilient Network Protocols', 'API Contract Modeling'],
    recommendedHoursPerDay: 1.5,
  },
  startup: {
    id: 'startup',
    title: 'Fast-Paced Startup & Scaleup',
    badge: 'Product Velocity & Fullstack Modernity',
    icon: '🚀',
    targetCompanies: ['Y Combinator Startups', 'Series A/B High Velocity Tech', 'Supabase', 'Vercel Ecosystem'],
    summary: 'Prioritizes immediate product delivery: Next.js App Router (RSC, Server Actions), Tailwind rapid styling, TanStack Query data synchronization, WebSockets, and modern fullstack foundations.',
    prioritySubjects: ['nextjs', 'react', 'tailwind', 'tanstack-query', 'websockets', 'restful-apis'],
    keyFocusAreas: ['Next.js App Router & Server Actions', 'Tailwind CSS Rapid Design', 'Realtime Sync with WebSockets', 'End-to-End Type Safety', 'Clean Developer Experience'],
    recommendedHoursPerDay: 1.5,
  },
  architect: {
    id: 'architect',
    title: 'Staff / Solutions Architect',
    badge: 'Principal Systems & Governance',
    icon: '🏛️',
    targetCompanies: ['Principal Frontend Architect', 'Staff Software Engineer', 'VP of UI Engineering'],
    summary: 'Comprehensive mastery of web performance budgets, Core Web Vitals (INP, LCP, CLS), Microfrontend boundaries, HTTP/2 & HTTP/3 protocols, security defenses (CSP, XSS, CSRF), and multi-team governance.',
    prioritySubjects: ['web-performance', 'microfrontends', 'http', 'advanced-react', 'advanced-css', 'typescript'],
    keyFocusAreas: ['Core Web Vitals (INP/LCP/CLS)', 'Module Federation & MFE Orchestration', 'HTTP/2 & HTTP/3 Multiplexing', 'Browser Security (CSP, SRI, CORS)', 'Architectural Decision Records'],
    recommendedHoursPerDay: 2,
  },
  generalist: {
    id: 'generalist',
    title: 'Full-Spectrum Frontend Specialist',
    badge: 'Balanced End-to-End Competence',
    icon: '🎯',
    targetCompanies: ['Fullstack Consultancies', 'Digital Agencies', 'Enterprise SaaS Leaders'],
    summary: 'Balanced coverage from core web semantic standards (HTML, CSS Box Model) to modern frameworks, state management, RESTful architecture, and production readiness.',
    prioritySubjects: ['html', 'css', 'javascript', 'react', 'redux-toolkit', 'restful-apis', 'web-performance'],
    keyFocusAreas: ['Semantic HTML & Accessibility', 'CSS Flexbox/Grid Layouts', 'Core Async JavaScript', 'Component Design Patterns', 'RESTful API Integration'],
    recommendedHoursPerDay: 1.5,
  },
};

export const DOMAIN_CATEGORIES = [
  { name: 'Core Web', subjects: ['html', 'css', 'advanced-css'] as SubjectId[], icon: '🌐' },
  { name: 'Languages', subjects: ['javascript', 'es6', 'typescript'] as SubjectId[], icon: '⚡' },
  { name: 'React Ecosystem', subjects: ['react', 'advanced-react', 'redux', 'redux-toolkit', 'tanstack-query', 'react-router', 'tailwind'] as SubjectId[], icon: '⚛️' },
  { name: 'Architecture & Fullstack', subjects: ['nextjs', 'microfrontends'] as SubjectId[], icon: '🏛️' },
  { name: 'Networking & APIs', subjects: ['restful-apis', 'http', 'postman', 'websockets', 'webhooks'] as SubjectId[], icon: '🔌' },
  { name: 'Performance & Tooling', subjects: ['web-performance'] as SubjectId[], icon: '🚀' },
];

const LOCAL_STUDY_PLAN_KEY = 'frontend_study_plan_active_v1';

export class DocsStudyPlanService {
  getDefaultConfig(): StudyPlanConfig {
    const initialConfidence: Record<string, number> = {};
    DOMAIN_CATEGORIES.forEach(d => {
      initialConfidence[d.name] = 3; // Default 3 out of 5
    });

    return {
      archetype: 'faang',
      timeline: '30-day',
      experience: 'senior',
      dailyHours: 1.5,
      domainConfidence: initialConfidence,
    };
  }

  generateStudyPlan(config: StudyPlanConfig): GeneratedStudyPlan {
    const archetypeMeta = ARCHETYPE_PROFILES[config.archetype] || ARCHETYPE_PROFILES.faang;
    const totalDays = this.parseTimelineDays(config.timeline);

    // Rank subjects based on archetype priorities and low confidence domains
    const prioritizedSubjects = this.calculateSubjectOrder(config, archetypeMeta);

    // Build the milestones
    const milestones = this.buildDailyMilestones(totalDays, prioritizedSubjects, config);

    const totalMinutes = milestones.reduce((acc, m) => acc + m.estimatedMinutes, 0);

    const plan: GeneratedStudyPlan = {
      id: 'plan_' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      config,
      archetypeMeta,
      milestones,
      completedDays: [],
      totalDays,
      totalEstimatedHours: Math.round((totalMinutes / 60) * 10) / 10,
    };

    this.saveActivePlan(plan);
    return plan;
  }

  private parseTimelineDays(timeline: PlanTimeline): number {
    switch (timeline) {
      case '7-day': return 7;
      case '30-day': return 30;
      case '60-day': return 60;
      case '90-day': return 90;
      default: return 30;
    }
  }

  private calculateSubjectOrder(config: StudyPlanConfig, archetype: ArchetypeProfile): SubjectId[] {
    const scoredSubjects: Array<{ id: SubjectId; score: number }> = [];

    ALL_SUBJECTS_CATALOG.forEach(sub => {
      let score = 0;

      // Archetype priority weight
      const priorityIndex = archetype.prioritySubjects.indexOf(sub.id);
      if (priorityIndex >= 0) {
        score += (archetype.prioritySubjects.length - priorityIndex) * 10;
      }

      // Domain confidence weight: Lower confidence = higher study priority
      const domain = DOMAIN_CATEGORIES.find(d => d.subjects.includes(sub.id));
      if (domain) {
        const confidence = config.domainConfidence[domain.name] ?? 3;
        // 1 confidence = +20 score, 5 confidence = +0 score
        score += (5 - confidence) * 6;
      }

      scoredSubjects.push({ id: sub.id, score });
    });

    // Sort descending by score
    scoredSubjects.sort((a, b) => b.score - a.score);
    return scoredSubjects.map(s => s.id);
  }

  private buildDailyMilestones(
    totalDays: number,
    prioritizedSubjects: SubjectId[],
    config: StudyPlanConfig
  ): DailyMilestone[] {
    const milestones: DailyMilestone[] = [];
    const subjectsCount = prioritizedSubjects.length;

    // Phase intervals
    const phaseInterval = Math.max(1, Math.floor(totalDays / 4));

    for (let day = 1; day <= totalDays; day++) {
      const week = Math.ceil(day / 7);

      // Distribute subjects across days
      const subjectIndex = (day - 1) % subjectsCount;
      const currentSubjectId = prioritizedSubjects[subjectIndex];
      const subjectMeta = ALL_SUBJECTS_CATALOG.find(s => s.id === currentSubjectId);
      const subjectTopics = TOPICS_BY_SUBJECT[currentSubjectId] || [];

      // Determine phase label
      let phase = 'Phase 1: Core Fundamentals & Language Internals';
      if (day > phaseInterval * 3) {
        phase = 'Phase 4: High-Stakes System Design & Mock Drills';
      } else if (day > phaseInterval * 2) {
        phase = 'Phase 3: Production Resiliency & Performance';
      } else if (day > phaseInterval) {
        phase = 'Phase 2: Architectural Patterns & State Synchronization';
      }

      // Select 2 topics for this day
      const topicOffset = Math.floor((day - 1) / subjectsCount) * 2;
      const selectedTopics: MilestoneTopic[] = [];

      if (subjectTopics.length > 0) {
        const t1 = subjectTopics[topicOffset % subjectTopics.length];
        if (t1) selectedTopics.push({ id: t1.id, title: t1.title, subjectId: currentSubjectId });

        if (totalDays <= 30 && subjectTopics.length > 1) {
          const t2 = subjectTopics[(topicOffset + 1) % subjectTopics.length];
          if (t2 && t2.id !== t1?.id) {
            selectedTopics.push({ id: t2.id, title: t2.title, subjectId: currentSubjectId });
          }
        }
      }

      // Spaced repetition review from earlier days (Day -3 or Day -7)
      let spacedRepetitionTopic: DailyMilestone['spacedRepetitionTopic'] | undefined;
      if (day >= 4 && milestones[day - 4] && milestones[day - 4].topics[0]) {
        const rev = milestones[day - 4].topics[0];
        spacedRepetitionTopic = {
          subjectId: rev.subjectId,
          topicId: rev.id,
          title: rev.title,
          reviewInterval: '3-Day Interval Review',
        };
      } else if (day >= 8 && milestones[day - 8] && milestones[day - 8].topics[0]) {
        const rev = milestones[day - 8].topics[0];
        spacedRepetitionTopic = {
          subjectId: rev.subjectId,
          topicId: rev.id,
          title: rev.title,
          reviewInterval: '7-Day Spaced Repetition',
        };
      }

      const questionsToPractice = totalDays <= 7 ? 8 : totalDays <= 30 ? 5 : 4;
      const dailyMinutes = Math.round(config.dailyHours * 60);

      milestones.push({
        day,
        week,
        title: `${subjectMeta ? subjectMeta.title : currentSubjectId.toUpperCase()}: ${selectedTopics.map(t => t.title).join(' & ')}`,
        phase,
        subjectId: currentSubjectId,
        topics: selectedTopics,
        practiceGoal: `Complete ${questionsToPractice} targeted interview questions and test code in Playground.`,
        spacedRepetitionTopic,
        estimatedMinutes: dailyMinutes,
        isCompleted: false,
      });
    }

    return milestones;
  }

  getActivePlan(): GeneratedStudyPlan | null {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_STUDY_PLAN_KEY);
        if (raw) return JSON.parse(raw);
      }
    } catch (_) {}
    return null;
  }

  saveActivePlan(plan: GeneratedStudyPlan): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LOCAL_STUDY_PLAN_KEY, JSON.stringify(plan));
      }
    } catch (_) {}
  }

  toggleDayCompletion(dayNumber: number): GeneratedStudyPlan | null {
    const plan = this.getActivePlan();
    if (!plan) return null;

    const idx = plan.completedDays.indexOf(dayNumber);
    if (idx >= 0) {
      plan.completedDays.splice(idx, 1);
    } else {
      plan.completedDays.push(dayNumber);
    }

    const milestone = plan.milestones.find(m => m.day === dayNumber);
    if (milestone) {
      milestone.isCompleted = plan.completedDays.includes(dayNumber);
    }

    this.saveActivePlan(plan);
    return plan;
  }

  clearActivePlan(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(LOCAL_STUDY_PLAN_KEY);
      }
    } catch (_) {}
  }

  exportToMarkdown(plan: GeneratedStudyPlan): string {
    const completedPct = Math.round((plan.completedDays.length / plan.totalDays) * 100);
    let md = `# 🗺️ Personalized Frontend Career Roadmap: ${plan.archetypeMeta.title}\n\n`;
    md += `**Target Profile:** ${plan.archetypeMeta.title} (${plan.archetypeMeta.badge})\n`;
    md += `**Target Companies:** ${plan.archetypeMeta.targetCompanies.join(', ')}\n`;
    md += `**Timeline:** ${plan.config.timeline} | **Daily Commitment:** ${plan.config.dailyHours} hours/day\n`;
    md += `**Overall Progress:** ${completedPct}% Completed (${plan.completedDays.length}/${plan.totalDays} Days)\n\n`;
    md += `> ${plan.archetypeMeta.summary}\n\n`;

    md += `## 🎯 Priority Skill Focus Areas\n\n`;
    plan.archetypeMeta.keyFocusAreas.forEach(area => {
      md += `- ✓ **${area}**\n`;
    });
    md += `\n---\n\n## 📅 Daily Milestones Schedule\n\n`;

    let currentWeek = 0;
    plan.milestones.forEach(m => {
      if (m.week !== currentWeek) {
        currentWeek = m.week;
        md += `### Week ${currentWeek}\n\n`;
      }

      const check = plan.completedDays.includes(m.day) ? '[x]' : '[ ]';
      md += `- ${check} **Day ${m.day}: ${m.title}** (${m.estimatedMinutes} mins)\n`;
      md += `  - *Phase:* ${m.phase}\n`;
      md += `  - *Reading Modules:* ${m.topics.map(t => `\`${t.title}\` (/docs/${t.subjectId}/${t.id})`).join(', ')}\n`;
      md += `  - *Practice Goal:* ${m.practiceGoal}\n`;
      if (m.spacedRepetitionTopic) {
        md += `  - *Spaced Repetition:* ↺ Review \`${m.spacedRepetitionTopic.title}\` (${m.spacedRepetitionTopic.reviewInterval})\n`;
      }
      md += `\n`;
    });

    md += `---\n*Generated by Frontend MasterDocs Career Pathway Studio*\n`;
    return md;
  }
}

export const docsStudyPlanService = new DocsStudyPlanService();
