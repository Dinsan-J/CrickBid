import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ size = 'md', text = 'Loading auction data...' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <Loader2 className={`${sizes[size] || sizes.md} animate-spin text-crick-lime`} />
      {text && (
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-crick-textMuted">
          {text}
        </span>
      )}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-crick-card border border-slate-200 dark:border-crick-border rounded-2xl p-6 animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-200 dark:bg-crick-surface rounded w-1/3" />
        <div className="h-6 w-14 bg-slate-200 dark:bg-crick-surface rounded-full" />
      </div>
      <div className="h-8 bg-slate-200 dark:bg-crick-surface rounded w-2/3" />
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-slate-200 dark:bg-crick-surface rounded w-full" />
        <div className="h-3 bg-slate-200 dark:bg-crick-surface rounded w-4/5" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
