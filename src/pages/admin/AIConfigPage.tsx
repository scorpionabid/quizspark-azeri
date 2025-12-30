import { useState } from "react";
import { 
  Cpu, 
  Key, 
  Activity, 
  AlertTriangle,
  Save,
  Eye,
  EyeOff,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UsageStats {
  label: string;
  used: number;
  limit: number;
  unit: string;
}

const usageStats: UsageStats[] = [
  { label: "API Sorğuları", used: 8500, limit: 10000, unit: "sorğu" },
  { label: "Token İstifadəsi", used: 450000, limit: 1000000, unit: "token" },
  { label: "Sual Yaratma", used: 320, limit: 500, unit: "sual" },
];

export default function AIConfigPage() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
  const [model, setModel] = useState("gpt-4");
  const [maxTokens, setMaxTokens] = useState("2000");
  const [temperature, setTemperature] = useState("0.7");
  const [isEnabled, setIsEnabled] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    toast.success("AI konfiqurasiyası yeniləndi!");
    setHasChanges(false);
  };

  const handleChange = () => {
    setHasChanges(true);
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">AI Konfiqurasiyası</h1>
            <p className="text-muted-foreground">AI xidmət parametrlərini idarə edin</p>
          </div>
          {hasChanges && (
            <Button variant="game" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Dəyişiklikləri Saxla
            </Button>
          )}
        </div>

        {/* Status */}
        <div className="mb-8 flex items-center gap-4 rounded-2xl bg-gradient-card border border-border/50 p-6">
          <div className={cn(
            "flex h-14 w-14 items-center justify-center rounded-2xl",
            isEnabled ? "bg-success/20" : "bg-muted"
          )}>
            <Cpu className={cn("h-7 w-7", isEnabled ? "text-success" : "text-muted-foreground")} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">AI Xidməti</span>
              <Badge variant={isEnabled ? "success" : "muted"}>
                {isEnabled ? "Aktiv" : "Deaktiv"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              AI köməkçisi və sual yaratma xidmətləri
            </p>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={(checked) => {
              setIsEnabled(checked);
              handleChange();
            }}
          />
        </div>

        {/* Usage Stats */}
        <div className="mb-8 rounded-2xl bg-gradient-card border border-border/50 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">İstifadə Statistikası</h2>
          </div>

          <div className="space-y-6">
            {usageStats.map((stat) => {
              const percentage = (stat.used / stat.limit) * 100;
              const isWarning = percentage >= 80;
              
              return (
                <div key={stat.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{stat.label}</span>
                      {isWarning && (
                        <Badge variant="warning" className="text-xs">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Limit yaxınlaşır
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {stat.used.toLocaleString()} / {stat.limit.toLocaleString()} {stat.unit}
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={cn("h-2", isWarning && "[&>div]:bg-warning")} 
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between rounded-xl bg-muted/30 p-4">
            <span className="text-sm text-muted-foreground">Son yenilənmə: Bu gün, 14:30</span>
            <Button variant="ghost" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Yenilə
            </Button>
          </div>
        </div>

        {/* API Configuration */}
        <div className="mb-8 rounded-2xl bg-gradient-card border border-border/50 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/20">
              <Key className="h-5 w-5 text-secondary" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">API Parametrləri</h2>
          </div>

          <div className="grid gap-6">
            <div>
              <Label htmlFor="apiKey">API Açarı</Label>
              <div className="relative mt-2">
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    handleChange();
                  }}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label>Model</Label>
                <Select value={model} onValueChange={(value) => {
                  setModel(value);
                  handleChange();
                }}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="maxTokens">Maksimum Token</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  value={maxTokens}
                  onChange={(e) => {
                    setMaxTokens(e.target.value);
                    handleChange();
                  }}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="temperature">Temperature</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={temperature}
                  onChange={(e) => {
                    setTemperature(e.target.value);
                    handleChange();
                  }}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Limits Configuration */}
        <div className="rounded-2xl bg-gradient-card border border-border/50 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
              <AlertTriangle className="h-5 w-5 text-accent" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">Limit Ayarları</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="dailyLimit">Gündəlik API Limiti</Label>
              <Input
                id="dailyLimit"
                type="number"
                defaultValue="1000"
                className="mt-2"
                onChange={handleChange}
              />
              <p className="mt-1 text-xs text-muted-foreground">Gündə maksimum sorğu sayı</p>
            </div>

            <div>
              <Label htmlFor="userLimit">İstifadəçi Limiti</Label>
              <Input
                id="userLimit"
                type="number"
                defaultValue="50"
                className="mt-2"
                onChange={handleChange}
              />
              <p className="mt-1 text-xs text-muted-foreground">Hər istifadəçi üçün gündəlik limit</p>
            </div>

            <div>
              <Label htmlFor="questionLimit">Sual Yaratma Limiti</Label>
              <Input
                id="questionLimit"
                type="number"
                defaultValue="20"
                className="mt-2"
                onChange={handleChange}
              />
              <p className="mt-1 text-xs text-muted-foreground">Hər quiz üçün maksimum AI sual sayı</p>
            </div>

            <div>
              <Label htmlFor="timeout">Timeout (saniyə)</Label>
              <Input
                id="timeout"
                type="number"
                defaultValue="30"
                className="mt-2"
                onChange={handleChange}
              />
              <p className="mt-1 text-xs text-muted-foreground">API sorğu timeout müddəti</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
