import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Loader } from '@/components/motion/Loader';
import { motion } from 'framer-motion';
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
  const buttonContent = loading ? (
    <motion.div 
      className="flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
    >
      <Loader size={16} className="mr-2" />
      <span>Carregando...</span>
    </motion.div>
  ) : children;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] as const }}
    >
      <Button
        variant="default"
        disabled={disabled || loading}
        className={cn(
          "bg-[#000000] text-white font-medium transition-all duration-200",
          "hover:bg-[#111111] focus:ring-2 focus:ring-[#D4AF37]/40 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          loading && "min-w-[120px]", // Prevent button width jumping
          className
        )}
        {...props}
      >
        {buttonContent}
      </Button>
    </motion.div>
  );
};