import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Loader2, Check, X, Wand2, FileText, ListChecks, Tags, BrainCircuit } from 'lucide-react';
import { QuestionBankItem } from '@/hooks/useQuestionBank';
import { useEnhanceQuestion, EnhanceAction } from '@/hooks/useEnhanceQuestion';

interface QuestionEnhanceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    question: QuestionBankItem | null;
    onApply: (updates: Partial<QuestionBankItem>) => void;
}

export function QuestionEnhanceDialog({
    open,
    onOpenChange,
    question,
    onApply,
}: QuestionEnhanceDialogProps) {
    const [result, setResult] = useState<{ action: EnhanceAction; data: { text?: string; explanation?: string; options?: string[]; tags?: string[]; level?: string } } | null>(null);
    const { enhanceQuestion, isEnhancing } = useEnhanceQuestion();
    const [activeAction, setActiveAction] = useState<EnhanceAction | null>(null);

    const handleEnhance = async (action: EnhanceAction) => {
        if (!question) return;
        setActiveAction(action);
        const data = await enhanceQuestion(question.question_text, action, question.options as string[]);
        if (data) {
            setResult({ action, data });
        }
        setActiveAction(null);
    };

    const handleApply = () => {
        if (!result) return;

        const updates: Partial<QuestionBankItem> = {};
        const data = result.data;

        switch (result.action) {
            case 'improve_text':
                updates.question_text = typeof data === 'string' ? data : data.text || '';
                break;
            case 'generate_explanation':
                updates.explanation = typeof data === 'string' ? data : data.explanation || '';
                break;
            case 'generate_distractors':
                updates.options = Array.isArray(data) ? data : data.options || [];
                break;
            case 'suggest_bloom_level':
                updates.bloom_level = typeof data === 'string' ? data : data.level || '';
                break;
            case 'generate_tags':
                updates.tags = Array.isArray(data) ? data : data.tags || [];
                break;
        }

        onApply(updates);
        onOpenChange(false);
        setResult(null);
    };

    const actions: { id: EnhanceAction; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
        { id: 'improve_text', label: 'Mətni Təkmilləşdir', icon: Wand2, color: 'text-blue-500' },
        { id: 'generate_explanation', label: 'İzahat Yarat', icon: FileText, color: 'text-green-500' },
        { id: 'generate_distractors', label: 'Variantlar Yarat', icon: ListChecks, color: 'text-orange-500' },
        { id: 'suggest_bloom_level', label: 'Bloom Səviyyəsi', icon: BrainCircuit, color: 'text-purple-500' },
        { id: 'generate_tags', label: 'Etiketlər Yarat', icon: Tags, color: 'text-pink-500' },
    ];

    if (!question) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl chat-blur">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <div className="p-2 rounded-full bg-primary/10">
                            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                        </div>
                        AI Asistent
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <Card className="bg-muted/30 border-dashed overflow-hidden relative group">
                        <CardContent className="pt-4">
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Badge variant="outline" className="text-[10px] uppercase">Orijinal</Badge>
                            </div>
                            <p className="text-sm font-medium mb-1 flex items-center gap-1 opacity-70">
                                Sual Mətni:
                            </p>
                            <p className="text-sm font-medium leading-relaxed">{question.question_text}</p>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {actions.map((action) => (
                            <Button
                                key={action.id}
                                variant="outline"
                                className="justify-start h-auto py-3 px-4 border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm"
                                onClick={() => handleEnhance(action.id)}
                                disabled={isEnhancing}
                            >
                                {activeAction === action.id ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin text-primary" />
                                ) : (
                                    <action.icon className={`h-4 w-4 mr-2 ${action.color}`} />
                                )}
                                <span className="text-sm font-medium">{action.label}</span>
                            </Button>
                        ))}
                    </div>

                    {result && (
                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 shadow-inner">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-bold flex items-center gap-2">
                                        <Wand2 className="h-4 w-4 text-primary" />
                                        AI Təklifi
                                    </p>
                                    <Badge variant="secondary" className="px-2 py-0 h-5 text-[10px]">PREMIUM</Badge>
                                </div>

                                <div className="text-sm leading-relaxed p-3 bg-background rounded-xl border shadow-sm">
                                    {result.action === 'generate_distractors' ? (
                                        <div className="space-y-1">
                                            {(Array.isArray(result.data) ? result.data : result.data.options || []).map((opt: string, i: number) => (
                                                <div key={i} className="flex gap-2">
                                                    <span className="font-bold text-primary">{String.fromCharCode(65 + i)}:</span>
                                                    <span>{opt}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : result.action === 'generate_tags' ? (
                                        <div className="flex flex-wrap gap-1">
                                            {(Array.isArray(result.data) ? result.data : result.data.tags || []).map((tag: string, i: number) => (
                                                <Badge key={i} variant="outline" className="text-[10px]">{tag}</Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>{typeof result.data === 'string' ? result.data : result.data.text || result.data.explanation || result.data.level || ''}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    className="w-full h-11 premium-gradient border-0"
                                    onClick={handleApply}
                                >
                                    <Check className="h-4 w-4 mr-2" />
                                    Qəbul Et və Tətbiq Et
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="h-11"
                                    onClick={() => setResult(null)}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    İmtina
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Reuse Badge component from UI
function Badge({ children, variant = "default", className = "" }: { children: React.ReactNode, variant?: 'default' | 'secondary' | 'outline', className?: string }) {
    const variants: Record<string, string> = {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "text-foreground border border-input",
    };
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}
