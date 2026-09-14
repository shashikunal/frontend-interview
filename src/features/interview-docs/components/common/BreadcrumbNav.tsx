import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <nav className="docs-breadcrumb" aria-label="Breadcrumb">
      <ol className="docs-breadcrumb-list">
        <li className="docs-breadcrumb-item">
          <Link to="/docs" className="docs-breadcrumb-link">
            📚 Interview Docs
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="docs-breadcrumb-item">
              <span className="docs-breadcrumb-separator">/</span>
              {item.path && !isLast ? (
                <Link to={item.path} className="docs-breadcrumb-link">
                  {item.label}
                </Link>
              ) : (
                <span className="docs-breadcrumb-current" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
