import { ParsedQuestion } from './types';

/**
 * Faylı oxuyarkən BOM marker-ə görə encoding aşkar edir.
 */
export async function readFileWithEncoding(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // UTF-8 BOM: EF BB BF
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return new TextDecoder('utf-8').decode(buffer.slice(3));
  }
  // UTF-16 LE BOM: FF FE
  if (bytes[0] === 0xff && bytes[1] === 0xfe) {
    return new TextDecoder('utf-16le').decode(buffer.slice(2));
  }
  // UTF-16 BE BOM: FE FF
  if (bytes[0] === 0xfe && bytes[1] === 0xff) {
    return new TextDecoder('utf-16be').decode(buffer.slice(2));
  }

  // UTF-8 cəhdi
  const utf8Text = new TextDecoder('utf-8').decode(buffer);
  if (!utf8Text.includes('\uFFFD')) return utf8Text;

  // Legacy fallback: windows-1254 (Türk/Azərb. köhnə fayllar)
  try {
    return new TextDecoder('windows-1254').decode(buffer);
  } catch {
    return utf8Text;
  }
}

/**
 * Məzmuna görə formatı avtomatik aşkar edir.
 */
export function detectFormat(
  content: string,
): 'json' | 'csv' | 'aiken' | 'gift' | 'markdown' | 'moodle_xml' {
  const trimmed = content.trim();

  // Moodle XML
  if (trimmed.startsWith('<?xml') || trimmed.startsWith('<quiz')) return 'moodle_xml';

  // JSON
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) return 'json';

  // CSV
  const firstLine = trimmed.split('\n')[0].toLowerCase().replace(/"/g, '');
  if (
    (firstLine.includes('question_text') || firstLine.includes('question')) &&
    (firstLine.includes(',') || firstLine.includes(';'))
  )
    return 'csv';

  // GIFT
  if (/::.*?::/.test(trimmed) && /\{[^}]{1,500}\}/s.test(trimmed)) return 'gift';

  // Aiken
  if (/^ANSWER:\s+[A-Za-z\d]+$/m.test(content) && /^[A-Za-z\d][).]\s+/m.test(content))
    return 'aiken';

  return 'markdown';
}

/**
 * Markdown mətni daxilindəki şəkilləri avtomatik tanıyıb ayırır.
 */
export function extractMedia(target: Partial<ParsedQuestion>) {
  if (!target.question_text) return;
  
  // Look for ![alt](url) or just (url) if it looks like an image
  const imgRegex = /!\[.*?\]\((https?:\/\/[^\s)]+\.(?:png|jpg|jpeg|gif|webp|svg)(?:\?[^)]+)?)\)/i;
  const match = target.question_text.match(imgRegex);
  
  if (match) {
    if (!target.question_image_url) {
      target.question_image_url = match[1];
    }
    // Remove the markdown image from the text to clean up
    target.question_text = target.question_text.replace(match[0], '').trim();
  }
}

/**
 * Metadata satırlarını oxuyur.
 */
export function extractMetadata(lines: string[], target: Partial<ParsedQuestion>) {
  for (const line of lines) {
    const clean = line.trim();
    const metaMatch = clean.match(
      /^(İzahat\s*\(?[A-Z\d]\)?|Izahat\s*\(?[A-Z\d]\)?|Explanation\s*\(?[A-Z\d]\)?|Açıqlama\s*\(?[A-Z\d]\)?|İzahat|Izahat|Explanation|Açıqlama|Kateqoriya|Category|Çətinlik|Difficulty|Bloom|Taqlar|Tags|ANSWER|Düzgün cavab|Doğru cavab|Düzgün|Cavab|Doğru|Tolerans|Tolerance|Dil|Language)\s*[-:]?\s*(.+)$/i,
    );
    if (!metaMatch) continue;
    const keyRaw = metaMatch[1];
    const key = keyRaw.toLowerCase();
    const value = metaMatch[2].trim();

    // Check for per-option explanation: "İzahat A", "İzahat (B)", etc.
    const perOptMatch = keyRaw.match(/^(?:İzahat|Izahat|Explanation|Açıqlama)\s*\(?([A-Z\d])\)?$/i);
    if (perOptMatch) {
      const optionRef = perOptMatch[1].toUpperCase();
      let indexKey = '';
      if (/^[A-Z]$/.test(optionRef)) {
        indexKey = (optionRef.charCodeAt(0) - 65).toString();
      } else if (/^\d+$/.test(optionRef)) {
        indexKey = (parseInt(optionRef, 10) - 1).toString();
      }

      if (indexKey) {
        if (!target.per_option_explanations) target.per_option_explanations = {};
        target.per_option_explanations[indexKey] = value;
        continue;
      }
    }

    if (['izahat', 'açıqlama', 'explanation'].includes(key)) {
      target.explanation = value;
    } else if (['kateqoriya', 'category'].includes(key)) {
      target.category = value;
    } else if (['çətinlik', 'difficulty'].includes(key)) {
      target.difficulty = value.toLowerCase();
    } else if (key === 'bloom') {
      target.bloom_level = value.toLowerCase();
    } else if (['taqlar', 'tags'].includes(key)) {
      target.tags = value
        .split(/[,;]/)
        .map(t => t.trim())
        .filter(Boolean);
    } else if (['tolerans', 'tolerance'].includes(key)) {
      const tol = parseFloat(value);
      if (!isNaN(tol)) target.numerical_tolerance = tol;
    } else if (['dil', 'language'].includes(key)) {
      target.hint = `lang:${value.toLowerCase()}`;
    } else if (['answer', 'düzgün', 'cavab', 'doğru', 'doğru cavab', 'düzgün cavab'].includes(key)) {
      // Matching suallarında Cavab dəyərini `,` və ya `;` ilə kəsmirik
      if (target.question_type === 'matching') {
        target.correct_answer = value;
        continue;
      }

      const values = value.split(/[,;]/).map(v => v.trim()).filter(Boolean);
      const opts = target.options as string[] | null;
      
      if (values.length > 1 && target.question_type !== 'matching') {
        target.question_type = 'multiple_select';
      }

      const answers: string[] = [];

      for (const val of values) {
        if (Array.isArray(opts)) {
          if (opts.includes(val)) {
            answers.push(val);
          } else {
            let idx = -1;
            if (/^[A-Za-z]$/.test(val)) {
              idx = val.toUpperCase().charCodeAt(0) - 65;
            } else if (/^\d+$/.test(val)) {
              idx = parseInt(val, 10) - 1;
            }

            if (idx >= 0 && opts[idx]) {
              answers.push(opts[idx]);
            } else if (!target.correct_answer) {
              answers.push(val);
            }
          }
        } else {
          answers.push(val);
        }
      }

      if (answers.length > 0) {
        target.correct_answer = target.question_type === 'multiple_select' 
          ? answers.join(',') 
          : answers[0];
      }
    }
  }

  // Final step: attempt to extract media from question_text if not already set
  extractMedia(target);
}
