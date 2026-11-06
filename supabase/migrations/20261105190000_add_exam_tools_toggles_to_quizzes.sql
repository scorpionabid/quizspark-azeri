-- Add per-quiz visibility toggles for sidebar helper tools (Calculator, Periodic Table, Scratchpad)
ALTER TABLE public.quizzes
  ADD COLUMN IF NOT EXISTS enable_calculator BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS enable_periodic_table BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS enable_scratchpad BOOLEAN NOT NULL DEFAULT true;
