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
  Trophy,
  BookOpen,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  Save,
  Eye,
  Activity,
  AlertTriangle,
  Wifi,
  WifiOff,
  FileText,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { cn } from '@/lib/utils';
import { AdminAttemptReviewModal } from '@/components/exam/AdminAttemptReviewModal';

interface ExamAttemptRow {
  id: string;
  quizId: string;
  userId: string;
  fin: string;
  fullName: string;
  specialty: string;
  grade?: string;
  school?: string;
  examCategory: string;
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
  lastHeartbeatAt: string | null;
  currentQuestionIndex: number | null;
  tabSwitchCount: number;
  ipAddress: string | null;
  userAgent: string | null;
  hasAppeal?: boolean;
  answers?: unknown[];
}

type SortField =
  | 'fin'
  | 'fullName'
  | 'specialty'
  | 'currentQuestionIndex'
  | 'correctCount'
  | 'score'
  | 'isPassed'
  | 'tabSwitchCount'
  | 'timeSpent';

type SortOrder = 'asc' | 'desc' | null;

export default function AdminExamsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'official_exam' | 'Olimpiada'>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'passed' | 'failed' | 'in_progress'>('all');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleSort = (field: SortField) => {
    if (sortField !== field) {
      setSortField(field);
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else if (sortOrder === 'desc') {
      setSortField(null);
      setSortOrder(null);
    } else {
      setSortOrder('asc');
    }
  };

  // Security / Portal Lock state
  const [portalActive, setPortalActive] = useState(false);
  const [portalCode, setPortalCode] = useState('EXAM2026');
  const [allowCandidateReview, setAllowCandidateReview] = useState(false);
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
      return data || { is_active: false, access_code: 'EXAM2026', allow_candidate_review: false };
    },
  });

  useEffect(() => {
    if (examSettings) {
      setPortalActive(examSettings.is_active);
      setPortalCode(examSettings.access_code);
      setAllowCandidateReview(Boolean(examSettings.allow_candidate_review));
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
          allow_candidate_review: allowCandidateReview,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success('İmtahan ayarları uğurla yadda saxlanıldı!');
      void refetchSettings();
    } catch (err: unknown) {
      console.error('Settings save error:', err);
      const msg = err instanceof Error ? err.message : 'Xəta baş verdi';
      toast.error(`Ayarları yadda saxlamaq olmadı: ${msg}`);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Fetch official & olympiad quizzes
  const { data: officialQuizzes = [] } = useQuery({
    queryKey: ['official_quizzes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('id, title, subject, grade, exam_category, pass_percentage, specialty_key, question_count')
        .in('exam_category', ['official_exam', 'Olimpiada']);
      if (error) throw error;
      return data || [];
    },
  });

  const officialQuizIds = useMemo(() => officialQuizzes.map((q) => q.id), [officialQuizzes]);

  const availableQuizzes = useMemo(() => {
    return officialQuizzes.filter((q) => {
      const matchCat = selectedCategory === 'all' || q.exam_category === selectedCategory;
      const matchGrade = selectedGrade === 'all' || q.grade === selectedGrade;
      return matchCat && matchGrade;
    });
  }, [officialQuizzes, selectedCategory, selectedGrade]);

  const [selectedAttemptForLogs, setSelectedAttemptForLogs] = useState<ExamAttemptRow | null>(null);
  const [selectedAttemptForReview, setSelectedAttemptForReview] = useState<ExamAttemptRow | null>(null);

  // Fetch audit logs for selected candidate
  const { data: attemptAuditLogs = [], isLoading: isLoadingLogs } = useQuery({
    queryKey: ['attempt_audit_logs', selectedAttemptForLogs?.userId, selectedAttemptForLogs?.id],
    enabled: !!selectedAttemptForLogs,
    queryFn: async () => {
      if (!selectedAttemptForLogs) return [];
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .or(`user_id.eq.${selectedAttemptForLogs.userId},entity_id.eq.${selectedAttemptForLogs.id}`)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.warn('Audit logs fetch error:', error);
        return [];
      }
      return data || [];
    },
  });

  // Fetch attempts & results for official quizzes (parallel fetch with zero waterfall)
  const {
    data: attemptsData = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['official_exam_attempts'],
    queryFn: async () => {
      // 1. Fetch official and olympiad quizzes, attempts, profiles, and appeals in PARALLEL
      const [quizzesRes, attemptsRes, profilesRes, appealsRes] = await Promise.all([
        supabase
          .from('quizzes')
          .select('id, title, subject, grade, exam_category, pass_percentage, specialty_key, question_count')
          .in('exam_category', ['official_exam', 'Olimpiada']),
        supabase
          .from('quiz_attempts')
          .select('id, quiz_id, user_id, started_at, completed_at, score, total_questions, time_spent, last_heartbeat_at, current_question_index, tab_switch_count, ip_address, user_agent')
          .order('started_at', { ascending: false })
          .limit(5000),
        supabase
          .from('profiles')
          .select('user_id, full_name, fin, utis_code, grade, school, specialty')
          .limit(10000),
        (supabase
          .from('appeal_corrections' as never)
          .select('attempt_id')
          .limit(5000) as unknown as Promise<{ data: Array<{ attempt_id?: string }> | null; error: Error | null }>),
      ]);

      if (quizzesRes.error) throw quizzesRes.error;
      if (attemptsRes.error) throw attemptsRes.error;
      if (profilesRes.error) {
        console.warn('Profiles fetch warning:', profilesRes.error);
      }

      const officialQuizzesList = quizzesRes.data || [];
      const officialQuizIdsSet = new Set(officialQuizzesList.map((q) => q.id));
      const attempts = (attemptsRes.data || []).filter((a) => officialQuizIdsSet.has(a.quiz_id));
      const profiles = profilesRes.data || [];

      // Collect attempt IDs that have appeal corrections
      const appealsAttemptSet = new Set<string>();
      if (appealsRes && !appealsRes.error && Array.isArray(appealsRes.data)) {
        (appealsRes.data as Array<{ attempt_id?: string }>).forEach((app) => {
          if (app.attempt_id) appealsAttemptSet.add(app.attempt_id);
        });
      }

      if (!attempts || attempts.length === 0) return [];

      const profileMap = new Map<string, { full_name: string | null; fin: string | null; utis_code?: string | null; grade?: string | null; school?: string | null; specialty: string | null }>();
      profiles.forEach((p) => {
        profileMap.set(p.user_id, p);
      });

      const quizMap = new Map<string, { title: string; grade?: string | null; exam_category?: string | null; pass_percentage: number | null; question_count: number | null }>();
      officialQuizzesList.forEach((q) => {
        quizMap.set(q.id, q);
      });

      // 3. Map to ExamAttemptRow
      const rows: ExamAttemptRow[] = attempts.map((att) => {
        const prof = profileMap.get(att.user_id);
        const qInfo = quizMap.get(att.quiz_id);
        const passScore = qInfo?.pass_percentage ?? 50;
        const totalQ = att.total_questions || qInfo?.question_count || 60;
        const isComp = !!att.completed_at;

        // Stats calculation without requiring heavy answers payload
        const earnedScore = att.score ?? 0;
        const correct = totalQ > 0 ? Math.round((earnedScore * totalQ) / 100) : 0;
        const unanswered = isComp ? 0 : Math.max(0, totalQ - (att.current_question_index || 0));
        const incorrect = Math.max(0, (isComp ? totalQ : (att.current_question_index || 0)) - correct);

        const passed = isComp && earnedScore >= passScore;

        return {
          id: att.id,
          quizId: att.quiz_id,
          userId: att.user_id,
          fin: prof?.utis_code || prof?.fin || '—',
          fullName: prof?.full_name || 'Naməlum',
          specialty: prof?.specialty || qInfo?.title || '—',
          grade: prof?.grade || qInfo?.grade || undefined,
          school: prof?.school || undefined,
          examCategory: qInfo?.exam_category || 'official_exam',
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
          lastHeartbeatAt: att.last_heartbeat_at,
          currentQuestionIndex: att.current_question_index,
          tabSwitchCount: att.tab_switch_count || 0,
          ipAddress: att.ip_address,
          userAgent: att.user_agent,
          hasAppeal: appealsAttemptSet.has(att.id),
        };
      });

      return rows;
    },
    staleTime: 30000,
    refetchInterval: autoRefresh ? 30000 : false,
  });

  // Filtered and Sorted rows
  const filteredRows = useMemo(() => {
    const list = attemptsData.filter((row) => {
      // Search by FIN or Name
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesFin = row.fin.toLowerCase().includes(query);
        const matchesName = row.fullName.toLowerCase().includes(query);
        if (!matchesFin && !matchesName) return false;
      }

      // Filter by Exam Category (Rəsmi vs Olimpiada)
      if (selectedCategory !== 'all') {
        if (row.examCategory !== selectedCategory) return false;
      }

      // Filter by Grade
      if (selectedGrade !== 'all') {
        if (row.grade !== selectedGrade) return false;
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

    if (!sortField || !sortOrder) {
      return list;
    }

    return [...list].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'fullName':
          comparison = a.fullName.localeCompare(b.fullName, 'az', { sensitivity: 'base' });
          break;
        case 'fin':
          comparison = a.fin.localeCompare(b.fin, 'az', { sensitivity: 'base' });
          break;
        case 'specialty':
          comparison = a.specialty.localeCompare(b.specialty, 'az', { sensitivity: 'base' });
          break;
        case 'currentQuestionIndex': {
          const aVal = a.isCompleted ? 9999 : (a.currentQuestionIndex || 0);
          const bVal = b.isCompleted ? 9999 : (b.currentQuestionIndex || 0);
          comparison = aVal - bVal;
          break;
        }
        case 'correctCount':
          comparison = a.correctCount - b.correctCount;
          break;
        case 'score': {
          const aScore = a.isCompleted ? a.score : -1;
          const bScore = b.isCompleted ? b.score : -1;
          comparison = aScore - bScore;
          break;
        }
        case 'isPassed': {
          const getStatusVal = (row: ExamAttemptRow) => (!row.isCompleted ? 0 : row.isPassed ? 2 : 1);
          comparison = getStatusVal(a) - getStatusVal(b);
          break;
        }
        case 'tabSwitchCount':
          comparison = a.tabSwitchCount - b.tabSwitchCount;
          break;
        case 'timeSpent':
          comparison = (a.timeSpent || 0) - (b.timeSpent || 0);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [attemptsData, searchQuery, selectedCategory, selectedGrade, selectedSpecialty, selectedStatus, sortField, sortOrder]);

  // Reset pagination on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedGrade, selectedSpecialty, selectedStatus, sortField, sortOrder, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRows = useMemo(
    () => filteredRows.slice(startIndex, startIndex + pageSize),
    [filteredRows, startIndex, pageSize]
  );

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
          'UTİS / FİN Kodu': row.fin,
          'Ad, Soyad': row.fullName,
          'Kateqoriya': row.examCategory === 'Olimpiada' ? 'Zəfər Olimpiadası' : 'Rəsmi İxtisas',
          'Sinif': row.grade ? `${row.grade}-ci sinif` : '—',
          'Məktəb': row.school || '—',
          'Fənn / İxtisas': row.specialty,
          'Cari Sual': row.isCompleted ? 'Tamamlanıb' : `Sual ${row.currentQuestionIndex || 1}`,
          'Doğru Sayı': row.correctCount,
          'Səhv Sayı': row.incorrectCount,
          'Boş Sayı': row.unansweredCount,
          'Yekun Bal (%)': row.isCompleted ? row.score : 'Davam edir',
          'Keçid Həddi (%)': row.passPercentage,
          'Status': !row.isCompleted ? 'Davam edir' : row.isPassed ? 'KEÇDİ' : 'KEÇMƏDİ',
          'Pəncərə Dəyişmə Sayı': row.tabSwitchCount,
          'IP Ünvanı': row.ipAddress || '—',
          'Sərf Olunan Vaxt': formatTime(row.timeSpent),
          'Son Əlaqə': row.lastHeartbeatAt ? new Date(row.lastHeartbeatAt).toLocaleTimeString('az-AZ') : '—',
          'Başlama Tarixi': new Date(row.startedAt).toLocaleString('az-AZ'),
          'Bitirmə Tarixi': row.completedAt ? new Date(row.completedAt).toLocaleString('az-AZ') : '—',
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);

      worksheet['!cols'] = [
        { wch: 6 },
        { wch: 14 },
        { wch: 28 },
        { wch: 20 },
        { wch: 12 },
        { wch: 25 },
        { wch: 38 },
        { wch: 14 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 20 },
        { wch: 16 },
        { wch: 18 },
        { wch: 14 },
        { wch: 22 },
        { wch: 22 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'İmtahan Nəticələri');

      const dateStr = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(workbook, selectedCategory === 'Olimpiada' ? `Zefer_Olimpiadasi_Netice_${dateStr}.xlsx` : `Imtahan_Netice_${dateStr}.xlsx`);
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

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-xs">
            <input
              type="checkbox"
              id="auto-refresh-toggle"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded cursor-pointer accent-blue-600"
            />
            <label
              htmlFor="auto-refresh-toggle"
              className="cursor-pointer text-slate-700 dark:text-slate-300 font-medium select-none flex items-center gap-1.5"
            >
              <span>Avto-yeniləmə (30s)</span>
              {autoRefresh && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
            </label>
          </div>
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
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="portal-active"
                  checked={portalActive}
                  onCheckedChange={setPortalActive}
                />
                <Label htmlFor="portal-active" className="text-xs sm:text-sm font-semibold cursor-pointer">
                  {portalActive ? 'Portal Girişi Açıqdır' : 'Portal Kilidlidir'}
                </Label>
              </div>

              <div className="flex items-center space-x-2 border-l-0 sm:border-l sm:pl-4 border-slate-200 dark:border-slate-700">
                <Switch
                  id="candidate-review-active"
                  checked={allowCandidateReview}
                  onCheckedChange={setAllowCandidateReview}
                />
                <Label htmlFor="candidate-review-active" className="text-xs sm:text-sm font-semibold cursor-pointer text-indigo-900 dark:text-indigo-300">
                  {allowCandidateReview ? '📝 Cavab Baxışı AÇIQDIR (Level B)' : '📝 Cavab Baxışı BAĞLIDIR'}
                </Label>
              </div>
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
        <CardContent className="p-4 space-y-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => { setSelectedCategory('all'); setSelectedSpecialty('all'); }}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground'
              )}
            >
              Bütün İmtahanlar
            </button>
            <button
              type="button"
              onClick={() => { setSelectedCategory('Olimpiada'); setSelectedSpecialty('all'); }}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all',
                selectedCategory === 'Olimpiada'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground'
              )}
            >
              <Trophy className="w-3.5 h-3.5" />
              Zəfər Olimpiadası (Şagirdlər)
            </button>
            <button
              type="button"
              onClick={() => { setSelectedCategory('official_exam'); setSelectedSpecialty('all'); }}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all',
                selectedCategory === 'official_exam'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground'
              )}
            >
              <Award className="w-3.5 h-3.5" />
              Rəsmi İxtisas İmtahanları
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="UTİS, FİN və ya Ad Soyad ilə axtarış..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>

            {/* Grade Filter */}
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Bütün siniflər" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün Siniflər</SelectItem>
                <SelectItem value="8">VIII sinif</SelectItem>
                <SelectItem value="9">IX sinif</SelectItem>
                <SelectItem value="10">X sinif</SelectItem>
                <SelectItem value="11">XI sinif</SelectItem>
              </SelectContent>
            </Select>

            {/* Specialty / Exam Filter */}
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Bütün ixtisas və fənlər" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün İmtahanlar ({availableQuizzes.length})</SelectItem>
                {availableQuizzes.map((quiz) => (
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
              {sortField && (
                <span className="ml-2 font-medium text-blue-600 dark:text-blue-400">
                  (Sıralama: {sortField === 'fullName' ? 'Ad, Soyad' : sortField === 'fin' ? 'FİN' : sortField === 'specialty' ? 'İxtisas' : sortField === 'score' ? 'Yekun Bal' : sortField === 'correctCount' ? 'Doğru Sayı' : sortField === 'timeSpent' ? 'Vaxt' : sortField === 'tabSwitchCount' ? 'Pəncərə' : sortField === 'currentQuestionIndex' ? 'Cari Sual' : 'Status'} {sortOrder === 'asc' ? '▲ Artan' : '▼ Azalan'})
                </span>
              )}
            </CardDescription>
          </div>
          {sortField && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 px-2.5 flex items-center gap-1.5"
              onClick={() => {
                setSortField(null);
                setSortOrder(null);
              }}
            >
              <RefreshCw className="w-3 h-3" /> Sıralamanı Sıfırla
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-800/60">
              <TableRow className="text-xs font-semibold">
                <TableHead className="w-10 text-center">№</TableHead>
                
                {/* FİN / UTİS Kod */}
                <TableHead
                  className={cn(
                    "cursor-pointer select-none transition-colors hover:text-blue-600 hover:bg-slate-100/70 dark:hover:bg-slate-800",
                    sortField === 'fin' && "text-blue-600 font-bold bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                  onClick={() => handleSort('fin')}
                  title="UTİS / FİN kod üzrə A-Z / Z-A sırala"
                >
                  <div className="flex items-center gap-1.5">
                    <span>UTİS / FİN Kod</span>
                    {sortField === 'fin' ? (
                      sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600 shrink-0" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-50 shrink-0 hover:opacity-100" />
                    )}
                  </div>
                </TableHead>

                {/* İştirakçı Ad Soyad */}
                <TableHead
                  className={cn(
                    "cursor-pointer select-none transition-colors hover:text-blue-600 hover:bg-slate-100/70 dark:hover:bg-slate-800",
                    sortField === 'fullName' && "text-blue-600 font-bold bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                  onClick={() => handleSort('fullName')}
                  title="İştirakçının Adı və Soyadı üzrə A-Z / Z-A sırala"
                >
                  <div className="flex items-center gap-1.5">
                    <span>İştirakçı (Ad, Soyad)</span>
                    {sortField === 'fullName' ? (
                      sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600 shrink-0" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-50 shrink-0 hover:opacity-100" />
                    )}
                  </div>
                </TableHead>

                {/* İxtisas / Fənn */}
                <TableHead
                  className={cn(
                    "cursor-pointer select-none transition-colors hover:text-blue-600 hover:bg-slate-100/70 dark:hover:bg-slate-800",
                    sortField === 'specialty' && "text-blue-600 font-bold bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                  onClick={() => handleSort('specialty')}
                  title="İxtisas və ya fənn üzrə A-Z / Z-A sırala"
                >
                  <div className="flex items-center gap-1.5">
                    <span>İmtahan / Fənn</span>
                    {sortField === 'specialty' ? (
                      sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600 shrink-0" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-50 shrink-0 hover:opacity-100" />
                    )}
                  </div>
                </TableHead>

                {/* Cari Sual */}
                <TableHead
                  className={cn(
                    "cursor-pointer select-none transition-colors hover:text-blue-600 hover:bg-slate-100/70 dark:hover:bg-slate-800 text-center",
                    sortField === 'currentQuestionIndex' && "text-blue-600 font-bold bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                  onClick={() => handleSort('currentQuestionIndex')}
                  title="Cari sual və irəliləyişə görə sırala"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Cari Sual</span>
                    {sortField === 'currentQuestionIndex' ? (
                      sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600 shrink-0" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-50 shrink-0 hover:opacity-100" />
                    )}
                  </div>
                </TableHead>

                {/* Doğru / Cəmi */}
                <TableHead
                  className={cn(
                    "cursor-pointer select-none transition-colors hover:text-blue-600 hover:bg-slate-100/70 dark:hover:bg-slate-800 text-center",
                    sortField === 'correctCount' && "text-blue-600 font-bold bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                  onClick={() => handleSort('correctCount')}
                  title="Doğru cavab sayına görə sırala"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Doğru / Cəmi</span>
                    {sortField === 'correctCount' ? (
                      sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600 shrink-0" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-50 shrink-0 hover:opacity-100" />
                    )}
                  </div>
                </TableHead>

                {/* Yekun Bal */}
                <TableHead
                  className={cn(
                    "cursor-pointer select-none transition-colors hover:text-blue-600 hover:bg-slate-100/70 dark:hover:bg-slate-800 text-center",
                    sortField === 'score' && "text-blue-600 font-bold bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                  onClick={() => handleSort('score')}
                  title="Yekun bala görə (Artan / Azalan) sırala"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Yekun Bal</span>
                    {sortField === 'score' ? (
                      sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600 shrink-0" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-50 shrink-0 hover:opacity-100" />
                    )}
                  </div>
                </TableHead>

                {/* Canlı Status */}
                <TableHead
                  className={cn(
                    "cursor-pointer select-none transition-colors hover:text-blue-600 hover:bg-slate-100/70 dark:hover:bg-slate-800 text-center",
                    sortField === 'isPassed' && "text-blue-600 font-bold bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                  onClick={() => handleSort('isPassed')}
                  title="Statusa görə sırala"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Canlı Status</span>
                    {sortField === 'isPassed' ? (
                      sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600 shrink-0" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-50 shrink-0 hover:opacity-100" />
                    )}
                  </div>
                </TableHead>

                {/* Pəncərə */}
                <TableHead
                  className={cn(
                    "cursor-pointer select-none transition-colors hover:text-blue-600 hover:bg-slate-100/70 dark:hover:bg-slate-800 text-center",
                    sortField === 'tabSwitchCount' && "text-blue-600 font-bold bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                  onClick={() => handleSort('tabSwitchCount')}
                  title="Pəncərə dəyişmə sayına görə sırala"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Pəncərə</span>
                    {sortField === 'tabSwitchCount' ? (
                      sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600 shrink-0" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-50 shrink-0 hover:opacity-100" />
                    )}
                  </div>
                </TableHead>

                {/* Vaxt */}
                <TableHead
                  className={cn(
                    "cursor-pointer select-none transition-colors hover:text-blue-600 hover:bg-slate-100/70 dark:hover:bg-slate-800 text-center",
                    sortField === 'timeSpent' && "text-blue-600 font-bold bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                  onClick={() => handleSort('timeSpent')}
                  title="Sərf olunan vaxta görə sırala"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Vaxt</span>
                    {sortField === 'timeSpent' ? (
                      sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600 shrink-0" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-50 shrink-0 hover:opacity-100" />
                    )}
                  </div>
                </TableHead>

                <TableHead className="text-center">Əməliyyatlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-32 text-center text-slate-500 text-sm">
                    Məlumatlar yüklənir...
                  </TableCell>
                </TableRow>
              ) : filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-32 text-center text-slate-500 text-sm">
                    Heç bir nəticə tapılmadı.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((row, idx) => {
                  const diffMs = row.lastHeartbeatAt ? Date.now() - new Date(row.lastHeartbeatAt).getTime() : null;
                  const rowNumber = startIndex + idx + 1;

                  return (
                    <TableRow key={row.id} className="text-xs hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <TableCell className="text-center font-medium text-slate-400">{rowNumber}</TableCell>
                      <TableCell>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {row.fin}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                        {row.fullName}
                      </TableCell>
                      <TableCell className="max-w-[220px]" title={row.specialty}>
                        <div className="flex flex-col">
                          <span className="text-slate-800 dark:text-slate-200 font-semibold truncate">{row.specialty}</span>
                          {(row.grade || row.school) && (
                            <span className="text-[10px] text-muted-foreground truncate">
                              {row.grade ? `${row.grade}-ci sinif` : ''}{row.grade && row.school ? ' • ' : ''}{row.school || ''}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {row.isCompleted ? (
                          <span className="text-emerald-600 font-semibold text-xs">Tamamlanıb</span>
                        ) : (
                          <div className="flex flex-col items-center">
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              Sual {row.currentQuestionIndex || 1}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {row.correctCount + row.incorrectCount} / {row.totalQuestions} yazıldı
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-bold text-emerald-600">{row.correctCount}</span>
                        <span className="text-slate-400"> / {row.totalQuestions}</span>
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
                        {row.isCompleted ? (
                          row.isPassed ? (
                            <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                              Keçdi
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="font-semibold">
                              Keçmədi
                            </Badge>
                          )
                        ) : diffMs !== null && diffMs < 35000 ? (
                          <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 gap-1.5 font-bold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Canlı
                          </Badge>
                        ) : diffMs !== null && diffMs < 75000 ? (
                          <Badge variant="outline" className="border-amber-400 text-amber-600 bg-amber-50 dark:bg-amber-950/30 gap-1.5 font-medium">
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                            Zəif əlaqə
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-red-400 text-red-600 bg-red-50 dark:bg-red-950/30 gap-1.5 font-medium">
                            <span className="w-2 h-2 rounded-full bg-red-400" />
                            Oflayn
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.tabSwitchCount === 0 ? (
                          <span className="text-slate-400 font-mono text-xs">0</span>
                        ) : row.tabSwitchCount < 3 ? (
                          <Badge variant="outline" className="border-amber-400 text-amber-600 bg-amber-50 font-bold">
                            {row.tabSwitchCount}
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="font-bold flex items-center gap-1 mx-auto w-fit animate-pulse">
                            <ShieldAlert className="w-3 h-3" />
                            {row.tabSwitchCount}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center text-slate-500 font-mono">
                        {formatSeconds(row.timeSpent)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 dark:border-blue-900/40 dark:hover:bg-blue-950/40"
                            onClick={() => setSelectedAttemptForReview(row)}
                            title="Bölmələr üzrə detallı imtahan nəticələrinə bax"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detallı</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-1"
                            onClick={() => setSelectedAttemptForLogs(row)}
                            title="Namizədin imtahan audit loglarına bax"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Loglar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {filteredRows.length > 0 && (
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>
                  Göstərilir:{' '}
                  <strong className="text-slate-800 dark:text-slate-200">
                    {Math.min(filteredRows.length, startIndex + 1)} - {Math.min(filteredRows.length, startIndex + pageSize)}
                  </strong>{' '}
                  / Cəmi: <strong className="text-slate-800 dark:text-slate-200">{filteredRows.length}</strong>
                </span>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1.5">
                  <span>Sətir:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="h-7 px-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md cursor-pointer font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={500}>500</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(1)}
                  title="İlk səhifə"
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  title="Əvvəlki səhifə"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
                <span className="text-xs font-semibold px-2 text-slate-700 dark:text-slate-300 min-w-[60px] text-center">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  title="Növbəti səhifə"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  title="Son səhifə"
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AUDIT LOGS DIALOG */}
      <Dialog
        open={!!selectedAttemptForLogs}
        onOpenChange={(open) => !open && setSelectedAttemptForLogs(null)}
      >
        <DialogContent className="max-w-2xl rounded-3xl max-h-[85vh] flex flex-col">
          <DialogHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <FileText className="w-5 h-5 text-blue-600" />
              İmtahan Audit Logları
            </DialogTitle>
            <DialogDescription asChild>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs pt-1 text-slate-500">
                <span>Namizəd: <strong className="text-slate-800 dark:text-slate-200">{selectedAttemptForLogs?.fullName}</strong></span>
                <span>FİN: <strong className="font-mono text-slate-800 dark:text-slate-200">{selectedAttemptForLogs?.fin}</strong></span>
                <span>İxtisas: <strong className="text-slate-800 dark:text-slate-200">{selectedAttemptForLogs?.specialty}</strong></span>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 space-y-3 overflow-y-auto flex-1 pr-1">
            {/* Metadata Card */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">IP Ünvanı</span>
                <span className="font-mono font-semibold">{selectedAttemptForLogs?.ipAddress || 'Məlum deyil'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Pəncərə Dəyişmə</span>
                <span className={cn(
                  "font-bold font-mono",
                  (selectedAttemptForLogs?.tabSwitchCount || 0) >= 3 ? "text-destructive" : "text-slate-700 dark:text-slate-300"
                )}>
                  {selectedAttemptForLogs?.tabSwitchCount || 0} dəfə
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Son Əlaqə</span>
                <span className="font-mono">{selectedAttemptForLogs?.lastHeartbeatAt ? new Date(selectedAttemptForLogs.lastHeartbeatAt).toLocaleTimeString('az-AZ') : '—'}</span>
              </div>
              {selectedAttemptForLogs?.userAgent && (
                <div className="col-span-2 sm:col-span-3 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Cihaz / Brauzer</span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 truncate block font-mono">
                    {selectedAttemptForLogs.userAgent}
                  </span>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Fəaliyyət Xronologiyası
              </span>

              {isLoadingLogs ? (
                <div className="py-8 text-center text-xs text-slate-400">Loglar yüklənir...</div>
              ) : attemptAuditLogs.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">Bu cəhd üzrə əlavə qeyd tapılmadı.</div>
              ) : (
                <div className="space-y-2">
                  {attemptAuditLogs.map((log: {
                    id: string;
                    action: string;
                    description?: string;
                    new_values?: unknown;
                    created_at: string;
                  }) => {
                    const isWarning = log.action === 'tab_switch_detected';
                    const isSuccess = log.action === 'quiz_completed';

                    return (
                      <div
                        key={log.id}
                        className={cn(
                          "p-2.5 rounded-xl border text-xs flex items-start justify-between gap-3",
                          isWarning ? "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40" :
                          isSuccess ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40" :
                          "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {isWarning ? (
                            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          ) : isSuccess ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Activity className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-semibold block text-slate-800 dark:text-slate-200">
                              {log.description || log.action}
                            </span>
                            {log.new_values && (
                              <span className="text-[11px] text-slate-500 font-mono block pt-0.5">
                                {typeof log.new_values === 'object' ? JSON.stringify(log.new_values) : String(log.new_values)}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono shrink-0">
                          {new Date(log.created_at).toLocaleTimeString('az-AZ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CANDIDATE DETAILED ATTEMPT REVIEW MODAL */}
      <AdminAttemptReviewModal
        open={!!selectedAttemptForReview}
        onOpenChange={(open) => !open && setSelectedAttemptForReview(null)}
        attempt={selectedAttemptForReview}
      />
    </div>
  );
}
