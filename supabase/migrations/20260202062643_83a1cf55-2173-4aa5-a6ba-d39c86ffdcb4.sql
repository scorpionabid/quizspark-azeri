-- First create/replace the update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create favorites table for users to save quizzes
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, quiz_id)
);

-- Enable RLS on favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- RLS policies for favorites
CREATE POLICY "Users can view their own favorites"
ON public.favorites FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
ON public.favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their favorites"
ON public.favorites FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes for favorites
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_quiz_id ON public.favorites(quiz_id);

-- Create comments table for quiz discussions
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- RLS policies for comments
CREATE POLICY "Anyone can view comments on public quizzes"
ON public.comments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.quizzes
    WHERE quizzes.id = comments.quiz_id
    AND quizzes.is_published = true
    AND quizzes.is_public = true
  )
);

CREATE POLICY "Users can view comments on their own quizzes"
ON public.comments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.quizzes
    WHERE quizzes.id = comments.quiz_id
    AND quizzes.creator_id = auth.uid()
  )
);

CREATE POLICY "Authenticated users can add comments"
ON public.comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
ON public.comments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
ON public.comments FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes for comments
CREATE INDEX IF NOT EXISTS idx_comments_quiz_id ON public.comments(quiz_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);

-- Create trigger for comments updated_at
CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create quiz_ratings table
CREATE TABLE IF NOT EXISTS public.quiz_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, quiz_id)
);

-- Enable RLS on quiz_ratings
ALTER TABLE public.quiz_ratings ENABLE ROW LEVEL SECURITY;

-- RLS policies for quiz_ratings
CREATE POLICY "Anyone can view ratings"
ON public.quiz_ratings FOR SELECT
USING (true);

CREATE POLICY "Users can add ratings"
ON public.quiz_ratings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
ON public.quiz_ratings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings"
ON public.quiz_ratings FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes for quiz_ratings
CREATE INDEX IF NOT EXISTS idx_quiz_ratings_quiz_id ON public.quiz_ratings(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_ratings_user_id ON public.quiz_ratings(user_id);

-- Create trigger for quiz_ratings updated_at
CREATE TRIGGER update_quiz_ratings_updated_at
BEFORE UPDATE ON public.quiz_ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();