import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    let isAdmin = false;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;

      if (userId) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .eq("role", "admin")
          .single();
        isAdmin = !!roleData;
      }
    }

    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();

    // GET /ai-config/providers - Get all providers with models
    if (req.method === "GET" && path === "providers") {
      const { data: providers, error } = await supabase
        .from("ai_providers")
        .select(`
          *,
          models:ai_models(*)
        `)
        .order("created_at");

      if (error) throw error;

      // Check which providers have API keys configured
      const providersWithStatus = await Promise.all(
        providers.map(async (provider) => {
          let hasApiKey = false;
          if (provider.name === "lovable") {
            hasApiKey = !!Deno.env.get("LOVABLE_API_KEY");
          } else if (provider.name === "openai") {
            hasApiKey = !!Deno.env.get("OPENAI_API_KEY");
          } else if (provider.name === "anthropic") {
            hasApiKey = !!Deno.env.get("ANTHROPIC_API_KEY");
          } else if (provider.name === "google") {
            hasApiKey = !!Deno.env.get("GOOGLE_AI_API_KEY");
          }
          return { ...provider, hasApiKey };
        })
      );

      return new Response(JSON.stringify({ providers: providersWithStatus }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /ai-config/config - Get current config
    if (req.method === "GET" && path === "config") {
      const { data: config, error } = await supabase
        .from("ai_config")
        .select(`
          *,
          default_provider:ai_providers(*),
          default_model:ai_models(*)
        `)
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ config }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT /ai-config/config - Update config (admin only)
    if (req.method === "PUT" && path === "config") {
      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const updates = await req.json();
      const { data, error } = await supabase
        .from("ai_config")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", updates.id)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ config: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT /ai-config/provider - Toggle provider (admin only)
    if (req.method === "PUT" && path === "provider") {
      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { id, is_enabled } = await req.json();
      const { data, error } = await supabase
        .from("ai_providers")
        .update({ is_enabled })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ provider: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /ai-config/usage - Get usage statistics
    if (req.method === "GET" && path === "usage") {
      const today = new Date().toISOString().split("T")[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

      // Today's usage
      const { data: todayLogs } = await supabase
        .from("ai_usage_logs")
        .select("total_tokens")
        .gte("created_at", today);

      // This week's usage
      const { data: weekLogs } = await supabase
        .from("ai_usage_logs")
        .select("total_tokens")
        .gte("created_at", weekAgo);

      // This month's usage
      const { data: monthLogs } = await supabase
        .from("ai_usage_logs")
        .select("total_tokens")
        .gte("created_at", monthAgo);

      const stats = {
        today: {
          requests: todayLogs?.length || 0,
          tokens: todayLogs?.reduce((sum, l) => sum + (l.total_tokens || 0), 0) || 0,
        },
        week: {
          requests: weekLogs?.length || 0,
          tokens: weekLogs?.reduce((sum, l) => sum + (l.total_tokens || 0), 0) || 0,
        },
        month: {
          requests: monthLogs?.length || 0,
          tokens: monthLogs?.reduce((sum, l) => sum + (l.total_tokens || 0), 0) || 0,
        },
      };

      return new Response(JSON.stringify({ stats }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /ai-config/user-usage - Get per-user usage (admin only)
    if (req.method === "GET" && path === "user-usage") {
      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const today = new Date().toISOString().split("T")[0];

      const { data: usageData, error } = await supabase
        .from("admin_ai_usage_monitoring")
        .select("*")
        .eq("usage_date", today)
        .order("total_requests", { ascending: false })
        .limit(100);

      if (error) throw error;

      return new Response(JSON.stringify({ usage: usageData || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT /ai-config/user-limit - Update user specific limit (admin only)
    if (req.method === "PUT" && path === "user-limit") {
      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { user_id, ai_daily_limit } = await req.json();

      if (!user_id) {
        throw new Error("user_id is required");
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({ ai_daily_limit })
        .eq("user_id", user_id)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ profile: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("AI Config error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
