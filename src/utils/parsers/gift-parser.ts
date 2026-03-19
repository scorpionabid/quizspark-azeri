import { ParsedQuestion } from './types';

export const parseGIFT = (content: string): ParsedQuestion[] => {
  const questionBlocks = content.split(/\n\s*\n/).filter(Boolean);
  const questions: ParsedQuestion[] = [];

  for (const block of questionBlocks) {
    if (block.startsWith('//') || block.startsWith('$')) continue;

    const nameMatch = block.match(/^::(.*?)::/);
    const name = nameMatch ? nameMatch[1] : '';
    const textAndAns = block.replace(/^::.*?::/, '').trim();

    const ansMatch = textAndAns.match(/\{(.*?)\}/s);
    if (!ansMatch) continue;

    const questionText = textAndAns.replace(/\{.*?\}/s, '').trim();
    const answerContent = ansMatch[1].trim();

    const result: Partial<ParsedQuestion> = {
      question_text: questionText,
      question_type: 'multiple_choice',
      difficulty: 'orta',
      title: name || null,
    };

    if (answerContent.includes('~') || answerContent.includes('=')) {
      const parts = answerContent.split(/([~=])/).filter(Boolean);
      const options: string[] = [];
      let correctAnswer = '';

      for (let i = 0; i < parts.length; i += 2) {
        const marker = parts[i];
        const valWithFeedback = parts[i + 1]?.trim() || '';
        const val = valWithFeedback.split('#')[0].trim();
        const feedback = valWithFeedback.split('#')[1]?.trim();
        if (val) {
          const optionIndex = options.length;
          options.push(val);
          if (marker === '=') {
            correctAnswer = val;
            if (feedback) result.explanation = feedback;
          }
          if (feedback) {
            if (!result.per_option_explanations) result.per_option_explanations = {};
            result.per_option_explanations[optionIndex.toString()] = feedback;
          }
        }
      }
      result.options = options;
      result.correct_answer = correctAnswer;
    } else if (
      answerContent.toLowerCase() === 't' ||
      answerContent.toLowerCase() === 'true'
    ) {
      result.question_type = 'true_false';
      result.options = ['Doğru', 'Yanlış'];
      result.correct_answer = 'Doğru';
    } else if (
      answerContent.toLowerCase() === 'f' ||
      answerContent.toLowerCase() === 'false'
    ) {
      result.question_type = 'true_false';
      result.options = ['Doğru', 'Yanlış'];
      result.correct_answer = 'Yanlış';
    } else {
      result.question_type = 'short_answer';
      result.correct_answer = answerContent.split('#')[0].trim();
      result.explanation = answerContent.split('#')[1]?.trim() || null;
    }

    if (result.question_text && result.correct_answer) {
      questions.push(result as ParsedQuestion);
    }
  }

  return questions;
};
