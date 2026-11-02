import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  Award,
  BookOpen,
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Landmark,
  Globe,
  BookText,
  CheckCircle2,
  Lock,
  ArrowRight,
  User,
  School,
  Sparkles,
  AlertCircle,
  FileText,
  Clock,
  Check,
  RotateCcw,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { CandidateReviewModal, type AnswerRecord } from '@/components/exam/CandidateReviewModal';

interface CompletedAttemptInfo {
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
  specialtyTitle: string;
  answers: AnswerRecord[];
}

const GRADES = [
  { value: '8', label: 'VIII sinif' },
  { value: '9', label: 'IX sinif' },
  { value: '10', label: 'X sinif' },
  { value: '11', label: 'XI sinif' },
];

const SUBJECTS = [
  { value: 'Azərbaycan dili', label: 'Azərbaycan dili', icon: BookOpen },
  { value: 'Ədəbiyyat', label: 'Ədəbiyyat', icon: BookText },
  { value: 'Riyaziyyat', label: 'Riyaziyyat', icon: Calculator },
  { value: 'Fizika', label: 'Fizika', icon: Atom },
  { value: 'Kimya', label: 'Kimya', icon: FlaskConical },
  { value: 'Biologiya', label: 'Biologiya', icon: Dna },
  { value: 'Tarix', label: 'Tarix', icon: Landmark },
  { value: 'Coğrafiya', label: 'Coğrafiya', icon: Globe },
];

