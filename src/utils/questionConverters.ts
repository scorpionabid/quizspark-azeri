import { GeneratedQuestion } from '@/components/quiz/EditableQuestionCard';
import { QuestionBankItem } from '@/hooks/useQuestionBank';

const DIFFICULTY_MAP: Record<string, string> = {
  easy: 'asan',
  medium: 'orta',
  hard: 'çətin',
};

/**
 * GeneratedQuestion-u sual bankı DB formatına çevirir.
 */
export function convertToQuestionBankItem(
  question: GeneratedQuestion,
  opts: { subject: string; difficulty: string },
): Omit<QuestionBankItem, 'id' | 'created_at' | 'updated_at'> {
  const qType = question.questionType || 'multiple_choice';

  const options = (() => {
    if (qType === 'true_false') return ['Doğru', 'Yanlış'];
    if (qType === 'matching') return [];
    return question.options;
  })();

  const correctAnswer = (() => {
    if (qType === 'matching') return '';
    if (qType === 'numerical') return String(question.numericalAnswer ?? 0);
    return question.options[question.correctAnswer] || question.options[0] || '';
  })();

  return {
    title: question.question.slice(0, 100),
    question_text: question.question,
    question_type: qType,
    options,
    correct_answer: correctAnswer,
    explanation: question.explanation || null,
    category: opts.subject || null,
    difficulty: DIFFICULTY_MAP[opts.difficulty] || 'orta',
    bloom_level: question.bloomLevel || null,
    weight: 1,
    time_limit: 60,
    tags: null,
    user_id: null,
    source_document_id: null,
    question_image_url: question.questionImageUrl || null,
    option_images: null,
    media_type: null,
    media_url: null,
    hint: null,
    per_option_explanations: null,
    video_url: null,
    video_start_time: null,
    video_end_time: null,
    model_3d_url: null,
    model_3d_type: null,
    hotspot_data: null,
    matching_pairs:
      qType === 'matching' && question.matchingPairs
        ? Object.fromEntries(question.matchingPairs.map((p) => [p.left, p.right]))
        : null,
    sequence_items: null,
    fill_blank_template: qType === 'fill_blank' ? (question.fillBlankTemplate || null) : null,
    numerical_answer: qType === 'numerical' ? (question.numericalAnswer ?? null) : null,
    numerical_tolerance: qType === 'numerical' ? (question.numericalTolerance ?? null) : null,
    feedback_enabled: true,
    quality_score: null,
    usage_count: 0,
  };
}
