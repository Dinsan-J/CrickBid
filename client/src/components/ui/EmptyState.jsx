import React from 'react';
import { FolderOpen } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = FolderOpen,
  title = 'No items found',
  description = 'Get started by creating your first entry.',
  actionText = '',
  onAction = null,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-crick-border bg-slate-50/50 dark:bg-crick-card/40 ${className}`}>
      <div className="p-4 rounded-2xl bg-white dark:bg-crick-surface border border-slate-200 dark:border-crick-border shadow-sm mb-4">
        <Icon className="w-8 h-8 text-crick-lime" />
      </div>
      
      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
        {title}
      </h3>
      
      <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-crick-textMuted max-w-sm">
        {description}
      </p>

      {actionText && onAction && (
        <div className="mt-6">
          <Button variant="primary" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
}
