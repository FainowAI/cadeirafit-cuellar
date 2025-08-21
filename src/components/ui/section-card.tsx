import React from 'react';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  children,
  className,
  icon,
  title,
  subtitle,
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl bg-card border shadow-card p-8 hover-lift",
        className
      )}
    >
      {(title || subtitle || icon) && (
        <div className="mb-6 text-center">
          {icon && (
            <div className="flex items-center justify-center mb-3">
              {icon}
            </div>
          )}
          {title && (
            <h2 className="text-3xl md:text-2xl font-bold text-card-foreground mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-base text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};