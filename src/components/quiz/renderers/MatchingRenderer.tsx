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

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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

  useEffect(() => {
    if (question.matching_pairs) {
      // Get all unique right items from the pairs (or from values if it's one-to-many)
      const allRightItems = Array.from(
        new Set(Object.values(pairsRecord).flatMap(r => r.split(',').map(v => v.trim()))),
      ).sort();
      setShuffledRightItems(allRightItems);
    }
  }, [question.id, question.matching_pairs]);

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
                  
                  let statusClass = "";
                  if (showFeedback) {
                    if (isSelected && isCorrect) statusClass = "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800";
                    else if (isSelected && !isCorrect) statusClass = "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800";
                    else if (!isSelected && isCorrect) statusClass = "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/10 dark:border-amber-800";
                  }

                  return (
                    <div 
                      key={ri} 
                      className={cn(
                        "flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer",
                        isSelected && !showFeedback ? "bg-primary/5 border-primary/30" : "border-transparent",
                        statusClass
                      )}
                      onClick={() => handleToggleMatch(leftKey, rVal)}
                    >
                      <Checkbox
                        id={`${question.id}-match-${i}-${ri}`}
                        checked={isSelected}
                        onCheckedChange={() => handleToggleMatch(leftKey, rVal)}
                        disabled={disabled || showFeedback}
                        className={cn(
                          showFeedback && isCorrect && !isSelected ? "border-amber-500" : ""
                        )}
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

