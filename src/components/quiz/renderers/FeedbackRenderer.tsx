import React from 'react';
import { cn } from '@/lib/utils';
import { Question } from '@/hooks/useQuestions';
import { isAnswerCorrect } from './utils';

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
        {question.explanation && (
          <div className="text-sm mt-3 bg-background/40 p-3 rounded-lg border border-border/20">
            <strong className="block mb-1 uppercase text-[10px] font-black tracking-widest opacity-70">Açıqlama</strong>
            {question.explanation}
          </div>
        )}
      </div>
    );
  }

  const correct = isAnswerCorrect(question, value);

  return (
    <div
      className={cn(
        'p-4 mt-4 rounded-xl border transition-all duration-300 animate-scale-in',
        correct
          ? 'bg-success/10 border-success/30 text-success'
          : 'bg-destructive/10 border-destructive/30 text-destructive',
      )}
    >
      <h4 className="font-black mb-2 flex items-center gap-2">
        {correct ? (
          <>
            <span>✅</span> Doğru!
          </>
        ) : (
          <>
            <span>❌</span> Yanlış!
          </>
        )}
      </h4>

      {!correct && (
        <div className="text-sm mt-1 opacity-80 font-medium">
          {question.question_type === 'fill_blank' && (
            <span>
              Düzgün cavab:{' '}
              <span className="font-mono">
                {question.correct_answer.split('|').join(' / ')}
              </span>
            </span>
          )}
          {question.question_type === 'numerical' && (
            <span>
              Düzgün cavab:{' '}
              <span className="font-mono">
                {question.numerical_answer ?? question.correct_answer}
                {(question.numerical_tolerance ?? 0) > 0 &&
                  ` (±${question.numerical_tolerance})`}
              </span>
            </span>
          )}
          {question.question_type === 'ordering' && (
            <div className="mt-1">
              <span className="text-xs uppercase tracking-wide opacity-60 block mb-1">
                Düzgün ardıcıllıq:
              </span>
              {(question.sequence_items ?? []).map((item, i) => (
                <div key={i} className="text-xs font-mono">
                  {i + 1}. {item}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {question.explanation && (
        <div className="text-sm mt-2 opacity-90 leading-relaxed bg-background/40 p-3 rounded-lg border border-border/20">
          <strong className="block mb-1 uppercase text-[10px] font-black tracking-widest opacity-70">
            Açıqlama
          </strong>
          {question.explanation}
        </div>
      )}

      {question.per_option_explanations &&
        value &&
        Array.isArray(question.options) && (
          <div className="text-sm mt-3 p-3 rounded-lg bg-background/20 font-medium">
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
