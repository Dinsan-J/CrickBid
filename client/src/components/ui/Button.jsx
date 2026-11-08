import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  icon: Icon = null,
  iconPosition = 'left',
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 rounded-xl';

  const variants = {
    // Emerald green high-impact sports action button
    primary: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-glow-sm hover:shadow-glow-emerald focus:ring-emerald-400 focus:ring-offset-crick-dark font-bold',
    
    // Deep navy solid secondary
    secondary: 'bg-crick-card hover:bg-crick-cardHover text-slate-100 border border-crick-border focus:ring-slate-400 dark:focus:ring-offset-crick-dark',
    
    // Clean outline
    outline: 'bg-transparent hover:bg-crick-surface text-slate-200 border border-crick-border hover:border-crick-lime/40 focus:ring-crick-lime',
    
    // Minimal ghost
    ghost: 'bg-transparent hover:bg-slate-200 dark:hover:bg-crick-surface text-slate-700 dark:text-slate-300 focus:ring-slate-400',
    
    // Gavel / Auction Hammer Alert Danger
    danger: 'bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 focus:ring-red-500',
    
    // Gold / Bid Highlight
    amber: 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 focus:ring-amber-500',

    // Pure light mode clean button
    light: 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-sm'
  };

  const sizes = {
    xs: 'text-xs px-2.5 py-1 gap-1.5 rounded-lg',
    sm: 'text-xs px-3 py-1.5 gap-2 rounded-lg',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5',
    xl: 'text-lg px-8 py-3.5 gap-3 font-bold'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
}
