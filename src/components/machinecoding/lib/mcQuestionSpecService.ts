import type { MCQuestion } from '../machineCodingQuestions.ts';
import { generateQuestionStarter, isGenericBoilerplateStarter } from './mcStarterGenerator.ts';

export interface MCExample {
  title: string;
  input?: string;
  output?: string;
  explanation?: string;
}

export interface MCPreviewInfo {
  summary: string;
  expectedBehavior: string;
  interactiveControls: string[];
}

export interface EnrichedMCQuestion extends MCQuestion {
  problemStatement: string;
  examples: MCExample[];
  constraints: string[];
  previewInfo: MCPreviewInfo;
}

// O(1) Unique ID-Keyed Specification Cache to prevent redundant processing and guarantee question isolation
const enrichedSpecCache = new Map<string, EnrichedMCQuestion>();

/**
 * Extracts or derives tailored question specifications, requirements,
 * examples, constraints, and interactive preview definitions for any Machine Coding challenge.
 */
export function getEnrichedQuestionSpec(q: MCQuestion): EnrichedMCQuestion {
  if (q?.id) {
    const cacheKey = q.id.toUpperCase();
    const cached = enrichedSpecCache.get(cacheKey);
    if (cached) return cached;
  }

  if (!q) {
    return {
      id: 'Q000',
      title: 'Unknown Challenge',
      category: 'ReactJS',
      difficulty: 'Medium',
      timeEstimate: '20 mins',
      summary: '',
      description: '',
      problemStatement: '',
      requirements: [],
      examples: [],
      constraints: [],
      previewInfo: { summary: '', expectedBehavior: '', interactiveControls: [] },
      interviewTips: [],
      commonMistakes: [],
      starterCode: '',
      solutionCode: '',
    };
  }

  const title = q.title.trim();
  const rawDesc = q.description || '';

  // 1. Check if the question already has bespoke problem statement & examples in its description
  const hasStructuredMarkdown =
    rawDesc.includes('### Problem Description') ||
    rawDesc.includes('### Key Capabilities') ||
    rawDesc.includes('### Requirements') ||
    rawDesc.includes('### Example');

  const isArchetypeBoilerplate =
    rawDesc.includes('conforming to modern best practices') &&
    rawDesc.includes('Key Capabilities:\n1. Resilient state architecture using React 19 functional patterns');

  let problemStatement = '';
  let examples: MCExample[] = [];
  let constraints: string[] = [];
  let requirements: string[] = [...(q.requirements || [])];

  if (hasStructuredMarkdown && !isArchetypeBoilerplate) {
    // Parse bespoke sections from existing markdown
    const descParts = rawDesc.split(/###\s+/);
    for (const part of descParts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith('Problem Description')) {
        problemStatement = trimmed.replace(/^Problem Description\s*/, '').trim();
      } else if (trimmed.startsWith('Example') || trimmed.startsWith('Examples')) {
        const exText = trimmed.replace(/^Examples?\s*/, '').trim();
        examples.push({
          title: 'Primary Interaction Example',
          explanation: exText,
        });
      }
    }
  }

  // Derive domain-specific specs if missing or generic
  const domainSpecs = getDomainSpecsForTitle(title, q.category, q.difficulty);

  if (!problemStatement || isArchetypeBoilerplate) {
    problemStatement = domainSpecs.problemStatement;
  }

  if (examples.length === 0 || isArchetypeBoilerplate) {
    examples = domainSpecs.examples;
  }

  if (constraints.length === 0) {
    constraints = domainSpecs.constraints;
  }

  const isGenericRequirements =
    requirements.length <= 4 &&
    requirements.some(r => r.includes('Initialize ') && r.includes('sensible defaults and error boundaries'));

  if (isGenericRequirements) {
    requirements = domainSpecs.requirements;
  }

  const previewInfo: MCPreviewInfo = {
    summary: domainSpecs.previewSummary,
    expectedBehavior: domainSpecs.expectedBehavior,
    interactiveControls: domainSpecs.interactiveControls,
  };

  // Determine if starterCode needs a tailored question-specific scaffold instead of generic boilerplate
  let starterCode = q.starterCode;
  if (isGenericBoilerplateStarter(starterCode)) {
    const generated = generateQuestionStarter(q, 'react');
    if (generated && generated['App.tsx']) {
      starterCode = generated['App.tsx'];
    }
  }

  const enrichedResult: EnrichedMCQuestion = {
    ...q,
    problemStatement,
    requirements,
    examples,
    constraints,
    previewInfo,
    starterCode,
  };

  if (q?.id) {
    enrichedSpecCache.set(q.id.toUpperCase(), enrichedResult);
  }

  return enrichedResult;
}

