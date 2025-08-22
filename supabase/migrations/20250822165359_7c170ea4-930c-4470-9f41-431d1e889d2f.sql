-- Fix RLS policies for consultas_cadeiras table to properly secure customer data

-- Drop the existing incorrect SELECT policy
DROP POLICY IF EXISTS "Only admins can view" ON public.consultas_cadeiras;

-- Create a proper admin-only SELECT policy that only allows service role access
-- This ensures only backend functions and admin dashboards can read customer data
CREATE POLICY "Service role can view consultation data" 
ON public.consultas_cadeiras 
FOR SELECT 
TO service_role
USING (true);

-- Ensure the public INSERT policy is properly restricted to prevent data manipulation
DROP POLICY IF EXISTS "Allow public insertion" ON public.consultas_cadeiras;

-- Recreate INSERT policy with proper validation
CREATE POLICY "Allow consultation submissions" 
ON public.consultas_cadeiras 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  -- Ensure required fields are present
  nome IS NOT NULL AND 
  email IS NOT NULL AND 
  altura IS NOT NULL AND 
  peso IS NOT NULL AND 
  perfil_postural IS NOT NULL AND
  lgpd_consent = true
);

-- Add UPDATE and DELETE policies to prevent any modifications
CREATE POLICY "Deny all updates to consultation data" 
ON public.consultas_cadeiras 
FOR UPDATE 
USING (false);

CREATE POLICY "Deny all deletions of consultation data" 
ON public.consultas_cadeiras 
FOR DELETE 
USING (false);

-- Apply similar fixes to other sensitive tables

-- Fix contatos_agente table
DROP POLICY IF EXISTS "Allow service role access to agent contacts" ON public.contatos_agente;
DROP POLICY IF EXISTS "Deny public access to agent contacts" ON public.contatos_agente;

CREATE POLICY "Service role only access to agent contacts" 
ON public.contatos_agente 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Deny public access to agent contacts" 
ON public.contatos_agente 
FOR ALL 
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- Fix contatos_convo table  
DROP POLICY IF EXISTS "Allow service role access to WhatsApp conversations" ON public.contatos_convo;
DROP POLICY IF EXISTS "Deny public access to WhatsApp conversations" ON public.contatos_convo;

CREATE POLICY "Service role only access to conversations" 
ON public.contatos_convo 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Deny public access to conversations" 
ON public.contatos_convo 
FOR ALL 
TO anon, authenticated
USING (false)
WITH CHECK (false);