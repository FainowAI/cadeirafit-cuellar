import React from 'react';
import { Check } from 'lucide-react';
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
  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center gap-2 transition-all duration-300",
              step.status === 'active' ? 'text-accent' : 'text-muted-foreground'
            )}
          >
            <span
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-medium transition-all duration-300 step-underline",
                step.status === 'completed' && 'bg-success text-success-foreground',
                step.status === 'active' && 'bg-accent text-accent-foreground scale-105 active',
                step.status === 'upcoming' && 'bg-muted text-muted-foreground'
              )}
            >
              {step.status === 'completed' ? (
                <Check className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </span>
            <span className="font-medium hidden sm:block">{step.label}</span>
            <span className="font-medium sm:hidden text-xs">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};