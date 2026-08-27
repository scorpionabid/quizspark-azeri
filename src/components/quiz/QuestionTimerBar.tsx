import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionTimerBarProps {
  timeLeft: number;
  totalTime: number;
  className?: string;
}

export function QuestionTimerBar({
  timeLeft,
  totalTime,
  className,
}: QuestionTimerBarProps) {
  if (!totalTime || totalTime <= 0) return null;

  const percentage = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100));
  const isUrgent = percentage <= 20;
  const isWarning = percentage <= 50 && !isUrgent;

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-1.5">
          {isUrgent ? (
            <AlertTriangle className="h-3.5 w-3.5 text-destructive animate-bounce" />
          ) : (
            <Clock className="h-3.5 w-3.5 text-primary" />
          )}
          <span className={cn(
            "transition-colors",
            isUrgent ? "text-destructive font-bold" : isWarning ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
          )}>
            Sual Vaxtı:
          </span>
        </div>

        <span className={cn(
          "font-mono text-xs px-2 py-0.5 rounded-md transition-colors",
          isUrgent
            ? "bg-destructive/10 text-destructive font-bold animate-pulse"
            : isWarning
            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium"
            : "bg-muted text-foreground"
        )}>
          {timeLeft} san
        </span>
      </div>

      {/* Progress Track */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
        <motion.div
          className={cn(
            "h-full rounded-full transition-colors duration-300",
            isUrgent
              ? "bg-destructive"
              : isWarning
              ? "bg-amber-500"
              : "bg-primary"
          )}
          initial={{ width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "linear" }}
        />
      </div>
    </div>
  );
}
