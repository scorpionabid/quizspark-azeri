import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb, Database, ArrowRight, Loader2, X, RefreshCw } from "lucide-react";
import { EditableQuestionCard, GeneratedQuestion } from "@/components/quiz/EditableQuestionCard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { QUESTION_TYPES } from "@/lib/constants/subjects";
import { getBloomLevels } from "@/components/ai/BloomLevelBadge";
import { QualityAnalysis } from "@/components/ai/QualityAnalysis";

interface AIGeneratedResultsProps {
    questions: GeneratedQuestion[];
    onUpdateQuestion: (q: GeneratedQuestion) => void;
    onDeleteQuestion: (id: string) => void;
    onSimilarCreated: (q: GeneratedQuestion) => void;
    onRegenerateQuestion: (q: GeneratedQuestion) => Promise<void>;
    onBulkAddToBank: () => void;
    onUseAllQuestions: () => void;
    onClearHistory: () => void;
    isBulkAdding: boolean;
    filterType: string;
    setFilterType: (v: string) => void;
    filterDifficulty: string;
    setFilterDifficulty: (v: string) => void;
}

export function AIGeneratedResults({
    questions,
    onUpdateQuestion,
    onDeleteQuestion,
    onSimilarCreated,
    onRegenerateQuestion,
    onBulkAddToBank,
    onUseAllQuestions,
    onClearHistory,
    isBulkAdding,
    filterType,
    setFilterType,
    filterDifficulty,
    setFilterDifficulty
}: AIGeneratedResultsProps) {
    const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
    const filteredQuestions = questions.filter((q) => {
        const typeMatch = filterType === "all" || (q.questionType ?? "multiple_choice") === filterType;
        const bloomMatch = filterDifficulty === "all" || q.bloomLevel === filterDifficulty;
        return typeMatch && bloomMatch;
    });

    return (
        <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/20">
                        <Lightbulb className="h-5 w-5 text-success" />
                    </div>
                    <h2 className="font-display text-xl font-bold text-foreground">
                        Yaradılmış Suallar ({questions.length})
                    </h2>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" onClick={onClearHistory}>
                        <X className="mr-1 h-4 w-4" /> Təmizlə
                    </Button>
                    <Button variant="outline" onClick={onBulkAddToBank} disabled={isBulkAdding}>
                        {isBulkAdding ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Əlavə edilir...</>
                        ) : (
                            <><Database className="mr-2 h-4 w-4" /> Hamısını Banka Əlavə Et</>
                        )}
                    </Button>
                    <Button variant="game" onClick={onUseAllQuestions}>
                        Hamısını İstifadə Et
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Filter row - only shown when 6+ questions */}
            {questions.length > 5 && (
                <div className="flex flex-wrap gap-3 rounded-lg border border-border/50 bg-muted/30 p-3">
                    <span className="text-xs font-medium text-muted-foreground self-center">Filtr:</span>
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="h-8 w-40 text-xs text-black">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Bütün tiplər</SelectItem>
                            {QUESTION_TYPES.map((qt) => (
                                <SelectItem key={qt.value} value={qt.value}>{qt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                        <SelectTrigger className="h-8 w-44 text-xs text-black">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Bütün səviyyələr</SelectItem>
                            {getBloomLevels().map((l) => (
                                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            <QualityAnalysis questions={questions} />

            <div className="space-y-4">
                {filteredQuestions.map((q, index) => (
                    <div key={q.id} className="relative group/regen">
                        <EditableQuestionCard
                            question={q}
                            index={index}
                            onUpdate={onUpdateQuestion}
                            onDelete={onDeleteQuestion}
                            onSimilarCreated={onSimilarCreated}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={regeneratingId === q.id}
                            onClick={async () => {
                                setRegeneratingId(q.id);
                                try {
                                    await onRegenerateQuestion(q);
                                } finally {
                                    setRegeneratingId(null);
                                }
                            }}
                            className="absolute top-3 right-3 h-7 gap-1 text-xs opacity-0 group-hover/regen:opacity-100 transition-opacity bg-background"
                            title="Bu sualı yenidən yarat"
                        >
                            {regeneratingId === q.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <RefreshCw className="h-3 w-3" />
                            )}
                            Yenilə
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
