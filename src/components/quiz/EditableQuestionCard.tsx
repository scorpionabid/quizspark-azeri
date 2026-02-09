import { useState } from "react";
import { Check, Database, Edit2, Save, X, Trash2, Copy, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { BloomLevelBadge } from "@/components/ai/BloomLevelBadge";
import { QuestionEnhancer } from "@/components/ai/QuestionEnhancer";

export interface GeneratedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  bloomLevel?: string;
  questionType?: string;
  questionImageUrl?: string;
}

interface EditableQuestionCardProps {
  question: GeneratedQuestion;
  index: number;
  onUpdate: (updatedQuestion: GeneratedQuestion) => void;
  onDelete: (id: string) => void;
  onAddToBank?: (question: GeneratedQuestion) => void;
  onSimilarCreated?: (newQuestion: GeneratedQuestion) => void;
}

const TYPE_LABELS: Record<string, string> = {
  multiple_choice: "Çoxseçimli",
  true_false: "Doğru/Yanlış",
  short_answer: "Qısa Cavab",
};

export function EditableQuestionCard({ 
  question, 
  index, 
  onUpdate, 
  onDelete,
  onAddToBank,
  onSimilarCreated,
}: EditableQuestionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(question.question);
  const [editedOptions, setEditedOptions] = useState([...question.options]);
  const [editedCorrectAnswer, setEditedCorrectAnswer] = useState(question.correctAnswer);
  const [editedExplanation, setEditedExplanation] = useState(question.explanation);
  const [addedToBank, setAddedToBank] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const qType = question.questionType || "multiple_choice";

  const handleSave = () => {
    if (!editedQuestion.trim()) {
      toast.error("Sual boş ola bilməz");
      return;
    }
    if (qType === "multiple_choice" && editedOptions.some(o => !o.trim())) {
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

  const handleOptionChange = (idx: number, value: string) => {
    const newOptions = [...editedOptions];
    newOptions[idx] = value;
    setEditedOptions(newOptions);
  };

  const handleAddToBank = async () => {
    if (!onAddToBank || addedToBank || isAdding) return;
    setIsAdding(true);
    try {
      await onAddToBank(question);
      setAddedToBank(true);
    } catch {
      // handled in parent
    } finally {
      setIsAdding(false);
    }
  };

  const handleCopy = () => {
    const text = [
      `Sual: ${question.question}`,
      ...(qType === "multiple_choice"
        ? question.options.map((o, i) => `${String.fromCharCode(65 + i)}) ${o}${i === question.correctAnswer ? " ✓" : ""}`)
        : [`Cavab: ${question.options[question.correctAnswer] || question.options[0]}`]),
      `İzahı: ${question.explanation}`,
    ].join("\n");

    navigator.clipboard.writeText(text);
    toast.success("Sual kopyalandı");
  };

  // ---- EDITING MODE ----
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
              <X className="mr-1 h-4 w-4" /> Ləğv et
            </Button>
            <Button variant="default" size="sm" onClick={handleSave}>
              <Save className="mr-1 h-4 w-4" /> Yadda saxla
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Sual</label>
            <Textarea
              value={editedQuestion}
              onChange={(e) => setEditedQuestion(e.target.value)}
              className="min-h-[80px] resize-none"
              placeholder="Sualı daxil edin..."
            />
          </div>

          {qType === "multiple_choice" && (
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
                      className={cn(optIndex === editedCorrectAnswer && "border-success")}
                    />
                  </div>
                ))}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Düzgün cavabı seçmək üçün hərfə klikləyin
              </p>
            </div>
          )}

          {qType === "true_false" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Düzgün cavab</label>
              <div className="flex gap-2">
                {["Doğru", "Yanlış"].map((opt, i) => (
                  <Button
                    key={opt}
                    variant={editedCorrectAnswer === i ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEditedCorrectAnswer(i)}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">İzahı</label>
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

  // ---- VIEW MODE ----
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
          <Badge variant="default">{TYPE_LABELS[qType] || "Çoxseçimli"}</Badge>
          <BloomLevelBadge level={question.bloomLevel} />
        </div>
        <div className="flex gap-1">
          {/* Copy */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="opacity-70 transition-opacity group-hover:opacity-100"
            title="Kopyala"
          >
            <Copy className="h-4 w-4" />
          </Button>

          <QuestionEnhancer
            question={question}
            onEnhanced={onUpdate}
            onSimilarCreated={onSimilarCreated}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="opacity-70 transition-opacity group-hover:opacity-100"
          >
            <Edit2 className="mr-1 h-4 w-4" /> Redaktə
          </Button>
          {onAddToBank && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddToBank}
              disabled={addedToBank || isAdding}
              className={cn(addedToBank && "text-success")}
            >
              {isAdding ? (
                <div className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : addedToBank ? (
                <Check className="mr-1 h-4 w-4 text-success" />
              ) : (
                <Database className="mr-1 h-4 w-4" />
              )}
              {isAdding ? "Əlavə edilir..." : addedToBank ? "Əlavə edildi" : "Banka Əlavə Et"}
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

      {/* Question Image */}
      {question.questionImageUrl && (
        <div className="mb-4 rounded-lg overflow-hidden border border-border/50">
          <img
            src={question.questionImageUrl}
            alt="Sual şəkli"
            className="max-h-48 w-auto object-contain mx-auto"
          />
        </div>
      )}

      <h3 className="mb-4 text-lg font-medium text-foreground">{question.question}</h3>

      {/* Options based on type */}
      {qType === "multiple_choice" && (
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
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold",
                  optIndex === question.correctAnswer
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {String.fromCharCode(65 + optIndex)}
              </div>
              <span className={optIndex === question.correctAnswer ? "text-success" : ""}>
                {option}
              </span>
            </div>
          ))}
        </div>
      )}

      {qType === "true_false" && (
        <div className="mb-4 flex gap-2">
          {["Doğru", "Yanlış"].map((opt, i) => (
            <div
              key={opt}
              className={cn(
                "rounded-lg border-2 px-4 py-2 text-sm font-medium",
                i === question.correctAnswer
                  ? "border-success bg-success/10 text-success"
                  : "border-border/50 bg-muted/30 text-muted-foreground"
              )}
            >
              {opt} {i === question.correctAnswer && "✓"}
            </div>
          ))}
        </div>
      )}

      {qType === "short_answer" && (
        <div className="mb-4 rounded-lg border-2 border-success bg-success/10 p-3">
          <span className="text-sm font-medium text-success">
            Cavab: {question.options[0] || question.options[question.correctAnswer]}
          </span>
        </div>
      )}

      <div className="rounded-lg bg-muted/30 p-3">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">İzahı:</strong> {question.explanation}
        </p>
      </div>
    </div>
  );
}
