-- P1: Question column improvements
-- short_answer: accepted_answers, match_type
-- essay: rubric, word limits, ai grading
-- all types: feedback_correct / feedback_incorrect
-- quiz_attempts: detailed tracking columns

-- ─────────────────────────────────────────────
-- 1. questions cədvəli
-- ─────────────────────────────────────────────

-- Short answer improvements
ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS accepted_answers       TEXT[],
  ADD COLUMN IF NOT EXISTS answer_case_sensitive  BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS answer_trim_spaces     BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS answer_match_type      TEXT NOT NULL DEFAULT 'exact';

ALTER TABLE questions
  ADD CONSTRAINT questions_answer_match_type_check
  CHECK (answer_match_type IN ('exact','contains','startswith','regex'));

-- Essay improvements
ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS essay_rubric           JSONB,
  ADD COLUMN IF NOT EXISTS essay_min_words        INTEGER,
  ADD COLUMN IF NOT EXISTS essay_max_words        INTEGER,
  ADD COLUMN IF NOT EXISTS ai_grading_enabled     BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS ai_grading_prompt      TEXT;

-- Feedback per answer correctness (all types)
ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS feedback_correct       TEXT,
  ADD COLUMN IF NOT EXISTS feedback_incorrect     TEXT;

-- Pedagogical / accessibility metadata
ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS learning_objective     TEXT,
  ADD COLUMN IF NOT EXISTS curriculum_standard    TEXT,
  ADD COLUMN IF NOT EXISTS topic                  TEXT,
  ADD COLUMN IF NOT EXISTS alt_text               TEXT,
  ADD COLUMN IF NOT EXISTS read_aloud_text        TEXT,
  ADD COLUMN IF NOT EXISTS is_required            BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_hint_after_attempts INTEGER,
  ADD COLUMN IF NOT EXISTS max_attempts           INTEGER;

-- ─────────────────────────────────────────────
-- 2. question_bank cədvəli (eyni sütunlar)
-- ─────────────────────────────────────────────

ALTER TABLE question_bank
  ADD COLUMN IF NOT EXISTS accepted_answers       TEXT[],
  ADD COLUMN IF NOT EXISTS answer_case_sensitive  BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS answer_trim_spaces     BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS answer_match_type      TEXT NOT NULL DEFAULT 'exact';

ALTER TABLE question_bank
  ADD CONSTRAINT question_bank_answer_match_type_check
  CHECK (answer_match_type IN ('exact','contains','startswith','regex'));

ALTER TABLE question_bank
  ADD COLUMN IF NOT EXISTS essay_rubric           JSONB,
  ADD COLUMN IF NOT EXISTS essay_min_words        INTEGER,
  ADD COLUMN IF NOT EXISTS essay_max_words        INTEGER,
  ADD COLUMN IF NOT EXISTS ai_grading_enabled     BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS ai_grading_prompt      TEXT;

ALTER TABLE question_bank
  ADD COLUMN IF NOT EXISTS feedback_correct       TEXT,
  ADD COLUMN IF NOT EXISTS feedback_incorrect     TEXT;

ALTER TABLE question_bank
  ADD COLUMN IF NOT EXISTS learning_objective     TEXT,
  ADD COLUMN IF NOT EXISTS curriculum_standard    TEXT,
  ADD COLUMN IF NOT EXISTS topic                  TEXT,
  ADD COLUMN IF NOT EXISTS alt_text               TEXT,
  ADD COLUMN IF NOT EXISTS read_aloud_text        TEXT,
  ADD COLUMN IF NOT EXISTS is_required            BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_hint_after_attempts INTEGER,
  ADD COLUMN IF NOT EXISTS max_attempts           INTEGER;

-- ─────────────────────────────────────────────
-- 3. quiz_attempts — detallı izləmə
-- ─────────────────────────────────────────────

ALTER TABLE quiz_attempts
  ADD COLUMN IF NOT EXISTS question_timings       JSONB,
  ADD COLUMN IF NOT EXISTS hint_used_questions    UUID[],
  ADD COLUMN IF NOT EXISTS bookmarked_questions   UUID[],
  ADD COLUMN IF NOT EXISTS device_type            TEXT;

ALTER TABLE quiz_attempts
  ADD CONSTRAINT quiz_attempts_device_type_check
  CHECK (device_type IS NULL OR device_type IN ('mobile','tablet','desktop'));

-- ─────────────────────────────────────────────
-- 4. Index-lər
-- ─────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_questions_topic          ON questions(topic);
CREATE INDEX IF NOT EXISTS idx_question_bank_topic      ON question_bank(topic);
CREATE INDEX IF NOT EXISTS idx_question_bank_objective  ON question_bank(learning_objective);
