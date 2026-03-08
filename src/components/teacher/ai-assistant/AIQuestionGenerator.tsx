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
import { Wand2, Layers, Plus, X, Loader2, Sparkles, AlertCircle, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AgentSelector } from "@/components/ai/AgentSelector";
import { Agent } from "@/components/ai/AgentCard";
import { AIParametersPanel, AIParameters } from "@/components/ai/AIParametersPanel";
import { GenerationStats } from "@/components/ai/GenerationStats";
import { SUBJECT_OPTIONS, SUBJECT_LABELS, QUESTION_TYPES } from "@/lib/constants/subjects";
import { getBloomLevels } from "@/components/ai/BloomLevelBadge";
import { PromptTemplate } from "@/components/ai/TemplateLibrary";

interface BatchTopic {
    id: string;
    topic: string;
    subject: string;
    questionCount: number;
}

interface AIQuestionGeneratorProps {
    topic: string;
    setTopic: (v: string) => void;
    subject: string;
    setSubject: (v: string) => void;
    customSubject: string;
    setCustomSubject: (v: string) => void;
    difficulty: string;
    setDifficulty: (v: string) => void;
    questionCount: string;
    setQuestionCount: (v: string) => void;
    customCount: string;
    setCustomCount: (v: string) => void;
    questionType: string;
    setQuestionType: (v: string) => void;
    bloomFilter: string;
    setBloomFilter: (v: string) => void;
    selectedAgentId: string;
    setSelectedAgentId: (v: string) => void;
    aiParameters: AIParameters;
    setAIParameters: (v: AIParameters) => void;
    selectedTemplate: PromptTemplate | null;
    setSelectedTemplate: (v: PromptTemplate | null) => void;
    batchMode: boolean;
    setBatchMode: (v: boolean) => void;
    batchTopics: BatchTopic[];
    onAddBatchTopic: () => void;
    onRemoveBatchTopic: (id: string) => void;
    onGenerate: () => void;
    onBatchGenerate: () => void;
    isGenerating: boolean;
    batchProgress: { current: number; total: number } | null;
    error: string | null;
    selectedAgent: Agent;
    suggestedTopics: string[];
}

export function AIQuestionGenerator({
    topic, setTopic,
    subject, setSubject,
    customSubject, setCustomSubject,
    difficulty, setDifficulty,
    questionCount, setQuestionCount,
    customCount, setCustomCount,
    questionType, setQuestionType,
    bloomFilter, setBloomFilter,
    selectedAgentId, setSelectedAgentId,
    aiParameters, setAIParameters,
    selectedTemplate, setSelectedTemplate,
    batchMode, setBatchMode,
    batchTopics, onAddBatchTopic, onRemoveBatchTopic,
    onGenerate, onBatchGenerate,
    isGenerating, batchProgress, error,
    selectedAgent, suggestedTopics
}: AIQuestionGeneratorProps) {
    return (
        <div className="rounded-2xl bg-gradient-card border border-border/50 p-6">
            <div className="grid gap-6">
                {/* Agent Selector */}
                <div>
                    <Label className="mb-2 block text-sm font-medium">AI Agent</Label>
                    <AgentSelector selectedAgentId={selectedAgentId} onSelectAgent={setSelectedAgentId} />
                </div>

                {/* Template indicator */}
                {selectedTemplate && (
                    <div className="flex items-center justify-between rounded-lg bg-primary/10 border border-primary/30 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <Settings2 className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">
                                Şablon: {selectedTemplate.name}
                            </span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(null)} className="text-xs">
                            Ləğv et
                        </Button>
                    </div>
                )}

                <AIParametersPanel parameters={aiParameters} onChange={setAIParameters} />
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
                                        ({SUBJECT_LABELS[bt.subject] || bt.subject}, {bt.questionCount} sual)
                                    </span>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => onRemoveBatchTopic(bt.id)} className="h-6 w-6 p-0 text-destructive">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Topic Input */}
                <div>
                    <Label htmlFor="topic">Mövzu *</Label>
                    <div className="relative mt-2">
                        <Wand2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Məs: Cəbr: Xətti tənliklər"
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
                                    topic === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Controls Grid */}
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {/* Subject */}
                    <div>
                        <Label>Fənn *</Label>
                        <Select value={subject || "no-selection"} onValueChange={(v) => setSubject(v === "no-selection" ? "" : v)}>
                            <SelectTrigger className="mt-2">
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
                                className="mt-1"
                            />
                        )}
                    </div>

                    {/* Question Type */}
                    <div>
                        <Label>Sual Tipi</Label>
                        <Select value={questionType} onValueChange={setQuestionType}>
                            <SelectTrigger className="mt-2">
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

                    {/* Question Count */}
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
                                className="mt-1"
                            />
                        )}
                    </div>

                    {/* Bloom Level */}
                    <div>
                        <Label>Bloom Səviyyəsi</Label>
                        <Select value={bloomFilter || "all"} onValueChange={(val) => setBloomFilter(val === "all" ? "" : val)}>
                            <SelectTrigger className="mt-2 text-black">
                                <SelectValue placeholder="Hamısı" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Hamısı (qarışıq)</SelectItem>
                                {getBloomLevels().map((level) => (
                                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
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
                <div className="flex gap-2">
                    {batchMode ? (
                        <>
                            <Button variant="outline" onClick={onAddBatchTopic} disabled={isGenerating || !topic.trim() || !(subject === 'custom' ? customSubject : subject)} className="flex-1">
                                <Plus className="mr-2 h-4 w-4" /> Siyahıya Əlavə Et
                            </Button>
                            <Button variant="game" onClick={onBatchGenerate} disabled={isGenerating || batchTopics.length === 0} className="flex-1">
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {batchProgress ? `${batchProgress.current}/${batchProgress.total}` : "Yaradılır..."}
                                    </>
                                ) : (
                                    <>
                                        <Layers className="mr-2 h-4 w-4" />
                                        Hamısını Yarat ({batchTopics.reduce((sum, t) => sum + t.questionCount, 0)} sual)
                                    </>
                                )}
                            </Button>
                        </>
                    ) : (
                        <Button variant="game" size="lg" onClick={onGenerate} disabled={isGenerating} className="w-full">
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
        </div>
    );
}
