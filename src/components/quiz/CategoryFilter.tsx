import { cn } from "@/lib/utils";

interface Category {
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

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
          selected === null
            ? "bg-primary text-primary-foreground shadow-glow"
            : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
        )}
      >
        <span>📚</span>
        <span>Hamısı</span>
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
            selected === category.id
              ? "bg-primary text-primary-foreground shadow-glow"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          )}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
          <span className="rounded-full bg-background/20 px-1.5 py-0.5 text-xs">
            {category.count}
          </span>
        </button>
      ))}
    </div>
  );
}
