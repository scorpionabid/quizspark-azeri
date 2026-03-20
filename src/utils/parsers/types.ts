import { QuestionBankItem } from '@/hooks/useQuestionBank';

export type ParsedQuestion = Omit<QuestionBankItem, 'id' | 'created_at' | 'updated_at'>;

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
