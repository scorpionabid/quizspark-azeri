import React from 'react';
import { Input } from '@/components/ui/input';
import { RendererProps } from './types';
import { cn } from '@/lib/utils';
import { Check, X, FileText } from 'lucide-react';

export const ShortAnswerRenderer: React.FC<RendererProps> = ({
  question,
  value,
  onChange,
  disabled,
  showFeedback,
  placeholder = "Sizin cavabınız..."
}) => {
  const isCorrect = showFeedback && 
    value.trim().toLowerCase() === (question.correct_answer || '').trim().toLowerCase();

  return (
    <div className="space-y-2 max-w-md">
      <div className="relative">
        <Input
          className={cn(
            "h-14 border-2 rounded-2xl px-4 font-medium transition-all shadow-sm",
            showFeedback 
              ? isCorrect 
                ? "border-green-500 bg-green-50/50 text-green-700" 
                : "border-red-400 bg-red-50/50 text-red-700"
              : "border-primary/10 focus:border-primary focus:ring-4 focus:ring-primary/5"
          )}
          disabled={disabled || showFeedback}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        {showFeedback && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {isCorrect ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <X className="h-5 w-5 text-red-600" />
            )}
          </div>
        )}
      </div>
      
      {showFeedback && !isCorrect && (
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 rounded-lg text-xs">
          <Check className="w-3.5 h-3.5 text-green-600" />
          <span className="font-bold text-green-700 dark:text-green-400">Düzgün cavab:</span>
          <span className="text-muted-foreground">{question.correct_answer}</span>
        </div>
      )}
    </div>
  );
};