export default function OlimpiadaLoginPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [utisCode, setUtisCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('9');
  const [selectedSubject, setSelectedSubject] = useState('Riyaziyyat');
  const [isLoading, setIsLoading] = useState(false);

  const [completedInfo, setCompletedInfo] = useState<CompletedAttemptInfo | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const [existingStudent, setExistingStudent] = useState<{
    found: boolean;
    fullName?: string;
    school?: string;
    grade?: string;
    activeAttemptId?: string | null;
    activeQuizId?: string | null;
    activeSubject?: string | null;
    activeQuizTitle?: string | null;
  } | null>(null);

  const cleanUtis = utisCode.trim().replace(/\D/g, '');
  const isUtisValid = /^\d{7}$/.test(cleanUtis);

  // Auto-detect student profile & active attempt as soon as 7 digits of UTIS are entered
  React.useEffect(() => {
    if (cleanUtis.length === 7) {
      let isMounted = true;
      (async () => {
        try {
          const { data } = await supabase.rpc('get_student_by_utis', { p_utis: cleanUtis });
          if (!isMounted) return;
          if (data && typeof data === 'object' && (data as Record<string, unknown>).found) {
            const info = data as Record<string, unknown>;
            setExistingStudent({
              found: true,
              fullName: typeof info.full_name === 'string' ? info.full_name : undefined,
              school: typeof info.school === 'string' ? info.school : undefined,
              grade: typeof info.grade === 'string' ? info.grade : undefined,
              activeAttemptId: typeof info.active_attempt_id === 'string' ? info.active_attempt_id : null,
              activeQuizId: typeof info.active_quiz_id === 'string' ? info.active_quiz_id : null,
              activeSubject: typeof info.active_subject === 'string' ? info.active_subject : null,
              activeQuizTitle: typeof info.active_quiz_title === 'string' ? info.active_quiz_title : null,
            });

            if (typeof info.full_name === 'string' && info.full_name) {
              setFullName(info.full_name);
            }
            if (typeof info.school === 'string' && info.school) {
              setSchoolName(info.school);
            }
            if (typeof info.grade === 'string' && info.grade) {
              setSelectedGrade(info.grade);
            }
            if (typeof info.active_subject === 'string' && info.active_subject) {
              setSelectedSubject(info.active_subject);
            }
          } else {
            setExistingStudent(null);
          }
        } catch (err) {
          console.warn('Could not lookup student by utis:', err);
        }
      })();
      return () => {
        isMounted = false;
      };
    } else {
      setExistingStudent(null);
    }
  }, [cleanUtis]);

  const isNameValid = fullName.trim().length >= 3;
  const isFormValid = isUtisValid && isNameValid && !!selectedGrade && !!selectedSubject;

  const handleStartExam = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      if (!isUtisValid) {
        toast.error('UTİS kodu mütləq 7 rəqəmdən ibarət olmalıdır (məsələn: 1234567)');
      } else if (!isNameValid) {
        toast.error('Zəhmət olmasa şagirdin ad və soyadını daxil edin');
      } else if (!selectedGrade) {
        toast.error('Zəhmət olmasa sinfi seçin');
      } else if (!selectedSubject) {
        toast.error('Zəhmət olmasa fənni seçin');
      }
      return;
    }

    setIsLoading(true);
    try {
      // 1. Find matching Olympiad quiz from database
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('id, title, grade, subject, share_code, access_password, duration, question_count')
        .eq('grade', selectedGrade)
        .eq('subject', selectedSubject)
        .eq('exam_category', 'Olimpiada')
        .maybeSingle();

      if (quizError || !quizData) {
        throw new Error(`${selectedGrade}-ci sinif üçün "${selectedSubject}" üzrə Zəfər Olimpiadası quizi tapılmadı.`);
      }

      // 2. Check if student already exists
      const { data: existsData } = await supabase.rpc('check_student_by_utis', {
        p_utis: cleanUtis,
      });
      const isExistingStudent = Boolean(existsData);

      // 3. Deterministic student auth
      const email = `utis_${cleanUtis.toLowerCase()}@imtahan.store`;
      const password = `Utis2026_${cleanUtis}!`;
      let authUserId: string | null = null;

      if (isExistingStudent) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          // If password mismatch, try sign up fallback
          const { data: fbData } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                role: 'student',
                full_name: fullName.trim(),
                utis: cleanUtis,
                grade: selectedGrade,
                school: schoolName.trim() || 'Məktəb',
              },
            },
          });
          authUserId = fbData?.user?.id ?? null;
        } else {
          authUserId = signInData?.user?.id ?? null;
        }
      } else {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: 'student',
              full_name: fullName.trim(),
              utis: cleanUtis,
              grade: selectedGrade,
              school: schoolName.trim() || 'Məktəb',
            },
          },
        });

        if (signUpError) {
          // Already registered? Fallback to signIn
          const { data: fbSignIn } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          authUserId = fbSignIn?.user?.id ?? null;
        } else {
          authUserId = signUpData?.user?.id ?? null;
        }
      }

      if (!authUserId) {
        throw new Error('Şagird sessiyası təsdiqlənə bilmədi. Zəhmət olmasa yenidən cəhd edin.');
      }

      // 4. Update profile details (preserve original full_name if existing student, so typos do not corrupt it)
      const finalFullName = (existingStudent?.found && existingStudent.fullName) ? existingStudent.fullName : fullName.trim();
      await supabase
        .from('profiles')
        .update({
          full_name: finalFullName,
          utis_code: cleanUtis,
          fin: cleanUtis,
          grade: selectedGrade,
          school: schoolName.trim() || 'Məktəb',
          specialty: `Zəfər Olimpiadası (${selectedGrade}-ci sinif) — ${selectedSubject}`,
        })
        .eq('user_id', authUserId);

      // 5. Check if attempt already completed
      const { data: attemptsData } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('quiz_id', quizData.id)
        .eq('user_id', authUserId)
        .order('started_at', { ascending: false });

      const completed = attemptsData?.find((att) => att.completed_at !== null);

      const isPrivilegedTester =
        authUserId === 'e1703786-e31c-4f38-bdd7-8b3192cc6321' ||
        authUserId === '81cebd9d-586b-4460-8615-6cb0ed9d1094' ||
        cleanUtis === '3440725';

      if (completed && !isPrivilegedTester) {
        // Parse answers if available
        let rawAnswers: AnswerRecord[] = [];
        if (Array.isArray(completed.answers)) {
          rawAnswers = (completed.answers as unknown[]).map((a) => {
            const item = (a && typeof a === 'object' ? a : {}) as Record<string, unknown>;
            return {
              questionId: String(item.questionId || item.question_id || ''),
              textAnswer: typeof item.textAnswer === 'string' ? item.textAnswer : typeof item.answer === 'string' ? item.answer : undefined,
              isCorrect: typeof item.isCorrect === 'boolean' ? item.isCorrect : undefined,
              pointsEarned: typeof item.pointsEarned === 'number' ? item.pointsEarned : undefined,
            };
          });
        }

        setCompletedInfo({
          quizId: quizData.id,
          userId: authUserId,
          score: completed.score ?? 0,
          totalQuestions: completed.total_questions ?? quizData.question_count ?? 20,
          percentage: completed.score ?? 0,
          completedAt: completed.completed_at || '',
          specialtyTitle: quizData.title,
          answers: rawAnswers,
        });

        toast.info('Siz bu fənn üzrə imtahanı artıq tamamlamısınız.');
        return;
      }

      // 6. Direct entry into quiz (without password prefill, so all students wait and start together)
      toast.success(`Xoş gəldiniz, ${fullName.trim()}! İmtahana keçid edilir...`);
      navigate(`/quiz/${quizData.share_code || quizData.id}`);
    } catch (err) {
      console.error('Olimpiada login error:', err);
      toast.error(err instanceof Error ? err.message : 'İmtahana daxil olarkən xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAttemptForTest = async () => {
    if (!completedInfo) return;
    try {
      setIsLoading(true);
      await supabase.from('quiz_results').delete().eq('quiz_id', completedInfo.quizId).eq('user_id', completedInfo.userId);
      await supabase.from('quiz_attempts').delete().eq('quiz_id', completedInfo.quizId).eq('user_id', completedInfo.userId);
      toast.success('Test cəhdi sıfırlandı. İmtahana yönləndirilirsiniz...');
      const targetQuizId = completedInfo.quizId;
      setCompletedInfo(null);
      navigate(`/quiz/${targetQuizId}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Xəta baş verdi';
      toast.error(`Xəta: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[380px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="w-full border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-foreground block leading-tight">
                Zəfər Olimpiadası
              </span>
              <span className="text-[11px] font-medium text-muted-foreground block">
                Məktəbli Sınaq İmtahanı Portalı
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/imtahan')}
              className="text-xs font-semibold gap-1.5 h-9 rounded-xl hidden sm:flex"
            >
              <Award className="w-3.5 h-3.5 text-blue-600" />
              Rəsmi İmtahan Portalı
            </Button>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Portal Switcher Tabs */}
      <div className="max-w-xl mx-auto px-4 pt-6 w-full">
        <div className="bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-2xl flex items-center text-xs font-bold">
          <button
            type="button"
            className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm flex items-center justify-center gap-2 transition-all"
          >
            <Trophy className="w-4 h-4" />
            Zəfər Olimpiadası (Şagirdlər)
          </button>
          <button
            type="button"
            onClick={() => navigate('/imtahan')}
            className="flex-1 py-2 px-3 rounded-xl text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 transition-all"
          >
            <Award className="w-4 h-4" />
            Rəsmi İxtisas İmtahanları
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-xl"
        >
          {completedInfo ? (
            <Card className="border-border/60 shadow-xl rounded-3xl overflow-hidden bg-card backdrop-blur-xl">
              <CardHeader className="text-center pb-4 pt-8 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-black">
                  İmtahan Tamamlanmışdır
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Hörmətli <span className="font-bold text-foreground">{fullName}</span>, siz bu fənn üzrə imtahanda artıq iştirak etmisiniz.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 px-6 sm:px-8">
                <div className="p-4 rounded-2xl bg-muted/50 border border-border/50 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">İmtahan:</span>
                    <span className="font-bold text-right text-foreground">{completedInfo.specialtyTitle}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">UTİS Kodu:</span>
                    <Badge variant="outline" className="font-mono">{cleanUtis}</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Toplanan Bal:</span>
                    <span className="font-black text-blue-600 dark:text-blue-400 text-lg">
                      {completedInfo.score} / {completedInfo.totalQuestions}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    onClick={() => setIsReviewOpen(true)}
                    variant="outline"
                    className="flex-1 h-12 rounded-xl font-bold gap-2"
                  >
                    <FileText className="w-4 h-4 text-blue-600" />
                    Cavablarıma Bax
                  </Button>
                  <Button
                    onClick={() => {
                      setCompletedInfo(null);
                      setSelectedSubject('');
                    }}
                    className="flex-1 h-12 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Başqa Fənn Seç
                  </Button>
                </div>

                <div className="pt-2 border-t border-border/40 text-center">
                  <Button
                    type="button"
                    onClick={handleResetAttemptForTest}
                    variant="ghost"
                    className="w-full text-amber-700 hover:text-amber-800 hover:bg-amber-100/60 dark:text-amber-400 dark:hover:bg-amber-950/40 text-xs font-semibold gap-1.5 h-9 rounded-lg"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Test üçün bu fəndən cəhdi sıfırla və təkrar başla</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/60 shadow-xl rounded-3xl overflow-hidden bg-card backdrop-blur-xl">
              <CardHeader className="pb-4 pt-6 px-6 sm:px-8 text-center border-b border-border/40">
                <Badge variant="secondary" className="mx-auto mb-2 font-bold px-3 py-1 text-[11px] gap-1.5 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  Məktəblilər Üçün Rəsmi Sınaq
                </Badge>
                <CardTitle className="text-xl sm:text-2xl font-black text-foreground">
                  Zəfər Olimpiadasına Giriş
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  UTİS kodunuzu daxil edib, sinif və fənni seçərək birbaşa imtahana qoşulun
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleStartExam}>
                <CardContent className="space-y-5 px-6 sm:px-8 pt-6">
                  {/* UTIS Code */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="utisCode" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-blue-600" />
                        Şagirdin UTİS Kodu *
                      </Label>
                      <span className={cn(
                        "text-[11px] font-mono transition-colors",
                        cleanUtis.length === 7 ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-muted-foreground"
                      )}>
                        {cleanUtis.length} / 7 rəqəm
                      </span>
                    </div>
                    <Input
                      id="utisCode"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={utisCode}
                      onChange={(e) => setUtisCode(e.target.value.replace(/\D/g, '').slice(0, 7))}
                      placeholder="Məsələn: 1234567"
                      className="h-12 rounded-xl text-base font-mono font-bold tracking-wider border-border/80 focus-visible:ring-blue-600"
                      maxLength={7}
                      required
                    />
                  </div>

                  {existingStudent?.found && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "p-3 rounded-xl border text-xs flex items-start gap-2.5",
                        existingStudent.activeSubject
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
                          : "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                      )}
                    >
                      <CheckCircle2 className={cn("w-4 h-4 shrink-0 mt-0.5", existingStudent.activeSubject ? "text-amber-600" : "text-emerald-600")} />
                      <div className="flex-1 space-y-0.5">
                        <p className="font-bold">
                          {existingStudent.fullName ? `Xoş gəldiniz, ${existingStudent.fullName}!` : 'Şagird məlumatları aşkarlandı!'}
                        </p>
                        {existingStudent.activeSubject ? (
                          <p className="text-[11px] leading-relaxed opacity-90">
                            <strong>Davam edən imtahanınız var:</strong> {existingStudent.activeQuizTitle || existingStudent.activeSubject}. Qaldığınız yerdən davam etmək üçün <strong>İmtahana Başla</strong> düyməsini sıxın.
                          </p>
                        ) : (
                          <p className="text-[11px] opacity-80">
                            Məlumatlarınız təsdiqləndi. İmtahan verəcəyiniz fənni seçərək daxil ola bilərsiniz.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Student Full Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      Ad və Soyadınız *
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Məsələn: Murad Əliyev"
                      className="h-12 rounded-xl text-base border-border/80 focus-visible:ring-blue-600"
                      required
                    />
                  </div>

                  {/* School / District (Optional) */}
                  <div className="space-y-1.5">
                    <Label htmlFor="schoolName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <School className="w-3.5 h-3.5 text-blue-600" />
                      Məktəb / Rayon (Könüllü)
                    </Label>
                    <Input
                      id="schoolName"
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="Məsələn: Bakı ş., 23 nömrəli məktəb"
                      className="h-11 rounded-xl text-sm border-border/80 focus-visible:ring-blue-600"
                    />
                  </div>

                  {/* Grade Selection */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                      Sinifinizi Seçin *
                    </Label>
                    <div className="grid grid-cols-4 gap-2">
                      {GRADES.map((g) => {
                        const isSelected = selectedGrade === g.value;
                        return (
                          <button
                            key={g.value}
                            type="button"
                            onClick={() => setSelectedGrade(g.value)}
                            className={cn(
                              'py-2.5 px-2 rounded-xl text-center font-bold text-xs sm:text-sm border transition-all',
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                                : 'bg-muted/40 hover:bg-muted text-foreground border-border/60'
                            )}
                          >
                            {g.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Subject Selection */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                      İmtahan Fənnini Seçin *
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SUBJECTS.map((s) => {
                        const Icon = s.icon;
                        const isSelected = selectedSubject === s.value;
                        return (
                          <button
                            key={s.value}
                            type="button"
                            onClick={() => setSelectedSubject(s.value)}
                            className={cn(
                              'p-2.5 rounded-xl text-left border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold text-center',
                              isSelected
                                ? 'bg-blue-50 text-blue-700 border-blue-500 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-500 shadow-sm'
                                : 'bg-muted/40 hover:bg-muted text-foreground border-border/60'
                            )}
                          >
                            <Icon className={cn('w-4 h-4', isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground')} />
                            <span className="truncate w-full">{s.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Müddət: <strong className="text-foreground">40 dəqiqə</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Trophy className="w-4 h-4 text-blue-600" />
                      <span>Sual: <strong className="text-foreground">19-20 sual</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Keçid: <strong className="text-foreground">60%</strong></span>
                    </div>
                  </div>

                  {/* Password & Synchronized Start Notice */}
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-0.5">İmtahana Giriş Şifrəsi</p>
                      <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                        Hamının eyni vaxtda başlaması üçün giriş şifrəsi nəzarətçi tərəfindən otaqda elan ediləcək. Şifrəni daxil etməyən şagird imtahana başlaya bilməz.
                      </p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="px-6 sm:px-8 pb-6 pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading || !isFormValid}
                    className="w-full h-12 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 gap-2"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Giriş edilir...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        İmtahana Başla
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}
        </motion.div>
      </main>

      {/* Candidate Review Modal */}
      {completedInfo && (
        <CandidateReviewModal
          open={isReviewOpen}
          onOpenChange={setIsReviewOpen}
          quizId={completedInfo.quizId}
          answers={completedInfo.answers}
          candidateName={fullName}
          fin={cleanUtis}
          specialtyTitle={completedInfo.specialtyTitle}
          score={completedInfo.score}
          completedAt={completedInfo.completedAt}
        />
      )}

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-muted-foreground border-t border-border/40">
        © 2026 imtahan.store — Zəfər Olimpiadası Şagird Portalı. Bütün hüquqlar qorunur.
      </footer>
    </div>
  );
}
