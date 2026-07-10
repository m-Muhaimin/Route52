-- ====================================================================
-- SUPABASE DATABASE MIGRATION SCRIPT
-- ====================================================================
-- Description: Sets up the database schema for the Deep Sea Secure Agent Chat.
-- This script creates the `conversation_history` table, creates indexes for
-- optimal performance, enables Row Level Security (RLS), and sets up robust
-- policies to ensure users can only access their own conversation data.
-- ====================================================================

-- 1. Create the conversation_history table under the public schema
CREATE TABLE IF NOT EXISTS public.conversation_history (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    session_id text NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE, -- Link to Supabase Auth User
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    data jsonb NOT NULL DEFAULT '{}'::jsonb,
    CONSTRAINT conversation_history_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- 2. Create index on session_id and created_at to speed up thread retrieval
CREATE INDEX IF NOT EXISTS conversation_history_session_created_at_idx 
    ON public.conversation_history USING btree (session_id, created_at DESC) 
    TABLESPACE pg_default;

-- 3. Enable Row Level Security (RLS) on the table
ALTER TABLE public.conversation_history ENABLE ROW LEVEL SECURITY;

-- 4. Clean up any existing policies to prevent conflicts on execution
DROP POLICY IF EXISTS "Allow user read access to their own conversation history" ON public.conversation_history;
DROP POLICY IF EXISTS "Allow user insert access to their own conversation history" ON public.conversation_history;
DROP POLICY IF EXISTS "Allow user update access to their own conversation history" ON public.conversation_history;
DROP POLICY IF EXISTS "Allow user delete access to their own conversation history" ON public.conversation_history;

-- 5. Create secure fine-grained Row Level Security policies

-- Select policy: Users can read only their own conversation history rows
CREATE POLICY "Allow user read access to their own conversation history"
    ON public.conversation_history
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Insert policy: Users can only write rows where the user_id matches their own authenticated uid
CREATE POLICY "Allow user insert access to their own conversation history"
    ON public.conversation_history
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Update policy: Users can only modify rows belonging to their own authenticated uid
CREATE POLICY "Allow user update access to their own conversation history"
    ON public.conversation_history
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Delete policy: Users can only delete rows belonging to their own authenticated uid
CREATE POLICY "Allow user delete access to their own conversation history"
    ON public.conversation_history
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 6. Grant privileges to access this table to authenticated roles
GRANT ALL ON TABLE public.conversation_history TO authenticated;
GRANT ALL ON TABLE public.conversation_history TO service_role;
