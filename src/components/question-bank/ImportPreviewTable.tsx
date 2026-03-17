import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Pencil,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ParseWarning } from '@/utils/import-parsers';
import { MathRenderer } from './MathRenderer';

export interface PreviewQuestion {
  question_text: string;
  question_type: string;
  options: string[] | Record<string, string> | null;
  correct_answer: string;
  explanation?: string;
  category?: string;
  difficulty?: string;
  bloom_level?: string;
  tags?: string[];
  title?: string;
}

interface ImportPreviewTableProps {
  questions: PreviewQuestion[];
  onChange: (questions: PreviewQuestion[]) => void;
  warnings?: ParseWarning[];
}

const PAGE_SIZE = 50;

const DIFFICULTY_COLORS: Record<string, string> = {
  asan: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
  orta: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
  çətin: 'bg-rose-500/15 text-rose-500 border-rose-500/30',
};

const TYPE_LABELS: Record<string, string> = {
  multiple_choice: 'Çoxseçimli',
  true_false: 'Doğru/Yanlış',
  short_answer: 'Qısa Cavab',
  essay: 'Esse',
  matching: 'Uyğunlaşdırma',
  ordering: 'Sıralama',
  numerical: 'Rəqəmsal',
  fill_in_the_blank: 'Boşluq Doldur',
  fill_blank: 'Boşluq Doldur',
  code: 'Kod',
};

function isValidQuestion(q: PreviewQuestion): boolean {
  return !!(q.question_text?.trim() && q.correct_answer?.trim());
}

// ─── Statistika hesablama ─────────────────────────────────────────────────────
function computeStats(questions: PreviewQuestion[]) {
  const categoryMap: Record<string, number> = {};
  const diffMap: Record<string, number> = {};
  const typeMap: Record<string, number> = {};

  for (const q of questions) {
    const cat = q.category || 'Digər';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;

    const diff = q.difficulty || 'orta';
    diffMap[diff] = (diffMap[diff] || 0) + 1;

    const type = q.question_type || 'multiple_choice';
    typeMap[type] = (typeMap[type] || 0) + 1;
  }

  const topCategories = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return { categoryMap, diffMap, typeMap, topCategories };
}

