import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  FileSpreadsheet,
  Search,
  RefreshCw,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Award,
  BookOpen,
  ArrowUpDown,
  Download,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  Save,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface ExamAttemptRow {
  id: string;
  quizId: string;
  userId: string;
  fin: string;
  fullName: string;
  specialty: string;
  score: number;
  totalQuestions: number;
  timeSpent: number | null;
  startedAt: string;
  completedAt: string | null;
  isCompleted: boolean;
  passPercentage: number;
  isPassed: boolean;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
}

export default function AdminExamsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'passed' | 'failed' | 'in_progress'>('all');
  const [isExporting, setIsExporting] = useState(false);

  // Security / Portal Lock state
  const [portalActive, setPortalActive] = useState(false);
  const [portalCode, setPortalCode] = useState('EXAM2026');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Fetch security settings
  const { data: examSettings, refetch: refetchSettings } = useQuery({
    queryKey: ['official_exam_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('official_exam_settings')
        .select('*')
        .eq('id', 'current')
        .maybeSingle();
      if (error) throw error;
      return data || { is_active: false, access_code: 'EXAM2026' };
    },
  });

  useEffect(() => {
    if (examSettings) {
      setPortalActive(examSettings.is_active);
      setPortalCode(examSettings.access_code);
    }
  }, [examSettings]);

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const { error } = await supabase
        .from('official_exam_settings')
        .upsert({
          id: 'current',
          is_active: portalActive,
          access_code: portalCode.trim(),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success(
        portalActive
          ? 'İmtahan portalı AKTİVLƏŞDİRİLDİ! Təyin olunmuş kodla daxil olmaq olar.'
          : 'İmtahan portalı KİLİDLƏNDİ! İştirakçıların girişi tam dayandırıldı.'
      );
      void refetchSettings();
    } catch (err: unknown) {
      console.error('Settings save error:', err);
      const msg = err instanceof Error ? err.message : 'Xəta baş verdi';
      toast.error(`Ayarları yadda saxlamaq olmadı: ${msg}`);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Fetch official quizzes
  const { data: officialQuizzes = [] } = useQuery({
    queryKey: ['official_quizzes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('id, title, subject, pass_percentage, specialty_key, question_count')
        .eq('exam_category', 'official_exam');
      if (error) throw error;
      return data || [];
    },
  });

  const officialQuizIds = useMemo(() => officialQuizzes.map((q) => q.id), [officialQuizzes]);

  // Fetch attempts & results for official quizzes
  const {
    data: attemptsData = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['official_exam_attempts', officialQuizIds],
    enabled: officialQuizIds.length > 0,
    queryFn: async () => {
      // 1. Fetch attempts
      const { data: attempts, error: attError } = await supabase
        .from('quiz_attempts')
        .select('id, quiz_id, user_id, started_at, completed_at, score, total_questions, time_spent, answers')
        .in('quiz_id', officialQuizIds)
        .order('started_at', { ascending: false });

      if (attError) throw attError;
      if (!attempts || attempts.length === 0) return [];

      // 2. Fetch profiles of these users
      const userIds = Array.from(new Set(attempts.map((a) => a.user_id)));
      const { data: profiles, error: profError } = await supabase
        .from('profiles')
        .select('user_id, full_name, fin, specialty')
        .in('user_id', userIds);

      if (profError) {
        console.warn('Profiles fetch warning:', profError);
      }

      const profileMap = new Map<string, { full_name: string | null; fin: string | null; specialty: string | null }>();
      (profiles || []).forEach((p) => {
        profileMap.set(p.user_id, p);
      });

      const quizMap = new Map<string, { title: string; pass_percentage: number | null; question_count: number | null }>();
      officialQuizzes.forEach((q) => {
        quizMap.set(q.id, q);
      });

      // 3. Map to ExamAttemptRow
      const rows: ExamAttemptRow[] = attempts.map((att) => {
        const prof = profileMap.get(att.user_id);
        const qInfo = quizMap.get(att.quiz_id);
        const passScore = qInfo?.pass_percentage ?? 50;
        const totalQ = att.total_questions || qInfo?.question_count || 60;
        const isComp = !!att.completed_at;

        // Parse answers array to calculate stats
        const answersList = (Array.isArray(att.answers) ? att.answers : []) as Array<{
          isCorrect?: boolean;
          questionId?: string;
        }>;

        const correct = answersList.filter((a) => a.isCorrect === true).length;
        const totalAnswered = answersList.length;
        const incorrect = totalAnswered - correct;
        const unanswered = Math.max(0, totalQ - totalAnswered);

        const earnedScore = isComp
          ? att.score ?? (totalQ > 0 ? Math.round((correct / totalQ) * 100) : 0)
          : totalQ > 0
          ? Math.round((correct / totalQ) * 100)
          : 0;

        const passed = isComp && earnedScore >= passScore;

        return {
          id: att.id,
          quizId: att.quiz_id,
          userId: att.user_id,
          fin: prof?.fin || '—',
          fullName: prof?.full_name || 'Naməlum',
          specialty: prof?.specialty || qInfo?.title || '—',
          score: earnedScore,
          totalQuestions: totalQ,
          timeSpent: att.time_spent,
          startedAt: att.started_at,
          completedAt: att.completed_at,
          isCompleted: isComp,
          passPercentage: passScore,
          isPassed: passed,
          correctCount: correct,
          incorrectCount: incorrect,
          unansweredCount: unanswered,
        };
      });

      return rows;
    },
    refetchInterval: 30000,
  });

  // Filtered rows
  const filteredRows = useMemo(() => {
    return attemptsData.filter((row) => {
      // Search by FIN or Name
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesFin = row.fin.toLowerCase().includes(query);
        const matchesName = row.fullName.toLowerCase().includes(query);
        if (!matchesFin && !matchesName) return false;
      }

      // Filter by Specialty
      if (selectedSpecialty !== 'all') {
        if (row.quizId !== selectedSpecialty) return false;
      }

      // Filter by Status
      if (selectedStatus === 'passed') {
        if (!row.isCompleted || !row.isPassed) return false;
      } else if (selectedStatus === 'failed') {
        if (!row.isCompleted || row.isPassed) return false;
      } else if (selectedStatus === 'in_progress') {
        if (row.isCompleted) return false;
      }

      return true;
    });
  }, [attemptsData, searchQuery, selectedSpecialty, selectedStatus]);

  // Statistics Summary
  const stats = useMemo(() => {
    const total = attemptsData.length;
    const completed = attemptsData.filter((r) => r.isCompleted).length;
    const inProgress = total - completed;
    const passed = attemptsData.filter((r) => r.isCompleted && r.isPassed).length;
    const passRate = completed > 0 ? Math.round((passed / completed) * 100) : 0;
    const avgScore =
      completed > 0 ? Math.round(attemptsData.filter((r) => r.isCompleted).reduce((acc, r) => acc + r.score, 0) / completed) : 0;

    return { total, completed, inProgress, passed, passRate, avgScore };
  }, [attemptsData]);

  // Export to Excel
  const handleExportToExcel = () => {
    if (filteredRows.length === 0) {
      toast.warning('İxrac ediləcək heç bir nəticə tapılmadı');
      return;
    }

    setIsExporting(true);
    try {
      const exportData = filteredRows.map((row, index) => {
        const formatTime = (seconds: number | null) => {
          if (!seconds) return '—';
          const mins = Math.floor(seconds / 60);
          const secs = seconds % 60;
          return `${mins} dəq ${secs} san`;
        };

        return {
          'S/S': index + 1,
          'FİN Kod': row.fin,
          'Ad, Soyad': row.fullName,
          'İxtisas / Vəzifə': row.specialty,
          'Doğru Sayı': row.correctCount,
          'Səhv Sayı': row.incorrectCount,
          'Boş Sayı': row.unansweredCount,
          'Yekun Bal (%)': row.isCompleted ? row.score : 'Davam edir',
          'Keçid Həddi (%)': row.passPercentage,
          'Status': !row.isCompleted ? 'Davam edir' : row.isPassed ? 'KEÇDİ' : 'KEÇMƏDİ',
          'Sərf Olunan Vaxt': formatTime(row.timeSpent),
          'Başlama Tarixi': new Date(row.startedAt).toLocaleString('az-AZ'),
          'Bitirmə Tarixi': row.completedAt ? new Date(row.completedAt).toLocaleString('az-AZ') : '—',
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);

      worksheet['!cols'] = [
        { wch: 6 },
        { wch: 12 },
        { wch: 28 },
        { wch: 38 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 18 },
        { wch: 22 },
        { wch: 22 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'İmtahan Nəticələri');

      const dateStr = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(workbook, `Resmi_Imtahan_Netice_${dateStr}.xlsx`);
      toast.success('Excel faylı uğurla generasiya edildi və endirildi!');
    } catch (err: unknown) {
      console.error('Export error:', err);
      toast.error('Excel ixracında xəta baş verdi');
    } finally {
      setIsExporting(false);
    }
  };

  const formatSeconds = (sec: number | null) => {
    if (!sec) return '—';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m} dəq ${s} san`;
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-blue-600 border-blue-500 bg-blue-50 dark:bg-blue-950/40">
              Rəsmi Dövlət İmtahanı
            </Badge>
            <span className="text-xs text-muted-foreground">Vakant Vəzifələr 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            İmtahan Nəticələri və Canlı İzləmə
          </h1>
          <p className="text-sm text-slate-500">
            500+ iştirakçının canlı imtahan gedişatı, bal statistikası və rəsmi protokollar
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
            Yenilə
          </Button>
          <Button
            onClick={handleExportToExcel}
            disabled={isExporting || filteredRows.length === 0}
            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4" />
            Excel İxracı (.xlsx)
          </Button>
        </div>
      </div>

      {/* SECURITY / PORTAL LOCK CONTROL CARD */}
      <Card className="border-blue-200 dark:border-blue-900/60 bg-gradient-to-r from-blue-50/50 via-white to-indigo-50/50 dark:from-slate-900 dark:to-slate-900 shadow-sm">
        <CardHeader className="p-4 pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <ShieldCheck className="w-5 h-5 text-blue-600" /> İmtahan Nəzarət Mərkəzi (Təhlükəsizlik və Giriş Qıfılı)
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              İmtahanı vaxtından əvvəl heç kimin görməməsi üçün qapalı saxlayın, yalnız zalda imtahan başladıqda aktiv edin.
            </CardDescription>
          </div>
          <Badge
            variant={portalActive ? 'default' : 'destructive'}
            className="text-xs px-3 py-1 font-semibold flex items-center gap-1.5"
          >
            {portalActive ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            {portalActive ? 'PORTAL AKTİVDİR (GİRİŞ AÇIQDIR)' : 'PORTAL KİLİDLİDİR (GİRİŞ QADAĞANDIR)'}
          </Badge>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-slate-200/80 dark:border-slate-800">
            {/* Toggle Active Switch */}
            <div className="flex items-center space-x-3">
              <Switch
                id="portal-active"
                checked={portalActive}
                onCheckedChange={setPortalActive}
              />
              <Label htmlFor="portal-active" className="text-xs sm:text-sm font-semibold cursor-pointer">
                {portalActive ? 'İmtahana Girişi İcazəli Et (Aktiv)' : 'İmtahanı Tam Kilidlə (Qapalı)'}
              </Label>
            </div>

            {/* Access Code Input */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-slate-500">Zal Parolu:</span>
                <Input
                  value={portalCode}
                  onChange={(e) => setPortalCode(e.target.value)}
                  className="h-7 w-32 font-mono text-xs font-bold uppercase tracking-wider"
                  placeholder="Məs: EXAM2026"
                />
              </div>

              <Button
                size="sm"
                onClick={handleSaveSettings}
                disabled={isSavingSettings}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 h-8 text-xs font-semibold"
              >
                <Save className="w-3.5 h-3.5" />
                {isSavingSettings ? 'Yadda saxlanılır...' : 'Yadda Saxla'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold flex items-center justify-between">
              Cəmi İştirakçı <Users className="w-4 h-4 text-blue-500" />
            </CardDescription>
            <CardTitle className="text-2xl font-extrabold">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-slate-500">
            Daxil olan bütün namizədlər
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold flex items-center justify-between">
              Tamamlayanlar <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </CardDescription>
            <CardTitle className="text-2xl font-extrabold text-emerald-600">{stats.completed}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-slate-500">
            {stats.inProgress} nəfər imtahandadır
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold flex items-center justify-between">
              Keçənlər (Müvəffəq) <Award className="w-4 h-4 text-amber-500" />
            </CardDescription>
            <CardTitle className="text-2xl font-extrabold text-blue-600">{stats.passed}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-slate-500">
            Keçid faizi: %{stats.passRate}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold flex items-center justify-between">
              Orta Nəticə <Clock className="w-4 h-4 text-indigo-500" />
            </CardDescription>
            <CardTitle className="text-2xl font-extrabold text-indigo-600">%{stats.avgScore}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-slate-500">
            Bitirənlərin orta göstəricisi
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="shadow-sm border-slate-200 dark:border-slate-800">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="FİN kod və ya Ad Soyad ilə axtarış..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>

            {/* Specialty Filter */}
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Bütün ixtisaslar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün İxtisaslar ({officialQuizzes.length})</SelectItem>
                {officialQuizzes.map((quiz) => (
                  <SelectItem key={quiz.id} value={quiz.id}>
                    {quiz.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={selectedStatus}
              onValueChange={(val: 'all' | 'passed' | 'failed' | 'in_progress') => setSelectedStatus(val)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Bütün statuslar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün Statuslar</SelectItem>
                <SelectItem value="passed">Yalnız Keçənlər (Müvəffəq)</SelectItem>
                <SelectItem value="failed">Yalnız Keçməyənlər</SelectItem>
                <SelectItem value="in_progress">Davam edən İmtahanlar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table Results */}
      <Card className="shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden">
        <CardHeader className="p-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold">Nəticə Cədvəli</CardTitle>
            <CardDescription className="text-xs">
              Göstərilən namizəd sayı: {filteredRows.length} / {attemptsData.length}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-800/60">
              <TableRow className="text-xs font-semibold">
                <TableHead className="w-12 text-center">№</TableHead>
                <TableHead>FİN Kod</TableHead>
                <TableHead>Namizəd (Ad, Soyad)</TableHead>
                <TableHead>İxtisas</TableHead>
                <TableHead className="text-center">Doğru / Cəmi</TableHead>
                <TableHead className="text-center">Səhv / Boş</TableHead>
                <TableHead className="text-center">Yekun Bal</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Sərf Olunan Vaxt</TableHead>
                <TableHead className="text-right">Tarix</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-32 text-center text-slate-500 text-sm">
                    Məlumatlar yüklənir...
                  </TableCell>
                </TableRow>
              ) : filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-32 text-center text-slate-500 text-sm">
                    Heç bir nəticə tapılmadı.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((row, idx) => (
                  <TableRow key={row.id} className="text-xs hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <TableCell className="text-center font-medium text-slate-400">{idx + 1}</TableCell>
                    <TableCell>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {row.fin}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                      {row.fullName}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={row.specialty}>
                      <span className="text-slate-600 dark:text-slate-300 font-medium">{row.specialty}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-bold text-emerald-600">{row.correctCount}</span>
                      <span className="text-slate-400"> / {row.totalQuestions}</span>
                    </TableCell>
                    <TableCell className="text-center text-slate-500">
                      <span className="text-red-500">{row.incorrectCount}</span> / <span>{row.unansweredCount}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      {row.isCompleted ? (
                        <span className="font-extrabold text-sm text-blue-600 dark:text-blue-400">
                          %{row.score}
                        </span>
                      ) : (
                        <span className="text-amber-500 font-medium">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {!row.isCompleted ? (
                        <Badge variant="outline" className="border-amber-400 text-amber-600 bg-amber-50 dark:bg-amber-950/30">
                          Davam edir
                        </Badge>
                      ) : row.isPassed ? (
                        <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                          Keçdi
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="font-semibold">
                          Keçmədi
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-slate-500 font-mono">
                      {formatSeconds(row.timeSpent)}
                    </TableCell>
                    <TableCell className="text-right text-slate-500 whitespace-nowrap">
                      {new Date(row.startedAt).toLocaleDateString('az-AZ', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
