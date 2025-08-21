-- Fix critical security issue: Enable RLS on contatos_convo table
-- This table contains private WhatsApp conversations and should not be publicly accessible

-- Enable Row Level Security
ALTER TABLE public.contatos_convo ENABLE ROW LEVEL SECURITY;

-- Create a restrictive policy that denies public access
-- Only authenticated users with specific permissions should access WhatsApp conversations
CREATE POLICY "Deny public access to WhatsApp conversations" 
ON public.contatos_convo 
FOR ALL 
USING (false);

-- Create a policy for service accounts/admin access if needed
-- This allows access only from server-side operations with proper authentication
CREATE POLICY "Allow service role access to WhatsApp conversations" 
ON public.contatos_convo 
FOR ALL 
TO service_role 
USING (true);