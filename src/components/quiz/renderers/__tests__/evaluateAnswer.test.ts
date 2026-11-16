import { describe, it, expect } from 'vitest';
import { evaluateAnswer } from '../utils';
import { Question } from '@/hooks/useQuestions';

describe('evaluateAnswer', () => {
  it('should return false for empty or whitespace answer', () => {
    const q: Question = {
      id: 'q1',
      quiz_id: 'quiz1',
      title: 'Sual 1',
      question_text: 'Azərbaycanın paytaxtı?',
      question_type: 'multiple_choice',
      options: ['Bakı', 'Gəncə', 'Sumqayıt'],
      correct_answer: 'Bakı',
      weight: 1,
      order_index: 0,
      created_at: new Date().toISOString(),
    };

    const emptyEval = evaluateAnswer(q, '');
    expect(emptyEval.isCorrect).toBe(false);
    expect(emptyEval.pointsEarned).toBe(0);
    expect(emptyEval.needsReview).toBe(false);

    const spaceEval = evaluateAnswer(q, '   ');
    expect(spaceEval.isCorrect).toBe(false);
    expect(spaceEval.pointsEarned).toBe(0);
  });

  it('should correctly evaluate multiple_choice questions', () => {
    const q: Question = {
      id: 'q2',
      quiz_id: 'quiz1',
      title: 'Sual 2',
      question_text: 'Bakı hansı dənizin sahilindədir?',
      question_type: 'multiple_choice',
      options: ['Xəzər', 'Qara', 'Baltik'],
      correct_answer: 'Xəzər',
      weight: 2,
      order_index: 1,
      created_at: new Date().toISOString(),
    };

    expect(evaluateAnswer(q, 'Xəzər')).toEqual({
      isCorrect: true,
      pointsEarned: 2,
      maxPoints: 2,
      needsReview: false,
    });

    expect(evaluateAnswer(q, 'Qara')).toEqual({
      isCorrect: false,
      pointsEarned: 0,
      maxPoints: 2,
      needsReview: false,
    });
  });

  it('should handle pipe-delimited alternative open answers', () => {
    const q: Question = {
      id: 'q3',
      quiz_id: 'quiz1',
      title: 'Sual 3',
      question_text: 'Dövlətin adını yazın',
      question_type: 'short_answer',
      correct_answer: 'Parfiya|Parfiya dövləti|Parfiya imperiyası',
      weight: 1,
      order_index: 2,
      created_at: new Date().toISOString(),
    };

    expect(evaluateAnswer(q, 'Parfiya').isCorrect).toBe(true);
    expect(evaluateAnswer(q, 'parfiya dövləti').isCorrect).toBe(true);
    expect(evaluateAnswer(q, 'PARFIYA IMPERIYASI').isCorrect).toBe(true);
    expect(evaluateAnswer(q, 'Roma').isCorrect).toBe(false);
  });

  it('should evaluate multiple_select with full match and partial credits', () => {
    const q: Question = {
      id: 'q4',
      quiz_id: 'quiz1',
      title: 'Sual 4',
      question_text: 'Düzgün bəndləri seçin',
      question_type: 'multiple_select',
      options: ['A', 'B', 'C', 'D'],
      correct_answer: 'A, C',
      correct_option_indices: [0, 2],
      weight: 4,
      order_index: 3,
      created_at: new Date().toISOString(),
    };

    // Full match
    const fullMatch = evaluateAnswer(q, 'A, C');
    expect(fullMatch.isCorrect).toBe(true);
    expect(fullMatch.pointsEarned).toBe(4);

    // Partial match (only A chosen)
    const partialMatch = evaluateAnswer(q, 'A');
    expect(partialMatch.isCorrect).toBe(false);
    expect(partialMatch.pointsEarned).toBe(2); // 1 out of 2 correct = 50% of 4 = 2 points
  });

  it('should flag essay and code questions for manual review', () => {
    const essayQ: Question = {
      id: 'q5',
      quiz_id: 'quiz1',
      title: 'Esse',
      question_text: 'Esse yazın',
      question_type: 'essay',
      weight: 10,
      order_index: 4,
      created_at: new Date().toISOString(),
    };

    const res = evaluateAnswer(essayQ, 'Mənim fikrimcə...');
    expect(res.needsReview).toBe(true);
    expect(res.isCorrect).toBe(false);
    expect(res.pointsEarned).toBe(0);
    expect(res.maxPoints).toBe(10);
  });
});
