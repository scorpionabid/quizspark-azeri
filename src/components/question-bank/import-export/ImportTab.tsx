import { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Upload, AlertCircle, FileDown, HelpCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParseWarning } from '@/utils/import-parsers';
import { ImportPreviewTable } from '@/components/question-bank/ImportPreviewTable';
import { PreviewQuestion } from '@/utils/parsers/types';
import { FORMAT_INFO, TEMPLATES, ImportFormat } from './constants';
import { downloadFile } from './utils';

interface ImportTabProps {
  importPreview: PreviewQuestion[];
  importError: string | null;
  importWarnings: ParseWarning[];
  importStats: { total: number; invalid: number } | null;
  importProgress: number;
  isCheckingDuplicates: boolean;
  isBulkEnhancing: boolean;
  isImporting?: boolean;
  onProcessFile: (file: File, format: ImportFormat) => Promise<void>;
  onCheckDuplicates: () => Promise<void>;
  onBulkEnhance: () => Promise<void>;
  onImport: () => void;
  onPreviewChange: (questions: PreviewQuestion[]) => void;
}

export function ImportTab({
  importPreview,
  importError,
  importWarnings,
  importStats,
  importProgress,
  isCheckingDuplicates,
  isBulkEnhancing,
  isImporting,
  onProcessFile,
  onCheckDuplicates,
  onBulkEnhance,
  onImport,
  onPreviewChange,
}: ImportTabProps) {
  const [importFormat, setImportFormat] = useState<ImportFormat>('markdown');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await onProcessFile(file, importFormat);
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDraggingOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) await onProcessFile(file, importFormat);
    },
    [onProcessFile, importFormat],
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDownloadTemplate = () => {
    const content = TEMPLATES[importFormat];
    let type = 'text/plain';
    let ext = 'txt';
    if (importFormat === 'json') { type = 'application/json'; ext = 'json'; }
    else if (importFormat === 'csv') { type = 'text/csv'; ext = 'csv'; }
    else if (importFormat === 'markdown') ext = 'md';
    else if (importFormat === 'moodle_xml') { type = 'application/xml'; ext = 'xml'; }
    downloadFile(new Blob([content], { type }), `sual-shabloni-${importFormat}.${ext}`);
  };

  return (
    <div className="flex flex-col h-full space-y-4 mt-4">
      <div className="flex items-end gap-3">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Format Seçin</label>
          <Select
            value={importFormat}
            onValueChange={(v: string) => setImportFormat(v as ImportFormat)}
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
              <SelectItem value="moodle_xml">Moodle XML (.xml)</SelectItem>
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
        <span>
          Seçilən format: <strong>{importFormat.toUpperCase()}</strong>
        </span>
      </div>

      {/* Drag & Drop zone */}
      <motion.div
        animate={{ borderColor: isDraggingOver ? 'hsl(var(--primary))' : 'hsl(var(--border))' }}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDraggingOver ? 'bg-primary/5' : 'hover:border-primary/50'}`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDraggingOver(false)}
      >
        <motion.div
          animate={{ scale: isDraggingOver ? 1.12 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Upload
            className={`h-10 w-10 mx-auto mb-2 ${isDraggingOver ? 'text-primary' : 'text-muted-foreground'}`}
          />
        </motion.div>
        <p className="font-medium">
          {isDraggingOver ? 'Faylı buraxın!' : 'Fayl seçin və ya buraya sürükləyin'}
        </p>
        <p className="text-sm text-muted-foreground mt-1">JSON, CSV, Aiken, GIFT, Markdown və ya Moodle XML</p>
        <input ref={fileInputRef} type="file" accept=".json,.csv,.txt,.md,.xml" onChange={handleFileSelect} className="hidden" />
      </motion.div>

      {importError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{importError}</AlertDescription>
        </Alert>
      )}

      {importStats && importStats.invalid > 0 && (
        <Alert variant="destructive" className="py-2 shrink-0">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>{importStats.invalid} sual</strong> xətalıdır (qırmızı sətirlər) və avtomatik kənarlaşdırılacaq. Onları idxal etmək üçün zəhmət olmasa ləğv edib cədvəldə düzəldin.
          </AlertDescription>
        </Alert>
      )}

      <AnimatePresence>
        {importPreview.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="flex-1 flex flex-col min-h-0 space-y-3"
          >
            <ImportPreviewTable
              questions={importPreview}
              onChange={onPreviewChange}
              onCheckDuplicates={onCheckDuplicates}
              isCheckingDuplicates={isCheckingDuplicates}
              onBulkEnhance={onBulkEnhance}
              isBulkEnhancing={isBulkEnhancing}
              warnings={importWarnings}
            />
            {isImporting && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Import edilir...</p>
                <Progress value={importProgress} />
              </div>
            )}
            <Button onClick={onImport} disabled={isImporting} className="w-full">
              {isImporting ? 'Import edilir...' : `${importPreview.length} Sualı Import Et`}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
