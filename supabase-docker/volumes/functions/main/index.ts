const FUNCTIONS_PATH = "/home/deno/functions";

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  const functionName = pathParts[0];

  if (!functionName) {
    return new Response(JSON.stringify({ error: "Function not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const servicePath = `${FUNCTIONS_PATH}/${functionName}`;

  try {
    // @ts-ignore EdgeRuntime is available in Supabase edge runtime
    const worker = await EdgeRuntime.userWorkers.create({
      servicePath,
      envVars: Object.entries(Deno.env.toObject()),
    });
    return await worker.fetch(req);
  } catch (e) {
    console.error(`Error invoking function ${functionName}:`, e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
