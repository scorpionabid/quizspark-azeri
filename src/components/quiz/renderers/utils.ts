import { Question } from '@/hooks/useQuestions';

export function normalizePairs(
  pairs: Record<string, string> | null,
): Record<string, string> {
  if (!pairs) return {};
  if (Array.isArray(pairs)) {
    return Object.fromEntries(
      (pairs as unknown as Array<{ left: string; right: string }>).map(p => [
        p.left,
        p.right,
      ]),
    );
  }
  return pairs;
}

export function parseMatchingValue(
  value: string,
  matchingPairs?: Record<string, string> | null,
): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  if (!value) return result;

  // Case 1: Standard serialized format "Left1:Right1|||Left2:Right2"
  if (value.includes(':') && (value.includes('|||') || !value.includes(';'))) {
    value.split('|||').forEach(m => {
      const colonIdx = m.indexOf(':');
      if (colonIdx > -1) {
        const left = m.slice(0, colonIdx).trim();
        const right = m.slice(colonIdx + 1).trim();
        result[left] = right.split(',').map(r => r.trim()).filter(Boolean);
      }
    });
    if (Object.keys(result).length > 0) return result;
  }

  // Case 2: Shorthand notation like "1-c; 2-a; 3-b" or "1:c; 2:a" or "1-a,c; 2-b,d,e" or "1-a,b, 2-c"
  const pairsRecord = matchingPairs ? normalizePairs(matchingPairs) : {};
  const leftKeys = Object.keys(pairsRecord);
  const segments = value.split(/;\s*|,\s*(?=\d+\s*[-–:])/).map(s => s.trim()).filter(Boolean);
  let matchedAny = false;
  for (const seg of segments) {
    const m = seg.match(/^(\d+|[^\-–:;]+)\s*[-–:]\s*(.+)$/);
    if (m) {
      let leftKey = m[1].trim();
      const rightVal = m[2].trim();
      if (/^\d+$/.test(leftKey) && leftKeys.length > 0) {
        const idx = parseInt(leftKey, 10) - 1;
        if (leftKeys[idx]) {
          leftKey = leftKeys[idx];
        }
      }
      result[leftKey] = rightVal.split(',').map(r => r.trim()).filter(Boolean);
      matchedAny = true;
    }
  }
  if (matchedAny) return result;

  // Case 3: If matchingPairs itself is provided and has { left: right }
  if (matchingPairs && Object.keys(result).length === 0) {
    const pairsRecord = normalizePairs(matchingPairs);
    for (const [left, right] of Object.entries(pairsRecord)) {
      result[left] = right.split(',').map(r => r.trim()).filter(Boolean);
    }
  }

  return result;
}

export interface NumberedItem {
  num: number;
  text: string;
}

export interface ParsedNumberedQuestion {
  header: string;
  items: NumberedItem[];
}

export function parseNumberedItems(text?: string | null): ParsedNumberedQuestion | null {
  if (!text) return null;
  // If text contains markdown table syntax, do not split as numbered items
  if (text.includes('| :---') || text.includes('|:---') || text.includes('| --- |')) {
    return null;
  }

  const lines = text.split('\n');
  const headerLines: string[] = [];
  const items: NumberedItem[] = [];

  const itemRe = /^\s*([1-9]\d?)\s*[.)]\s*(.+)$/;
  let inItems = false;

  for (const line of lines) {
    const stripped = line.trim();
    const match = stripped.match(itemRe);
    if (match) {
      inItems = true;
      items.push({
        num: parseInt(match[1], 10),
        text: match[2].trim(),
      });
    } else {
      if (inItems && stripped) {
        if (items.length > 0) {
          items[items.length - 1].text += '\n' + stripped;
        }
      } else if (!inItems) {
        headerLines.push(line);
      }
    }
  }

  if (items.length >= 2) {
    return {
      header: headerLines.join('\n').trim(),
      items,
    };
  }

  return null;
}

export function isSequenceQuestion(text?: string | null): boolean {
  if (!text) return false;
  const t = text.toLowerCase();
  return (t.includes('ardıcıl') || t.includes('xronoloji')) && !t.includes('sxemi tamamlayın');
}

