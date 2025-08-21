import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { FormLead } from '@/components/FormLead';
import { FormPerfil } from '@/components/FormPerfil';
import { Resultado } from '@/components/Resultado';
import { ArrowRight, Phone } from 'lucide-react';

// Schema de validação
const formSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(14, 'Telefone deve estar no formato (XX) XXXXX-XXXX'),
  cidade: z.string(),
  estado: z.string().max(2),
  lgpdConsent: z.boolean().refine(val => val === true, 'Você deve autorizar o contato'),
  altura: z.string().min(1, 'Altura é obrigatória').refine(val => {
    const num = parseInt(val);
    return num >= 140 && num <= 220;
  }, 'Altura deve estar entre 140 e 220 cm'),
  peso: z.string().min(1, 'Peso é obrigatório').refine(val => {
    const num = parseInt(val);
    return num >= 40 && num <= 200;
  }, 'Peso deve estar entre 40 e 200 kg'),
  perfilPostural: z.string().min(1, 'Selecione um perfil postural'),
});

type FormData = z.infer<typeof formSchema>;
type Step = 'lead' | 'perfil' | 'resultado';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>('lead');
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      cidade: '',
      estado: '',
      lgpdConsent: false,
      altura: '',
      peso: '',
      perfilPostural: '',
    },
  });

  const handleNext = () => {
    if (currentStep === 'lead') {
      setCurrentStep('perfil');
    } else if (currentStep === 'perfil') {
      setCurrentStep('resultado');
    }
  };

  const handleBack = () => {
    if (currentStep === 'perfil') {
      setCurrentStep('lead');
    } else if (currentStep === 'resultado') {
      setCurrentStep('perfil');
    }
  };

  const handleRestart = () => {
    form.reset();
    setCurrentStep('lead');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header fixo */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-primary">Cuellar Móveis</h1>
          </div>
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
          >
            <Phone className="h-4 w-4" />
            Fale conosco
          </a>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Seção Hero */}
        {currentStep === 'lead' && (
          <section className="text-center space-y-4 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">
              Descubra sua cadeira ideal
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Em 3 passos simples, vamos recomendar as melhores opções de cadeiras Cuellar para seu perfil e necessidades.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-6">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-medium">1</span>
                Seus dados
              </div>
              <ArrowRight className="h-4 w-4" />
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center font-medium">2</span>
                Medidas e perfil
              </div>
              <ArrowRight className="h-4 w-4" />
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center font-medium">3</span>
                Recomendações
              </div>
            </div>
          </section>
        )}

        {/* Indicador de progresso */}
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className={`flex items-center gap-2 ${currentStep === 'lead' ? 'text-accent' : 'text-muted-foreground'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                currentStep === 'lead' ? 'bg-accent text-accent-foreground' : 
                ['perfil', 'resultado'].includes(currentStep) ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'
              }`}>1</span>
              <span className="font-medium">Dados</span>
            </div>
            <div className={`flex items-center gap-2 ${currentStep === 'perfil' ? 'text-accent' : 'text-muted-foreground'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                currentStep === 'perfil' ? 'bg-accent text-accent-foreground' : 
                currentStep === 'resultado' ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'
              }`}>2</span>
              <span className="font-medium">Perfil</span>
            </div>
            <div className={`flex items-center gap-2 ${currentStep === 'resultado' ? 'text-accent' : 'text-muted-foreground'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                currentStep === 'resultado' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
              }`}>3</span>
              <span className="font-medium">Resultado</span>
            </div>
          </div>
        </div>

        {/* Formulário e resultados */}
        <Form {...form}>
          <form className="space-y-8">
            {currentStep === 'lead' && (
              <FormLead form={form} onNext={handleNext} />
            )}
            
            {currentStep === 'perfil' && (
              <FormPerfil 
                form={form} 
                onNext={handleNext} 
                onBack={handleBack} 
              />
            )}
            
            {currentStep === 'resultado' && (
              <Resultado 
                form={form} 
                onBack={handleBack} 
                onRestart={handleRestart} 
              />
            )}
          </form>
        </Form>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Cuellar Móveis. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
