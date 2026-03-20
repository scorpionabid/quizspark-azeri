import { useState, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, Download, FileJson, FileSpreadsheet, AlertCircle, 
  FileText, HelpCircle, FileDown, Loader2, AlertTriangle, 
  Sparkles, Image as ImageIcon, X as CloseIcon 
} from 'lucide-react';
import { QuestionBankItem } from '@/hooks/useQuestionBank';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  parseAiken,
  parseGIFT,
  parseMarkdownFull,
  ParseWarning,
  readFileWithEncoding,
  detectFormat,
} from '@/utils/import-parsers';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAIImport } from '@/hooks/useAIImport';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { ImportPreviewTable, PreviewQuestion } from './ImportPreviewTable';

interface ImportExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions: QuestionBankItem[];
  onImport: (questions: Omit<QuestionBankItem, 'id' | 'created_at' | 'updated_at'>[]) => void;
  isImporting?: boolean;
}

const TEMPLATES: Record<string, string> = {
  aiken: `Sual mətni bura yazılır\nA) Birinci variant\nB) İkinci variant\nC) Üçüncü variant\nANSWER: A\nCATEGORY: Riyaziyyat\nDIFFICULTY: orta\nEXPLANATION: Sualın izahı bura yazılır\nTAGS: cəbr, tənliklər\nBLOOM: anlama`,
  gift: `// Sualın adı vacib deyil\n::Sualın Adı:: Sual mətni bura yazılır {\n  =Düzgün variant #İzah bura yazılır\n  ~Səhv variant 1\n  ~Səhv variant 2\n}`,
  markdown: `### Format 1: Çoxseçimli (Həmçinin Çoxlu Cavab)
# Sual mətni bura yazılır
A) Birinci variant # Bu variantın izahı
B) İkinci variant # Bu variantın izahı
C) Düzgün variant # Düzgün cavabın izahı
D) Dördüncü variant

Cavab: C
Izahat: Sualın ümumi izahı bura yazılır
Kateqoriya: Riyaziyyat
Çətinlik: orta
Bloom: anlama
Taqlar: cəbr, tənliklər

---

### Format 2: Uyğunlaşdırma (Matching)
Tip: matching
Əsərləri müəllifləri ilə uyğunlaşdırın:
Dədə Qorqud → Türk xalq dastanı
Ana → Maksim Gorki
Don Kixot → Servantes

Kateqoriya: Ədəbiyyat
Çətinlik: orta

---

### Format 3: Boşluq Doldur (Fill in the Blank)
Tip: fill_blank
Azərbaycanın paytaxtı ___ şəhədir.

Cavab: Bakı
Kateqoriya: Coğrafiya
Çətinlik: asan

---

### Format 4: Ardıcıllıq (Ordering)
Tip: ordering
Hadisələri xronoloji ardıcıllıqla sıralayın:
- Birinci Dünya Müharibəsi (1914)
- Sovet İttifaqının yaranması (1922)
- Azərbaycanın müstəqillik elanı (1991)

Kateqoriya: Tarix
Çətinlik: orta

---

### Format 5: Doğru/Yanlış və ya Qısa Cavab
Azərbaycanın paytaxtı Bakı şəhəridir?
A) Doğru
B) Yanlış
Cavab: A`,
  csv: `question_text,question_type,variant_a,variant_b,variant_c,variant_d,correct_answer,explanation,category,difficulty,bloom_level,tags\n"Sual mətni",multiple_choice,"Var A","Var B","Var C","Var D","Var A","İzah","Riyaziyyat","orta","anlama","tag1;tag2"`,
  json: `[\n  {\n    "question_text": "Sual mətni",\n    "question_type": "multiple_choice",\n    "options": ["A", "B", "C"],\n    "correct_answer": "A",\n    "explanation": "İzah",\n    "category": "Kateqoriya",\n    "difficulty": "orta",\n    "tags": ["tag1"]\n  }\n]`
};

const FORMAT_INFO: Record<string, string> = {
  json: "Mürəkkəb data strukturu üçün ən uyğun formatdır.",
  csv: "Excel və ya Google Sheets-də hazırlanmış suallar üçün.",
  aiken: "Sadə çoxseçimli suallar üçün sürətli format.",
  gift: "Moodle uyğunluğu və müxtəlif sual tipləri (MC, T/F, Short) üçün.",
  markdown: "Ən çevik format — 8 fərqli üslub dəstəklənir: Çoxseçimli (Format 1), Çoxlu Cavab (Format 2), Doğru/Yanlış (Format 3), Qısa cavab (Format 4), Uyğunlaşdırma (Format 5), Boşluq doldur (Format 6), Ardıcıllıq (Format 7), Kod sualı (Format 8). Şablonu yükləyin."
};

