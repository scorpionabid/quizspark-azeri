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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Trash2,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  ClipboardPaste,
  Type,
  FileText,
  Crosshair,
  AlertCircle,
} from 'lucide-react';
import { QuestionBankItem } from '@/hooks/useQuestionBank';
import { useQuestionCategories, useCreateQuestionCategory } from '@/hooks/useQuestionCategories';
import { useQuestionImageUpload } from '@/hooks/useQuestionImageUpload';
import { useQuestion3DUpload } from '@/hooks/useQuestion3DUpload';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { QuestionType } from '@/types/question';
import { useEnhanceQuestion } from '@/hooks/useEnhanceQuestion';
import { toast } from 'sonner';
import { MathRenderer } from '@/components/question-bank/MathRenderer';

// Refactored Components
import { QuestionTypeSelector } from '@/components/teacher/question-edit/QuestionTypeSelector';
import { QuestionBasicInfo } from '@/components/teacher/question-edit/QuestionBasicInfo';
import { QuestionAISection } from '@/components/teacher/question-edit/QuestionAISection';
import { QuestionMediaInputs } from '@/components/teacher/question-edit/QuestionMediaInputs';
import { QuestionAnswerEditor } from '@/components/teacher/question-edit/QuestionAnswerEditor';
import { QuestionTags } from '@/components/teacher/question-edit/QuestionTags';

interface QuestionEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: QuestionBankItem | null;
  categories: string[];
  onSave: (question: Partial<QuestionBankItem>) => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

// Constants moved to sub-components

function parseOptions(options: string[] | Record<string, string> | null): string[] {
  if (!options) return ['', '', '', ''];
  if (Array.isArray(options)) return options.length >= 4 ? options : [...options, ...Array(4 - options.length).fill('')];
  return Object.values(options);
}

