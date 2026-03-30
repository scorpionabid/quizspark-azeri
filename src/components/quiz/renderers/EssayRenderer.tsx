import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { RendererProps } from './types';
import { cn } from '@/lib/utils';
import { FileText } from 'lucide-react';

export const EssayRenderer: React.FC<RendererProps> = ({
  value,
  onChange,
  disabled,
  showFeedback,
}) => {
  return (
    <div className="space-y-3">
      <div className="relative group">
        <div className="absolute top-3 right-3 opacity-20 pointer-events-none group-focus-within:opacity-50 transition-opacity">
          <FileText className="w-5 h-5" />
        </div>
        <Textarea
          className={cn(
            "min-h-[200px] p-4 border-2 rounded-2xl shadow-sm transition-all focus:ring-4 focus:ring-primary/5",
            showFeedback 
              ? "bg-muted/10 border-border/60" 
              : "border-primary/10 focus:border-primary"
          )}
          disabled={disabled || showFeedback}
          placeholder="Düşüncələrinizi və cavabınızı burada ətraflı qeyd edin..."
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </div>
      {showFeedback && (
        <p className="text-xs text-muted-foreground italic bg-muted/20 p-3 rounded-xl border border-dashed">
          Esse tipli suallar müəllim tərəfindən ayrıca qiymətləndiriləcək.
        </p>
      )}
    </div>
  );
};
