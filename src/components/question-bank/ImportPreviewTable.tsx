import { useState } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, Tags } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { ParseWarning } from '@/utils/import-parsers';
import { PreviewQuestion } from '@/utils/parsers/types';
import { ALL_SCHOOL_SUBJECTS, SCHOOL_GRADES } from '@/lib/constants/subjects';
import { PAGE_SIZE } from './import-preview/constants';
import { isValidQuestion, computeStats } from './import-preview/utils';
import { ImportSummaryBar } from './import-preview/ImportSummaryBar';
import { ImportStatsPanel } from './import-preview/ImportStatsPanel';
import { QuestionTableRow } from './import-preview/QuestionTableRow';
import { QuestionViewDialog } from './QuestionViewDialog';
import { formatQuestionsForImport } from './import-export/utils';
import { QuestionBankItem } from '@/hooks/useQuestionBank';

export type { PreviewQuestion };

interface ImportPreviewTableProps {
  questions: PreviewQuestion[];
  onChange: (questions: PreviewQuestion[]) => void;
  onCheckDuplicates?: () => void;
  isCheckingDuplicates?: boolean;
  onBulkEnhance?: () => void;
  isBulkEnhancing?: boolean;
  warnings?: ParseWarning[];
}

export function ImportPreviewTable({
  questions,
  onChange,
  onCheckDuplicates,
  isCheckingDuplicates,
  onBulkEnhance,
  isBulkEnhancing,
  warnings = [],
}: ImportPreviewTableProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [viewingIndex, setViewingIndex] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [showStats, setShowStats] = useState(false);

  // Bulk default metadata controls for imported questions
  const [bulkSubject, setBulkSubject] = useState('');
  const [bulkGrade, setBulkGrade] = useState('');
  const [bulkTopic, setBulkTopic] = useState('');
  const [bulkStandard, setBulkStandard] = useState('');
  const [bulkLevel, setBulkLevel] = useState('');
  const [bulkWeight, setBulkWeight] = useState('');

  const handleApplyBulkMetadata = (onlyEmpty: boolean) => {
    const parsedWeight = bulkWeight.trim() ? parseFloat(bulkWeight) : null;
    const next = questions.map((q) => {
      const updated: PreviewQuestion = { ...q };
      if (bulkSubject && (!onlyEmpty || !q.subject)) updated.subject = bulkSubject;
      if (bulkGrade && (!onlyEmpty || !q.grade)) updated.grade = bulkGrade;
      if (bulkTopic.trim() && (!onlyEmpty || !q.topic)) {
        updated.topic = bulkTopic.trim();
        if (!updated.category) updated.category = bulkTopic.trim();
      }
      if (bulkStandard.trim() && (!onlyEmpty || !q.curriculum_standard)) {
        updated.curriculum_standard = bulkStandard.trim();
      }
      if (bulkLevel && (!onlyEmpty || !q.difficulty_level)) {
        updated.difficulty_level = bulkLevel;
        if (!onlyEmpty || !q.difficulty) {
          updated.difficulty = bulkLevel === 'I' ? 'asan' : bulkLevel === 'IV' ? 'çətin' : 'orta';
        }
      }
      if (parsedWeight != null && !isNaN(parsedWeight) && parsedWeight > 0 && (!onlyEmpty || q.weight == null)) {
        updated.weight = parsedWeight;
      }
      return updated;
    });
    onChange(next);
  };

  const totalPages = Math.ceil(questions.length / PAGE_SIZE);
  const pageStart = page * PAGE_SIZE;
  const pageEnd = Math.min(pageStart + PAGE_SIZE, questions.length);
  const pageQuestions = questions.slice(pageStart, pageEnd);

  const handleDelete = (globalIndex: number) => {
    onChange(questions.filter((_, i) => i !== globalIndex));
    if (editingIndex === globalIndex) setEditingIndex(null);
    const newTotalPages = Math.ceil((questions.length - 1) / PAGE_SIZE);
    if (page >= newTotalPages && page > 0) setPage(page - 1);
  };

  const handleSave = (globalIndex: number, updated: PreviewQuestion) => {
    const next = [...questions];
    next[globalIndex] = updated;
    onChange(next);
    setEditingIndex(null);
  };

  const handleClearInvalid = () => {
    const validQuestions = questions.filter(q => isValidQuestion(q, warnings));
    onChange(validQuestions);
    setEditingIndex(null);
    setPage(0);
  };

  const validCount = questions.filter(q => isValidQuestion(q, warnings)).length;
  const stats = computeStats(questions);

  return (
    <div className="flex flex-col h-full space-y-3 min-h-[300px]">
      <ImportSummaryBar
        validCount={validCount}
        invalidCount={questions.length - validCount}
        totalCount={questions.length}
        showStats={showStats}
        onToggleStats={() => setShowStats(s => !s)}
        onBulkEnhance={onBulkEnhance}
        isBulkEnhancing={isBulkEnhancing}
        onCheckDuplicates={onCheckDuplicates}
        isCheckingDuplicates={isCheckingDuplicates}
        onClearInvalid={handleClearInvalid}
      />

      <ImportStatsPanel
        visible={showStats}
        stats={stats}
        totalQuestions={questions.length}
      />

      {/* Bulk Curriculum Metadata Defaults Bar */}
      <div className="rounded-xl border border-academic-line bg-academic-surface/60 p-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-academic-ink flex items-center gap-1.5">
            <Tags className="h-3.5 w-3.5 text-academic-accent" />
            Toplu Kurikulum Metadatası Tətbiq Et ({questions.length} sual)
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => handleApplyBulkMetadata(true)}
              className="h-7 text-[11px] px-2.5"
            >
              Yalnız boşlara
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => handleApplyBulkMetadata(false)}
              className="h-7 text-[11px] px-2.5 bg-academic-accent hover:bg-academic-accent-deep text-white"
            >
              Hamısına tətbiq et
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <Select value={bulkSubject || 'none'} onValueChange={(v) => setBulkSubject(v === 'none' ? '' : v)}>
            <SelectTrigger className="h-7 text-xs bg-card">
              <SelectValue placeholder="Fənn" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              <SelectItem value="none" className="text-xs">Fənn seçin</SelectItem>
              {ALL_SCHOOL_SUBJECTS.map((s) => (
                <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={bulkGrade || 'none'} onValueChange={(v) => setBulkGrade(v === 'none' ? '' : v)}>
            <SelectTrigger className="h-7 text-xs bg-card">
              <SelectValue placeholder="Sinif" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none" className="text-xs">Sinif seçin</SelectItem>
              {SCHOOL_GRADES.map((g) => (
                <SelectItem key={g} value={`${g}-ci sinif`} className="text-xs">{g}-ci sinif</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            value={bulkTopic}
            onChange={(e) => setBulkTopic(e.target.value)}
            placeholder="Mövzu (məs: 4.2 ...)"
            className="h-7 text-xs bg-card"
          />

          <Input
            value={bulkStandard}
            onChange={(e) => setBulkStandard(e.target.value)}
            placeholder="Standart (məs: 6-4.2.1)"
            className="h-7 text-xs bg-card"
          />

          <Select value={bulkLevel || 'none'} onValueChange={(v) => setBulkLevel(v === 'none' ? '' : v)}>
            <SelectTrigger className="h-7 text-xs bg-card">
              <SelectValue placeholder="Səviyyə (I–IV)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none" className="text-xs">Səviyyə</SelectItem>
              <SelectItem value="I" className="text-xs">I səviyyə (Asan)</SelectItem>
              <SelectItem value="II" className="text-xs">II səviyyə (Orta)</SelectItem>
              <SelectItem value="III" className="text-xs">III səviyyə (Yüksək)</SelectItem>
              <SelectItem value="IV" className="text-xs">IV səviyyə (Çətin)</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            min={1}
            max={100}
            value={bulkWeight}
            onChange={(e) => setBulkWeight(e.target.value)}
            placeholder="Çəki / Bal (məs: 5)"
            className="h-7 text-xs bg-card tabular-nums"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 rounded-lg border border-border/50">
        <Table>
          <TableHeader className="sticky top-0 bg-background/95 backdrop-blur z-10">
            <TableRow>
              <TableHead className="w-8">#</TableHead>
              <TableHead>Sual</TableHead>
              <TableHead className="w-28">Tip</TableHead>
              <TableHead className="w-24">Çətinlik</TableHead>
              <TableHead className="w-20 text-right">Əməliyyat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence initial={false}>
              {pageQuestions.map((q, localIdx) => {
                const globalIdx = pageStart + localIdx;
                return (
                  <QuestionTableRow
                    key={`q-${globalIdx}`}
                    q={q}
                    globalIdx={globalIdx}
                    isEditing={editingIndex === globalIdx}
                    warnings={warnings}
                    onEdit={setEditingIndex}
                    onDelete={handleDelete}
                    onSave={handleSave}
                    onCancel={() => setEditingIndex(null)}
                    onView={setViewingIndex}
                  />
                );
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
      </ScrollArea>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {pageStart + 1}–{pageEnd} / {questions.length} sual
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={page === 0}
              onClick={() => setPage(p => Math.max(0, p - 1))}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="px-2 font-mono">
              {page + 1}/{totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {viewingIndex !== null && (
        <QuestionViewDialog
          open={viewingIndex !== null}
          onOpenChange={(isOpen) => !isOpen && setViewingIndex(null)}
          question={
            {
              ...formatQuestionsForImport([questions[viewingIndex!]])[0],
              id: 'preview-id',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            } as QuestionBankItem
          }
        />
      )}
    </div>
  );
}
