import React from 'react';
import { BreadcrumbItem } from '../../types';
import { ChevronLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  englishTitle?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  badgeText?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  englishTitle,
  description,
  breadcrumbs = [{ title: 'صفحه اصلی', path: '/' }],
  badgeText,
  actions
}) => {
  return (
    <div className="mb-6 pb-6 border-b border-stone-200 dark:border-stone-800">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-xs text-stone-500 dark:text-stone-400 mb-2 gap-1.5 font-medium">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            {crumb.path ? (
              <Link to={crumb.path} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                {crumb.title}
              </Link>
            ) : (
              <span className="text-stone-800 dark:text-stone-200 font-semibold">{crumb.title}</span>
            )}
            {idx < breadcrumbs.length - 1 && (
              <ChevronLeft className="w-3.5 h-3.5 text-stone-400 dark:text-stone-600" />
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Main Title & Action Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              {title}
            </h1>
            {englishTitle && (
              <span className="text-xs font-semibold px-2.5 py-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-md border border-stone-200 dark:border-stone-700/60" dir="ltr">
                {englishTitle}
              </span>
            )}
            {badgeText && (
              <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 rounded-md">
                {badgeText}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1.5 text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-3xl">
              {description}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2.5">{actions}</div>}
      </div>
    </div>
  );
};
