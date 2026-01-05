import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function logUsage(supabase: any, userId: string | null, provider: string, model: string, inputTokens: number, outputTokens: number, requestType: string) {
  try {
    // Log to ai_usage_logs
    await supabase.from('ai_usage_logs').insert({
      user_id: userId,
      provider,
      model,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      request_type: requestType,
    });

    // Update daily usage
    const today = new Date().toISOString().split('T')[0];
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
  } catch (error) {
    console.error('Error logging usage:', error);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, subject, difficulty, questionCount, agentId, templatePrompt, documentContext } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Setup Supabase for usage logging
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user ID from auth header if present
    let userId: string | null = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    console.log(`Generating ${questionCount} questions for topic: ${topic}, subject: ${subject}, difficulty: ${difficulty}`);
    console.log(`Agent: ${agentId}, Has template: ${!!templatePrompt}, Has document context: ${!!documentContext}`);

    const difficultyInstructions: Record<string, string> = {
      easy: "Suallar sadə olmalı, əsas anlayışları əhatə etməlidir.",
      medium: "Suallar orta çətinlikdə olmalı, mövzunun dərindən başa düşülməsini tələb etməlidir.",
      hard: "Suallar çətin olmalı, analitik düşüncə və mürəkkəb problemlərin həllini tələb etməlidir."
    };

    const agentPrompts: Record<string, string> = {
      'quiz-master': `Sən Azərbaycan dilində test sualları yaradan ekspert müəllimsən.
Sənin vəzifən verilmiş mövzu üzrə keyfiyyətli çoxseçimli test sualları yaratmaqdır.`,
      'curriculum-designer': `Sən kurikulum dizayner və təhsil planlaşdırıcısısan.
Sualları öyrənmə nəticələrinə uyğun və pedaqoji cəhətdən düzgün yarat.`,
      'assessment-expert': `Sən qiymətləndirmə mütəxəssisisən.
Sualları Bloom taksonomiyasına uyğun yarat və müxtəlif səviyyələri əhatə et.`,
      'subject-specialist': `Sən fənn mütəxəssisisən.
Sualları fənnin dərin biliyinə əsaslanaraq, dəqiq və elmi cəhətdən düzgün yarat.`,
      'language-coach': `Sən dil və linqvistika mütəxəssisisən.
Sualları aydın, anlaşılan və qrammatik cəhətdən mükəmməl yarat.`
    };

    let systemPrompt = agentPrompts[agentId] || agentPrompts['quiz-master'];
    
    if (templatePrompt) {
      systemPrompt += `\n\nXüsusi təlimatlar:\n${templatePrompt}`;
    }
    
    systemPrompt += `

Vacib qaydalar:
1. Suallar Azərbaycan dilində olmalıdır
2. Hər sualın 4 variantı olmalıdır (A, B, C, D)
3. Yalnız bir düzgün cavab olmalıdır
4. Hər sual üçün izah yazılmalıdır
5. Suallar mövzuya uyğun və dəqiq olmalıdır

Çətinlik səviyyəsi: ${difficultyInstructions[difficulty] || difficultyInstructions.medium}`;

    let userPrompt = `Mövzu: ${topic}
Fənn: ${subject}
Sual sayı: ${questionCount}`;

    if (documentContext) {
      userPrompt += `

Aşağıdakı sənəd məzmununa əsaslanaraq suallar yarat:

${documentContext}

Bu sənəddəki məlumatlardan istifadə edərək ${questionCount} ədəd çoxseçimli test sualı yarat.`;
    } else {
      userPrompt += `

Bu mövzu üzrə ${questionCount} ədəd çoxseçimli test sualı yarat.`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'create_quiz_questions',
              description: 'Create quiz questions with options and explanations',
              parameters: {
                type: 'object',
                properties: {
                  questions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        question: { type: 'string', description: 'The question text in Azerbaijani' },
                        options: { type: 'array', items: { type: 'string' }, description: 'Array of 4 answer options' },
                        correctAnswer: { type: 'number', description: 'Index of correct answer (0-3)' },
                        explanation: { type: 'string', description: 'Explanation for the correct answer in Azerbaijani' }
                      },
                      required: ['question', 'options', 'correctAnswer', 'explanation'],
                      additionalProperties: false
                    }
                  }
                },
                required: ['questions'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'create_quiz_questions' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Sorğu limiti aşıldı. Zəhmət olmasa bir az gözləyin.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Kredit balansı bitib. Zəhmət olmasa hesabınızı doldurun.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received:', JSON.stringify(data).substring(0, 500));

    // Log usage
    const usage = data.usage || {};
    await logUsage(
      supabase,
      userId,
      'lovable',
      'google/gemini-2.5-flash',
      usage.prompt_tokens || 0,
      usage.completion_tokens || 0,
      'quiz_generation'
    );

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== 'create_quiz_questions') {
      console.error('Unexpected response format:', data);
      throw new Error('AI yanıtı gözlənilən formatda deyil');
    }

    const questionsData = JSON.parse(toolCall.function.arguments);
    
    const questions = questionsData.questions.map((q: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      ...q
    }));

    console.log(`Successfully generated ${questions.length} questions`);

    return new Response(
      JSON.stringify({ questions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-quiz function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Naməlum xəta baş verdi' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
