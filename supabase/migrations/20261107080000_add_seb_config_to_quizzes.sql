-- Migration: Add seb_config to quizzes for Safe Exam Browser settings
-- Enables fine-grained web proctoring controls (fullscreen enforcement, violation limit, anti-copy/paste, blur on leave, candidate watermark)

ALTER TABLE public.quizzes
ADD COLUMN IF NOT EXISTS seb_config jsonb DEFAULT '{
  "enabled": false,
  "enforce_fullscreen": true,
  "max_violations": 3,
  "prevent_copy_paste": true,
  "blur_on_leave": true,
  "watermark_enabled": true
}'::jsonb;

COMMENT ON COLUMN public.quizzes.seb_config IS 'Safe Exam Browser & proctoring configuration (fullscreen, anti-screenshot, copy-paste lock, violation limit)';
