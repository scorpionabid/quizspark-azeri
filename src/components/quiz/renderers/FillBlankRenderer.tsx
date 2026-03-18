import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { RendererProps } from './types';

export const FillBlankRenderer: React.FC<RendererProps> = ({
  question,
  value,
  onChange,
  disabled,
  showFeedback,
}) => {
  const template = question.fill_blank_template || question.question_text || '';
  const blanks = (template.match(/___+/g) || []).length;
  const answers = value ? value.split('|') : [];

  const parts = template.split(/(___+)/g);
  let blankIdx = 0;

  const handleBlankChange = (idx: number, val: string) => {
    if (disabled || showFeedback) return;
    const newAnswers = Array.from(
      { length: Math.max(blanks, answers.length, idx + 1) },
      (_, i) => answers[i] ?? '',
    );
    newAnswers[idx] = val;
    onChange(newAnswers.join('|'));
  };

  return (
    <div className="space-y-3">
      <div className="leading-loose text-base p-3 rounded-xl bg-muted/20 border border-border/40">
        {parts.map((part, pi) => {
          if (/^___+$/.test(part)) {
            const idx = blankIdx++;
            const ans = answers[idx] ?? '';
            const isCorrectBlank =
              showFeedback &&
              ans.trim().toLowerCase() ===
                (question.correct_answer.split('|')[idx] ?? '').trim().toLowerCase();
            return (
              <input
                key={pi}
                type="text"
                value={ans}
                onChange={e => handleBlankChange(idx, e.target.value)}
                disabled={disabled || showFeedback}
                placeholder="?"
                className={cn(
                  'inline-block w-28 h-8 min-w-0 text-center text-sm border-0 border-b-2 rounded-none bg-transparent focus:outline-none focus:ring-0 px-1 mx-0.5 align-middle transition-colors',
                  showFeedback
                    ? isCorrectBlank
                      ? 'border-green-500 text-green-600'
                      : 'border-red-400 text-red-600'
                    : 'border-primary/40 focus:border-primary',
                )}
              />
            );
          }
          return (
            <span key={pi} className="align-middle">
              {part}
            </span>
          );
        })}
      </div>
      {blanks === 0 && (
        <Input
          disabled={disabled || showFeedback}
          placeholder="Cavabınız..."
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      )}
    </div>
  );
};
