import React from 'react';

export function Card({ children, className = '', glow = false, hover = false, ...props }) {
  return (
    <div
      className={`
        bg-white dark:bg-crick-card text-slate-800 dark:text-slate-100
        border border-slate-200 dark:border-crick-border
        rounded-2xl shadow-sm dark:shadow-card-dark
        transition-all duration-200
        ${hover ? 'hover:border-slate-300 dark:hover:border-crick-borderLight hover:shadow-md' : ''}
        ${glow ? 'shadow-glow-sm border-crick-lime/40' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`p-5 sm:p-6 border-b border-slate-100 dark:border-crick-border/70 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3 className={`text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={`mt-1 text-xs sm:text-sm text-slate-500 dark:text-crick-textMuted ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={`p-5 sm:p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`p-4 sm:p-6 bg-slate-50/50 dark:bg-crick-surface/40 border-t border-slate-100 dark:border-crick-border/70 rounded-b-2xl ${className}`} {...props}>
      {children}
    </div>
  );
}
