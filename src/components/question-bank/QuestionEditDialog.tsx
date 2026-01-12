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
import { Plus, Trash2 } from 'lucide-react';
import { QuestionBankItem } from '@/hooks/useQuestionBank';

interface QuestionEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: QuestionBankItem | null;
  categories: string[];
  onSave: (question: Partial<QuestionBankItem>) => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

const difficulties = [
  { value: 'asan', label: 'Asan' },
  { value: 'orta', label: 'Orta' },
  { value: 'çətin', label: 'Çətin' },
];

const questionTypes = [
  { value: 'multiple_choice', label: 'Çoxseçimli' },
  { value: 'true_false', label: 'Doğru/Yanlış' },
  { value: 'short_answer', label: 'Qısa cavab' },
  { value: 'essay', label: 'Esse' },
];

const bloomLevels = [
  { value: 'xatırlama', label: 'Xatırlama' },
  { value: 'anlama', label: 'Anlama' },
  { value: 'tətbiq', label: 'Tətbiq' },
  { value: 'analiz', label: 'Analiz' },
  { value: 'qiymətləndirmə', label: 'Qiymətləndirmə' },
  { value: 'yaratma', label: 'Yaratma' },
];

function parseOptions(options: string[] | Record<string, string> | null): string[] {
  if (!options) return ['', '', '', ''];
  if (Array.isArray(options)) return options.length >= 4 ? options : [...options, ...Array(4 - options.length).fill('')];
  return Object.values(options);
}

export function QuestionEditDialog({
  open,
  onOpenChange,
  question,
  categories,
  onSave,
  isLoading,
  mode,
}: QuestionEditDialogProps) {
  const [formData, setFormData] = useState({
    question_text: '',
    question_type: 'multiple_choice',
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
    category: '',
    difficulty: 'orta',
    bloom_level: '',
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState('');
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (question && mode === 'edit') {
      setFormData({
        question_text: question.question_text,
        question_type: question.question_type,
        options: parseOptions(question.options),
        correct_answer: question.correct_answer,
        explanation: question.explanation || '',
        category: question.category || '',
        difficulty: question.difficulty || 'orta',
        bloom_level: question.bloom_level || '',
        tags: question.tags || [],
      });
    } else {
      setFormData({
        question_text: '',
        question_type: 'multiple_choice',
        options: ['', '', '', ''],
        correct_answer: '',
        explanation: '',
        category: '',
        difficulty: 'orta',
        bloom_level: '',
        tags: [],
      });
    }
  }, [question, mode, open]);

  const handleSubmit = () => {
    const data: Partial<QuestionBankItem> = {
      question_text: formData.question_text,
      question_type: formData.question_type,
      correct_answer: formData.correct_answer,
      explanation: formData.explanation || null,
      category: formData.category || null,
      difficulty: formData.difficulty || null,
      bloom_level: formData.bloom_level || null,
      tags: formData.tags.length > 0 ? formData.tags : null,
    };

    // Only include options for multiple choice and true/false
    if (formData.question_type === 'multiple_choice' || formData.question_type === 'true_false') {
      data.options = formData.options.filter((o) => o.trim() !== '');
    } else {
      data.options = null;
    }

    if (mode === 'edit' && question) {
      data.id = question.id;
    }

    onSave(data);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ''] });
  };

  const removeOption = (index: number) => {
    if (formData.options.length <= 2) return;
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOptions });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const showOptions = formData.question_type === 'multiple_choice' || formData.question_type === 'true_false';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Yeni Sual Yarat' : 'Sualı Redaktə Et'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Question Text */}
          <div className="space-y-2">
            <Label htmlFor="question_text">Sual *</Label>
            <Textarea
              id="question_text"
              value={formData.question_text}
              onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
              placeholder="Sualı daxil edin..."
              rows={3}
            />
          </div>

          {/* Question Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Sual Tipi *</Label>
              <Select
                value={formData.question_type}
                onValueChange={(value) => setFormData({ ...formData, question_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {questionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Çətinlik *</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((diff) => (
                    <SelectItem key={diff.value} value={diff.value}>
                      {diff.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Options (for multiple choice) */}
          {showOptions && (
            <div className="space-y-2">
              <Label>Variantlar</Label>
              <div className="space-y-2">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Variant ${String.fromCharCode(65 + index)}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      disabled={formData.options.length <= 2}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Variant əlavə et
                </Button>
              </div>
            </div>
          )}

          {/* Correct Answer */}
          <div className="space-y-2">
            <Label htmlFor="correct_answer">Düzgün Cavab *</Label>
            <Input
              id="correct_answer"
              value={formData.correct_answer}
              onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
              placeholder={showOptions ? 'Məs: A, B, C, D' : 'Düzgün cavabı daxil edin'}
            />
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <Label htmlFor="explanation">İzahat</Label>
            <Textarea
              id="explanation"
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              placeholder="Cavabın izahatı..."
              rows={2}
            />
          </div>

          {/* Category and Bloom Level */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kateqoriya</Label>
              <Select
                value={formData.category || 'none'}
                onValueChange={(value) => setFormData({ ...formData, category: value === 'none' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kateqoriya seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Kateqoriyasız</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Yeni kateqoriya"
                  className="h-8 text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => {
                    if (newCategory.trim()) {
                      setFormData({ ...formData, category: newCategory.trim() });
                      setNewCategory('');
                    }
                  }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bloom Səviyyəsi</Label>
              <Select
                value={formData.bloom_level || 'none'}
                onValueChange={(value) => setFormData({ ...formData, bloom_level: value === 'none' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Səviyyə seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Təyin edilməyib</SelectItem>
                  {bloomLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Etiketlər</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-md text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Yeni etiket"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Ləğv et
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.question_text || !formData.correct_answer || isLoading}
          >
            {isLoading ? 'Yüklənir...' : mode === 'create' ? 'Yarat' : 'Yadda saxla'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
