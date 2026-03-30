import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
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

  const getCorrectSequence = () => (
    question.sequence_items?.length
      ? question.sequence_items
      : (question.correct_answer || '').split('|||')
  ).map(s => s.trim());

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground italic mb-1 flex items-center gap-1">
        <span className="text-primary font-bold">↕</span> Elementləri düzgün ardıcıllıqla düzün
      </p>
      <div className="space-y-2">
        {sequence.map((item, idx) => {
          const correctSeq = getCorrectSequence();
          const isCorrectPos = showFeedback && item.trim() === (correctSeq[idx] || '').trim();
          
          let statusClass = "border-border/60 bg-card";
          if (showFeedback) {
            statusClass = isCorrectPos 
              ? "border-green-500 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-300" 
              : "border-red-400 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-300";
          }

          return (
            <div
              key={idx}
              className={cn(
                "flex items-center gap-3 p-3 rounded-2xl border shadow-sm transition-all duration-200",
                statusClass,
                !disabled && !showFeedback && "hover:border-primary/40 hover:shadow-md"
              )}
            >
              {!showFeedback && (
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMove(idx, -1)}
                    disabled={disabled || idx === 0}
                    className="h-6 w-6 flex items-center justify-center rounded-lg hover:bg-muted disabled:opacity-25 transition-colors border border-transparent hover:border-border"
                    aria-label="Yuxarı"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 1)}
                    disabled={disabled || idx === sequence.length - 1}
                    className="h-6 w-6 flex items-center justify-center rounded-lg hover:bg-muted disabled:opacity-25 transition-colors border border-transparent hover:border-border"
                    aria-label="Aşağı"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              
              <div className={cn(
                "h-8 w-8 flex items-center justify-center rounded-xl font-bold text-sm shrink-0",
                showFeedback 
                  ? isCorrectPos ? "bg-green-200/50 text-green-800" : "bg-red-200/50 text-red-800"
                  : "bg-primary/10 text-primary"
              )}>
                {idx + 1}
              </div>
              
              <span className="flex-1 text-sm font-medium leading-snug">{item}</span>

              {showFeedback && (
                <div className="shrink-0 ml-2">
                  {isCorrectPos ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <div className="flex items-center gap-1 text-[10px] bg-white/50 px-2 py-1 rounded-full border border-red-200">
                      <X className="h-3 w-3 text-red-500" />
                      <span className="text-red-600 font-bold whitespace-nowrap">Düzgün: {correctSeq.indexOf(item) + 1}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
