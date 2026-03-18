import { QuestionBankItem } from '@/hooks/useQuestionBank';

export type ParsedQuestion = Omit<QuestionBankItem, 'id' | 'created_at' | 'updated_at'>;

export interface ParseWarning {
  line: number;
  type: 'missing_answer' | 'no_options' | 'empty_question';
  message: string;
}

export interface ParseResult {
  questions: ParsedQuestion[];
  warnings: ParseWarning[];
}
