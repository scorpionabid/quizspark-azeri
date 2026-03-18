import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

  useEffect(() => {
    if (question.matching_pairs) {
      setShuffledRightItems(
        [...Object.values(pairsRecord)].sort(() => Math.random() - 0.5),
      );
    }
  }, [question.id, question.matching_pairs]);

  const handleMatchSelect = (leftKey: string, rightVal: string) => {
    if (disabled || showFeedback) return;
    const newMatches = { ...currentMatches, [leftKey]: rightVal };
    onChange(
      Object.entries(newMatches)
        .map(([l, r]) => `${l}:${r}`)
        .join('|||'),
    );
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground italic">
        Sol tərəfdəki hər element üçün uyğun seçimi tapın
      </p>
      {leftItems.map((leftKey, i) => {
        const selectedRight = currentMatches[leftKey];
        const isCorrectMatch = showFeedback && pairsRecord[leftKey] === selectedRight;
        return (
          <div key={i} className="flex items-center gap-3">
            <div
              className={cn(
                'flex-1 min-w-0 text-sm py-2 px-3 rounded-xl border font-medium',
                showFeedback && selectedRight
                  ? isCorrectMatch
                    ? 'bg-green-50/60 border-green-300 dark:bg-green-950/20 dark:border-green-700'
                    : 'bg-red-50/60 border-red-300 dark:bg-red-950/20 dark:border-red-700'
                  : 'bg-muted/40 border-border/50',
              )}
            >
              {leftKey}
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
            <Select
              value={selectedRight || ''}
              onValueChange={val => handleMatchSelect(leftKey, val)}
              disabled={disabled || showFeedback}
            >
              <SelectTrigger
                className={cn(
                  'flex-1 min-w-0',
                  showFeedback && selectedRight
                    ? isCorrectMatch
                      ? 'border-green-400'
                      : 'border-red-400'
                    : '',
                )}
              >
                <SelectValue placeholder="Seçin..." />
              </SelectTrigger>
              <SelectContent>
                {shuffledRightItems.map((rVal, ri) => (
                  <SelectItem key={ri} value={rVal}>
                    {rVal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      })}
    </div>
  );
};
