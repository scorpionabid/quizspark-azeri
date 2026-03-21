import { useState } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { ParseWarning } from '@/utils/import-parsers';
import { PreviewQuestion } from '@/utils/parsers/types';
import { PAGE_SIZE } from './import-preview/constants';
import { isValidQuestion, computeStats } from './import-preview/utils';
import { ImportSummaryBar } from './import-preview/ImportSummaryBar';
import { ImportStatsPanel } from './import-preview/ImportStatsPanel';
import { QuestionTableRow } from './import-preview/QuestionTableRow';

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
  const [page, setPage] = useState(0);
  const [showStats, setShowStats] = useState(false);

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

  const validCount = questions.filter(q => isValidQuestion(q, warnings)).length;
  const stats = computeStats(questions);

  return (
    <div className="space-y-3">
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
      />

      <ImportStatsPanel
        visible={showStats}
        stats={stats}
        totalQuestions={questions.length}
      />

      <ScrollArea className="h-[340px] rounded-lg border border-border/50">
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
    </div>
  );
}
