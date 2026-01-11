import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings } from "lucide-react";
import { AIConfig, AIProvider } from "@/types/ai-config";

interface ConfigSettingsCardProps {
  config: AIConfig | null;
  providers: AIProvider[];
  onConfigChange: (updates: Partial<AIConfig>) => void;
}

export function ConfigSettingsCard({ config, providers, onConfigChange }: ConfigSettingsCardProps) {
  if (!config) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const enabledProviders = providers.filter(p => p.is_enabled);
  const selectedProvider = providers.find(p => p.id === config.default_provider_id);
  const availableModels = selectedProvider?.models || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Sistem Parametrləri
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI Service Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label>AI Xidməti</Label>
            <p className="text-sm text-muted-foreground">
              Bütün AI funksiyalarını aktiv/deaktiv et
            </p>
          </div>
          <Switch
            checked={config.is_enabled}
            onCheckedChange={(checked) => onConfigChange({ is_enabled: checked })}
          />
        </div>

        {/* Default Provider */}
        <div className="space-y-2">
          <Label>Default Provayder</Label>
          <Select
            value={config.default_provider_id || undefined}
            onValueChange={(value) => {
              const provider = providers.find(p => p.id === value);
              const defaultModel = provider?.models.find(m => m.is_default) || provider?.models[0];
              onConfigChange({ 
                default_provider_id: value,
                default_model_id: defaultModel?.id 
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Provayder seçin" />
            </SelectTrigger>
            <SelectContent>
              {enabledProviders.length > 0 ? (
                enabledProviders.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.display_name}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  Aktiv provayder yoxdur
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Default Model */}
        <div className="space-y-2">
          <Label>Default Model</Label>
          <Select
            value={config.default_model_id || undefined}
            onValueChange={(value) => onConfigChange({ default_model_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Model seçin" />
            </SelectTrigger>
            <SelectContent>
              {availableModels.length > 0 ? (
                availableModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.display_name}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  Model yoxdur
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Temperature */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Temperatur</Label>
            <span className="text-sm text-muted-foreground">{config.temperature}</span>
          </div>
          <Slider
            value={[config.temperature]}
            min={0}
            max={2}
            step={0.1}
            onValueChange={([value]) => onConfigChange({ temperature: value })}
          />
          <p className="text-xs text-muted-foreground">
            Aşağı = daha dəqiq, Yuxarı = daha yaradıcı
          </p>
        </div>

        {/* Limits */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Gündəlik Limit (Ümumi)</Label>
            <Input
              type="number"
              value={config.global_daily_limit}
              onChange={(e) => onConfigChange({ global_daily_limit: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2">
            <Label>Timeout (saniyə)</Label>
            <Input
              type="number"
              value={config.timeout_seconds}
              onChange={(e) => onConfigChange({ timeout_seconds: parseInt(e.target.value) || 30 })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>İstifadəçi Limiti</Label>
            <Input
              type="number"
              value={config.user_daily_limit}
              onChange={(e) => onConfigChange({ user_daily_limit: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2">
            <Label>Müəllim Limiti</Label>
            <Input
              type="number"
              value={config.teacher_daily_limit}
              onChange={(e) => onConfigChange({ teacher_daily_limit: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
