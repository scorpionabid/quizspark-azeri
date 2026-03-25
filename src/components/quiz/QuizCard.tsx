import { BookOpen, Clock, Users, Star, Trophy, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FavoriteButton } from "./FavoriteButton";
import { Quiz } from "@/hooks/useQuizzes";

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

const subjectIcons: Record<string, string> = {
  'Riyaziyyat': '🔢',
  'Fizika': '⚡',
  'Kimya': '🧪',
  'Biologiya': '🧬',
  'Tarix': '📜',
  'Coğrafiya': '🌍',
  'Ədəbiyyat': '📚',
  'İngilis dili': '🇬🇧',
};

export function QuizCard({ quiz, questionCount, onPlay, onPreview, isGuest }: QuizCardProps) {
  const subjectIcon = subjectIcons[quiz.subject || ''] || '📖';

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
      "group relative overflow-hidden rounded-2xl bg-gradient-card border border-border/50 h-full flex flex-col",
      "card-hover animate-scale-in"
    )}>
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Favorite button & badges */}
      <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
        <FavoriteButton quizId={quiz.id} />
        {quiz.is_popular && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Trophy className="h-3 w-3" />
            Populyar
          </Badge>
        )}
        {quiz.is_new && (
          <Badge variant="accent" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Yeni
          </Badge>
        )}
        {status && (
          <Badge variant={status.variant} className="flex items-center gap-1 shadow-sm">
            {status.label}
          </Badge>
        )}
      </div>

      <div className="relative p-3 sm:p-5 flex flex-col flex-1">
        {/* Subject icon */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-xl shadow-inner">
            {subjectIcon}
          </div>
          <div className="flex items-center gap-1 text-warning bg-warning/10 px-2 py-0.5 rounded-full border border-warning/20">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="text-xs font-bold">{(quiz.rating || 0).toFixed(1)}</span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="mb-2 font-display text-base sm:text-lg font-bold text-foreground line-clamp-2 min-h-[3rem]">
          {quiz.title}
        </h3>
        <p className="mb-4 text-xs sm:text-sm text-muted-foreground line-clamp-2 flex-1">
          {quiz.description || 'Bu quiz üçün təsvir əlavə edilməyib.'}
        </p>

        {status && status.date && (
          <div className={cn(
            "mb-4 rounded-lg px-3 py-2 text-[10px] font-medium flex items-center gap-2",
            status.variant === 'warning' ? "bg-warning/10 text-warning border border-warning/20" : "bg-destructive/10 text-destructive border border-destructive/20"
          )}>
            <Clock className="h-3 w-3" />
            {status.variant === 'warning' ? 'Başlayır: ' : 'Bitib: '}
            {status.date.toLocaleString('az-AZ', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}

        {/* Meta info */}
        <div className="mb-4 flex flex-wrap gap-2">
          {quiz.subject && (
            <Badge variant="outline" className="text-[10px] py-0">
              {quiz.subject}
            </Badge>
          )}
          {quiz.grade && (
            <Badge variant="muted" className="text-[10px] py-0">
              {quiz.grade}
            </Badge>
          )}
          {quiz.difficulty && (
            <Badge variant={quiz.difficulty} className="text-[10px] py-0">
              {difficultyLabels[quiz.difficulty]}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="mb-5 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/30 pt-4">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{questionCount ?? 0} sual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{quiz.duration} dəq</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>{(quiz.play_count || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          {isGuest ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl h-10"
                onClick={() => onPreview?.(quiz)}
              >
                Baxış
              </Button>
              <Button
                variant="game"
                size="sm"
                className="flex-1 rounded-xl h-10 shadow-sm"
                onClick={() => onPlay(quiz)}
              >
                Başla
              </Button>
            </>
          ) : (
            <Button
              variant="game"
              className="w-full rounded-xl h-11 shadow-md hover:shadow-lg transition-all"
              onClick={() => onPlay(quiz)}
            >
              Quizə Başla
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
