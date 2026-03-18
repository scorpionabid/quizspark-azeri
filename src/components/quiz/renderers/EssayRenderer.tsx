import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { RendererProps } from './types';

export const EssayRenderer: React.FC<RendererProps> = ({
  value,
  onChange,
  disabled,
  showFeedback,
}) => {
  return (
    <Textarea
      disabled={disabled || showFeedback}
      placeholder="Esse yazın..."
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
};
