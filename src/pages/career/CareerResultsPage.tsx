import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CareerAssessmentResult } from '@/types/career';
import { getCareerAssessmentById } from '@/services/careerEngine';
import { CareerRadarChart } from '@/components/career/CareerRadarChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  Compass,
  Sparkles,
  BookOpen,
  Briefcase,
  GraduationCap,
  Printer,
  RotateCcw,
  ArrowRight,
  School,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  Zap,
  Share2
} from 'lucide-react';
import { PageLoader } from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/use-toast';

export default function CareerResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const assessmentId = searchParams.get('id');

  const [result, setResult] = useState<CareerAssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResult() {
      setLoading(true);
      // 1. If id is in URL, fetch from Supabase
      if (assessmentId) {
        const data = await getCareerAssessmentById(assessmentId);
        if (data) {
          setResult(data);
          setLoading(false);
          return;
        }
      }

      // 2. Fallback to session storage
      const cached = sessionStorage.getItem('latest_career_result');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setResult(parsed);
          setLoading(false);
          return;
        } catch (e) {
          console.error('Error parsing cached career result', e);
        }
      }

      setLoading(false);
    }

    loadResult();
  }, [assessmentId]);

  if (loading) {
    return <PageLoader text="Karyera hesabatı hazırlanır..." />;
  }

  if (!result) {
    return (
      <div className="container max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">Heç bir nəticə tapılmadı</h2>
        <p className="text-sm text-muted-foreground">
          Görünür siz hələ karyera testindən keçməmisiniz və ya sessiyanız başa çatıb.
        </p>
        <Button onClick={() => navigate('/career/test')} className="gap-2">
          <Sparkles className="w-4 h-4" /> İndi Testdən Keç
        </Button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Mənim Karyera və İxtisas Nəticəm',
        text: `Mən imtahan.store Karyera Bələdçisi testini tamamladım! Əsas istiqamətim: ${result.dominantCluster}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link kopyalandı',
        description: 'Nəticə linki mübadilə buferinə kopyalandı.',
      });
    }
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8 print:p-0 print:space-y-4">
      {/* Top action bar (hidden on print) */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <Link
            to="/career/test"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium mb-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Yenidən Testdən Keç
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Fərdi Karyera və İxtisas Portreti
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5">
            <Share2 className="w-4 h-4" /> Paylaş
          </Button>
          <Button
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 bg-primary text-primary-foreground font-semibold shadow-sm"
          >
            <Printer className="w-4 h-4" /> Çap Et / PDF
          </Button>
        </div>
      </div>

      {/* Main Report Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 print:space-y-4"
      >
        {/* Official Print-Only Header */}
        <div className="hidden print:block text-center border-b pb-4 mb-2">
          <h2 className="text-2xl font-black tracking-tight text-black">İMTAHAN.STORE — KARYERA VƏ İXTİSAS SERTİFİKATI</h2>
          <p className="text-xs text-gray-600 mt-0.5">Holland (RIASEC) Beynəlxalq Qiymətləndirmə və DİM İxtisas Qrupları Portreti</p>
        </div>

        {/* Student Header Card */}
        <Card className="border-border/80 shadow-md overflow-hidden bg-gradient-to-br from-card via-card/90 to-primary/5 print:border print:border-gray-300 print:shadow-none print:bg-white print:break-inside-avoid">
          <CardContent className="p-6 sm:p-8 print:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 mb-6 print:pb-3 print:mb-3">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl border border-primary/20 shrink-0 print:border-gray-400 print:text-black">
                  {result.studentName ? result.studentName.charAt(0).toUpperCase() : 'Ş'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground print:text-black">
                    {result.studentName || 'Şagird'}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-0.5 print:text-gray-700">
                    {result.schoolName && (
                      <span className="flex items-center gap-1">
                        <School className="w-3.5 h-3.5" /> {result.schoolName}
                      </span>
                    )}
                    {result.gradeLevel && (
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" /> {result.gradeLevel}
                      </span>
                    )}
                    {result.utisCode && (
                      <Badge variant="outline" className="text-[11px] font-mono print:text-black print:border-gray-400">
                        UTIS: {result.utisCode}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs py-1 px-3 print:bg-gray-100 print:text-black print:border-gray-400">
                  ✓ Sertifikatlaşdırılmış Analiz
                </Badge>
                <p className="text-[11px] text-muted-foreground mt-1 print:text-gray-600">
                  Tarix: {new Date(result.createdAt || Date.now()).toLocaleDateString('az-AZ')}
                </p>
              </div>
            </div>

            {/* Dominant Direction Banner */}
            <div className="rounded-2xl p-6 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-lg space-y-3 print:bg-none print:bg-white print:text-black print:border-2 print:border-gray-700 print:shadow-none print:p-4 print:break-inside-avoid">
              <div className="flex items-center gap-2">
                <Badge className="bg-indigo-500/30 text-indigo-300 border-indigo-400/40 text-xs print:bg-gray-100 print:text-black print:border-gray-400">
                  Ən Yüksək Uyğunluq
                </Badge>
                <span className="text-xs text-indigo-200 print:text-gray-600">Dominant Potensial Sahəsi</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white print:text-black">
                {result.dominantCluster}
              </h3>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white font-semibold text-sm print:bg-gray-100 print:text-black print:border print:border-gray-300">
                <Trophy className="w-4 h-4 text-amber-400 print:text-black" />
                Tövsiyə olunan: {result.dimGroup}
              </div>
              {result.dimGroupDescription && (
                <p className="text-indigo-200/90 text-sm leading-relaxed pt-1 print:text-gray-800">
                  {result.dimGroupDescription}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Radar Chart & Personality Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch print:grid-cols-1 print:gap-4">
          {/* Radar Chart */}
          <Card className="lg:col-span-7 border-border/80 shadow-md print:border print:border-gray-300 print:shadow-none print:break-inside-avoid">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-500" />
                Çoxölçülü Bacarıq Xəritəsi (Radar Diaqramı)
              </CardTitle>
              <CardDescription className="text-xs">
                6 əsas istiqamət üzrə şagirdin təbii meylləri və qabiliyyət balansı.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CareerRadarChart data={result.radarData} />
            </CardContent>
          </Card>

          {/* Breakdown bars */}
          <Card className="lg:col-span-5 border-border/80 shadow-md flex flex-col justify-between print:border print:border-gray-300 print:shadow-none print:break-inside-avoid">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                İstiqamətlər Üzrə Göstəricilər
              </CardTitle>
              <CardDescription className="text-xs">
                Hər sahə üzrə toplanmış faiz nisbəti
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {result.radarData.map((pt) => (
                <div key={pt.subject} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-foreground">{pt.subject}</span>
                    <span className="font-bold text-primary">{pt.score}%</span>
                  </div>
                  <Progress value={pt.score} className="h-2 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Top Recommended Careers */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Sənin Üçün Ən Uyğun Peşələr</h3>
              <p className="text-xs text-muted-foreground">
                Gələcəyin əmək bazarında tələbat və şagirdin şəxsi göstəricilərinin kəsişməsi.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3">
            {result.recommendedCareers.map((career, idx) => (
              <Card
                key={career.id || idx}
                className="border-border/70 hover:border-primary/50 transition-all shadow-sm overflow-hidden flex flex-col justify-between print:border print:border-gray-300 print:shadow-none print:break-inside-avoid"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      {career.cluster}
                    </Badge>
                    <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-none font-bold text-xs">
                      {career.matchScore}% Uyğunluq
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-bold text-foreground">
                    {career.title}
                  </CardTitle>
                  <CardDescription className="text-xs leading-relaxed line-clamp-3">
                    {career.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  {/* Key skills */}
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Tələb Olunan Əsas Bacarıqlar:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {career.keySkills.map((sk) => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 rounded-md bg-muted text-[11px] font-medium text-foreground"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Education path */}
                  <div className="p-2.5 rounded-xl bg-muted/40 border text-xs space-y-0.5">
                    <p className="text-[11px] font-semibold text-primary">Təhsil İstiqaməti:</p>
                    <p className="text-muted-foreground">{career.educationPath}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommended School Subjects & Roadmap */}
        <Card className="border-border/80 shadow-md print:border print:border-gray-300 print:shadow-none print:break-inside-avoid">
          <CardHeader className="print:pb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold print:hidden">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-lg">Məktəb Fənləri Üzrə Yol Xəritəsi</CardTitle>
                <CardDescription className="text-xs print:hidden">
                  Gələcək hədəflərinə çatmaq üçün hazırda hansı dərslərə daha çox diqqət yetirməlisən?
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2 print:gap-2">
              {result.recommendedSubjects.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-border/70 bg-card/60 space-y-2 flex flex-col justify-between print:border print:border-gray-300 print:p-2.5 print:break-inside-avoid"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-sm text-foreground">{sub.subject}</p>
                    <Badge
                      className={
                        sub.importance === 'Əsas'
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-none text-[11px]'
                          : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-none text-[11px]'
                      }
                    >
                      {sub.importance}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {sub.reason}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Navigation & Retake */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-muted/40 border print:hidden">
          <div>
            <h4 className="font-bold text-sm text-foreground">Yeni bir sınaq keçmək istəyirsən?</h4>
            <p className="text-xs text-muted-foreground">
              Cavablarını dəyişərək fərqli maraqlarını da yoxlaya bilərsən.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/quizzes')}>
              Bütün Quizlər
            </Button>
            <Button onClick={() => navigate('/career/test')} className="gap-2">
              <RotateCcw className="w-4 h-4" /> Testi Yenidən Başlat
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
