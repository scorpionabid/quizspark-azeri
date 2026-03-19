import { DraftQuestion } from '@/components/teacher/quiz-creation/SortableQuestionCard';

/**
 * Validates a draft question's answer completeness.
 * Returns an error message string if invalid, or null if valid.
 */
export function validateDraftQuestion(q: DraftQuestion): string | null {
  switch (q.question_type) {
    case 'multiple_choice':
    case 'true_false':
    case 'short_answer':
    case 'fill_blank':
    case 'video':
    case 'code':
      if (!q.correct_answer?.trim()) {
        return `Sual ${q.order_index + 1}: Düzgün cavab daxil edilməyib`;
      }
      return null;

    case 'essay':
      // Essay questions don't require a model answer
      return null;

    case 'numerical':
      if (q.numerical_answer == null) {
        return `Sual ${q.order_index + 1}: Rəqəmsal cavab daxil edilməyib`;
      }
      return null;

    case 'matching':
      if (!Array.isArray(q.matching_pairs) || (q.matching_pairs as unknown[]).length === 0) {
        return `Sual ${q.order_index + 1}: Uyğunlaşdırma cütləri daxil edilməyib`;
      }
      return null;

    case 'ordering':
      if (!q.sequence_items || q.sequence_items.length < 2) {
        return `Sual ${q.order_index + 1}: Ardıcıllıq elementləri daxil edilməyib (minimum 2)`;
      }
      return null;

    case 'hotspot':
      // hotspot_data presence is enough; detailed validation is in the editor
      return null;

    case 'multiple_select':
      if (!q.correct_answer?.trim()) {
        return `Sual ${q.order_index + 1}: Düzgün cavab(lar) seçilməyib`;
      }
      return null;

    default:
      return null;
  }
}
