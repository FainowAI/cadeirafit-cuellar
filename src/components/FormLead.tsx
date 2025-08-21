import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SectionCard } from '@/components/ui/section-card';
import { InputField } from '@/components/ui/input-field';
import { CheckboxLGPD } from '@/components/ui/checkbox-lgpd';
import { PrimaryButton } from '@/components/ui/primary-button';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FormLeadProps {
  form: UseFormReturn<any>;
  onNext: () => void;
}

const formatTelefone = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return value;
};

export const FormLead: React.FC<FormLeadProps> = ({ form, onNext }) => {
  const handleTelefoneChange = (onChange: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelefone(e.target.value);
    onChange(formatted);
  };

  const validateStep1 = () => {
    const values = form.getValues();
    const requiredFields = ['nome', 'email', 'telefone', 'lgpdConsent'];
    
    for (const field of requiredFields) {
      if (!values[field as keyof typeof values]) {
        form.trigger(field as string);
        return false;
      }
    }
    
    const errors = form.formState.errors;
    return !Object.keys(errors).some(key => ['nome', 'email', 'telefone', 'lgpdConsent'].includes(key));
  };

  const handleNext = async () => {
    if (!validateStep1()) return;

    try {
      const values = form.getValues();
      const payload = {
        nome: values.nome,
        email: values.email,
        telefone: values.telefone,
        cidade: values.cidade,
        estado: values.estado,
        lgpdConsent: values.lgpdConsent,
        origem: 'cadeirafit',
      };

      const { data, error } = await supabase.functions.invoke('criar-lead-kommo', {
        body: payload,
      });

      if (error) {
        console.error('Erro ao criar lead no Kommo:', error);
      } else {
        console.log('Lead criado no Kommo:', data);
      }
    } catch (e) {
      console.error('Falha ao enviar lead ao Kommo:', e);
    } finally {
      onNext();
    }
  };

  return (
    <SectionCard 
      className="w-full max-w-2xl mx-auto"
      icon={<User className="h-8 w-8 text-accent" />}
      title="Passo 1: Seus Dados"
      subtitle="Primeiro, precisamos conhecer você melhor"
    >
      <div className="space-y-6">
        {/* Grid de 2 colunas em desktop, 1 em mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <InputField
                label="Nome completo"
                placeholder="Seu nome completo"
                required
                error={form.formState.errors.nome?.message as string}
                {...field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <InputField
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                icon={<Mail className="h-4 w-4" />}
                required
                error={form.formState.errors.email?.message as string}
                {...field}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <InputField
                label="Telefone"
                placeholder="(11) 99999-9999"
                icon={<Phone className="h-4 w-4" />}
                required
                error={form.formState.errors.telefone?.message as string}
                value={field.value}
                onChange={(e) => {
                  const formatted = formatTelefone(e.target.value);
                  field.onChange(formatted);
                }}
              />
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="cidade"
              render={({ field }) => (
                <InputField
                  label="Cidade"
                  placeholder="São Paulo"
                  error={form.formState.errors.cidade?.message as string}
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <InputField
                  label="Estado"
                  placeholder="SP"
                  maxLength={2}
                  error={form.formState.errors.estado?.message as string}
                  {...field}
                />
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="lgpdConsent"
          render={({ field }) => (
            <CheckboxLGPD
              checked={field.value}
              onCheckedChange={field.onChange}
              error={form.formState.errors.lgpdConsent?.message as string}
            />
          )}
        />

        <div className="flex justify-end pt-4">
          <PrimaryButton 
            type="button" 
            onClick={handleNext}
            size="lg"
            className="w-full sm:w-auto"
          >
            Continuar para Medidas
          </PrimaryButton>
        </div>
      </div>
    </SectionCard>
  );
};