-- Add background_image_url to quizzes
ALTER TABLE quizzes
ADD COLUMN IF NOT EXISTS background_image_url TEXT;

-- Create storage bucket for quiz assets if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('quiz_assets', 'quiz_assets', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS for quiz_assets bucket
CREATE POLICY "Publicly accessible quiz assets" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'quiz_assets');

CREATE POLICY "Authenticated users can upload quiz assets" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'quiz_assets' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own quiz assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'quiz_assets' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own quiz assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'quiz_assets' AND auth.uid() = owner);
