-- Add media columns to question_bank table
ALTER TABLE public.question_bank
ADD COLUMN IF NOT EXISTS question_image_url TEXT,
ADD COLUMN IF NOT EXISTS option_images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS media_type TEXT CHECK (media_type IN ('image', 'audio', 'video')),
ADD COLUMN IF NOT EXISTS media_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.question_bank.question_image_url IS 'URL for question illustration image';
COMMENT ON COLUMN public.question_bank.option_images IS 'JSON array of option image URLs';
COMMENT ON COLUMN public.question_bank.media_type IS 'Type of additional media: image, audio, or video';
COMMENT ON COLUMN public.question_bank.media_url IS 'URL for additional media content';

-- Create a bucket for question images if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('question-images', 'question-images', true)
ON CONFLICT (id) DO NOTHING;

-- Add storage policies for question images
CREATE POLICY "Question images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'question-images');

CREATE POLICY "Users can upload question images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'question-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own question images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'question-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own question images"
ON storage.objects FOR DELETE
USING (bucket_id = 'question-images' AND auth.uid()::text = (storage.foldername(name))[1]);