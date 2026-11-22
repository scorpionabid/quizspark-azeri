import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Printer,
  FileText,
  KeyRound,
  Grid3X3,
  Columns2,
  Square,
  Sparkles,
  Loader2,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { Question } from '@/hooks/useQuestions';
import { QuizPrintLayout, QuizPrintConfig } from './QuizPrintLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface QuizPrintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: {
    id: string;
    title: string;
    subject?: string | null;
    grade?: string | null;
    description?: string | null;
    time_limit?: number | null;
  };
  initialQuestions?: Question[];
}

export const QuizPrintDialog: React.FC<QuizPrintDialogProps> = ({
  open,
  onOpenChange,
  quiz,
  initialQuestions,
}) => {
  const [config, setConfig] = useState<QuizPrintConfig>({
    mode: 'student',
    columns: 2,
    fontSize: 'base',
    includeHeader: true,
    includeInstructions: true,
    includeAnswerKey: true,
    includeBubbleSheet: false,
    organizationName: 'ŞƏKİ-ZAQATALA REGİONAL TƏHSİL İDARƏSİ',
    customInstructions:
      'Hər sual üçün yalnız bir düzgün cavab variantını qeyd edin. Kitabça üzərində qaralama apara bilərsiniz.',
  });

  const [activeTab, setActiveTab] = useState<'preview' | 'settings'>('preview');
  const printAreaRef = useRef<HTMLDivElement>(null);

  // If questions were not passed directly, load them from Supabase
  const { data: fetchedQuestions, isLoading } = useQuery({
    queryKey: ['print-quiz-questions', quiz.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', quiz.id)
        .order('order_index', { ascending: true });
      if (error) throw error;
      return (data || []) as Question[];
    },
    enabled: open && (!initialQuestions || initialQuestions.length === 0),
    staleTime: 60 * 1000,
  });

  const questions = initialQuestions && initialQuestions.length > 0
    ? initialQuestions
    : fetchedQuestions || [];

  // Dedicated print execution that generates an isolated high-res printable window
  const handlePrint = () => {
    const printContent = document.getElementById('quiz-printable-area');
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=1000,height=900');
    if (!printWindow) {
      alert('Brauzer pəncərənin açılmasına mane oldu. Zəhmət olmasa pop-up icazəsi verin.');
      return;
    }

    // Collect all stylesheets from current document
    const styleTags = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((el) => el.outerHTML)
      .join('\n');

    const html = `
      <!DOCTYPE html>
      <html lang="az">
        <head>
          <meta charset="utf-8" />
          <base href="${window.location.origin}" />
          <title>${quiz.title} - Test Kitabçası</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" />
          ${styleTags}
          <style>
            @page {
              size: A4;
              margin: 12mm 10mm;
            }
            @media print {
              body {
                background: white !important;
                color: black !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .break-inside-avoid {
                break-inside: avoid !important;
                page-break-inside: avoid !important;
              }
              .page-break-before {
                break-before: page !important;
                page-break-before: always !important;
              }
            }
            body {
              background: white !important;
              color: black !important;
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }
            .question-text, .question-text *, .print-document, .print-document * {
              color: #111827 !important;
            }
            .question-block {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
              border: 1px solid #e5e7eb !important;
              background-color: #ffffff !important;
            }
          </style>
        </head>
        <body>
          <div style="max-width: 210mm; margin: 0 auto;">
            ${printContent.innerHTML}
          </div>
          <script>
            function triggerPrint() {
              setTimeout(function() {
                window.focus();
                window.print();
              }, 400);
            }
            window.onload = function() {
              var imgs = Array.from(document.images);
              if (imgs.length === 0) {
                triggerPrint();
                return;
              }
              var pending = imgs.length;
              var finished = false;
              function checkDone() {
                pending--;
                if (pending <= 0 && !finished) {
                  finished = true;
                  triggerPrint();
                }
              }
              // Safety timeout in case an image hangs
              setTimeout(function() {
                if (!finished) {
                  finished = true;
                  triggerPrint();
                }
              }, 2500);
              imgs.forEach(function(img) {
                if (img.complete) {
                  checkDone();
                } else {
                  img.addEventListener('load', checkDone);
                  img.addEventListener('error', checkDone);
                }
              });
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-slate-50 dark:bg-slate-900">
        {/* Header */}
        <DialogHeader className="p-4 sm:px-6 bg-white dark:bg-slate-950 border-b shrink-0 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Printer className="w-5 h-5 text-primary" />
              <span>Test Kitabçası və PDF Çapı</span>
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {quiz.title} • {questions.length} sual
            </p>
          </div>

          <div className="flex items-center gap-2 mr-6">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as 'preview' | 'settings')}
              className="w-auto"
            >
              <TabsList className="h-8">
                <TabsTrigger value="preview" className="text-xs flex items-center gap-1.5 px-3">
                  <Eye className="w-3.5 h-3.5" />
                  Önbaxış
                </TabsTrigger>
                <TabsTrigger value="settings" className="text-xs flex items-center gap-1.5 px-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  Tənzimləmələr
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left / Settings Sidebar (visible on settings tab or left column on large screens) */}
          <div
            className={`w-full md:w-80 bg-white dark:bg-slate-950 border-r p-4 overflow-y-auto space-y-5 text-xs ${
              activeTab === 'settings' ? 'block' : 'hidden md:block'
            }`}
          >
            {/* 1. Nüsxə Növü */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-foreground">Nüsxə Növü</Label>
              <RadioGroup
                value={config.mode}
                onValueChange={(val: QuizPrintConfig['mode']) =>
                  setConfig((prev) => ({ ...prev, mode: val }))
                }
                className="space-y-1.5"
              >
                <div className="flex items-center space-x-2 rounded-lg border p-2 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer">
                  <RadioGroupItem value="student" id="mode-student" />
                  <label htmlFor="mode-student" className="cursor-pointer flex-1">
                    <p className="font-semibold text-xs flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-600" /> Şagird Kitabçası
                    </p>
                    <p className="text-[10px] text-muted-foreground">İmtahan üçün (cavabsız)</p>
                  </label>
                </div>

                <div className="flex items-center space-x-2 rounded-lg border p-2 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer">
                  <RadioGroupItem value="teacher" id="mode-teacher" />
                  <label htmlFor="mode-teacher" className="cursor-pointer flex-1">
                    <p className="font-semibold text-xs flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-emerald-600" /> Müəllim Nüsxəsi
                    </p>
                    <p className="text-[10px] text-muted-foreground">Düzgün cavablar və izahlarla</p>
                  </label>
                </div>

                <div className="flex items-center space-x-2 rounded-lg border p-2 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer">
                  <RadioGroupItem value="answer_key_only" id="mode-key-only" />
                  <label htmlFor="mode-key-only" className="cursor-pointer flex-1">
                    <p className="font-semibold text-xs flex items-center gap-1.5">
                      <Grid3X3 className="w-3.5 h-3.5 text-purple-600" /> Yalnız Cavab Açarları
                    </p>
                    <p className="text-[10px] text-muted-foreground">Kompakt yoxlama cədvəli</p>
                  </label>
                </div>

                <div className="flex items-center space-x-2 rounded-lg border p-2 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer">
                  <RadioGroupItem value="bubble_sheet_only" id="mode-bubble-only" />
                  <label htmlFor="mode-bubble-only" className="cursor-pointer flex-1">
                    <p className="font-semibold text-xs flex items-center gap-1.5">
                      <Square className="w-3.5 h-3.5 text-amber-600" /> Yalnız Cavab Kartı
                    </p>
                    <p className="text-[10px] text-muted-foreground">Optik qaralama vərəqi</p>
                  </label>
                </div>
              </RadioGroup>
            </div>

            {/* 2. Format & Sütunlar */}
            {config.mode !== 'answer_key_only' && config.mode !== 'bubble_sheet_only' && (
              <div className="space-y-2 pt-2 border-t">
                <Label className="text-xs font-bold text-foreground">Səhifə Formatı</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={config.columns === 2 ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 text-xs flex items-center gap-1.5 justify-center"
                    onClick={() => setConfig((p) => ({ ...p, columns: 2 }))}
                  >
                    <Columns2 className="w-3.5 h-3.5" />
                    2 Sütun (Qənaət)
                  </Button>
                  <Button
                    type="button"
                    variant={config.columns === 1 ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 text-xs flex items-center gap-1.5 justify-center"
                    onClick={() => setConfig((p) => ({ ...p, columns: 1 }))}
                  >
                    <Square className="w-3.5 h-3.5" />
                    1 Sütun (Geniş)
                  </Button>
                </div>

                <div className="mt-2">
                  <span className="text-[10px] text-muted-foreground block mb-1">Şrift Ölçüsü:</span>
                  <div className="grid grid-cols-3 gap-1">
                    {(['sm', 'base', 'lg'] as const).map((sz) => (
                      <Button
                        key={sz}
                        type="button"
                        variant={config.fontSize === sz ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 text-[10px] uppercase font-bold"
                        onClick={() => setConfig((p) => ({ ...p, fontSize: sz }))}
                      >
                        {sz === 'sm' ? 'Kompakt' : sz === 'base' ? 'Orta' : 'İri'}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. Əlavə Bölmələr */}
            {config.mode !== 'answer_key_only' && config.mode !== 'bubble_sheet_only' && (
              <div className="space-y-2.5 pt-2 border-t">
                <Label className="text-xs font-bold text-foreground">Əlavələr</Label>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inc-header"
                    checked={config.includeHeader}
                    onCheckedChange={(c) =>
                      setConfig((p) => ({ ...p, includeHeader: Boolean(c) }))
                    }
                  />
                  <label htmlFor="inc-header" className="text-xs cursor-pointer">
                    Rəsmi başlıq və şagird xanası
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inc-instruct"
                    checked={config.includeInstructions}
                    onCheckedChange={(c) =>
                      setConfig((p) => ({ ...p, includeInstructions: Boolean(c) }))
                    }
                  />
                  <label htmlFor="inc-instruct" className="text-xs cursor-pointer">
                    İmtahan qaydaları bloku
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inc-key"
                    checked={config.includeAnswerKey}
                    onCheckedChange={(c) =>
                      setConfig((p) => ({ ...p, includeAnswerKey: Boolean(c) }))
                    }
                  />
                  <label htmlFor="inc-key" className="text-xs cursor-pointer">
                    Sonda Cavab Açarları cədvəli
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inc-bubble"
                    checked={config.includeBubbleSheet}
                    onCheckedChange={(c) =>
                      setConfig((p) => ({ ...p, includeBubbleSheet: Boolean(c) }))
                    }
                  />
                  <label htmlFor="inc-bubble" className="text-xs cursor-pointer">
                    Sonda Optik Cavab Kartı (Bubble Sheet)
                  </label>
                </div>
              </div>
            )}

            {/* 4. Başlıq Fərdiləşdirməsi */}
            {config.includeHeader && (
              <div className="space-y-1.5 pt-2 border-t">
                <Label className="text-[11px] font-bold text-foreground">Təşkilat / İdarə Adı</Label>
                <Input
                  value={config.organizationName || ''}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, organizationName: e.target.value }))
                  }
                  placeholder="Məs: Şəki-Zaqatala Regional Təhsil İdarəsi"
                  className="h-8 text-xs"
                />
              </div>
            )}
          </div>

          {/* Right / Live Preview Panel */}
          <div
            className={`flex-1 bg-slate-200/70 dark:bg-slate-900 p-2 sm:p-6 overflow-y-auto ${
              activeTab === 'preview' ? 'block' : 'hidden md:block'
            }`}
          >
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-muted-foreground gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm">Suallar çap üçün hazırlanır...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-muted-foreground gap-2">
                <FileText className="w-8 h-8" />
                <p className="text-sm font-semibold">Bu quizdə heç bir sual tapılmadı.</p>
              </div>
            ) : (
              <div className="max-w-[210mm] mx-auto shadow-2xl rounded-sm overflow-hidden border border-slate-300">
                <QuizPrintLayout
                  quiz={quiz}
                  questions={questions}
                  config={config}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="p-3 sm:px-6 bg-white dark:bg-slate-950 border-t shrink-0 flex flex-row items-center justify-between sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Bağla
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="default"
              size="sm"
              disabled={isLoading || questions.length === 0}
              onClick={handlePrint}
              className="text-xs font-bold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Çap Et / PDF Yadda Saxla</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
