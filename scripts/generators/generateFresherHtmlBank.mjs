// scripts/generators/generateFresherHtmlBank.mjs
// Generates authentic, student-friendly, fresher-focused HTML interview questions
// Following the exact user schema:
// { subject, questionNumber, category, difficulty, question, shortAnswer, detailedAnswer, codeExample, realWorldExample, commonMistakes, followUpQuestions, tags }

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_FILE = path.resolve(__dirname, '../../public/data/interview-questions/html.json');

const questions = [
  // 1. What is HTML?
  {
    subject: "HTML",
    questionNumber: 1,
    category: "HTML Fundamentals",
    difficulty: "easy",
    question: "What is HTML?",
    shortAnswer: "HTML (HyperText Markup Language) is the standard markup language used to structure content on web pages.",
    detailedAnswer: "HTML defines the structure and meaning of web content using elements such as headings, paragraphs, links, images, forms, tables, and semantic sections. HTML itself is not a programming language because it does not contain programming logic such as loops or conditional statements.",
    codeExample: `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Hello World</h1>
  <p>This is my first web page.</p>
</body>
</html>`,
    realWorldExample: "HTML provides the structural layer of a web application, while CSS handles presentation and JavaScript handles behavior.",
    commonMistakes: [
      "Calling HTML a programming language."
    ],
    followUpQuestions: [
      "What is the difference between HTML and HTML5?",
      "What is the purpose of <!DOCTYPE html>?",
      "What is the difference between an HTML element and an HTML attribute?"
    ],
    tags: ["html", "fundamentals", "web-basics"]
  },

  // 2. What is <!DOCTYPE html>?
  {
    subject: "HTML",
    questionNumber: 2,
    category: "HTML Fundamentals",
    difficulty: "easy",
    question: "What is <!DOCTYPE html>?",
    shortAnswer: "<!DOCTYPE html> tells the browser that the document should be interpreted using the modern HTML standard and enables standards mode.",
    detailedAnswer: "It is a document type declaration that appears on line 1 of every HTML document. It informs the web browser which HTML version specification to parse the file with. Without it, browsers fall back to Quirks Mode, where layout behaves like vintage Netscape and Internet Explorer, breaking modern CSS rules.",
    codeExample: `<!DOCTYPE html>
<html>
  <head>
    <title>Example</title>
  </head>
  <body>
    <h1>Hello</h1>
  </body>
</html>`,
    realWorldExample: "In modern HTML5, the declaration is intentionally case-insensitive and concise (<!DOCTYPE html>), replacing the long, complex DTD URLs used in HTML 4.01 and XHTML.",
    commonMistakes: [
      "Thinking <!DOCTYPE html> is an HTML tag (it is an instruction/declaration to the browser engine, not an element)."
    ],
    followUpQuestions: [
      "What happens if you omit <!DOCTYPE html> in an HTML file?",
      "What is Quirks Mode versus Standards Mode?"
    ],
    tags: ["html", "doctype", "standards-mode"]
  },

  // 3. Difference between an HTML element and an HTML tag?
  {
    subject: "HTML",
    questionNumber: 3,
    category: "HTML Fundamentals",
    difficulty: "easy",
    question: "What is the difference between an HTML element and an HTML tag?",
    shortAnswer: "A tag is the markup syntax such as <p> or </p>, whereas an element generally consists of the opening tag, content, and closing tag.",
    detailedAnswer: "Tags are the structural markers used to delimit elements in HTML source code. An element is the complete unit composed of the opening tag, its attributes, enclosed content or child nodes, and the closing tag.",
    codeExample: `<p>Hello World</p>

<!-- Breakdown:
  <p>         → Opening tag
  Hello World → Content
  </p>        → Closing tag
  Entire line → HTML Element
-->`,
    realWorldExample: "When JavaScript manipulates the DOM via document.querySelector('p'), it retrieves and modifies the entire HTML Element object, not just the tags.",
    commonMistakes: [
      "Using the terms 'tag' and 'element' interchangeably during technical interviews."
    ],
    followUpQuestions: [
      "What are void or self-closing elements that do not have content or closing tags?",
      "Can an HTML element have nested child elements?"
    ],
    tags: ["html", "elements", "tags"]
  },

  // 4. What are HTML attributes?
  {
    subject: "HTML",
    questionNumber: 4,
    category: "HTML Fundamentals",
    difficulty: "easy",
    question: "What are HTML attributes?",
    shortAnswer: "Attributes provide additional information, properties, or configuration for an HTML element, typically specified as name-value pairs in the opening tag.",
    detailedAnswer: "Attributes define element behavior, identity, styling hooks, and relationships. Common core attributes include id (unique identifier), class (styling and selection classification), src (source URL for media), and href (hyperlink destination).",
    codeExample: `<a href="https://example.com" target="_blank" class="nav-link">
  Visit Website
</a>

<!-- Here:
  href is an attribute specifying the link URL.
  target is an attribute instructing the browser to open a new tab.
  class is an attribute applying CSS styles.
-->`,
    realWorldExample: "Form inputs rely heavily on attributes like type='email', required, and placeholder to enforce validations natively before sending data to backend APIs.",
    commonMistakes: [
      "Placing attributes in the closing tag (attributes must always be placed exclusively inside the opening tag)."
    ],
    followUpQuestions: [
      "What is the difference between the id and class attributes?",
      "What are boolean attributes in HTML (e.g. required, disabled)?",
      "What are custom data attributes (data-*) used for?"
    ],
    tags: ["html", "attributes", "syntax"]
  },

  // 5. Block-level vs Inline elements
  {
    subject: "HTML",
    questionNumber: 5,
    category: "HTML Fundamentals",
    difficulty: "easy",
    question: "What is the difference between block-level and inline elements?",
    shortAnswer: "Block-level elements always start on a new line and occupy the full available width, while inline elements flow within surrounding text and only occupy the width of their content.",
    detailedAnswer: "Traditionally in HTML:\n- Block-level elements (<div>, <p>, <h1>-<h6>, <section>, <ul>) stack vertically and respect both width and height properties.\n- Inline elements (<span>, <a>, <strong>, <em>, <img>) sit horizontally alongside other text/elements and do not respect top/bottom margins or manual width/height settings unless changed via CSS display: inline-block or flex.",
    codeExample: `<!-- Block-level elements: Each starts on a new line -->
<div>First Block Container</div>
<p>Paragraph taking full available width</p>

<!-- Inline elements: Flow next to each other on the same line -->
<span>Inline word</span>
<a href="#link">Inline link</a>
<strong>Bold text</strong>`,
    realWorldExample: "In modern frontend development, CSS Flexbox and Grid override default display behaviors, but choosing semantic block vs inline elements remains fundamental for default accessibility and clean markup.",
    commonMistakes: [
      "Nesting block-level elements inside inline elements like putting a <div> inside a <p> or <span>, which is invalid HTML."
    ],
    followUpQuestions: [
      "What happens when you set display: inline-block in CSS?",
      "Why is <img> an inline element that still respects width and height?"
    ],
    tags: ["html", "layout", "block-vs-inline"]
  },

  // 6. What is Semantic HTML?
  {
    subject: "HTML",
    questionNumber: 6,
    category: "Semantic HTML",
    difficulty: "easy",
    question: "What is Semantic HTML and why should we use it?",
    shortAnswer: "Semantic HTML means using HTML elements that clearly convey the meaning and purpose of their content to both the browser and developers, rather than generic <div> tags.",
    detailedAnswer: "Elements like <header>, <nav>, <main>, <article>, <section>, and <footer> convey distinct roles in the document hierarchy. Benefits include:\n1. Accessibility: Screen readers use semantic landmarks to help visually impaired users navigate easily.\n2. SEO: Search engine crawlers (Googlebot) understand the importance of your main content and headlines.\n3. Maintainability: Code is readable, clean, and self-documenting for team members.",
    codeExample: `<!-- Bad: Non-semantic "div soup" -->
<div id="header">
  <div class="nav-links">...</div>
</div>
<div id="content">...</div>

<!-- Good: Semantic HTML5 -->
<header>
  <nav aria-label="Main Navigation">...</nav>
</header>
<main>
  <article>...</article>
</main>
<footer>...</footer>`,
    realWorldExample: "E-commerce and news platforms rely heavily on semantic HTML to achieve top Google search rankings (SEO) and comply with international accessibility laws (WCAG 2.1).",
    commonMistakes: [
      "Using <div> for clickable actions with an onClick listener instead of an accessible <button>."
    ],
    followUpQuestions: [
      "What is the difference between <main>, <article>, and <section>?",
      "How do semantic tags improve web accessibility (a11y)?"
    ],
    tags: ["html", "semantics", "seo", "accessibility"]
  },

  // 7. Difference between <main>, <article>, and <section>
  {
    subject: "HTML",
    questionNumber: 7,
    category: "Semantic HTML",
    difficulty: "easy",
    question: "What is the difference between <main>, <article>, and <section>?",
    shortAnswer: "<main> represents the dominant, unique content of the page; <article> is an independent, self-contained piece of content; <section> is a thematic grouping of related content.",
    detailedAnswer: "- <main>: Must be unique to the document and contain the primary topic of the page (never duplicate across pages like headers/footers).\n- <article>: Represents a self-contained composition that makes sense on its own if syndicated or shared (e.g., blog post, news story, comment card).\n- <section>: A generic thematic group of content, typically introduced by an appropriate heading (<h2>-<h6>).",
    codeExample: `<main>
  <h1>Tech News Daily</h1>
  
  <section id="breaking-news">
    <h2>Today's Headlines</h2>
    
    <article class="news-card">
      <h3>New Web Standards Released</h3>
      <p>The WHATWG published updated specifications today...</p>
    </article>
  </section>
</main>`,
    realWorldExample: "In a blog application, <main> holds the article page, <article> wraps the blog post body so RSS readers can extract it, and <section> divides the body into chapters or the comments section.",
    commonMistakes: [
      "Having multiple visible <main> elements on the same page (a page should only have one primary <main> landmark)."
    ],
    followUpQuestions: [
      "Can an <article> contain multiple <section> elements?",
      "Can a <section> contain multiple <article> elements?"
    ],
    tags: ["html", "semantics", "layout"]
  },

  // 8. What are void (self-closing) elements?
  {
    subject: "HTML",
    questionNumber: 8,
    category: "HTML Fundamentals",
    difficulty: "easy",
    question: "What are void (self-closing) elements in HTML?",
    shortAnswer: "Void elements are HTML elements that cannot have any child nodes or text content, and therefore do not require a closing tag.",
    detailedAnswer: "Void elements represent stand-alone items or metadata. Common void elements in HTML include <img>, <br>, <hr>, <input>, <link>, and <meta>. In modern HTML5, the trailing slash (e.g., <img />) is completely optional; <img src='...'> is standard and valid.",
    codeExample: `<!-- Common HTML5 void elements (no closing tag needed) -->
<img src="avatar.jpg" alt="User Profile">
<input type="text" name="username">
<link rel="stylesheet" href="styles.css">
<meta charset="UTF-8">
<br>
<hr>`,
    realWorldExample: "Form input elements (<input>) are void elements because their visual representation and value are controlled by attributes rather than inner HTML content.",
    commonMistakes: [
      "Trying to put text inside an <input> or <img> tag (e.g., <input>Click Me</input> is invalid HTML)."
    ],
    followUpQuestions: [
      "Is the trailing slash <br /> required in HTML5?",
      "How does JSX in React handle self-closing tags compared to standard HTML?"
    ],
    tags: ["html", "void-elements", "syntax"]
  },

  // 9. Difference between id and class attributes
  {
    subject: "HTML",
    questionNumber: 9,
    category: "HTML Fundamentals",
    difficulty: "easy",
    question: "What is the difference between id and class attributes in HTML?",
    shortAnswer: "An id must be globally unique across the entire HTML page and applies to only one element, whereas a class can be shared across multiple elements.",
    detailedAnswer: "- id: Unique identifier per document. Used for direct JavaScript selection (getElementById), internal anchor jump links (#section-id), and linking <label for='input-id'>.\n- class: Reusable classification hook. Used to apply shared CSS styling to many elements and group elements together.",
    codeExample: `<!-- Unique ID for primary navigation and anchor targeting -->
<nav id="primary-navigation" class="navbar shadow-lg">
  <!-- Multiple elements sharing the same class -->
  <a href="#home" class="nav-item active">Home</a>
  <a href="#about" class="nav-item">About</a>
  <a href="#contact" class="nav-item">Contact</a>
</nav>`,
    realWorldExample: "CSS design systems (like BEM, Bootstrap, and Tailwind) use classes exclusively for visual styling, reserving IDs for form associations (<label for='...'>) and accessibility landmarks.",
    commonMistakes: [
      "Using the same id on multiple elements on the same page, which breaks HTML validation, CSS styling hooks, and JavaScript getElementById."
    ],
    followUpQuestions: [
      "Which selector has higher specificity in CSS: an ID selector or a class selector?",
      "Can a single element have multiple classes assigned to it?"
    ],
    tags: ["html", "id", "class", "selectors"]
  },

  // 10. Purpose of alt attribute in <img>
  {
    subject: "HTML",
    questionNumber: 10,
    category: "Accessibility & Media",
    difficulty: "easy",
    question: "What is the purpose of the alt attribute in <img> tags?",
    shortAnswer: "The alt (alternative text) attribute provides a textual description of an image for screen readers and displays fallback text if the image fails to load.",
    detailedAnswer: "The alt attribute serves 3 key functions:\n1. Accessibility: Screen readers speak the text for blind and visually impaired users.\n2. Fallback: Displays in the browser when network errors, broken links, or slow connections prevent the image from rendering.\n3. SEO: Search engine bots read the alt text to index and categorize images in Google Image Search.",
    codeExample: `<!-- Accessible image with descriptive alt text -->
<img src="golden-retriever.jpg" alt="Golden retriever puppy sitting in green grass">

<!-- Decorative image: Use empty alt="" so screen readers ignore it -->
<img src="decorative-divider.svg" alt="" role="presentation">`,
    realWorldExample: "In e-commerce apps, writing clear alt text like 'Men\\'s waterproof hiking boot, olive green, side view' directly increases sales conversions from visually impaired users and boosts organic Google Search traffic.",
    commonMistakes: [
      "Omitting the alt attribute entirely, which causes screen readers to read the entire file URL (e.g., 'IMG_94827392_final.jpg').",
      "Writing redundant phrases like alt='Image of a cat' (screen readers already announce that it is an image)."
    ],
    followUpQuestions: [
      "When is it acceptable to leave an alt attribute empty (alt='')?",
      "What is the difference between the alt attribute and the title attribute on an image?"
    ],
    tags: ["html", "images", "accessibility", "seo"]
  },

  // 11. What is the purpose of the <head> element?
  {
    subject: "HTML",
    questionNumber: 11,
    category: "HTML Fundamentals",
    difficulty: "easy",
    question: "What is the purpose of the <head> element vs the <body> element?",
    shortAnswer: "The <head> contains metadata, document title, linked stylesheets, and scripts not visible on the page, while the <body> contains all visible content rendered to the user.",
    detailedAnswer: "- <head>: Holds document configurations, such as character encoding (<meta charset='UTF-8'>), responsive viewport settings, SEO descriptions, favicon links, and CSS imports (<link rel='stylesheet'>).\n- <body>: Holds all renderable UI elements that users interact with, including text, buttons, images, forms, and layouts.",
    codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Metadata & Configuration (invisible to user) -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Overview</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- Visible UI Content -->
  <h1>Welcome Back, Alex!</h1>
  <p>Here is your daily activity summary.</p>
</body>
</html>`,
    realWorldExample: "Search engines and social sharing platforms (Twitter, LinkedIn, Slack) crawl tags inside the <head> to generate rich preview cards when users share a URL.",
    commonMistakes: [
      "Placing visible content tags like <h1> or <p> inside the <head> tag."
    ],
    followUpQuestions: [
      "What is the purpose of the <meta name='viewport'> tag?",
      "Where should script tags ideally be placed: in <head> or at the end of <body>?"
    ],
    tags: ["html", "head", "body", "document-structure"]
  },

  // 12. What is the purpose of <meta name="viewport">?
  {
    subject: "HTML",
    questionNumber: 12,
    category: "HTML Fundamentals",
    difficulty: "easy",
    question: "What is the purpose of the <meta name='viewport'> tag?",
    shortAnswer: "The viewport meta tag configures how a web page scales and displays on mobile devices, ensuring responsive design works properly.",
    detailedAnswer: "Without this tag, mobile browsers assume desktop web pages and render them at a default virtual width (typically 980px), shrinking the text and forcing users to pinch-and-zoom. The standard tag sets the viewport width to match the device's physical screen and initializes 1:1 scale.",
    codeExample: `<head>
  <!-- Standard Responsive Viewport Tag -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>`,
    realWorldExample: "Every modern responsive website built with CSS media queries, Tailwind CSS, or Bootstrap requires this tag on line 3 to enable proper mobile layout adjustments.",
    commonMistakes: [
      "Adding user-scalable=no or maximum-scale=1.0, which disables user zooming and severely harms accessibility for visually impaired individuals."
    ],
    followUpQuestions: [
      "What does width=device-width mean?",
      "What does initial-scale=1.0 control?"
    ],
    tags: ["html", "viewport", "responsive-design", "mobile"]
  },

  // 13. How does the anchor tag <a> work?
  {
    subject: "HTML",
    questionNumber: 13,
    category: "Links & Navigation",
    difficulty: "easy",
    question: "How does the anchor tag <a> work and what are its key attributes?",
    shortAnswer: "The anchor tag <a> creates hyperlinks to other web pages, email addresses, phone numbers, files, or specific sections on the same page using the href attribute.",
    detailedAnswer: "The primary attribute is href (hypertext reference). Key attributes include:\n- href: Destination URL, relative path, internal fragment (#id), or protocol (mailto:, tel:).\n- target: Specifies where to open the link (_self for same tab, _blank for new tab).\n- rel: Relationship specifier (noopener, noreferrer, nofollow).\n- download: Prompts the browser to download the linked resource rather than navigating to it.",
    codeExample: `<!-- Link to external website in new tab -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  External Website
</a>

<!-- Jump to section on same page -->
<a href="#pricing-section">Jump to Pricing</a>

<!-- Email and Telephone links -->
<a href="mailto:support@company.com">Email Support</a>
<a href="tel:+18005550199">Call Support</a>`,
    realWorldExample: "Navigation menus in single-page applications (React Router, Next.js) wrap underlying anchor tags to enable seamless client-side routing while preserving standard browser history.",
    commonMistakes: [
      "Using <a href='#'> as a button replacement without role='button' or keyboard handling (use a native <button> instead)."
    ],
    followUpQuestions: [
      "Why must you always add rel='noopener noreferrer' when using target='_blank'?",
      "What is the difference between a relative URL and an absolute URL in href?"
    ],
    tags: ["html", "links", "anchor", "navigation"]
  },

  // 14. Why rel="noopener noreferrer" with target="_blank"?
  {
    subject: "HTML",
    questionNumber: 14,
    category: "Security & Navigation",
    difficulty: "intermediate",
    question: "Why should you always include rel='noopener noreferrer' when opening links in a new tab (target='_blank')?",
    shortAnswer: "It prevents security vulnerabilities (Tabnabbing) and performance bottlenecks by ensuring the new page runs in a separate process and cannot hijack window.opener.",
    detailedAnswer: "When you open an external page with target='_blank' without noopener:\n1. Reverse Tabnabbing Vulnerability: The newly opened page gains access to window.opener. It can execute window.opener.location = 'https://fake-phishing-site.com', tricking the user into re-entering their login credentials.\n2. Threading: The new page may run on the same execution thread as your site, causing your app to lag if the external page executes heavy JavaScript.\nModern browsers now apply noopener by default for target='_blank', but explicitly adding it remains a frontend security standard.",
    codeExample: `<!-- Secure external link pattern -->
<a href="https://partner-website.com" target="_blank" rel="noopener noreferrer">
  Visit Partner Site
</a>`,
    realWorldExample: "Social networks (Twitter, Facebook, LinkedIn) enforce rel='noopener noreferrer' on all user-submitted external links to safeguard user accounts from malicious third-party redirects.",
    commonMistakes: [
      "Assuming modern browser auto-defaults protect older browsers and mobile WebViews without writing explicit rel attributes."
    ],
    followUpQuestions: [
      "What is the specific difference between noopener and noreferrer?",
      "Does noreferrer also strip HTTP Referer headers?"
    ],
    tags: ["html", "security", "links", "target-blank"]
  },

  // 15. Difference between <b> / <i> and <strong> / <em>
  {
    subject: "HTML",
    questionNumber: 15,
    category: "HTML Fundamentals",
    difficulty: "easy",
    question: "What is the difference between <b> / <i> and <strong> / <em> in HTML?",
    shortAnswer: "<b> and <i> only apply visual styling (bold/italic) with no semantic meaning, while <strong> and <em> convey strong importance and verbal stress for screen readers.",
    detailedAnswer: "- <b>: Stylistic offset without extra importance (visual bold).\n- <strong>: Indicates strong importance, seriousness, or urgency. Screen readers announce this with vocal inflection.\n- <i>: Stylistic italicization (e.g. taxonomic names, foreign phrases).\n- <em>: Semantic stress emphasis that changes the verbal meaning of a sentence.",
    codeExample: `<p>
  <!-- Purely visual styling -->
  The chemical symbol for water is <b>H2O</b>.
  
  <!-- Semantic importance: Screen reader announces with urgency -->
  <strong>Warning:</strong> Always disconnect power before servicing.
  
  <!-- Semantic stress emphasis -->
  I did not say <em>you</em> stole the money.
</p>`,
    realWorldExample: "Accessibility audit tools (Lighthouse, Axe) flag text requiring user attention if written with <b> instead of <strong> because visually impaired screen reader users miss the warning.",
    commonMistakes: [
      "Using <b> or <i> purely for visual CSS decoration instead of font-weight: bold or font-style: italic in CSS."
    ],
    followUpQuestions: [
      "How do screen readers interpret <strong> vs <b>?",
      "Can CSS change the appearance of <em> to normal text while retaining semantic meaning?"
    ],
    tags: ["html", "formatting", "typography", "semantics"]
  },

  // 16. HTML Forms: GET vs POST
  {
    subject: "HTML",
    questionNumber: 16,
    category: "Forms & Inputs",
    difficulty: "easy",
    question: "What is the difference between GET and POST form submission methods?",
    shortAnswer: "GET appends form data to the URL as query parameters, making it visible and bookmarkable; POST sends data in the HTTP request body, keeping it confidential and allowing large payloads.",
    detailedAnswer: "- GET:\n  - Appends key-value pairs to the URL (e.g., /search?q=javascript).\n  - Best for safe, idempotent read-only actions like searches and filters.\n  - Limited by URL length restrictions (~2048 characters) and cached by browsers.\n- POST:\n  - Sends data in the HTTP request body.\n  - Used for modifying server state, submitting passwords, personal information, or file uploads.\n  - Not cached by default and has no strict size limitations.",
    codeExample: `<!-- GET: Search query (visible in URL, bookmarkable) -->
<form action="/search" method="GET">
  <input type="text" name="q" placeholder="Search articles...">
  <button type="submit">Search</button>
</form>

<!-- POST: User registration (secure body payload) -->
<form action="/api/register" method="POST">
  <input type="email" name="email" required>
  <input type="password" name="password" required>
  <button type="submit">Create Account</button>
</form>`,
    realWorldExample: "Google and Amazon use GET for search results so users can copy and share direct URLs, while checkout and payment forms strictly use POST to protect credit card data.",
    commonMistakes: [
      "Using GET method for password or login forms, exposing user credentials in browser history, proxy logs, and server access logs."
    ],
    followUpQuestions: [
      "Why should you never send passwords with method='GET'?",
      "What enctype attribute is required when uploading files via a POST form?"
    ],
    tags: ["html", "forms", "get-vs-post", "http"]
  },

  // 17. Purpose of <label> tag and "for" attribute
  {
    subject: "HTML",
    questionNumber: 17,
    category: "Forms & Inputs",
    difficulty: "easy",
    question: "What is the purpose of the <label> tag and the 'for' attribute in HTML forms?",
    shortAnswer: "The <label> tag provides a text caption for a form control, and its 'for' attribute links it to the input's id to improve accessibility and expand click targets.",
    detailedAnswer: "Benefits of properly paired labels:\n1. Accessibility: When a screen reader focuses on the input, it speaks the linked label text.\n2. Usability: Clicking anywhere on the label text automatically focuses the text input or toggles a small checkbox/radio button, which is critical on mobile screens.",
    codeExample: `<!-- Explicit association using 'for' attribute matching input 'id' -->
<label for="user-email">Email Address:</label>
<input type="email" id="user-email" name="email">

<!-- Checkbox with enlarged tap target -->
<input type="checkbox" id="terms-checkbox" name="terms">
<label for="terms-checkbox">I agree to the Terms of Service</label>`,
    realWorldExample: "On mobile devices, tapping small 16px checkboxes is frustrating. Linking a label allows users to tap the entire text label to check the box seamlessly.",
    commonMistakes: [
      "Using the input's name attribute instead of its id in the label's for attribute (for must match id, not name)."
    ],
    followUpQuestions: [
      "Can an input be nested directly inside a <label> without using a 'for' attribute?",
      "Why is placeholder not an acceptable replacement for a <label>?"
    ],
    tags: ["html", "forms", "accessibility", "labels"]
  },

  // 18. Placeholder vs Value attribute
  {
    subject: "HTML",
    questionNumber: 18,
    category: "Forms & Inputs",
    difficulty: "easy",
    question: "What is the difference between the placeholder and value attributes of an input?",
    shortAnswer: "placeholder is temporary hint text that disappears when the user types; value is the actual data content stored and submitted with the form.",
    detailedAnswer: "- placeholder: Displays brief guidance (e.g. 'john@example.com') in faded text when the field is empty. It is not submitted with the form.\n- value: Contains the actual input value submitted to the backend. It can be pre-filled with default data and modified by the user.",
    codeExample: `<!-- Placeholder: Hint text (disappears on typing) -->
<input type="text" name="city" placeholder="e.g. San Francisco">

<!-- Value: Actual initial data pre-populated -->
<input type="text" name="country" value="United States">`,
    realWorldExample: "In user profile settings forms, value pre-fills existing user names and emails, while placeholder indicates the expected format on new empty fields.",
    commonMistakes: [
      "Using placeholder instead of a <label>, which causes usability and accessibility issues when the hint disappears once typing begins."
    ],
    followUpQuestions: [
      "Does a placeholder get submitted to the server if the user leaves the input blank?",
      "How do you style placeholder text using CSS?"
    ],
    tags: ["html", "forms", "inputs", "attributes"]
  },

  // 19. Disabled vs Readonly
  {
    subject: "HTML",
    questionNumber: 19,
    category: "Forms & Inputs",
    difficulty: "easy",
    question: "What is the difference between disabled and readonly attributes in form inputs?",
    shortAnswer: "readonly inputs cannot be edited but can be focused and ARE submitted with the form; disabled inputs are completely inactive, unfocusable, and are NOT submitted with the form.",
    detailedAnswer: "Key differences:\n- disabled: Elements appear visually grayed out by default, cannot receive user focus or tab navigation, and their values are omitted from the form submission payload.\n- readonly: Elements display normally, users can click, select, copy text, and tab into them, and their values are included when submitting the form.",
    codeExample: `<!-- Readonly: User cannot change, but value IS sent to server -->
<input type="text" name="account_id" value="ACC-99824" readonly>

<!-- Disabled: Inactive, cannot focus, value IS NOT sent to server -->
<input type="text" name="promo_code" value="DISCOUNT20" disabled>`,
    realWorldExample: "A checkout form marks customer Account ID as readonly so it cannot be tampered with yet submits with the order, while a 'Pay with Card' button is disabled until the user fills in valid card details.",
    commonMistakes: [
      "Expecting a disabled input value to arrive at your backend server API (disabled fields are never serialized in form submissions)."
    ],
    followUpQuestions: [
      "Can select dropdowns or checkboxes use the readonly attribute?",
      "How do you style disabled elements using CSS pseudo-classes (:disabled)?"
    ],
    tags: ["html", "forms", "inputs", "validation"]
  },

  // 20. Button vs Input type="button"
  {
    subject: "HTML",
    questionNumber: 20,
    category: "Forms & Inputs",
    difficulty: "easy",
    question: "What is the difference between <button> and <input type='button'> in HTML?",
    shortAnswer: "<button> is a container element that can hold HTML content (icons, images, formatted text), while <input type='button'> only accepts plain text via its value attribute.",
    detailedAnswer: "- <button>: Has opening and closing tags. Can contain rich HTML, SVG icons, badges, and pseudo-elements. Inside a <form>, its default type is type='submit' unless explicitly set to type='button'.\n- <input type='button'>: A void element with no inner HTML. Its label is strictly defined by the value='...' attribute.",
    codeExample: `<!-- Rich <button> with SVG icon and styled text -->
<button type="button" class="btn-primary">
  <svg width="16" height="16" fill="currentColor">...</svg>
  <span>Download PDF</span>
</button>

<!-- Basic input button (plain text only) -->
<input type="button" value="Download PDF">`,
    realWorldExample: "Modern UI libraries (Material UI, Tailwind components, Shadcn) universally use native <button> elements because they support flexible nested icons, spinners, and badges.",
    commonMistakes: [
      "Forgetting to specify type='button' inside a form, causing an unexpected page refresh because the default button type in forms is 'submit'."
    ],
    followUpQuestions: [
      "What are the three valid values for a button's type attribute (submit, reset, button)?",
      "What happens if you click a button inside a form without specifying type='button'?"
    ],
    tags: ["html", "buttons", "forms", "ui"]
  },

  // 21. Client-side form validation attributes
  {
    subject: "HTML",
    questionNumber: 21,
    category: "Forms & Inputs",
    difficulty: "easy",
    question: "What are the built-in HTML5 form validation attributes?",
    shortAnswer: "HTML5 provides native validation attributes such as required, pattern, min, max, minlength, maxlength, and specialized input types like email and url.",
    detailedAnswer: "HTML5 validation runs in the browser before JavaScript or network requests execute:\n- required: Ensures field is not empty.\n- pattern: Validates input against a regular expression (regex).\n- min / max: Enforces numerical or date limits.\n- minlength / maxlength: Controls character count limits.\n- type='email' / 'url' / 'number': Automatically validates formats.",
    codeExample: `<form action="/submit" method="POST">
  <!-- Required text with length constraints -->
  <input type="text" name="username" required minlength="3" maxlength="20">
  
  <!-- Automatic email syntax validation -->
  <input type="email" name="user_email" required>
  
  <!-- Number input with range and step increments -->
  <input type="number" name="quantity" min="1" max="10" step="1" value="1">
  
  <!-- Custom regex pattern (e.g. 5-digit US ZIP code) -->
  <input type="text" name="zip" pattern="[0-9]{5}" title="Five digit zip code">
  
  <button type="submit">Submit</button>
</form>`,
    realWorldExample: "Native HTML5 validations give instant feedback to mobile users without waiting for heavy JavaScript libraries to load or executing server round-trips.",
    commonMistakes: [
      "Relying solely on HTML5 frontend validation for application security (always validate data on backend servers, as HTML can be bypassed using developer tools)."
    ],
    followUpQuestions: [
      "How can you disable native browser validation using the novalidate attribute?",
      "What is the Constraint Validation API in JavaScript (e.g. checkValidity())?"
    ],
    tags: ["html", "forms", "validation", "security"]
  },

  // 22. Accessible Table Structure
  {
    subject: "HTML",
    questionNumber: 22,
    category: "Tables",
    difficulty: "easy",
    question: "How do you construct an accessible table in HTML?",
    shortAnswer: "Use semantic table elements: <table>, <caption>, <thead>, <tbody>, <tfoot>, <tr>, <th>, and <td>, along with the scope attribute on header cells.",
    detailedAnswer: "Proper table architecture:\n- <caption>: Summarizes the table's purpose for screen readers.\n- <thead>: Wraps column headers defined with <th>.\n- <tbody>: Wraps the core data rows (<tr>) and cells (<td>).\n- <tfoot>: Summarizes calculations (e.g. totals) at the bottom.\n- scope='col' / 'row': Explicitly links header cells to corresponding columns/rows for assistive tech.",
    codeExample: `<table>
  <caption>Quarterly Sales Report 2026</caption>
  <thead>
    <tr>
      <th scope="col">Product</th>
      <th scope="col">Units Sold</th>
      <th scope="col">Revenue</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Pro Laptop</th>
      <td>1,200</td>
      <td>$1,440,000</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Total</th>
      <td>1,200</td>
      <td>$1,440,000</td>
    </tr>
  </tfoot>
</table>`,
    realWorldExample: "Financial dashboards and reporting platforms structure tabular financial data with proper <th> scope attributes so blind financial analysts can interpret spreadsheets via screen readers.",
    commonMistakes: [
      "Using HTML tables for website page layouts (tables should strictly be reserved for tabular data, using CSS Flex/Grid for layouts)."
    ],
    followUpQuestions: [
      "What are the colspan and rowspan attributes in table cells?",
      "Why is scope='col' important for screen reader navigation?"
    ],
    tags: ["html", "tables", "accessibility"]
  },

  // 23. Difference between colspan and rowspan
  {
    subject: "HTML",
    questionNumber: 23,
    category: "Tables",
    difficulty: "easy",
    question: "What is the difference between colspan and rowspan attributes in table cells?",
    shortAnswer: "colspan merges a cell across multiple columns horizontally, while rowspan merges a cell across multiple rows vertically.",
    detailedAnswer: "- colspan='N': Causes a <th> or <td> to stretch across N adjacent columns to the right.\n- rowspan='N': Causes a <th> or <td> to span downward across N adjacent rows below.",
    codeExample: `<table border="1">
  <tr>
    <!-- Spans horizontally across 2 columns -->
    <th colspan="2">Student Information</th>
  </tr>
  <tr>
    <!-- Spans vertically across 2 rows -->
    <td rowspan="2">Active Status</td>
    <td>Name: Jane Doe</td>
  </tr>
  <tr>
    <td>Grade: A+</td>
  </tr>
</table>`,
    realWorldExample: "Used in invoice tables where the 'Total Amount' row has a cell that spans across Product, Quantity, and Unit Price columns using colspan='3'.",
    commonMistakes: [
      "Forgetting to remove cells in neighboring rows or columns when applying span attributes, which breaks table layout alignment."
    ],
    followUpQuestions: [
      "What happens if colspan is larger than the actual number of columns defined in the table?",
      "Can colspan and rowspan be combined on the same table cell?"
    ],
    tags: ["html", "tables", "layout"]
  },

  // 24. Difference between <script>, <script async>, and <script defer>
  {
    subject: "HTML",
    questionNumber: 24,
    category: "HTML & Browser Performance",
    difficulty: "intermediate",
    question: "What is the difference between <script>, <script async>, and <script defer>?",
    shortAnswer: "Regular scripts block HTML parsing while downloading and executing; async downloads in parallel and executes immediately upon arrival (blocking parsing); defer downloads in parallel and executes after HTML parsing completes in order.",
    detailedAnswer: "Browser parsing behavior:\n1. Regular <script>: HTML parsing pauses -> script downloads -> script executes -> HTML parsing resumes. Blocks DOM construction.\n2. <script async>: Script downloads in background without pausing HTML parsing. The moment download finishes, parsing pauses while the script executes. Execution order is unpredictable.\n3. <script defer>: Script downloads in background without pausing HTML parsing. It waits and executes only after HTML parsing is completely finished, preserving script execution order.",
    codeExample: `<!-- Blocks parsing: Avoid in <head> -->
<script src="heavy-bundle.js"></script>

<!-- Independent scripts (analytics, ads): Runs immediately when downloaded -->
<script async src="https://analytics.com/tracker.js"></script>

<!-- Application code (DOM-dependent): Runs safely after DOM is ready in order -->
<script defer src="vendor.js"></script>
<script defer src="app.js"></script>`,
    realWorldExample: "Critical application code is loaded using defer so DOM nodes are guaranteed to exist, while independent third-party trackers (Google Analytics) use async so they don't delay page rendering.",
    commonMistakes: [
      "Using async for scripts that depend on each other (e.g., jQuery and a jQuery plugin), leading to 'Uncaught ReferenceError' race conditions."
    ],
    followUpQuestions: [
      "Do async and defer have any effect on inline scripts (<script>...</script>)?",
      "Which script loading strategy is optimal for Core Web Vitals (LCP and INP)?"
    ],
    tags: ["html", "performance", "scripts", "async", "defer"]
  },

  // 25. localStorage vs sessionStorage vs cookies
  {
    subject: "HTML",
    questionNumber: 25,
    category: "Web Storage & APIs",
    difficulty: "intermediate",
    question: "What is the difference between localStorage, sessionStorage, and Cookies?",
    shortAnswer: "localStorage persists permanently until cleared (~5MB); sessionStorage persists only for the current browser tab session (~5MB); cookies are small data stores (~4KB) sent automatically to the server with every HTTP request.",
    detailedAnswer: "- localStorage: Stored per origin with no expiration date. Survives browser restarts. Capacity ~5-10MB.\n- sessionStorage: Isolated per browser tab. Cleared automatically when the tab or browser window is closed. Capacity ~5MB.\n- Cookies: Created with an expiration time. Small capacity (~4KB). Crucially, cookies are automatically attached to HTTP request headers (Cookie: ...), making them ideal for authentication session tokens.",
    codeExample: `// localStorage: Permanent client storage
localStorage.setItem('theme', 'dark');
const theme = localStorage.getItem('theme');

// sessionStorage: Single tab session
sessionStorage.setItem('currentStep', 'step-2');

// Cookie: Sent to server with HTTP requests
document.cookie = "sessionId=xyz123; Secure; HttpOnly; SameSite=Strict";`,
    realWorldExample: "Web apps store theme preferences (dark mode) in localStorage, temporary multi-step wizard state in sessionStorage, and user auth tokens in HttpOnly cookies.",
    commonMistakes: [
      "Storing sensitive data like JWT tokens or passwords in localStorage, making them vulnerable to Cross-Site Scripting (XSS) theft."
    ],
    followUpQuestions: [
      "What is the HttpOnly flag on cookies and why does it prevent XSS attacks?",
      "Can localStorage be accessed from web workers?"
    ],
    tags: ["html", "storage", "cookies", "localstorage"]
  },

  // 26. Purpose of the <picture> element
  {
    subject: "HTML",
    questionNumber: 26,
    category: "Accessibility & Media",
    difficulty: "intermediate",
    question: "What is the purpose of the <picture> element in HTML5?",
    shortAnswer: "The <picture> element provides responsive image art direction and format fallback by serving different image files based on screen width, device pixel ratio, or supported image formats.",
    detailedAnswer: "The <picture> element contains zero or more <source> elements and one fallback <img> element. The browser evaluates each source from top to bottom and loads the first match.\nUse cases:\n1. Next-gen format serving: Serve modern WebP or AVIF images with fallback to standard JPEG.\n2. Art direction: Serve a square-cropped image for mobile screens and a wide panoramic landscape for desktop screens.",
    codeExample: `<picture>
  <!-- Modern AVIF format for supporting browsers -->
  <source srcset="hero.avif" type="image/avif">
  
  <!-- WebP format fallback -->
  <source srcset="hero.webp" type="image/webp">
  
  <!-- Mobile-specific cropped portrait image -->
  <source media="(max-width: 600px)" srcset="hero-mobile.jpg">
  
  <!-- Standard fallback <img> (mandatory for rendering and alt text) -->
  <img src="hero-desktop.jpg" alt="Mountain landscape at sunrise" loading="lazy">
</picture>`,
    realWorldExample: "Modern media sites use <picture> to serve 80% smaller AVIF images to modern browsers while maintaining 100% backward compatibility with older devices.",
    commonMistakes: [
      "Omitting the fallback <img> tag inside <picture> (the <img> tag is required; without it, nothing will render)."
    ],
    followUpQuestions: [
      "What is the difference between the <picture> tag and <img> with srcset/sizes?",
      "How does loading='lazy' improve website performance?"
    ],
    tags: ["html", "images", "responsive", "picture-element"]
  },

  // 27. What is the <dialog> element?
  {
    subject: "HTML",
    questionNumber: 27,
    category: "Modern HTML5 APIs",
    difficulty: "intermediate",
    question: "What is the HTML5 <dialog> element and how does it work?",
    shortAnswer: "The <dialog> element is a native HTML5 modal and popup component featuring built-in backdrop styling, keyboard Escape dismissal, and focus trapping.",
    detailedAnswer: "Before <dialog>, developers wrote complex JavaScript libraries to build modal dialogs, handle backdrop overlays, and trap keyboard focus. With HTML5:\n- dialog.showModal(): Opens an accessible modal with a native backdrop (styled via ::backdrop) and traps focus inside the modal.\n- dialog.show(): Opens a non-modal popup.\n- dialog.close(): Closes the dialog programmatically.",
    codeExample: `<!-- Native HTML5 Modal Dialog -->
<dialog id="confirm-modal">
  <form method="dialog">
    <h2>Confirm Delete</h2>
    <p>Are you sure you want to delete this file?</p>
    <button value="cancel">Cancel</button>
    <button value="confirm" class="btn-danger">Delete</button>
  </form>
</dialog>

<button onclick="document.getElementById('confirm-modal').showModal()">
  Delete File
</button>`,
    realWorldExample: "Modern web applications replace third-party modal packages with native <dialog> to reduce bundle sizes by tens of kilobytes while achieving automatic WCAG keyboard accessibility.",
    commonMistakes: [
      "Using dialog.show() instead of dialog.showModal() when a full backdrop modal is desired (show() does not dim background content or trap focus)."
    ],
    followUpQuestions: [
      "How do you style the darkened backdrop behind a modal using CSS (::backdrop)?",
      "How does <form method='dialog'> close the modal without sending an HTTP request?"
    ],
    tags: ["html", "dialog", "modal", "html5"]
  },

  // 28. What is the <template> tag?
  {
    subject: "HTML",
    questionNumber: 28,
    category: "Modern HTML5 APIs",
    difficulty: "intermediate",
    question: "What is the <template> tag and how does it differ from a hidden <div>?",
    shortAnswer: "The <template> tag holds client-side HTML markup that is parsed by the browser but NOT rendered or executed until cloned and inserted into the DOM via JavaScript.",
    detailedAnswer: "Key differences from a hidden <div style='display: none'>:\n1. Inert Content: Scripts inside a <template> do not execute, images/videos do not download, and audio does not play while it sits inside <template>.\n2. Performance: Browser does not paint or calculate styles for template contents.\n3. DOM Insertion: JavaScript clones the template's content property (template.content.cloneNode(true)) and appends it to live elements.",
    codeExample: `<!-- Template definition (invisible and inert) -->
<template id="user-card-template">
  <div class="user-card">
    <h3 class="user-name"></h3>
    <p class="user-email"></p>
  </div>
</template>

<div id="user-list"></div>

<script>
  const template = document.getElementById('user-card-template');
  const clone = template.content.cloneNode(true);
  clone.querySelector('.user-name').textContent = 'Sarah Jenkins';
  clone.querySelector('.user-email').textContent = 'sarah@example.com';
  document.getElementById('user-list').appendChild(clone);
</script>`,
    realWorldExample: "Web Components and frontend micro-libraries use <template> tags as clean blueprints for dynamic lists without relying on messy string concatenation like innerHTML = '<div>...</div>'.",
    commonMistakes: [
      "Trying to access template elements directly with document.getElementById inside the template instead of inspecting template.content."
    ],
    followUpQuestions: [
      "What is the relationship between the <template> tag and Web Components (Shadow DOM)?",
      "What is the difference between <template> and <slot>?"
    ],
    tags: ["html", "template", "web-components", "dom"]
  },

  // 29. Custom Data Attributes (data-*)
  {
    subject: "HTML",
    questionNumber: 29,
    category: "HTML Fundamentals",
    difficulty: "easy",
    question: "What are Custom Data Attributes (data-*) in HTML5?",
    shortAnswer: "Data attributes (data-*) allow developers to store extra custom data directly on HTML elements without affecting rendering, accessible via JavaScript dataset.",
    detailedAnswer: "Syntax starts with data- followed by a lowercase identifier. In JavaScript, they are accessed through the element's dataset property in camelCase (e.g., data-user-id becomes element.dataset.userId). In CSS, they can be targeted using attribute selectors [data-status='active'].",
    codeExample: `<!-- HTML element with custom data attributes -->
<button 
  class="btn-action" 
  data-action="delete" 
  data-user-id="4082" 
  data-is-admin="true"
>
  Remove User
</button>

<script>
  const btn = document.querySelector('.btn-action');
  console.log(btn.dataset.action); // "delete"
  console.log(btn.dataset.userId); // "4082"
</script>`,
    realWorldExample: "Analytics tracking scripts (Google Tag Manager) attach data-tracking-category and data-tracking-label to buttons so event analytics trigger automatically without touching JavaScript event code.",
    commonMistakes: [
      "Storing sensitive personal data or passwords in data-* attributes (data attributes are completely visible in the browser DOM inspector)."
    ],
    followUpQuestions: [
      "How does CSS target elements with data attributes (e.g., [data-theme='dark'])?",
      "How does JavaScript convert kebab-case data attributes into camelCase dataset keys?"
    ],
    tags: ["html", "data-attributes", "javascript", "dom"]
  },

  // 30. Purpose of <details> and <summary>
  {
    subject: "HTML",
    questionNumber: 30,
    category: "Modern HTML5 APIs",
    difficulty: "easy",
    question: "What is the purpose of the <details> and <summary> elements?",
    shortAnswer: "They create native interactive disclosure accordions that toggle content visibility without requiring any JavaScript.",
    detailedAnswer: "- <details>: The wrapper element that controls visibility. Adding the open attribute causes it to be expanded by default.\n- <summary>: The clickable heading or label displayed when collapsed. Clicking it automatically reveals or hides the contents inside <details> with built-in keyboard Space/Enter toggle support.",
    codeExample: `<!-- Native Accordion / Collapsible Section -->
<details>
  <summary>What is your refund policy?</summary>
  <p>We offer a 30-day money-back guarantee with zero questions asked.</p>
</details>

<!-- Open by default -->
<details open>
  <summary>System Requirements</summary>
  <p>Requires Node.js version 18 or higher.</p>
</details>`,
    realWorldExample: "FAQ sections and dropdown disclosures use native <details> to eliminate bulky accordion JavaScript libraries and improve page load performance.",
    commonMistakes: [
      "Adding custom JavaScript click event listeners to toggle details when the browser already handles opening and closing natively."
    ],
    followUpQuestions: [
      "How can you style the disclosure marker arrow in CSS (using ::marker)?",
      "What event does the <details> element dispatch when toggled (toggle event)?"
    ],
    tags: ["html", "details", "summary", "accordion"]
  },

  // 31. SVG vs Canvas
  {
    subject: "HTML",
    questionNumber: 31,
    category: "Graphics & Media",
    difficulty: "intermediate",
    question: "What is the difference between SVG and Canvas in HTML5?",
    shortAnswer: "SVG is vector-based (XML in DOM, resolution independent, scalable, styled with CSS); Canvas is pixel-based (raster bitmap, drawn via JavaScript procedural commands, high performance for games).",
    detailedAnswer: "- SVG (Scalable Vector Graphics):\n  - XML-based vector format existing directly in the DOM tree.\n  - Supports CSS styling, hover effects, and JavaScript DOM click events per shape.\n  - Scales infinitely with zero pixelation at any resolution.\n- Canvas (<canvas>):\n  - Pixel-based raster grid manipulated procedurally with 2D or WebGL context in JavaScript.\n  - Shapes are not DOM elements (no individual event listeners).\n  - Exceptionally fast for rendering thousands of fast-moving particles, charts, and 2D/3D games.",
    codeExample: `<!-- SVG: XML nodes in the DOM with CSS/events -->
<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
</svg>

<!-- Canvas: Blank bitmap drawn via JavaScript -->
<canvas id="myCanvas" width="200" height="100"></canvas>
<script>
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(0, 0, 150, 75);
</script>`,
    realWorldExample: "Websites use SVG for logos, UI icons, and responsive diagrams; they use Canvas for interactive data charting (Chart.js), photo editing tools, and browser games.",
    commonMistakes: [
      "Using Canvas for simple UI icons instead of SVG, which causes icons to blur on high-density Retina displays."
    ],
    followUpQuestions: [
      "Why is SVG accessible to screen readers while Canvas requires manual ARIA fallbacks?",
      "Which technology performs better when animating 10,000 objects simultaneously: SVG or Canvas?"
    ],
    tags: ["html", "svg", "canvas", "graphics"]
  },

  // 32. <datalist> vs <select>
  {
    subject: "HTML",
    questionNumber: 32,
    category: "Forms & Inputs",
    difficulty: "easy",
    question: "What is the <datalist> element and how does it differ from <select>?",
    shortAnswer: "<datalist> provides autocomplete recommendations for a standard text <input> while still allowing custom text entry; <select> restricts the user strictly to a pre-defined list of choices.",
    detailedAnswer: "- <datalist>: Linked to an <input> via the list attribute. As the user types, suggestions filter automatically. Users can pick a suggestion OR type anything custom.\n- <select>: A traditional dropdown menu where the user can only choose from the designated <option> elements and cannot type custom values.",
    codeExample: `<!-- Datalist: Autocomplete suggestions + custom typing allowed -->
<label for="browser-choice">Choose or type your browser:</label>
<input list="browsers" id="browser-choice" name="browser">

<datalist id="browsers">
  <option value="Chrome">
  <option value="Firefox">
  <option value="Safari">
  <option value="Edge">
</datalist>`,
    realWorldExample: "Search engines and city selectors use <datalist> to suggest popular airports or cities while still allowing users to type a custom location if it is not in the list.",
    commonMistakes: [
      "Forgetting to connect the input to the datalist using the list='id' attribute."
    ],
    followUpQuestions: [
      "Does <datalist> have full browser support across modern browsers?",
      "Can options in a <datalist> have separate display text and submit values?"
    ],
    tags: ["html", "forms", "datalist", "select", "autocomplete"]
  },

  // 33. Tabindex attribute
  {
    subject: "HTML",
    questionNumber: 33,
    category: "Accessibility & Keyboard Navigation",
    difficulty: "intermediate",
    question: "What is the tabindex attribute and what do values 0, -1, and positive numbers do?",
    shortAnswer: "tabindex controls whether an element can receive keyboard Tab focus and its order in sequential navigation: 0 adds to natural order, -1 allows programmatic focus only, and positive numbers force custom order (avoid).",
    detailedAnswer: "Values breakdown:\n- tabindex='0': Inserts an otherwise unfocusable element (like a custom <div> card) into the natural document keyboard Tab order.\n- tabindex='-1': Removes an element from sequential Tab navigation, but allows programmatic focus via JavaScript (element.focus()). Essential for modal dialogs and notification banners.\n- tabindex='1' (positive): Enforces an artificial tab order, which disrupts natural navigation and is considered an anti-pattern.",
    codeExample: `<!-- tabindex="0": Focusable via keyboard Tab key -->
<div tabindex="0" role="button" aria-pressed="false" class="custom-card">
  Interactive Custom Card
</div>

<!-- tabindex="-1": Focusable ONLY via JavaScript element.focus() -->
<div id="status-toast" tabindex="-1" role="alert">
  Form submitted successfully!
</div>`,
    realWorldExample: "When an accessible modal opens, frontend frameworks move focus to the modal container with tabindex='-1' via modalRef.focus() so screen reader users hear the dialog content immediately.",
    commonMistakes: [
      "Using positive tabindex values (tabindex='1', '2', '3'), which breaks the natural document reading flow for keyboard users."
    ],
    followUpQuestions: [
      "Why are native elements like <button> and <a> preferred over <div tabindex='0'>?",
      "What key events must you manually bind when creating custom buttons with tabindex='0' (Enter and Space keys)?"
    ],
    tags: ["html", "tabindex", "accessibility", "keyboard"]
  },

  // 34. Fieldset & Legend
  {
    subject: "HTML",
    questionNumber: 34,
    category: "Forms & Inputs",
    difficulty: "easy",
    question: "What is the purpose of <fieldset> and <legend> in HTML forms?",
    shortAnswer: "<fieldset> groups logically related form controls together, and <legend> provides an accessible caption for that group, particularly for radio button groups.",
    detailedAnswer: "In complex forms, related inputs (e.g., shipping address fields, or payment method radio options) should be grouped together. When a blind user tabs into any input inside a <fieldset>, screen readers announce the <legend> text first, providing essential context for the input.",
    codeExample: `<fieldset>
  <legend>Select Shipping Method</legend>
  
  <input type="radio" id="standard" name="shipping" value="standard" checked>
  <label for="standard">Standard (3-5 business days) - Free</label><br>
  
  <input type="radio" id="express" name="shipping" value="express">
  <label for="express">Express (Next Day) - $15.00</label>
</fieldset>`,
    realWorldExample: "Checkouts and multi-step insurance questionnaires group billing address vs shipping address fields using separate <fieldset> containers to ensure WCAG 2.1 compliance.",
    commonMistakes: [
      "Omitting <legend> when using <fieldset> (<legend> must be the first child element inside a <fieldset>)."
    ],
    followUpQuestions: [
      "Can a <fieldset> be disabled entirely to disable all inputs inside it at once?",
      "How do you style the border of a <fieldset> using CSS?"
    ],
    tags: ["html", "forms", "fieldset", "accessibility"]
  },

  // 35. Lazy Loading attribute
  {
    subject: "HTML",
    questionNumber: 35,
    category: "Performance & Media",
    difficulty: "easy",
    question: "What is the loading='lazy' attribute on <img> and <iframe> elements?",
    shortAnswer: "loading='lazy' instructs the browser to defer downloading images and iframes until they are close to the user's viewport, dramatically speeding up initial page load.",
    detailedAnswer: "Before native lazy loading, developers had to import heavy JavaScript libraries utilizing IntersectionObserver. With HTML5:\n- loading='lazy': Defers loading until the element reaches a calculated distance from the viewport.\n- loading='eager' (default): Loads the resource immediately regardless of page position.",
    codeExample: `<!-- Native Lazy Loading for Images -->
<img src="footer-hero.jpg" alt="Company Headquarters" loading="lazy" width="800" height="600">

<!-- Native Lazy Loading for Embedded Iframes (e.g. YouTube, Maps) -->
<iframe src="https://www.google.com/maps/embed?..." loading="lazy" width="600" height="450"></iframe>`,
    realWorldExample: "Long e-commerce product listing pages with 100+ product cards use loading='lazy' to save megabytes of mobile data and achieve 95+ Google PageSpeed performance scores.",
    commonMistakes: [
      "Adding loading='lazy' to the main hero image above the fold (LCP element), which actually delays rendering and hurts Core Web Vitals.",
      "Omitting width and height attributes on lazy images, causing layout shifts (CLS) when images pop into view."
    ],
    followUpQuestions: [
      "Why should you always specify width and height attributes when using loading='lazy'?",
      "What is the Largest Contentful Paint (LCP) metric and why shouldn't the LCP image be lazy loaded?"
    ],
    tags: ["html", "performance", "lazy-loading", "images"]
  },

  // 36. Iframe and sandbox attribute
  {
    subject: "HTML",
    questionNumber: 36,
    category: "Security & Embedding",
    difficulty: "intermediate",
    question: "What is an <iframe> and what is the security purpose of the sandbox attribute?",
    shortAnswer: "An <iframe> embeds another HTML document inside the current page; the sandbox attribute applies strict security restrictions (disabling scripts, forms, and popups) to protect the host site.",
    detailedAnswer: "Embedding third-party content carries security risks (clickjacking, malicious scripts, unwanted redirects). Adding the sandbox attribute without values activates maximum security:\n- Blocks JavaScript execution.\n- Prevents form submissions.\n- Disables popups and new tabs.\n- Treats the content as an untrusted foreign origin.\nPermissions can be selectively re-enabled using values like sandbox='allow-scripts allow-same-origin'.",
    codeExample: `<!-- Maximum Security Sandboxed Iframe -->
<iframe 
  src="https://third-party-widget.com" 
  sandbox="allow-scripts allow-same-origin"
  title="Third Party Widget"
  width="400" 
  height="300"
></iframe>`,
    realWorldExample: "Code playgrounds (CodePen, JSFiddle) render untrusted user-submitted HTML and JavaScript inside heavily sandboxed iframes to prevent users from attacking the host application.",
    commonMistakes: [
      "Combining sandbox='allow-scripts allow-same-origin' on untrusted content from your own domain, which allows the embedded script to remove the sandbox attribute itself."
    ],
    followUpQuestions: [
      "What is clickjacking and how does the Content Security Policy (CSP) frame-ancestors directive prevent it?",
      "Why is a title attribute mandatory on <iframe> tags for accessibility?"
    ],
    tags: ["html", "iframe", "security", "sandbox"]
  },

  // 37. Difference between <ol>, <ul>, and <dl>
  {
    subject: "HTML",
    questionNumber: 37,
    category: "HTML Fundamentals",
    difficulty: "easy",
    question: "What is the difference between <ol>, <ul>, and <dl> list elements?",
    shortAnswer: "<ul> is an unordered bulleted list where order does not matter; <ol> is an ordered numbered list where sequence is important; <dl> is a description/definition list of terms and values.",
    detailedAnswer: "- <ul> (Unordered List): Renders bullet points. Used for navigation bars, item lists, and feature summaries.\n- <ol> (Ordered List): Renders numerical (1, 2, 3) or alphabetical indices. Used for step-by-step recipes, algorithms, and rankings.\n- <dl> (Description List): Contains <dt> (description term) and <dd> (description details). Perfect for glossaries, metadata pairs, and key-value specs.",
    codeExample: `<!-- Ordered List: Sequence matters -->
<ol>
  <li>Mix ingredients</li>
  <li>Bake for 30 minutes</li>
  <li>Allow to cool</li>
</ol>

<!-- Description List: Key-Value pairs -->
<dl>
  <dt>CSS</dt>
  <dd>Cascading Style Sheets</dd>
  <dt>HTML</dt>
  <dd>HyperText Markup Language</dd>
</dl>`,
    realWorldExample: "Product specification sheets (e.g., Apple specs for iPhones showing Display, Processor, Battery) are semantically coded using <dl>, <dt>, and <dd> rather than generic divs or tables.",
    commonMistakes: [
      "Placing non-<li> elements directly inside <ul> or <ol> (only <li> elements or <script>/<template> are allowed direct children)."
    ],
    followUpQuestions: [
      "Can a <dt> term have multiple <dd> description elements in a <dl>?",
      "What is the start and reversed attribute in an <ol>?"
    ],
    tags: ["html", "lists", "semantics"]
  },

  // 38. Figure and Figcaption
  {
    subject: "HTML",
    questionNumber: 38,
    category: "Semantic HTML",
    difficulty: "easy",
    question: "What is the purpose of <figure> and <figcaption>?",
    shortAnswer: "<figure> wraps self-contained visual content (images, diagrams, code listings), and <figcaption> provides an accessible visual caption linked directly to that content.",
    detailedAnswer: "Before HTML5, developers wrapped images in divs and placed paragraph text beneath them, with no programmatic relationship between the two. <figure> and <figcaption> formally bind the graphic to its explanatory text. Assistive technologies read the caption whenever the figure is focused.",
    codeExample: `<figure>
  <img src="solar-eclipse.jpg" alt="Total solar eclipse with visible solar corona">
  <figcaption>Figure 1.1: The total solar eclipse observed over North America in 2024.</figcaption>
</figure>`,
    realWorldExample: "Scientific publications, news articles, and educational documentation use <figure> and <figcaption> to publish referenced charts, diagrams, and code snippets.",
    commonMistakes: [
      "Placing <figcaption> anywhere other than as the first or last child of the <figure> element."
    ],
    followUpQuestions: [
      "Can <figure> be used for code snippets (<pre><code>) as well as images?",
      "How does <figcaption> interact with the image's alt attribute?"
    ],
    tags: ["html", "figure", "figcaption", "semantics"]
  },

  // 39. Open Graph (OG) Meta Tags
  {
    subject: "HTML",
    questionNumber: 39,
    category: "SEO & Social Sharing",
    difficulty: "easy",
    question: "What are Open Graph (OG) meta tags in HTML?",
    shortAnswer: "Open Graph meta tags control how URLs appear when shared on social media and messaging platforms (LinkedIn, Facebook, Slack, WhatsApp, Twitter).",
    detailedAnswer: "Introduced by Facebook, the Open Graph protocol uses <meta property='og:...'> tags in the <head> to specify the preview title, description, image thumbnail, and URL. Without them, social platforms guess what to display, often showing broken layouts or unrelated icons.",
    codeExample: `<head>
  <!-- Standard Open Graph Metadata -->
  <meta property="og:title" content="Frontend Interview Mastery Portal">
  <meta property="og:description" content="1,500+ curated interview questions with live audio solutions for freshers.">
  <meta property="og:image" content="https://example.com/assets/social-preview.png">
  <meta property="og:url" content="https://example.com/interview-questions">
  <meta property="og:type" content="website">
  
  <!-- Twitter Card Specific Tags -->
  <meta name="twitter:card" content="summary_large_image">
</head>`,
    realWorldExample: "Every article published on Medium, Dev.to, or YouTube includes og:image and og:title tags so when links are posted to WhatsApp or Slack, an enticing rich preview card renders instantly.",
    commonMistakes: [
      "Using relative URLs for og:image (e.g. /assets/preview.jpg); social crawlers strictly require absolute URLs starting with https://."
    ],
    followUpQuestions: [
      "What is the recommended pixel dimension for og:image (1200x630 pixels)?",
      "How do social crawlers discover and cache Open Graph tags?"
    ],
    tags: ["html", "seo", "open-graph", "social-media"]
  },

  // 40. Autocomplete attribute on forms
  {
    subject: "HTML",
    questionNumber: 40,
    category: "Forms & Accessibility",
    difficulty: "easy",
    question: "What is the autocomplete attribute on form inputs and why is it important?",
    shortAnswer: "autocomplete assists users by allowing browsers and password managers to automatically fill in names, emails, addresses, credit cards, and secure passwords.",
    detailedAnswer: "Benefits of autocomplete:\n1. Mobile Conversion: Eliminates typing friction for users on mobile touch keyboards.\n2. Accessibility: WCAG 2.1 Success Criterion 1.3.5 requires identifying input purpose to help users with cognitive disabilities.\n3. Security: Password managers detect autocomplete='current-password' and autocomplete='new-password' to generate strong passwords.",
    codeExample: `<form action="/checkout" method="POST" autocomplete="on">
  <!-- Standard identity autocomplete values -->
  <label for="name">Full Name</label>
  <input type="text" id="name" name="fullname" autocomplete="name" required>

  <label for="email">Email</label>
  <input type="email" id="email" name="email" autocomplete="email" required>

  <!-- Password manager hints -->
  <label for="new-pass">New Password</label>
  <input type="password" id="new-pass" name="password" autocomplete="new-password" required>
</form>`,
    realWorldExample: "Checkout conversion rates on mobile devices increase by up to 30% when forms support browser autofill for shipping addresses and credit card details.",
    commonMistakes: [
      "Using autocomplete='off' on login forms, which frustrates users by blocking their secure password managers like 1Password or Bitwarden."
    ],
    followUpQuestions: [
      "What values should be used for credit card number and expiry inputs (cc-number, cc-exp)?",
      "Can autocomplete be set on the entire <form> element as well as individual <input> fields?"
    ],
    tags: ["html", "forms", "autocomplete", "accessibility"]
  }
];

// Write file
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(questions, null, 2), 'utf-8');
console.log(`Successfully generated ${questions.length} authentic fresher HTML questions into ${OUTPUT_FILE}`);

