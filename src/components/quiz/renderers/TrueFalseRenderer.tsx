import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
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

  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      disabled={disabled || showFeedback}
      className="flex gap-6 pt-2"
    >
      <div className={cn(
        "flex flex-1 items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all cursor-pointer",
        value === 'true' || value === 'A' 
          ? "border-green-500 bg-green-50/50 dark:bg-green-950/20" 
          : "border-border/40 bg-muted/10 opacity-70 hover:opacity-100 hover:border-green-200",
        showFeedback && isCorrectAnswerTrue && "border-green-600 bg-green-100 dark:bg-green-900/30",
        showFeedback && !isCorrectAnswerTrue && (value === 'true' || value === 'A') && "border-red-500 bg-red-100 dark:bg-red-900/30"
      )}>
        <RadioGroupItem value="true" id={`${question.id}-tf-true`} className="w-5 h-5 border-green-500 text-green-600" />
        <Label htmlFor={`${question.id}-tf-true`} className="cursor-pointer font-bold text-green-700 dark:text-green-400 flex-1 flex items-center justify-between">
          Doğru
          {showFeedback && isCorrectAnswerTrue && <Check className="w-5 h-5" />}
          {showFeedback && !isCorrectAnswerTrue && (value === 'true' || value === 'A') && <X className="w-5 h-5 text-red-600" />}
        </Label>
      </div>

      <div className={cn(
        "flex flex-1 items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all cursor-pointer",
        value === 'false' || value === 'B' 
          ? "border-red-500 bg-red-50/50 dark:bg-red-950/20" 
          : "border-border/40 bg-muted/10 opacity-70 hover:opacity-100 hover:border-red-200",
        showFeedback && !isCorrectAnswerTrue && "border-red-600 bg-red-100 dark:bg-red-900/30",
        showFeedback && isCorrectAnswerTrue && (value === 'false' || value === 'B') && "border-red-500 bg-green-100 dark:bg-red-900/30"
      )}>
        <RadioGroupItem value="false" id={`${question.id}-tf-false`} className="w-5 h-5 border-red-500 text-red-600" />
        <Label htmlFor={`${question.id}-tf-false`} className="cursor-pointer font-bold text-red-700 dark:text-red-400 flex-1 flex items-center justify-between">
          Yanlış
          {showFeedback && !isCorrectAnswerTrue && <Check className="w-5 h-5 text-green-600" />}
          {showFeedback && isCorrectAnswerTrue && (value === 'false' || value === 'B') && <X className="w-5 h-5" />}
        </Label>
      </div>
    </RadioGroup>
  );
};
