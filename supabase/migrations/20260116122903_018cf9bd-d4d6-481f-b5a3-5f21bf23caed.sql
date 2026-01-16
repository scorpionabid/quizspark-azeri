-- Create permissions table
CREATE TABLE public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

-- Anyone can view permissions
CREATE POLICY "Anyone can view permissions"
ON public.permissions FOR SELECT
USING (true);

-- Only admins can manage permissions
CREATE POLICY "Admins can manage permissions"
ON public.permissions FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create role_permissions table
CREATE TABLE public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role app_role NOT NULL,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(role, permission_id)
);

-- Enable RLS
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Anyone can view role permissions
CREATE POLICY "Anyone can view role permissions"
ON public.role_permissions FOR SELECT
USING (true);

-- Only admins can manage role permissions
CREATE POLICY "Admins can manage role permissions"
ON public.role_permissions FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default permissions
INSERT INTO public.permissions (name, description, category) VALUES
('quiz.create', 'Quiz yaratmaq', 'Quiz'),
('quiz.edit', 'Quiz redaktə etmək', 'Quiz'),
('quiz.delete', 'Quiz silmək', 'Quiz'),
('quiz.publish', 'Quiz dərc etmək', 'Quiz'),
('quiz.view_all', 'Bütün quizləri görmək', 'Quiz'),
('user.view', 'İstifadəçiləri görmək', 'User'),
('user.edit', 'İstifadəçiləri redaktə etmək', 'User'),
('user.delete', 'İstifadəçiləri silmək', 'User'),
('user.manage_roles', 'Rolları idarə etmək', 'User'),
('ai.use', 'AI istifadə etmək', 'AI'),
('ai.configure', 'AI konfiqurasiya etmək', 'AI'),
('ai.view_logs', 'AI loglarını görmək', 'AI'),
('system.settings', 'Sistem parametrləri', 'System'),
('system.analytics', 'Analitika görmək', 'System');

-- Assign permissions to roles
-- Admin gets all permissions
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'admin'::app_role, id FROM public.permissions;

-- Teacher permissions
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'teacher'::app_role, id FROM public.permissions 
WHERE name IN ('quiz.create', 'quiz.edit', 'quiz.delete', 'quiz.publish', 'ai.use', 'ai.view_logs');

-- Student permissions
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'student'::app_role, id FROM public.permissions 
WHERE name IN ('ai.use');