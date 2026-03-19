import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Trash2,
  Image as ImageIcon,
  Loader2,
  ClipboardPaste,
  Type,
  Crosshair,
  AlertCircle,
  BookMarked,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { QuestionBankItem, useCreateQuestionBank } from '@/hooks/useQuestionBank';
import { useQuestionCategories, useCreateQuestionCategory } from '@/hooks/useQuestionCategories';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import { MathRenderer } from '@/components/question-bank/MathRenderer';

// Refactored Components
import { QuestionTypeSelector } from '@/components/teacher/question-edit/QuestionTypeSelector';
import { QuestionBasicInfo } from '@/components/teacher/question-edit/QuestionBasicInfo';
import { QuestionAISection } from '@/components/teacher/question-edit/QuestionAISection';
import { QuestionMediaInputs } from '@/components/teacher/question-edit/QuestionMediaInputs';
import { QuestionAnswerEditor } from '@/components/teacher/question-edit/QuestionAnswerEditor';
import { QuestionTags } from '@/components/teacher/question-edit/QuestionTags';
import { QuestionImportSection } from './edit-dialog/QuestionImportSection';

// Custom Hooks
import { useQuestionEditForm } from '@/hooks/useQuestionEditForm';

interface QuestionEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: QuestionBankItem | null;
  categories: string[];
  onSave: (question: Partial<QuestionBankItem>) => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
  showSaveToBank?: boolean;
}

