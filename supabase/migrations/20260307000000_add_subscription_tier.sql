-- Migration: Add subscription_tier to profiles
-- Adds VIP/Quest subscription model. All existing users default to 'quest'.

-- 1. Add subscription_tier column
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS subscription_tier TEXT NOT NULL DEFAULT 'quest'
CHECK (subscription_tier IN ('vip', 'quest'));

-- 2. RPC function for admin to update a user's subscription tier
CREATE OR REPLACE FUNCTION public.update_subscription_tier(
  p_user_id UUID,
  p_tier TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only admins can call this
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;

  -- Validate tier value
  IF p_tier NOT IN ('vip', 'quest') THEN
    RAISE EXCEPTION 'Invalid tier: %. Must be vip or quest', p_tier;
  END IF;

  -- Update the profile
  UPDATE public.profiles
  SET subscription_tier = p_tier
  WHERE user_id = p_user_id;
END;
$$;
