export const CURRICULUM_DEFINITIONS_PART2 = {
  // Advanced React: 12 Topics
  'advanced-react': [
    {
      id: 'adv-react-fiber-architecture',
      title: 'React Fiber Architecture: Fiber Nodes & Child-Sibling Pointers',
      description: 'Fiber node data structure (child, sibling, return), incremental rendering, interrupting work, and scheduling priorities.',
      subtopics: [
        { id: 'fiber-node-data-structure', title: 'Fiber Node Internal Pointers: child, sibling, return & memoizedState', conceptId: 'adv_react_fiber_node' },
        { id: 'reconciliation-time-slicing', title: 'Incremental Rendering & Cooperative Scheduling with requestIdleCallback', conceptId: 'adv_react_time_slicing' },
        { id: 'work-in-progress-fiber-tree', title: 'Double Buffering: The Current Tree vs Work-In-Progress (WIP) Fiber Tree', conceptId: 'adv_react_double_buffering' },
      ],
    },
    {
      id: 'adv-react-render-commit-phases',
      title: 'The Work Loop: Render Phase vs Commit Phase',
      description: 'workLoopSync vs workLoopConcurrent, asynchronous interruptible render phase, and synchronous uninterruptible commit phase.',
      subtopics: [
        { id: 'render-phase-interruptible', title: 'Render Phase: Pure Component Invocation & Effect List Accumulation', conceptId: 'adv_react_render_phase' },
        { id: 'commit-phase-dom-mutations', title: 'Commit Phase: Before Mutation, Mutation (DOM Insertions), Layout Lifecycle', conceptId: 'adv_react_commit_phase' },
        { id: 'passive-effects-flush', title: 'Passive Effects Scheduling: Flushing useEffect Post-Paint', conceptId: 'adv_react_passive_flush' },
      ],
    },
    {
      id: 'adv-react-concurrent-features',
      title: 'Concurrent React: useTransition & useDeferredValue',
      description: 'Concurrent rendering, priority lanes (SyncLane, TransitionLane), startTransition non-blocking updates, and useDeferredValue.',
      subtopics: [
        { id: 'usetransition-nonblocking-updates', title: 'startTransition: Downgrading Priority to TransitionLane for Snappy Inputs', conceptId: 'adv_react_usetransition' },
        { id: 'usedeferredvalue-stale-render', title: 'useDeferredValue: Decoupling High-Frequency Input from Heavy List Rendering', conceptId: 'adv_react_usedeferredvalue' },
        { id: 'priority-lane-system', title: 'React 18/19 Priority Lane Model: 31-bit Binary Priority Masks', conceptId: 'adv_react_lanes' },
      ],
    },
    {
      id: 'adv-react-automatic-batching',
      title: 'Automatic State Batching & flushSync Escapes',
      description: 'Automatic batching across promises, timeouts, native event listeners in React 18+, and escaping batching with flushSync.',
      subtopics: [
        { id: 'automatic-batching-async', title: 'Automatic Batching in Microtasks, Promises & setTimeout Handlers', conceptId: 'adv_react_batching' },
        { id: 'flushsync-forced-synchronous', title: 'flushSync: Forcing Immediate Synchronous DOM Updates for Measurements', conceptId: 'adv_react_flushsync' },
        { id: 'batching-reconciliation-gains', title: 'Performance Impact: Consolidating Multiple setState Calls into Single Pass', conceptId: 'adv_react_batching_perf' },
      ],
    },
    {
      id: 'adv-react-server-components-rsc',
      title: 'React Server Components (RSC) vs Client Components',
      description: 'RSC mental model, zero client bundle cost, the "use client" directive boundary, streaming serialization, and async server components.',
      subtopics: [
        { id: 'rsc-mental-model-boundaries', title: 'The RSC Paradigm: Components Executing Exclusively on the Server', conceptId: 'adv_react_rsc_model' },
        { id: 'use-client-boundary-contract', title: 'The "use client" Directive: Marking Client Boundary Modules Not Components', conceptId: 'adv_react_use_client' },
        { id: 'rsc-payload-wire-format', title: 'The RSC Payload Stream Format: Emitting Virtual DOM Elements Over HTTP', conceptId: 'adv_react_rsc_wire_format' },
      ],
    },
    {
      id: 'adv-react-suspense-streaming-ssr',
      title: 'Suspense Architecture & Streaming Server-Side Rendering',
      description: 'Suspense data fetching boundaries, thrown Promises in render, Selective Hydration, and progressive HTML streaming via pipeToNodeWritable.',
      subtopics: [
        { id: 'suspense-thrown-promises', title: 'How Suspense Catches Thrown Promises and Suspends Subtree Rendering', conceptId: 'adv_react_suspense_mechanism' },
        { id: 'streaming-ssr-chunks', title: 'Streaming SSR: Sending HTML Skeletons Instantly with Inlined Replacement Scripts', conceptId: 'adv_react_streaming_ssr' },
        { id: 'selective-hydration-priority', title: 'Selective Hydration: Prioritizing Interactive Subtrees on User Click', conceptId: 'adv_react_selective_hydration' },
      ],
    },
    {
      id: 'adv-react-19-compiler-actions',
      title: 'React 19 Innovations: React Compiler & Server Actions',
      description: 'React Forget Compiler (automatic memoization without useMemo/useCallback), Server Actions, useActionState, useFormStatus, and useOptimistic.',
      subtopics: [
        { id: 'react-compiler-automatic-memo', title: 'The React Compiler: Static Analysis & Automatic Fine-Grained Memoization', conceptId: 'adv_react_compiler' },
        { id: 'server-actions-progressive-enhancement', title: 'Server Actions: "use server" Form Submissions & Progressive Enhancement', conceptId: 'adv_react_server_actions' },
        { id: 'useactionstate-useoptimistic', title: 'React 19 Action Hooks: useActionState, useOptimistic & useFormStatus', conceptId: 'adv_react_19_hooks' },
      ],
    },
    {
      id: 'adv-react-profiler-flamegraphs',
      title: 'Performance Profiling: Profiler API & Flamegraphs',
      description: '<Profiler onRender>, identifying redundant renders, analyzing DevTools flamegraph commit tracks, and measuring actual vs base duration.',
      subtopics: [
        { id: 'react-profiler-api-callbacks', title: '<Profiler id onRender>: Capturing actualDuration & baseDuration Metrics', conceptId: 'adv_react_profiler_api' },
        { id: 'reading-react-devtools-flamegraphs', title: 'Interpreting DevTools Flamegraphs: Identifying Render Waste & Heavy Subtrees', conceptId: 'adv_react_flamegraphs' },
        { id: 'why-did-you-render-tooling', title: 'Automated Render Auditing with why-did-you-render in CI', conceptId: 'adv_react_wdyr' },
      ],
    },
  ],

  // Redux: 10 Topics
  redux: [
    {
      id: 'redux-flux-architecture',
      title: 'Flux Architecture & Unidirectional Data Flow Principles',
      description: 'Action -> Dispatcher -> Store -> View unidirectional flow, eliminating circular state dependencies, and predictability invariants.',
      subtopics: [
        { id: 'flux-vs-mvc-patterns', title: 'Flux vs Bi-directional MVC: Eliminating Cascading State Updates', conceptId: 'redux_flux_vs_mvc' },
        { id: 'three-principles-of-redux', title: 'The Three Principles: Single Source of Truth, State Read-Only, Pure Reducers', conceptId: 'redux_three_principles' },
        { id: 'store-dispatch-subscribe', title: 'Core Store Contract: getState(), dispatch(action), and subscribe(listener)', conceptId: 'redux_store_contract' },
      ],
    },
    {
      id: 'redux-pure-reducers-normalization',
      title: 'Pure Reducers, State Immutability & Normalization',
      description: 'Deterministic pure reducer functions (state, action) => newState, shallow copying objects/arrays, and normalized state entities (byId, allIds).',
      subtopics: [
        { id: 'pure-reducer-contract', title: 'Reducer Invariants: Zero Side Effects, No Date.now(), No Math.random()', conceptId: 'redux_pure_reducers' },
        { id: 'state-normalization-patterns', title: 'Entity Normalization: Relational State Structures (byId, allIds) vs Deep Nesting', conceptId: 'redux_normalization' },
        { id: 'immutable-update-patterns', title: 'Immutable Updating Patterns with Spread Operators and Array Methods', conceptId: 'redux_immutable_updates' },
      ],
    },
    {
      id: 'redux-middleware-pipeline',
      title: 'Redux Middleware Pipeline: Currying & Execution Order',
      description: 'The middleware signature store => next => action, chaining middlewares, intercepting actions, and short-circuiting dispatches.',
      subtopics: [
        { id: 'middleware-currying-signature', title: 'Deconstructing Middleware: const middleware = store => next => action => {}', conceptId: 'redux_middleware_currying' },
        { id: 'action-interception-chain', title: 'Middleware Pipeline Execution: Calling next(action) vs store.dispatch(action)', conceptId: 'redux_middleware_chain' },
        { id: 'building-custom-logger-crash', title: 'Building Custom Logging & Crash Reporting Middlewares from Scratch', conceptId: 'redux_custom_middleware' },
      ],
    },
    {
      id: 'redux-thunk-async-flows',
      title: 'Redux Thunk & Asynchronous Action Creators',
      description: 'Thunk pattern (returning a function dispatch => {}), dispatching pending/fulfilled/rejected actions, and handling async side effects.',
      subtopics: [
        { id: 'thunk-pattern-mechanics', title: 'What is a Thunk? Delaying Evaluation by Returning a Dispatching Function', conceptId: 'redux_thunk_pattern' },
        { id: 'async-action-lifecycle', title: 'Managing Asynchronous Lifecycle States: Loading, Error & Success Dispatches', conceptId: 'redux_async_lifecycle' },
        { id: 'thunk-with-extra-argument', title: 'Dependency Injection in Thunks via withExtraArgument (APIs, Analytics)', conceptId: 'redux_thunk_di' },
      ],
    },
    {
      id: 'redux-reselect-memoized-selectors',
      title: 'Memoized Selectors with Reselect (createSelector)',
      description: 'Computing derived state efficiently, input selectors, output combiners, memoization cache size (default 1), and preventing rerenders.',
      subtopics: [
        { id: 'createselector-memoization-cache', title: 'createSelector: Input Equality Checks & Avoiding Expensive Computations', conceptId: 'redux_reselect_cache' },
        { id: 'composed-selectors-chains', title: 'Composing Multi-Tier Selector Chains for Granular Component Subscriptions', conceptId: 'redux_composed_selectors' },
        { id: 'per-instance-memoized-selectors', title: 'Factory Selectors for Multi-Instance Components Sharing Props', conceptId: 'redux_factory_selectors' },
      ],
    },
    {
      id: 'redux-devtools-time-travel',
      title: 'Redux DevTools & Time-Travel Debugging Protocol',
      description: 'DevTools extension integration, action history recording, state snapshots, time-travel scrubbing, and action replay mechanics.',
      subtopics: [
        { id: 'redux-devtools-instrumentation', title: 'Connecting Redux DevTools: composeWithDevTools & Sanitizing Sensitive State', conceptId: 'redux_devtools_setup' },
        { id: 'time-travel-scrubbing-replay', title: 'Time-Travel Mechanics: Re-applying Actions to Base State Deterministically', conceptId: 'redux_time_travel' },
        { id: 'action-export-reproduction', title: 'Exporting Production Action Traces to Replay Complex Customer Bugs Locally', conceptId: 'redux_action_replay' },
      ],
    },
  ],

  // Redux Toolkit: 10 Topics
  'redux-toolkit': [
    {
      id: 'rtk-philosophy-boilerplate',
      title: 'RTK Core Architecture & Eliminating Boilerplate',
      description: 'Redux Toolkit design rationale, configureStore with sensible defaults, eliminating action type string constants, and package consolidation.',
      subtopics: [
        { id: 'rtk-vs-legacy-redux', title: 'RTK vs Vanilla Redux: Why RTK is the Official Modern Redux Standard', conceptId: 'rtk_vs_legacy' },
        { id: 'configurestore-composition', title: 'configureStore: Built-in Redux Thunk, DevTools & Immutability Middleware', conceptId: 'rtk_configure_store' },
        { id: 'serializable-state-invariants', title: 'The SerializableCheck Middleware: Warning on Non-Serializable State', conceptId: 'rtk_serializable_check' },
      ],
    },
    {
      id: 'rtk-createslice-immer',
      title: 'createSlice & Immer Immutability Integration',
      description: 'Defining reducers, action creators generation, Immer proxy drafts (mutative syntax creating immutable state), and extraReducers builder callback.',
      subtopics: [
        { id: 'createslice-reducer-actions', title: 'createSlice: Unifying Action Types, Creators & Reducers in One Definition', conceptId: 'rtk_createslice' },
        { id: 'immer-proxy-draft-mutations', title: 'How Immer Works: Writing state.count++ Without Violating Immutability', conceptId: 'rtk_immer_proxies' },
        { id: 'extrareducers-builder-syntax', title: 'Listening to External Actions via extraReducers (builder.addCase)', conceptId: 'rtk_extra_reducers' },
      ],
    },
    {
      id: 'rtk-createasyncthunk',
      title: 'createAsyncThunk & Asynchronous Promise Lifecycles',
      description: 'Automated pending/fulfilled/rejected action types, payload creators, unwrap() helper, aborting thunks with signal, and rejectWithValue.',
      subtopics: [
        { id: 'createasyncthunk-lifecycles', title: 'Tri-State Action Dispatch: pending, fulfilled, and rejected Lifecycles', conceptId: 'rtk_asyncthunk_lifecycles' },
        { id: 'rejectwithvalue-custom-errors', title: 'Handling Custom API Error Payloads with thunkAPI.rejectWithValue()', conceptId: 'rtk_reject_with_value' },
        { id: 'aborting-thunks-with-signals', title: 'Cancellation: Reading thunkAPI.signal to Abort In-Flight Fetch Requests', conceptId: 'rtk_thunk_cancellation' },
      ],
    },
    {
      id: 'rtk-query-core-architecture',
      title: 'RTK Query (RTKQ): Declarative Data Fetching & Caching',
      description: 'createApi, fetchBaseQuery, endpoints builder (queries vs mutations), auto-generated React hooks, and centralized API definitions.',
      subtopics: [
        { id: 'createapi-fetchbasequery', title: 'createApi Configuration: baseUrl, prepareHeaders & Endpoint Definitions', conceptId: 'rtk_createapi' },
        { id: 'rtk-query-auto-hooks', title: 'Auto-Generated Hooks: useGetPostsQuery vs useAddPostMutation Lifecycles', conceptId: 'rtk_auto_hooks' },
        { id: 'rtk-query-cache-deduplication', title: 'Request Deduplication & Cache Subscription Lifetime Management', conceptId: 'rtk_query_cache' },
      ],
    },
    {
      id: 'rtk-query-cache-invalidation-tags',
      title: 'RTK Query Automated Cache Invalidation via Tags',
      description: 'tagTypes, providesTags (item tags, list tags), invalidatesTags on mutations, and automated targeted cache refetching.',
      subtopics: [
        { id: 'providestags-invalidatestags-model', title: 'Tag Architecture: Mapping Query Results to Cache Tags', conceptId: 'rtk_tag_architecture' },
        { id: 'list-vs-item-tag-invalidation', title: 'The { type: "Post", id: "LIST" } Pattern for Item vs Collection Refetches', conceptId: 'rtk_list_item_tags' },
        { id: 'manual-cache-manipulation', title: 'Manual Cache Updates with api.util.updateQueryData (Pessimistic vs Optimistic)', conceptId: 'rtk_manual_cache' },
      ],
    },
    {
      id: 'rtk-query-optimistic-updates',
      title: 'Optimistic UI Updates & Cache Rollbacks in RTK Query',
      description: 'onQueryStarted lifecycle hook, draft cache patching via updateQueryData, queryFulfilled promise, and error rollback catches.',
      subtopics: [
        { id: 'onquerystarted-draft-patching', title: 'Immediate UI Feedback: Patching RTKQ Cache Before Network Finishes', conceptId: 'rtk_optimistic_onquerystarted' },
        { id: 'patchresult-undo-rollback', title: 'Rollback Safety: Invoking patchResult.undo() on Network Failures', conceptId: 'rtk_rollback_undo' },
        { id: 'streaming-websocket-updates', title: 'Real-Time Streaming Updates: onCacheEntryAdded & WebSocket Feeds', conceptId: 'rtk_streaming_cache' },
      ],
    },
  ],

  // TanStack Query: 10 Topics
  'tanstack-query': [
    {
      id: 'tanstack-query-core-mental-model',
      title: 'TanStack Query: Server State vs Client State Paradigm',
      description: 'Why server state is asynchronous, shared, and out-of-date; QueryClientProvider, QueryClient defaults, and query lifecycle states.',
      subtopics: [
        { id: 'server-state-vs-client-state', title: 'Deconstructing State: Why Redux/Zustand is Ill-Suited for Server State', conceptId: 'tanstack_server_vs_client' },
        { id: 'queryclient-configuration', title: 'QueryClient Architecture: Global StaleTime, Retry Backoff & Mutations', conceptId: 'tanstack_queryclient' },
        { id: 'query-lifecycle-states', title: 'Query Statuses: isPending vs isFetching vs isSuccess vs isError', conceptId: 'tanstack_query_statuses' },
      ],
    },
    {
      id: 'tanstack-query-staletime-vs-gctime',
      title: 'The Great Distinction: staleTime vs gcTime (cacheTime)',
      description: 'staleTime (how long data is considered fresh) vs gcTime (how long inactive data remains in memory), and background revalidation triggers.',
      subtopics: [
        { id: 'staletime-freshness-window', title: 'staleTime: When Does Query Trigger Background Refetching on Window Focus?', conceptId: 'tanstack_staletime' },
        { id: 'gctime-garbage-collection', title: 'gcTime: Garbage Collection Cleanup of Inactive Cache Entries', conceptId: 'tanstack_gctime' },
        { id: 'refetch-triggers-matrix', title: 'Automatic Refetching Triggers: refetchOnWindowFocus, Reconnect & Mount', conceptId: 'tanstack_refetch_triggers' },
      ],
    },
    {
      id: 'tanstack-query-keys-hierarchies',
      title: 'Query Keys Hierarchies & Targeted Invalidation',
      description: 'Query keys as arrays ([\"todos\", \"detail\", id]), query key factories, hierarchical matching, queryClient.invalidateQueries, and partial matching.',
      subtopics: [
        { id: 'query-key-factories', title: 'Query Key Factory Pattern for Maintainable Multi-Key Architectures', conceptId: 'tanstack_key_factories' },
        { id: 'hierarchical-partial-matching', title: 'Hierarchical Invalidation: invalidating ["todos"] Matches All Todo Sub-Queries', conceptId: 'tanstack_key_invalidation' },
        { id: 'exact-query-matching', title: 'Exact Key Invalidation with { exact: true } vs Fuzzy Invalidation', conceptId: 'tanstack_exact_matching' },
      ],
    },
    {
      id: 'tanstack-query-usemutation-optimistic',
      title: 'useMutation & Zero-Latency Optimistic UI Updates',
      description: 'useMutation lifecycle (onMutate, onSuccess, onError, onSettled), snapshotting previous cache, cancelQueries, and rolling back.',
      subtopics: [
        { id: 'usemutation-lifecycle-hooks', title: 'onMutate Execution Context: Passing Context Payloads to onError and onSettled', conceptId: 'tanstack_mutation_context' },
        { id: 'optimistic-ui-rollback-pattern', title: 'The Complete Optimistic Pattern: cancelQueries -> snapshot -> setQueryData -> rollback', conceptId: 'tanstack_optimistic_pattern' },
        { id: 'pessimistic-invalidation-flow', title: 'Pessimistic Invalidation: Refetching Active Queries on Mutation Success', conceptId: 'tanstack_pessimistic_invalidation' },
      ],
    },
    {
      id: 'tanstack-query-pagination-infinite',
      title: 'Pagination & Infinite Queries (useInfiniteQuery)',
      description: 'Paginated queries with placeholderData: keepPreviousData, useInfiniteQuery, getNextPageParam, flatMap page unwrapping, and virtualized lists.',
      subtopics: [
        { id: 'keeppreviousdata-smooth-pagination', title: 'placeholderData: keepPreviousData Eliminating Loading Spinners on Page Change', conceptId: 'tanstack_pagination' },
        { id: 'useinfinitequery-pages-structure', title: 'useInfiniteQuery: getNextPageParam & Bidirectional Page Caching', conceptId: 'tanstack_infinite_query' },
        { id: 'virtualized-list-integration', title: 'Connecting Infinite Queries to Virtualized Scrolling (react-virtual / TanStack Virtual)', conceptId: 'tanstack_virtualization' },
      ],
    },
    {
      id: 'tanstack-query-prefetching-hydration',
      title: 'Prefetching, Suspense & SSR Dehydration/Hydration',
      description: 'queryClient.prefetchQuery, hover prefetching, useSuspenseQuery, HydrationBoundary, dehydrate(), and seamless SSR-to-client handoff.',
      subtopics: [
        { id: 'prefetchquery-hover-optimizations', title: 'Pre-caching on Link Hover & Route Intention Detection', conceptId: 'tanstack_prefetching' },
        { id: 'dehydrate-hydrate-ssr-boundary', title: 'Server-Side Rendering: dehydrate(queryClient) & <HydrationBoundary>', conceptId: 'tanstack_ssr_dehydration' },
        { id: 'usesuspensequery-concurrent-react', title: 'useSuspenseQuery: Native Integration with React 18/19 Suspense Boundaries', conceptId: 'tanstack_usesuspensequery' },
      ],
    },
  ],
};

console.log('Loaded CURRICULUM_DEFINITIONS_PART2.');
