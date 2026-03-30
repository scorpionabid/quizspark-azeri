import { ParseResult } from './types';
import { parseSingleBlock, parseMarkdownSeparated } from './markdown-block-parser';
import { parseMarkdownFormat1, parseMarkdownFormat2 } from './markdown-format-parsers';

export { parseSingleBlock, parseMarkdownSeparated };

/**
 * Əsas Markdown parser — formatı avtomatik aşkarlayır və uyğun alt-parseri çağırır.
 *
 * Prioritet sırası:
 *   1. `---` ayrıcıları varsa → parseMarkdownSeparated
 *   2. `# Sual` formatı → parseMarkdownFormat1
 *   3. `1. Sual` formatı → parseMarkdownFormat2
 *   4. Tək blok → parseSingleBlock
 */
export const parseMarkdownFull = (content: string): ParseResult => {
  const horizontalRule = /^(?:---+|===+|___+|\*\*\*+|⸻+|—+)\s*$/m;
  if (horizontalRule.test(content)) {
    const result = parseMarkdownSeparated(content);
    if (result.questions.length > 0) return result;
  }

  if (/^#\s+.+/m.test(content)) {
    return parseMarkdownFormat1(content);
  }

  if (/^\d+[.):]\s+/m.test(content)) {
    const result = parseMarkdownFormat2(content);
    if (result.questions.length > 0) return result;
  }

  const singleResult = parseSingleBlock(content, 0);
  if (singleResult.questions.length > 0) return singleResult;

  return { questions: [], warnings: [] };
};
