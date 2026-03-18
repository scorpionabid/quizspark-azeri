// @ts-expect-error Deno import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.1";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { checkUsageLimit, logUsage, resolveModelByAlias } from "../_shared/ai-usage.ts";
import { corsHeaders } from "../_shared/cors.ts";

// IDE tipləmə xətalarının qarşısını almaq üçün Deno obyektini elan edirik
declare const Deno: { env: { get(key: string): string | undefined } };


type EnhanceAction = "simplify" | "harder" | "improve_options" | "expand_explanation" | "similar" | "quality_analysis"
  | "suggest_video_search" | "generate_rubric" | "generate_per_option_explanations" | "generate_hint" | "suggest_3d_model"
  | "improve_text" | "generate_explanation" | "generate_distractors" | "generate_tags" | "suggest_bloom_level"
  | "analyze_full" | "parse_pasted_test" | "check_correctness";

interface Question {
  id?: string;
  question?: string;
  questionText?: string;
  question_text?: string;
  options: string[];
  correctAnswer?: number;
  correct_answer?: string | number;
  explanation: string;
  bloomLevel?: string;
  category?: string;
  difficulty?: string;
  tags?: string[];
}

const actionPrompts: Record<string, string> = {
  simplify: `Sualı sadələşdir. Daha asan və aydın formaya çevir.
   - Daha sadə sözlər istifadə et
   - Əsas anlayışa fokuslan
   - Variantları da sadələşdir`,

  harder: `Sualı çətinləşdir. Daha mürəkkəb et.
   - Daha dərin düşüncə tələb edən formaya çevir
   - Analitik və ya sintez səviyyəsinə yüksəlt
   - Distraktorları daha inandırıcı et`,

  improve_options: `Yalnız cavab variantlarını yaxşılaşdır.
   - Distraktorları (yanlış variantları) daha inandırıcı et
   - Hər variant oxşar uzunluqda olsun
   - Açıq-aşkar yanlış variantları təkmilləşdir
   - Düzgün cavabın indeksini saxla`,

  expand_explanation: `Yalnız izahı genişləndir.
   - Daha ətraflı açıqlama yaz
   - Niyə digər variantların yanlış olduğunu izah et
   - Əlaqəli konseptləri qeyd et`,

  similar: `Eyni mövzu və çətinlik səviyyəsində YENİ bir sual yarat.
   - Oxşar format saxla
   - Fərqli məzmun istifadə et
   - Eyni pedaqoji yanaşmanı saxla`,

  quality_analysis: `Bu sualın keyfiyyətini analiz et və qiymətləndir.`,

  suggest_video_search: `Mənə bu sual üçün uyğun ola biləcək YouTube video axtarış sorğuları formalaşdır.
    - Sualın əsas mövzusunu analiz et.
    - İngilis və Azərbaycan dilində təsirli axtarış sözləri (keywords) təklif et.`,

  generate_rubric: `Bu sual üçün ətraflı xal paylanması (rubric) hazırla.`,

  generate_per_option_explanations: `Hər bir yanlış variant üçün spesifik izahlar yaz.`,

  generate_hint: `Sual üçün kiçik ipucu (hint) yarat.`,

  suggest_3d_model: `Bu mövzunu 3D modellə necə izah edə bilərəm?`,

  improve_text: `Sualın mətnini qrammatik və üslub baxımından təkmilləşdir, daha professional et.`,

  generate_explanation: `Sual üçün dərindən pedaqoji izah hazırlat. Niyə doğru cavab doğrudur, digərləri niyə yanlışdır.`,

  generate_distractors: `Mövcud sual üçün daha çətin və inandırıcı yanlış variantlar (distraktorlar) yarat.`,

  generate_tags: `Sualın məzmununa uyğun 3-5 ədəd açar söz (tag) təklif et.`,

  suggest_bloom_level: `Sualın məzmununu analiz edərək Bloom taksonomiyası üzrə səviyyəsini müəyyən et.`,

  analyze_full: `Sualı tam analiz et: Kateqoriya, Çətinlik (asan, orta, çətin), Bloom səviyyəsi, Çəki (weight 1-5), Zaman limiti (saniyə) və Açar sözlər.`,

  parse_pasted_test: `Aşağıdakı mətni analiz et və ondan test sualı detallarını (sual mətni, variantlar, düzgün cavab, izah və s.) çıxar.`,

  check_correctness: `Sualın elmi cəhətdən doğruluğunu və məntiqi dürüstlüyünü yoxla.`,
};

