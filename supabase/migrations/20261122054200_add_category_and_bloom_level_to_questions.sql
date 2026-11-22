-- Migration: Add category and bloom_level to questions table for schema parity with question_bank
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS bloom_level text;
