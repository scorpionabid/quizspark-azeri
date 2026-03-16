import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AIImportQuestion {
    question_text: string;
    question_type: string;
    options: string[] | null;
    correct_answer: string;
    explanation?: string;
    category?: string;
    difficulty?: string;
    bloom_level?: string;
    tags?: string[];
}

export type AIImportStage =
    | 'idle'
    | 'uploading'
    | 'analyzing'
    | 'structuring'
    | 'done'
    | 'error';

export function useAIImport() {
    const [isAiImporting, setIsAiImporting] = useState(false);
    const [aiStage, setAiStage] = useState<AIImportStage>('idle');
    /** 0-100 arası irəliləyiş faizi */
    const [aiProgress, setAiProgress] = useState(0);

    const importWithAI = async (
        text: string | null,
        image: string | null,
    ): Promise<AIImportQuestion[] | null> => {
        if (!text && !image) {
            toast.error('Zəhmət olmasa mətn və ya şəkil daxil edin');
            return null;
        }

        setIsAiImporting(true);
        setAiProgress(5);
        setAiStage('uploading');

        try {
            // Simulated progress ticks while the edge function runs
            const tick = (pct: number, stage: AIImportStage) => {
                setAiProgress(pct);
                setAiStage(stage);
            };

            const timer1 = setTimeout(() => tick(30, 'analyzing'), 800);
            const timer2 = setTimeout(() => tick(65, 'structuring'), 2200);

            const { data, error } = await supabase.functions.invoke('bulk-import-ai', {
                body: { text, image },
            });

            clearTimeout(timer1);
            clearTimeout(timer2);

            if (error) throw error;

            if (!data || !data.questions) {
                throw new Error('AI cavabı gözlənilən formatda deyil');
            }

            tick(100, 'done');
            return data.questions as AIImportQuestion[];
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Məlumatları AI ilə emal etmək mümkün olmadı';
            console.error('AI Import Error:', error);
            toast.error('AI Import Xətası: ' + message);
            setAiStage('error');
            return null;
        } finally {
            setIsAiImporting(false);
            // Reset progress after short delay
            setTimeout(() => {
                setAiProgress(0);
                setAiStage('idle');
            }, 1500);
        }
    };

    return { importWithAI, isAiImporting, aiStage, aiProgress };
}
