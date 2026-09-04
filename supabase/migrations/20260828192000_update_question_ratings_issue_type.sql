-- Update question_ratings_issue_type_check to include 'suggestion'
ALTER TABLE question_ratings DROP CONSTRAINT IF EXISTS question_ratings_issue_type_check;
ALTER TABLE question_ratings ADD CONSTRAINT question_ratings_issue_type_check 
  CHECK (issue_type IS NULL OR issue_type = ANY (ARRAY['confusing'::text, 'error'::text, 'too_easy'::text, 'too_hard'::text, 'great'::text, 'suggestion'::text]));
