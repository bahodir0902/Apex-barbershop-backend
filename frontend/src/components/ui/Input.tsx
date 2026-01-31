import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, hint, leftIcon, rightIcon, ...props }, ref) => {
    const id = React.useId();
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 dark:text-dark-500">
              {leftIcon}
            </div>
          )}
          <input
            id={id}
            type={type}
            className={cn(
              'w-full rounded-xl border bg-white px-4 py-3 text-dark-900 transition-all duration-200',
              'placeholder:text-dark-400 dark:placeholder:text-dark-500',
              'dark:bg-dark-800 dark:text-white',
              'focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent',
              'disabled:bg-dark-100 disabled:text-dark-400 disabled:cursor-not-allowed dark:disabled:bg-dark-900',
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-dark-200 dark:border-dark-700',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 dark:text-dark-500">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || hint) && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'mt-1.5 text-sm',
              error ? 'text-red-500' : 'text-dark-500 dark:text-dark-400'
            )}
          >
            {error || hint}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
