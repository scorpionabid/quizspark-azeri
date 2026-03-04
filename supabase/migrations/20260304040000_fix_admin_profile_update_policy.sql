-- Fix: Admin users can now update any profile (e.g. approve teachers)
-- The old policy only allowed users to update their own profile.

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Re-create a policy that allows:
-- 1. Users to update their own profile
-- 2. Admins to update any profile (for teacher approval, status changes, etc.)
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (
    auth.uid() = user_id
    OR has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
    auth.uid() = user_id
    OR has_role(auth.uid(), 'admin'::app_role)
);
