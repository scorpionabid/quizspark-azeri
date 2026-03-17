import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImportPreviewTable } from '../ImportPreviewTable';
import { TooltipProvider } from '@/components/ui/tooltip';
import '@testing-library/jest-dom';

const mockQuestions = [
  {
    id: '1',
    question_text: 'Sual 1',
    question_type: 'multiple_choice',
    options: ['Var 1', 'Var 2'],
    correct_answer: 'Var 1',
    difficulty: 'orta' as const,
  }
];

describe('ImportPreviewTable', () => {
  it('should render questions correctly', () => {
    render(
      <TooltipProvider>
        <ImportPreviewTable questions={mockQuestions} onChange={() => {}} />
      </TooltipProvider>
    );
    expect(screen.getByTestId('question-text-0')).toHaveTextContent('Sual 1');
    expect(screen.getByText('Var 1')).toBeInTheDocument();
  });

  it('should enter edit mode when pencil is clicked', () => {
    render(
      <TooltipProvider>
        <ImportPreviewTable questions={mockQuestions} onChange={() => {}} />
      </TooltipProvider>
    );
    
    const editBtn = screen.getAllByRole('button').find(b => 
      b.innerHTML.includes('lucide-pencil') || b.getAttribute('data-state') === 'closed'
    );
    if (editBtn) fireEvent.click(editBtn);
    
    expect(screen.getByPlaceholderText('Sual mətni')).toBeInTheDocument();
  });

  it('should show warning icon when question is invalid', () => {
    const invalidQuestions = [{ ...mockQuestions[0], correct_answer: '' }];
    render(
      <TooltipProvider>
        <ImportPreviewTable questions={invalidQuestions} onChange={() => {}} />
      </TooltipProvider>
    );
    
    expect(screen.getByTestId('warning-icon-0')).toBeInTheDocument();
  });
});
