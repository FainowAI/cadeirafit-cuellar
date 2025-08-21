import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { FormLead } from '@/components/FormLead';
import { FormPerfil } from '@/components/FormPerfil';
import { Resultado } from '@/components/Resultado';
import { AppHeader } from '@/components/ui/app-header';
import { Stepper, StepStatus } from '@/components/ui/stepper';
import { PageTransition } from '@/components/motion/PageTransition';
import { AnalyzerLoading } from '@/components/AnalyzerLoading';
import { ArrowRight } from 'lucide-react';

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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
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
      // Start analysis loading before going to results
      setIsAnalyzing(true);
    }
  };

  const handleAnalysisComplete = () => {
    setIsAnalyzing(false);
    setCurrentStep('resultado');
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

  const getStepStatus = (step: Step): StepStatus => {
    const stepOrder: Step[] = ['lead', 'perfil', 'resultado'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'upcoming';
  };

  const steps = [
    { id: 'lead', label: 'Dados', status: getStepStatus('lead') },
    { id: 'perfil', label: 'Perfil', status: getStepStatus('perfil') },
    { id: 'resultado', label: 'Resultado', status: getStepStatus('resultado') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container py-10 space-y-10">
        {/* Hero Section - only show on first step */}
        {currentStep === 'lead' && (
          <PageTransition id="hero" className="py-14">
            <section className="text-center space-y-6">
              <h1 className="text-3xl md:text-2xl font-bold text-primary">
                Descubra sua cadeira ideal
              </h1>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Em 3 passos simples, vamos recomendar as melhores opções de cadeiras Cuellar para seu perfil e necessidades.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-8">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-medium text-xs">1</span>
                  <span className="hidden sm:inline">Seus dados</span>
                  <span className="sm:hidden">Dados</span>
                </div>
                <ArrowRight className="h-4 w-4" />
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center font-medium text-xs">2</span>
                  <span className="hidden sm:inline">Medidas e perfil</span>
                  <span className="sm:hidden">Perfil</span>
                </div>
                <ArrowRight className="h-4 w-4" />
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center font-medium text-xs">3</span>
                  <span className="hidden sm:inline">Recomendações</span>
                  <span className="sm:hidden">Resultado</span>
                </div>
              </div>
            </section>
          </PageTransition>
        )}

        {/* Stepper - hide on first step initial view */}
        {(currentStep !== 'lead' || currentStep === 'lead') && (
          <Stepper steps={steps} />
        )}

        {/* Forms and Results */}
        <Form {...form}>
          <form className="space-y-6">
            {currentStep === 'lead' && (
              <PageTransition id="lead" key="lead">
                <FormLead form={form} onNext={handleNext} />
              </PageTransition>
            )}
            
            {currentStep === 'perfil' && (
              <PageTransition id="perfil" key="perfil">
                <FormPerfil 
                  form={form} 
                  onNext={handleNext} 
                  onBack={handleBack} 
                />
              </PageTransition>
            )}
            
            {currentStep === 'resultado' && (
              <PageTransition id="resultado" key="resultado">
                <Resultado 
                  form={form} 
                  onBack={handleBack} 
                  onRestart={handleRestart} 
                />
              </PageTransition>
            )}
          </form>
        </Form>
        
        {/* Analysis Loading Modal */}
        <AnalyzerLoading
          isOpen={isAnalyzing}
          onComplete={handleAnalysisComplete}
        />
      </main>

      {/* Footer */}
      <footer className="border-t py-10 mt-16">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Cuellar Móveis. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
