import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Brain,
  Lightbulb,
  Sparkles,
  BookOpen,
  ArrowRight,
  Users,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useClassTopicAnalysis, ClassTopicGap } from '@/hooks/useClassAnalytics';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const ClassTopicGapAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const { data: classAnalytics, isLoading } = useClassTopicAnalysis();
  const [filter, setFilter] = useState<'all' | 'critical' | 'mastered'>('all');

  if (isLoading) {
    return (
      <Card className="bg-gradient-card border-border/50 p-6">
        <div className="flex items-center gap-3">
          <Brain className="h-5 w-5 animate-pulse text-primary" />
          <p className="text-sm text-muted-foreground">Sinif üzrə mövzu zəiflikləri hesablanır...</p>
        </div>
      </Card>
    );
  }

  if (!classAnalytics || classAnalytics.totalTopics === 0) {
    return (
      <Card className="bg-gradient-card border-border/50 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Sinif Səviyyəsində Zəif Nöqtələrin Təhlili</h3>
              <p className="text-xs text-muted-foreground">
                Şagirdlər quizlərinizi cavablandırdıqca ən çox səhv edilən mövzular və dərslik boşluqları burada toplanacaq.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/teacher/question-bank')}>
            <BookOpen className="mr-2 h-4 w-4" />
            Sual Bankına Bax
          </Button>
        </div>
      </Card>
    );
  }

  const { criticalGaps, masteredTopics, moderateGaps, overallClassAccuracy, activeLearnersCount } = classAnalytics;

  return (
    <Card className="bg-gradient-card border-border/50 shadow-sm overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-bold">Sinif Mövzu Boşluqları & Zəiflik Analitikası</CardTitle>
            </div>
            <CardDescription>
              Şagirdlərinizin toplu şəkildə ən çox çətinlik çəkdiyi mövzuların müəyyənləşdirilməsi
            </CardDescription>
          </div>
          <div className="flex items-center gap-4 bg-muted/40 p-3 rounded-2xl border border-border/40">
            <div>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase">Sinif Dəqiqliyi</p>
              <p className={cn(
                'text-lg font-black',
                overallClassAccuracy >= 70 ? 'text-emerald-600' : overallClassAccuracy >= 50 ? 'text-amber-600' : 'text-rose-600'
              )}>
                {overallClassAccuracy}%
              </p>
            </div>
            <div className="h-8 w-px bg-border/60" />
            <div>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase">Aktiv Şagirdlər</p>
              <p className="text-lg font-black text-foreground">{activeLearnersCount}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Müəllim üçün Avtomatik Pedaqoji Tövsiyə */}
        {criticalGaps.length > 0 ? (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 shrink-0">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-foreground">
                  Pedaqoji Tövsiyə: {criticalGaps[0].topic} mövzusunda çətinlik müşahidə olunur!
                </p>
                <p className="text-xs text-muted-foreground">
                  Şagirdlərin {criticalGaps[0].accuracy}%-lik nəticəsi bu mövzunun növbəti dərsdə təkrar izah olunmasını tələb edir.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="game"
              onClick={() => navigate('/teacher/create')}
              className="shrink-0 text-xs"
            >
              <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
              Bu Mövzudan Quiz Yarat
            </Button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Sinif Mənimsəməsi Balanslıdır</p>
              <p className="text-xs text-muted-foreground">
                Kritik zəiflik aşkar edilməyib. Şagirdlər mövcud mövzuları uğurla mənimsəyirlər.
              </p>
            </div>
          </div>
        )}

        {/* Filter Düymələri */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant={filter === 'all' ? 'default' : 'outline'}
            className="h-8 text-xs"
            onClick={() => setFilter('all')}
          >
            Bütün Mövzular ({classAnalytics.totalTopics})
          </Button>
          <Button
            size="sm"
            variant={filter === 'critical' ? 'destructive' : 'outline'}
            className="h-8 text-xs gap-1.5"
            onClick={() => setFilter('critical')}
          >
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Kritik Zəifliklər ({criticalGaps.length})
          </Button>
          <Button
            size="sm"
            variant={filter === 'mastered' ? 'secondary' : 'outline'}
            className="h-8 text-xs gap-1.5"
            onClick={() => setFilter('mastered')}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Yaxşı Mənimsənilənlər ({masteredTopics.length})
          </Button>
        </div>

        {/* Mövzuların Siyahısı */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(filter === 'critical' ? criticalGaps : filter === 'mastered' ? masteredTopics : [...criticalGaps, ...moderateGaps, ...masteredTopics]).map((item, idx) => (
            <div
              key={`${item.category}-${item.topic}-${idx}`}
              className="p-4 rounded-xl border border-border/50 bg-card/60 hover:bg-card transition-colors space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-xs text-foreground line-clamp-1">{item.topic}</h4>
                  <p className="text-[10px] text-muted-foreground">{item.category}</p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-[10px] shrink-0 font-bold',
                    item.status === 'critical' ? 'border-rose-500/30 text-rose-600 bg-rose-500/5' :
                    item.status === 'mastered' ? 'border-emerald-500/30 text-emerald-600 bg-emerald-500/5' :
                    'border-amber-500/30 text-amber-600 bg-amber-500/5'
                  )}
                >
                  {item.accuracy}% Dəqiqlik
                </Badge>
              </div>

              <Progress value={item.accuracy} className="h-1.5" />

              <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                <span>{item.studentsAffected} şagird iştirak edib</span>
                <span>{item.totalCorrect}/{item.totalAttempts} düzgün cavab</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
