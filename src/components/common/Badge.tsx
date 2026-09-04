import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const variantClass = {
    primary: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-[0_1px_3px_rgba(99,102,241,0.12),inset_0_1px_1.5px_rgba(255,255,255,0.9)]',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-[0_1px_3px_rgba(34,197,94,0.12),inset_0_1px_1.5px_rgba(255,255,255,0.9)]',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/80 shadow-[0_1px_3px_rgba(245,158,11,0.12),inset_0_1px_1.5px_rgba(255,255,255,0.9)]',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/80 shadow-[0_1px_3px_rgba(239,68,68,0.12),inset_0_1px_1.5px_rgba(255,255,255,0.9)]',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.06),inset_0_1px_1.5px_rgba(255,255,255,0.9)]',
  }[variant];

  const sizeClass = {
    sm: 'px-2 py-0.5 text-[11px] font-medium rounded-lg',
    md: 'px-2.5 py-1 text-xs font-semibold rounded-xl',
    lg: 'px-3 py-1.5 text-xs font-bold rounded-xl',
  }[size];

  return (
    <span
      className={twMerge(clsx('clay-badge inline-flex items-center gap-1 shrink-0 select-none transition-all', variantClass, sizeClass, className))}
      {...props}
    >
      {children}
    </span>
  );
};
