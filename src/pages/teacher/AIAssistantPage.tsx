import { Wand2, Upload, FileText, MessageSquare, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";
import { ChatInterface } from "@/components/ai/ChatInterface";
import { TemplateLibrary } from "@/components/ai/TemplateLibrary";
import { AIPageHeader } from "@/components/teacher/ai-assistant/AIPageHeader";
import { AIQuestionGenerator } from "@/components/teacher/ai-assistant/AIQuestionGenerator";
import { AIGeneratedResults } from "@/components/teacher/ai-assistant/AIGeneratedResults";
import { AIDocumentSection } from "@/components/teacher/ai-assistant/AIDocumentSection";
import { AIHistoryTab } from "@/components/teacher/ai-assistant/AIHistoryTab";
import { useAIAssistant, MAX_SESSIONS } from "@/hooks/useAIAssistant";

export default function AIAssistantPage() {
  const ai = useAIAssistant();

  return (
    <SubscriptionGate
      feature="ai_assistant"
      description="AI Köməkçiyə giriş yalnız VIP müəllimlər üçün mövcuddur. Limitsiz sual yaratma üçün VIP-ə keçin."
    >
      <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <AIPageHeader />

          <Tabs value={ai.activeTab} onValueChange={ai.setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
              <TabsTrigger value="generate" className="gap-2">
                <Wand2 className="h-4 w-4" />
                <span className="hidden sm:inline">Sual Yarat</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="gap-2">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Sənəddən</span>
                {ai.uploadedDocuments.length > 0 && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {ai.uploadedDocuments.length}
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
                {ai.historySessions.length > 0 && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
                    {ai.historySessions.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate">
              <AIQuestionGenerator
                topic={ai.topic} setTopic={ai.setTopic}
                subject={ai.subject} setSubject={ai.setSubject}
                customSubject={ai.customSubject} setCustomSubject={ai.setCustomSubject}
                difficulty={ai.difficulty} setDifficulty={ai.setDifficulty}
                questionCount={ai.questionCount} setQuestionCount={ai.setQuestionCount}
                customCount={ai.customCount} setCustomCount={ai.setCustomCount}
                questionType={ai.questionType} setQuestionType={ai.setQuestionType}
                bloomFilter={ai.bloomFilter} setBloomFilter={ai.setBloomFilter}
                selectedAgentId={ai.selectedAgentId} setSelectedAgentId={ai.setSelectedAgentId}
                aiParameters={ai.aiParameters} setAIParameters={ai.setAIParameters}
                selectedTemplate={ai.selectedTemplate} setSelectedTemplate={ai.setSelectedTemplate}
                batchMode={ai.batchMode} setBatchMode={ai.setBatchMode}
                batchTopics={ai.batchTopics}
                onAddBatchTopic={ai.handleAddBatchTopic}
                onRemoveBatchTopic={ai.handleRemoveBatchTopic}
                onGenerate={ai.handleGenerate}
                onBatchGenerate={ai.handleBatchGenerate}
                isGenerating={ai.isGenerating}
                batchProgress={ai.batchProgress}
                error={ai.error}
                selectedAgent={ai.selectedAgent}
                suggestedTopics={ai.suggestedTopics}
              />
            </TabsContent>

            <TabsContent value="documents">
              <AIDocumentSection
                uploadedDocuments={ai.uploadedDocuments}
                onDocumentProcessed={ai.handleDocumentProcessed}
                onRemoveDocument={ai.handleRemoveDocument}
                onToggleDocument={ai.handleToggleDocument}
                onQuestionsGenerated={ai.handleDocumentQuestionsGenerated}
                aiParameters={ai.aiParameters}
              />
            </TabsContent>

            <TabsContent value="templates">
              <div className="rounded-2xl bg-gradient-card border border-border/50 p-6">
                <TemplateLibrary onSelectTemplate={ai.handleSelectTemplate} />
              </div>
            </TabsContent>

            <TabsContent value="chat" className="space-y-4">
              <ChatInterface
                agent={ai.selectedAgent}
                onGenerateFromChat={(topic) => {
                  ai.setTopic(topic);
                  ai.setActiveTab("generate");
                }}
              />
            </TabsContent>

            <TabsContent value="history">
              <AIHistoryTab
                sessions={ai.historySessions}
                maxSessions={MAX_SESSIONS}
                onLoad={ai.handleLoadSession}
                onDeleteSession={ai.handleDeleteSession}
                onClearAll={ai.handleClearAllSessions}
              />
            </TabsContent>
          </Tabs>

          {ai.generatedQuestions.length > 0 && (
            <AIGeneratedResults
              questions={ai.generatedQuestions}
              onUpdateQuestion={ai.handleUpdateQuestion}
              onDeleteQuestion={ai.handleDeleteQuestion}
              onSimilarCreated={ai.handleSimilarCreated}
              onRegenerateQuestion={ai.handleRegenerateQuestion}
              onBulkAddToBank={ai.handleBulkAddToBank}
              onUseAllQuestions={ai.useAllQuestions}
              onClearHistory={ai.handleClearHistory}
              isBulkAdding={ai.isBulkAdding}
              filterType={ai.filterType}
              setFilterType={ai.setFilterType}
              filterDifficulty={ai.filterDifficulty}
              setFilterDifficulty={ai.setFilterDifficulty}
            />
          )}
        </div>
      </div>
    </SubscriptionGate>
  );
}
