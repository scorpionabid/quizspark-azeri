import { BookOpen, Clock, Users, Star, Trophy, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FavoriteButton } from "./FavoriteButton";

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  duration: number;
  playCount: number;
  rating: number;
  imageUrl?: string;
  isPopular?: boolean;
  isNew?: boolean;
}

interface QuizCardProps {
  quiz: Quiz;
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

export function QuizCard({ quiz, onPlay, onPreview, isGuest }: QuizCardProps) {
  const subjectIcon = subjectIcons[quiz.subject] || '📖';

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl bg-gradient-card border border-border/50",
      "card-hover animate-scale-in"
    )}>
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Favorite button & badges */}
      <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
        <FavoriteButton quizId={quiz.id} />
        {quiz.isPopular && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Trophy className="h-3 w-3" />
            Populyar
          </Badge>
        )}
        {quiz.isNew && (
          <Badge variant="accent" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Yeni
          </Badge>
        )}
      </div>

      <div className="relative p-5">
        {/* Subject icon */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-2xl shadow-inner">
            {subjectIcon}
          </div>
          <div className="flex items-center gap-1 text-warning">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">{quiz.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="mb-2 font-display text-lg font-bold text-foreground line-clamp-2">
          {quiz.title}
        </h3>
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
          {quiz.description}
        </p>

        {/* Meta info */}
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {quiz.subject}
          </Badge>
          <Badge variant="muted" className="text-xs">
            {quiz.grade}
          </Badge>
          <Badge variant={quiz.difficulty} className="text-xs">
            {difficultyLabels[quiz.difficulty]}
          </Badge>
        </div>

        {/* Stats */}
        <div className="mb-5 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{quiz.questionCount} sual</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{quiz.duration} dəq</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>{quiz.playCount.toLocaleString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {isGuest ? (
            <>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onPreview?.(quiz)}
              >
                Baxış
              </Button>
              <Button 
                variant="game" 
                className="flex-1"
                onClick={() => onPlay(quiz)}
              >
                Başla
              </Button>
            </>
          ) : (
            <Button 
              variant="game" 
              className="w-full"
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
