import React, { useState, useEffect } from 'react';
import { Calculator, Atom, PencilLine, ChevronDown, ChevronUp, X, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExamCalculator } from './ExamCalculator';
import { MendeleevTableTool } from './MendeleevTableTool';
import { ScratchpadTool } from './ScratchpadTool';

export type ActiveExamTool = 'calculator' | 'mendeleev' | 'scratchpad' | null;

interface ExamToolsPanelProps {
  enableCalculator?: boolean;
  enablePeriodicTable?: boolean;
  enableScratchpad?: boolean;
  currentPage?: number;
  className?: string;
}

export const ExamToolsPanel: React.FC<ExamToolsPanelProps> = ({
  enableCalculator = true,
  enablePeriodicTable = true,
  enableScratchpad = true,
  currentPage,
  className,
}) => {
  const [activeTool, setActiveTool] = useState<ActiveExamTool>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const enabledTools = [
    enableCalculator && {
      id: 'calculator' as const,
      label: 'Hesablayıcı',
      icon: Calculator,
    },
    enablePeriodicTable && {
      id: 'mendeleev' as const,
      label: 'Mendeleyev',
      icon: Atom,
    },
    enableScratchpad && {
      id: 'scratchpad' as const,
      label: 'Qələm-Pozan',
      icon: PencilLine,
    },
  ].filter(Boolean) as {
    id: Exclude<ActiveExamTool, null>;
    label: string;
    icon: React.FC<{ className?: string }>;
  }[];

  // If the currently active tool gets disabled, reset it
  useEffect(() => {
    if (
      (activeTool === 'calculator' && !enableCalculator) ||
      (activeTool === 'mendeleev' && !enablePeriodicTable) ||
      (activeTool === 'scratchpad' && !enableScratchpad)
    ) {
      setActiveTool(null);
    }
  }, [activeTool, enableCalculator, enablePeriodicTable, enableScratchpad]);

  // If all 3 tools are disabled in quiz settings, hide the entire panel
  if (enabledTools.length === 0) {
    return null;
  }

  const handleToggleTool = (tool: Exclude<ActiveExamTool, null>) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setActiveTool(tool);
      return;
    }
    setActiveTool(prev => (prev === tool ? null : tool));
  };

  const handleHeaderToggle = () => {
    if (activeTool !== null) {
      // Closing the active tool (also resets scratchpad immediately)
      setActiveTool(null);
    } else {
      setIsCollapsed(prev => !prev);
    }
  };

  return (
    <div
      data-exam-tools="true"
      className={cn(
        'bg-card/90 backdrop-blur-md border border-border/50 rounded-2xl p-3.5 shadow-sm transition-all relative z-[50] pointer-events-auto',
        className,
      )}
    >
      {/* Header */}
      <button
        type="button"
        onClick={handleHeaderToggle}
        className="w-full flex items-center justify-between text-foreground font-semibold text-sm pb-2.5 border-b border-border/50 hover:text-primary transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-primary" />
          <span>Köməkçi Alətlər</span>
        </span>
        <span className="text-muted-foreground flex items-center gap-1 text-xs font-normal">
          {activeTool ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setActiveTool(null);
              }}
              className="inline-flex items-center gap-1 text-xs text-destructive hover:underline cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Bağla
            </span>
          ) : isCollapsed ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </span>
      </button>

      {/* Tool Selector Buttons */}
      {!isCollapsed && (
        <div className="pt-2.5 space-y-3">
          <div
            className={cn(
              'grid gap-1.5',
              enabledTools.length === 1 && 'grid-cols-1',
              enabledTools.length === 2 && 'grid-cols-2',
              enabledTools.length === 3 && 'grid-cols-3',
            )}
          >
            {enabledTools.map(tool => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => handleToggleTool(tool.id)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 py-2 px-1.5 rounded-xl border text-[11px] font-semibold transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-background/70 hover:bg-muted text-foreground border-border/60',
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="truncate max-w-full">{tool.label}</span>
                </button>
              );
            })}
          </div>

          {/* Collapsible Active Tool Content */}
          {activeTool === 'calculator' && enableCalculator && (
            <div className="pt-2 border-t border-border/40 animate-in fade-in slide-in-from-top-1 duration-200">
              <ExamCalculator />
            </div>
          )}

          {activeTool === 'mendeleev' && enablePeriodicTable && (
            <div className="pt-2 border-t border-border/40 animate-in fade-in slide-in-from-top-1 duration-200">
              <MendeleevTableTool />
            </div>
          )}

          {/* Unmounts immediately when closed or switched -> automatic reset */}
          {activeTool === 'scratchpad' && enableScratchpad && (
            <div className="pt-2 border-t border-border/40 animate-in fade-in slide-in-from-top-1 duration-200">
              <ScratchpadTool
                onClose={() => setActiveTool(null)}
                currentPage={currentPage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
