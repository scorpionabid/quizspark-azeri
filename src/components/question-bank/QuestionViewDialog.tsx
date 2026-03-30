import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { QuestionBankItem } from '@/hooks/useQuestionBank';
import { Check, X, Image, Video, Music, Lightbulb, Clock, MonitorPlay, Box, ListChecks, GitMerge, ListOrdered, Underline, Hash } from 'lucide-react';
import { QUESTION_TYPES } from '@/types/question';
import { QuestionVideoPlayer } from './QuestionVideoPlayer';
import { Question3DViewer } from './Question3DViewer';
import { normalizePairs, parseMatchingValue } from '../quiz/renderers/utils';

interface QuestionViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: QuestionBankItem | null;
}

function getDifficultyColor(difficulty: string | null) {
  switch (difficulty?.toLowerCase()) {
    case 'asan':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'orta':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'çətin':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function getTypeInfo(type: string) {
  const typeObj = QUESTION_TYPES.find(t => t.value === type);
  if (typeObj) {
    return { label: typeObj.label };
  }
  return { label: type };
}

function parseOptions(options: string[] | Record<string, string> | null): string[] {
  if (!options) return [];
  if (Array.isArray(options)) return options;
  return Object.values(options);
}

export function QuestionViewDialog({
  open,
  onOpenChange,
  question,
}: QuestionViewDialogProps) {
  if (!question) return null;

  const options = parseOptions(question.options);
  const showStandardOptions = ['multiple_choice', 'true_false', 'multiple_select'].includes(question.question_type);
  const isMultipleSelect = question.question_type === 'multiple_select';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Sual Detalları</DialogTitle>
          <DialogDescription className="sr-only">
            Seçilmiş sualın bütün detalları və variantları
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{getTypeInfo(question.question_type).label}</Badge>
            <Badge className={getDifficultyColor(question.difficulty)}>
              {question.difficulty || 'Çətinlik təyin edilməyib'}
            </Badge>
            {question.category && (
              <Badge variant="outline">{question.category}</Badge>
            )}
            {question.bloom_level && (
              <Badge variant="outline">Bloom: {question.bloom_level}</Badge>
            )}
            <Badge variant="outline" className="font-mono">
              Xal: {question.weight ?? 1.0}
            </Badge>
            {question.time_limit && (
              <Badge variant="outline" className="gap-1">
                <Clock className="w-3 h-3" /> {question.time_limit} san
              </Badge>
            )}
            {question.quality_score && (
              <Badge variant="outline" className="gap-1 bg-yellow-50 text-yellow-700 border-yellow-200">
                ★ {Number(question.quality_score).toFixed(1)}
              </Badge>
            )}
          </div>

          <Separator />

          {/* Question Text */}
          <div>
            {question.title && <h3 className="font-semibold text-primary mb-1">{question.title}</h3>}
            <h4 className="font-medium mb-2">Sual</h4>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {question.question_text}
            </p>
          </div>

          {/* Hint */}
          {question.hint && (
            <div className="p-3 bg-muted/40 border rounded-md flex items-start gap-2 text-sm text-muted-foreground">
              <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p><strong>İpucu:</strong> {question.hint}</p>
            </div>
          )}

          {/* Question Image */}
          {question.question_image_url && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Image className="h-4 w-4" />
                Sual Şəkili
              </h4>
              <img
                src={question.question_image_url}
                alt="Sual şəkili"
                className="max-h-64 rounded-lg border object-contain"
              />
            </div>
          )}

          {/* Video */}
          {question.question_type === 'video' && question.video_url && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <MonitorPlay className="h-4 w-4" />
                Video Sujet
              </h4>
              <QuestionVideoPlayer
                videoUrl={question.video_url}
                startTime={question.video_start_time || undefined}
                endTime={question.video_end_time || undefined}
              />
            </div>
          )}

          {/* 3D Model */}
          {question.question_type === 'model_3d' && question.model_3d_url && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Box className="h-4 w-4" />
                3D Model
              </h4>
              <Question3DViewer modelUrl={question.model_3d_url} />
            </div>
          )}

          {/* Other Media */}
          {question.media_url && !['video', 'model_3d'].includes(question.question_type) && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                {question.media_type === 'video' ? (
                  <Video className="h-4 w-4" />
                ) : question.media_type === 'audio' ? (
                  <Music className="h-4 w-4" />
                ) : (
                  <Image className="h-4 w-4" />
                )}
                Əlavə Media
              </h4>
              {question.media_type === 'video' && (
                <video
                  src={question.media_url}
                  controls
                  className="max-h-64 rounded-lg border w-full"
                />
              )}
              {question.media_type === 'audio' && (
                <audio src={question.media_url} controls className="w-full" />
              )}
              {question.media_type === 'image' && (
                <img
                  src={question.media_url}
                  alt="Media"
                  className="max-h-64 rounded-lg border object-contain"
                />
              )}
            </div>
          )}

          {/* Standard Options (MCQ, Multi-select, T/F) */}
          {showStandardOptions && options.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Variantlar</h4>
              <div className="space-y-2">
                {options.map((option, index) => {
                  const optionLetter = String.fromCharCode(65 + index);
                  
                  // Check if this option is correct
                  let isCorrect = false;
                  if (isMultipleSelect) {
                    const correctAnswers = question.correct_answer.split(',').map(s => s.trim().toLowerCase());
                    isCorrect = correctAnswers.includes(option.toLowerCase()) || 
                                correctAnswers.includes(optionLetter.toLowerCase());
                  } else {
                    isCorrect = question.correct_answer.toUpperCase() === optionLetter || 
                                question.correct_answer === option;
                  }

                  return (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md border",
                        isCorrect
                          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                          : 'bg-muted/30 border-transparent'
                      )}
                    >
                      <span className="font-medium w-6 text-xs text-muted-foreground">{optionLetter}.</span>
                      <span className="flex-1 text-sm">{option}</span>
                      {isCorrect && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matching Pairs */}
          {question.question_type === 'matching' && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <GitMerge className="w-4 h-4" /> Düzgün Uyğunluqlar
              </h4>
              <div className="space-y-2">
                {Object.entries(parseMatchingValue(question.correct_answer)).map(([left, rights], idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg border border-dashed text-sm">
                    <div className="flex-1 font-medium">{left}</div>
                    <div className="text-muted-foreground">→</div>
                    <div className="flex-1 text-primary">{rights.join(', ')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ordering Sequence */}
          {question.question_type === 'ordering' && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <ListOrdered className="w-4 h-4" /> Düzgün Ardıcıllıq
              </h4>
              <div className="space-y-2">
                {(question.sequence_items || question.correct_answer.split('|||')).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-green-50/50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/30 text-sm">
                    <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-xs font-bold text-green-700">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fill in the Blanks */}
          {question.question_type === 'fill_blank' && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Underline className="w-4 h-4" /> Cümlə Hazırla (Boşluqlar doldurulub)
              </h4>
              <div className="p-4 bg-muted/30 rounded-xl border italic text-sm leading-relaxed">
                {(() => {
                  const parts = (question.fill_blank_template || question.question_text).split('___');
                  const answers = question.correct_answer.split('|');
                  return parts.map((part, i) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < parts.length - 1 && (
                        <span className="px-2 py-0.5 mx-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded font-bold not-italic border-b-2 border-green-500">
                          {answers[i] || '___'}
                        </span>
                      )}
                    </React.Fragment>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* Numerical */}
          {question.question_type === 'numerical' && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Hash className="w-4 h-4" /> Rəqəmsal Cavab
              </h4>
              <div className="flex items-center gap-4 p-3 bg-green-50/50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {question.numerical_answer || question.correct_answer}
                </div>
                {question.numerical_tolerance !== undefined && (
                  <div className="text-xs text-muted-foreground">
                    Tolerans (Xəta payı): ±{question.numerical_tolerance}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Correct Answer (for other types like short_answer, essay, code) */}
          {!showStandardOptions && !['matching', 'ordering', 'fill_blank', 'numerical'].includes(question.question_type) && (
            <div>
              <h4 className="font-medium mb-2">Düzgün Cavab</h4>
              <div className="p-3 bg-green-50/50 dark:bg-green-900/10 rounded-md border border-green-200 dark:border-green-800 font-mono text-sm">
                {question.correct_answer}
              </div>
            </div>
          )}

          {/* Explanation */}
          {question.explanation && (
            <div>
              <h4 className="font-medium mb-2">İzahat</h4>
              <p className="text-muted-foreground whitespace-pre-wrap p-3 bg-muted/30 rounded-md">
                {question.explanation}
              </p>
            </div>
          )}

          {/* Tags */}
          {question.tags && question.tags.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Etiketlər</h4>
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag, i) => (
                  <Badge key={i} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Metadata */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Yaradılıb: {new Date(question.created_at).toLocaleString('az-AZ')}</span>
            <span>Yenilənib: {new Date(question.updated_at).toLocaleString('az-AZ')}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
