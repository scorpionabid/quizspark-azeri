import React from 'react';
import { cn } from '@/lib/utils';
import { Question } from '@/hooks/useQuestions';
import { isAnswerCorrect, normalizePairs } from './utils';
import { MathRenderer } from '@/components/common/MathRenderer';

interface FeedbackRendererProps {
  question: Question;
  value: string;
}

export const FeedbackRenderer: React.FC<FeedbackRendererProps> = ({
  question,
  value,
}) => {
  // Essay və kod sualları avtomatik qiymətləndirilə bilməz
  if (question.question_type === 'essay' || question.question_type === 'code') {
    return (
      <div className="p-4 mt-4 rounded-xl border border-muted-foreground/30 bg-muted/30 text-muted-foreground animate-scale-in">
        <h4 className="font-black mb-1 flex items-center gap-2">
          <span>📋</span> Cavabınız alındı
        </h4>
        <p className="text-sm opacity-80">
          {question.question_type === 'code' ? 'Kod sualları müəllim tərəfindən yoxlanılacaq.' : 'Esse sualları müəllim tərəfindən yoxlanılacaq.'}
        </p>
        {question.explanation && question.explanation.trim().length > 1 && question.explanation.trim() !== ':' && (
          <div className="text-sm mt-3 bg-background/40 p-3 rounded-lg border border-border/20">
            <strong className="block mb-1 uppercase text-[10px] font-black tracking-widest opacity-70">Açıqlama</strong>
            <MathRenderer text={question.explanation} />
          </div>
        )}
      </div>
    );
  }

  const correct = isAnswerCorrect(question, value);

  const getFormattedCorrectAnswer = () => {
    if (!question.correct_answer) return null;
    if (['multiple_choice', 'single_choice', 'true_false'].includes(question.question_type)) {
      const ca = question.correct_answer;
      if (ca.length === 1 && /^[A-Z]$/i.test(ca) && question.options) {
        const idx = ca.toUpperCase().charCodeAt(0) - 65;
        if (question.options[idx]) {
          return `${ca.toUpperCase()}) ${question.options[idx]}`;
        }
      }
      return ca;
    }
    return null;
  };

  return (
    <div
      className={cn(
        'p-4 mt-4 rounded-2xl border transition-all duration-300 animate-scale-in',
        correct
          ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300'
          : 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300',
      )}
    >
      <h4 className="font-bold text-base mb-2 flex items-center gap-2">
        {correct ? (
          <>
            <span className="text-xl">✅</span> Doğru cavab!
          </>
        ) : (
          <>
            <span className="text-xl">❌</span> Yanlış cavab!
          </>
        )}
      </h4>

      {!correct && (
        <div className="text-sm mt-2 opacity-95 font-medium space-y-2">
          {['multiple_choice', 'single_choice', 'true_false'].includes(question.question_type) && (
            <div className="flex items-center gap-2 flex-wrap bg-background/60 dark:bg-background/30 p-2.5 rounded-xl border border-border/30">
              <span className="font-bold text-foreground">Düzgün cavab:</span>
              <span className="font-semibold text-primary">
                <MathRenderer text={getFormattedCorrectAnswer() || question.correct_answer} />
              </span>
            </div>
          )}
          {question.question_type === 'multiple_select' && (
            <div className="flex items-center gap-2 flex-wrap bg-background/60 dark:bg-background/30 p-2.5 rounded-xl border border-border/30">
              <span className="font-bold text-foreground">Düzgün cavablar:</span>
              <span className="font-semibold text-primary">
                <MathRenderer text={question.correct_answer} />
              </span>
            </div>
          )}
          {question.question_type === 'fill_blank' && (
            <div className="flex items-center gap-2 flex-wrap bg-background/60 dark:bg-background/30 p-2.5 rounded-xl border border-border/30">
              <span className="font-bold text-foreground">Düzgün cavab:</span>
              <span className="font-mono font-semibold text-primary">
                <MathRenderer text={question.correct_answer.split('|').join(' / ')} />
              </span>
            </div>
          )}
          {question.question_type === 'numerical' && (
            <div className="flex items-center gap-2 flex-wrap bg-background/60 dark:bg-background/30 p-2.5 rounded-xl border border-border/30">
              <span className="font-bold text-foreground">Düzgün cavab:</span>
              <span className="font-mono font-semibold text-primary">
                <MathRenderer text={String(question.numerical_answer ?? question.correct_answer)} />
                {(question.numerical_tolerance ?? 0) > 0 &&
                  ` (±${question.numerical_tolerance})`}
              </span>
            </div>
          )}
          {question.question_type === 'ordering' && (
            <div className="bg-background/60 dark:bg-background/30 p-2.5 rounded-xl border border-border/30">
              <span className="text-xs uppercase tracking-wide opacity-80 block mb-1.5 font-bold text-foreground">
                Düzgün ardıcıllıq:
              </span>
              <div className="space-y-1">
                {(question.sequence_items ?? []).map((item, i) => (
                  <div key={i} className="text-xs font-mono flex items-center gap-2 text-foreground">
                    <span className="w-5 h-5 rounded-full bg-primary/15 text-primary font-bold inline-flex items-center justify-center text-[10px] shrink-0">
                      {i + 1}
                    </span>
                    <MathRenderer text={item} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {question.question_type === 'matching' && (
            <div className="bg-background/60 dark:bg-background/30 p-3 rounded-xl border border-border/30 space-y-2">
              <span className="text-xs uppercase tracking-wide opacity-80 block font-bold text-foreground">
                Düzgün uyğunluqlar:
              </span>
              <div className="space-y-1.5">
                {Object.entries(normalizePairs(question.matching_pairs ?? null)).map(([left, right], i) => (
                  <div key={i} className="text-xs flex items-center gap-2 flex-wrap text-foreground">
                    <span className="font-semibold text-primary">{left}</span>
                    <span className="text-muted-foreground font-bold">→</span>
                    <span className="font-medium bg-background/80 dark:bg-background/50 px-2 py-0.5 rounded-md border border-border/40 text-foreground">
                      <MathRenderer text={right} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {question.explanation && question.explanation.trim().length > 1 && question.explanation.trim() !== ':' && (
        <div className="mt-3 text-sm leading-relaxed bg-background/70 dark:bg-background/40 p-3.5 rounded-xl border border-border/40 text-foreground shadow-sm">
          <div className="flex items-center gap-1.5 mb-1.5 text-primary font-bold text-xs uppercase tracking-wider">
            <span>💡</span>
            <span>İzah və Həlli:</span>
          </div>
          <div className="whitespace-pre-line leading-relaxed text-foreground/90">
            <MathRenderer text={question.explanation} />
          </div>
        </div>
      )}

      {question.per_option_explanations &&
        value &&
        Array.isArray(question.options) && (
          <div className="text-sm mt-3 p-3 rounded-lg bg-background/20 font-medium text-foreground">
            {
              question.per_option_explanations[
                question.options.indexOf(value)?.toString()
              ]
            }
          </div>
        )}
    </div>
  );
};
