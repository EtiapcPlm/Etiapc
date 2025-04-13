// version1
// author Yxff
import React from 'react';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';

interface AccessibleButtonProps extends ButtonProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-pressed'?: boolean;
  'aria-haspopup'?: boolean;
  'aria-controls'?: string;
}

export const AccessibleButton = React.forwardRef<
  HTMLButtonElement,
  AccessibleButtonProps
>(({ 
  className,
  children,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  'aria-expanded': ariaExpanded,
  'aria-pressed': ariaPressed,
  'aria-haspopup': ariaHaspopup,
  'aria-controls': ariaControls,
  ...props
}, ref) => {
  return (
    <Button
      ref={ref}
      className={cn(
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
        className
      )}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      aria-expanded={ariaExpanded}
      aria-pressed={ariaPressed}
      aria-haspopup={ariaHaspopup}
      aria-controls={ariaControls}
      {...props}
    >
      {children}
    </Button>
  );
});

AccessibleButton.displayName = 'AccessibleButton';