export function isAnswerCorrect(question: Question, value: string): boolean {
  if (!value && value !== '0') return false;
  const qt = question.question_type;

  if (qt === 'essay' || qt === 'code') {
    return false;
  }

  if (qt === 'multiple_choice') {
    const ca = (question.correct_answer || '').trim();
    const val = value.trim();

    // 1. Direct match
    if (ca.toLowerCase() === val.toLowerCase()) return true;

    // 2. Single letter match
    if (ca.length === 1 && /^[A-Z]$/i.test(ca) && question.options) {
      const idx = ca.toUpperCase().charCodeAt(0) - 65;
      if (question.options[idx] && question.options[idx].trim().toLowerCase() === val.toLowerCase()) {
        return true;
      }
    }

    // 3. Cross-language index match
    const getOptionIndex = (str: string): number => {
      const clean = str.trim().toLowerCase();
      if (question.options) {
        const i = question.options.findIndex(o => o.trim().toLowerCase() === clean);
        if (i !== -1) return i;
      }
      if (question.base_options) {
        const i = question.base_options.findIndex(o => o.trim().toLowerCase() === clean);
        if (i !== -1) return i;
      }
      if (question.translation_options) {
        const i = question.translation_options.findIndex(o => o.trim().toLowerCase() === clean);
        if (i !== -1) return i;
      }
      return -1;
    };

    const valIdx = getOptionIndex(val);
    const caIdx = getOptionIndex(ca);
    if (valIdx !== -1 && caIdx !== -1 && valIdx === caIdx) {
      return true;
    }

    return false;
  }

  if (qt === 'numerical') {
    const rawVal = String(value || '').trim();
    const rawCorrect = String(question.correct_answer || question.numerical_answer || '').trim();
    if (!rawVal || !rawCorrect) return false;

    // Check if this numerical question has multi-item numbered choices
    const parsedNumbered = parseNumberedItems(question.question_text);
    if (parsedNumbered && parsedNumbered.items.length >= 2) {
      const cleanVal = rawVal.replace(/\D/g, '');
      const cleanCorrect = rawCorrect.replace(/\D/g, '');
      const isSeq = isSequenceQuestion(question.question_text);

      if (isSeq) {
        if (cleanVal === cleanCorrect) return true;
      } else {
        if (cleanCorrect.length >= 1 && cleanVal.length === cleanCorrect.length) {
          const sortedVal = cleanVal.split('').sort().join('');
          const sortedCorrect = cleanCorrect.split('').sort().join('');
          if (sortedVal === sortedCorrect) return true;
        }
      }
    }

    // Standard floating-point numeric comparison for math/calculation questions
    const numAnswer = parseFloat(rawVal.replace(',', '.'));
    const correctNum = question.numerical_answer ?? parseFloat(rawCorrect.replace(',', '.'));
    const tolerance = question.numerical_tolerance ?? 0;
    if (isNaN(numAnswer) || isNaN(correctNum)) return false;
    return Math.abs(numAnswer - correctNum) <= tolerance;
  }

  if (qt === 'fill_blank') {
    const studentAnswers = value.split('|').map(a => a.trim().toLowerCase());
    const correctAnswers = (question.correct_answer || '').split('|').map(a => a.trim().toLowerCase());
    if (studentAnswers.length !== correctAnswers.length) return false;
    return studentAnswers.every((a, i) => a === correctAnswers[i]);
  }

  if (qt === 'ordering') {
    const studentSeq = value.split('|||').map(s => s.trim());
    const correctSeq = (
      question.sequence_items?.length
        ? question.sequence_items
        : (question.correct_answer || '').split('|||')
    ).map(s => s.trim());
    if (studentSeq.length !== correctSeq.length) return false;
    return studentSeq.every((item, i) => item === correctSeq[i]);
  }

  if (qt === 'matching') {
    const pairsRecord = normalizePairs(question.matching_pairs ?? null);
    const studentPairs = parseMatchingValue(value, pairsRecord);
    const correctPairs = parseMatchingValue(question.correct_answer, pairsRecord);

    // If correctPairs is empty or missing keys from pairsRecord, use pairsRecord as ground truth
    if (Object.keys(correctPairs).length === 0 && Object.keys(pairsRecord).length > 0) {
      for (const [left, right] of Object.entries(pairsRecord)) {
        correctPairs[left] = right.split(',').map(r => r.trim()).filter(Boolean);
      }
    }

    const leftKeys = Object.keys(pairsRecord).length > 0
      ? Object.keys(pairsRecord)
      : Array.from(new Set([...Object.keys(studentPairs), ...Object.keys(correctPairs)]));

    if (leftKeys.length === 0) return false;

    return leftKeys.every(l => {
      const sRights = (studentPairs[l] || []).map(s => s.trim().toLowerCase()).sort();
      const cRights = (correctPairs[l] || []).map(s => s.trim().toLowerCase()).sort();
      if (sRights.length !== cRights.length || sRights.length === 0) return false;
      return sRights.every((r, i) => r === cRights[i]);
    });
  }

  if (qt === 'hotspot') {
    const parts = (question.correct_answer || '').split(':');
    const cx = parseFloat(parts[0]);
    const cy = parseFloat(parts[1]);
    const tolerance = parts[2] ? parseFloat(parts[2]) : 10;
    const sParts = value.split(':');
    const sx = parseFloat(sParts[0]);
    const sy = parseFloat(sParts[1]);
    if (isNaN(cx) || isNaN(cy) || isNaN(sx) || isNaN(sy)) return false;
    return Math.abs(sx - cx) <= tolerance && Math.abs(sy - cy) <= tolerance;
  }

  if (qt === 'true_false') {
    const ca = (question.correct_answer || '').trim();
    const isCorrectA = ca === 'A' || ca === 'Doğru' || ca.toLowerCase() === 'true';
    if (isCorrectA) return value === 'true' || value === 'A';
    return value === 'false' || value === 'B';
  }

  if (qt === 'multiple_select') {
    const studentAnswers = value.split(',').map(a => a.trim().toLowerCase()).filter(Boolean).sort();
    const correctAnswers = (question.correct_answer || '').split(',').map(a => a.trim().toLowerCase()).filter(Boolean).sort();
    if (studentAnswers.length !== correctAnswers.length) return false;
    return studentAnswers.every((a, i) => a === correctAnswers[i]);
  }

  // Short answer or fallback — 7-Layer Smart Open-Answer Evaluator
  return evaluateOpenShortAnswer(question, value);
}

