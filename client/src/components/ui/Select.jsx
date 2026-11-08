import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({
  label,
  options = [],
  error,
  helper,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        <select
          ref={ref}
          id={selectId}
          className={`
            w-full appearance-none rounded-xl text-sm font-medium transition-all duration-150
            bg-white dark:bg-crick-navy/90 text-slate-900 dark:text-slate-100
            border border-slate-300 dark:border-crick-border
            focus:outline-none focus:ring-2 focus:ring-crick-lime focus:border-transparent
            disabled:opacity-60 pl-3.5 pr-10 py-2.5
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option 
              key={opt.value} 
              value={opt.value} 
              className="bg-white dark:bg-crick-surface text-slate-900 dark:text-slate-100"
            >
              {opt.label}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 dark:text-crick-textMuted">
          <ChevronDown className="w-4 h-4" />
        </div>
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

Select.displayName = 'Select';
export default Select;
