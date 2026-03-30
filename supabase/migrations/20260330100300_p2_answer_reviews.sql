-- P2: answer_reviews cədvəli
-- Essay / kod sualları üçün müəllim manual qiymətləndirmə sistemi

CREATE TABLE IF NOT EXISTS answer_reviews (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id       UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id      UUID NOT NULL REFERENCES questions(id)    ON DELETE CASCADE,
  reviewer_id      UUID REFERENCES profiles(user_id),        -- Müəllim (NULL = AI reviewed)
  student_answer   TEXT,
  awarded_score    NUMERIC(6,2),
  max_score        NUMERIC(6,2),
  rubric_scores    JSONB,
  -- [{"criterion":"Məzmun","score":4,"max":5,"comment":"Yaxşı izah edilib"}]
  ai_score         NUMERIC(6,2),
  ai_feedback      TEXT,
  comments         TEXT,
  status           TEXT NOT NULL DEFAULT 'pending',
  submitted_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at      TIMESTAMPTZ,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT answer_reviews_unique_per_question UNIQUE (attempt_id, question_id),
  CONSTRAINT answer_reviews_status_check
    CHECK (status IN ('pending','ai_reviewed','teacher_reviewed','disputed'))
);

-- RLS
ALTER TABLE answer_reviews ENABLE ROW LEVEL SECURITY;

-- Müəllim öz quiz-inin review-larını görür
CREATE POLICY "answer_reviews_select_teacher" ON answer_reviews
  FOR SELECT USING (
    reviewer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM quiz_attempts qa
      JOIN quizzes q ON q.id = qa.quiz_id
      WHERE qa.id = answer_reviews.attempt_id AND q.creator_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM quiz_attempts qa
      WHERE qa.id = answer_reviews.attempt_id AND qa.user_id = auth.uid()
    )
  );

CREATE POLICY "answer_reviews_insert" ON answer_reviews
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM quiz_attempts qa
      JOIN quizzes q ON q.id = qa.quiz_id
      WHERE qa.id = answer_reviews.attempt_id AND q.creator_id = auth.uid()
    )
  );

CREATE POLICY "answer_reviews_update" ON answer_reviews
  FOR UPDATE USING (
    reviewer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM quiz_attempts qa
      JOIN quizzes q ON q.id = qa.quiz_id
      WHERE qa.id = answer_reviews.attempt_id AND q.creator_id = auth.uid()
    )
  );

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_answer_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER answer_reviews_updated_at
  BEFORE UPDATE ON answer_reviews
  FOR EACH ROW EXECUTE FUNCTION update_answer_reviews_updated_at();

-- Index-lər
CREATE INDEX IF NOT EXISTS idx_answer_reviews_attempt     ON answer_reviews(attempt_id);
CREATE INDEX IF NOT EXISTS idx_answer_reviews_reviewer    ON answer_reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_answer_reviews_status      ON answer_reviews(status);
CREATE INDEX IF NOT EXISTS idx_answer_reviews_question    ON answer_reviews(question_id);
