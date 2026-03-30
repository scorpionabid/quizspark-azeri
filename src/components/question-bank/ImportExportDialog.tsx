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
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] flex flex-col p-4 md:p-6 overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle>Import / Export</DialogTitle>
          <DialogDescription>
            Sualları müxtəlif formatlarda import/export edin və ya AI ilə sürətli analiz aparın
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="flex flex-col flex-1 overflow-hidden">
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

          <TabsContent value="import" className="flex-1 overflow-y-auto">
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

          <TabsContent value="export" className="flex-1 overflow-y-auto">
            <ExportTab questions={questions} />
          </TabsContent>

          <TabsContent value="ai_import" className="flex-1 overflow-y-auto">
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
