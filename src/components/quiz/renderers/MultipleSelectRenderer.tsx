import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RendererProps } from './types';

export const MultipleSelectRenderer: React.FC<RendererProps> = ({
  question,
  value,
  onChange,
  disabled,
  showFeedback,
}) => {
  const selected = value ? value.split(',').map(s => s.trim()) : [];
  
  const handleToggle = (opt: string, checked: boolean) => {
    if (disabled || showFeedback) return;
    let next;
    if (checked) {
      next = [...selected, opt];
    } else {
      next = selected.filter(s => s !== opt);
    }
    onChange(next.join(','));
  };

  return (
    <div className="space-y-2">
      {question.options?.map((opt, i) => (
        <div key={i} className="flex items-center space-x-2">
          <Checkbox 
            id={`ms-opt-${i}`} 
            checked={selected.includes(opt)}
            onCheckedChange={(checked) => handleToggle(opt, !!checked)}
            disabled={disabled || showFeedback}
          />
          <Label htmlFor={`ms-opt-${i}`} className="cursor-pointer">{opt}</Label>
        </div>
      ))}
    </div>
  );
};
