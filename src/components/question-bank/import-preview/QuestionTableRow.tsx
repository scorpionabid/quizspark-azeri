import { useState, useEffect } from 'react';
import { TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Trash2, AlertTriangle, Pencil, X, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { PreviewQuestion } from '@/utils/parsers/types';
import { ParseWarning } from '@/utils/parsers/types';
import { MathRenderer } from '../MathRenderer';
import { DIFFICULTY_COLORS, TYPE_LABELS } from './constants';
import { isValidQuestion } from './utils';
import { TypeStructurePreview } from './TypeStructurePreview';

interface QuestionTableRowProps {
  q: PreviewQuestion;
  globalIdx: number;
  isEditing: boolean;
  warnings: ParseWarning[];
  onEdit: (idx: number) => void;
  onDelete: (idx: number) => void;
  onSave: (idx: number, updated: PreviewQuestion) => void;
  onCancel: () => void;
}

export function QuestionTableRow({
  q,
  globalIdx,
  isEditing,
  warnings,
  onEdit,
  onDelete,
  onSave,
  onCancel,
}: QuestionTableRowProps) {
  const [localDraft, setLocalDraft] = useState<PreviewQuestion | null>(null);

  useEffect(() => {
    if (isEditing) setLocalDraft({ ...q });
    else setLocalDraft(null);
  }, [isEditing, q]);

  const qWarnings = warnings.filter(w => {
    const qt = q.question_text?.slice(0, 35) ?? '';
    return w.message.includes(qt);
  });
  const hasError = qWarnings.some(w => w.severity === 'error') || !isValidQuestion(q, warnings);
  const hasWarning = qWarnings.some(w => w.severity === 'warning');

  return (
    <motion.tr
      key={`q-${globalIdx}`}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.18 }}
      className={`border-b border-border/30 ${hasError ? 'bg-rose-500/5 dark:bg-rose-500/10' : hasWarning ? 'bg-amber-500/5' : ''}`}
    >
      {/* # */}
      <TableCell className="text-xs text-muted-foreground font-mono align-top pt-3">
        {globalIdx + 1}
      </TableCell>

      {/* Sual */}
      <TableCell className="align-top py-2">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={localDraft?.question_text ?? ''}
              onChange={e => setLocalDraft(d => d ? { ...d, question_text: e.target.value } : d)}
              placeholder="Sual mətni"
              className="h-8 text-sm"
            />
            <Input
              value={localDraft?.correct_answer ?? ''}
              onChange={e => setLocalDraft(d => d ? { ...d, correct_answer: e.target.value } : d)}
              placeholder="Düzgün cavab"
              className="h-8 text-sm"
            />
            <Input
              value={localDraft?.category ?? ''}
              onChange={e => setLocalDraft(d => d ? { ...d, category: e.target.value } : d)}
              placeholder="Kateqoriya (ixtiyari)"
              className="h-8 text-sm"
            />
            <Input
              value={localDraft?.explanation ?? ''}
              onChange={e => setLocalDraft(d => d ? { ...d, explanation: e.target.value } : d)}
              placeholder="İzahat (ixtiyari)"
              className="h-8 text-sm"
            />
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm leading-snug">
              {(hasError || hasWarning) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertTriangle
                        className={`inline h-3.5 w-3.5 mr-1.5 mb-0.5 cursor-help ${hasError ? 'text-rose-500' : 'text-amber-500'}`}
                        data-testid={`warning-icon-${globalIdx}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs p-3 space-y-2">
                      <p className="font-bold border-b pb-1 mb-1">{hasError ? 'Mütləq düzəldilməli xətalar:' : 'Xəbərdarlıqlar:'}</p>
                      {qWarnings.length > 0 ? (
                        qWarnings.map((w, wi) => (
                          <div key={wi} className={`flex gap-1.5 ${w.severity === 'error' ? 'text-rose-500' : 'text-amber-500'}`}>
                            <span className="shrink-0">•</span>
                            <span>{w.message}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-rose-500">• Sual mətni və ya düzgün cavab boşdur</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {q.question_text ? (
                <span data-testid={`question-text-${globalIdx}`} className={hasError ? 'text-rose-600 font-medium' : ''}>
                  <MathRenderer text={q.question_text} />
                </span>
              ) : (
                <span className="italic text-muted-foreground">Sual mətni yoxdur</span>
              )}
            </p>
            <div className="flex flex-wrap gap-1">
              {q.correct_answer && !['matching', 'ordering'].includes(q.question_type) && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 h-4 text-emerald-500 border-emerald-500/30 max-w-[180px] overflow-hidden"
                >
                  ✓{' '}
                  <MathRenderer
                    text={q.correct_answer.length > 25 ? q.correct_answer.slice(0, 25) + '…' : q.correct_answer}
                  />
                </Badge>
              )}
              {q.category && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                  {q.category}
                </Badge>
              )}
              {q.potential_duplicate && (
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4 bg-rose-500/10 text-rose-600 border-rose-500/20">
                  <AlertTriangle className="h-3 w-3 mr-1" /> Dublikat?
                </Badge>
              )}
              {q.tags?.map(t => (
                <Badge key={t} variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                  {t}
                </Badge>
              ))}
            </div>
            <TypeStructurePreview q={q} />
          </div>
        )}
      </TableCell>

      {/* Tip */}
      <TableCell className="align-top pt-3">
        {isEditing ? (
          <Select
            value={localDraft?.question_type ?? 'multiple_choice'}
            onValueChange={v => setLocalDraft(d => d ? { ...d, question_type: v } : d)}
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

      {/* Çətinlik */}
      <TableCell className="align-top pt-3">
        {isEditing ? (
          <Select
            value={localDraft?.difficulty ?? 'orta'}
            onValueChange={v => setLocalDraft(d => d ? { ...d, difficulty: v } : d)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asan" className="text-xs">Asan</SelectItem>
              <SelectItem value="orta" className="text-xs">Orta</SelectItem>
              <SelectItem value="çətin" className="text-xs">Çətin</SelectItem>
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

      {/* Əməliyyat */}
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
                    onClick={() => localDraft && onSave(globalIdx, localDraft)}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Saxla</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onCancel}>
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
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEdit(globalIdx)}>
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
                    onClick={() => onDelete(globalIdx)}
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
}
