// @ts-expect-error Deno import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-expect-error Supabase Deno import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { resolveModelByAlias } from "../_shared/ai-usage.ts";
import { corsHeaders } from "../_shared/cors.ts";

// IDE tipləmə xətalarının qarşısını almaq üçün Deno obyektini elan edirik
declare const Deno: { env: { get(key: string): string | undefined } };


async function fetchAI(lovableKey: string, geminiKey: string | undefined, body: Record<string, unknown>, targetModelId: string): Promise<Response> {
    const model = body.model || targetModelId;

    let response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${lovableKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, model }),
    });

    if ((response.status === 401 || response.status === 403 || response.status === 404) && geminiKey) {
        console.log('Lovable gateway failed or unauthorized, falling back to Gemini API directly');
        response = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${geminiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...body, model: String(model).replace('google/', '') }),
        });
    }

    return response;
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { text, image, model: requestedModel } = await req.json();

        const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
        if (!LOVABLE_API_KEY) {
            throw new Error('LOVABLE_API_KEY is not configured');
        }
        const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

        // Setup Supabase for alias resolution
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const aliasedModelId = await resolveModelByAlias('VISION_OCR', supabase);
        const targetModelId = requestedModel || aliasedModelId || 'google/gemini-2.0-flash';

        console.log(`Bulk importing questions from ${image ? 'image' : 'text'}. Using model: ${targetModelId}`);

        const systemPrompt = `Sən test suallarını mətndən və ya şəkildən çıxaran və strukturlaşdıran ekspert müəllimsən. 
    Verilən girişi analiz et və hər bir sualı obyekt halına salaraq bütün sualları qaytar.
    Dil: Azərbaycan dili.
    Format: Yalnız aşağıdakı funksiyanı çağıraraq JSON formatında cavab ver.`;

        const userContent: Record<string, unknown>[] = [];

        if (text) {
            userContent.push({ type: 'text', text: `Bu mətndəki bütün test suallarını çıxar:\n\n${text}` });
        }

        if (image) {
            userContent.push({
                type: 'text',
                text: 'Bu şəkildəki test suallarını oxu və çıxar. Əgər mətn də verilibsə hər ikisini birləşdir.'
            });
            userContent.push({
                type: 'image_url',
                image_url: { url: image } // image is expected to be a data URL
            });
        }

        const aiBody = {
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userContent }
            ],
            tools: [
                {
                    type: 'function',
                    function: {
                        name: 'return_parsed_questions',
                        description: 'Return an array of parsed questions',
                        parameters: {
                            type: 'object',
                            properties: {
                                questions: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            question_text: { type: 'string' },
                                            question_type: {
                                                type: 'string',
                                                enum: ['multiple_choice', 'true_false', 'short_answer', 'matching', 'ordering', 'numerical', 'fill_in_the_blank']
                                            },
                                            options: {
                                                type: 'array',
                                                items: { type: 'string' },
                                                description: 'Çoxseçimli suallar üçün variantlar siyashısı. True/False üçün ["Doğru", "Yanlış"].'
                                            },
                                            correct_answer: { type: 'string', description: 'Düzgün variantın mətni və ya qısa cavabın özü.' },
                                            explanation: { type: 'string' },
                                            category: { type: 'string' },
                                            difficulty: { type: 'string', enum: ['asan', 'orta', 'çətin'] },
                                            bloom_level: {
                                                type: 'string',
                                                enum: ['remembering', 'understanding', 'applying', 'analyzing', 'evaluating', 'creating']
                                            },
                                            tags: { type: 'array', items: { type: 'string' } }
                                        },
                                        required: ['question_text', 'question_type', 'correct_answer']
                                    }
                                }
                            },
                            required: ['questions']
                        }
                    }
                }
            ],
            tool_choice: { type: 'function', function: { name: 'return_parsed_questions' } }
        };

        const response = await fetchAI(LOVABLE_API_KEY, GEMINI_API_KEY, aiBody, targetModelId);

        if (!response.ok) {
            const err = await response.text();
            console.error('AI error:', response.status, err);
            throw new Error(`AI error (${response.status}): ${err.substring(0, 100)}`);
        }

        const data = await response.json();
        const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

        if (toolCall) {
            const parsed = JSON.parse(toolCall.function.arguments);
            return new Response(JSON.stringify(parsed), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        throw new Error('AI response format error: no tool call found');

    } catch (error) {
        console.error('Error in bulk-import-ai function:', error);
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : 'Naməlum xəta baş verdi' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
