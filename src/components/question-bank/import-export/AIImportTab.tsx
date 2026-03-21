import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Loader2, Sparkles, Image as ImageIcon, X as CloseIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAIImport } from '@/hooks/useAIImport';
import { ImportPreviewTable } from '@/components/question-bank/ImportPreviewTable';
import { PreviewQuestion } from '@/utils/parsers/types';
import { AI_STAGE_LABELS } from './constants';

interface AIImportTabProps {
  importPreview: PreviewQuestion[];
  isImporting?: boolean;
  isCheckingDuplicates: boolean;
  isBulkEnhancing: boolean;
  onCheckDuplicates: () => Promise<void>;
  onBulkEnhance: () => Promise<void>;
  onImport: () => void;
  onPreviewChange: (questions: PreviewQuestion[]) => void;
  onResetImport: () => void;
}

export function AIImportTab({
  importPreview,
  isImporting,
  isCheckingDuplicates,
  isBulkEnhancing,
  onCheckDuplicates,
  onBulkEnhance,
  onImport,
  onPreviewChange,
  onResetImport,
}: AIImportTabProps) {
  const [aiPasteText, setAiPasteText] = useState('');
  const [aiImageBase64, setAiImageBase64] = useState<string | null>(null);
  const aiImageInputRef = useRef<HTMLInputElement>(null);
  const { importWithAI, isAiImporting, aiStage, aiProgress } = useAIImport();

  const handleClear = () => {
    setAiPasteText('');
    setAiImageBase64(null);
    onResetImport();
  };

  const handleAIImport = async () => {
    onResetImport();
    const parsed = await importWithAI(aiPasteText || null, aiImageBase64);
    if (parsed) {
      onPreviewChange(parsed as PreviewQuestion[]);
      toast.success(`${parsed.length} sual AI tərəfindən uğurla analiz edildi.`);
    }
  };

  const handleAiImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAiImageBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Mətni yapışdırın və ya şəkil yükləyin</label>
          <Button variant="outline" size="sm" className="text-xs h-8" onClick={handleClear}>
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
          <Button
            variant="outline"
            className="flex-1 border-dashed h-20 flex-col gap-2"
            onClick={() => aiImageInputRef.current?.click()}
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
                onChange={onPreviewChange}
                onCheckDuplicates={onCheckDuplicates}
                isCheckingDuplicates={isCheckingDuplicates}
                onBulkEnhance={onBulkEnhance}
                isBulkEnhancing={isBulkEnhancing}
              />
              <Button onClick={onImport} disabled={isImporting} className="w-full">
                {isImporting ? 'Import edilir...' : `${importPreview.length} Sualı Banka Əlavə Et`}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-[10px] text-muted-foreground text-center bg-muted/30 p-2 rounded">
        Qeyd: AI mürəkkəb formatları, əlyazmaları və ya fotoşəkilləri analiz edə bilər. Düzgünlüyü
        yoxlamağı unutmayın.
      </p>
    </div>
  );
}
