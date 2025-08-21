import React from 'react';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Expand } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  id: string;
  label: string;
  description: string;
  imageUrl: string;
  isSelected: boolean;
  onSelect: (value: string) => void;
  onExpandImage: (imageUrl: string, label: string, description: string) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  id,
  label,
  description,
  imageUrl,
  isSelected,
  onSelect,
  onExpandImage,
}) => {
  return (
    <div className="relative">
      <RadioGroupItem 
        value={id} 
        id={id} 
        className="absolute top-3 right-3 z-10" 
        aria-describedby={`${id}-description`}
      />
      <label
        htmlFor={id}
        className={cn(
          "block cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 ripple scale-press",
          "hover:border-[#D4AF37]/50 hover:shadow-card hover:-translate-y-px focus-within:ring-2 focus-within:ring-[#D4AF37]/40 focus-within:ring-offset-2",
          isSelected 
            ? "border-[#D4AF37] bg-[#D4AF37]/5 shadow-card ring-2 ring-[#D4AF37]/30 profile-select" 
            : "border-border hover:shadow-md"
        )}
        onClick={() => onSelect(id)}
      >
        <div className="flex flex-col items-center text-center">
          {/* Imagem 1:1 */}
          <div className="w-20 h-20 flex-shrink-0 bg-muted rounded-2xl overflow-hidden mb-4 relative group">
            <img
              src={imageUrl}
              alt={`Ilustração de coluna com ${label.toLowerCase()}`}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute top-1 left-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-background/90 hover:bg-background shadow-sm rounded-full"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onExpandImage(imageUrl, label, description);
              }}
              aria-label={`Ampliar imagem do perfil ${label}`}
            >
              <Expand className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className={cn(
              "font-medium text-base transition-colors",
              isSelected ? "text-[#D4AF37]" : "text-foreground"
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