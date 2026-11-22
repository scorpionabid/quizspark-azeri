import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { DailyGoal, RoadmapStep, TopicMastery } from "@/hooks/useStudentProgress";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Sparkles,
  Target,
  Zap,
  TrendingUp,
  Brain,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

interface PersonalizedRoadmapProps {
  roadmap: RoadmapStep[];
  dailyGoals: DailyGoal[];
  spacedRepetitionQueue: TopicMastery[];
  streakDays: number;
  onToggleGoal: (goalId: string) => void;
  onStartRemedial: (topic?: string) => void;
  onAskAI: (prompt: string) => void;
}

export function PersonalizedRoadmap({
  roadmap,
  dailyGoals,
  spacedRepetitionQueue,
  streakDays,
  onToggleGoal,
  onStartRemedial,
  onAskAI
}: PersonalizedRoadmapProps) {
  const completedGoalsCount = dailyGoals.filter(g => g.completed).length;
  const goalsProgressPercentage = dailyGoals.length > 0 ? Math.round((completedGoalsCount / dailyGoals.length) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Top Streak & Daily Target Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Streak Card */}
        <Card className="bg-gradient-to-br from-amber-500/10 via-card to-card border-amber-500/30 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-500">
                <Flame className="h-7 w-7 animate-bounce" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Davamlılıq Zolağı
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-foreground">{streakDays} Gün</span>
                  <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-500 border-amber-500/30">
                    Alovlu Tərəqqi 🔥
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Goals Card */}
        <Card className="bg-gradient-to-br from-primary/10 via-card to-card border-primary/30 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-2xl text-primary">
                <Target className="h-7 w-7" />
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Günün Hədəfləri
                </p>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-foreground">
                    {completedGoalsCount}/{dailyGoals.length} Tamamlandı
                  </span>
                  <span className="text-xs font-bold text-primary">{goalsProgressPercentage}%</span>
                </div>
                <Progress value={goalsProgressPercentage} className="h-1.5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spaced Repetition Reminder Card */}
        <Card className="bg-gradient-to-br from-secondary/10 via-card to-card border-secondary/30 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/20 rounded-2xl text-secondary">
                <Clock className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Aralıqlı Təkrar
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    {spacedRepetitionQueue.length} Mövzu
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    Unudulma Əyrisi
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Micro-Goals Section */}
      <Card className="bg-card/60 backdrop-blur-sm border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Gündəlik Mikro-Hədəflər
              </CardTitle>
              <CardDescription>
                Hər gün kiçik addımlarla böyük tərəqqi əldə edin və əlavə XP qazanın
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {dailyGoals.map((goal) => (
            <div
              key={goal.id}
              onClick={() => onToggleGoal(goal.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                goal.completed
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-muted/30 border-border/50 hover:border-primary/40 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={goal.completed}
                  onCheckedChange={() => onToggleGoal(goal.id)}
                  className="rounded-lg h-5 w-5 border-2 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                />
                <div className="space-y-0.5">
                  <p className={`text-sm font-semibold ${goal.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {goal.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{goal.description}</p>
                </div>
              </div>

              <Badge
                variant="outline"
                className={goal.completed ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' : 'bg-primary/5 text-primary border-primary/20'}
              >
                +{goal.xpReward} XP
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Spaced Repetition Queue (if any) */}
      {spacedRepetitionQueue.length > 0 && (
        <Card className="bg-gradient-to-r from-secondary/10 via-card to-card border-secondary/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                  <AlertCircle className="h-5 w-5 text-secondary" />
                  Yaddaşı Möhkəmləndirmək üçün Təkrar Zamanı Çatıb
                </CardTitle>
                <CardDescription className="text-xs">
                  Ebbinghaus unudulma əyrisinə görə, öyrəndiyiniz məlumatları uzunmüddətli yaddaşa köçürmək üçün aşağıdakı mövzuları təkrar etmək tövsiyə olunur:
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {spacedRepetitionQueue.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-card border border-border/60 flex items-center justify-between gap-2 shadow-sm"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-foreground line-clamp-1">{item.topic}</p>
                    <p className="text-[11px] text-muted-foreground">{item.daysSincePractice} gün əvvəl işlənilib</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs border-secondary/30 text-secondary hover:bg-secondary/10 shrink-0"
                    onClick={() => onStartRemedial(item.topic)}
                  >
                    Təkrar Et
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 7-Day Step-by-Step Personalized Roadmap */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              7 Günlük Fərdi Bərpa və İnkişaf Planı
            </h3>
            <p className="text-xs text-muted-foreground">
              Zəif nəticələriniz əsasında süni intellekt tərəfindən addım-addım tərtib olunmuş fərdi yol xəritəsi
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
            onClick={() => onAskAI("Mənim üçün mövcud zəifliklərimə əsaslanan 7 günlük detallı tədris planı və tövsiyələr siyahısı hazırla.")}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            AI ilə Planı Yenilə
          </Button>
        </div>

        <div className="relative border-l-2 border-primary/20 pl-6 ml-4 space-y-6">
          {roadmap.map((step, idx) => (
            <motion.div
              key={step.day}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative group"
            >
              {/* Timeline Indicator Dot */}
              <div
                className={`absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-background transition-all ${
                  step.status === 'completed'
                    ? 'bg-emerald-500 shadow-md shadow-emerald-500/40'
                    : step.status === 'in_progress'
                    ? 'bg-primary ring-4 ring-primary/20 animate-pulse'
                    : 'bg-muted-foreground/40'
                }`}
              />

              <Card className={`overflow-hidden transition-all bg-card/60 backdrop-blur-sm border ${
                step.status === 'in_progress'
                  ? 'border-primary/50 shadow-md shadow-primary/10'
                  : step.status === 'completed'
                  ? 'border-emerald-500/20 bg-emerald-500/[0.02]'
                  : 'border-border/50 opacity-80'
              }`}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-bold text-xs bg-primary/5 text-primary border-primary/20">
                        {step.day}-ci Gün
                      </Badge>
                      <h4 className="font-bold text-foreground text-sm">
                        {step.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        ~{step.estimatedMinutes} dəq
                      </span>
                      {step.status === 'completed' && (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                          Tamamlandı
                        </Badge>
                      )}
                      {step.status === 'in_progress' && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                          Aktiv Mərhələ
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  <div className="pt-2 border-t border-border/30 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      Fokus: <span className="text-primary">{step.focusTopic}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-primary gap-1"
                        onClick={() => onAskAI(`"${step.focusTopic}" mövzusunu mənə sadə dillə izah et və 1 nümunə həll göstər.`)}
                      >
                        <Brain className="h-3.5 w-3.5" />
                        AI İzahı
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 text-xs gap-1 shadow-sm"
                        onClick={() => onStartRemedial(step.focusTopic)}
                      >
                        <span>İcra Et</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
