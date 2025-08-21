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
    const KOMMO_PIPELINE_ID = Deno.env.get('KOMMO_PIPELINE_ID');
    const KOMMO_STATUS_ID = Deno.env.get('KOMMO_STATUS_ID');
    const KOMMO_RESPONSIBLE_USER_ID = Deno.env.get('KOMMO_RESPONSIBLE_USER_ID');

    if (!KOMMO_TOKEN) {
      return new Response(JSON.stringify({ error: 'KOMMO_TOKEN não configurado' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const formattedPhone = formatBrazilPhoneE164(body.telefone);

    const lead: Record<string, unknown> = {
      name: `Lead CadeiraFit - ${body.nome}`,
    };

    if (KOMMO_PIPELINE_ID) lead.pipeline_id = Number(KOMMO_PIPELINE_ID);
    if (KOMMO_STATUS_ID) lead.status_id = Number(KOMMO_STATUS_ID);
    if (KOMMO_RESPONSIBLE_USER_ID) lead.responsible_user_id = Number(KOMMO_RESPONSIBLE_USER_ID);

    const contact: Record<string, unknown> = { name: body.nome };
    const contactCustomFields: any[] = [];
    if (formattedPhone) {
      contactCustomFields.push({
        field_code: 'PHONE',
        values: [{ value: formattedPhone, enum_code: 'WORK' }],
      });
    }
    if (body.email) {
      contactCustomFields.push({
        field_code: 'EMAIL',
        values: [{ value: body.email, enum_code: 'WORK' }],
      });
    }
    if (contactCustomFields.length) {
      contact.custom_fields_values = contactCustomFields;
    }

    const embedded: Record<string, unknown> = {
      contacts: [contact],
    };

    // Campo de origem opcional como tag simples
    if (body.origem) {
      (embedded as any).tags = [{ name: body.origem }];
    } else {
      (embedded as any).tags = [{ name: 'cadeirafit' }];
    }

    (lead as any)._embedded = embedded;

    const payload = [lead];

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


