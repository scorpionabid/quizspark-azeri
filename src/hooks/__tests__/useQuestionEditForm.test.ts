import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQuestionEditForm } from '../useQuestionEditForm';
import { QuestionBankItem } from '@/hooks/useQuestionBank';

vi.mock('@/hooks/useEnhanceQuestion', () => ({
  useEnhanceQuestion: () => ({ enhanceQuestion: vi.fn(), isEnhancing: false }),
}));

vi.mock('@/hooks/useQuestionImageUpload', () => ({
  useQuestionImageUpload: () => ({ uploadImage: vi.fn(), isUploading: false }),
}));

vi.mock('@/hooks/useQuestion3DUpload', () => ({
  useQuestion3DUpload: () => ({ upload3DModel: vi.fn(), isUploading: false }),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('useQuestionEditForm', () => {
  it('should initialize multiple_select correctly from correct_option_indices in edit mode', () => {
    const question: Partial<QuestionBankItem> = {
      id: 'q1',
      question_text: 'Hansılar doğrudur?',
      question_type: 'multiple_select',
      options: ['Variant A', 'Variant B', 'Variant C', 'Variant D'],
      correct_answer: 'Variant A, Variant C',
      correct_option_indices: [0, 2],
    };

    const onSave = vi.fn();
    const onClose = vi.fn();

    const { result } = renderHook(() =>
      useQuestionEditForm(question as QuestionBankItem, 'edit', onSave, onClose)
    );

    // Initial correct_answer should be formatted as letters A,C
    expect(result.current.formData.correct_answer).toBe('A,C');
    expect(result.current.formData.options).toEqual(['Variant A', 'Variant B', 'Variant C', 'Variant D']);
  });

  it('should compute correct_option_indices on submit for multiple_select', () => {
    const question: Partial<QuestionBankItem> = {
      id: 'q2',
      question_text: 'Sual mətni',
      question_type: 'multiple_select',
      options: ['Birinci', 'İkinci', 'Üçüncü', 'Dördüncü'],
      correct_answer: 'A,C',
      correct_option_indices: [0, 2],
    };

    const onSave = vi.fn();
    const onClose = vi.fn();

    const { result } = renderHook(() =>
      useQuestionEditForm(question as QuestionBankItem, 'edit', onSave, onClose)
    );

    act(() => {
      // Change correct answer to B, D
      result.current.setFormData(prev => ({ ...prev, correct_answer: 'B,D' }));
    });

    let success = false;
    act(() => {
      success = result.current.handleSubmit();
    });

    expect(success).toBe(true);
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        correct_answer: 'B,D',
        correct_option_indices: [1, 3],
      })
    );
  });

  it('should fail validation when required question_text is missing', () => {
    const onSave = vi.fn();
    const onClose = vi.fn();

    const { result } = renderHook(() =>
      useQuestionEditForm(null, 'create', onSave, onClose)
    );

    let success = true;
    act(() => {
      success = result.current.handleSubmit();
    });

    expect(success).toBe(false);
    expect(result.current.validationErrors.question_text).toBeDefined();
    expect(onSave).not.toHaveBeenCalled();
  });
});
