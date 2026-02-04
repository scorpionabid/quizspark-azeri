import { useState } from "react";
import { Check, Database, Edit2, Save, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface GeneratedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface EditableQuestionCardProps {
  question: GeneratedQuestion;
  index: number;
  onUpdate: (updatedQuestion: GeneratedQuestion) => void;
  onDelete: (id: string) => void;
  onAddToBank?: (question: GeneratedQuestion) => void;
}

export function EditableQuestionCard({ 
  question, 
  index, 
  onUpdate, 
  onDelete,
  onAddToBank,
}: EditableQuestionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(question.question);
  const [editedOptions, setEditedOptions] = useState([...question.options]);
  const [editedCorrectAnswer, setEditedCorrectAnswer] = useState(question.correctAnswer);
  const [editedExplanation, setEditedExplanation] = useState(question.explanation);
  const [addedToBank, setAddedToBank] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = () => {
    if (!editedQuestion.trim()) {
      toast.error("Sual boş ola bilməz");
      return;
    }
    if (editedOptions.some(o => !o.trim())) {
      toast.error("Bütün variantlar doldurulmalıdır");
      return;
    }

    onUpdate({
      ...question,
      question: editedQuestion,
      options: editedOptions,
      correctAnswer: editedCorrectAnswer,
      explanation: editedExplanation,
    });
    setIsEditing(false);
    toast.success("Sual yeniləndi");
  };

  const handleCancel = () => {
    setEditedQuestion(question.question);
    setEditedOptions([...question.options]);
    setEditedCorrectAnswer(question.correctAnswer);
    setEditedExplanation(question.explanation);
    setIsEditing(false);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...editedOptions];
    newOptions[index] = value;
    setEditedOptions(newOptions);
  };

  const handleAddToBank = async () => {
    if (!onAddToBank || addedToBank || isAdding) return;
    
    setIsAdding(true);
    try {
      await onAddToBank(question);
      setAddedToBank(true);
    } catch (err) {
      // Error is handled in parent
    } finally {
      setIsAdding(false);
    }
  };

  if (isEditing) {
    return (
      <div
        className="rounded-2xl bg-gradient-card border-2 border-primary/50 p-6 animate-slide-up"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-sm font-bold text-primary">
              {index + 1}
            </div>
            <Badge variant="warning">Redaktə edilir</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="mr-1 h-4 w-4" />
              Ləğv et
            </Button>
            <Button variant="default" size="sm" onClick={handleSave}>
              <Save className="mr-1 h-4 w-4" />
              Yadda saxla
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Sual
            </label>
            <Textarea
              value={editedQuestion}
              onChange={(e) => setEditedQuestion(e.target.value)}
              className="min-h-[80px] resize-none"
              placeholder="Sualı daxil edin..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Variantlar (düzgün cavabı seçin)
            </label>
            <div className="space-y-2">
              {editedOptions.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditedCorrectAnswer(optIndex)}
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sm font-bold transition-colors",
                      optIndex === editedCorrectAnswer
                        ? "bg-success text-success-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {String.fromCharCode(65 + optIndex)}
                  </button>
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(optIndex, e.target.value)}
                    placeholder={`Variant ${String.fromCharCode(65 + optIndex)}`}
                    className={cn(
                      optIndex === editedCorrectAnswer && "border-success"
                    )}
                  />
                </div>
              ))}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Düzgün cavabı seçmək üçün hərfə klikləyin
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              İzahı
            </label>
            <Textarea
              value={editedExplanation}
              onChange={(e) => setEditedExplanation(e.target.value)}
              className="min-h-[60px] resize-none"
              placeholder="Düzgün cavabın izahını daxil edin..."
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl bg-gradient-card border border-border/50 p-6 animate-slide-up group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-sm font-bold text-primary">
            {index + 1}
          </div>
          <Badge variant="default">Çoxseçimli</Badge>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Edit2 className="mr-1 h-4 w-4" />
            Redaktə
          </Button>
          {onAddToBank && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddToBank}
              disabled={addedToBank || isAdding}
              className={cn(
                addedToBank && "text-success"
              )}
            >
              {isAdding ? (
                <div className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : addedToBank ? (
                <Check className="mr-1 h-4 w-4 text-success" />
              ) : (
                <Database className="mr-1 h-4 w-4" />
              )}
              {isAdding ? 'Əlavə edilir...' : addedToBank ? 'Əlavə edildi' : 'Bankına Əlavə Et'}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(question.id)}
            className="text-destructive opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <h3 className="mb-4 text-lg font-medium text-foreground">
        {question.question}
      </h3>

      <div className="mb-4 space-y-2">
        {question.options.map((option, optIndex) => (
          <div
            key={optIndex}
            className={cn(
              "flex items-center gap-3 rounded-lg border-2 p-3",
              optIndex === question.correctAnswer
                ? "border-success bg-success/10"
                : "border-border/50 bg-muted/30"
            )}
          >
            <div className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold",
              optIndex === question.correctAnswer
                ? "bg-success text-success-foreground"
                : "bg-muted text-muted-foreground"
            )}>
              {String.fromCharCode(65 + optIndex)}
            </div>
            <span className={optIndex === question.correctAnswer ? "text-success" : ""}>
              {option}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-muted/30 p-3">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">İzahı:</strong> {question.explanation}
        </p>
      </div>
    </div>
  );
}
