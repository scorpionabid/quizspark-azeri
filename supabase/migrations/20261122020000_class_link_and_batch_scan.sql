-- Sinif üzrə tək onlayn test linki üçün şagird siyahısını qaytaran RPC
CREATE OR REPLACE FUNCTION public.get_class_students_for_quiz(p_class_id UUID)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  student_number INTEGER
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT cs.id, cs.full_name, cs.student_number
  FROM class_students cs
  WHERE cs.class_id = p_class_id
  ORDER BY cs.student_number ASC, cs.full_name ASC;
$$;
