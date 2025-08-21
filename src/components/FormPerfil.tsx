import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ruler, Weight, User2, HelpCircle, ArrowLeft } from 'lucide-react';
import { ModalAjuda } from './ModalAjuda';

interface FormPerfilProps {
  form: UseFormReturn<any>;
  onNext: () => void;
  onBack: () => void;
}

const perfisPosturais = [
  {
    id: 'equilibrado',
    label: 'Equilibrado',
    description: 'Postura natural com curvas normais da coluna'
  },
  {
    id: 'lordose-acentuada',
    label: 'Lordose Acentuada',
    description: 'Curvatura acentuada na região lombar'
  },
  {
    id: 'cifose-acentuada',
    label: 'Cifose Acentuada',
    description: 'Curvatura acentuada na região torácica'
  },
  {
    id: 'assimetria-leve',
    label: 'Assimetria Leve',
    description: 'Pequeno desalinhamento dos ombros ou quadril'
  }
];

export const FormPerfil: React.FC<FormPerfilProps> = ({ form, onNext, onBack }) => {
  const [showModal, setShowModal] = useState(false);

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

          <FormField
            control={form.control}
            name="perfilPostural"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <div className="flex items-center gap-2">
                  <FormLabel>Perfil Postural *</FormLabel>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowModal(true)}
                    className="text-accent hover:text-accent/80 p-1 h-6 w-6"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </div>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {perfisPosturais.map((perfil) => (
                      <div key={perfil.id} className="flex items-start space-x-3 space-y-0">
                        <RadioGroupItem value={perfil.id} id={perfil.id} className="mt-1" />
                        <label
                          htmlFor={perfil.id}
                          className="flex-1 cursor-pointer rounded-lg border-2 border-muted hover:border-accent/50 p-4 transition-colors"
                        >
                          <div className="space-y-2">
                            <div className="font-medium">{perfil.label}</div>
                            <div className="text-sm text-muted-foreground">
                              {perfil.description}
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

      <ModalAjuda 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
};