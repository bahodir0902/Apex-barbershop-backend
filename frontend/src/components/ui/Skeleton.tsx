import * as React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circular' | 'rounded';
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'rounded-lg',
      circular: 'rounded-full',
      rounded: 'rounded-2xl',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-dark-200 dark:bg-dark-700',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Skeleton components for common patterns
const SkeletonCard = () => (
  <div className="rounded-2xl border border-dark-200 dark:border-dark-700 p-6 space-y-4">
    <Skeleton className="h-40 w-full" variant="rounded" />
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex gap-2">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

const SkeletonAvatar = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  };

  return <Skeleton className={sizes[size]} variant="circular" />;
};

const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className="h-4"
        style={{ width: i === lines - 1 ? '60%' : '100%' }}
      />
    ))}
  </div>
);

export { Skeleton, SkeletonCard, SkeletonAvatar, SkeletonText };
