-- Müəllimin Sinif Jurnalı, Şagird Siyahısı və 10 Ballıq Nəticələr Sistemi

-- 1. teacher_classes — Müəllimin sinifləri (6A, 6B və s.)
CREATE TABLE IF NOT EXISTS teacher_classes (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  grade          INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 11),
  academic_year  TEXT NOT NULL DEFAULT '2025-2026',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE teacher_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers manage their own classes"
ON teacher_classes FOR ALL
TO authenticated
USING (
  teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (teacher_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_teacher_classes_teacher ON teacher_classes(teacher_id);

-- 2. class_students — Sinif şagirdlərinin siyahısı
CREATE TABLE IF NOT EXISTS class_students (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id        UUID NOT NULL REFERENCES teacher_classes(id) ON DELETE CASCADE,
  full_name       TEXT NOT NULL,
  student_number  INTEGER NOT NULL DEFAULT 1,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE class_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers manage students in their classes"
ON class_students FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM teacher_classes tc
    WHERE tc.id = class_students.class_id
      AND (tc.teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM teacher_classes tc
    WHERE tc.id = class_students.class_id AND tc.teacher_id = auth.uid()
  )
);

CREATE INDEX IF NOT EXISTS idx_class_students_class_id ON class_students(class_id);

-- 3. student_assessment_results — Şagirdlərin 10 ballıq sistemlə nəticələri
CREATE TABLE IF NOT EXISTS student_assessment_results (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id         UUID REFERENCES teacher_classes(id) ON DELETE SET NULL,
  student_id       UUID NOT NULL REFERENCES class_students(id) ON DELETE CASCADE,
  quiz_id          UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score            INTEGER NOT NULL DEFAULT 0,
  total_questions  INTEGER NOT NULL DEFAULT 0,
  percentage       NUMERIC(5,2) NOT NULL DEFAULT 0,
  score_10         NUMERIC(4,1) NOT NULL DEFAULT 0,
  grade_mark       INTEGER NOT NULL DEFAULT 2 CHECK (grade_mark BETWEEN 2 AND 5),
  variant          TEXT DEFAULT 'A',
  source           TEXT NOT NULL DEFAULT 'camera_omr'
    CHECK (source IN ('camera_omr', 'online', 'manual')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT student_quiz_unique UNIQUE (student_id, quiz_id)
);

ALTER TABLE student_assessment_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers manage their students assessment results"
ON student_assessment_results FOR ALL
TO authenticated
USING (
  teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (teacher_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_student_results_class_quiz ON student_assessment_results(class_id, quiz_id);
CREATE INDEX IF NOT EXISTS idx_student_results_student ON student_assessment_results(student_id);

-- 4. Onlayn test tamamlandıqda şagirdin nəticəsini jurnal cədvəlinə yazan RPC
CREATE OR REPLACE FUNCTION public.record_online_student_result(
  p_class_id UUID,
  p_student_id UUID,
  p_quiz_id UUID,
  p_score INTEGER,
  p_total_questions INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_teacher_id UUID;
  v_percentage NUMERIC(5,2);
  v_score_10 NUMERIC(4,1);
  v_grade_mark INTEGER;
BEGIN
  SELECT teacher_id INTO v_teacher_id
  FROM teacher_classes
  WHERE id = p_class_id;

  IF v_teacher_id IS NULL THEN
    RETURN;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM class_students WHERE id = p_student_id AND class_id = p_class_id
  ) THEN
    RETURN;
  END IF;

  IF p_total_questions > 0 THEN
    v_percentage := ROUND((p_score::NUMERIC / p_total_questions::NUMERIC) * 100, 2);
    v_score_10 := ROUND((p_score::NUMERIC / p_total_questions::NUMERIC) * 10, 1);
  ELSE
    v_percentage := 0;
    v_score_10 := 0;
  END IF;

  v_grade_mark := CASE
    WHEN v_percentage <= 30 THEN 2
    WHEN v_percentage <= 60 THEN 3
    WHEN v_percentage <= 80 THEN 4
    ELSE 5
  END;

  INSERT INTO student_assessment_results (
    teacher_id, class_id, student_id, quiz_id,
    score, total_questions, percentage, score_10, grade_mark,
    variant, source
  )
  VALUES (
    v_teacher_id, p_class_id, p_student_id, p_quiz_id,
    p_score, p_total_questions, v_percentage, v_score_10, v_grade_mark,
    'A', 'online'
  )
  ON CONFLICT (student_id, quiz_id)
  DO UPDATE SET
    score = EXCLUDED.score,
    total_questions = EXCLUDED.total_questions,
    percentage = EXCLUDED.percentage,
    score_10 = EXCLUDED.score_10,
    grade_mark = EXCLUDED.grade_mark,
    source = 'online';
END;
$$;
