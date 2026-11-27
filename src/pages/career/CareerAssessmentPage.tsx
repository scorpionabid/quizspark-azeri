import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
  CAREER_QUESTIONS,
  STAGE_OPTIONS,
  STAGE_META,
  calculateCareerResults,
  saveCareerAssessment
} from '@/services/careerEngine';
import { CareerStage, CareerQuestion } from '@/types/career';
import { CareerProgressBar } from '@/components/career/CareerProgressBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Compass,
  CheckCircle2,
  Brain,
  Target,
  Trophy,
  Loader2,
  School,
  GraduationCap
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function CareerAssessmentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Mode: 'intro' | 'testing' | 'stage_transition' | 'calculating'
  const [viewState, setViewState] = useState<'intro' | 'testing' | 'stage_transition' | 'calculating'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // Student metadata
  const [studentName, setStudentName] = useState('');
  const [utisCode, setUtisCode] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('9-cu sinif');

  // Load from local storage or profile if available
  useEffect(() => {
    if (user) {
      if (user.user_metadata?.full_name) setStudentName(user.user_metadata.full_name);
      if (user.user_metadata?.utis_code) setUtisCode(user.user_metadata.utis_code);
      if (user.user_metadata?.school) setSchoolName(user.user_metadata.school);
      if (user.user_metadata?.grade) setGradeLevel(user.user_metadata.grade);
    }
  }, [user]);

  const currentQuestion: CareerQuestion = CAREER_QUESTIONS[currentQuestionIndex];
  const currentStage: CareerStage = currentQuestion ? currentQuestion.stage : 1;
  const currentMeta = STAGE_META[currentStage];
  const options = STAGE_OPTIONS[currentStage];

  const handleStart = () => {
    setViewState('testing');
    setCurrentQuestionIndex(0);
  };

  const handleSelectOption = (value: number) => {
    const nextAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(nextAnswers);

    const isLastQuestion = currentQuestionIndex === CAREER_QUESTIONS.length - 1;
    if (isLastQuestion) {
      handleFinish(nextAnswers);
      return;
    }

    const nextIndex = currentQuestionIndex + 1;
    const nextQuestion = CAREER_QUESTIONS[nextIndex];

    // Check if stage changed
    if (nextQuestion.stage !== currentQuestion.stage) {
      setViewState('stage_transition');
    } else {
      setCurrentQuestionIndex(nextIndex);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      if (viewState === 'stage_transition') {
        setViewState('testing');
      }
    }
  };

  const handleFinish = async (finalAnswers: Record<number, number>) => {
    setViewState('calculating');

    try {
      const result = calculateCareerResults(finalAnswers, {
        userId: user?.id,
        utisCode: utisCode || null,
        studentName: studentName || 'Şagird',
        schoolName: schoolName || null,
        gradeLevel: gradeLevel || null
      });

      // Save to Supabase
      const savedId = await saveCareerAssessment(result);

      // Save in session storage for fallback
      sessionStorage.setItem('latest_career_result', JSON.stringify({ ...result, id: savedId }));

      setTimeout(() => {
        if (savedId) {
          navigate(`/career/results?id=${savedId}`);
        } else {
          navigate('/career/results');
        }
      }, 1200);
    } catch (err) {
      console.error('Calculation error:', err);
      toast({
        title: 'Xəta baş verdi',
        description: 'Nəticə hesablanarkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.',
        variant: 'destructive'
      });
      setViewState('testing');
    }
  };

  // 1. INTRO VIEW
  if (viewState === 'intro') {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 sm:p-10 border border-indigo-500/20 shadow-2xl">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl space-y-4">
              <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-400/30 px-3 py-1 text-xs">
                🎯 Beynəlxalq Qiymətləndirmə Modeli
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Gələcək Peşəni və DİM İxtisas Qrupunu Kəşf Et
              </h1>
              <p className="text-indigo-200/90 text-sm sm:text-base leading-relaxed">
                Hansı sahəyə daha çox meyillisen? Holland (RIASEC) metodologiyası və Azərbaycanın 5 İxtisas Qrupu əsasında hazırlanmış 3 mərhələli bələdçi testi ilə fərdi potensialını aşkar et.
              </p>
            </div>
          </div>

          {/* 3 Stages Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border/60 hover:border-primary/40 transition-all shadow-sm">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold mb-2">
                  1
                </div>
                <CardTitle className="text-base">Maraqlar və Həvəslər</CardTitle>
                <CardDescription className="text-xs">
                  24 sual • Nə ilə məşğul olmağı və hansı fəaliyyətləri sevdiyini müəyyən edir.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/60 hover:border-primary/40 transition-all shadow-sm">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold mb-2">
                  2
                </div>
                <CardTitle className="text-base">Bacarıqlar və Güc</CardTitle>
                <CardDescription className="text-xs">
                  15 sual • Məntiqi, texniki, yaradıcı və təşkilatçılıq qabiliyyətini aşkara çıxarır.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/60 hover:border-primary/40 transition-all shadow-sm">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold mb-2">
                  3
                </div>
                <CardTitle className="text-base">İş Mühiti və Dəyərlər</CardTitle>
                <CardDescription className="text-xs">
                  9 sual • Gələcək işində sənin üçün ən vacib olan motivasiyanı müəyyən edir.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Student Info Form (Optional / Fast) */}
          <Card className="border-border/60 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                Şagird Məlumatları (Hesabat üçün)
              </CardTitle>
              <CardDescription className="text-xs">
                Nəticənizin fərdi çıxarışında və sertifikatında görünməsi üçün məlumatları daxil edə bilərsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                    Ad və Soyad
                  </label>
                  <Input
                    placeholder="Məsələn: Əli Məmmədov"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                    UTIS Kodu (varsa)
                  </label>
                  <Input
                    placeholder="Məsələn: 1234567"
                    value={utisCode}
                    onChange={(e) => setUtisCode(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                    Məktəb
                  </label>
                  <Input
                    placeholder="Məsələn: 287 saylı Zəkalar liseyi"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                    Sinif
                  </label>
                  <Input
                    placeholder="Məsələn: 9-cu və ya 10-cu sinif"
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  size="lg"
                  onClick={handleStart}
                  className="w-full sm:w-auto gap-2 bg-gradient-to-r from-indigo-600 to-primary text-white font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all text-base px-8 h-12 rounded-xl"
                >
                  <Sparkles className="w-5 h-5" />
                  Testə Başla (48 Sual)
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // 2. STAGE TRANSITION CELEBRATION VIEW
  if (viewState === 'stage_transition') {
    const nextQuestion = CAREER_QUESTIONS[currentQuestionIndex + 1];
    const prevStage = currentStage;
    const nextStage = nextQuestion ? nextQuestion.stage : 3;
    const nextMeta = STAGE_META[nextStage];

    return (
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6 bg-card border rounded-3xl p-8 sm:p-12 shadow-xl"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-500/20">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30">
              {prevStage}-ci Mərhələ Uğurla Tamamlandı! 🎉
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold">Əla gedirsən!</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              İndi isə növbəti mərhələyə keçirik:{' '}
              <span className="font-semibold text-foreground">{nextMeta.title}</span>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/50 border text-left space-y-1">
            <p className="text-xs uppercase font-bold tracking-wider text-primary">
              {nextMeta.badge}
            </p>
            <p className="text-sm font-semibold">{nextMeta.subtitle}</p>
            <p className="text-xs text-muted-foreground">{nextMeta.description}</p>
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <Button variant="outline" onClick={handlePrevious} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Əvvəlki sual
            </Button>
            <Button
              onClick={() => {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setViewState('testing');
              }}
              className="gap-2 bg-primary text-primary-foreground font-semibold px-6"
            >
              Növbəti Mərhələyə Keç <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 3. CALCULATING VIEW
  if (viewState === 'calculating') {
    return (
      <div className="container max-w-md mx-auto px-4 py-24 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 bg-card border rounded-3xl p-8 shadow-xl"
        >
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping" />
            <div className="w-20 h-20 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Brain className="w-10 h-10 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Karyera Xəritən Hesablanır...</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Holland RIASEC modeli və DİM ixtisas qrupları üzrə cavabların analiz olunur, ən uyğun peşə və fənn tövsiyələri formalaşdırılır.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-primary">
            <Loader2 className="w-4 h-4 animate-spin" />
            Bir neçə saniyəyə hazır olacaq...
          </div>
        </motion.div>
      </div>
    );
  }

  // 4. TESTING RUNNER VIEW
  const answeredCount = Object.keys(answers).length;
  const currentAnswer = answers[currentQuestion.id];

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6 sm:py-10">
      {/* Progress Bar */}
      <CareerProgressBar
        currentStage={currentStage}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={CAREER_QUESTIONS.length}
        answeredCount={answeredCount}
      />

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <Card className="border-border/80 shadow-lg rounded-3xl overflow-hidden backdrop-blur-md">
            {/* Stage header strip */}
            <div className={`p-4 bg-gradient-to-r ${currentMeta.accentColor} text-white flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 text-white border-none text-xs">
                  {currentMeta.badge}
                </Badge>
                <span className="text-xs sm:text-sm font-semibold">{currentMeta.title}</span>
              </div>
              <span className="text-xs text-white/80 hidden sm:inline">
                {currentQuestionIndex + 1} / {CAREER_QUESTIONS.length}
              </span>
            </div>

            <CardContent className="p-6 sm:p-10 space-y-8">
              {/* Question Text */}
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  {currentMeta.subtitle}
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
                  {currentQuestion.text}
                </h2>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {options.map((opt) => {
                  const isSelected = currentAnswer === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectOption(opt.value)}
                      className={`group relative p-4 rounded-2xl border text-left transition-all flex items-center gap-3.5 ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary shadow-md scale-[1.01]'
                          : 'bg-card hover:bg-muted/60 border-border/70 hover:border-primary/40'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl shrink-0 group-hover:scale-110 transition-transform">
                        {opt.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`font-semibold text-sm sm:text-base ${
                            isSelected ? 'text-primary-foreground' : 'text-foreground'
                          }`}
                        >
                          {opt.label}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-primary-foreground shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Nav Controls */}
              <div className="pt-4 border-t flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4" /> Əvvəlki
                </Button>

                {currentAnswer !== undefined && currentQuestionIndex < CAREER_QUESTIONS.length - 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                    className="gap-2 text-xs"
                  >
                    Növbəti <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