interface DomainSpecs {
  problemStatement: string;
  requirements: string[];
  examples: MCExample[];
  constraints: string[];
  previewSummary: string;
  expectedBehavior: string;
  interactiveControls: string[];
}

function getDomainSpecsForTitle(title: string, _category?: string, _difficulty?: string): DomainSpecs {
  const t = title.toLowerCase();

  // 1. Notification Badge Counter with 99+
  if (t.includes('notification badge') || t.includes('badge counter') || (t.includes('badge') && t.includes('99'))) {
    return {
      problemStatement: `Build a production-ready Notification Badge Counter component in React. The component displays an unread count badge positioned over an icon (e.g. notification bell). If the count exceeds the threshold (default 99), it must display "99+". When count is 0, the badge should optionally hide or display an empty dot.`,
      requirements: [
        'Display numeric unread count on an overlaid badge pill.',
        'Format numbers exceeding max (default 99) as "99+" or "{max}+".',
        'Support visibility toggle: automatically hide badge when count is 0 unless showZero is true.',
        'Provide interactive increment, decrement, and custom count input controls.',
        'Implement smooth CSS pop-in animation on badge value change with accessible aria-label.',
        'Support custom badge variants (default, dot, pulse indicator).'
      ],
      examples: [
        {
          title: 'Standard Count Range',
          input: 'count = 5, max = 99',
          output: 'Badge renders "5"',
          explanation: 'Value is below 99, so exact count is rendered.'
        },
        {
          title: 'Overflow Count',
          input: 'count = 142, max = 99',
          output: 'Badge renders "99+"',
          explanation: 'Value exceeds max threshold of 99.'
        },
        {
          title: 'Zero Count',
          input: 'count = 0, showZero = false',
          output: 'Badge is not rendered (hidden)',
          explanation: 'Zero state suppresses unread badge to prevent UI clutter.'
        }
      ],
      constraints: [
        'Count must be non-negative integer (clamp at 0).',
        'Badge positioning must remain anchored to the parent icon across all viewport sizes.',
        'Screen readers must announce unread updates via aria-live="polite".',
        'Animation must complete in < 200ms without layout reflow.'
      ],
      previewSummary: 'Interactive notification bell with badge counter, boundary toggles, and step controls.',
      expectedBehavior: 'Clicking Increment updates the badge number. When crossing 99, display switches to 99+.',
      interactiveControls: ['[+1] Increment', '[-1] Decrement', '[+50] Burst', '[Reset 0] Clear', '[Toggle Max 99/999]'],
    };
  }

  // 2. Cookie Consent Banner with Preferences
  if (t.includes('cookie consent') || t.includes('cookie banner') || (t.includes('cookie') && t.includes('consent'))) {
    return {
      problemStatement: `Build a GDPR-compliant Cookie Consent Banner with granular preference controls. The banner must fix to the bottom of the viewport on initial visit, support 'Accept All', 'Reject Non-Essential', and 'Custom Preferences' modal. Preferences must persist to localStorage and allow users to re-open the preferences modal at any time.`,
      requirements: [
        'Display sticky cookie consent banner at bottom of page on uninitialized visits.',
        'Provide "Accept All" and "Reject Non-Essential" quick actions.',
        'Include "Preferences" button that opens modal with toggles for Essential (locked), Analytics, and Marketing cookies.',
        'Persist user consent configuration in localStorage.',
        'Provide trigger to re-open cookie preferences after consent has already been given.',
        'Adhere to accessibility guidelines (focus trap in modal, ESC to close, aria-modal="true").'
      ],
      examples: [
        {
          title: 'Initial Visit',
          input: 'localStorage has no consent record',
          output: 'Banner appears at bottom with Accept All / Reject All / Customize',
          explanation: 'User has not yet consented to cookie policies.'
        },
        {
          title: 'Granular Customization',
          input: 'User toggles Analytics: ON, Marketing: OFF -> clicks Save Preferences',
          output: 'localStorage stores { necessary: true, analytics: true, marketing: false }',
          explanation: 'Preferences saved and banner dismisses.'
        }
      ],
      constraints: [
        'Strictly Necessary cookies must remain permanently checked and disabled from toggling off.',
        'Consent banner must not obscure critical interactive elements once dismissed.',
        'Preference modal must trap keyboard tab focus while open.',
        'Changes must take effect immediately without requiring page refresh.'
      ],
      previewSummary: 'Floating GDPR cookie consent banner with modal preferences dialog and localStorage persistence.',
      expectedBehavior: 'Banner appears on unconsented state. Clicking Accept All or Saving Preferences closes the banner and updates status pill.',
      interactiveControls: ['[Accept All]', '[Reject Non-Essential]', '[Customize Preferences]', '[Reset Consent Cookie]'],
    };
  }

  // 3. Performance Metrics Dashboard FCP LCP CLS
  if (t.includes('performance metrics') || t.includes('fcp') || t.includes('lcp') || t.includes('cls') || t.includes('web vitals')) {
    return {
      problemStatement: `Build a real-time Core Web Vitals and Performance Metrics Dashboard. The dashboard renders cards for First Contentful Paint (FCP), Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and Interaction to Next Paint (INP). Each card displays the current measurement, threshold rating (Good / Needs Improvement / Poor) based on official Google Web Vitals rubrics, and interactive mock telemetry triggers.`,
      requirements: [
        'Display Web Vitals metric cards for FCP (Good <= 1.8s), LCP (Good <= 2.5s), CLS (Good <= 0.1), and INP (Good <= 200ms).',
        'Color code ratings dynamically: Green for Good, Amber for Needs Improvement, Red for Poor.',
        'Include interactive simulation buttons to simulate heavy network/DOM stress and observe metric updates.',
        'Calculate an overall health score (0-100) derived from weighted vital scores.',
        'Provide historical trend sparkline or timeline log of previous runs.',
        'Support export or reset of recorded telemetry data.'
      ],
      examples: [
        {
          title: 'Good Core Web Vitals Session',
          input: 'FCP: 1.2s, LCP: 2.1s, CLS: 0.04, INP: 85ms',
          output: 'Overall Health: 98% (Good) with all green badges',
          explanation: 'All values fall within Google optimal thresholds.'
        },
        {
          title: 'Degraded CLS Session',
          input: 'FCP: 1.4s, LCP: 2.2s, CLS: 0.28, INP: 95ms',
          output: 'CLS flagged as Poor (> 0.25) with overall score dropped to 72%',
          explanation: 'Layout shift instability impacts overall user experience rating.'
        }
      ],
      constraints: [
        'Threshold values must strictly adhere to web.dev Core Web Vitals definitions.',
        'CLS must format to two decimal places; FCP and LCP to one decimal second.',
        'Telemetry simulations must be non-blocking and throttled.'
      ],
      previewSummary: 'Interactive Web Vitals executive dashboard with real-time health score and load simulation controls.',
      expectedBehavior: 'Metric cards update dynamically when clicking load simulations. Rating badges transition between Good, Needs Work, and Poor.',
      interactiveControls: ['[Simulate Fast 3G]', '[Simulate Layout Shift]', '[Simulate Heavy Script]', '[Reset Benchmarks]'],
    };
  }

  // 4. Full Production Machine Coding Master Evaluation (Q500)
  if (t.includes('master evaluation') || t.includes('production machine coding master') || t.includes('q500')) {
    return {
      problemStatement: `Build an end-to-end Senior Staff Master Evaluation Suite. The component synthesizes multi-tier state management, async caching, real-time telemetry, and resilient UI error boundaries into a unified mission-control portal. Candidates must demonstrate senior-level component composition, memoization, accessibility, and clean architectural separation of concerns.`,
      requirements: [
        'Implement resilient central state store with optimistic rollback support.',
        'Provide multi-stage system health diagnostics monitor (CPU, Memory, Event Loop Latency).',
        'Incorporate dynamic telemetry log streams with level filtering (Info, Warn, Error).',
        'Support fault-injection testing (simulate network partition, unhandled rejection, timeout).',
        'Maintain zero layout shift across dynamic status changes with WCAG AA compliance.',
        'Provide snapshot persistence to export and restore system evaluation states.'
      ],
      examples: [
        {
          title: 'System Health Nominal',
          input: 'Telemetry stream normal, 0 active faults',
          output: 'All microservices render green status with < 16ms render loop latency',
          explanation: 'Nominal operational status verified.'
        },
        {
          title: 'Fault Injection Recovery',
          input: 'Trigger "Simulate Network Outage" fault',
          output: 'Circuit breaker trips, UI falls back to stale cache, auto-reconnects when resolved',
          explanation: 'Validates resilient offline/degradation handling under adverse network conditions.'
        }
      ],
      constraints: [
        'Component render cycle must stay under 16ms (60 FPS budget).',
        'State mutations must follow strict immutability patterns.',
        'All interactive controls must be keyboard operable with visible focus rings.'
      ],
      previewSummary: 'Mission-control production evaluation suite with live diagnostics, telemetry logs, and fault injection simulator.',
      expectedBehavior: 'Live diagnostics show real-time pulse. Triggering fault injections tests circuit breaker state and telemetry logging.',
      interactiveControls: ['[Inject Network Fault]', '[Trigger Unhandled Error]', '[Capture Evaluation Snapshot]', '[Clear Telemetry]'],
    };
  }

  // Generic fallback generator tailored dynamically from question title
  return generateGenericTailoredSpecs(title);
}

