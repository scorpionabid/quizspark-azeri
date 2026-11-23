/// <reference lib="deno.ns" />

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const CORE_SUBJECTS = [
  "Azərbaycan dili",
  "Riyaziyyat",
  "İngilis dili",
  "Ədəbiyyat",
  "Tarix",
  "Coğrafiya",
  "Fizika",
  "Kimya",
  "Biologiya",
  "İnformatika",
];

const TRIMS_BASE = "https://www.trims.edu.az/site/";

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/ə/g, "e")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ğ/g, "g")
    .replace(/ç/g, "c")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function detectGrade(text: string): number | null {
  const match = text.match(/(\d{1,2})\s*-?\s*(?:ci|cu|cü|cı)?\s*sinif/i);
  if (!match) return null;
  const g = parseInt(match[1], 10);
  return g >= 1 && g <= 11 ? g : null;
}

function detectCoreSubject(text: string): string | null {
  const lower = text.toLowerCase();
  for (const subj of CORE_SUBJECTS) {
    if (lower.includes(subj.toLowerCase())) return subj;
  }
  if (lower.includes("azərbaycan tarixi") || lower.includes("ümumi tarix")) {
    return "Tarix";
  }
  return null;
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

    const body = await req.json();
    const { mode = "catalog_core", textbookId, maxPages = 3 } = body;

    // Mode 1: Scan TRIMS catalog for the 10 core subjects and queue them
    if (mode === "catalog_core") {
      const resourceIds = new Set<string>();
      for (let page = 1; page <= maxPages; page++) {
        const res = await fetch(`${TRIMS_BASE}search.php?search=ok&category_id=c-1&page=${page}`);
        if (!res.ok) break;
        const html = await res.text();
        const matches = [...html.matchAll(/resource\.php\?id=(\d+)/g)];
        if (matches.length === 0) break;
        for (const m of matches) resourceIds.add(m[1]);
      }

      let queued = 0;
      let skipped = 0;

      for (const id of [...resourceIds].slice(0, 25)) {
        const res = await fetch(`${TRIMS_BASE}resource.php?id=${id}`);
        if (!res.ok) continue;
        const html = await res.text();
        const titleMatch = html.match(/<h[12][^>]*>([^<]+)<\/h[12]>/i);
        const title = titleMatch ? titleMatch[1].trim() : `TRIMS Resurs #${id}`;
        const grade = detectGrade(title) || detectGrade(html);
        const subject = detectCoreSubject(title) || detectCoreSubject(html);
        const pdfMatch = html.match(/href=["']([^"']*noduploads\/book\/[^"']+\.pdf)["']/i);

        if (!grade || !subject || !pdfMatch) {
          skipped++;
          continue;
        }

        const pdfUrl = `https://www.trims.edu.az/${pdfMatch[1].replace(/^\.\.\//, "")}`;
        const { error: upsertErr } = await supabase.from("textbooks").upsert(
          {
            title,
            grade,
            subject,
            is_core_subject: true,
            source_type: "trims_sync",
            source_url: pdfUrl,
            status: "pending",
            uploaded_by: user.id,
          },
          { onConflict: "grade,subject,title", ignoreDuplicates: true }
        );
        if (!upsertErr) queued++;
      }

      return new Response(
        JSON.stringify({ success: true, queued, skipped }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mode 2: Download & persist a single pending textbook into our own Storage
    if (mode === "sync_single" && textbookId) {
      const { data: book, error: bookErr } = await supabase
        .from("textbooks")
        .select("*")
        .eq("id", textbookId)
        .single();

      if (bookErr || !book || !book.source_url) {
        throw new Error("Dərslik və ya mənbə linki tapılmadı");
      }

      await supabase.from("textbooks").update({ status: "processing" }).eq("id", textbookId);

      const pdfRes = await fetch(book.source_url);
      if (!pdfRes.ok) {
        await supabase
          .from("textbooks")
          .update({ status: "failed", error_message: `HTTP ${pdfRes.status}` })
          .eq("id", textbookId);
        throw new Error(`TRİMS-dən endirilə bilmədi: HTTP ${pdfRes.status}`);
      }

      const pdfBytes = await pdfRes.arrayBuffer();
      const storagePath = `core/${book.grade}/${slugify(book.subject)}/${slugify(book.title)}.pdf`;

      const { error: upErr } = await supabase.storage
        .from("textbooks")
        .upload(storagePath, pdfBytes, { contentType: "application/pdf", upsert: true });

      if (upErr) {
        await supabase
          .from("textbooks")
          .update({ status: "failed", error_message: upErr.message })
          .eq("id", textbookId);
        throw upErr;
      }

      await supabase
        .from("textbooks")
        .update({ status: "ready", storage_path: storagePath, error_message: null })
        .eq("id", textbookId);

      return new Response(
        JSON.stringify({ success: true, storagePath }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "Yanlış rejim" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Naməlum xəta";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
