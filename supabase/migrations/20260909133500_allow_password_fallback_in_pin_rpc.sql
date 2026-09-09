-- Allow get_quiz_by_pin_or_code to also resolve unique access_password if entered instead of share_code
CREATE OR REPLACE FUNCTION public.get_quiz_by_pin_or_code(p_code text)
 RETURNS TABLE(id uuid, title text, description text, subject text, grade text, difficulty text, duration integer, question_count integer, is_published boolean, is_public boolean, has_password boolean, share_code character varying)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  clean_code TEXT;
  is_uuid BOOLEAN;
  found_count INT;
BEGIN
  clean_code := TRIM(p_code);
  is_uuid := clean_code ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

  -- 1. First priority: match share_code or ID
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

  IF FOUND THEN
    RETURN;
  END IF;

  -- 2. Second priority: If no quiz matched by share_code/ID, check if it matches access_password of a single quiz
  SELECT COUNT(*) INTO found_count
  FROM public.quizzes q
  WHERE q.is_published = true
    AND TRIM(q.access_password) = clean_code;

  IF found_count = 1 THEN
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
      true AS has_password,
      q.share_code
    FROM public.quizzes q
    WHERE q.is_published = true
      AND TRIM(q.access_password) = clean_code
    LIMIT 1;
  END IF;
END;
$function$;
