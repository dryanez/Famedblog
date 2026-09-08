-- Create table for storing uploaded documents
CREATE TABLE IF NOT EXISTS uploaded_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name TEXT NOT NULL,
    file_uri TEXT NOT NULL,
    mime_type TEXT DEFAULT 'application/pdf',
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_uploaded_documents_uploaded_at ON uploaded_documents(uploaded_at DESC);

-- Enable RLS
ALTER TABLE uploaded_documents ENABLE ROW LEVEL SECURITY;

-- Allow all operations (since this is admin-only)
CREATE POLICY "Allow all operations on uploaded_documents" ON uploaded_documents
    FOR ALL
    USING (true)
    WITH CHECK (true);
