import { useState, useEffect } from 'react';
import { TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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
import { Trash2, AlertTriangle, Pencil, X, Check, Eye, Copy, Plus, Minus } from 'lucide-react';
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
  onView?: (idx: number) => void;
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
  onView,
}: QuestionTableRowProps) {
  const [localDraft, setLocalDraft] = useState<PreviewQuestion | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(q.question_text || '');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    if (isEditing) setLocalDraft({ ...q });
    else setLocalDraft(null);
  }, [isEditing, q]);

  const imageCount =
    (q.question_image_url ? 1 : 0) +
    Object.keys(q.option_images ?? {}).length;

  const qWarnings = warnings.filter(w => {
    const qt = q.question_text?.slice(0, 35) ?? '';
    return w.message.includes(qt);
  });
  
  const currentQ = isEditing && localDraft ? localDraft : q;
  const hasError = qWarnings.some(w => w.severity === 'error') || !isValidQuestion(currentQ, isEditing ? [] : warnings);
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
      <TableCell className="text-xs text-muted-foreground font-mono align-top pt-1.5 pb-1">
        {globalIdx + 1}
      </TableCell>

      {/* Sual */}
      <TableCell className="align-top py-1">
        {isEditing ? (
          <div className="space-y-3 p-1">
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2">
                <Label className="text-[10px] uppercase text-muted-foreground mb-1 block">Sual Mətni</Label>
                <Input
                  value={localDraft?.question_text ?? ''}
                  onChange={e => setLocalDraft(d => d ? { ...d, question_text: e.target.value } : d)}
                  placeholder="Sual mətni"
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-[10px] uppercase text-muted-foreground mb-1 block">Düzgün Cavab</Label>
                <Input
                  value={localDraft?.correct_answer ?? ''}
                  onChange={e => setLocalDraft(d => d ? { ...d, correct_answer: e.target.value } : d)}
                  placeholder="Düzgün cavab"
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-[10px] uppercase text-muted-foreground mb-1 block">Kateqoriya</Label>
                <Input
                  value={localDraft?.category ?? ''}
                  onChange={e => setLocalDraft(d => d ? { ...d, category: e.target.value } : d)}
                  placeholder="Kateqoriya"
                  className="h-8 text-sm"
                />
              </div>
            </div>

            {/* Options Editing (MCQ / Multi-select) */}
            {(localDraft?.question_type === 'multiple_choice' || localDraft?.question_type === 'multiple_select') && (
              <div className="space-y-1.5 border-t pt-2 mt-2">
                <Label className="text-[10px] uppercase text-muted-foreground mb-1 block">Variantlar</Label>
                <div className="grid grid-cols-1 gap-1.5">
                  {Array.isArray(localDraft.options) && localDraft.options.map((opt, i) => (
                    <div key={i} className="flex gap-1 items-center">
                      <span className="text-[10px] font-mono text-muted-foreground w-4">{String.fromCharCode(65 + i)}.</span>
                      <Input
                        value={opt}
                        onChange={e => {
                          const nextOpts = [...(localDraft.options as string[])];
                          nextOpts[i] = e.target.value;
                          setLocalDraft({ ...localDraft, options: nextOpts });
                        }}
                        className="h-7 text-xs flex-1"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          const nextOpts = (localDraft.options as string[]).filter((_, idx) => idx !== i);
                          setLocalDraft({ ...localDraft, options: nextOpts });
                        }}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-[10px] w-full border-dashed"
                    onClick={() => {
                      const nextOpts = [...(Array.isArray(localDraft.options) ? localDraft.options : []), ''];
                      setLocalDraft({ ...localDraft, options: nextOpts });
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Variant əlavə et
                  </Button>
                </div>
              </div>
            )}

            {/* Matching Pairs Editing */}
            {localDraft?.question_type === 'matching' && (
              <div className="space-y-1.5 border-t pt-2 mt-2">
                <Label className="text-[10px] uppercase text-muted-foreground mb-1 block">Uyğunlaşdırma Cütlükləri</Label>
                <div className="space-y-1.5">
                  {Object.entries(localDraft.matching_pairs || {}).map(([left, right], i) => (
                    <div key={i} className="flex gap-1 items-center">
                      <Input
                        value={left}
                        onChange={e => {
                          const nextPairs = { ...(localDraft.matching_pairs || {}) };
                          delete nextPairs[left];
                          nextPairs[e.target.value] = right;
                          setLocalDraft({ ...localDraft, matching_pairs: nextPairs });
                        }}
                        placeholder="Sol"
                        className="h-7 text-xs flex-1"
                      />
                      <span className="text-muted-foreground">→</span>
                      <Input
                        value={right}
                        onChange={e => {
                          const nextPairs = { ...(localDraft.matching_pairs || {}) };
                          nextPairs[left] = e.target.value;
                          setLocalDraft({ ...localDraft, matching_pairs: nextPairs });
                        }}
                        placeholder="Sağ"
                        className="h-7 text-xs flex-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

             {/* Ordering Items Editing */}
             {localDraft?.question_type === 'ordering' && (
              <div className="space-y-1.5 border-t pt-2 mt-2">
                <Label className="text-[10px] uppercase text-muted-foreground mb-1 block">Ardıcıllıq Elementləri</Label>
                <div className="space-y-1.5">
                  {Array.isArray(localDraft.sequence_items) && localDraft.sequence_items.map((item, i) => (
                    <div key={i} className="flex gap-1 items-center">
                      <span className="text-[10px] font-bold text-muted-foreground w-4">{i + 1}.</span>
                      <Input
                        value={item}
                        onChange={e => {
                          const nextItems = [...(localDraft.sequence_items as string[])];
                          nextItems[i] = e.target.value;
                          setLocalDraft({ ...localDraft, sequence_items: nextItems });
                        }}
                        className="h-7 text-xs flex-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-2">
              <Label className="text-[10px] uppercase text-muted-foreground mb-1 block">İzahat</Label>
              <Input
                value={localDraft?.explanation ?? ''}
                onChange={e => setLocalDraft(d => d ? { ...d, explanation: e.target.value } : d)}
                placeholder="İzahat (ixtiyari)"
                className="h-8 text-sm"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {q.question_image_url && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <img
                      src={q.question_image_url}
                      alt="Sual şəkli"
                      className="h-12 w-12 rounded object-cover border border-border/50 mb-1 cursor-zoom-in"
                    />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="p-1">
                    <img
                      src={q.question_image_url}
                      alt="Sual şəkli"
                      className="max-w-[240px] max-h-[240px] rounded object-contain"
                    />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
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
              {imageCount > 0 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                  🖼 {imageCount}
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
      <TableCell className="align-top pt-1.5 pb-1">
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
      <TableCell className="align-top pt-1.5 pb-1">
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
      <TableCell className="align-top pt-1.5 pb-1 text-right">
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
              {onView && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-blue-500 hover:text-blue-600" onClick={() => onView(globalIdx)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Vizual Baxış</TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className={`h-7 w-7 transition-colors ${isCopied ? 'text-emerald-500' : 'text-muted-foreground'}`}
                    onClick={handleCopy}
                  >
                    {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isCopied ? 'Kopyalandı!' : 'Kopyala'}</TooltipContent>
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
