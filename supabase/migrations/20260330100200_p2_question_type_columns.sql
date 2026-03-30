-- P2: Sual tipi spesifik sütunlar
-- code: dil, şablon, test case-lər, icra limitləri
-- fill_blank: çox boşluq dəstəyi
-- matching: media dəstəyi
-- hotspot: tip + tolerant

-- ─────────────────────────────────────────────
-- 1. CODE sualı sütunları
-- ─────────────────────────────────────────────

ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS code_language          TEXT,
  ADD COLUMN IF NOT EXISTS code_starter_template  TEXT,
  ADD COLUMN IF NOT EXISTS code_test_cases        JSONB,
  -- [{"input":"5","expectedOutput":"25","description":"5-in kvadratı","isHidden":false}]
  ADD COLUMN IF NOT EXISTS code_time_limit_ms     INTEGER DEFAULT 5000,
  ADD COLUMN IF NOT EXISTS code_memory_limit_mb   INTEGER DEFAULT 128;

ALTER TABLE questions
  ADD CONSTRAINT questions_code_language_check
  CHECK (code_language IS NULL OR code_language IN (
    'python','javascript','typescript','java','cpp','c','csharp',
    'go','rust','php','ruby','swift','kotlin','sql','bash','r'
  ));

ALTER TABLE question_bank
  ADD COLUMN IF NOT EXISTS code_language          TEXT,
  ADD COLUMN IF NOT EXISTS code_starter_template  TEXT,
  ADD COLUMN IF NOT EXISTS code_test_cases        JSONB,
  ADD COLUMN IF NOT EXISTS code_time_limit_ms     INTEGER DEFAULT 5000,
  ADD COLUMN IF NOT EXISTS code_memory_limit_mb   INTEGER DEFAULT 128;

ALTER TABLE question_bank
  ADD CONSTRAINT question_bank_code_language_check
  CHECK (code_language IS NULL OR code_language IN (
    'python','javascript','typescript','java','cpp','c','csharp',
    'go','rust','php','ruby','swift','kotlin','sql','bash','r'
  ));

-- ─────────────────────────────────────────────
-- 2. FILL_BLANK — çox boşluq dəstəyi
-- ─────────────────────────────────────────────
-- Template nümunəsi: "Azərbaycan ___1___ il müstəqildir, paytaxtı ___2___-dır"
-- fill_blank_answers: {"1":["müstəqil","müstəqillik"],"2":["Bakı","baku"]}

ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS fill_blank_answers       JSONB,
  ADD COLUMN IF NOT EXISTS fill_blank_case_sensitive BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE question_bank
  ADD COLUMN IF NOT EXISTS fill_blank_answers       JSONB,
  ADD COLUMN IF NOT EXISTS fill_blank_case_sensitive BOOLEAN NOT NULL DEFAULT false;

-- ─────────────────────────────────────────────
-- 3. MATCHING — media dəstəyi
-- ─────────────────────────────────────────────

ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS matching_left_type     TEXT NOT NULL DEFAULT 'text',
  ADD COLUMN IF NOT EXISTS matching_right_type    TEXT NOT NULL DEFAULT 'text',
  ADD COLUMN IF NOT EXISTS matching_left_media    JSONB,
  -- {"pair_id_uuid": "https://...", ...}
  ADD COLUMN IF NOT EXISTS matching_right_media   JSONB;

ALTER TABLE questions
  ADD CONSTRAINT questions_matching_left_type_check
  CHECK (matching_left_type IN ('text','image','audio'));

ALTER TABLE questions
  ADD CONSTRAINT questions_matching_right_type_check
  CHECK (matching_right_type IN ('text','image','audio'));

ALTER TABLE question_bank
  ADD COLUMN IF NOT EXISTS matching_left_type     TEXT NOT NULL DEFAULT 'text',
  ADD COLUMN IF NOT EXISTS matching_right_type    TEXT NOT NULL DEFAULT 'text',
  ADD COLUMN IF NOT EXISTS matching_left_media    JSONB,
  ADD COLUMN IF NOT EXISTS matching_right_media   JSONB;

