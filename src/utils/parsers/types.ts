import { QuestionBankItem } from '@/hooks/useQuestionBank';

export type ParsedQuestion = Omit<QuestionBankItem, 'id' | 'created_at' | 'updated_at'>;

export interface PreviewQuestion {
  question_text: string;
  question_type: string;
  options: string[] | Record<string, string> | null;
  correct_answer: string;
  explanation?: string;
  category?: string;
  difficulty?: string;
  bloom_level?: string;
  tags?: string[];
  title?: string;
  matching_pairs?: Record<string, string> | null;
  sequence_items?: string[] | null;
  fill_blank_template?: string | null;
  numerical_answer?: number | null;
  numerical_tolerance?: number | null;
  hint?: string | null;
  per_option_explanations?: Record<string, string> | null;
  potential_duplicate?: boolean;
}

export interface ParseWarning {
  line: number;
  type: 
    | 'missing_answer' 
    | 'no_options' 
    | 'empty_question' 
    | 'duplicate_option' 
    | 'invalid_format' 
    | 'invalid_correct_answer'
    | 'missing_question_text';
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ParseResult {
  questions: ParsedQuestion[];
  warnings: ParseWarning[];
}
