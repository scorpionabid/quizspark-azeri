import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, FolderEdit, Tag, X } from 'lucide-react';
import { useState } from 'react';

interface BulkActionsBarProps {
  selectedCount: number;
  categories: string[];
  onBulkDelete: () => void;
  onBulkUpdateCategory: (category: string) => void;
  onBulkUpdateDifficulty: (difficulty: string) => void;
  onClearSelection: () => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

const difficulties = [
  { value: 'asan', label: 'Asan' },
  { value: 'orta', label: 'Orta' },
  { value: 'çətin', label: 'Çətin' },
];

export function BulkActionsBar({
  selectedCount,
  categories,
  onBulkDelete,
  onBulkUpdateCategory,
  onBulkUpdateDifficulty,
  onClearSelection,
  isDeleting,
  isUpdating,
}: BulkActionsBarProps) {
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [showDifficultySelect, setShowDifficultySelect] = useState(false);

  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20 animate-in slide-in-from-top-2">
      <span className="text-sm font-medium">
        {selectedCount} sual seçildi
      </span>

      <div className="flex items-center gap-2 ml-auto">
        {/* Bulk Category Update */}
        {showCategorySelect ? (
          <div className="flex items-center gap-2">
            <Select
              onValueChange={(value) => {
                onBulkUpdateCategory(value);
                setShowCategorySelect(false);
              }}
            >
              <SelectTrigger className="w-40 h-8">
                <SelectValue placeholder="Kateqoriya seç" />
              </SelectTrigger>
              <SelectContent>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    Kateqoriya yoxdur
                  </div>
                )}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowCategorySelect(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCategorySelect(true)}
            disabled={isUpdating}
          >
            <FolderEdit className="h-4 w-4 mr-1" />
            Kateqoriya dəyiş
          </Button>
        )}

        {/* Bulk Difficulty Update */}
        {showDifficultySelect ? (
          <div className="flex items-center gap-2">
            <Select
              onValueChange={(value) => {
                onBulkUpdateDifficulty(value);
                setShowDifficultySelect(false);
              }}
            >
              <SelectTrigger className="w-32 h-8">
                <SelectValue placeholder="Çətinlik seç" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((diff) => (
                  <SelectItem key={diff.value} value={diff.value}>
                    {diff.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowDifficultySelect(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDifficultySelect(true)}
            disabled={isUpdating}
          >
            <Tag className="h-4 w-4 mr-1" />
            Çətinlik dəyiş
          </Button>
        )}

        {/* Bulk Delete */}
        <Button
          variant="destructive"
          size="sm"
          onClick={onBulkDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Sil
        </Button>

        {/* Clear Selection */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
        >
          <X className="h-4 w-4 mr-1" />
          Ləğv et
        </Button>
      </div>
    </div>
  );
}
