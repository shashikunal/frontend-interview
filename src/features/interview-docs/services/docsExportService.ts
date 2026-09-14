import type { SubjectId } from '../types/docs.types';
import { ALL_SUBJECTS_CATALOG } from '../data/subjectsCatalog';
import { ALL_QUESTIONS_REGISTRY } from '../data/docsRegistry';
import { docsProgressService } from './docsProgressService';

export class DocsExportService {
  /**
   * Helper to trigger a browser file download of text content
   */
  private downloadFile(content: string, filename: string, mimeType: string = 'text/markdown;charset=utf-8;') {
    if (typeof window === 'undefined') return;

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Generates and downloads a complete personalized Interview Study Plan as Markdown
   */
  exportMarkdownStudyPlan(): void {
    const progress = docsProgressService.getProgress();
    const { overallScore, trackScores } = docsProgressService.calculateOverallReadiness();
    const dateStr = new Date().toISOString().split('T')[0];

    let md = `# Frontend Interview University — Personalized Study Plan\n\n`;
    md += `*Generated on: ${dateStr}*\n`;
    md += `*Overall Technical Readiness:* **${overallScore}%**\n\n`;
    md += `---\n\n`;

    // 1. Executive Summary
    md += `## 1. Technical Competency Overview (21 Tracks)\n\n`;
    md += `| Track | Category | Score | Topics Read | Questions Mastered |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- |\n`;

    ALL_SUBJECTS_CATALOG.forEach(s => {
      const score = trackScores[s.id] || 0;
      const sp = progress.subjectProgress[s.id] || { topicsRead: 0, questionsPracticed: 0, masteredCount: 0 };
      md += `| ${s.icon} ${s.title} | ${s.category} | **${score}%** | ${sp.topicsRead}/${s.totalTopicsCount} | ${sp.masteredCount} |\n`;
    });

    md += `\n---\n\n`;

    // 2. Saved Bookmarks (High-Priority Review)
    const bookmarkedQuestions = ALL_QUESTIONS_REGISTRY.filter(q => progress.bookmarkedQuestions.includes(q.id));

    md += `## 2. High-Priority Bookmarked Questions (${bookmarkedQuestions.length})\n\n`;
    if (bookmarkedQuestions.length === 0) {
      md += `*No questions currently bookmarked. Bookmark questions during your practice or reading sessions to include them here.*\n\n`;
    } else {
      bookmarkedQuestions.forEach((q, idx) => {
        md += `### Q${idx + 1}. [${q.difficulty.toUpperCase()}] ${q.question}\n\n`;
        md += `- **Track:** \`${q.subjectId}\` | **Type:** \`${q.type}\`\n\n`;
        md += `#### Core Takeaway:\n${q.shortAnswer}\n\n`;
        md += `#### Detailed Answer:\n${q.detailedAnswer}\n\n`;
        if (q.seniorAnswer) {
          md += `#### Senior / Architect View:\n${q.seniorAnswer}\n\n`;
        }
        if (q.whyAsked) {
          md += `#### Why Interviewers Ask This:\n${q.whyAsked}\n\n`;
        }
        if (q.code) {
          md += `\`\`\`${q.code.language}\n${q.code.snippet}\n\`\`\`\n\n`;
        }
        md += `---\n\n`;
      });
    }

    // 3. Recommended Study Next Steps
    md += `## 3. Recommended Action Items\n\n`;
    const weakTracks = ALL_SUBJECTS_CATALOG
      .map(s => ({ title: s.title, icon: s.icon, score: trackScores[s.id] || 0 }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);

    md += `Focus on boosting your lowest 5 readiness tracks:\n`;
    weakTracks.forEach((t, i) => {
      md += `${i + 1}. **${t.icon} ${t.title}** (Current Readiness: ${t.score}%)\n`;
    });

    md += `\n*Exported from Frontend Interview University inside the Application.*`;

    this.downloadFile(md, `Frontend-Interview-Study-Plan-${dateStr}.md`);
  }

  /**
   * Generates a single Track Cheat Sheet in Markdown
   */
  exportTrackCheatSheet(subjectId: SubjectId): void {
    const subject = ALL_SUBJECTS_CATALOG.find(s => s.id === subjectId);
    if (!subject) return;

    const questions = ALL_QUESTIONS_REGISTRY.filter(q => q.subjectId === subjectId);
    const dateStr = new Date().toISOString().split('T')[0];

    let md = `# ${subject.icon} ${subject.title} — Technical Interview Cheat Sheet\n\n`;
    md += `*Category:* \`${subject.category}\` | *Total High-Yield Questions:* **${questions.length}**\n\n`;
    md += `---\n\n`;

    questions.forEach((q, idx) => {
      md += `## ${idx + 1}. [${q.difficulty.toUpperCase()}] ${q.question}\n\n`;
      md += `**Quick Takeaway:** ${q.shortAnswer}\n\n`;
      md += `${q.detailedAnswer}\n\n`;

      if (q.seniorAnswer) {
        md += `> **Senior Perspective:** ${q.seniorAnswer}\n\n`;
      }

      if (q.code) {
        md += `\`\`\`${q.code.language}\n${q.code.snippet}\n\`\`\`\n\n`;
      }

      if (q.followUps && q.followUps.length > 0) {
        md += `**Likely Interview Follow-Ups:**\n`;
        q.followUps.forEach(f => {
          md += `- **${f.question}**: ${f.expectedAnswer}\n`;
        });
        md += `\n`;
      }

      md += `---\n\n`;
    });

    this.downloadFile(md, `${subjectId}-interview-cheatsheet-${dateStr}.md`);
  }

  /**
   * Triggers the browser's clean print dialog
   */
  triggerPrintView(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}

export const docsExportService = new DocsExportService();
