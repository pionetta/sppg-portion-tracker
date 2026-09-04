import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ClayInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const ClayInput = React.forwardRef<HTMLInputElement, ClayInputProps>(
  ({ label, error, helperText, leftAddon, rightAddon, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-[#111111] px-0.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-neutral-400">
              {leftAddon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={twMerge(
              clsx(
                'clay-input w-full px-3.5 py-2.5 text-sm sm:text-base text-[#111111] placeholder:text-neutral-400 focus:outline-none transition-all',
                leftAddon && 'pl-10',
                rightAddon && 'pr-10',
                error && 'border-[#EF4444] focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]',
                className
              )
            )}
            {...props}
          />
          {rightAddon && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-neutral-400">
              {rightAddon}
            </div>
          )}
        </div>
        {error && <span className="text-xs text-[#EF4444] font-medium px-0.5">{error}</span>}
        {helperText && !error && (
          <span className="text-xs text-[#666666] px-0.5">{helperText}</span>
        )}
      </div>
    );
  }
);

ClayInput.displayName = 'ClayInput';