export function QuestionEditDialog({
  open,
  onOpenChange,
  question,
  categories: propCategories,
  onSave,
  isLoading: savingLoading,
  mode,
  showSaveToBank = false,
}: QuestionEditDialogProps) {
  const { data: dbCategories = [] } = useQuestionCategories();
  const createCategory = useCreateQuestionCategory();
  const createQuestionBank = useCreateQuestionBank();
  const [newCategory, setNewCategory] = useState('');
  const [pasteMode, setPasteMode] = useState(false);
  const [saveToBank, setSaveToBank] = useState(false);

  const {
    formData,
    setFormData,
    validationErrors,
    isUploading,
    is3DUploading,
    setIs3DUploading,
    isEnhancing,
    isParsing,
    setIsParsing,
    handleAIAnalysis,
    handleSubmit,
    uploadImage,
    upload3DModel,
    enhanceQuestion,
  } = useQuestionEditForm(question, mode, onSave, () => onOpenChange(false));

  const categories = dbCategories.length > 0 ? dbCategories.map(c => c.name) : propCategories;

  const handleParse = async (text: string) => {
    setIsParsing(true);
    try {
      const data = await enhanceQuestion(text, 'parse_pasted_test');
      if (data) {
        setFormData(prev => ({
          ...prev,
          question_text: data.question_text || prev.question_text,
          question_type: data.question_type || prev.question_type,
          options: data.options || prev.options,
          correct_answer: data.correct_answer || prev.correct_answer,
          explanation: data.explanation || prev.explanation,
          category: data.category || prev.category,
          difficulty: data.difficulty || prev.difficulty,
          bloom_level: data.bloom_level || prev.bloom_level,
          tags: data.tags || prev.tags,
        }));
        setPasteMode(false);
        toast.success("Test uğurla hazırlandı!");
      }
    } catch (err) {
      console.error("Parse Error:", err);
    } finally {
      setIsParsing(false);
    }
  };

  useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      if (!open) return;
      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) {
            toast.info("Şəkil yüklənir...");
            const url = await uploadImage(file);
            if (url) {
              setFormData(prev => ({ ...prev, question_image_url: url }));
              toast.success("Şəkil uğurla yapışdırıldı!");
            }
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [open, uploadImage, setFormData]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{mode === 'create' ? 'Yeni Sual Yarat' : 'Sualı Redaktə Et'}</span>
            <Tabs value={pasteMode ? 'paste' : 'manual'} onValueChange={(v) => setPasteMode(v === 'paste')} className="w-auto">
              <TabsList className="grid w-[200px] grid-cols-2 h-8">
                <TabsTrigger value="manual" className="text-xs gap-1">
                  <Type className="h-3 w-3" /> Manual
                </TabsTrigger>
                <TabsTrigger value="paste" className="text-xs gap-1">
                  <ClipboardPaste className="h-3 w-3" /> Mətndən
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {pasteMode ? (
            <QuestionImportSection onParse={handleParse} isParsing={isParsing} />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <QuestionTypeSelector
                  value={formData.question_type}
                  onChange={(val) => {
                    const mcqTypes = ['multiple_choice', 'multiple_select', 'video'];
                    const isMcqNow = mcqTypes.includes(formData.question_type);
                    const isMcqNext = mcqTypes.includes(val);

                    if (val === 'true_false') {
                      setFormData({
                        ...formData,
                        question_type: val,
                        options: ['Doğru', 'Yanlış'],
                        correct_answer: ['A', 'B'].includes(formData.correct_answer) ? formData.correct_answer : '',
                      });
                    } else if (formData.question_type === 'true_false') {
                      setFormData({
                        ...formData,
                        question_type: val,
                        options: isMcqNext ? ['', '', '', ''] : [],
                        correct_answer: '',
                      });
                    } else if (isMcqNow && !isMcqNext) {
                      setFormData({
                        ...formData,
                        question_type: val,
                        options: [],
                        correct_answer: '',
                      });
                    } else if (!isMcqNow && isMcqNext) {
                      setFormData({
                        ...formData,
                        question_type: val,
                        options: ['', '', '', ''],
                        correct_answer: '',
                      });
                    } else {
                      setFormData({ ...formData, question_type: val, correct_answer: '' });
                    }
                  }}
                />
              </div>

              <QuestionBasicInfo
                formData={formData}
                setFormData={setFormData}
                categories={categories}
                newCategory={newCategory}
                setNewCategory={setNewCategory}
                onCreateCategory={() => {
                  if (newCategory.trim()) {
                    createCategory.mutate(
                      { name: newCategory.trim() },
                      {
                        onSuccess: () => {
                          setFormData({ ...formData, category: newCategory.trim() });
                          setNewCategory('');
                        },
                      }
                    );
                  }
                }}
                isCreatingCategory={createCategory.isPending}
              />

              <div className="space-y-4">
                <div className="space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="question_text">Sual *</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file" accept="image/*" className="hidden" id="q-img-up"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await uploadImage(file);
                            if (url) setFormData(prev => ({ ...prev, question_image_url: url }));
                          }
                        }}
                        disabled={isUploading}
                      />
                      <Button variant="outline" size="sm" className="h-8 text-xs cursor-pointer" asChild>
                        <label htmlFor="q-img-up">
                          {isUploading ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <ImageIcon className="h-3 w-3 mr-1" />}
                          Şəkil Əlavə Et
                        </label>
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    id="question_text"
                    value={formData.question_text}
                    onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                    placeholder="Sualı daxil edin..."
                    rows={3}
                    className="pr-12"
                  />
                  <QuestionAISection onAnalyze={handleAIAnalysis} isEnhancing={isEnhancing} disabled={!formData.question_text} />
                  {formData.question_text.includes('$') && (
                    <div className="mt-2 p-2 rounded-md border border-dashed bg-muted/30">
                      <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">Önizləmə</p>
                      <MathRenderer text={formData.question_text} className="text-sm" />
                    </div>
                  )}
                </div>

                {formData.question_image_url && (
                  <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border bg-muted/30 group">
                    <img src={formData.question_image_url} alt="Sual şəkli" className="w-full h-full object-contain" />
                    <Button
                      type="button" variant="destructive" size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setFormData({ ...formData, question_image_url: '' })}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              {formData.question_type === 'hotspot' && (
                <div className="flex items-start gap-3 p-4 rounded-md border border-dashed border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 text-sm text-amber-700 dark:text-amber-400">
                  <Crosshair className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Hotspot Editoru</p>
                    <p className="text-xs">
                       Koordinatları JSON formatında daxil edin: <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">{"[{\"x\":50,\"y\":30}]"}</code>
                    </p>
                  </div>
                </div>
              )}

              <QuestionAnswerEditor formData={formData} setFormData={setFormData} validationErrors={validationErrors} />

              <QuestionMediaInputs
                formData={formData} setFormData={setFormData}
                onImageUpload={async (file) => {
                  const url = await uploadImage(file);
                  if (url) setFormData(prev => ({ ...prev, question_image_url: url }));
                }}
                isUploading={isUploading}
                on3DUpload={async (file) => {
                  setIs3DUploading(true);
                  try {
                    const url = await upload3DModel(file);
                    setFormData(prev => ({ ...prev, model_3d_url: url }));
                  } finally {
                    setIs3DUploading(false);
                  }
                }}
                is3DUploading={is3DUploading}
              />

              <QuestionTags tags={formData.tags} onChange={(tags) => setFormData({ ...formData, tags })} />
            </>
          )}
        </div>

        <DialogFooter>
          {showSaveToBank && mode === 'create' && (
            <label className="flex items-center gap-2 text-sm mr-auto cursor-pointer select-none">
              <Checkbox
                checked={saveToBank}
                onCheckedChange={(v) => setSaveToBank(!!v)}
              />
              <BookMarked className="h-3.5 w-3.5 text-muted-foreground" />
              Sual bankına da əlavə et
            </label>
          )}
          {Object.keys(validationErrors).length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-destructive mr-auto">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Formdakı xətaları düzəldin</span>
            </div>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>Ləğv et</Button>
          <Button
            onClick={async () => {
              if (saveToBank && showSaveToBank && mode === 'create') {
                await createQuestionBank.mutateAsync({
                  question_text: formData.question_text,
                  question_type: formData.question_type,
                  options: formData.options ?? null,
                  correct_answer: formData.correct_answer ?? '',
                  explanation: formData.explanation ?? null,
                  title: formData.title ?? null,
                  weight: formData.weight ?? null,
                  hint: formData.hint ?? null,
                  time_limit: formData.time_limit ?? null,
                  difficulty: formData.difficulty ?? null,
                  category: formData.category ?? null,
                  bloom_level: formData.bloom_level ?? null,
                  tags: formData.tags ?? null,
                  per_option_explanations: formData.per_option_explanations ?? null,
                  question_image_url: formData.question_image_url ?? null,
                  option_images: formData.option_images ?? null,
                  media_type: formData.media_type ?? null,
                  media_url: formData.media_url ?? null,
                  video_url: formData.video_url ?? null,
                  video_start_time: formData.video_start_time ?? null,
                  video_end_time: formData.video_end_time ?? null,
                  model_3d_url: formData.model_3d_url ?? null,
                  model_3d_type: formData.model_3d_type ?? null,
                  hotspot_data: formData.hotspot_data ?? null,
                  matching_pairs: formData.matching_pairs ?? null,
                  sequence_items: formData.sequence_items ?? null,
                  fill_blank_template: formData.fill_blank_template ?? null,
                  numerical_answer: formData.numerical_answer ?? null,
                  numerical_tolerance: formData.numerical_tolerance ?? null,
                  source_document_id: null,
                  quality_score: null,
                  usage_count: null,
                  feedback_enabled: null,
                });
              }
              handleSubmit();
            }}
            disabled={!formData.question_text || savingLoading || isUploading || is3DUploading || createQuestionBank.isPending}
          >
            {(savingLoading || createQuestionBank.isPending) ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Yüklənir...</> : mode === 'create' ? 'Yarat' : 'Yadda saxla'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
