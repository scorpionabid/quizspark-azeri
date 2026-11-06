import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  MapPin,
  GraduationCap,
  HelpCircle,
  Zap,
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

interface ParticipantData {
  found: boolean;
  participant_id?: string;
  utis_code?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  father_name?: string;
  district?: string;
  school?: string;
  class_name?: string;
  grade_level?: number;
  age_group?: 'AYQ' | 'YYQ';
  subject?: string | null;
  raw_subject?: string;
  target_quiz_id?: string | null;
  target_share_code?: string | null;
  quiz_title?: string | null;
  quiz_duration?: number | null;
  is_completed?: boolean;
  completed_score?: number | null;
  completed_at?: string | null;
  active_attempt_id?: string | null;
  message?: string;
}

const DISTRICTS = ['Şəki', 'Qəbələ', 'Oğuz', 'Qax', 'Zaqatala', 'Balakən', 'Digər'];

const GRADES = [
  { value: '8', label: 'VIII sinif', group: 'AYQ' },
  { value: '9', label: 'IX sinif', group: 'AYQ' },
  { value: '10', label: 'X sinif', group: 'YYQ' },
  { value: '11', label: 'XI sinif', group: 'YYQ' },
];

const SUBJECTS = [
  { value: 'Riyaziyyat', label: 'Riyaziyyat', icon: Calculator },
  { value: 'Fizika', label: 'Fizika', icon: Atom },
  { value: 'Kimya', label: 'Kimya', icon: FlaskConical },
  { value: 'Biologiya', label: 'Biologiya', icon: Dna },
  { value: 'Tarix', label: 'Tarix', icon: Landmark },
  { value: 'Coğrafiya', label: 'Coğrafiya', icon: Globe },
  { value: 'Azərbaycan dili', label: 'Azərbaycan dili', icon: BookOpen },
];

