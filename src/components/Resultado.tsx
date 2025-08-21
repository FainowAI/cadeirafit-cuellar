import React, { useState, useMemo, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReasonAccordion } from '@/components/ui/reason-accordion';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { SkeletonCard } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MessageCircle, Star, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import categorias from '../data/categorias.json';
import { avisaApi } from '../services/avisaApi';
import { formatarMensagemWhatsApp, formatarMensagemResumida, formatarMensagemCadeiraIndividual } from '../utils/whatsappMessage';
import { supabase } from '@/integrations/supabase/client';

interface ResultadoProps {
  form: UseFormReturn<any>;
  onBack: () => void;
  onRestart: () => void;
}

interface Recomendacao {
  categoria: typeof categorias.categorias[0];
  prioridade: 'alta' | 'media' | 'baixa';
  motivo: string;
}

// Lógica de recomendação
const gerarRecomendacoes = (dados: any): Recomendacao[] => {
  const altura = parseInt(dados.altura);
  const peso = parseInt(dados.peso);
  const perfil = dados.perfilPostural;
  
  const recomendacoes: Recomendacao[] = [];
  
  // Lógica para cadeiras robustas (peso >= 100kg)
  if (peso >= 100) {
    recomendacoes.push({
      categoria: categorias.categorias.find(c => c.id === 'diretor-presidente')!,
      prioridade: 'alta',
      motivo: 'Base reforçada e estrutura robusta para suporte adequado'
    });
  }
  
  // Lógica para altura >= 185cm
  if (altura >= 185) {
    if (!recomendacoes.find(r => r.categoria.id === 'diretor-presidente')) {
      recomendacoes.push({
        categoria: categorias.categorias.find(c => c.id === 'diretor-presidente')!,
        prioridade: 'alta',
        motivo: 'Encosto alto e apoio de cabeça essenciais para sua altura'
      });
    }
  }
  
  // Lógica para perfis posturais específicos
  switch (perfil) {
    case 'cifose-acentuada':
    case 'lordose-acentuada':
      // Priorizar ajuste lombar
      if (!recomendacoes.find(r => r.categoria.id === 'diretor-presidente')) {
        recomendacoes.push({
          categoria: categorias.categorias.find(c => c.id === 'diretor-presidente')!,
          prioridade: 'alta',
          motivo: 'Sistema lombar ajustável (BackSystem) para correção postural'
        });
      }
      // Mesh para ventilação em casos de calor/desconforto
      recomendacoes.push({
        categoria: categorias.categorias.find(c => c.id === 'executiva-mesh')!,
        prioridade: 'media',
        motivo: 'Encosto respirável e apoio lombar ajustável'
      });
      break;
      
    case 'assimetria-leve':
      // Priorizar ajustes finos
      recomendacoes.push({
        categoria: categorias.categorias.find(c => c.id === 'diretor-presidente')!,
        prioridade: 'alta',
        motivo: 'Ajustes finos (braços 4D, assento, encosto) para correção da assimetria'
      });
      break;
      
    case 'equilibrado':
      // Múltiplas opções equilibradas
      recomendacoes.push({
        categoria: categorias.categorias.find(c => c.id === 'executiva-mesh')!,
        prioridade: 'alta',
        motivo: 'Design moderno e ergonômico ideal para postura equilibrada'
      });
      recomendacoes.push({
        categoria: categorias.categorias.find(c => c.id === 'secretaria')!,
        prioridade: 'media',
        motivo: 'Solução compacta e econômica para uso diário'
      });
      break;
  }
  
  // Garantir pelo menos uma recomendação
  if (recomendacoes.length === 0) {
    recomendacoes.push({
      categoria: categorias.categorias.find(c => c.id === 'executiva-mesh')!,
      prioridade: 'alta',
      motivo: 'Solução versátil adequada para suas necessidades'
    });
  }
  
  // Limitar a 3 recomendações
  return recomendacoes.slice(0, 3);
};