ALTER TABLE question_bank
  ADD CONSTRAINT question_bank_matching_left_type_check
  CHECK (matching_left_type IN ('text','image','audio'));

ALTER TABLE question_bank
  ADD CONSTRAINT question_bank_matching_right_type_check
  CHECK (matching_right_type IN ('text','image','audio'));

-- ─────────────────────────────────────────────
-- 4. HOTSPOT — tip + tolerantlıq
-- ─────────────────────────────────────────────

ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS hotspot_type           TEXT NOT NULL DEFAULT 'point',
  ADD COLUMN IF NOT EXISTS hotspot_tolerance_px   INTEGER DEFAULT 20;

ALTER TABLE questions
  ADD CONSTRAINT questions_hotspot_type_check
  CHECK (hotspot_type IN ('point','region','multiple_point'));

ALTER TABLE question_bank
  ADD COLUMN IF NOT EXISTS hotspot_type           TEXT NOT NULL DEFAULT 'point',
  ADD COLUMN IF NOT EXISTS hotspot_tolerance_px   INTEGER DEFAULT 20;

ALTER TABLE question_bank
  ADD CONSTRAINT question_bank_hotspot_type_check
  CHECK (hotspot_type IN ('point','region','multiple_point'));

-- ─────────────────────────────────────────────
-- 5. AUDIO — əlçatımlılıq
-- ─────────────────────────────────────────────

ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS audio_transcript       TEXT,
  ADD COLUMN IF NOT EXISTS audio_playback_limit   INTEGER;

ALTER TABLE question_bank
  ADD COLUMN IF NOT EXISTS audio_transcript       TEXT,
  ADD COLUMN IF NOT EXISTS audio_playback_limit   INTEGER;

-- ─────────────────────────────────────────────
-- 6. MATRIX / LIKERT — yeni tiplər üçün sütunlar
-- ─────────────────────────────────────────────

ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS matrix_rows            JSONB,
  -- ["Dərsə gəlirəm", "Ev tapşırığı"]
  ADD COLUMN IF NOT EXISTS matrix_columns         JSONB,
  -- ["Heç vaxt", "Bəzən", "Həmişə"]
  ADD COLUMN IF NOT EXISTS matrix_correct_answers JSONB,
  -- {"0": "2", "1": "1"}  (sıra_idx → sütun_idx)
  ADD COLUMN IF NOT EXISTS likert_min_label       TEXT,
  ADD COLUMN IF NOT EXISTS likert_max_label       TEXT,
  ADD COLUMN IF NOT EXISTS likert_scale           INTEGER DEFAULT 5,
  ADD COLUMN IF NOT EXISTS is_graded              BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS diagram_labels         JSONB,
  -- [{"id":"1","x":45,"y":30,"expectedLabel":"Ürək"}]
  ADD COLUMN IF NOT EXISTS correct_option_indices INTEGER[],
  ADD COLUMN IF NOT EXISTS shuffle_options        BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS partial_credit_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS partial_credit_config  JSONB;
  -- {"type":"proportional"} | {"type":"per_option","deductPerWrong":0.25}

ALTER TABLE question_bank
  ADD COLUMN IF NOT EXISTS matrix_rows            JSONB,
  ADD COLUMN IF NOT EXISTS matrix_columns         JSONB,
  ADD COLUMN IF NOT EXISTS matrix_correct_answers JSONB,
  ADD COLUMN IF NOT EXISTS likert_min_label       TEXT,
  ADD COLUMN IF NOT EXISTS likert_max_label       TEXT,
  ADD COLUMN IF NOT EXISTS likert_scale           INTEGER DEFAULT 5,
  ADD COLUMN IF NOT EXISTS is_graded              BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS diagram_labels         JSONB,
  ADD COLUMN IF NOT EXISTS correct_option_indices INTEGER[],
  ADD COLUMN IF NOT EXISTS shuffle_options        BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS partial_credit_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS partial_credit_config  JSONB;
