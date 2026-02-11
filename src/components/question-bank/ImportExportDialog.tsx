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
import { Upload, Download, FileJson, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { QuestionBankItem } from '@/hooks/useQuestionBank';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

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
  options: string[] | null;
  correct_answer: string;
  explanation?: string;
  category?: string;
  difficulty?: string;
  bloom_level?: string;
  tags?: string[];
}

export function ImportExportDialog({
  open,
  onOpenChange,
  questions,
  onImport,
  isImporting,
}: ImportExportDialogProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [importError, setImportError] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<ParsedQuestion[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      if (extension === 'json') {
        parsed = parseJsonImport(content);
      } else if (extension === 'csv') {
        parsed = parseCsvImport(content);
      } else {
        throw new Error('Dəstəklənməyən fayl formatı. JSON və ya CSV istifadə edin.');
      }

      if (parsed.length === 0) {
        throw new Error('Faylda heç bir sual tapılmadı.');
      }

      setImportPreview(parsed);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Fayl oxunarkən xəta baş verdi');
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
    const formattedQuestions = importPreview.map((q) => ({
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation || null,
      category: q.category || null,
      difficulty: q.difficulty || null,
      bloom_level: q.bloom_level || null,
      tags: q.tags || null,
      user_id: null,
      source_document_id: null,
      question_image_url: null,
      option_images: null,
      media_type: null as 'image' | 'audio' | 'video' | null,
      media_url: null,
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
            Sualları JSON və ya CSV formatında import və ya export edin
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
          </TabsList>

          <TabsContent value="import" className="space-y-4 mt-4">
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="font-medium">Fayl seçin və ya buraya sürükləyin</p>
              <p className="text-sm text-muted-foreground mt-1">
                JSON və ya CSV formatı dəstəklənir
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.csv"
                onChange={handleFileSelect}
                className="hidden"
              />
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
