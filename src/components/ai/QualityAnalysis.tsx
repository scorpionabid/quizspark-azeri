import { useState } from "react";
import { CheckCircle2, AlertTriangle, BarChart3, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GeneratedQuestion } from "@/components/quiz/EditableQuestionCard";

interface QualityScore {
  clarity: number;
  distractorStrength: number;
  bloomAlignment: number;
  overall: number;
  suggestions: string[];
}

interface QualityAnalysisProps {
  questions: GeneratedQuestion[];
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function getProgressColor(score: number) {
  if (score >= 80) return "[&>div]:bg-green-500";
  if (score >= 60) return "[&>div]:bg-yellow-500";
  return "[&>div]:bg-red-500";
}

function getScoreLabel(score: number) {
  if (score >= 90) return "Əla";
  if (score >= 80) return "Yaxşı";
  if (score >= 60) return "Orta";
  if (score >= 40) return "Zəif";
  return "Çox zəif";
}

export function QualityAnalysis({ questions }: QualityAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [qualityScore, setQualityScore] = useState<QualityScore | null>(null);

  const handleAnalyze = async () => {
    if (questions.length === 0) {
      toast.error("Analiz üçün sual yoxdur");
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("enhance-question", {
        body: {
          question: {
            question: questions.map((q) => q.question).join("\n---\n"),
            options: questions[0]?.options || [],
            correctAnswer: questions[0]?.correctAnswer || 0,
            explanation: questions[0]?.explanation || "",
            bloomLevel: questions[0]?.bloomLevel || "",
          },
          action: "quality_analysis",
        },
      });

      if (error) throw error;

      if (data?.analysis) {
        setQualityScore(data.analysis);
      } else {
        // Fallback: calculate local quality metrics
        const clarity = calculateClarity(questions);
        const distractorStrength = calculateDistractorStrength(questions);
        const bloomAlignment = calculateBloomAlignment(questions);
        const overall = Math.round((clarity + distractorStrength + bloomAlignment) / 3);

        const suggestions: string[] = [];
        if (clarity < 70) suggestions.push("Bəzi sualların mətni daha aydın yazılmalıdır");
        if (distractorStrength < 70) suggestions.push("Distraktorlar (yanlış variantlar) daha inandırıcı olmalıdır");
        if (bloomAlignment < 70) suggestions.push("Suallar müxtəlif Bloom səviyyələrini əhatə etməlidir");
        if (questions.some((q) => !q.explanation)) suggestions.push("Bütün suallara izah əlavə edin");

        setQualityScore({ clarity, distractorStrength, bloomAlignment, overall, suggestions });
      }

      toast.success("Keyfiyyət analizi tamamlandı");
    } catch (err) {
      console.error("Quality analysis error:", err);
      // Local fallback
      const clarity = calculateClarity(questions);
      const distractorStrength = calculateDistractorStrength(questions);
      const bloomAlignment = calculateBloomAlignment(questions);
      const overall = Math.round((clarity + distractorStrength + bloomAlignment) / 3);

      const suggestions: string[] = [];
      if (clarity < 70) suggestions.push("Bəzi sualların mətni daha aydın yazılmalıdır");
      if (distractorStrength < 70) suggestions.push("Distraktorlar daha inandırıcı olmalıdır");
      if (questions.some((q) => !q.explanation)) suggestions.push("Bütün suallara izah əlavə edin");

      setQualityScore({ clarity, distractorStrength, bloomAlignment, overall, suggestions });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="rounded-xl border border-border/50 bg-gradient-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="font-display text-lg font-semibold text-foreground">
            Keyfiyyət Analizi
          </h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAnalyze}
          disabled={isAnalyzing || questions.length === 0}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analiz edilir...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Analiz Et
            </>
          )}
        </Button>
      </div>

      {!qualityScore && !isAnalyzing && (
        <p className="text-sm text-muted-foreground">
          Sualları yaratdıqdan sonra keyfiyyət analizini işə salın
        </p>
      )}

