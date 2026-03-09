-- Add ai_daily_limit to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ai_daily_limit INTEGER DEFAULT NULL;

-- Comment for clarity
COMMENT ON COLUMN public.profiles.ai_daily_limit IS 'İstifadəçi üçün xüsusi AI limit. NULL olarsa global limit istifadə olunur.';

-- Create a view for admin usage monitoring that joins profiles
CREATE OR REPLACE VIEW public.admin_ai_usage_monitoring AS
SELECT 
    u.id,
    u.user_id,
    p.full_name,
    p.email,
    u.usage_date,
    u.total_requests,
    u.total_tokens,
    COALESCE(p.ai_daily_limit, (SELECT user_daily_limit FROM ai_config LIMIT 1)) as effective_limit
FROM 
    public.ai_daily_usage u
LEFT JOIN 
    public.profiles p ON u.user_id = p.user_id;

-- Ensure RLS allows admins to see this view
ALTER VIEW public.admin_ai_usage_monitoring OWNER TO postgres;
GRANT SELECT ON public.admin_ai_usage_monitoring TO authenticated;
GRANT SELECT ON public.admin_ai_usage_monitoring TO service_role;
