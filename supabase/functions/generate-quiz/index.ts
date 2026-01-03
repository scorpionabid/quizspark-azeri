import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, subject, difficulty, questionCount, agentId, templatePrompt, documentContext } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Generating ${questionCount} questions for topic: ${topic}, subject: ${subject}, difficulty: ${difficulty}`);
    console.log(`Agent: ${agentId}, Has template: ${!!templatePrompt}, Has document context: ${!!documentContext}`);

    const difficultyInstructions: Record<string, string> = {
      easy: "Suallar sadə olmalı, əsas anlayışları əhatə etməlidir.",
      medium: "Suallar orta çətinlikdə olmalı, mövzunun dərindən başa düşülməsini tələb etməlidir.",
      hard: "Suallar çətin olmalı, analitik düşüncə və mürəkkəb problemlərin həllini tələb etməlidir."
    };

    // Agent-specific system prompts
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
    
    // Add template if provided
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

    // Build user prompt
    let userPrompt = `Mövzu: ${topic}
Fənn: ${subject}
Sual sayı: ${questionCount}`;

    // Add document context if provided (RAG)
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
                        question: { 
                          type: 'string',
                          description: 'The question text in Azerbaijani'
                        },
                        options: { 
                          type: 'array',
                          items: { type: 'string' },
                          description: 'Array of 4 answer options'
                        },
                        correctAnswer: { 
                          type: 'number',
                          description: 'Index of correct answer (0-3)'
                        },
                        explanation: { 
                          type: 'string',
                          description: 'Explanation for the correct answer in Azerbaijani'
                        }
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

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== 'create_quiz_questions') {
      console.error('Unexpected response format:', data);
      throw new Error('AI yanıtı gözlənilən formatda deyil');
    }

    const questionsData = JSON.parse(toolCall.function.arguments);
    
    // Add IDs to questions
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
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Naməlum xəta baş verdi' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
