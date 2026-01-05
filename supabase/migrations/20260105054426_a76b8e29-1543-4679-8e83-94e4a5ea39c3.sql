-- AI Providers table
CREATE TABLE public.ai_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  requires_api_key BOOLEAN DEFAULT true,
  api_endpoint TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Models table
CREATE TABLE public.ai_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.ai_providers(id) ON DELETE CASCADE,
  model_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  max_tokens INTEGER DEFAULT 4096,
  supports_streaming BOOLEAN DEFAULT true,
  cost_per_1k_input DECIMAL(10,6) DEFAULT 0,
  cost_per_1k_output DECIMAL(10,6) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider_id, model_id)
);

-- System AI Configuration
CREATE TABLE public.ai_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  default_provider_id UUID REFERENCES public.ai_providers(id),
  default_model_id UUID REFERENCES public.ai_models(id),
  global_daily_limit INTEGER DEFAULT 10000,
  user_daily_limit INTEGER DEFAULT 100,
  teacher_daily_limit INTEGER DEFAULT 500,
  temperature DECIMAL(2,1) DEFAULT 0.7,
  timeout_seconds INTEGER DEFAULT 30,
  is_enabled BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Usage Logs table
CREATE TABLE public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER GENERATED ALWAYS AS (input_tokens + output_tokens) STORED,
  request_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily usage summary for performance
CREATE TABLE public.ai_daily_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  usage_date DATE DEFAULT CURRENT_DATE,
  total_requests INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  UNIQUE(user_id, usage_date)
);

-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'student');

-- User Roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Enable RLS on all tables
ALTER TABLE public.ai_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_daily_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_providers (read-only for all authenticated, write for admin)
CREATE POLICY "Anyone can view providers" ON public.ai_providers
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage providers" ON public.ai_providers
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for ai_models
CREATE POLICY "Anyone can view models" ON public.ai_models
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage models" ON public.ai_models
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for ai_config
CREATE POLICY "Anyone can view config" ON public.ai_config
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage config" ON public.ai_config
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for ai_usage_logs
CREATE POLICY "Users can view own logs" ON public.ai_usage_logs
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all logs" ON public.ai_usage_logs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert logs" ON public.ai_usage_logs
  FOR INSERT WITH CHECK (true);

-- RLS Policies for ai_daily_usage
CREATE POLICY "Users can view own usage" ON public.ai_daily_usage
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all usage" ON public.ai_daily_usage
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can manage usage" ON public.ai_daily_usage
  FOR ALL WITH CHECK (true);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default providers
INSERT INTO public.ai_providers (name, display_name, requires_api_key, api_endpoint) VALUES
  ('lovable', 'Lovable AI', false, 'https://ai.gateway.lovable.dev/v1/chat/completions'),
  ('openai', 'OpenAI', true, 'https://api.openai.com/v1/chat/completions'),
  ('anthropic', 'Anthropic (Claude)', true, 'https://api.anthropic.com/v1/messages'),
  ('google', 'Google AI', true, 'https://generativelanguage.googleapis.com/v1beta/models');

-- Insert default models
INSERT INTO public.ai_models (provider_id, model_id, display_name, is_default, max_tokens, cost_per_1k_input, cost_per_1k_output)
SELECT p.id, m.model_id, m.display_name, m.is_default, m.max_tokens, m.cost_input, m.cost_output
FROM public.ai_providers p
CROSS JOIN (VALUES
  ('lovable', 'google/gemini-2.5-flash', 'Gemini 2.5 Flash', true, 8192, 0.0001, 0.0002),
  ('lovable', 'google/gemini-2.5-pro', 'Gemini 2.5 Pro', false, 8192, 0.001, 0.002),
  ('lovable', 'openai/gpt-5', 'GPT-5', false, 8192, 0.002, 0.006),
  ('lovable', 'openai/gpt-5-mini', 'GPT-5 Mini', false, 8192, 0.0004, 0.0012),
  ('openai', 'gpt-4o', 'GPT-4o', false, 4096, 0.005, 0.015),
  ('openai', 'gpt-4o-mini', 'GPT-4o Mini', true, 4096, 0.00015, 0.0006),
  ('openai', 'gpt-5', 'GPT-5', false, 8192, 0.002, 0.006),
  ('anthropic', 'claude-sonnet-4-5-20251101', 'Claude 4.5 Sonnet', true, 8192, 0.003, 0.015),
  ('anthropic', 'claude-3-5-haiku-20241022', 'Claude 3.5 Haiku', false, 8192, 0.0008, 0.004),
  ('google', 'gemini-2.0-flash', 'Gemini 2.0 Flash', true, 8192, 0.0001, 0.0002),
  ('google', 'gemini-1.5-pro', 'Gemini 1.5 Pro', false, 8192, 0.00125, 0.005)
) AS m(provider_name, model_id, display_name, is_default, max_tokens, cost_input, cost_output)
WHERE p.name = m.provider_name;

-- Insert default config with Lovable AI as default
INSERT INTO public.ai_config (default_provider_id, default_model_id, global_daily_limit, user_daily_limit, teacher_daily_limit)
SELECT p.id, m.id, 10000, 100, 500
FROM public.ai_providers p
JOIN public.ai_models m ON m.provider_id = p.id AND m.is_default = true
WHERE p.name = 'lovable'
LIMIT 1;

-- Create indexes for performance
CREATE INDEX idx_ai_usage_logs_user_id ON public.ai_usage_logs(user_id);
CREATE INDEX idx_ai_usage_logs_created_at ON public.ai_usage_logs(created_at);
CREATE INDEX idx_ai_daily_usage_user_date ON public.ai_daily_usage(user_id, usage_date);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);