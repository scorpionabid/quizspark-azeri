/**
 * TRİMS (trims.edu.az) -> Supabase Dərslik Sinxronizasiya Skripti
 *
 * 10 əsas fənn üzrə (1-11-ci siniflər) rəsmi dərslik PDF-lərini
 * trims.edu.az-dan endirib öz Supabase Storage ("textbooks" bucket)
 * və verilənlər bazamıza yazır. Beləliklə trims.edu.az işləməsə belə
 * platforma tam müstəqil işləyir.
 *
 * İstifadə:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/sync-trims-core.mjs
 */

import { createClient } from '@supabase/supabase-js';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Xəta: SUPABASE_URL və SUPABASE_SERVICE_ROLE_KEY mühit dəyişənləri tələb olunur.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const CORE_SUBJECTS = [
  'Azərbaycan dili',
  'Riyaziyyat',
  'İngilis dili',
  'Ədəbiyyat',
  'Tarix',
  'Coğrafiya',
  'Fizika',
  'Kimya',
  'Biologiya',
  'İnformatika',
];

const TRIMS_BASE = 'https://www.trims.edu.az/site/';

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/ə/g, 'e')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ğ/g, 'g')
    .replace(/ç/g, 'c')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function detectGrade(text) {
  const match = text.match(/(\d{1,2})\s*-?\s*(?:ci|cu|cü|cı)?\s*sinif/i);
  if (!match) return null;
  const g = parseInt(match[1], 10);
  return g >= 1 && g <= 11 ? g : null;
}

