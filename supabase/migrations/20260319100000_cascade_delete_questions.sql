-- M3.2: Quiz silinəndə bağlı questions avtomatik CASCADE silinir
-- Əvvəlki FK constraint-i dəyişdiririk
ALTER TABLE questions
  DROP CONSTRAINT IF EXISTS questions_quiz_id_fkey;

ALTER TABLE questions
  ADD CONSTRAINT questions_quiz_id_fkey
    FOREIGN KEY (quiz_id)
    REFERENCES quizzes(id)
    ON DELETE CASCADE;
