import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle } from 'lucide-react';

interface ReasonAccordionProps {
  reason: string;
  features: string[];
  className?: string;
}

export const ReasonAccordion: React.FC<ReasonAccordionProps> = ({
  reason,
  features,
  className,
}) => {
  return (
    <Accordion type="single" collapsible className={className}>
      <AccordionItem value="reason" className="border-none">
        <AccordionTrigger className="text-sm font-medium text-left hover:no-underline py-3">
          Por que recomendamos
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <div className="space-y-3">
            <div className="bg-[#D4AF37]/5 p-3 rounded-xl">
              <p className="text-sm font-medium text-[#9A7B1F] mb-1">Motivo principal:</p>
              <p className="text-sm text-muted-foreground">{reason}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Principais recursos:</p>
              <ul className="space-y-1">
                {features.slice(0, 4).map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};