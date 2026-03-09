# Quiz App - Database Schema Summary

This document serves as a lightweight reference to save tokens when retrieving database structure.

## Core Tables

### `profiles`
- `id` (uuid, PK)
- `user_id` (uuid, FK to auth.users)
- `email`, `full_name`, `avatar_url`, `bio`, `phone`
- `grade`, `school`
- `role` (student/teacher/admin) -> managed by app metadata / roles tables
- `subscription_tier` (string)
- `status` (string)
- `is_profile_complete` (boolean)

### `quizzes`
- `id` (uuid, PK)
- `creator_id` (uuid, FK to profiles.id)
- `title`, `description`, `subject`, `grade`, `difficulty`
- `duration` (integer, minutes)
- `is_published`, `is_public`, `is_popular`, `is_new`
- `play_count`, `rating`

### `questions`
- `id` (uuid, PK)
- `quiz_id` (uuid, FK to quizzes.id)
- `question_text`, `question_type` (e.g., `multiple_choice`, `true_false`)
- `options` (jsonb)
- `correct_answer` (string/jsonb depending on type)
- `explanation` (string)
- `order_index` (integer)

### `question_bank`
- Central repository for AI-generated and manually imported questions.
- `id` (uuid, PK)
- `user_id` (uuid, FK)
- `question_text`, `question_type`, `options`, `correct_answer`
- `explanation`, `tags`, `difficulty`, `category`, `bloom_level`
- `source_document_id` (uuid, FK to documents)
- `embedding` (vector)
- `media_url`, `media_type`, `question_image_url`, `option_images` (json)

### `quiz_attempts` & `quiz_results`
- `quiz_attempts`: In-progress tracking (`answers`, `score`, `time_spent`, `completed_at`).
- `quiz_results`: Finalized score and analytics (`percentage`, `score`, `total_questions`, `time_spent`).

### `ai_config` & `ai_usage_logs` & `ai_daily_usage`
- `ai_config`: Global limits, default model configs.
- `ai_models`: Definitions of Gemini / OpenAI models (cost, token size).
- `ai_usage_logs` / `ai_daily_usage`: User-specific token usage tracking mechanisms.

### `documents` & `comments` & `notifications`
- Core utilities for specific flows (Processing docs with AI, quiz discussions, system alerts).

> **Note to Agent:** When modifying DB schemas, prefer Supabase migrations (`supabase/migrations/*.sql`) and always run `supabase gen types typescript --local > src/integrations/supabase/types.ts` later if locally available, or update `types.ts` manually for immediate UI fix.
