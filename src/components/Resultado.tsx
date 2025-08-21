import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

// Stubs para integração futura
const criarLeadKommo = (dados: any, recomendacoes: Recomendacao[]) => {
  console.log('🔗 criarLeadKommo() - Stub para integração Kommo:', { dados, recomendacoes });
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
  const recomendacoes = gerarRecomendacoes(dados);
  const [isEnviandoWhatsApp, setIsEnviandoWhatsApp] = useState(false);
  
  const handleEnviarPropostaWhatsApp = async () => {
    if (!dados.telefone) {
      toast({
        title: "Telefone não encontrado",
        description: "Por favor, volte e preencha seus dados completos.",
        variant: "destructive",
      });
      return;
    }

    setIsEnviandoWhatsApp(true);
    
    try {
      // Salvar dados no sistema primeiro
      console.log('💾 Salvando dados da consulta...');
      await salvarNoSupabase(dados, recomendacoes);
      criarLeadKommo(dados, recomendacoes);
      
      console.log('📤 Tentando enviar mensagens via AvisaAPI...');
      
      // Enviar uma mensagem para cada cadeira recomendada
      const resultados = [];
      
      for (const [index, cadeira] of recomendacoes.entries()) {
        const mensagemCadeira = formatarMensagemCadeiraIndividual(dados, cadeira);
        console.log(`📤 Enviando mensagem ${index + 1}/${recomendacoes.length} para cadeira: ${cadeira.categoria.rotulo}`);
        
        const resultado = await avisaApi.sendMessage(dados.telefone, mensagemCadeira);
        resultados.push(resultado);
        
        // Aguardar um pouco entre as mensagens para evitar spam
        if (index < recomendacoes.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      // Verificar se pelo menos uma mensagem foi enviada com sucesso
      const sucessos = resultados.filter(r => r.success);
      
      if (sucessos.length > 0) {
        toast({
          title: "Mensagens enviadas com sucesso!",
          description: `${sucessos.length} mensagem(ns) enviada(s). Verifique seu WhatsApp para receber as recomendações.`,
        });
        
        console.log('📱 WhatsApp enviado:', sucessos);
      } else {
        const primeiroErro = resultados.find(r => !r.success);
        throw new Error(`Erro na API: ${primeiroErro?.message || 'Erro desconhecido'}`);
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

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'bg-green-100 text-green-800 border-green-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
            <Star className="h-8 w-8 text-accent" />
            Suas Cadeiras Recomendadas
          </CardTitle>
          <p className="text-muted-foreground">
            Olá {dados.nome}! Com base no seu perfil, selecionamos as melhores opções para você:
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {recomendacoes.map((rec, index) => (
          <Card key={rec.categoria.id} className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-4 right-4 z-10">
              <Badge className={getPrioridadeColor(rec.prioridade)}>
                {rec.prioridade === 'alta' ? 'Prioridade Alta' : 
                 rec.prioridade === 'media' ? 'Recomendada' : 'Opção'}
              </Badge>
            </div>
            
            {/* Imagem da cadeira */}
            <div className="aspect-square w-full bg-muted overflow-hidden">
              <img
                src={(rec.categoria as any).imagem}
                alt={`Cadeira ${rec.categoria.rotulo}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
            
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">{rec.categoria.rotulo}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {rec.categoria.descricao}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-accent/10 p-3 rounded-lg">
                <p className="text-sm font-medium text-accent">Por que recomendamos:</p>
                <p className="text-sm text-muted-foreground mt-1">{rec.motivo}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Principais recursos:</p>
                <ul className="space-y-1">
                  {rec.categoria.recursos.slice(0, 4).map((recurso, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {recurso}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Gostou das recomendações?</h3>
            <p className="text-muted-foreground">
              Nossa equipe pode elaborar uma proposta personalizada com preços especiais.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleEnviarPropostaWhatsApp}
                disabled={isEnviandoWhatsApp}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                {isEnviandoWhatsApp ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <MessageCircle className="h-5 w-5 mr-2" />
                )}
                {isEnviandoWhatsApp ? 'Enviando...' : 'Receber no WhatsApp'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar e Editar
        </Button>
        
      </div>
    </div>
  );
};