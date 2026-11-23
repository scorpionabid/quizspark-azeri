/// <reference lib="deno.ns" />

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "İcazəsiz giriş" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "İcazəsiz giriş" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { imageBase64, quizId, variant = "A", questionCount = 10 } = await req.json();
    if (!imageBase64) {
      throw new Error("Şəkil məlumatı göndərilməyib");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!LOVABLE_API_KEY && !GEMINI_API_KEY) {
      throw new Error("AI API açarı konfiqurasiya edilməyib");
    }

    // Load expected answer key from DB if quizId is provided
    let expectedOptions: string[] = [];
    let expectedTypes: string[] = [];
    let expectedSubjects: (string | null)[] = [];
    let expectedWeights: number[] = [];
    let expectedCount = questionCount;

    if (quizId) {
      const { data: dbQuestions, error: qErr } = await supabase
        .from("questions")
        .select("question_type, options, correct_answer, title, weight, order_index")
        .eq("quiz_id", quizId)
        .order("order_index", { ascending: true });

      if (qErr) throw qErr;
      if (dbQuestions && dbQuestions.length > 0) {
        expectedCount = dbQuestions.length;
        const hasSubjects = dbQuestions.some((q: { title?: string | null }) => Boolean(q.title));
        const ordered =
          variant === "B" && !hasSubjects
            ? seededShuffle(dbQuestions, 42)
            : dbQuestions;

        expectedTypes = ordered.map((q: { question_type?: string | null }) => q.question_type || "multiple_choice");
        expectedSubjects = ordered.map((q: { title?: string | null }) => q.title || null);
        expectedWeights = ordered.map((q: { weight?: number | null }) => (q.weight && q.weight > 0 ? Number(q.weight) : 1));
        expectedOptions = ordered.map((q: { question_type?: string | null; options?: unknown; correct_answer?: string }, idx: number) => {
          if (q.question_type === "true_false") {
            return q.correct_answer === "Doğru" ? "A" : "B";
          }
          if (q.question_type === "multiple_choice" && Array.isArray(q.options)) {
            const opts = variant === "B" ? seededShuffle(q.options as string[], 100 + idx) : (q.options as string[]);
            const correctIdx = opts.indexOf(q.correct_answer ?? "");
            return correctIdx >= 0 ? (LETTERS[correctIdx] ?? "A") : "A";
          }
          return "";
        });
      }
    }

    const cleanDataUrl = imageBase64.startsWith("data:")
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`;

    const toolSchema = {
      type: "object",
      properties: {
        studentName: {
          type: "string",
          description: "Handwritten student full name on the sheet if readable, otherwise empty string",
        },
        answers: {
          type: "array",
          items: {
            type: "object",
            properties: {
              questionNumber: { type: "number" },
              markedOption: {
                type: ["string", "null"],
                enum: ["A", "B", "C", "D", null],
                description: "The filled/marked bubble letter, or null if blank/unclear",
              },
            },
            required: ["questionNumber", "markedOption"],
            additionalProperties: false,
          },
        },
      },
      required: ["studentName", "answers"],
      additionalProperties: false,
    };

    const prompt = `Sən optik cavab vərəqi (OMR) oxuyan dəqiq sistemin hissəsisən.
Bu şəkildə 1-dən ${expectedCount}-ə qədər suallar üçün A, B, C, D dairəcikləri var.
Tapşırıq:
1. Əgər "Şagirdin Adı, Soyadı" xanasında əl yazısı varsa, onu oxu (oxunmursa boş string "" qaytar).
2. 1-dən ${expectedCount}-ə qədər hər sual nömrəsi üçün qaralanmış/işarələnmiş dairəciyi (A, B, C və ya D) təyin et. Boşdursa və ya iki variant qaralanıbsa null qaytar.`;

    let parsed: { studentName: string; answers: Array<{ questionNumber: number; markedOption: string | null }> } | null = null;

    if (LOVABLE_API_KEY) {
      const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: cleanDataUrl } },
              ],
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "submit_omr_sheet",
                description: "Submit extracted OMR answers and student name",
                parameters: toolSchema,
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "submit_omr_sheet" } },
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Vision API xətası: ${resp.status} ${errText}`);
      }
      const data = await resp.json();
      const argsStr = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
      if (argsStr) parsed = JSON.parse(argsStr);
    } else if (GEMINI_API_KEY) {
      const base64Only = cleanDataUrl.replace(/^data:image\/\w+;base64,/, "");
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${prompt}\nYalnız JSON qaytar: {"studentName": "...", "answers": [{"questionNumber": 1, "markedOption": "A"}]}` },
                  { inlineData: { mimeType: "image/jpeg", data: base64Only } },
                ],
              },
            ],
            generationConfig: { responseMimeType: "application/json" },
          }),
        }
      );
      if (!resp.ok) {
        throw new Error(`Gemini Vision xətası: ${resp.status}`);
      }
      const data = await resp.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      parsed = JSON.parse(rawText);
    }

    if (!parsed) {
      throw new Error("Cavab vərəqi oxuna bilmədi");
    }

    const answerMap = new Map<number, string | null>();
    for (const a of parsed.answers || []) {
      answerMap.set(a.questionNumber, a.markedOption);
    }

    const results = Array.from({ length: expectedCount }, (_, idx) => {
      const qNum = idx + 1;
      const questionType = expectedTypes[idx] ?? "multiple_choice";
      const maxPoints = expectedWeights[idx] ?? 1;
      const markedOption = answerMap.get(qNum) ?? null;
      const correctOption = expectedOptions[idx] || null;
      const isCorrect = Boolean(markedOption && correctOption && markedOption === correctOption);
      const earnedPoints = isCorrect ? maxPoints : 0;
      return {
        questionNumber: qNum,
        questionType,
        subjectLabel: expectedSubjects[idx] ?? null,
        markedOption,
        correctOption,
        isCorrect,
        maxPoints,
        earnedPoints,
      };
    });

    const correctCount = results.filter((r) => r.isCorrect).length;
    const totalPoints = results.reduce((sum, r) => sum + r.maxPoints, 0);
    const earnedTotalPoints = results.reduce((sum, r) => sum + r.earnedPoints, 0);
    const percentage = totalPoints > 0 ? Math.round((earnedTotalPoints / totalPoints) * 100) : 0;

    return new Response(
      JSON.stringify({
        studentName: parsed.studentName || "",
        totalQuestions: expectedCount,
        correctCount,
        totalPoints,
        earnedTotalPoints,
        percentage,
        variant,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Naməlum xəta";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
