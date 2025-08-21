-- Fix remaining RLS security issues on all public tables
-- Enable Row Level Security on all tables that currently don't have it

-- Enable RLS on contatos_agente table
ALTER TABLE public.contatos_agente ENABLE ROW LEVEL SECURITY;

-- Create restrictive policy for contatos_agente
CREATE POLICY "Deny public access to agent contacts" 
ON public.contatos_agente 
FOR ALL 
USING (false);

CREATE POLICY "Allow service role access to agent contacts" 
ON public.contatos_agente 
FOR ALL 
TO service_role 
USING (true);

-- Enable RLS on customer_profiles table
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;

-- Create restrictive policy for customer_profiles
CREATE POLICY "Deny public access to customer profiles" 
ON public.customer_profiles 
FOR ALL 
USING (false);

CREATE POLICY "Allow service role access to customer profiles" 
ON public.customer_profiles 
FOR ALL 
TO service_role 
USING (true);

-- Enable RLS on documents table
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create restrictive policy for documents
CREATE POLICY "Deny public access to documents" 
ON public.documents 
FOR ALL 
USING (false);

CREATE POLICY "Allow service role access to documents" 
ON public.documents 
FOR ALL 
TO service_role 
USING (true);

-- Enable RLS on follow_up table
ALTER TABLE public.follow_up ENABLE ROW LEVEL SECURITY;

-- Create restrictive policy for follow_up
CREATE POLICY "Deny public access to follow up" 
ON public.follow_up 
FOR ALL 
USING (false);

CREATE POLICY "Allow service role access to follow up" 
ON public.follow_up 
FOR ALL 
TO service_role 
USING (true);