function detectCoreSubject(text) {
  const lower = text.toLowerCase();
  for (const subj of CORE_SUBJECTS) {
    if (lower.includes(subj.toLowerCase())) return subj;
  }
  if (lower.includes('azərbaycan tarixi') || lower.includes('ümumi tarix')) {
    return 'Tarix';
  }
  return null;
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'QuizPlatform-TextbookSync/1.0' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function scanTrimsCatalog() {
  const resourceIds = new Set();
  // Scan first 10 pages of Dərslik category (c-1)
  for (let page = 1; page <= 10; page++) {
    const url = `${TRIMS_BASE}search.php?search=ok&category_id=c-1&page=${page}`;
    try {
      const html = await fetchText(url);
      const matches = [...html.matchAll(/resource\.php\?id=(\d+)/g)];
      if (matches.length === 0) break;
      for (const m of matches) resourceIds.add(m[1]);
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.warn(`Səhifə ${page} oxunarkən xəta:`, err.message);
      break;
    }
  }
  return [...resourceIds];
}

async function processResource(id) {
  const resourceUrl = `${TRIMS_BASE}resource.php?id=${id}`;
  const html = await fetchText(resourceUrl);

  const titleMatch = html.match(/<h[12][^>]*>([^<]+)<\/h[12]>/i);
  const title = titleMatch ? titleMatch[1].trim() : `TRIMS Resurs #${id}`;

  const grade = detectGrade(title) || detectGrade(html);
  const subject = detectCoreSubject(title) || detectCoreSubject(html);

  if (!grade || !subject) {
    return { skipped: true, reason: 'Sinif və ya 10 əsas fənn uyğun gəlmədi', title };
  }

  const pdfMatch = html.match(/href=["']([^"']*noduploads\/book\/[^"']+\.pdf)["']/i);
  if (!pdfMatch) {
    return { skipped: true, reason: 'PDF linki tapılmadı', title };
  }

  const pdfRelative = pdfMatch[1].replace(/^\.\.\//, '');
  const pdfUrl = `https://www.trims.edu.az/${pdfRelative}`;

  // Check if already synced
  const { data: existing } = await supabase
    .from('textbooks')
    .select('id, status')
    .eq('grade', grade)
    .eq('subject', subject)
    .eq('title', title)
    .maybeSingle();

  if (existing?.status === 'ready') {
    return { skipped: true, reason: 'Artıq bazada mövcuddur', title };
  }

  console.log(`Endirilir: [${grade}-ci sinif | ${subject}] ${title}`);
  const pdfRes = await fetch(pdfUrl);
  if (!pdfRes.ok) throw new Error(`PDF endirilə bilmədi: HTTP ${pdfRes.status}`);
  const arrayBuffer = await pdfRes.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const storagePath = `core/${grade}/${slugify(subject)}/${slugify(title)}-${id}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from('textbooks')
    .upload(storagePath, buffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data: bookRow, error: dbError } = await supabase
    .from('textbooks')
    .upsert(
      {
        title,
        grade,
        subject,
        is_core_subject: true,
        source_type: 'trims_sync',
        source_url: pdfUrl,
        storage_path: storagePath,
        status: 'ready',
      },
      { onConflict: 'grade,subject,title' }
    )
    .select('id')
    .single();

  if (dbError) throw dbError;

  // Extract PDF text & topics into curriculum_topics and textbook_chunks
  if (bookRow?.id) {
    try {
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      await supabase.from('textbooks').update({ page_count: pdf.numPages }).eq('id', bookRow.id);

      const headingRe = /^(?:§\s*\d+|BÖLMƏ\s+\d+|FƏSİL\s+\d+|MÖVZU\s+\d+|\d+\.\d+\.?\s+[A-ZƏÜÖĞÇŞI])/i;
      let currentUnit = 'Ümumi bölmə';
      let currentTopic = { unitName: currentUnit, topicName: `${title} — Əsas mövzular`, pageStart: 1, pageEnd: 1, chunks: [] };
      const extractedTopics = [];

      for (let p = 1; p <= Math.min(pdf.numPages, 250); p++) {
        const page = await pdf.getPage(p);
        const tc = await page.getTextContent();
        const lines = tc.items.map((it) => ('str' in it ? it.str.trim() : '')).filter(Boolean);
        const pageText = lines.join(' ').replace(/\s+/g, ' ').trim();
        if (!pageText) continue;

        for (const line of lines) {
          if (line.length > 6 && line.length < 110 && headingRe.test(line)) {
            if (/^(?:BÖLMƏ|FƏSİL)/i.test(line)) {
              currentUnit = line;
            } else {
              if (currentTopic.chunks.length > 0) extractedTopics.push(currentTopic);
              currentTopic = { unitName: currentUnit, topicName: line, pageStart: p, pageEnd: p, chunks: [] };
            }
          }
        }
        currentTopic.pageEnd = p;
        for (let i = 0; i < pageText.length; i += 1500) {
          currentTopic.chunks.push({ content: pageText.slice(i, i + 1500), pageNumber: p });
        }
      }
      if (currentTopic.chunks.length > 0) extractedTopics.push(currentTopic);

      let chunkIdx = 0;
      for (let tIdx = 0; tIdx < extractedTopics.length; tIdx++) {
        const t = extractedTopics[tIdx];
        const { data: topicRow } = await supabase
          .from('curriculum_topics')
          .insert({
            textbook_id: bookRow.id,
            grade,
            subject,
            unit_name: t.unitName,
            topic_name: t.topicName,
            order_index: tIdx,
            page_start: t.pageStart,
            page_end: t.pageEnd,
          })
          .select('id')
          .single();

        if (topicRow && t.chunks.length > 0) {
          await supabase.from('textbook_chunks').insert(
            t.chunks.slice(0, 15).map((c) => ({
              textbook_id: bookRow.id,
              topic_id: topicRow.id,
              content: c.content,
              page_number: c.pageNumber,
              chunk_index: chunkIdx++,
            }))
          );
        }
      }
    } catch (parseErr) {
      console.warn(`PDF mətn çıxarılması atlandı (${title}):`, parseErr.message);
    }
  }

  return { synced: true, title, grade, subject };
}

async function main() {
  console.log('TRİMS kataloqu skan edilir...');
  const ids = await scanTrimsCatalog();
  console.log(`Cəmi ${ids.length} resurs tapıldı. 10 əsas fənn üzrə emal başlayır...`);

  let synced = 0;
  let skipped = 0;
  for (const id of ids) {
    try {
      const result = await processResource(id);
      if (result.synced) synced++;
      else skipped++;
      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      console.error(`Resurs #${id} xətası:`, err.message);
    }
  }
  console.log(`Tamamlandı! Yüklənən: ${synced}, Keçilən: ${skipped}`);
}

main().catch((err) => {
  console.error('Kritik xəta:', err);
  process.exit(1);
});
