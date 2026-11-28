import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X, Filter, BookOpen, MessageSquare, Flag, GraduationCap, Hash } from 'lucide-react';
import { QuestionFilters as Filters, useBankCurriculumMeta } from '@/hooks/useQuestionBank';
import { useQuestionCategories } from '@/hooks/useQuestionCategories';
import { useQuizzes } from '@/hooks/useQuizzes';
import { QUESTION_TYPES } from '@/types/question';
import { ALL_SCHOOL_SUBJECTS, SCHOOL_GRADES } from '@/lib/constants/subjects';

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

const difficultyLevels = [
  { value: 'I', label: 'I səviyyə (Asan)' },
  { value: 'II', label: 'II səviyyə (Orta)' },
  { value: 'III', label: 'III səviyyə (Yüksək)' },
  { value: 'IV', label: 'IV səviyyə (Çətin)' },
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
  // Fetch distinct curriculum metadata from question bank
  const { data: curriculumMeta } = useBankCurriculumMeta(filters.subject, filters.grade);

  // Use database categories, fall back to prop categories for backwards compatibility
  const categories = dbCategories.length > 0
    ? dbCategories
    : propCategories.map(name => ({ id: name, name, color: '#6366f1' }));

  const subjectOptions = Array.from(
    new Set([...(curriculumMeta?.subjects ?? []), ...ALL_SCHOOL_SUBJECTS])
  );
  const gradeOptions = Array.from(
    new Set([...(curriculumMeta?.grades ?? []), ...SCHOOL_GRADES.map((g) => `${g}-ci sinif`)])
  );
  const topicOptions = curriculumMeta?.topics ?? [];

  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.subject && filters.subject !== 'all') ||
    Boolean(filters.grade && filters.grade !== 'all') ||
    Boolean(filters.topic && filters.topic !== 'all') ||
    Boolean(filters.curriculum_standard) ||
    Boolean(filters.difficulty_level && filters.difficulty_level !== 'all') ||
    Boolean(filters.quiz_id) ||
    Boolean(filters.feedback_status && filters.feedback_status !== 'all') ||
    Boolean(filters.category && filters.category !== 'all') ||
    Boolean(filters.difficulty && filters.difficulty !== 'all') ||
    Boolean(filters.question_type && filters.question_type !== 'all');

  return (
    <div className="flex flex-col gap-3 p-4 bg-card rounded-xl border border-academic-line shadow-xs">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-academic-accent" />
        <span className="font-semibold text-sm">Filtrlər və Axtarış</span>
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

      {/* Primary Curriculum Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sual, başlıq, mövzu axtar..."
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9 text-xs h-9"
          />
        </div>

        {/* Subject Filter */}
        <Select
          value={filters.subject || 'all'}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, subject: value === 'all' ? undefined : value, topic: undefined })
          }
        >
          <SelectTrigger className="text-xs h-9">
            <SelectValue placeholder="Fənn seçin" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="all" className="text-xs">Bütün fənlər</SelectItem>
            {subjectOptions.map((s) => (
              <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Grade Filter */}
        <Select
          value={filters.grade || 'all'}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, grade: value === 'all' ? undefined : value, topic: undefined })
          }
        >
          <SelectTrigger className="text-xs h-9">
            <SelectValue placeholder="Sinif seçin" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="all" className="text-xs">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Bütün siniflər</span>
              </div>
            </SelectItem>
            {gradeOptions.map((g) => (
              <SelectItem key={g} value={g} className="text-xs">{g}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Topic Filter */}
        <Select
          value={filters.topic || 'all'}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, topic: value === 'all' ? undefined : value })
          }
        >
          <SelectTrigger className="text-xs h-9">
            <SelectValue placeholder="Mövzu seçin" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="all" className="text-xs">Bütün mövzular</SelectItem>
            {topicOptions.map((t) => (
              <SelectItem key={t} value={t} className="text-xs">
                <span className="truncate max-w-[260px] block">{t}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Secondary Assessment & Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
        {/* Curriculum Standard Search */}
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Standart (məs: 6-4.2.1)"
            value={filters.curriculum_standard || ''}
            onChange={(e) => onFiltersChange({ ...filters, curriculum_standard: e.target.value })}
            className="pl-8 text-xs h-9"
          />
        </div>

        {/* I-IV Level Filter */}
        <Select
          value={filters.difficulty_level || 'all'}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, difficulty_level: value === 'all' ? undefined : value })
          }
        >
          <SelectTrigger className="text-xs h-9">
            <SelectValue placeholder="Səviyyə (I–IV)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">Bütün səviyyələr</SelectItem>
            {difficultyLevels.map((lvl) => (
              <SelectItem key={lvl.value} value={lvl.value} className="text-xs">
                {lvl.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Difficulty Filter */}
        <Select
          value={filters.difficulty || 'all'}
          onValueChange={(value) => onFiltersChange({ ...filters, difficulty: value })}
        >
          <SelectTrigger className="text-xs h-9">
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
          <SelectTrigger className="text-xs h-9">
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

        {/* Category Filter */}
        <Select
          value={filters.category || 'all'}
          onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
        >
          <SelectTrigger className="text-xs h-9">
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

        {/* Quiz / Feedback Filter */}
        <Select
          value={filters.quiz_id || 'all'}
          onValueChange={(value) => onFiltersChange({ ...filters, quiz_id: value === 'all' ? undefined : value })}
        >
          <SelectTrigger className="text-xs h-9">
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
                <div className="flex items-center gap-2 max-w-[260px]">
                  <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{qz.title}</span>
                  <span className="text-[10px] text-muted-foreground shrink-0">({qz.question_count || 0})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Feedback status compact pills */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-muted-foreground mr-1">Rəy statusu:</span>
        {(
          [
            { value: 'all', label: 'Hamısı', icon: null },
            { value: 'has_feedback', label: 'Rəy bildirilmiş', icon: <MessageSquare className="h-3 w-3" /> },
            { value: 'has_issues', label: 'Xəta bildirişləri', icon: <Flag className="h-3 w-3" /> },
          ] as const
        ).map((item) => {
          const active = (filters.feedback_status || 'all') === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onFiltersChange({ ...filters, feedback_status: item.value })}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors border ${
                active
                  ? 'border-academic-accent bg-academic-soft text-academic-accent'
                  : 'border-border/60 bg-background text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
