-- Əsas metadata
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS weight NUMERIC DEFAULT 1.0;
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS hint TEXT;
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS time_limit INTEGER; -- saniyə

-- Cavab açıqlamaları (hər variant üçün ayrı)
-- Format: {"0": "A niyə yanlışdır...", "1": "B niyə düzgündür...", ...}
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS per_option_explanations JSONB;

-- Video sual sahələri
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS video_url TEXT; -- YouTube URL
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS video_start_time INTEGER; -- saniyə
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS video_end_time INTEGER;   -- saniyə

-- 3D model sahələri
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS model_3d_url TEXT; -- .glb/.gltf URL
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS model_3d_type TEXT; -- 'glb' | 'gltf'

-- Xüsusi tip sahələri
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS hotspot_data JSONB;
-- Format: [{"x": 45.2, "y": 30.1, "label": "Ürək", "isCorrect": true}, ...]

ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS matching_pairs JSONB;
-- Format: [{"left": "H2O", "right": "Su"}, {"left": "NaCl", "right": "Duz"}]

ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS sequence_items JSONB;
-- Format: ["Birinci addım", "İkinci addım", "Üçüncü addım"] (düzgün sıra)

ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS fill_blank_template TEXT;
-- Format: "Günəş sisteminin mərkəzində ___ yerləşir"

ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS numerical_answer NUMERIC;
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS numerical_tolerance NUMERIC DEFAULT 0;

-- Keyfiyyət statistikaları
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS feedback_enabled BOOLEAN DEFAULT true;
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS quality_score NUMERIC;
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0;

-- questions table
ALTER TABLE questions ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS weight NUMERIC DEFAULT 1.0;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS hint TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS time_limit INTEGER;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS per_option_explanations JSONB;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS video_start_time INTEGER;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS video_end_time INTEGER;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS model_3d_url TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS model_3d_type TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS hotspot_data JSONB;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS matching_pairs JSONB;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS sequence_items JSONB;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS fill_blank_template TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS numerical_answer NUMERIC;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS numerical_tolerance NUMERIC DEFAULT 0;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS question_image_url TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS option_images JSONB;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS media_type TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS media_url TEXT;

-- Question ratings
CREATE TABLE IF NOT EXISTS question_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Hansı suala aid olduğunu göstərir (bank və ya quiz sualı)
  question_bank_id UUID REFERENCES question_bank(id) ON DELETE CASCADE,
  quiz_question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  issue_type TEXT CHECK (issue_type IN (
    'confusing',   -- Başa düşülməz
    'error',       -- Xətalıdır
    'too_easy',    -- Çox asandır
    'too_hard',    -- Çox çətindir
    'great'        -- Əla sual
  )),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  -- Hər tələbə bir sualı yalnız bir dəfə qiymətləndirir
  UNIQUE (user_id, question_bank_id),
  UNIQUE (user_id, quiz_question_id),
  -- Ən azı biri dolu olmalıdır
  CONSTRAINT at_least_one_question CHECK (
    question_bank_id IS NOT NULL OR quiz_question_id IS NOT NULL
  )
);

-- RLS Policy-ləri
ALTER TABLE question_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tələbə öz reytinqlərini görür"
  ON question_ratings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Tələbə reytinq əlavə edir"
  ON question_ratings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Tələbə öz reytinqini yeniləyir"
  ON question_ratings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Müəllim/admin bütün reytinqləri görür"
  ON question_ratings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin')
    )
  );

-- quality_score-u avtomatik yeniləmək üçün funksiya
CREATE OR REPLACE FUNCTION update_question_quality_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE question_bank
  SET quality_score = (
    SELECT AVG(rating::NUMERIC)
    FROM question_ratings
    WHERE question_bank_id = NEW.question_bank_id
  )
  WHERE id = NEW.question_bank_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_quality_score
AFTER INSERT OR UPDATE ON question_ratings
FOR EACH ROW EXECUTE FUNCTION update_question_quality_score();

-- Bucket for 3D models
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'question-3d-models',
  'question-3d-models',
  true,
  52428800, -- 50MB
  ARRAY['model/gltf-binary', 'model/gltf+json', 'application/octet-stream']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "3D model ictimai oxuma"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'question-3d-models');

CREATE POLICY "Auth istifadəçi 3D model yükləyir"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'question-3d-models' AND auth.role() = 'authenticated');
