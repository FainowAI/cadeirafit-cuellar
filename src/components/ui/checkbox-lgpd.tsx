import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface CheckboxLGPDProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  error?: string;
  className?: string;
}

export const CheckboxLGPD: React.FC<CheckboxLGPDProps> = ({
  checked,
  onCheckedChange,
  error,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-row items-start space-x-3 space-y-0 rounded-2xl border p-6 transition-colors",
        error && "border-destructive bg-destructive/5",
        !error && "border-border bg-card hover:bg-muted/30",
        className
      )}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="mt-0.5"
      />
      <div className="space-y-1 leading-relaxed">
        <Label className="text-sm font-medium cursor-pointer">
          Autorizo o contato da Cuellar Móveis *
        </Label>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Concordo em receber contato por e-mail, telefone ou WhatsApp para apresentação de propostas personalizadas.
          Seus dados são protegidos conforme a LGPD.
        </p>
      </div>
      {error && (
        <div className="ml-auto">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
};