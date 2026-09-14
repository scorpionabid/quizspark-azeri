import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { OFFICIAL_EXAMS } from '@/lib/constants/exams';
import { cn } from '@/lib/utils';

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
  const [fin, setFin] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedKey, setSelectedKey] = useState('');
  const [examCode, setExamCode] = useState('');
  const [agreed, setAgreed] = useState(false);
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
  const isFormValid = isFinValid && isNameValid && !!selectedKey && isCodeValid && agreed;

  const handleStartExam = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!settings?.is_active) {
      toast.error('İmtahan portalı hazırda qapalıdır! İmtahan vaxtını gözləyin.');
      return;
    }

    if (!isFormValid) {
      if (!isFinValid) {
        toast.error('FİN kod dəqiq 7 simvoldan ibarət olmalıdır (Məsələn: 7ABC123)');
      } else if (!isNameValid) {
        toast.error('Zəhmət olmasa Ad və Soyadınızı daxil edin');
      } else if (!selectedKey) {
        toast.error('Zəhmət olmasa imtahan ixtisasını seçin');
      } else if (!isCodeValid) {
        toast.error('İmtahan zalında nəzarətçi tərəfindən verilən imtahan kodunu daxil edin');
      } else if (!agreed) {
        toast.error('İmtahan qaydaları ilə razılaşmalısınız');
      }
      return;
    }

    if (!settings.is_active) {
      toast.error('İmtahan portalı hələ aktivləşdirilməyib. Zəhmət olmasa zal nəzarətçisinin təlimatını gözləyin.');
      return;
    }

    // Verify access code
    if (cleanExamCode !== settings.access_code.trim()) {
      toast.error('İmtahan giriş kodu yanlışdır! Yalnız nəzarətçi tərəfindən elan olunan parolu daxil edin.');
      return;
    }

    setIsLoading(true);
    try {
      const selectedExam = OFFICIAL_EXAMS.find((item) => item.key === selectedKey);
      if (!selectedExam) {
        throw new Error('Seçilmiş ixtisas tapılmadı');
      }

      // 1. Fetch official quiz record
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('id, title, pass_percentage, duration, question_count')
        .eq('specialty_key', selectedKey)
        .eq('exam_category', 'official_exam')
        .maybeSingle();

      if (quizError || !quizData) {
        throw new Error('İxtisasa uyğun rəsmi test bazası tapılmadı. Zəhmət olmasa inzibatçıya müraciət edin.');
      }

      // 2. Deterministic candidate auth
      const email = `fin_${cleanFin.toLowerCase()}@imtahan.store`;
      const password = `Imtahan2026_${cleanFin}!`;

      let authUserId: string | null = null;

      // Check if user already exists to eliminate console 400 Bad Request
      let isExistingCandidate = false;
      try {
        const { data: exists } = await supabase.rpc('check_candidate_exists', { p_fin: cleanFin });
        isExistingCandidate = Boolean(exists);
      } catch {
        isExistingCandidate = false;
      }

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
          // If already registered in an edge case, fallback to signIn
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

      // 3. Update profile with current full name and specialty
      await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          fin: cleanFin,
          specialty: selectedExam.title,
          school: selectedExam.title,
        })
        .eq('user_id', authUserId);

      // 4. Check previous completed attempts
      const { data: existingAttempts, error: attemptError } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('quiz_id', quizData.id)
        .eq('user_id', authUserId)
        .order('started_at', { ascending: false });

      if (attemptError) {
        console.warn('Attempt check warning:', attemptError);
      }

      const completed = existingAttempts?.find((att) => att.completed_at !== null);
      if (completed) {
        setCompletedInfo({
          quizId: quizData.id,
          score: completed.score ?? 0,
          totalQuestions: completed.total_questions ?? 60,
          percentage: completed.score ?? 0,
          completedAt: completed.completed_at,
          specialtyTitle: selectedExam.title,
        });
        toast.info('Siz bu imtahanı artıq tamamlamısınız.');
        setIsLoading(false);
        return;
      }

      // 5. Navigate to Quiz
      toast.success('İmtahana xoş gəlmisiniz! Uğurlar arzulayırıq.');
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
      {/* Clean Minimal Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center mb-6"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          İmtahan Portalı
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Daxil olmaq üçün məlumatlarınızı qeyd edin
        </p>
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
              <p className="text-sm text-slate-500">Yoxlanılır...</p>
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
                İmtahan Artıq Tamamlanıb
              </CardTitle>
              <CardDescription className="text-xs">
                Bu FİN kod ilə imtahan artıq təhvil verilib.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-6 py-4">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">FİN Kod:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{cleanFin}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">Ad, Soyad:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{fullName}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">İxtisas:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{completedInfo.specialtyTitle}</span>
                </div>
                <div className="flex justify-between py-0.5 border-t border-slate-200 dark:border-slate-700 pt-1.5">
                  <span className="text-slate-500">Yekun Nəticə:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    %{completedInfo.percentage} ({completedInfo.score} Bal)
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">Tarix:</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {new Date(completedInfo.completedAt).toLocaleString('az-AZ')}
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
                Digər FİN ilə Giriş
              </Button>
            </CardFooter>
          </Card>
        ) : (
          /* ACTIVE EXAM FORM */
          <Card className="border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900">
            <CardHeader className="pb-3 pt-6 px-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                  İştirakçı Girişi
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
                  {settings?.is_active ? 'Aktivdir' : 'Gözləmə Rejimi'}
                </Badge>
              </div>
              {!settings?.is_active && (
                <div className="mt-2 p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs">
                  İmtahan nəzarətçi tərəfindən aktiv edildikdən sonra daxil ola bilərsiniz.
                </div>
              )}
            </CardHeader>

            <CardContent className="px-6 pb-6 pt-2">
              <form onSubmit={handleStartExam} className="space-y-3.5">
                {/* FIN input */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Label htmlFor="fin" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      FİN Kod <span className="text-red-500">*</span>
                    </Label>
                    <span className="text-[11px] text-slate-400">{cleanFin.length} / 7</span>
                  </div>
                  <div className="relative">
                    <Input
                      id="fin"
                      value={fin}
                      onChange={(e) => setFin(e.target.value.toUpperCase().slice(0, 7))}
                      placeholder="7 simvollu FİN kod"
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
                    Ad və Soyad <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ad və soyadınızı daxil edin"
                    className="h-10 text-sm"
                    autoComplete="name"
                    required
                  />
                </div>

                {/* Specialty Select */}
                <div className="space-y-1">
                  <Label htmlFor="specialty" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    İmtahan İxtisası <span className="text-red-500">*</span>
                  </Label>
                  <Select value={selectedKey} onValueChange={setSelectedKey}>
                    <SelectTrigger id="specialty" className="h-10 text-sm">
                      <SelectValue placeholder="İxtisası seçin..." />
                    </SelectTrigger>
                    <SelectContent>
                      {OFFICIAL_EXAMS.map((exam) => (
                        <SelectItem key={exam.key} value={exam.key} className="py-2">
                          <span className="font-medium">{exam.title}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Access Code */}
                <div className="space-y-1">
                  <Label htmlFor="examCode" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Zal Kodu (Giriş Şifrəsi) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="examCode"
                    type="password"
                    value={examCode}
                    onChange={(e) => setExamCode(e.target.value)}
                    placeholder="Nəzarətçi tərəfindən elan edilən kod"
                    className="h-10 text-sm"
                    autoComplete="off"
                    required
                  />
                </div>

                {/* Agreement */}
                <div className="flex items-center space-x-2 pt-1">
                  <Checkbox
                    id="agreed"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(!!checked)}
                  />
                  <Label
                    htmlFor="agreed"
                    className="text-xs cursor-pointer text-slate-600 dark:text-slate-400 select-none"
                  >
                    Məlumatların düzgünlüyünü təsdiq edirəm
                  </Label>
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
                      Giriş edilir...
                    </span>
                  ) : !settings?.is_active ? (
                    <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Başlaması Gözlənilir
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      İmtahana Başla <ArrowRight className="w-4 h-4" />
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
