import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
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
    primary: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/60',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    neutral: 'bg-neutral-100 text-neutral-700 border border-neutral-200/70',
  }[variant];

  const sizeClass = {
    sm: 'px-2 py-0.5 text-[11px] font-medium rounded-lg',
    md: 'px-2.5 py-1 text-xs font-semibold rounded-xl',
  }[size];

  return (
    <span
      className={twMerge(clsx('inline-flex items-center gap-1 shrink-0 select-none', variantClass, sizeClass, className))}
      {...props}
    >
      {children}
    </span>
  );
};
