-- KSQ/BSQ sistemi, Dərslik Kitabxanası və Mövzu Kataloqu
-- 1. textbooks storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('textbooks', 'textbooks', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can read textbooks storage"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'textbooks');

CREATE POLICY "Teachers and admins can upload textbooks storage"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'textbooks' AND (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher')
  )
);

CREATE POLICY "Admins can update or delete textbooks storage"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'textbooks' AND public.has_role(auth.uid(), 'admin')
);

-- 2. textbooks cədvəli (TRİMS və ya manual yüklənmiş dərsliklər)
CREATE TABLE IF NOT EXISTS textbooks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  grade           INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 11),
  subject         TEXT NOT NULL,
  is_core_subject BOOLEAN NOT NULL DEFAULT false,
  source_type     TEXT NOT NULL DEFAULT 'trims_sync'
    CHECK (source_type IN ('trims_sync', 'teacher_upload', 'admin_upload')),
  source_url      TEXT,
  storage_path    TEXT,
  status          TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'ready', 'failed')),
  error_message   TEXT,
  page_count      INTEGER,
  uploaded_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT textbooks_grade_subject_title_unique UNIQUE (grade, subject, title)
);

ALTER TABLE textbooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view textbooks"
ON textbooks FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Teachers and admins can insert textbooks"
ON textbooks FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher')
);

CREATE POLICY "Admins and uploaders can update textbooks"
ON textbooks FOR UPDATE
TO authenticated
USING (
  uploaded_by = auth.uid() OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete textbooks"
ON textbooks FOR DELETE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
);

CREATE INDEX IF NOT EXISTS idx_textbooks_grade_subject ON textbooks(grade, subject);
CREATE INDEX IF NOT EXISTS idx_textbooks_status ON textbooks(status);

-- 3. curriculum_topics cədvəli (Bölmə və Mövzular)
CREATE TABLE IF NOT EXISTS curriculum_topics (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  textbook_id  UUID REFERENCES textbooks(id) ON DELETE CASCADE,
  grade        INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 11),
  subject      TEXT NOT NULL,
  unit_name    TEXT NOT NULL DEFAULT 'Ümumi bölmə',
  topic_name   TEXT NOT NULL,
  semester     INTEGER CHECK (semester IS NULL OR semester IN (1, 2)),
  order_index  INTEGER NOT NULL DEFAULT 0,
  page_start   INTEGER,
  page_end     INTEGER,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE curriculum_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view curriculum_topics"
ON curriculum_topics FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Teachers and admins can manage curriculum_topics"
ON curriculum_topics FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher')
);

CREATE INDEX IF NOT EXISTS idx_curriculum_topics_grade_subject ON curriculum_topics(grade, subject);
CREATE INDEX IF NOT EXISTS idx_curriculum_topics_textbook ON curriculum_topics(textbook_id);

-- 4. textbook_chunks cədvəli (Dərslik Mətn Parçaları)
CREATE TABLE IF NOT EXISTS textbook_chunks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  textbook_id  UUID NOT NULL REFERENCES textbooks(id) ON DELETE CASCADE,
  topic_id     UUID REFERENCES curriculum_topics(id) ON DELETE SET NULL,
  content      TEXT NOT NULL,
  page_number  INTEGER,
  chunk_index  INTEGER NOT NULL DEFAULT 0,
  embedding    extensions.vector(768),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE textbook_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view textbook_chunks"
ON textbook_chunks FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Teachers and admins can manage textbook_chunks"
ON textbook_chunks FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher')
);

CREATE INDEX IF NOT EXISTS idx_textbook_chunks_textbook_id ON textbook_chunks(textbook_id);
CREATE INDEX IF NOT EXISTS idx_textbook_chunks_topic_id ON textbook_chunks(topic_id);

-- 5. quizzes cədvəlinə KSQ/BSQ dəstəyi
ALTER TABLE quizzes
  ADD COLUMN IF NOT EXISTS assessment_type TEXT NOT NULL DEFAULT 'quiz'
    CHECK (assessment_type IN ('quiz', 'ksq', 'bsq', 'sinaq')),
  ADD COLUMN IF NOT EXISTS topics JSONB DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_quizzes_assessment_type ON quizzes(assessment_type);
