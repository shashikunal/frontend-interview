// scripts/generators/enrichFresherHtmlBank.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '../../public/data/interview-questions/html.json');

const questions = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

/**
 * Parses a code snippet into an array of line-by-line explanations
 */
function generateLineBreakdown(codeSnippet, questionTitle) {
  if (!codeSnippet) return [];
  const lines = codeSnippet.split('\n');
  const result = [];

  let lineNum = 1;
  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith('<!--') || trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('-->')) {
      lineNum++;
      continue;
    }

    let explanation = 'Defines the structural element for this part of the document.';
    if (trimmed.startsWith('<!DOCTYPE html>')) {
      explanation = 'Declares modern HTML5 standards mode so browsers avoid quirky legacy rendering.';
    } else if (trimmed.startsWith('<html')) {
      explanation = 'The root container enclosing the entire web page document.';
    } else if (trimmed.startsWith('<head')) {
      explanation = 'Contains metadata, title, and link tags that are not directly shown on the screen.';
    } else if (trimmed.startsWith('</head>') || trimmed.startsWith('</html>') || trimmed.startsWith('</body>') || trimmed.startsWith('</main>') || trimmed.startsWith('</header>')) {
      explanation = 'Closes this container element cleanly.';
    } else if (trimmed.startsWith('<title>')) {
      explanation = 'Sets the text displayed in the browser tab and search engine results.';
    } else if (trimmed.startsWith('<meta charset')) {
      explanation = 'Configures standard UTF-8 character encoding to support international symbols.';
    } else if (trimmed.startsWith('<meta name="viewport"')) {
      explanation = 'Ensures mobile responsiveness by matching viewport width to the device screen.';
    } else if (trimmed.startsWith('<body')) {
      explanation = 'Encloses all visible content that users see and interact with in the browser.';
    } else if (trimmed.startsWith('<h1>')) {
      explanation = 'The primary heading of the page, establishing top-level content hierarchy.';
    } else if (trimmed.startsWith('<h2>') || trimmed.startsWith('<h3>')) {
      explanation = 'A secondary sub-heading that groups related content sections.';
    } else if (trimmed.startsWith('<p>')) {
      explanation = 'A paragraph element containing readable text.';
    } else if (trimmed.startsWith('<header>')) {
      explanation = 'A semantic landmark representing introductory content or brand identity.';
    } else if (trimmed.startsWith('<nav')) {
      explanation = 'A semantic navigation landmark containing primary menu links.';
    } else if (trimmed.startsWith('<main>')) {
      explanation = 'The unique primary content of this specific page, excluded from headers and footers.';
    } else if (trimmed.startsWith('<article')) {
      explanation = 'A self-contained block of content that can be syndicated or shared on its own.';
    } else if (trimmed.startsWith('<section')) {
      explanation = 'A thematic section of content, usually accompanied by its own heading.';
    } else if (trimmed.startsWith('<aside')) {
      explanation = 'Content indirectly related to the main content, like sidebars or pull-quotes.';
    } else if (trimmed.startsWith('<footer>')) {
      explanation = 'The semantic footer containing copyright, legal notes, or secondary links.';
    } else if (trimmed.startsWith('<a href')) {
      explanation = 'A hyperlink connecting users to another page or resource.';
    } else if (trimmed.startsWith('<img src')) {
      explanation = 'Embeds an image with an accessible alternative text description.';
    } else if (trimmed.startsWith('<form')) {
      explanation = 'Wraps interactive controls to submit user input to a server endpoint.';
    } else if (trimmed.startsWith('<label for')) {
      explanation = 'Provides an accessible text label bound to a specific input via matching IDs.';
    } else if (trimmed.startsWith('<input type')) {
      explanation = 'Captures user input, enforcing type-specific browser validation.';
    } else if (trimmed.startsWith('<button')) {
      explanation = 'An accessible interactive button that can be clicked or triggered with the Enter or Space key.';
    } else if (trimmed.startsWith('<table>')) {
      explanation = 'Begins a tabular data structure displaying structured rows and columns.';
    } else if (trimmed.startsWith('<thead>') || trimmed.startsWith('<tbody>')) {
      explanation = 'Groups table header or body rows for accessible rendering.';
    } else if (trimmed.startsWith('<tr>')) {
      explanation = 'Defines a single row inside a table.';
    } else if (trimmed.startsWith('<th')) {
      explanation = 'A table header cell providing column or row titles for screen readers.';
    } else if (trimmed.startsWith('<td>')) {
      explanation = 'A standard table data cell holding tabular values.';
    } else if (trimmed.startsWith('<video') || trimmed.startsWith('<audio')) {
      explanation = 'Embeds native media with built-in browser playback controls.';
    } else if (trimmed.startsWith('<source src')) {
      explanation = 'Specifies media format options so the browser plays the best supported file.';
    } else if (trimmed.startsWith('<link rel="preload"')) {
      explanation = 'Tells the browser to fetch a critical resource immediately with high priority.';
    } else if (trimmed.startsWith('<script defer')) {
      explanation = 'Downloads the JavaScript file in the background and runs it after HTML is fully parsed.';
    } else if (trimmed.startsWith('<script async')) {
      explanation = 'Downloads the script asynchronously and runs it immediately when ready.';
    }

    result.push({
      line: lineNum,
      code: trimmed,
      explanation,
    });
    lineNum++;
  }

  return result.slice(0, 10);
}

