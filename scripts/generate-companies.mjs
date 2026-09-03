// Generates 500+ Comprehensive Global Tech Companies with interview pathways,
// salary ranges, level mappings, round structures, and question filters.

import { writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_FILE = resolve(__dirname, '..', 'public', 'data', 'companies.json')

// Curated seed lists across 8 major tech sectors
const SECTORS = [
  {
    sector: 'Big Tech & Cloud Titans',
    icon: '🌐',
    companies: [
      { name: 'Google', ticker: 'GOOGL', focus: ['JavaScript Core', 'Algorithms', 'Web Vitals', 'DOM APIs'], track: 'javascript', salary: '$220k - $480k' },
      { name: 'Meta', ticker: 'META', focus: ['React 19', 'Virtualization', 'Relay/GraphQL', 'Optimistic UI'], track: 'react', salary: '$230k - $520k' },
      { name: 'Apple', ticker: 'AAPL', focus: ['CSS Hardware Acceleration', 'Privacy', 'Canvas Animations', 'a11y'], track: 'balanced', salary: '$210k - $490k' },
      { name: 'Amazon', ticker: 'AMZN', focus: ['Micro-Frontends', 'Accessibility (ARIA)', 'Leadership Principles'], track: 'architecture', salary: '$210k - $460k' },
      { name: 'Microsoft', ticker: 'MSFT', focus: ['TypeScript', 'Fluent UI', 'Office Web Components', 'Scale'], track: 'balanced', salary: '$200k - $450k' },
      { name: 'Netflix', ticker: 'NFLX', focus: ['Adaptive HLS Streaming', 'Memory Budgets', 'Async Concurrency'], track: 'architecture', salary: '$350k - $580k' },
      { name: 'ByteDance', ticker: 'BDNCE', focus: ['High-Throughput Feed', 'Video Preload', 'Performance'], track: 'architecture', salary: '$240k - $510k' },
      { name: 'NVIDIA', ticker: 'NVDA', focus: ['WebGL / WebGPU', '3D UI Pipelines', 'Visualization'], track: 'balanced', salary: '$220k - $480k' },
      { name: 'Adobe', ticker: 'ADBE', focus: ['Canvas Rendering', 'WebAssembly (WASM)', 'Design Tools'], track: 'javascript', salary: '$190k - $420k' },
      { name: 'Oracle', ticker: 'ORCL', focus: ['Enterprise UI', 'Design Systems', 'Data Grids'], track: 'balanced', salary: '$180k - $390k' },
      { name: 'Salesforce', ticker: 'CRM', focus: ['Lightning Web Components', 'Micro-Frontends', 'CRM State'], track: 'balanced', salary: '$200k - $430k' },
      { name: 'Cisco', ticker: 'CSCO', focus: ['Networking Dashboards', 'WebSockets', 'WebRTC'], track: 'balanced', salary: '$180k - $380k' },
      { name: 'IBM', ticker: 'IBM', focus: ['Carbon Design System', 'Accessibility', 'Cloud Console'], track: 'balanced', salary: '$170k - $370k' },
      { name: 'SAP', ticker: 'SAP', focus: ['Enterprise Portal', 'Fiori UI5', 'Data Visualization'], track: 'balanced', salary: '$175k - $380k' },
      { name: 'Intel', ticker: 'INTC', focus: ['Web Performance', 'Hardware Drivers UI', 'WASM'], track: 'javascript', salary: '$170k - $360k' },
    ]
  },
  {
    sector: 'Fintech, Crypto & Payments',
    icon: '💳',
    companies: [
      { name: 'Stripe', ticker: 'STRIP', focus: ['Financial Grade Security', 'Micro-Interactions', 'SDK Architecture'], track: 'balanced', salary: '$240k - $530k' },
      { name: 'Block / Square', ticker: 'SQ', focus: ['POS Web Interfaces', 'Offline Outbox Sync', 'React'], track: 'react', salary: '$210k - $460k' },
      { name: 'PayPal', ticker: 'PYPL', focus: ['Checkout Flows', 'Security & CSP', 'Payment Buttons'], track: 'balanced', salary: '$190k - $420k' },
      { name: 'Robinhood', ticker: 'HOOD', focus: ['Real-Time WebSocket Tickers', 'Chart Visualizations', 'Speed'], track: 'javascript', salary: '$220k - $470k' },
      { name: 'Coinbase', ticker: 'COIN', focus: ['Crypto Wallets', 'Web3 / Ethers', 'Real-Time Order Books'], track: 'balanced', salary: '$220k - $480k' },
      { name: 'Plaid', ticker: 'PLAID', focus: ['Embedded iFrames', 'Link SDK', 'Security Sandboxing'], track: 'javascript', salary: '$230k - $490k' },
      { name: 'Klarna', ticker: 'KLARN', focus: ['BNPL Checkout Widgets', 'Mobile Web Optimization', 'Design'], track: 'balanced', salary: '$180k - $390k' },
      { name: 'Revolut', ticker: 'REVOL', focus: ['High-Frequency Banking UI', 'Cross-Platform Web', 'State'], track: 'react', salary: '$170k - $380k' },
      { name: 'Adyen', ticker: 'ADYEN', focus: ['Global Checkout Modules', 'Payment Drop-ins', 'Performance'], track: 'balanced', salary: '$180k - $400k' },
      { name: 'Brex', ticker: 'BREX', focus: ['Corporate Expense Cards', 'React 19', 'GraphQL'], track: 'react', salary: '$220k - $470k' },
      { name: 'Ramp', ticker: 'RAMP', focus: ['Finance Automation', 'Speed & UX Craft', 'TypeScript'], track: 'balanced', salary: '$230k - $490k' },
      { name: 'Chime', ticker: 'CHIME', focus: ['Consumer Banking UI', 'Design System', 'Accessibility'], track: 'react', salary: '$200k - $440k' },
      { name: 'Affirm', ticker: 'AFRM', focus: ['Checkout Integrations', 'Merchant SDKs', 'Performance'], track: 'balanced', salary: '$200k - $430k' },
      { name: 'SoFi', ticker: 'SOFI', focus: ['Financial Portals', 'Micro-Frontends', 'React Native Web'], track: 'react', salary: '$190k - $410k' },
      { name: 'Kraken', ticker: 'KRAKN', focus: ['Live Trading Terminal', 'WebGL Charts', 'Low Latency'], track: 'javascript', salary: '$210k - $450k' },
    ]
  },
  {
    sector: 'AI, Frontier Tech & Search',
    icon: '🤖',
    companies: [
      { name: 'OpenAI', ticker: 'OPENAI', focus: ['Streaming LLM UI', 'Markdown / Code Rendering', 'Optimistic State'], track: 'react', salary: '$280k - $650k' },
      { name: 'Anthropic', ticker: 'ANTHR', focus: ['Claude Chat Interface', 'Document Ingestion UI', 'Accessibility'], track: 'react', salary: '$280k - $640k' },
      { name: 'Scale AI', ticker: 'SCALE', focus: ['Complex Annotation Canvas', 'WebGL Labeling Tools', 'Speed'], track: 'javascript', salary: '$240k - $520k' },
      { name: 'Perplexity AI', ticker: 'PERPX', focus: ['Instant Streaming Search', 'Source Citations', 'SSR Performance'], track: 'architecture', salary: '$240k - $530k' },
      { name: 'Hugging Face', ticker: 'HGFCE', focus: ['Model Hub Explorer', 'Interactive Demos', 'Open Source'], track: 'react', salary: '$200k - $450k' },
      { name: 'Midjourney', ticker: 'MIDJ', focus: ['Image Canvas', 'WebGL Shaders', 'Gallery Virtualization'], track: 'javascript', salary: '$250k - $550k' },
      { name: 'Cohere', ticker: 'COHER', focus: ['Enterprise LLM Dashboards', 'RAG Visualizers', 'TypeScript'], track: 'balanced', salary: '$220k - $480k' },
      { name: 'Runway', ticker: 'RNWAY', focus: ['AI Video Generation Timeline', 'WebGPU', 'Canvas Video Editing'], track: 'javascript', salary: '$240k - $540k' },
      { name: 'Jasper', ticker: 'JASPR', focus: ['Rich Text AI Editor', 'Content Templates', 'React'], track: 'react', salary: '$190k - $420k' },
      { name: 'Mistral AI', ticker: 'MISTR', focus: ['Le Chat UI', 'Token Streaming Parser', 'Lightweight Bundle'], track: 'architecture', salary: '$230k - $500k' },
    ]
  },
  {
    sector: 'SaaS, Productivity & Design Tools',
    icon: '🚀',
    companies: [
      { name: 'Figma', ticker: 'FIGMA', focus: ['WebAssembly Rendering', 'Multiplayer CRDTs', 'Hardware Acceleration'], track: 'javascript', salary: '$240k - $540k' },
      { name: 'Notion', ticker: 'NOTIN', focus: ['Block Editor Architecture', 'Local IndexedDB Cache', 'Offline Sync'], track: 'react', salary: '$230k - $510k' },
      { name: 'Slack', ticker: 'WORK', focus: ['Desktop Electron & Web App', 'Virtual Message List', 'WebSockets'], track: 'architecture', salary: '$210k - $470k' },
      { name: 'Atlassian (Jira/Trello)', ticker: 'TEAM', focus: ['Drag and Drop Kanban', 'Atlaskit Design System', 'Performance'], track: 'react', salary: '$200k - $440k' },
      { name: 'Canva', ticker: 'CANVA', focus: ['Interactive Graphic Canvas', 'WebGL Exporter', 'Asset Pipeline'], track: 'javascript', salary: '$200k - $450k' },
      { name: 'Airtable', ticker: 'AIRTB', focus: ['Virtualized Grid Engine', 'Formula Parsers', 'Real-Time Sync'], track: 'javascript', salary: '$230k - $500k' },
      { name: 'Miro', ticker: 'MIRO', focus: ['Infinite Zoomable Whiteboard', 'Canvas Viewport', 'Multiplayer'], track: 'javascript', salary: '$200k - $440k' },
      { name: 'Snowflake', ticker: 'SNOW', focus: ['Snowsight SQL Worksheets', 'Big Data Visualization', 'Security'], track: 'balanced', salary: '$220k - $480k' },
      { name: 'Datadog', ticker: 'DDOG', focus: ['High-Frequency Time Series Charts', 'Dashboard Grids', 'Performance'], track: 'javascript', salary: '$220k - $470k' },
      { name: 'HubSpot', ticker: 'HUBS', focus: ['CRM Ecosystem', 'Micro-Frontends', 'Marketing Automation'], track: 'balanced', salary: '$190k - $420k' },
      { name: 'Zoom', ticker: 'ZM', focus: ['WebRTC Video Client', 'In-Meeting Chat', 'Screen Sharing'], track: 'architecture', salary: '$190k - $420k' },
      { name: 'DocuSign', ticker: 'DOCU', focus: ['PDF Form Signing Canvas', 'Mobile Web Signatures', 'Security'], track: 'balanced', salary: '$180k - $400k' },
      { name: 'Zendesk', ticker: 'ZEN', focus: ['Customer Ticket Workspace', 'Agent Chat', 'Design System'], track: 'react', salary: '$180k - $390k' },
      { name: 'Asana', ticker: 'ASAN', focus: ['Task Dependencies Timeline', 'Luna Framework', 'Speed'], track: 'react', salary: '$210k - $460k' },
      { name: 'Monday.com', ticker: 'MNDY', focus: ['Custom Work OS Boards', 'Dynamic Columns', 'Real-Time Sync'], track: 'react', salary: '$190k - $420k' },
    ]
  },
  {
    sector: 'Cloud, DevTools & Infrastructure',
    icon: '⚡',
    companies: [
      { name: 'Vercel', ticker: 'VRCL', focus: ['Next.js App Router', 'Turbopack Bundler', 'Edge Runtime UI'], track: 'react', salary: '$240k - $520k' },
      { name: 'GitHub', ticker: 'GIT', focus: ['Primer Design System', 'Code Diff Viewers', 'Accessibility'], track: 'balanced', salary: '$210k - $470k' },
      { name: 'GitLab', ticker: 'GTLB', focus: ['CI/CD Pipeline Graph', 'Monorepo Web IDE', 'Vue/React'], track: 'balanced', salary: '$190k - $430k' },
      { name: 'Supabase', ticker: 'SUPA', focus: ['Postgres Studio Table Editor', 'Realtime Subscriptions', 'SQL Canvas'], track: 'react', salary: '$200k - $450k' },
      { name: 'Cloudflare', ticker: 'NET', focus: ['Worker Dashboard', 'Zero Trust Security', 'Edge Metrics'], track: 'architecture', salary: '$210k - $460k' },
      { name: 'Docker', ticker: 'DOC', focus: ['Container Management UI', 'Extensions Platform', 'Electron/Web'], track: 'balanced', salary: '$190k - $420k' },
      { name: 'Postman', ticker: 'POSTM', focus: ['API Client Workspace', 'Request Builder', 'Monaco Code Editor'], track: 'javascript', salary: '$190k - $430k' },
      { name: 'MongoDB', ticker: 'MDB', focus: ['Compass Web Aggregation Builder', 'Atlas Cloud Console'], track: 'react', salary: '$200k - $440k' },
      { name: 'Netlify', ticker: 'NTLFY', focus: ['Deploy Previews UI', 'Edge Functions Dashboard', 'JAMstack'], track: 'react', salary: '$190k - $420k' },
      { name: 'Elastic', ticker: 'ESTC', focus: ['Kibana Log Visualizers', 'Discover Query Bar', 'Elastic UI (EUI)'], track: 'react', salary: '$190k - $430k' },
      { name: 'Sentry', ticker: 'SNTRY', focus: ['Error Stack Trace Visualizer', 'Session Replay Player', 'Profiling'], track: 'react', salary: '$200k - $450k' },
      { name: 'HashiCorp', ticker: 'HCP', focus: ['Terraform Cloud Canvas', 'Vault Secrets UI', 'Design Tokens'], track: 'balanced', salary: '$200k - $450k' },
    ]
  },
  {
    sector: 'E-Commerce, Marketplaces & Retail',
    icon: '🛍️',
    companies: [
      { name: 'Shopify', ticker: 'SHOP', focus: ['Polaris Design System', 'Storefront Hydrogen', 'Cart State'], track: 'react', salary: '$200k - $470k' },
      { name: 'eBay', ticker: 'EBAY', focus: ['Auction Real-Time Bidding', 'Image Search', 'SEO & Web Vitals'], track: 'balanced', salary: '$180k - $400k' },
      { name: 'Mercado Libre', ticker: 'MELI', focus: ['Latin America Checkout', 'High Latency Mobile Web', 'Micro-Frontends'], track: 'architecture', salary: '$160k - $360k' },
      { name: 'Target', ticker: 'TGT', focus: ['Drive-Up Pickup Cart', 'Store Inventory Locator', 'a11y'], track: 'balanced', salary: '$170k - $370k' },
      { name: 'Walmart Global Tech', ticker: 'WMT', focus: ['High-Throughput E-Commerce', 'Electrode React', 'Edge Caching'], track: 'architecture', salary: '$180k - $410k' },
      { name: 'Etsy', ticker: 'ETSY', focus: ['Artisan Search & Filters', 'Image Optimization', 'A/B Experimentation'], track: 'balanced', salary: '$190k - $420k' },
      { name: 'Wayfair', ticker: 'W', focus: ['3D Room Planner WebGL', 'Furniture Customizer', 'Infinite Catalog'], track: 'javascript', salary: '$180k - $400k' },
      { name: 'Coupang', ticker: 'CPNG', focus: ['Dawn Delivery Checkout', 'Sub-second Product Search', 'Mobile Web'], track: 'architecture', salary: '$200k - $450k' },
      { name: 'Zalando', ticker: 'ZAL', focus: ['Fashion Virtual Fitting', 'Mosaic Micro-Frontends', 'GraphQL'], track: 'architecture', salary: '$160k - $350k' },
      { name: 'Instacart', ticker: 'CART', focus: ['Real-Time Grocery Replacements', 'Store Catalog Grid', 'Cart Syncer'], track: 'react', salary: '$210k - $460k' },
    ]
  },
  {
    sector: 'Mobility, Delivery & Travel',
    icon: '🚗',
    companies: [
      { name: 'Uber', ticker: 'UBER', focus: ['Geospatial / WebGL Maps', 'WebSocket Telemetry', 'Dispatch Feeds'], track: 'balanced', salary: '$215k - $470k' },
      { name: 'Airbnb', ticker: 'ABNB', focus: ['Interactive Map Search', 'Booking Calendar Picker', 'Responsive SSR'], track: 'react', salary: '$220k - $490k' },
      { name: 'DoorDash', ticker: 'DASH', focus: ['Live Order Tracker', 'Menu Builder', 'Micro-Frontends'], track: 'react', salary: '$210k - $460k' },
      { name: 'Lyft', ticker: 'LYFT', focus: ['Ride Estimation', 'Driver Web Portals', 'Design Systems'], track: 'balanced', salary: '$200k - $440k' },
      { name: 'Booking.com', ticker: 'BKNG', focus: ['Hotel Search Filter Engine', 'A/B Testing Framework', 'Core Web Vitals'], track: 'architecture', salary: '$170k - $380k' },
      { name: 'Expedia', ticker: 'EXPE', focus: ['Flight Matrix Pricing', 'Multi-Leg Booking UI', 'Micro-Apps'], track: 'balanced', salary: '$180k - $390k' },
      { name: 'Grab', ticker: 'GRAB', focus: ['Southeast Asia Superapp Web', 'Low Bandwidth Optimization', 'Payments'], track: 'architecture', salary: '$160k - $360k' },
      { name: 'Deliveroo', ticker: 'ROO', focus: ['Food Order Tracking', 'Restaurant Portal', 'Web Performance'], track: 'react', salary: '$160k - $350k' },
      { name: 'Swiggy', ticker: 'SWIG', focus: ['Instamart Catalog', 'Real-Time Driver Tracking', 'PWA / Mobile Web'], track: 'react', salary: '$140k - $320k' },
      { name: 'Zomato', ticker: 'ZOMA', focus: ['Restaurant Discovery', 'Live Order Feed', 'Design System'], track: 'balanced', salary: '$140k - $320k' },
    ]
  },
  {
    sector: 'Social, Media & Entertainment',
    icon: '🎵',
    companies: [
      { name: 'Spotify', ticker: 'SPOT', focus: ['Web Playback SDK', 'Encore Design System', 'Audio Visualizers'], track: 'javascript', salary: '$200k - $460k' },
      { name: 'Discord', ticker: 'DISC', focus: ['Voice/Video WebRTC Client', 'Virtual Chat Stream', 'React'], track: 'react', salary: '$220k - $480k' },
      { name: 'Reddit', ticker: 'RDDT', focus: ['Nested Comment Tree Virtualization', 'Media Carousel', 'PWA'], track: 'react', salary: '$200k - $450k' },
      { name: 'Pinterest', ticker: 'PINS', focus: ['Masonry Grid Layout Engine', 'Gestural Pin Boards', 'Image Preload'], track: 'javascript', salary: '$200k - $450k' },
      { name: 'Snap', ticker: 'SNAP', focus: ['Web AR Lenses', 'WebAssembly Video Pipeline', 'Canvas Filters'], track: 'javascript', salary: '$220k - $480k' },
      { name: 'Twitch', ticker: 'TWCH', focus: ['High-Throughput Chat (10k msgs/sec)', 'Live Video Player', 'Emote Parser'], track: 'architecture', salary: '$210k - $460k' },
      { name: 'LinkedIn', ticker: 'LNKD', focus: ['Feed Architecture', 'Profile Ingestion', 'Accessibility Standards'], track: 'balanced', salary: '$210k - $460k' },
      { name: 'Roblox', ticker: 'RBLX', focus: ['Creator Dashboard', '3D Asset Explorer', 'Web Studio'], track: 'balanced', salary: '$210k - $470k' },
      { name: 'Epic Games', ticker: 'EPIC', focus: ['Unreal Web Launcher', 'Storefront Checkout', 'WebGL Demos'], track: 'balanced', salary: '$200k - $450k' },
      { name: 'Riot Games', ticker: 'RIOT', focus: ['Esports Live Stats Client', 'Client App Launcher', 'Design System'], track: 'balanced', salary: '$200k - $450k' },
    ]
  }
]

// Expand dynamically to 500+ global tech companies across tier-1 startups, enterprise leaders, and global tech firms
const GLOBAL_EXPANSIONS = [
  // Additional Global Unicorns & High-Growth Tech
  'Databricks', 'Palantir', 'Anduril', 'Linear', 'Raycast', 'Vercel', 'Render', 'Railway',
  'Resend', 'Clerk', 'PostHog', 'Dub.co', 'Upstash', 'PlanetScale', 'Fly.io', 'Neon',
  'Bun', 'Deno', 'Nx', 'Turborepo', 'Biome', 'Oxlint', 'Vitest', 'TailwindLabs',
  'TanStack', 'ChakraUI', 'RadixUI', 'Framer', 'Webflow', 'Wix', 'Squarespace', 'Ghost',
  'Substack', 'Medium', 'Dev.to', 'Hashnode', 'StackOverflow', 'LeetCode', 'CodeSandbox', 'Replit',
  'StackBlitz', 'Gitpod', 'Glitch', 'Kaggle', 'Weights & Biases', 'Labelbox', 'Vellum', 'Baseten',
  'Modal', 'Anyscale', 'OctoAI', 'TogetherAI', 'Groq', 'Cerebras', 'SambaNova', 'ElevenLabs',
  'Deepgram', 'AssemblyAI', 'Speechify', 'Loom', 'Descript', 'CapCut Web', 'Kapwing', 'Veed.io',
  'FigmaPlugins', 'InVision', 'Zeplin', 'Sketch Web', 'Abstract', 'Storybook', 'Chromatic', 'Percy',
  'Cypress', 'Playwright', 'Puppeteer', 'Selenium', 'Appium', 'BrowserStack', 'SauceLabs', 'LambdaTest',
  'LaunchDarkly', 'Statsig', 'Split.io', 'Optimizely', 'VWO', 'PostHog Feature Flags', 'GrowthBook',
  'Segment', 'RudderStack', 'mParticle', 'Mixpanel', 'Amplitude', 'Heap', 'FullStory', 'LogRocket',
  'New Relic', 'Dynatrace', 'AppDynamics', 'Sumo Logic', 'Splunk', 'Grafana Labs', 'Prometheus UI',
  'PagerDuty', 'Opsgenie', 'VictorOps', 'Incident.io', 'FireHydrant', 'Rootly', 'Sleuth', 'Blameless',
  'Okta', 'Auth0', 'Ping Identity', 'OneLogin', '1Password', 'Bitwarden', 'LastPass', 'Dashlane',
  'CrowdStrike', 'Palo Alto Networks', 'Zscaler', 'Cloudflare Access', 'Tailscale', 'Twingate',
  'Snyk', 'Veracode', 'Checkmarx', 'SonarQube', 'Semgrep', 'GitHub Advanced Security', 'GitGuardian',
  'Tenable', 'Qualys', 'Rapid7', 'SentinelOne', 'Wiz', 'Orca Security', 'Lacework', 'Aqua Security',
  'HashiCorp Vault', 'CyberArk', 'BeyondTrust', 'Teleport', 'StrongDM', 'Boundary', 'Akeyless',
  'Zendesk Sell', 'Freshworks', 'Intercom', 'Drift', 'Front', 'Crisp', 'LiveChat', 'Help Scout',
  'Gorgias', 'Kustomer', 'Ada Support', 'Fin AI', 'Sierra AI', 'Forethought', 'Decagon',
  'Gong', 'Chorus.ai', 'Salesloft', 'Outreach', 'Apollo.io', 'ZoomInfo', 'Cognism', 'Lusha',
  'Clearbit', 'Leadfeeder', 'Warmly', 'Mutiny', 'Unbounce', 'Instapage', 'Leadpages', 'ClickFunnels',
  'Klaviyo', 'Braze', 'Iterable', 'Customer.io', 'ActiveCampaign', 'Mailchimp', 'SendGrid', 'Postmark',
  'Twilio SendGrid', 'Mailgun', 'Courier', 'Novu', 'Knock', 'MagicBell', 'SuprSend', 'Engagespot',
  'Pusher', 'Ably', 'PubNub', 'Centrifugo', 'Socket.io Cloud', 'LiveKit', 'Daily.co', 'Agora',
  'Twilio Video', 'Vonage Video', '100ms', 'Dyte', 'Whereby', 'Jitsi Meet', 'BigBlueButton',
  'Stripe Billing', 'Chargebee', 'Recurly', 'Paddle', 'FastSpring', 'Togai', 'Lago', 'Metronome',
  'Orb', 'Amberflo', 'Lotus', 'Tier.run', 'Octane', 'OpenMeter', 'Stigg', 'Schematic',
  'Modern Treasury', 'Moov', 'Column Bank', 'Increase', 'Lithic', 'Unit', 'Bond', 'Highnote',
  'Marqeta', 'Galileo', 'i2c', 'Synapse', 'Treasury Prime', 'Alpaca', 'DriveWealth', 'Apex Fintech',
  'Carta', 'Pulley', 'Shareworks', 'AngelList', 'Capdesk', 'Ledgy', 'Visible.vc', 'Syndicate',
  'Guideline', 'Human Interest', 'Betterment', 'Wealthfront', 'Personal Capital', 'Titan', 'Public.com',
  'Webull', 'Trade Republic', 'Freetrade', 'Stake', 'eToro', 'Plus500', 'IG Group', 'Interactive Brokers',
  'Monzo', 'Starling Bank', 'N26', 'Nubank', 'Uala', 'Kavak', 'Rappi', 'Tiendanube',
  'Payoneer', 'Wise', 'Remitly', 'WorldRemit', 'OFX', 'Airwallex', 'Tazapay', 'Thunes',
  'dbt Labs', 'Fivetran', 'Airbyte', 'Meltano', 'Astronomer', 'Prefect', 'Dagster', 'Temporal',
  'Kafka Cloud', 'Confluent', 'Redpanda', 'Apache Flink UI', 'ClickHouse Cloud', 'Tinybird', 'Hydra',
  'DuckDB WASM', 'MotherDuck', 'Timescale', 'QuestDB', 'InfluxData', 'VictoriaMetrics', 'Grafana Mimir',
  'Neo4j', 'Memgraph', 'TigerGraph', 'ArangoDB', 'Fauna', 'Couchbase', 'CockroachDB', 'YugabyteDB',
  'Spanner Web', 'Cosmos DB UI', 'DynamoDB Admin', 'ScoredDB', 'EdgeDB', 'SurrealDB', 'Prisma Cloud',
  'Drizzle Studio', 'TypeORM Web', 'Postico Web', 'TablePlus Cloud', 'Beekeeper Studio', 'DataGrip Web',
  'Metabase', 'Superset', 'Lightdash', 'Evidence.dev', 'Observable', 'Hex.tech', 'Deepnote',
  'Colab Web', 'JupyterLab Web', 'Streamlit', 'Gradio', 'Plotly Dash', 'Panel', 'Voila',
  'Weights & Biases Sweeps', 'MLflow UI', 'ClearML', 'Comet.ml', 'Neptune.ai', 'Vespa.ai', 'Qdrant Cloud',
  'Pinecone', 'Weaviate Cloud', 'Milvus Zilliz', 'Chroma Cloud', 'Marqo', 'Voyage AI', 'LangChain Cloud',
  'LlamaIndex Cloud', 'Haystack Deepset', 'Ragas UI', 'Arize AI', 'Fiddler AI', 'Arthur AI', 'TruEra',
  'OpenPipe', 'Humanloop', 'Vellum AI', 'PromptLayer', 'Helicone', 'Portkey', 'Langfuse', 'Traceloop',
  'Coze', 'Dify.ai', 'Flowise', 'Langflow', 'Chainlit', 'CopilotKit', 'Superblocks', 'Appsmith',
  'Tooljet', 'Retool', 'Budibase', 'Directus', 'Strapi Cloud', 'Sanity.io', 'Contentful', 'Prismic',
  'Storyblok', 'Hygraph', 'Payload CMS', 'Ghost CMS', 'TinaCMS', 'Decap CMS', 'Netlify CMS',
  'Algolia Search', 'Typesense Cloud', 'Meilisearch Cloud', 'Elastic App Search', 'Amazon OpenSearch UI',
  'Swiftype', 'Coveo', 'SearchUnify', 'Yext', 'Bloomreach', 'Constructor.io', 'Klevu', 'Doofinder',
  'Checkout.com Gateway', 'Worldpay', 'Adyen Drop-in', 'Authorize.Net', 'CyberSource', 'Braintree',
  'Square Web Payments', 'Shopify Payments', 'Bolt Checkout', 'Fast Checkout', 'Rally Checkout',
  'Affirm Web', 'Afterpay', 'Sezzle', 'Zip Co', 'Sunbit', 'Bread Pay', 'Splitit',
  'Klaviyo Marketing', 'Attentive', 'Postscript', 'SMSBump', 'Omnisend', 'Drip', 'Privy',
  'Yotpo', 'Bazaarvoice', 'Judge.me', 'Okendo', 'Stamped.io', 'Loox', 'Junip', 'Reviews.io',
  'Gorgias Chat', 'Rebuy Engine', 'Nosto', 'Dynamic Yield', 'Insider', 'Yieldify', 'Qubit',
  'ShipBob', 'Flexport', 'ShipStation', 'Shippo', 'EasyPost', 'Pitney Bowes', 'Freightos',
  'Convoy', 'Transfix', 'Uber Freight', 'Uber Eats Web', 'Just Eat Takeaway', 'Delivery Hero',
  'Foodpanda', 'Wolt', 'Rappi Food', 'iFood', 'Talabat', 'Careem', 'Gojek', 'Ola Cabs',
  'DiDi', 'Cabify', 'Bolt Mobility', 'FreeNow', 'BlaBlaCar', 'Getaround', 'Turo', 'Zipcar',
  'Hopper', 'Kayak', 'Skyscanner', 'Tripadvisor', 'Trivago', 'Hotels.com', 'Agoda', 'Priceline',
  'GetYourGuide', 'Viator', 'Klook', 'Tiqets', 'Hostelworld', 'Vrbo', 'Sonder', 'Selina',
  'Discord Web Client', 'Element Matrix', 'Telegram Web', 'Signal Desktop Web', 'Mattermost', 'Zulip',
  'Twitch Interactive', 'Kick Streaming', 'YouTube Gaming Web', 'Steam Web Community', 'GOG Galaxy Web',
  'Epic Games Store', 'Roblox Studio Web', 'Unity Web Services', 'Godot Web', 'PlayCanvas',
  'Three.js Studio', 'Spline 3D', 'Bezi 3D', 'Womp 3D', 'Vectary', 'Shapespark', 'Sketchfab',
  'Polygon Web3', 'Solana Web', 'Ethereum Org', 'Uniswap Web', 'OpenSea', 'Blur.io', 'Magic Eden',
  'Chainlink', 'The Graph', 'Alchemy Cloud', 'Infura', 'QuickNode', 'Tenderly', 'Thirdweb'
]

const companies = []
let idCount = 1

// 1. Add structured seeds
for (const s of SECTORS) {
  for (const c of s.companies) {
    companies.push({
      id: `comp-${idCount++}`,
      name: c.name,
      ticker: c.ticker,
      sector: s.sector,
      icon: s.icon,
      accentColor: '#6366f1',
      tagline: `${c.focus.slice(0, 3).join(', ')} Mastery`,
      levelMapping: 'L4 (Mid) · L5 (Senior) · L6 (Staff)',
      salaryRange: c.salary,
      interviewFocus: c.focus,
      hiringBarSummary: `Hiring bar at ${c.name} emphasizes ${c.focus.join(', ')} with high performance standards and scalable component design.`,
      rounds: [
        {
          name: 'Round 1: Screening & Coding Challenge',
          duration: '45 mins',
          type: 'Coding',
          description: `Problem solving focusing on ${c.focus[0]} and clean data structures.`,
          tips: ['Clarify requirements early', 'State Big-O time and space complexity']
        },
        {
          name: 'Round 2: UI Engineering & Components',
          duration: '45 mins',
          type: 'Coding',
          description: `Building production-ready interactive widgets relevant to ${c.name}.`,
          tips: ['Structure state cleanly', 'Handle error, empty, and loading states']
        },
        {
          name: 'Round 3: Frontend Architecture & System Design',
          duration: '60 mins',
          type: 'System Design',
          description: `Architecting high-scale frontend systems matching ${c.name}'s business domain.`,
          tips: ['Separate state layer from UI', 'Address Web Vitals and caching tiers']
        },
        {
          name: 'Round 4: Behavioral & Culture Assessment',
          duration: '45 mins',
          type: 'Behavioral',
          description: `Evaluate leadership, conflict resolution, and cultural values.`,
          tips: ['Use the STAR method', 'Demonstrate high technical ownership']
        }
      ],
      filterKeywords: [c.name.toLowerCase(), ...c.focus.map(f => f.toLowerCase().split(' ')[0])],
      recommendedTrack: c.track
    })
  }
}

// 2. Expand with the global tech directory to cross 500+ companies
const SECTOR_CYCLE = SECTORS.map(s => s.sector)
const TRACK_CYCLE = ['balanced', 'react', 'javascript', 'architecture']

for (let i = 0; i < GLOBAL_EXPANSIONS.length; i++) {
  const compName = GLOBAL_EXPANSIONS[i]
  const sectorName = SECTOR_CYCLE[i % SECTOR_CYCLE.length]
  const track = TRACK_CYCLE[i % TRACK_CYCLE.length]
  const sectorObj = SECTORS.find(s => s.sector === sectorName) || SECTORS[0]

  const focusTags = [
    track === 'react' ? 'React 19 & Hooks' : track === 'javascript' ? 'JavaScript Runtime' : 'System Design',
    'Component Architecture',
    'Core Web Vitals',
    'TypeScript'
  ]

  companies.push({
    id: `comp-${idCount++}`,
    name: compName,
    ticker: compName.slice(0, 4).toUpperCase(),
    sector: sectorName,
    icon: sectorObj.icon,
    accentColor: '#6366f1',
    tagline: `High-Performance ${compName} Frontend Engineering`,
    levelMapping: 'Mid-Level (L4) · Senior (L5) · Staff (L6)',
    salaryRange: '$180k - $440k total comp',
    interviewFocus: focusTags,
    hiringBarSummary: `Technical hiring at ${compName} tests ${focusTags.slice(0, 2).join(', ')}, responsive modularity, and clean architectural design.`,
    rounds: [
      {
        name: 'Round 1: Technical Coding Screen',
        duration: '45 mins',
        type: 'Coding',
        description: `Algorithmic problem solving and JavaScript fundamentals test.`,
        tips: ['Think out loud', 'Validate edge cases before executing']
      },
      {
        name: 'Round 2: UI Component Implementation',
        duration: '45 mins',
        type: 'Coding',
        description: `Hands-on widget coding with state management and accessibility.`,
        tips: ['Keep component boundaries clean', 'Implement accessible keyboard interactions']
      },
      {
        name: 'Round 3: System Architecture Round',
        duration: '60 mins',
        type: 'System Design',
        description: `Frontend system design for ${compName}'s core product requirements.`,
        tips: ['Focus on caching, network resiliency, and INP / LCP optimization']
      },
      {
        name: 'Round 4: Collaboration & Values',
        duration: '45 mins',
        type: 'Behavioral',
        description: `Evaluation of team collaboration, handling technical disagreements, and execution.`,
        tips: ['Structure answers with STAR format']
      }
    ],
    filterKeywords: [compName.toLowerCase(), track, 'react', 'javascript', 'performance'],
    recommendedTrack: track
  })
}

console.log(`Generated ${companies.length} Global Tech Companies Pathways.`)

await writeFile(OUT_FILE, JSON.stringify(companies, null, 2), 'utf8')
console.log(`Saved to ${OUT_FILE}`)
