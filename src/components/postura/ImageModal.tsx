import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  description: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  description,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary">
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full max-w-md bg-muted rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt={`Ilustração ampliada de coluna com ${title.toLowerCase()}`}
              className="w-full h-auto object-contain"
              style={{ maxHeight: '60vh' }}
            />
          </div>
          
          <p className="text-center text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};