export function QuestionEditDialog({
  open,
  onOpenChange,
  question,
  categories: propCategories,
  onSave,
  isLoading,
  mode,
}: QuestionEditDialogProps) {
  // Fetch categories from database
  const { data: dbCategories = [] } = useQuestionCategories();
  const createCategory = useCreateQuestionCategory();

  // Use database categories, fall back to prop categories
  const categories = dbCategories.length > 0
    ? dbCategories.map(c => c.name)
    : propCategories;

  const [formData, setFormData] = useState({
    // ... same state
    title: '',
    question_text: '',
    question_type: 'multiple_choice' as QuestionType | string,
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
    category: '',
    difficulty: 'orta',
    bloom_level: '',
    tags: [] as string[],
    question_image_url: '',
    media_type: null as 'image' | 'audio' | 'video' | null,
    media_url: '',
    weight: 1.0,
    hint: '',
    time_limit: '' as number | string,
    video_url: '',
    video_start_time: '' as number | string,
    video_end_time: '' as number | string,
    model_3d_url: '',
    model_3d_type: 'glb',
    fill_blank_template: '',
    numerical_answer: '' as number | string,
    numerical_tolerance: 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    matching_pairs: [] as any[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sequence_items: [] as any[],
  });
  const { uploadImage, isUploading } = useQuestionImageUpload();
  const [newCategory, setNewCategory] = useState('');
  const { upload3DModel } = useQuestion3DUpload();
  const [is3DUploading, setIs3DUploading] = useState(false);
  const { enhanceQuestion, isEnhancing } = useEnhanceQuestion();
  const [pasteMode, setPasteMode] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handlePasteParse = async () => {
    if (!pastedText.trim()) {
      toast.error("Zəhmət olmasa testi bura yapışdırın.");
      return;
    }

    setIsParsing(true);
    try {
      const data = await enhanceQuestion(pastedText, 'parse_pasted_test');
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
        setPastedText('');
        toast.success("Test uğurla parçalandı!");
      }
    } catch (err) {
      console.error("Parse Error:", err);
    } finally {
      setIsParsing(false);
    }
  };

  const handleAIAnalysis = async () => {
    if (!formData.question_text) {
      toast.error("Zəhmət olmasa əvvəlcə sual mətnini daxil edin.");
      return;
    }

    try {
      const data = await enhanceQuestion(formData.question_text, 'analyze_full');
      if (data) {
        setFormData(prev => ({
          ...prev,
          category: data.category || prev.category,
          difficulty: data.difficulty || prev.difficulty,
          bloom_level: data.bloom_level || prev.bloom_level,
          weight: data.weight || prev.weight,
          time_limit: data.time_limit || prev.time_limit,
          tags: data.tags ? [...new Set([...prev.tags, ...data.tags])] : prev.tags,
        }));
        toast.success("AI analizi uğurla tamamlandı!");
      }
    } catch (err) {
      console.error("AI Analysis Error:", err);
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
            toast.info("Şəkil müəyyən edildi, yüklənir...");
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
  }, [open, uploadImage]);

  useEffect(() => {
    if (question && mode === 'edit') {
      setFormData({
        title: question.title || '',
        question_text: question.question_text,
        question_type: question.question_type,
        options: question.question_type === 'true_false'
          ? ['Doğru', 'Yanlış']
          : parseOptions(question.options),
        correct_answer: question.correct_answer,
        explanation: question.explanation || '',
        category: question.category || '',
        difficulty: question.difficulty || 'orta',
        bloom_level: question.bloom_level || '',
        tags: question.tags || [],
        question_image_url: question.question_image_url || '',
        media_type: question.media_type || null,
        media_url: question.media_url || '',
        weight: question.weight || 1.0,
        hint: question.hint || '',
        time_limit: question.time_limit || '',
        video_url: question.video_url || '',
        video_start_time: question.video_start_time || '',
        video_end_time: question.video_end_time || '',
        model_3d_url: question.model_3d_url || '',
        model_3d_type: question.model_3d_type || 'glb',
        fill_blank_template: question.fill_blank_template || '',
        numerical_answer: question.numerical_answer ?? '',
        numerical_tolerance: question.numerical_tolerance ?? 0,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        matching_pairs: (question as any).matching_pairs || [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sequence_items: (question as any).sequence_items || [],
      });
    } else {
      setFormData({
        title: '',
        question_text: '',
        question_type: 'multiple_choice',
        options: ['', '', '', ''],
        correct_answer: '',
        explanation: '',
        category: '',
        difficulty: 'orta',
        bloom_level: '',
        tags: [],
        question_image_url: '',
        media_type: null,
        media_url: '',
        weight: 1.0,
        hint: '',
        time_limit: '',
        video_url: '',
        video_start_time: '',
        video_end_time: '',
        model_3d_url: '',
        model_3d_type: 'glb',
        fill_blank_template: '',
        numerical_answer: '',
        numerical_tolerance: 0,
        matching_pairs: [],
        sequence_items: [],
      });
    }
  }, [question, mode, open]);

  const handleMDImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        setIsParsing(true);
        try {
          const data = await enhanceQuestion(content, 'parse_pasted_test');
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
            toast.success("Markdown faylı uğurla oxundu!");
          }
        } catch (err) {
          console.error("MD Parse Error:", err);
        } finally {
          setIsParsing(false);
        }
      }
    };
    reader.readAsText(file);
  };

  /** Tip-spesifik validasiya — uğursuzluqda errors qaytarır */
  const validateForm = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    const qt = formData.question_type;

    if (!formData.question_text.trim()) {
      errors.question_text = 'Sual mətni boş ola bilməz';
    }

    if (qt === 'multiple_choice' || qt === 'video') {
      const filled = (formData.options as string[]).filter((o: string) => o.trim() !== '');
      if (filled.length < 2) errors.options = 'Ən azı 2 variant daxil edilməlidir';
      if (!formData.correct_answer) errors.correct_answer = 'Düzgün cavab seçilməlidir';
    } else if (qt === 'true_false') {
      if (!formData.correct_answer) errors.correct_answer = 'Doğru/Yanlış seçilməlidir';
    } else if (qt === 'fill_blank') {
      if (!formData.correct_answer.trim()) errors.correct_answer = 'Ən azı bir boşluq cavabı daxil edilməlidir';
    } else if (qt === 'matching') {
      const pairs = formData.matching_pairs as Array<{ left: string; right: string }>;
      if (!pairs || pairs.length < 2) errors.matching_pairs = 'Ən azı 2 cüt daxil edilməlidir';
      else if (pairs.some(p => !p.left.trim() || !p.right.trim())) errors.matching_pairs = 'Bütün cütlər doldurulmalıdır';
    } else if (qt === 'ordering') {
      const items = formData.sequence_items as string[];
      if (!items || items.length < 2) errors.sequence_items = 'Ən azı 2 element daxil edilməlidir';
      else if (items.some((it: string) => !it.trim())) errors.sequence_items = 'Bütün elementlər doldurulmalıdır';
    } else if (qt === 'numerical') {
      if (formData.numerical_answer === '' || isNaN(Number(formData.numerical_answer))) {
        errors.numerical_answer = 'Rəqəmsal cavab daxil edilməlidir';
      }
    } else if (qt === 'code') {
      if (!formData.correct_answer.trim()) errors.correct_answer = 'Gözlənilən çıxış/cavab boş ola bilməz';
    } else {
      if (!formData.correct_answer.trim()) errors.correct_answer = 'Düzgün cavab boş ola bilməz';
    }

    return errors;
  };

  const handleSubmit = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error('Zəhmət olmasa xətaları düzəldin');
      return;
    }
    setValidationErrors({});

    const data: Partial<QuestionBankItem> = {
      title: formData.title || null,
      question_text: formData.question_text,
      question_type: formData.question_type,
      correct_answer: formData.correct_answer,
      explanation: formData.explanation || null,
      category: formData.category || null,
      difficulty: formData.difficulty || null,
      bloom_level: formData.bloom_level || null,
      tags: formData.tags.length > 0 ? formData.tags : null,
      question_image_url: formData.question_image_url || null,
      media_type: formData.media_type || null,
      media_url: formData.media_url || null,
      weight: Number(formData.weight) || 1.0,
      hint: formData.hint || null,
      time_limit: formData.time_limit ? Number(formData.time_limit) : null,
      video_url: formData.video_url || null,
      video_start_time: formData.video_start_time ? Number(formData.video_start_time) : null,
      video_end_time: formData.video_end_time ? Number(formData.video_end_time) : null,
      model_3d_url: formData.model_3d_url || null,
      model_3d_type: formData.model_3d_type || 'glb',
      fill_blank_template: formData.fill_blank_template || null,
      numerical_answer: formData.numerical_answer !== '' ? Number(formData.numerical_answer) : null,
      numerical_tolerance: Number(formData.numerical_tolerance) || 0,
    };

    // Include options if it's MCQ, TF or Video
    if (formData.question_type === 'multiple_choice' || formData.question_type === 'true_false' || formData.question_type === 'video') {
      data.options = formData.options.filter((o: string) => o.trim() !== '');
    } else {
      data.options = null;
    }

    // Include matching/ordering data if they exist
    if (formData.matching_pairs && formData.matching_pairs.length > 0) {
      data.matching_pairs = formData.matching_pairs as unknown as Record<string, string>;
    }
    if (formData.sequence_items && formData.sequence_items.length > 0) {
      data.sequence_items = formData.sequence_items as unknown as string[];
    }

    if (mode === 'edit' && question) {
      data.id = question.id;
    }

    onSave(data);
  };

  // const showOptions = formData.question_type === 'multiple_choice' || formData.question_type === 'true_false';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{mode === 'create' ? 'Yeni Sual Yarat' : 'Sualı Redaktə Et'}</span>
            <Tabs value={pasteMode ? 'paste' : 'manual'} onValueChange={(v) => setPasteMode(v === 'paste')} className="w-auto">
              <TabsList className="grid w-[200px] grid-cols-2 h-8">
                <TabsTrigger value="manual" className="text-xs gap-1">
                  <Type className="h-3 w-3" />
                  Manual
                </TabsTrigger>
                <TabsTrigger value="paste" className="text-xs gap-1">
                  <ClipboardPaste className="h-3 w-3" />
                  Mətndən
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {pasteMode ? (
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
                onClick={handlePasteParse}
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
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <QuestionTypeSelector
                  value={formData.question_type}
                  onChange={(val) => {
                    if (val === 'true_false') {
                      setFormData({
                        ...formData,
                        question_type: val,
                        options: ['Doğru', 'Yanlış'],
                        correct_answer: formData.correct_answer === 'A' || formData.correct_answer === 'B' ? formData.correct_answer : ''
                      });
                    } else if (formData.question_type === 'true_false') {
                      setFormData({ ...formData, question_type: val, options: ['', '', '', ''] });
                    } else {
                      setFormData({ ...formData, question_type: val });
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
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="question-image-upload"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await uploadImage(file);
                            if (url) setFormData(prev => ({ ...prev, question_image_url: url }));
                          }
                        }}
                        disabled={isUploading}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs cursor-pointer"
                        asChild
                      >
                        <label htmlFor="question-image-upload">
                          {isUploading ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <ImageIcon className="h-3 w-3 mr-1" />
                          )}
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
                  <QuestionAISection
                    onAnalyze={handleAIAnalysis}
                    isEnhancing={isEnhancing}
                    disabled={!formData.question_text}
                  />
                  {/* Canlı riyazi önizləmə */}
                  {formData.question_text.includes('$') && (
                    <div className="mt-2 p-2 rounded-md border border-dashed bg-muted/30">
                      <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">Önizləmə</p>
                      <MathRenderer text={formData.question_text} className="text-sm" />
                    </div>
                  )}
                </div>

                {formData.question_image_url && (
                  <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border bg-muted/30 group">
                    <img
                      src={formData.question_image_url}
                      alt="Sual şəkli"
                      className="w-full h-full object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setFormData({ ...formData, question_image_url: '' })}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Hotspot placeholder */}
              {formData.question_type === 'hotspot' && (
                <div className="flex items-start gap-3 p-4 rounded-md border border-dashed border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 text-sm text-amber-700 dark:text-amber-400">
                  <Crosshair className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Hotspot Editoru</p>
                    <p className="text-xs">
                      Hotspot sualları üçün interaktiv redaktor hazırlanır. Hal-hazırda koordinatları JSON formatında əl ilə daxil edə bilərsiniz: <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">{"[{\"x\":50,\"y\":30,\"label\":\"A\"}]"}</code>
                    </p>
                  </div>
                </div>
              )}

              <QuestionAnswerEditor
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
              />

              <QuestionMediaInputs
                formData={formData}
                setFormData={setFormData}
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

              <QuestionTags
                tags={formData.tags}
                onChange={(tags) => setFormData({ ...formData, tags })}
              />
            </>
          )}
        </div>

        <DialogFooter>
          {Object.keys(validationErrors).length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-destructive mr-auto">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Formdakı xətaları düzəldin</span>
            </div>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Ləğv et
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.question_text || isLoading || isUploading || is3DUploading}
          >
            {isLoading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Yüklənir...</>
            ) : mode === 'create' ? 'Yarat' : 'Yadda saxla'}
          </Button>
        </DialogFooter>
      </DialogContent >
    </Dialog >
  );
}
