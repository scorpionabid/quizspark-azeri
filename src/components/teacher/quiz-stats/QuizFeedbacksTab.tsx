import React, { useState, useMemo } from 'react';
import {
  Star,
  Flag,
  HelpCircle,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/ui/loading-spinner';
import { useQuizFeedbacks, IssueType, QuestionFeedbackItem } from '@/hooks/useQuizFeedback';
import { cn } from '@/lib/utils';

interface QuizFeedbacksTabProps {
  quizId: string;
}

function getIssueBadge(issueType: IssueType | null) {
  switch (issueType) {
    case 'error':
      return { label: 'Xəta Bildirişi', icon: Flag, className: 'bg-red-500/10 text-red-600 border-red-200 dark:border-red-800' };
    case 'confusing':
      return { label: 'Anlaşılmaz Sual', icon: HelpCircle, className: 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800' };
    case 'too_hard':
      return { label: 'Çox Çətin', icon: ThumbsDown, className: 'bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800' };
    case 'too_easy':
      return { label: 'Çox Asan', icon: ThumbsUp, className: 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800' };
    case 'suggestion':
      return { label: 'Təklif / İzah', icon: Sparkles, className: 'bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800' };
    case 'great':
      return { label: 'Müsbət Rəy', icon: Star, className: 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800' };
    default:
      return { label: 'Ümumi Rəy', icon: MessageSquare, className: 'bg-muted text-muted-foreground border-border' };
  }
}

export function QuizFeedbacksTab({ quizId }: QuizFeedbacksTabProps) {
  const { data: feedbacks = [], isLoading } = useQuizFeedbacks(quizId);
  const [filterType, setFilterType] = useState<string>('all');

  const stats = useMemo(() => {
    const total = feedbacks.length;
    if (total === 0) return { total: 0, avg: 0, issues: 0 };

    const avg = feedbacks.reduce((sum, f) => sum + f.rating, 0) / total;
    const issues = feedbacks.filter(f => f.issue_type === 'error' || f.issue_type === 'confusing').length;

    return { total, avg, issues };
  }, [feedbacks]);

  const filteredFeedbacks = useMemo(() => {
    if (filterType === 'all') return feedbacks;
    if (filterType === 'issues') return feedbacks.filter(f => f.issue_type === 'error' || f.issue_type === 'confusing');
    return feedbacks.filter(f => f.issue_type === filterType);
  }, [feedbacks, filterType]);

  if (isLoading) {
    return <PageLoader text="Rəylər yüklənir..." />;
  }

  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-12 px-4 space-y-3 rounded-2xl border border-dashed border-border/70 bg-card/50">
        <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground/50" />
        <h3 className="text-sm font-semibold text-foreground">Hələ heç bir rəy bildirilməyib</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Şagirdlər bu quizdə sualları cavablandırarkən xəta və ya rəy yazdıqda burada əks olunacaq.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Metrics Summary */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-xl border border-border/70 bg-card p-3 shadow-sm">
          <p className="text-[11px] font-medium text-muted-foreground">Cəmi Rəy</p>
          <p className="text-lg sm:text-xl font-bold text-foreground mt-0.5">{stats.total}</p>
        </div>

        <div className="rounded-xl border border-border/70 bg-card p-3 shadow-sm">
          <p className="text-[11px] font-medium text-muted-foreground">Orta Bal</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-lg sm:text-xl font-bold text-foreground">
              {stats.avg.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-card p-3 shadow-sm">
          <p className="text-[11px] font-medium text-muted-foreground">Xəta Bildirişi</p>
          <p className={cn(
            "text-lg sm:text-xl font-bold mt-0.5",
            stats.issues > 0 ? "text-destructive" : "text-foreground"
          )}>
            {stats.issues}
          </p>
        </div>
      </div>

      {/* Filter Badges */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        <Button
          variant={filterType === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('all')}
          className="h-7 text-xs rounded-lg"
        >
          Hamısı ({feedbacks.length})
        </Button>
        <Button
          variant={filterType === 'issues' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('issues')}
          className="h-7 text-xs rounded-lg gap-1"
        >
          <Flag className="h-3 w-3 text-red-500" />
          <span>Xətalar ({stats.issues})</span>
        </Button>
        <Button
          variant={filterType === 'suggestion' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('suggestion')}
          className="h-7 text-xs rounded-lg gap-1"
        >
          <Sparkles className="h-3 w-3 text-purple-500" />
          <span>Təkliflər</span>
        </Button>
        <Button
          variant={filterType === 'great' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('great')}
          className="h-7 text-xs rounded-lg gap-1"
        >
          <Star className="h-3 w-3 text-yellow-500" />
          <span>Müsbət</span>
        </Button>
      </div>

      {/* Feedbacks List */}
      <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
        {filteredFeedbacks.map((item) => {
          const badgeInfo = getIssueBadge(item.issue_type);
          const BadgeIcon = badgeInfo.icon;

          return (
            <div
              key={item.id}
              className="rounded-xl border border-border/70 bg-card p-3.5 shadow-sm space-y-2 text-xs"
            >
              {/* Question preview + Date */}
              <div className="flex items-start justify-between gap-2 border-b border-border/40 pb-2">
                <div className="min-w-0 flex-1">
                  {item.question_title && (
                    <span className="font-semibold text-primary block truncate">
                      {item.question_title}
                    </span>
                  )}
                  <p className="text-muted-foreground line-clamp-1">
                    {item.question_text || 'Sual'}
                  </p>
                </div>

                <div className="flex items-center gap-0.5 text-yellow-500 font-bold shrink-0">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span>{item.rating}</span>
                </div>
              </div>

              {/* Student info + Issue badge */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                    {item.student_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="font-medium text-foreground">{item.student_name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    • {new Date(item.created_at).toLocaleDateString('az-AZ', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <Badge variant="outline" className={cn('gap-1 text-[10px] px-2 py-0.5', badgeInfo.className)}>
                  <BadgeIcon className="h-3 w-3" />
                  <span>{badgeInfo.label}</span>
                </Badge>
              </div>

              {/* Comment text */}
              {item.comment && (
                <div className="rounded-lg bg-muted/50 p-2.5 text-foreground/90 font-sans border border-border/30">
                  <p className="italic">{item.comment}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