async function fetchAI(lovableKey: string | undefined, geminiKey: string | undefined, body: Record<string, unknown>, targetModelId: string): Promise<Response> {
  const model = body.model || targetModelId;
  const geminiModel = String(model).replace('google/', '');

  if (!lovableKey) {
    console.log('No LOVABLE_API_KEY, using Gemini API directly');
    return await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${geminiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, model: geminiModel }),
    });
  }

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
      body: JSON.stringify({ ...body, model: geminiModel }),
    });
  }

  return response;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const userId = user.id;

    // Check usage limit
    const usageCheck = await checkUsageLimit(userId, supabase);
    if (!usageCheck.allowed) {
      return new Response(
        JSON.stringify({ error: usageCheck.message }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const action = body.action as EnhanceAction;

    const questionText = body.questionText || body.question?.question || body.question?.question_text || "";
    const questionOptions = body.options || body.question?.options || [];

    const question: Question = body.question || {
      question: questionText,
      options: questionOptions,
      correctAnswer: body.question?.correctAnswer || 0,
      explanation: body.question?.explanation || "",
    };

    if (!action) {
      throw new Error('Action tələb olunur');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!LOVABLE_API_KEY && !GEMINI_API_KEY) {
      throw new Error('No AI API key configured (LOVABLE_API_KEY or GEMINI_API_KEY)');
    }

    // Create Supabase client to fetch AI config
    let targetModelId = 'google/gemini-2.5-flash'; // Default fallback

    try {
      const aliasedModelId = await resolveModelByAlias('TEXT_ANALYSIS', supabase);
      if (aliasedModelId) {
        targetModelId = aliasedModelId;
        console.log(`Dynamic model matched by alias: ${targetModelId}`);
      }
    } catch (e) {
      console.error("Error fetching model alias config:", e);
    }

    console.log(`Processing action: ${action} with model: ${targetModelId} for text: ${questionText?.substring(0, 50)}...`);

    let resultResponse: Response;

    // Handle parse_pasted_test separately with its own tool
    if (action === 'parse_pasted_test') {
      const parsePrompt = `Aşağıdakı qarışıq mətndən bir test sualı detallarını çıxar:
      
      Mətn:
      ${questionText}
      
      Sualın mətnini, variantlarını (əgər varsa), düzgün cavabı, izahı (əgər varsa) və mövzusunu təyin et.`;

      const parseResponse = await fetchAI(LOVABLE_API_KEY, GEMINI_API_KEY, {
        messages: [
          { role: 'system', content: 'Sən test suallarını mətndən çıxaran və strukturlaşdıran bir botsan. Azərbaycan dilində cavab ver.' },
          { role: 'user', content: parsePrompt }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'return_parsed_question',
              description: 'Return the parsed question structure',
              parameters: {
                type: 'object',
                properties: {
                  question_text: { type: 'string' },
                  question_type: { type: 'string', enum: ['multiple_choice', 'true_false', 'open', 'fill_in_the_blank'] },
                  options: { type: 'array', items: { type: 'string' } },
                  correct_answer: { type: 'string' },
                  explanation: { type: 'string' },
                  category: { type: 'string' },
                  difficulty: { type: 'string', enum: ['asan', 'orta', 'çətin'] },
                  bloom_level: { type: 'string' },
                  tags: { type: 'array', items: { type: 'string' } }
                },
                required: ['question_text', 'question_type', 'options', 'correct_answer']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'return_parsed_question' } }
      }, targetModelId);

      if (!parseResponse.ok) {
        const err = await parseResponse.text();
        throw new Error(`AI error (${parseResponse.status}): ${err.substring(0, 100)}`);
      }
      const data = await parseResponse.json();
      const usage = data.usage || { prompt_tokens: 0, completion_tokens: 0 };
      await logUsage(userId, supabase, usage.prompt_tokens, usage.completion_tokens, targetModelId, action);

      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall) {
        return new Response(JSON.stringify(JSON.parse(toolCall.function.arguments)), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      throw new Error('Parse format error');
    }

    // Handle analyze_full
    if (action === 'analyze_full') {
      const analyzePrompt = `Bu sualı analiz et və uyğun metadata təklif et:
      
      Sual: ${questionText}
      Variantlar: ${JSON.stringify(questionOptions)}
      
      Düzgün kateqoriya, çətinlik, Bloom səviyyəsi, çəki (1-5), zaman limiti və teqləri müəyyən et.`;

      const analyzeResponse = await fetchAI(LOVABLE_API_KEY, GEMINI_API_KEY, {
        messages: [
          { role: 'system', content: 'Sən təhsil mütəxəssisisən. Sualı analiz et və JSON formatında metadata qaytar.' },
          { role: 'user', content: analyzePrompt }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'return_analysis',
              parameters: {
                type: 'object',
                properties: {
                  category: { type: 'string' },
                  difficulty: { type: 'string', enum: ['asan', 'orta', 'çətin'] },
                  bloom_level: { type: 'string' },
                  weight: { type: 'number' },
                  time_limit: { type: 'number' },
                  tags: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'return_analysis' } }
      }, targetModelId);

      if (!analyzeResponse.ok) {
        const err = await analyzeResponse.text();
        throw new Error(`AI error (${analyzeResponse.status}): ${err.substring(0, 100)}`);
      }
      const data = await analyzeResponse.json();
      const usage = data.usage || { prompt_tokens: 0, completion_tokens: 0 };
      await logUsage(userId, supabase, usage.prompt_tokens, usage.completion_tokens, targetModelId, action);

      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall) {
        return new Response(JSON.stringify(JSON.parse(toolCall.function.arguments)), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      throw new Error('Analysis format error');
    }

    // Handle quality analysis
    if (action === 'quality_analysis') {
      const analysisPrompt = `Aşağıdakı test suallarını keyfiyyət baxımından analiz et.
Suallar: ${questionText}

Aşağıdakı meyarlara görə 0-100 arası bal ver:
1. clarity (aydınlıq)
2. distractorStrength (distraktor gücü)
3. bloomAlignment (Bloom uyğunluğu)

Həmçinin konkret təkmilləşdirmə təklifləri ver.`;

      const analysisResponse = await fetchAI(LOVABLE_API_KEY, GEMINI_API_KEY, {
        messages: [
          { role: 'system', content: 'Sən test suallarının keyfiyyətini analiz edən ekspertinsən. Azərbaycan dilində cavab ver.' },
          { role: 'user', content: analysisPrompt }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'return_quality_analysis',
              parameters: {
                type: 'object',
                properties: {
                  clarity: { type: 'number' },
                  distractorStrength: { type: 'number' },
                  bloomAlignment: { type: 'number' },
                  overall: { type: 'number' },
                  suggestions: { type: 'array', items: { type: 'string' } }
                },
                required: ['clarity', 'distractorStrength', 'bloomAlignment', 'overall', 'suggestions']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'return_quality_analysis' } }
      }, targetModelId);

      if (!analysisResponse.ok) {
        const err = await analysisResponse.text();
        throw new Error(`AI error (${analysisResponse.status}): ${err.substring(0, 100)}`);
      }
      const analysisData = await analysisResponse.json();
      const usage = analysisData.usage || { prompt_tokens: 0, completion_tokens: 0 };
      await logUsage(userId, supabase, usage.prompt_tokens, usage.completion_tokens, targetModelId, action);

      const toolCall = analysisData.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall) {
        const analysis = JSON.parse(toolCall.function.arguments);
        return new Response(JSON.stringify({ analysis }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      throw new Error('Quality analysis response format error');
    }

    // Suggestion-oriented actions
    const suggestionActions = ['suggest_video_search', 'generate_rubric', 'generate_per_option_explanations', 'generate_hint', 'suggest_3d_model', 'generate_tags', 'suggest_bloom_level', 'check_correctness'];
    if (suggestionActions.includes(action)) {
      const suggestionPrompt = `Sualın mətni: ${questionText}
Variantlar: ${JSON.stringify(questionOptions)}
İzah: ${question.explanation}

Tapşırıq: ${actionPrompts[action]}`;

      const suggestionResponse = await fetchAI(LOVABLE_API_KEY, GEMINI_API_KEY, {
        messages: [
          { role: 'system', content: 'Sən təhsil mütəxəssisisən. Azərbaycan dilində cavab ver.' },
          { role: 'user', content: suggestionPrompt }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'return_suggestion',
              parameters: {
                type: 'object',
                properties: {
                  content: { type: 'string' }
                },
                required: ['content']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'return_suggestion' } }
      }, targetModelId);

      if (!suggestionResponse.ok) {
        const err = await suggestionResponse.text();
        throw new Error(`AI error (${suggestionResponse.status}): ${err.substring(0, 100)}`);
      }
      const suggestionData = await suggestionResponse.json();
      const usage = suggestionData.usage || { prompt_tokens: 0, completion_tokens: 0 };
      await logUsage(userId, supabase, usage.prompt_tokens, usage.completion_tokens, targetModelId, action);

      const toolCall = suggestionData.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall) {
        const suggestionArgs = JSON.parse(toolCall.function.arguments);
        return new Response(JSON.stringify({ suggestion: suggestionArgs.content }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      throw new Error('Suggestion response format error');
    }

    // Default: Enhance/Improve question
    const systemPrompt = `Sən Azərbaycan dilində test suallarını təkmilləşdirən ekspert müəllimsən.
 Verilən sualı təkmilləşdir və yalnız JSON formatında cavab ver.

 ${actionPrompts[action] || "Sualı və variantları təkmilləşdir."}

 VACIB QAYDALAR:
 1. Cavab Azərbaycan dilində olmalıdır
 2. Hər sualın 4 variantı olmalıdır
 3. Yalnız bir düzgün cavab olmalıdır
 4. correctAnswer 0-3 arası indeks olmalıdır
 5. Bloom səviyyəsini təyin et: remembering, understanding, applying, analyzing, evaluating, creating`;

    const userPrompt = `Mövcud sual:
 Sual: ${questionText}
 Variantlar: ${JSON.stringify(questionOptions)}
 Düzgün cavab: ${question.correctAnswer || question.correct_answer}
 İzah: ${question.explanation}

 Bu sualı "${action}" əməliyyatı ilə təkmilləşdir.`;

    const response = await fetchAI(LOVABLE_API_KEY, GEMINI_API_KEY, {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'return_enhanced_question',
            parameters: {
              type: 'object',
              properties: {
                question: { type: 'string' },
                options: { type: 'array', items: { type: 'string' } },
                correctAnswer: { type: 'number' },
                explanation: { type: 'string' },
                bloomLevel: {
                  type: 'string',
                  enum: ['remembering', 'understanding', 'applying', 'analyzing', 'evaluating', 'creating']
                }
              },
              required: ['question', 'options', 'correctAnswer', 'explanation', 'bloomLevel']
            }
          }
        }
      ],
      tool_choice: { type: 'function', function: { name: 'return_enhanced_question' } }
    }, targetModelId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI error (${response.status}): ${errorText.substring(0, 100)}`);
    }

    const data = await response.json();
    const usage = data.usage || { prompt_tokens: 0, completion_tokens: 0 };
    await logUsage(userId, supabase, usage.prompt_tokens, usage.completion_tokens, targetModelId, action);

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall) {
      const enhancedQuestion = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify({ enhancedQuestion }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    throw new Error('AI yanıtı gözlənilən formatda deyil');

  } catch (error) {
    console.error('Error in enhance-question function:', error);

    // Check if it's a rate limit error to provide a more user-friendly message
    const errorMsg = error instanceof Error ? error.message : 'Naməlum xəta baş verdi';
    let status = 500;
    let friendlyMsg = errorMsg;

    if (errorMsg.includes('429')) {
      status = 429;
      friendlyMsg = errorMsg.includes('limitiniz') ? errorMsg : 'Sorğu limiti aşıldı. Zəhmət olmasa bir az gözləyin (AI Rate Limit).';
    } else if (errorMsg.includes('402')) {
      status = 402;
      friendlyMsg = 'Kredit balansı bitib.';
    }

    return new Response(
      JSON.stringify({ error: friendlyMsg }),
      { status: status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