export function ImportPreviewTable({
  questions,
  onChange,
  warnings = [],
}: ImportPreviewTableProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<PreviewQuestion | null>(null);
  const [page, setPage] = useState(0);
  const [showStats, setShowStats] = useState(false);

  const totalPages = Math.ceil(questions.length / PAGE_SIZE);
  const pageStart = page * PAGE_SIZE;
  const pageEnd = Math.min(pageStart + PAGE_SIZE, questions.length);
  const pageQuestions = questions.slice(pageStart, pageEnd);

  const handleDelete = (globalIndex: number) => {
    onChange(questions.filter((_, i) => i !== globalIndex));
    if (editingIndex === globalIndex) {
      setEditingIndex(null);
      setEditDraft(null);
    }
    // Əgər cari səhifə boşaldısa əvvəlki səhifəyə qayıt
    const newTotal = questions.length - 1;
    const newTotalPages = Math.ceil(newTotal / PAGE_SIZE);
    if (page >= newTotalPages && page > 0) setPage(page - 1);
  };

  const handleEdit = (globalIndex: number) => {
    setEditingIndex(globalIndex);
    setEditDraft({ ...questions[globalIndex] });
  };

  const handleSave = (globalIndex: number) => {
    if (!editDraft) return;
    const updated = [...questions];
    updated[globalIndex] = editDraft;
    onChange(updated);
    setEditingIndex(null);
    setEditDraft(null);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditDraft(null);
  };

  const validCount = questions.filter(isValidQuestion).length;
  const invalidCount = questions.length - validCount;
  const stats = computeStats(questions);

  return (
    <div className="space-y-3">
      {/* ─── Xülasə sətri ─── */}
      <div className="flex items-center justify-between text-sm flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-500 font-medium">
            <CheckCircle2 className="h-4 w-4" />
            {validCount} hazır
          </span>
          {invalidCount > 0 && (
            <span className="flex items-center gap-1 text-amber-500 font-medium">
              <AlertTriangle className="h-4 w-4" />
              {invalidCount} natamam
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{questions.length} sual</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs gap-1 text-muted-foreground"
            onClick={() => setShowStats(s => !s)}
          >
            <BarChart2 className="h-3.5 w-3.5" />
            Statistika
            {showStats ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      {/* ─── Statistika paneli ─── */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-3 p-3 bg-muted/40 rounded-lg border border-border/50 text-xs">
              {/* Kateqoriyalar */}
              <div>
                <p className="font-medium text-muted-foreground mb-1.5">Kateqoriyalar</p>
                <div className="space-y-1">
                  {stats.topCategories.map(([cat, count]) => (
                    <div key={cat} className="flex justify-between gap-2">
                      <span className="truncate text-foreground/80">{cat}</span>
                      <span className="font-mono text-muted-foreground shrink-0">{count}</span>
                    </div>
                  ))}
                  {Object.keys(stats.categoryMap).length > 5 && (
                    <span className="text-muted-foreground">
                      +{Object.keys(stats.categoryMap).length - 5} daha
                    </span>
                  )}
                </div>
              </div>

              {/* Çətinlik */}
              <div>
                <p className="font-medium text-muted-foreground mb-1.5">Çətinlik</p>
                <div className="space-y-1">
                  {Object.entries(stats.diffMap).map(([diff, count]) => (
                    <div key={diff} className="flex justify-between gap-2">
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 h-4 ${DIFFICULTY_COLORS[diff] ?? ''}`}
                      >
                        {diff}
                      </Badge>
                      <span className="font-mono text-muted-foreground">
                        {Math.round((count / questions.length) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sual tipi */}
              <div>
                <p className="font-medium text-muted-foreground mb-1.5">Sual tipi</p>
                <div className="space-y-1">
                  {Object.entries(stats.typeMap).map(([type, count]) => (
                    <div key={type} className="flex justify-between gap-2">
                      <span className="truncate text-foreground/80">
                        {TYPE_LABELS[type] ?? type}
                      </span>
                      <span className="font-mono text-muted-foreground shrink-0">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Cədvəl ─── */}
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
                const valid = isValidQuestion(q);
                const isEditing = editingIndex === globalIdx;
                return (
                  <motion.tr
                    key={`q-${globalIdx}`}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.18 }}
                    className={`border-b border-border/30 ${!valid ? 'bg-amber-500/5' : ''}`}
                  >
                    <TableCell className="text-xs text-muted-foreground font-mono align-top pt-3">
                      {globalIdx + 1}
                    </TableCell>
                    <TableCell className="align-top py-2">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            value={editDraft?.question_text ?? ''}
                            onChange={e =>
                              setEditDraft(d =>
                                d ? { ...d, question_text: e.target.value } : d,
                              )
                            }
                            placeholder="Sual mətni"
                            className="h-8 text-sm"
                          />
                          <Input
                            value={editDraft?.correct_answer ?? ''}
                            onChange={e =>
                              setEditDraft(d =>
                                d ? { ...d, correct_answer: e.target.value } : d,
                              )
                            }
                            placeholder="Düzgün cavab"
                            className="h-8 text-sm"
                          />
                          <Input
                            value={editDraft?.category ?? ''}
                            onChange={e =>
                              setEditDraft(d =>
                                d ? { ...d, category: e.target.value } : d,
                              )
                            }
                            placeholder="Kateqoriya (ixtiyari)"
                            className="h-8 text-sm"
                          />
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className={`text-sm leading-snug ${!valid ? 'text-amber-600' : ''}`}>
                            {!valid && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <AlertTriangle className="inline h-3 w-3 mr-1 mb-0.5 cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs text-xs">
                                    {warnings
                                      .filter(w => {
                                        const qt = q.question_text?.slice(0, 35) ?? '';
                                        return w.message.includes(qt);
                                      })
                                      .map((w, wi) => (
                                        <p key={wi}>• {w.message}</p>
                                      ))}
                                    {warnings.filter(w => {
                                      const qt = q.question_text?.slice(0, 35) ?? '';
                                      return w.message.includes(qt);
                                    }).length === 0 && (
                                      <p>Sual mətni və ya düzgün cavab boşdur</p>
                                    )}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            {q.question_text ? (
                              <MathRenderer text={q.question_text} />
                            ) : (
                              <span className="italic text-muted-foreground">
                                Sual mətni yoxdur
                              </span>
                            )}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {q.correct_answer && (
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 h-4 text-emerald-500 border-emerald-500/30 max-w-[180px] overflow-hidden"
                              >
                                ✓{' '}
                                <MathRenderer
                                  text={
                                    q.correct_answer.length > 25
                                      ? q.correct_answer.slice(0, 25) + '…'
                                      : q.correct_answer
                                  }
                                />
                              </Badge>
                            )}
                            {q.category && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                                {q.category}
                              </Badge>
                            )}
                            {q.tags?.map(t => (
                              <Badge
                                key={t}
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 h-4"
                              >
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="align-top pt-3">
                      {isEditing ? (
                        <Select
                          value={editDraft?.question_type ?? 'multiple_choice'}
                          onValueChange={v =>
                            setEditDraft(d => (d ? { ...d, question_type: v } : d))
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(TYPE_LABELS).map(([val, label]) => (
                              <SelectItem key={val} value={val} className="text-xs">
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {TYPE_LABELS[q.question_type] ?? q.question_type}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="align-top pt-3">
                      {isEditing ? (
                        <Select
                          value={editDraft?.difficulty ?? 'orta'}
                          onValueChange={v =>
                            setEditDraft(d => (d ? { ...d, difficulty: v } : d))
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asan" className="text-xs">
                              Asan
                            </SelectItem>
                            <SelectItem value="orta" className="text-xs">
                              Orta
                            </SelectItem>
                            <SelectItem value="çətin" className="text-xs">
                              Çətin
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      ) : q.difficulty ? (
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1.5 h-5 ${DIFFICULTY_COLORS[q.difficulty] ?? ''}`}
                        >
                          {q.difficulty}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="align-top pt-2 text-right">
                      {isEditing ? (
                        <div className="flex justify-end gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-emerald-500"
                                  onClick={() => handleSave(globalIdx)}
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Saxla</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={handleCancel}
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Ləğv et</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => handleEdit(globalIdx)}
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Redaktə et</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-destructive hover:text-destructive"
                                  onClick={() => handleDelete(globalIdx)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Sil</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}
                    </TableCell>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
      </ScrollArea>

      {/* ─── Pagination (100+ sual üçün) ─── */}
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
