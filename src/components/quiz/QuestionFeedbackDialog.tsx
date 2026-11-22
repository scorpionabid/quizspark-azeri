import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, Flag, HelpCircle, AlertCircle, Sparkles, ThumbsUp, ThumbsDown, Send, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useSubmitQuestionFeedback, useMyQuestionRating, IssueType } from '@/hooks/useQuizFeedback';
import { cn } from '@/lib/utils';

interface QuestionFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questionId: string;
  questionIndex?: number;
  questionTitle?: string;
  questionText?: string;
  questionBankId?: string;
}

const ISSUE_TYPES: { id: IssueType; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { id: 'error', label: 'Sualda/Cavabda xəta var', icon: Flag, color: 'text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30' },
  { id: 'confusing', label: 'Anlaşılmaz / Qaranlıqdır', icon: HelpCircle, color: 'text-amber-500 border-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950/30' },
  { id: 'too_hard', label: 'Həddən artıq çətindir', icon: ThumbsDown, color: 'text-orange-500 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-950/30' },
  { id: 'too_easy', label: 'Çox asandır', icon: ThumbsUp, color: 'text-blue-500 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/30' },
  { id: 'suggestion', label: 'Təklif / İzah', icon: Sparkles, color: 'text-purple-500 border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/30' },
  { id: 'great', label: 'Keyfiyyətli sualdır', icon: Star, color: 'text-emerald-500 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/30' },
];

export function QuestionFeedbackDialog({
  open,
  onOpenChange,
  questionId,
  questionIndex,
  questionTitle,
  questionText,
  questionBankId,
}: QuestionFeedbackDialogProps) {
  const { data: existingRating } = useMyQuestionRating(questionId);
  const submitFeedback = useSubmitQuestionFeedback();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [issueType, setIssueType] = useState<IssueType | null>(null);
  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    if (existingRating) {
      setRating(existingRating.rating || 5);
      setIssueType(existingRating.issue_type);
      setComment(existingRating.comment || '');
    } else {
      setRating(5);
      setIssueType(null);
      setComment('');
    }
  }, [existingRating, open]);

  const handleSubmit = async () => {
    try {
      await submitFeedback.mutateAsync({
        quizQuestionId: questionId,
        questionBankId: questionBankId,
        rating,
        issueType,
        comment,
      });

      toast.success('Rəyiniz müəllimə göndərildi. Təşəkkür edirik!');
      onOpenChange(false);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Xəta baş verdi';
      toast.error(errorMsg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <AlertCircle className="h-5 w-5 text-primary" />
            <span>Sual üçün Rəy və Xəta Bildir</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {questionIndex != null ? `Sual ${questionIndex + 1}: ` : ''}
            {questionTitle || (questionText ? (questionText.length > 80 ? questionText.slice(0, 80) + '...' : questionText) : 'Sual')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Star Rating */}
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">
              Sualın ümumi keyfiyyəti:
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating ?? rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 text-muted-foreground hover:scale-110 transition-transform focus:outline-none"
                    aria-label={`${star} ulduz`}
                  >
                    <Star
                      className={cn(
                        'h-7 w-7 transition-colors',
                        isFilled
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground/40'
                      )}
                    />
                  </button>
                );
              })}
              <span className="text-xs font-medium text-muted-foreground ml-2">
                {rating === 5 && 'Əla'}
                {rating === 4 && 'Yaxşı'}
                {rating === 3 && 'Kafi'}
                {rating === 2 && 'Zəif'}
                {rating === 1 && 'Çox zəif'}
              </span>
            </div>
          </div>

          {/* Issue Categories */}
          <div>
            <label className="text-xs font-semibold text-foreground block mb-2">
              Xəta və ya rəy növü (Seçin):
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ISSUE_TYPES.map((item) => {
                const Icon = item.icon;
                const isSelected = issueType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIssueType(isSelected ? null : item.id)}
                    className={cn(
                      'flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs font-medium transition-all',
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/30'
                        : 'border-border/60 bg-card text-foreground/80 hover:bg-muted/50'
                    )}
                  >
                    <Icon className={cn('h-4 w-4 shrink-0', item.color.split(' ')[0])} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment Textarea */}
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">
              Ətraflı izahat və ya təklifiniz:
            </label>
            <Textarea
              placeholder="Sualda hər hansı yanlışlıq və ya təklifiniz varsa buraya yazın..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="resize-none rounded-xl text-xs sm:text-sm"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-row items-center justify-between sm:justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs"
          >
            Ləğv et
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={submitFeedback.isPending}
            className="rounded-xl text-xs gap-1.5"
          >
            {submitFeedback.isPending ? (
              <span>Göndərilir...</span>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Rəyi Göndər</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
