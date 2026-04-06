import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { QuestionBankItem } from '@/hooks/useQuestionBank';
import { PreviewQuestion } from '@/utils/parsers/types';
import {
  parseAiken,
  parseGIFT,
  parseMarkdownFull,
  ParseWarning,
  readFileWithEncoding,
  detectFormat,
  parseJsonImport,
  parseCsvImport,
  parseMoodleXML,
} from '@/utils/import-parsers';
import { formatQuestionsForImport } from '@/components/question-bank/import-export/utils';
import { ImportFormat } from '@/components/question-bank/import-export/constants';
import { isValidQuestion } from '@/components/question-bank/import-preview/utils';

/**
 * Converts a base64 data URI to a File, uploads it to the question-images
 * Supabase bucket and returns the public URL.  Returns null on failure.
 */
async function uploadBase64Image(dataUri: string): Promise<string | null> {
  try {
    const [header, b64] = dataUri.split(',');
    if (!header || !b64) return null;
    const mimeMatch = header.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const ext  = mime.split('/')[1]?.replace('jpeg', 'jpg') ?? 'png';

    const byteChars = atob(b64);
    const bytes     = new Uint8Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);

    const blob     = new Blob([bytes], { type: mime });
    const fileName = `${crypto.randomUUID()}.${ext}`;

    const { data, error } = await supabase.storage
      .from('question-images')
      .upload(fileName, blob);

    if (error) return null;

    const { data: { publicUrl } } = supabase.storage
      .from('question-images')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch {
    return null;
  }
}

interface ImportStats {
  total: number;
  invalid: number;
}

interface UseImportPreviewReturn {
  importPreview: PreviewQuestion[];
  setImportPreview: React.Dispatch<React.SetStateAction<PreviewQuestion[]>>;
  importError: string | null;
  importWarnings: ParseWarning[];
  importProgress: number;
  importStats: ImportStats | null;
  isCheckingDuplicates: boolean;
  isBulkEnhancing: boolean;
  resetImportState: () => void;
  processFile: (file: File, format: ImportFormat) => Promise<void>;
  handleCheckDuplicates: () => Promise<void>;
  handleBulkEnhance: () => Promise<void>;
  handleImport: (
    onImport: (questions: Omit<QuestionBankItem, 'id' | 'created_at' | 'updated_at'>[]) => void,
  ) => void;
}

