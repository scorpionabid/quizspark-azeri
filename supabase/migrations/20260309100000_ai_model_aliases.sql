-- Create AI Model Aliases table
CREATE TABLE IF NOT EXISTS public.ai_model_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alias_key TEXT NOT NULL UNIQUE,
  model_id UUID REFERENCES public.ai_models(id) ON DELETE SET NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ai_model_aliases ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view aliases" ON public.ai_model_aliases
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage aliases" ON public.ai_model_aliases
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert new specialized models if they don't exist
-- 1. Image Generation Models
INSERT INTO public.ai_models (provider_id, model_id, display_name, max_tokens, cost_per_1k_input, cost_per_1k_output)
SELECT p.id, 'google/gemini-2.0-flash-image', 'Gemini 2.0 Flash (Image)', 8192, 0, 0
FROM public.ai_providers p WHERE p.name = 'lovable'
ON CONFLICT (provider_id, model_id) DO NOTHING;

INSERT INTO public.ai_models (provider_id, model_id, display_name, max_tokens, cost_per_1k_input, cost_per_1k_output)
SELECT p.id, 'openai/dall-e-3', 'DALL-E 3', 4096, 0.04, 0.04
FROM public.ai_providers p WHERE p.name = 'lovable'
ON CONFLICT (provider_id, model_id) DO NOTHING;

-- 2. Specialized Vision/OCR Models
INSERT INTO public.ai_models (provider_id, model_id, display_name, max_tokens, cost_per_1k_input, cost_per_1k_output)
SELECT p.id, 'google/gemini-1.5-flash', 'Gemini 1.5 Flash (Vision)', 8192, 0.0001, 0.0004
FROM public.ai_providers p WHERE p.name = 'google'
ON CONFLICT (provider_id, model_id) DO NOTHING;

-- Insert Default Aliases
INSERT INTO public.ai_model_aliases (alias_key, model_id, description)
SELECT 'TEXT_ANALYSIS', m.id, 'Sual mətni analizi və təkmilləşdirilməsi üçün ana model'
FROM public.ai_models m JOIN public.ai_providers p ON m.provider_id = p.id
WHERE p.name = 'lovable' AND m.model_id = 'google/gemini-2.5-flash'
ON CONFLICT (alias_key) DO NOTHING;

INSERT INTO public.ai_model_aliases (alias_key, model_id, description)
SELECT 'IMAGE_GENERATION', m.id, 'Quiz şəkillərinin yaradılması üçün istifadə olunan model'
FROM public.ai_models m JOIN public.ai_providers p ON m.provider_id = p.id
WHERE p.name = 'lovable' AND m.model_id = 'google/gemini-2.0-flash-image'
ON CONFLICT (alias_key) DO NOTHING;

INSERT INTO public.ai_model_aliases (alias_key, model_id, description)
SELECT 'VISION_OCR', m.id, 'Şəkillərdən və PDF-lərdən sual oxumaq (Vision) üçün model'
FROM public.ai_models m JOIN public.ai_providers p ON m.provider_id = p.id
WHERE p.name = 'google' AND m.model_id = 'gemini-2.0-flash'
ON CONFLICT (alias_key) DO NOTHING;

-- Update ai_config to support alias-driven defaults (optional but good for future)
COMMENT ON TABLE public.ai_model_aliases IS 'Sistem funksiyalarını spesifik modellərə bağlayan alias cədvəli';
