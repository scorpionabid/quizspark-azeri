import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Key, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { AIProvider } from "@/types/ai-config";

interface ProviderCardProps {
  provider: AIProvider;
  onToggle: (id: string, enabled: boolean) => void;
  onAddApiKey: (providerName: string) => void;
  isDefault?: boolean;
}

export function ProviderCard({ provider, onToggle, onAddApiKey, isDefault }: ProviderCardProps) {
  const [showModels, setShowModels] = useState(false);
  
  const getProviderIcon = (name: string) => {
    switch (name) {
      case "lovable":
        return "💜";
      case "openai":
        return "🤖";
      case "anthropic":
        return "🧠";
      case "google":
        return "🔮";
      default:
        return "⚡";
    }
  };

  const canBeEnabled = !provider.requires_api_key || provider.hasApiKey;

  return (
    <Card className={`transition-all ${provider.is_enabled ? "border-primary/50 bg-primary/5" : "opacity-75"}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getProviderIcon(provider.name)}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{provider.display_name}</h3>
                {isDefault && (
                  <Badge variant="default" className="text-xs">Default</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                {provider.requires_api_key ? (
                  provider.hasApiKey ? (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle2 className="h-3 w-3" />
                      API açarı konfiqurasiya edilib
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-destructive">
                      <XCircle className="h-3 w-3" />
                      API açarı tələb olunur
                    </span>
                  )
                ) : (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3 w-3" />
                    API açarı lazım deyil
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {provider.requires_api_key && !provider.hasApiKey && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddApiKey(provider.name)}
              >
                <Key className="h-4 w-4 mr-1" />
                Əlavə et
              </Button>
            )}
            <Switch
              checked={provider.is_enabled}
              onCheckedChange={(checked) => onToggle(provider.id, checked)}
              disabled={!canBeEnabled}
            />
          </div>
        </div>

        {/* Models section */}
        <div className="mt-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between"
            onClick={() => setShowModels(!showModels)}
          >
            <span className="text-sm text-muted-foreground">
              {provider.models?.length || 0} model mövcuddur
            </span>
            {showModels ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          {showModels && provider.models && (
            <div className="mt-2 space-y-1">
              {provider.models.map((model) => (
                <div
                  key={model.id}
                  className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/50 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span>{model.display_name}</span>
                    {model.is_default && (
                      <Badge variant="secondary" className="text-xs">Default</Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {model.max_tokens.toLocaleString()} tokens
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
