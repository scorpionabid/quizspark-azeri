-- Enable pgvector extension for vector search
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- Create questions bank table
CREATE TABLE public.question_bank (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice',
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  category TEXT,
  difficulty TEXT DEFAULT 'orta',
  bloom_level TEXT,
  source_document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
  embedding vector(768),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.question_bank ENABLE ROW LEVEL SECURITY;

-- RLS policies for authenticated users
CREATE POLICY "Users can view their own questions"
ON public.question_bank
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own questions"
ON public.question_bank
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own questions"
ON public.question_bank
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own questions"
ON public.question_bank
FOR DELETE
USING (auth.uid() = user_id);

-- Anonymous access for demo
CREATE POLICY "Allow anonymous read for demo"
ON public.question_bank
FOR SELECT
USING (user_id IS NULL);

CREATE POLICY "Allow anonymous insert for demo"
ON public.question_bank
FOR INSERT
WITH CHECK (user_id IS NULL);

-- Create index for vector similarity search
CREATE INDEX question_bank_embedding_idx ON public.question_bank 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create index for text search
CREATE INDEX question_bank_text_search_idx ON public.question_bank 
USING gin (to_tsvector('simple', question_text));

-- Create function for similarity search
CREATE OR REPLACE FUNCTION public.search_questions(
  query_embedding vector(768),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10,
  filter_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  question_text TEXT,
  question_type TEXT,
  options JSONB,
  correct_answer TEXT,
  explanation TEXT,
  category TEXT,
  difficulty TEXT,
  bloom_level TEXT,
  tags TEXT[],
  similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    qb.id,
    qb.question_text,
    qb.question_type,
    qb.options,
    qb.correct_answer,
    qb.explanation,
    qb.category,
    qb.difficulty,
    qb.bloom_level,
    qb.tags,
    1 - (qb.embedding <=> query_embedding) AS similarity
  FROM public.question_bank qb
  WHERE 
    (filter_user_id IS NULL OR qb.user_id = filter_user_id OR qb.user_id IS NULL)
    AND qb.embedding IS NOT NULL
    AND 1 - (qb.embedding <=> query_embedding) > match_threshold
  ORDER BY qb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Update timestamp trigger
CREATE TRIGGER update_question_bank_updated_at
BEFORE UPDATE ON public.question_bank
FOR EACH ROW
EXECUTE FUNCTION public.update_documents_updated_at();