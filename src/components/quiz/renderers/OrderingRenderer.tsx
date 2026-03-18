import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { RendererProps } from './types';

export const OrderingRenderer: React.FC<RendererProps> = ({
  question,
  value,
  onChange,
  disabled,
  showFeedback,
}) => {
  const [sequence, setSequence] = useState<string[]>([]);

  useEffect(() => {
    if (sequence.length === 0 && question.sequence_items?.length) {
      // Əgər dəyər varsa ondan istifadə et, yoxdursa qarışdır
      if (value) {
        setSequence(value.split('|||'));
      } else {
        setSequence([...question.sequence_items].sort(() => Math.random() - 0.5));
      }
    }
  }, [question.id, question.sequence_items, value, sequence.length]);

  const handleMove = (from: number, direction: -1 | 1) => {
    if (disabled || showFeedback) return;
    const to = from + direction;
    if (to < 0 || to >= sequence.length) return;
    const newSeq = [...sequence];
    [newSeq[from], newSeq[to]] = [newSeq[to], newSeq[from]];
    setSequence(newSeq);
    onChange(newSeq.join('|||'));
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground italic mb-1">
        ↕ Elementləri düzgün ardıcıllıqla düzün
      </p>
      <div className="space-y-1.5">
        {sequence.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border/60 shadow-sm"
          >
            <div className="flex flex-col gap-0.5 shrink-0">
              <button
                type="button"
                onClick={() => handleMove(idx, -1)}
                disabled={disabled || showFeedback || idx === 0}
                className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted disabled:opacity-25 transition-colors"
                aria-label="Yuxarı"
              >
                <ArrowUp className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => handleMove(idx, 1)}
                disabled={disabled || showFeedback || idx === sequence.length - 1}
                className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted disabled:opacity-25 transition-colors"
                aria-label="Aşağı"
              >
                <ArrowDown className="h-3 w-3" />
              </button>
            </div>
            <div className="h-7 w-7 flex items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm shrink-0">
              {idx + 1}
            </div>
            <span className="flex-1 text-sm leading-snug">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
