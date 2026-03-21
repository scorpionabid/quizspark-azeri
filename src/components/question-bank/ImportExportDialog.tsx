import { useState } from 'react';
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
import { Upload, Download, Sparkles } from 'lucide-react';
import { QuestionBankItem } from '@/hooks/useQuestionBank';
import { useImportPreview } from '@/hooks/useImportPreview';
import { ImportTab } from './import-export/ImportTab';
import { ExportTab } from './import-export/ExportTab';
import { AIImportTab } from './import-export/AIImportTab';

interface ImportExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions: QuestionBankItem[];
  onImport: (questions: Omit<QuestionBankItem, 'id' | 'created_at' | 'updated_at'>[]) => void;
  isImporting?: boolean;
}

export function ImportExportDialog({
  open,
  onOpenChange,
  questions,
  onImport,
  isImporting,
}: ImportExportDialogProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'export' | 'ai_import'>('import');

  const {
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
  } = useImportPreview();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import / Export</DialogTitle>
          <DialogDescription>
            Sualları müxtəlif formatlarda import/export edin və ya AI ilə sürətli analiz aparın
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
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

          <TabsContent value="import">
            <ImportTab
              importPreview={importPreview}
              importError={importError}
              importWarnings={importWarnings}
              importStats={importStats}
              importProgress={importProgress}
              isCheckingDuplicates={isCheckingDuplicates}
              isBulkEnhancing={isBulkEnhancing}
              isImporting={isImporting}
              onProcessFile={processFile}
              onCheckDuplicates={handleCheckDuplicates}
              onBulkEnhance={handleBulkEnhance}
              onImport={() => handleImport(onImport)}
              onPreviewChange={setImportPreview}
            />
          </TabsContent>

          <TabsContent value="export">
            <ExportTab questions={questions} />
          </TabsContent>

          <TabsContent value="ai_import">
            <AIImportTab
              importPreview={importPreview}
              isImporting={isImporting}
              isCheckingDuplicates={isCheckingDuplicates}
              isBulkEnhancing={isBulkEnhancing}
              onCheckDuplicates={handleCheckDuplicates}
              onBulkEnhance={handleBulkEnhance}
              onImport={() => handleImport(onImport)}
              onPreviewChange={setImportPreview}
              onResetImport={resetImportState}
            />
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
