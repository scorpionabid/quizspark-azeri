import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AssessmentSpecificationCard } from '../AssessmentSpecificationCard';
import {
  getQuestionTypeLabelAz,
  normalizeDifficultyLevel,
  normalizeMatchingPairs,
  isOpenEndedQuestionType,
  getDefaultAnswerLines,
} from '@/utils/assessmentSpec';

describe('assessmentSpec utils', () => {
  it('maps question types to Azerbaijani labels', () => {
    expect(getQuestionTypeLabelAz('multiple_choice')).toBe('Çoxseçimli (Qapalı)');
    expect(getQuestionTypeLabelAz('short_answer')).toBe('Qısa cavab (Açıq)');
    expect(getQuestionTypeLabelAz('matching')).toBe('Uyğunlaşdırma');
    expect(getQuestionTypeLabelAz(null)).toBe('Sual');
  });

  it('normalizes difficulty strings into canonical I–IV levels', () => {
    expect(normalizeDifficultyLevel('easy')).toBe('I');
    expect(normalizeDifficultyLevel('I səviyyə')).toBe('I');
    expect(normalizeDifficultyLevel('medium')).toBe('II');
    expect(normalizeDifficultyLevel('3')).toBe('III');
    expect(normalizeDifficultyLevel('IV')).toBe('IV');
    expect(normalizeDifficultyLevel('remembering')).toBe('I');
    expect(normalizeDifficultyLevel('applying')).toBe('II');
    expect(normalizeDifficultyLevel('analyzing')).toBe('III');
    expect(normalizeDifficultyLevel('evaluating')).toBe('IV');
    expect(normalizeDifficultyLevel(undefined)).toBeNull();
  });

  it('identifies open-ended question types and default writing lines', () => {
    expect(isOpenEndedQuestionType('short_answer')).toBe(true);
    expect(isOpenEndedQuestionType('essay')).toBe(true);
    expect(isOpenEndedQuestionType('numerical')).toBe(true);
    expect(isOpenEndedQuestionType('multiple_choice')).toBe(false);
    expect(getDefaultAnswerLines('essay')).toBe(6);
    expect(getDefaultAnswerLines('short_answer')).toBe(3);
    expect(getDefaultAnswerLines('numerical')).toBe(2);
  });

  it('normalizes matching pairs from both array and object formats', () => {
    expect(normalizeMatchingPairs([{ left: 'A', right: '1' }])).toEqual([
      { left: 'A', right: '1' },
    ]);
    expect(normalizeMatchingPairs({ Bakı: 'Azərbaycan', Ankara: 'Türkiyə' })).toEqual([
      { left: 'Bakı', right: 'Azərbaycan' },
      { left: 'Ankara', right: 'Türkiyə' },
    ]);
    expect(normalizeMatchingPairs(null)).toEqual([]);
  });
});

describe('AssessmentSpecificationCard', () => {
  it('groups by I–IV difficulty levels when level metadata exists', () => {
    render(
      <AssessmentSpecificationCard
        questions={[
          { question_type: 'multiple_choice', level: 'I', weight: 20 },
          { question_type: 'multiple_choice', level: 'II', weight: 30 },
          { question_type: 'short_answer', level: 'III', weight: 30 },
          { question_type: 'essay', level: 'IV', weight: 20 },
        ]}
      />
    );

    expect(screen.getByText('I səviyyə (Asan)')).toBeInTheDocument();
    expect(screen.getByText('II səviyyə (Orta)')).toBeInTheDocument();
    expect(screen.getByText('III səviyyə (Yüksək)')).toBeInTheDocument();
    expect(screen.getByText('IV səviyyə (Çətin)')).toBeInTheDocument();
    expect(screen.getByText('4 sual · 100 bal')).toBeInTheDocument();
    expect(screen.getByText('Cəmi')).toBeInTheDocument();
  });

  it('falls back to grouping by question type when levels are absent', () => {
    render(
      <AssessmentSpecificationCard
        questions={[
          { question_type: 'multiple_choice', weight: 5 },
          { question_type: 'multiple_choice', weight: 5 },
          { question_type: 'short_answer', weight: 10 },
        ]}
      />
    );

    expect(screen.getByText('Çoxseçimli (Qapalı)')).toBeInTheDocument();
    expect(screen.getByText('Qısa cavab (Açıq)')).toBeInTheDocument();
    expect(screen.getByText('3 sual · 20 bal')).toBeInTheDocument();
  });

  it('returns null when question list is empty', () => {
    const { container } = render(<AssessmentSpecificationCard questions={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
