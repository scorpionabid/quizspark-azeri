import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  Trophy,
  Target,
  BookOpen,
  Sparkles,
  Zap,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useMyAttempts } from '@/hooks/useQuizAttempts';
import { QuickJoinPinCard } from './QuickJoinPinCard';
import { cn } from '@/lib/utils';

export const StudentLearningHub: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { data: attempts = [] } = useMyAttempts();

  const completedAttempts = attempts.filter((a) => a.completed_at && a.score !== null);
  const totalCompleted = completedAttempts.length;

  const avgScore =
    totalCompleted > 0
      ? Math.round(
          completedAttempts.reduce((sum, a) => {
            const pct = a.total_questions ? ((a.score || 0) / a.total_questions) * 100 : 0;
            return sum + pct;
          }, 0) / totalCompleted
        )
      : 0;

  // Daily Goal (Mock progress based on today's attempts)
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayAttempts = completedAttempts.filter((a) => a.completed_at?.startsWith(todayStr));
  const dailyTarget = 3;
  const dailyProgress = Math.min(Math.round((todayAttempts.length / dailyTarget) * 100), 100);

  const studentName = profile?.full_name || user?.email?.split('@')[0] || 'Abituriyent';

  return (
    <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8 w-full min-w-0">
      {/* ── 1. Hero Welcome & Stats Banner ── */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary via-indigo-900 to-slate-900 text-white p-4 sm:p-6 lg:p-8 shadow-xl w-full min-w-0">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 h-32 w-32 rounded-full bg-secondary/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 w-full min-w-0">
          <div className="space-y-2 sm:space-y-3 min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-2.5 py-0.5 text-[11px] sm:text-xs font-bold text-amber-300 border border-white/15">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Xoş gəldin, {studentName}!</span>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight break-words">
              Biliklərini artır, <br className="hidden sm:block" />
              <span className="text-amber-400">hədəflərinə daha tez çat!</span>
            </h1>
            <p className="text-white/75 text-xs sm:text-sm max-w-lg font-medium leading-relaxed">
              Gündəlik testləri həll et, zəif mövzularını təkrarlayaraq imtahana hazır ol.
            </p>
          </div>

          {/* Quick Stat Pill Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full lg:w-auto shrink-0 min-w-0">
            <div className="rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md p-2.5 sm:p-4 border border-white/10 text-center min-w-0">
              <div className="flex items-center justify-center gap-1 text-amber-400 mb-0.5">
                <Flame className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 shrink-0" />
                <span className="text-base sm:text-xl font-black">1</span>
              </div>
              <p className="text-[9px] sm:text-[11px] text-white/75 font-semibold uppercase tracking-wider truncate">Alov (Gün)</p>
            </div>

            <div className="rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md p-2.5 sm:p-4 border border-white/10 text-center min-w-0">
              <div className="flex items-center justify-center gap-1 text-emerald-400 mb-0.5">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <span className="text-base sm:text-xl font-black">{totalCompleted}</span>
              </div>
              <p className="text-[9px] sm:text-[11px] text-white/75 font-semibold uppercase tracking-wider truncate">Testlər</p>
            </div>

            <div className="rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md p-2.5 sm:p-4 border border-white/10 text-center min-w-0">
              <div className="flex items-center justify-center gap-1 text-cyan-300 mb-0.5">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <span className="text-base sm:text-xl font-black">{avgScore}%</span>
              </div>
              <p className="text-[9px] sm:text-[11px] text-white/75 font-semibold uppercase tracking-wider truncate">Nəticə</p>
            </div>
          </div>
        </div>

        {/* ── Daily Goal Progress Bar ── */}
        <div className="mt-4 sm:mt-6 pt-3.5 sm:pt-5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 text-xs w-full min-w-0">
          <div className="flex items-center gap-2 w-full sm:w-auto min-w-0">
            <Target className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="font-semibold text-white/90 shrink-0">Günün Hədəfi:</span>
            <span className="text-white/70 truncate">
              {todayAttempts.length}/{dailyTarget} test tamamlandı
            </span>
          </div>
          <div className="w-full sm:w-56 flex items-center gap-2.5">
            <Progress value={dailyProgress} className="h-2 sm:h-2.5 bg-white/20 flex-1" />
            <span className="font-bold text-amber-300 shrink-0 text-xs">{dailyProgress}%</span>
          </div>
        </div>
      </div>

      {/* ── 2. Quick PIN Join Widget ── */}
      <QuickJoinPinCard variant="hero" />

      {/* ── 2.5 Recent Exam Results ── */}
      {completedAttempts.length > 0 && (
        <div className="rounded-2xl sm:rounded-3xl border border-border/60 bg-card p-4 sm:p-6 shadow-sm space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg text-foreground">Son İmtahan Nəticələrim</h3>
                <p className="text-xs text-muted-foreground">İştirak etdiyiniz son sınaqlar və topladığınız ballar</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/profile')}
              className="text-xs text-primary font-bold hover:bg-primary/10 h-8 gap-1"
            >
              <span>Profilə bax</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
            {completedAttempts.slice(0, 4).map((att) => {
              const title = att.quizzes?.title || 'Sınaq İmtahanı';
              const pct = att.total_questions ? Math.round(((att.score || 0) / att.total_questions) * 100) : 0;
              const isPass = pct >= (att.quizzes?.pass_percentage || 60);

              return (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <h4 className="font-bold text-xs sm:text-sm text-foreground truncate" title={title}>
                      {title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                      <span>{att.score ?? 0} / {att.total_questions || 0} bal</span>
                      <span>•</span>
                      <span>{att.completed_at ? new Date(att.completed_at).toLocaleDateString('az-AZ') : ''}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      className={cn(
                        'font-black text-xs px-2 py-0.5',
                        isPass
                          ? 'bg-emerald-600 hover:bg-emerald-600 text-white'
                          : 'bg-amber-600 hover:bg-amber-600 text-white'
                      )}
                    >
                      %{pct}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2.5 text-xs font-bold rounded-lg border-primary/30 text-primary hover:bg-primary/10 gap-1"
                      onClick={() => navigate(`/quiz/${att.quizzes?.share_code || att.quiz_id}`)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Bax</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 3. Quick Actions Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 w-full min-w-0">
        <Button
          variant="outline"
          className="h-auto flex-col gap-1.5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 hover:border-primary/40 bg-card hover:bg-muted/40 transition-all shadow-sm w-full min-w-0"
          onClick={() => navigate('/quizzes')}
        >
          <div className="p-2 sm:p-2.5 rounded-xl bg-primary/10 text-primary">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <span className="font-bold text-xs sm:text-sm text-foreground truncate w-full text-center">Bütün Quizlər</span>
        </Button>

        <Button
          variant="outline"
          className="h-auto flex-col gap-1.5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 hover:border-amber-500/40 bg-card hover:bg-muted/40 transition-all shadow-sm w-full min-w-0"
          onClick={() => navigate('/leaderboard')}
        >
          <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <span className="font-bold text-xs sm:text-sm text-foreground truncate w-full text-center">Reytinq Cədvəli</span>
        </Button>

        <Button
          variant="outline"
          className="h-auto flex-col gap-1.5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 hover:border-cyan-500/40 bg-card hover:bg-muted/40 transition-all shadow-sm w-full min-w-0"
          onClick={() => navigate('/profile')}
        >
          <div className="p-2 sm:p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <Target className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <span className="font-bold text-xs sm:text-sm text-foreground truncate w-full text-center">Nailiyyətlər</span>
        </Button>

        <Button
          variant="outline"
          className="h-auto flex-col gap-1.5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 hover:border-indigo-500/40 bg-card hover:bg-muted/40 transition-all shadow-sm w-full min-w-0"
          onClick={() => navigate('/quizzes?filter=popular')}
        >
          <div className="p-2 sm:p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <span className="font-bold text-xs sm:text-sm text-foreground truncate w-full text-center">Populyar</span>
        </Button>
      </div>
    </div>
  );
};
