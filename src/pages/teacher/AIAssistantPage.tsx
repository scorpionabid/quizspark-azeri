import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  BookOpen,
  Lightbulb,
  Wand2,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface GeneratedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const suggestedTopics = [
  "Cəbr: Xətti tənliklər",
  "Həndəsə: Dairə",
  "Fizika: Nyuton qanunları",
  "Kimya: Dövri sistem",
  "Biologiya: Hüceyrə",
  "Tarix: Azərbaycan Xalq Cümhuriyyəti",
];

export default function AIAssistantPage() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questionCount, setQuestionCount] = useState("5");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Mövzu daxil edin");
      return;
    }
    if (!subject) {
      toast.error("Fənn seçin");
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockQuestions: GeneratedQuestion[] = [
      {
        id: '1',
        question: `${topic} mövzusunda birinci sual nədir?`,
        options: ['Birinci variant', 'İkinci variant', 'Üçüncü variant', 'Dördüncü variant'],
        correctAnswer: 0,
        explanation: 'Bu sualın izahı burada göstərilir.',
      },
      {
        id: '2',
        question: `${topic} ilə bağlı ikinci konsepsiya nədir?`,
        options: ['A variantı', 'B variantı', 'C variantı', 'D variantı'],
        correctAnswer: 2,
        explanation: 'Düzgün cavab C-dir, çünki...',
      },
      {
        id: '3',
        question: `${topic} mövzusunda hansı bərabərlik doğrudur?`,
        options: ['2 + 2 = 5', '3 × 3 = 9', '4 - 1 = 2', '5 ÷ 5 = 0'],
        correctAnswer: 1,
        explanation: '3 × 3 = 9 düzgün cavabdır.',
      },
    ];

    setGeneratedQuestions(mockQuestions);
    setIsGenerating(false);
    toast.success("Suallar uğurla yaradıldı!");
  };

  const copyQuestion = (question: GeneratedQuestion) => {
    const text = `Sual: ${question.question}\n\nVariantlar:\n${question.options.map((o, i) => `${String.fromCharCode(65 + i)}) ${o}`).join('\n')}\n\nDüzgün cavab: ${String.fromCharCode(65 + question.correctAnswer)}\n\nİzahı: ${question.explanation}`;
    navigator.clipboard.writeText(text);
    setCopiedId(question.id);
    toast.success("Sual kopyalandı!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const useAllQuestions = () => {
    // In a real app, this would add questions to a new quiz
    toast.success("Suallar quizə əlavə edildi!");
    navigate('/teacher/create');
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-sm text-accent">
            <Sparkles className="h-4 w-4" />
            <span>AI Köməkçi</span>
          </div>
          <h1 className="mb-2 font-display text-3xl font-bold text-foreground">
            Süni Zəka ilə Quiz Yaradın
          </h1>
          <p className="text-muted-foreground">
            Mövzu daxil edin və AI sizin üçün suallar yaratsın
          </p>
        </div>

        {/* Input Form */}
        <div className="mb-8 rounded-2xl bg-gradient-card border border-border/50 p-6">
          <div className="grid gap-6">
            <div>
              <Label htmlFor="topic">Mövzu *</Label>
              <div className="relative mt-2">
                <Wand2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Məs: Cəbr: Xətti tənliklər və onların həlli"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Suggested Topics */}
            <div>
              <Label className="text-xs text-muted-foreground">Tövsiyə olunan mövzular:</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {suggestedTopics.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTopic(t)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                      topic === t
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label>Fənn *</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">Riyaziyyat</SelectItem>
                    <SelectItem value="physics">Fizika</SelectItem>
                    <SelectItem value="chemistry">Kimya</SelectItem>
                    <SelectItem value="biology">Biologiya</SelectItem>
                    <SelectItem value="history">Tarix</SelectItem>
                    <SelectItem value="geography">Coğrafiya</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Çətinlik</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Asan</SelectItem>
                    <SelectItem value="medium">Orta</SelectItem>
                    <SelectItem value="hard">Çətin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Sual Sayı</Label>
                <Select value={questionCount} onValueChange={setQuestionCount}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 sual</SelectItem>
                    <SelectItem value="5">5 sual</SelectItem>
                    <SelectItem value="10">10 sual</SelectItem>
                    <SelectItem value="15">15 sual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              variant="game"
              size="lg"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Suallar yaradılır...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Suallar Yarat
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Generated Questions */}
        {generatedQuestions.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/20">
                  <Lightbulb className="h-5 w-5 text-success" />
                </div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  Yaradılmış Suallar
                </h2>
              </div>
              <Button variant="game" onClick={useAllQuestions}>
                Hamısını İstifadə Et
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {generatedQuestions.map((question, index) => (
              <div
                key={question.id}
                className="rounded-2xl bg-gradient-card border border-border/50 p-6 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <Badge variant="default">Çoxseçimli</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyQuestion(question)}
                  >
                    {copiedId === question.id ? (
                      <Check className="mr-2 h-4 w-4 text-success" />
                    ) : (
                      <Copy className="mr-2 h-4 w-4" />
                    )}
                    {copiedId === question.id ? 'Kopyalandı' : 'Kopyala'}
                  </Button>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
