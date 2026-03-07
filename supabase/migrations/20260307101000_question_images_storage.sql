-- Create question-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('question-images', 'question-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow anyone to read from question-images bucket
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'question-images');

-- Policy to allow authenticated users to upload to question-images bucket
CREATE POLICY "Auth User Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'question-images');

-- Policy to allow authenticated users to update their own objects
CREATE POLICY "Auth User Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'question-images');

-- Policy to allow authenticated users to delete their own objects
CREATE POLICY "Auth User Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'question-images');
