-- P3: Analitika + tarixçə + öyrənmə sistemi
-- learning_objectives, quiz_prerequisites, student_mastery, question_revisions

-- ─────────────────────────────────────────────
-- 1. learning_objectives — Öyrənmə Hədəfləri
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS learning_objectives (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  subject       TEXT,
  grade         TEXT,
  bloom_level   TEXT,
  curriculum    TEXT,      -- "Azərbaycan MTN 2024", "CCSS", "IB", ...
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT learning_objectives_bloom_level_check
    CHECK (bloom_level IS NULL OR bloom_level IN (
      'remembering','understanding','applying','analyzing','evaluating','creating'
    ))
);

ALTER TABLE learning_objectives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "learning_objectives_owner" ON learning_objectives
  USING (user_id = auth.uid());

CREATE POLICY "learning_objectives_insert" ON learning_objectives
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- question_bank.objective_id FK
ALTER TABLE question_bank
  ADD COLUMN IF NOT EXISTS objective_id UUID REFERENCES learning_objectives(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_learning_objectives_user    ON learning_objectives(user_id);
CREATE INDEX IF NOT EXISTS idx_question_bank_objective_id  ON question_bank(objective_id);

-- ─────────────────────────────────────────────
-- 2. quiz_prerequisites — Ön Şərtlər
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS quiz_prerequisites (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id           UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  prerequisite_id   UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  min_score         INTEGER NOT NULL DEFAULT 70
    CHECK (min_score BETWEEN 0 AND 100),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT quiz_prerequisites_unique        UNIQUE (quiz_id, prerequisite_id),
  CONSTRAINT quiz_prerequisites_no_self_ref   CHECK (quiz_id <> prerequisite_id)
);

ALTER TABLE quiz_prerequisites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quiz_prerequisites_select" ON quiz_prerequisites
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quizzes q
      WHERE q.id = quiz_prerequisites.quiz_id
        AND (q.is_public = true OR q.creator_id = auth.uid())
    )
  );

CREATE POLICY "quiz_prerequisites_manage" ON quiz_prerequisites
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM quizzes q
      WHERE q.id = quiz_prerequisites.quiz_id AND q.creator_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_quiz_prerequisites_quiz        ON quiz_prerequisites(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_prerequisites_prereq      ON quiz_prerequisites(prerequisite_id);

-- ─────────────────────────────────────────────
-- 3. student_mastery — Mövzu Mənimsəmə Analytics
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS student_mastery (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  category        TEXT NOT NULL,
  topic           TEXT,
  bloom_level     TEXT,
  correct_count   INTEGER NOT NULL DEFAULT 0 CHECK (correct_count >= 0),
  attempt_count   INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  last_practiced  TIMESTAMPTZ,
  next_review_at  TIMESTAMPTZ,     -- Spaced repetition
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT student_mastery_unique UNIQUE (student_id, category, topic, bloom_level),
  CONSTRAINT student_mastery_bloom_check
    CHECK (bloom_level IS NULL OR bloom_level IN (
      'remembering','understanding','applying','analyzing','evaluating','creating'
    ))
);

-- mastery_level hesablanmış sütun kimi VIEW-da saxlayırıq (GENERATED ALWAYS sabit deyil, 0/0 problemi)
CREATE OR REPLACE VIEW student_mastery_with_level AS
  SELECT
    *,
    CASE
      WHEN attempt_count = 0 THEN 0
      ELSE ROUND((correct_count::NUMERIC / attempt_count) * 100, 1)
    END AS mastery_level
  FROM student_mastery;

ALTER TABLE student_mastery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "student_mastery_own" ON student_mastery
  USING (student_id = auth.uid());

CREATE POLICY "student_mastery_teacher_read" ON student_mastery
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','teacher')
    )
  );

CREATE INDEX IF NOT EXISTS idx_student_mastery_student    ON student_mastery(student_id);
CREATE INDEX IF NOT EXISTS idx_student_mastery_category   ON student_mastery(category);
CREATE INDEX IF NOT EXISTS idx_student_mastery_review     ON student_mastery(next_review_at);

-- mastery_level-i avtomatik yenilə (quiz_attempts tamamlandıqda trigger əlavə edilə bilər)
CREATE OR REPLACE FUNCTION update_student_mastery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER student_mastery_updated_at
  BEFORE UPDATE ON student_mastery
  FOR EACH ROW EXECUTE FUNCTION update_student_mastery_updated_at();

-- ─────────────────────────────────────────────
-- 4. question_revisions — Sual Dəyişiklik Tarixçəsi
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS question_revisions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_bank_id  UUID NOT NULL REFERENCES question_bank(id) ON DELETE CASCADE,
  revision_number   INTEGER NOT NULL,
  changed_by        UUID REFERENCES profiles(user_id),
  change_summary    TEXT,
  snapshot          JSONB NOT NULL,   -- Sualın o anki tam JSON halı
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT question_revisions_unique UNIQUE (question_bank_id, revision_number)
);

ALTER TABLE question_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "question_revisions_owner_read" ON question_revisions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM question_bank qb
      WHERE qb.id = question_revisions.question_bank_id
        AND qb.user_id = auth.uid()
    )
  );

CREATE POLICY "question_revisions_insert" ON question_revisions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM question_bank qb
      WHERE qb.id = question_revisions.question_bank_id
        AND qb.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_question_revisions_bank   ON question_revisions(question_bank_id);
CREATE INDEX IF NOT EXISTS idx_question_revisions_num    ON question_revisions(question_bank_id, revision_number);

-- Auto-increment revision_number per question
CREATE OR REPLACE FUNCTION set_question_revision_number()
RETURNS TRIGGER AS $$
BEGIN
  SELECT COALESCE(MAX(revision_number), 0) + 1
  INTO NEW.revision_number
  FROM question_revisions
  WHERE question_bank_id = NEW.question_bank_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER question_revisions_auto_number
  BEFORE INSERT ON question_revisions
  FOR EACH ROW EXECUTE FUNCTION set_question_revision_number();
