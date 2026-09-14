import { useEffect, useState, useCallback } from 'react';

interface TocItem {
  id: string;
  label: string;
}

interface DocsTableOfContentsProps {
  items: TocItem[];
}

export function DocsTableOfContents({ items }: DocsTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        // Find visible section closest to the top offset
        const intersecting = entries.filter(e => e.isIntersecting);
        if (intersecting.length > 0) {
          // Sort by top position relative to viewport
          intersecting.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(intersecting[0].target.id);
        }
      },
      { rootMargin: '-84px 0% -65% 0%' }
    );

    items.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  // Handle click navigation with sticky header offset (64px + 20px = 84px)
  const handleItemClick = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setActiveId(id);
      window.history.pushState(null, '', `#${id}`);
    }
    setIsMobileOpen(false);
  }, []);

  if (items.length === 0) return null;

  return (
    <>
      {/* Mobile / Tablet Collapsible On This Page Control (< 1100px) */}
      <div className="docs-mobile-toc-container">
        <button
          type="button"
          className="docs-mobile-toc-toggle-btn"
          onClick={() => setIsMobileOpen(prev => !prev)}
          aria-expanded={isMobileOpen}
          aria-controls="mobile-toc-dropdown"
        >
          <span className="dmt-icon">📑</span>
          <span className="dmt-label">On This Page</span>
          <span className="dmt-current">{items.find(i => i.id === activeId)?.label || 'Sections'}</span>
          <span className="dmt-arrow">{isMobileOpen ? '▲' : '▼'}</span>
        </button>

        {isMobileOpen && (
          <div id="mobile-toc-dropdown" className="docs-mobile-toc-dropdown" role="menu">
            <ul className="docs-mobile-toc-list">
              {items.map(item => (
                <li key={item.id} className="docs-mobile-toc-item">
                  <a
                    href={`#${item.id}`}
                    className={`docs-mobile-toc-link ${activeId === item.id ? 'active' : ''}`}
                    onClick={e => handleItemClick(e, item.id)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Desktop Sticky Table of Contents (>= 1100px) */}
      <aside className="docs-toc-sidebar" aria-label="Table of Contents">
        <div className="docs-toc-inner">
          <div className="docs-toc-header">
            <span className="docs-toc-icon">📑</span>
            <h4 className="docs-toc-title">ON THIS PAGE</h4>
          </div>
          <ul className="docs-toc-list">
            {items.map(item => (
              <li key={item.id} className="docs-toc-item">
                <a
                  href={`#${item.id}`}
                  className={`docs-toc-link ${activeId === item.id ? 'active' : ''}`}
                  onClick={e => handleItemClick(e, item.id)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
