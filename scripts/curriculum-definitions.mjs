// Complete 21-Track Official Curriculum Taxonomy
export const CURRICULUM_DEFINITIONS = {
  // CSS: 25 Official Topics
  css: [
    {
      id: 'css-box-model',
      title: 'CSS Box Model, Sizing & Margin Collapsing',
      description: 'Content-box vs border-box, padding, border, margin calculations, and vertical margin collapsing rules.',
      subtopics: [
        { id: 'box-sizing-border-box', title: 'box-sizing: border-box vs content-box Sizing Mathematics', conceptId: 'css_box_sizing' },
        { id: 'margin-collapsing-rules', title: 'Margin Collapsing: Sibling, Parent-Child & Empty Block Rules', conceptId: 'css_margin_collapsing' },
        { id: 'outline-vs-border', title: 'Border vs Outline & outline-offset for Accessible Focus Rings', conceptId: 'css_outline_border' },
      ],
    },
    {
      id: 'css-specificity-cascade',
      title: 'Cascade Algorithm, Specificity Math & Importance',
      description: 'The 4-tuple specificity calculation (Inline, ID, Class, Element), !important hazards, and the cascade sorting algorithm.',
      subtopics: [
        { id: 'specificity-tuple-math', title: 'The (0, 0, 0, 0) Specificity Weight Formula', conceptId: 'css_specificity_math' },
        { id: 'cascade-sorting-order', title: 'Cascade Resolution: Origin, Importance, Scope & Order of Appearance', conceptId: 'css_cascade_resolution' },
        { id: 'where-zero-specificity', title: ':where() Zero Specificity vs :is() Highest Specificity', conceptId: 'css_where_is_specificity' },
      ],
    },
    {
      id: 'css-flexbox-architecture',
      title: 'Flexbox Architecture, Alignment & Growth Dynamics',
      description: 'Main axis vs cross axis, flex-grow, flex-shrink, flex-basis physics, gap spacing, and alignment properties.',
      subtopics: [
        { id: 'main-cross-axes', title: 'Axes Orientation: flexDirection, justify-content & align-items', conceptId: 'css_flex_axes' },
        { id: 'flex-basis-grow-shrink', title: 'Flex Allocation Math: flex-grow, flex-shrink & flex-basis', conceptId: 'css_flex_dynamics' },
        { id: 'flex-gap-wrapping', title: 'Multi-Line Wrapping & gap Property Performance', conceptId: 'css_flex_gap' },
      ],
    },
    {
      id: 'css-grid-layout',
      title: 'CSS Grid Layout & Two-Dimensional Composition',
      description: 'Grid tracks, fractional units (fr), minmax(), auto-fill vs auto-fit, named grid areas, and implicit vs explicit grids.',
      subtopics: [
        { id: 'grid-tracks-fr-units', title: 'Explicit Grids: grid-template-columns, Rows & fr Sizing', conceptId: 'css_grid_tracks' },
        { id: 'auto-fill-vs-auto-fit', title: 'Responsive Grids Without Media Queries: auto-fill vs auto-fit minmax()', conceptId: 'css_grid_autofill' },
        { id: 'grid-template-areas', title: 'Semantic Two-Dimensional Layouts with grid-template-areas', conceptId: 'css_grid_areas' },
      ],
    },
    {
      id: 'css-positioning-contexts',
      title: 'CSS Positioning Modes & Containing Blocks',
      description: 'Static, relative, absolute, fixed, sticky positioning, containing blocks, and viewport anchoring mechanics.',
      subtopics: [
        { id: 'containing-block-resolution', title: 'Identifying the Containing Block for Absolute & Fixed Elements', conceptId: 'css_containing_block' },
        { id: 'sticky-positioning-mechanics', title: 'position: sticky Constraints, Scroll Containers & Overflow Gotchas', conceptId: 'css_sticky_positioning' },
        { id: 'fixed-under-transforms', title: 'How transform, filter & perspective Break position: fixed', conceptId: 'css_fixed_transform_trap' },
      ],
    },
    {
      id: 'css-stacking-context-zindex',
      title: 'Stacking Contexts, Paint Order & z-index Mastery',
      description: 'Root stacking context, triggers for new stacking contexts (opacity, transform, filter, will-change), and z-index isolation.',
      subtopics: [
        { id: 'stacking-context-triggers', title: 'The 12 Triggers That Spawn a New Stacking Context in CSS', conceptId: 'css_stacking_triggers' },
        { id: 'paint-order-within-context', title: 'The 7-Layer Paint Order Algorithm Within a Stacking Context', conceptId: 'css_paint_order' },
        { id: 'isolation-isolate', title: 'Encapsulating Stacking Layers with isolation: isolate', conceptId: 'css_isolation_isolate' },
      ],
    },
    {
      id: 'css-custom-properties',
      title: 'CSS Custom Properties (Variables) & Dynamic Theming',
      description: 'Custom property declaration (--*), var() fallbacks, inheritance, scoping, runtime JavaScript manipulation, and theme tokens.',
      subtopics: [
        { id: 'var-scoping-inheritance', title: 'Cascade Inheritance & Dynamic Scoping of CSS Variables', conceptId: 'css_var_scoping' },
        { id: 'fallback-chains-empty', title: 'Multi-Tier Fallbacks: var(--primary, var(--fallback, #6366f1))', conceptId: 'css_var_fallbacks' },
        { id: 'js-css-variable-mutation', title: 'Runtime Theming via getComputedStyle & setProperty', conceptId: 'css_var_js_api' },
      ],
    },
    {
      id: 'css-responsive-media-queries',
      title: 'Responsive Design & Media Queries Level 4/5',
      description: 'Mobile-first breakpoints, range syntax (@media (width >= 768px)), prefers-color-scheme, and prefers-reduced-motion.',
      subtopics: [
        { id: 'media-query-range-syntax', title: 'Modern Range Syntax: (width >= 600px) vs (min-width: 600px)', conceptId: 'css_mq_range' },
        { id: 'prefers-reduced-motion-a11y', title: 'Vestibular Accessibility: prefers-reduced-motion Standards', conceptId: 'css_reduced_motion' },
        { id: 'dark-mode-color-scheme', title: 'System-Adaptive Dark Mode with prefers-color-scheme & color-scheme', conceptId: 'css_color_scheme' },
      ],
    },
    {
      id: 'css-modern-colors',
      title: 'Modern Color Spaces: Display-P3, OKLCH & color-mix()',
      description: 'sRGB limitations, wide-gamut Display-P3, perceptually uniform OKLCH, relative color syntax, and programmatic color mixing.',
      subtopics: [
        { id: 'oklch-perceptual-uniformity', title: 'OKLCH Color Space: Lightness, Chroma, Hue Uniformity', conceptId: 'css_oklch' },
        { id: 'color-mix-relative-syntax', title: 'Dynamic Palette Generation with color-mix() & from keyword', conceptId: 'css_color_mix' },
        { id: 'wide-gamut-p3-media', title: 'Display-P3 High-Gamut Detection via @media (color-gamut: p3)', conceptId: 'css_wide_gamut' },
      ],
    },
    {
      id: 'css-typography-web-fonts',
      title: 'Web Typography, Variable Fonts & Font-Display',
      description: 'Font loading lifecycles, FOIT vs FOUT, font-display (swap, optional), variable font axes (wght, wdth, slnt), and size-adjust.',
      subtopics: [
        { id: 'font-display-strategies', title: 'font-display: swap vs optional vs block Performance Trade-offs', conceptId: 'css_font_display' },
        { id: 'variable-fonts-font-variation', title: 'Variable Fonts: font-variation-settings & Custom Axes', conceptId: 'css_variable_fonts' },
        { id: 'size-adjust-cls-prevention', title: 'Eliminating Layout Shift with size-adjust & ascent-override', conceptId: 'css_font_size_adjust' },
      ],
    },
    {
      id: 'css-transforms-3d',
      title: '2D & 3D CSS Transforms & Matrix Mathematics',
      description: 'Translate, rotate, scale, skew, matrix3d(), perspective, transform-origin, and GPU layer promotion.',
      subtopics: [
        { id: 'transform-matrix-compositing', title: '2D/3D Transforms, Hardware Acceleration & Compositor Layers', conceptId: 'css_transforms_gpu' },
        { id: 'perspective-transform-style', title: '3D Depth: perspective, transform-style: preserve-3d & backface-visibility', conceptId: 'css_perspective_3d' },
        { id: 'individual-transform-properties', title: 'Modern Independent Transform Properties (translate, rotate, scale)', conceptId: 'css_independent_transforms' },
      ],
    },
    {
      id: 'css-transitions-easing',
      title: 'Transitions, Bézier Curves & Performance Costs',
      description: 'Transition timing functions, cubic-bezier math, transition-delay, animating composite vs layout properties.',
      subtopics: [
        { id: 'cubic-bezier-physics', title: 'Cubic Bézier Physics & Custom Easing Timing Functions', conceptId: 'css_cubic_bezier' },
        { id: 'animatable-properties-cost', title: 'Composite-Only vs Paint vs Layout Trigger Properties', conceptId: 'css_anim_costs' },
        { id: 'transition-events-lifecycle', title: 'JavaScript Transition Events: transitionstart, transitionend, transitioncancel', conceptId: 'css_transition_events' },
      ],
    },
    {
      id: 'css-keyframe-animations',
      title: 'Keyframe Animations & Compositor Optimization',
      description: '@keyframes definitions, animation-fill-mode, animation-direction, will-change, and preventing main-thread lag.',
      subtopics: [
        { id: 'animation-fill-mode-direction', title: 'animation-fill-mode: forwards vs backwards vs both Guarantees', conceptId: 'css_fill_mode' },
        { id: 'will-change-memory-cost', title: 'will-change: transform Best Practices & Memory Overhead Limits', conceptId: 'css_will_change' },
        { id: 'animation-playback-control', title: 'Pausing & Scrubbing Animations via animation-play-state', conceptId: 'css_animation_state' },
      ],
    },
    {
      id: 'css-filters-blend-modes',
      title: 'Filter Effects, Backdrop Blurs & Blend Modes',
      description: 'filter functions (blur, brightness, drop-shadow), backdrop-filter glassmorphism, and mix-blend-mode compositing.',
      subtopics: [
        { id: 'drop-shadow-vs-box-shadow', title: 'filter: drop-shadow() on Transparent PNGs/SVGs vs box-shadow', conceptId: 'css_drop_shadow' },
        { id: 'backdrop-filter-glassmorphism', title: 'backdrop-filter: blur() GPU Stacking Context Mechanics', conceptId: 'css_backdrop_filter' },
        { id: 'mix-blend-mode-composition', title: 'mix-blend-mode: multiply, screen, overlay Blend Math', conceptId: 'css_blend_modes' },
      ],
    },
    {
      id: 'css-shapes-clip-path',
      title: 'Clipping Paths, Masks & CSS Shapes (shape-outside)',
      description: 'clip-path polygons and circles, SVG clipping paths, mask-image gradients, and shape-outside text wrapping.',
      subtopics: [
        { id: 'clip-path-polygons', title: 'clip-path: polygon(), circle(), path() Geometry Definition', conceptId: 'css_clip_path' },
        { id: 'shape-outside-text-wrap', title: 'shape-outside & shape-margin for Non-Rectangular Text Wrapping', conceptId: 'css_shape_outside' },
        { id: 'mask-image-alpha-luminance', title: 'CSS Masking: mask-image Alpha Channel Alpha vs Luminance Masks', conceptId: 'css_mask_image' },
      ],
    },
    {
      id: 'css-logical-properties',
      title: 'CSS Logical Properties & International Layouts',
      description: 'Physical (top/right/bottom/left) vs Logical (block/inline, start/end), writing-mode, and bidirectional design.',
      subtopics: [
        { id: 'block-inline-axes', title: 'Block vs Inline Dimensions: inline-size vs block-size', conceptId: 'css_logical_axes' },
        { id: 'logical-margins-padding', title: 'margin-inline, padding-block & border-inline-start Equivalents', conceptId: 'css_logical_spacing' },
        { id: 'writing-mode-orientations', title: 'writing-mode: vertical-rl, horizontal-tb for Global Typography', conceptId: 'css_writing_mode' },
      ],
    },
    {
      id: 'css-multi-column-layout',
      title: 'CSS Multi-Column Layout & Text Fragmentation',
      description: 'column-count, column-width, column-gap, column-rule, break-inside: avoid, and newspaper layout flows.',
      subtopics: [
        { id: 'column-count-and-width', title: 'Responsive Column Flow: column-width vs column-count Dynamics', conceptId: 'css_multicolumn' },
        { id: 'fragmentation-break-control', title: 'Preventing Awkward Breaks with break-inside: avoid and break-before', conceptId: 'css_breaks' },
        { id: 'column-span-headers', title: 'Spanning Headers Across Multi-Column Layouts with column-span: all', conceptId: 'css_column_span' },
      ],
    },
    {
      id: 'css-viewport-units-mobile',
      title: 'Modern Viewport Units: svh, lvh, dvh & Mobile Notches',
      description: 'Small, large, dynamic viewport units, mobile address bar collapsing, and env(safe-area-inset-*) notch padding.',
      subtopics: [
        { id: 'svh-lvh-dvh-mechanics', title: '100vh Mobile Jitter vs 100dvh Dynamic & 100svh Small Viewport Units', conceptId: 'css_dvh_svh' },
        { id: 'viewport-inline-block-units', title: 'vi and vb: Viewport Logical Axis Units', conceptId: 'css_viewport_logical' },
        { id: 'env-safe-area-insets', title: 'iPhone Notch & Island Optimization with env(safe-area-inset-top)', conceptId: 'css_env_safe_area' },
      ],
    },
    {
      id: 'css-scroll-snap-physics',
      title: 'CSS Scroll Snap & Pure CSS Carousels',
      description: 'scroll-snap-type, scroll-snap-align, scroll-padding, scroll-margin, and high-performance native carousel UX.',
      subtopics: [
        { id: 'scroll-snap-type-strict', title: 'scroll-snap-type: x mandatory vs proximity Physics', conceptId: 'css_scroll_snap_type' },
        { id: 'scroll-snap-align-stops', title: 'scroll-snap-align: start, center, end on Child Items', conceptId: 'css_scroll_snap_align' },
        { id: 'scroll-padding-headers', title: 'scroll-padding Offset for Sticky Headers & Floating Navbars', conceptId: 'css_scroll_padding' },
      ],
    },
    {
      id: 'css-print-paged-media',
      title: 'CSS Print Stylesheets & Paged Media (@media print)',
      description: '@media print, @page margins, page-break-inside, hiding interactive UI, and high-resolution PDF print exports.',
      subtopics: [
        { id: 'media-print-suppression', title: 'Stripping Navigation, Sidebars & Interactive Controls in Print', conceptId: 'css_print_suppression' },
        { id: 'page-margins-orientation', title: '@page Rules: size (portrait, landscape), page Margins & Headers', conceptId: 'css_at_page' },
        { id: 'print-color-adjust-exact', title: 'Preserving Background Colors with print-color-adjust: exact', conceptId: 'css_print_color_adjust' },
      ],
    },
  ],

  // Advanced CSS: 18 Topics
  'advanced-css': [
    {
      id: 'adv-css-cascade-layers',
      title: 'Cascade Layers (@layer) & Enterprise Architecture',
      description: 'Layer ordering, unlayered style precedence, nested layers, and resolving CSS specificity battles in monorepos.',
      subtopics: [
        { id: 'layer-declaration-order', title: '@layer Priority Ordering: Base, Components, Utilities Hierarchies', conceptId: 'adv_css_layer_order' },
        { id: 'unlayered-styles-precedence', title: 'Unlayered Styles Victory: Why Unlayered Styles Override All Layers', conceptId: 'adv_css_unlayered' },
        { id: 'framework-layer-integration', title: 'Sandboxing Third-Party CSS Libraries Inside Lower-Priority Layers', conceptId: 'adv_css_layer_sandbox' },
      ],
    },
    {
      id: 'adv-css-container-queries',
      title: 'Container Size Queries (@container) & Container Units',
      description: 'container-type (inline-size, normal), container-name, @container queries, and container query units (cqw, cqi).',
      subtopics: [
        { id: 'container-type-inline-size', title: 'container-type: inline-size & Creating Query Contexts', conceptId: 'adv_css_container_type' },
        { id: 'cqw-cqi-container-units', title: 'Container Relative Units: cqw, cqh, cqi, cqb Sizing', conceptId: 'adv_css_container_units' },
        { id: 'named-containers-nesting', title: 'Named Containers & Nested Component Query Routing', conceptId: 'adv_css_named_containers' },
      ],
    },
    {
      id: 'adv-css-container-style-queries',
      title: 'Container Style Queries & Component State',
      description: '@container style() syntax, matching CSS custom properties, and styling component children based on parent theme variables.',
      subtopics: [
        { id: 'style-query-syntax', title: '@container style(--variant: highlighted) Syntax & Execution', conceptId: 'adv_css_style_queries' },
        { id: 'custom-property-state-machines', title: 'Zero-JS Component State Machines Powered by Style Queries', conceptId: 'adv_css_state_machines' },
        { id: 'style-queries-browser-support', title: 'Progressive Enhancement & Fallback Strategies for Style Queries', conceptId: 'adv_css_style_fallbacks' },
      ],
    },
    {
      id: 'adv-css-subgrid',
      title: 'CSS Subgrid: Multi-Level Alignment & Card Layouts',
      description: 'grid-template-columns: subgrid, inheriting track lines, card alignment patterns, and responsive subgrid architectures.',
      subtopics: [
        { id: 'subgrid-track-inheritance', title: 'Inheriting Named Grid Lines & Fractional Tracks from Parent Grid', conceptId: 'adv_css_subgrid_tracks' },
        { id: 'subgrid-card-alignment', title: 'Aligning Card Headers, Bodies, and Footers Uniformly with Subgrid', conceptId: 'adv_css_subgrid_cards' },
        { id: 'subgrid-vs-nested-grid', title: 'Subgrid vs Independent Nested Grids: Architectural Differences', conceptId: 'adv_css_subgrid_vs_nested' },
      ],
    },
    {
      id: 'adv-css-native-nesting',
      title: 'Native CSS Nesting & Specificity Differences vs Preprocessors',
      description: 'W3C CSS Nesting, the nesting selector (&), relaxed nesting rules, and how native nesting specificity differs from SASS.',
      subtopics: [
        { id: 'native-nesting-syntax', title: 'Direct Child Nesting, Media Query Nesting & & Combinator', conceptId: 'adv_css_native_nesting' },
        { id: 'nesting-specificity-is-wrap', title: 'Why Native Nesting Wraps in :is() and Inherits Specificity Weight', conceptId: 'adv_css_nesting_is' },
        { id: 'sass-vs-native-nesting-traps', title: 'Key Migration Pitfalls Moving from SCSS to Native CSS Nesting', conceptId: 'adv_css_sass_migration' },
      ],
    },
    {
      id: 'adv-css-scope-at-rule',
      title: 'CSS Scope (@scope) & Donut Scoping Encapsulation',
      description: 'The @scope rule, root scoping elements, to clause (lower boundaries / donut scoping), and :scope pseudo-class.',
      subtopics: [
        { id: 'at-scope-root-boundary', title: '@scope (.card) to (.slot) Donut Scope Encapsulation', conceptId: 'adv_css_donut_scoping' },
        { id: 'scope-specificity-override', title: 'Proximity Overrides: Scoped Styles Winning Without !important', conceptId: 'adv_css_scope_proximity' },
        { id: 'scope-vs-css-modules', title: 'CSS @scope vs CSS Modules vs Shadow DOM Comparison Matrix', conceptId: 'adv_css_scope_vs_modules' },
      ],
    },
    {
      id: 'adv-css-anchor-positioning',
      title: 'CSS Anchor Positioning API (Popovers & Tooltips)',
      description: 'anchor-name, position-anchor, anchor() function, position-try-fallbacks, and pure CSS tethered popovers/tooltips.',
      subtopics: [
        { id: 'anchor-name-binding', title: 'anchor-name and position-anchor Element Tethering', conceptId: 'adv_css_anchor_binding' },
        { id: 'anchor-position-math', title: 'Calculating Offsets via top: anchor(bottom) and position-area', conceptId: 'adv_css_anchor_math' },
        { id: 'position-try-flip', title: 'Automatic Viewport Collision Flips with position-try-fallbacks', conceptId: 'adv_css_position_try' },
      ],
    },
    {
      id: 'adv-css-browser-rendering-pipeline',
      title: 'Browser Rendering Pipeline: Layout, Paint & Composite',
      description: 'DOM + CSSOM to Render Tree, layout reflow, paint invalidation, GPU compositor layers, and 60fps/120fps budget.',
      subtopics: [
        { id: 'reflow-paint-composite-cycle', title: 'The 3 Rendering Phases: Layout (Reflow) -> Paint -> Composite', conceptId: 'adv_css_render_phases' },
        { id: 'forced-synchronous-layouts', title: 'Avoiding Forced Synchronous Layouts & Layout Thrashing in CSS', conceptId: 'adv_css_fsl_traps' },
        { id: 'gpu-layer-creation-criteria', title: 'Criteria for GPU RenderLayer Promotion (Transforms, Opacity, Canvas)', conceptId: 'adv_css_gpu_layers' },
      ],
    },
    {
      id: 'adv-css-containment-content-visibility',
      title: 'CSS Containment (contain) & content-visibility',
      description: 'contain: layout paint style size, content-visibility: auto, contain-intrinsic-size, and rendering 10,000+ nodes.',
      subtopics: [
        { id: 'contain-property-boundaries', title: 'contain: layout paint size Isolated Subtree Optimization', conceptId: 'adv_css_contain_prop' },
        { id: 'content-visibility-auto', title: 'content-visibility: auto Skipping Off-Screen Layout Cycles', conceptId: 'adv_css_content_vis' },
        { id: 'contain-intrinsic-size-cls', title: 'contain-intrinsic-size Placeholders to Prevent Scroll Jumping', conceptId: 'adv_css_intrinsic_size' },
      ],
    },
    {
      id: 'adv-css-houdini-paint-worklets',
      title: 'CSS Houdini: Paint Worklets & @property Typed Variables',
      description: 'CSS.paintWorklet.addModule(), registerPaint(), and @property typed custom properties with syntax, inherits, initial-value.',
      subtopics: [
        { id: 'at-property-typed-variables', title: '@property Rule: Animating Gradients via Typed Custom Properties', conceptId: 'adv_css_at_property' },
        { id: 'paint-worklet-execution', title: 'Writing Custom GPU Shaders with CSS Paint Worklets', conceptId: 'adv_css_paint_worklets' },
        { id: 'houdini-typed-om', title: 'CSS Typed OM: CSSUnitValue & Eliminating String Parsing Overheads', conceptId: 'adv_css_typed_om' },
      ],
    },
    {
      id: 'adv-css-view-transitions-api',
      title: 'View Transitions API: Seamless SPA & MPA Page Morphs',
      description: 'document.startViewTransition(), ::view-transition pseudo-elements, view-transition-name, and smooth UI state morphs.',
      subtopics: [
        { id: 'start-view-transition-spa', title: 'document.startViewTransition() Lifecycle & Screenshot Capturing', conceptId: 'adv_css_view_trans_lifecycle' },
        { id: 'view-transition-name-morph', title: 'view-transition-name Morphing Shared Elements (Hero Image Expansion)', conceptId: 'adv_css_shared_morph' },
        { id: 'view-transition-pseudo-tree', title: 'Customizing ::view-transition-old and ::view-transition-new Animations', conceptId: 'adv_css_transition_pseudos' },
      ],
    },
    {
      id: 'adv-css-architecture-design-tokens',
      title: 'Scalable CSS Architecture, ITCSS & Design Tokens',
      description: 'Inverted Triangle CSS (ITCSS), BEM conventions, W3C Design Tokens format, Style Dictionary, and multi-brand theming.',
      subtopics: [
        { id: 'itcss-specificity-pyramid', title: 'ITCSS Structure: Settings, Tools, Generic, Elements, Objects, Components, Trumps', conceptId: 'adv_css_itcss' },
        { id: 'w3c-design-tokens-format', title: 'W3C Community Group Design Token JSON Schemas & Aliasing', conceptId: 'adv_css_design_tokens' },
        { id: 'multi-brand-theme-swapping', title: 'Multi-Brand & Sub-Brand CSS Architecture in Enterprise Monorepos', conceptId: 'adv_css_multi_brand' },
      ],
    },
  ],

  // JavaScript: 25 Topics
  javascript: [
    {
      id: 'js-v8-engine-pipeline',
      title: 'V8 Engine Architecture: Ignition, TurboFan & Bytecode',
      description: 'V8 parsing, AST generation, Ignition bytecode interpreter, TurboFan optimizing compiler, deoptimization, and hidden classes.',
      subtopics: [
        { id: 'ignition-interpreter-turbofan', title: 'Ignition Bytecode Interpreter & TurboFan Speculative JIT Compiler', conceptId: 'js_v8_pipeline' },
        { id: 'hidden-classes-shapes', title: 'V8 Hidden Classes (Shapes) & Inline Caching (IC) Optimization', conceptId: 'js_hidden_classes' },
        { id: 'deoptimization-bailout-traps', title: 'Polymorphism, Type Feedback Vector & Deoptimization Bailouts', conceptId: 'js_deopt_traps' },
      ],
    },
    {
      id: 'js-execution-context-callstack',
      title: 'Execution Contexts, Variable Environment & Call Stack',
      description: 'Global Execution Context, Function Context, Creation Phase (hoisting), Execution Phase, and Call Stack overflow mechanics.',
      subtopics: [
        { id: 'creation-execution-phases', title: 'Creation Phase (Memory Allocation) vs Execution Phase (Code Evaluation)', conceptId: 'js_exec_context_phases' },
        { id: 'lexical-environment-record', title: 'Environment Records: Declarative, Object & Global Environment Records', conceptId: 'js_env_records' },
        { id: 'call-stack-overflow', title: 'Call Stack Frame Allocation, Maximum Stack Size & RangeError Overflows', conceptId: 'js_stack_overflow' },
      ],
    },
    {
      id: 'js-memory-heap-garbage-collection',
      title: 'Memory Heap, Pointer References & Garbage Collection',
      description: 'Stack vs Heap memory, Generational Garbage Collection hypothesis, Scavenge algorithm, Mark-Sweep-Compact, and Orinoco concurrent GC.',
      subtopics: [
        { id: 'stack-vs-heap-allocation', title: 'Primitive Values on the Stack vs Reference Objects in the Heap', conceptId: 'js_stack_heap' },
        { id: 'scavenger-minor-gc', title: 'Young Generation (Nursery / Intermediate) & Semi-Space Scavenging', conceptId: 'js_minor_gc' },
        { id: 'major-gc-mark-sweep-compact', title: 'Old Generation Major GC: Tri-Color Marking, Sweeping & Compaction', conceptId: 'js_major_gc' },
      ],
    },
    {
      id: 'js-lexical-scope-closures',
      title: 'Lexical Scope, Scope Chain & Deep Closure Mechanics',
      description: 'Lexical scoping, identifier resolution along the scope chain, closure memory retention, and closure memory leaks in production.',
      subtopics: [
        { id: 'scope-chain-resolution', title: 'Static Scope Chain Traversal & Outer Environment References', conceptId: 'js_scope_chain' },
        { id: 'closure-memory-retention', title: 'How V8 Allocates Closure Contexts on the Heap to Outlive Function Returns', conceptId: 'js_closure_heap' },
        { id: 'closure-memory-leaks', title: 'Accidental Closures in Event Listeners, Timers & Detached DOM Trees', conceptId: 'js_closure_leaks' },
      ],
    },
    {
      id: 'js-prototypes-prototypal-inheritance',
      title: 'Prototypes, Prototype Chain & Prototypal Inheritance',
      description: 'Object.prototype, __proto__ vs prototype, Constructor functions, Object.create(), and ES6 class syntax desugaring.',
      subtopics: [
        { id: 'prototype-vs-dunder-proto', title: 'Function.prototype vs Object.__proto__ (Internal [[Prototype]])', conceptId: 'js_proto_vs_prototype' },
        { id: 'prototype-chain-lookup-shadowing', title: 'Prototype Property Lookup Algorithm, hasOwnProperty & Property Shadowing', conceptId: 'js_proto_chain' },
        { id: 'es6-class-prototypal-desugaring', title: 'How ES6 class, constructor, super() & extends Map to Prototype Mechanics', conceptId: 'js_class_desugaring' },
      ],
    },
    {
      id: 'js-this-binding-rules',
      title: 'The this Keyword: The 4 Complete Binding Rules',
      description: 'Default binding (window/global vs undefined in strict mode), Implicit binding, Explicit binding (call, apply, bind), and New binding.',
      subtopics: [
        { id: 'four-binding-rules-precedence', title: 'Binding Precedence: new > explicit (bind/call) > implicit > default', conceptId: 'js_this_precedence' },
        { id: 'call-apply-bind-implementation', title: 'Polyfilling Function.prototype.bind & Execution Context Binding', conceptId: 'js_call_apply_bind' },
        { id: 'arrow-functions-lexical-this', title: 'Why Arrow Functions Have No this, arguments, super, or new.target', conceptId: 'js_arrow_lexical_this' },
      ],
    },
    {
      id: 'js-event-loop-concurrency',
      title: 'JavaScript Event Loop: Call Stack, Macrotasks & Microtasks',
      description: 'HTML5 event loop specification, Microtask queue (Promise, queueMicrotask), Task queue (setTimeout), and browser render cycle timing.',
      subtopics: [
        { id: 'microtasks-vs-macrotasks', title: 'Queue Priority: Microtask Drain Guarantee Before Every Next Macrotask', conceptId: 'js_microtask_drain' },
        { id: 'render-step-and-raf', title: 'Event Loop Render Steps: requestAnimationFrame, Layout, Paint Coordinates', conceptId: 'js_raf_timing' },
        { id: 'starving-the-event-loop', title: 'Microtask Starvation: How Endless Promise Loops Freeze the UI Thread', conceptId: 'js_microtask_starve' },
      ],
    },
    {
      id: 'js-promises-aplus-spec',
      title: 'Promises A+ Specification & Asynchronous State Machines',
      description: 'Promise states (pending, fulfilled, rejected), thenable resolution procedure, chaining, Promise.all, allSettled, race, and any.',
      subtopics: [
        { id: 'promise-resolution-procedure', title: 'Promise A+ Specification 2.3: The Promise Resolution Procedure', conceptId: 'js_promise_aplus' },
        { id: 'promise-combinators-comparison', title: 'Promise Combinators Matrix: all vs allSettled vs race vs any', conceptId: 'js_promise_combinators' },
        { id: 'handwriting-promise-aplus', title: 'Building a Full Promise A+ Compliant Class from Scratch', conceptId: 'js_promise_polyfill' },
      ],
    },
    {
      id: 'js-async-await-internals',
      title: 'Async/Await Internals: Generator Coroutine Transformations',
      description: 'Syntactic sugar over generators and promises, execution pause and resume mechanics, error propagation, and unhandled rejections.',
      subtopics: [
        { id: 'async-await-generator-coroutine', title: 'Desugaring async/await into Generators (yield) & Promise Runners', conceptId: 'js_async_generators_runner' },
        { id: 'async-await-try-catch-mechanics', title: 'Error Boundary Handling: try/catch vs .catch() and Stack Trace Preservation', conceptId: 'js_async_try_catch' },
        { id: 'sequential-vs-parallel-await', title: 'Waterfall Anti-patterns: Sequential await in Loops vs Promise.all', conceptId: 'js_async_waterfalls' },
      ],
    },
    {
      id: 'js-object-descriptors-immutability',
      title: 'Object Descriptors, Property Flags & Immutability',
      description: 'Property descriptor attributes (writable, enumerable, configurable), Object.defineProperty, Object.preventExtensions, seal, and freeze.',
      subtopics: [
        { id: 'property-descriptor-flags', title: 'writable, enumerable, configurable Property Flag Enforcement', conceptId: 'js_property_flags' },
        { id: 'preventextensions-seal-freeze', title: 'PreventExtensions vs Object.seal vs Object.freeze (Shallow Immutability)', conceptId: 'js_seal_freeze' },
        { id: 'deep-freeze-recursive', title: 'Implementing Production-Safe Recursive Deep Freeze with Circular References', conceptId: 'js_deep_freeze' },
      ],
    },
    {
      id: 'js-dom-traversal-manipulation',
      title: 'High-Performance DOM Manipulation & DocumentFragment',
      description: 'Node vs Element, NodeList vs HTMLCollection (live vs static), DocumentFragment batching, and cloneNode performance.',
      subtopics: [
        { id: 'nodelist-vs-htmlcollection', title: 'Live HTMLCollections vs Static NodeLists & Iteration Pitfalls', conceptId: 'js_nodelist_vs_collection' },
        { id: 'document-fragment-batching', title: 'DocumentFragment: Eliminating Reflows During Bulk Node Insertions', conceptId: 'js_doc_fragment' },
        { id: 'template-element-cloning', title: '<template>.content.cloneNode(true) Memory Performance', conceptId: 'js_template_cloning' },
      ],
    },
    {
      id: 'js-structured-clone-serialization',
      title: 'Deep Cloning: structuredClone() vs JSON Serialization',
      description: 'Limitations of JSON.stringify (Dates, Maps, Sets, undefined, circular refs), structuredClone algorithm, and MessageChannel cloning.',
      subtopics: [
        { id: 'structured-clone-algorithm', title: 'structuredClone(): Native Circular References, Maps, Sets, ArrayBuffers', conceptId: 'js_structured_clone' },
        { id: 'json-serialization-failures', title: 'JSON.stringify Data Loss: Functions, undefined, Symbols, NaN, Infinity', conceptId: 'js_json_data_loss' },
        { id: 'custom-deep-clone-circular', title: 'Building Deep Clone with WeakMap Circular Reference Memoization', conceptId: 'js_custom_deep_clone' },
      ],
    },
  ],

  // ES6+: 15 Topics
  es6: [
    {
      id: 'es6-let-const-tdz',
      title: 'let, const & Temporal Dead Zone (TDZ) Bytecode',
      description: 'Block scoping vs function scoping (var), TDZ initialization boundaries, lexical declarations in loops, and ReferenceError mechanics.',
      subtopics: [
        { id: 'temporal-dead-zone-mechanics', title: 'Temporal Dead Zone: Uninitialized Lexical Slot vs undefined Allocation', conceptId: 'es6_tdz' },
        { id: 'block-scoping-in-loops', title: 'Per-Iteration Binding of let in for Loops vs var Closure Traps', conceptId: 'es6_loop_scoping' },
        { id: 'const-immutability-semantics', title: 'const Binding Reassignment Prevention vs Mutable Reference Content', conceptId: 'es6_const_semantics' },
      ],
    },
    {
      id: 'es6-destructuring-rest-spread',
      title: 'Destructuring Assignments, Rest & Spread Dynamics',
      description: 'Array and object destructuring, computed property destructuring, nested defaults, rest parameters, and shallow copying caveats.',
      subtopics: [
        { id: 'deep-nested-destructuring', title: 'Nested Destructuring, Fallback Defaults & Variable Renaming Aliases', conceptId: 'es6_destructuring_nested' },
        { id: 'rest-parameters-vs-arguments', title: 'Rest Parameters (...args) True Array Nature vs arguments Object', conceptId: 'es6_rest_params' },
        { id: 'spread-operator-shallow-copy', title: 'Object/Array Spread Operator: Shallow Copy Gotchas & Prototype Loss', conceptId: 'es6_spread_shallow' },
      ],
    },
    {
      id: 'es6-symbols-metaprogramming',
      title: 'Symbols, Well-Known Symbols & Metaprogramming',
      description: 'Symbol primitive, private object keys, Symbol.for global registry, and well-known symbols (Symbol.iterator, Symbol.toPrimitive, Symbol.hasInstance).',
      subtopics: [
        { id: 'symbol-uniqueness-registry', title: 'Symbol() Guaranteed Uniqueness vs Symbol.for() Global Cross-Realm Registry', conceptId: 'es6_symbol_registry' },
        { id: 'well-known-symbols', title: 'Well-Known Symbols: Symbol.toPrimitive, Symbol.hasInstance & Symbol.species', conceptId: 'es6_well_known_symbols' },
        { id: 'symbol-property-enumeration', title: 'Object.getOwnPropertySymbols() & Non-Enumerable Symbol Properties', conceptId: 'es6_symbol_enum' },
      ],
    },
    {
      id: 'es6-iterators-iterable-protocol',
      title: 'Iterators, Iterables Protocol & for...of Loops',
      description: 'The Iterable protocol ([Symbol.iterator]), Iterator interface ({ value, done }), custom iterables, and consuming collections with for...of.',
      subtopics: [
        { id: 'iterable-contract-spec', title: 'The Iterable Protocol Contract: Implementing [Symbol.iterator]()', conceptId: 'es6_iterable_contract' },
        { id: 'for-of-loop-mechanics', title: 'for...of Loop Execution: Iterator Closure and return() Cleanup Hooks', conceptId: 'es6_for_of' },
        { id: 'infinite-iterable-streams', title: 'Building Infinite Range & Lazy Iterable Generators', conceptId: 'es6_lazy_iterables' },
      ],
    },
    {
      id: 'es6-generators-coroutines',
      title: 'Generators (function*), yield & Coroutines',
      description: 'Generator function syntax, yield expressions, bidirectional value passing via next(val), throw(), return(), and async state machines.',
      subtopics: [
        { id: 'generator-pause-resume', title: 'The yield Pause-Resume State Machine & GeneratorObject Lifecycle', conceptId: 'es6_generator_state' },
        { id: 'bidirectional-data-transfer', title: 'Bidirectional Communication: Passing Arguments to generator.next(value)', conceptId: 'es6_generator_next' },
        { id: 'delegating-yield-star', title: 'Delegating Iteration to Sub-Generators via yield*', conceptId: 'es6_yield_star' },
      ],
    },
    {
      id: 'es6-map-set-collections',
      title: 'Modern Collections: Map, Set, WeakMap & WeakSet',
      description: 'Hash map lookups, arbitrary keys (objects as keys), Set uniqueness, WeakMap garbage collection semantics, and private state encapsulation.',
      subtopics: [
        { id: 'map-vs-plain-object', title: 'Map vs Plain Object: Performance, Key Types & Prototype Pollution Safety', conceptId: 'es6_map_vs_object' },
        { id: 'weakmap-garbage-collection', title: 'WeakMap Weak Key References: Preventing DOM Node Memory Leaks', conceptId: 'es6_weakmap_gc' },
        { id: 'private-data-weakmap', title: 'Encapsulating Private Class Data with WeakMap Patterns', conceptId: 'es6_private_weakmap' },
      ],
    },
    {
      id: 'es6-proxies-reflect-api',
      title: 'Metaprogramming: Proxy & Reflect API Interception',
      description: 'Proxy object wrapping, 13 proxy traps (get, set, has, deleteProperty, apply), Reflect method parity, and reactive state stores.',
      subtopics: [
        { id: 'proxy-traps-fundamentals', title: 'Interpreting Proxy Traps: get, set, has, deleteProperty & Receiver Object', conceptId: 'es6_proxy_traps' },
        { id: 'reflect-api-method-parity', title: 'Reflect API: Providing Forwarding Defaults & Proper Context Propagation', conceptId: 'es6_reflect_api' },
        { id: 'building-reactive-observable', title: 'Engineering a Reactive Observable State Store (Vue 3 Reactivity Model)', conceptId: 'es6_reactive_proxy' },
      ],
    },
    {
      id: 'es6-modern-operators',
      title: 'Optional Chaining, Nullish Coalescing & Assignment',
      description: 'Optional chaining (?.), nullish coalescing (??) vs OR (||), logical assignment (&&=, ||=, ??=), and numeric separators.',
      subtopics: [
        { id: 'nullish-coalescing-vs-or', title: 'Nullish Coalescing (??) vs Logical OR (||): Falsy 0 & Empty String Traps', conceptId: 'es6_nullish_coalescing' },
        { id: 'optional-chaining-short-circuit', title: 'Optional Chaining (?.): Short-Circuiting Rules on Functions and Arrays', conceptId: 'es6_optional_chaining' },
        { id: 'logical-assignment-operators', title: 'Logical Assignment: &&=, ||=, and ??= In-Place Mutation', conceptId: 'es6_logical_assignment' },
      ],
    },
    {
      id: 'es6-classes-private-fields',
      title: 'Modern Classes, Private Fields & Static Blocks',
      description: 'Class syntax, constructor, super(), private instance fields (#field), private methods, static blocks, and instanceof checks.',
      subtopics: [
        { id: 'private-fields-hash-syntax', title: 'Hard Private Fields (#prop): Real VM-Level Encapsulation vs TypeScript private', conceptId: 'es6_hard_private_fields' },
        { id: 'static-initialization-blocks', title: 'static { } Initialization Blocks: Scoped One-Time Module Setup', conceptId: 'es6_static_blocks' },
        { id: 'subclassing-super-mechanics', title: 'Subclassing with extends: TDZ in Constructors Before super() Call', conceptId: 'es6_subclass_super' },
      ],
    },
  ],

  // TypeScript: 20 Topics
  typescript: [
    {
      id: 'ts-primitive-literal-types',
      title: 'TypeScript Type Primitives, Literals & Type Algebra',
      description: 'boolean, string, number, bigint, symbol, any, unknown, never, void, literal types, and type widening mechanics.',
      subtopics: [
        { id: 'unknown-vs-any', title: 'Type Safety: unknown (Type-Safe Top Type) vs any (Disabling the Compiler)', conceptId: 'ts_unknown_vs_any' },
        { id: 'never-bottom-type', title: 'The never Bottom Type: Empty Sets & Exhaustive Switch-Case Guards', conceptId: 'ts_never_bottom' },
        { id: 'literal-types-widening', title: 'Literal Types & Type Widening (let x = "apple" vs const y = "apple")', conceptId: 'ts_literal_widening' },
      ],
    },
    {
      id: 'ts-structural-typing-duck',
      title: 'Structural Typing System & Interface Contracts',
      description: 'Nominal vs structural typing, excess property checks in object literals, type aliases vs interfaces, and declaration merging.',
      subtopics: [
        { id: 'structural-typing-mechanics', title: 'Structural Typing & Duck Typing: Compatibility by Shape Not Name', conceptId: 'ts_structural_typing' },
        { id: 'excess-property-checks', title: 'Excess Property Checks on Object Literals vs Variable Assignments', conceptId: 'ts_excess_props' },
        { id: 'interface-vs-type-alias', title: 'Interfaces vs Type Aliases: Declaration Merging & Union Capabilities', conceptId: 'ts_interface_vs_type' },
      ],
    },
    {
      id: 'ts-type-narrowing-guards',
      title: 'Type Narrowing, Control Flow Analysis & Type Guards',
      description: 'typeof, instanceof, in operator, truthiness checks, equality narrowing, user-defined type guards (arg is Type), and assertion functions.',
      subtopics: [
        { id: 'custom-type-guard-predicates', title: 'Custom Type Guards: Using value is TargetType Predicates', conceptId: 'ts_type_predicates' },
        { id: 'assertion-functions-asserts', title: 'Assertion Functions (asserts condition): Invariant Validation', conceptId: 'ts_assertion_functions' },
        { id: 'discriminated-unions-narrowing', title: 'Discriminated Unions & Exhaustiveness Checking with never', conceptId: 'ts_discriminated_unions' },
      ],
    },
    {
      id: 'ts-generics-constraints',
      title: 'Generics, Generic Functions & Constraints (extends)',
      description: 'Generic parameters (<T>), generic functions/interfaces/classes, generic constraints (T extends Parent), and multiple type parameters.',
      subtopics: [
        { id: 'generic-constraints-extends', title: 'Constraining Type Parameters: <T extends { id: string }>', conceptId: 'ts_generic_constraints' },
        { id: 'keyof-and-generics', title: 'Key Constraints: <T, K extends keyof T>(obj: T, key: K): T[K]', conceptId: 'ts_keyof_generics' },
        { id: 'generic-defaults-inference', title: 'Generic Defaults (<T = string>) & Contextual Type Inference', conceptId: 'ts_generic_defaults' },
      ],
    },
    {
      id: 'ts-conditional-types-infer',
      title: 'Conditional Types & Pattern Inference (infer)',
      description: 'T extends U ? X : Y, distributive conditional types over naked type parameters, and pattern matching with infer.',
      subtopics: [
        { id: 'conditional-type-mechanics', title: 'Conditional Types: T extends U ? TrueType : FalseType Rules', conceptId: 'ts_conditional_types' },
        { id: 'distributive-conditional-types', title: 'Distributive Behavior Over Unions & Suppressing with [T]', conceptId: 'ts_distributive_conditionals' },
        { id: 'infer-pattern-matching', title: 'Type Inference with infer: Unwrapping Promises, Arrays & Return Types', conceptId: 'ts_infer_pattern' },
      ],
    },
    {
      id: 'ts-mapped-types-key-remapping',
      title: 'Mapped Types & Key Remapping via as Clause',
      description: 'Iterating over keys with in keyof, modifier toggling (+/- readonly, +/- ?), and key remapping with as NewKeyName.',
      subtopics: [
        { id: 'mapped-types-transformation', title: 'Mapped Type Syntax: { [K in keyof T]: T[K] } Modulations', conceptId: 'ts_mapped_types' },
        { id: 'modifier-flags-readonly-optional', title: 'Adding and Removing Modifiers: -readonly and -? (Required/Mutable)', conceptId: 'ts_mapped_modifiers' },
        { id: 'key-remapping-as-clause', title: 'Key Remapping: { [K in keyof T as `on${Capitalize<K>}`]: () => void }', conceptId: 'ts_key_remapping' },
      ],
    },
    {
      id: 'ts-utility-types-deepdive',
      title: 'Standard Utility Types: Implementation & Mechanics',
      description: 'Partial, Required, Readonly, Pick, Omit, Record, Exclude, Extract, NonNullable, Parameters, ReturnType, and Awaited.',
      subtopics: [
        { id: 'transformative-utility-types', title: 'Deconstructing Pick<T, K>, Omit<T, K>, and Record<K, T>', conceptId: 'ts_pick_omit_record' },
        { id: 'union-filtering-utilities', title: 'Union Filters: Exclude<T, U> vs Extract<T, U> Conditional Implementations', conceptId: 'ts_exclude_extract' },
        { id: 'function-inference-utilities', title: 'Function Unwrappers: Parameters<T>, ReturnType<T> & Awaited<T>', conceptId: 'ts_return_awaited' },
      ],
    },
    {
      id: 'ts-template-literal-types',
      title: 'Template Literal Types & String Pattern Matching',
      description: 'Template literal string types, union expansion, string manipulation intrinsic types (Uppercase, Lowercase, Capitalize, Uncapitalize).',
      subtopics: [
        { id: 'template-string-unions', title: 'Combinatorial Type Generation with Template Literal Unions', conceptId: 'ts_template_unions' },
        { id: 'intrinsic-string-manipulations', title: 'Intrinsic String Modifiers: Capitalize<S> & Uncapitalize<S>', conceptId: 'ts_intrinsic_strings' },
        { id: 'event-naming-type-dsls', title: 'Constructing Event and Path DSLs: `set${Capitalize<string>}`', conceptId: 'ts_event_dsls' },
      ],
    },
    {
      id: 'ts-const-assertions-satisfies',
      title: 'Const Assertions (as const) & The satisfies Operator',
      description: 'as const literal narrowing, readonly arrays and tuples, and the satisfies operator (validating a type without widening or losing inference).',
      subtopics: [
        { id: 'as-const-narrowing', title: 'as const: Deep Readonly Property Lock & Literal Narrowing', conceptId: 'ts_as_const' },
        { id: 'satisfies-operator-benefits', title: 'The satisfies Operator: Type Conformance Without Widening Inferred Types', conceptId: 'ts_satisfies_operator' },
        { id: 'satisfies-vs-type-annotation', title: 'satisfies vs Type Annotations (const x: T vs const x = {} satisfies T)', conceptId: 'ts_satisfies_vs_annotation' },
      ],
    },
    {
      id: 'ts-compiler-configuration',
      title: 'Compiler Options & tsconfig.json Production Setup',
      description: 'Compiler targets, module systems (NodeNext, Bundler), strict flags (strictNullChecks, noImplicitAny, noUncheckedIndexedAccess), and skipLibCheck.',
      subtopics: [
        { id: 'module-resolution-bundler-nodenext', title: 'moduleResolution: Bundler vs NodeNext in Modern Build Tooling', conceptId: 'ts_module_resolution' },
        { id: 'strict-compiler-flags-audit', title: 'Critical Strict Flags: noImplicitAny, strictNullChecks, noUncheckedIndexedAccess', conceptId: 'ts_strict_flags' },
        { id: 'path-aliasing-declaration-maps', title: 'Path Aliases (paths) & Generating Types (.d.ts + declarationMap)', conceptId: 'ts_declaration_maps' },
      ],
    },
  ],

  // React: 15 Topics
  react: [
    {
      id: 'react-jsx-runtime',
      title: 'JSX Compilation, React.createElement & Virtual Nodes',
      description: 'JSX transformation (new jsx-runtime vs createElement), React elements ($$typeof symbol, type, props, key), and immutability.',
      subtopics: [
        { id: 'jsx-transform-new-runtime', title: 'The Modern JSX Transform: import { jsx } from "react/jsx-runtime"', conceptId: 'react_jsx_transform' },
        { id: 'react-element-structure', title: 'The React Element Object: $$typeof: Symbol(react.element) XSS Protection', conceptId: 'react_element_typeof' },
        { id: 'jsx-transpiled-output', title: 'What JSX Transpiles To Under the Hood: Nesting & Children Props', conceptId: 'react_jsx_transpile' },
      ],
    },
    {
      id: 'react-state-usestate-immutability',
      title: 'useState Mechanics, State Immutability & Re-render Triggers',
      description: 'useState hook dispatch action, Object.is equality comparisons, functional state updates (prev => next), and batching renders.',
      subtopics: [
        { id: 'usestate-object-is-comparison', title: 'Bailing Out of Rerenders with Object.is Referential Equality', conceptId: 'react_object_is_bailout' },
        { id: 'functional-state-updates', title: 'Functional Updates (setCount(c => c + 1)) to Eliminate Race Conditions', conceptId: 'react_functional_updates' },
        { id: 'lazy-state-initialization', title: 'Lazy Initial State: useState(() => expensiveCompute()) Performance', conceptId: 'react_lazy_initial_state' },
      ],
    },
    {
      id: 'react-useeffect-lifecycle-cleanup',
      title: 'useEffect Lifecycle, Dependency Arrays & Synchronous Traps',
      description: 'Passive effect scheduling, dependency comparison (Object.is), cleanup functions, race conditions in data fetching, and strict mode double invocation.',
      subtopics: [
        { id: 'useeffect-execution-timing', title: 'Passive Effect Execution After Browser Paint vs useLayoutEffect', conceptId: 'react_effect_timing' },
        { id: 'cleanup-function-guarantees', title: 'Cleanup Function Timing: Running Before Next Effect and on Teardown', conceptId: 'react_effect_cleanup' },
        { id: 'race-conditions-in-effects', title: 'Cancelling Stale Asynchronous Requests: AbortController & Boolean Flags', conceptId: 'react_effect_race_conditions' },
      ],
    },
    {
      id: 'react-useref-mutable-dom',
      title: 'useRef, Mutable Containers & forwardRef Binding',
      description: 'Persistent mutable references ({ current: val }), persisting data across renders without triggering rerenders, forwardRef, and useImperativeHandle.',
      subtopics: [
        { id: 'useref-persisted-container', title: 'useRef as an Instance Variable Container That Survives Rerenders', conceptId: 'react_useref_container' },
        { id: 'dom-refs-and-null-checks', title: 'DOM Node Binding: Callback Refs vs Object Refs & Null Lifecycle', conceptId: 'react_dom_refs' },
        { id: 'forwardref-imperative-handle', title: 'forwardRef & useImperativeHandle: Exposing Controlled Imperative APIs', conceptId: 'react_forwardref' },
      ],
    },
    {
      id: 'react-memo-usememo-usecallback',
      title: 'Memoization: React.memo, useMemo & useCallback',
      description: 'React.memo shallow prop comparison, useMemo cached computations, useCallback function reference stability, and memoization overhead costs.',
      subtopics: [
        { id: 'react-memo-shallow-comparison', title: 'React.memo HOC: Custom arePropsEqual Comparisons & Pitfalls', conceptId: 'react_memo_hoc' },
        { id: 'usecallback-referential-stability', title: 'useCallback: Preventing Unnecessary Child Rerenders via Stable Callbacks', conceptId: 'react_usecallback' },
        { id: 'usememo-cost-benefit', title: 'When NOT to useMemo: Memory Allocation Overhead vs Computation Cost', conceptId: 'react_usememo_cost' },
      ],
    },
    {
      id: 'react-context-api-architecture',
      title: 'Context API: Provider Patterns & Render Cascades',
      description: 'createContext, Provider value propagation, consumer re-rendering mechanics, context splitting to prevent render storms, and custom provider hooks.',
      subtopics: [
        { id: 'context-render-cascade-issue', title: 'Why Changing Context Value Rerenders All Consumers (Bypassing React.memo)', conceptId: 'react_context_render_cascade' },
        { id: 'context-splitting-pattern', title: 'Context Splitting: Separating State and Dispatch into Dual Providers', conceptId: 'react_context_splitting' },
        { id: 'custom-provider-hook-pattern', title: 'Fail-Fast Custom Context Hooks: Throwing Errors Outside Providers', conceptId: 'react_context_custom_hook' },
      ],
    },
    {
      id: 'react-reconciliation-keys',
      title: 'Reconciliation Algorithm & The key Prop Invariant',
      description: 'Diffing algorithm O(n) heuristics, element type changes, component replacement, and why array index as key causes corrupt UI state.',
      subtopics: [
        { id: 'diffing-algorithm-heuristics', title: 'Reconciliation Heuristics: Element Type Matching & Component Remounting', conceptId: 'react_diffing_heuristics' },
        { id: 'key-prop-identity-tracking', title: 'The key Prop: Stable Identity vs Index-as-Key State Corruption Bugs', conceptId: 'react_key_identity' },
        { id: 'resetting-component-state-key', title: 'Resetting Component State Declaratively by Changing Its Key', conceptId: 'react_reset_state_key' },
      ],
    },
    {
      id: 'react-error-boundaries',
      title: 'Error Boundaries, Fallback UI & Graceful Degradation',
      description: 'Class component Error Boundaries (componentDidCatch, getDerivedStateFromError), fallback UIs, unhandled error propagation, and recovery strategies.',
      subtopics: [
        { id: 'error-boundary-lifecycle-methods', title: 'getDerivedStateFromError (Fallback Render) vs componentDidCatch (Logging)', conceptId: 'react_error_boundary_lifecycles' },
        { id: 'errors-not-caught-by-boundaries', title: 'What Error Boundaries Cannot Catch: Event Handlers, Async Code, SSR', conceptId: 'react_error_boundary_limits' },
        { id: 'granularity-nested-boundaries', title: 'Granular Error Boundaries: Isolating Widget Failures in Complex Apps', conceptId: 'react_nested_error_boundaries' },
      ],
    },
    {
      id: 'react-portals-modals',
      title: 'React Portals (createPortal) & Event Bubbling',
      description: 'createPortal container mounting outside the root DOM hierarchy, modal overlay architectures, and synthetic event bubbling through portals.',
      subtopics: [
        { id: 'createportal-dom-insertion', title: 'Mounting Components Outside Document Root into Custom DOM Nodes', conceptId: 'react_create_portal' },
        { id: 'portal-synthetic-event-bubbling', title: 'Synthetic Event Bubbling: Events Bubbling Up React Tree Not DOM Tree', conceptId: 'react_portal_event_bubbling' },
        { id: 'accessible-modal-architecture', title: 'Accessible Dialogs with Portals: Focus Traps & ARIA Compliance', conceptId: 'react_portal_dialog_a11y' },
      ],
    },
    {
      id: 'react-compound-components',
      title: 'Advanced Patterns: Compound Components & Headless UI',
      description: 'Compound component pattern (Tabs, Select, Accordion), implicit state sharing via Context, React.Children.map, and headless UI architectures.',
      subtopics: [
        { id: 'compound-components-context', title: 'Compound Component Architecture: Sharing State via Subtree Context', conceptId: 'react_compound_components' },
        { id: 'headless-component-pattern', title: 'Headless UI Design: Decoupling State & Behavior from Visual Styling', conceptId: 'react_headless_ui' },
        { id: 'custom-hook-composition', title: 'Custom Hook Layering: Composing Specialized Hooks from Base Primitives', conceptId: 'react_custom_hook_composition' },
      ],
    },
  ],
};

console.log('Loaded CURRICULUM_DEFINITIONS for core tracks.');
