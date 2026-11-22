import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

const DEFAULT_VISIBLE_COUNT = 8;

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  const { t } = useLanguage();
  const [showAll, setShowAll] = useState(false);

  const visibleCategories = showAll
    ? categories
    : categories.filter((c, idx) => idx < DEFAULT_VISIBLE_COUNT || c.id === selected);
  const hiddenCount = Math.max(0, categories.length - DEFAULT_VISIBLE_COUNT);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
          selected === null
            ? "bg-primary text-primary-foreground shadow-glow"
            : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
        )}
      >
        <span>📚</span>
        <span>{t('category_all', 'Hamısı')}</span>
      </button>

      {visibleCategories.map((category) => (
        <button
          type="button"
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
            selected === category.id
              ? "bg-primary text-primary-foreground shadow-glow"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          )}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
          <span className="rounded-full bg-background/20 px-1.5 py-0.5 text-[11px]">
            {category.count}
          </span>
        </button>
      ))}

      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="flex items-center gap-1 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
        >
          {showAll ? (
            <>
              <span>Gizlət</span>
              <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              <span>Daha çox (+{hiddenCount})</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
