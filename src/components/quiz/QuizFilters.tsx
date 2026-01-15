import { Filter, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface QuizFilterValues {
  difficulty: string;
  duration: string;
  sortBy: string;
}

interface QuizFiltersProps {
  filters: QuizFilterValues;
  onFiltersChange: (filters: QuizFilterValues) => void;
  onClearFilters: () => void;
  className?: string;
}

const difficultyOptions = [
  { value: "all", label: "Bütün səviyyələr" },
  { value: "easy", label: "Asan" },
  { value: "medium", label: "Orta" },
  { value: "hard", label: "Çətin" },
];

const durationOptions = [
  { value: "all", label: "Bütün müddətlər" },
  { value: "short", label: "0-10 dəqiqə" },
  { value: "medium", label: "10-20 dəqiqə" },
  { value: "long", label: "20+ dəqiqə" },
];

const sortOptions = [
  { value: "newest", label: "Ən yeni" },
  { value: "popular", label: "Ən populyar" },
  { value: "rating", label: "Ən yüksək reytinq" },
  { value: "questions", label: "Sual sayına görə" },
];

export function QuizFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  className,
}: QuizFiltersProps) {
  const hasActiveFilters =
    filters.difficulty !== "all" ||
    filters.duration !== "all" ||
    filters.sortBy !== "newest";

  const activeFilterCount = [
    filters.difficulty !== "all",
    filters.duration !== "all",
    filters.sortBy !== "newest",
  ].filter(Boolean).length;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filterlər</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </div>

        {/* Difficulty Filter */}
        <Select
          value={filters.difficulty}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, difficulty: value })
          }
        >
          <SelectTrigger className="h-9 w-[160px] rounded-full border-border/50 bg-card/50 text-sm backdrop-blur-sm">
            <SelectValue placeholder="Çətinlik" />
          </SelectTrigger>
          <SelectContent>
            {difficultyOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Duration Filter */}
        <Select
          value={filters.duration}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, duration: value })
          }
        >
          <SelectTrigger className="h-9 w-[160px] rounded-full border-border/50 bg-card/50 text-sm backdrop-blur-sm">
            <SelectValue placeholder="Müddət" />
          </SelectTrigger>
          <SelectContent>
            {durationOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort By */}
        <Select
          value={filters.sortBy}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, sortBy: value })
          }
        >
          <SelectTrigger className="h-9 w-[160px] rounded-full border-border/50 bg-card/50 text-sm backdrop-blur-sm">
            <SelectValue placeholder="Sıralama" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-9 gap-1.5 rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Təmizlə
          </Button>
        )}
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Aktiv filterlər:</span>
          {filters.difficulty !== "all" && (
            <Badge
              variant="outline"
              className="gap-1 rounded-full border-primary/30 bg-primary/10 text-primary"
            >
              {difficultyOptions.find((o) => o.value === filters.difficulty)?.label}
              <button
                onClick={() =>
                  onFiltersChange({ ...filters, difficulty: "all" })
                }
                className="ml-0.5 rounded-full hover:bg-primary/20"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.duration !== "all" && (
            <Badge
              variant="outline"
              className="gap-1 rounded-full border-secondary/30 bg-secondary/10 text-secondary"
            >
              {durationOptions.find((o) => o.value === filters.duration)?.label}
              <button
                onClick={() => onFiltersChange({ ...filters, duration: "all" })}
                className="ml-0.5 rounded-full hover:bg-secondary/20"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.sortBy !== "newest" && (
            <Badge
              variant="outline"
              className="gap-1 rounded-full border-accent/30 bg-accent/10 text-accent"
            >
              {sortOptions.find((o) => o.value === filters.sortBy)?.label}
              <button
                onClick={() => onFiltersChange({ ...filters, sortBy: "newest" })}
                className="ml-0.5 rounded-full hover:bg-accent/20"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
