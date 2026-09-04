import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ClayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'interactive';
  className?: string;
  children: React.ReactNode;
}

export const ClayCard: React.FC<ClayCardProps> = ({
  variant = 'default',
  className,
  children,
  ...props
}) => {
  const variantClass = {
    default: 'clay-card p-4 sm:p-5',
    flat: 'clay-card-flat p-4',
    interactive: 'clay-card-interactive p-4 cursor-pointer',
  }[variant];

  return (
    <div className={twMerge(clsx(variantClass, className))} {...props}>
      {children}
    </div>
  );
};