// Integração real com Kommo via Edge Function
const criarLeadKommo = async (dados: any) => {
  try {
    const payload = {
      nome: dados.nome,
      email: dados.email,
      telefone: dados.telefone,
      cidade: dados.cidade,
      estado: dados.estado,
      lgpdConsent: dados.lgpdConsent,
      origem: 'cadeirafit',
    };
    const { data, error } = await supabase.functions.invoke('criar-lead-kommo', { body: payload });
    if (error) {
      console.error('Erro ao criar lead no Kommo:', error);
    } else {
      console.log('Lead criado no Kommo:', data);
    }
  } catch (e) {
    console.error('Falha ao enviar lead ao Kommo:', e);
  }
};

const salvarNoSupabase = async (dados: any, recomendacoes: Recomendacao[]) => {
  try {
    console.log('💾 Salvando consulta no Supabase:', dados);
    
    const consultaData = {
      nome: dados.nome,
      email: dados.email,
      telefone: dados.telefone || null,
      cidade: dados.cidade || null,
      estado: dados.estado || null,
      altura: dados.altura,
      peso: dados.peso,
      perfilPostural: dados.perfilPostural,
      recomendacoes: recomendacoes,
      lgpdConsent: dados.lgpdConsent || false
    };

    const { data, error } = await supabase.functions.invoke('salvar-consulta', {
      body: consultaData
    });

    if (error) {
      console.error('Erro ao salvar consulta:', error);
      throw error;
    }

    console.log('✅ Consulta salva com sucesso no Supabase:', data);
    return data;
  } catch (error) {
    console.error('❌ Erro ao salvar no Supabase:', error);
    throw error;
  }
};

