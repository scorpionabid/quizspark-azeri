import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { RendererProps } from './types';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { MathRenderer } from '@/components/common/MathRenderer';

export const MultipleChoiceRenderer: React.FC<RendererProps> = ({
  question,
  value,
  onChange,
  disabled,
  showFeedback,
}) => {
  // Find matching option for the RadioGroup value prop across languages
  const activeRadioValue = (() => {
    if (!value) return '';
    if (question.options?.includes(value)) return value;
    if (question.base_options && question.options) {
      const baseIdx = question.base_options.findIndex(b => b?.trim()?.toLowerCase() === value?.trim()?.toLowerCase());
      if (baseIdx !== -1 && question.options[baseIdx]) return question.options[baseIdx];
    }
    if (question.translation_options && question.options) {
      const transIdx = question.translation_options.findIndex(t => t?.trim()?.toLowerCase() === value?.trim()?.toLowerCase());
      if (transIdx !== -1 && question.options[transIdx]) return question.options[transIdx];
    }
    return value;
  })();

  const isCorrect = (opt: string) => {
    const ca = (question.correct_answer || '').trim().toLowerCase();
    const optClean = opt.trim().toLowerCase();
    if (ca === optClean) return true;
    if (ca.length === 1 && /^[A-Z]$/i.test(ca)) {
      const idx = ca.toUpperCase().charCodeAt(0) - 65;
      return question.options?.[idx]?.trim()?.toLowerCase() === optClean;
    }
    if (question.base_correct_answer && question.base_options && question.options) {
      const bCa = question.base_correct_answer.trim().toLowerCase();
      const bIdx = question.base_options.findIndex(b => b.trim().toLowerCase() === bCa);
      if (bIdx !== -1 && question.options[bIdx]?.trim()?.toLowerCase() === optClean) return true;
    }
    return false;
  };

  return (
    <RadioGroup
      value={activeRadioValue}
      onValueChange={onChange}
      disabled={disabled}
      className="space-y-3"
    >
      {question.options?.map((opt, i) => {
        const isSelected = activeRadioValue === opt;
        const optIsCorrect = isCorrect(opt);
        
        let statusClass = "border-border/40 bg-muted/10";
        if (showFeedback) {
          if (isSelected && optIsCorrect) statusClass = "border-green-500 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-300 shadow-sm";
          else if (isSelected && !optIsCorrect) statusClass = "border-red-500 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-300";
          else if (!isSelected && optIsCorrect) statusClass = "border-amber-400 bg-amber-50/50 dark:bg-amber-900/10 text-amber-700";
        } else if (isSelected) {
          statusClass = "border-primary/50 bg-primary/5 shadow-sm";
        }

        return (
          <div 
            key={i} 
            className={cn(
              "flex items-center space-x-3 p-4 rounded-2xl border transition-all duration-200 cursor-pointer hover:border-primary/30",
              statusClass,
              disabled && !showFeedback && "opacity-60 cursor-not-allowed"
            )}
            onClick={() => {
              if (disabled || showFeedback) return;
              if (isSelected) {
                onChange('');
              } else {
                onChange(opt);
              }
            }}
          >
            <RadioGroupItem 
              value={opt} 
              id={`${question.id}-opt-${i}`} 
              disabled={disabled}
              onClick={(e) => {
                if (disabled || showFeedback) return;
                if (isSelected) {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange('');
                }
              }}
              className={cn(
                "h-5 w-5",
                showFeedback && optIsCorrect && "border-green-500 text-green-600",
                showFeedback && isSelected && !optIsCorrect && "border-red-500 text-red-600"
              )}
            />
            <Label 
              htmlFor={`${question.id}-opt-${i}`} 
              className="flex-1 cursor-pointer font-medium text-sm md:text-base flex items-center"
              onClick={(e) => {
                if (disabled || showFeedback) return;
                if (isSelected) {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange('');
                } else {
                  e.stopPropagation();
                  onChange(opt);
                }
              }}
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
                {optIsCorrect ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : isSelected ? (
                  <X className="h-5 w-5 text-red-600" />
                ) : null}
              </div>
            )}
          </div>
        );
      })}
    </RadioGroup>
  );
};
