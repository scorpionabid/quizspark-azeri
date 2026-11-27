-- Career Assessments table for Vocational Guidance & Aptitude Test
CREATE TABLE IF NOT EXISTS public.career_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    utis_code TEXT,
    student_name TEXT,
    school_name TEXT,
    grade_level TEXT,
    interests_score JSONB NOT NULL DEFAULT '{}'::jsonb,
    skills_score JSONB NOT NULL DEFAULT '{}'::jsonb,
    values_score JSONB NOT NULL DEFAULT '{}'::jsonb,
    radar_data JSONB NOT NULL DEFAULT '[]'::jsonb,
    dominant_cluster TEXT NOT NULL,
    dim_group TEXT NOT NULL,
    recommended_careers JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommended_subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
    raw_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast query
CREATE INDEX IF NOT EXISTS idx_career_assessments_user_id ON public.career_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_career_assessments_utis_code ON public.career_assessments(utis_code);
CREATE INDEX IF NOT EXISTS idx_career_assessments_created_at ON public.career_assessments(created_at DESC);

-- Enable RLS
ALTER TABLE public.career_assessments ENABLE ROW LEVEL SECURITY;

-- Policies:
-- 1. Anyone can view an assessment by ID (for sharing/viewing report)
CREATE POLICY "Allow select career assessments" ON public.career_assessments
    FOR SELECT USING (true);

-- 2. Anyone (anon or authenticated) can insert their assessment
CREATE POLICY "Allow insert career assessments" ON public.career_assessments
    FOR INSERT WITH CHECK (true);

-- 3. Users can update their own assessment
CREATE POLICY "Allow update own career assessments" ON public.career_assessments
    FOR UPDATE USING (
        (auth.uid() IS NOT NULL AND auth.uid() = user_id) 
        OR (auth.uid() IS NULL)
    );
