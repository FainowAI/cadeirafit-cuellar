import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { PerfilCard } from './PerfilCard';
import { AjudaModal } from './AjudaModal';
import { ImageModal } from './ImageModal';

// Importar as imagens geradas
const equilibradoImg = '/images/perfis/equilibrado.png';
const lordoseImg = '/images/perfis/lordose-acentuada.png';
const cifoseImg = '/images/perfis/cifose-acentuada.jpg';
const assimetriaImg = '/images/perfis/assimetria-leve.png';

interface PerfilPosturalStepProps {
  form: UseFormReturn<any>;
}

const perfisPosturais = [
  {
    id: 'equilibrado',
    label: 'Equilibrado',
    description: 'Postura natural com curvas normais da coluna',
    imageUrl: equilibradoImg
  },
  {
    id: 'lordose-acentuada',
    label: 'Lordose Acentuada',
    description: 'Curvatura acentuada na região lombar',
    imageUrl: lordoseImg
  },
  {
    id: 'cifose-acentuada',
    label: 'Cifose Acentuada',
    description: 'Curvatura acentuada na região torácica',
    imageUrl: cifoseImg
  },
  {
    id: 'assimetria-leve',
    label: 'Assimetria Leve',
    description: 'Pequeno desalinhamento dos ombros ou quadril',
    imageUrl: assimetriaImg
  }
];

export const PerfilPosturalStep: React.FC<PerfilPosturalStepProps> = ({ form }) => {
  const [showModal, setShowModal] = useState(false);
  const [imageModal, setImageModal] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
    description: string;
  }>({
    isOpen: false,
    imageUrl: '',
    title: '',
    description: '',
  });
  const watchedValue = form.watch('perfilPostural');

  const handleExpandImage = (imageUrl: string, title: string, description: string) => {
    setImageModal({
      isOpen: true,
      imageUrl,
      title,
      description,
    });
  };

  const closeImageModal = () => {
    setImageModal(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-primary">
            Escolha seu Perfil Postural
          </h2>
          <p className="text-muted-foreground">
            Isso nos ajuda a sugerir o encosto ideal para você
          </p>
        </div>

        <FormField
          control={form.control}
          name="perfilPostural"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base font-medium">
                  Selecione seu perfil postural *
                </FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModal(true)}
                  className="text-accent hover:text-accent/80 text-sm font-medium"
                  aria-label="Como identificar meu perfil postural"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Como identificar meu perfil?
                </Button>
              </div>
              
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                  role="radiogroup"
                  aria-labelledby="perfil-postural-label"
                >
                   {perfisPosturais.map((perfil) => (
                     <PerfilCard
                       key={perfil.id}
                       id={perfil.id}
                       label={perfil.label}
                       description={perfil.description}
                       imageUrl={perfil.imageUrl}
                       isSelected={watchedValue === perfil.id}
                       onSelect={field.onChange}
                       onExpandImage={handleExpandImage}
                     />
                   ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <AjudaModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
      
      <ImageModal
        isOpen={imageModal.isOpen}
        onClose={closeImageModal}
        imageUrl={imageModal.imageUrl}
        title={imageModal.title}
        description={imageModal.description}
      />
    </>
  );
};

// Função utilitária para obter o perfil selecionado
export const getPerfilPosturalSelecionado = (slug: string) => {
  const perfil = perfisPosturais.find(p => p.id === slug);
  return perfil ? {
    slug: perfil.id,
    label: perfil.label,
    imageUrl: perfil.imageUrl
  } : null;
};