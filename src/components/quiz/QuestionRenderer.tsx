import React, { useState } from 'react';
import { Question } from '@/hooks/useQuestions';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QuestionVideoPlayer } from '../question-bank/QuestionVideoPlayer';
import { Question3DViewer } from '../question-bank/Question3DViewer';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Music,
  Box,
  MonitorPlay,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Code2,
} from 'lucide-react';

interface Props {
  question: Question;
  value: string;
  onChange: (val: string) => void;
  showFeedback?: boolean;
  disabled?: boolean;
}

// ─── Tip-spesifik cavab yoxlama ───────────────────────────────────────────────
function isAnswerCorrect(question: Question, value: string): boolean {
  const qt = question.question_type;

  if (qt === 'numerical') {
    const numAnswer = parseFloat(value);
    const correctNum = question.numerical_answer ?? parseFloat(question.correct_answer);
    const tolerance = question.numerical_tolerance ?? 0;
    if (isNaN(numAnswer) || isNaN(correctNum)) return false;
    return Math.abs(numAnswer - correctNum) <= tolerance;
  }

  if (qt === 'fill_blank') {
    const studentAnswers = value.split('|').map(a => a.trim().toLowerCase());
    const correctAnswers = question.correct_answer.split('|').map(a => a.trim().toLowerCase());
    if (studentAnswers.length !== correctAnswers.length) return false;
    return studentAnswers.every((a, i) => a === correctAnswers[i]);
  }

  if (qt === 'ordering') {
    const studentSeq = value.split('|||').map(s => s.trim());
    const correctSeq = (
      question.sequence_items?.length
        ? question.sequence_items
        : question.correct_answer.split('|||')
    ).map(s => s.trim());
    if (studentSeq.length !== correctSeq.length) return false;
    return studentSeq.every((item, i) => item === correctSeq[i]);
  }

  if (qt === 'matching') {
    const pairsRecord = normalizePairs(question.matching_pairs ?? null);
    const studentPairs = parseMatchingValue(value);
    return Object.entries(pairsRecord).every(([l, r]) => studentPairs[l] === r);
  }

  if (qt === 'hotspot') {
    // Correct answer format: "x:y" or "x:y:tolerance"
    const parts = question.correct_answer.split(':');
    const cx = parseFloat(parts[0]);
    const cy = parseFloat(parts[1]);
    const tolerance = parts[2] ? parseFloat(parts[2]) : 10; // default 10% tolerance
    const sParts = value.split(':');
    const sx = parseFloat(sParts[0]);
    const sy = parseFloat(sParts[1]);
    if (isNaN(cx) || isNaN(cy) || isNaN(sx) || isNaN(sy)) return false;
    return Math.abs(sx - cx) <= tolerance && Math.abs(sy - cy) <= tolerance;
  }

  if (qt === 'true_false') {
    // Həm A/B həm true/false konvensiyasını dəstəklə
    const ca = question.correct_answer;
    const isCorrectA = ca === 'A' || ca === 'Doğru' || ca.toLowerCase() === 'true';
    if (isCorrectA) return value === 'true' || value === 'A';
    return value === 'false' || value === 'B';
  }

  if (qt === 'multiple_select') {
    const studentAnswers = value.split(',').map(a => a.trim()).filter(Boolean).sort();
    const correctAnswers = question.correct_answer.split(',').map(a => a.trim()).filter(Boolean).sort();
    if (studentAnswers.length !== correctAnswers.length) return false;
    return studentAnswers.every((a, i) => a === correctAnswers[i]);
  }

  return value.trim() === question.correct_answer.trim();
}

// matching_pairs array [{left,right}] vs Record<string,string> hər ikisini normallaşdır
function normalizePairs(
  pairs: Record<string, string> | null,
): Record<string, string> {
  if (!pairs) return {};
  if (Array.isArray(pairs)) {
    return Object.fromEntries(
      (pairs as unknown as Array<{ left: string; right: string }>).map(p => [
        p.left,
        p.right,
      ]),
    );
  }
  return pairs;
}

function parseMatchingValue(value: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!value) return result;
  value.split('|||').forEach(m => {
    const colonIdx = m.indexOf(':');
    if (colonIdx > -1) {
      result[m.slice(0, colonIdx)] = m.slice(colonIdx + 1);
    }
  });
  return result;
}