      {qualityScore && (
        <div className="space-y-4">
          {/* Overall Score */}
          <div className="flex items-center gap-4 rounded-lg bg-muted/30 p-4">
            <div className={cn("text-3xl font-bold", getScoreColor(qualityScore.overall))}>
              {qualityScore.overall}%
            </div>
            <div>
              <p className="font-medium text-foreground">Ümumi Keyfiyyət</p>
              <Badge
                variant="outline"
                className={cn("mt-1", getScoreColor(qualityScore.overall))}
              >
                {getScoreLabel(qualityScore.overall)}
              </Badge>
            </div>
          </div>

          {/* Individual Scores */}
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Aydınlıq</span>
                <span className={cn("font-medium", getScoreColor(qualityScore.clarity))}>
                  {qualityScore.clarity}%
                </span>
              </div>
              <Progress
                value={qualityScore.clarity}
                className={cn("h-2", getProgressColor(qualityScore.clarity))}
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Distraktor Gücü</span>
                <span className={cn("font-medium", getScoreColor(qualityScore.distractorStrength))}>
                  {qualityScore.distractorStrength}%
                </span>
              </div>
              <Progress
                value={qualityScore.distractorStrength}
                className={cn("h-2", getProgressColor(qualityScore.distractorStrength))}
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Bloom Uyğunluğu</span>
                <span className={cn("font-medium", getScoreColor(qualityScore.bloomAlignment))}>
                  {qualityScore.bloomAlignment}%
                </span>
              </div>
              <Progress
                value={qualityScore.bloomAlignment}
                className={cn("h-2", getProgressColor(qualityScore.bloomAlignment))}
              />
            </div>
          </div>

          {/* Suggestions */}
          {qualityScore.suggestions.length > 0 && (
            <div className="space-y-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 p-3 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Təkliflər</span>
              </div>
              <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-400">
                {qualityScore.suggestions.map((suggestion, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-yellow-500 flex-shrink-0" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {qualityScore.suggestions.length === 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-900/10 p-3 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Suallar yaxşı keyfiyyətdədir!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Local quality calculation helpers
function calculateClarity(questions: GeneratedQuestion[]): number {
  let score = 0;
  for (const q of questions) {
    let qScore = 60;
    if (q.question.length > 20) qScore += 10;
    if (q.question.endsWith("?")) qScore += 10;
    if (q.explanation && q.explanation.length > 10) qScore += 10;
    if (q.options.every((o) => o.length > 3)) qScore += 10;
    score += Math.min(qScore, 100);
  }
  return questions.length > 0 ? Math.round(score / questions.length) : 0;
}

function calculateDistractorStrength(questions: GeneratedQuestion[]): number {
  let score = 0;
  for (const q of questions) {
    let qScore = 50;
    const uniqueOptions = new Set(q.options.map((o) => o.toLowerCase().trim()));
    if (uniqueOptions.size === q.options.length) qScore += 20;
    const avgLen = q.options.reduce((s, o) => s + o.length, 0) / q.options.length;
    const lenVariance =
      q.options.reduce((s, o) => s + Math.abs(o.length - avgLen), 0) / q.options.length;
    if (lenVariance < avgLen * 0.5) qScore += 15;
    if (q.options.length >= 4) qScore += 15;
    score += Math.min(qScore, 100);
  }
  return questions.length > 0 ? Math.round(score / questions.length) : 0;
}

function calculateBloomAlignment(questions: GeneratedQuestion[]): number {
  const bloomLevels = new Set(questions.map((q) => q.bloomLevel).filter(Boolean));
  if (questions.length === 0) return 0;
  const hasBloom = questions.filter((q) => q.bloomLevel).length;
  const coverage = (bloomLevels.size / Math.min(questions.length, 6)) * 100;
  const labelRate = (hasBloom / questions.length) * 100;
  return Math.round((coverage * 0.4 + labelRate * 0.6));
}
