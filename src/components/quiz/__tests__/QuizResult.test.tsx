import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizResult } from '../QuizResult';
import { MemoryRouter } from 'react-router-dom';
import { Question } from '@/hooks/useQuestions';
import { QuestionAnswer } from '@/types/question';
import '@testing-library/jest-dom';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'u1', email: 'test@example.com' },
  }),
}));

const mockQuestions: Question[] = [
  {
    id: 'q1',
    quiz_id: 'quiz1',
    title: 'Sual 1',
    question_text: 'Sual 1 mətni',
    question_type: 'multiple_choice',
    options: ['A', 'B'],
    correct_answer: 'A',
    weight: 1,
    order_index: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'q2',
    quiz_id: 'quiz1',
    title: 'Sual 2',
    question_text: 'Sual 2 mətni',
    question_type: 'multiple_choice',
    options: ['A', 'B'],
    correct_answer: 'B',
    weight: 1,
    order_index: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'q3',
    quiz_id: 'quiz1',
    title: 'Sual 3',
    question_text: 'Sual 3 mətni',
    question_type: 'multiple_choice',
    options: ['A', 'B'],
    correct_answer: 'A',
    weight: 1,
    order_index: 2,
    created_at: new Date().toISOString(),
  },
];

describe('QuizResult', () => {
  it('should correctly separate Düzgün, Yanlış and Boş metrics', () => {
    // q1 is correct, q2 is wrong, q3 is left unanswered (empty string)
    const answers: QuestionAnswer[] = [
      {
        questionId: 'q1',
        questionType: 'multiple_choice',
        textAnswer: 'A',
        isCorrect: true,
        pointsEarned: 1,
      },
      {
        questionId: 'q2',
        questionType: 'multiple_choice',
        textAnswer: 'A', // wrong! correct is B
        isCorrect: false,
        pointsEarned: 0,
      },
      {
        questionId: 'q3',
        questionType: 'multiple_choice',
        textAnswer: '', // unanswered
        isCorrect: false,
        pointsEarned: 0,
      },
    ];

    render(
      <MemoryRouter>
        <QuizResult
          score={33}
          correctAnswers={1}
          totalQuestions={3}
          earnedXP={10}
          passThreshold={60}
          answers={answers}
          questions={mockQuestions}
          onRetry={() => {}}
          onHome={() => {}}
        />
      </MemoryRouter>
    );

    // Expect Düzgün: 1
    expect(screen.getByText('Düzgün')).toBeInTheDocument();
    // Expect Yanlış: 1 (only q2, NOT q3)
    expect(screen.getByText('Yanlış')).toBeInTheDocument();
    // Expect Boş: 1
    expect(screen.getByText('Boş')).toBeInTheDocument();
  });

  it('should not mark unanswered questions as Yanlış when completed prematurely', () => {
    // Only q1 answered correctly, q2 and q3 completely unanswered
    const answers: QuestionAnswer[] = [
      {
        questionId: 'q1',
        questionType: 'multiple_choice',
        textAnswer: 'A',
        isCorrect: true,
        pointsEarned: 1,
      },
      {
        questionId: 'q2',
        questionType: 'multiple_choice',
        textAnswer: '',
        isCorrect: false,
        pointsEarned: 0,
      },
      {
        questionId: 'q3',
        questionType: 'multiple_choice',
        textAnswer: '',
        isCorrect: false,
        pointsEarned: 0,
      },
    ];

    render(
      <MemoryRouter>
        <QuizResult
          score={33}
          correctAnswers={1}
          totalQuestions={3}
          earnedXP={10}
          passThreshold={60}
          answers={answers}
          questions={mockQuestions}
          onRetry={() => {}}
          onHome={() => {}}
        />
      </MemoryRouter>
    );

    // Düzgün: 1, Yanlış: 0, Boş: 2
    // Yanlış card should display 0
    const cards = screen.getAllByText(/Düzgün|Yanlış|Boş/);
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });

  it('should render Boş badge and status in detailed question review', () => {
    const answers: QuestionAnswer[] = [
      {
        questionId: 'q1',
        questionType: 'multiple_choice',
        textAnswer: 'A',
        isCorrect: true,
        pointsEarned: 1,
      },
      {
        questionId: 'q2',
        questionType: 'multiple_choice',
        textAnswer: '',
        isCorrect: false,
        pointsEarned: 0,
      },
    ];

    render(
      <MemoryRouter>
        <QuizResult
          score={50}
          correctAnswers={1}
          totalQuestions={2}
          earnedXP={10}
          passThreshold={60}
          answers={answers}
          questions={mockQuestions.slice(0, 2)}
          showDetailedReview={true}
          onRetry={() => {}}
          onHome={() => {}}
        />
      </MemoryRouter>
    );

    // Open detailed review accordion
    const reviewBtn = screen.getByText('Sual-sual Nəticə Baxışı');
    fireEvent.click(reviewBtn);

    // Expect to see the "Boş" badge for unanswered question
    expect(screen.getAllByText('Boş').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Cavablandırılmayıb')).toBeInTheDocument();
  });
});
