-- ==========================================
-- TRACE MVP v1.0 - SUPABASE INITIAL SCHEMA
-- ==========================================

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create Encrypted Metadata Sync Table
CREATE TABLE IF NOT EXISTS public.encrypted_metadata (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL,
    device_id TEXT NOT NULL,
    record_type TEXT NOT NULL, -- 'memory_event' | 'photo'
    public_id TEXT NOT NULL,
    encrypted_payload JSONB NOT NULL,
    content_hash TEXT NOT NULL,
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_user_device_record UNIQUE (user_id, device_id, record_type, public_id)
);

-- Index for Sync Engine Queries
CREATE INDEX IF NOT EXISTS idx_encrypted_metadata_user_device 
ON public.encrypted_metadata (user_id, device_id);

CREATE INDEX IF NOT EXISTS idx_encrypted_metadata_updated 
ON public.encrypted_metadata (user_id, updated_at DESC);

-- Enable RLS
ALTER TABLE public.encrypted_metadata ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Users can only access their own encrypted data)
CREATE POLICY "Users can insert their own encrypted metadata" 
ON public.encrypted_metadata 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select their own encrypted metadata" 
ON public.encrypted_metadata 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own encrypted metadata" 
ON public.encrypted_metadata 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own encrypted metadata" 
ON public.encrypted_metadata 
FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);