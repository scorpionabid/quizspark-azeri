import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RendererProps } from './types';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

export const MultipleSelectRenderer: React.FC<RendererProps> = ({
  question,
  value,
  onChange,
  disabled,
  showFeedback,
}) => {
  const selected = value ? value.split(',').map(s => s.trim()) : [];
  
  const handleToggle = (opt: string, checked: boolean) => {
    if (disabled) return;
    let next;
    if (checked) {
      next = [...selected, opt];
    } else {
      next = selected.filter(s => s !== opt);
    }
    onChange(next.join(','));
  };

  const getCorrectAnswers = () => (question.correct_answer || '').split(',').map(s => s.trim().toLowerCase());

  return (
    <div className="space-y-3">
      {question.options?.map((opt, i) => {
        const isSelected = selected.includes(opt);
        const correctAnswers = getCorrectAnswers();
        const isOptCorrect = correctAnswers.includes(opt.toLowerCase());
        
        let statusClass = "border-border/40 bg-muted/20";
        if (showFeedback) {
          if (isSelected && isOptCorrect) statusClass = "border-green-500 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-300";
          else if (isSelected && !isOptCorrect) statusClass = "border-red-500 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-300";
          else if (!isSelected && isOptCorrect) statusClass = "border-amber-400 bg-amber-50/50 dark:bg-amber-900/10 text-amber-700";
        } else if (isSelected) {
          statusClass = "border-primary/50 bg-primary/5 shadow-sm";
        }

        return (
          <div 
            key={i} 
            className={cn(
              "flex items-center space-x-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer hover:border-primary/30",
              statusClass,
              disabled && !showFeedback && "opacity-60 cursor-not-allowed"
            )}
            onClick={() => !disabled && handleToggle(opt, !isSelected)}
          >
            <Checkbox 
              id={`${question.id}-ms-opt-${i}`} 
              checked={isSelected}
              onCheckedChange={(checked) => handleToggle(opt, !!checked)}
              disabled={disabled}
              className={cn(
                "h-5 w-5 rounded-md",
                showFeedback && isOptCorrect && "border-green-500 data-[state=checked]:bg-green-500",
                showFeedback && isSelected && !isOptCorrect && "border-red-500 data-[state=checked]:bg-red-500"
              )}
              onClick={(e) => e.stopPropagation()}
            />
            <Label 
              htmlFor={`${question.id}-ms-opt-${i}`} 
              className="flex-1 cursor-pointer font-medium text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {opt}
            </Label>
            
            {showFeedback && (
              <div className="shrink-0">
                {isOptCorrect ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : isSelected ? (
                  <X className="h-4 w-4 text-red-600" />
                ) : null}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
