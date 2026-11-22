import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FileSpreadsheet,
  Search,
  CheckCircle2,
  XCircle,
  Trophy,
  Filter,
  Layers,
  FileText,
  Download,
  Users,
  Award,
} from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { cn } from '@/lib/utils';
import type { ExamAttemptRow } from '@/pages/admin/AdminExamsPage';

export interface QuizItem {
  id: string;
  title: string;
  subject?: string | null;
  grade?: string | null;
  exam_category?: string | null;
}

interface ExamExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizzes: QuizItem[];
  attemptsData: ExamAttemptRow[];
  isOlympiad: boolean;
  preSelectedQuizId?: string;
}

export function ExamExportModal({
  open,
  onOpenChange,
  quizzes,
  attemptsData,
  isOlympiad,
  preSelectedQuizId,
}: ExamExportModalProps) {
  const [selectedQuizIds, setSelectedQuizIds] = useState<Set<string>>(() => {
    if (preSelectedQuizId && preSelectedQuizId !== 'all') {
      return new Set([preSelectedQuizId]);
    }
    return new Set(quizzes.map((q) => q.id));
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<'all' | '8' | '9' | '10' | '11'>('all');
  const [sheetMode, setSheetMode] = useState<'multi_sheet' | 'single_sheet'>('multi_sheet');
  const [isExporting, setIsExporting] = useState(false);

  // When dialog opens or preSelectedQuizId changes, update selection if needed
  React.useEffect(() => {
    if (open) {
      if (preSelectedQuizId && preSelectedQuizId !== 'all') {
        setSelectedQuizIds(new Set([preSelectedQuizId]));
      } else {
        setSelectedQuizIds(new Set(quizzes.map((q) => q.id)));
      }
    }
  }, [open, preSelectedQuizId, quizzes]);

  // Aggregate stats per quiz
  const quizStatsMap = useMemo(() => {
    const map = new Map<
      string,
      { count: number; completed: number; scoreSum: number; score90Plus: number; passCount: number }
    >();

    attemptsData.forEach((att) => {
      const cur = map.get(att.quizId) || {
        count: 0,
        completed: 0,
        scoreSum: 0,
        score90Plus: 0,
        passCount: 0,
      };
      cur.count += 1;
      if (att.isCompleted) {
        cur.completed += 1;
        cur.scoreSum += att.score;
        if (att.score >= 90) cur.score90Plus += 1;
        if (att.isPassed) cur.passCount += 1;
      }
      map.set(att.quizId, cur);
    });

    return map;
  }, [attemptsData]);

  // Filtered quizzes in selection list
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      if (gradeFilter !== 'all') {
        if (quiz.grade !== gradeFilter && !quiz.grade?.includes(gradeFilter)) return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchTitle = quiz.title.toLowerCase().includes(query);
        const matchSub = (quiz.subject || '').toLowerCase().includes(query);
        if (!matchTitle && !matchSub) return false;
      }

      return true;
    });
  }, [quizzes, gradeFilter, searchQuery]);

  // Toggle single quiz
  const handleToggleQuiz = (id: string) => {
    setSelectedQuizIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Select all currently filtered
  const handleSelectAllFiltered = () => {
    setSelectedQuizIds((prev) => {
      const next = new Set(prev);
      filteredQuizzes.forEach((q) => next.add(q.id));
      return next;
    });
  };

  // Deselect all currently filtered
  const handleDeselectFiltered = () => {
    setSelectedQuizIds((prev) => {
      const next = new Set(prev);
      filteredQuizzes.forEach((q) => next.delete(q.id));
      return next;
    });
  };

  // Quick select specific grade
  const handleSelectGradeOnly = (g: '8' | '9' | '10' | '11') => {
    const ids = quizzes.filter((q) => q.grade === g).map((q) => q.id);
    setSelectedQuizIds(new Set(ids));
    setGradeFilter(g);
  };

  // Selected count & matching attempts count
  const selectedCount = selectedQuizIds.size;
  const selectedAttemptsCount = useMemo(() => {
    return attemptsData.filter((att) => selectedQuizIds.has(att.quizId)).length;
  }, [attemptsData, selectedQuizIds]);

  // Helper to format time
  const formatTime = (seconds: number | null) => {
    if (!seconds) return '—';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} dəq ${secs} san`;
  };

  // Helper to sanitize Excel sheet name
  const sanitizeSheetName = (raw: string, fallback: string) => {
    const clean = raw.replace(/[:\\/?*[\]]/g, ' ').replace(/\s+/g, ' ').trim();
    return clean.slice(0, 31) || fallback;
  };

  // Execute Excel Export
  const handleExecuteExport = () => {
    if (selectedCount === 0) {
      toast.warning('Zəhmət olmasa ən azı 1 quiz seçin');
      return;
    }

    if (selectedAttemptsCount === 0) {
      toast.warning('Seçilmiş quizlər üzrə heç bir nəticə tapılmadı');
      return;
    }

    setIsExporting(true);
    try {
      const dateStr = new Date().toISOString().slice(0, 10);
      const workbook = XLSX.utils.book_new();

      const formatAttemptRow = (row: ExamAttemptRow, index: number) => {
        let degree = 'Davam edir';
        if (row.isCompleted) {
          if (row.score >= 90) degree = 'Əla (90%+)';
          else if (row.score >= 70) degree = 'Yaxşı (70-89%)';
          else if (row.score >= 50) degree = 'Kafi (50-69%)';
          else degree = 'Qeyri-kafi (<50%)';
        }

        return {
          'S/S': index + 1,
          'UTİS / FİN Kodu': row.fin,
          'Şagirdin Adı, Soyadı': row.fullName,
          'Məktəb': row.school || '—',
          'Sinif': row.grade ? `${row.grade}-ci sinif` : '—',
          'Olimpiada Fənni': row.subject || row.specialty,
          'Doğru Cavab Sayı': row.correctCount,
          'Səhv Cavab Sayı': row.incorrectCount,
          'Boş Cavab Sayı': row.unansweredCount,
          'Cəmi Sual': row.totalQuestions,
          'Yekun Bal (%)': row.isCompleted ? row.score : 'Davam edir',
          'Nəticə Dərəcəsi': degree,
          'Status': !row.isCompleted ? 'Davam edir' : row.isPassed ? 'Keçdi' : 'Keçmədi',
          'Pəncərə Dəyişmə Sayı': row.tabSwitchCount,
          'Sərf Olunan Vaxt': formatTime(row.timeSpent),
          'İmtahana Başlama Vaxtı': new Date(row.startedAt).toLocaleString('az-AZ'),
          'İmtahanı Bitirmə Vaxtı': row.completedAt ? new Date(row.completedAt).toLocaleString('az-AZ') : '—',
        };
      };

      const defaultCols: Array<{ wch: number }> = [
        { wch: 6 },  // S/S
        { wch: 14 }, // UTİS
        { wch: 28 }, // Ad, Soyad
        { wch: 35 }, // Məktəb
        { wch: 12 }, // Sinif
        { wch: 22 }, // Fənn
        { wch: 16 }, // Doğru
        { wch: 16 }, // Səhv
        { wch: 16 }, // Boş
        { wch: 12 }, // Cəmi
        { wch: 14 }, // Yekun Bal
        { wch: 18 }, // Dərəcə
        { wch: 14 }, // Status
        { wch: 20 }, // Pəncərə
        { wch: 16 }, // Vaxt
        { wch: 22 }, // Başlama
        { wch: 22 }, // Bitirmə
      ];

      if (sheetMode === 'multi_sheet') {
        // 1. Add Summary Sheet First
        const summaryData = quizzes
          .filter((q) => selectedQuizIds.has(q.id))
          .map((quiz, idx) => {
            const stats = quizStatsMap.get(quiz.id) || {
              count: 0,
              completed: 0,
              scoreSum: 0,
              score90Plus: 0,
              passCount: 0,
            };
            const avgScore = stats.completed > 0 ? Math.round(stats.scoreSum / stats.completed) : 0;
            const passRate = stats.completed > 0 ? Math.round((stats.passCount / stats.completed) * 100) : 0;

            return {
              '№': idx + 1,
              'Fənn': quiz.subject || quiz.title,
              'Sinif': quiz.grade ? `${quiz.grade}-ci sinif` : '—',
              'Cəmi İştirakçı': stats.count,
              'Tamamlayan': stats.completed,
              'Yüksək Nəticə (90%+)': stats.score90Plus,
              'Müvəffəqiyyət (50%+)': stats.passCount,
              'Keçid Faizi (%)': `%${passRate}`,
              'Orta Bal (%)': `%${avgScore}`,
            };
          });

        const summarySheet = XLSX.utils.json_to_sheet(summaryData);
        summarySheet['!cols'] = [
          { wch: 6 },
          { wch: 25 },
          { wch: 14 },
          { wch: 16 },
          { wch: 16 },
          { wch: 22 },
          { wch: 22 },
          { wch: 16 },
          { wch: 16 },
        ];
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Ümumi İcmal');

        // 2. Add each quiz as a separate worksheet
        const usedSheetNames = new Set<string>(['Ümumi İcmal']);

        quizzes
          .filter((q) => selectedQuizIds.has(q.id))
          .forEach((quiz) => {
            const quizAttempts = attemptsData
              .filter((att) => att.quizId === quiz.id)
              .sort((a, b) => (b.score || 0) - (a.score || 0));

            if (quizAttempts.length > 0) {
              const exportRows = quizAttempts.map(formatAttemptRow);
              const ws = XLSX.utils.json_to_sheet(exportRows);
              ws['!cols'] = defaultCols;

              const baseName = `${quiz.subject || 'Fənn'} ${quiz.grade ? `${quiz.grade}` : ''}`;
              let candidateName = sanitizeSheetName(baseName, 'Quiz');

              // Ensure uniqueness within 31 char limit
              let counter = 1;
              while (usedSheetNames.has(candidateName)) {
                candidateName = sanitizeSheetName(`${baseName}_${counter}`, `Quiz_${counter}`);
                counter++;
              }
              usedSheetNames.add(candidateName);

              XLSX.utils.book_append_sheet(workbook, ws, candidateName);
            }
          });
      } else {
        // Single consolidated sheet
        const allSelectedAttempts = attemptsData
          .filter((att) => selectedQuizIds.has(att.quizId))
          .sort((a, b) => {
            // Sort by grade, then subject, then score desc
            const gradeDiff = (a.grade || '').localeCompare(b.grade || '', 'az');
            if (gradeDiff !== 0) return gradeDiff;
            const subDiff = (a.subject || '').localeCompare(b.subject || '', 'az');
            if (subDiff !== 0) return subDiff;
            return (b.score || 0) - (a.score || 0);
          });

        const exportRows = allSelectedAttempts.map(formatAttemptRow);
        const ws = XLSX.utils.json_to_sheet(exportRows);
        ws['!cols'] = defaultCols;

        const sheetName = isOlympiad ? 'Zəfər Olimpiadası Nəticələri' : 'İmtahan Nəticələri';
        XLSX.utils.book_append_sheet(workbook, ws, sheetName);
      }

      // Determine output filename
      let filename = '';
      if (selectedCount === 1) {
        const singleQuiz = quizzes.find((q) => selectedQuizIds.has(q.id));
        const sub = (singleQuiz?.subject || 'Quiz').replace(/\s+/g, '_');
        const gr = singleQuiz?.grade ? `_${singleQuiz.grade}_sinif` : '';
        filename = `Zefer_Olimpiadasi_${sub}${gr}_${dateStr}.xlsx`;
      } else if (selectedCount === quizzes.length) {
        filename = `Zefer_Olimpiadasi_Qebele_Butun_Fennler_${dateStr}.xlsx`;
      } else {
        filename = `Zefer_Olimpiadasi_${selectedCount}_Fenn_Secilmis_${dateStr}.xlsx`;
      }

      XLSX.writeFile(workbook, filename);
      toast.success(`${filename} uğurla endirildi! (${selectedAttemptsCount} nəticə)`);
      onOpenChange(false);
    } catch (err: unknown) {
      console.error('Export error:', err);
      toast.error('İxrac zamanı xəta baş verdi');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-6 rounded-3xl">
        <DialogHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between gap-3 pr-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Excel İxrac Mərkəzi</span>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-400 bg-emerald-50 text-[11px]">
                    Fərdi / Çoxsaylı Seçim
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Quizləri bir-bir və ya qrup halında seçərək nəticələri Excel (.xlsx) formatında ixrac edin
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* TOP CONTROLS & FAST FILTERS */}
        <div className="space-y-3 pt-2">
          {/* Fast Grade Pills */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-semibold mr-1">Sinif üzrə:</span>
              <button
                type="button"
                onClick={() => setGradeFilter('all')}
                className={cn(
                  'px-2.5 py-1 rounded-lg font-semibold transition-all',
                  gradeFilter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'
                )}
              >
                Bütün Siniflər ({quizzes.length})
              </button>
              {(['8', '9', '10', '11'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleSelectGradeOnly(g)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg font-semibold transition-all',
                    gradeFilter === g
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  {g}-ci sinif
                </button>
              ))}
            </div>

            {/* Select/Deselect All buttons */}
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAllFiltered}
                className="h-7 text-xs font-semibold text-blue-600 hover:bg-blue-50"
              >
                Hamısını Seç
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeselectFiltered}
                className="h-7 text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Seçimi Təmizlə
              </Button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <Input
              placeholder="Fənn və ya quiz adı ilə axtarış... (Məs: Riyaziyyat, Fizika, Azərbaycan dili)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>

        {/* QUIZZES LIST (SCROLLABLE SELECTION AREA) */}
        <div className="flex-1 min-h-[220px] max-h-[340px] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden mt-2 bg-slate-50/50 dark:bg-slate-900/30">
          <ScrollArea className="h-full max-h-[338px] p-2">
            {filteredQuizzes.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Axtarışa uyğun heç bir quiz tapılmadı.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredQuizzes.map((quiz) => {
                  const isChecked = selectedQuizIds.has(quiz.id);
                  const stats = quizStatsMap.get(quiz.id) || {
                    count: 0,
                    completed: 0,
                    scoreSum: 0,
                    score90Plus: 0,
                    passCount: 0,
                  };
                  const avg = stats.completed > 0 ? Math.round(stats.scoreSum / stats.completed) : 0;

                  return (
                    <div
                      key={quiz.id}
                      onClick={() => handleToggleQuiz(quiz.id)}
                      className={cn(
                        'flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all select-none',
                        isChecked
                          ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => handleToggleQuiz(quiz.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-900 dark:text-slate-100 truncate block">
                            {quiz.subject || quiz.title}
                          </span>
                          <div className="flex items-center gap-1.5 pt-0.5">
                            {quiz.grade && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium">
                                {quiz.grade}-ci sinif
                              </Badge>
                            )}
                            <span className="text-[11px] text-slate-400">
                              {stats.count} şagird
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 text-right">
                        {stats.completed > 0 && (
                          <Badge
                            variant="secondary"
                            className={cn(
                              'text-[10px] font-bold px-1.5 py-0',
                              avg >= 80 ? 'text-amber-700 bg-amber-50 dark:bg-amber-950/40' : 'text-slate-600'
                            )}
                          >
                            %{avg}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* EXPORT STRUCTURE OPTIONS */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
          <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
            İxrac Formatı və Quruluşu:
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div
              onClick={() => setSheetMode('multi_sheet')}
              className={cn(
                'p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-2.5',
                sheetMode === 'multi_sheet'
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500/30'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              )}
            >
              <Layers className={cn('w-4 h-4 mt-0.5 shrink-0', sheetMode === 'multi_sheet' ? 'text-emerald-600' : 'text-slate-400')} />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Hər Quiz ayrıca vərəqdə (Ayrı Sheet-lər)
                </span>
                <span className="text-[11px] text-slate-500 block pt-0.5">
                  Excel faylında hər seçilmiş fənn üçün ayrıca vərəq + əvvəlində ümumi müqayisəli icmal vərəqi yaradılır.
                </span>
              </div>
            </div>

            <div
              onClick={() => setSheetMode('single_sheet')}
              className={cn(
                'p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-2.5',
                sheetMode === 'single_sheet'
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500/30'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              )}
            >
              <FileText className={cn('w-4 h-4 mt-0.5 shrink-0', sheetMode === 'single_sheet' ? 'text-emerald-600' : 'text-slate-400')} />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Bütün nəticələr tək cədvəldə (Vahid Sheet)
                </span>
                <span className="text-[11px] text-slate-500 block pt-0.5">
                  Seçilmiş bütün quizlərin şagird nəticələri bir ümumi cədvəldə toplanır (Fənn sütunu ilə).
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* DIALOG FOOTER & ACTION BUTTON */}
        <DialogFooter className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 w-full sm:w-auto">
            <span>
              Seçilmiş Quiz: <strong className="text-slate-900 dark:text-white">{selectedCount}</strong> / {quizzes.length}
            </span>
            <span className="text-slate-300">|</span>
            <span>
              Əhatə olunan şagird: <strong className="text-emerald-600">{selectedAttemptsCount}</strong> nəticə
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Ləğv et
            </Button>
            <Button
              onClick={handleExecuteExport}
              disabled={selectedCount === 0 || selectedAttemptsCount === 0 || isExporting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm h-9 px-4"
            >
              <Download className="w-4 h-4" />
              <span>
                {isExporting
                  ? 'Generasiya olunur...'
                  : selectedCount === 1
                  ? 'Seçilmiş Quiz-i İxrac Et (.xlsx)'
                  : `Seçilmiş ${selectedCount} Quiz-i İxrac Et (.xlsx)`}
              </span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
