import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  systemPrompt: string;
}

interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onClick: () => void;
}

export function AgentCard({ agent, isSelected, onClick }: AgentCardProps) {
  const Icon = agent.icon;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-4 text-center transition-all duration-300",
        "hover:scale-[1.02] hover:shadow-lg",
        isSelected
          ? "border-primary bg-primary/10 shadow-md"
          : "border-border/50 bg-gradient-card hover:border-primary/50"
      )}
    >
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
          agent.color
        )}
      >
        <Icon className="h-7 w-7 text-white" />
      </div>
      <div>
        <h3 className="font-display font-semibold text-foreground">{agent.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
          {agent.description}
        </p>
      </div>
      {isSelected && (
        <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
          ✓
        </div>
      )}
    </button>
  );
}
