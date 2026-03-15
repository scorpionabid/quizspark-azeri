/// <reference lib="deno.ns" />

// Edge Function imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkUsageLimit, logUsage } from "../_shared/ai-usage.ts";
import { corsHeaders } from "../_shared/cors.ts";

function getToolSchemaForType(questionType: string) {
  if (questionType === 'true_false') {
    return {
      type: 'object',
      properties: {
        questions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              question: { type: 'string', description: 'The question/statement text in Azerbaijani' },
              options: { type: 'array', items: { type: 'string' }, description: 'Always ["Doğru", "Yanlış"]' },
              correctAnswer: { type: 'number', description: 'Index of correct answer: 0 for Doğru, 1 for Yanlış' },
              explanation: { type: 'string', description: 'Explanation in Azerbaijani' },
              bloomLevel: {
                type: 'string',
                enum: ['remembering', 'understanding', 'applying', 'analyzing', 'evaluating', 'creating'],
              },
              questionType: { type: 'string', enum: ['true_false'] },
            },
            required: ['question', 'options', 'correctAnswer', 'explanation', 'bloomLevel', 'questionType'],
            additionalProperties: false,
          },
        },
      },
      required: ['questions'],
      additionalProperties: false,
    };
  }

  if (questionType === 'short_answer') {
    return {
      type: 'object',
      properties: {
        questions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              question: { type: 'string', description: 'The question text in Azerbaijani' },
              options: { type: 'array', items: { type: 'string' }, description: 'Array with single element: the correct answer text' },
              correctAnswer: { type: 'number', description: 'Always 0' },
              explanation: { type: 'string', description: 'Explanation in Azerbaijani' },
              bloomLevel: {
                type: 'string',
                enum: ['remembering', 'understanding', 'applying', 'analyzing', 'evaluating', 'creating'],
              },
              questionType: { type: 'string', enum: ['short_answer'] },
            },
            required: ['question', 'options', 'correctAnswer', 'explanation', 'bloomLevel', 'questionType'],
            additionalProperties: false,
          },
        },
      },
      required: ['questions'],
      additionalProperties: false,
    };
  }

  // Default: multiple_choice
  return {
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
            explanation: { type: 'string', description: 'Explanation for the correct answer in Azerbaijani' },
            bloomLevel: {
              type: 'string',
              enum: ['remembering', 'understanding', 'applying', 'analyzing', 'evaluating', 'creating'],
            },
            questionType: { type: 'string', enum: ['multiple_choice'] },
          },
          required: ['question', 'options', 'correctAnswer', 'explanation', 'bloomLevel', 'questionType'],
          additionalProperties: false,
        },
      },
    },
    required: ['questions'],
    additionalProperties: false,
  };
}

