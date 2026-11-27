import React from 'react';
import { CareerStage } from '@/types/career';
import { STAGE_META } from '@/services/careerEngine';
import { CheckCircle2, Circle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CareerProgressBarProps {
  currentStage: CareerStage;
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredCount: number;
}

export const CareerProgressBar: React.FC<CareerProgressBarProps> = ({
  currentStage,
  currentQuestionIndex,
  totalQuestions,
  answeredCount,
}) => {
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="w-full bg-card/80 backdrop-blur-md border rounded-2xl p-4 shadow-sm mb-6">
      {/* Top stage indicators */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
        {([1, 2, 3] as CareerStage[]).map((stg) => {
          const isDone = currentStage > stg;
          const isCurrent = currentStage === stg;
          const meta = STAGE_META[stg];

          return (
            <div
              key={stg}
              className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-primary/10 border-primary/40 text-primary font-medium shadow-sm'
                  : isDone
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-muted/40 border-transparent text-muted-foreground'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center font-bold text-xs">
                    {stg}
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground/40" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground hidden sm:block">
                  {meta.badge}
                </p>
                <p className="text-xs sm:text-sm font-semibold truncate">{meta.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress bar and counter */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5 font-medium">
        <span>
          Sual {currentQuestionIndex + 1} / {totalQuestions}
        </span>
        <span className="text-primary font-bold">{progressPercent}% tamamlandı</span>
      </div>
      <Progress value={progressPercent} className="h-2.5 rounded-full" />
    </div>
  );
};
