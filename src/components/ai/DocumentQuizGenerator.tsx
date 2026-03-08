import { useState } from "react";
import { Sparkles, FileText, Loader2, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GeneratedQuestion } from "@/components/quiz/EditableQuestionCard";
import { getBloomLevels } from "@/components/ai/BloomLevelBadge";
import { SUBJECT_OPTIONS, SUBJECT_LABELS } from "@/lib/constants/subjects";

interface UploadedDocument {
  id: string;
  fileName: string;
  content: string;
  fullContent: string;
}

interface DocumentQuizGeneratorProps {
  documents: UploadedDocument[];
  onQuestionsGenerated: (questions: GeneratedQuestion[]) => void;
  model: string;
  temperature: number;
}

const QUESTION_TYPES = [
  { value: "multiple_choice", label: "Çoxseçimli" },
  { value: "true_false", label: "Doğru/Yanlış" },
  { value: "short_answer", label: "Qısa Cavab" },
];

export function DocumentQuizGenerator({
  documents,
  onQuestionsGenerated,
  model,
  temperature,
}: DocumentQuizGeneratorProps) {
  const [subject, setSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState("5");
  const [customCount, setCustomCount] = useState("");
  const [questionType, setQuestionType] = useState("multiple_choice");
  const [bloomFilter, setBloomFilter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [mode, setMode] = useState<"generate" | "extract">("generate");

  const activeDocuments = documents.filter((d) => d.fullContent);

  const getDocumentContext = () => {
    return activeDocuments
      .map((doc) => `--- Sənəd: ${doc.fileName} ---\n${selectedText || doc.fullContent}`)
      .join("\n\n");
  };

  const getEffectiveSubject = () => {
    if (subject === "custom") return customSubject;
    return SUBJECT_LABELS[subject] || subject;
  };

  const getEffectiveCount = () => {
    if (questionCount === "custom") return parseInt(customCount) || 5;
    return parseInt(questionCount);
  };

  const handleGenerate = async () => {
    if (activeDocuments.length === 0) {
      toast.error("Ən azı bir sənəd yükləyin");
      return;
    }
    const effectiveSubject = getEffectiveSubject();
    if (!effectiveSubject) {
      toast.error("Fənn seçin və ya daxil edin");
      return;
    }

    setIsGenerating(true);
    try {
      const documentContext = getDocumentContext();
      const count = getEffectiveCount();

      const { data, error: fnError } = await supabase.functions.invoke("generate-quiz", {
        body: {
          topic: `Sənəd məzmunu üzrə suallar`,
          subject: effectiveSubject,
          difficulty,
          questionCount: count,
          agentId: "quiz-master",
          documentContext,
          model,
          temperature,
          bloomLevel: bloomFilter || undefined,
          questionType,
        },
      });

      if (fnError) throw new Error(fnError.message);
      if (data.error) throw new Error(data.error);

      if (data.questions && data.questions.length > 0) {
        onQuestionsGenerated(data.questions);
        toast.success(`${data.questions.length} sual uğurla yaradıldı!`);
      } else {
        throw new Error("Sual yaradıla bilmədi");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Xəta baş verdi";
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExtract = async () => {
    if (activeDocuments.length === 0) {
      toast.error("Ən azı bir sənəd yükləyin");
      return;
    }
    setIsGenerating(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("generate-quiz", {
        body: {
          topic: "Sənəddəki mövcud sualları tap və çıxar",
          subject: getEffectiveSubject() || "Ümumi",
          difficulty: "medium",
          questionCount: 50,
          agentId: "quiz-master",
          documentContext: getDocumentContext(),
          model,
          temperature: 0.1,
          templatePrompt: `Bu sənəddəki MÖVCUD sualları tap. Yeni sual YARATMA.
Sənəddə olan sualları olduğu kimi çıxar və strukturlaşdır.
Hər sual üçün düzgün cavabı da göstər (sənəddə varsa).`,
          questionType,
        },
      });
      if (fnError) throw new Error(fnError.message);
      if (data.error) throw new Error(data.error);
      if (data.questions?.length > 0) {
        onQuestionsGenerated(data.questions);
        toast.success(`${data.questions.length} sual çıxarıldı!`);
      } else {
        throw new Error("Sənəddə sual tapılmadı");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Xəta baş verdi");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-border/50 bg-muted/20 p-4">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold">Sənəddən Sual Yaratma Parametrləri</h4>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2">
        <Button
          variant={mode === "generate" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("generate")}
          className="flex-1"
        >
          <Sparkles className="mr-1 h-3 w-3" /> Yeni Sual Yarat
        </Button>
        <Button
          variant={mode === "extract" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("extract")}
          className="flex-1"
        >
          <FileSearch className="mr-1 h-3 w-3" /> Mövcud Sualları Çıxar
        </Button>
      </div>

      {mode === "extract" && (
        <p className="text-xs text-muted-foreground rounded-lg bg-primary/5 border border-primary/20 px-3 py-2">
          AI sənəddəki hazır sualları tapıb strukturlaşdıracaq. Yeni sual yaratmayacaq.
        </p>
      )}

      <div className={mode === "extract" ? "hidden" : "grid gap-4 sm:grid-cols-2 md:grid-cols-3"}>
        {/* Subject */}
        <div>
          <Label className="text-xs">Fənn</Label>
          <Select value={subject || "no-selection"} onValueChange={(v) => setSubject(v === "no-selection" ? "" : v)}>
            <SelectTrigger className="mt-1 h-9 text-xs">
              <SelectValue placeholder="Seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-selection" disabled>Seçin</SelectItem>
              {SUBJECT_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
              <SelectItem value="custom">Xüsusi fənn...</SelectItem>
            </SelectContent>
          </Select>
          {subject === "custom" && (
            <Input
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              placeholder="Fənn adını yazın"
              className="mt-1 h-8 text-xs"
            />
          )}
        </div>

        {/* Question Type */}
        <div>
          <Label className="text-xs">Sual Tipi</Label>
          <Select value={questionType} onValueChange={setQuestionType}>
            <SelectTrigger className="mt-1 h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QUESTION_TYPES.map((qt) => (
                <SelectItem key={qt.value} value={qt.value}>{qt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Difficulty */}
        <div>
          <Label className="text-xs">Çətinlik</Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="mt-1 h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Asan</SelectItem>
              <SelectItem value="medium">Orta</SelectItem>
              <SelectItem value="hard">Çətin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Question Count */}
        <div>
          <Label className="text-xs">Sual Sayı</Label>
          <Select value={questionCount} onValueChange={setQuestionCount}>
            <SelectTrigger className="mt-1 h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 sual</SelectItem>
              <SelectItem value="5">5 sual</SelectItem>
              <SelectItem value="10">10 sual</SelectItem>
              <SelectItem value="15">15 sual</SelectItem>
              <SelectItem value="20">20 sual</SelectItem>
              <SelectItem value="custom">Xüsusi...</SelectItem>
            </SelectContent>
          </Select>
          {questionCount === "custom" && (
            <Input
              type="number"
              min={1}
              max={50}
              value={customCount}
              onChange={(e) => setCustomCount(e.target.value)}
              placeholder="1-50"
              className="mt-1 h-8 text-xs"
            />
          )}
        </div>

        {/* Bloom Level */}
        <div>
          <Label className="text-xs">Bloom Səviyyəsi</Label>
          <Select value={bloomFilter || "all"} onValueChange={(v) => setBloomFilter(v === "all" ? "" : v)}>
            <SelectTrigger className="mt-1 h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Hamısı (qarışıq)</SelectItem>
              {getBloomLevels().map((l) => (
                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {mode === "generate" ? (
        <Button
          variant="game"
          onClick={handleGenerate}
          disabled={isGenerating || activeDocuments.length === 0}
          className="w-full"
        >
          {isGenerating ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Suallar yaradılır...</>
          ) : (
            <><Sparkles className="mr-2 h-4 w-4" />Sənəddən {getEffectiveCount()} Sual Yarat</>
          )}
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={handleExtract}
          disabled={isGenerating || activeDocuments.length === 0}
          className="w-full border-primary text-primary hover:bg-primary/10"
        >
          {isGenerating ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Suallar çıxarılır...</>
          ) : (
            <><FileSearch className="mr-2 h-4 w-4" />Sənəddəki Sualları Çıxar</>
          )}
        </Button>
      )}
    </div>
  );
}
