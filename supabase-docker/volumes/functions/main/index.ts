import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const functions: Record<string, string> = {
  "ai-chat": "../ai-chat/index.ts",
  "ai-config": "../ai-config/index.ts",
  "bulk-import-ai": "../bulk-import-ai/index.ts",
  "enhance-question": "../enhance-question/index.ts",
  "generate-question-image": "../generate-question-image/index.ts",
  "generate-quiz": "../generate-quiz/index.ts",
  "process-document": "../process-document/index.ts",
  "question-bank": "../question-bank/index.ts",
};

serve(async (req: Request) => {
  const url = new URL(req.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  const functionName = pathParts[0];

  if (!functionName || !functions[functionName]) {
    return new Response(JSON.stringify({ error: "Function not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Use individual function routes" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
});
