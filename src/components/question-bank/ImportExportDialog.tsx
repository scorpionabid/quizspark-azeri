import { useState, useRef } from 'react';
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
import { Upload, Download, FileJson, FileSpreadsheet, AlertCircle, CheckCircle, FileText, HelpCircle, FileDown, Loader2 } from 'lucide-react';
import { QuestionBankItem } from '@/hooks/useQuestionBank';
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
import { parseAiken, parseGIFT, parseMarkdown } from '@/utils/import-parsers';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAIImport } from '@/hooks/useAIImport';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Image as ImageIcon, X as CloseIcon } from 'lucide-react';

interface ImportExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions: QuestionBankItem[];
  onImport: (questions: Omit<QuestionBankItem, 'id' | 'created_at' | 'updated_at'>[]) => void;
  isImporting?: boolean;
}

interface ParsedQuestion {
  question_text: string;
  question_type: string;
  options: string[] | Record<string, string> | null;
  correct_answer: string;
  explanation?: string;
  category?: string;
  difficulty?: string;
  bloom_level?: string;
  tags?: string[];
  title?: string;
}

export function ImportExportDialog({
  open,
  onOpenChange,
  questions,
  onImport,
  isImporting,
}: ImportExportDialogProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [importFormat, setImportFormat] = useState<'json' | 'csv' | 'aiken' | 'gift' | 'markdown'>('json');
  const [importError, setImportError] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<ParsedQuestion[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [aiPasteText, setAiPasteText] = useState('');
  const [aiImageBase64, setAiImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const aiImageInputRef = useRef<HTMLInputElement>(null);
  const { importWithAI, isAiImporting } = useAIImport();

  const TEMPLATES: Record<string, string> = {
    aiken: `Sual mətni bura yazılır\nA) Birinci variant\nB) İkinci variant\nC) Üçüncü variant\nANSWER: A\nCATEGORY: Riyaziyyat\nDIFFICULTY: orta\nEXPLANATION: Sualın izahı bura yazılır\nTAGS: cəbr, tənliklər\nBLOOM: anlama`,
    gift: `// Sualın adı vacib deyil\n::Sualın Adı:: Sual mətni bura yazılır {\n  =Düzgün variant #İzah bura yazılır\n  ~Səhv variant 1\n  ~Səhv variant 2\n}`,
    markdown: `# Sual mətni bura yazılır\n- [x] Düzgün variant\n- [ ] Səhv variant 1\n- [ ] Səhv variant 2\n\nIzahat: Sualın izahı bura yazılır\nKateqoriya: Riyaziyyat\nÇətinlik: orta\nBloom: tətbiq\nTaqlar: həndəsə, sahə`,
    csv: `question_text,question_type,variant_a,variant_b,variant_c,variant_d,correct_answer,explanation,category,difficulty,bloom_level,tags\n"Sual mətni",multiple_choice,"Var A","Var B","Var C","Var D","Var A","İzah","Riyaziyyat","orta","anlama","tag1;tag2"`,
    json: `[\n  {\n    "question_text": "Sual mətni",\n    "question_type": "multiple_choice",\n    "options": ["A", "B", "C"],\n    "correct_answer": "A",\n    "explanation": "İzah",\n    "category": "Kateqoriya",\n    "difficulty": "orta",\n    "tags": ["tag1"]\n  }\n]`
  };

  const FORMAT_INFO: Record<string, string> = {
    json: "Mürəkkəb data strukturu üçün ən uyğun formatdır.",
    csv: "Excel və ya Google Sheets-də hazırlanmış suallar üçün.",
    aiken: "Sadə çoxseçimli suallar üçün sürətli format.",
    gift: "Moodle uyğunluğu və müxtəlif sual tipləri (MC, T/F, Short) üçün.",
    markdown: "Notepad və ya digər mətn redaktorlarında sual yazmaq üçün rahatdır."
  };

  const resetImportState = () => {
    setImportError(null);
    setImportPreview([]);
    setImportProgress(0);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    resetImportState();

    try {
      const content = await file.text();
      const extension = file.name.split('.').pop()?.toLowerCase();

      let parsed: ParsedQuestion[] = [];

      if (importFormat === 'json') {
        parsed = parseJsonImport(content);
      } else if (importFormat === 'csv') {
        parsed = parseCsvImport(content);
      } else if (importFormat === 'aiken') {
        parsed = parseAiken(content);
      } else if (importFormat === 'gift') {
        parsed = parseGIFT(content);
      } else if (importFormat === 'markdown') {
        parsed = parseMarkdown(content);
      } else {
        throw new Error('Seçilmiş format üçün parser tapılmadı.');
      }

      if (parsed.length === 0) {
        throw new Error('Faylda heç bir sual tapılmadı.');
      }

      setImportPreview(parsed);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Fayl oxunarkən xəta baş verdi');
    }
  };

  const handleAIImport = async () => {
    resetImportState();
    const parsed = await importWithAI(aiPasteText || null, aiImageBase64);
    if (parsed) {
      setImportPreview(parsed);
      toast.success(`${parsed.length} sual AI tərəfindən uğurla analiz edildi.`);
    }
  };

  const handleAiIconClick = () => {
    aiImageInputRef.current?.click();
  };

  const handleAiImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAiImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const parseJsonImport = (content: string): ParsedQuestion[] => {
    const data = JSON.parse(content);
    const items = Array.isArray(data) ? data : data.questions || [];

    return items.map((item: Record<string, unknown>) => ({
      question_text: String(item.question_text || item.question || ''),
      question_type: String(item.question_type || item.type || 'multiple_choice'),
      options: item.options as string[] || null,
      correct_answer: String(item.correct_answer || item.answer || ''),
      explanation: item.explanation ? String(item.explanation) : undefined,
      category: item.category ? String(item.category) : undefined,
      difficulty: item.difficulty ? String(item.difficulty) : 'orta',
      bloom_level: item.bloom_level ? String(item.bloom_level) : undefined,
      tags: Array.isArray(item.tags) ? item.tags.map(String) : undefined,
    })).filter((q: ParsedQuestion) => q.question_text && q.correct_answer);
  };

  const parseCsvImport = (content: string): ParsedQuestion[] => {
    const lines = content.split('\n').filter((line) => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const questions: ParsedQuestion[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      const row: Record<string, string> = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      // Map common CSV column names
      const question: ParsedQuestion = {
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

      // Parse options from variant columns
      const options: string[] = [];
      ['a', 'b', 'c', 'd', 'e', 'f'].forEach((letter) => {
        const optionValue = row[`variant_${letter}`] || row[`option_${letter}`] || row[letter];
        if (optionValue) options.push(optionValue);
      });

      if (options.length > 0) {
        question.options = options;
      }

      if (question.question_text && question.correct_answer) {
        questions.push(question);
      }
    }

    return questions;
  };

  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  };

  const handleImport = () => {
    const formattedQuestions: Omit<QuestionBankItem, 'id' | 'created_at' | 'updated_at'>[] = importPreview.map((q) => ({
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
      per_option_explanations: null,
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
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      category: q.category,
      difficulty: q.difficulty,
      bloom_level: q.bloom_level,
      tags: q.tags,
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    downloadFile(blob, `sual-banki-${new Date().toISOString().split('T')[0]}.json`);
  };

  const handleExportCsv = () => {
    const headers = [
      'question_text',
      'question_type',
      'variant_a',
      'variant_b',
      'variant_c',
      'variant_d',
      'correct_answer',
      'explanation',
      'category',
      'difficulty',
      'bloom_level',
      'tags',
    ];

    const rows = questions.map((q) => {
      const options = Array.isArray(q.options) ? q.options : Object.values(q.options || {});
      return [
        escapeCsvValue(q.question_text),
        q.question_type,
        escapeCsvValue(options[0] || ''),
        escapeCsvValue(options[1] || ''),
        escapeCsvValue(options[2] || ''),
        escapeCsvValue(options[3] || ''),
        escapeCsvValue(q.correct_answer),
        escapeCsvValue(q.explanation || ''),
        q.category || '',
        q.difficulty || '',
        q.bloom_level || '',
        q.tags?.join(';') || '',
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `sual-banki-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const escapeCsvValue = (value: string) => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const handleDownloadTemplate = () => {
    const content = TEMPLATES[importFormat];
    let type = 'text/plain';
    let ext = 'txt';

    if (importFormat === 'json') { type = 'application/json'; ext = 'json'; }
    else if (importFormat === 'csv') { type = 'text/csv'; ext = 'csv'; }
    else if (importFormat === 'markdown') { ext = 'md'; }

    const blob = new Blob([content], { type });
    downloadFile(blob, `sual-shabloni-${importFormat}.${ext}`);
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Import / Export</DialogTitle>
          <DialogDescription>
            Sualları JSON, CSV, Aiken, GIFT və ya Markdown formatında import və ya export edin
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'import' | 'export')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </TabsTrigger>
            <TabsTrigger value="export">
              <Download className="h-4 w-4 mr-2" />
              Export
            </TabsTrigger>
            <TabsTrigger value="ai_import">
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              Ağıllı Import (AI)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-end gap-3">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">Format Seçin</label>
                  <Select value={importFormat} onValueChange={(v: string) => setImportFormat(v as unknown as 'json' | 'csv' | 'aiken' | 'gift' | 'markdown')}>
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
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{FORMAT_INFO[importFormat]}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span>Seçilən format: <strong>{importFormat.toUpperCase()}</strong></span>
              </div>

              <div
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="font-medium">Fayl seçin və ya buraya sürükləyin</p>
                <p className="text-sm text-muted-foreground mt-1">
                  JSON, CSV, Aiken, GIFT və ya Markdown formatı dəstəklənir
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            {importError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{importError}</AlertDescription>
              </Alert>
            )}

            {importPreview.length > 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  {importPreview.length} sual oxundu və import üçün hazırdır
                </AlertDescription>
              </Alert>
            )}

            {isImporting && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Import edilir...</p>
                <Progress value={importProgress} />
              </div>
            )}

            {importPreview.length > 0 && (
              <Button
                onClick={handleImport}
                disabled={isImporting}
                className="w-full"
              >
                {isImporting ? 'Import edilir...' : `${importPreview.length} Sualı Import Et`}
              </Button>
            )}
          </TabsContent>

          <TabsContent value="export" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Hal-hazırda {questions.length} sual export üçün mövcuddur
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleExportJson}
                disabled={questions.length === 0}
                className="h-auto py-4 flex-col"
              >
                <FileJson className="h-8 w-8 mb-2" />
                <span>JSON Export</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Tam data strukturu
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={handleExportCsv}
                disabled={questions.length === 0}
                className="h-auto py-4 flex-col"
              >
                <FileSpreadsheet className="h-8 w-8 mb-2" />
                <span>CSV Export</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Excel uyğun format
                </span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="ai_import" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Mətni yapışdırın və ya şəkil yükləyin</label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setAiPasteText(''); setAiImageBase64(null); }}
                    className="text-xs h-8"
                  >
                    Təmizlə
                  </Button>
                </div>
              </div>

              <Textarea
                placeholder="Məsələn: 1. Sual? A) Var1 B) Var2 ANSWER: A ..."
                className="min-h-[150px] font-mono text-sm"
                value={aiPasteText}
                onChange={(e) => setAiPasteText(e.target.value)}
              />

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-dashed h-20 flex-col gap-2"
                  onClick={handleAiIconClick}
                >
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs">Şəkildən Oxu (OCR)</span>
                </Button>
                <input
                  type="file"
                  ref={aiImageInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleAiImageSelect}
                />

                {aiImageBase64 && (
                  <div className="relative w-20 h-20 rounded border overflow-hidden bg-muted group">
                    <img src={aiImageBase64} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setAiImageBase64(null)}
                      className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <CloseIcon className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              {importPreview.length === 0 && (
                <Button
                  onClick={handleAIImport}
                  disabled={isAiImporting || (!aiPasteText && !aiImageBase64)}
                  className="w-full premium-gradient border-0 text-white font-bold"
                >
                  {isAiImporting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      AI Analiz Edir...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Analiz Et və Sualları Çıxar
                    </>
                  )}
                </Button>
              )}

              {importPreview.length > 0 && (
                <div className="space-y-3">
                  <Alert className="bg-primary/5 border-primary/20">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-primary font-medium">
                      AI {importPreview.length} sualı uğurla strukturlaşdırdı.
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={handleImport}
                    disabled={isImporting}
                    className="w-full"
                  >
                    {isImporting ? 'Import edilir...' : `${importPreview.length} Sualı Banka Əlavə Et`}
                  </Button>
                </div>
              )}
            </div>

            <div className="text-[10px] text-muted-foreground text-center bg-muted/30 p-2 rounded">
              Qeyd: AI mürəkkəb formatları, əlyazmaları və ya fotoşəkilləri analiz edə bilər. Düzgünlüyü yoxlamağı unutmayın.
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Bağla
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
