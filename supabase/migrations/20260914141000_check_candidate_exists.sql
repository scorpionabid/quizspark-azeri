-- Function to check if a candidate account already exists by FIN
CREATE OR REPLACE FUNCTION public.check_candidate_exists(p_fin text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'fin_' || lower(trim(p_fin)) || '@imtahan.store'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_candidate_exists(text) TO anon, authenticated, service_role;
