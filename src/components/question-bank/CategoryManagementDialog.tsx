import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit2, Trash2, X, Check, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useQuestionCategories,
  useCreateQuestionCategory,
  useUpdateQuestionCategory,
  useDeleteQuestionCategory,
  QuestionCategory,
} from '@/hooks/useQuestionCategories';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface CategoryManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const colorPresets = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#06b6d4', // cyan
  '#3b82f6', // blue
];

interface CategoryFormData {
  name: string;
  description: string;
  color: string;
}

const emptyForm: CategoryFormData = {
  name: '',
  description: '',
  color: '#6366f1',
};

export function CategoryManagementDialog({
  open,
  onOpenChange,
}: CategoryManagementDialogProps) {
  const { data: categories = [], isLoading } = useQuestionCategories();
  const createCategory = useCreateQuestionCategory();
  const updateCategory = useUpdateQuestionCategory();
  const deleteCategory = useDeleteQuestionCategory();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(emptyForm);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  const handleCreateNew = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const handleEdit = (category: QuestionCategory) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color || '#6366f1',
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    if (editingId) {
      updateCategory.mutate(
        { id: editingId, ...formData },
        { onSuccess: () => handleCancel() }
      );
    } else {
      createCategory.mutate(formData, {
        onSuccess: () => handleCancel(),
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteCategoryId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteCategoryId) {
      deleteCategory.mutate(deleteCategoryId, {
        onSuccess: () => {
          setDeleteConfirmOpen(false);
          setDeleteCategoryId(null);
        },
      });
    }
  };

  const isFormPending = createCategory.isPending || updateCategory.isPending;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Kateqoriyalar</span>
              {!showForm && (
                <Button onClick={handleCreateNew} size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Yeni
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-2">
            {/* Create/Edit Form */}
            {showForm && (
              <div className="p-4 rounded-lg border bg-muted/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">
                    {editingId ? 'Kateqoriyanı Redaktə Et' : 'Yeni Kateqoriya'}
                  </span>
                  <Button variant="ghost" size="icon" onClick={handleCancel} className="h-7 w-7">
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="cat-name">Ad *</Label>
                    <Input
                      id="cat-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Məs: Riyaziyyat"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cat-desc">Təsvir</Label>
                    <Textarea
                      id="cat-desc"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Qısa təsvir..."
                      rows={2}
                      className="mt-1 resize-none"
                    />
                  </div>

                  <div>
                    <Label className="flex items-center gap-1.5">
                      <Palette className="h-3.5 w-3.5" />
                      Rəng
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {colorPresets.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData({ ...formData, color })}
                          className={cn(
                            'w-7 h-7 rounded-full border-2 transition-all',
                            formData.color === color
                              ? 'border-foreground scale-110'
                              : 'border-transparent hover:scale-105'
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    Ləğv et
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={!formData.name.trim() || isFormPending}
                    className="gap-1"
                  >
                    <Check className="h-4 w-4" />
                    {isFormPending ? 'Yüklənir...' : editingId ? 'Yadda Saxla' : 'Yarat'}
                  </Button>
                </div>
              </div>
            )}

            {/* Category List */}
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">Yüklənir...</div>
            ) : categories.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <p>Heç bir kateqoriya yoxdur.</p>
                <p className="text-sm mt-1">Yeni kateqoriya yaratmaq üçün "Yeni" düyməsinə basın.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-4 h-4 rounded-full shrink-0"
                        style={{ backgroundColor: category.color || '#6366f1' }}
                      />
                      <div className="min-w-0">
                        <p className="font-medium truncate">{category.name}</p>
                        {category.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Kateqoriyanı sil?"
        description="Bu əməliyyat geri alına bilməz. Kateqoriya həmişəlik silinəcək."
        confirmLabel="Sil"
        cancelLabel="Ləğv et"
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />
    </>
  );
}
