import * as React from 'react';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

const variantStyles = {
  primary: 'bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 hover:from-gold-400 hover:to-gold-500 shadow-lg shadow-gold-500/25 font-semibold',
  secondary: 'bg-dark-800 text-white hover:bg-dark-700 dark:bg-dark-700 dark:hover:bg-dark-600',
  outline: 'border-2 border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-dark-950 dark:border-gold-400 dark:text-gold-400',
  ghost: 'text-dark-600 hover:text-dark-900 hover:bg-dark-100 dark:text-dark-300 dark:hover:text-white dark:hover:bg-dark-800',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/25',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-base rounded-xl',
  lg: 'px-8 py-3.5 text-lg rounded-xl',
  icon: 'p-2.5 rounded-xl',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const buttonClassName = cn(
      'relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]',
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    // When using asChild, the children should be a single element (like <Link>)
    // and we pass the className through to it
    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={buttonClassName}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={buttonClassName}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