/**
 * Returns the primary (display-friendly) canonical answer before any '|' separator.
 */
export function getPrimaryCorrectAnswer(correctAnswer?: string | null): string {
  if (!correctAnswer) return '';
  return correctAnswer.split('|')[0].trim();
}

const ROMAN_MAP: Record<string, number> = {
  i: 1,
  ii: 2,
  iii: 3,
  iv: 4,
  v: 5,
  vi: 6,
  vii: 7,
  viii: 8,
  ix: 9,
  x: 10,
};

const AZ_WORD_NUMBERS: Record<string, number> = {
  sıfır: 0,
  sifir: 0,
  bir: 1,
  biri: 1,
  birinci: 1,
  iki: 2,
  ikisi: 2,
  ikinci: 2,
  üç: 3,
  uc: 3,
  üçü: 3,
  ucu: 3,
  üçüncü: 3,
  ucuncu: 3,
  dörd: 4,
  dord: 4,
  dördü: 4,
  dordu: 4,
  dördüncü: 4,
  dorduncu: 4,
  beş: 5,
  bes: 5,
  beşi: 5,
  besi: 5,
  beşinci: 5,
  besinci: 5,
  altı: 6,
  alti: 6,
  altıncı: 6,
  altinci: 6,
  yeddi: 7,
  yeddisi: 7,
  yeddinci: 7,
  səkkiz: 8,
  sekkiz: 8,
  səkkizi: 8,
  sekkizi: 8,
  səkkizinci: 8,
  sekkizinci: 8,
  doqquz: 9,
  doqquzu: 9,
  doqquzuncu: 9,
  on: 10,
  onu: 10,
  onuncu: 10,
};

/**
 * Layer 2: Azerbaijani Unicode & Case Normalization
 */