/**
 * Creates natural English narration of code for TTS so users never hear raw punctuation
 */
function createCodeSpeech(codeSnippet, questionTitle) {
  if (!codeSnippet) return 'No code example is required for this conceptual question.';

  if (codeSnippet.includes('<!DOCTYPE html>')) {
    return 'This example demonstrates a standard HTML document. It declares the HTML5 doctype on line one to activate standards mode, specifies a head section for metadata, and creates visible elements inside the body tag.';
  }
  if (codeSnippet.includes('<header>') && codeSnippet.includes('<main>')) {
    return 'This code demonstrates semantic HTML5 landmarks. It wraps the top navigation inside a header, places core page content inside a main element, and places footer details in a footer element.';
  }
  if (codeSnippet.includes('<form')) {
    return 'This snippet demonstrates an accessible HTML form. It links label tags with matching input elements using unique IDs, ensuring screen readers announce the input purpose clearly.';
  }
  if (codeSnippet.includes('<table>')) {
    return 'This code shows an accessible HTML table. It uses table header cells with scope attributes so screen reader users understand how row and column headers relate to data cells.';
  }
  if (codeSnippet.includes('<script defer') || codeSnippet.includes('<script async')) {
    return 'This example compares script loading attributes. The async script runs immediately once downloaded, while the defer script waits until the HTML parser finishes constructing the document.';
  }
  if (codeSnippet.includes('<picture>') || codeSnippet.includes('<source')) {
    return 'This snippet demonstrates responsive media. It uses the picture element with source tags to serve modern WebP images to supported browsers, with a fallback image tag for older browsers.';
  }

  return `This code demonstrates the practical implementation of ${questionTitle.toLowerCase().replace('what is ', '').replace('?', '')}. It shows the proper element syntax, attributes, and structural nesting.`;
}

/**
 * Creates step-by-step How It Works explanation in simple English
 */
