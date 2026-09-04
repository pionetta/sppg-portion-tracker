import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

interface ClayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const ClayButton: React.FC<ClayButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseClass = 'clay-button font-medium select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  const sizeClass = {
    sm: 'px-3 py-1.5 text-xs rounded-xl min-h-[36px]',
    md: 'px-4 py-2.5 text-sm rounded-2xl min-h-[44px]',
    lg: 'px-5 py-3 text-base rounded-2xl min-h-[50px]',
  }[size];

  const variantClass = {
    primary: 'clay-button-primary',
    secondary: 'clay-button-secondary',
    success: 'clay-button-success',
    danger: 'clay-button-danger',
    ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-700 active:bg-neutral-200 border-none shadow-none',
  }[variant];

  return (
    <button
      className={twMerge(clsx(baseClass, sizeClass, variantClass, className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