export const Resultado: React.FC<ResultadoProps> = ({ form, onBack, onRestart }) => {
  const dados = form.getValues();
  const [isEnviandoWhatsApp, setIsEnviandoWhatsApp] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  
  // Memoizar as recomendações para evitar recálculo desnecessário
  const recomendacoes = useMemo(() => {
    const recs = gerarRecomendacoes(dados);
    console.log('🎯 Gerando recomendações:', recs.length, recs.map(r => r.categoria.rotulo));
    return recs;
  }, [dados.altura, dados.peso, dados.perfilPostural]);

  // Show skeleton briefly then content with stagger animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const reducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;
  
  const handleEnviarPropostaWhatsApp = async () => {
    const executionId = Date.now().toString();
    console.log(`🆔 Execução ${executionId}: Função handleEnviarPropostaWhatsApp chamada`);
    
    // Verificar se já está enviando para evitar cliques duplos
    if (isEnviandoWhatsApp) {
      console.log(`⚠️ Execução ${executionId}: Envio já em andamento, ignorando clique duplo`);
      return;
    }

    if (!dados.telefone) {
      console.log(`❌ Execução ${executionId}: Telefone não encontrado`);
      toast({
        title: "Telefone não encontrado",
        description: "Por favor, volte e preencha seus dados completos.",
        variant: "destructive",
      });
      return;
    }

    console.log(`🚀 Execução ${executionId}: Iniciando processo de envio de WhatsApp...`);
    setIsEnviandoWhatsApp(true);
    
    try {
      // Salvar dados no sistema primeiro
      console.log(`💾 Execução ${executionId}: Salvando dados da consulta...`);
      await salvarNoSupabase(dados, recomendacoes);
      await criarLeadKommo(dados);
      
      console.log(`📤 Execução ${executionId}: Tentando enviar mensagens via AvisaAPI...`);
      
      // Enviar mensagem apenas para a cadeira com prioridade mais alta (primeira)
      const cadeiraRecomendada = recomendacoes.find(r => r.prioridade === 'alta') || recomendacoes[0];
      console.log(`📋 Execução ${executionId}: Enviando apenas para a cadeira principal: ${cadeiraRecomendada.categoria.rotulo}`);
      
      const mensagemCadeira = formatarMensagemCadeiraIndividual(dados, cadeiraRecomendada);
      console.log(`📤 Enviando mensagem para cadeira: ${cadeiraRecomendada.categoria.rotulo}`);
      console.log(`📞 Telefone: ${dados.telefone}`);
      console.log(`💬 Prévia da mensagem: ${mensagemCadeira.substring(0, 100)}...`);
      
      const resultado = await avisaApi.sendMessage(dados.telefone, mensagemCadeira);
      console.log(`✅ Resultado do envio:`, resultado);
      const resultados = [resultado];
      
      // Verificar se a mensagem foi enviada com sucesso
      if (resultado.success) {
        toast({
          title: "Mensagem enviada com sucesso!",
          description: "Verifique seu WhatsApp para receber sua recomendação personalizada.",
        });
        
        console.log('📱 WhatsApp enviado:', resultado);
      } else {
        throw new Error(`Erro na API: ${resultado.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
    toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente ou entre em contato conosco.",
        variant: "destructive",
    });
    } finally {
      setIsEnviandoWhatsApp(false);
    }
  };

  const getPrioridadeVariant = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'priority';
      case 'media': return 'secondary';
      case 'baixa': return 'outline';
      default: return 'outline';
    }
  };

  const getPrioridadeLabel = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'Prioridade Alta';
      case 'media': return 'Recomendada';
      case 'baixa': return 'Opção';
      default: return 'Opção';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
            <Star className="h-8 w-8 text-accent" />
            Suas Cadeiras Recomendadas
          </CardTitle>
          <p className="text-base text-muted-foreground">
            Olá <span className="font-medium text-foreground">{dados.nome}</span>! Com base no seu perfil, selecionamos as melhores opções para você:
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {recomendacoes.map((rec, index) => (
          <Card key={rec.categoria.id} className="relative overflow-hidden hover:shadow-card transition-all duration-300 hover-lift rounded-2xl">
            <div className="absolute top-4 right-4 z-10">
              <Badge variant={getPrioridadeVariant(rec.prioridade)} className="badge-enter">
                {getPrioridadeLabel(rec.prioridade)}
              </Badge>
            </div>
            
            {/* Imagem da cadeira */}
            <div className="aspect-square w-full bg-muted overflow-hidden">
              <img
                src={(rec.categoria as any).imagem}
                alt={`Cadeira ${rec.categoria.rotulo}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
            
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold">{rec.categoria.rotulo}</CardTitle>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {rec.categoria.descricao}
              </p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <ReasonAccordion
                reason={rec.motivo}
                features={rec.categoria.recursos}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl shadow-card">
        <CardContent className="pt-8">
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold">Gostou das recomendações?</h3>
            <p className="text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Nossa equipe pode elaborar uma proposta personalizada com preços especiais para você.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PrimaryButton 
                onClick={handleEnviarPropostaWhatsApp}
                loading={isEnviandoWhatsApp}
                size="lg"
                className="bg-[#25D366] hover:bg-[#1FAD54] text-white border-none"
              >
                {!isEnviandoWhatsApp && <MessageCircle className="h-5 w-5 mr-2" />}
                {isEnviandoWhatsApp ? 'Enviando...' : 'Receber no WhatsApp'}
              </PrimaryButton>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-card bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="pt-8">
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold">Venha conhecer mais produtos da Cuellar</h3>
            <p className="text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Explore nossa linha completa de cadeiras e encontre ainda mais opções para o seu escritório.
            </p>
            
            <div className="flex justify-center">
              <PrimaryButton asChild size="lg" className="px-8">
                <a
                  href="https://www.cuellarmoveis.com.br/cadeira"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Conhecer Mais Produtos
                </a>
              </PrimaryButton>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <SecondaryButton
          onClick={onBack}
          className="flex-1"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar e Editar
        </SecondaryButton>
      </div>
    </div>
  );
};