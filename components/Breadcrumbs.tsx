import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiChevronRight, FiHome } from 'react-icons/fi';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const router = useRouter();

  // Default breadcrumb generation from route
  const generateDefaultBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = router.asPath.split('/').filter((p) => p);

    if (paths.length === 0) {
      return [{ label: 'Home', href: '/' }];
    }

    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

    let href = '';
    paths.forEach((path, index) => {
      href += `/${path}`;

      // Format label (capitalize and replace hyphens)
      const label = path
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Don't add [id] as a breadcrumb
      if (!path.includes('[') && index === paths.length - 1) {
        breadcrumbs.push({ label });
      } else if (!path.includes('[')) {
        breadcrumbs.push({ label, href });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = items || generateDefaultBreadcrumbs();

  return (
    <nav
      className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400 overflow-x-auto pb-2 sm:pb-0"
      aria-label="Breadcrumb"
    >
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
          {index === 0 ? (
            <Link
              href={crumb.href || '/'}
              className="flex items-center gap-1 hover:text-blue-400 transition-colors"
            >
              <FiHome className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{crumb.label}</span>
            </Link>
          ) : (
            <>
              <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-blue-400 transition-colors truncate"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-500 truncate">{crumb.label}</span>
              )}
            </>
          )}
        </div>
      ))}
    </nav>
  );
}
