import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Ruler, Weight, User2, ArrowLeft } from 'lucide-react';
import { PerfilPosturalStep } from './postura/PerfilPosturalStep';

interface FormPerfilProps {
  form: UseFormReturn<any>;
  onNext: () => void;
  onBack: () => void;
}

export const FormPerfil: React.FC<FormPerfilProps> = ({ form, onNext, onBack }) => {

  const validateStep2 = () => {
    const values = form.getValues();
    const requiredFields = ['altura', 'peso', 'perfilPostural'];
    
    for (const field of requiredFields) {
      if (!values[field as keyof typeof values]) {
        form.trigger(field as string);
        return false;
      }
    }
    
    const errors = form.formState.errors;
    return !Object.keys(errors).some(key => ['altura', 'peso', 'perfilPostural'].includes(key));
  };

  const handleNext = () => {
    if (validateStep2()) {
      onNext();
    }
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <User2 className="h-6 w-6 text-accent" />
            Passo 2: Medidas e Perfil
          </CardTitle>
          <p className="text-muted-foreground text-center">
            Agora vamos entender suas necessidades ergonômicas
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="altura"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Altura (cm) *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="175"
                        type="number"
                        min="140"
                        max="220"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="peso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso (kg) *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="70"
                        type="number"
                        min="40"
                        max="200"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <PerfilPosturalStep form={form} />

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Ver Recomendações
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};