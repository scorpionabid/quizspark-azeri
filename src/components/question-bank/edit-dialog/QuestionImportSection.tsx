import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FileText, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface QuestionImportSectionProps {
  onParse: (text: string) => Promise<void>;
  isParsing: boolean;
}

export const QuestionImportSection: React.FC<QuestionImportSectionProps> = ({
  onParse,
  isParsing,
}) => {
  const [pastedText, setPastedText] = useState('');

  const handleMDImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        await onParse(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <Label htmlFor="paste_area">Test Mətnini Yapışdırın</Label>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept=".md,.txt"
            className="hidden"
            id="md-import"
            onChange={handleMDImport}
          />
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs cursor-pointer"
            asChild
          >
            <label htmlFor="md-import">
              <FileText className="h-3 w-3 mr-1" />
              Fayl Import
            </label>
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Textarea
          id="paste_area"
          value={pastedText}
          onChange={(e) => setPastedText(e.target.value)}
          placeholder="Sualı və variantları bura yapışdırın (məs. Word-dən)..."
          rows={10}
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground italic">
          AI sual mətnini, variantları və düzgün cavabı avtomatik müəyyən edəcək.
        </p>
      </div>
      <Button
        onClick={() => {
          if (!pastedText.trim()) {
            toast.error("Zəhmət olmasa testi bura yapışdırın.");
            return;
          }
          onParse(pastedText);
        }}
        className="w-full premium-gradient"
        disabled={isParsing || !pastedText.trim()}
      >
        {isParsing ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4 mr-2" />
        )}
        Parçala və Doldur
      </Button>
    </div>
  );
};
