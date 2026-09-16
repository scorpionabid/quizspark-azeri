import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Shield,
  Award,
  Clock,
  FileCheck,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
  User,
  KeyRound,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { OFFICIAL_EXAMS } from '@/lib/constants/exams';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

interface CompletedAttemptInfo {
  quizId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
  specialtyTitle: string;
}

interface ExamSettings {
  is_active: boolean;
  access_code: string;
}

export default function ExamLoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { language, t } = useLanguage();
  const [fin, setFin] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedKey, setSelectedKey] = useState('');
  const [examCode, setExamCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [completedInfo, setCompletedInfo] = useState<CompletedAttemptInfo | null>(null);

  const [settings, setSettings] = useState<ExamSettings | null>(null);
  const [isCheckingSettings, setIsCheckingSettings] = useState(true);

  // Fetch lock/active status from official_exam_settings
  const fetchSettings = async () => {
    setIsCheckingSettings(true);
    try {
      const { data, error } = await supabase
        .from('official_exam_settings')
        .select('is_active, access_code')
        .eq('id', 'current')
        .maybeSingle();

      if (error) {
        console.warn('Could not fetch exam settings:', error);
      }
      if (data) {
        setSettings({
          is_active: data.is_active,
          access_code: data.access_code,
        });
      } else {
        setSettings({ is_active: false, access_code: 'EXAM2026' });
      }
    } catch (e) {
      console.error('Settings error:', e);
      setSettings({ is_active: false, access_code: 'EXAM2026' });
    } finally {
      setIsCheckingSettings(false);
    }
  };

  useEffect(() => {
    void fetchSettings();
  }, []);

  const cleanFin = fin.trim().toUpperCase();
  const cleanExamCode = examCode.trim();
  const isFinValid = /^[0-9A-Z]{7}$/.test(cleanFin);
  const isNameValid = fullName.trim().length >= 3;
  const isCodeValid = cleanExamCode.length >= 4;
  const isFormValid = isFinValid && isNameValid && !!selectedKey && isCodeValid;

  const handleStartExam = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!settings?.is_active) {
      toast.error(t('portal_closed'));
      return;
    }

    if (!isFormValid) {
      if (!isFinValid) {
        toast.error(t('err_fin_req'));
      } else if (!isNameValid) {
        toast.error(t('err_name_req'));
      } else if (!selectedKey) {
        toast.error(t('err_specialty_req'));
      } else if (!isCodeValid) {
        toast.error(t('err_code_req'));
      }
      return;
    }

    // Verify access code
    if (cleanExamCode !== settings.access_code.trim()) {
      toast.error(t('err_wrong_code'));
      return;
    }

    setIsLoading(true);
    try {
      const selectedExam = OFFICIAL_EXAMS.find((item) => item.key === selectedKey);
      if (!selectedExam) {
        throw new Error('Seçilmiş ixtisas tapılmadı');
      }

      // 1. Fetch official quiz record and check candidate existence in PARALLEL
      const [quizResponse, existsResponse] = await Promise.all([
        supabase
          .from('quizzes')
          .select('*')
          .eq('specialty_key', selectedKey)
          .eq('exam_category', 'official_exam')
          .maybeSingle(),
        supabase.rpc('check_candidate_exists', { p_fin: cleanFin }),
      ]);

      const quizData = quizResponse.data;
      if (quizResponse.error || !quizData) {
        throw new Error('İxtisasa uyğun rəsmi test bazası tapılmadı. Zəhmət olmasa inzibatçıya müraciət edin.');
      }

      const isExistingCandidate = Boolean(existsResponse.data);

      // 2. Deterministic candidate auth
      const email = `fin_${cleanFin.toLowerCase()}@imtahan.store`;
      const password = `Imtahan2026_${cleanFin}!`;
      let authUserId: string | null = null;

      if (isExistingCandidate) {
        // Existing candidate -> direct signIn
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw new Error(`Daxilolma xətası: ${signInError.message}`);
        }
        if (signInData?.user) {
          authUserId = signInData.user.id;
        }
      } else {
        // New candidate -> direct signUp (no 400 Bad Request in console!)
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: 'student',
              full_name: fullName.trim(),
              fin: cleanFin,
              specialty: selectedExam.title,
            },
          },
        });

        if (signUpError) {
          if (signUpError.message?.toLowerCase().includes('already') || signUpError.message?.toLowerCase().includes('registered')) {
            const { data: fallbackSignIn, error: fallbackError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            if (fallbackError) throw new Error(`Daxilolma xətası: ${fallbackError.message}`);
            authUserId = fallbackSignIn?.user?.id ?? null;
          } else {
            throw new Error(`Qeydiyyat xətası: ${signUpError.message}`);
          }
        } else if (signUpData?.user) {
          authUserId = signUpData.user.id;
        }
      }

      if (!authUserId) {
        throw new Error('İstifadəçi sessiyası yaradıla bilmədi');
      }

      // 3. Update profile and check attempts in PARALLEL
      const [profileUpdate, attemptsResponse] = await Promise.all([
        supabase
          .from('profiles')
          .update({
            full_name: fullName.trim(),
            fin: cleanFin,
            specialty: selectedExam.title,
            school: selectedExam.title,
          })
          .eq('user_id', authUserId),
        supabase
          .from('quiz_attempts')
          .select('*')
          .eq('quiz_id', quizData.id)
          .eq('user_id', authUserId)
          .order('started_at', { ascending: false }),
      ]);

      if (profileUpdate.error) {
        console.warn('Profile update warning:', profileUpdate.error);
      }
      if (attemptsResponse.error) {
        console.warn('Attempt check warning:', attemptsResponse.error);
      }

      const existingAttempts = attemptsResponse.data || [];
      const completed = existingAttempts.find((att) => att.completed_at !== null);

      if (completed) {
        setCompletedInfo({
          quizId: quizData.id,
          score: completed.score ?? 0,
          totalQuestions: completed.total_questions ?? 60,
          percentage: completed.score ?? 0,
          completedAt: completed.completed_at,
          specialtyTitle: language === 'ka' ? selectedExam.title_ka : selectedExam.title,
        });
        toast.info(t('already_completed'));
        setIsLoading(false);
        return;
      }

      // 4. Seed TanStack Query cache for INSTANT (0ms) QuizPage transition
      queryClient.setQueryData(['quiz', quizData.id], quizData);
      queryClient.setQueryData(['attempts', authUserId, quizData.id], existingAttempts);

      // 5. Prefetch 60 questions with translations immediately in background
      void queryClient.prefetchQuery({
        queryKey: ['questions', quizData.id, language],
        queryFn: async () => {
          const { data } = await supabase
            .from('questions')
            .select('*, question_translations(*)')
            .eq('quiz_id', quizData.id)
            .order('order_index', { ascending: true });
          return data || [];
        },
        staleTime: 60 * 1000,
      });

      // 6. Navigate to Quiz
      toast.success(t('welcome_exam'));
      navigate(`/quiz/${quizData.id}`);
    } catch (err: unknown) {
      console.error('Exam login error:', err);
      const msg = err instanceof Error ? err.message : 'Gözlənilməz xəta baş verdi';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 flex flex-col justify-center items-center">
      {/* Minimal Header with Language Switcher */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              QS
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">QuizSpark Exam</span>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('exam_portal')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('exam_portal_desc')}
          </p>
        </div>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="max-w-md w-full"
      >
        {isCheckingSettings ? (
          <Card className="border-slate-200 dark:border-slate-800 p-10 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-7 h-7 text-blue-600 animate-spin" />
              <p className="text-sm text-slate-500">{t('checking_btn')}</p>
            </div>
          </Card>
        ) : completedInfo ? (
          /* ALREADY COMPLETED STATE */
          <Card className="border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-slate-900">
            <CardHeader className="text-center pb-2 pt-6">
              <div className="mx-auto w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                {t('already_completed')}
              </CardTitle>
              <CardDescription className="text-xs">
                {language === 'ka' 
                  ? 'ამ პირადი ნომრით გამოცდა უკვე ჩაბარებულია.'
                  : 'Bu FİN kod ilə imtahan artıq təhvil verilib.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-6 py-4">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">{t('fin_label')}:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{cleanFin}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">{t('fullname_label')}:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{fullName}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">{t('specialty_label')}:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{completedInfo.specialtyTitle}</span>
                </div>
                <div className="flex justify-between py-0.5 border-t border-slate-200 dark:border-slate-700 pt-1.5">
                  <span className="text-slate-500">{t('result')}:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    %{completedInfo.percentage} ({completedInfo.score} Bal)
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">{language === 'ka' ? 'თარიღი' : 'Tarix'}:</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {new Date(completedInfo.completedAt).toLocaleString(language === 'ka' ? 'ka-GE' : 'az-AZ')}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-6 pb-6 pt-0">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setCompletedInfo(null);
                  setFin('');
                  setSelectedKey('');
                  setExamCode('');
                }}
              >
                {language === 'ka' ? 'სხვა FIN-ით შესვლა' : 'Digər FİN ilə Giriş'}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          /* ACTIVE EXAM FORM */
          <Card className="border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900">
            <CardHeader className="pb-3 pt-6 px-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                  {language === 'ka' ? 'მონაწილის შესვლა' : 'İştirakçı Girişi'}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs px-2.5 py-0.5",
                    settings?.is_active
                      ? "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"
                      : "border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/40"
                  )}
                >
                  {settings?.is_active 
                    ? (language === 'ka' ? 'აქტიურია' : 'Aktivdir') 
                    : (language === 'ka' ? 'მოლოდინის რეჟიმი' : 'Gözləmə Rejimi')}
                </Badge>
              </div>
              {!settings?.is_active && (
                <div className="mt-2 p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs">
                  {t('portal_closed')}
                </div>
              )}
            </CardHeader>

            <CardContent className="px-6 pb-6 pt-2">
              <form onSubmit={handleStartExam} className="space-y-3.5">
                {/* FIN input */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Label htmlFor="fin" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t('fin_label')} <span className="text-red-500">*</span>
                    </Label>
                    <span className="text-[11px] text-slate-400">{cleanFin.length} / 7</span>
                  </div>
                  <div className="relative">
                    <Input
                      id="fin"
                      value={fin}
                      onChange={(e) => setFin(e.target.value.toUpperCase().slice(0, 7))}
                      placeholder={t('fin_placeholder')}
                      maxLength={7}
                      className="font-mono text-sm tracking-wider uppercase font-semibold h-10 pl-3 pr-10"
                      autoComplete="off"
                      required
                    />
                    {isFinValid && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-3 pointer-events-none" />
                    )}
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <Label htmlFor="fullName" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t('fullname_label')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('fullname_placeholder')}
                    className="h-10 text-sm"
                    autoComplete="name"
                    required
                  />
                </div>

                {/* Specialty Select */}
                <div className="space-y-1">
                  <Label htmlFor="specialty" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t('specialty_label')} <span className="text-red-500">*</span>
                  </Label>
                  <Select value={selectedKey} onValueChange={setSelectedKey}>
                    <SelectTrigger id="specialty" className="h-10 text-sm">
                      <SelectValue placeholder={t('specialty_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {OFFICIAL_EXAMS.map((exam) => (
                        <SelectItem key={exam.key} value={exam.key} className="py-2">
                          <span className="font-medium">
                            {language === 'ka' ? exam.title_ka : exam.title}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Access Code */}
                <div className="space-y-1">
                  <Label htmlFor="examCode" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t('exam_code_label')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="examCode"
                    type="text"
                    value={examCode}
                    onChange={(e) => setExamCode(e.target.value)}
                    placeholder={t('exam_code_placeholder')}
                    className="h-10 text-sm font-medium uppercase tracking-wider"
                    autoComplete="off"
                    required
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={!isFormValid || isLoading || !settings?.is_active}
                  className="w-full h-11 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      {t('checking_btn')}
                    </span>
                  ) : !settings?.is_active ? (
                    <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4" /> {language === 'ka' ? 'დაწყების მოლოდინში' : 'Başlaması Gözlənilir'}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {t('start_exam_btn')} <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
