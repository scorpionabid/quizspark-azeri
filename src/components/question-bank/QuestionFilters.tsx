import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X, Filter, BookOpen, MessageSquare, Flag } from 'lucide-react';
import { QuestionFilters as Filters } from '@/hooks/useQuestionBank';
import { useQuestionCategories } from '@/hooks/useQuestionCategories';
import { useQuizzes } from '@/hooks/useQuizzes';
import { QUESTION_TYPES } from '@/types/question';

interface QuestionFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  categories: string[]; // kept for backwards compatibility, but we'll use hook data
  onClearFilters: () => void;
}

const difficulties = [
  { value: 'asan', label: 'Asan' },
  { value: 'orta', label: 'Orta' },
  { value: 'çətin', label: 'Çətin' },
];

export function QuestionFilters({
  filters,
  onFiltersChange,
  categories: propCategories,
  onClearFilters,
}: QuestionFiltersProps) {
  // Fetch categories from database
  const { data: dbCategories = [] } = useQuestionCategories();
  // Fetch active quizzes for filtering
  const { data: quizzes = [] } = useQuizzes({ isArchived: false });

  // Use database categories, fall back to prop categories for backwards compatibility
  const categories = dbCategories.length > 0
    ? dbCategories
    : propCategories.map(name => ({ id: name, name, color: '#6366f1' }));

  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.quiz_id) ||
    Boolean(filters.feedback_status && filters.feedback_status !== 'all') ||
    Boolean(filters.category && filters.category !== 'all') ||
    Boolean(filters.difficulty && filters.difficulty !== 'all') ||
    Boolean(filters.question_type && filters.question_type !== 'all');

  return (
    <div className="flex flex-col gap-4 p-4 bg-card rounded-lg border shadow-sm">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-sm">Filtrlər və Axtarış</span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="ml-auto h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Təmizlə
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sual və ya başlıq axtar..."
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9 text-xs"
          />
        </div>

        {/* Quiz Filter */}
        <Select
          value={filters.quiz_id || 'all'}
          onValueChange={(value) => onFiltersChange({ ...filters, quiz_id: value === 'all' ? undefined : value })}
        >
          <SelectTrigger className="text-xs">
            <SelectValue placeholder="Quiz seçin" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="all" className="text-xs">
              <div className="flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Bütün Quizlər</span>
              </div>
            </SelectItem>
            {quizzes.map((qz) => (
              <SelectItem key={qz.id} value={qz.id} className="text-xs">
                <div className="flex items-center gap-2 max-w-[280px]">
                  <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{qz.title}</span>
                  <span className="text-[10px] text-muted-foreground shrink-0">({qz.question_count || 0})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Feedback / Error Reports Filter */}
        <Select
          value={filters.feedback_status || 'all'}
          onValueChange={(value) => onFiltersChange({ ...filters, feedback_status: value as Filters['feedback_status'] })}
        >
          <SelectTrigger className="text-xs">
            <SelectValue placeholder="Rəy statusu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">
              Bütün suallar (Rəy statusu)
            </SelectItem>
            <SelectItem value="has_feedback" className="text-xs">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>💬 Rəy bildirilmiş suallar</span>
              </div>
            </SelectItem>
            <SelectItem value="has_issues" className="text-xs">
              <div className="flex items-center gap-2 text-destructive font-medium">
                <Flag className="h-3.5 w-3.5" />
                <span>🚩 Yalnız xəta bildirişləri</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select
          value={filters.category || 'all'}
          onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
        >
          <SelectTrigger className="text-xs">
            <SelectValue placeholder="Kateqoriya" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="all" className="text-xs">Bütün kateqoriyalar</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id || cat.name} value={cat.name} className="text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color || '#6366f1' }}
                  />
                  <span className="truncate">{cat.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Difficulty Filter */}
        <Select
          value={filters.difficulty || 'all'}
          onValueChange={(value) => onFiltersChange({ ...filters, difficulty: value })}
        >
          <SelectTrigger className="text-xs">
            <SelectValue placeholder="Çətinlik" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">Bütün çətinliklər</SelectItem>
            {difficulties.map((diff) => (
              <SelectItem key={diff.value} value={diff.value} className="text-xs">
                {diff.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type Filter */}
        <Select
          value={filters.question_type || 'all'}
          onValueChange={(value) => onFiltersChange({ ...filters, question_type: value })}
        >
          <SelectTrigger className="text-xs">
            <SelectValue placeholder="Sual tipi" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="all" className="text-xs">Bütün tiplər</SelectItem>
            {QUESTION_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value} className="text-xs">
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
