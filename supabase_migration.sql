-- Supabase Database Migration Script
-- Schema for conversation history storage

-- Create conversation_history table
CREATE TABLE IF NOT EXISTS public.conversation_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE, -- Link to Supabase Auth User
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT conversation_history_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Create performance index for session queries
CREATE INDEX IF NOT EXISTS conversation_history_session_created_at_idx 
  ON public.conversation_history USING btree (session_id, created_at DESC) 
  TABLESPACE pg_default;

-- Enable Row Level Security (RLS)
ALTER TABLE public.conversation_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to prevent errors
DROP POLICY IF EXISTS "Allow user read access to their own conversation history" ON public.conversation_history;
DROP POLICY IF EXISTS "Allow user insert access to their own conversation history" ON public.conversation_history;
DROP POLICY IF EXISTS "Allow user update access to their own conversation history" ON public.conversation_history;
DROP POLICY IF EXISTS "Allow user delete access to their own conversation history" ON public.conversation_history;

-- Create fine-grained security policies
CREATE POLICY "Allow user read access to their own conversation history"
  ON public.conversation_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow user insert access to their own conversation history"
  ON public.conversation_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow user update access to their own conversation history"
  ON public.conversation_history
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow user delete access to their own conversation history"
  ON public.conversation_history
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
