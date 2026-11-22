import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  Target,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useStudentMastery, TopicMasteryItem } from '@/hooks/useStudentMastery';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface StudentMasteryAnalyticsProps {
  userId?: string;
}

export const StudentMasteryAnalytics: React.FC<StudentMasteryAnalyticsProps> = ({ userId }) => {
  const navigate = useNavigate();
  const { data: mastery, isLoading } = useStudentMastery(userId);
  const [activeTab, setActiveTab] = useState<'overview' | 'strengths' | 'weaknesses' | 'bloom'>('overview');

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-6">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-5 w-5 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Mövzu mənimsəmə analitikası hesablanır...</p>
        </div>
      </Card>
    );
  }

  if (!mastery || mastery.items.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
        <CardContent className="p-8 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Brain className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">Mövzu Mənimsəmə Təhlili</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Quizlərdə iştirak etdikcə hansı fənlərdən və mövzulardan güclü və ya zəif olduğunuz burada avtomatik təhlil ediləcək.
            </p>
          </div>
          <Button variant="game" onClick={() => navigate('/quizzes')} className="mt-2">
            <Sparkles className="mr-2 h-4 w-4" />
            İlk Sınaq Testini Başlat
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Target className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-bold">Fərdi Bilik Xəritəsi & Zəif/Güclü Tərəflər</CardTitle>
            </div>
            <CardDescription>
              İmtahan nəticələriniz əsasında mövzular üzrə mənimsəmə dərəcəniz və inkişaf tövsiyələri
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 bg-muted/40 p-2.5 rounded-2xl border border-border/40">
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-medium">Ümumi Mənimsəmə</p>
              <p className="text-lg font-black text-primary">{mastery.overallMastery}%</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
              {mastery.overallMastery >= 75 ? '🏆' : mastery.overallMastery >= 50 ? '📈' : '🎯'}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Təkrar vaxtı çatanlar bildirişi */}
        {mastery.needsReviewItems.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {mastery.needsReviewItems.length} mövzunun təkrar vaxtı çatıb (Aralıqlı Təkrarlama)
                </p>
                <p className="text-xs text-muted-foreground">
                  Yaddaşı möhkəmləndirmək üçün zəif və orta mənimsənilmiş mövzuları yenidən sınaqdan keçirin.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/quizzes')}
              className="shrink-0 border-amber-500/30 hover:bg-amber-500/10 text-amber-700 dark:text-amber-300"
            >
              Məşqə Başla
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as unknown as typeof activeTab)}>
          <TabsList className="grid grid-cols-4 w-full bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Xülasə</TabsTrigger>
            <TabsTrigger value="strengths" className="text-xs sm:text-sm gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Güclü ({mastery.strengths.length})
            </TabsTrigger>
            <TabsTrigger value="weaknesses" className="text-xs sm:text-sm gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Zəif ({mastery.weaknesses.length})
            </TabsTrigger>
            <TabsTrigger value="bloom" className="text-xs sm:text-sm gap-1.5">
              <Brain className="h-3.5 w-3.5 text-primary" />
              İdrak Səviyyəsi
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: XÜLASƏ */}
          <TabsContent value="overview" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* TOP Güclü Mövzular */}
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    Ən Güclü Mövzularınız (Top Strengths)
                  </div>
                  <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-700 dark:text-emerald-400">
                    {mastery.strengths.length} mövzu
                  </Badge>
                </div>
                {mastery.strengths.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2">Hələ yüksək mənimsəmə əldə olunmuş mövzu yoxdur.</p>
                ) : (
                  <div className="space-y-2.5">
                    {mastery.strengths.slice(0, 3).map((item) => (
                      <MasteryTopicRow key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>

              {/* TOP Zəif Mövzular */}
              <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-semibold text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    Diqqət Tələb Edən Mövzular (Zəif Nöqtələr)
                  </div>
                  <Badge variant="outline" className="text-[10px] border-rose-500/30 text-rose-700 dark:text-rose-400">
                    {mastery.weaknesses.length} mövzu
                  </Badge>
                </div>
                {mastery.weaknesses.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2">Təbriklər! Kritik zəif mövzunuz aşkar edilməyib.</p>
                ) : (
                  <div className="space-y-2.5">
                    {mastery.weaknesses.slice(0, 3).map((item) => (
                      <MasteryTopicRow key={item.id} item={item} onPractice={() => navigate('/quizzes')} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Fənnlər üzrə bölgü */}
            {mastery.categoryStats.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Fənnlər üzrə Dəqiqlik Nisbəti
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {mastery.categoryStats.map((cat) => (
                    <div key={cat.category} className="p-3.5 rounded-xl border border-border/50 bg-card/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground line-clamp-1">{cat.category}</span>
                        <span className={cn(
                          'text-xs font-bold',
                          cat.accuracy >= 75 ? 'text-emerald-600' : cat.accuracy >= 50 ? 'text-amber-600' : 'text-rose-600'
                        )}>
                          {cat.accuracy}%
                        </span>
                      </div>
                      <Progress value={cat.accuracy} className="h-1.5" />
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>{cat.topicsCount} mövzu</span>
                        <span>{cat.totalCorrect}/{cat.totalAttempts} düzgün</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* TAB 2: GÜCLÜ MÖVZULAR */}
          <TabsContent value="strengths" className="space-y-3 pt-4">
            {mastery.strengths.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                75%-dən yuxarı nəticə göstərdiyiniz mövzular burada əks olunacaq.
              </div>
            ) : (
              <div className="space-y-2.5">
                {mastery.strengths.map((item) => (
                  <MasteryTopicDetailCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* TAB 3: ZƏİF MÖVZULAR */}
          <TabsContent value="weaknesses" className="space-y-3 pt-4">
            {mastery.weaknesses.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Zəif nəticə göstərdiyiniz mövzu tapılmadı. Əla iş!
              </div>
            ) : (
              <div className="space-y-2.5">
                {mastery.weaknesses.map((item) => (
                  <MasteryTopicDetailCard
                    key={item.id}
                    item={item}
                    onPractice={() => navigate('/quizzes')}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* TAB 4: BLOOM İDRAK PROFİLİ */}
          <TabsContent value="bloom" className="space-y-4 pt-4">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                Bloom Taksonomiyası üzrə Qabiliyyət Analizi
              </h4>
              <p className="text-xs text-muted-foreground">
                Sualların idraki çətinlik səviyyəsinə (yaddaşdan tənqidi təfəkkürə qədər) cavab vermə keyfiyyətiniz.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mastery.bloomStats.map((stat) => (
                <div key={stat.level} className="p-4 rounded-xl border border-border/50 bg-card/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">{stat.label}</span>
                      <span className="text-[10px] text-muted-foreground">({stat.total} sual)</span>
                    </div>
                    <span className="text-xs font-black text-primary">{stat.percentage}%</span>
                  </div>
                  <Progress value={stat.percentage} className="h-2" />
                  <p className="text-[11px] text-muted-foreground">
                    {stat.percentage >= 80 ? '🌟 Yüksək səviyyəli mənimsəmə' :
                     stat.percentage >= 50 ? '👍 Normal səviyyə' : '⚠️ Əlavə praktika tövsiyə olunur'}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

function MasteryTopicRow({ item, onPractice }: { item: TopicMasteryItem; onPractice?: () => void }) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/40 text-xs">
      <div className="min-w-0 flex-1 pr-2">
        <p className="font-semibold text-foreground truncate">{item.topic}</p>
        <p className="text-[10px] text-muted-foreground truncate">{item.category}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={cn(
          'font-black',
          item.mastery_level >= 75 ? 'text-emerald-600' : item.mastery_level >= 50 ? 'text-amber-600' : 'text-rose-600'
        )}>
          {item.mastery_level}%
        </span>
        {onPractice && (
          <Button size="icon" variant="ghost" className="h-6 w-6 text-primary" onClick={onPractice}>
            <ArrowRight className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

function MasteryTopicDetailCard({ item, onPractice }: { item: TopicMasteryItem; onPractice?: () => void }) {
  return (
    <div className="p-4 rounded-2xl border border-border/50 bg-card/70 hover:bg-card transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="space-y-1 min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-bold text-sm text-foreground">{item.topic}</h4>
          <Badge variant="outline" className="text-[10px] px-2 py-0">{item.category}</Badge>
          {item.status === 'strong' ? (
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]">Güclü</Badge>
          ) : item.status === 'weak' ? (
            <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/30 text-[10px]">Zəif</Badge>
          ) : (
            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px]">İnkişaf edir</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {item.correct_count} düzgün / {item.attempt_count} ümumi cəhd ({item.attempt_count > 0 ? Math.round((item.correct_count / item.attempt_count) * 100) : 0}% dəqiqlik)
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="w-24 sm:w-28 space-y-1 text-right">
          <span className="text-xs font-bold text-foreground">{item.mastery_level}%</span>
          <Progress value={item.mastery_level} className="h-1.5" />
        </div>
        {onPractice && (
          <Button size="sm" variant="game" className="h-8 text-xs" onClick={onPractice}>
            Məşq Et
          </Button>
        )}
      </div>
    </div>
  );
}
