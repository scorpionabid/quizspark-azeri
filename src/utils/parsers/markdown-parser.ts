import { ParsedQuestion, ParseResult } from './types';
import {
  parseSingleBlock,
  parseMarkdownSeparated,
  parseMarkdownOneLinePerQuestion,
} from './markdown-block-parser';
import { parseMarkdownFormat1, parseMarkdownFormat2 } from './markdown-format-parsers';
import { extractMetadata } from './parser-utils';
import { buildMetaRE } from './markdown-utils';

export { parseSingleBlock, parseMarkdownSeparated };

/**
 * Faylın əvvəlindəki `--- ... ---` YAML/metadata başlığını oxuyur.
 * Yalnız bütün sətirlər metadata açar sözləri olduqda frontmatter kimi qəbul edir.
 */
function extractFileFrontmatter(rawContent: string): {
  defaults: Partial<ParsedQuestion>;
  body: string;
} {
  const trimmed = rawContent.trimStart();
  const fmMatch = trimmed.match(/^---\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);
  if (!fmMatch) return { defaults: {}, body: rawContent };

  const headerLines = fmMatch[1]
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));

  if (headerLines.length === 0) return { defaults: {}, body: rawContent };

  const metaRe = buildMetaRE();
  const allMeta = headerLines.every((l) => metaRe.test(l));
  if (!allMeta) return { defaults: {}, body: rawContent };

  const defaults: Partial<ParsedQuestion> = {};
  extractMetadata(headerLines, defaults);
  const body = trimmed.slice(fmMatch[0].length);
  return { defaults, body };
}

function applyFileDefaults(result: ParseResult, defaults: Partial<ParsedQuestion>): ParseResult {
  if (Object.keys(defaults).length === 0) return result;
  return {
    ...result,
    questions: result.questions.map((q) => ({
      ...q,
      subject: q.subject ?? defaults.subject ?? null,
      grade: q.grade ?? defaults.grade ?? null,
      topic: q.topic ?? defaults.topic ?? null,
      category: q.category ?? defaults.category ?? defaults.topic ?? null,
      curriculum_standard: q.curriculum_standard ?? defaults.curriculum_standard ?? null,
      difficulty_level: q.difficulty_level ?? defaults.difficulty_level ?? null,
      difficulty: q.difficulty ?? defaults.difficulty ?? 'orta',
      weight: q.weight ?? defaults.weight ?? null,
      bloom_level: q.bloom_level ?? defaults.bloom_level ?? null,
    })),
  };
}

/**
 * Əsas Markdown parser — formatı avtomatik aşkarlayır və uyğun alt-parseri çağırır.
 */
export const parseMarkdownFull = (rawContent: string): ParseResult => {
  const { defaults, body: content } = extractFileFrontmatter(rawContent);

  const horizontalRule = /^(?:---+|===+|___+|\*\*\*+|⸻+|—+)\s*$/m;
  if (horizontalRule.test(content)) {
    const result = parseMarkdownSeparated(content);
    if (result.questions.length > 0) return applyFileDefaults(result, defaults);
  }

  // H1 başlıq — Format1
  if (/^#\s+.+/m.test(content)) {
    return applyFileDefaults(parseMarkdownFormat1(content), defaults);
  }

  // Numbered suallar — Format2
  if (/^\d+[.):]\s+/m.test(content)) {
    const result = parseMarkdownFormat2(content);
    if (result.questions.length > 0) return applyFileDefaults(result, defaults);
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
      if (result.questions.length > 0) return applyFileDefaults(result, defaults);
    }
  }

  const singleResult = parseSingleBlock(content, 0);
  if (singleResult.questions.length > 0) return applyFileDefaults(singleResult, defaults);

  return { questions: [], warnings: [] };
};
