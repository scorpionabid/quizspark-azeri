import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BrainCircuit, Lightbulb, AlertCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BloomAnalyticsProps {
  stats: Record<string, number>;
}

const BLOOM_LEVELS = [
  { id: 'xatırlama', label: 'Xatırlama', color: '#94a3b8' },
  { id: 'anlama', label: 'Anlama', color: '#60a5fa' },
  { id: 'tətbiq', label: 'Tətbiq', color: '#4ade80' },
  { id: 'analiz', label: 'Analiz', color: '#facc15' },
  { id: 'qiymətləndirmə', label: 'Qiymətləndirmə', color: '#fb923c' },
  { id: 'yaratma', label: 'Yaratma', color: '#f87171' },
];

export const BloomAnalytics: React.FC<BloomAnalyticsProps> = ({ stats }) => {
  const data = useMemo(() => {
    return BLOOM_LEVELS.map((level) => ({
      name: level.label,
      value: stats[level.id] || 0,
      color: level.color,
      fullName: level.label,
    })).filter(item => item.value > 0);
  }, [stats]);

  const totalQuestions = useMemo(() => 
    Object.values(stats).reduce((acc, val) => acc + val, 0), 
  [stats]);

  const advice = useMemo(() => {
    if (totalQuestions === 0) return null;

    const insights = [];
    const highOrder = (stats['analiz'] || 0) + (stats['qiymətləndirmə'] || 0) + (stats['yaratma'] || 0);
    const lowOrder = (stats['xatırlama'] || 0) + (stats['anlama'] || 0) + (stats['tətbiq'] || 0);

    const highPercentage = (highOrder / totalQuestions) * 100;

    if (highPercentage < 20) {
      insights.push({
        type: 'warning',
        text: 'Sual bankınız əsasən aşağı səviyyəli (xatırlama, anlama) suallardan ibarətdir. Şagirdlərin tənqidi təfəkkürünü yoxlamaq üçün daha çox "Analiz" və "Yaratma" tipli suallar əlavə etməyiniz tövsiyə olunur.',
      });
    } else if (highPercentage > 50) {
      insights.push({
        type: 'success',
        text: 'Əla! Sual bankınız yüksək səviyyəli idraki suallarla zəngindir. Bu, şagirdlərin dərindən öyrənməsini təşviq edir.',
      });
    }

    if ((stats['tətbiq'] || 0) === 0 && totalQuestions > 10) {
      insights.push({
        type: 'info',
        text: '"Tətbiq" səviyyəli suallarınız yoxdur. Nəzəriyyəni praktikaya çevirən ssenari əsaslı suallar əlavə edə bilərsiniz.',
      });
    }

    if (insights.length === 0) {
      insights.push({
        type: 'info',
        text: 'Sual bankınızın Bloom paylanması balanslı görünür. Müxtəlif çətinlik və idraki səviyyələrdə suallar əlavə etməyə davam edin.',
      });
    }

    return insights;
  }, [stats, totalQuestions]);

  if (totalQuestions === 0) {
    return (
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="h-[300px] flex flex-col items-center justify-center text-muted-foreground gap-2">
          <BrainCircuit className="h-10 w-10 opacity-20" />
          <p>Təhlil üçün kifayət qədər məlumat yoxdur</p>
          <p className="text-xs">Bazaya Bloom səviyyəsi təyin edilmiş suallar əlavə edin</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 overflow-hidden border-none shadow-md bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>Bloom Taksonomiyası Üzrə Paylanma</CardTitle>
          </div>
          <CardDescription>Bazadakı sualların idraki səviyyə analizi</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: 20, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.1} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 shadow-lg border rounded-lg text-sm">
                          <p className="font-bold border-bottom pb-1 mb-1">{payload[0].name}</p>
                          <p className="text-primary">{payload[0].value} sual ({((payload[0].value as number / totalQuestions) * 100).toFixed(1)}%)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[0, 4, 4, 0]} 
                  barSize={30}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BLOOM_LEVELS.map(level => {
              const count = stats[level.id] || 0;
              const percentage = totalQuestions > 0 ? (count / totalQuestions) * 100 : 0;
              return (
                <div key={level.id} className="flex flex-col p-2 bg-muted/40 rounded-md border border-muted-foreground/10">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{level.label}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold">{count}</span>
                    <span className="text-[10px] text-muted-foreground">{percentage.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="h-full border-none shadow-md bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <CardTitle>AI Məsləhətləri</CardTitle>
          </div>
          <CardDescription>Bazanı təkmilləşdirmək üçün tövsiyələr</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {advice?.map((item, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-xl border text-sm flex gap-3 ${
                item.type === 'warning' 
                  ? 'bg-amber-50 border-amber-200 text-amber-800' 
                  : item.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              <div className="mt-0.5">
                {item.type === 'warning' ? <AlertCircle className="h-4 w-4" /> : <Info className="h-4 w-4" />}
              </div>
              <p className="leading-relaxed leading-tight">{item.text}</p>
            </div>
          ))}

          <div className="mt-6 pt-4 border-t border-primary/20">
            <h4 className="text-xs font-bold text-primary mb-2 flex items-center gap-1 uppercase tracking-wider">
              <BrainCircuit className="h-3 w-3" />
              Növbəti Addım:
            </h4>
            <p className="text-xs text-muted-foreground italic">
              "AI Assistant" bölməsində bu analizə uyğun olaraq yeni sualların yaradılmasını tələb edə bilərsiniz.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import { BarChart3 } from 'lucide-react';
