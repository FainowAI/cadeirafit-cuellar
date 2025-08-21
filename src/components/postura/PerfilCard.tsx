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
    <div className="flex items-start space-x-3 space-y-0">
      <RadioGroupItem 
        value={id} 
        id={id} 
        className="mt-6 flex-shrink-0" 
        aria-describedby={`${id}-description`}
      />
      <label
        htmlFor={id}
        className={cn(
          "flex-1 cursor-pointer rounded-lg border-2 p-4 transition-all duration-200",
          "hover:border-accent/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          isSelected 
            ? "border-accent bg-accent/5 shadow-md" 
            : "border-muted hover:shadow-sm"
        )}
        onClick={() => onSelect(id)}
      >
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="w-16 h-16 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt={`Ilustração de coluna com ${label.toLowerCase()}`}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className={cn(
              "font-medium text-sm mb-1",
              isSelected ? "text-accent" : "text-foreground"
            )}>
              {label}
            </div>
            <div 
              id={`${id}-description`}
              className="text-xs text-muted-foreground leading-relaxed"
            >
              {description}
            </div>
          </div>
        </div>
      </label>
    </div>
  );
};