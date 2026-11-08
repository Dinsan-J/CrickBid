import React from 'react';

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = ''
}) {
  const variants = {
    lime: 'bg-crick-lime/15 text-emerald-600 dark:text-crick-lime border border-crick-lime/30',
    live: 'bg-red-500/15 text-red-500 dark:text-red-400 border border-red-500/30 animate-pulse-fast',
    amber: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30',
    blue: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30',
    purple: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30',
    neutral: 'bg-slate-200 dark:bg-crick-surface text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-crick-border',
    success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
    danger: 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
  };

  const sizes = {
    sm: 'text-[10px] font-semibold px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs font-semibold px-2.5 py-0.5 rounded-lg gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1 rounded-lg gap-2'
  };

  return (
    <span className={`inline-flex items-center tracking-wide uppercase ${variants[variant] || variants.neutral} ${sizes[size] || sizes.md} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${
          variant === 'live' || variant === 'danger' ? 'bg-red-500' :
          variant === 'lime' ? 'bg-crick-lime' :
          variant === 'amber' ? 'bg-amber-400' : 'bg-current'
        }`} />
      )}
      {children}
    </span>
  );
}
