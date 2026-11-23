import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CORE_SUBJECTS } from '@/lib/constants/subjects';
import { extractPdfTopicsAndChunks } from '@/utils/pdfTextExtractor';

export interface TextbookRecord {
  id: string;
  title: string;
  grade: number;
  subject: string;
  is_core_subject: boolean;
  source_type: string;
  source_url: string | null;
  storage_path: string | null;
  status: string;
  error_message: string | null;
  page_count: number | null;
  created_at: string;
}

export interface CurriculumTopicRecord {
  id: string;
  textbook_id: string | null;
  grade: number;
  subject: string;
  unit_name: string;
  topic_name: string;
  semester: number | null;
  order_index: number;
  page_start: number | null;
  page_end: number | null;
}

export function useTextbooks(grade?: number, subject?: string) {
  return useQuery({
    queryKey: ['textbooks', grade ?? 'all', subject ?? 'all'],
    queryFn: async () => {
      let query = supabase
        .from('textbooks')
        .select('*')
        .order('grade', { ascending: true })
        .order('subject', { ascending: true });

      if (grade) query = query.eq('grade', grade);
      if (subject) query = query.eq('subject', subject);

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as TextbookRecord[];
    },
  });
}

export function useCurriculumTopics(grade?: number, subject?: string) {
  return useQuery({
    queryKey: ['curriculum-topics', grade ?? 'none', subject ?? 'none'],
    enabled: Boolean(grade && subject),
    queryFn: async () => {
      if (!grade || !subject) return [];
      const { data, error } = await supabase
        .from('curriculum_topics')
        .select('*')
        .eq('grade', grade)
        .eq('subject', subject)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return (data ?? []) as CurriculumTopicRecord[];
    },
  });
}

export function useUploadTextbookPdf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      file: File;
      grade: number;
      subject: string;
      title: string;
      sourceType: 'teacher_upload' | 'admin_upload';
      topics?: { unit_name: string; topic_name: string; semester?: number | null }[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Giriş tələb olunur');

      const safeName = params.file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `manual/${params.grade}/${Date.now()}-${safeName}`;

      const { error: uploadErr } = await supabase.storage
        .from('textbooks')
        .upload(storagePath, params.file, {
          contentType: params.file.type || 'application/pdf',
          upsert: true,
        });

      if (uploadErr) throw uploadErr;

      const isCore = (CORE_SUBJECTS as readonly string[]).includes(params.subject);

      // Extract topics & text chunks from the PDF
      let extractedPageCount: number | null = null;
      let extractedTopics: Awaited<ReturnType<typeof extractPdfTopicsAndChunks>>['topics'] = [];
      try {
        const extracted = await extractPdfTopicsAndChunks(params.file);
        extractedPageCount = extracted.pageCount;
        extractedTopics = extracted.topics;
      } catch {
        // Non-fatal: still save the textbook PDF even if text extraction fails (e.g. scanned PDF)
      }

      const { data: book, error: bookErr } = await supabase
        .from('textbooks')
        .upsert(
          {
            title: params.title.trim(),
            grade: params.grade,
            subject: params.subject,
            is_core_subject: isCore,
            source_type: params.sourceType,
            storage_path: storagePath,
            page_count: extractedPageCount,
            status: 'ready',
            uploaded_by: user.id,
          },
          { onConflict: 'grade,subject,title' }
        )
        .select()
        .single();

      if (bookErr) throw bookErr;

      if (book && extractedTopics.length > 0) {
        let chunkIdx = 0;
        for (let tIdx = 0; tIdx < extractedTopics.length; tIdx++) {
          const t = extractedTopics[tIdx];
          const { data: topicRow } = await supabase
            .from('curriculum_topics')
            .insert({
              textbook_id: book.id,
              grade: params.grade,
              subject: params.subject,
              unit_name: t.unitName,
              topic_name: t.topicName,
              order_index: tIdx,
              page_start: t.pageStart,
              page_end: t.pageEnd,
            })
            .select('id')
            .single();

          if (topicRow && t.chunks.length > 0) {
            const chunkRows = t.chunks.slice(0, 15).map((c) => ({
              textbook_id: book.id,
              topic_id: topicRow.id,
              content: c.content,
              page_number: c.pageNumber,
              chunk_index: chunkIdx++,
            }));
            await supabase.from('textbook_chunks').insert(chunkRows);
          }
        }
      } else if (params.topics && params.topics.length > 0 && book) {
        const topicRows = params.topics.map((t, idx) => ({
          textbook_id: book.id,
          grade: params.grade,
          subject: params.subject,
          unit_name: t.unit_name || 'Ümumi bölmə',
          topic_name: t.topic_name,
          semester: t.semester ?? null,
          order_index: idx,
        }));
        await supabase.from('curriculum_topics').insert(topicRows);
      }

      return book as TextbookRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['textbooks'] });
      queryClient.invalidateQueries({ queryKey: ['curriculum-topics'] });
    },
  });
}

export function useAddCurriculumTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      grade: number;
      subject: string;
      unit_name: string;
      topic_name: string;
      semester?: number | null;
      textbook_id?: string | null;
    }) => {
      const { data, error } = await supabase
        .from('curriculum_topics')
        .insert({
          grade: payload.grade,
          subject: payload.subject,
          unit_name: payload.unit_name || 'Ümumi bölmə',
          topic_name: payload.topic_name.trim(),
          semester: payload.semester ?? null,
          textbook_id: payload.textbook_id ?? null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as CurriculumTopicRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculum-topics'] });
    },
  });
}

export function useSyncTrims() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { mode: 'catalog_core' | 'sync_single'; textbookId?: string; maxPages?: number }) => {
      const { data, error } = await supabase.functions.invoke('sync-trims', {
        body: payload,
      });
      if (error) {
        // Extract detailed JSON error from FunctionsHttpError if available
        let detailedMsg = error.message;
        try {
          const ctx = (error as { context?: Response }).context;
          if (ctx) {
            const body = await ctx.json();
            if (body?.error) detailedMsg = body.error;
          }
        } catch {
          // ignore parse errors
        }
        throw new Error(detailedMsg);
      }
      return data as { success: boolean; queued?: number; skipped?: number; storagePath?: string };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['textbooks'] });
    },
  });
}
