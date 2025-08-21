import React from 'react';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface PerfilCardProps {
  id: string;
  label: string;
  description: string;
  imageUrl: string;
  isSelected: boolean;
  onSelect: (value: string) => void;
}

export const PerfilCard: React.FC<PerfilCardProps> = ({
  id,
  label,
  description,
  imageUrl,
  isSelected,
  onSelect,
}) => {
  return (
    <div className="relative">
      <RadioGroupItem 
        value={id} 
        id={id} 
        className="absolute top-2 right-2 z-10" 
        aria-describedby={`${id}-description`}
      />
      <label
        htmlFor={id}
        className={cn(
          "block cursor-pointer rounded-lg border-2 p-4 transition-all duration-200",
          "hover:border-accent/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          isSelected 
            ? "border-accent bg-accent/5 shadow-md" 
            : "border-muted hover:shadow-sm"
        )}
        onClick={() => onSelect(id)}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 flex-shrink-0 bg-muted rounded-lg overflow-hidden mb-3">
            <img
              src={imageUrl}
              alt={`Ilustração de coluna com ${label.toLowerCase()}`}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
          <div className="space-y-2">
            <div className={cn(
              "font-medium text-base",
              isSelected ? "text-accent" : "text-foreground"
            )}>
              {label}
            </div>
            <div 
              id={`${id}-description`}
              className="text-sm text-muted-foreground leading-relaxed"
            >
              {description}
            </div>
          </div>
        </div>
      </label>
    </div>
  );
};