import * as React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export function Rating({
  value,
  max = 5,
  size = 'md',
  showValue = false,
  interactive = false,
  onChange,
  className,
}: RatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);
  const displayValue = hoverValue ?? value;

  const handleClick = (rating: number) => {
    if (interactive && onChange) {
      onChange(rating);
    }
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const filled = displayValue >= starValue;
    const halfFilled = !filled && displayValue >= starValue - 0.5;

    return (
      <motion.button
        key={index}
        type="button"
        disabled={!interactive}
        className={cn(
          'transition-colors focus:outline-none',
          interactive && 'cursor-pointer hover:scale-110',
          !interactive && 'cursor-default'
        )}
        whileHover={interactive ? { scale: 1.2 } : undefined}
        whileTap={interactive ? { scale: 0.9 } : undefined}
        onClick={() => handleClick(starValue)}
        onMouseEnter={() => interactive && setHoverValue(starValue)}
        onMouseLeave={() => interactive && setHoverValue(null)}
      >
        {halfFilled ? (
          <StarHalf
            className={cn(
              sizes[size],
              'fill-gold-400 text-gold-400'
            )}
          />
        ) : (
          <Star
            className={cn(
              sizes[size],
              filled
                ? 'fill-gold-400 text-gold-400'
                : 'text-dark-300 dark:text-dark-600'
            )}
          />
        )}
      </motion.button>
    );
  };

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }).map((_, i) => renderStar(i))}
      {showValue && (
        <span className="ml-2 text-sm font-medium text-dark-600 dark:text-dark-400">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
