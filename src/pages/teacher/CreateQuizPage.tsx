import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Upload,
  Sparkles,
  CheckCircle,
  GripVertical,
  Pencil,
  Lightbulb,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useCreateQuiz } from '@/hooks/useQuizzes';
import { useBulkCreateQuestions } from '@/hooks/useQuestions';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { QuestionEditDialog } from '@/components/question-bank/QuestionEditDialog';
import { QuestionPickerDialog } from '@/components/quiz/QuestionPickerDialog';
import { QuestionBankItem } from '@/hooks/useQuestionBank';
import { QUESTION_TYPES, QuestionType } from '@/types/question';
import { quizMetadataSchema, QuizMetadataFormData } from '@/lib/validations/quiz';
import { GeneratedQuestion } from '@/components/quiz/EditableQuestionCard';

// ─── DraftQuestion Type ────────────────────────────────────────────────────────
interface DraftQuestion {
  localId: string;
  question_text: string;
  question_type: QuestionType;
  options: string[] | null;
  correct_answer: string;
  explanation: string | null;
  order_index: number;
  title?: string | null;
  weight?: number | null;
  hint?: string | null;
  time_limit?: number | null;
  per_option_explanations?: Record<string, string> | null;
  video_url?: string | null;
  video_start_time?: number | null;
  video_end_time?: number | null;
  model_3d_url?: string | null;
  model_3d_type?: string | null;
  hotspot_data?: unknown;
  matching_pairs?: unknown;
  sequence_items?: string[] | null;
  fill_blank_template?: string | null;
  numerical_answer?: number | null;
  numerical_tolerance?: number | null;
  question_image_url?: string | null;
  media_type?: string | null;
  media_url?: string | null;
}

