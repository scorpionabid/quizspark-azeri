import { ParseResult } from './types';
import {
  parseSingleBlock,
  parseMarkdownSeparated,
  parseMarkdownOneLinePerQuestion,
} from './markdown-block-parser';
import { parseMarkdownFormat1, parseMarkdownFormat2 } from './markdown-format-parsers';

export { parseSingleBlock, parseMarkdownSeparated };

/**
 * Əsas Markdown parser — formatı avtomatik aşkarlayır və uyğun alt-parseri çağırır.
 *
 * Prioritet sırası:
 *   1. `---` ayrıcıları varsa → parseMarkdownSeparated
 *   2. `# Sual` formatı (H1) → parseMarkdownFormat1
 *   3. `1. Sual` formatı → parseMarkdownFormat2
 *   4. "Bir sətir = bir sual" heuristic → parseMarkdownOneLinePerQuestion
 *   5. Tək blok → parseSingleBlock
 */
export const parseMarkdownFull = (content: string): ParseResult => {
  const horizontalRule = /^(?:---+|===+|___+|\*\*\*+|⸻+|—+)\s*$/m;
  if (horizontalRule.test(content)) {
    const result = parseMarkdownSeparated(content);
    if (result.questions.length > 0) return result;
  }

  // H1 başlıq — Format1
  if (/^#\s+.+/m.test(content)) {
    return parseMarkdownFormat1(content);
  }

  // Numbered suallar — Format2
  if (/^\d+[.):]\s+/m.test(content)) {
    const result = parseMarkdownFormat2(content);
    if (result.questions.length > 0) return result;
  }

  // "Bir sətir = bir sual" heuristic:
  // Sətirlərin >25%-i inline cavab keyword-u ehtiva edirsə, one-line parser istifadə et.
  const nonEmptyLines = content.split('\n').filter(l => l.trim()).length;
  if (nonEmptyLines > 0) {
    const inlineAnswerCount = (
      content.match(/\b(Düzgün cavab|Doğru cavab|Cavab|ANSWER)\s*:/gi) ?? []
    ).length;
    const ratio = inlineAnswerCount / nonEmptyLines;

    // Ən azı 2 sual VƏ >25% sətirdə cavab keyword-u inline varsa
    if (inlineAnswerCount >= 2 && ratio > 0.25) {
      const result = parseMarkdownOneLinePerQuestion(content);
      if (result.questions.length > 0) return result;
    }
  }

  const singleResult = parseSingleBlock(content, 0);
  if (singleResult.questions.length > 0) return singleResult;

  return { questions: [], warnings: [] };
};
