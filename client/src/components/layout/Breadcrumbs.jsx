import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const formatSegment = (str) => {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-crick-textMuted py-2 mb-4 overflow-x-auto">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-white transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Dashboard</span>
      </Link>

      {pathnames.slice(1).map((segment, index) => {
        const to = `/${pathnames.slice(0, index + 2).join('/')}`;
        const isLast = index === pathnames.slice(1).length - 1;

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-crick-border shrink-0" />
            {isLast ? (
              <span className="font-bold text-slate-800 dark:text-crick-lime truncate">
                {formatSegment(segment)}
              </span>
            ) : (
              <Link
                to={to}
                className="hover:text-slate-800 dark:hover:text-white transition-colors truncate"
              >
                {formatSegment(segment)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
