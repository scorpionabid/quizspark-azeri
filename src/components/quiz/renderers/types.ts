import { Question } from '@/hooks/useQuestions';

export interface RendererProps {
  question: Question;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  showFeedback?: boolean;
}
