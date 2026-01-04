import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Clock, X, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: unknown;
  correct_answer: string;
  explanation: string | null;
  category: string | null;
  difficulty: string | null;
  bloom_level: string | null;
  tags: string[] | null;
}

interface CreateQuizFromBankProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedQuestions: Question[];
  onRemoveQuestion: (id: string) => void;
  onQuizCreated: () => void;
}

export function CreateQuizFromBank({
  open,
  onOpenChange,
  selectedQuestions,
  onRemoveQuestion,
  onQuizCreated,
}: CreateQuizFromBankProps) {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState("15");
  const [isCreating, setIsCreating] = useState(false);

  const parseOptions = (options: unknown): string[] => {
    if (!options) return [];
    if (Array.isArray(options)) return options.map(String);
    if (typeof options === "string") {
      try {
        const parsed = JSON.parse(options);
        return Array.isArray(parsed) ? parsed.map(String) : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty) {
      case "asan":
        return "bg-green-500/20 text-green-400";
      case "orta":
        return "bg-yellow-500/20 text-yellow-400";
      case "çətin":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleCreateQuiz = async () => {
    if (!quizTitle.trim()) {
      toast.error("Quiz adı daxil edin");
      return;
    }

    if (selectedQuestions.length === 0) {
      toast.error("Ən azı 1 sual seçin");
      return;
    }

    setIsCreating(true);

    try {
      // Create quiz object that can be stored/used
      const quiz = {
        id: crypto.randomUUID(),
        title: quizTitle,
        description: quizDescription,
        timeLimit: parseInt(timeLimit),
        questions: selectedQuestions.map((q, index) => ({
          id: q.id,
          order: index + 1,
          question: q.question_text,
          type: q.question_type,
          options: parseOptions(q.options),
          correctAnswer: q.correct_answer,
          explanation: q.explanation,
          category: q.category,
          difficulty: q.difficulty,
          bloomLevel: q.bloom_level,
        })),
        createdAt: new Date().toISOString(),
        questionCount: selectedQuestions.length,
      };

      // Store in localStorage for now (can be integrated with database later)
      const existingQuizzes = JSON.parse(
        localStorage.getItem("createdQuizzes") || "[]"
      );
      existingQuizzes.push(quiz);
      localStorage.setItem("createdQuizzes", JSON.stringify(existingQuizzes));

      toast.success(`"${quizTitle}" quiz-i ${selectedQuestions.length} sualla yaradıldı!`);
      
      // Reset form
      setQuizTitle("");
      setQuizDescription("");
      setTimeLimit("15");
      
      onQuizCreated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast.error("Quiz yaratmaq mümkün olmadı");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Seçilmiş Suallardan Quiz Yarat
          </DialogTitle>
          <DialogDescription>
            {selectedQuestions.length} sual seçilib. Quiz məlumatlarını doldurun.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Quiz Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="quiz-title">Quiz Adı *</Label>
              <Input
                id="quiz-title"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Məs: Riyaziyyat Final İmtahanı"
                className="mt-1.5"
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="quiz-desc">Təsvir</Label>
              <Textarea
                id="quiz-desc"
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                placeholder="Quiz haqqında qısa məlumat..."
                rows={2}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Vaxt Limiti</Label>
              <Select value={timeLimit} onValueChange={setTimeLimit}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 dəqiqə</SelectItem>
                  <SelectItem value="10">10 dəqiqə</SelectItem>
                  <SelectItem value="15">15 dəqiqə</SelectItem>
                  <SelectItem value="20">20 dəqiqə</SelectItem>
                  <SelectItem value="30">30 dəqiqə</SelectItem>
                  <SelectItem value="45">45 dəqiqə</SelectItem>
                  <SelectItem value="60">60 dəqiqə</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{selectedQuestions.length} sual</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{timeLimit} dəq.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Questions Preview */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <Label className="mb-2">Seçilmiş Suallar</Label>
            <ScrollArea className="flex-1 rounded-lg border border-border/50 bg-muted/20">
              <div className="p-3 space-y-2">
                {selectedQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30"
                  >
                    <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary/20 text-primary text-xs font-medium">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground line-clamp-2">
                        {question.question_text}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {question.category && (
                          <Badge variant="outline" className="text-xs">
                            {question.category}
                          </Badge>
                        )}
                        {question.difficulty && (
                          <Badge
                            className={`text-xs ${getDifficultyColor(
                              question.difficulty
                            )}`}
                          >
                            {question.difficulty}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemoveQuestion(question.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Ləğv et
          </Button>
          <Button
            onClick={handleCreateQuiz}
            disabled={isCreating || selectedQuestions.length === 0}
            className="flex-1 gap-2"
          >
            {isCreating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Yaradılır...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Quiz Yarat
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
