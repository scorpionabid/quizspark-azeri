/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkUsageLimit, logUsage } from "../_shared/ai-usage.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
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

    const { messages, agentId, systemPrompt } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`AI Chat request - Agent: ${agentId}, Messages: ${messages.length} for user: ${userId}`);

    const baseSystemPrompt = `Sən Azərbaycan dilində cavab verən təhsil köməkçisisən.
Cavablarını aydın, peşəkar və faydalı şəkildə formalaşdır.
Lazım gələrsə nümunələr və izahlar ver.`;

    const fullSystemPrompt = systemPrompt
      ? `${baseSystemPrompt}\n\n${systemPrompt}`
      : baseSystemPrompt;

    const requestBody = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: fullSystemPrompt },
        ...messages,
      ],
      stream: true,
    };

    let response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.status === 401 || response.status === 403) {
      const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
      if (GEMINI_API_KEY) {
        console.log('Lovable gateway auth failed, falling back to Gemini API directly');
        response = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${GEMINI_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...requestBody, model: 'gemini-2.5-flash' }),
        });
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log usage (estimate for streaming - actual tokens are in the stream)
    const estimatedInputTokens = messages.reduce((acc: number, m: { content?: string }) => acc + (m.content?.length || 0) / 4, 0);
    await logUsage(
      userId,
      supabase,
      Math.round(estimatedInputTokens),
      0, // Output tokens will be counted client-side for streaming
      'google/gemini-2.5-flash',
      'chat'
    );

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
