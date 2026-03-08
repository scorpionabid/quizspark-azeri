import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wand2,
  Upload,
  FileText,
  MessageSquare,
  History,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GeneratedQuestion } from "@/components/quiz/EditableQuestionCard";
import { agents } from "@/components/ai/AgentSelector";
import { TemplateLibrary, PromptTemplate } from "@/components/ai/TemplateLibrary";
import { UploadedDocument } from "@/components/ai/DocumentUploader";
import { useCreateQuestionBank, QuestionBankItem } from "@/hooks/useQuestionBank";
import { AIParameters } from "@/components/ai/AIParametersPanel";
import { SUBJECT_LABELS } from "@/lib/constants/subjects";
import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";
import { ChatInterface } from "@/components/ai/ChatInterface";
import { AIPageHeader } from "@/components/teacher/ai-assistant/AIPageHeader";
import { AIQuestionGenerator } from "@/components/teacher/ai-assistant/AIQuestionGenerator";
import { AIGeneratedResults } from "@/components/teacher/ai-assistant/AIGeneratedResults";
import { AIDocumentSection } from "@/components/teacher/ai-assistant/AIDocumentSection";

const HISTORY_KEY = "ai-assistant-history";
const HISTORY_SESSIONS_KEY = "ai-assistant-sessions";
const RECENT_TOPICS_KEY = "ai-assistant-recent-topics";
const MAX_RECENT_TOPICS = 6;
const MAX_SESSIONS = 20;

interface GenerationSession {
  id: string;
  topic: string;
  subject: string;
  questionCount: number;
  createdAt: string;
  questions: GeneratedQuestion[];
}