function createHowItWorks(q) {
  const title = q.question.toLowerCase();

  if (title.includes('html')) {
    return '1. The browser requests and receives the raw HTML bytes from the web server.\n2. The HTML parser converts the bytes into readable characters and tokens.\n3. The tokens are converted into element nodes representing tags and content.\n4. The browser links all element nodes into a tree called the **Document Object Model (DOM)**.';
  }
  if (title.includes('doctype')) {
    return '1. When the browser begins reading an HTML document, it inspects line 1.\n2. If it finds `<!DOCTYPE html>`, it turns on **Standards Mode** to follow modern W3C rules.\n3. If the doctype is missing, it falls back to <u>Quirks Mode</u>, which emulates vintage 1990s browser layout bugs.';
  }
  if (title.includes('element') && title.includes('tag')) {
    return '1. The browser parser reads the opening tag token like `<p>`.\n2. It reads any enclosed text nodes or nested children.\n3. It reaches the closing tag token `</p>`.\n4. It combines everything into a single **DOM Element object** in memory.';
  }
  if (title.includes('attribute')) {
    return '1. As the parser reads an opening tag, it identifies attribute key-value pairs.\n2. It attaches these attributes to the element node as properties.\n3. CSS and JavaScript query these attributes to apply styles or attach event listeners.';
  }
  if (title.includes('block') || title.includes('inline')) {
    return '1. The browser layout engine calculates the bounding box for each element.\n2. **Block-level elements** force a line break before and after, taking up the full horizontal container width.\n3. **Inline elements** sit inside the text line without creating a line break, taking up only as much width as their content.';
  }
  if (title.includes('semantic')) {
    return '1. The browser constructs the standard DOM tree.\n2. Concurrently, it creates the **Accessibility Tree (AOM)** based on semantic element roles.\n3. Assistive technologies like screen readers use these landmarks to let users jump between sections with shortcut keys.';
  }
  if (title.includes('defer') || title.includes('async')) {
    return '1. **Default scripts** pause HTML parsing immediately while downloading and executing.\n2. **Async scripts** download in the background without pausing HTML parsing, but pause HTML execution the moment download finishes.\n3. **Defer scripts** download in the background and execute only after the entire HTML document is completely parsed.';
  }
  if (title.includes('storage') || title.includes('cookie')) {
    return '1. **localStorage** persists key-value data on the client device across sessions until explicitly deleted.\n2. **sessionStorage** persists data only for the current browser tab and clears automatically when closed.\n3. **Cookies** travel with every HTTP request back and forth to the server and can be protected with `HttpOnly` and `Secure` flags.';
  }
  if (title.includes('form') || title.includes('input') || title.includes('label')) {
    return '1. The `<label>` element specifies a `for` attribute that matches the `<input>` element\'s `id`.\n2. Clicking the label immediately transfers browser keyboard focus to the associated input field.\n3. Screen readers announce the label text as soon as the user tabs into the input field.';
  }

  return '1. The browser engine parses the HTML markup into the DOM tree.\n2. The engine combines the DOM with CSS rules to compute visual styles.\n3. The layout engine calculates exact coordinates and paints pixels onto the screen.';
}

/**
 * Creates practical tactical interview tip
 */
function createInterviewTip(q) {
  const title = q.question.toLowerCase();

  if (title.includes('html')) {
    return 'Start your answer by stating that HTML is a markup language, not a programming language. Mention that HTML provides the structural layer of a web application while CSS handles presentation and JavaScript handles behavior.';
  }
  if (title.includes('doctype')) {
    return 'Mention that <!DOCTYPE html> is case-insensitive, but uppercase is standard convention. Always highlight the difference between Standards Mode and Quirks Mode to impress the interviewer.';
  }
  if (title.includes('element') && title.includes('tag')) {
    return 'Give the interviewer a quick mental formula: Opening Tag + Inner Content + Closing Tag equals Element. Point out that void elements like <img> are elements that do not have closing tags.';
  }
  if (title.includes('attribute')) {
    return 'Mention that attributes must always go in the opening tag. Give 2-3 quick examples like id for unique identification, class for reusable styling, and href for links.';
  }
  if (title.includes('block') || title.includes('inline')) {
    return 'First explain default browser behavior, then note that modern frontend development uses CSS Flexbox or Grid to control layout. Mention that <div> is block-level while <span> is inline.';
  }
  if (title.includes('semantic')) {
    return 'Always highlight the three main benefits of semantic HTML: Accessibility (a11y), Search Engine Optimization (SEO), and Team Code Maintainability.';
  }
  if (title.includes('defer') || title.includes('async')) {
    return 'State clearly: "Use defer for scripts that depend on the DOM or each other; use async for independent scripts like Google Analytics." Interviewers love this clear rule of thumb.';
  }
  if (title.includes('storage') || title.includes('cookie')) {
    return 'Draw a simple mental comparison table: capacity (5MB vs 4KB), expiration (never vs tab close vs date), and whether data is sent to the server with every HTTP request.';
  }

  return 'First state a crisp 1-sentence definition. Then give a practical everyday example. If the interviewer asks for more depth, explain browser rendering and accessibility.';
}

/**
 * Enriches a question with simple English, highlighted key terms, short sentences, and TTS assets
 */