function generateGenericTailoredSpecs(title: string): DomainSpecs {
  const cleanTitle = title.replace(/^\[[^\]]+\]\s*/, '').trim();

  return {
    problemStatement: `Implement a production-ready, fully accessible ${cleanTitle} component in React. The solution must encapsulate modern state management, responsive styling, keyboard interaction patterns, and resilient edge-case handling adhering to FAANG engineering standards.`,
    requirements: [
      `Design and initialize reactive state architecture tailored specifically for ${cleanTitle}.`,
      `Implement primary user interactions (clicks, keyboard navigation, dynamic inputs) with zero lag.`,
      `Handle edge cases including boundary values, empty data states, and rapid asynchronous updates.`,
      `Ensure full accessibility with appropriate semantic HTML, ARIA roles, and visible focus management.`,
      `Structure modular, clean code separating business logic, state reducers, and presentational views.`
    ],
    examples: [
      {
        title: 'Initial Mount State',
        input: `Component mounts with default props`,
        output: `${cleanTitle} renders ready for user interaction`,
        explanation: 'Initializes with sensible default configuration without runtime errors.'
      },
      {
        title: 'Interactive User Action',
        input: `User triggers primary interaction on ${cleanTitle}`,
        output: 'Component state updates reactively and reflects visible UI feedback',
        explanation: 'Validates event handlers, state transitions, and responsive re-rendering.'
      }
    ],
    constraints: [
      'Component must be self-contained and avoid unmanaged side-effects.',
      'Must clean up any timers, intervals, or event listeners on unmount.',
      'UI must remain completely responsive and functional on both mobile and desktop screen sizes.'
    ],
    previewSummary: `Interactive sandbox preview demonstrating ${cleanTitle} behavior, layout, and control states.`,
    expectedBehavior: `Component mounts cleanly in the preview sandbox. Interacting with controls updates the display immediately.`,
    interactiveControls: ['Primary Action', 'Toggle Options', 'Reset State'],
  };
}
