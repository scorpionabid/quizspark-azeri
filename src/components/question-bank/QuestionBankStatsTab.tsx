import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  Database,
  Layers,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  XCircle,
  Search,
  BookOpen,
  PieChart as PieChartIcon,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useQuestionBankDetailedAnalytics, CategoryStatItem } from '@/hooks/useQuestionBank';
import { BloomAnalytics } from './BloomAnalytics';
import { Skeleton } from '@/components/ui/skeleton';

export function QuestionBankStatsTab() {
  const { data: analytics, isLoading } = useQuestionBankDetailedAnalytics();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = useMemo(() => {
    if (!analytics?.categories) return [];
    if (!searchQuery.trim()) return analytics.categories;
    const q = searchQuery.toLowerCase();
    return analytics.categories.filter((c: CategoryStatItem) =>
      c.category.toLowerCase().includes(q)
    );
  }, [analytics?.categories, searchQuery]);

  const chartData = useMemo(() => {
    if (!analytics?.categories) return [];
    // Show top 8 categories by question count
    return analytics.categories.slice(0, 8).map((c) => ({
      name: c.category.length > 14 ? `${c.category.slice(0, 14)}...` : c.category,
      fullCategory: c.category,
      suallar: c.questionCount,
      cavablar: c.attemptsCount,
      düzgün: c.correctCount,
      səhv: c.incorrectCount,
      faiz: Math.round(c.accuracyPercentage),
    }));
  }, [analytics?.categories]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-8">
      {/* ── 1. Top Metric Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Questions */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Ümumi Suallar</CardTitle>
            <Database className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">{analytics.totalQuestions}</div>
            <p className="text-xs text-muted-foreground mt-1">bazadakı aktiv sual sayı</p>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Kateqoriyalar</CardTitle>
            <Layers className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">{analytics.totalCategories}</div>
            <p className="text-xs text-muted-foreground mt-1">müxtəlif fənn/mövzu</p>
          </CardContent>
        </Card>

        {/* This Week */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Bu Həftə</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              +{analytics.thisWeekCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">yeni sual əlavə edildi</p>
          </CardContent>
        </Card>

        {/* Difficulty Breakdown */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Çətinlik Bölgüsü</CardTitle>
            <BarChart3 className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                Asan: {analytics.difficultyCounts['asan'] || 0}
              </span>
              <span className="text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded">
                Orta: {analytics.difficultyCounts['orta'] || 0}
              </span>
              <span className="text-rose-600 bg-rose-500/10 px-1.5 py-0.5 rounded">
                Çətin: {analytics.difficultyCounts['çətin'] || 0}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Answer Accuracy */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Cavab Statistikası</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {analytics.totalAttempts > 0 ? `${Math.round(analytics.overallAccuracy)}%` : '0%'}
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                ({analytics.totalAttempts} cavab)
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
              <span className="text-emerald-600">✓ {analytics.totalCorrect} düz</span>
              <span>•</span>
              <span className="text-rose-600">✕ {analytics.totalIncorrect} səhv</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 2. Category Performance Comparison Chart ────────────── */}
      {chartData.length > 0 && (
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Əsas Kateqoriyalar üzrə Sual və Cavab Analizi</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Ən çox sualı olan kateqoriyalarda tələbələrin verdiyi cavabların bölgüsü
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-popover border border-border p-3 rounded-lg shadow-lg text-xs space-y-1">
                            <p className="font-bold text-foreground text-sm">{d.fullCategory}</p>
                            <p className="text-primary font-medium">Sualların Sayı: {d.suallar}</p>
                            <p className="text-muted-foreground">Cəmi Cavablar: {d.cavablar}</p>
                            <p className="text-emerald-600">✓ Düzgün Cavablar: {d.düzgün}</p>
                            <p className="text-rose-600">✕ Səhv Cavablar: {d.səhv}</p>
                            {d.cavablar > 0 && (
                              <p className="font-bold text-indigo-600 dark:text-indigo-400">
                                Doğruluq Faizi: {d.faiz}%
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Bar dataKey="suallar" name="Sual Sayı" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="düzgün" name="Düzgün Cavablar" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="səhv" name="Səhv Cavablar" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── 3. Detailed Category Breakdown Table ─────────────────── */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>Kateqoriyalar üzrə Detallı İcmal</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Hər kateqoriyadakı sual sayı, çətinlik bölgüsü və tələbələrin cavablandırma nəticələri
              </CardDescription>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Kateqoriya axtar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3">Kateqoriya / Fənn</th>
                  <th className="p-3 text-center">Sual Sayı</th>
                  <th className="p-3 text-center">Payı (%)</th>
                  <th className="p-3">Çətinlik (Asan / Orta / Çətin)</th>
                  <th className="p-3 text-center">Cavablandırılma</th>
                  <th className="p-3 text-center">Düzgün</th>
                  <th className="p-3 text-center">Səhv</th>
                  <th className="p-3 w-40">Uğur Faizi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-muted-foreground">
                      Kateqoriya tapılmadı
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat: CategoryStatItem) => (
                    <tr key={cat.category} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-semibold text-foreground">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-primary" />
                          <span>{cat.category}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center font-bold font-mono text-foreground">
                        {cat.questionCount}
                      </td>
                      <td className="p-3 text-center font-mono text-muted-foreground">
                        {cat.percentage.toFixed(1)}%
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1 text-[11px] font-medium">
                          <span className="text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded" title="Asan">
                            {cat.easyCount}
                          </span>
                          <span className="text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded" title="Orta">
                            {cat.mediumCount}
                          </span>
                          <span className="text-rose-600 bg-rose-500/10 px-1.5 py-0.5 rounded" title="Çətin">
                            {cat.hardCount}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-center font-mono text-muted-foreground font-medium">
                        {cat.attemptsCount > 0 ? cat.attemptsCount : '-'}
                      </td>
                      <td className="p-3 text-center font-mono">
                        {cat.correctCount > 0 ? (
                          <Badge variant="outline" className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300">
                            ✓ {cat.correctCount}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-3 text-center font-mono">
                        {cat.incorrectCount > 0 ? (
                          <Badge variant="outline" className="text-rose-600 bg-rose-50 dark:bg-rose-950/20 border-rose-300">
                            ✕ {cat.incorrectCount}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-3">
                        {cat.attemptsCount > 0 ? (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] font-semibold">
                              <span className={cat.accuracyPercentage >= 70 ? 'text-emerald-600' : cat.accuracyPercentage >= 40 ? 'text-amber-600' : 'text-rose-600'}>
                                {Math.round(cat.accuracyPercentage)}%
                              </span>
                            </div>
                            <Progress
                              value={cat.accuracyPercentage}
                              className="h-1.5"
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Cavab yoxdur</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── 4. Bloom Taxonomy & AI Advice ────────────────────────── */}
      <div>
        <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>İdraki Səviyyə Analizi və AI Tövsiyələri</span>
        </h3>
        <BloomAnalytics stats={analytics.bloomLevelCounts} />
      </div>
    </div>
  );
}
