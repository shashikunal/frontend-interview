import React, { useState } from 'react';
import { MermaidDiagram } from './MermaidDiagram';

interface SafeMarkdownViewerProps {
  content: string;
  className?: string;
}

/**
 * Lightweight, zero-dependency Markdown & code renderer.
 * Formats headings, tables, code blocks with copy-to-clipboard, lists, callout alerts, and bold text.
 */
export function SafeMarkdownViewer({ content, className = '' }: SafeMarkdownViewerProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!content) return null;

  const handleCopyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Split content by code blocks ```lang ... ```
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className={`safe-md-viewer ${className}`}>
      {parts.map((part, pIdx) => {
        // Code Block
        if (part.startsWith('```') && part.endsWith('```')) {
          const firstLineEnd = part.indexOf('\n');
          const language = part.slice(3, firstLineEnd > 0 ? firstLineEnd : 3).trim() || 'text';
          const codeBody = firstLineEnd > 0 ? part.slice(firstLineEnd + 1, -3) : '';

          if (language.toLowerCase() === 'mermaid') {
            return <MermaidDiagram key={pIdx} chart={codeBody} />;
          }

          return (
            <div key={pIdx} className="md-code-block-container">
              <div className="md-code-header">
                <span className="md-code-lang">{language.toUpperCase()}</span>
                <button
                  type="button"
                  className="md-copy-btn"
                  onClick={() => handleCopyCode(codeBody, pIdx)}
                >
                  {copiedIndex === pIdx ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>
              <pre className="md-code-pre">
                <code>{codeBody}</code>
              </pre>
            </div>
          );
        }

        // Standard Text with paragraphs, lists, and tables
        const lines = part.split('\n');
        const renderedElements: React.ReactNode[] = [];
        let inList = false;
        let listItems: string[] = [];

        const flushList = () => {
          if (inList && listItems.length > 0) {
            renderedElements.push(
              <ul key={`ul_${renderedElements.length}`} className="md-ul">
                {listItems.map((li, idx) => (
                  <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(li) }} />
                ))}
              </ul>
            );
            listItems = [];
            inList = false;
          }
        };

        lines.forEach((line, lIdx) => {
          const trimmed = line.trim();

          // Heading 3
          if (trimmed.startsWith('### ')) {
            flushList();
            renderedElements.push(<h3 key={lIdx} className="md-h3">{trimmed.slice(4)}</h3>);
            return;
          }

          // Heading 2
          if (trimmed.startsWith('## ')) {
            flushList();
            renderedElements.push(<h2 key={lIdx} className="md-h2">{trimmed.slice(3)}</h2>);
            return;
          }

          // Heading 1
          if (trimmed.startsWith('# ')) {
            flushList();
            renderedElements.push(<h1 key={lIdx} className="md-h1">{trimmed.slice(2)}</h1>);
            return;
          }

          // Callout Alert: > [!NOTE], > [!IMPORTANT]
          if (trimmed.startsWith('> [!NOTE]') || trimmed.startsWith('> [!IMPORTANT]') || trimmed.startsWith('> [!TIP]')) {
            flushList();
            const alertType = trimmed.includes('IMPORTANT') ? 'important' : trimmed.includes('TIP') ? 'tip' : 'note';
            renderedElements.push(
              <div key={lIdx} className={`md-callout-alert alert-${alertType}`}>
                <span className="alert-icon">{alertType === 'important' ? '⚠️' : alertType === 'tip' ? '💡' : 'ℹ️'}</span>
                <span>{trimmed.replace(/^> \[!\w+\]\s*/, '')}</span>
              </div>
            );
            return;
          }

          // List item
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            inList = true;
            listItems.push(trimmed.slice(2));
            return;
          }

          // Numbered list item
          if (/^\d+\.\s/.test(trimmed)) {
            inList = true;
            listItems.push(trimmed.replace(/^\d+\.\s/, ''));
            return;
          }

          // Empty line
          if (!trimmed) {
            flushList();
            return;
          }

          // Plain paragraph
          flushList();
          renderedElements.push(
            <p key={lIdx} className="md-p" dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
          );
        });

        flushList();
        return <React.Fragment key={pIdx}>{renderedElements}</React.Fragment>;
      })}
    </div>
  );
}

/**
 * Basic safe inline formatter for bold, italic, and inline code.
 */
function formatInline(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
