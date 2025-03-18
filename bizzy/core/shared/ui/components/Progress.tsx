import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '../utils/cn';

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    value?: number;
    max?: number;
    variant?: 'default' | 'success' | 'info' | 'warning' | 'danger';
  }
>(({ className, value = 0, max = 100, variant = 'default', ...props }, ref) => {
  const percentage = Math.min(Math.max(0, value), max) / max * 100;
  
  const getVariantClass = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-600';
      case 'info':
        return 'bg-blue-600';
      case 'warning':
        return 'bg-amber-600';
      case 'danger':
        return 'bg-red-600';
      default:
        return 'bg-theme-primary';
    }
  };

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-theme-bg-secondary',
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          'h-full w-full flex-1 transition-all',
          getVariantClass()
        )}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress }; 