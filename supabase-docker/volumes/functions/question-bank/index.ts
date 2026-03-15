import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, questions, searchQuery, filters } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Generate embedding for text using Lovable AI
    async function generateEmbedding(text: string): Promise<number[]> {
      console.log("Generating embedding for text:", text.substring(0, 100));

      const response = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "text-embedding-3-small",
          input: text,
          dimensions: 768,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Embedding API error:", response.status, errorText);
        throw new Error(`Failed to generate embedding: ${response.status}`);
      }

      const data = await response.json();
      return data.data[0].embedding;
    }

    if (action === "save") {
      console.log("Saving questions to bank:", questions?.length);

      if (!questions || !Array.isArray(questions)) {
        throw new Error("Questions array is required");
      }

      const savedQuestions = [];

      for (const q of questions) {
        // Generate embedding for the question
        const embeddingText = `${q.question} ${q.explanation || ""} ${q.category || ""}`;
        let embedding = null;

        try {
          embedding = await generateEmbedding(embeddingText);
        } catch (embError) {
          console.error("Failed to generate embedding:", embError);
          // Continue without embedding
        }

        const { data, error } = await supabase
          .from("question_bank")
          .insert({
            question_text: q.question,
            question_type: q.type || "multiple_choice",
            options: q.options ? JSON.stringify(q.options) : null,
            correct_answer: q.correctAnswer || q.options?.[0] || "",
            explanation: q.explanation,
            category: q.category,
            difficulty: q.difficulty,
            tags: q.tags || [],
            embedding: embedding,
            source_document_id: q.sourceDocumentId || null,
            user_id: null, // Demo mode - no auth
          })
          .select()
          .single();

        if (error) {
          console.error("Error saving question:", error);
          throw error;
        }

        savedQuestions.push(data);
      }

      return new Response(
        JSON.stringify({ success: true, savedQuestions }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "search") {
      console.log("Searching questions with query:", searchQuery);

      if (!searchQuery) {
        // Return all questions if no search query
        const { data, error } = await supabase
          .from("question_bank")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;

        return new Response(
          JSON.stringify({ results: data }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate embedding for search query
      const queryEmbedding = await generateEmbedding(searchQuery);

      // Use the vector search function
      const { data, error } = await supabase.rpc("search_questions", {
        query_embedding: queryEmbedding,
        match_threshold: 0.5,
        match_count: 20,
        filter_user_id: null,
      });

      if (error) {
        console.error("Vector search error:", error);
        // Fallback to text search
        const { data: textData, error: textError } = await supabase
          .from("question_bank")
          .select("*")
          .ilike("question_text", `%${searchQuery}%`)
          .limit(20);

        if (textError) throw textError;

        return new Response(
          JSON.stringify({ results: textData }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ results: data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "filter") {
      console.log("Filtering questions with:", filters);

      let query = supabase.from("question_bank").select("*");

      if (filters?.category) {
        query = query.eq("category", filters.category);
      }
      if (filters?.difficulty) {
        query = query.eq("difficulty", filters.difficulty);
      }
      if (filters?.type) {
        query = query.eq("question_type", filters.type);
      }

      const { data, error } = await query
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      return new Response(
        JSON.stringify({ results: data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "delete") {
      const { questionId } = await req.json();

      const { error } = await supabase
        .from("question_bank")
        .delete()
        .eq("id", questionId);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error(`Unknown action: ${action}`);

  } catch (error) {
    console.error("Question bank error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
