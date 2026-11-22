import React, { useState, useMemo } from 'react';
import { Download, Search, School, User, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { QuizResultWithProfile } from '@/hooks/useQuizAttempts';
import {
  exportQuizResultsToExcel,
  formatTimeSpent,
  computeResultMetrics,
  findAttemptAnswersForResult,
  AttemptAnswersRecord,
} from '@/utils/exportQuizResultsExcel';

export interface QuizStudentsResultsTabProps {
  quizTitle: string;
  results: QuizResultWithProfile[];
  passPercentage?: number;
  attempts?: AttemptAnswersRecord[];
}

function relDate(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'indicə';
    if (mins < 60) return `${mins} dəq əvvəl`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} saat əvvəl`;
    return `${Math.floor(hours / 24)} gün əvvəl`;
  } catch {
    return dateStr;
  }
}

export const QuizStudentsResultsTab: React.FC<QuizStudentsResultsTabProps> = ({
  quizTitle,
  results,
  passPercentage = 60,
  attempts,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  // Derive unique classes present in this quiz
  const grades = useMemo(() => {
    const set = new Set<string>();
    results.forEach((r) => {
      const g = r.profiles?.grade?.trim();
      if (g) set.add(g);
    });
    return Array.from(set).sort();
  }, [results]);

  // Filtered results
  const filteredResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return results.filter((r) => {
      const prof = r.profiles;
      const name = (prof?.full_name || '').toLowerCase();
      const utis = (prof?.utis_code || prof?.fin || '').toLowerCase();
      const school = (prof?.school || '').toLowerCase();
      const grade = (prof?.grade || '').trim();

      if (selectedGrade !== 'all' && grade !== selectedGrade) {
        return false;
      }

      if (q) {
        const matchesName = name.includes(q);
        const matchesUtis = utis.includes(q);
        const matchesSchool = school.includes(q);
        return matchesName || matchesUtis || matchesSchool;
      }

      return true;
    });
  }, [results, searchQuery, selectedGrade]);

  const handleExportExcel = () => {
    try {
      const targetResults = filteredResults.length > 0 ? filteredResults : results;
      const fileName = exportQuizResultsToExcel({
        quizTitle,
        results: targetResults,
        passPercentage,
        attempts,
      });
      toast.success(`Excel protokol endirildi: ${fileName}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Excel faylı yaradılarkən xəta baş verdi.';
      toast.error(msg);
    }
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <School className="h-10 w-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm font-medium">Hələ heç bir şagird bu quizi tamamlamayıb.</p>
        <p className="text-xs text-muted-foreground mt-1">
          Şagirdlər UTİS kodu və ya linklə qoşulduqdan sonra nəticələr burada görünəcək.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {/* Top Filter & Export Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex flex-1 items-center gap-2">
          {/* Search by Name / UTIS */}
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Şagird adı və ya UTİS ilə axtar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs rounded-lg"
            />
          </div>

          {/* Class Filter */}
          {grades.length > 0 && (
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">Bütün siniflər</option>
              {grades.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* 1-Click Excel Protocol Export Button */}
        <Button
          onClick={handleExportExcel}
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs font-semibold shrink-0 border-emerald-600/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
          title="Təhsil Nazirliyi standartlarına uyğun rəsmi Excel sınaq protokolu"
        >
          <Download className="h-3.5 w-3.5" />
          Excel (.xlsx) Protokol
        </Button>
      </div>

      {/* Meta Counter */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          Göstərilir: <strong className="text-foreground">{filteredResults.length}</strong> / {results.length} şagird
        </span>
        <span className="text-[11px]">Keçid balı: {passPercentage}%</span>
      </div>

      {/* Results List */}
      {filteredResults.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-xs rounded-xl border border-dashed p-6">
          Axtarışa və ya seçilmiş sinifə uyğun nəticə tapılmadı.
        </div>
      ) : (
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {filteredResults.map((r, i) => {
            const prof = r.profiles;
            const utisCode = prof?.utis_code || prof?.fin;
            const fullName = prof?.full_name || 'Naməlum';
            const school = prof?.school;
            const grade = prof?.grade;
            const attemptAnswers = findAttemptAnswersForResult(r, attempts);
            const metrics = computeResultMetrics(r, passPercentage, attemptAnswers);

            return (
              <div
                key={r.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border bg-card/80 p-3 shadow-sm hover:border-primary/30 transition-all text-xs"
              >
                {/* Left: Rank & Student Profile */}
                <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-muted text-[11px] font-mono font-bold text-muted-foreground shrink-0 mt-0.5 sm:mt-0">
                    {i + 1}
                  </span>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground text-sm truncate">
                        {fullName}
                      </span>
                      {utisCode && (
                        <Badge
                          variant="secondary"
                          className="font-mono text-[10px] px-1.5 py-0 h-4 bg-muted/70 text-muted-foreground"
                          title="UTİS Kodu"
                        >
                          UTİS: {utisCode}
                        </Badge>
                      )}
                      {grade && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 h-4 border-primary/30 text-primary"
                        >
                          {grade}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      {school && <span className="truncate max-w-[200px]">{school}</span>}
                      <span>·</span>
                      <span title={new Date(r.completed_at).toLocaleString('az-AZ')}>
                        {relDate(r.completed_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Score, Accuracy, Time */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                  {/* Time spent */}
                  <div className="flex items-center gap-1 text-muted-foreground text-[11px]">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimeSpent(r.time_spent)}</span>
                  </div>

                  {/* Score badge */}
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-bold text-foreground text-sm">
                        {metrics.correctCount} / {metrics.totalQuestions}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {metrics.hasExactBreakdown
                          ? `${metrics.correctCount} düz · ${metrics.incorrectCount} səhv · ${metrics.unansweredCount} boş`
                          : metrics.wrongAndBlankCount > 0
                          ? `${metrics.wrongAndBlankCount} səhv/boş`
                          : 'Bütün suallar düz'}
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                        metrics.isPassed
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                          : 'bg-destructive/15 text-destructive'
                      }`}
                    >
                      {metrics.isPassed ? (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 shrink-0" />
                      )}
                      <span>{metrics.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
