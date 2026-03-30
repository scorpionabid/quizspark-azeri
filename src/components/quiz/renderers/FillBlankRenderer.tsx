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
    <div className="space-y-4">
      <div className="leading-relaxed text-sm md:text-base p-4 md:p-6 rounded-2xl bg-muted/10 border border-border/40 shadow-inner">
        {parts.map((part, pi) => {
          if (/^___+$/.test(part)) {
            const idx = blankIdx++;
            const ans = answers[idx] ?? '';
            const correctAnswer = (question.correct_answer.split('|')[idx] ?? '').trim();
            const isCorrectBlank =
              showFeedback &&
              ans.trim().toLowerCase() === correctAnswer.toLowerCase();

            return (
              <span key={pi} className="inline-flex flex-col items-center align-middle mx-1 my-1">
                <input
                  type="text"
                  value={ans}
                  onChange={e => handleBlankChange(idx, e.target.value)}
                  disabled={disabled || showFeedback}
                  placeholder="..."
                  className={cn(
                    'w-32 h-9 text-center text-sm font-semibold border-b-2 bg-white/50 dark:bg-black/20 rounded-t-md transition-all focus:outline-none px-2',
                    showFeedback
                      ? isCorrectBlank
                        ? 'border-green-500 text-green-700 bg-green-50/50'
                        : 'border-red-500 text-red-700 bg-red-50/50'
                      : 'border-primary/30 focus:border-primary focus:bg-white'
                  )}
                />
                {showFeedback && !isCorrectBlank && (
                  <span className="text-[10px] font-bold text-green-600 mt-0.5 animate-in fade-in slide-in-from-top-1">
                    {correctAnswer}
                  </span>
                )}
              </span>
            );
          }
          return (
            <span key={pi} className="opacity-90">
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