function getTypeInstructions(questionType: string): string {
  if (questionType === 'true_false') {
    return `
Sual tipi: DOĞRU/YANLIŞ
- Hər sual bir ifadə olmalıdır (doğru və ya yanlış)
- Variantlar həmişə ["Doğru", "Yanlış"] olmalıdır
- correctAnswer doğru üçün 0, yanlış üçün 1 olmalıdır
- questionType: "true_false" olmalıdır`;
  }

  if (questionType === 'short_answer') {
    return `
Sual tipi: QISA CAVAB (açıq sual)
- Hər sual qısa cavab tələb edən açıq sual olmalıdır
- options massivində yalnız bir element olmalıdır: düzgün cavab mətni
- correctAnswer həmişə 0 olmalıdır
- questionType: "short_answer" olmalıdır`;
  }

  return `
Sual tipi: ÇOXSEÇİMLİ
- Hər sualın 4 variantı olmalıdır (A, B, C, D)
- Yalnız bir düzgün cavab olmalıdır
- questionType: "multiple_choice" olmalıdır`;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
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

    const {
      topic,
      subject,
      difficulty,
      questionCount,
      agentId,
      templatePrompt,
      documentContext,
      model = 'google/gemini-2.5-flash',
      temperature = 0.7,
      bloomLevel,
      questionType = 'multiple_choice',
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Generating ${questionCount} ${questionType} questions for topic: ${topic}, subject: ${subject}, difficulty: ${difficulty}`);

    const difficultyInstructions: Record<string, string> = {
      easy: "Suallar sadə olmalı, əsas anlayışları əhatə etməlidir.",
      medium: "Suallar orta çətinlikdə olmalı, mövzunun dərindən başa düşülməsini tələb etməlidir.",
      hard: "Suallar çətin olmalı, analitik düşüncə və mürəkkəb problemlərin həllini tələb etməlidir.",
    };

    const agentPrompts: Record<string, string> = {
      'quiz-master': `Sən Azərbaycan dilində test sualları yaradan ekspert müəllimsən.
Sənin vəzifən verilmiş mövzu üzrə keyfiyyətli test sualları yaratmaqdır.`,
      'curriculum-designer': `Sən kurikulum dizayner və təhsil planlaşdırıcısısan.
Sualları öyrənmə nəticələrinə uyğun və pedaqoji cəhətdən düzgün yarat.`,
      'assessment-expert': `Sən qiymətləndirmə mütəxəssisisən.
Sualları Bloom taksonomiyasına uyğun yarat və müxtəlif səviyyələri əhatə et.`,
      'subject-specialist': `Sən fənn mütəxəssisisən.
Sualları fənnin dərin biliyinə əsaslanaraq, dəqiq və elmi cəhətdən düzgün yarat.`,
      'language-coach': `Sən dil və linqvistika mütəxəssisisən.
Sualları aydın, anlaşılan və qrammatik cəhətdən mükəmməl yarat.`,
    };

    let systemPrompt = agentPrompts[agentId] || agentPrompts['quiz-master'];

    if (templatePrompt) {
      systemPrompt += `\n\nXüsusi təlimatlar:\n${templatePrompt}`;
    }

    systemPrompt += `

Vacib qaydalar:
1. Suallar Azərbaycan dilində olmalıdır
2. Hər sual üçün izah yazılmalıdır
3. Suallar mövzuya uyğun və dəqiq olmalıdır
4. Hər sual üçün Bloom taksonomiyası səviyyəsini təyin et: remembering, understanding, applying, analyzing, evaluating, creating
${getTypeInstructions(questionType)}

Çətinlik səviyyəsi: ${difficultyInstructions[difficulty] || difficultyInstructions.medium}`;

    if (bloomLevel) {
      systemPrompt += `\n\nVacib: Bütün suallar "${bloomLevel}" Bloom səviyyəsində olmalıdır.`;
    }

    let userPrompt = `Mövzu: ${topic}
Fənn: ${subject}
Sual sayı: ${questionCount}`;

    if (documentContext) {
      userPrompt += `

Aşağıdakı sənəd məzmununa əsaslanaraq suallar yarat:

${documentContext}

Bu sənədə daxil olan məlumatlardan istifadə edərək ${questionCount} ədəd test sualı yarat.`;
    } else {
      userPrompt += `

Bu mövzu üzrə ${questionCount} ədəd test sualı yarat.`;
    }

    const toolSchema = getToolSchemaForType(questionType);

    const requestBody = JSON.stringify({
      model,
      temperature,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'create_quiz_questions',
            description: 'Create quiz questions with options and explanations',
            parameters: toolSchema,
          },
        },
      ],
      tool_choice: { type: 'function', function: { name: 'create_quiz_questions' } },
    });

    // Try Lovable AI gateway first, fall back to Gemini API on auth failure
    let response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: requestBody,
    });

    if (response.status === 401 || response.status === 403) {
      const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
      if (GEMINI_API_KEY) {
        console.log('Lovable gateway auth failed, falling back to Gemini API directly');
        const geminiModel = model.replace('google/', '');
        response = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${GEMINI_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...JSON.parse(requestBody), model: geminiModel }),
        });
      }
    }

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

    const usage = data.usage || { prompt_tokens: 0, completion_tokens: 0 };
    await logUsage(userId, supabase, usage.prompt_tokens, usage.completion_tokens, model, 'quiz_generation');

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== 'create_quiz_questions') {
      console.error('Unexpected response format:', data);
      throw new Error('AI yanıtı gözlənilən formatda deyil');
    }

    const questionsData = JSON.parse(toolCall.function.arguments);

    interface AIQuestion {
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
      bloomLevel: string;
      questionType: string;
    }

    const questions = questionsData.questions.map((q: AIQuestion, index: number) => ({
      ...q,
      id: `ai-${Date.now()}-${index}`,
      questionType: q.questionType || questionType,
    }));

    console.log(`Successfully generated ${questions.length} ${questionType} questions`);

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
