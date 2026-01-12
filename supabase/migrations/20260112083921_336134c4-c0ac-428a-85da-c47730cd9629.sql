-- Create question_categories table for organizing questions
CREATE TABLE IF NOT EXISTS public.question_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  parent_id UUID REFERENCES public.question_categories(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(name, user_id)
);

-- Enable RLS
ALTER TABLE public.question_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for question_categories
CREATE POLICY "Users can view their own categories"
ON public.question_categories FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create their own categories"
ON public.question_categories FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
ON public.question_categories FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
ON public.question_categories FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all categories"
ON public.question_categories FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create indexes for better query performance on question_bank
CREATE INDEX IF NOT EXISTS idx_question_bank_category ON public.question_bank(category);
CREATE INDEX IF NOT EXISTS idx_question_bank_difficulty ON public.question_bank(difficulty);
CREATE INDEX IF NOT EXISTS idx_question_bank_type ON public.question_bank(question_type);
CREATE INDEX IF NOT EXISTS idx_question_bank_user_created ON public.question_bank(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_question_bank_created_at ON public.question_bank(created_at DESC);

-- Add updated_at trigger for question_categories
CREATE TRIGGER update_question_categories_updated_at
BEFORE UPDATE ON public.question_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_documents_updated_at();