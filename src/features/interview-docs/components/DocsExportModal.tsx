import { useState, useMemo } from 'react';
import type { DocPage, SubjectMetadata } from '../types/docs.types';
import { docsExportService } from '../services/docsExportService';
import '../styles/DocsExportModal.css';

interface DocsExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  doc: DocPage;
  subject: SubjectMetadata;
}

export function DocsExportModal({
  isOpen,
  onClose,
  doc,
  subject,
}: DocsExportModalProps) {
  const [activeTab, setActiveTab] = useState<'print' | 'anki' | 'markdown'>('print');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const markdownContent = useMemo(() => {
    return docsExportService.generateMarkdownDossier(doc, subject);
  }, [doc, subject]);

  const ankiContent = useMemo(() => {
    return docsExportService.generateAnkiDeck(doc, subject);
  }, [doc, subject]);

  const ankiCardCount = useMemo(() => {
    const lines = ankiContent.split('\n').filter(l => !l.startsWith('#') && l.trim().length > 0);
    return lines.length;
  }, [ankiContent]);

  if (!isOpen) return null;

  const handleCopy = async (format: 'anki' | 'markdown', content: string) => {
    const success = await docsExportService.copyToClipboard(content);
    if (success) {
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 3000);
    }
  };

  const handleDownloadMarkdown = () => {
    const safeFilename = `${subject.id}-${doc.topicId}-cheat-sheet.md`;
    docsExportService.downloadFile(safeFilename, markdownContent, 'text/markdown');
  };

  const handleDownloadAnki = () => {
    const safeFilename = `${subject.id}-${doc.topicId}-anki-deck.txt`;
    docsExportService.downloadFile(safeFilename, ankiContent, 'text/tab-separated-values');
  };

  const handleTriggerPrint = () => {
    onClose();
    setTimeout(() => {
      docsExportService.triggerPrint();
    }, 150);
  };

  return (
    <div className="docs-export-modal-overlay" onClick={onClose}>
      <div
        className="docs-export-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-modal-title"
      >
        {/* Header */}
        <div className="dem-header">
          <div className="dem-header-info">
            <span className="dem-header-icon">📄</span>
            <div>
              <h3 id="export-modal-title">Executive Cheat Sheet &amp; Multi-Format Export</h3>
              <p className="dem-subtitle">
                Export <strong>{doc.title}</strong> for offline revision, Anki flashcards, or personal notes.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="dem-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Format Navigation Tabs */}
        <nav className="dem-tabs-nav" aria-label="Export Formats">
          <button
            type="button"
            className={`dem-tab-btn ${activeTab === 'print' ? 'active' : ''}`}
            onClick={() => setActiveTab('print')}
          >
            <span className="dem-tab-icon">🖨️</span>
            <span>Print-Ready PDF Cheat Sheet</span>
          </button>
          <button
            type="button"
            className={`dem-tab-btn ${activeTab === 'anki' ? 'active' : ''}`}
            onClick={() => setActiveTab('anki')}
          >
            <span className="dem-tab-icon">📥</span>
            <span>Anki Spaced Repetition ({ankiCardCount} Cards)</span>
          </button>
          <button
            type="button"
            className={`dem-tab-btn ${activeTab === 'markdown' ? 'active' : ''}`}
            onClick={() => setActiveTab('markdown')}
          >
            <span className="dem-tab-icon">📋</span>
            <span>Markdown Summary (Notion / Obsidian)</span>
          </button>
        </nav>

        {/* Body Content */}
        <div className="dem-body">
          {/* TAB 1: Print / PDF */}
          {activeTab === 'print' && (
            <div className="dem-tab-content">
              <div className="dem-tab-overview">
                <div className="dem-overview-header">
                  <h4>Print-Ready Executive Cheat Sheet (PDF)</h4>
                  <span className="dem-badge-pill">Zero UI Chrome</span>
                </div>
                <p>
                  Reformats this documentation page with high-contrast, clean 2-column typography, stripping all sidebars, search bars, playgrounds, and navigation buttons. Choose <strong>Save as PDF</strong> in your browser's print dialog to create an offline executive technical dossier.
                </p>

                <div className="dem-action-buttons-row">
                  <button
                    type="button"
                    className="dem-btn-primary"
                    onClick={handleTriggerPrint}
                  >
                    🖨️ Open Print &amp; Save as PDF Dialog
                  </button>
                </div>
              </div>

              <div className="dem-features-checklist">
                <div className="dem-feat-item">
                  <span className="dem-feat-check">✓</span>
                  <span>Sidebars and interactive runners automatically stripped</span>
                </div>
                <div className="dem-feat-item">
                  <span className="dem-feat-check">✓</span>
                  <span>Syntax code blocks formatted for high-contrast B&amp;W printing</span>
                </div>
                <div className="dem-feat-item">
                  <span className="dem-feat-check">✓</span>
                  <span>Page breaks preserved across key interview questions</span>
                </div>
                <div className="dem-feat-item">
                  <span className="dem-feat-check">✓</span>
                  <span>Compact 2-column layout for pre-interview revision</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Anki Flashcards */}
          {activeTab === 'anki' && (
            <div className="dem-tab-content">
              <div className="dem-tab-overview">
                <div className="dem-overview-header">
                  <h4>Anki Spaced Repetition Deck (.txt)</h4>
                  <span className="dem-badge-pill">{ankiCardCount} Ready Flashcards</span>
                </div>
                <p>
                  Exported as standard tab-separated values (TSV) compatible with Anki Desktop, AnkiMobile (iOS), and AnkiDroid. Contains core concepts, internal mechanics, syntax references, and FAANG interview questions.
                </p>

                <div className="dem-action-buttons-row">
                  <button
                    type="button"
                    className="dem-btn-primary"
                    onClick={handleDownloadAnki}
                  >
                    📥 Download Anki Deck (.txt)
                  </button>
                  <button
                    type="button"
                    className="dem-btn-secondary"
                    onClick={() => handleCopy('anki', ankiContent)}
                  >
                    📋 Copy Cards TSV
                  </button>
                  {copiedFormat === 'anki' && (
                    <span className="dem-copied-toast">✓ Copied to clipboard!</span>
                  )}
                </div>
              </div>

              <div className="dem-preview-container">
                <div className="dem-preview-header">
                  <span>Anki Deck Preview (First few cards)</span>
                  <span>UTF-8 TSV</span>
                </div>
                <pre className="dem-preview-code">
                  {ankiContent.split('\n').slice(0, 10).join('\n')}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: Markdown Dossier */}
          {activeTab === 'markdown' && (
            <div className="dem-tab-content">
              <div className="dem-tab-overview">
                <div className="dem-overview-header">
                  <h4>Clean Markdown Summary (Notion / Obsidian)</h4>
                  <span className="dem-badge-pill">GitHub Flavored Markdown</span>
                </div>
                <p>
                  Complete documentation dossier formatted with clean headings, syntax-highlighted code blocks, collapsible Q&amp;A details, and pitfalls. Ready to paste straight into your personal knowledge base.
                </p>

                <div className="dem-action-buttons-row">
                  <button
                    type="button"
                    className="dem-btn-primary"
                    onClick={handleDownloadMarkdown}
                  >
                    📥 Download Markdown File (.md)
                  </button>
                  <button
                    type="button"
                    className="dem-btn-secondary"
                    onClick={() => handleCopy('markdown', markdownContent)}
                  >
                    📋 Copy Full Markdown
                  </button>
                  {copiedFormat === 'markdown' && (
                    <span className="dem-copied-toast">✓ Copied to clipboard!</span>
                  )}
                </div>
              </div>

              <div className="dem-preview-container">
                <div className="dem-preview-header">
                  <span>Markdown Preview</span>
                  <span>{markdownContent.length} characters</span>
                </div>
                <pre className="dem-preview-code">
                  {markdownContent.slice(0, 1200)}...
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="dem-footer">
          <span className="dem-footer-tip">
            💡 Tip: Anki spaced repetition ensures 90%+ long-term retention before system design &amp; frontend rounds.
          </span>
          <button
            type="button"
            className="dem-footer-close"
            onClick={onClose}
          >
            Close Exporter
          </button>
        </div>
      </div>
    </div>
  );
}
