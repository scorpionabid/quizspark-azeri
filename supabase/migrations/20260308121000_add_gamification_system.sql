-- Add gamification fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS xp_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;

-- Add comment for clarity
COMMENT ON COLUMN public.profiles.xp_points IS 'Total experience points earned by the student';
COMMENT ON COLUMN public.profiles.streak_count IS 'Consecutive days of activity';
COMMENT ON COLUMN public.profiles.last_active_at IS 'Timestamp of the last meaningful activity (e.g. quiz completion)';
COMMENT ON COLUMN public.profiles.level IS 'Current gamification level of the student';

-- Function to handle XP and Streak updates
CREATE OR REPLACE FUNCTION public.update_user_gamification(p_xp_gain INTEGER)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_old_xp INTEGER;
    v_new_xp INTEGER;
    v_old_level INTEGER;
    v_new_level INTEGER;
    v_last_active TIMESTAMP WITH TIME ZONE;
    v_streak INTEGER;
    v_today DATE := CURRENT_DATE;
    v_last_date DATE;
BEGIN
    -- Get current stats
    SELECT xp_points, level, last_active_at, streak_count 
    INTO v_old_xp, v_old_level, v_last_active, v_streak
    FROM public.profiles
    WHERE user_id = v_user_id;

    IF NOT FOUND THEN
        -- If profile not found, maybe handle it or raise
        RETURN jsonb_build_object('error', 'Profile not found');
    END IF;

    -- 1. Calculate new XP and Level
    v_new_xp := COALESCE(v_old_xp, 0) + p_xp_gain;
    -- Simple level formula: Level = floor(sqrt(XP / 100)) + 1
    v_new_level := floor(sqrt(v_new_xp / 100.0))::INTEGER + 1;

    -- 2. Update Streak
    v_last_date := v_last_active::DATE;
    
    IF v_last_date IS NULL THEN
        v_streak := 1;
    ELSIF v_last_date = v_today THEN
        -- Already active today, keep streak
        v_streak := COALESCE(v_streak, 1);
    ELSIF v_last_date = v_today - INTERVAL '1 day' THEN
        -- Active yesterday, increment streak
        v_streak := COALESCE(v_streak, 0) + 1;
    ELSE
        -- Global streak reset (missed a day)
        v_streak := 1;
    END IF;

    -- 3. Update Profile
    UPDATE public.profiles
    SET 
        xp_points = v_new_xp,
        level = v_new_level,
        streak_count = v_streak,
        last_active_at = NOW(),
        updated_at = NOW()
    WHERE user_id = v_user_id;

    RETURN jsonb_build_object(
        'xp_gained', p_xp_gain,
        'total_xp', v_new_xp,
        'old_level', v_old_level,
        'new_level', v_new_level,
        'streak', v_streak,
        'level_up', v_new_level > v_old_level
    );
END;
$$;
