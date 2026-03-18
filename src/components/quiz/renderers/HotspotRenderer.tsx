import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { RendererProps } from './types';

export const HotspotRenderer: React.FC<RendererProps> = ({
  question,
  value,
  onChange,
  disabled,
  showFeedback,
}) => {
  const imgUrl = question.question_image_url || question.media_url;
  const parsed = value ? value.split(':') : [];
  const markedX = parsed[0] ? parseFloat(parsed[0]) : null;
  const markedY = parsed[1] ? parseFloat(parsed[1]) : null;

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || showFeedback) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onChange(`${x.toFixed(2)}:${y.toFixed(2)}`);
  };

  if (!imgUrl) {
    return (
      <Input
        disabled={disabled || showFeedback}
        placeholder="X:Y koordinatları daxil edin..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground italic">
        Şəkildə düzgün nöqtəyə klikləyin
      </p>
      <div
        className={cn(
          'relative select-none rounded-xl overflow-hidden border-2',
          disabled || showFeedback ? 'cursor-default' : 'cursor-crosshair',
          showFeedback ? 'border-border/40' : 'border-primary/20 hover:border-primary/40',
        )}
        onClick={handleImageClick}
      >
        <img src={imgUrl} alt="Hotspot şəkli" className="w-full object-contain" />
        {markedX !== null && markedY !== null && (
          <div
            className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${markedX}%`, top: `${markedY}%` }}
          >
            <div className="w-6 h-6 rounded-full border-4 border-primary bg-primary/30 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};
