import React, { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { RendererProps } from './types';
import { cn } from '@/lib/utils';
import { isAnswerCorrect, parseNumberedItems, isSequenceQuestion } from './utils';
import { Check, X, Hash, RotateCcw, CheckSquare, ListOrdered } from 'lucide-react';
import { MathRenderer } from '@/components/common/MathRenderer';

export const NumericalRenderer: React.FC<RendererProps> = ({
  question,
  value,
  onChange,
  disabled,
  showFeedback,
}) => {
  const isCorrect = showFeedback && isAnswerCorrect(question, value);

  // Check if question contains structured numbered items (e.g. 1. ... 2. ... 3. ...)
  const parsedNumbered = useMemo(
    () => parseNumberedItems(question.question_text),
    [question.question_text]
  );
  const isSeq = useMemo(
    () => isSequenceQuestion(question.question_text),
    [question.question_text]
  );

  // If question has numbered items, render interactive items with checkboxes/order badges
  if (parsedNumbered && parsedNumbered.items.length >= 2) {
    const rawVal = String(value || '').replace(/\D/g, '');
    const selectedDigits = rawVal.split('').map(Number);

    const toggleSelectionItem = (num: number) => {
      if (disabled || showFeedback) return;
      let nextDigits: number[];
      if (selectedDigits.includes(num)) {
        nextDigits = selectedDigits.filter(d => d !== num);
      } else {
        nextDigits = [...selectedDigits, num];
      }
      nextDigits.sort((a, b) => a - b);
      onChange(nextDigits.join(''));
    };

    const toggleSequenceItem = (num: number) => {
      if (disabled || showFeedback) return;
      let nextDigits: number[];
      if (selectedDigits.includes(num)) {
        nextDigits = selectedDigits.filter(d => d !== num);
      } else {
        nextDigits = [...selectedDigits, num];
      }
      onChange(nextDigits.join(''));
    };

    // Correct answer digits for feedback
    const correctDigits = String(question.correct_answer || question.numerical_answer || '')
      .replace(/\D/g, '')
      .split('')
      .map(Number);

    return (
      <div className="space-y-4">
        {/* Interactive Numbered Items List */}
        <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
          {parsedNumbered.items.map((item) => {
            const isSelected = selectedDigits.includes(item.num);
            const seqOrderIndex = isSeq ? selectedDigits.indexOf(item.num) : -1;

            // Feedback states
            const isItemCorrectSelected = showFeedback && isSelected && correctDigits.includes(item.num);
            const isItemWrongSelected = showFeedback && isSelected && !correctDigits.includes(item.num);
            const isItemMissed = showFeedback && !isSelected && correctDigits.includes(item.num);

            return (
              <div
                key={item.num}
                onClick={() => (isSeq ? toggleSequenceItem(item.num) : toggleSelectionItem(item.num))}
                className={cn(
                  "flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-200 select-none",
                  !disabled && !showFeedback && "cursor-pointer hover:border-primary/50 hover:bg-muted/40 active:scale-[0.995]",
                  isSelected
                    ? "border-primary bg-primary/5 text-foreground shadow-sm ring-1 ring-primary/30 dark:bg-primary/10"
                    : "border-border/70 bg-card text-foreground/90",
                  // Feedback styling
                  showFeedback && isItemCorrectSelected && "border-green-500 bg-green-50/70 dark:bg-green-950/30 text-green-900 dark:text-green-100 ring-1 ring-green-500",
                  showFeedback && isItemWrongSelected && "border-red-500 bg-red-50/70 dark:bg-red-950/30 text-red-900 dark:text-red-100 ring-1 ring-red-500",
                  showFeedback && isItemMissed && "border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 border-dashed ring-1 ring-amber-400/50",
                  (disabled || showFeedback) && "cursor-default"
                )}
              >
                {/* Checkbox or Sequence Order Badge */}
                <div className="flex items-center gap-2 pt-0.5 shrink-0">
                  {isSeq ? (
                    <span
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors",
                        seqOrderIndex !== -1
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "border-2 border-muted-foreground/30 text-muted-foreground"
                      )}
                    >
                      {seqOrderIndex !== -1 ? seqOrderIndex + 1 : `${item.num}`}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelectionItem(item.num)}
                        disabled={disabled || showFeedback}
                        className={cn(
                          "h-5 w-5 rounded-md border-2",
                          isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
                        )}
                      />
                      <span className="font-bold text-sm text-foreground/80 font-mono w-4">
                        {item.num}.
                      </span>
                    </div>
                  )}
                </div>

                {/* Item Text */}
                <div className="flex-1 text-sm sm:text-base leading-relaxed break-words pt-0.5">
                  <MathRenderer text={item.text} />
                </div>

                {/* Feedback Indicator */}
                {showFeedback && (
                  <div className="shrink-0 self-center pl-2">
                    {isItemCorrectSelected && (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </span>
                    )}
                    {isItemWrongSelected && (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300">
                        <X className="w-4 h-4 stroke-[2.5]" />
                      </span>
                    )}
                    {isItemMissed && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                        Düzgün bənd
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selection Status & Reset Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-3.5 bg-muted/40 rounded-xl sm:rounded-2xl border border-border/50">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap">
            <span className="font-medium flex items-center gap-1.5 text-foreground">
              {isSeq ? <ListOrdered className="w-4 h-4 text-primary" /> : <CheckSquare className="w-4 h-4 text-primary" />}
              <span>{isSeq ? "Müəyyən edilmiş ardıcıllıq:" : "Seçilmiş bəndlər:"}</span>
            </span>
            {selectedDigits.length > 0 ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedDigits.map((num, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center justify-center min-w-[26px] h-[26px] px-1.5 rounded-lg bg-primary/15 text-primary font-bold font-mono text-xs sm:text-sm border border-primary/25 shadow-2xs"
                  >
                    {num}
                  </span>
                ))}
              </div>
            ) : (
              <span className="italic text-xs text-muted-foreground/70">
                (heç biri seçilməyib — bəndlərə toxunaraq seçin)
              </span>
            )}
          </div>

          {!disabled && !showFeedback && selectedDigits.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange('')}
              className="text-xs text-muted-foreground hover:text-destructive h-7 px-2.5 gap-1 rounded-lg"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sıfırla</span>
            </Button>
          )}
        </div>

        {/* Feedback Correct Answer Display if incorrect */}
        {showFeedback && !isCorrect && (
          <div className="flex items-center justify-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 text-sm font-bold text-green-700 dark:text-green-400">
            <Hash className="w-4 h-4" />
            <span>
              Düzgün Cavab: {correctDigits.join(isSeq ? ' ➔ ' : ', ')}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Fallback: Standard numerical calculation input
  return (
    <div className="space-y-4">
      <div className="relative max-w-xs mx-auto flex items-center justify-center">
        <Input
          type="text"
          inputMode="decimal"
          className={cn(
            "h-14 sm:h-16 text-xl sm:text-2xl font-bold text-center border-2 border-primary/20 focus:border-primary rounded-2xl shadow-sm transition-all pr-10",
            showFeedback && (isCorrect ? "border-green-500 bg-green-50/50 text-green-700" : "border-red-400 bg-red-50/50 text-red-700")
          )}
          disabled={disabled || showFeedback}
          placeholder="Cavabınızı yazın..."
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        {showFeedback && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {isCorrect ? (
              <Check className="h-6 w-6 text-green-600" />
            ) : (
              <X className="h-6 w-6 text-red-600" />
            )}
          </div>
        )}
      </div>

      {(question.numerical_tolerance != null && question.numerical_tolerance > 0 || showFeedback) && (
        <div className="flex flex-col items-center gap-1">
          {showFeedback && !isCorrect && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-200 text-sm font-bold text-green-700 dark:text-green-400 mb-2">
              <Hash className="w-4 h-4" />
              <span>Düzgün Cavab: {question.numerical_answer || question.correct_answer}</span>
            </div>
          )}
          {question.numerical_tolerance != null && question.numerical_tolerance > 0 && (
            <p className="text-xs text-center text-muted-foreground bg-muted/30 px-3 py-1 rounded-full border">
              ±{question.numerical_tolerance} tolerans (xəta payı) daxilində qəbul edilir
            </p>
          )}
        </div>
      )}
    </div>
  );
};
