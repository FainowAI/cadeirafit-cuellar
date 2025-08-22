import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { SectionCard } from '@/components/ui/section-card';
import { InputField } from '@/components/ui/input-field';
import { ProfileCard } from '@/components/ui/profile-card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { Ruler, ArrowLeft, HelpCircle } from 'lucide-react';
import { ImageModal } from './postura/ImageModal';
import { AjudaModal } from './postura/AjudaModal';

interface FormPerfilProps {
  form: UseFormReturn<any>;
  onNext: () => void;
  onBack: () => void;
}

const perfis = [
  {
    id: 'equilibrado',
    rotulo: 'Equilibrado',
    descricao: 'Coluna com curvaturas normais e alinhamento adequado',
    imagem: '/images/perfis/equilibrado.png'
  },
  {
    id: 'cifose-acentuada', 
    rotulo: 'Cifose Acentuada',
    descricao: 'Curvatura excessiva da região torácica (corcunda)',
    imagem: '/images/perfis/cifose-acentuada.jpg'
  },
  {
    id: 'lordose-acentuada',
    rotulo: 'Lordose Acentuada', 
    descricao: 'Curvatura excessiva da região lombar',
    imagem: '/images/perfis/lordose-acentuada.png'
  },
  {
    id: 'assimetria-leve',
    rotulo: 'Assimetria Leve',
    descricao: 'Leve desvio lateral da coluna ou desalinhamento dos ombros',
    imagem: '/images/perfis/assimetria-leve.png'
  }
];

export const FormPerfil: React.FC<FormPerfilProps> = ({ form, onNext, onBack }) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [ajudaModalOpen, setAjudaModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ url: '', title: '', description: '' });

  const handleExpandImage = (imageUrl: string, title: string, description: string) => {
    setSelectedImage({ url: imageUrl, title, description });
    setImageModalOpen(true);
  };

  const validateStep2 = async () => {
    return form.trigger(['altura', 'peso', 'perfilPostural']);
  };

  const handleNext = async () => {
    if (await validateStep2()) {
      onNext();
    }
  };

  return (
    <>
      <SectionCard 
        className="w-full max-w-4xl mx-auto"
        icon={<Ruler className="h-8 w-8 text-accent" />}
        title="Passo 2: Medidas e Perfil Postural"
        subtitle="Agora vamos conhecer suas medidas e identificar seu perfil postural"
      >
        <div className="space-y-8">
          {/* Seção de medidas */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Suas medidas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto">
              <FormField
                control={form.control}
                name="altura"
                render={({ field }) => (
                  <InputField
                    label="Altura (cm)"
                    type="number"
                    placeholder="175"
                    min="140"
                    max="220"
                    required
                    error={form.formState.errors.altura?.message as string}
                    helperText="Entre 140 e 220 cm"
                    {...field}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="peso"
                render={({ field }) => (
                  <InputField
                    label="Peso (kg)"
                    type="number"
                    placeholder="70"
                    min="40"
                    max="200"
                    required
                    error={form.formState.errors.peso?.message as string}
                    helperText="Entre 40 e 200 kg"
                    {...field}
                  />
                )}
              />
            </div>
          </div>

          {/* Seção de perfil postural */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Escolha seu Perfil Postural</h3>
              <div className="flex items-center justify-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Observe as imagens e escolha a que mais se parece com você
                </p>
                <button
                  type="button"
                  onClick={() => setAjudaModalOpen(true)}
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors hover-lift"
                  aria-label="Como identificar meu perfil postural?"
                >
                  <HelpCircle className="h-4 w-4" />
                  Como identificar?
                </button>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="perfilPostural"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto"
                    >
                      {perfis.map((perfil) => (
                        <ProfileCard
                          key={perfil.id}
                          id={perfil.id}
                          label={perfil.rotulo}
                          description={perfil.descricao}
                          imageUrl={perfil.imagem}
                          isSelected={field.value === perfil.id}
                          onSelect={field.onChange}
                          onExpandImage={handleExpandImage}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                  {form.formState.errors.perfilPostural && (
                    <p className="text-sm text-destructive text-center mt-4">
                      {form.formState.errors.perfilPostural.message as string}
                    </p>
                  )}
                </FormItem>
              )}
            />
          </div>

          {/* Botões de navegação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6">
            <SecondaryButton
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </SecondaryButton>
            
            <PrimaryButton
              type="button"
              onClick={handleNext}
              size="lg"
              className="w-full sm:w-auto"
            >
              Ver Recomendações
            </PrimaryButton>
          </div>
        </div>
      </SectionCard>

      {/* Modais */}
      <ImageModal 
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        imageUrl={selectedImage.url}
        title={selectedImage.title}
        description={selectedImage.description}
      />
      
      <AjudaModal 
        isOpen={ajudaModalOpen}
        onClose={() => setAjudaModalOpen(false)}
      />
    </>
  );
};