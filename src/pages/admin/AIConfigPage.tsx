import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw, Bot, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProviderCard } from "@/components/admin/ProviderCard";
import { UsageStatsCard } from "@/components/admin/UsageStatsCard";
import { UserUsageTable } from "@/components/admin/UserUsageTable";
import { ConfigSettingsCard } from "@/components/admin/ConfigSettingsCard";
import { AIProvider, AIConfig, AIUsageStats, AIUserUsage, AIModelAlias } from "@/types/ai-config";

export default function AIConfigPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [config, setConfig] = useState<AIConfig | null>(null);
  const [usageStats, setUsageStats] = useState<AIUsageStats | null>(null);
  const [userUsage, setUserUsage] = useState<AIUserUsage[]>([]);
  const [aliases, setAliases] = useState<AIModelAlias[]>([]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch providers directly from database
      const { data: dbProviders } = await supabase
        .from("ai_providers")
        .select(`
          *,
          models:ai_models(*)
        `)
        .order("created_at");

      if (dbProviders) {
        // Check API key status for each provider
        const providersWithStatus = dbProviders.map((p) => ({
          ...p,
          hasApiKey: p.name === "lovable", // Lovable AI is always available
        })) as unknown as AIProvider[];
        setProviders(providersWithStatus);
      }

      // Fetch config
      const { data: configData } = await supabase
        .from("ai_config")
        .select("*")
        .single();

      if (configData) {
        setConfig(configData as unknown as AIConfig);
      }

      // Fetch usage stats
      const today = new Date().toISOString().split("T")[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const { data: todayLogs } = await supabase
        .from("ai_usage_logs")
        .select("total_tokens")
        .gte("created_at", today);

      const { data: weekLogs } = await supabase
        .from("ai_usage_logs")
        .select("total_tokens")
        .gte("created_at", weekAgo);

      const { data: monthLogs } = await supabase
        .from("ai_usage_logs")
        .select("total_tokens")
        .gte("created_at", monthAgo);

      setUsageStats({
        today: {
          requests: todayLogs?.length || 0,
          tokens: todayLogs?.reduce((sum, l) => sum + (l.total_tokens || 0), 0) || 0,
        },
        week: {
          requests: weekLogs?.length || 0,
          tokens: weekLogs?.reduce((sum, l) => sum + (l.total_tokens || 0), 0) || 0,
        },
        month: {
          requests: monthLogs?.length || 0,
          tokens: monthLogs?.reduce((sum, l) => sum + (l.total_tokens || 0), 0) || 0,
        },
      });

      // Fetch user usage from Edge Function
      const { data: usageData, error: usageError } = await supabase.functions.invoke("ai-config", {
        method: "GET",
        headers: {
          path: "user-usage"
        }
      });

      if (!usageError && usageData?.usage) {
        setUserUsage(usageData.usage as AIUserUsage[]);
      }

      // Fetch aliases
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: aliasData } = await (supabase as any)
        .from("ai_model_aliases")
        .select("*")
        .order("alias_key");

      if (aliasData) {
        setAliases(aliasData as AIModelAlias[]);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Xəta",
        description: "Məlumatlar yüklənərkən xəta baş verdi",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateUserLimit = async (userId: string, limit: number | null) => {
    try {
      const { error } = await supabase.functions.invoke("ai-config", {
        method: "PUT",
        headers: {
          path: "user-limit"
        },
        body: { user_id: userId, ai_daily_limit: limit }
      });

      if (error) throw error;

      toast({
        title: "Uğurlu",
        description: "İstifadəçi limiti yeniləndi",
      });

      // Refresh user usage data to show updated limits
      fetchData();
    } catch (error) {
      console.error("Error updating user limit:", error);
      toast({
        title: "Xəta",
        description: "Limit yenilənərkən xəta baş verdi",
        variant: "destructive",
      });
    }
  };

  const handleAliasChange = async (aliasKey: string, modelId: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("ai_model_aliases")
        .update({ model_id: modelId, updated_at: new Date().toISOString() })
        .eq("alias_key", aliasKey);

      if (error) throw error;

      setAliases(prev => prev.map(a =>
        a.alias_key === aliasKey ? { ...a, model_id: modelId, updated_at: new Date().toISOString() } : a
      ));

      toast({
        title: "Uğurlu",
        description: `${aliasKey} üçün model yeniləndi`,
      });
    } catch (error) {
      console.error("Error updating alias:", error);
      toast({
        title: "Xəta",
        description: "Alias yenilənərkən xəta baş verdi",
        variant: "destructive",
      });
    }
  };

  const handleProviderToggle = async (id: string, enabled: boolean) => {
    try {
      await supabase
        .from("ai_providers")
        .update({ is_enabled: enabled })
        .eq("id", id);

      setProviders(providers.map(p =>
        p.id === id ? { ...p, is_enabled: enabled } : p
      ));

      toast({
        title: "Uğurlu",
        description: `Provayder ${enabled ? "aktivləşdirildi" : "deaktiv edildi"}`,
      });
    } catch (error) {
      toast({
        title: "Xəta",
        description: "Provayder yenilənərkən xəta baş verdi",
        variant: "destructive",
      });
    }
  };

  const handleAddApiKey = (providerName: string) => {
    const keyNames: Record<string, string> = {
      openai: "OPENAI_API_KEY",
      anthropic: "ANTHROPIC_API_KEY",
      google: "GOOGLE_AI_API_KEY",
    };

    toast({
      title: "API Açarı Tələb Olunur",
      description: `${providerName.toUpperCase()} üçün ${keyNames[providerName]} əlavə edin`,
    });
  };

  const handleConfigChange = (updates: Partial<AIConfig>) => {
    if (config) {
      setConfig({ ...config, ...updates });
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    setIsSaving(true);
    try {
      await supabase
        .from("ai_config")
        .update({
          default_provider_id: config.default_provider_id,
          default_model_id: config.default_model_id,
          global_daily_limit: config.global_daily_limit,
          user_daily_limit: config.user_daily_limit,
          teacher_daily_limit: config.teacher_daily_limit,
          temperature: config.temperature,
          timeout_seconds: config.timeout_seconds,
          is_enabled: config.is_enabled,
          updated_at: new Date().toISOString(),
        })
        .eq("id", config.id);

      setHasChanges(false);
      toast({
        title: "Uğurlu",
        description: "Konfiqurasiya yadda saxlanıldı",
      });
    } catch (error) {
      toast({
        title: "Xəta",
        description: "Konfiqurasiya saxlanarkən xəta baş verdi",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Konfiqurasiyası</h1>
              <p className="text-muted-foreground">
                AI provayderlərini, modelləri və istifadə limitlərini idarə edin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={fetchData} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Yenilə
            </Button>
            {hasChanges && (
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saxlanılır..." : "Yadda Saxla"}
              </Button>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Providers */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">AI Provayderləri</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providers.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  onToggle={handleProviderToggle}
                  onAddApiKey={handleAddApiKey}
                  isDefault={provider.id === config?.default_provider_id}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            <ConfigSettingsCard
              config={config}
              providers={providers}
              aliases={aliases}
              onConfigChange={handleConfigChange}
              onAliasChange={handleAliasChange}
            />
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UsageStatsCard
            stats={usageStats}
            dailyLimit={config?.global_daily_limit || 10000}
            isLoading={isLoading}
          />
          <UserUsageTable
            usage={userUsage}
            userLimit={config?.user_daily_limit || 100}
            isLoading={isLoading}
            onUpdateLimit={handleUpdateUserLimit}
          />
        </div>
      </div>
    </div>
  );
}
