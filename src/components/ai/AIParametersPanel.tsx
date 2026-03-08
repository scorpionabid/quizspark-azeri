import { useState, useEffect } from "react";
import { Settings2, ChevronDown, ChevronUp, Thermometer, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export interface AIParameters {
  model: string;
  temperature: number;
  maxTokens: number;
}

interface AIParametersPanelProps {
  parameters: AIParameters;
  onChange: (parameters: AIParameters) => void;
}

interface AIModel {
  id: string;
  model_id: string;
  display_name: string;
  description?: string;
}

const FALLBACK_MODELS: AIModel[] = [
  { id: "1", model_id: "google/gemini-2.5-flash", display_name: "Gemini 2.5 Flash", description: "Sürətli və effektiv" },
  { id: "2", model_id: "google/gemini-2.5-pro", display_name: "Gemini 2.5 Pro", description: "Daha dəqiq və güclü" },
  { id: "3", model_id: "google/gemini-2.0-flash", display_name: "Gemini 2.0 Flash", description: "Stabil versiya" },
];

const temperaturePresets = [
  { value: 0.3, label: "Dəqiq", description: "Faktiki suallar üçün" },
  { value: 0.7, label: "Balans", description: "Standart istifadə" },
  { value: 1.0, label: "Yaradıcı", description: "Mürəkkəb suallar" },
];

export function AIParametersPanel({ parameters, onChange }: AIParametersPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [models, setModels] = useState<AIModel[]>(FALLBACK_MODELS);
  const [isLoadingModels, setIsLoadingModels] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const { data, error } = await supabase
          .from("ai_models")
          .select("id, model_id, display_name, description")
          .order("display_name", { ascending: true });

        if (!error && data && data.length > 0) {
          setModels(data as AIModel[]);
          // Ensure selected model is still valid, otherwise pick first
          const isCurrentValid = data.some(m => m.model_id === parameters.model);
          if (!isCurrentValid) {
            onChange({ ...parameters, model: data[0].model_id });
          }
        }
      } catch (e) {
        console.error("Failed to load AI models:", e);
        // Keep fallback
      } finally {
        setIsLoadingModels(false);
      }
    };
    fetchModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleModelChange = (model: string) => {
    onChange({ ...parameters, model });
  };

  const handleTemperatureChange = (value: number[]) => {
    onChange({ ...parameters, temperature: value[0] });
  };

  const handleMaxTokensChange = (maxTokens: string) => {
    onChange({ ...parameters, maxTokens: parseInt(maxTokens) });
  };

  const getTemperatureLabel = (temp: number) => {
    if (temp <= 0.4) return "Dəqiq";
    if (temp <= 0.7) return "Balans";
    return "Yaradıcı";
  };

  const selectedModel = models.find(m => m.model_id === parameters.model);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-xl border border-border/50 bg-muted/30 overflow-hidden">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between px-4 py-3 h-auto hover:bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-primary" />
              <span className="font-medium">AI Parametrləri</span>
              <span className="text-xs text-muted-foreground">
                ({selectedModel?.display_name ?? parameters.model}, T: {parameters.temperature})
              </span>
            </div>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-4 pt-2 space-y-5 border-t border-border/50">
            {/* Model Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-muted-foreground" />
                Model
              </Label>
              <Select value={parameters.model} onValueChange={handleModelChange} disabled={isLoadingModels}>
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingModels ? "Yüklənir..." : "Model seçin"} />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.model_id}>
                      <div className="flex flex-col items-start">
                        <span>{model.display_name}</span>
                        {model.description && (
                          <span className="text-xs text-muted-foreground">
                            {model.description}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                  Temperatur
                </Label>
                <span className="text-sm font-medium text-primary">
                  {parameters.temperature.toFixed(1)} - {getTemperatureLabel(parameters.temperature)}
                </span>
              </div>
              <Slider
                value={[parameters.temperature]}
                onValueChange={handleTemperatureChange}
                min={0.1}
                max={1.2}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Dəqiq (0.1)</span>
                <span>Yaradıcı (1.2)</span>
              </div>

              {/* Temperature Presets */}
              <div className="flex gap-2 pt-1">
                {temperaturePresets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handleTemperatureChange([preset.value])}
                    className={cn(
                      "flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                      Math.abs(parameters.temperature - preset.value) < 0.05
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Tokens */}
            <div className="space-y-2">
              <Label>Maksimum Token</Label>
              <Select
                value={parameters.maxTokens.toString()}
                onValueChange={handleMaxTokensChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2048">2048 (Qısa)</SelectItem>
                  <SelectItem value="4096">4096 (Standart)</SelectItem>
                  <SelectItem value="8192">8192 (Uzun)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}