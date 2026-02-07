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
  Save,
  Layers,
  Plus,
  X
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
import { agents } from "@/components/ai/AgentSelector";
import { TemplateLibrary, PromptTemplate } from "@/components/ai/TemplateLibrary";
import { DocumentUploader } from "@/components/ai/DocumentUploader";
import { useCreateQuestionBank } from "@/hooks/useQuestionBank";
import { AIParametersPanel, AIParameters } from "@/components/ai/AIParametersPanel";
import { getBloomLevels } from "@/components/ai/BloomLevelBadge";
import { GenerationStats } from "@/components/ai/GenerationStats";
import { ImageGenerator } from "@/components/ai/ImageGenerator";
import { QualityAnalysis } from "@/components/ai/QualityAnalysis";

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

// Batch topic interface
interface BatchTopic {
  id: string;
  topic: string;
  subject: string;
  questionCount: number;
}

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
  const [aiParameters, setAIParameters] = useState<AIParameters>({
    model: 'google/gemini-2.5-flash',
    temperature: 0.7,
    maxTokens: 4096,
  });
  const [bloomFilter, setBloomFilter] = useState<string>("");
  
  // Batch mode state
  const [batchMode, setBatchMode] = useState(false);
  const [batchTopics, setBatchTopics] = useState<BatchTopic[]>([]);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);

  const selectedAgent = agents[0]; // Quiz Master
  const createQuestion = useCreateQuestionBank();

  // Add single question to bank
  const handleAddToBank = async (question: GeneratedQuestion) => {
    const difficultyMap: Record<string, string> = {
      easy: 'asan',
      medium: 'orta',
      hard: 'çətin',
    };

    return new Promise<void>((resolve, reject) => {
      createQuestion.mutate(
        {
          question_text: question.question,
          question_type: 'multiple_choice',
          options: question.options,
          correct_answer: question.options[question.correctAnswer] || question.options[0],
          explanation: question.explanation || null,
          category: subject ? subjectLabels[subject] : null,
          difficulty: difficultyMap[difficulty] || 'orta',
          bloom_level: question.bloomLevel || null,
          tags: null,
          user_id: null,
          source_document_id: null,
          question_image_url: null,
          option_images: null,
          media_type: null,
          media_url: null,
        },
        {
          onSuccess: () => {
            toast.success('Sual bankına əlavə edildi');
            resolve();
          },
          onError: (err) => {
            toast.error('Xəta baş verdi');
            reject(err);
          },
        }
      );
    });
  };

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
          documentContext: documentContext || undefined,
          model: aiParameters.model,
          temperature: aiParameters.temperature,
          bloomLevel: bloomFilter || undefined
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

  // Batch mode functions
  const handleAddBatchTopic = () => {
    if (!topic.trim() || !subject) {
      toast.error("Mövzu və fənn seçin");
      return;
    }
    
    setBatchTopics(prev => [...prev, {
      id: `batch-${Date.now()}`,
      topic: topic.trim(),
      subject,
      questionCount: parseInt(questionCount),
    }]);
    setTopic("");
    toast.success("Mövzu siyahıya əlavə edildi");
  };

  const handleRemoveBatchTopic = (id: string) => {
    setBatchTopics(prev => prev.filter(t => t.id !== id));
  };

  const handleBatchGenerate = async () => {
    if (batchTopics.length === 0) {
      toast.error("Ən azı bir mövzu əlavə edin");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedQuestions([]);
    setBatchProgress({ current: 0, total: batchTopics.length });

    try {
      const allQuestions: GeneratedQuestion[] = [];

      for (let i = 0; i < batchTopics.length; i++) {
        const batchTopic = batchTopics[i];
        setBatchProgress({ current: i + 1, total: batchTopics.length });

        const { data, error: fnError } = await supabase.functions.invoke('generate-quiz', {
          body: {
            topic: batchTopic.topic,
            subject: subjectLabels[batchTopic.subject] || batchTopic.subject,
            difficulty,
            questionCount: batchTopic.questionCount,
            agentId: selectedAgent.id,
            model: aiParameters.model,
            temperature: aiParameters.temperature,
            bloomLevel: bloomFilter || undefined
          }
        });

        if (fnError) {
          console.error(`Error for topic ${batchTopic.topic}:`, fnError);
          continue;
        }

        if (data.questions) {
          allQuestions.push(...data.questions);
        }
      }

      if (allQuestions.length > 0) {
        setGeneratedQuestions(allQuestions);
        toast.success(`${allQuestions.length} sual uğurla yaradıldı!`);
        setBatchTopics([]);
      } else {
        throw new Error("Heç bir sual yaradıla bilmədi");
      }
    } catch (err) {
      console.error('Batch generation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Xəta baş verdi';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
      setBatchProgress(null);
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

  const handleSimilarCreated = (newQuestion: GeneratedQuestion) => {
    setGeneratedQuestions(prev => [...prev, newQuestion]);
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

                {/* AI Parameters Panel */}
                <AIParametersPanel
                  parameters={aiParameters}
                  onChange={setAIParameters}
                />

                {/* Generation Stats */}
                <GenerationStats />

                {/* Batch Mode Toggle */}
                <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Toplu Sual Yaratma</span>
                  </div>
                  <Button
                    variant={batchMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBatchMode(!batchMode)}
                  >
                    {batchMode ? "Aktiv" : "Aktivləşdir"}
                  </Button>
                </div>

                {/* Batch Topics List */}
                {batchMode && batchTopics.length > 0 && (
                  <div className="space-y-2 rounded-lg border border-primary/30 bg-primary/5 p-4">
                    <Label className="text-sm font-medium">Siyahıdakı mövzular:</Label>
                    {batchTopics.map((bt, idx) => (
                      <div key={bt.id} className="flex items-center justify-between rounded-md bg-background p-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                            {idx + 1}
                          </span>
                          <span className="text-sm">{bt.topic}</span>
                          <span className="text-xs text-muted-foreground">
                            ({subjectLabels[bt.subject]}, {bt.questionCount} sual)
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveBatchTopic(bt.id)}
                          className="h-6 w-6 p-0 text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
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

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
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

                  <div>
                    <Label>Bloom Səviyyəsi</Label>
                    <Select value={bloomFilter} onValueChange={setBloomFilter}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Hamısı" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Hamısı (qarışıq)</SelectItem>
                        {getBloomLevels().map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
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

                {/* Action Buttons */}
                {batchMode ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleAddBatchTopic}
                      disabled={isGenerating || !topic.trim() || !subject}
                      className="flex-1"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Siyahıya Əlavə Et
                    </Button>
                    <Button
                      variant="game"
                      onClick={handleBatchGenerate}
                      disabled={isGenerating || batchTopics.length === 0}
                      className="flex-1"
                    >
                      {isGenerating ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          {batchProgress ? `${batchProgress.current}/${batchProgress.total}` : 'Yaradılır...'}
                        </>
                      ) : (
                        <>
                          <Layers className="mr-2 h-4 w-4" />
                          Hamısını Yarat ({batchTopics.reduce((sum, t) => sum + t.questionCount, 0)} sual)
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
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
                )}
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
                    <Button variant="game" onClick={useAllQuestions}>
                      Hamısını İstifadə Et
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Quality Analysis */}
                <QualityAnalysis questions={generatedQuestions} />

                {generatedQuestions.map((question, index) => (
                  <EditableQuestionCard
                    key={question.id}
                    question={question}
                    index={index}
                    onUpdate={handleUpdateQuestion}
                    onDelete={handleDeleteQuestion}
                    onAddToBank={handleAddToBank}
                    onSimilarCreated={handleSimilarCreated}
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
