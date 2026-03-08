import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type EnhanceAction =
    | 'improve_text'
    | 'generate_explanation'
    | 'generate_distractors'
    | 'generate_tags'
    | 'suggest_bloom_level'
    | 'analyze_full'
    | 'parse_pasted_test'
    | 'check_correctness'
    | 'simplify'
    | 'harder'
    | 'improve_options'
    | 'expand_explanation'
    | 'similar'
    | 'quality_analysis'
    | 'suggest_video_search'
    | 'generate_rubric'
    | 'generate_per_option_explanations'
    | 'generate_hint'
    | 'suggest_3d_model';

export function useEnhanceQuestion() {
    const [isEnhancing, setIsEnhancing] = useState(false);

    const enhanceQuestion = async (
        questionText: string,
        action: EnhanceAction,
        options?: string[]
    ) => {
        setIsEnhancing(true);
        try {
            const { data, error } = await supabase.functions.invoke('enhance-question', {
                body: {
                    questionText,
                    action,
                    options,
                    language: 'az'
                },
            });

            if (error) throw error;
            return data;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Naməlum xəta';
            toast.error('AI təkmilləşdirmə zamanı xəta baş verdi: ' + message);
            return null;
        } finally {
            setIsEnhancing(false);
        }
    };

    return { enhanceQuestion, isEnhancing };
}
