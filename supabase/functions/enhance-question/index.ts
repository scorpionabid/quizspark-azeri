 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 
 const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
 };
 
 type EnhanceAction = "simplify" | "harder" | "improve_options" | "expand_explanation" | "similar" | "quality_analysis";
 
 interface Question {
   id: string;
   question: string;
   options: string[];
   correctAnswer: number;
   explanation: string;
   bloomLevel?: string;
 }
 
 const actionPrompts: Record<EnhanceAction, string> = {
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

  quality_analysis: `Bu sualın keyfiyyətini analiz et və aşağıdakı meyarlara görə qiymətləndir:
    - Aydınlıq (1-10): Sual nə dərəcədə aydın yazılıb?
    - Çətinlik uyğunluğu (1-10): Çətinlik səviyyəsinə uyğundurmu?
    - Bloom taksonomiyası (1-10): Bloom səviyyəsinə uyğundurmu?
    - Distraktor keyfiyyəti (1-10): Yanlış variantlar inandırıcıdırmı?
    - İzah keyfiyyəti (1-10): İzah kifayət qədər ətraflıdırmı?
    - Ümumi qiymət (1-10)
    JSON formatında cavab ver: {"clarity":X,"difficulty_match":X,"bloom_match":X,"distractor_quality":X,"explanation_quality":X,"overall":X,"suggestions":["təklif1","təklif2"]}`,
};
 
 serve(async (req) => {
   if (req.method === 'OPTIONS') {
     return new Response(null, { headers: corsHeaders });
   }
 
  try {
    const { question, action } = await req.json() as { question: Question; action: EnhanceAction };

    if (!question || !action) {
      throw new Error('Sual və action tələb olunur');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Handle quality analysis separately
    if (action === 'quality_analysis') {
      const analysisPrompt = `Aşağıdakı test suallarını keyfiyyət baxımından analiz et.

Suallar:
${question.question}

Aşağıdakı meyarlara görə 0-100 arası bal ver:
1. clarity (aydınlıq) - sualın aydın və başa düşülən olması
2. distractorStrength (distraktor gücü) - yanlış variantların inandırıcılığı
3. bloomAlignment (Bloom uyğunluğu) - müxtəlif düşüncə səviyyələrini əhatə etməsi

Həmçinin konkret təkmilləşdirmə təklifləri ver.`;

      const analysisResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: 'Sən test suallarının keyfiyyətini analiz edən ekspertinsən. Azərbaycan dilində cavab ver.' },
            { role: 'user', content: analysisPrompt }
          ],
          tools: [
            {
              type: 'function',
              function: {
                name: 'return_quality_analysis',
                description: 'Return the quality analysis results',
                parameters: {
                  type: 'object',
                  properties: {
                    clarity: { type: 'number', description: 'Clarity score 0-100' },
                    distractorStrength: { type: 'number', description: 'Distractor strength score 0-100' },
                    bloomAlignment: { type: 'number', description: 'Bloom alignment score 0-100' },
                    overall: { type: 'number', description: 'Overall quality score 0-100' },
                    suggestions: { type: 'array', items: { type: 'string' }, description: 'List of improvement suggestions in Azerbaijani' }
                  },
                  required: ['clarity', 'distractorStrength', 'bloomAlignment', 'overall', 'suggestions'],
                  additionalProperties: false
                }
              }
            }
          ],
          tool_choice: { type: 'function', function: { name: 'return_quality_analysis' } }
        }),
      });

      if (!analysisResponse.ok) {
        if (analysisResponse.status === 429) {
          return new Response(
            JSON.stringify({ error: 'Sorğu limiti aşıldı.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        if (analysisResponse.status === 402) {
          return new Response(
            JSON.stringify({ error: 'Kredit balansı bitib.' }),
            { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        throw new Error('AI gateway error for quality analysis');
      }

      const analysisData = await analysisResponse.json();
      const toolCall = analysisData.choices?.[0]?.message?.tool_calls?.[0];
      
      if (toolCall && toolCall.function.name === 'return_quality_analysis') {
        const analysis = JSON.parse(toolCall.function.arguments);
        return new Response(
          JSON.stringify({ analysis }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error('Quality analysis response format error');
    }
 
     console.log(`Enhancing question with action: ${action}`);
 
     const systemPrompt = `Sən Azərbaycan dilində test suallarını təkmilləşdirən ekspert müəllimsən.
 Verilən sualı təkmilləşdir və yalnız JSON formatında cavab ver.
 
 ${actionPrompts[action]}
 
 VACIB QAYDALAR:
 1. Cavab Azərbaycan dilində olmalıdır
 2. Hər sualın 4 variantı olmalıdır
 3. Yalnız bir düzgün cavab olmalıdır
 4. correctAnswer 0-3 arası indeks olmalıdır
 5. Bloom səviyyəsini təyin et: remembering, understanding, applying, analyzing, evaluating, creating`;
 
     const userPrompt = `Mövcud sual:
 Sual: ${question.question}
 Variantlar: ${JSON.stringify(question.options)}
 Düzgün cavab indeksi: ${question.correctAnswer}
 İzah: ${question.explanation}
 
 Bu sualı "${action}" əməliyyatı ilə təkmilləşdir.`;
 
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
               name: 'return_enhanced_question',
               description: 'Return the enhanced question',
               parameters: {
                 type: 'object',
                 properties: {
                   question: { type: 'string', description: 'The enhanced question text' },
                   options: { type: 'array', items: { type: 'string' }, description: 'Array of 4 options' },
                   correctAnswer: { type: 'number', description: 'Index of correct answer (0-3)' },
                   explanation: { type: 'string', description: 'Explanation for the correct answer' },
                   bloomLevel: { 
                     type: 'string', 
                     enum: ['remembering', 'understanding', 'applying', 'analyzing', 'evaluating', 'creating'],
                     description: 'Bloom taxonomy level' 
                   }
                 },
                 required: ['question', 'options', 'correctAnswer', 'explanation', 'bloomLevel'],
                 additionalProperties: false
               }
             }
           }
         ],
         tool_choice: { type: 'function', function: { name: 'return_enhanced_question' } }
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
           JSON.stringify({ error: 'Kredit balansı bitib.' }),
           { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
       }
       
       throw new Error(`AI gateway error: ${response.status}`);
     }
 
     const data = await response.json();
     const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
     
     if (!toolCall || toolCall.function.name !== 'return_enhanced_question') {
       console.error('Unexpected response format:', data);
       throw new Error('AI yanıtı gözlənilən formatda deyil');
     }
 
     const enhancedQuestion = JSON.parse(toolCall.function.arguments);
     
     console.log('Enhanced question:', enhancedQuestion);
 
     return new Response(
       JSON.stringify({ enhancedQuestion }),
       { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
 
   } catch (error) {
     console.error('Error in enhance-question function:', error);
     return new Response(
       JSON.stringify({ error: error instanceof Error ? error.message : 'Naməlum xəta baş verdi' }),
       { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
   }
 });