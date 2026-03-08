import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { toast } from 'sonner';

// Hooks
import { useCreateQuiz, useQuiz, useUpdateQuiz } from '@/hooks/useQuizzes';
import { useBulkCreateQuestions, useQuestions } from '@/hooks/useQuestions';
import { useAuth } from '@/contexts/AuthContext';

// Components
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { QuestionEditDialog } from '@/components/question-bank/QuestionEditDialog';
import { QuestionPickerDialog } from '@/components/quiz/QuestionPickerDialog';
import { QuizActionHeader } from '@/components/teacher/quiz-creation/QuizActionHeader';
import { QuizMetadataForm } from '@/components/teacher/quiz-creation/QuizMetadataForm';
import { QuizQuickActions } from '@/components/teacher/quiz-creation/QuizQuickActions';
import { QuizQuestionList } from '@/components/teacher/quiz-creation/QuizQuestionList';

// Types & Utils
import { QuestionBankItem } from '@/hooks/useQuestionBank';
import { QuestionType } from '@/types/question';
import { quizMetadataSchema, QuizMetadataFormData } from '@/lib/validations/quiz';
import { GeneratedQuestion } from '@/components/quiz/EditableQuestionCard';
import { DraftQuestion } from '@/components/teacher/quiz-creation/SortableQuestionCard';

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

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function CreateQuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const createQuiz = useCreateQuiz();
  const updateQuiz = useUpdateQuiz();
  const createQuestions = useBulkCreateQuestions();
  const { data: existingQuiz, isLoading: quizLoading } = useQuiz(id);
  const { data: existingQuestions, isLoading: questionsLoading } = useQuestions(id);

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

  // Load existing quiz data if in edit mode
  useEffect(() => {
    if (id && existingQuiz) {
      form.reset({
        title: existingQuiz.title,
        description: existingQuiz.description || '',
        subject: existingQuiz.subject || '',
        grade: existingQuiz.grade || '',
        difficulty: existingQuiz.difficulty,
        duration: existingQuiz.duration,
        is_public: existingQuiz.is_public,
      });
    }
  }, [id, existingQuiz, form]);

  useEffect(() => {
    if (id && existingQuestions) {
      const drafts: DraftQuestion[] = existingQuestions.map((q) => ({
        localId: q.id,
        question_text: q.question_text,
        question_type: q.question_type as QuestionType,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        order_index: q.order_index,
        title: q.title,
        weight: q.weight,
        hint: q.hint,
        time_limit: q.time_limit,
        per_option_explanations: q.per_option_explanations,
        video_url: q.video_url,
        video_start_time: q.video_start_time,
        video_end_time: q.video_end_time,
        model_3d_url: q.model_3d_url,
        model_3d_type: q.model_3d_type,
        hotspot_data: q.hotspot_data,
        matching_pairs: q.matching_pairs,
        sequence_items: q.sequence_items,
        fill_blank_template: q.fill_blank_template,
        numerical_answer: q.numerical_answer,
        numerical_tolerance: q.numerical_tolerance,
        question_image_url: q.question_image_url,
        media_type: q.media_type,
        media_url: q.media_url,
      }));
      setQuestions(drafts);
    }
  }, [id, existingQuestions]);

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

  // Draft recovery
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
      // ignore
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      let quizId = id;

      if (id) {
        await updateQuiz.mutateAsync({
          id,
          title: metadata.title.trim(),
          description: metadata.description?.trim() || null,
          subject: metadata.subject,
          grade: metadata.grade || null,
          difficulty: (metadata.difficulty ?? null) as 'easy' | 'medium' | 'hard' | null,
          duration: metadata.duration,
          is_public: metadata.is_public,
          is_published: publish,
        });

        const { error: deleteError } = await supabase
          .from('questions')
          .delete()
          .eq('quiz_id', id);

        if (deleteError) throw deleteError;
      } else {
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
        quizId = quiz.id;
      }

      const questionsToCreate = questions.map((q, i) => draftToDbInsert(q, quizId!, i));
      await createQuestions.mutateAsync(questionsToCreate);

      localStorage.removeItem('quiz_draft');
      toast.success(id
        ? 'Quiz uğurla yeniləndi'
        : (publish ? 'Quiz uğurla dərc edildi!' : 'Quiz qaralama olaraq saxlanıldı')
      );
      navigate('/teacher/my-quizzes');
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error('Quiz yadda saxlanılarkən xəta baş verdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (id && (quizLoading || questionsLoading)) {
    return (
      <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <QuizActionHeader
          onBack={() => navigate('/teacher/dashboard')}
          onSave={handleSave}
          isSubmitting={isSubmitting}
          questionCount={questions.length}
        />

        <QuizMetadataForm form={form} isEditMode={!!id} />

        <QuizQuickActions
          onAddQuestion={addQuestion}
          onOpenPicker={() => setPickerOpen(true)}
          onAiAssistant={() => navigate('/teacher/ai-assistant')}
        />

        <QuizQuestionList
          questions={questions}
          onDragEnd={handleDragEnd}
          onEdit={handleEditQuestion}
          onRemove={handleRemoveQuestion}
          onAddQuestion={addQuestion}
        />
      </div>

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
        categories={[]}
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
