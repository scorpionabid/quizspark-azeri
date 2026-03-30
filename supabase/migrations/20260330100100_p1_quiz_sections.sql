-- P1: quiz_sections cədvəli
-- Quiz daxilindəki bölmələr (Bölmə A, Bölmə B, ...)
-- questions.section_id FK əlavəsi

-- ─────────────────────────────────────────────
-- 1. quiz_sections cədvəli
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS quiz_sections (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id       UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  order_index   INTEGER NOT NULL DEFAULT 0,
  time_limit    INTEGER,          -- Bu bölmə üçün ayrıca vaxt (saniyə), NULL = quiz limiti keçər
  pass_score    NUMERIC(5,2),     -- Bu bölmə üçün keçid balı (0-100), NULL = məcburi deyil
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE quiz_sections ENABLE ROW LEVEL SECURITY;

-- Quiz sahibi öz bölmələrini görür
CREATE POLICY "quiz_sections_select" ON quiz_sections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quizzes q
      WHERE q.id = quiz_sections.quiz_id
        AND (q.is_public = true OR q.creator_id = auth.uid())
    )
  );

CREATE POLICY "quiz_sections_insert" ON quiz_sections
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM quizzes q
      WHERE q.id = quiz_sections.quiz_id AND q.creator_id = auth.uid()
    )
  );

CREATE POLICY "quiz_sections_update" ON quiz_sections
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM quizzes q
      WHERE q.id = quiz_sections.quiz_id AND q.creator_id = auth.uid()
    )
  );

CREATE POLICY "quiz_sections_delete" ON quiz_sections
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM quizzes q
      WHERE q.id = quiz_sections.quiz_id AND q.creator_id = auth.uid()
    )
  );

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_quiz_sections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quiz_sections_updated_at
  BEFORE UPDATE ON quiz_sections
  FOR EACH ROW EXECUTE FUNCTION update_quiz_sections_updated_at();

-- ─────────────────────────────────────────────
-- 2. questions.section_id FK
-- ─────────────────────────────────────────────

ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS section_id UUID REFERENCES quiz_sections(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_questions_section_id    ON questions(section_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sections_quiz_id   ON quiz_sections(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sections_order     ON quiz_sections(quiz_id, order_index);
