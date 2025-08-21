import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConsultaData {
  nome: string;
  email: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
  altura: number;
  peso: number;
  perfilPostural: string;
  recomendacoes: any[];
  lgpdConsent: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const body: ConsultaData = await req.json();
    
    // Validação básica dos dados obrigatórios
    if (!body.nome || !body.email || !body.altura || !body.peso || !body.perfilPostural) {
      return new Response(
        JSON.stringify({ error: 'Dados obrigatórios não preenchidos' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Capturar informações adicionais da requisição
    const userAgent = req.headers.get('user-agent') || '';
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ipAddress = forwarded || realIp || 'unknown';
    const referrer = req.headers.get('referer') || '';

    // Preparar dados para inserção
    const dadosParaInserir = {
      nome: body.nome,
      email: body.email,
      telefone: body.telefone || null,
      cidade: body.cidade || null,
      estado: body.estado || null,
      altura: body.altura,
      peso: body.peso,
      perfil_postural: body.perfilPostural,
      recomendacoes: body.recomendacoes || [],
      lgpd_consent: body.lgpdConsent,
      ip_address: ipAddress,
      user_agent: userAgent,
      referrer: referrer
    };

    console.log('Salvando consulta:', dadosParaInserir);

    // Inserir no Supabase
    const { data, error } = await supabase
      .from('consultas_cadeiras')
      .insert([dadosParaInserir])
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar consulta:', error);
      return new Response(
        JSON.stringify({ error: 'Erro interno do servidor' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Consulta salva com sucesso:', data.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: data.id,
        message: 'Consulta salva com sucesso'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Erro na edge function:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});