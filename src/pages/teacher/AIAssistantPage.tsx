import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  Lightbulb,
  Wand2,
  ArrowRight,
  AlertCircle,
  FileText,
  Settings2,
  Upload,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { EditableQuestionCard, GeneratedQuestion } from "@/components/quiz/EditableQuestionCard";
import { AgentSelector, agents } from "@/components/ai/AgentSelector";
import { TemplateLibrary, PromptTemplate } from "@/components/ai/TemplateLibrary";
import { DocumentUploader } from "@/components/ai/DocumentUploader";
import { supabase as supabaseClient } from "@/integrations/supabase/client";

interface UploadedDocument {
  id: string;
  fileName: string;
  content: string;
  fullContent: string;
}

const suggestedTopics = [
  "Cəbr: Xətti tənliklər",
  "Həndəsə: Dairə",
  "Fizika: Nyuton qanunları",
  "Kimya: Dövri sistem",
  "Biologiya: Hüceyrə",
  "Tarix: Azərbaycan Xalq Cümhuriyyəti",
];

const subjectLabels: Record<string, string> = {
  math: "Riyaziyyat",
  physics: "Fizika",
  chemistry: "Kimya",
  biology: "Biologiya",
  history: "Tarix",
  geography: "Coğrafiya",
};

export default function AIAssistantPage() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState("5");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);

  const selectedAgent = agents[0]; // Quiz Master

  const handleDocumentProcessed = (document: UploadedDocument) => {
    setUploadedDocuments(prev => [...prev, document]);
  };

  const handleRemoveDocument = (id: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  // Get combined document context for AI
  const getDocumentContext = () => {
    if (uploadedDocuments.length === 0) return '';
    return uploadedDocuments.map(doc => 
      `--- Sənəd: ${doc.fileName} ---\n${doc.fullContent}`
    ).join('\n\n');
  };

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
    setError(null);
    setGeneratedQuestions([]);

    try {
      const documentContext = getDocumentContext();
      
      const { data, error: fnError } = await supabase.functions.invoke('generate-quiz', {
        body: {
          topic,
          subject: subjectLabels[subject] || subject,
          difficulty,
          questionCount: parseInt(questionCount),
          agentId: selectedAgent.id,
          templatePrompt: selectedTemplate?.prompt,
          documentContext: documentContext || undefined
        }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.questions && data.questions.length > 0) {
        setGeneratedQuestions(data.questions);
        toast.success(`${data.questions.length} sual uğurla yaradıldı!`);
      } else {
        throw new Error("Sual yaradıla bilmədi");
      }
    } catch (err) {
      console.error('Quiz generation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Xəta baş verdi';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateQuestion = (updatedQuestion: GeneratedQuestion) => {
    setGeneratedQuestions(prev => 
      prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q)
    );
  };

  const handleDeleteQuestion = (id: string) => {
    setGeneratedQuestions(prev => prev.filter(q => q.id !== id));
    toast.success("Sual silindi");
  };

  const useAllQuestions = () => {
    toast.success("Suallar quizə əlavə edildi!");
    navigate('/teacher/create');
  };

  const handleSelectTemplate = (template: PromptTemplate) => {
    setSelectedTemplate(template);
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-sm text-accent">
            <Sparkles className="h-4 w-4" />
            <span>AI Köməkçi</span>
          </div>
          <h1 className="mb-2 font-display text-3xl font-bold text-foreground">
            Süni Zəka ilə Test Sualı Yaradın
          </h1>
          <p className="text-muted-foreground">
            Şablon istifadə edin və ya sənəddən suallar yaradın
          </p>
        </div>


        {/* Tabs */}
        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="generate" className="gap-2">
              <Wand2 className="h-4 w-4" />
              <span className="hidden sm:inline">Sual Yarat</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Sənəddən</span>
              {uploadedDocuments.length > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {uploadedDocuments.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Şablonlar</span>
            </TabsTrigger>
          </TabsList>

          {/* Generate Tab */}
          <TabsContent value="generate" className="space-y-6">
            <div className="rounded-2xl bg-gradient-card border border-border/50 p-6">
              <div className="grid gap-6">
                {/* Template indicator */}
                {selectedTemplate && (
                  <div className="flex items-center justify-between rounded-lg bg-primary/10 border border-primary/30 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Settings2 className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">
                        Şablon: {selectedTemplate.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTemplate(null)}
                      className="text-xs"
                    >
                      Ləğv et
                    </Button>
                  </div>
                )}

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

                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/30 p-4 text-destructive">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

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
                      {selectedAgent.name} suallar yaradır...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      {selectedAgent.name} ilə Sual Yarat
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Generated Questions */}
            {generatedQuestions.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/20">
                      <Lightbulb className="h-5 w-5 text-success" />
                    </div>
                    <h2 className="font-display text-xl font-bold text-foreground">
                      Yaradılmış Suallar
                    </h2>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={async () => {
                        try {
                          const questionsToSave = generatedQuestions.map(q => ({
                            question: q.question,
                            type: 'multiple_choice',
                            options: q.options,
                            correctAnswer: q.options[q.correctAnswer] || q.options[0],
                            explanation: q.explanation,
                            category: subject ? subjectLabels[subject] : undefined,
                            difficulty: difficulty === 'easy' ? 'asan' : difficulty === 'hard' ? 'çətin' : 'orta',
                          }));
                          
                          const { error } = await supabaseClient.functions.invoke('question-bank', {
                            body: { action: 'save', questions: questionsToSave }
                          });
                          
                          if (error) throw error;
                          toast.success(`${generatedQuestions.length} sual bankına əlavə edildi!`);
                        } catch (err) {
                          console.error('Save error:', err);
                          toast.error('Sualları saxlamaq mümkün olmadı');
                        }
                      }}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Bankına Saxla
                    </Button>
                    <Button variant="game" onClick={useAllQuestions}>
                      Hamısını İstifadə Et
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {generatedQuestions.map((question, index) => (
                  <EditableQuestionCard
                    key={question.id}
                    question={question}
                    index={index}
                    onUpdate={handleUpdateQuestion}
                    onDelete={handleDeleteQuestion}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="rounded-2xl bg-gradient-card border border-border/50 p-6">
              <div className="mb-6">
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  Sənəddən Sual Yaradın
                </h3>
                <p className="text-sm text-muted-foreground">
                  PDF, DOCX və ya TXT sənədləri yükləyin. AI həmin sənədlərin məzmunundan suallar yaradacaq.
                </p>
              </div>
              
              <DocumentUploader
                onDocumentProcessed={handleDocumentProcessed}
                uploadedDocuments={uploadedDocuments}
                onRemoveDocument={handleRemoveDocument}
              />

              {uploadedDocuments.length > 0 && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <p className="text-sm text-primary font-medium">
                    ✓ {uploadedDocuments.length} sənəd yüklənib. 
                    "Sual Yarat" tabına keçərək bu sənədlərdən sual yarada bilərsiniz.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>


          {/* Templates Tab */}
          <TabsContent value="templates">
            <div className="rounded-2xl bg-gradient-card border border-border/50 p-6">
              <TemplateLibrary onSelectTemplate={handleSelectTemplate} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
