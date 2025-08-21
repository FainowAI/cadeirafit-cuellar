import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SecondaryButtonProps extends Omit<ButtonProps, 'variant'> {}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Button
      variant="outline"
      className={cn(
        "border-[#E5E7EB] bg-background text-foreground font-medium transition-all duration-200",
        "hover:bg-[#F7F7F7] focus:ring-2 focus:ring-[#D4AF37]/40 focus:ring-offset-2",
        "scale-press hover-lift",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};