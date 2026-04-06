import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useImportPreview } from '@/hooks/useImportPreview';
import { ImportTab } from '@/components/question-bank/import-export/ImportTab';
import { toast } from 'sonner';
import { PreviewQuestion } from '@/utils/parsers/types';

interface DirectImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (questions: PreviewQuestion[]) => void;
}

export function DirectImportDialog({ open, onOpenChange, onImport }: DirectImportDialogProps) {
  const importState = useImportPreview();

  const handleImport = () => {
    if (importState.importPreview.length === 0) {
      toast.error("İdxal ediləcək düzgün sual tapılmadı.");
      return;
    }

    onImport(importState.importPreview);
    toast.success(`${importState.importPreview.length} sual əlavə edildi`);
    importState.resetImportState();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
        onOpenChange(val);
        if (!val) importState.resetImportState();
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Fayldan İdxal</DialogTitle>
          <DialogDescription>
            Sistemə fərqli formatlarda (JSON, CSV, Markdown, Moodle XML) fayl yükləyin və birbaşa quizzə əlavə edin.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto mt-4 px-1">
            <ImportTab
            importPreview={importState.importPreview}
            importError={importState.importError}
            importWarnings={importState.importWarnings}
            importStats={importState.importStats}
            importProgress={importState.importProgress}
            isCheckingDuplicates={importState.isCheckingDuplicates}
            isBulkEnhancing={importState.isBulkEnhancing}
            isImporting={false}
            onProcessFile={importState.processFile}
            onCheckDuplicates={importState.handleCheckDuplicates}
            onBulkEnhance={importState.handleBulkEnhance}
            onImport={handleImport}
            onPreviewChange={importState.setImportPreview}
            />
        </div>
      </DialogContent>
    </Dialog>
  );
}
