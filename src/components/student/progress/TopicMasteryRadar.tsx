import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell
} from 'recharts';
import { TopicMastery } from "@/hooks/useStudentProgress";
import { AlertTriangle, CheckCircle2, TrendingUp, Sparkles, Zap, Brain, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface TopicMasteryRadarProps {
  topics: TopicMastery[];
  weakTopics: TopicMastery[];
  strongTopics: TopicMastery[];
  onStartRemedial: (topicName?: string) => void;
  onAskAI: (prompt: string) => void;
}

export function TopicMasteryRadar({
  topics,
  weakTopics,
  strongTopics,
  onStartRemedial,
  onAskAI
}: TopicMasteryRadarProps) {
  // Format radar data (take top 6-8 topics for visual clarity)
  const radarData = (topics || []).slice(0, 8).map(t => {
    const topicTitle = t?.topic || 'Mövzu';
    return {
      topic: topicTitle.length > 14 ? `${topicTitle.slice(0, 12)}...` : topicTitle,
      fullTopic: topicTitle,
      accuracy: t?.accuracy ?? 0,
      total: t?.totalQuestions ?? 0,
    };
  });

  // Bar chart data sorted by accuracy ascending to highlight gaps
  const barData = [...(topics || [])].sort((a, b) => (a?.accuracy ?? 0) - (b?.accuracy ?? 0)).slice(0, 6);

  const getBarColor = (accuracy: number) => {
    if (accuracy >= 80) return '#10b981'; // green
    if (accuracy >= 60) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  return (
    <div className="space-y-8">
      {/* Top Weak Areas Action Banner */}
      {weakTopics.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-destructive/15 via-warning/10 to-primary/10 border border-destructive/30 p-6 shadow-md"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-semibold">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Diqqət tələb edən {weakTopics.length} mövzu aşkarlandı</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Zəif tərəflərini gücləndirərək nəticəni yüksəlt!
              </h3>
              <p className="text-sm text-muted-foreground">
                Ən çox səhv edilən mövzular: <span className="font-semibold text-foreground">{weakTopics.slice(0, 3).map(w => w.topic).join(', ')}</span>.
                Fərdi bərpa sınağı və ya AI Tyutor ilə dərhal öyrənməyə başlaya bilərsiniz.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button
                variant="outline"
                className="gap-2 border-primary/30 hover:bg-primary/10 flex-1 md:flex-initial"
                onClick={() => onAskAI(`Mənim ən zəif mövzum "${weakTopics[0]?.topic}"dir. Bu mövzunu mənə sadə dillə və əsas qaydalarla izah et.`)}
              >
                <Brain className="h-4 w-4 text-primary" />
                AI İzahı İstə
              </Button>
              <Button
                className="gap-2 shadow-lg shadow-primary/20 flex-1 md:flex-initial"
                onClick={() => onStartRemedial(weakTopics[0]?.topic)}
              >
                <Zap className="h-4 w-4" />
                Bərpa Sınağı Başlat
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card className="bg-card/60 backdrop-blur-sm border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Bilik Radarı və Bacarıq Xəritəsi
                </CardTitle>
                <CardDescription>
                  Mövzular üzrə dəqiqlik faizinin çoxbucaqlı xəritəsi
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                {topics.length} Mövzu
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {radarData.length > 2 ? (
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="currentColor" className="text-border/60" />
                    <PolarAngleAxis
                      dataKey="topic"
                      tick={{ fill: 'currentColor', fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: 'currentColor', fontSize: 10 }}
                      className="text-muted-foreground"
                    />
                    <Radar
                      name="Dəqiqlik %"
                      dataKey="accuracy"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.45}
                    />
                    <Tooltip
                      formatter={(val: number) => [`${val}%`, 'Dəqiqlik']}
                      labelFormatter={(label) => `Mövzu: ${label}`}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '0.75rem',
                        color: 'hsl(var(--foreground))',
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[280px] flex flex-col items-center justify-center text-center p-6 text-muted-foreground space-y-3">
                <Brain className="h-12 w-12 opacity-30 text-primary" />
                <p className="text-sm">Bilik radarının tam formalaşması üçün ən azı 3 fərqli mövzuda sınaq işləyin.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bar Breakdown Chart */}
        <Card className="bg-card/60 backdrop-blur-sm border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Mövzular üzrə Mənimsəmə Səviyyəsi
                </CardTitle>
                <CardDescription>
                  Ən çox inkişafa ehtiyacı olan mövzuların sıralaması
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {barData.length > 0 ? (
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical" margin={{ left: 15, right: 30, top: 10, bottom: 10 }}>
                    <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                    <YAxis
                      dataKey="topic"
                      type="category"
                      width={110}
                      tick={{ fontSize: 11 }}
                      tickFormatter={(val: string) => val.length > 12 ? `${val.slice(0, 10)}...` : val}
                    />
                    <Tooltip
                      formatter={(val: number) => [`${val}%`, 'Mənimsəmə']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '0.75rem',
                      }}
                    />
                    <Bar dataKey="accuracy" radius={[0, 6, 6, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getBarColor(entry.accuracy)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[280px] flex flex-col items-center justify-center text-center p-6 text-muted-foreground space-y-3">
                <TrendingUp className="h-12 w-12 opacity-30 text-warning" />
                <p className="text-sm">Hələ ki, statistika formalaşmayıb.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Topic Cards Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Bütün Mövzuların Mənimsəmə Siyahısı
          </h3>
          <span className="text-xs text-muted-foreground">
            {strongTopics.length} güclü / {weakTopics.length} zəif mövzu
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((t, idx) => (
            <motion.div
              key={t.topic || idx}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Card className="h-full bg-card/40 backdrop-blur-sm border-border/40 hover:border-primary/40 hover:shadow-md transition-all">
                <CardContent className="p-5 space-y-4 flex flex-col justify-between h-full">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-foreground text-sm line-clamp-1" title={t.topic}>
                        {t.topic}
                      </h4>
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase font-bold shrink-0 ${
                          t.level === 'master'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400'
                            : t.level === 'weak'
                            ? 'bg-destructive/10 text-destructive border-destructive/30'
                            : 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400'
                        }`}
                      >
                        {t.level === 'master' ? 'Usta (80%+)' : t.level === 'weak' ? 'Zəif (<60%)' : 'İnkişafda'}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Fənn: <span className="text-foreground font-medium">{t.category}</span> • {t.correctCount}/{t.totalQuestions} düzgün
                    </p>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">Dəqiqlik</span>
                        <span className={t.level === 'master' ? 'text-emerald-500' : t.level === 'weak' ? 'text-destructive' : 'text-amber-500'}>
                          {t.accuracy}%
                        </span>
                      </div>
                      <Progress
                        value={t.accuracy}
                        className={`h-2 ${
                          t.level === 'master' ? '[&>div]:bg-emerald-500' : t.level === 'weak' ? '[&>div]:bg-destructive' : '[&>div]:bg-amber-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/30 flex items-center justify-between gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-primary hover:bg-primary/10 gap-1 px-2 h-8"
                      onClick={() => onAskAI(`"${t.topic}" mövzusundan 3 asan sual və qaydanın qısa izahını ver.`)}
                    >
                      <Brain className="h-3.5 w-3.5" />
                      AI ilə məşq
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs gap-1 px-2.5 h-8 border-border/60 hover:bg-accent"
                      onClick={() => onStartRemedial(t.topic)}
                    >
                      <span>Sınaq</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
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
