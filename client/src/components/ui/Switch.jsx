import React from 'react';

export default function Switch({
  checked = false,
  onChange,
  label = '',
  description = '',
  disabled = false,
  id,
  className = ''
}) {
  const switchId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex items-start justify-between gap-3 ${className}`}>
      {(label || description) && (
        <label htmlFor={switchId} className="cursor-pointer select-none">
          {label && (
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {label}
            </div>
          )}
          {description && (
            <div className="text-xs text-slate-500 dark:text-crick-textMuted mt-0.5">
              {description}
            </div>
          )}
        </label>
      )}

      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange && onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-crick-lime focus:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          ${checked ? 'bg-crick-lime' : 'bg-slate-300 dark:bg-crick-surface'}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-crick-dark shadow-md ring-0
            transition duration-200 ease-in-out
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
}
