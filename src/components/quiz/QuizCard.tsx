import { BookOpen, Clock, Users, Star, Trophy, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FavoriteButton } from "./FavoriteButton";
import { Quiz } from "@/hooks/useQuizzes";
import { getSubjectIcon } from "@/lib/constants/subjects";

interface QuizCardProps {
  quiz: Quiz;
  questionCount?: number;
  onPlay: (quiz: Quiz) => void;
  onPreview?: (quiz: Quiz) => void;
  isGuest?: boolean;
}

const difficultyLabels = {
  easy: 'Asan',
  medium: 'Orta',
  hard: 'Çətin',
};

export function QuizCard({ quiz, questionCount, onPlay, onPreview, isGuest }: QuizCardProps) {
  const subjectIcon = getSubjectIcon(quiz.subject);

  const getStatus = () => {
    if (!quiz.available_from && !quiz.available_to) return null;
    const now = new Date();
    const from = quiz.available_from ? new Date(quiz.available_from) : null;
    const to = quiz.available_to ? new Date(quiz.available_to) : null;

    if (from && now < from) return { label: 'Tezliklə', variant: 'warning' as const, date: from };
    if (to && now > to) return { label: 'Bitib', variant: 'destructive' as const, date: to };
    if (from || to) return { label: 'Canlı', variant: 'success' as const };
    return null;
  };

  const status = getStatus();

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl bg-gradient-card border border-border/50 h-full flex flex-col min-w-0 w-full",
      "card-hover animate-scale-in shadow-sm"
    )}>
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

      <div className="relative p-3.5 sm:p-5 flex flex-col flex-1 min-w-0">
        {/* Top Header: Subject Icon (Left) & Badges + Rating + Favorite (Right) */}
        <div className="mb-3.5 flex items-start justify-between gap-2 min-w-0">
          {/* Subject icon */}
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-muted text-xl shadow-inner shrink-0">
            {subjectIcon}
          </div>

          {/* Badges, Rating & Favorite button in one unified flex container */}
          <div className="flex items-center justify-end flex-wrap gap-1.5 min-w-0">
            {quiz.is_new && (
              <Badge variant="accent" className="flex items-center gap-1 text-[9px] sm:text-[10px] px-1.5 py-0.5 shrink-0">
                <Zap className="h-2.5 w-2.5" />
                Yeni
              </Badge>
            )}
            {quiz.is_popular && (
              <Badge variant="secondary" className="flex items-center gap-1 text-[9px] sm:text-[10px] px-1.5 py-0.5 shrink-0">
                <Trophy className="h-2.5 w-2.5" />
                Populyar
              </Badge>
            )}
            {status && (
              <Badge variant={status.variant} className="flex items-center gap-1 text-[9px] sm:text-[10px] px-1.5 py-0.5 shadow-sm shrink-0">
                {status.label}
              </Badge>
            )}

            <div className="flex items-center gap-1 text-warning bg-warning/10 px-2 py-0.5 rounded-full border border-warning/20 shrink-0">
              <Star className="h-3 w-3 fill-current" />
              <span className="text-[11px] font-bold">{(quiz.rating || 0).toFixed(1)}</span>
            </div>

            <FavoriteButton quizId={quiz.id} />
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="mb-1.5 font-display text-sm sm:text-base font-bold text-foreground line-clamp-2 min-h-[2.5rem] break-words">
          {quiz.title}
        </h3>
        <p className="mb-3 text-xs text-muted-foreground line-clamp-2 flex-1 break-words leading-relaxed">
          {quiz.description || 'Bu quiz üçün təsvir əlavə edilməyib.'}
        </p>

        {status && status.date && (
          <div className={cn(
            "mb-3 rounded-lg px-2.5 py-1.5 text-[10px] font-medium flex items-center gap-1.5",
            status.variant === 'warning' ? "bg-warning/10 text-warning border border-warning/20" : "bg-destructive/10 text-destructive border border-destructive/20"
          )}>
            <Clock className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {status.variant === 'warning' ? 'Başlayır: ' : 'Bitib: '}
              {status.date.toLocaleString('az-AZ', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        )}

        {/* Meta info */}
        <div className="mb-3.5 flex flex-wrap gap-1.5">
          {quiz.subject && (
            <Badge variant="outline" className="text-[10px] py-0 px-1.5">
              {quiz.subject}
            </Badge>
          )}
          {quiz.grade && (
            <Badge variant="muted" className="text-[10px] py-0 px-1.5">
              {quiz.grade}
            </Badge>
          )}
          {quiz.difficulty && (
            <Badge variant={quiz.difficulty} className="text-[10px] py-0 px-1.5">
              {difficultyLabels[quiz.difficulty]}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="mb-4 flex items-center justify-between text-[10px] sm:text-[11px] text-muted-foreground border-t border-border/30 pt-3">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3 shrink-0" />
            <span>{quiz.question_count ?? questionCount ?? 0} sual</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 shrink-0" />
            <span>{quiz.duration} dəq</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 shrink-0" />
            <span>{(quiz.play_count || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto w-full">
          {onPreview && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-xl h-9 sm:h-10 text-xs sm:text-sm font-semibold"
              onClick={() => onPreview(quiz)}
            >
              Baxış
            </Button>
          )}
          <Button
            variant="game"
            size="sm"
            className="flex-1 rounded-xl h-9 sm:h-10 text-xs sm:text-sm font-bold shadow-sm"
            onClick={() => onPlay(quiz)}
          >
            {isGuest ? 'Başla' : 'Quizə Başla'}
          </Button>
        </div>
      </div>
    </div>
  );
}