// ─── Adapter Functions ─────────────────────────────────────────────────────────
function draftToDialogQuestion(d: DraftQuestion): QuestionBankItem {
  return {
    id: d.localId,
    question_text: d.question_text,
    question_type: d.question_type,
    options: d.options,
    correct_answer: d.correct_answer,
    explanation: d.explanation,
    title: d.title ?? null,
    weight: d.weight ?? null,
    hint: d.hint ?? null,
    time_limit: d.time_limit ?? null,
    per_option_explanations: d.per_option_explanations ?? null,
    video_url: d.video_url ?? null,
    video_start_time: d.video_start_time ?? null,
    video_end_time: d.video_end_time ?? null,
    model_3d_url: d.model_3d_url ?? null,
    model_3d_type: d.model_3d_type ?? null,
    hotspot_data: d.hotspot_data as Record<string, unknown> ?? null,
    matching_pairs: d.matching_pairs as Record<string, string> ?? null,
    sequence_items: d.sequence_items ?? null,
    fill_blank_template: d.fill_blank_template ?? null,
    numerical_answer: d.numerical_answer ?? null,
    numerical_tolerance: d.numerical_tolerance ?? null,
    question_image_url: d.question_image_url ?? null,
    option_images: null,
    media_type: d.media_type as 'image' | 'audio' | 'video' | null ?? null,
    media_url: d.media_url ?? null,
    // Question-bank-only fields — not relevant for quiz questions
    bloom_level: null,
    category: null,
    difficulty: null,
    tags: null,
    user_id: null,
    source_document_id: null,
    quality_score: null,
    usage_count: null,
    feedback_enabled: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function dialogSaveToDraft(saved: Partial<QuestionBankItem>, existing: DraftQuestion): DraftQuestion {
  return {
    ...existing,
    question_text: saved.question_text ?? existing.question_text,
    question_type: (saved.question_type as QuestionType) ?? existing.question_type,
    options: (saved.options as string[] | null) ?? existing.options,
    correct_answer: saved.correct_answer ?? existing.correct_answer,
    explanation: saved.explanation ?? existing.explanation,
    title: saved.title ?? existing.title,
    weight: saved.weight ?? existing.weight,
    hint: saved.hint ?? existing.hint,
    time_limit: saved.time_limit ?? existing.time_limit,
    per_option_explanations: saved.per_option_explanations ?? existing.per_option_explanations,
    video_url: saved.video_url ?? existing.video_url,
    video_start_time: saved.video_start_time ?? existing.video_start_time,
    video_end_time: saved.video_end_time ?? existing.video_end_time,
    model_3d_url: saved.model_3d_url ?? existing.model_3d_url,
    model_3d_type: saved.model_3d_type ?? existing.model_3d_type,
    sequence_items: saved.sequence_items ?? existing.sequence_items,
    fill_blank_template: saved.fill_blank_template ?? existing.fill_blank_template,
    numerical_answer: saved.numerical_answer ?? existing.numerical_answer,
    numerical_tolerance: saved.numerical_tolerance ?? existing.numerical_tolerance,
    question_image_url: saved.question_image_url ?? existing.question_image_url,
    media_type: saved.media_type ?? existing.media_type,
    media_url: saved.media_url ?? existing.media_url,
  };
}

function bankItemToDraft(item: QuestionBankItem, orderIndex: number): DraftQuestion {
  return {
    localId: crypto.randomUUID(),
    question_text: item.question_text,
    question_type: item.question_type as QuestionType,
    options: Array.isArray(item.options) ? item.options : null,
    correct_answer: item.correct_answer,
    explanation: item.explanation,
    order_index: orderIndex,
    title: item.title,
    weight: item.weight,
    hint: item.hint,
    time_limit: item.time_limit,
    per_option_explanations: item.per_option_explanations,
    video_url: item.video_url,
    video_start_time: item.video_start_time,
    video_end_time: item.video_end_time,
    model_3d_url: item.model_3d_url,
    model_3d_type: item.model_3d_type,
    sequence_items: item.sequence_items,
    fill_blank_template: item.fill_blank_template,
    numerical_answer: item.numerical_answer,
    numerical_tolerance: item.numerical_tolerance,
    question_image_url: item.question_image_url,
    media_type: item.media_type,
    media_url: item.media_url,
  };
}

function draftToDbInsert(q: DraftQuestion, quizId: string, index: number) {
  const { localId: _localId, hotspot_data, matching_pairs, ...rest } = q;
  return {
    ...rest,
    hotspot_data: hotspot_data as Record<string, unknown> | null | undefined,
    matching_pairs: matching_pairs as Record<string, string> | null | undefined,
    quiz_id: quizId,
    order_index: index,
  };
}

function getAnswerSummary(q: DraftQuestion): string {
  switch (q.question_type) {
    case 'true_false':
      return q.correct_answer || 'Cavab seçilməyib';
    case 'numerical':
      return q.numerical_answer != null
        ? `${q.numerical_answer}${q.numerical_tolerance ? ` ± ${q.numerical_tolerance}` : ''}`
        : 'Rəqəm daxil edilməyib';
    case 'matching':
      return q.matching_pairs ? `Cüt sayı: ?` : 'Cütlər yoxdur';
    case 'ordering':
      return q.sequence_items ? `${q.sequence_items.length} element` : 'Elementlər yoxdur';
    case 'fill_blank':
      return q.fill_blank_template ?? 'Şablon yoxdur';
    case 'essay':
    case 'short_answer':
      return q.correct_answer ? q.correct_answer.substring(0, 60) : 'Açıq cavab';
    default:
      return q.correct_answer ? q.correct_answer.substring(0, 60) : 'Cavab seçilməyib';
  }
}

// ─── SortableQuestionCard ──────────────────────────────────────────────────────
interface CardProps {
  question: DraftQuestion;
  index: number;
  onEdit: (q: DraftQuestion) => void;
  onRemove: (localId: string) => void;
}

function SortableQuestionCard({ question, index, onEdit, onRemove }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: question.localId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  const typeInfo = QUESTION_TYPES.find((t) => t.value === question.question_type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-2xl bg-gradient-card border border-border/50 p-5 animate-scale-in"
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1 rounded"
          aria-label="Sürükle"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="flex-1 min-w-0">
          {/* Top row */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-xs font-bold text-primary">
              {index + 1}
            </div>
            <Badge variant="secondary" className="text-xs gap-1">
              {typeInfo?.icon} {typeInfo?.label ?? question.question_type}
            </Badge>
            {question.weight != null && question.weight !== 1 && (
              <Badge variant="outline" className="text-xs font-mono">
                {question.weight} xal
              </Badge>
            )}
            {question.time_limit && (
              <Badge variant="outline" className="text-xs">
                ⏱ {question.time_limit}s
              </Badge>
            )}
          </div>

          {/* Question text */}
          <p className="text-sm font-medium text-foreground line-clamp-2 mb-1">
            {question.question_text || <span className="text-muted-foreground italic">Sual mətni yoxdur</span>}
          </p>

          {/* Answer summary */}
          <p className="text-xs text-muted-foreground truncate">
            ✓ {getAnswerSummary(question)}
          </p>

          {/* Hint */}
          {question.hint && (
            <p className="text-xs text-primary mt-1 flex items-center gap-1">
              <Lightbulb className="h-3 w-3" />
              {question.hint.substring(0, 70)}
              {question.hint.length > 70 ? '...' : ''}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(question)}
            className="h-8 w-8 text-muted-foreground hover:text-primary"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(question.localId)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function CreateQuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const createQuiz = useCreateQuiz();
  const createQuestions = useBulkCreateQuestions();

  // Metadata form
  const form = useForm<QuizMetadataFormData>({
    resolver: zodResolver(quizMetadataSchema),
    defaultValues: {
      title: '',
      description: '',
      subject: '',
      grade: '',
      difficulty: null,
      duration: 20,
      is_public: true,
    },
  });

  // Questions state
  const [questions, setQuestions] = useState<DraftQuestion[]>([]);

  // Import questions passed via navigate state from AI Assistant
  useEffect(() => {
    const state = location.state as { importedQuestions?: GeneratedQuestion[] } | null;
    if (!state?.importedQuestions?.length) return;
    const drafts: DraftQuestion[] = state.importedQuestions.map((q, i) => ({
      localId: crypto.randomUUID(),
      question_text: q.question,
      question_type: (q.questionType ?? 'multiple_choice') as QuestionType,
      options: q.options ?? null,
      correct_answer: q.options[q.correctAnswer] ?? q.options[0] ?? '',
      explanation: q.explanation ?? null,
      order_index: i,
      question_image_url: q.questionImageUrl ?? null,
      title: null, weight: null, hint: null, time_limit: null,
      per_option_explanations: null, video_url: null, video_start_time: null,
      video_end_time: null, model_3d_url: null, model_3d_type: null,
      sequence_items: null, fill_blank_template: null,
      numerical_answer: null, numerical_tolerance: null,
      media_type: null, media_url: null,
    }));
    setQuestions(drafts);
    toast.success(`${drafts.length} sual əlavə edildi`);
    window.history.replaceState({}, '');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<DraftQuestion | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newQuestionType, setNewQuestionType] = useState<QuestionType>('multiple_choice');
  const [pickerOpen, setPickerOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // @dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ── Auto-save ────────────────────────────────────────────────────────────────
  const formValues = form.watch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(
        'quiz_draft',
        JSON.stringify({ metadata: formValues, questions, savedAt: Date.now() })
      );
    }, 1500);
    return () => clearTimeout(timeout);
  }, [questions, formValues]);

  // Draft recovery toast on mount
  useEffect(() => {
    const raw = localStorage.getItem('quiz_draft');
    if (!raw) return;
    try {
      const draft = JSON.parse(raw);
      const mins = Math.round((Date.now() - draft.savedAt) / 60000);
      if (mins < 60 * 24) {
        toast.info(`${mins} dəq əvvəlki qaralama tapıldı`, {
          action: {
            label: 'Bərpa et',
            onClick: () => {
              form.reset(draft.metadata);
              setQuestions(draft.questions ?? []);
              localStorage.removeItem('quiz_draft');
            },
          },
        });
      }
    } catch {
      // ignore malformed draft
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const addQuestion = useCallback((type: QuestionType) => {
    setIsCreatingNew(true);
    setEditingQuestion(null);
    setNewQuestionType(type);
    setEditDialogOpen(true);
  }, []);

  const handleQuestionSave = useCallback(
    (saved: Partial<QuestionBankItem>) => {
      if (isCreatingNew) {
        const draft: DraftQuestion = {
          localId: crypto.randomUUID(),
          question_text: saved.question_text ?? '',
          question_type: (saved.question_type as QuestionType) ?? newQuestionType,
          options: (saved.options as string[] | null) ?? null,
          correct_answer: saved.correct_answer ?? '',
          explanation: saved.explanation ?? null,
          order_index: questions.length,
          title: saved.title ?? null,
          weight: saved.weight ?? null,
          hint: saved.hint ?? null,
          time_limit: saved.time_limit ?? null,
          per_option_explanations: saved.per_option_explanations ?? null,
          video_url: saved.video_url ?? null,
          video_start_time: saved.video_start_time ?? null,
          video_end_time: saved.video_end_time ?? null,
          model_3d_url: saved.model_3d_url ?? null,
          model_3d_type: saved.model_3d_type ?? null,
          sequence_items: saved.sequence_items ?? null,
          fill_blank_template: saved.fill_blank_template ?? null,
          numerical_answer: saved.numerical_answer ?? null,
          numerical_tolerance: saved.numerical_tolerance ?? null,
          question_image_url: saved.question_image_url ?? null,
          media_type: saved.media_type ?? null,
          media_url: saved.media_url ?? null,
        };
        setQuestions((prev) => [...prev, draft]);
      } else if (editingQuestion) {
        setQuestions((prev) =>
          prev.map((q) =>
            q.localId === editingQuestion.localId
              ? dialogSaveToDraft(saved, editingQuestion)
              : q
          )
        );
      }
      setEditDialogOpen(false);
      setEditingQuestion(null);
      setIsCreatingNew(false);
    },
    [isCreatingNew, editingQuestion, newQuestionType, questions.length]
  );

  const handleEditQuestion = useCallback((q: DraftQuestion) => {
    setEditingQuestion(q);
    setIsCreatingNew(false);
    setEditDialogOpen(true);
  }, []);

  const handleRemoveQuestion = useCallback(
    (localId: string) => {
      if (questions.length <= 1) {
        toast.error('Ən azı bir sual olmalıdır');
        return;
      }
      setQuestions((prev) => prev.filter((q) => q.localId !== localId));
    },
    [questions.length]
  );

  const handleImportFromBank = useCallback(
    (items: QuestionBankItem[]) => {
      const newDrafts = items.map((item, i) =>
        bankItemToDraft(item, questions.length + i)
      );
      setQuestions((prev) => [...prev, ...newDrafts]);
      toast.success(`${items.length} sual əlavə edildi`);
    },
    [questions.length]
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setQuestions((prev) => {
        const oldIndex = prev.findIndex((q) => q.localId === active.id);
        const newIndex = prev.findIndex((q) => q.localId === over.id);
        return arrayMove(prev, oldIndex, newIndex).map((q, i) => ({
          ...q,
          order_index: i,
        }));
      });
    }
  }, []);

  const handleSave = async (publish: boolean = false) => {
    if (!user) {
      toast.error('Daxil olmalısınız');
      return;
    }

    const valid = await form.trigger();
    if (!valid) {
      toast.error('Forma məlumatlarını düzgün doldurun');
      return;
    }

    if (questions.length === 0) {
      toast.error('Ən azı bir sual əlavə edin');
      return;
    }

    const emptyQuestions = questions.filter((q) => !q.question_text.trim());
    if (emptyQuestions.length > 0) {
      toast.error('Bütün sualların mətni olmalıdır');
      return;
    }

    setIsSubmitting(true);
    try {
      const metadata = form.getValues();
      const quiz = await createQuiz.mutateAsync({
        title: metadata.title.trim(),
        description: metadata.description?.trim() || null,
        subject: metadata.subject,
        grade: metadata.grade || null,
        difficulty: (metadata.difficulty ?? null) as 'easy' | 'medium' | 'hard' | null,
        duration: metadata.duration,
        is_public: metadata.is_public,
        is_published: publish,
      });

      const questionsToCreate = questions.map((q, i) => draftToDbInsert(q, quiz.id, i));
      await createQuestions.mutateAsync(questionsToCreate);

      localStorage.removeItem('quiz_draft');
      toast.success(publish ? 'Quiz uğurla dərc edildi!' : 'Quiz qaralama olaraq saxlanıldı');
      navigate('/teacher/my-quizzes');
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast.error('Quiz yaradılarkən xəta baş verdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Quick-add type groups ────────────────────────────────────────────────────
  const quickTypes: QuestionType[] = ['multiple_choice', 'true_false', 'short_answer'];
  const moreTypes = QUESTION_TYPES.filter((t) => !quickTypes.includes(t.value as QuestionType));

  // QuestionEditDialog needs an empty categories array (not re-fetching categories for quiz creation context)
  const emptyCategories: string[] = [];

  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">

        {/* ── Header ── */}
        <div className="mb-8 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/teacher/dashboard')}
              className="text-muted-foreground hover:text-foreground shrink-0"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Geri
            </Button>
            {questions.length > 0 && (
              <span className="text-sm font-medium text-muted-foreground">
                {questions.length} sual
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={isSubmitting}
            >
              {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
              Qaralama
            </Button>
            <Button
              variant="game"
              onClick={() => handleSave(true)}
              disabled={isSubmitting}
            >
              {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Dərc Et
            </Button>
          </div>
        </div>

        {/* ── Metadata Form ── */}
        <Form {...form}>
          <div className="mb-8 rounded-2xl bg-gradient-card border border-border/50 p-6">
            <h2 className="mb-6 font-display text-xl font-bold text-foreground">Quiz Məlumatları</h2>
            <div className="grid gap-6">

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quiz Başlığı *</FormLabel>
                    <FormControl>
                      <Input placeholder="Məs: Cəbr Əsasları" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Təsvir</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Quiz haqqında qısa məlumat..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fənn *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['Riyaziyyat', 'Fizika', 'Kimya', 'Biologiya', 'Tarix', 'Coğrafiya', 'Ədəbiyyat', 'İngilis dili', 'İnformatika'].map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sinif</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[5, 6, 7, 8, 9, 10, 11].map((g) => (
                            <SelectItem key={g} value={`${g}-ci sinif`}>{g}-ci sinif</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Çətinlik</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(v === 'none' ? null : v)}
                        value={field.value ?? 'none'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Seçilməyib</SelectItem>
                          <SelectItem value="easy">Asan</SelectItem>
                          <SelectItem value="medium">Orta</SelectItem>
                          <SelectItem value="hard">Çətin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Müddət (dəq)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={300}
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="is_public"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div>
                      <FormLabel className="cursor-pointer">İctimai Quiz</FormLabel>
                      <p className="text-xs text-muted-foreground">Bütün tələbələr bu quizə daxil ola bilər</p>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Form>

        {/* ── Quick Actions ── */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => addQuestion('multiple_choice')}>
            <Plus className="mr-2 h-4 w-4" />
            Çoxseçimli
          </Button>
          <Button variant="outline" onClick={() => addQuestion('true_false')}>
            <Plus className="mr-2 h-4 w-4" />
            Doğru/Yanlış
          </Button>
          <Button variant="outline" onClick={() => addQuestion('short_answer')}>
            <Plus className="mr-2 h-4 w-4" />
            Qısa Cavab
          </Button>

          {/* More types dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Daha çox
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              {moreTypes.map((t) => (
                <DropdownMenuItem
                  key={t.value}
                  onClick={() => addQuestion(t.value as QuestionType)}
                  className="gap-2"
                >
                  <span>{t.icon}</span>
                  {t.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={() => setPickerOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            İdxal Et
          </Button>
          <Button variant="outline" onClick={() => navigate('/teacher/ai-assistant')}>
            <Sparkles className="mr-2 h-4 w-4" />
            AI ilə Yarat
          </Button>
        </div>

        {/* ── Questions List (DnD) ── */}
        {questions.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={questions.map((q) => q.localId)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <SortableQuestionCard
                    key={question.localId}
                    question={question}
                    index={index}
                    onEdit={handleEditQuestion}
                    onRemove={handleRemoveQuestion}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-border/50 p-12 text-center">
            <p className="text-muted-foreground mb-4">Hələ sual yoxdur</p>
            <Button variant="outline" onClick={() => addQuestion('multiple_choice')}>
              <Plus className="mr-2 h-4 w-4" />
              İlk Sualı Əlavə Et
            </Button>
          </div>
        )}

        {/* ── Add Question Button ── */}
        {questions.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Button variant="outline" size="lg" onClick={() => addQuestion('multiple_choice')}>
              <Plus className="mr-2 h-5 w-5" />
              Sual Əlavə Et
            </Button>
          </div>
        )}
      </div>

      {/* ── Dialogs ── */}
      <QuestionEditDialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) {
            setEditingQuestion(null);
            setIsCreatingNew(false);
          }
        }}
        question={editingQuestion ? draftToDialogQuestion(editingQuestion) : null}
        categories={emptyCategories}
        onSave={handleQuestionSave}
        mode={isCreatingNew ? 'create' : 'edit'}
      />

      <QuestionPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onConfirm={handleImportFromBank}
      />
    </div>
  );
}
