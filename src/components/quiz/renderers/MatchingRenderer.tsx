import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { RendererProps } from './types';
import { normalizePairs, parseMatchingValue } from './utils';

export const MatchingRenderer: React.FC<RendererProps> = ({
  question,
  value,
  onChange,
  disabled,
  showFeedback,
}) => {
  const [shuffledRightItems, setShuffledRightItems] = useState<string[]>([]);
  const pairsRecord = normalizePairs(question.matching_pairs ?? null);
  const leftItems = Object.keys(pairsRecord);
  const currentMatches = parseMatchingValue(value);
  const correctMatches = parseMatchingValue(question.correct_answer);

  // Detect 1:1 vs N:M based on correct answer pairs
  const isNtoM = Object.values(pairsRecord).some(v => v.includes(','));

  useEffect(() => {
    if (question.matching_pairs) {
      const allRightItems = Array.from(
        new Set(Object.values(pairsRecord).flatMap(r => r.split(',').map(v => v.trim()))),
      );
      // Shuffle right items once on mount
      setShuffledRightItems([...allRightItems].sort(() => Math.random() - 0.5));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id, question.matching_pairs]);

  // ── 1:1 handler (Select) ────────────────────────────────────────────────────
  const handleSelectMatch = (leftKey: string, rightVal: string) => {
    if (disabled || showFeedback) return;
    const newMatches = { ...currentMatches, [leftKey]: rightVal ? [rightVal] : [] };
    onChange(
      Object.entries(newMatches)
        .filter(([, rights]) => rights.length > 0)
        .map(([l, r]) => `${l}:${r.join(',')}`)
        .join('|||'),
    );
  };

  // ── N:M handler (Checkbox) ──────────────────────────────────────────────────
  const handleToggleMatch = (leftKey: string, rightVal: string) => {
    if (disabled || showFeedback) return;
    const existing = currentMatches[leftKey] || [];
    const next = existing.includes(rightVal)
      ? existing.filter(v => v !== rightVal)
      : [...existing, rightVal];
    const newMatches = { ...currentMatches, [leftKey]: next };
    onChange(
      Object.entries(newMatches)
        .filter(([, rights]) => rights.length > 0)
        .map(([l, r]) => `${l}:${r.join(',')}`)
        .join('|||'),
    );
  };

  if (leftItems.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground p-4 rounded-xl border border-dashed">
        <AlertCircle className="h-4 w-4 shrink-0" />
        Uyğunlaşdırma məlumatları tapılmadı.
      </div>
    );
  }

  // ── 1:1 Select layout ────────────────────────────────────────────────────────
  if (!isNtoM) {
    return (
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground italic">
          Hər bənd üçün uyğun gələn cavabı seçin
        </p>
        <div className="space-y-2">
          {leftItems.map((leftKey, i) => {
            const selected = (currentMatches[leftKey] || [])[0] || '';
            const correctRight = (correctMatches[leftKey] || [])[0] || '';
            const isCorrect = showFeedback && selected === correctRight;
            const isWrong = showFeedback && selected !== '' && selected !== correctRight;
            const isMissed = showFeedback && selected === '' && correctRight !== '';

            return (
              <div
                key={i}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-2xl border transition-all',
                  showFeedback
                    ? isCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                      : isWrong || isMissed
                        ? 'border-red-400 bg-red-50 dark:bg-red-900/10'
                        : 'border-border/40 bg-muted/20'
                    : 'border-border/40 bg-muted/20 hover:border-primary/30',
                )}
              >
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0">
                  {i + 1}
                </span>

                <span className="flex-1 text-sm font-medium">{leftKey}</span>

                <div className="shrink-0 w-44 sm:w-52">
                  <Select
                    value={selected}
                    onValueChange={val => handleSelectMatch(leftKey, val)}
                    disabled={disabled || showFeedback}
                  >
                    <SelectTrigger
                      className={cn(
                        'rounded-xl h-9 text-sm',
                        showFeedback && isCorrect && 'border-green-500 text-green-700',
                        showFeedback && (isWrong || isMissed) && 'border-red-400 text-red-700',
                      )}
                    >
                      <SelectValue placeholder="Seçin..." />
                    </SelectTrigger>
                    <SelectContent>
                      {shuffledRightItems.map(r => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {showFeedback && (
                  <div className="shrink-0">
                    {isCorrect ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="flex flex-col items-end gap-0.5">
                        <X className="h-4 w-4 text-red-500" />
                        {correctRight && (
                          <span className="text-[10px] text-red-600 font-bold whitespace-nowrap">
                            {correctRight}
                          </span>
                        )}
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
  }

  // ── N:M Checkbox layout ──────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <p className="text-xs text-muted-foreground italic">
        Hər bənd üçün uyğun gələn bütün variantları işarələyin
      </p>
      <div className="space-y-4">
        {leftItems.map((leftKey, i) => {
          const selectedRights = currentMatches[leftKey] || [];
          const correctRights = correctMatches[leftKey] || [];

          return (
            <div key={i} className="p-4 rounded-2xl border border-border/40 bg-muted/20 space-y-3">
              <div className="font-semibold text-sm flex items-start gap-2">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-[10px] shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {leftKey}
              </div>

              <div className="flex flex-wrap gap-2 pl-7">
                {shuffledRightItems.map((rVal, ri) => {
                  const isSelected = selectedRights.includes(rVal);
                  const isCorrect = correctRights.includes(rVal);

                  let statusClass = '';
                  if (showFeedback) {
                    if (isSelected && isCorrect)
                      statusClass = 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800';
                    else if (isSelected && !isCorrect)
                      statusClass = 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800';
                    else if (!isSelected && isCorrect)
                      statusClass = 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/10 dark:border-amber-800';
                  }

                  return (
                    <div
                      key={ri}
                      className={cn(
                        'flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer',
                        isSelected && !showFeedback ? 'bg-primary/5 border-primary/30' : 'border-transparent',
                        statusClass,
                      )}
                      onClick={() => handleToggleMatch(leftKey, rVal)}
                    >
                      <Checkbox
                        id={`${question.id}-match-${i}-${ri}`}
                        checked={isSelected}
                        onCheckedChange={() => handleToggleMatch(leftKey, rVal)}
                        disabled={disabled || showFeedback}
                        className={cn(showFeedback && isCorrect && !isSelected ? 'border-amber-500' : '')}
                      />
                      <Label
                        htmlFor={`${question.id}-match-${i}-${ri}`}
                        className="text-xs font-medium cursor-pointer leading-none"
                      >
                        {rVal}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
