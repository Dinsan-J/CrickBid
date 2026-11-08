import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error while loading this data.',
  onRetry = null,
  className = ''
}) {
  return (
    <div className={`p-6 sm:p-8 rounded-2xl border border-red-500/20 bg-red-500/5 text-center flex flex-col items-center justify-center ${className}`}>
      <div className="p-3 rounded-2xl bg-red-500/10 text-red-500 mb-3">
        <AlertCircle className="w-8 h-8" />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400">
        {title}
      </h3>

      <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md">
        {message}
      </p>

      {onRetry && (
        <div className="mt-5">
          <Button variant="danger" size="sm" icon={RotateCcw} onClick={onRetry}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
