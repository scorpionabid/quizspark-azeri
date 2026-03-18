import React from 'react';
import { Input } from '@/components/ui/input';
import { RendererProps } from './types';

export const NumericalRenderer: React.FC<RendererProps> = ({
  question,
  value,
  onChange,
  disabled,
  showFeedback,
}) => {
  return (
    <div className="space-y-2">
      <Input
        type="number"
        inputMode="decimal"
        className="h-14 text-lg font-bold text-center border-2 border-primary/20 focus:border-primary rounded-2xl"
        disabled={disabled || showFeedback}
        placeholder="Rəqəmi daxil edin..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {question.numerical_tolerance != null && question.numerical_tolerance > 0 && (
        <p className="text-xs text-center text-muted-foreground">
          ±{question.numerical_tolerance} tolerans daxilindəki cavablar qəbul edilir
        </p>
      )}
    </div>
  );
};
