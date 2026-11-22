import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/loading-spinner";
import { useStudentProgress, ErrorNotebookItem } from "@/hooks/useStudentProgress";
import { TopicMasteryRadar } from "@/components/student/progress/TopicMasteryRadar";
import { ErrorNotebook } from "@/components/student/progress/ErrorNotebook";
import { AITutorChat } from "@/components/student/progress/AITutorChat";
import { PersonalizedRoadmap } from "@/components/student/progress/PersonalizedRoadmap";
import { RemedialQuizModal } from "@/components/student/progress/RemedialQuizModal";
import {
  Brain,
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
  Sparkles,
  Zap,
  Target,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Info
} from "lucide-react";
import { motion } from "framer-motion";

export default function StudentProgressPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'radar';
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Remedial Quiz State
  const [isRemedialOpen, setIsRemedialOpen] = useState(false);
  const [remedialTopic, setRemedialTopic] = useState<string | undefined>();

  // AI Chat Prompt passing state
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>();

  const {
    isLoading,
    isDemoMode,
    topicMastery,
    weakTopics,
    strongTopics,
    errorNotebook,
    spacedRepetitionQueue,
    overview,
    dailyGoals,
    roadmap,
    markErrorResolved,
    toggleDailyGoal,
    refetch
  } = useStudentProgress();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['radar', 'errors', 'ai-tutor', 'roadmap'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    setSearchParams({ tab: val });
  };

  const handleStartRemedial = (topic?: string) => {
    setRemedialTopic(topic);
    setIsRemedialOpen(true);
  };

  const handleAskAIWithPrompt = (prompt: string) => {
    setAiInitialPrompt(prompt);
    handleTabChange('ai-tutor');
  };

  const handleAskAIWithError = (errorItem: ErrorNotebookItem) => {
    const prompt = `Bu sualda səhv etmişəm, mənə izah edə bilərsən?
Sual: "${errorItem.questionText}"
Mənim cavabım: "${errorItem.studentAnswer}"
Düzgün cavab: "${errorItem.correctAnswer}"
Fənn və Mövzu: ${errorItem.subject} • ${errorItem.topic}
Mən bu sualda nəyi nəzərdən qaçırmışam və necə düşünməli idim?`;

    setAiInitialPrompt(prompt);
    handleTabChange('ai-tutor');
  };

  if (isLoading) {
    return <PageLoader text="İnkişaf statistikası və AI təhlili yüklənir..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/15 via-secondary/15 to-accent/15 border border-border/60 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Fərdi İnkişaf & AI Mentor Mərkəzi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Zəif Cəhətlərini Kəşf Et, Gücə Çevir 🚀
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Sınaqlardakı nəticələrinin dərin analizi, Sokratik AI Mentor söhbəti, Ağıllı Səhvlər Dəftəri və fərdi tədris planı ilə daima bir addım öndə ol.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="gap-2 shadow-lg shadow-primary/25"
              onClick={() => handleStartRemedial()}
            >
              <Zap className="h-4 w-4" />
              Bərpa Sınağı Başlat
            </Button>
          </div>
        </div>
      </div>

      {/* Demo / Starter Mode Notice */}
      {isDemoMode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-card border border-primary/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/15 rounded-xl text-primary shrink-0 mt-0.5">
              <Info className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground">
                💡 Nümunəvi Tədris və Nümayiş Rejimi
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Aşağıda sistemin imkanlarını göstərən nümunəvi bilik radarı və səhvlər dəftəri əks olunub. İlk sınağınızı tamamladıqda real nəticələriniz avtomatik qeydə alınacaq.
              </p>
            </div>
          </div>

          <Link to="/quizzes" className="w-full md:w-auto shrink-0">
            <Button size="sm" className="gap-2 shadow-md shadow-primary/20 w-full md:w-auto font-semibold">
              <PlayCircle className="h-4 w-4" />
              <span>Sınaqlara Get və Başla</span>
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Overall Accuracy */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="bg-card/60 backdrop-blur-sm border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold">Ümumi Dəqiqlik</p>
                <p className="text-2xl font-bold text-foreground">{overview.overallAccuracy}%</p>
                <p className="text-[11px] text-muted-foreground">{overview.totalQuestionsAnswered} sual cavablanıb</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Metric 2: Weak Topics */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-card/60 backdrop-blur-sm border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded-2xl text-destructive shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold">Zəif Mövzular</p>
                <p className="text-2xl font-bold text-foreground">{overview.weakTopicsCount}</p>
                <p className="text-[11px] text-muted-foreground">Fokus tələb edən sahə</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Metric 3: Error Notebook */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="bg-card/60 backdrop-blur-sm border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-2xl text-secondary shrink-0">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold">Səhvlər Dəftəri</p>
                <p className="text-2xl font-bold text-foreground">{overview.totalMistakesRecorded}</p>
                <p className="text-[11px] text-emerald-600 font-medium">{overview.resolvedMistakesCount} bərpa edildi</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Metric 4: Comeback XP */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-card/60 backdrop-blur-sm border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500 shrink-0">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold">Comeback Bonusu</p>
                <p className="text-2xl font-bold text-foreground">+{overview.comebackMasterXP} XP</p>
                <p className="text-[11px] text-amber-500 font-medium">Səhvləri gücə çevir</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto p-1.5 bg-card/80 border border-border/60 rounded-2xl gap-1">
          <TabsTrigger
            value="radar"
            className="flex items-center gap-2 py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm font-semibold transition-all"
          >
            <TrendingUp className="h-4 w-4" />
            <span>🎯 Bilik Radarı</span>
          </TabsTrigger>

          <TabsTrigger
            value="errors"
            className="flex items-center gap-2 py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm font-semibold transition-all"
          >
            <BookOpen className="h-4 w-4" />
            <span>📕 Səhvlər Dəftəri</span>
            {errorNotebook.filter(e => !e.isResolved).length > 0 && (
              <Badge variant="destructive" className="h-4 px-1 text-[9px]">
                {errorNotebook.filter(e => !e.isResolved).length}
              </Badge>
            )}
          </TabsTrigger>

          <TabsTrigger
            value="ai-tutor"
            className="flex items-center gap-2 py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm font-semibold transition-all"
          >
            <Brain className="h-4 w-4" />
            <span>🤖 AI Tyutor</span>
            <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" />
          </TabsTrigger>

          <TabsTrigger
            value="roadmap"
            className="flex items-center gap-2 py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm font-semibold transition-all"
          >
            <Calendar className="h-4 w-4" />
            <span>📈 Tədris Planı</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Topic Mastery Radar */}
        <TabsContent value="radar" className="space-y-6 focus-visible:outline-none">
          <TopicMasteryRadar
            topics={topicMastery}
            weakTopics={weakTopics}
            strongTopics={strongTopics}
            onStartRemedial={handleStartRemedial}
            onAskAI={handleAskAIWithPrompt}
          />
        </TabsContent>

        {/* Tab 2: Error Notebook */}
        <TabsContent value="errors" className="space-y-6 focus-visible:outline-none">
          <ErrorNotebook
            errors={errorNotebook}
            onStartRemedial={() => handleStartRemedial()}
            onAskAIWithQuestion={handleAskAIWithError}
            onMarkResolved={markErrorResolved}
          />
        </TabsContent>

        {/* Tab 3: Socratic AI Tutor Chat */}
        <TabsContent value="ai-tutor" className="space-y-6 focus-visible:outline-none">
          <AITutorChat
            initialPrompt={aiInitialPrompt}
            weakTopics={weakTopics.map(w => w.topic)}
            onClearInitialPrompt={() => setAiInitialPrompt(undefined)}
          />
        </TabsContent>

        {/* Tab 4: Personalized Roadmap & Goals */}
        <TabsContent value="roadmap" className="space-y-6 focus-visible:outline-none">
          <PersonalizedRoadmap
            roadmap={roadmap}
            dailyGoals={dailyGoals}
            spacedRepetitionQueue={spacedRepetitionQueue}
            streakDays={overview.streakDays}
            onToggleGoal={toggleDailyGoal}
            onStartRemedial={handleStartRemedial}
            onAskAI={handleAskAIWithPrompt}
          />
        </TabsContent>
      </Tabs>

      {/* Remedial Practice Modal */}
      <RemedialQuizModal
        isOpen={isRemedialOpen}
        onClose={() => setIsRemedialOpen(false)}
        targetTopic={remedialTopic}
        errorItems={errorNotebook}
        onComplete={(score, total) => {
          refetch();
        }}
        onAskAI={handleAskAIWithPrompt}
      />
    </div>
  );
}
