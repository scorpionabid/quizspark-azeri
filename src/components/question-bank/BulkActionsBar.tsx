import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, FolderEdit, Tag, X, Share2, GraduationCap, Check } from 'lucide-react';
import { useState } from 'react';
import { QuestionBankItem } from '@/hooks/useQuestionBank';
import { ALL_SCHOOL_SUBJECTS, SCHOOL_GRADES } from '@/lib/constants/subjects';

interface BulkActionsBarProps {
  selectedCount: number;
  categories: string[];
  onBulkDelete: () => void;
  onBulkUpdateCategory: (category: string) => void;
  onBulkUpdateDifficulty: (difficulty: string) => void;
  onBulkUpdateMetadata?: (updates: Partial<QuestionBankItem>) => void;
  onClearSelection: () => void;
  onBulkShare?: () => void;
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
  onBulkUpdateMetadata,
  onClearSelection,
  onBulkShare,
  isDeleting,
  isUpdating,
}: BulkActionsBarProps) {
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [showDifficultySelect, setShowDifficultySelect] = useState(false);
  const [showCurriculumPanel, setShowCurriculumPanel] = useState(false);
  const [metaSubject, setMetaSubject] = useState('');
  const [metaGrade, setMetaGrade] = useState('');
  const [metaTopic, setMetaTopic] = useState('');
  const [metaStandard, setMetaStandard] = useState('');
  const [metaLevel, setMetaLevel] = useState('');
  const [metaWeight, setMetaWeight] = useState('');

  if (selectedCount === 0) return null;

  const handleApplyMeta = () => {
    if (!onBulkUpdateMetadata) return;
    const updates: Partial<QuestionBankItem> = {};
    if (metaSubject) updates.subject = metaSubject;
    if (metaGrade) updates.grade = metaGrade;
    if (metaTopic.trim()) updates.topic = metaTopic.trim();
    if (metaStandard.trim()) updates.curriculum_standard = metaStandard.trim();
    if (metaLevel) {
      updates.difficulty_level = metaLevel;
      updates.difficulty = metaLevel === 'I' ? 'asan' : metaLevel === 'IV' ? 'çətin' : 'orta';
    }
    const w = parseFloat(metaWeight);
    if (!isNaN(w) && w > 0) updates.weight = w;

    if (Object.keys(updates).length === 0) return;
    onBulkUpdateMetadata(updates);
    setShowCurriculumPanel(false);
    setMetaSubject('');
    setMetaGrade('');
    setMetaTopic('');
    setMetaStandard('');
    setMetaLevel('');
    setMetaWeight('');
  };

  return (
    <div className="space-y-2.5 p-3 bg-primary/10 rounded-xl border border-primary/20 animate-in slide-in-from-top-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold">
          {selectedCount} sual seçildi
        </span>

        <div className="flex flex-wrap items-center gap-2 ml-auto">
          {/* Bulk Curriculum Metadata */}
          {onBulkUpdateMetadata && (
            <Button
              variant={showCurriculumPanel ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowCurriculumPanel((p) => !p)}
              disabled={isUpdating}
              className="gap-1.5"
            >
              <GraduationCap className="h-4 w-4" />
              Sinif / Mövzu / Bal
            </Button>
          )}

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
              Kateqoriya
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
              Çətinlik
            </Button>
          )}

          {/* Bulk Share */}
          {onBulkShare && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkShare}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Paylaş
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

      {showCurriculumPanel && onBulkUpdateMetadata && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 pt-2 border-t border-primary/20">
          <Select value={metaSubject || 'none'} onValueChange={(v) => setMetaSubject(v === 'none' ? '' : v)}>
            <SelectTrigger className="h-8 text-xs bg-card">
              <SelectValue placeholder="Fənn" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              <SelectItem value="none" className="text-xs">Fənn</SelectItem>
              {ALL_SCHOOL_SUBJECTS.map((s) => (
                <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={metaGrade || 'none'} onValueChange={(v) => setMetaGrade(v === 'none' ? '' : v)}>
            <SelectTrigger className="h-8 text-xs bg-card">
              <SelectValue placeholder="Sinif" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none" className="text-xs">Sinif</SelectItem>
              {SCHOOL_GRADES.map((g) => (
                <SelectItem key={g} value={`${g}-ci sinif`} className="text-xs">{g}-ci sinif</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            value={metaTopic}
            onChange={(e) => setMetaTopic(e.target.value)}
            placeholder="Mövzu..."
            className="h-8 text-xs bg-card"
          />

          <Input
            value={metaStandard}
            onChange={(e) => setMetaStandard(e.target.value)}
            placeholder="Standart..."
            className="h-8 text-xs bg-card"
          />

          <Select value={metaLevel || 'none'} onValueChange={(v) => setMetaLevel(v === 'none' ? '' : v)}>
            <SelectTrigger className="h-8 text-xs bg-card">
              <SelectValue placeholder="Səviyyə" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none" className="text-xs">I–IV səviyyə</SelectItem>
              <SelectItem value="I" className="text-xs">I səviyyə</SelectItem>
              <SelectItem value="II" className="text-xs">II səviyyə</SelectItem>
              <SelectItem value="III" className="text-xs">III səviyyə</SelectItem>
              <SelectItem value="IV" className="text-xs">IV səviyyə</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            min={1}
            max={100}
            value={metaWeight}
            onChange={(e) => setMetaWeight(e.target.value)}
            placeholder="Bal (çəki)"
            className="h-8 text-xs bg-card tabular-nums"
          />

          <Button
            type="button"
            size="sm"
            onClick={handleApplyMeta}
            disabled={isUpdating}
            className="h-8 text-xs gap-1 bg-academic-accent hover:bg-academic-accent-deep text-white"
          >
            <Check className="h-3.5 w-3.5" />
            Tətbiq et
          </Button>
        </div>
      )}
    </div>
  );
}
