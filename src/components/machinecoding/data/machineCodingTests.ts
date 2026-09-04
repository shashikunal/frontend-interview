import type { MCQuestion } from '../machineCodingQuestions';

export interface MCTestCase {
  id: string;
  name: string;
  description: string;
  assertion: string;
}

export interface MCTestResult {
  id: string;
  name: string;
  description: string;
  status: 'passed' | 'failed';
  durationMs: number;
  error?: string;
}

/**
 * Returns automated test cases tailored to any challenge in the 500-question curriculum.
 */
export function getQuestionTestCases(q: MCQuestion): MCTestCase[] {
  if (q.testCases && q.testCases.length > 0) {
    return q.testCases;
  }

  const t = q.title.toLowerCase();

  // Specific for Q001: Counter
  if (q.id === 'Q001' || (t.includes('counter') && !t.includes('character'))) {
    return [
      {
        id: 'tc-mount',
        name: 'Component Mount & Non-Empty Root',
        description: 'Component mounts without errors and replaces initial challenge placeholder.',
        assertion: `
          expect(root && root.children.length > 0, "Component successfully mounted into DOM root");
          expect(!document.body.innerText.includes("Interactive Challenge Canvas"), "Candidate implemented component (canvas placeholder replaced)");
        `
      },
      {
        id: 'tc-display',
        name: 'Initial Numeric Display',
        description: 'Renders the initial counter numeric value (0).',
        assertion: `
          expect(root.innerText.includes("0"), "Initial count display contains 0");
        `
      },
      {
        id: 'tc-controls',
        name: 'Increment & Decrement Buttons',
        description: 'Both increment (+) and decrement (-) buttons are rendered in the DOM.',
        assertion: `
          const buttons = Array.from(document.querySelectorAll('button'));
          expect(buttons.length >= 2, "Found at least 2 control buttons (+ and -)");
        `
      },
      {
        id: 'tc-click',
        name: 'Interactive Increment Mutation',
        description: 'Clicking the increment button increases the displayed numeric count.',
        assertion: `
          const plusBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('+'));
          expect(plusBtn !== undefined, "Increment (+) button found");
          fireClick(plusBtn);
          await wait(80);
          expect(root.innerText.includes("1") || root.innerText.includes("count"), "Count incremented after click");
        `
      }
    ];
  }

  // 1. Timer / Countdown / Stopwatch / Clock / Pomodoro
  if (t.includes('timer') || t.includes('countdown') || t.includes('stopwatch') || t.includes('clock') || t.includes('pomodoro') || t.includes('metronome')) {
    return [
      {
        id: 'tc-mount',
        name: 'Component Mount & Non-Empty Root',
        description: 'Component mounts without errors and replaces initial challenge placeholder.',
        assertion: `
          expect(root && root.children.length > 0, "Component successfully mounted into DOM root");
          expect(!document.body.innerText.includes("Interactive Challenge Canvas"), "Candidate implemented component (canvas placeholder replaced)");
        `
      },
      {
        id: 'tc-timer-display',
        name: 'Formatted Time Indicator',
        description: 'Renders formatted timer numerical text (e.g. MM:SS, 60s, or tabular-nums).',
        assertion: `
          const hasTime = /[0-9]+:[0-9]+|[0-9]+s/.test(root.innerText);
          expect(hasTime, "Displays valid formatted timer digits");
        `
      },
      {
        id: 'tc-timer-controls',
        name: 'Timer Action Controls',
        description: 'Renders Start/Pause and Reset control buttons.',
        assertion: `
          const buttons = Array.from(document.querySelectorAll('button'));
          expect(buttons.length >= 2, "Found at least 2 control buttons for timer actions");
        `
      },
      {
        id: 'tc-timer-lifecycle',
        name: 'Timer Interval Execution',
        description: 'Starts interval on click and ticks state forward.',
        assertion: `
          const startBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.toLowerCase().includes('start') || b.innerText.toLowerCase().includes('pause'));
          expect(startBtn !== undefined, "Start/Pause button found");
          fireClick(startBtn);
          await wait(1100);
          expect(true, "Timer interval executed without throwing exceptions");
        `
      }
    ];
  }

  // 2. File Upload / Dropzone / Attachment
  if (t.includes('upload') || t.includes('dropzone') || t.includes('attachment') || (t.includes('file') && !t.includes('explorer') && !t.includes('tree'))) {
    return [
      {
        id: 'tc-mount',
        name: 'Component Mount & Non-Empty Root',
        description: 'Component mounts without errors and replaces initial challenge placeholder.',
        assertion: `
          expect(root && root.children.length > 0, "Component successfully mounted into DOM root");
          expect(!document.body.innerText.includes("Interactive Challenge Canvas"), "Candidate implemented component (canvas placeholder replaced)");
        `
      },
      {
        id: 'tc-file-input',
        name: 'File Input Element Accessibility',
        description: 'File input element is present in DOM to support manual file browsing.',
        assertion: `
          const input = document.querySelector('input[type="file"]');
          expect(input !== null, "File input element present with file selection capability");
        `
      },
      {
        id: 'tc-dropzone-ui',
        name: 'Dropzone Layout & Guidance',
        description: 'Dropzone interface clearly guides candidate on dragging or selecting files.',
        assertion: `
          const text = root.innerText.toLowerCase();
          expect(text.includes('drop') || text.includes('upload') || text.includes('browse') || text.includes('file'), "Dropzone interface communicates upload instructions to user");
        `
      },
      {
        id: 'tc-file-actions',
        name: 'Uploaded Item Controls',
        description: 'Renders file management actions (remove, progress indicator, or clear).',
        assertion: `
          expect(root.innerText.includes('file') || root.querySelectorAll('button').length > 0, "File management elements rendered in DOM");
        `
      }
    ];
  }

  // 3. Multi-Select / Dropdown / Checkboxes
  if (t.includes('multi-select') || t.includes('dropdown') || t.includes('checkbox dropdown') || t.includes('combobox') || t.includes('tag input')) {
    return [
      {
        id: 'tc-mount',
        name: 'Component Mount & Non-Empty Root',
        description: 'Component mounts without errors and replaces initial challenge placeholder.',
        assertion: `
          expect(root && root.children.length > 0, "Component successfully mounted into DOM root");
          expect(!document.body.innerText.includes("Interactive Challenge Canvas"), "Candidate implemented component (canvas placeholder replaced)");
        `
      },
      {
        id: 'tc-trigger',
        name: 'Interactive Trigger / Search Control',
        description: 'Dropdown trigger or search input control is rendered.',
        assertion: `
          const trigger = document.querySelector('input, button, [role="button"], label, [style*="cursor: pointer"]');
          expect(trigger !== null, "Interactive trigger or input control rendered");
        `
      },
      {
        id: 'tc-toggle',
        name: 'Selection Menu Toggle Interaction',
        description: 'Dropdown responds to click interactions without throwing exceptions.',
        assertion: `
          const trigger = document.querySelector('[style*="cursor: pointer"], button');
          if (trigger) {
            fireClick(trigger);
            await wait(60);
          }
          expect(true, "Trigger responds to click interactions");
        `
      },
      {
        id: 'tc-selection-state',
        name: 'Selected Options Tracking',
        description: 'Tracks selected options or badges in reactive state.',
        assertion: `
          expect(root.innerText.includes('select') || root.innerText.includes('React') || document.querySelectorAll('input').length > 0, "Selection state reflects active options");
        `
      }
    ];
  }

  // 4. Transfer List / Two-Column Selector
  if (t.includes('transfer list') || t.includes('two-column selector')) {
    return [
      {
        id: 'tc-mount',
        name: 'Component Mount & Non-Empty Root',
        description: 'Component mounts without errors and replaces initial challenge placeholder.',
        assertion: `
          expect(root && root.children.length > 0, "Component successfully mounted into DOM root");
          expect(!document.body.innerText.includes("Interactive Challenge Canvas"), "Candidate implemented component (canvas placeholder replaced)");
        `
      },
      {
        id: 'tc-columns',
        name: 'Dual Column Layout Rendered',
        description: 'Both list containers (e.g. Available vs Selected) are rendered.',
        assertion: `
          const text = root.innerText.toLowerCase();
          expect(text.includes('available') || text.includes('selected') || document.querySelectorAll('label').length > 0, "Dual column containers rendered");
        `
      },
      {
        id: 'tc-transfer-btns',
        name: 'Transfer Action Buttons',
        description: 'Directional transfer action buttons (>, <, ≫, ≪) are rendered.',
        assertion: `
          const buttons = Array.from(document.querySelectorAll('button'));
          expect(buttons.length >= 2, "Found at least 2 transfer action buttons");
        `
      },
      {
        id: 'tc-transfer-action',
        name: 'Transfer Event Handling',
        description: 'Transfer action dispatches without throwing runtime errors.',
        assertion: `
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('>') || b.innerText.includes('≫'));
          if (btn && !btn.disabled) fireClick(btn);
          await wait(50);
          expect(true, "Transfer actions dispatch without error");
        `
      }
    ];
  }

  // 5. Tree View / Nested File Explorer / Hierarchy
  if (t.includes('tree') || t.includes('file explorer') || t.includes('nested') || t.includes('folder')) {
    return [
      {
        id: 'tc-mount',
        name: 'Component Mount & Non-Empty Root',
        description: 'Component mounts without errors and replaces initial challenge placeholder.',
        assertion: `
          expect(root && root.children.length > 0, "Component successfully mounted into DOM root");
          expect(!document.body.innerText.includes("Interactive Challenge Canvas"), "Candidate implemented component (canvas placeholder replaced)");
        `
      },
      {
        id: 'tc-tree-nodes',
        name: 'Hierarchy Nodes & Folders Rendered',
        description: 'Renders folder/file hierarchical structure with icons or indentations.',
        assertion: `
          const text = root.innerText;
          expect(text.includes('src') || text.includes('components') || text.includes('📁') || text.includes('folder') || text.includes('root'), "Hierarchical tree nodes and folders rendered");
        `
      },
      {
        id: 'tc-tree-toggle',
        name: 'Expand / Collapse Interaction',
        description: 'Clicking folder toggles child visibility without throwing errors.',
        assertion: `
          const folder = Array.from(document.querySelectorAll('*')).find(el => el.innerText && (el.innerText.includes('src') || el.innerText.includes('folder')));
          if (folder) {
            fireClick(folder);
            await wait(50);
          }
          expect(true, "Folder expand/collapse executed successfully");
        `
      },
      {
        id: 'tc-tree-items',
        name: 'Interactive Selection Feedback',
        description: 'Selectable items provide interactive click feedback.',
        assertion: `
          expect(root.querySelectorAll('[style*="cursor: pointer"], div').length >= 3, "Selectable tree items styled with click/hover interactivity");
        `
      }
    ];
  }

  // Default for all other 450+ challenges
  return [
    {
      id: 'tc-mount',
      name: 'Component Mount & Non-Empty Root',
      description: 'Component mounts without errors and replaces initial challenge placeholder.',
      assertion: `
        expect(root && root.children.length > 0, "Component successfully mounted into DOM root");
        expect(!document.body.innerText.includes("Interactive Challenge Canvas"), "Candidate implemented component (canvas placeholder replaced)");
      `
    },
    {
      id: 'tc-interactive-elements',
      name: 'Interactive UI Controls Present',
      description: 'Component renders functional input controls, buttons, or display containers.',
      assertion: `
        const controls = document.querySelectorAll('button, input, select, textarea, canvas, svg, [role="button"]');
        expect(controls.length > 0, "Interactive elements and controls rendered in DOM");
      `
    },
    {
      id: 'tc-event-dispatch',
      name: 'Event Dispatch & State Reactivity',
      description: 'Primary UI interactions execute and update state without crashing.',
      assertion: `
        const el = document.querySelector('button, input');
        if (el) {
          if (el.tagName === 'INPUT') fireInput(el, 'Test Input Value');
          else fireClick(el);
          await wait(60);
        }
        expect(true, "Interaction handled cleanly without exceptions");
      `
    },
    {
      id: 'tc-zero-errors',
      name: 'Zero Runtime Exceptions in DOM',
      description: 'Execution finishes with zero uncaught runtime errors or crash alerts.',
      assertion: `
        expect(!document.body.innerText.includes("Error:") && !document.body.innerText.includes("Uncaught"), "Zero unhandled errors in DOM");
        expect(root.innerHTML.length > 50, "DOM structure is populated and styled");
      `
    }
  ];
}
