import { PreviewQuestion } from './types';

export interface MoodleParseResult {
  questions: PreviewQuestion[];
  invalidCount: number;
  parseError?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  if (!html) return '';
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent?.trim() ?? html.replace(/<[^>]+>/g, '').trim();
  } catch {
    return html.replace(/<[^>]+>/g, '').trim();
  }
}

/** Returns the textContent of the first <text> child of `el`. */
function getText(el: Element | null): string {
  if (!el) return '';
  return el.querySelector('text')?.textContent?.trim() ?? '';
}

/**
 * Extracts the last meaningful segment from a Moodle category path.
 * "$course$/top/Biologiya/Hüceyrə" → "Hüceyrə"
 */
function parseCategoryPath(path: string): string {
  const cleaned = path.replace(/^\$course\$\//, '').replace(/^top\//, '');
  const segments = cleaned.split('/').map(s => s.trim()).filter(Boolean);
  return segments[segments.length - 1] ?? cleaned.trim();
}

function mapMoodleType(moodleType: string, isSingle: boolean): string {
  switch (moodleType) {
    case 'multichoice':  return isSingle ? 'multiple_choice' : 'multiple_select';
    case 'truefalse':    return 'true_false';
    case 'shortanswer':  return 'short_answer';
    case 'essay':        return 'essay';
    case 'matching':     return 'matching';
    case 'numerical':    return 'numerical';
    case 'cloze':        return 'fill_blank';
    default:             return 'multiple_choice';
  }
}

/**
 * Builds a filename → data-URI map from ALL <file encoding="base64"> elements
 * inside a question node (including those nested inside <answer> elements).
 */
function buildFileMap(qEl: Element): Record<string, string> {
  const map: Record<string, string> = {};
  const fileEls = Array.from(qEl.querySelectorAll('file[encoding="base64"]'));
  for (const f of fileEls) {
    const name = f.getAttribute('name') ?? '';
    const path = f.getAttribute('path') ?? '/';
    const b64  = f.textContent?.replace(/\s/g, '') ?? '';
    if (!name || !b64) continue;

    const ext  = name.split('.').pop()?.toLowerCase() ?? '';
    const mime =
      ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
      ext === 'png'  ? 'image/png'  :
      ext === 'gif'  ? 'image/gif'  :
      ext === 'webp' ? 'image/webp' :
      ext === 'svg'  ? 'image/svg+xml' :
      ext === 'bmp'  ? 'image/bmp' :
                       'image/png';

    const uri = `data:${mime};base64,${b64}`;
    map[name]           = uri;
    map[`${path}${name}`] = uri;
    map[`/${name}`]     = uri;
  }
  return map;
}

/** Resolves the first @@PLUGINFILE@@ or plain <img src> from an HTML string. */
function extractImageUrl(html: string, fileMap: Record<string, string>): string | null {
  const pfMatch = html.match(/src=["']@@PLUGINFILE@@\/([^"']+)["']/i);
  if (pfMatch) {
    const filename = pfMatch[1];
    return fileMap[filename] ?? fileMap[`/${filename}`] ?? null;
  }
  const srcMatch = html.match(/src=["'](data:image\/[^"']+|https?:\/\/[^"']+)["']/i);
  return srcMatch ? srcMatch[1] : null;
}

/**
 * Attempts to extract the first 100%-correct answer from a Moodle cloze string.
 * {1:SHORTANSWER:%100%Bakı} → "Bakı"
 * {1:NUMERICAL:=42:0.5}    → "42"
 */
function extractClozeAnswer(clozeText: string): string {
  // %100% answer variant
  const percentMatch = clozeText.match(/\{[^}]*?%100%([^%:}#~]+)/);
  if (percentMatch) return percentMatch[1].trim();
  // NUMERICAL =value variant
  const numericalMatch = clozeText.match(/\{[^}]*?NUMERICAL:=([^:}]+)/);
  if (numericalMatch) return numericalMatch[1].trim();
  return '';
}

// ─── Main parser ─────────────────────────────────────────────────────────────

export function parseMoodleXML(xmlContent: string): MoodleParseResult {
  const questions: PreviewQuestion[] = [];
  let invalidCount = 0;
  let currentCategory: string | undefined;

  let doc: Document;
  try {
    doc = new DOMParser().parseFromString(xmlContent, 'text/xml');
  } catch {
    return { questions: [], invalidCount: 0, parseError: 'XML formatı düzgün deyil.' };
  }

  const parseErrorEl = doc.querySelector('parsererror');
  if (parseErrorEl) {
    const msg = parseErrorEl.textContent?.trim().slice(0, 160) ?? '';
    return { questions: [], invalidCount: 0, parseError: `XML parse xətası: ${msg}` };
  }

  const questionEls = Array.from(doc.querySelectorAll('question'));

  for (const qEl of questionEls) {
    const type = qEl.getAttribute('type') ?? '';
    if (!type) continue;

    // ── Category cascade ──────────────────────────────────────────────────────
    if (type === 'category') {
      const rawPath = getText(qEl.querySelector('category'));
      if (rawPath) currentCategory = parseCategoryPath(rawPath);
      continue;
    }

    try {
      const fileMap = buildFileMap(qEl);

      // ── Question text ────────────────────────────────────────────────────
      const questionTextEl = qEl.querySelector('questiontext');
      const rawHtml        = getText(questionTextEl);
      const questionImageUrl = extractImageUrl(rawHtml, fileMap);
      const questionText     = stripHtml(rawHtml.replace(/@@PLUGINFILE@@\/[^\s"'<>]+/g, ''));

      if (!questionText) { invalidCount++; continue; }

      // ── Shared metadata ───────────────────────────────────────────────────
      const title = stripHtml(getText(qEl.querySelector('name'))) || undefined;

      // generalfeedback takes priority; fall back to correctfeedback (Moodle 4.x)
      const explanation =
        stripHtml(getText(qEl.querySelector('generalfeedback'))) ||
        stripHtml(getText(qEl.querySelector('correctfeedback'))) ||
        undefined;

      const tagEls = Array.from(qEl.querySelectorAll('tags tag text'));
      const tags   = tagEls.map(el => el.textContent?.trim() ?? '').filter(Boolean);

      // Weight from <defaultgrade>
      const gradeRaw = qEl.querySelector('defaultgrade')?.textContent?.trim() ?? '';
      const weight   = gradeRaw ? (isNaN(parseFloat(gradeRaw)) ? undefined : parseFloat(gradeRaw)) : undefined;

      // First hint
      const hint = stripHtml(getText(qEl.querySelector('hint'))) || undefined;

      // Category cascaded from nearest preceding category question
      const category = currentCategory;

      // ── Shared push helper ─────────────────────────────────────────────
      const base = {
        title, explanation, category,
        tags:   tags.length ? tags : undefined,
        hint,
        weight: weight !== undefined ? weight : undefined,
        question_image_url: questionImageUrl,
      };

      // ── TRUE/FALSE ────────────────────────────────────────────────────────
      if (type === 'truefalse') {
        const answerEls = Array.from(qEl.querySelectorAll('answer'));
        const correct   = answerEls.find(el => parseFloat(el.getAttribute('fraction') ?? '0') === 100);
        const rawText   = correct?.querySelector('text')?.textContent?.toLowerCase().trim() ?? '';
        const correctAnswer =
          rawText === 'true' || rawText === 'doğru' ? 'Doğru' : 'Yanlış';

        questions.push({
          ...base,
          question_text:  questionText,
          question_type:  'true_false',
          options:        ['Doğru', 'Yanlış'],
          correct_answer: correctAnswer,
        });
        continue;
      }

      // ── MATCHING ──────────────────────────────────────────────────────────
      if (type === 'matching') {
        const subquestions = Array.from(qEl.querySelectorAll('subquestion'));
        const matchingPairs: Record<string, string> = {};

        for (const sq of subquestions) {
          let leftText  = '';
          let rightText = '';
          for (const child of Array.from(sq.children)) {
            if (child.tagName === 'text') {
              leftText = stripHtml(child.textContent?.trim() ?? '');
            } else if (child.tagName === 'answer') {
              rightText = stripHtml(child.querySelector('text')?.textContent?.trim() ?? '');
            }
          }
          if (leftText && rightText) matchingPairs[leftText] = rightText;
        }

        questions.push({
          ...base,
          question_text:  questionText,
          question_type:  'matching',
          options:        null,
          correct_answer: '',
          matching_pairs: matchingPairs,
        });
        continue;
      }

      // ── NUMERICAL ─────────────────────────────────────────────────────────
      if (type === 'numerical') {
        const ansEls = Array.from(qEl.querySelectorAll('answer'));
        const candidates = ansEls
          .map(el => ({
            value:         parseFloat(el.querySelector('text')?.textContent ?? ''),
            tolerance:     parseFloat(el.querySelector('tolerance')?.textContent ?? '0'),
            toleranceType: el.querySelector('tolerance')?.getAttribute('tolerancetype') ?? 'nominal',
            fraction:      parseFloat(el.getAttribute('fraction') ?? '0'),
          }))
          .filter(a => !isNaN(a.value))
          .sort((a, b) => b.fraction - a.fraction);

        const best = candidates[0];
        if (!best) { invalidCount++; continue; }

        // Convert percent tolerance to absolute
        let tolerance = isNaN(best.tolerance) ? 0 : best.tolerance;
        if (best.toleranceType === 'percent' && tolerance > 0) {
          tolerance = Math.abs(best.value) * tolerance / 100;
        }

        questions.push({
          ...base,
          question_text:       questionText,
          question_type:       'numerical',
          options:             null,
          correct_answer:      String(best.value),
          numerical_answer:    best.value,
          numerical_tolerance: tolerance || null,
        });
        continue;
      }

      // ── CLOZE (fill-in-the-blank) ─────────────────────────────────────────
      if (type === 'cloze') {
        const rawClozeText = stripHtml(rawHtml);
        const clozeAnswer  = extractClozeAnswer(rawClozeText);
        const template     = rawClozeText.replace(/\{[^}]+\}/g, '___');

        questions.push({
          ...base,
          question_text:       template,
          question_type:       'fill_blank',
          options:             null,
          correct_answer:      clozeAnswer,
          fill_blank_template: template,
        });
        continue;
      }

      // ── SHORT ANSWER / ESSAY ──────────────────────────────────────────────
      if (type === 'shortanswer' || type === 'essay') {
        const answerEls = Array.from(qEl.querySelectorAll('answer'));
        const best = answerEls
          .map(el => ({
            text:     stripHtml(el.querySelector('text')?.textContent?.trim() ?? ''),
            fraction: parseFloat(el.getAttribute('fraction') ?? '0'),
          }))
          .filter(a => a.text)
          .sort((a, b) => b.fraction - a.fraction);

        questions.push({
          ...base,
          question_text:  questionText,
          question_type:  type === 'essay' ? 'essay' : 'short_answer',
          options:        null,
          correct_answer: best[0]?.text ?? '',
        });
        continue;
      }

      // ── MULTIPLE CHOICE / MULTIPLE SELECT ────────────────────────────────
      const singleEl     = qEl.querySelector('single');
      const isSingle     = !singleEl || singleEl.textContent?.trim() !== '0';
      const questionType = mapMoodleType(type, isSingle);

      const answerEls = Array.from(qEl.querySelectorAll('answer'));
      const options: string[]            = [];
      const correctAnswers: string[]     = [];
      const perOptionExp: Record<string, string> = {};
      const optionImages: Record<number, string> = {};

      for (const ans of answerEls) {
        const fraction = parseFloat(ans.getAttribute('fraction') ?? '0');
        const ansHtml  = ans.querySelector('text')?.textContent?.trim() ?? '';
        // Strip @@PLUGINFILE@@ refs before text extraction
        const text = stripHtml(ansHtml.replace(/@@PLUGINFILE@@\/[^\s"'<>]+/g, ''));
        // Option might be image-only; use placeholder text if needed
        const displayText = text || `[Variant ${options.length + 1}]`;

        options.push(displayText);
        const idx = options.length - 1;

        // Extract per-option image from this answer's HTML
        const optImgUrl = extractImageUrl(ansHtml, fileMap);
        if (optImgUrl) optionImages[idx] = optImgUrl;

        const feedbackText = stripHtml(getText(ans.querySelector('feedback')));
        if (feedbackText) perOptionExp[String(idx)] = feedbackText;

        if (fraction > 0) correctAnswers.push(displayText);
      }

      if (correctAnswers.length === 0) { invalidCount++; continue; }

      questions.push({
        ...base,
        question_text:  questionText,
        question_type:  questionType,
        options:        options.length ? options : null,
        correct_answer: questionType === 'multiple_select'
          ? correctAnswers.join(',')
          : correctAnswers[0],
        per_option_explanations: Object.keys(perOptionExp).length ? perOptionExp : null,
        option_images:           Object.keys(optionImages).length ? optionImages : null,
      });
    } catch {
      invalidCount++;
    }
  }

  return { questions, invalidCount };
}
