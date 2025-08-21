import React from 'react';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export type StepStatus = 'completed' | 'active' | 'upcoming';

interface Step {
  id: string;
  label: string;
  status: StepStatus;
}

interface StepperProps {
  steps: Step[];
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({ steps, className }) => {
  const reducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <div className="flex items-center justify-between mb-6 relative">
        {/* Progress line background */}
        <div className="absolute top-4 left-0 w-full h-0.5 bg-muted -z-10" />
        
        {/* Animated progress line */}
        <motion.div
          className="absolute top-4 left-0 h-0.5 bg-[#D4AF37] -z-10"
          initial={{ width: "0%" }}
          animate={{ 
            width: steps.findIndex(s => s.status === 'active') === -1 
              ? "100%" 
              : `${(steps.findIndex(s => s.status === 'active') / (steps.length - 1)) * 100}%`
          }}
          transition={{ 
            duration: reducedMotion ? 0 : 0.6,
            ease: [0.22, 1, 0.36, 1] as const
          }}
        />

        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            className={cn(
              "flex items-center gap-2 transition-all duration-300 relative",
              step.status === 'active' ? 'text-accent' : 'text-muted-foreground'
            )}
            initial={reducedMotion ? {} : { opacity: 0, y: 4 }}
            animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.span
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-medium transition-all duration-300 bg-background border-2 relative",
                step.status === 'completed' && 'bg-success border-success text-success-foreground',
                step.status === 'active' && 'bg-accent border-accent text-accent-foreground',
                step.status === 'upcoming' && 'bg-muted border-muted text-muted-foreground'
              )}
              animate={step.status === 'active' && !reducedMotion ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            >
              <AnimatePresence mode="wait">
                {step.status === 'completed' ? (
                  <motion.div
                    key="check"
                    initial={reducedMotion ? {} : { scale: 0.8, rotate: -8 }}
                    animate={reducedMotion ? {} : { scale: 1, rotate: 0 }}
                    exit={reducedMotion ? {} : { scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] as const }}
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.span
                    key="number"
                    initial={reducedMotion ? {} : { scale: 0.8 }}
                    animate={reducedMotion ? {} : { scale: 1 }}
                    exit={reducedMotion ? {} : { scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    {index + 1}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.span>
            
            <span className="font-medium hidden sm:block">{step.label}</span>
            <span className="font-medium sm:hidden text-xs">{step.label}</span>
            
            {/* Active step underline */}
            {step.status === 'active' && (
              <motion.div
                className="absolute -bottom-1 left-1/2 h-0.5 bg-[#D4AF37]"
                initial={{ width: 0, x: "-50%" }}
                animate={{ width: "100%", x: "-50%" }}
                transition={{ 
                  duration: reducedMotion ? 0 : 0.4,
                  ease: [0.22, 1, 0.36, 1] as const
                }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};