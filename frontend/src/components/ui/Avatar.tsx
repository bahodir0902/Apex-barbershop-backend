import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

export interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const sizes = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-xl',
};

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, src, alt, fallback, size = 'md', ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex shrink-0 overflow-hidden rounded-full',
      sizes[size],
      className
    )}
    {...props}
  >
    <AvatarPrimitive.Image
      src={src || undefined}
      alt={alt}
      className="aspect-square h-full w-full object-cover"
    />
    <AvatarPrimitive.Fallback
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full font-medium',
        'bg-gradient-to-br from-gold-400 to-gold-600 text-dark-950'
      )}
    >
      {fallback ? getInitials(fallback) : alt ? getInitials(alt) : '?'}
    </AvatarPrimitive.Fallback>
  </AvatarPrimitive.Root>
));

Avatar.displayName = AvatarPrimitive.Root.displayName;

export { Avatar };