const enrichedQuestions = questions.map((q, idx) => {
  const title = q.question;
  const rawAnswer = q.detailedAnswer || q.detailedExplanation || q.shortAnswer;

  // Format simple explanation with bold and underline on key concepts
  let simpleExplanation = rawAnswer
    .replace(/(HTML5|HTML|DOM|CSS|JavaScript|Standards Mode|Quirks Mode|Document Object Model|Accessibility|SEO|Semantic HTML|Block-level|Inline|void elements|localStorage|sessionStorage|Cookies|defer|async)/g, '**$1**')
    .replace(/(opening tag|closing tag|screen readers|viewport|HttpOnly|Secure|aria-label|landmark|unique identifier)/g, '<u>$1</u>');

  // Ensure short sentences and clean paragraphs
  if (!simpleExplanation.includes('\n\n')) {
    simpleExplanation = simpleExplanation.replace(/([.!?])\s+(?=[A-Z])/g, '$1\n\n');
  }

  const lineBreakdown = q.lineByLineExplanation && q.lineByLineExplanation.length > 0
    ? q.lineByLineExplanation
    : generateLineBreakdown(q.codeExample || q.example, title);

  const codeSpeech = q.codeExplanationSpeech || createCodeSpeech(q.codeExample || q.example, title);
  const howItWorks = q.howItWorks || createHowItWorks(q);
  const interviewTip = q.interviewTip || createInterviewTip(q);

  // Optional interactive MCQ Practice setup for key questions
  let options = q.options;
  let correctAnswer = q.correctAnswer;
  let mcqExplanation = q.mcqExplanation;
  let wrongOptionExplanations = q.wrongOptionExplanations;

  if (idx === 0) { // Q1: What is HTML?
    options = [
      { key: "A", text: "A programming language with loops and conditionals", explanation: "HTML contains no computational logic or control structures." },
      { key: "B", text: "The standard markup language used to structure content on web pages", explanation: "HTML structures web pages using semantic tags and elements." },
      { key: "C", text: "A database query language for fetching web records", explanation: "SQL or GraphQL are query languages, not HTML." },
      { key: "D", text: "A stylesheet language used for browser visual styling", explanation: "CSS is the stylesheet language, while HTML provides markup structure." }
    ];
    correctAnswer = "B";
    mcqExplanation = "HTML (HyperText Markup Language) is the standard markup language used to define the structure of web content.";
    wrongOptionExplanations = {
      A: "HTML does not possess computational logic like loops, variables, or if statements.",
      C: "HTML does not query databases; that is handled by backend database query languages.",
      D: "CSS handles colors, layout, and visual presentation; HTML only structures document content."
    };
  } else if (idx === 1) { // Q2: What is <!DOCTYPE html>?
    options = [
      { key: "A", text: "An HTML tag used to create container divisions", explanation: "<div> creates containers; <!DOCTYPE html> is an instruction to the browser engine." },
      { key: "B", text: "A declaration that tells the browser to use modern standards mode", explanation: "<!DOCTYPE html> prevents browsers from switching into quirks mode." },
      { key: "C", text: "A JavaScript command to initialize DOM nodes", explanation: "It is an HTML document declaration, not a JavaScript command." },
      { key: "D", text: "A CSS selector targeting root document styles", explanation: "CSS root styles are targeted via :root or html, not doctype." }
    ];
    correctAnswer = "B";
    mcqExplanation = "<!DOCTYPE html> tells the browser engine to interpret the document in modern standards mode.";
    wrongOptionExplanations = {
      A: "<!DOCTYPE html> is an instruction/declaration to the browser engine, not an element tag.",
      C: "Doctype is processed by the browser parser before any JavaScript is parsed.",
      D: "Doctype cannot be selected or styled using CSS."
    };
  }

  return {
    ...q,
    id: q.id || `iq-html-${String(q.questionNumber || idx + 1).padStart(4, '0')}`,
    questionNumber: q.questionNumber || (idx + 1),
    subject: "html",
    difficulty: q.difficulty || "easy",
    category: q.category || "HTML Fundamentals",
    simpleExplanation,
    detailedAnswer: simpleExplanation,
    detailedExplanation: simpleExplanation,
    howItWorks,
    lineByLineExplanation: lineBreakdown,
    codeExplanationSpeech: codeSpeech,
    interviewTip,
    interviewTips: [interviewTip],
    options,
    correctAnswer,
    mcqExplanation,
    wrongOptionExplanations,
  };
});

fs.writeFileSync(DATA_FILE, JSON.stringify(enrichedQuestions, null, 2), 'utf-8');
console.log(`Successfully enriched ${enrichedQuestions.length} HTML questions with standard 10-step structure & clean TTS!`);
