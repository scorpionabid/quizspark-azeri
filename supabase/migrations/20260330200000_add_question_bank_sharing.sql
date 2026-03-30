-- Question Bank Sharing System
-- question_bank_shares cədvəli, RLS, RPC, notification trigger

-- ─────────────────────────────────────────────
-- 1. question_bank_shares — Paylaşım Münasibəti
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS question_bank_shares (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id   UUID NOT NULL REFERENCES question_bank(id) ON DELETE CASCADE,
  shared_by     UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  shared_with   UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  message       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT qbs_no_self_share CHECK (shared_by <> shared_with),
  CONSTRAINT qbs_unique UNIQUE (question_id, shared_by, shared_with)
);

ALTER TABLE question_bank_shares ENABLE ROW LEVEL SECURITY;

-- Paylaşan öz paylaşdıqlarını görür
CREATE POLICY "qbs_select_by_sharer" ON question_bank_shares
  FOR SELECT USING (shared_by = auth.uid());

-- Alıcı öz aldıqlarını görür
CREATE POLICY "qbs_select_by_recipient" ON question_bank_shares
  FOR SELECT USING (shared_with = auth.uid());

-- Yalnız sualın sahibi paylaşa bilər
CREATE POLICY "qbs_insert" ON question_bank_shares
  FOR INSERT WITH CHECK (
    shared_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM question_bank qb
      WHERE qb.id = question_id AND qb.user_id = auth.uid()
    )
  );

-- Yalnız paylaşan ləğv edə bilər
CREATE POLICY "qbs_delete" ON question_bank_shares
  FOR DELETE USING (shared_by = auth.uid());

CREATE INDEX IF NOT EXISTS idx_qbs_shared_with  ON question_bank_shares(shared_with);
CREATE INDEX IF NOT EXISTS idx_qbs_shared_by    ON question_bank_shares(shared_by);
CREATE INDEX IF NOT EXISTS idx_qbs_question_id  ON question_bank_shares(question_id);

-- ─────────────────────────────────────────────
-- 2. question_bank SELECT policy-nin genişləndirilməsi
-- ─────────────────────────────────────────────

-- Mövcud yalnız-öz-suallar policy-ni genişləndir
DROP POLICY IF EXISTS "Users can view their own questions" ON question_bank;

CREATE POLICY "question_bank_select" ON question_bank
  FOR SELECT USING (
    user_id = auth.uid()
    OR user_id IS NULL
    OR EXISTS (
      SELECT 1 FROM question_bank_shares qbs
      WHERE qbs.question_id = id
        AND qbs.shared_with = auth.uid()
    )
  );

-- ─────────────────────────────────────────────
-- 3. get_teachers_for_sharing RPC
-- ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION get_teachers_for_sharing(search_term TEXT DEFAULT '')
RETURNS TABLE (
  user_id    UUID,
  full_name  TEXT,
  email      TEXT,
  avatar_url TEXT
)
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.user_id,
    p.full_name,
    p.email,
    p.avatar_url
  FROM profiles p
  JOIN user_roles ur ON ur.user_id = p.user_id
  WHERE ur.role = 'teacher'
    AND p.user_id <> auth.uid()
    AND (
      search_term = ''
      OR p.full_name ILIKE '%' || search_term || '%'
      OR p.email     ILIKE '%' || search_term || '%'
    )
  ORDER BY p.full_name
  LIMIT 50;
END;
$$;

-- ─────────────────────────────────────────────
-- 4. Notification trigger (notifications cədvəli mövcuddursa)
-- ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION notify_on_question_share()
RETURNS TRIGGER AS $$
DECLARE
  sharer_name TEXT;
  notif_table_exists BOOLEAN;
BEGIN
  -- notifications cədvəlinin mövcudluğunu yoxla
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'notifications'
  ) INTO notif_table_exists;

  IF notif_table_exists THEN
    SELECT full_name INTO sharer_name
    FROM profiles WHERE user_id = NEW.shared_by;

    INSERT INTO notifications (user_id, title, description, type, link)
    VALUES (
      NEW.shared_with,
      'Yeni sual paylaşıldı',
      COALESCE(sharer_name, 'Bir müəllim') || ' sizinlə sual paylaşdı',
      'info',
      '/teacher/question-bank?tab=shared-with-me'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER qbs_notify_on_share
  AFTER INSERT ON question_bank_shares
  FOR EACH ROW EXECUTE FUNCTION notify_on_question_share();
