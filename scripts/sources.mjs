// Per-platform scrape adapters for the premium scraper (scripts/scrape.mjs).
//
// Each source defines how to authenticate, where to find question links, how to
// extract the question/answer/code, and where to write the output JSON.
//
// `enabled: true` sources run by default. The stub platforms below are
// `enabled: false` because their selectors are best-guesses — set `enabled: true`
// and supply the matching cookie (cookieEnv) once you've confirmed/tuned the
// selectors for that site's actual DOM.

export const SOURCES = [
  {
    id: 'gfe',
    name: 'GreatFrontEnd',
    enabled: true,
    cookieEnv: 'GFE_COOKIE',
    cookieFile: 'scripts/.gfe-cookie',
    cookieDomain: '.greatfrontend.com',
    linkPattern: /^\/questions\/(quiz|coding|ui|algo|system-design|fn)\//,
    selectors: {
      question: 'h1',
      answer: 'article.grow',
      code: 'article.grow pre code, article.grow pre',
      difficulty: ['Easy', 'Medium', 'Hard'],
    },
    listings: [
      { url: 'https://www.greatfrontend.com/questions/react-interview-questions', category: 'ReactJS', file: 'greatfrontend-react', idBase: 2_000_000 },
      { url: 'https://www.greatfrontend.com/questions/javascript-interview-questions', category: 'JavaScript & ES6', file: 'greatfrontend-javascript', idBase: 1_000_000 },
      { url: 'https://www.greatfrontend.com/questions/typescript-interview-questions', category: 'TypeScript', file: 'greatfrontend-typescript', idBase: 3_000_000 },
      {
        url: 'https://www.greatfrontend.com/questions',
        category: 'DOM & Web APIs',
        file: 'greatfrontend-dom',
        idBase: 4_000_000,
        keywordFilter: [
          'dom', 'event', 'browser', 'window', 'document', 'localstorage',
          'sessionstorage', 'cookie', 'fetch', 'xmlhttprequest', 'abortcontroller',
          'element', 'node', 'shadow', 'websocket', 'worker', 'observer',
          'history', 'location', 'navigator', 'drag',
        ],
      },
    ],
  },

  // --- Stub platforms: enable + tune selectors with your subscription cookie ---
  {
    id: 'leetcode',
    name: 'LeetCode',
    enabled: false,
    cookieEnv: 'LEETCODE_COOKIE',
    cookieFile: 'scripts/.leetcode-cookie',
    cookieDomain: '.leetcode.com',
    linkPattern: /^\/problems\/[a-z0-9-]+\/?$/,
    selectors: {
      question: '[data-cy="question-title"], .title',
      answer: '.question-content, .elfjS', // TUNE: editorial/solution container
      code: 'pre',
      difficulty: ['Easy', 'Medium', 'Hard'],
    },
    listings: [
      { url: 'https://leetcode.com/problemset/all/', category: 'Algorithms', file: 'leetcode', idBase: 5_000_000 },
    ],
  },
  {
    id: 'algomonster',
    name: 'AlgoMonster',
    enabled: false,
    cookieEnv: 'ALGOMONSTER_COOKIE',
    cookieFile: 'scripts/.algomonster-cookie',
    cookieDomain: '.algomonster.io',
    linkPattern: /\/problems\/|\/questions\//,
    selectors: {
      question: 'h1',
      answer: 'article, main', // TUNE
      code: 'pre code, pre',
      difficulty: ['Easy', 'Medium', 'Hard'],
    },
    listings: [
      { url: 'https://algomonster.io/', category: 'Algorithms', file: 'algomonster', idBase: 6_000_000 },
    ],
  },
  {
    id: 'educative',
    name: 'Educative',
    enabled: false,
    cookieEnv: 'EDUCATIVE_COOKIE',
    cookieFile: 'scripts/.educative-cookie',
    cookieDomain: '.educative.io',
    linkPattern: /\/courses\//,
    selectors: {
      question: 'h1, .lesson-title',
      answer: '.lesson-content, article', // TUNE
      code: 'pre code, pre',
      difficulty: ['Easy', 'Medium', 'Hard'],
    },
    listings: [
      { url: 'https://www.educative.io/', category: 'Algorithms', file: 'educative', idBase: 7_000_000 },
    ],
  },
  {
    id: 'frontendlead',
    name: 'FrontendLead',
    enabled: false,
    cookieEnv: 'FRONTENDLEAD_COOKIE',
    cookieFile: 'scripts/.frontendlead-cookie',
    cookieDomain: '.frontendlead.com',
    linkPattern: /\/questions\//,
    selectors: {
      question: 'h1',
      answer: 'article, main', // TUNE
      code: 'pre code, pre',
      difficulty: ['Easy', 'Medium', 'Hard'],
    },
    listings: [
      { url: 'https://www.frontendlead.com/', category: 'Frontend', file: 'frontendlead', idBase: 8_000_000 },
    ],
  },

  // TopBrains is a client-rendered SPA backed by a JSON REST API. The question
  // list + detail endpoints are PUBLIC (no auth needed) — discovered by
  // inspecting the bundle and probing the live API:
  //   GET {base}/challenge-category/get-all                -> categories
  //   GET {base}/challenge/get-all?categoryId=&pageNo=&pageSize=  -> list
  //   GET {base}/challenge/editor/<id>                    -> full question
  // The detail `description` is HTML; the engine strips tags, extracts
  // <pre><code> blocks as `code`, and maps EASY/MEDIUM/HARD -> Easy/Medium/Hard.
  {
    id: 'topbrains',
    name: 'TopBrains',
    enabled: true,
    type: 'topbrains',
    base: 'https://topbrains.com/challenge/v1',
    output: { file: 'topbrains', idBase: 9_000_000 },
  },
]
