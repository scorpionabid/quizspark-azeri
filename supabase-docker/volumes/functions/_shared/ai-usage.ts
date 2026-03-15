import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function checkUsageLimit(userId: string, supabase: any) { // Keep any for Supabase client in Edge functions
    const today = new Date().toISOString().split('T')[0];

    // Get user specific limit from profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('ai_daily_limit')
        .eq('user_id', userId)
        .single();

    if (profileError) {
        console.error('Error fetching profile limit:', profileError);
    }

    // Get global defaults if user limit is not set
    const { data: config, error: configError } = await supabase
        .from('ai_config')
        .select('user_daily_limit, teacher_daily_limit')
        .limit(1)
        .single();

    if (configError) {
        console.error('Error fetching global config:', configError);
    }

    // Get user role to determine default limit
    const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

    const isTeacher = roles?.some((r: { role: string }) => r.role === 'teacher' || r.role === 'admin');
    const defaultLimit = isTeacher ? (config?.teacher_daily_limit || 500) : (config?.user_daily_limit || 100);
    const effectiveLimit = profile?.ai_daily_limit ?? defaultLimit;

    // Check current usage
    const { data: usage, error: usageError } = await supabase
        .from('ai_daily_usage')
        .select('total_requests')
        .eq('user_id', userId)
        .eq('usage_date', today)
        .single();

    if (usageError && usageError.code !== 'PGRST116') {
        console.error('Error fetching current usage:', usageError);
    }

    const currentRequests = usage?.total_requests || 0;

    if (currentRequests >= effectiveLimit) {
        return {
            allowed: false,
            message: `Gündəlik AI limitiniz (${effectiveLimit}) dolub. Sabah yenidən cəhd edin və ya adminlə əlaqə saxlayın.`,
        };
    }

    return { allowed: true, currentRequests, limit: effectiveLimit };
}

export async function logUsage(
    userId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase: any,
    inputTokens: number,
    outputTokens: number,
    modelId: string,
    requestType: string
) {
    const today = new Date().toISOString().split('T')[0];

    // Log detailed usage
    await supabase.from('ai_usage_logs').insert({
        user_id: userId,
        model_id: modelId,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        request_type: requestType,
    });

    // Update daily summary
    const { data: existing } = await supabase
        .from('ai_daily_usage')
        .select('*')
        .eq('user_id', userId)
        .eq('usage_date', today)
        .single();

    if (existing) {
        await supabase
            .from('ai_daily_usage')
            .update({
                total_requests: existing.total_requests + 1,
                total_tokens: existing.total_tokens + inputTokens + outputTokens,
            })
            .eq('id', existing.id);
    } else {
        await supabase.from('ai_daily_usage').insert({
            user_id: userId,
            usage_date: today,
            total_requests: 1,
            total_tokens: inputTokens + outputTokens,
        });
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function resolveModelByAlias(alias: string, supabase: any): Promise<string | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
        .from('ai_model_aliases')
        .select(`
            model_id,
            ai_models (
                model_id
            )
        `)
        .eq('alias_key', alias)
        .single();

    if (error || !data) {
        console.error(`Error resolving alias ${alias}:`, error);
        return null;
    }

    // Return the actual provider-specific model_id (e.g., 'google/gemini-2.0-flash')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.ai_models as any)?.model_id || null;
}
