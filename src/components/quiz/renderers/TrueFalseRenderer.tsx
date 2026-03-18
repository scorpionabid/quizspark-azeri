import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { RendererProps } from './types';

export const TrueFalseRenderer: React.FC<RendererProps> = ({
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
      className="flex gap-4"
    >
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50/50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 cursor-pointer hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors">
        <RadioGroupItem value="true" id="tf-true" />
        <Label htmlFor="tf-true" className="cursor-pointer font-semibold text-green-600">
          Doğru
        </Label>
      </div>
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
        <RadioGroupItem value="false" id="tf-false" />
        <Label htmlFor="tf-false" className="cursor-pointer font-semibold text-red-600">
          Yanlış
        </Label>
      </div>
    </RadioGroup>
  );
};
