import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { RendererProps } from './types';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

export const MultipleChoiceRenderer: React.FC<RendererProps> = ({
  question,
  value,
  onChange,
  disabled,
  showFeedback,
}) => {
  const isCorrect = (opt: string) => {
    const ca = question.correct_answer;
    if (ca.length === 1 && /^[A-Z]$/i.test(ca)) {
      const idx = ca.toUpperCase().charCodeAt(0) - 65;
      return question.options?.[idx] === opt;
    }
    return ca === opt;
  };

  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      className="space-y-3"
    >
      {question.options?.map((opt, i) => {
        const isSelected = value === opt;
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
            onClick={() => !disabled && onChange(opt)}
          >
            <RadioGroupItem 
              value={opt} 
              id={`opt-${i}`} 
              disabled={disabled}
              className={cn(
                "h-5 w-5",
                showFeedback && optIsCorrect && "border-green-500 text-green-600",
                showFeedback && isSelected && !optIsCorrect && "border-red-500 text-red-600"
              )}
            />
            <Label 
              htmlFor={`opt-${i}`} 
              className="flex-1 cursor-pointer font-medium text-sm md:text-base"
              onClick={(e) => e.stopPropagation()}
            >
              {opt}
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
