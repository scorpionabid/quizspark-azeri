
-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT,
  grade TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  duration INTEGER DEFAULT 20,
  is_public BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  play_count INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  is_popular BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'multiple_choice',
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quiz_attempts table
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  score INTEGER,
  total_questions INTEGER,
  time_spent INTEGER,
  answers JSONB DEFAULT '[]'::jsonb
);

-- Create quiz_results table for leaderboard
CREATE TABLE public.quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  time_spent INTEGER,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- Quizzes policies
CREATE POLICY "Anyone can view published public quizzes"
ON public.quizzes FOR SELECT
USING (is_published = true AND is_public = true);

CREATE POLICY "Creators can view their own quizzes"
ON public.quizzes FOR SELECT
USING (auth.uid() = creator_id);

CREATE POLICY "Teachers and admins can create quizzes"
ON public.quizzes FOR INSERT
WITH CHECK (
  auth.uid() = creator_id AND 
  (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin'))
);

CREATE POLICY "Creators can update their own quizzes"
ON public.quizzes FOR UPDATE
USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their own quizzes"
ON public.quizzes FOR DELETE
USING (auth.uid() = creator_id);

-- Questions policies
CREATE POLICY "Anyone can view questions of published quizzes"
ON public.questions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.quizzes 
    WHERE quizzes.id = questions.quiz_id 
    AND quizzes.is_published = true 
    AND quizzes.is_public = true
  )
);

CREATE POLICY "Creators can view their quiz questions"
ON public.questions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.quizzes 
    WHERE quizzes.id = questions.quiz_id 
    AND quizzes.creator_id = auth.uid()
  )
);

CREATE POLICY "Creators can manage their quiz questions"
ON public.questions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.quizzes 
    WHERE quizzes.id = questions.quiz_id 
    AND quizzes.creator_id = auth.uid()
  )
);

-- Quiz attempts policies
CREATE POLICY "Users can view their own attempts"
ON public.quiz_attempts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own attempts"
ON public.quiz_attempts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own attempts"
ON public.quiz_attempts FOR UPDATE
USING (auth.uid() = user_id);

-- Quiz results policies
CREATE POLICY "Anyone can view quiz results for leaderboard"
ON public.quiz_results FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own results"
ON public.quiz_results FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger for quizzes
CREATE TRIGGER update_quizzes_updated_at
BEFORE UPDATE ON public.quizzes
FOR EACH ROW
EXECUTE FUNCTION public.update_documents_updated_at();

-- Create index for better performance
CREATE INDEX idx_quizzes_creator ON public.quizzes(creator_id);
CREATE INDEX idx_quizzes_subject ON public.quizzes(subject);
CREATE INDEX idx_quizzes_published ON public.quizzes(is_published, is_public);
CREATE INDEX idx_questions_quiz ON public.questions(quiz_id);
CREATE INDEX idx_quiz_attempts_user ON public.quiz_attempts(user_id);
CREATE INDEX idx_quiz_results_quiz ON public.quiz_results(quiz_id);
CREATE INDEX idx_quiz_results_score ON public.quiz_results(score DESC);
