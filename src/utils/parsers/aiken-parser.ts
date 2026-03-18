import { ParsedQuestion } from './types';

export const parseAiken = (content: string): ParsedQuestion[] => {
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
  const questions: ParsedQuestion[] = [];
  let currentQuestion: Partial<ParsedQuestion> = {
    question_type: 'multiple_choice',
    options: [],
    difficulty: 'orta',
  };

  const optionRegex = /^[A-Z][).]\s+(.+)$/;
  const answerRegex = /^ANSWER:\s+([A-Z])$/;
  const metadataRegex = /^([A-Z]+):\s+(.+)$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const optionMatch = line.match(optionRegex);
    const answerMatch = line.match(answerRegex);
    const metadataMatch = line.match(metadataRegex);

    if (optionMatch) {
      if (!Array.isArray(currentQuestion.options)) currentQuestion.options = [];
      (currentQuestion.options as string[]).push(optionMatch[1]);
    } else if (answerMatch) {
      const letter = answerMatch[1];
      const index = letter.charCodeAt(0) - 65;
      const options = currentQuestion.options as string[];
      if (options && options[index]) {
        currentQuestion.correct_answer = options[index];
      }
    } else if (
      metadataMatch &&
      ['CATEGORY', 'DIFFICULTY', 'EXPLANATION', 'TAGS', 'BLOOM'].includes(metadataMatch[1])
    ) {
      const key = metadataMatch[1].toLowerCase();
      const value = metadataMatch[2];
      if (key === 'category') currentQuestion.category = value;
      if (key === 'difficulty') currentQuestion.difficulty = value;
      if (key === 'explanation') currentQuestion.explanation = value;
      if (key === 'bloom') currentQuestion.bloom_level = value;
      if (key === 'tags') currentQuestion.tags = value.split(',').map(t => t.trim());
    } else {
      if (currentQuestion.question_text && currentQuestion.correct_answer) {
        questions.push(currentQuestion as ParsedQuestion);
        currentQuestion = {
          question_type: 'multiple_choice',
          options: [],
          difficulty: 'orta',
          question_text: line,
        };
      } else {
        currentQuestion.question_text = currentQuestion.question_text
          ? `${currentQuestion.question_text} ${line}`
          : line;
      }
    }
  }

  if (currentQuestion.question_text && currentQuestion.correct_answer) {
    questions.push(currentQuestion as ParsedQuestion);
  }

  return questions;
};
