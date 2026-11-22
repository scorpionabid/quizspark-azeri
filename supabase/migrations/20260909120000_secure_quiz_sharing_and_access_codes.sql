-- Migration: 20260909120000_secure_quiz_sharing_and_access_codes.sql
-- Description:
-- 1. Add share_code column (VARCHAR(10) UNIQUE) to quizzes for 6-digit PIN joining
-- 2. Trigger to auto-generate unique 6-digit PIN on quiz creation
-- 3. Backfill existing quizzes with unique 6-digit PINs
-- 4. Fix RLS policies on quizzes and questions so unlisted/link-only quizzes (is_public = false, is_published = true) are accessible by link/PIN
-- 5. RPC verify_quiz_password(p_quiz_id UUID, p_password TEXT) for secure server-side password check
-- 6. RPC get_quiz_by_pin_or_code(p_code TEXT) for fast, accurate PIN lookup
-- 7. Computed column function has_password(public.quizzes) for client visibility check without leaking plain text password

-- 1. Add share_code column & index
ALTER TABLE public.quizzes 
  ADD COLUMN IF NOT EXISTS share_code VARCHAR(10) UNIQUE;

CREATE INDEX IF NOT EXISTS idx_quizzes_share_code ON public.quizzes(share_code);

-- 2. Generator function for unique 6-digit PIN
CREATE OR REPLACE FUNCTION public.generate_unique_quiz_share_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  done BOOLEAN DEFAULT FALSE;
BEGIN
  WHILE NOT done LOOP
    new_code := (FLOOR(RANDOM() * 900000) + 100000)::TEXT;
    IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE share_code = new_code) THEN
      done := TRUE;
    END IF;
  END LOOP;
  RETURN new_code;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- 3. Trigger to assign share_code on quiz insert
CREATE OR REPLACE FUNCTION public.set_quiz_share_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.share_code IS NULL OR TRIM(NEW.share_code) = '' THEN
    NEW.share_code := public.generate_unique_quiz_share_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_quiz_share_code ON public.quizzes;
CREATE TRIGGER trg_set_quiz_share_code
BEFORE INSERT ON public.quizzes
FOR EACH ROW
EXECUTE FUNCTION public.set_quiz_share_code();

-- 4. Backfill existing quizzes
UPDATE public.quizzes
SET share_code = public.generate_unique_quiz_share_code()
WHERE share_code IS NULL;

-- 5. Fix RLS policies on quizzes and questions:
-- Allow direct access to ANY published quiz (both is_public=true and is_public=false)
DROP POLICY IF EXISTS "Anyone can view published public quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Anyone can view published quizzes" ON public.quizzes;

CREATE POLICY "Anyone can view published quizzes" ON public.quizzes
  FOR SELECT
  USING (is_published = true);

-- Update questions RLS to match
DROP POLICY IF EXISTS "Anyone can view questions of published quizzes" ON public.questions;

CREATE POLICY "Anyone can view questions of published quizzes" ON public.questions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE quizzes.id = questions.quiz_id
        AND quizzes.is_published = true
    )
  );

-- 6. RPC: Server-side password verification
CREATE OR REPLACE FUNCTION public.verify_quiz_password(p_quiz_id UUID, p_password TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  real_pwd TEXT;
BEGIN
  SELECT access_password INTO real_pwd
  FROM public.quizzes
  WHERE id = p_quiz_id AND is_published = true;

  -- If quiz does not exist or has no password, return true
  IF real_pwd IS NULL OR TRIM(real_pwd) = '' THEN
    RETURN TRUE;
  END IF;

  -- Verify case-insensitively trimmed
  IF TRIM(LOWER(real_pwd)) = TRIM(LOWER(COALESCE(p_password, ''))) THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 7. RPC: Lookup quiz by PIN or code
CREATE OR REPLACE FUNCTION public.get_quiz_by_pin_or_code(p_code TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  subject TEXT,
  grade TEXT,
  difficulty TEXT,
  duration INTEGER,
  question_count INTEGER,
  is_published BOOLEAN,
  is_public BOOLEAN,
  has_password BOOLEAN,
  share_code VARCHAR
) AS $$
DECLARE
  clean_code TEXT;
  is_uuid BOOLEAN;
BEGIN
  clean_code := TRIM(p_code);
  is_uuid := clean_code ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

  RETURN QUERY
  SELECT 
    q.id,
    q.title,
    q.description,
    q.subject,
    q.grade,
    q.difficulty,
    q.duration,
    q.question_count,
    q.is_published,
    q.is_public,
    (q.access_password IS NOT NULL AND TRIM(q.access_password) <> '') AS has_password,
    q.share_code
  FROM public.quizzes q
  WHERE q.is_published = true
    AND (
      q.share_code = clean_code
      OR (is_uuid AND q.id = clean_code::UUID)
      OR q.id::TEXT ILIKE clean_code || '%'
    )
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 8. Computed column function for PostgREST
CREATE OR REPLACE FUNCTION public.has_password(quiz_row public.quizzes)
RETURNS BOOLEAN AS $$
  SELECT (quiz_row.access_password IS NOT NULL AND TRIM(quiz_row.access_password) <> '');
$$ LANGUAGE sql STABLE;

-- 9. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