export function useImportPreview(): UseImportPreviewReturn {
  const [importPreview, setImportPreview] = useState<PreviewQuestion[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const [importWarnings, setImportWarnings] = useState<ParseWarning[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [importStats, setImportStats] = useState<ImportStats | null>(null);
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const [isBulkEnhancing, setIsBulkEnhancing] = useState(false);

  const resetImportState = useCallback(() => {
    setImportError(null);
    setImportPreview([]);
    setImportWarnings([]);
    setImportProgress(0);
    setImportStats(null);
  }, []);

  const processFile = useCallback(async (file: File, format: ImportFormat): Promise<void> => {
    resetImportState();
    try {
      const content = await readFileWithEncoding(file);
      const detected = detectFormat(content);

      let parsed: PreviewQuestion[] = [];
      let invalidCount = 0;

      if (detected === 'json') {
        const r = parseJsonImport(content);
        parsed = r.questions;
        invalidCount = r.invalidCount;
      } else if (detected === 'csv') {
        const r = parseCsvImport(content);
        parsed = r.questions;
        invalidCount = r.invalidCount;
      } else if (detected === 'aiken') {
        parsed = parseAiken(content) as PreviewQuestion[];
      } else if (detected === 'gift') {
        parsed = parseGIFT(content) as PreviewQuestion[];
      } else if (detected === 'moodle_xml') {
        const r = parseMoodleXML(content);

        // Propagate XML parse errors as user-visible messages
        if (r.parseError && r.questions.length === 0) {
          throw new Error(r.parseError);
        }

        parsed = r.questions;
        invalidCount = r.invalidCount;

        // ── Upload embedded base64 images to Supabase storage ───────────────
        // Count total base64 images (question + option images)
        const totalImages = parsed.reduce((sum, q) => {
          let n = q.question_image_url?.startsWith('data:') ? 1 : 0;
          if (q.option_images) {
            n += Object.values(q.option_images as Record<string, string>)
              .filter(v => v.startsWith('data:')).length;
          }
          return sum + n;
        }, 0);

        if (totalImages > 0) {
          toast.info(`${totalImages} şəkil yüklənir...`);
          let uploadedCount = 0;
          let failedCount   = 0;
          let dedupCount    = 0;

          // Deduplication cache: base64 fingerprint → Supabase public URL
          const dedupCache = new Map<string, string>();

          const getOrUpload = async (uri: string): Promise<string | null> => {
            // Fingerprint: length + first 64 chars (fast, collision-resistant within one file)
            const fp = `${uri.length}:${uri.slice(5, 69)}`;
            if (dedupCache.has(fp)) { dedupCount++; return dedupCache.get(fp)!; }
            const url = await uploadBase64Image(uri);
            if (url) { dedupCache.set(fp, url); uploadedCount++; }
            else { failedCount++; }
            return url;
          };

          // Process sequentially so progress is predictable
          const updatedParsed: PreviewQuestion[] = [];
          for (const q of parsed) {
            const updated = { ...q };

            if (updated.question_image_url?.startsWith('data:')) {
              updated.question_image_url = await getOrUpload(updated.question_image_url);
            }

            if (updated.option_images) {
              const uploadedOpts: Record<number, string> = {};
              for (const [idxStr, uri] of Object.entries(updated.option_images as Record<string, string>)) {
                const idx = Number(idxStr);
                if (uri.startsWith('data:')) {
                  const url = await getOrUpload(uri);
                  if (url) uploadedOpts[idx] = url;
                } else {
                  uploadedOpts[idx] = uri;
                }
              }
              updated.option_images = Object.keys(uploadedOpts).length ? uploadedOpts : null;
            }

            updatedParsed.push(updated);
          }

          parsed = updatedParsed;

          const dedupNote = dedupCount > 0 ? ` (${dedupCount} dublikat keçildi)` : '';
          if (failedCount > 0) {
            toast.warning(`${uploadedCount} şəkil yükləndi, ${failedCount} uğursuz oldu${dedupNote}.`);
          } else {
            toast.success(`${uploadedCount} şəkil uğurla yükləndi${dedupNote}.`);
          }
        }
      } else {
        const result = parseMarkdownFull(content);
        parsed = result.questions as PreviewQuestion[];
        setImportWarnings(result.warnings);
        invalidCount = result.warnings.filter((w) => w.severity === 'error').length;
      }

      if (parsed.length === 0) {
        throw new Error('Faylda heç bir sual tapılmadı. Zəhmət olmasa formatın düzgün olmasına əmin olun.');
      }

      setImportStats({ total: parsed.length + invalidCount, invalid: invalidCount });
      setImportPreview(parsed);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Fayl oxunarkən xəta baş verdi');
    }
  }, [resetImportState]);

  const handleCheckDuplicates = useCallback(async (): Promise<void> => {
    if (importPreview.length === 0) return;
    setIsCheckingDuplicates(true);

    try {
      const checkCount = importPreview.length;
      if (checkCount > 20) {
        const proceed = window.confirm(`Diqqət: Sistemdə ${checkCount} sual mövcuddur. Onların hamısını eyni anda dublikat yoxlamasından keçirmək çox vaxt apara bilər. Davam etmək istəyirsiniz?`);
        if (!proceed) {
          setIsCheckingDuplicates(false);
          return;
        }
      }

      const updatedPreview = [...importPreview];
      toast.info(`${checkCount} sual üçün dublikat yoxlanışı aparılır...`);

      for (let i = 0; i < checkCount; i++) {
        const q = updatedPreview[i];
        const { data, error } = await supabase.functions.invoke('question-bank', {
          body: {
            action: 'search',
            searchQuery: q.question_text,
            filters: { type: q.question_type },
          },
        });

        if (!error && data.results && data.results.length > 0) {
          const bestMatch = data.results[0];
          if (bestMatch.question_text.toLowerCase().trim() === q.question_text.toLowerCase().trim()) {
            updatedPreview[i] = { ...q, potential_duplicate: true };
          }
        }
      }

      setImportPreview(updatedPreview);
      toast.success('Dublikat yoxlanışı tamamlandı.');
    } catch (err) {
      console.error('Duplicate check error:', err);
      toast.error('Dublikat yoxlanışı zamanı xəta baş verdi');
    } finally {
      setIsCheckingDuplicates(false);
    }
  }, [importPreview]);

  const handleBulkEnhance = useCallback(async (): Promise<void> => {
    if (importPreview.length === 0) return;
    setIsBulkEnhancing(true);

    try {
      const targetCount = importPreview.length;
      if (targetCount > 10) {
        const proceed = window.confirm(`Diqqət: Sistemdə ${targetCount} sual mövcuddur. İdxal olunan bütün sualları eyni anda Süni İntellektlə təkmilləşdirmək API xərci yarada bilər və proses gecikəcək. Yenə də davam etmək istəyirsiniz?`);
        if (!proceed) {
          setIsBulkEnhancing(false);
          return;
        }
      }

      const updatedPreview = [...importPreview];
      toast.info(`${targetCount} sual üçün AI təkmilləşdirilməsi aparılır (bu bölmə vaxt apara bilər)...`);

      for (let i = 0; i < targetCount; i++) {
        const q = updatedPreview[i];

        if (!q.explanation || !q.tags || q.tags.length === 0) {
          const result = await supabase.functions.invoke('enhance-question', {
            body: {
              questionText: q.question_text,
              action: 'analyze_full',
              options: Array.isArray(q.options) ? q.options : undefined,
              language: 'az',
            },
          });

          if (!result.error && result.data) {
            const data = result.data;
            updatedPreview[i] = {
              ...q,
              explanation: q.explanation ?? data.explanation,
              tags: q.tags?.length ? q.tags : data.tags,
              bloom_level: q.bloom_level ?? data.bloom_level,
              difficulty: q.difficulty ?? data.difficulty,
            };
          }
        }
      }

      setImportPreview(updatedPreview);
      toast.success('Toplu təkmilləşdirmə tamamlandı.');
    } catch (err) {
      console.error('Bulk enhance error:', err);
      toast.error('Toplu təkmilləşdirmə zamanı xəta baş verdi');
    } finally {
      setIsBulkEnhancing(false);
    }
  }, [importPreview]);

  const handleImport = useCallback(
    (onImport: (questions: Omit<QuestionBankItem, 'id' | 'created_at' | 'updated_at'>[]) => void): void => {
      const validQuestions = importPreview.filter(q => isValidQuestion(q, importWarnings));
      onImport(formatQuestionsForImport(validQuestions));
      resetImportState();
    },
    [importPreview, importWarnings, resetImportState],
  );

  return {
    importPreview,
    setImportPreview,
    importError,
    importWarnings,
    importProgress,
    importStats,
    isCheckingDuplicates,
    isBulkEnhancing,
    resetImportState,
    processFile,
    handleCheckDuplicates,
    handleBulkEnhance,
    handleImport,
  };
}
