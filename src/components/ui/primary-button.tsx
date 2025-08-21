import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrimaryButtonProps extends Omit<ButtonProps, 'variant'> {
  loading?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  loading = false,
  disabled,
  className,
  ...props
}) => {
  return (
    <Button
      variant="default"
      disabled={disabled || loading}
      className={cn(
        "bg-[#000000] text-white font-medium transition-all duration-200",
        "hover:bg-[#111111] focus:ring-2 focus:ring-[#D4AF37]/40 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "scale-press hover-lift",
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
      {children}
    </Button>
  );
};