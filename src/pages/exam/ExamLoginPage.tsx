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

      // Try signIn first
      let authUserId: string | null = null;
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInData?.user) {
        authUserId = signInData.user.id;
      } else if (signInError) {
        // User might not exist yet, attempt signUp
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
          throw new Error(`Daxilolma xətası: ${signUpError.message}`);
        }
        if (signUpData?.user) {
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 flex flex-col justify-center items-center">
      {/* Official Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center mb-8"
      >
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-950/60 rounded-2xl mb-4 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200/60 dark:border-blue-800">
          <Shield className="w-10 h-10" />
        </div>
        <h3 className="text-xs font-bold tracking-widest text-blue-700 dark:text-blue-400 uppercase mb-2">
          Azərbaycan Respublikası Elm və Təhsil Nazirliyi
        </h3>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight mb-2">
          Məktəbəqədər və Ümumi Təhsil üzrə Dövlət Agentliyi
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
          Ümumi Təhsil Müəssisələrində Vakant Vəzifələrə İşə Qəbul İmtahanı Portalı
        </p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl w-full"
      >
        {isCheckingSettings ? (
          <Card className="border-slate-200 dark:border-slate-800 p-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm text-slate-500">İmtahan serverinin statusu yoxlanılır...</p>
            </div>
          </Card>
        ) : !settings?.is_active ? (
          /* LOCKED / CLOSED STATE */
          <Card className="border-red-200 dark:border-red-900/60 shadow-xl bg-white dark:bg-slate-900 text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-950/60 text-red-600 rounded-full flex items-center justify-center mb-3">
                <Lock className="w-8 h-8" />
              </div>
              <Badge variant="outline" className="mx-auto border-red-400 text-red-600 bg-red-50 dark:bg-red-950/40 mb-2">
                Giriş Qadağandır • Sistem Qapalıdır
              </Badge>
              <CardTitle className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                İmtahan Portalı Hazırda Qapalıdır
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300 text-sm max-w-lg mx-auto pt-2 leading-relaxed">
                Hörmətli namizəd, imtahan sessiyası yalnız rəsmi təyin olunmuş vaxtda və imtahan zalında nəzarətçi tərəfindən aktivləşdiriləcəkdir. Hələlik sistemə giriş tam qapalıdır.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-left space-y-2">
                <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-500" /> Təlimat:
                </div>
                <p>1. Zəhmət olmasa təyin edilmiş imtahan saatını və nəzarətçinin göstərişini gözləyin.</p>
                <p>2. İmtahan aktivləşdirildikdə nəzarətçi tərəfindən zalda xüsusi <strong>İmtahan Giriş Parolu</strong> elan olunacaqdır.</p>
                <p>3. Statusu yenidən yoxlamaq üçün aşağıdakı düyməyə basa bilərsiniz.</p>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button
                variant="outline"
                onClick={fetchSettings}
                className="w-full flex items-center justify-center gap-2 h-11"
              >
                <RefreshCw className="w-4 h-4" /> Statusu Yenidən Yoxla
              </Button>
            </CardFooter>
          </Card>
        ) : completedInfo ? (
          /* ALREADY COMPLETED STATE */
          <Card className="border-blue-200 dark:border-blue-900 shadow-xl bg-white dark:bg-slate-900">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-14 h-14 bg-amber-100 dark:bg-amber-950/60 text-amber-600 rounded-full flex items-center justify-center mb-2">
                <AlertCircle className="w-8 h-8" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                İmtahan Artıq Tamamlanıb
              </CardTitle>
              <CardDescription>
                Siz bu ixtisas üzrə imtahanı əvvəllər təhvil vermisiniz. Təkrar cəhdə icazə verilmir.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">İştirakçı FİN:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{cleanFin}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Ad, Soyad:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{fullName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">İxtisas:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{completedInfo.specialtyTitle}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Yekun Nəticə:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    %{completedInfo.percentage} ({completedInfo.score} Bal)
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Tamamlanma Tarixi:</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {new Date(completedInfo.completedAt).toLocaleString('az-AZ')}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
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
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => navigate(`/quiz/${completedInfo.quizId}`)}
              >
                Nəticə Protokoluna Bax
              </Button>
            </CardFooter>
          </Card>
        ) : (
          /* ACTIVE EXAM FORM WITH PASSWORD */
          <Card className="border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" /> İştirakçının Qeydiyyatı və Giriş
                </CardTitle>
                <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40">
                  Sessiya Aktivdir
                </Badge>
              </div>
              <CardDescription>
                Şəxsiyyət vəsiqənizin FİN kodunu, ad və soyadınızı yazın, ixtisasınızı seçin və zalda verilən imtahan parolunu daxil edin.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleStartExam} className="space-y-4">
                {/* 3 Overview Badges */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                  <div className="flex flex-col items-center justify-center p-1">
                    <Clock className="w-4 h-4 text-blue-600 mb-1" />
                    <span className="text-[11px] text-slate-500">Müddət</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">120 dəqiqə</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-1 border-x border-slate-200 dark:border-slate-700">
                    <FileCheck className="w-4 h-4 text-emerald-600 mb-1" />
                    <span className="text-[11px] text-slate-500">Sual Sayı</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">60 Sual</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-1">
                    <Award className="w-4 h-4 text-amber-600 mb-1" />
                    <span className="text-[11px] text-slate-500">Variant</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">A - E (5)</span>
                  </div>
                </div>

                {/* Password / Access Code Input */}
                <div className="space-y-1.5 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
                  <Label htmlFor="examCode" className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-blue-600" /> İmtahan Giriş Parolu (Nəzarətçi Kodu) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="examCode"
                    type="password"
                    value={examCode}
                    onChange={(e) => setExamCode(e.target.value)}
                    placeholder="İmtahan zalında elan olunan parol..."
                    className="h-10 text-sm bg-white dark:bg-slate-900"
                    autoComplete="off"
                    required
                  />
                  <p className="text-[10px] text-blue-700 dark:text-blue-300">
                    Bu parol imtahan zalında komissiya üzvləri tərəfindən elan olunur.
                  </p>
                </div>

                {/* FIN input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <Label htmlFor="fin" className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      FİN Kod (Şəxsiyyət Vəsiqəsi) <span className="text-red-500">*</span>
                    </Label>
                    <span className="text-[11px] text-slate-400">{cleanFin.length} / 7 simvol</span>
                  </div>
                  <div className="relative">
                    <Input
                      id="fin"
                      value={fin}
                      onChange={(e) => setFin(e.target.value.toUpperCase().slice(0, 7))}
                      placeholder="Məsələn: 7ABC123"
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
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Ad, Soyad və Ata adı <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Məsələn: Murad Əliyev Vüqar"
                    className="h-10 text-sm"
                    autoComplete="name"
                    required
                  />
                </div>

                {/* Specialty Select */}
                <div className="space-y-1.5">
                  <Label htmlFor="specialty" className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    İmtahan İxtisası / Vakansiya <span className="text-red-500">*</span>
                  </Label>
                  <Select value={selectedKey} onValueChange={setSelectedKey}>
                    <SelectTrigger id="specialty" className="h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="İmtahan veriləcək ixtisası seçin..." />
                    </SelectTrigger>
                    <SelectContent>
                      {OFFICIAL_EXAMS.map((exam) => (
                        <SelectItem key={exam.key} value={exam.key} className="py-1.5">
                          <span className="font-medium">{exam.title}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            (Keçid: %{exam.passScore})
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Warning & Instructions */}
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    Mühüm İmtahan Qaydaları:
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px] leading-relaxed">
                    <li>İmtahan müddəti 120 dəqiqədir. Vaxt bitdikdə sistem avtomatik yekunlaşır.</li>
                    <li>Hər iştirakçıya yalnız <strong>1 cəhd</strong> hüququ verilir.</li>
                    <li>İmtahan zamanı başqa pəncərəyə keçmək qayda pozuntusudur.</li>
                  </ul>
                </div>

                {/* Agreement Checkbox */}
                <div className="flex items-start space-x-2 pt-1">
                  <Checkbox
                    id="agreed"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(!!checked)}
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="agreed"
                    className="text-xs leading-snug cursor-pointer text-slate-700 dark:text-slate-300 select-none"
                  >
                    Qaydalarla tanış oldum, daxil etdiyim məlumatların doğruluğunu təsdiq edirəm.
                  </Label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className="w-full h-11 text-sm sm:text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 rounded-xl transition-all"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      İmtahan sessiyası başladılır...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      İmtahana Başla <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" /> Təhlükəsiz SSL Bağlantı
              </span>
              <span>Regional Təhsil İdarəetmə Sistemi © 2026</span>
            </CardFooter>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
