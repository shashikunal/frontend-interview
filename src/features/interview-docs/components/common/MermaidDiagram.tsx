import { useEffect, useRef, useState } from 'react';

// NOTE: mermaid (~4.6MB) is dynamically imported on mount so the vendor-mermaid
// chunk only loads when a diagram actually renders — not with the docs bundle.

interface MermaidDiagramProps {
  chart: string;
  id?: string;
  caption?: string;
}

let diagramCounter = 0;

export function MermaidDiagram({ chart, id, caption }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const uniqueId = useRef(id || `mermaid-diag-${++diagramCounter}`);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const { default: mermaid } = await import('mermaid');
        if (!isMounted) return;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          fontFamily: 'Inter, system-ui, sans-serif',
          themeVariables: {
            darkMode: true,
            background: '#0b1437',
            primaryColor: '#6366f1',
            primaryTextColor: '#ffffff',
            primaryBorderColor: '#818cf8',
            lineColor: '#94a3b8',
            secondaryColor: '#1e293b',
            tertiaryColor: '#0f172a',
          },
        });

        const cleanChart = chart.trim();
        try {
          const { svg } = await mermaid.render(uniqueId.current, cleanChart);
          if (isMounted) {
            setSvgContent(svg);
            setError(null);
          }
        } catch (err) {
          if (isMounted) {
            console.warn('[Mermaid render fallback]:', err);
            setError('Diagram preview rendered via code structure.');
          }
        }
      } catch (e: unknown) {
        if (isMounted) {
          setError(e instanceof Error ? e.message : 'Failed to initialize diagram');
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  return (
    <figure className="docs-mermaid-wrapper">
      <div className="mermaid-render-box" ref={containerRef}>
        {svgContent ? (
          <div
            className="mermaid-svg-container"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : error ? (
          <pre className="mermaid-fallback-pre">{chart}</pre>
        ) : (
          <div className="mermaid-loading">Rendering architecture diagram...</div>
        )}
      </div>
      {caption && <figcaption className="mermaid-caption">{caption}</figcaption>}
    </figure>
  );
}
