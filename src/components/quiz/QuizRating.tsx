import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuizRatings } from "@/hooks/useQuizRatings";
import { useAuth } from "@/contexts/AuthContext";

interface QuizRatingProps {
  quizId: string;
  showTotal?: boolean;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
}

export function QuizRating({ 
  quizId, 
  showTotal = true, 
  size = "md",
  interactive = true 
}: QuizRatingProps) {
  const { user } = useAuth();
  const { averageRating, totalRatings, userRating, submitRating, isSubmitting } = useQuizRatings(quizId);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const displayRating = hoverRating ?? userRating ?? Math.round(averageRating);
  const canRate = !!user && user.role !== 'guest' && interactive;

  const handleClick = (rating: number) => {
    if (canRate && !isSubmitting) {
      submitRating(rating);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!canRate || isSubmitting}
            onClick={() => handleClick(star)}
            onMouseEnter={() => canRate && setHoverRating(star)}
            onMouseLeave={() => setHoverRating(null)}
            className={cn(
              "transition-colors",
              canRate && "cursor-pointer hover:scale-110",
              !canRate && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors",
                star <= displayRating
                  ? "fill-warning text-warning"
                  : "text-muted-foreground/30"
              )}
            />
          </button>
        ))}
      </div>
      
      {showTotal && (
        <span className="text-sm text-muted-foreground">
          {averageRating.toFixed(1)} ({totalRatings})
        </span>
      )}
    </div>
  );
}
