import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X, Filter } from 'lucide-react';
import { QuestionFilters as Filters } from '@/hooks/useQuestionBank';
import { useQuestionCategories } from '@/hooks/useQuestionCategories';

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

const questionTypes = [
  { value: 'multiple_choice', label: 'Çoxseçimli' },
  { value: 'true_false', label: 'Doğru/Yanlış' },
  { value: 'short_answer', label: 'Qısa cavab' },
  { value: 'essay', label: 'Esse' },
];

export function QuestionFilters({
  filters,
  onFiltersChange,
  categories: propCategories,
  onClearFilters,
}: QuestionFiltersProps) {
  // Fetch categories from database
  const { data: dbCategories = [] } = useQuestionCategories();
  
  // Use database categories, fall back to prop categories for backwards compatibility
  const categories = dbCategories.length > 0 
    ? dbCategories 
    : propCategories.map(name => ({ id: name, name, color: '#6366f1' }));

  const hasActiveFilters = 
    filters.search || 
    (filters.category && filters.category !== 'all') || 
    (filters.difficulty && filters.difficulty !== 'all') || 
    (filters.question_type && filters.question_type !== 'all');

  return (
    <div className="flex flex-col gap-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">Filtrlər</span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="ml-auto h-7 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Təmizlə
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sual axtar..."
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>

        {/* Category Filter */}
        <Select
          value={filters.category || 'all'}
          onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Kateqoriya" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Bütün kateqoriyalar</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id || cat.name} value={cat.name}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ backgroundColor: cat.color || '#6366f1' }}
                  />
                  {cat.name}
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
          <SelectTrigger>
            <SelectValue placeholder="Çətinlik" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Bütün çətinliklər</SelectItem>
            {difficulties.map((diff) => (
              <SelectItem key={diff.value} value={diff.value}>
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
          <SelectTrigger>
            <SelectValue placeholder="Sual tipi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Bütün tiplər</SelectItem>
            {questionTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