const suggestedTopics = [
  "Cəbr: Xətti tənliklər",
  "Həndəsə: Dairə",
  "Fizika: Nyuton qanunları",
  "Kimya: Dövri sistem",
  "Biologiya: Hüceyrə",
  "Tarix: Azərbaycan Xalq Cümhuriyyəti",
];

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
  const [customSubject, setCustomSubject] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState("5");
  const [customCount, setCustomCount] = useState("");
  const [questionType, setQuestionType] = useState("multiple_choice");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [aiParameters, setAIParameters] = useState<AIParameters>({
    model: "google/gemini-2.5-flash",
    temperature: 0.7,
    maxTokens: 4096,
  });
  const [bloomFilter, setBloomFilter] = useState<string>("");
  const [batchMode, setBatchMode] = useState(false);
  const [batchTopics, setBatchTopics] = useState<BatchTopic[]>([]);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);
  const [isBulkAdding, setIsBulkAdding] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0].id);
  const [activeTab, setActiveTab] = useState("generate");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [recentTopics, setRecentTopics] = useState<string[]>([]);
  const [historySessions, setHistorySessions] = useState<GenerationSession[]>([]);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) ?? agents[0];
  const createQuestion = useCreateQuestionBank();

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGeneratedQuestions(parsed);
        }
      }
      const savedTopics = localStorage.getItem(RECENT_TOPICS_KEY);
      if (savedTopics) setRecentTopics(JSON.parse(savedTopics));
      const savedSessions = localStorage.getItem(HISTORY_SESSIONS_KEY);
      if (savedSessions) setHistorySessions(JSON.parse(savedSessions));
    } catch { /* ignore */ }
  }, []);

  // Save to localStorage when questions change
  useEffect(() => {
    if (generatedQuestions.length > 0) {
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(generatedQuestions));
      } catch { /* ignore */ }
    }
  }, [generatedQuestions]);

  const getEffectiveSubject = () => {
    if (subject === "custom") return customSubject;
    return SUBJECT_LABELS[subject] || subject;
  };

  const getEffectiveCount = () => {
    if (questionCount === "custom") return parseInt(customCount) || 5;
    return parseInt(questionCount);
  };

  const handleAddToBank = async (question: GeneratedQuestion) => {
    const difficultyMap: Record<string, string> = {
      easy: "asan",
      medium: "orta",
      hard: "çətin",
    };
    const qType = question.questionType || "multiple_choice";

    return new Promise<void>((resolve, reject) => {
      const questionData: Omit<QuestionBankItem, 'id' | 'created_at' | 'updated_at'> = {
        title: question.question.slice(0, 100),
        question_text: question.question,
        question_type: qType,
        options: qType === "multiple_choice" ? question.options : (qType === "true_false" ? ["Doğru", "Yanlış"] : question.options),
        correct_answer: question.options[question.correctAnswer] || question.options[0],
        explanation: question.explanation || null,
        category: getEffectiveSubject() || null,
        difficulty: difficultyMap[difficulty] || "orta",
        bloom_level: question.bloomLevel || null,
        weight: 1,
        time_limit: 60,
        tags: null,
        user_id: null,
        source_document_id: null,
        question_image_url: question.questionImageUrl || null,
        option_images: null,
        media_type: null,
        media_url: null,
        hint: null,
        per_option_explanations: null,
        video_url: null,
        video_start_time: null,
        video_end_time: null,
        model_3d_url: null,
        model_3d_type: null,
        hotspot_data: null,
        matching_pairs: null,
        sequence_items: null,
        fill_blank_template: null,
        numerical_answer: null,
        numerical_tolerance: null,
        feedback_enabled: true,
        quality_score: null,
        usage_count: 0,
      };

      createQuestion.mutate(questionData, {
        onSuccess: () => {
          toast.success("Sual bankına əlavə edildi");
          resolve();
        },
        onError: (err) => {
          toast.error("Xəta baş verdi");
          reject(err);
        },
      });
    });
  };

  const handleBulkAddToBank = async () => {
    if (generatedQuestions.length === 0) return;
    setIsBulkAdding(true);
    let successCount = 0;
    for (const q of generatedQuestions) {
      try {
        await handleAddToBank(q);
        successCount++;
      } catch { /* continue */ }
    }
    setIsBulkAdding(false);
    if (successCount > 0) {
      toast.success(`${successCount} sual bankına əlavə edildi!`);
    }
  };

  const handleDocumentProcessed = (document: UploadedDocument) => {
    setUploadedDocuments((prev) => [...prev, document]);
  };

  const handleRemoveDocument = (id: string) => {
    setUploadedDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleToggleDocument = (id: string) => {
    setUploadedDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, active: !doc.active } : doc))
    );
  };

  const getDocumentContext = () => {
    const activeDocs = uploadedDocuments.filter((d) => d.active !== false);
    if (activeDocs.length === 0) return "";
    return activeDocs.map((doc) => `--- Sənəd: ${doc.fileName} ---\n${doc.fullContent}`).join("\n\n");
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Mövzu daxil edin");
      return;
    }
    const effectiveSubject = getEffectiveSubject();
    if (!effectiveSubject) {
      toast.error("Fənn seçin");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedQuestions([]);
    setFilterDifficulty("all");
    setFilterType("all");

    try {
      const documentContext = getDocumentContext();
      const count = getEffectiveCount();

      const { data, error: fnError } = await supabase.functions.invoke("generate-quiz", {
        body: {
          topic,
          subject: effectiveSubject,
          difficulty,
          questionCount: count,
          agentId: selectedAgent.id,
          templatePrompt: selectedTemplate?.prompt,
          documentContext: documentContext || undefined,
          model: aiParameters.model,
          temperature: aiParameters.temperature,
          bloomLevel: bloomFilter || undefined,
          questionType,
        },
      });

      if (fnError) throw new Error(fnError.message);
      if (data.error) throw new Error(data.error);

      if (data.questions && data.questions.length > 0) {
        setGeneratedQuestions(data.questions);
        toast.success(`${data.questions.length} sual uğurla yaradıldı!`);

        // Save recent topic
        setRecentTopics(prev => {
          const updated = [topic, ...prev.filter(t => t !== topic)].slice(0, MAX_RECENT_TOPICS);
          localStorage.setItem(RECENT_TOPICS_KEY, JSON.stringify(updated));
          return updated;
        });

        // Save session to history
        const newSession: GenerationSession = {
          id: `session-${Date.now()}`,
          topic,
          subject: effectiveSubject,
          questionCount: data.questions.length,
          createdAt: new Date().toISOString(),
          questions: data.questions,
        };
        setHistorySessions(prev => {
          const updated = [newSession, ...prev].slice(0, MAX_SESSIONS);
          localStorage.setItem(HISTORY_SESSIONS_KEY, JSON.stringify(updated));
          return updated;
        });
      } else {
        throw new Error("Sual yaradıla bilmədi");
      }
    } catch (err) {
      console.error("Quiz generation error:", err);
      const errorMessage = err instanceof Error ? err.message : "Xəta baş verdi";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddBatchTopic = () => {
    const effectiveSubject = getEffectiveSubject();
    if (!topic.trim() || !effectiveSubject) {
      toast.error("Mövzu və fənn seçin");
      return;
    }
    setBatchTopics((prev) => [
      ...prev,
      {
        id: `batch-${Date.now()}`,
        topic: topic.trim(),
        subject,
        questionCount: getEffectiveCount(),
      },
    ]);
    setTopic("");
    toast.success("Mövzu siyahıya əlavə edildi");
  };

  const handleRemoveBatchTopic = (id: string) => {
    setBatchTopics((prev) => prev.filter((t) => t.id !== id));
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
        const bt = batchTopics[i];
        setBatchProgress({ current: i + 1, total: batchTopics.length });
        const { data, error: fnError } = await supabase.functions.invoke("generate-quiz", {
          body: {
            topic: bt.topic,
            subject: SUBJECT_LABELS[bt.subject] || bt.subject,
            difficulty,
            questionCount: bt.questionCount,
            agentId: selectedAgent.id,
            model: aiParameters.model,
            temperature: aiParameters.temperature,
            bloomLevel: bloomFilter || undefined,
            questionType,
          },
        });
        if (fnError) {
          console.error(`Error for topic ${bt.topic}:`, fnError);
          continue;
        }
        if (data.questions) allQuestions.push(...data.questions);
      }
      if (allQuestions.length > 0) {
        setGeneratedQuestions(allQuestions);
        toast.success(`${allQuestions.length} sual uğurla yaradıldı!`);
        setBatchTopics([]);
      } else {
        throw new Error("Heç bir sual yaradıla bilmədi");
      }
    } catch (err) {
      console.error("Batch generation error:", err);
      const errorMessage = err instanceof Error ? err.message : "Xəta baş verdi";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
      setBatchProgress(null);
    }
  };

  const handleUpdateQuestion = (updatedQuestion: GeneratedQuestion) => {
    setGeneratedQuestions((prev) =>
      prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
  };

  const handleDeleteQuestion = (id: string) => {
    setGeneratedQuestions((prev) => prev.filter((q) => q.id !== id));
    toast.success("Sual silindi");
  };

  const handleSimilarCreated = (newQuestion: GeneratedQuestion) => {
    setGeneratedQuestions((prev) => [...prev, newQuestion]);
  };

  const useAllQuestions = () => {
    if (generatedQuestions.length === 0) return;
    navigate("/teacher/create", { state: { importedQuestions: generatedQuestions } });
  };

  const handleSelectTemplate = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setActiveTab("generate");
    toast.success(`"${template.name}" şablonu seçildi`);
  };

  const handleDocumentQuestionsGenerated = (questions: GeneratedQuestion[]) => {
    setGeneratedQuestions(questions);
    setFilterDifficulty("all");
    setFilterType("all");
  };

  const handleClearHistory = () => {
    setGeneratedQuestions([]);
    localStorage.removeItem(HISTORY_KEY);
    toast.success("Tarixçə təmizləndi");
  };

  const filteredQuestions = generatedQuestions.filter((q) => {
    const typeMatch = filterType === "all" || (q.questionType ?? "multiple_choice") === filterType;
    const bloomMatch = filterDifficulty === "all" || q.bloomLevel === filterDifficulty;
    return typeMatch && bloomMatch;
  });

  return (
    <SubscriptionGate
      feature="ai_assistant"
      description="AI Köməkçiyə giriş yalnız VIP müəllimlər üçün mövcuddur. Limitsiz sual yaratma üçün VIP-ə keçin."
    >
      <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <AIPageHeader />

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
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
              <TabsTrigger value="chat" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">AI Söhbət</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">Tarixçə</span>
                {historySessions.length > 0 && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
                    {historySessions.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate">
              <AIQuestionGenerator
                topic={topic} setTopic={setTopic}
                subject={subject} setSubject={setSubject}
                customSubject={customSubject} setCustomSubject={setCustomSubject}
                difficulty={difficulty} setDifficulty={setDifficulty}
                questionCount={questionCount} setQuestionCount={setQuestionCount}
                customCount={customCount} setCustomCount={setCustomCount}
                questionType={questionType} setQuestionType={setQuestionType}
                bloomFilter={bloomFilter} setBloomFilter={setBloomFilter}
                selectedAgentId={selectedAgentId} setSelectedAgentId={setSelectedAgentId}
                aiParameters={aiParameters} setAIParameters={setAIParameters}
                selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate}
                batchMode={batchMode} setBatchMode={setBatchMode}
                batchTopics={batchTopics}
                onAddBatchTopic={handleAddBatchTopic}
                onRemoveBatchTopic={handleRemoveBatchTopic}
                onGenerate={handleGenerate}
                onBatchGenerate={handleBatchGenerate}
                isGenerating={isGenerating}
                batchProgress={batchProgress}
                error={error}
                selectedAgent={selectedAgent}
                suggestedTopics={[...recentTopics, ...suggestedTopics.filter(t => !recentTopics.includes(t))]}
              />
            </TabsContent>

            <TabsContent value="documents">
              <AIDocumentSection
                uploadedDocuments={uploadedDocuments}
                onDocumentProcessed={handleDocumentProcessed}
                onRemoveDocument={handleRemoveDocument}
                onToggleDocument={handleToggleDocument}
                onQuestionsGenerated={handleDocumentQuestionsGenerated}
                aiParameters={aiParameters}
              />
            </TabsContent>

            <TabsContent value="templates">
              <div className="rounded-2xl bg-gradient-card border border-border/50 p-6">
                <TemplateLibrary onSelectTemplate={handleSelectTemplate} />
              </div>
            </TabsContent>

            <TabsContent value="chat" className="space-y-4">
              <ChatInterface agent={selectedAgent} />
            </TabsContent>

            <TabsContent value="history">
              <div className="rounded-2xl bg-gradient-card border border-border/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                      <History className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground">Tarixçə</h3>
                      <p className="text-xs text-muted-foreground">Son {MAX_SESSIONS} generasiya sessiyası</p>
                    </div>
                  </div>
                  {historySessions.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setHistorySessions([]);
                        localStorage.removeItem(HISTORY_SESSIONS_KEY);
                        toast.success("Tarixçə silindi");
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Hamısını Sil
                    </Button>
                  )}
                </div>

                {historySessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Sparkles className="h-10 w-10 text-muted-foreground/40 mb-3" />
                    <p className="text-muted-foreground">Hələ heç bir generasiya yoxdur.</p>
                    <p className="text-sm text-muted-foreground/70">Sual yaratdıqdan sonra burada görünəcək.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {historySessions.map(session => (
                      <div key={session.id} className="flex items-center justify-between rounded-xl border border-border/50 bg-background/50 p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <span className="text-sm font-bold text-primary">{session.questionCount}</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">{session.topic}</p>
                            <p className="text-xs text-muted-foreground">{session.subject} · {new Date(session.createdAt).toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setGeneratedQuestions(session.questions);
                            setActiveTab("generate");
                            toast.success(`"${session.topic}" sessiyası yükləndi`);
                          }}
                        >
                          Yüklə
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {generatedQuestions.length > 0 && (
            <AIGeneratedResults
              questions={generatedQuestions}
              onUpdateQuestion={handleUpdateQuestion}
              onDeleteQuestion={handleDeleteQuestion}
              onSimilarCreated={handleSimilarCreated}
              onBulkAddToBank={handleBulkAddToBank}
              onUseAllQuestions={useAllQuestions}
              onClearHistory={handleClearHistory}
              isBulkAdding={isBulkAdding}
              filterType={filterType}
              setFilterType={setFilterType}
              filterDifficulty={filterDifficulty}
              setFilterDifficulty={setFilterDifficulty}
            />
          )}
        </div>
      </div>
    </SubscriptionGate>
  );
}
