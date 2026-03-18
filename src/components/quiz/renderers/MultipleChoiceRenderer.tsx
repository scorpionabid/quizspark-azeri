import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { RendererProps } from './types';

export const MultipleChoiceRenderer: React.FC<RendererProps> = ({
  question,
  value,
  onChange,
  disabled,
  showFeedback,
}) => {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      disabled={disabled || showFeedback}
      className="space-y-2"
    >
      {question.options?.map((opt, i) => (
        <div key={i} className="flex items-center space-x-2">
          <RadioGroupItem value={opt} id={`opt-${i}`} />
          <Label htmlFor={`opt-${i}`} className="cursor-pointer">{opt}</Label>
        </div>
      ))}
    </RadioGroup>
  );
};
