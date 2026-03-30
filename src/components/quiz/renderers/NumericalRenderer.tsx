import React from 'react';
import { Input } from '@/components/ui/input';
import { RendererProps } from './types';
import { cn } from '@/lib/utils';
import { isAnswerCorrect } from './utils';
import { Check, X, Hash } from 'lucide-react';

export const NumericalRenderer: React.FC<RendererProps> = ({
  question,
  value,
  onChange,
  disabled,
  showFeedback,
}) => {
  const isCorrect = showFeedback && isAnswerCorrect(question, value);

  return (
    <div className="space-y-4">
      <div className="relative max-w-xs mx-auto">
        <Input
          type="number"
          inputMode="decimal"
          className={cn(
            "h-16 text-2xl font-bold text-center border-2 border-primary/20 focus:border-primary rounded-2xl shadow-sm transition-all",
            showFeedback && (isCorrect ? "border-green-500 bg-green-50/50 text-green-700" : "border-red-400 bg-red-50/50 text-red-700")
          )}
          disabled={disabled || showFeedback}
          placeholder="0.00"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        {showFeedback && (
          <div className="absolute -right-10 top-1/2 -translate-y-1/2">
            {isCorrect ? (
              <Check className="h-6 w-6 text-green-600" />
            ) : (
              <X className="h-6 w-6 text-red-600" />
            )}
          </div>
        )}
      </div>

      {(question.numerical_tolerance != null && question.numerical_tolerance > 0 || showFeedback) && (
        <div className="flex flex-col items-center gap-1">
          {showFeedback && !isCorrect && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-200 text-sm font-bold text-green-700 dark:text-green-400 mb-2">
              <Hash className="w-4 h-4" />
              <span>Düzgün Cavab: {question.numerical_answer || question.correct_answer}</span>
            </div>
          )}
          {question.numerical_tolerance != null && question.numerical_tolerance > 0 && (
            <p className="text-xs text-center text-muted-foreground bg-muted/30 px-3 py-1 rounded-full border">
              ±{question.numerical_tolerance} tolerans (xəta payı) daxilində qəbul edilir
            </p>
          )}
        </div>
      )}
    </div>
  );
};
