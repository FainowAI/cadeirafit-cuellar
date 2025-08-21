import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[#F7F7F7]",
        className
      )}
      {...props}
    />
  );
};

export const SkeletonLine: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <Skeleton
      className={cn(
        "h-4 w-full",
        className
      )}
      {...props}
    />
  );
};

export const SkeletonCard: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={cn("rounded-2xl border p-6 space-y-4", className)}>
      {/* Image placeholder */}
      <Skeleton className="aspect-square w-full rounded-2xl" />
      
      {/* Title */}
      <Skeleton className="h-6 w-3/4" />
      
      {/* Description lines */}
      <div className="space-y-2">
        <SkeletonLine className="w-full" />
        <SkeletonLine className="w-5/6" />
      </div>
      
      {/* Badge */}
      <Skeleton className="h-6 w-24 rounded-full" />
    </div>
  );
};