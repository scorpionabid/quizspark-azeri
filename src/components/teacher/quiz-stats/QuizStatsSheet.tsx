import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Users, Target, Clock, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useQuizDetailedStats } from '@/hooks/useQuizAttempts';
import { PageLoader } from '@/components/ui/loading-spinner';

interface QuizStatsSheetProps {
  quizId: string | null;
  quizTitle: string;
  passPercentage?: number;
  onClose: () => void;
}

function formatTime(sec: number | null): string {
  if (sec == null) return '—';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function relDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'indicə';
  if (mins < 60) return `${mins} dəq əvvəl`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} saat əvvəl`;
  return `${Math.floor(hours / 24)} gün əvvəl`;
}

export function QuizStatsSheet({
  quizId,
  quizTitle,
  passPercentage = 60,
  onClose,
}: QuizStatsSheetProps) {
  const { data, isLoading } = useQuizDetailedStats(quizId ?? undefined, passPercentage);

  // Last 7 days bar chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const chartData = data
    ? last7Days.map(day => ({
        gün: day.slice(5).replace('-', '/'),
        cəhd: data.results.filter(r => r.completed_at.startsWith(day)).length,
      }))
    : [];

  const exportCSV = () => {
    if (!data) return;
    const headers = ['Ad', 'Bal', 'Faiz (%)', 'Vaxt (san)', 'Tarix'];
    const rows = data.results.map(r => [
      r.profiles?.full_name ?? 'Naməlum',
      r.score,
      r.percentage.toFixed(1),
      r.time_spent ?? '',
      new Date(r.completed_at).toLocaleString('az-AZ'),
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quizTitle}_nəticələr.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Sheet open={!!quizId} onOpenChange={open => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-5">
          <SheetTitle className="text-base leading-tight pr-6">{quizTitle}</SheetTitle>
          <p className="text-xs text-muted-foreground">Statistika paneli</p>
        </SheetHeader>

        {isLoading && <PageLoader text="Statistika yüklənir..." />}

        {!isLoading && data && (
          <Tabs defaultValue="overview">
            <TabsList className="mb-4 w-full grid grid-cols-2">
              <TabsTrigger value="overview">Ümumi Baxış</TabsTrigger>
              <TabsTrigger value="students">
                Tələbələr
                {data.summary.total > 0 && (
                  <span className="ml-1.5 text-[10px] bg-primary/10 text-primary rounded px-1">
                    {data.summary.total}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* ── Tab: Ümumi Baxış ── */}
            <TabsContent value="overview" className="space-y-4">
              {/* Summary stat cards */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  icon={<Users className="h-3.5 w-3.5" />}
                  label="Cəhd sayı"
                  value={String(data.summary.total)}
                />
                <StatCard
                  icon={<Target className="h-3.5 w-3.5" />}
                  label="Orta bal"
                  value={`${data.summary.avg_score.toFixed(1)}%`}
                  highlight={data.summary.avg_score >= passPercentage}
                />
                <StatCard
                  icon={<TrendingUp className="h-3.5 w-3.5" />}
                  label="Keçid faizi"
                  value={`${data.summary.pass_rate.toFixed(1)}%`}
                  highlight={data.summary.pass_rate >= 50}
                />
                <StatCard
                  icon={<Clock className="h-3.5 w-3.5" />}
                  label="Orta vaxt"
                  value={formatTime(data.summary.avg_time)}
                />
              </div>

              {/* Weekly trend */}
              <div className="rounded-lg border bg-card p-4">
                <p className="text-xs font-medium text-muted-foreground mb-3">
                  Son 7 gün — cəhd sayı
                </p>
                <ResponsiveContainer width="100%" height={110}>
                  <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                    <XAxis dataKey="gün" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{ fontSize: 11, padding: '4px 8px' }}
                      cursor={{ fill: 'hsl(var(--muted))' }}
                    />
                    <Bar dataKey="cəhd" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {data.summary.total === 0 && (
                <p className="text-center text-muted-foreground py-6 text-sm">
                  Hələ heç bir cəhd qeyd edilməyib
                </p>
              )}
            </TabsContent>

            {/* ── Tab: Tələbələr ── */}
            <TabsContent value="students" className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {data.results.length} nəticə
                </p>
                {data.results.length > 0 && (
                  <Button variant="outline" size="sm" onClick={exportCSV} className="h-7 gap-1.5 text-xs">
                    <Download className="h-3.5 w-3.5" />
                    CSV ixrac
                  </Button>
                )}
              </div>

              {data.results.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">
                  Hələ heç bir nəticə yoxdur
                </p>
              ) : (
                <div className="space-y-1.5">
                  {data.results.map((r, i) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between rounded-lg border bg-card px-3 py-2.5"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xs text-muted-foreground font-mono w-5 shrink-0 text-right">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate leading-tight">
                            {r.profiles?.full_name ?? 'Naməlum'}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {relDate(r.completed_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {formatTime(r.time_spent)}
                        </span>
                        <Badge
                          variant="outline"
                          className={
                            r.percentage >= passPercentage
                              ? 'text-emerald-600 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs px-1.5 h-5'
                              : 'text-rose-600 border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/20 text-xs px-1.5 h-5'
                          }
                        >
                          {r.percentage.toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </SheetContent>
    </Sheet>
  );
}

function StatCard({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] mb-1.5">
        {icon}
        {label}
      </div>
      <p
        className={`text-xl font-bold ${highlight ? 'text-emerald-600 dark:text-emerald-400' : ''}`}
      >
        {value}
      </p>
    </div>
  );
}
