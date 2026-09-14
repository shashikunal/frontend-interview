export const CURRICULUM_DEFINITIONS_PART3 = {
  // React Router: 10 Topics
  'react-router': [
    {
      id: 'react-router-data-vs-declarative',
      title: 'React Router Architecture: Data Routers vs Declarative',
      description: 'createBrowserRouter, RouterProvider vs BrowserRouter, Route matching algorithms, specificity scoring, and relative routing.',
      subtopics: [
        { id: 'createbrowserrouter-engine', title: 'Data Routers (createBrowserRouter) vs Legacy JSX <BrowserRouter>', conceptId: 'rr_data_routers' },
        { id: 'route-matching-specificity', title: 'Route Matching Algorithm: Specificity Scoring & Rank Ordering', conceptId: 'rr_route_matching' },
        { id: 'relative-navigation-links', title: 'Relative Link & Route Traversal: <Link to=".."> and <Link to=".">', conceptId: 'rr_relative_links' },
      ],
    },
    {
      id: 'react-router-nested-routes-outlets',
      title: 'Nested Routes, Layout Hierarchies & <Outlet>',
      description: 'Hierarchical routing, parent route layouts, <Outlet context={...}>, useOutletContext, and index routes.',
      subtopics: [
        { id: 'nested-routing-layout-composition', title: 'Hierarchical Nesting: Composing Layouts Without Unmounting Children', conceptId: 'rr_nested_layouts' },
        { id: 'outlet-context-passing', title: 'Passing Typed State Across Boundaries with <Outlet context={...}>', conceptId: 'rr_outlet_context' },
        { id: 'index-routes-defaults', title: 'Index Routes: Default Child Routing for Parent Paths', conceptId: 'rr_index_routes' },
      ],
    },
    {
      id: 'react-router-loaders-parallel-fetching',
      title: 'Route Loaders & Eliminating Fetch Waterfalls',
      description: 'loader function ({ request, params }), parallel data loading before component render, useLoaderData, and defer/Await streams.',
      subtopics: [
        { id: 'loader-parallel-execution', title: 'Eliminating Waterfall Cascades by Running Loaders in Parallel on Route Transitions', conceptId: 'rr_loaders_parallel' },
        { id: 'useloaderdata-type-safety', title: 'Consuming Server/Client Data via useLoaderData() in Target Components', conceptId: 'rr_useloaderdata' },
        { id: 'deferred-data-await-streaming', title: 'Streaming Slow Queries with defer() and the <Await> Component', conceptId: 'rr_defer_await' },
      ],
    },
    {
      id: 'react-router-actions-mutations',
      title: 'Route Actions, HTML Form Submissions & Invalidation',
      description: 'action functions, <Form method="post">, useActionData, automatic route loader revalidation, and useSubmit programmatic submission.',
      subtopics: [
        { id: 'action-lifecycle-mutations', title: 'Action Functions: Intercepting Client Form Submissions Declaratively', conceptId: 'rr_actions_lifecycle' },
        { id: 'automatic-loader-revalidation', title: 'Automatic Revalidation: How Calling Actions Automatically Triggers All Active Loaders', conceptId: 'rr_auto_revalidation' },
        { id: 'optimistic-ui-usefetcher', title: 'Independent Mutations Without Navigation Using useFetcher()', conceptId: 'rr_usefetcher' },
      ],
    },
    {
      id: 'react-router-error-boundaries-guards',
      title: 'Error Handling: errorElement & Navigation Guards',
      description: 'errorElement route boundary, isRouteErrorResponse, handling 404/500 responses, and protected route redirect guards.',
      subtopics: [
        { id: 'errorelement-boundary-isolation', title: 'errorElement: Containing Route Crashes to Nested Layouts', conceptId: 'rr_errorelement' },
        { id: 'isrouteerrorresponse-404-handling', title: 'Structured Error Handling with isRouteErrorResponse(error)', conceptId: 'rr_isrouteerror' },
        { id: 'protected-route-navigation-guards', title: 'Client-Side Auth Guards: redirect() Inside Loaders vs Protected Route Wrappers', conceptId: 'rr_auth_guards' },
      ],
    },
    {
      id: 'react-router-scroll-view-transitions',
      title: 'Scroll Restoration & Native View Transitions',
      description: '<ScrollRestoration>, getKey custom scroll positions, unstable_viewTransition, and smooth page morph animations.',
      subtopics: [
        { id: 'scroll-restoration-behavior', title: '<ScrollRestoration>: Emulating Native Browser Scroll Geometry Across Navigations', conceptId: 'rr_scroll_restoration' },
        { id: 'view-transitions-integration', title: 'Enabling View Transitions via <Link to="..." viewTransition>', conceptId: 'rr_view_transitions' },
        { id: 'pending-navigation-states', title: 'Pending State UX: useNavigation().state === "loading" Spinners', conceptId: 'rr_pending_navigation' },
      ],
    },
  ],

  // Tailwind: 10 Topics
  tailwind: [
    {
      id: 'tailwind-utility-first-engine',
      title: 'Tailwind CSS Utility-First Architecture & JIT Engine',
      description: 'Utility-first mental model, Just-In-Time (JIT) compiler on-demand generation, purging unused CSS, and AST transformations.',
      subtopics: [
        { id: 'utility-first-vs-semantic-css', title: 'Utility-First vs Semantic CSS: Maintenance, Specificity & Cache Invalidation', conceptId: 'tw_utility_first' },
        { id: 'jit-engine-ast-compilation', title: 'How Tailwind JIT Works: Scanning Content Files & Generating Atomic CSS in Milliseconds', conceptId: 'tw_jit_engine' },
        { id: 'arbitrary-value-syntax', title: 'Arbitrary Value Syntax: w-[342px] and bg-[#1a1a2e] Power & Pitfalls', conceptId: 'tw_arbitrary_values' },
      ],
    },
    {
      id: 'tailwind-responsive-breakpoints',
      title: 'Responsive Design: Mobile-First Breakpoints & Modifiers',
      description: 'Mobile-first breakpoint prefixes (sm:, md:, lg:, xl:, 2xl:), min-width media queries, and custom responsive screens in config.',
      subtopics: [
        { id: 'mobile-first-modifier-hierarchy', title: 'The Mobile-First Rule: Unprefixed Utilities Apply by Default to All Screens', conceptId: 'tw_mobile_first' },
        { id: 'custom-breakpoint-configuration', title: 'Configuring Custom Breakpoints & Max-Width Screens in tailwind.config', conceptId: 'tw_custom_screens' },
        { id: 'container-queries-plugin', title: 'Tailwind Container Queries Plugin: @container and @[400px]:flex', conceptId: 'tw_container_queries' },
      ],
    },
    {
      id: 'tailwind-dark-mode-theming',
      title: 'Dark Mode Strategies: class vs media & Design Tokens',
      description: 'darkMode: "class" vs "media", dark: modifier stacking, system preference syncing, CSS custom property theming, and palette scaling.',
      subtopics: [
        { id: 'class-vs-media-dark-mode', title: 'Class Strategy (HTML class="dark") vs Media Strategy (prefers-color-scheme)', conceptId: 'tw_dark_mode_strategies' },
        { id: 'design-tokens-css-variables', title: 'Binding Tailwind Colors to CSS Custom Properties for Instant Theme Swapping', conceptId: 'tw_theme_css_variables' },
        { id: 'color-palette-50-to-950', title: 'Tailwind Numerical Shade Scale (50 to 950) & WCAG Contrast Compliance', conceptId: 'tw_color_scale' },
      ],
    },
    {
      id: 'tailwind-state-modifiers',
      title: 'State Modifiers: hover, focus, active, group, peer',
      description: 'Pseudo-class modifiers, pseudo-element modifiers (before:, after:, placeholder:), group-hover parent styling, and peer sibling controls.',
      subtopics: [
        { id: 'pseudo-class-and-element-modifiers', title: 'Modifier Stacking: hover:focus:not-disabled:bg-blue-600 Order Rules', conceptId: 'tw_modifier_stacking' },
        { id: 'group-hover-parent-child', title: 'Styling Children Based on Parent State with group and group-hover', conceptId: 'tw_group_hover' },
        { id: 'peer-modifiers-sibling-controls', title: 'Form Label Interactions with peer and peer-focus / peer-invalid', conceptId: 'tw_peer_modifiers' },
      ],
    },
    {
      id: 'tailwind-component-abstraction',
      title: 'Component Abstraction: @apply vs React Component Primitives',
      description: 'When to use @apply vs when it is an anti-pattern, extracting React component primitives (cva / tailwind-merge), and clsx utility.',
      subtopics: [
        { id: 'apply-trade-offs-anti-pattern', title: 'The Dangers of @apply: Reintroducing Monolithic CSS Specificity Battles', conceptId: 'tw_apply_tradeoffs' },
        { id: 'tailwind-merge-clsx-pattern', title: 'Conflict Resolution: Combining clsx and tailwind-merge (cn Utility)', conceptId: 'tw_tailwind_merge' },
        { id: 'class-variance-authority-cva', title: 'Type-Safe Component Variants with Class Variance Authority (CVA)', conceptId: 'tw_cva_variants' },
      ],
    },
  ],

  // Next.js: 12 Topics
  nextjs: [
    {
      id: 'nextjs-app-router-mental-model',
      title: 'Next.js App Router Architecture vs Pages Router',
      description: 'App directory structure, nested file conventions (page.tsx, layout.tsx, loading.tsx, error.tsx), route groups ((auth)), and React 19 RSC foundation.',
      subtopics: [
        { id: 'app-directory-file-conventions', title: 'File System Hierarchy: page, layout, template, loading, error, not-found', conceptId: 'next_file_conventions' },
        { id: 'route-groups-parentheses', title: 'Route Groups ((marketing), (dashboard)) for Layout Isolation Without URL Paths', conceptId: 'next_route_groups' },
        { id: 'migration-pages-to-app', title: 'Architectural Shift: Pages Router (_app, _document) vs App Router Root Layout', conceptId: 'next_pages_vs_app' },
      ],
    },
    {
      id: 'nextjs-server-vs-client-components',
      title: 'Server Components by Default & "use client" Boundaries',
      description: 'Server Components execution lifecycle, zero client JS bundle, passing props across server-client boundaries, and serializeable props.',
      subtopics: [
        { id: 'server-components-default', title: 'RSC by Default: Direct Database Access, Secrets Protection & Zero Client Bundle', conceptId: 'next_rsc_default' },
        { id: 'client-component-leaves', title: 'Pushing "use client" to the Leaves: Maintaining Maximized Server Tree Coverage', conceptId: 'next_client_leaves' },
        { id: 'passing-server-children-to-client', title: 'Composition Pattern: Passing Server Components as children to Client Providers', conceptId: 'next_server_children_slot' },
      ],
    },
    {
      id: 'nextjs-data-fetching-caching',
      title: 'Data Fetching, Native fetch Cache & revalidateTag',
      description: 'fetch caching (force-cache, no-store), next: { tags, revalidate }, revalidatePath, revalidateTag, and Time-based vs On-demand ISR.',
      subtopics: [
        { id: 'fetch-caching-options', title: 'Extended fetch API: fetch(url, { next: { revalidate: 3600 } }) Caching Tiers', conceptId: 'next_fetch_caching' },
        { id: 'tag-based-revalidation', title: 'On-Demand Cache Invalidation via revalidateTag("posts") in Server Actions', conceptId: 'next_tag_revalidation' },
        { id: 'request-deduplication-react-cache', title: 'Per-Request Memoization with React cache() Across Shared Components', conceptId: 'next_react_cache' },
      ],
    },
    {
      id: 'nextjs-server-actions-mutations',
      title: 'Server Actions ("use server") & Progressive Enhancement',
      description: 'Server Actions declaration, calling from forms (<form action={action}>), progressive enhancement without JS, and optimistic UI integration.',
      subtopics: [
        { id: 'use-server-directive', title: '"use server" Directives: Inline Function vs Modular Action File Standards', conceptId: 'next_server_action_directive' },
        { id: 'form-progressive-enhancement', title: 'Progressive Enhancement: Form Submissions Working Before JavaScript Loads', conceptId: 'next_form_prog_enhancement' },
        { id: 'action-pending-useactionstate', title: 'Handling Action States, Errors & Pending Flags with useActionState', conceptId: 'next_action_state' },
      ],
    },
    {
      id: 'nextjs-route-handlers-rest',
      title: 'Route Handlers (route.ts) & RESTful Web Endpoints',
      description: 'route.ts conventions, HTTP methods (GET, POST, PUT, DELETE), NextRequest and NextResponse, CORS handling, and streaming responses.',
      subtopics: [
        { id: 'route-handler-conventions', title: 'Exporting Named HTTP Method Functions (GET, POST, PATCH) in route.ts', conceptId: 'next_route_handler_methods' },
        { id: 'nextrequest-nextresponse-apis', title: 'NextRequest & NextResponse: Cookie Management, Headers & JSON Streaming', conceptId: 'next_request_response' },
        { id: 'dynamic-vs-static-route-handlers', title: 'Automatic Static Optimization vs Dynamic Evaluation in Route Handlers', conceptId: 'next_route_handler_caching' },
      ],
    },
    {
      id: 'nextjs-middleware-edge-runtime',
      title: 'Next.js Middleware & Edge Runtime Execution',
      description: 'middleware.ts execution at the edge, matcher configurations, URL rewrites, redirects, authentication cookie verification, and headers.',
      subtopics: [
        { id: 'middleware-lifecycle-matcher', title: 'Middleware Architecture: Running Prior to Route Matching at the CDN Edge', conceptId: 'next_middleware_lifecycle' },
        { id: 'rewrites-vs-redirects', title: 'URL Rewrites (Masked Server Proxies) vs HTTP 307/308 Redirects', conceptId: 'next_rewrites_redirects' },
        { id: 'edge-runtime-limitations', title: 'Edge Runtime Constraints: V8 Isolates, No Node Native Modules (fs/child_process)', conceptId: 'next_edge_runtime' },
      ],
    },
  ],

  // Microfrontends: 10 Topics
  microfrontends: [
    {
      id: 'mfe-paradigms-module-federation',
      title: 'Microfrontend Paradigms & Webpack 5 Module Federation',
      description: 'Build-time vs run-time microfrontends, ModuleFederationPlugin (name, filename, remotes, exposes, shared), and remoteEntry.js.',
      subtopics: [
        { id: 'build-time-vs-runtime-mfes', title: 'Build-Time npm Packages vs Runtime Module Federation Architectural Trade-offs', conceptId: 'mfe_runtime_vs_build' },
        { id: 'module-federation-plugin-spec', title: 'ModuleFederationPlugin Schema: exposes, remotes, and shared Dependencies', conceptId: 'mfe_plugin_spec' },
        { id: 'remoteentry-script-execution', title: 'The remoteEntry.js Bootstrap: Container Initialization & Shared Scope Resolution', conceptId: 'mfe_remoteentry_lifecycle' },
      ],
    },
    {
      id: 'mfe-shared-dependencies-singletons',
      title: 'Shared Dependency Management & Singleton Scope',
      description: 'shared dependencies configuration, singleton: true, strictVersion, requiredVersion semantic ranges, and duplicate library isolation.',
      subtopics: [
        { id: 'singleton-true-react-singletons', title: 'singleton: true: Preventing Duplicate React Instances and Context Collisions', conceptId: 'mfe_singleton_scope' },
        { id: 'semver-matching-fallbacks', title: 'Semantic Version Range Matching & Automatic Remote Fallback Loading', conceptId: 'mfe_semver_matching' },
        { id: 'eager-vs-lazy-loading-shared', title: 'eager: true Pitfalls vs Asynchronous Dynamic import() Bootstrapping', conceptId: 'mfe_eager_loading' },
      ],
    },
    {
      id: 'mfe-style-encapsulation-isolated-css',
      title: 'Isolated CSS & Style Encapsulation Across MFEs',
      description: 'Preventing CSS bleed across autonomous microfrontends, CSS Modules, Shadow DOM encapsulation, Tailwind prefixes, and namespace scoping.',
      subtopics: [
        { id: 'css-leakage-in-mfes', title: 'Global CSS Collisions: Why Standard Utility Classes Bleed Across Remote Apps', conceptId: 'mfe_css_bleeding' },
        { id: 'shadow-dom-mfe-boundary', title: 'Mounting Microfrontends Inside Shadow DOM Roots for Hard Style Isolation', conceptId: 'mfe_shadow_dom_boundary' },
        { id: 'tailwind-prefix-scoping', title: 'Tailwind prefix: "mfe1-" Configurations for Namespace Encapsulation', conceptId: 'mfe_tailwind_prefixes' },
      ],
    },
    {
      id: 'mfe-cross-app-communication',
      title: 'Cross-Microfrontend Communication & Event Buses',
      description: 'Decoupled communication patterns, CustomEvent on window, BroadcastChannel API across tabs/iframes, shared Redux/Zustand stores, and anti-patterns.',
      subtopics: [
        { id: 'window-customevent-bus', title: 'Decoupled Event Broadcasting with window.dispatchEvent(new CustomEvent())', conceptId: 'mfe_customevent_bus' },
        { id: 'broadcastchannel-messaging', title: 'The BroadcastChannel API: Cross-Frame and Cross-Worker Event Bus', conceptId: 'mfe_broadcast_channel' },
        { id: 'shared-state-anti-patterns', title: 'Monolithic Shared State Anti-patterns: When Shared Stores Violate Team Autonomy', conceptId: 'mfe_shared_state_traps' },
      ],
    },
    {
      id: 'mfe-resilience-fault-tolerance',
      title: 'Resilience, Fault Tolerance & Error Boundaries',
      description: 'Handling remote failure (404/500), dynamic remote loading via importScript, React Error Boundaries for failed microfrontends, and fallback widgets.',
      subtopics: [
        { id: 'dynamic-remote-loading-promise', title: 'Dynamic Remote Federation: Loading Remotes via Promise Resolvers in Production', conceptId: 'mfe_dynamic_remotes' },
        { id: 'mfe-error-boundary-graceful-fallback', title: 'Containing Failed Microfrontends with Fallback Skeletons and Offline Banners', conceptId: 'mfe_error_boundaries' },
        { id: 'synthetic-health-checks', title: 'Automated Remote Probing & Automated Circuit Breaker Bypass in Load Balancers', conceptId: 'mfe_health_checks' },
      ],
    },
  ],

  // RESTful APIs: 10 Topics
  'restful-apis': [
    {
      id: 'rest-architectural-constraints',
      title: 'REST Constraints & Richardson Maturity Model',
      description: 'The 6 REST architectural constraints (Client-Server, Stateless, Cacheable, Layered System, Code on Demand, Uniform Interface) and Richardson Level 0-3.',
      subtopics: [
        { id: 'six-rest-constraints-spec', title: 'The 6 Guiding Constraints of Roy Fielding’s REST Architecture Specification', conceptId: 'rest_six_constraints' },
        { id: 'richardson-maturity-model', title: 'Richardson Maturity Model: Levels 0 (RPC) to 3 (HATEOAS Hypermedia Controls)', conceptId: 'rest_richardson_model' },
        { id: 'statelessness-implications', title: 'The Statelessness Constraint: Session Tokens in Headers vs Server Memory', conceptId: 'rest_statelessness' },
      ],
    },
    {
      id: 'rest-http-methods-idempotency',
      title: 'HTTP Methods Semantics, Safety & Idempotency Rules',
      description: 'Safe methods (GET, HEAD, OPTIONS) vs Idempotent methods (PUT, DELETE, GET) vs Non-idempotent (POST, PATCH), and PUT vs PATCH contracts.',
      subtopics: [
        { id: 'safety-vs-idempotency-matrix', title: 'Mathematical Definition: Safe Methods vs Idempotent Methods Matrix', conceptId: 'rest_safety_idempotency' },
        { id: 'put-vs-patch-semantics', title: 'PUT (Complete Entity Replacement) vs PATCH (Partial Delta Mutation)', conceptId: 'rest_put_vs_patch' },
        { id: 'idempotency-keys-in-post', title: 'Idempotency-Key Headers in Payment POST Endpoints: Deduplication Engines', conceptId: 'rest_idempotency_keys' },
      ],
    },
    {
      id: 'rest-status-codes-taxonomy',
      title: 'HTTP Status Code Taxonomy & RFC 7807 Problem Details',
      description: '2xx success codes, 3xx redirection, 4xx client errors (400, 401 vs 403, 404, 409 Conflict, 422 Unprocessable, 429 Too Many Requests), 5xx, and RFC 7807.',
      subtopics: [
        { id: 'auth-status-codes-401-403', title: '401 Unauthorized (Unauthenticated) vs 403 Forbidden (Insufficient Permissions)', conceptId: 'rest_401_vs_403' },
        { id: 'conflict-and-validation-409-422', title: '409 Conflict (State Precondition Failed) vs 422 Unprocessable Entity (Schema Validation)', conceptId: 'rest_409_vs_422' },
        { id: 'rfc7807-problem-details-json', title: 'RFC 7807 Problem Details: application/problem+json Standard Error Payloads', conceptId: 'rest_rfc7807' },
      ],
    },
    {
      id: 'rest-uri-design-resource-nesting',
      title: 'URI Design Standards, Plural Nouns & Relationship Nesting',
      description: 'RESTful URI naming conventions, plural nouns (/users), nesting sub-resources (/users/123/orders), query parameters for filtering/sorting.',
      subtopics: [
        { id: 'plural-nouns-no-verbs', title: 'Clean Resource URIs: Plural Nouns (/articles) Without Action Verbs (/getArticles)', conceptId: 'rest_uri_naming' },
        { id: 'sub-resource-nesting-depth', title: 'Sub-Resource Nesting Limits: Preventing /orgs/1/teams/2/users/3/projects/4 Anti-patterns', conceptId: 'rest_resource_nesting' },
        { id: 'query-parameters-filtering-sorting', title: 'Standard Filtering, Sorting & Field Selection (?sort=-created_at&fields=id,name)', conceptId: 'rest_query_filters' },
      ],
    },
    {
      id: 'rest-pagination-strategies',
      title: 'Pagination Architectures: Offset vs Cursor vs Keyset',
      description: 'Offset/Limit pagination performance degradation on large tables, cursor-based pagination with stable base64 cursors, and keyset pagination.',
      subtopics: [
        { id: 'offset-limit-performance-trap', title: 'The OFFSET Trap: Why OFFSET 1000000 Forces Full Table Scans in SQL', conceptId: 'rest_offset_trap' },
        { id: 'cursor-based-pagination-engine', title: 'Cursor-Based Pagination: Stable O(1) Lookups Resistant to Concurrent Insertions', conceptId: 'rest_cursor_pagination' },
        { id: 'pagination-metadata-link-headers', title: 'Pagination Link Headers (RFC 5988 rel="next") & Envelope JSON Metadata', conceptId: 'rest_pagination_headers' },
      ],
    },
  ],

  // HTTP: 10 Topics
  http: [
    {
      id: 'http-protocol-evolution',
      title: 'HTTP Protocol Evolution: HTTP/1.1 vs HTTP/2 vs HTTP/3',
      description: 'HTTP/1.1 head-of-line blocking, domain sharding, HTTP/2 binary framing and multiplexing, HPACK header compression, and HTTP/3 QUIC UDP transport.',
      subtopics: [
        { id: 'http1-head-of-line-blocking', title: 'HTTP/1.1 Head-of-Line (HoL) Blocking & Browser 6-Connection-Per-Origin Limit', conceptId: 'http_hol_blocking' },
        { id: 'http2-multiplexing-streams', title: 'HTTP/2 Binary Framing Layer: Stream Multiplexing Over a Single TCP Connection', conceptId: 'http2_multiplexing' },
        { id: 'http3-quic-udp-transport', title: 'HTTP/3 over QUIC: Eliminating TCP Packet Loss Head-of-Line Blocking via UDP', conceptId: 'http3_quic' },
      ],
    },
    {
      id: 'http-tcp-tls-handshake',
      title: 'TCP 3-Way Handshake & TLS 1.3 Cryptographic Lifecycle',
      description: 'SYN, SYN-ACK, ACK 3-way handshake, TLS 1.2 vs TLS 1.3 (1-RTT handshakes, Zero-RTT session resumption), certificate validation, and cipher suites.',
      subtopics: [
        { id: 'tcp-three-way-handshake', title: 'TCP Connection Setup: SYN, SYN-ACK, ACK Latency Overhead Round Trips', conceptId: 'http_tcp_handshake' },
        { id: 'tls-13-one-rtt-handshake', title: 'TLS 1.3 Encryption: 1-RTT Handshakes, Ephemeral Diffie-Hellman & Perfect Forward Secrecy', conceptId: 'http_tls13_handshake' },
        { id: 'zero-rtt-session-resumption', title: 'TLS 1.3 0-RTT Early Data Resumption & Mitigating Replay Attack Hazards', conceptId: 'http_0rtt_early_data' },
      ],
    },
    {
      id: 'http-caching-directives-validators',
      title: 'HTTP Caching Directives: Cache-Control & Conditional Requests',
      description: 'Cache-Control (max-age, s-maxage, no-cache, no-store, must-revalidate, stale-while-revalidate), ETags, Last-Modified, and 304 Not Modified.',
      subtopics: [
        { id: 'cache-control-directives-matrix', title: 'no-cache (Must Revalidate) vs no-store (Never Cache Anywhere) Clarification', conceptId: 'http_cache_directives' },
        { id: 'etags-and-conditional-validation', title: 'Strong vs Weak ETags & If-None-Match 304 Not Modified Round-Trip Savings', conceptId: 'http_etags_validation' },
        { id: 'stale-while-revalidate-cache', title: 'stale-while-revalidate: Serving Stale Assets Instantly While Background Fetching', conceptId: 'http_swr_header' },
      ],
    },
    {
      id: 'http-cors-preflight-architecture',
      title: 'Cross-Origin Resource Sharing (CORS) & Preflight OPTIONS',
      description: 'Same-Origin Policy (SOP), Simple requests vs Preflighted requests (OPTIONS), Access-Control-Allow-Origin, headers, methods, and credentials.',
      subtopics: [
        { id: 'same-origin-policy-sop', title: 'The Browser Same-Origin Policy: Protocol, Hostname, and Port Triad Invariant', conceptId: 'http_sop_rules' },
        { id: 'cors-preflight-options-triggers', title: 'What Triggers a Preflight OPTIONS Request: Custom Headers & Non-Simple Methods', conceptId: 'http_cors_preflight' },
        { id: 'credentials-with-wildcards', title: 'Why Access-Control-Allow-Origin: * Fails When withCredentials: true is Set', conceptId: 'http_cors_credentials_trap' },
      ],
    },
    {
      id: 'http-cookies-security-flags',
      title: 'HTTP Cookies Architecture: HttpOnly, Secure & SameSite',
      description: 'Set-Cookie header directives, HttpOnly (preventing XSS access), Secure (HTTPS only), SameSite (Strict, Lax, None), and CSRF protection.',
      subtopics: [
        { id: 'httponly-and-secure-flags', title: 'HttpOnly: Blocking document.cookie from Malicious JavaScript Injections', conceptId: 'http_cookie_httponly' },
        { id: 'samesite-strict-lax-none', title: 'SameSite Directives: Strict vs Lax vs None; Defending Against CSRF Attacks', conceptId: 'http_samesite_cookies' },
        { id: 'cookie-prefixes-host-secure', title: 'Cookie Security Prefixes: __Host- and __Secure- Domain Attribute Locks', conceptId: 'http_cookie_prefixes' },
      ],
    },
  ],

  // Postman: 8 Topics
  postman: [
    {
      id: 'postman-collections-environments',
      title: 'Postman Collections, Environments & Scoped Variables',
      description: 'Postman Collections organization, Environment vs Global vs Collection vs Data variables, variable substitution ({{var}}), and secrets.',
      subtopics: [
        { id: 'variable-scope-hierarchy', title: 'Variable Precedence: Global < Collection < Environment < Data < Local Scopes', conceptId: 'postman_var_scopes' },
        { id: 'environment-secret-management', title: 'Managing Sensitive API Keys with Postman Secret Type Variables & Git Safety', conceptId: 'postman_secrets' },
        { id: 'dynamic-variables-mocking', title: 'Built-in Dynamic Faker Variables: {{$randomEmail}}, {{$guid}}, {{$timestamp}}', conceptId: 'postman_dynamic_vars' },
      ],
    },
    {
      id: 'postman-scripts-assertions-chai',
      title: 'Pre-Request Scripts, Tests & Chai Assertion Testing',
      description: 'pm.environment.set, pm.variables.get, pm.test(), pm.expect() Chai BDD assertions, response status testing, and JSON schema validation.',
      subtopics: [
        { id: 'pm-test-chai-assertions', title: 'Writing Test Suites: pm.response.to.have.status(200) & Deep JSON Expectations', conceptId: 'postman_chai_tests' },
        { id: 'pre-request-token-refresh', title: 'Automated OAuth2 Token Refresh Workflows in Pre-Request Scripts', conceptId: 'postman_prerequest_auth' },
        { id: 'json-schema-validation-tv4', title: 'Validating Complete API Response Contracts Using JSON Schema (ajv / tv4)', conceptId: 'postman_schema_validation' },
      ],
    },
    {
      id: 'postman-newman-ci-automation',
      title: 'Newman CLI: Automated API Testing in CI/CD Pipelines',
      description: 'Running Postman collections headlessly with newman run, exporting HTML/JUnit test reports, environment file injection, and GitHub Actions.',
      subtopics: [
        { id: 'newman-cli-execution', title: 'Executing Postman Collections in Terminal: newman run collection.json -e env.json', conceptId: 'postman_newman_cli' },
        { id: 'ci-cd-github-actions-gate', title: 'Automated Pull Request API Quality Gates in GitHub Actions with Newman', conceptId: 'postman_ci_pipeline' },
        { id: 'junit-html-reporters', title: 'Generating Test Reports: newman-reporter-htmlextra and JUnit XML Logs', conceptId: 'postman_reporters' },
      ],
    },
    {
      id: 'postman-mock-servers-contract',
      title: 'Postman Mock Servers & Contract-First Development',
      description: 'Creating mock servers, matching algorithm (x-mock-response-code), contract-first frontend prototyping, and simulating latency/errors.',
      subtopics: [
        { id: 'mock-server-setup-matching', title: 'Setting Up Mock Servers & Configuring Matching Response Examples', conceptId: 'postman_mock_servers' },
        { id: 'simulating-network-failures', title: 'Testing Client Edge Cases: Simulating 504 Gateway Timeouts & Rate Limits', conceptId: 'postman_mock_failures' },
        { id: 'contract-first-api-sync', title: 'OpenAPI Specification Synchronization with Postman Collections', conceptId: 'postman_openapi_sync' },
      ],
    },
  ],

  // WebSockets: 8 Topics
  websockets: [
    {
      id: 'ws-protocol-lifecycle-handshake',
      title: 'WebSocket Protocol Lifecycle: HTTP Upgrade to Full-Duplex',
      description: 'The HTTP 101 Switching Protocols handshake, Sec-WebSocket-Key and Sec-WebSocket-Accept hash math, and persistent bidirectional TCP socket.',
      subtopics: [
        { id: 'http-upgrade-handshake-math', title: 'The Handshake: Sec-WebSocket-Key, GUID String & SHA-1 / Base64 Acceptance', conceptId: 'ws_handshake_math' },
        { id: 'full-duplex-tcp-framing', title: 'Full-Duplex TCP Communication: How WebSockets Eliminate HTTP Polling Header Overhead', conceptId: 'ws_full_duplex' },
        { id: 'websocket-framing-opcodes', title: 'WebSocket Frame Format: FIN bit, Masking Key, Opcodes (Text, Binary, Close, Ping)', conceptId: 'ws_framing_opcodes' },
      ],
    },
    {
      id: 'ws-heartbeats-dead-connection',
      title: 'Heartbeats, Ping/Pong Frames & Dead Socket Detection',
      description: 'Why TCP sockets silently freeze without close events, client-server ping/pong heartbeats, timeout windows, and health checks.',
      subtopics: [
        { id: 'half-open-connection-silent-drops', title: 'Half-Open TCP Sockets: Detecting Ghost Connections When Wi-Fi Drops', conceptId: 'ws_half_open_sockets' },
        { id: 'ping-pong-frame-protocol', title: 'Protocol-Level Ping (0x9) and Pong (0xA) Frames vs Application-Level Heartbeats', conceptId: 'ws_ping_pong_frames' },
        { id: 'heartbeat-watchdog-timers', title: 'Implementing a Robust Client Watchdog Timer with Auto-Terminating Sockets', conceptId: 'ws_heartbeat_watchdog' },
      ],
    },
    {
      id: 'ws-auto-reconnection-backoff',
      title: 'Exponential Backoff & Reconnection with Jitter',
      description: 'Client auto-reconnection algorithms, exponential backoff (delay * 2^attempt), adding randomized jitter, and offline message queueing.',
      subtopics: [
        { id: 'exponential-backoff-algorithm', title: 'Exponential Backoff: Preventing Server Thundering Herd on Restart', conceptId: 'ws_exponential_backoff' },
        { id: 'randomized-jitter-smoothing', title: 'Adding Full Jitter (Math.random() * backoff) to Decouple Client Reconnection Spikes', conceptId: 'ws_jitter_smoothing' },
        { id: 'offline-message-buffer-queue', title: 'Buffering Unsent Messages in Memory/IndexedDB During Disconnections', conceptId: 'ws_offline_message_queue' },
      ],
    },
    {
      id: 'ws-scaling-redis-pubsub',
      title: 'Horizontal WebSocket Scaling with Redis Pub/Sub',
      description: 'Why stateful WebSockets cannot scale with simple round-robin, sticky sessions vs Redis Pub/Sub message broker broadcasting across servers.',
      subtopics: [
        { id: 'stateful-connection-problem', title: 'The Scalability Challenge: Socket Instances Bound to Specific Server Memory', conceptId: 'ws_stateful_scaling' },
        { id: 'redis-pubsub-adapter-architecture', title: 'Redis Pub/Sub Architecture: Relaying Socket Messages Across Server Clusters', conceptId: 'ws_redis_pubsub' },
        { id: 'cross-site-websocket-hijacking-cswsh', title: 'Security: Cross-Site WebSocket Hijacking (CSWSH) & Validating Origin Headers', conceptId: 'ws_cswsh_security' },
      ],
    },
  ],

  // Webhooks: 8 Topics
  webhooks: [
    {
      id: 'webhooks-architecture-vs-polling',
      title: 'Webhook Architecture: Event-Driven Push vs Polling',
      description: 'Push-based webhook notifications vs HTTP polling vs WebSockets, webhook provider lifecycle, and decoupled microservice communication.',
      subtopics: [
        { id: 'push-vs-pull-architecture', title: 'Reverse APIs: Why Webhooks Are Server-to-Server Inverted HTTP POST Requests', conceptId: 'webhooks_push_vs_pull' },
        { id: 'producer-consumer-contract', title: 'Event Schemas: Standard Event Wrappers ({ event, id, timestamp, data })', conceptId: 'webhooks_event_schemas' },
        { id: 'polling-inefficiency-costs', title: 'Resource Conservation: Eliminating 99% of Wasted Empty Polling Requests', conceptId: 'webhooks_polling_waste' },
      ],
    },
    {
      id: 'webhooks-hmac-signature-verification',
      title: 'HMAC Signatures & Cryptographic Payload Verification',
      description: 'X-Hub-Signature-256 header, crypto.createHmac("sha256", secret), timing-safe comparisons (crypto.timingSafeEqual), and replay defenses.',
      subtopics: [
        { id: 'hmac-sha256-calculation', title: 'HMAC-SHA256: Hashing the Raw Raw-Body String with Shared Webhook Secret', conceptId: 'webhooks_hmac_calculation' },
        { id: 'timing-attacks-timingsafeequal', title: 'Preventing Timing Attacks: crypto.timingSafeEqual vs Standard Equality (===)', conceptId: 'webhooks_timing_safe_equal' },
        { id: 'raw-body-parsing-pitfall', title: 'The Raw Body Trap: Why bodyParser.json() Breaks Signature Verification', conceptId: 'webhooks_raw_body_trap' },
      ],
    },
    {
      id: 'webhooks-delivery-retries-idempotency',
      title: 'Delivery Guarantees, Retries & Idempotency Keys',
      description: 'At-least-once delivery guarantees, exponential retries, Dead Letter Queues (DLQ), and consumer deduplication with idempotency keys.',
      subtopics: [
        { id: 'at-least-once-delivery-reality', title: 'Why Webhook Duplicates Are Inevitable Under At-Least-Once Delivery', conceptId: 'webhooks_at_least_once' },
        { id: 'idempotency-key-deduplication', title: 'Consumer Idempotency: Recording Processed Event IDs in Atomic Redis/SQL Transactions', conceptId: 'webhooks_idempotency_table' },
        { id: 'exponential-retry-schedules-dlq', title: 'Exponential Retry Schedules & Routing Poison Messages to Dead Letter Queues', conceptId: 'webhooks_dlq_retries' },
      ],
    },
    {
      id: 'webhooks-async-processing-queues',
      title: 'Asynchronous Worker Processing & Queue Offloading',
      description: 'Responding with HTTP 200 OK within 500ms, pushing payload to message queues (SQS, BullMQ, RabbitMQ), and background worker processing.',
      subtopics: [
        { id: 'fast-200-ok-acknowledgement', title: 'The 500ms Rule: Immediate Acknowledgment to Prevent Upstream Retry Storms', conceptId: 'webhooks_fast_ack' },
        { id: 'bullmq-sqs-job-enqueuing', title: 'Decoupling Ingestion from Execution via Background Queue Workers', conceptId: 'webhooks_queue_workers' },
        { id: 'local-tunnel-development', title: 'Local Webhook Development: Ngrok, Cloudflare Tunnels & Webhook Simulators', conceptId: 'webhooks_local_tunnels' },
      ],
    },
  ],

  // Web Performance: 12 Topics
  'web-performance': [
    {
      id: 'perf-core-web-vitals-overview',
      title: 'Core Web Vitals: 75th Percentile User Experience',
      description: 'The Google Core Web Vitals standard: Largest Contentful Paint (LCP), Interaction to Next Paint (INP), Cumulative Layout Shift (CLS), and RUM.',
      subtopics: [
        { id: 'cwv-75th-percentile-metric', title: 'Field Data vs Lab Data: Measuring the 75th Percentile of Real User Visits', conceptId: 'perf_cwv_75th_percentile' },
        { id: 'crux-report-and-lighthouse', title: 'Chrome User Experience Report (CrUX) vs Synthetic Lighthouse Audits', conceptId: 'perf_crux_vs_lighthouse' },
        { id: 'web-vitals-javascript-library', title: 'Instrumentation: Capturing In-Flight Vitals via the web-vitals JavaScript API', conceptId: 'perf_web_vitals_lib' },
      ],
    },
    {
      id: 'perf-largest-contentful-paint-lcp',
      title: 'Largest Contentful Paint (LCP): Breakdown & Sub-Parts',
      description: 'The 4 LCP sub-parts: TTFB, Resource Load Delay, Resource Load Time, Element Render Delay (< 2.5s good threshold), and hero element optimization.',
      subtopics: [
        { id: 'lcp-four-subparts-breakdown', title: 'Deconstructing LCP: TTFB, Resource Delay, Load Duration, Render Delay', conceptId: 'perf_lcp_subparts' },
        { id: 'hero-image-fetchpriority-preload', title: 'Optimizing the LCP Hero Image: fetchpriority="high" & Preloading', conceptId: 'perf_lcp_hero_image' },
        { id: 'eliminating-client-render-delay', title: 'Server-Side Rendering (SSR) vs CSR for Immediate LCP Candidate Paint', conceptId: 'perf_lcp_ssr_render' },
      ],
    },
    {
      id: 'perf-interaction-to-next-paint-inp',
      title: 'Interaction to Next Paint (INP): Input Responsiveness',
      description: 'Replacing FID with INP (< 200ms), Input Delay, Processing Duration, Presentation Delay, long tasks (> 50ms), and scheduler.yield().',
      subtopics: [
        { id: 'inp-three-phases-breakdown', title: 'INP Anatomy: Input Delay + Processing Time + Presentation (Frame Render) Delay', conceptId: 'perf_inp_phases' },
        { id: 'long-tasks-and-tbt', title: 'Breaking Long Tasks (> 50ms): Yielding to the Main Thread via scheduler.yield()', conceptId: 'perf_long_tasks_yield' },
        { id: 'event-listener-micro-optimizations', title: 'Optimizing Event Handlers: Offloading Heavy Computations to Web Workers', conceptId: 'perf_inp_workers' },
      ],
    },
    {
      id: 'perf-cumulative-layout-shift-cls',
      title: 'Cumulative Layout Shift (CLS): Session Windows & Stability',
      description: 'CLS calculation (impact fraction * distance fraction < 0.1), maximum session window with 1-second gap, reserving dimensions, and web fonts.',
      subtopics: [
        { id: 'cls-session-window-math', title: 'CLS Mathematics: Impact Fraction * Distance Fraction in Session Windows', conceptId: 'perf_cls_math' },
        { id: 'reserving-aspect-ratio-space', title: 'Reserving Dimension Space: aspect-ratio and width/height HTML Attributes', conceptId: 'perf_cls_aspect_ratio' },
        { id: 'font-swapping-layout-shifts', title: 'Font Metric Overrides: size-adjust, ascent-override to Prevent FOUT Shifts', conceptId: 'perf_cls_font_overrides' },
      ],
    },
    {
      id: 'perf-bundle-optimization-treeshaking',
      title: 'Bundle Optimization: Tree-Shaking & Dead Code Elimination',
      description: 'ES Module static analysis, sideEffects: false in package.json, avoiding barrel file bloat, dynamic imports, and bundle analyzers.',
      subtopics: [
        { id: 'tree-shaking-static-esm', title: 'How Tree-Shaking Works: Static ES Module Graphs vs CommonJS Dynamic Exports', conceptId: 'perf_treeshaking_esm' },
        { id: 'sideeffects-false-package-json', title: 'The sideEffects: false Field: Permitting Bundlers to Prune Unused Submodules', conceptId: 'perf_sideeffects_flag' },
        { id: 'barrel-file-import-cost', title: 'Barrel File Inefficiencies: Why importing { Button } Pulls Entire Monoliths', conceptId: 'perf_barrel_file_bloat' },
      ],
    },
    {
      id: 'perf-memory-leaks-heap-profiling',
      title: 'Memory Leaks & Chrome DevTools Heap Snapshots',
      description: 'Taking heap snapshots, shallow size vs retained size, finding detached DOM trees, identifying uncleaned closures, and allocation instrumentation.',
      subtopics: [
        { id: 'shallow-size-vs-retained-size', title: 'Shallow Size (Object Itself) vs Retained Size (Reachable Graph Memory)', conceptId: 'perf_shallow_vs_retained' },
        { id: 'hunting-detached-dom-trees', title: 'Identifying Detached DOM Elements Still Referenced by JavaScript Closures', conceptId: 'perf_detached_dom_leak' },
        { id: 'allocation-timeline-profiling', title: 'Recording Allocation Timelines to Catch Memory Leaks in Real Time', conceptId: 'perf_allocation_timeline' },
      ],
    },
  ],
};

console.log('Loaded CURRICULUM_DEFINITIONS_PART3.');
