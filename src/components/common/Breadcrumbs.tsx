import { Link, useLocation } from 'react-router';
import { cn } from '@/utils/cn';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

// «Хлібні крихти»: поточний шлях → список ланок; остання ланка — не посилання
export default function Breadcrumbs({ items }: { items?: BreadcrumbItem[] }) {
  const location = useLocation();
  const crumbs: BreadcrumbItem[] =
    items ??
    location.pathname
      .split('/')
      .filter(Boolean)
      .map((segment, i, arr) => ({
        label: decodeURIComponent(segment),
        to: i < arr.length - 1 ? `/${arr.slice(0, i + 1).join('/')}` : undefined,
      }));

  return (
    <nav aria-label="Хлібні крихти" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
        <li>
          <Link to="/" className="hover:text-primary-600">
            Головна
          </Link>
        </li>
        {crumbs.map((c) => (
          <li key={c.label} className="flex items-center gap-1">
            <span aria-hidden="true">/</span>
            {c.to ? (
              <Link to={c.to} className={cn('hover:text-primary-600')}>
                {c.label}
              </Link>
            ) : (
              <span className="font-medium text-gray-800 dark:text-gray-200" aria-current="page">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
