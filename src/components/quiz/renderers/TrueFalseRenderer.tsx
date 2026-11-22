import React from 'react';
import { RendererProps } from './types';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

export const TrueFalseRenderer: React.FC<RendererProps> = ({
  question,
  value,
  onChange,
  disabled,
  showFeedback,
}) => {
  const getIsCorrect = () => {
    const ca = question.correct_answer;
    return ca === 'A' || ca === 'Doğru' || ca.toLowerCase() === 'true';
  };

  const isCorrectAnswerTrue = getIsCorrect();
  const isTrueSelected = value === 'true' || value === 'A';
  const isFalseSelected = value === 'false' || value === 'B';

  return (
    <div className="flex gap-4 sm:gap-6 pt-2" role="radiogroup">
      <div 
        role="radio"
        aria-checked={isTrueSelected}
        tabIndex={disabled || showFeedback ? -1 : 0}
        className={cn(
          "flex flex-1 items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all cursor-pointer select-none",
          isTrueSelected 
            ? "border-green-500 bg-green-50/70 dark:bg-green-950/30 ring-1 ring-green-500/30" 
            : "border-border/40 bg-muted/10 opacity-70 hover:opacity-100 hover:border-green-300",
          showFeedback && isCorrectAnswerTrue && "border-green-600 bg-green-100 dark:bg-green-900/30",
          showFeedback && !isCorrectAnswerTrue && isTrueSelected && "border-red-500 bg-red-100 dark:bg-red-900/30",
          disabled && !showFeedback && "opacity-60 cursor-not-allowed"
        )}
        onClick={() => {
          if (disabled || showFeedback) return;
          if (isTrueSelected) {
            onChange('');
          } else {
            onChange('true');
          }
        }}
        onKeyDown={(e) => {
          if (disabled || showFeedback) return;
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            if (isTrueSelected) onChange('');
            else onChange('true');
          }
        }}
      >
        <div className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
          isTrueSelected ? "border-green-600 bg-green-600 text-white" : "border-muted-foreground/40 bg-background"
        )}>
          {isTrueSelected && <div className="h-2 w-2 rounded-full bg-white" />}
        </div>
        <span className="font-bold text-green-700 dark:text-green-400 flex-1 flex items-center justify-between">
          Doğru
          {showFeedback && isCorrectAnswerTrue && <Check className="w-5 h-5 text-green-600" />}
          {showFeedback && !isCorrectAnswerTrue && isTrueSelected && <X className="w-5 h-5 text-red-600" />}
        </span>
      </div>

      <div 
        role="radio"
        aria-checked={isFalseSelected}
        tabIndex={disabled || showFeedback ? -1 : 0}
        className={cn(
          "flex flex-1 items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all cursor-pointer select-none",
          isFalseSelected 
            ? "border-red-500 bg-red-50/70 dark:bg-red-950/30 ring-1 ring-red-500/30" 
            : "border-border/40 bg-muted/10 opacity-70 hover:opacity-100 hover:border-red-300",
          showFeedback && !isCorrectAnswerTrue && "border-red-600 bg-red-100 dark:bg-red-900/30",
          showFeedback && isCorrectAnswerTrue && isFalseSelected && "border-red-500 bg-red-100 dark:bg-red-900/30",
          disabled && !showFeedback && "opacity-60 cursor-not-allowed"
        )}
        onClick={() => {
          if (disabled || showFeedback) return;
          if (isFalseSelected) {
            onChange('');
          } else {
            onChange('false');
          }
        }}
        onKeyDown={(e) => {
          if (disabled || showFeedback) return;
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            if (isFalseSelected) onChange('');
            else onChange('false');
          }
        }}
      >
        <div className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
          isFalseSelected ? "border-red-600 bg-red-600 text-white" : "border-muted-foreground/40 bg-background"
        )}>
          {isFalseSelected && <div className="h-2 w-2 rounded-full bg-white" />}
        </div>
        <span className="font-bold text-red-700 dark:text-red-400 flex-1 flex items-center justify-between">
          Yanlış
          {showFeedback && !isCorrectAnswerTrue && <Check className="w-5 h-5 text-green-600" />}
          {showFeedback && isCorrectAnswerTrue && isFalseSelected && <X className="w-5 h-5 text-red-600" />}
        </span>
      </div>
    </div>
  );
};
