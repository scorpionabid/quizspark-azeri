import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface FavoriteButtonProps {
  quizId: string;
  variant?: "icon" | "button";
  className?: string;
}

export function FavoriteButton({ quizId, variant = "icon", className }: FavoriteButtonProps) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite, isToggling } = useFavorites();
  
  const isFav = isFavorite(quizId);
  const canFavorite = !!user && user.role !== 'guest';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!canFavorite) {
      toast.error("Favorilərə əlavə etmək üçün daxil olun");
      return;
    }
    
    toggleFavorite(quizId);
  };

  if (variant === "button") {
    return (
      <Button
        variant={isFav ? "secondary" : "outline"}
        size="sm"
        onClick={handleClick}
        disabled={isToggling}
        className={className}
      >
        <Heart
          className={cn(
            "mr-2 h-4 w-4 transition-all",
            isFav && "fill-current text-red-500"
          )}
        />
        {isFav ? "Favoridə" : "Favorilərə əlavə et"}
      </Button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isToggling}
      className={cn(
        "group flex h-9 w-9 items-center justify-center rounded-full",
        "bg-background/80 backdrop-blur-sm shadow-sm",
        "transition-all hover:scale-110",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      aria-label={isFav ? "Favorilərdən sil" : "Favorilərə əlavə et"}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-all",
          isFav
            ? "fill-red-500 text-red-500"
            : "text-muted-foreground group-hover:text-red-500"
        )}
      />
    </button>
  );
}
