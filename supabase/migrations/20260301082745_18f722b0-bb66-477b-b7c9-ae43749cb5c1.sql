
-- 1. Make documents bucket private
UPDATE storage.buckets SET public = false WHERE id = 'documents';

-- 2. Drop existing open storage policies for documents bucket
DROP POLICY IF EXISTS "Anyone can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete their documents" ON storage.objects;

-- 3. Create authenticated, user-scoped storage policies
-- Users upload into their own folder: {user_id}/filename
CREATE POLICY "Authenticated users can upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Drop overly permissive anonymous demo policies on documents table
DROP POLICY IF EXISTS "Allow anonymous insert for demo" ON public.documents;
DROP POLICY IF EXISTS "Allow anonymous read for demo" ON public.documents;
