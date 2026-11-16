import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RendererProps } from './types';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { MathRenderer } from '@/components/common/MathRenderer';

export const MultipleSelectRenderer: React.FC<RendererProps> = ({
  question,
  value,
  onChange,
  disabled,
  showFeedback,
}) => {
  const options = question.options || [];

  // Parse selected options safely (handles potential commas inside option texts)
  const selected = React.useMemo(() => {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {}

    const rawTokens = value.split(',').map(s => s.trim());
    const matched: string[] = [];
    for (const opt of options) {
      if (rawTokens.includes(opt) || value.includes(opt)) {
        matched.push(opt);
      }
    }
    return matched.length > 0 ? matched : rawTokens;
  }, [value, options]);
  
  const handleToggle = (opt: string, checked: boolean) => {
    if (disabled) return;
    let next: string[];
    if (checked) {
      next = [...selected.filter(s => s !== opt), opt];
    } else {
      next = selected.filter(s => s !== opt);
    }
    onChange(next.join(','));
  };

  const isOptCorrect = (opt: string, index: number) => {
    const rawCorrect = (question.correct_answer || '').trim();
    const correctTokens = rawCorrect.split(',').map(s => s.trim().toLowerCase());
    const optLower = opt.trim().toLowerCase();
    const letter = String.fromCharCode(65 + index).toLowerCase();

    return (
      correctTokens.includes(optLower) ||
      correctTokens.includes(letter) ||
      (Array.isArray(question.correct_option_indices) && question.correct_option_indices.includes(index))
    );
  };

  return (
    <div className="space-y-3">
      {options.map((opt, i) => {
        const isSelected = selected.includes(opt);
        const optIsCorrect = isOptCorrect(opt, i);
        
        let statusClass = "border-border/40 bg-muted/20";
        if (showFeedback) {
          if (isSelected && optIsCorrect) statusClass = "border-green-500 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-300";
          else if (isSelected && !optIsCorrect) statusClass = "border-red-500 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-300";
          else if (!isSelected && optIsCorrect) statusClass = "border-amber-400 bg-amber-50/50 dark:bg-amber-900/10 text-amber-700";
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
              className="flex-1 cursor-pointer font-medium text-sm md:text-base flex items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {!/^[A-Z][).]\s+/i.test(opt) && (
                <span className={cn(
                  "inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold mr-3 shrink-0 border transition-colors",
                  isSelected 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-muted/60 text-muted-foreground border-border/60"
                )}>
                  {String.fromCharCode(65 + i)}
                </span>
              )}
              <span className="flex-1">
                <MathRenderer text={opt} />
              </span>
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