export function normalizeAzText(raw: string): string {
  return String(raw || '')
    .replace(/\u0130/g, 'i')
    .replace(/I/g, 'ı')
    .toLowerCase()
    .replace(/\u0307/g, '')
    .replace(/[«»""''„“”`´]/g, '')
    .replace(/[\s\u00a0]+/g, ' ')
    .trim();
}

/**
 * Layer 3: English / ASCII Keyboard Transliteration Folding
 */
export function transliterateAzToAscii(raw: string, mapSchwaToA = false): string {
  const s = normalizeAzText(raw)
    .replace(/(\d),(\d)/g, '$1.$2') // Preserve decimal point between digits!
    .replace(/sh/g, 's')
    .replace(/ch/g, 'c')
    .replace(/gh/g, 'g')
    .replace(/zh/g, 'j')
    .replace(/ə/g, mapSchwaToA ? 'a' : 'e')
    .replace(/ä/g, mapSchwaToA ? 'a' : 'e')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ı/g, 'i')
    .replace(/(?!\d\.\d)[,!?;:'"()[\]{}]|(?<!\d)\.(?!\d)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return s;
}

/**
 * Layer 4: Strips common Azerbaijani filler words and grammatical case suffixes
 */
function stripAzFillersAndSuffixes(raw: string): string {
  let s = normalizeAzText(raw);
  // Remove leading/trailing helper words
  s = s
    .replace(/^(cavab|yalnız|yalniz|bəndlər|bənd|bend|cümlə|cumle|sətir|setir|variant)\s*[:=-]?\s*/i, '')
    .replace(/\s+(cümlədir|cümlə|cumle|sətirdir|sətir|setir|bənddir|bənd|bend|dövlətidir|dövləti|dovleti|ölkəsidir|ölkəsi|olkesi|respublikası|respublikasi|imperiyası|imperiyasi|şəhəridir|şəhəri|seheri|cihazıdır|cihazı|cihazi|ilə\s+ölçülür|ölçülür|işıq|rəngli\s+işıq|rəng|reng|boşluğuna\s+aiddir|aiddir|bərabərdir)$/i, '')
    .replace(/[.,!?;:]+$/g, '')
    .trim();

  // If single or two-word term >= 4 chars, also strip standard trailing grammatical suffixes
  if (s.length >= 5) {
    s = s.replace(/(dakı|dəki|dan|dən|lar|lər|dadır|dədir|dır|dir|dur|dür|nı|ni|nu|nü|ya|yə|da|də|la|lə|ın|in|un|ün|nə|na)$/i, '');
    if (s.length >= 5) {
      s = s.replace(/[ıiuüaə]$/i, '');
    }
  }
  return s.trim();
}

/**
 * Layer 5: Parses flexible numbers (integers, decimals with comma/dot, fractions, units, word numbers)
 */
function parseFlexibleSingleNumber(raw: string): number | null {
  const s = normalizeAzText(raw)
    .replace(/^[=≈~]+\s*/, '')
    .replace(/[−–—]/g, '-')
    .replace(/-\s+(\d)/g, '-$1')
    .trim();

  if (!s) return null;

  // Check exact word number ("dörd", "beş", "səkkiz", "ikisi")
  const cleanWord = s.replace(/[.,!?;:]/g, '').trim();
  if (cleanWord in AZ_WORD_NUMBERS) {
    return AZ_WORD_NUMBERS[cleanWord];
  }
  const cleanRoman = cleanWord.replace(/ı/g, 'i');
  if (cleanRoman in ROMAN_MAP) {
    return ROMAN_MAP[cleanRoman];
  }

  // Mixed fraction: "38 tam 37/38" or "1 1/2"
  const mixedMatch = s.match(/^(-?\d+)\s*(?:tam\s+|\s+)(\d+)\s*\/\s*(\d+)$/i);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1], 10);
    const num = parseInt(mixedMatch[2], 10);
    const den = parseInt(mixedMatch[3], 10);
    if (den !== 0) {
      return whole >= 0 ? whole + num / den : whole - num / den;
    }
  }

  // Simple fraction: "3/2", "1/2", "9/2", "14/5"
  const fracMatch = s.match(/^(-?\d+)\s*\/\s*(\d+)$/);
  if (fracMatch) {
    const num = parseInt(fracMatch[1], 10);
    const den = parseInt(fracMatch[2], 10);
    if (den !== 0) return num / den;
  }

  // Strip known measurement units and Azerbaijani numeric suffixes at the end
  const strippedUnit = s
    .replace(
      /\s*(km\/saat|km\/s|m\/san²|m\/san2|m\/s²|m\/s2|m\/san|m\/s|mm\/san|mm\/s|kq[·*.\s]?m\/san|n[·*.\s]?san|kq\/m³|kq\/m3|q\/sm³|q\/sm3|kc\/mol|q\/mol|sm²|sm2|sm|metr|m|qram|kq|kiloqram|q|nyuton|n|kulon|kl|volt|v|om|ω|hers|hs|hz|san⁻¹|san\^-1|kpa|pa|coul|c|mol|saat|s|dəqiqə|deqiqe|gün|gun|fərd|ferd|bakteriya|xromosom|ədəd|eded|sayda|üçlük|ucluk|sətir|setir|cümlə|cumle|faiz|%|°|dərəcə|derece)$/i,
      '',
    )
    .replace(/-(i|ı|u|ü|si|sı|su|sü|ci|cı|cu|cü)$/i, '')
    .trim();

  // Must match a clean decimal or integer (no multiple comma-separated items like "1, 3, 5")
  if (/^-?\d+([.,]\d+)?$/.test(strippedUnit)) {
    const val = parseFloat(strippedUnit.replace(',', '.'));
    return isNaN(val) ? null : val;
  }

  return null;
}

/**
 * Layer 6: Multi-Item Selection & Sequence Parser ("1, 3, 5", "135", "IV və VII", "Yalnız 2, 3, 4")
 */
function isMultiItemSelectionQuestion(question: Question, primaryCorrect: string): boolean {
  const rawTrimmed = String(primaryCorrect || '').trim();
  const c = normalizeAzText(rawTrimmed)
    .replace(/ı/g, 'i')
    .replace(/^yalniz\s+/i, '')
    .trim();

  if (/^yaln[ıi]z\s+([0-9]+|[ivx]+)/i.test(rawTrimmed)) {
    return true;
  }

  // Must not contain decimal with no space after comma (e.g. "43,2", "4,5", "2,8", "93,54%")
  // Selection lists either have space after comma ("1, 3", "4, 5"), "və", ";", or Roman numerals
  const hasSelectionSeparator =
    /,\s+/.test(rawTrimmed) ||
    /;/.test(rawTrimmed) ||
    /(?:^|\s)(və|ve)(?:\s|$)/i.test(rawTrimmed);

  if (!hasSelectionSeparator) {
    return false;
  }

  const tokens = parseSelectionList(rawTrimmed, false);
  if (!tokens || tokens.length < 2) return false;
  // Every item index in an Olympiad question is between 1 and 15
  return tokens.every(n => n >= 1 && n <= 15);
}

function parseSelectionList(raw: string, allowSingleDigitSplit = true): number[] | null {
  let s = normalizeAzText(raw)
    .replace(/ı/g, 'i')
    .replace(/^(cavab|yalniz|bəndlər|bənd|bend|seçim)\s*[:=-]?\s*/i, '')
    .replace(/\s*(cümlələr|cümlə|cumle|bəndlər|bənd|bend)$/i, '')
    .trim();

  if (!s) return null;

  // Replace connectors ("və", "ve", "ilə", "ile", "→", "->") with commas (Unicode-safe boundaries)
  s = s
    .replace(/(?:^|[\s,;])(və|ve|ilə|ile|ya)(?=$|[\s,;])/gi, ',')
    .replace(/➔|→|->|[;,\-–—/\\|+]+/g, ',')
    .trim();

  const rawTokens = s
    .split(/[\s,]+/)
    .map(t => t.replace(/-(ci|ci|cu|cü|i|u|ü|si|su|sü)$/i, '').replace(/[.()]/g, '').trim())
    .filter(Boolean);

  if (rawTokens.length === 0) return null;

  // Case A: Single concatenated digit string like "135" or "1432" or "45"
  if (rawTokens.length === 1 && /^\d{2,6}$/.test(rawTokens[0]) && allowSingleDigitSplit) {
    return rawTokens[0].split('').map(d => parseInt(d, 10));
  }

  const result: number[] = [];
  for (const tok of rawTokens) {
    if (tok in ROMAN_MAP) {
      result.push(ROMAN_MAP[tok]);
    } else if (tok in AZ_WORD_NUMBERS) {
      result.push(AZ_WORD_NUMBERS[tok]);
    } else if (/^\d+$/.test(tok)) {
      result.push(parseInt(tok, 10));
    } else {
      return null;
    }
  }

  return result.length > 0 ? result : null;
}

/**
 * Layer 7: Flexible Matching Parser ("1-b; 2-d; 3-a; 4-c", "I-a, d; II-b, e", "1b 2d 3a 4c", "bdac")
 */
function isMatchingFormatAnswer(primaryCorrect: string): boolean {
  return /(?:^|[\s,;])([1-4]|I|II|III|IV)\s*[-–:]\s*[a-e1-8]/i.test(primaryCorrect);
}

function parseFlexibleMatchingMap(
  raw: string,
  expectedKeysCount?: number,
): Record<string, string[]> | null {
  const s = normalizeAzText(raw)
    .replace(/ı/g, 'i')
    .replace(/[–—]/g, '-')
    .trim();
  if (!s) return null;

  // Shorthand pure letters like "bdac" or "b, d, a, c" when keys are 1..N (single letter per key)
  if (expectedKeysCount && expectedKeysCount >= 2) {
    const cleanLetters = s.replace(/[\s,;.-]+/g, '');
    if (
      cleanLetters.length === expectedKeysCount &&
      /^[a-e]+$/i.test(cleanLetters)
    ) {
      const map: Record<string, string[]> = {};
      cleanLetters.split('').forEach((ch, idx) => {
        map[String(idx + 1)] = [ch.toLowerCase()];
      });
      return map;
    }
  }

  // Split into segments by ';' or before next key (1..6 or i..iv followed by - / : / space)
  const segments = s
    .split(/;|\s+(?=(?:iv|iii|ii|i|[1-6])\s*(?:[-:=).]\s*|\s+[a-e]))|,\s*(?=(?:iv|iii|ii|i|[1-6])\s*[-:=).\s])/i)
    .map(seg => seg.trim())
    .filter(Boolean);

  const result: Record<string, string[]> = {};
  let count = 0;

  for (const seg of segments) {
    const m = seg.match(/^(iv|iii|ii|i|[1-6])\s*(?:[-:=).]\s*|\s*)(.+)$/i);
    if (!m) return null;
    const rawKey = m[1].toLowerCase();
    const key = rawKey in ROMAN_MAP ? String(ROMAN_MAP[rawKey]) : rawKey;
    const rawRight = m[2].trim();

    let items: string[];
    if (/^[a-e\s,]+$/i.test(rawRight)) {
      items = rawRight
        .replace(/[^a-e]/gi, '')
        .toLowerCase()
        .split('')
        .filter(Boolean);
    } else if (/^[\d\s,]+$/.test(rawRight)) {
      items = rawRight
        .split(/[\s,]+/)
        .map(x => x.trim())
        .filter(Boolean);
    } else {
      return null;
    }

    const uniqueSorted = Array.from(new Set(items)).sort();
    if (uniqueSorted.length === 0) return null;
    result[key] = uniqueSorted;
    count++;
  }

  return count > 0 ? result : null;
}

/**
 * 7-Layer Professional Open-Answer Evaluation Engine
 */
export function evaluateOpenShortAnswer(question: Question, value: string): boolean {
  const rawStudent = String(value ?? '').trim();
  if (!rawStudent) return false;

  const rawCorrect = String(question.correct_answer || question.numerical_answer || '').trim();
  if (!rawCorrect) return false;

  // Layer 1: Split pipe-separated variants
  const acceptedVariants = rawCorrect
    .split('|')
    .map(v => v.trim())
    .filter(Boolean);
  const primaryVariant = acceptedVariants[0] || rawCorrect;

  // Check if this is a matching question (Layer 7)
  if (isMatchingFormatAnswer(primaryVariant)) {
    const targetMap = parseFlexibleMatchingMap(primaryVariant);
    if (targetMap) {
      const targetKeys = Object.keys(targetMap).sort();
      const allSingleLetter = targetKeys.every(
        k => targetMap[k].length === 1 && /^[a-e]$/.test(targetMap[k][0]),
      );
      const studentMap = parseFlexibleMatchingMap(
        rawStudent,
        allSingleLetter ? targetKeys.length : undefined,
      );
      if (studentMap) {
        const studentKeys = Object.keys(studentMap).sort();
        if (
          studentKeys.length === targetKeys.length &&
          targetKeys.every(
            k =>
              studentMap[k] &&
              studentMap[k].length === targetMap[k].length &&
              studentMap[k].every((v, idx) => v === targetMap[k][idx]),
          )
        ) {
          return true;
        }
      }
    }
  }

  // Check if this is a multi-item selection or chronological sequence question (Layer 6)
  if (isMultiItemSelectionQuestion(question, primaryVariant)) {
    const isSeq = isSequenceQuestion(question.question_text);
    const targetTokens = parseSelectionList(primaryVariant, false);
    if (targetTokens && targetTokens.length > 0) {
      const maxTarget = Math.max(...targetTokens);
      const studentTokens = parseSelectionList(rawStudent, maxTarget <= 9);
      if (studentTokens && studentTokens.length === targetTokens.length) {
        if (isSeq) {
          if (studentTokens.every((n, idx) => n === targetTokens[idx])) return true;
        } else {
          const sortedTarget = [...targetTokens].sort((a, b) => a - b);
          const sortedStudent = [...studentTokens].sort((a, b) => a - b);
          if (sortedStudent.every((n, idx) => n === sortedTarget[idx])) return true;
        }
      }
    }
  }

  // Test against every variant in acceptedVariants using Layers 2, 3, 4, 5
  const cleanPunctPreserveDec = (str: string) =>
    normalizeAzText(str)
      .replace(/(\d),(\d)/g, '$1.$2')
      .replace(/(?!\d\.\d)[,!?;:'"]|(?<!\d)\.(?!\d)/g, '')
      .trim();

  const normStudentBasic = cleanPunctPreserveDec(rawStudent);
  const asciiStudentE = transliterateAzToAscii(rawStudent, false);
  const asciiStudentA = transliterateAzToAscii(rawStudent, true);
  const stemStudent = stripAzFillersAndSuffixes(rawStudent);
  const asciiStemStudentE = transliterateAzToAscii(stemStudent, false);
  const asciiStemStudentA = transliterateAzToAscii(stemStudent, true);
  const studentNum = parseFlexibleSingleNumber(rawStudent);

  for (const variant of acceptedVariants) {
    // Layer 2: Normalized Azerbaijani string match
    const normVariantBasic = cleanPunctPreserveDec(variant);
    if (normStudentBasic && normStudentBasic === normVariantBasic) return true;

    // Layer 3: ASCII / English keyboard transliteration match
    const asciiVariantE = transliterateAzToAscii(variant, false);
    const asciiVariantA = transliterateAzToAscii(variant, true);
    if (asciiStudentE && (asciiStudentE === asciiVariantE || asciiStudentA === asciiVariantA)) {
      return true;
    }

    // Layer 4: Grammatical suffix & filler word stripped match
    const stemVariant = stripAzFillersAndSuffixes(variant);
    if (stemStudent && stemVariant && stemStudent.length >= 2) {
      if (stemStudent === stemVariant) return true;
      const asciiStemVariantE = transliterateAzToAscii(stemVariant, false);
      const asciiStemVariantA = transliterateAzToAscii(stemVariant, true);
      if (asciiStemStudentE === asciiStemVariantE || asciiStemStudentA === asciiStemVariantA) {
        return true;
      }
    }

    // Layer 5: Numerical / Decimal / Fraction / Unit equivalence
    if (studentNum !== null && !isMultiItemSelectionQuestion(question, primaryVariant)) {
      const variantNum = parseFlexibleSingleNumber(variant);
      if (variantNum !== null) {
        const tol = question.numerical_tolerance ?? 1e-3;
        if (Math.abs(studentNum - variantNum) <= tol) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Generates student-friendly guidance (badge, placeholder, hint) for open-ended questions
 * so students immediately know how to write their answer without confusion.
 */
export function getSmartOpenQuestionHint(question: Question): {
  badge: string;
  placeholder: string;
  hint: string;
} {
  const primary = getPrimaryCorrectAnswer(question.correct_answer);

  if (isMatchingFormatAnswer(primary)) {
    return {
      badge: 'Açıq Uyğunluq Sualı',
      placeholder: 'Məsələn: 1-b, 2-d, 3-a...',
      hint: 'Uyğunluğu istənilən rahat formatda yaza bilərsiniz (məsələn: 1-b, 2-a, 3-c və ya 1b 2a 3c).',
    };
  }

  if (isMultiItemSelectionQuestion(question, primary)) {
    if (isSequenceQuestion(question.question_text)) {
      return {
        badge: 'Açıq Ardıcıllıq Sualı',
        placeholder: 'Məsələn: 1, 4, 3, 2 və ya 1432',
        hint: 'Hadisələrin düzgün ardıcıllığını rəqəmlərlə vergüllə, boşluqla və ya bitişik yazın (məsələn: 1, 4, 3, 2 və ya 1432).',
      };
    }
    return {
      badge: 'Açıq Seçim Sualı',
      placeholder: 'Məsələn: 1, 3, 5 və ya 135',
      hint: 'Doğru bəndlərin nömrələrini vergüllə, boşluqla və ya bitişik yazın (məsələn: 1, 3, 5 və ya 135). Sıra fərqi yoxdur.',
    };
  }

  if (parseFlexibleSingleNumber(primary) !== null) {
    return {
      badge: 'Açıq Hesablama Sualı',
      placeholder: 'Cavabı ədədlə yazın (məs: 25 və ya 4,5)...',
      hint: 'Cavabı yalnız ədədlə və ya ölçü vahidi ilə yaza bilərsiniz (vergül və ya nöqtə fərqi yoxdur).',
    };
  }

  return {
    badge: 'Açıq Sual',
    placeholder: 'Cavabınızı bura daxil edin...',
    hint: 'Cavabı söz və ya ifadə ilə yazın (böyük-kiçik hərf və ya ingilis klaviaturası şrift fərqi avtomatik nəzərə alınır).',
  };
}

export interface AnswerEvaluation {
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  needsReview: boolean;
}

export function evaluateAnswer(question: Question, value: string): AnswerEvaluation {
  const maxPoints = question.weight ?? 1;
  const qt = question.question_type;

  if (qt === 'essay' || qt === 'code') {
    return {
      isCorrect: false,
      pointsEarned: 0,
      maxPoints,
      needsReview: true,
    };
  }

  // Partial credit for matching
  if (qt === 'matching') {
    const pairsRecord = normalizePairs(question.matching_pairs ?? null);
    const studentPairs = parseMatchingValue(value, pairsRecord);
    const correctPairs = parseMatchingValue(question.correct_answer, pairsRecord);

    if (Object.keys(correctPairs).length === 0 && Object.keys(pairsRecord).length > 0) {
      for (const [left, right] of Object.entries(pairsRecord)) {
        correctPairs[left] = right.split(',').map(r => r.trim()).filter(Boolean);
      }
    }

    const leftKeys = Object.keys(pairsRecord).length > 0
      ? Object.keys(pairsRecord)
      : Array.from(new Set([...Object.keys(studentPairs), ...Object.keys(correctPairs)]));

    if (leftKeys.length === 0) {
      return { isCorrect: false, pointsEarned: 0, maxPoints, needsReview: false };
    }

    let correctCount = 0;
    for (const l of leftKeys) {
      const sRights = (studentPairs[l] || []).map(s => s.trim().toLowerCase()).sort();
      const cRights = (correctPairs[l] || []).map(s => s.trim().toLowerCase()).sort();
      if (sRights.length > 0 && sRights.length === cRights.length && sRights.every((r, i) => r === cRights[i])) {
        correctCount++;
      }
    }

    const isCorrect = correctCount === leftKeys.length;
    const pointsEarned = isCorrect
      ? maxPoints
      : Math.round((correctCount / leftKeys.length) * maxPoints * 100) / 100;

    return { isCorrect, pointsEarned, maxPoints, needsReview: false };
  }

  // Partial credit for multiple_select
  if (qt === 'multiple_select') {
    const studentAnswers = value.split(',').map(a => a.trim().toLowerCase()).filter(Boolean);
    const correctAnswers = (question.correct_answer || '').split(',').map(a => a.trim().toLowerCase()).filter(Boolean);

    if (correctAnswers.length === 0) {
      return { isCorrect: false, pointsEarned: 0, maxPoints, needsReview: false };
    }

    const correctSelected = studentAnswers.filter(a => correctAnswers.includes(a)).length;
    const incorrectSelected = studentAnswers.filter(a => !correctAnswers.includes(a)).length;

    const isCorrect = correctSelected === correctAnswers.length && incorrectSelected === 0;
    const netCorrect = Math.max(0, correctSelected - incorrectSelected);
    const pointsEarned = isCorrect
      ? maxPoints
      : Math.round((netCorrect / correctAnswers.length) * maxPoints * 100) / 100;

    return { isCorrect, pointsEarned, maxPoints, needsReview: false };
  }

  const isCorrect = isAnswerCorrect(question, value);
  return {
    isCorrect,
    pointsEarned: isCorrect ? maxPoints : 0,
    maxPoints,
    needsReview: false,
  };
}
