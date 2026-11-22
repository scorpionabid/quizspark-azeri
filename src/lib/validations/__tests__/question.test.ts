import { describe, it, expect } from 'vitest';
import { validateDraftQuestion } from '../question';
import { DraftQuestion, getAnswerSummary } from '@/components/teacher/quiz-creation/SortableQuestionCard';

describe('validateDraftQuestion & getAnswerSummary', () => {
  it('should validate matching question with record pairs', () => {
    const question: DraftQuestion = {
      localId: '1',
      question_text: 'Uyğunlaşdırın',
      question_type: 'matching',
      options: null,
      correct_answer: 'Sol1:Sağ1|||Sol2:Sağ2',
      explanation: null,
      order_index: 10,
      matching_pairs: { 'Sol1': 'Sağ1', 'Sol2': 'Sağ2' },
    };

    expect(validateDraftQuestion(question)).toBeNull();
    expect(getAnswerSummary(question)).toBe('2 cütlük');
  });

  it('should validate matching question with array pairs', () => {
    const question: DraftQuestion = {
      localId: '2',
      question_text: 'Uyğunlaşdırın',
      question_type: 'matching',
      options: null,
      correct_answer: '',
      explanation: null,
      order_index: 0,
      matching_pairs: [
        { left: 'A', right: '1' },
        { left: 'B', right: '2' },
      ],
    };

    expect(validateDraftQuestion(question)).toBeNull();
    expect(getAnswerSummary(question)).toBe('2 cütlük');
  });

  it('should fail validation when matching pairs are missing', () => {
    const question: DraftQuestion = {
      localId: '3',
      question_text: 'Uyğunlaşdırın',
      question_type: 'matching',
      options: null,
      correct_answer: '',
      explanation: null,
      order_index: 10,
      matching_pairs: null,
    };

    expect(validateDraftQuestion(question)).toBe('Sual 11: Uyğunlaşdırma cütləri daxil edilməyib');
    expect(getAnswerSummary(question)).toBe('Cütlər yoxdur');
  });
});
