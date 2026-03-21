import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { GeneratedQuestion } from '@/components/quiz/EditableQuestionCard';
import { agents } from '@/components/ai/AgentSelector';
import { PromptTemplate } from '@/components/ai/TemplateLibrary';
import { UploadedDocument } from '@/components/ai/DocumentUploader';
import { useCreateQuestionBank } from '@/hooks/useQuestionBank';
import { AIParameters } from '@/components/ai/AIParametersPanel';
import { SUBJECT_LABELS } from '@/lib/constants/subjects';
import { convertToQuestionBankItem } from '@/utils/questionConverters';

// ─── Constants ────────────────────────────────────────────────────────────────

const HISTORY_KEY = 'ai-assistant-history';
const HISTORY_SESSIONS_KEY = 'ai-assistant-sessions';
const RECENT_TOPICS_KEY = 'ai-assistant-recent-topics';
export const MAX_RECENT_TOPICS = 6;
export const MAX_SESSIONS = 20;

export const SUGGESTED_TOPICS = [
  'Cəbr: Xətti tənliklər',
  'Həndəsə: Dairə',
  'Fizika: Nyuton qanunları',
  'Kimya: Dövri sistem',
  'Biologiya: Hüceyrə',
  'Tarix: Azərbaycan Xalq Cümhuriyyəti',
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GenerationSession {
  id: string;
  topic: string;
  subject: string;
  questionCount: number;
  createdAt: string;
  questions: GeneratedQuestion[];
}

export interface BatchTopic {
  id: string;
  topic: string;
  subject: string;
  questionCount: number;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAIAssistant() {
  const navigate = useNavigate();
  const createQuestion = useCreateQuestionBank();

  // ── Form state ──────────────────────────────────────────────────────────────
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState('5');
  const [customCount, setCustomCount] = useState('');
  const [questionType, setQuestionType] = useState('multiple_choice');
  const [bloomFilter, setBloomFilter] = useState('');
  const [aiParameters, setAIParameters] = useState<AIParameters>({
    model: 'google/gemini-2.5-flash',
    temperature: 0.7,
    maxTokens: 4096,
  });
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0].id);

  // ── Generation state ────────────────────────────────────────────────────────
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [batchMode, setBatchMode] = useState(false);
  const [batchTopics, setBatchTopics] = useState<BatchTopic[]>([]);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);
  const [isBulkAdding, setIsBulkAdding] = useState(false);

  // ── History state ───────────────────────────────────────────────────────────
  const [recentTopics, setRecentTopics] = useState<string[]>([]);
  const [historySessions, setHistorySessions] = useState<GenerationSession[]>([]);

  // ── Document state ──────────────────────────────────────────────────────────
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);

  // ── UI state ────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('generate');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // ─── Effects ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setGeneratedQuestions(parsed);
      }
      const savedTopics = localStorage.getItem(RECENT_TOPICS_KEY);
      if (savedTopics) setRecentTopics(JSON.parse(savedTopics));
      const savedSessions = localStorage.getItem(HISTORY_SESSIONS_KEY);
      if (savedSessions) setHistorySessions(JSON.parse(savedSessions));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (generatedQuestions.length > 0) {
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(generatedQuestions));
      } catch { /* ignore */ }
    }
  }, [generatedQuestions]);

  // ─── Derived ──────────────────────────────────────────────────────────────────

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) ?? agents[0];

  const getEffectiveSubject = useCallback(() => {
    if (subject === 'custom') return customSubject;
    return SUBJECT_LABELS[subject] || subject;
  }, [subject, customSubject]);

  const getEffectiveCount = useCallback(() => {
    if (questionCount === 'custom') return parseInt(customCount) || 5;
    return parseInt(questionCount);
  }, [questionCount, customCount]);

  const filteredQuestions = generatedQuestions.filter((q) => {
    const typeMatch = filterType === 'all' || (q.questionType ?? 'multiple_choice') === filterType;
    const bloomMatch = filterDifficulty === 'all' || q.bloomLevel === filterDifficulty;
    return typeMatch && bloomMatch;
  });

  const suggestedTopics = [
    ...recentTopics,
    ...SUGGESTED_TOPICS.filter((t) => !recentTopics.includes(t)),
  ];

  // ─── Document handlers ────────────────────────────────────────────────────────

  const handleDocumentProcessed = (document: UploadedDocument) => {
    setUploadedDocuments((prev) => [...prev, document]);
  };

  const handleRemoveDocument = (id: string) => {
    setUploadedDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleToggleDocument = (id: string) => {
    setUploadedDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, active: !doc.active } : doc)),
    );
  };

  const getDocumentContext = () => {
    const activeDocs = uploadedDocuments.filter((d) => d.active !== false);
    if (activeDocs.length === 0) return '';
    return activeDocs.map((doc) => `--- Sənəd: ${doc.fileName} ---\n${doc.fullContent}`).join('\n\n');
  };

  // ─── Question bank handlers ───────────────────────────────────────────────────

  const handleAddToBank = async (question: GeneratedQuestion) => {
    const questionData = convertToQuestionBankItem(question, {
      subject: getEffectiveSubject(),
      difficulty,
    });
    return new Promise<void>((resolve, reject) => {
      createQuestion.mutate(questionData, {
        onSuccess: () => { toast.success('Sual bankına əlavə edildi'); resolve(); },
        onError: (err) => { toast.error('Xəta baş verdi'); reject(err); },
      });
    });
  };

  const handleBulkAddToBank = async () => {
    if (generatedQuestions.length === 0) return;
    setIsBulkAdding(true);
    let successCount = 0;
    for (const q of generatedQuestions) {
      try { await handleAddToBank(q); successCount++; } catch { /* continue */ }
    }
    setIsBulkAdding(false);
    if (successCount > 0) toast.success(`${successCount} sual bankına əlavə edildi!`);
  };

  // ─── Generation handlers ──────────────────────────────────────────────────────

  const handleGenerate = async () => {
    if (!topic.trim()) { toast.error('Mövzu daxil edin'); return; }
    const effectiveSubject = getEffectiveSubject();
    if (!effectiveSubject) { toast.error('Fənn seçin'); return; }

    setIsGenerating(true);
    setError(null);
    setGeneratedQuestions([]);
    setFilterDifficulty('all');
    setFilterType('all');

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-quiz', {
        body: {
          topic,
          subject: effectiveSubject,
          difficulty,
          questionCount: getEffectiveCount(),
          agentId: selectedAgent.id,
          templatePrompt: selectedTemplate?.prompt,
          documentContext: getDocumentContext() || undefined,
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

        setRecentTopics((prev) => {
          const updated = [topic, ...prev.filter((t) => t !== topic)].slice(0, MAX_RECENT_TOPICS);
          localStorage.setItem(RECENT_TOPICS_KEY, JSON.stringify(updated));
          return updated;
        });

        const newSession: GenerationSession = {
          id: `session-${Date.now()}`,
          topic,
          subject: effectiveSubject,
          questionCount: data.questions.length,
          createdAt: new Date().toISOString(),
          questions: data.questions,
        };
        setHistorySessions((prev) => {
          const updated = [newSession, ...prev].slice(0, MAX_SESSIONS);
          localStorage.setItem(HISTORY_SESSIONS_KEY, JSON.stringify(updated));
          return updated;
        });
      } else {
        throw new Error('Sual yaradıla bilmədi');
      }
    } catch (err) {
      console.error('Quiz generation error:', err);
      const msg = err instanceof Error ? err.message : 'Xəta baş verdi';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  // ─── Batch handlers ───────────────────────────────────────────────────────────

  const handleAddBatchTopic = () => {
    const effectiveSubject = getEffectiveSubject();
    if (!topic.trim() || !effectiveSubject) { toast.error('Mövzu və fənn seçin'); return; }
    setBatchTopics((prev) => [
      ...prev,
      { id: `batch-${Date.now()}`, topic: topic.trim(), subject, questionCount: getEffectiveCount() },
    ]);
    setTopic('');
    toast.success('Mövzu siyahıya əlavə edildi');
  };

  const handleRemoveBatchTopic = (id: string) => {
    setBatchTopics((prev) => prev.filter((t) => t.id !== id));
  };

  const handleBatchGenerate = async () => {
    if (batchTopics.length === 0) { toast.error('Ən azı bir mövzu əlavə edin'); return; }

    setIsGenerating(true);
    setError(null);
    setGeneratedQuestions([]);
    setBatchProgress({ current: 0, total: batchTopics.length });

    try {
      const allQuestions: GeneratedQuestion[] = [];
      for (let i = 0; i < batchTopics.length; i++) {
        const bt = batchTopics[i];
        setBatchProgress({ current: i + 1, total: batchTopics.length });
        const { data, error: fnError } = await supabase.functions.invoke('generate-quiz', {
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
        if (fnError) { console.error(`Error for topic ${bt.topic}:`, fnError); continue; }
        if (data.questions) allQuestions.push(...data.questions);
      }
      if (allQuestions.length > 0) {
        setGeneratedQuestions(allQuestions);
        toast.success(`${allQuestions.length} sual uğurla yaradıldı!`);
        setBatchTopics([]);
      } else {
        throw new Error('Heç bir sual yaradıla bilmədi');
      }
    } catch (err) {
      console.error('Batch generation error:', err);
      const msg = err instanceof Error ? err.message : 'Xəta baş verdi';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsGenerating(false);
      setBatchProgress(null);
    }
  };

  // ─── Question list handlers ───────────────────────────────────────────────────

  const handleUpdateQuestion = (updated: GeneratedQuestion) => {
    setGeneratedQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
  };

  const handleDeleteQuestion = (id: string) => {
    setGeneratedQuestions((prev) => prev.filter((q) => q.id !== id));
    toast.success('Sual silindi');
  };

  const handleSimilarCreated = (newQuestion: GeneratedQuestion) => {
    setGeneratedQuestions((prev) => [...prev, newQuestion]);
  };

  const handleRegenerateQuestion = async (question: GeneratedQuestion) => {
    const effectiveSubject = getEffectiveSubject();
    if (!topic.trim() || !effectiveSubject) { toast.error('Aktiv mövzu/fənn yoxdur'); return; }
    const { data, error: fnError } = await supabase.functions.invoke('generate-quiz', {
      body: {
        topic,
        subject: effectiveSubject,
        difficulty,
        questionCount: 1,
        agentId: selectedAgent.id,
        model: aiParameters.model,
        temperature: Math.min(aiParameters.temperature + 0.1, 1.2),
        bloomLevel: question.bloomLevel || undefined,
        questionType: question.questionType || questionType,
      },
    });
    if (fnError || !data?.questions?.[0]) { toast.error('Sual yenilənə bilmədi'); return; }
    const newQ: GeneratedQuestion = { ...data.questions[0], id: question.id };
    setGeneratedQuestions((prev) => prev.map((q) => (q.id === question.id ? newQ : q)));
    toast.success('Sual yeniləndi');
  };

  // ─── Misc handlers ────────────────────────────────────────────────────────────

  const useAllQuestions = () => {
    if (generatedQuestions.length === 0) return;
    navigate('/teacher/create', { state: { importedQuestions: generatedQuestions } });
  };

  const handleSelectTemplate = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setActiveTab('generate');
    toast.success(`"${template.name}" şablonu seçildi`);
  };

  const handleDocumentQuestionsGenerated = (questions: GeneratedQuestion[]) => {
    setGeneratedQuestions(questions);
    setFilterDifficulty('all');
    setFilterType('all');
  };

  const handleClearHistory = () => {
    setGeneratedQuestions([]);
    localStorage.removeItem(HISTORY_KEY);
    toast.success('Tarixçə təmizləndi');
  };

  const handleLoadSession = (session: GenerationSession) => {
    setGeneratedQuestions(session.questions);
    setTopic(session.topic);
    setActiveTab('generate');
    toast.success(`"${session.topic}" sessiyası yükləndi`);
  };

  const handleDeleteSession = (id: string) => {
    setHistorySessions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      localStorage.setItem(HISTORY_SESSIONS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearAllSessions = () => {
    setHistorySessions([]);
    localStorage.removeItem(HISTORY_SESSIONS_KEY);
    toast.success('Tarixçə silindi');
  };

  return {
    // Form state
    topic, setTopic,
    subject, setSubject,
    customSubject, setCustomSubject,
    difficulty, setDifficulty,
    questionCount, setQuestionCount,
    customCount, setCustomCount,
    questionType, setQuestionType,
    bloomFilter, setBloomFilter,
    aiParameters, setAIParameters,
    selectedTemplate, setSelectedTemplate,
    selectedAgentId, setSelectedAgentId,
    selectedAgent,
    // Generation state
    isGenerating,
    generatedQuestions,
    filteredQuestions,
    error,
    batchMode, setBatchMode,
    batchTopics,
    batchProgress,
    isBulkAdding,
    // History
    recentTopics,
    historySessions,
    suggestedTopics,
    // Documents
    uploadedDocuments,
    // UI state
    activeTab, setActiveTab,
    filterDifficulty, setFilterDifficulty,
    filterType, setFilterType,
    // Handlers
    handleGenerate,
    handleBatchGenerate,
    handleAddBatchTopic,
    handleRemoveBatchTopic,
    handleAddToBank,
    handleBulkAddToBank,
    handleUpdateQuestion,
    handleDeleteQuestion,
    handleSimilarCreated,
    handleRegenerateQuestion,
    handleDocumentProcessed,
    handleRemoveDocument,
    handleToggleDocument,
    handleDocumentQuestionsGenerated,
    handleSelectTemplate,
    handleClearHistory,
    handleLoadSession,
    handleDeleteSession,
    handleClearAllSessions,
    useAllQuestions,
  };
}
