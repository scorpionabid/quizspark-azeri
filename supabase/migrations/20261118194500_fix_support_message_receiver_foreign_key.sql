-- Migration: 20261118194500_fix_support_message_receiver_foreign_key.sql
-- Purpose:
-- Prevent 'violates foreign key constraint support_messages_receiver_id_fkey' errors
-- by automatically resolving any invalid or legacy hardcoded receiver_id to the active support admin.

CREATE OR REPLACE FUNCTION public.fix_support_message_receiver()
RETURNS TRIGGER AS $$
DECLARE
  v_valid BOOLEAN;
  v_admin_id UUID;
BEGIN
  -- Check if receiver_id exists in auth.users
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = NEW.receiver_id) INTO v_valid;
  
  -- If receiver_id is invalid or legacy hardcoded ID, automatically redirect to active support admin
  IF NOT v_valid OR NEW.receiver_id IN (
    'f95994c2-97e1-4cf1-94a5-3487b3baf1d5'::uuid,
    'd0000000-0000-0000-0000-000000000004'::uuid
  ) THEN
    v_admin_id := public.get_support_admin_id();
    NEW.receiver_id := v_admin_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_fix_support_message_receiver ON public.support_messages;
CREATE TRIGGER trg_fix_support_message_receiver
  BEFORE INSERT ON public.support_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.fix_support_message_receiver();