const AI_STAGE_LABELS: Record<string, string> = {
  uploading: 'Yüklənir...',
  analyzing: 'AI analiz edir...',
  structuring: 'Suallar strukturlaşdırılır...',
  done: 'Tamamlandı!',
  error: 'Xəta baş verdi',
};

export function ImportExportDialog({
  open,
  onOpenChange,
  questions,
  onImport,
  isImporting,
}: ImportExportDialogProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'export' | 'ai_import'>('import');
  const [importFormat, setImportFormat] = useState<'json' | 'csv' | 'aiken' | 'gift' | 'markdown'>('markdown');
  const [importError, setImportError] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<PreviewQuestion[]>([]);
  const [importWarnings, setImportWarnings] = useState<ParseWarning[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  // M2.2: İdxal statistikası — neçəsi valid, neçəsi xətalı süzüldü
  const [importStats, setImportStats] = useState<{ total: number; invalid: number } | null>(null);
  const [aiPasteText, setAiPasteText] = useState('');
  const [aiImageBase64, setAiImageBase64] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const aiImageInputRef = useRef<HTMLInputElement>(null);
  const { importWithAI, isAiImporting, aiStage, aiProgress } = useAIImport();

  const resetImportState = () => {
    setImportError(null);
    setImportPreview([]);
    setImportWarnings([]);
    setImportProgress(0);
    setImportStats(null);
  };

  const processFile = useCallback(async (file: File) => {
    resetImportState();
    try {
      // Encoding-aware oxuma (UTF-8, UTF-16, windows-1254 dəstəyi)
      const content = await readFileWithEncoding(file);

      // Format auto-detect — yalnız 'markdown' seçilmişsə da digər formatları yoxla
      const detected = detectFormat(content);
      if (detected !== importFormat) {
        setImportFormat(detected);
      }

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
      } else {
        const result = parseMarkdownFull(content);
        parsed = result.questions as PreviewQuestion[];
        setImportWarnings(result.warnings);
        // Yalnız 'error' səviyyəli olanlar mütləq süzülməli/düzəldilməli sayılır
        invalidCount = result.warnings.filter(w => w.severity === 'error').length;
      }

      if (parsed.length === 0) throw new Error('Faylda heç bir sual tapılmadı. Zəhmət olmasa formatın düzgün olmasına əmin olun.');
      setImportStats({ total: parsed.length + invalidCount, invalid: invalidCount });
      setImportPreview(parsed);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Fayl oxunarkən xəta baş verdi');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importFormat]);

  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);

  const handleCheckDuplicates = async () => {
    if (importPreview.length === 0) return;
    setIsCheckingDuplicates(true);
    
    try {
      const updatedPreview = [...importPreview];
      const checkCount = Math.min(importPreview.length, 20);
      toast.info(`${checkCount} sual üçün dublikat yoxlanışı aparılır...`);

      for (let i = 0; i < checkCount; i++) {
        const q = updatedPreview[i];
        const { data, error } = await supabase.functions.invoke('question-bank', {
          body: {
            action: 'search',
            searchQuery: q.question_text,
            filters: { type: q.question_type }
          }
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
  };

  const [isBulkEnhancing, setIsBulkEnhancing] = useState(false);

  const handleBulkEnhance = async () => {
    if (importPreview.length === 0) return;
    setIsBulkEnhancing(true);
    
    try {
      const updatedPreview = [...importPreview];
      const targetCount = Math.min(importPreview.length, 10); // Limit to 10 for now
      toast.info(`${targetCount} sual üçün AI təkmilləşdirilməsi aparılır...`);

      for (let i = 0; i < targetCount; i++) {
        const q = updatedPreview[i];
        
        // Only enhance if missing explanation or tags
        if (!q.explanation || !q.tags || q.tags.length === 0) {
          const result = await supabase.functions.invoke('enhance-question', {
            body: {
              questionText: q.question_text,
              action: 'analyze_full',
              options: Array.isArray(q.options) ? q.options : undefined,
              language: 'az'
            }
          });

          if (!result.error && result.data) {
            const data = result.data;
            updatedPreview[i] = {
              ...q,
              explanation: q.explanation || data.explanation,
              tags: q.tags?.length ? q.tags : data.tags,
              bloom_level: q.bloom_level || data.bloom_level,
              difficulty: q.difficulty || data.difficulty
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
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);
  };

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await processFile(file);
  }, [processFile]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => setIsDraggingOver(false);

  const handleAIImport = async () => {
    resetImportState();
    const parsed = await importWithAI(aiPasteText || null, aiImageBase64);
    if (parsed) {
      setImportPreview(parsed as PreviewQuestion[]);
      toast.success(`${parsed.length} sual AI tərəfindən uğurla analiz edildi.`);
    }
  };

  const handleAiIconClick = () => aiImageInputRef.current?.click();

  const handleAiImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAiImageBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const parseJsonImport = (content: string): { questions: PreviewQuestion[]; invalidCount: number } => {
    const data = JSON.parse(content);
    const items = Array.isArray(data) ? data : data.questions || [];
    const all: PreviewQuestion[] = items.map((item: Record<string, unknown>) => ({
      question_text: String(item.question_text || item.question || ''),
      question_type: String(item.question_type || item.type || 'multiple_choice'),
      options: item.options as string[] || null,
      correct_answer: String(item.correct_answer || item.answer || ''),
      explanation: item.explanation ? String(item.explanation) : undefined,
      category: item.category ? String(item.category) : undefined,
      difficulty: item.difficulty ? String(item.difficulty) : 'orta',
      bloom_level: item.bloom_level ? String(item.bloom_level) : undefined,
      tags: Array.isArray(item.tags) ? item.tags.map(String) : undefined,
    }));
    const questions = all.filter((q) => q.question_text && q.correct_answer);
    return { questions, invalidCount: all.length - questions.length };
  };

  const parseCsvImport = (content: string): { questions: PreviewQuestion[]; invalidCount: number } => {
    const lines = content.split('\n').filter((line) => line.trim());
    if (lines.length < 2) return { questions: [], invalidCount: 0 };
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const valid: PreviewQuestion[] = [];
    let invalidCount = 0;
    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      const row: Record<string, string> = {};
      headers.forEach((header, index) => { row[header] = values[index] || ''; });
      const question: PreviewQuestion = {
        question_text: row.question_text || row.question || row.sual || '',
        question_type: row.question_type || row.type || row.tip || 'multiple_choice',
        correct_answer: row.correct_answer || row.answer || row.cavab || row.duzgun_cavab || '',
        options: null,
        explanation: row.explanation || row.izahat || undefined,
        category: row.category || row.kateqoriya || undefined,
        difficulty: row.difficulty || row.cetinlik || 'orta',
        bloom_level: row.bloom_level || undefined,
        tags: row.tags ? row.tags.split(';').map((t) => t.trim()) : undefined,
      };
      const options: string[] = [];
      ['a', 'b', 'c', 'd', 'e', 'f'].forEach((letter) => {
        const optionValue = row[`variant_${letter}`] || row[`option_${letter}`] || row[letter];
        if (optionValue) options.push(optionValue);
      });
      if (options.length > 0) question.options = options;
      if (question.question_text && question.correct_answer) {
        valid.push(question);
      } else {
        invalidCount++;
      }
    }
    return { questions: valid, invalidCount };
  };

  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') inQuotes = !inQuotes;
      else if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
      else current += char;
    }
    result.push(current.trim());
    return result;
  };

  const handleImport = () => {
    const formattedQuestions: Omit<QuestionBankItem, 'id' | 'created_at' | 'updated_at'>[] =
      importPreview.map((q) => ({
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation || null,
        category: q.category || null,
        difficulty: q.difficulty || null,
        bloom_level: q.bloom_level || null,
        tags: q.tags || null,
        title: q.title || null,
        user_id: null,
        source_document_id: null,
        question_image_url: null,
        option_images: null,
        media_type: null as 'image' | 'audio' | 'video' | null,
        media_url: null,
        weight: null,
        hint: null,
        time_limit: null,
        per_option_explanations: q.per_option_explanations || null,
        video_url: null,
        video_start_time: null,
        video_end_time: null,
        model_3d_url: null,
        model_3d_type: null,
        hotspot_data: null,
        matching_pairs: null,
        sequence_items: null,
        fill_blank_template: null,
        numerical_answer: null,
        numerical_tolerance: null,
        feedback_enabled: null,
        quality_score: null,
        usage_count: null,
      }));
    onImport(formattedQuestions);
    resetImportState();
  };

  const handleExportJson = () => {
    const exportData = questions.map((q) => ({
      question_text: q.question_text, question_type: q.question_type, options: q.options,
      correct_answer: q.correct_answer, explanation: q.explanation, category: q.category,
      difficulty: q.difficulty, bloom_level: q.bloom_level, tags: q.tags,
    }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    downloadFile(blob, `sual-banki-${new Date().toISOString().split('T')[0]}.json`);
  };

  const handleExportCsv = () => {
    const headers = ['question_text', 'question_type', 'variant_a', 'variant_b', 'variant_c',
      'variant_d', 'correct_answer', 'explanation', 'category', 'difficulty', 'bloom_level', 'tags'];
    const rows = questions.map((q) => {
      const options = Array.isArray(q.options) ? q.options : Object.values(q.options || {});
      return [escapeCsvValue(q.question_text), q.question_type, escapeCsvValue(options[0] || ''),
        escapeCsvValue(options[1] || ''), escapeCsvValue(options[2] || ''), escapeCsvValue(options[3] || ''),
        escapeCsvValue(q.correct_answer), escapeCsvValue(q.explanation || ''), q.category || '',
        q.difficulty || '', q.bloom_level || '', q.tags?.join(';') || ''].join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `sual-banki-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const escapeCsvValue = (value: string) => {
    if (value.includes(',') || value.includes('"') || value.includes('\n'))
      return `"${value.replace(/"/g, '""')}"`;
    return value;
  };

  const handleDownloadTemplate = () => {
    const content = TEMPLATES[importFormat];
    let type = 'text/plain'; let ext = 'txt';
    if (importFormat === 'json') { type = 'application/json'; ext = 'json'; }
    else if (importFormat === 'csv') { type = 'text/csv'; ext = 'csv'; }
    else if (importFormat === 'markdown') ext = 'md';
    const blob = new Blob([content], { type });
    downloadFile(blob, `sual-shabloni-${importFormat}.${ext}`);
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import / Export</DialogTitle>
          <DialogDescription>
            Sualları müxtəlif formatlarda import/export edin və ya AI ilə sürətli analiz aparın
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'import' | 'export' | 'ai_import')}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="import">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </TabsTrigger>
            <TabsTrigger value="export">
              <Download className="h-4 w-4 mr-2" />
              Export
            </TabsTrigger>
            <TabsTrigger value="ai_import" className="gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Ağıllı Import (AI)
            </TabsTrigger>
          </TabsList>

          {/* ─── MANUAL IMPORT ─── */}
          <TabsContent value="import" className="space-y-4 mt-4">
            <div className="flex items-end gap-3">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Format Seçin</label>
                <Select
                  value={importFormat}
                  onValueChange={(v: string) => {
                    setImportFormat(v as 'json' | 'csv' | 'aiken' | 'gift' | 'markdown');
                    resetImportState();
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Formatı seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV (Excel)</SelectItem>
                    <SelectItem value="aiken">Aiken (.txt)</SelectItem>
                    <SelectItem value="gift">GIFT (.txt)</SelectItem>
                    <SelectItem value="markdown">Markdown (.md)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={handleDownloadTemplate} title="Şablonu Yüklə">
                <FileDown className="h-4 w-4 mr-2" />
                Şablon
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 bg-muted/50 rounded">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger><HelpCircle className="h-3 w-3" /></TooltipTrigger>
                  <TooltipContent><p className="max-w-xs">{FORMAT_INFO[importFormat]}</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span>Seçilən format: <strong>{importFormat.toUpperCase()}</strong></span>
            </div>

            {/* Drag & Drop zone */}
            <motion.div
              animate={{ borderColor: isDraggingOver ? 'hsl(var(--primary))' : 'hsl(var(--border))' }}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDraggingOver ? 'bg-primary/5' : 'hover:border-primary/50'}`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <motion.div animate={{ scale: isDraggingOver ? 1.12 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <Upload className={`h-10 w-10 mx-auto mb-2 ${isDraggingOver ? 'text-primary' : 'text-muted-foreground'}`} />
              </motion.div>
              <p className="font-medium">
                {isDraggingOver ? 'Faylı buraxın!' : 'Fayl seçin və ya buraya sürükləyin'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                JSON, CSV, Aiken, GIFT və ya Markdown
              </p>
              <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" />
            </motion.div>

            {importError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{importError}</AlertDescription>
              </Alert>
            )}

            {/* M2.2: İdxal statistikası */}
            {importStats && importStats.invalid > 0 && (
              <Alert variant="destructive" className="py-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>{importStats.invalid}</strong> sual xətalı olduğu üçün (boş mətn və ya cavab) süzüldü.{' '}
                  <strong>{importStats.total - importStats.invalid}</strong> sual idxal üçün hazırdır.
                </AlertDescription>
              </Alert>
            )}

            <AnimatePresence>
              {importPreview.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  className="space-y-3"
                >
                  <ImportPreviewTable
                    questions={importPreview}
                    onChange={setImportPreview}
                    onCheckDuplicates={handleCheckDuplicates}
                    isCheckingDuplicates={isCheckingDuplicates}
                    onBulkEnhance={handleBulkEnhance}
                    isBulkEnhancing={isBulkEnhancing}
                    warnings={importWarnings}
                  />
                  {isImporting && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Import edilir...</p>
                      <Progress value={importProgress} />
                    </div>
                  )}
                  <Button onClick={handleImport} disabled={isImporting} className="w-full">
                    {isImporting ? 'Import edilir...' : `${importPreview.length} Sualı Import Et`}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* ─── EXPORT ─── */}
          <TabsContent value="export" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Hal-hazırda <strong>{questions.length}</strong> sual export üçün mövcuddur
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleExportJson} disabled={questions.length === 0} className="h-auto py-4 flex-col">
                <FileJson className="h-8 w-8 mb-2" />
                <span>JSON Export</span>
                <span className="text-xs text-muted-foreground mt-1">Tam data strukturu</span>
              </Button>
              <Button variant="outline" onClick={handleExportCsv} disabled={questions.length === 0} className="h-auto py-4 flex-col">
                <FileSpreadsheet className="h-8 w-8 mb-2" />
                <span>CSV Export</span>
                <span className="text-xs text-muted-foreground mt-1">Excel uyğun format</span>
              </Button>
            </div>
          </TabsContent>

          {/* ─── AI IMPORT ─── */}
          <TabsContent value="ai_import" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Mətni yapışdırın və ya şəkil yükləyin</label>
                <Button variant="outline" size="sm" className="text-xs h-8"
                  onClick={() => { setAiPasteText(''); setAiImageBase64(null); setImportPreview([]); }}>
                  Təmizlə
                </Button>
              </div>

              <Textarea
                placeholder="Məsələn: 1. Sual? A) Var1 B) Var2 ANSWER: A ..."
                className="min-h-[140px] font-mono text-sm resize-none"
                value={aiPasteText}
                onChange={(e) => setAiPasteText(e.target.value)}
              />

              {/* Image upload */}
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="flex-1 border-dashed h-20 flex-col gap-2" onClick={handleAiIconClick}>
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs">Şəkildən Oxu (OCR)</span>
                </Button>
                <input type="file" ref={aiImageInputRef} className="hidden" accept="image/*" onChange={handleAiImageSelect} />

                <AnimatePresence>
                  {aiImageBase64 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative w-20 h-20 rounded border overflow-hidden bg-muted group"
                    >
                      <img src={aiImageBase64} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setAiImageBase64(null)}
                        className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <CloseIcon className="h-3 w-3" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* AI Progress */}
              <AnimatePresence>
                {isAiImporting && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        {AI_STAGE_LABELS[aiStage] ?? 'Emal edilir...'}
                      </span>
                      <span>{aiProgress}%</span>
                    </div>
                    <Progress value={aiProgress} className="h-1.5" />
                  </motion.div>
                )}
              </AnimatePresence>

              {importPreview.length === 0 && (
                <Button
                  onClick={handleAIImport}
                  disabled={isAiImporting || (!aiPasteText && !aiImageBase64)}
                  className="w-full premium-gradient border-0 text-white font-bold"
                >
                  {isAiImporting ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />AI Analiz Edir...</>
                  ) : (
                    <><Sparkles className="h-4 w-4 mr-2" />Analiz Et və Sualları Çıxar</>
                  )}
                </Button>
              )}

              <AnimatePresence>
                {importPreview.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    className="space-y-3"
                  >
                    <ImportPreviewTable 
                      questions={importPreview} 
                      onChange={setImportPreview}
                      onCheckDuplicates={handleCheckDuplicates}
                      isCheckingDuplicates={isCheckingDuplicates}
                      onBulkEnhance={handleBulkEnhance}
                      isBulkEnhancing={isBulkEnhancing}
                    />
                    <Button onClick={handleImport} disabled={isImporting} className="w-full">
                      {isImporting ? 'Import edilir...' : `${importPreview.length} Sualı Banka Əlavə Et`}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="text-[10px] text-muted-foreground text-center bg-muted/30 p-2 rounded">
              Qeyd: AI mürəkkəb formatları, əlyazmaları və ya fotoşəkilləri analiz edə bilər. Düzgünlüyü yoxlamağı unutmayın.
            </p>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Bağla</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
