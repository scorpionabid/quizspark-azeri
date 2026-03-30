import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { QuestionBankItem } from '@/hooks/useQuestionBank';
import { QuestionType } from '@/types/question';
import { useEnhanceQuestion } from '@/hooks/useEnhanceQuestion';
import { useQuestionImageUpload } from '@/hooks/useQuestionImageUpload';
import { useQuestion3DUpload } from '@/hooks/useQuestion3DUpload';

function parseOptions(options: string[] | Record<string, string> | null): string[] {
  if (!options) return ['', '', '', ''];
  if (Array.isArray(options)) return options.length >= 4 ? options : [...options, ...Array(4 - options.length).fill('')];
  return Object.values(options);
}

export function useQuestionEditForm(
  question: QuestionBankItem | null,
  mode: 'create' | 'edit',
  onSave: (question: Partial<QuestionBankItem>) => void,
  onClose: () => void
) {
  const [formData, setFormData] = useState({
    title: '',
    question_text: '',
    question_type: 'multiple_choice' as QuestionType | string,
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
    category: '',
    difficulty: 'orta',
    bloom_level: '',
    tags: [] as string[],
    question_image_url: '',
    media_type: null as 'image' | 'audio' | 'video' | null,
    media_url: '',
    weight: 1.0,
    hint: '',
    time_limit: '' as number | string,
    video_url: '',
    video_start_time: '' as number | string,
    video_end_time: '' as number | string,
    model_3d_url: '',
    model_3d_type: 'glb',
    fill_blank_template: '',
    numerical_answer: '' as number | string,
    numerical_tolerance: 0,
    matching_pairs: [] as { left: string; right: string }[],
    sequence_items: [] as string[],
    // P1: Qısa cavab
    accepted_answers: [] as string[],
    answer_case_sensitive: false,
    answer_trim_spaces: true,
    answer_match_type: 'exact' as string,
    // P1: Esse
    essay_rubric: null as Array<{ criterion: string; maxPoints: number; description?: string }> | null,
    essay_min_words: '' as number | string,
    essay_max_words: '' as number | string,
    ai_grading_enabled: false,
    // P1: Ümumi feedback
    feedback_correct: '',
    feedback_incorrect: '',
    // P1: Pedaqoji metadata
    learning_objective: '',
    topic: '',
    // P2: Kod sualı
    code_language: 'python' as string,
    code_starter_template: '',
    code_test_cases: [] as Array<{ input: string; expectedOutput: string; description?: string; isHidden?: boolean }>,
    // P2: Fill blank çox boşluq
    fill_blank_answers: null as Record<string, string[]> | null,
    fill_blank_case_sensitive: false,
    // P2: Matching media
    matching_left_type: 'text' as string,
    matching_right_type: 'text' as string,
    // P3: Matrix / Likert
    matrix_rows: [] as string[],
    matrix_columns: [] as string[],
    matrix_correct_answers: null as Record<string, string> | null,
    likert_min_label: '',
    likert_max_label: '',
    likert_scale: 5 as number,
    diagram_labels: [] as Array<{ id: string; x: number; y: number; expectedLabel: string }>,
    // Ümumi
    is_graded: true,
    shuffle_options: true,
    partial_credit_enabled: false,
  });

  const { uploadImage, isUploading } = useQuestionImageUpload();
  const { upload3DModel } = useQuestion3DUpload();
  const [is3DUploading, setIs3DUploading] = useState(false);
  const { enhanceQuestion, isEnhancing } = useEnhanceQuestion();
  const [isParsing, setIsParsing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const q = question as any;
    if (question && mode === 'edit') {
      setFormData({
        title: question.title || '',
        question_text: question.question_text,
        question_type: question.question_type,
        options: question.question_type === 'true_false' ? ['Doğru', 'Yanlış'] : parseOptions(question.options),
        correct_answer: question.correct_answer,
        explanation: question.explanation || '',
        category: question.category || '',
        difficulty: question.difficulty || 'orta',
        bloom_level: question.bloom_level || '',
        tags: question.tags || [],
        question_image_url: question.question_image_url || '',
        media_type: question.media_type || null,
        media_url: question.media_url || '',
        weight: question.weight || 1.0,
        hint: question.hint || '',
        time_limit: question.time_limit || '',
        video_url: question.video_url || '',
        video_start_time: question.video_start_time || '',
        video_end_time: question.video_end_time || '',
        model_3d_url: question.model_3d_url || '',
        model_3d_type: question.model_3d_type || 'glb',
        fill_blank_template: question.fill_blank_template || '',
        numerical_answer: question.numerical_answer ?? '',
        numerical_tolerance: question.numerical_tolerance ?? 0,
        matching_pairs: q.matching_pairs || [],
        sequence_items: q.sequence_items || [],
        accepted_answers: q.accepted_answers || [],
        answer_case_sensitive: q.answer_case_sensitive ?? false,
        answer_trim_spaces: q.answer_trim_spaces ?? true,
        answer_match_type: q.answer_match_type || 'exact',
        essay_rubric: q.essay_rubric || null,
        essay_min_words: q.essay_min_words ?? '',
        essay_max_words: q.essay_max_words ?? '',
        ai_grading_enabled: q.ai_grading_enabled ?? false,
        feedback_correct: q.feedback_correct || '',
        feedback_incorrect: q.feedback_incorrect || '',
        learning_objective: q.learning_objective || '',
        topic: q.topic || '',
        code_language: q.code_language || 'python',
        code_starter_template: q.code_starter_template || '',
        code_test_cases: q.code_test_cases || [],
        fill_blank_answers: q.fill_blank_answers || null,
        fill_blank_case_sensitive: q.fill_blank_case_sensitive ?? false,
        matching_left_type: q.matching_left_type || 'text',
        matching_right_type: q.matching_right_type || 'text',
        matrix_rows: q.matrix_rows || [],
        matrix_columns: q.matrix_columns || [],
        matrix_correct_answers: q.matrix_correct_answers || null,
        likert_min_label: q.likert_min_label || '',
        likert_max_label: q.likert_max_label || '',
        likert_scale: q.likert_scale ?? 5,
        diagram_labels: q.diagram_labels || [],
        is_graded: q.is_graded ?? true,
        shuffle_options: q.shuffle_options ?? true,
        partial_credit_enabled: q.partial_credit_enabled ?? false,
      });
    } else {
      setFormData({
        title: '',
        question_text: '',
        question_type: 'multiple_choice',
        options: ['', '', '', ''],
        correct_answer: '',
        explanation: '',
        category: '',
        difficulty: 'orta',
        bloom_level: '',
        tags: [],
        question_image_url: '',
        media_type: null,
        media_url: '',
        weight: 1.0,
        hint: '',
        time_limit: '',
        video_url: '',
        video_start_time: '',
        video_end_time: '',
        model_3d_url: '',
        model_3d_type: 'glb',
        fill_blank_template: '',
        numerical_answer: '',
        numerical_tolerance: 0,
        matching_pairs: [],
        sequence_items: [],
        accepted_answers: [],
        answer_case_sensitive: false,
        answer_trim_spaces: true,
        answer_match_type: 'exact',
        essay_rubric: null,
        essay_min_words: '',
        essay_max_words: '',
        ai_grading_enabled: false,
        feedback_correct: '',
        feedback_incorrect: '',
        learning_objective: '',
        topic: '',
        code_language: 'python',
        code_starter_template: '',
        code_test_cases: [],
        fill_blank_answers: null,
        fill_blank_case_sensitive: false,
        matching_left_type: 'text',
        matching_right_type: 'text',
        matrix_rows: [],
        matrix_columns: [],
        matrix_correct_answers: null,
        likert_min_label: '',
        likert_max_label: '',
        likert_scale: 5,
        diagram_labels: [],
        is_graded: true,
        shuffle_options: true,
        partial_credit_enabled: false,
      });
    }
  }, [question, mode]);

  const validateForm = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    const qt = formData.question_type;

    if (!formData.question_text.trim()) errors.question_text = 'Sual mətni boş ola bilməz';
    if (qt === 'multiple_choice' || qt === 'video') {
      const filled = (formData.options as string[]).filter(o => o.trim() !== '');
      if (filled.length < 2) errors.options = 'Ən azı 2 variant daxil edilməlidir';
      if (!formData.correct_answer) errors.correct_answer = 'Düzgün cavab seçilməlidir';
    } else if (qt === 'multiple_select') {
      const filled = (formData.options as string[]).filter(o => o.trim() !== '');
      if (filled.length < 2) errors.options = 'Ən azı 2 variant daxil edilməlidir';
      if (!formData.correct_answer) errors.correct_answer = 'Ən azı bir düzgün cavab seçilməlidir';
    } else if (qt === 'true_false' && !formData.correct_answer) {
      errors.correct_answer = 'Doğru/Yanlış seçilməlidir';
    } else if (qt === 'fill_blank' && !formData.correct_answer.trim()) {
      errors.correct_answer = 'Ən azı bir boşluq cavabı daxil edilməlidir';
    } else if (qt === 'matching') {
      const pairs = formData.matching_pairs as Array<{ left: string; right: string }>;
      if (!pairs || pairs.length < 2) errors.matching_pairs = 'Ən azı 2 cüt daxil edilməlidir';
      else if (pairs.some(p => !p.left.trim() || !p.right.trim())) errors.matching_pairs = 'Bütün cütlər doldurulmalıdır';
    } else if (qt === 'ordering') {
      const items = formData.sequence_items as string[];
      if (!items || items.length < 2) errors.sequence_items = 'Ən azı 2 element daxil edilməlidir';
      else if (items.some(it => !it.trim())) errors.sequence_items = 'Bütün elementlər doldurulmalıdır';
    } else if (qt === 'numerical' && (formData.numerical_answer === '' || isNaN(Number(formData.numerical_answer)))) {
      errors.numerical_answer = 'Rəqəmsal cavab daxil edilməlidir';
    } else if (qt === 'code') {
      if (!formData.code_language) errors.code_language = 'Proqramlaşdırma dili seçilməlidir';
    } else if (qt === 'essay') {
      // Essay üçün model cavab isteğe bağlıdır — boş ola bilər
    } else if (qt === 'matrix_choice') {
      if (!formData.matrix_rows || formData.matrix_rows.length < 1) errors.matrix_rows = 'Ən azı 1 sıra daxil edilməlidir';
      if (!formData.matrix_columns || formData.matrix_columns.length < 2) errors.matrix_columns = 'Ən azı 2 sütun daxil edilməlidir';
    } else if (qt === 'likert') {
      // Likert qiymətləndirilmir — boş ola bilər
    } else if (qt === 'diagram_label') {
      if (!formData.question_image_url) errors.question_image_url = 'Diaqram şəkli yüklənməlidir';
      if (!formData.diagram_labels || formData.diagram_labels.length < 1) errors.diagram_labels = 'Ən azı 1 etiket nöqtəsi əlavə edilməlidir';
    } else if (qt === 'audio') {
      if (!formData.media_url) errors.media_url = 'Audio fayl yüklənməlidir';
      if (!formData.correct_answer.trim()) errors.correct_answer = 'Düzgün cavab boş ola bilməz';
    } else if (!formData.correct_answer.trim()) {
      errors.correct_answer = 'Düzgün cavab boş ola bilməz';
    }

    return errors;
  };

  const handleAIAnalysis = async () => {
    if (!formData.question_text) {
      toast.error("Zəhmət olmasa əvvəlcə sual mətnini daxil edin.");
      return;
    }
    try {
      const data = await enhanceQuestion(formData.question_text, 'analyze_full');
      if (data) {
        setFormData(prev => ({
          ...prev,
          category: data.category || prev.category,
          difficulty: data.difficulty || prev.difficulty,
          bloom_level: data.bloom_level || prev.bloom_level,
          weight: data.weight || prev.weight,
          time_limit: data.time_limit || prev.time_limit,
          tags: data.tags ? [...new Set([...prev.tags, ...data.tags])] : prev.tags,
        }));
        toast.success("AI analizi uğurla tamamlandı!");
      }
    } catch (err) {
      console.error("AI Analysis Error:", err);
    }
  };

  const handleSubmit = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error('Zəhmət olmasa xətaları düzəldin');
      return;
    }
    setValidationErrors({});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: Partial<QuestionBankItem> & Record<string, any> = {
      title: formData.title || null,
      question_text: formData.question_text,
      question_type: formData.question_type,
      correct_answer: formData.correct_answer,
      explanation: formData.explanation || null,
      category: formData.category || null,
      difficulty: formData.difficulty || null,
      bloom_level: formData.bloom_level || null,
      tags: formData.tags.length > 0 ? formData.tags : null,
      question_image_url: formData.question_image_url || null,
      media_type: formData.media_type || null,
      media_url: formData.media_url || null,
      weight: Number(formData.weight) || 1.0,
      hint: formData.hint || null,
      time_limit: formData.time_limit ? Number(formData.time_limit) : null,
      video_url: formData.video_url || null,
      video_start_time: formData.video_start_time ? Number(formData.video_start_time) : null,
      video_end_time: formData.video_end_time ? Number(formData.video_end_time) : null,
      model_3d_url: formData.model_3d_url || null,
      model_3d_type: formData.model_3d_type || 'glb',
      fill_blank_template: formData.fill_blank_template || null,
      numerical_answer: formData.numerical_answer !== '' ? Number(formData.numerical_answer) : null,
      numerical_tolerance: Number(formData.numerical_tolerance) || 0,
      // P1 fields
      accepted_answers: formData.accepted_answers.length > 0 ? formData.accepted_answers : null,
      answer_case_sensitive: formData.answer_case_sensitive,
      answer_trim_spaces: formData.answer_trim_spaces,
      answer_match_type: formData.answer_match_type || 'exact',
      essay_rubric: formData.essay_rubric || null,
      essay_min_words: formData.essay_min_words !== '' ? Number(formData.essay_min_words) : null,
      essay_max_words: formData.essay_max_words !== '' ? Number(formData.essay_max_words) : null,
      ai_grading_enabled: formData.ai_grading_enabled,
      feedback_correct: formData.feedback_correct || null,
      feedback_incorrect: formData.feedback_incorrect || null,
      learning_objective: formData.learning_objective || null,
      topic: formData.topic || null,
      // P2 fields
      code_language: formData.code_language || null,
      code_starter_template: formData.code_starter_template || null,
      code_test_cases: formData.code_test_cases.length > 0 ? formData.code_test_cases : null,
      fill_blank_answers: formData.fill_blank_answers || null,
      fill_blank_case_sensitive: formData.fill_blank_case_sensitive,
      matching_left_type: formData.matching_left_type || 'text',
      matching_right_type: formData.matching_right_type || 'text',
      // P3 fields
      matrix_rows: formData.matrix_rows.length > 0 ? formData.matrix_rows : null,
      matrix_columns: formData.matrix_columns.length > 0 ? formData.matrix_columns : null,
      matrix_correct_answers: formData.matrix_correct_answers || null,
      likert_min_label: formData.likert_min_label || null,
      likert_max_label: formData.likert_max_label || null,
      likert_scale: formData.likert_scale || 5,
      diagram_labels: formData.diagram_labels.length > 0 ? formData.diagram_labels : null,
      is_graded: formData.is_graded,
      shuffle_options: formData.shuffle_options,
      partial_credit_enabled: formData.partial_credit_enabled,
    };

    if (['multiple_choice', 'multiple_select', 'true_false', 'video', 'matrix_choice', 'likert'].includes(formData.question_type)) {
      data.options = formData.options.filter(o => o.trim() !== '');
    } else {
      data.options = null;
    }

    if (formData.matching_pairs && formData.matching_pairs.length > 0) {
      data.matching_pairs = formData.matching_pairs as unknown as Record<string, string>;
    }
    if (formData.sequence_items && formData.sequence_items.length > 0) {
      data.sequence_items = formData.sequence_items as unknown as string[];
    }

    if (mode === 'edit' && question) data.id = question.id;
    onSave(data);
  };

  return {
    formData,
    setFormData,
    validationErrors,
    isUploading,
    is3DUploading,
    setIs3DUploading,
    isEnhancing,
    isParsing,
    setIsParsing,
    handleAIAnalysis,
    handleSubmit,
    uploadImage,
    upload3DModel,
    enhanceQuestion,
  };
}
