import { QuestionBankItem } from '@/hooks/useQuestionBank';

export type ParsedQuestion = Omit<QuestionBankItem, 'id' | 'created_at' | 'updated_at'>;

/**
 * Aiken format parser (Extended to support metadata)
 */
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

            // Question is "finished" in standard Aiken, but we check for metadata in next lines
            // We'll collect metadata until we hit a line that doesn't look like metadata or end of file
        } else if (metadataMatch && ['CATEGORY', 'DIFFICULTY', 'EXPLANATION', 'TAGS', 'BLOOM'].includes(metadataMatch[1])) {
            const key = metadataMatch[1].toLowerCase();
            const value = metadataMatch[2];
            if (key === 'category') currentQuestion.category = value;
            if (key === 'difficulty') currentQuestion.difficulty = value;
            if (key === 'explanation') currentQuestion.explanation = value;
            if (key === 'bloom') currentQuestion.bloom_level = value;
            if (key === 'tags') currentQuestion.tags = value.split(',').map(t => t.trim());
        } else {
            // If we already have a question started and this line isn't metadata/option/answer, 
            // it's either a new question starting or additional text for current question
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

/**
 * GIFT format parser (Basic implementation)
 */
export const parseGIFT = (content: string): ParsedQuestion[] => {
    // Simple regex-based approach for common GIFT patterns
    const questionBlocks = content.split(/\n\s*\n/).filter(Boolean);
    const questions: ParsedQuestion[] = [];

    for (const block of questionBlocks) {
        if (block.startsWith('//') || block.startsWith('$')) {
            // Handle comments or category setup if needed
            continue;
        }

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
            // Multiple choice or True/False
            const parts = answerContent.split(/([~=])/).filter(Boolean);
            const options: string[] = [];
            let correctAnswer = '';

            for (let i = 0; i < parts.length; i += 2) {
                const marker = parts[i];
                const valWithFeedback = parts[i + 1]?.trim() || '';
                const val = valWithFeedback.split('#')[0].trim();
                const feedback = valWithFeedback.split('#')[1]?.trim();

                if (val) {
                    options.push(val);
                    if (marker === '=') {
                        correctAnswer = val;
                        if (feedback) result.explanation = feedback;
                    }
                }
            }

            result.options = options;
            result.correct_answer = correctAnswer;
        } else if (answerContent.toLowerCase() === 't' || answerContent.toLowerCase() === 'true') {
            result.question_type = 'true_false';
            result.options = ['Doğru', 'Yanlış'];
            result.correct_answer = 'Doğru';
        } else if (answerContent.toLowerCase() === 'f' || answerContent.toLowerCase() === 'false') {
            result.question_type = 'true_false';
            result.options = ['Doğru', 'Yanlış'];
            result.correct_answer = 'Yanlış';
        } else {
            // Short answer
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

/**
 * Markdown format parser
 */
export const parseMarkdown = (content: string): ParsedQuestion[] => {
    const questions: ParsedQuestion[] = [];
    const blocks = content.split(/^#\s+/m).filter(Boolean);

    for (const block of blocks) {
        const lines = block.split('\n');
        const questionText = lines[0].trim();
        const rest = lines.slice(1).join('\n');

        const result: Partial<ParsedQuestion> = {
            question_text: questionText,
            question_type: 'multiple_choice',
            difficulty: 'orta',
            options: [],
        };

        // Extract options: - [x] Correct or - [ ] Incorrect
        const optionMatches = [...rest.matchAll(/^[-*]\s*\[([ xX])\]\s*(.+)$/gm)];
        for (const match of optionMatches) {
            const isCorrect = match[1].toLowerCase() === 'x';
            const text = match[2].trim();
            (result.options as string[]).push(text);
            if (isCorrect) result.correct_answer = text;
        }

        // Extract metadata
        const explanationMatch = rest.match(/Izahat:\s*(.+)$/m) || rest.match(/Explanation:\s*(.+)$/m);
        if (explanationMatch) result.explanation = explanationMatch[1].trim();

        const categoryMatch = rest.match(/Kateqoriya:\s*(.+)$/m) || rest.match(/Category:\s*(.+)$/m);
        if (categoryMatch) result.category = categoryMatch[1].trim();

        const difficultyMatch = rest.match(/Çətinlik:\s*(.+)$/m) || rest.match(/Difficulty:\s*(.+)$/m);
        if (difficultyMatch) result.difficulty = difficultyMatch[1].trim().toLowerCase();

        const bloomMatch = rest.match(/Bloom:\s*(.+)$/m);
        if (bloomMatch) result.bloom_level = bloomMatch[1].trim().toLowerCase();

        const tagsMatch = rest.match(/Taqlar:\s*(.+)$/m) || rest.match(/Tags:\s*(.+)$/m);
        if (tagsMatch) result.tags = tagsMatch[1].split(',').map(t => t.trim());

        if (result.question_text && result.correct_answer) {
            questions.push(result as ParsedQuestion);
        }
    }

    return questions;
};
