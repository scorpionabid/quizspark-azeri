import { ParsedQuestion, ParseResult } from './parsers/types';
import { readFileWithEncoding, detectFormat } from './parsers/parser-utils';
import { parseAiken } from './parsers/aiken-parser';
import { parseGIFT } from './parsers/gift-parser';
import { parseMarkdownFull } from './parsers/markdown-parser';

export * from './parsers/types';
export { readFileWithEncoding, detectFormat };
export { parseAiken, parseGIFT };
export { parseMarkdownFull };
export { parseJsonImport } from './parsers/json-parser';
export { parseCsvImport, parseCsvLine } from './parsers/csv-parser';

/**
 * Legacy wrapper — köhnə kodla uyğunluq üçün.
 */
export const parseMarkdown = (content: string): ParsedQuestion[] => {
  return parseMarkdownFull(content).questions;
};

/**
 * Ümumi parse funksiyası — formatı avtomatik təyin edir və müvafiq parseri çağırır.
 */
export const parseContent = (content: string, format?: string): ParseResult => {
  const detectedFormat = format || detectFormat(content);
  
  switch (detectedFormat) {
    case 'aiken':
      return { questions: parseAiken(content), warnings: [] };
    case 'gift':
      return { questions: parseGIFT(content), warnings: [] };
    case 'markdown':
      return parseMarkdownFull(content);
    default:
      return { questions: [], warnings: [] };
  }
};
