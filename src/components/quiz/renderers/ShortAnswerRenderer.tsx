import React from 'react';
import { Input } from '@/components/ui/input';
import { RendererProps } from './types';

export const ShortAnswerRenderer: React.FC<RendererProps> = ({
  value,
  onChange,
  disabled,
  showFeedback,
}) => {
  return (
    <Input
      className="h-12 border-2 border-primary/10 focus:border-primary rounded-xl"
      disabled={disabled || showFeedback}
      placeholder="Sizin cavabınız..."
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
};
