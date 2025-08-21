-- Create consultas_cadeiras table for storing chair consultation data
CREATE TABLE public.consultas_cadeiras (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    cidade TEXT,
    estado TEXT,
    altura INTEGER NOT NULL,
    peso INTEGER NOT NULL,
    perfil_postural TEXT NOT NULL,
    recomendacoes JSONB,
    lgpd_consent BOOLEAN NOT NULL DEFAULT false,
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.consultas_cadeiras ENABLE ROW LEVEL SECURITY;

-- Allow public insertion for lead generation (no auth required)
CREATE POLICY "Allow public insertion" 
ON public.consultas_cadeiras 
FOR INSERT 
WITH CHECK (true);

-- Only allow admins to view data (for future admin panel)
CREATE POLICY "Only admins can view" 
ON public.consultas_cadeiras 
FOR SELECT 
USING (false); -- Will be updated when admin roles are implemented

-- Create function to update timestamps automatically
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_consultas_cadeiras_updated_at
BEFORE UPDATE ON public.consultas_cadeiras
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_consultas_cadeiras_email ON public.consultas_cadeiras(email);
CREATE INDEX idx_consultas_cadeiras_created_at ON public.consultas_cadeiras(created_at);
CREATE INDEX idx_consultas_cadeiras_perfil_postural ON public.consultas_cadeiras(perfil_postural);