// ─── Əsas komponent ───────────────────────────────────────────────────────────
export function QuestionRenderer({
  question,
  value,
  onChange,
  showFeedback,
  disabled,
}: Props) {
  const [orderingSequence, setOrderingSequence] = useState<string[]>([]);
  const [shuffledRightItems, setShuffledRightItems] = useState<string[]>([]);

  // Ordering: ilk render-də qarışdır
  React.useEffect(() => {
    if (
      question.question_type === 'ordering' &&
      orderingSequence.length === 0 &&
      question.sequence_items?.length
    ) {
      setOrderingSequence(
        [...question.sequence_items].sort(() => Math.random() - 0.5),
      );
    }
  }, [question.id, question.question_type, question.sequence_items, orderingSequence.length]);

  // Matching: sağ tərəfi qarışdır
  React.useEffect(() => {
    if (question.question_type === 'matching' && question.matching_pairs) {
      const pairsRecord = normalizePairs(question.matching_pairs);
      setShuffledRightItems(
        [...Object.values(pairsRecord)].sort(() => Math.random() - 0.5),
      );
    }
  }, [question.id, question.question_type, question.matching_pairs]);

  const handleSelect = (val: string) => {
    if (disabled || showFeedback) return;
    onChange(val);
  };

  // ─── Media ──────────────────────────────────────────────────────────────────
  const renderMedia = () => (
    <div className="space-y-4 mb-4">
      {(question.question_image_url ||
        (question.media_type === 'image' && question.media_url)) && (
        <img
          src={question.question_image_url || question.media_url!}
          alt="Sual şəkli"
          className="max-h-80 w-auto mx-auto rounded-2xl border-2 border-primary/10 shadow-lg object-contain bg-background/50"
        />
      )}

      {(question.question_type === 'video' || question.media_type === 'video') &&
        (question.video_url || question.media_url) && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/60 px-1">
              <MonitorPlay className="w-3 h-3" />
              <span>Video Material</span>
            </div>
            <QuestionVideoPlayer
              videoUrl={question.video_url || question.media_url!}
              startTime={question.video_start_time || undefined}
              endTime={question.video_end_time || undefined}
            />
          </div>
        )}

      {(question.question_type === 'model_3d' || question.model_3d_url) && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary/60 px-1">
            <Box className="w-3 h-3" />
            <span>3D Model</span>
          </div>
          <Question3DViewer modelUrl={question.model_3d_url || question.media_url!} />
        </div>
      )}

      {question.media_type === 'audio' && question.media_url && (
        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/60">
            <Music className="w-3 h-3" />
            <span>Səs Yazısı</span>
          </div>
          <audio src={question.media_url} controls className="w-full h-10" />
        </div>
      )}
    </div>
  );

  // ─── Sual tipi render ────────────────────────────────────────────────────────
  const renderContent = () => {
    switch (question.question_type) {
      // ── Multiple Choice ──────────────────────────────────────────────────────
      case 'multiple_choice':
        return (
          <RadioGroup
            value={value}
            onValueChange={handleSelect}
            disabled={disabled || showFeedback}
            className="space-y-2"
          >
            {question.options?.map((opt, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={opt} id={`opt-${i}`} />
                <Label htmlFor={`opt-${i}`} className="cursor-pointer">{opt}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      // ── Multiple Select ──────────────────────────────────────────────────────
      case 'multiple_select': {
        const selected = value ? value.split(',').map(s => s.trim()) : [];
        const handleToggle = (opt: string, checked: boolean) => {
          if (disabled || showFeedback) return;
          let next;
          if (checked) {
            next = [...selected, opt];
          } else {
            next = selected.filter(s => s !== opt);
          }
          onChange(next.join(','));
        };

        return (
          <div className="space-y-2">
            {question.options?.map((opt, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Checkbox 
                  id={`ms-opt-${i}`} 
                  checked={selected.includes(opt)}
                  onCheckedChange={(checked) => handleToggle(opt, !!checked)}
                  disabled={disabled || showFeedback}
                />
                <Label htmlFor={`ms-opt-${i}`} className="cursor-pointer">{opt}</Label>
              </div>
            ))}
          </div>
        );
      }

      // ── True / False ─────────────────────────────────────────────────────────
      case 'true_false':
        return (
          <RadioGroup
            value={value}
            onValueChange={handleSelect}
            disabled={disabled || showFeedback}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50/50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 cursor-pointer hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors">
              <RadioGroupItem value="true" id="tf-true" />
              <Label htmlFor="tf-true" className="cursor-pointer font-semibold text-green-600">
                Doğru
              </Label>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
              <RadioGroupItem value="false" id="tf-false" />
              <Label htmlFor="tf-false" className="cursor-pointer font-semibold text-red-600">
                Yanlış
              </Label>
            </div>
          </RadioGroup>
        );

      // ── Numerical ────────────────────────────────────────────────────────────
      case 'numerical':
        return (
          <div className="space-y-2">
            <Input
              type="number"
              inputMode="decimal"
              className="h-14 text-lg font-bold text-center border-2 border-primary/20 focus:border-primary rounded-2xl"
              disabled={disabled || showFeedback}
              placeholder="Rəqəmi daxil edin..."
              value={value}
              onChange={e => handleSelect(e.target.value)}
            />
            {question.numerical_tolerance != null && question.numerical_tolerance > 0 && (
              <p className="text-xs text-center text-muted-foreground">
                ±{question.numerical_tolerance} tolerans daxilindəki cavablar qəbul edilir
              </p>
            )}
          </div>
        );

      // ── Short Answer ─────────────────────────────────────────────────────────
      case 'short_answer':
        return (
          <Input
            className="h-12 border-2 border-primary/10 focus:border-primary rounded-xl"
            disabled={disabled || showFeedback}
            placeholder="Sizin cavabınız..."
            value={value}
            onChange={e => handleSelect(e.target.value)}
          />
        );

      // ── Essay ─────────────────────────────────────────────────────────────────
      case 'essay':
        return (
          <Textarea
            disabled={disabled || showFeedback}
            placeholder="Esse yazın..."
            value={value}
            onChange={e => handleSelect(e.target.value)}
          />
        );

      // ── Fill Blank — hər ___ üçün ayrı input ────────────────────────────────
      case 'fill_blank': {
        const template =
          question.fill_blank_template || question.question_text || '';
        const blanks = (template.match(/___+/g) || []).length;
        const answers = value ? value.split('|') : [];

        // ___ ilə parçala, text + input növbəli render
        const parts = template.split(/(___+)/g);
        let blankIdx = 0;

        const handleBlankChange = (idx: number, val: string) => {
          if (disabled || showFeedback) return;
          const newAnswers = Array.from(
            { length: Math.max(blanks, answers.length, idx + 1) },
            (_, i) => answers[i] ?? '',
          );
          newAnswers[idx] = val;
          onChange(newAnswers.join('|'));
        };

        return (
          <div className="space-y-3">
            <div className="leading-loose text-base p-3 rounded-xl bg-muted/20 border border-border/40">
              {parts.map((part, pi) => {
                if (/^___+$/.test(part)) {
                  const idx = blankIdx++;
                  const ans = answers[idx] ?? '';
                  const isCorrectBlank =
                    showFeedback &&
                    ans.trim().toLowerCase() ===
                      (question.correct_answer.split('|')[idx] ?? '').trim().toLowerCase();
                  return (
                    <input
                      key={pi}
                      type="text"
                      value={ans}
                      onChange={e => handleBlankChange(idx, e.target.value)}
                      disabled={disabled || showFeedback}
                      placeholder="?"
                      className={cn(
                        'inline-block w-28 h-8 min-w-0 text-center text-sm border-0 border-b-2 rounded-none bg-transparent focus:outline-none focus:ring-0 px-1 mx-0.5 align-middle transition-colors',
                        showFeedback
                          ? isCorrectBlank
                            ? 'border-green-500 text-green-600'
                            : 'border-red-400 text-red-600'
                          : 'border-primary/40 focus:border-primary',
                      )}
                    />
                  );
                }
                return (
                  <span key={pi} className="align-middle">
                    {part}
                  </span>
                );
              })}
            </div>
            {blanks === 0 && (
              <Input
                disabled={disabled || showFeedback}
                placeholder="Cavabınız..."
                value={value}
                onChange={e => handleSelect(e.target.value)}
              />
            )}
          </div>
        );
      }

      // ── Code ──────────────────────────────────────────────────────────────────
      case 'code': {
        const codeSnippet = question.fill_blank_template || '';
        const lang = question.hint?.startsWith('lang:')
          ? question.hint.slice(5)
          : '';

        return (
          <div className="space-y-3">
            {codeSnippet && (
              <div className="rounded-xl overflow-hidden border border-neutral-700 shadow-sm">
                {lang && (
                  <div className="flex items-center gap-2 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-400 border-b border-neutral-700">
                    <Code2 className="h-3 w-3" />
                    <span className="font-mono">{lang}</span>
                  </div>
                )}
                <pre className="bg-neutral-950 text-green-400 font-mono text-sm p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed m-0">
                  <code>{codeSnippet}</code>
                </pre>
              </div>
            )}
            <Input
              disabled={disabled || showFeedback}
              placeholder="Kodun çıxışını / cavabını yazın..."
              value={value}
              onChange={e => handleSelect(e.target.value)}
              className="font-mono h-12 border-2 border-primary/10 focus:border-primary rounded-xl"
            />
          </div>
        );
      }

      // ── Ordering — yuxarı/aşağı düymələri ───────────────────────────────────
      case 'ordering': {
        const handleMove = (from: number, direction: -1 | 1) => {
          if (disabled || showFeedback) return;
          const to = from + direction;
          if (to < 0 || to >= orderingSequence.length) return;
          const newSeq = [...orderingSequence];
          [newSeq[from], newSeq[to]] = [newSeq[to], newSeq[from]];
          setOrderingSequence(newSeq);
          onChange(newSeq.join('|||'));
        };

        return (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground italic mb-1">
              ↕ Elementləri düzgün ardıcıllıqla düzün
            </p>
            <div className="space-y-1.5">
              {orderingSequence.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border/60 shadow-sm"
                >
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMove(idx, -1)}
                      disabled={disabled || showFeedback || idx === 0}
                      className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted disabled:opacity-25 transition-colors"
                      aria-label="Yuxarı"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 1)}
                      disabled={
                        disabled ||
                        showFeedback ||
                        idx === orderingSequence.length - 1
                      }
                      className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted disabled:opacity-25 transition-colors"
                      aria-label="Aşağı"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="h-7 w-7 flex items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm shrink-0">
                    {idx + 1}
                  </div>
                  <span className="flex-1 text-sm leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      // ── Matching — Select dropdown ────────────────────────────────────────────
      case 'matching': {
        const pairsRecord = normalizePairs(question.matching_pairs ?? null);
        const leftItems = Object.keys(pairsRecord);
        const currentMatches = parseMatchingValue(value);

        const handleMatchSelect = (leftKey: string, rightVal: string) => {
          if (disabled || showFeedback) return;
          const newMatches = { ...currentMatches, [leftKey]: rightVal };
          onChange(
            Object.entries(newMatches)
              .map(([l, r]) => `${l}:${r}`)
              .join('|||'),
          );
        };

        return (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground italic">
              Sol tərəfdəki hər element üçün uyğun seçimi tapın
            </p>
            {leftItems.map((leftKey, i) => {
              const selectedRight = currentMatches[leftKey];
              const isCorrectMatch =
                showFeedback && pairsRecord[leftKey] === selectedRight;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex-1 min-w-0 text-sm py-2 px-3 rounded-xl border font-medium',
                      showFeedback && selectedRight
                        ? isCorrectMatch
                          ? 'bg-green-50/60 border-green-300 dark:bg-green-950/20 dark:border-green-700'
                          : 'bg-red-50/60 border-red-300 dark:bg-red-950/20 dark:border-red-700'
                        : 'bg-muted/40 border-border/50',
                    )}
                  >
                    {leftKey}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Select
                    value={selectedRight || ''}
                    onValueChange={val => handleMatchSelect(leftKey, val)}
                    disabled={disabled || showFeedback}
                  >
                    <SelectTrigger
                      className={cn(
                        'flex-1 min-w-0',
                        showFeedback && selectedRight
                          ? isCorrectMatch
                            ? 'border-green-400'
                            : 'border-red-400'
                          : '',
                      )}
                    >
                      <SelectValue placeholder="Seçin..." />
                    </SelectTrigger>
                    <SelectContent>
                      {shuffledRightItems.map((rVal, ri) => (
                        <SelectItem key={ri} value={rVal}>
                          {rVal}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
        );
      }

      // ── Hotspot — image click ─────────────────────────────────────────────────
      case 'hotspot': {
        const imgUrl = question.question_image_url || question.media_url;
        const parsed = value ? value.split(':') : [];
        const markedX = parsed[0] ? parseFloat(parsed[0]) : null;
        const markedY = parsed[1] ? parseFloat(parsed[1]) : null;

        const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
          if (disabled || showFeedback) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          handleSelect(`${x.toFixed(2)}:${y.toFixed(2)}`);
        };

        if (!imgUrl) {
          return (
            <Input
              disabled={disabled || showFeedback}
              placeholder="X:Y koordinatları daxil edin..."
              value={value}
              onChange={e => handleSelect(e.target.value)}
            />
          );
        }

        return (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground italic">
              Şəkildə düzgün nöqtəyə klikləyin
            </p>
            <div
              className={cn(
                'relative select-none rounded-xl overflow-hidden border-2',
                disabled || showFeedback ? 'cursor-default' : 'cursor-crosshair',
                showFeedback ? 'border-border/40' : 'border-primary/20 hover:border-primary/40',
              )}
              onClick={handleImageClick}
            >
              <img src={imgUrl} alt="Hotspot şəkli" className="w-full object-contain" />
              {markedX !== null && markedY !== null && (
                <div
                  className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ left: `${markedX}%`, top: `${markedY}%` }}
                >
                  <div className="w-6 h-6 rounded-full border-4 border-primary bg-primary/30 animate-pulse" />
                </div>
              )}
            </div>
          </div>
        );
      }

      // ── Video / 3D model — text input ────────────────────────────────────────
      case 'video':
      case 'model_3d':
        return (
          <Input
            disabled={disabled || showFeedback}
            placeholder={
              question.question_type === 'model_3d'
                ? '3D əsasında cavabınız...'
                : 'Sizin cavabınız...'
            }
            value={value}
            onChange={e => handleSelect(e.target.value)}
          />
        );

      // ── Default ───────────────────────────────────────────────────────────────
      default:
        return (
          <Textarea
            className="min-h-[120px] rounded-xl border-2 border-primary/5 focus:border-primary"
            disabled={disabled || showFeedback}
            placeholder="Cavabınız..."
            value={value}
            onChange={e => handleSelect(e.target.value)}
          />
        );
    }
  };

  // ─── Feedback bölməsi ─────────────────────────────────────────────────────────
  const correct = showFeedback ? isAnswerCorrect(question, value) : false;

  return (
    <div className="space-y-4">
      {renderMedia()}
      {renderContent()}

      {showFeedback && (
        <div
          className={cn(
            'p-4 mt-4 rounded-xl border transition-all duration-300 animate-scale-in',
            correct
              ? 'bg-success/10 border-success/30 text-success'
              : 'bg-destructive/10 border-destructive/30 text-destructive',
          )}
        >
          <h4 className="font-black mb-2 flex items-center gap-2">
            {correct ? (
              <>
                <span>✅</span> Doğru!
              </>
            ) : (
              <>
                <span>❌</span> Yanlış!
              </>
            )}
          </h4>

          {/* Düzgün cavab göstər (fill_blank, ordering, matching, numerical üçün) */}
          {!correct && (
            <div className="text-sm mt-1 opacity-80 font-medium">
              {question.question_type === 'fill_blank' && (
                <span>
                  Düzgün cavab:{' '}
                  <span className="font-mono">
                    {question.correct_answer.split('|').join(' / ')}
                  </span>
                </span>
              )}
              {question.question_type === 'numerical' && (
                <span>
                  Düzgün cavab:{' '}
                  <span className="font-mono">
                    {question.numerical_answer ?? question.correct_answer}
                    {(question.numerical_tolerance ?? 0) > 0 &&
                      ` (±${question.numerical_tolerance})`}
                  </span>
                </span>
              )}
              {question.question_type === 'ordering' && (
                <div className="mt-1">
                  <span className="text-xs uppercase tracking-wide opacity-60 block mb-1">
                    Düzgün ardıcıllıq:
                  </span>
                  {(question.sequence_items ?? []).map((item, i) => (
                    <div key={i} className="text-xs font-mono">
                      {i + 1}. {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {question.explanation && (
            <div className="text-sm mt-2 opacity-90 leading-relaxed bg-background/40 p-3 rounded-lg border border-border/20">
              <strong className="block mb-1 uppercase text-[10px] font-black tracking-widest opacity-70">
                Açıqlama
              </strong>
              {question.explanation}
            </div>
          )}

          {question.per_option_explanations &&
            value &&
            Array.isArray(question.options) && (
              <div className="text-sm mt-3 p-3 rounded-lg bg-background/20 font-medium">
                {
                  question.per_option_explanations[
                    question.options.indexOf(value)?.toString()
                  ]
                }
              </div>
            )}
        </div>
      )}
    </div>
  );
}
