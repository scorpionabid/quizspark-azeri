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

export function useAIImport() {
    const [isAiImporting, setIsAiImporting] = useState(false);

    const importWithAI = async (text: string | null, image: string | null) => {
        if (!text && !image) {
            toast.error('Zəhmət olmasa mətn və ya şəkil daxil edin');
            return null;
        }

        setIsAiImporting(true);
        try {
            const { data, error } = await supabase.functions.invoke('bulk-import-ai', {
                body: { text, image },
            });

            if (error) throw error;

            if (!data || !data.questions) {
                throw new Error('AI cavabı gözlənilən formatda deyil');
            }

            return data.questions as AIImportQuestion[];
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Məlumatları AI ilə emal etmək mümkün olmadı';
            console.error('AI Import Error:', error);
            toast.error('AI Import Xətası: ' + message);
            return null;
        } finally {
            setIsAiImporting(false);
        }
    };

    return { importWithAI, isAiImporting };
}
