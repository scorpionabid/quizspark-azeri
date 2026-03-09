export interface AIModel {
  id: string;
  model_id: string;
  display_name: string;
  provider_id?: string;
  is_default: boolean;
  max_tokens: number;
  cost_per_1k_input: number;
  cost_per_1k_output: number;
}

export interface AIProvider {
  id: string;
  name: string;
  display_name: string;
  is_enabled: boolean;
  requires_api_key: boolean;
  hasApiKey: boolean;
  models: AIModel[];
}

export interface AIConfig {
  id: string;
  default_provider_id: string;
  default_model_id: string;
  global_daily_limit: number;
  user_daily_limit: number;
  teacher_daily_limit: number;
  temperature: number;
  timeout_seconds: number;
  is_enabled: boolean;
}

export interface AIUsageStats {
  today: { requests: number; tokens: number };
  week: { requests: number; tokens: number };
  month: { requests: number; tokens: number };
}

export interface AIUserUsage {
  id: string;
  user_id: string;
  usage_date: string;
  total_requests: number;
  total_tokens: number;
  email?: string;
  full_name?: string;
  ai_daily_limit?: number | null;
}