export default function OlimpiadaLoginPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Tab switch: 'utis' (main) vs 'backup' (fallback)
  const [activeTab, setActiveTab] = useState<'utis' | 'backup'>('utis');

  // --- Main UTIS Mode State ---
  const [utisCode, setUtisCode] = useState('');
  const [isSearchingUtis, setIsSearchingUtis] = useState(false);
  const [participant, setParticipant] = useState<ParticipantData | null>(null);
  const [manualSubjectForParticipant, setManualSubjectForParticipant] = useState<string>('');

  // --- Backup Mode State ---
  const [backupFullName, setBackupFullName] = useState('');
  const [backupDistrict, setBackupDistrict] = useState('Şəki');
  const [backupSchool, setBackupSchool] = useState('');
  const [backupGrade, setBackupGrade] = useState('9');
  const [backupSubject, setBackupSubject] = useState('Riyaziyyat');
  const [backupUtis, setBackupUtis] = useState('');

  // --- General State ---
  const [isLoading, setIsLoading] = useState(false);
  const [completedInfo, setCompletedInfo] = useState<CompletedAttemptInfo | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const cleanUtis = utisCode.trim().replace(/\D/g, '').slice(0, 7);

  // Auto-detect participant data as soon as 7 digits are entered
  useEffect(() => {
    if (cleanUtis.length === 7) {
      let isMounted = true;
      setIsSearchingUtis(true);
      (async () => {
        try {
          const { data, error } = await supabase.rpc('get_final_participant_by_utis', {
            p_utis: cleanUtis,
          });

          if (!isMounted) return;
          if (error) {
            console.error('get_final_participant_by_utis error:', error);
            setParticipant(null);
            return;
          }

          if (data && typeof data === 'object') {
            const p = data as ParticipantData;
            setParticipant(p);
            if (p.subject) {
              setManualSubjectForParticipant(p.subject);
            } else {
              setManualSubjectForParticipant('');
            }

            // If participant completed the exam, prepare completion info
            if (p.is_completed && p.target_quiz_id) {
              setCompletedInfo({
                quizId: p.target_quiz_id,
                userId: '',
                score: p.completed_score ?? 0,
                totalQuestions: 20,
                percentage: p.completed_score ?? 0,
                completedAt: p.completed_at || '',
                specialtyTitle: p.quiz_title || `${p.subject} (${p.age_group})`,
                answers: [],
              });
            } else {
              setCompletedInfo(null);
            }
          } else {
            setParticipant(null);
          }
        } catch (err) {
          console.error('Error fetching participant:', err);
          if (isMounted) setParticipant(null);
        } finally {
          if (isMounted) setIsSearchingUtis(false);
        }
      })();

      return () => {
        isMounted = false;
      };
    } else {
      setParticipant(null);
      setIsSearchingUtis(false);
    }
  }, [cleanUtis]);

  // Auth helper: logs in or signs up a student deterministically by UTIS
  const performStudentAuth = async (
    targetUtis: string,
    fullName: string,
    school: string,
    grade: string,
    subjectTitle: string
  ): Promise<string> => {
    const email = `utis_${targetUtis.toLowerCase()}@imtahan.store`;
    const password = `Utis2026_${targetUtis}!`;

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    let authUserId: string | null = signInData?.user?.id ?? null;

    if (signInError || !authUserId) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'student',
            full_name: fullName,
            utis: targetUtis,
            grade,
            school: school || 'Məktəb',
          },
        },
      });

      if (signUpError) {
        // Fallback retry
        const { data: retrySignIn } = await supabase.auth.signInWithPassword({ email, password });
        authUserId = retrySignIn?.user?.id ?? null;
      } else {
        authUserId = signUpData?.user?.id ?? null;
      }
    }

    if (!authUserId) {
      throw new Error('Şagird sessiyası təsdiqlənə bilmədi. Zəhmət olmasa yenidən cəhd edin.');
    }

    // Update profile
    await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        utis_code: targetUtis,
        fin: targetUtis,
        grade,
        school: school || 'Məktəb',
        specialty: `Zəfər Olimpiadası (Final) — ${subjectTitle}`,
      })
      .eq('user_id', authUserId);

    return authUserId;
  };

  // Handler for Main UTIS Entry
  const handleStartWithUtis = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!participant || !participant.found) {
      toast.error('Zəhmət olmasa düzgün 7 rəqəmli UTİS kodu daxil edin.');
      return;
    }

    const effectiveSubject = participant.subject || manualSubjectForParticipant;
    if (!effectiveSubject) {
      toast.error('Zəhmət olmasa imtahan verəcəyiniz fənni seçin.');
      return;
    }

    setIsLoading(true);
    try {
      let targetShareCode = participant.target_share_code;
      let targetQuizId = participant.target_quiz_id;

      // If participant had empty subject, resolve the quiz now
      if (!targetShareCode || !targetQuizId) {
        const { data: qData, error: qErr } = await supabase
          .from('quizzes')
          .select('id, share_code, title')
          .eq('grade', participant.age_group || 'AYQ')
          .eq('subject', effectiveSubject)
          .like('title', '%Zəfər Olimpiadası (Final)%')
          .maybeSingle();

        if (qErr || !qData) {
          throw new Error(`${participant.age_group} qrupu üçün "${effectiveSubject}" quizi tapılmadı.`);
        }
        targetQuizId = qData.id;
        targetShareCode = qData.share_code;

        // Also update in final_olympiad_participants
        if (participant.participant_id) {
          await supabase
            .from('final_olympiad_participants')
            .update({
              subject: effectiveSubject,
              target_quiz_id: targetQuizId,
              target_share_code: targetShareCode,
            })
            .eq('id', participant.participant_id);
        }
      }

      // Check if attempt already completed
      const authUserId = await performStudentAuth(
        participant.utis_code || cleanUtis,
        participant.full_name || 'Şagird',
        participant.school || 'Məktəb',
        participant.class_name || `${participant.grade_level || 9} sinif`,
        effectiveSubject
      );

      // Link auth user_id in participants table
      if (participant.participant_id) {
        await supabase
          .from('final_olympiad_participants')
          .update({ user_id: authUserId })
          .eq('id', participant.participant_id);
      }

      const isPrivilegedTester =
        authUserId === 'e1703786-e31c-4f38-bdd7-8b3192cc6321' ||
        authUserId === '81cebd9d-586b-4460-8615-6cb0ed9d1094' ||
        cleanUtis === '3440725';

      if (participant.is_completed && !isPrivilegedTester) {
        toast.info('Siz bu imtahanı artıq tamamlamısınız.');
        return;
      }

      toast.success(`Xoş gəldiniz, ${participant.first_name || participant.full_name}! İmtahana keçid edilir...`);
      navigate(`/quiz/${targetShareCode || targetQuizId}`);
    } catch (err: unknown) {
      console.error('UTIS start error:', err);
      toast.error(err instanceof Error ? err.message : 'İmtahana daxil olarkən xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Backup / Fallback Entry
  const handleStartBackup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!backupFullName.trim()) {
      toast.error('Zəhmət olmasa şagirdin ad, soyad və ata adını daxil edin.');
      return;
    }
    if (!backupSchool.trim()) {
      toast.error('Zəhmət olmasa məktəbin adını daxil edin.');
      return;
    }

    setIsLoading(true);
    try {
      const gradeNum = parseInt(backupGrade, 10) || 9;
      const { data, error } = await supabase.rpc('register_backup_olympiad_participant', {
        p_full_name: backupFullName.trim(),
        p_district: backupDistrict,
        p_school: backupSchool.trim(),
        p_grade_level: gradeNum,
        p_subject: backupSubject,
        p_utis_code: backupUtis.trim() || null,
      });

      if (error) throw error;
      const reg = data as Record<string, unknown>;
      if (!reg.success) {
        throw new Error(String(reg.message || 'Ehtiyat qeydiyyat uğursuz oldu'));
      }

      const targetUtis = String(reg.utis_code);
      const targetShareCode = String(reg.target_share_code);
      const targetQuizId = String(reg.target_quiz_id);

      // Perform auth
      const authUserId = await performStudentAuth(
        targetUtis,
        backupFullName.trim(),
        backupSchool.trim(),
        `${gradeNum} sinif`,
        backupSubject
      );

      // Link participant user_id
      if (reg.participant_id) {
        await supabase
          .from('final_olympiad_participants')
          .update({ user_id: authUserId })
          .eq('id', String(reg.participant_id));
      }

      toast.success(`Qeydiyyat təsdiqləndi! Xoş gəldiniz, ${backupFullName.trim()}! İmtahana keçid edilir...`);
      navigate(`/quiz/${targetShareCode || targetQuizId}`);
    } catch (err: unknown) {
      console.error('Backup start error:', err);
      toast.error(err instanceof Error ? err.message : 'Ehtiyat qeydiyyat zamanı xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset attempt handler for testers
  const handleResetAttemptForTest = async () => {
    if (!completedInfo) return;
    try {
      setIsLoading(true);
      await supabase.from('quiz_results').delete().eq('quiz_id', completedInfo.quizId);
      await supabase.from('quiz_attempts').delete().eq('quiz_id', completedInfo.quizId);
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
                Zəfər Olimpiadası (Final)
              </span>
              <span className="text-[11px] font-medium text-muted-foreground block">
                Şagird Giriş Portalı
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
            Zəfər Olimpiadası (Final)
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
                  Hörmətli <span className="font-bold text-foreground">{participant?.full_name || 'Şagird'}</span>, siz bu fənn üzrə imtahanda artıq iştirak etmisiniz.
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
                      setUtisCode('');
                      setParticipant(null);
                    }}
                    className="flex-1 h-12 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Yeni Giriş
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
                    <span>Test üçün bu cəhdi sıfırla və təkrar başla</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/60 shadow-xl rounded-3xl overflow-hidden bg-card backdrop-blur-xl">
              {/* Header with Mode Tabs */}
              <CardHeader className="pb-4 pt-6 px-6 sm:px-8 text-center border-b border-border/40">
                <Badge variant="secondary" className="mx-auto mb-2 font-bold px-3 py-1 text-[11px] gap-1.5 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  Zəfər Olimpiadası — Final Mərhələsi
                </Badge>
                <CardTitle className="text-xl sm:text-2xl font-black text-foreground">
                  Olimpiada İmtahanına Giriş
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  UTİS kodunuzu daxil edərək birbaşa sizə aid fənn imtahanına qoşulun
                </CardDescription>

                {/* Main vs Backup Mode Switcher */}
                <div className="grid grid-cols-2 gap-1.5 mt-4 p-1 bg-muted/60 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setActiveTab('utis')}
                    className={cn(
                      'py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5',
                      activeTab === 'utis'
                        ? 'bg-background text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>UTİS ilə Sürətli Giriş</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('backup')}
                    className={cn(
                      'py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5',
                      activeTab === 'backup'
                        ? 'bg-background text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Ehtiyat Giriş</span>
                  </button>
                </div>
              </CardHeader>

              <AnimatePresence mode="wait">
                {activeTab === 'utis' ? (
                  // ==========================================
                  // TAB 1: UTİS İLƏ SÜRƏTLİ GİRİŞ (ƏSAS)
                  // ==========================================
                  <motion.form
                    key="tab-utis"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleStartWithUtis}
                  >
                    <CardContent className="space-y-5 px-6 sm:px-8 pt-6">
                      {/* UTIS Input */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <Label
                            htmlFor="utisCode"
                            className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                          >
                            <Lock className="w-3.5 h-3.5 text-blue-600" />
                            7 Rəqəmli UTİS Kodunuz *
                          </Label>
                          <span
                            className={cn(
                              'text-[11px] font-mono transition-colors',
                              cleanUtis.length === 7
                                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                                : 'text-muted-foreground'
                            )}
                          >
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
                          placeholder="Məsələn: 2908950"
                          className="h-14 rounded-2xl text-xl sm:text-2xl font-mono font-black tracking-widest text-center border-2 border-border/80 focus-visible:ring-blue-600"
                          maxLength={7}
                          autoFocus
                          required
                        />
                      </div>

                      {/* Searching Spinner */}
                      {isSearchingUtis && (
                        <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/50 flex items-center justify-center gap-2 text-xs font-medium text-blue-700 dark:text-blue-300">
                          <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          <span>Şagird məlumatları yoxlanılır...</span>
                        </div>
                      )}

                      {/* Participant Card Found */}
                      {!isSearchingUtis && participant && participant.found && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-4 rounded-2xl border bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500/30 space-y-3"
                        >
                          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Şagird Siyahıda Təsdiqləndi</span>
                            </div>
                            <Badge variant="outline" className="text-[10px] bg-emerald-100/60 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 border-emerald-300">
                              {participant.age_group} ({participant.grade_level >= 10 ? 'X-XI' : 'VIII-IX'})
                            </Badge>
                          </div>

                          <div className="space-y-1.5 text-xs text-foreground">
                            <div className="flex items-start gap-2">
                              <User className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                              <span className="font-extrabold text-sm">{participant.full_name}</span>
                            </div>
                            <div className="flex items-start gap-2 text-muted-foreground">
                              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                              <span>{participant.district} rayonu</span>
                            </div>
                            <div className="flex items-start gap-2 text-muted-foreground">
                              <School className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                              <span>{participant.school}</span>
                            </div>
                            <div className="flex items-start gap-2 text-muted-foreground">
                              <GraduationCap className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                              <span>Sinif: <strong>{participant.class_name}</strong></span>
                            </div>
                          </div>

                          {/* Quiz Assignment Details */}
                          <div className="pt-2 border-t border-emerald-500/20">
                            {participant.subject ? (
                              <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-emerald-500/20 flex items-center justify-between">
                                <span className="text-[11px] text-muted-foreground font-semibold">Təyin olunmuş Fənn:</span>
                                <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-2.5 py-0.5">
                                  {participant.subject} ({participant.age_group})
                                </Badge>
                              </div>
                            ) : (
                              // Fallback for the 5 students who had empty subject in Excel
                              <div className="space-y-2 pt-1">
                                <Label className="text-xs font-bold text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
                                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                  Zəhmət olmasa imtahan verəcəyiniz fənni seçin:
                                </Label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                                  {SUBJECTS.map((s) => {
                                    const Icon = s.icon;
                                    const isSel = manualSubjectForParticipant === s.value;
                                    return (
                                      <button
                                        key={s.value}
                                        type="button"
                                        onClick={() => setManualSubjectForParticipant(s.value)}
                                        className={cn(
                                          'p-2 rounded-xl text-left border flex items-center gap-1.5 transition-all text-xs font-bold',
                                          isSel
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                            : 'bg-white/60 dark:bg-slate-900/60 hover:bg-white text-foreground border-border/60'
                                        )}
                                      >
                                        <Icon className={cn('w-3.5 h-3.5', isSel ? 'text-white' : 'text-muted-foreground')} />
                                        <span className="truncate">{s.label}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* UTIS Not Found Warning */}
                      {!isSearchingUtis && cleanUtis.length === 7 && participant && !participant.found && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-2 text-xs"
                        >
                          <div className="flex items-center gap-2 font-bold">
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>Bu UTİS kodu cədvəldə tapılmadı</span>
                          </div>
                          <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                            Zəhmət olmasa 7 rəqəmli UTİS kodunuzu düzgün yazdığınızdan əmin olun. Əgər siyahıda yoxsunuzsa, yuxarıdakı <strong>«Ehtiyat Giriş»</strong> bölməsindən qeydiyyatdan keçərək imtahana daxil ola bilərsiniz.
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setActiveTab('backup');
                              setBackupUtis(cleanUtis);
                            }}
                            className="text-xs font-bold border-amber-500/40 hover:bg-amber-500/20 text-amber-900 dark:text-amber-100 h-8 rounded-lg"
                          >
                            Ehtiyat Girişə Keç ➔
                          </Button>
                        </motion.div>
                      )}

                      {/* Summary Box */}
                      <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/50 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span>Müddət: <strong className="text-foreground">120 dəqiqə</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Trophy className="w-4 h-4 text-blue-600" />
                          <span>Sual: <strong className="text-foreground">20 sual</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Keçid: <strong className="text-foreground">60%</strong></span>
                        </div>
                      </div>

                      {/* Password Notice */}
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[11px]">İmtahan Giriş Şifrəsi</p>
                          <p className="text-[10px] text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                            Bütün şagirdlərin eyni vaxtda başlaması üçün imtahan şifrəsi nəzarətçi tərəfindən otaqda elan olunacaq.
                          </p>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="px-6 sm:px-8 pb-6 pt-2">
                      <Button
                        type="submit"
                        disabled={
                          isLoading ||
                          !participant ||
                          !participant.found ||
                          (!participant.subject && !manualSubjectForParticipant)
                        }
                        className="w-full h-12 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 gap-2 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            İmtahana keçid edilir...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            İmtahana Başla
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        )}
                      </Button>
                    </CardFooter>
                  </motion.form>
                ) : (
                  // ==========================================
                  // TAB 2: EHTİYAT GİRİŞ (FALLBACK REJİM)
                  // ==========================================
                  <motion.form
                    key="tab-backup"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleStartBackup}
                  >
                    <CardContent className="space-y-4 px-6 sm:px-8 pt-5">
                      <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">
                          Siyahıda adı olmayan və ya UTİS kodunu bilməyən şagirdlər məlumatlarını aşağıda qeyd edərək birbaşa imtahana daxil ola bilərlər.
                        </span>
                      </div>

                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <Label htmlFor="backupFullName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-blue-600" />
                          Ad, Soyad və Ata Adınız *
                        </Label>
                        <Input
                          id="backupFullName"
                          type="text"
                          value={backupFullName}
                          onChange={(e) => setBackupFullName(e.target.value)}
                          placeholder="Məsələn: Əliyev Murad Rəşad oğlu"
                          className="h-11 rounded-xl text-sm border-border/80 focus-visible:ring-blue-600"
                          required
                        />
                      </div>

                      {/* District and School */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-blue-600" />
                            Rayon *
                          </Label>
                          <select
                            value={backupDistrict}
                            onChange={(e) => setBackupDistrict(e.target.value)}
                            className="w-full h-11 rounded-xl text-sm border border-border/80 bg-background px-3 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                          >
                            {DISTRICTS.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="backupSchool" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <School className="w-3.5 h-3.5 text-blue-600" />
                            Məktəb *
                          </Label>
                          <Input
                            id="backupSchool"
                            type="text"
                            value={backupSchool}
                            onChange={(e) => setBackupSchool(e.target.value)}
                            placeholder="Məs: 1 nömrəli tam orta məktəb"
                            className="h-11 rounded-xl text-sm border-border/80 focus-visible:ring-blue-600"
                            required
                          />
                        </div>
                      </div>

                      {/* Grade Selection */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                            Sinifinizi Seçin *
                          </Label>
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {parseInt(backupGrade, 10) >= 10 ? 'YYQ (X-XI)' : 'AYQ (VIII-IX)'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {GRADES.map((g) => {
                            const isSelected = backupGrade === g.value;
                            return (
                              <button
                                key={g.value}
                                type="button"
                                onClick={() => setBackupGrade(g.value)}
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
                            const isSelected = backupSubject === s.value;
                            return (
                              <button
                                key={s.value}
                                type="button"
                                onClick={() => setBackupSubject(s.value)}
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

                      {/* UTIS Code (Optional in Backup mode) */}
                      <div className="space-y-1.5">
                        <Label htmlFor="backupUtis" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-blue-600" />
                            UTİS Kodu (Könüllü / Varsa)
                          </span>
                          <span className="text-[10px] text-muted-foreground lowercase">bilmirsinizsə boş saxlayın</span>
                        </Label>
                        <Input
                          id="backupUtis"
                          type="text"
                          inputMode="numeric"
                          value={backupUtis}
                          onChange={(e) => setBackupUtis(e.target.value.replace(/\D/g, '').slice(0, 7))}
                          placeholder="Məsələn: 1234567"
                          className="h-10 rounded-xl text-sm font-mono border-border/80 focus-visible:ring-blue-600"
                          maxLength={7}
                        />
                      </div>
                    </CardContent>

                    <CardFooter className="px-6 sm:px-8 pb-6 pt-2">
                      <Button
                        type="submit"
                        disabled={isLoading || !backupFullName.trim() || !backupSchool.trim()}
                        className="w-full h-12 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 gap-2"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Qeydiyyatdan keçirilir...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Qeydiyyatı Tamamla və İmtahana Başla
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        )}
                      </Button>
                    </CardFooter>
                  </motion.form>
                )}
              </AnimatePresence>
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
          candidateName={participant?.full_name || 'Şagird'}
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
