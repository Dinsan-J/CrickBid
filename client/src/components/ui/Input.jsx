import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  helper,
  icon: Icon = null,
  rightElement = null,
  className = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-crick-textMuted">
            <Icon className="w-4 h-4" />
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`
            w-full rounded-xl text-sm font-medium transition-all duration-150
            bg-white dark:bg-crick-navy/90 text-slate-900 dark:text-slate-100
            border border-slate-300 dark:border-crick-border
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            focus:outline-none focus:ring-2 focus:ring-crick-lime focus:border-transparent
            disabled:bg-slate-100 dark:disabled:bg-crick-surface disabled:opacity-60
            ${Icon ? 'pl-10' : 'pl-3.5'}
            ${rightElement ? 'pr-11' : 'pr-3.5'}
            py-2.5
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
          <span>•</span> {error}
        </p>
      )}

      {helper && !error && (
        <p className="text-xs text-slate-500 dark:text-crick-textMuted mt-1">
          {helper}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
