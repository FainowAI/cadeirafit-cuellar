import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LeadPayloadInput {
  nome: string;
  email?: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
  lgpdConsent?: boolean;
  origem?: string;
}

function formatBrazilPhoneE164(phone?: string): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, '');
  if (!digits) return undefined;
  if (digits.startsWith('55')) {
    return `+${digits}`;
  }
  if (digits.length === 11 || digits.length === 10) {
    return `+55${digits}`;
  }
  return `+${digits}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body: LeadPayloadInput = await req.json();

    if (!body?.nome) {
      return new Response(JSON.stringify({ error: 'Campo nome é obrigatório' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const KOMMO_TOKEN = Deno.env.get('KOMMO_TOKEN');
    const KOMMO_BASE_URL = Deno.env.get('KOMMO_BASE_URL') || 'https://comercialcuellarmoveiscombr.kommo.com';

    if (!KOMMO_TOKEN) {
      return new Response(JSON.stringify({ error: 'KOMMO_TOKEN não configurado' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Enviar somente o nome do lead conforme solicitado
    const payload = [
      {
        name: `Lead CadeiraFit - ${body.nome}`,
      },
    ];

    const response = await fetch(`${KOMMO_BASE_URL}/api/v4/leads`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${KOMMO_TOKEN}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return new Response(
        JSON.stringify({ success: false, status: response.status, error: result }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});


