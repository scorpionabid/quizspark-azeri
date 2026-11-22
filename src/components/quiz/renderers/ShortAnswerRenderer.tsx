import React, { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RendererProps } from './types';
import { cn } from '@/lib/utils';
import { Check, X, Sparkles, Info, RotateCcw } from 'lucide-react';
import {
  isAnswerCorrect,
  getPrimaryCorrectAnswer,
  getSmartOpenQuestionHint,
  isSequenceQuestion,
} from './utils';

export const ShortAnswerRenderer: React.FC<RendererProps> = ({
  question,
  value,
  onChange,
  disabled,
  showFeedback,
  placeholder,
}) => {
  const isCorrect = showFeedback && isAnswerCorrect(question, value);
  const primaryAnswer = useMemo(
    () => getPrimaryCorrectAnswer(question.correct_answer),
    [question.correct_answer],
  );
  const smartGuide = useMemo(
    () => getSmartOpenQuestionHint(question),
    [question],
  );
  const isSeq = useMemo(
    () => isSequenceQuestion(question.question_text),
    [question.question_text],
  );

  // Detect if question is a numbered selection / sequence question to offer optional quick-click number chips
  const quickNumberChips = useMemo((): string[] => {
    if (
      smartGuide.badge !== 'Açıq Seçim Sualı' &&
      smartGuide.badge !== 'Açıq Ardıcıllıq Sualı'
    ) {
      return [];
    }
    const text = question.question_text || '';
    const usesRoman =
      /\b(I|II|III|IV|V|VI|VII|VIII)\b/.test(primaryAnswer) ||
      /(?:^|\n)\s*I[.)]\s+/m.test(text);
    if (usesRoman) {
      const romanMatches = text.match(/\b(I|II|III|IV|V|VI|VII|VIII)\b/g) || [];
      const order = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
      const maxIdx = Math.max(
        3,
        ...romanMatches.map(r => order.indexOf(r)),
      );
      return order.slice(0, Math.min(8, maxIdx + 1));
    }
    const numMatches = text.match(/(?:^|\n|\s)([1-8])\s*[.)]/g) || [];
    const nums = numMatches
      .map(m => parseInt(m.replace(/\D/g, ''), 10))
      .filter(n => n >= 1 && n <= 8);
    const maxNum = nums.length >= 2 ? Math.max(...nums) : 6;
    return Array.from({ length: Math.min(8, Math.max(4, maxNum)) }, (_, i) =>
      String(i + 1),
    );
  }, [smartGuide.badge, question.question_text, primaryAnswer]);

  const currentTokens = useMemo(() => {
    if (!value) return [];
    const cleaned = value
      .replace(/\b(və|ve|yalnız|yalniz|cümlə|cumle)\b/gi, ',')
      .trim();
    if (/^\d{2,6}$/.test(cleaned)) {
      return cleaned.split('');
    }
    return cleaned
      .split(/[\s,;-]+/)
      .map(t => t.trim().toUpperCase())
      .filter(Boolean);
  }, [value]);

  const handleToggleChip = (chip: string) => {
    if (disabled || showFeedback) return;
    const upperChip = chip.toUpperCase();
    let next: string[];
    if (currentTokens.includes(upperChip)) {
      next = currentTokens.filter(t => t !== upperChip);
    } else {
      next = [...currentTokens, upperChip];
    }
    if (!isSeq && next.every(x => /^\d+$/.test(x))) {
      next.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    }
    onChange(next.join(', '));
  };

  return (
    <div className="space-y-3 max-w-xl">
      {/* Helpful Student Guidance Banner */}
      <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-primary/5 border border-primary/15 text-xs sm:text-sm text-muted-foreground">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-primary inline-flex items-center gap-1 mr-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {smartGuide.badge}:
          </span>
          <span>{smartGuide.hint}</span>
        </div>
      </div>

      {/* Optional Quick-Click Chips for Selection / Sequence Questions */}
      {quickNumberChips.length > 0 && !showFeedback && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground">
            Sürətli seçim:
          </span>
          {quickNumberChips.map(chip => {
            const isSelected = currentTokens.includes(chip.toUpperCase());
            return (
              <button
                key={chip}
                type="button"
                disabled={disabled}
                onClick={() => handleToggleChip(chip)}
                className={cn(
                  'min-w-[36px] h-9 px-2.5 rounded-xl font-bold text-xs sm:text-sm border transition-all select-none',
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-105'
                    : 'bg-card hover:bg-muted/60 text-foreground border-border/80',
                )}
              >
                {chip}
              </button>
            );
          })}
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange('')}
              className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Təmizlə
            </Button>
          )}
        </div>
      )}

      {/* Main Answer Input */}
      <div className="relative">
        <Input
          className={cn(
            'h-14 border-2 rounded-2xl px-4 text-base sm:text-lg font-semibold transition-all shadow-sm pr-11',
            showFeedback
              ? isCorrect
                ? 'border-green-500 bg-green-50/50 text-green-700 dark:bg-green-950/30 dark:text-green-300'
                : 'border-red-400 bg-red-50/50 text-red-700 dark:bg-red-950/30 dark:text-red-300'
              : 'border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/10',
          )}
          disabled={disabled || showFeedback}
          placeholder={placeholder || smartGuide.placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        {showFeedback && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {isCorrect ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <X className="h-5 w-5 text-red-600" />
            )}
          </div>
        )}
      </div>

      {showFeedback && !isCorrect && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-xs sm:text-sm">
          <Check className="w-4 h-4 text-green-600 shrink-0" />
          <span className="font-bold text-green-700 dark:text-green-400">
            Düzgün cavab:
          </span>
          <span className="font-semibold text-foreground">{primaryAnswer}</span>
        </div>
      )}
    </div>
  );
};
