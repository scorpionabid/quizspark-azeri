import { QuestionBankItem } from '@/hooks/useQuestionBank';
import { PreviewQuestion } from '@/utils/parsers/types';

// ─── File download ───────────────────────────────────────────────────────────

export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── CSV helpers ─────────────────────────────────────────────────────────────

export function escapeCsvValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n'))
    return `"${value.replace(/"/g, '""')}"`;
  return value;
}

// ─── Import formatting ───────────────────────────────────────────────────────

export function formatQuestionsForImport(
  preview: PreviewQuestion[],
): Omit<QuestionBankItem, 'id' | 'created_at' | 'updated_at'>[] {
  return preview.map((q) => ({
    question_text: q.question_text,
    question_type: q.question_type,
    options: q.options,
    correct_answer: q.correct_answer,
    explanation: q.explanation ?? null,
    category: q.category ?? null,
    difficulty: q.difficulty ?? null,
    bloom_level: q.bloom_level ?? null,
    tags: q.tags ?? null,
    title: q.title ?? null,
    user_id: null,
    source_document_id: null,
    question_image_url: q.question_image_url ?? null,
    option_images: q.option_images ?? null,
    media_type: null as 'image' | 'audio' | 'video' | null,
    media_url: null,
    weight: q.weight ?? null,
    hint: q.hint ?? null,
    time_limit: null,
    per_option_explanations: q.per_option_explanations ?? null,
    video_url: null,
    video_start_time: null,
    video_end_time: null,
    model_3d_url: null,
    model_3d_type: null,
    hotspot_data: null,
    matching_pairs: q.matching_pairs ?? null,
    sequence_items: q.sequence_items ?? null,
    fill_blank_template: q.fill_blank_template ?? null,
    numerical_answer: q.numerical_answer ?? null,
    numerical_tolerance: q.numerical_tolerance ?? null,
    correct_option_indices:
      q.question_type === 'multiple_select' && Array.isArray(q.options) && q.correct_answer
        ? q.correct_answer.split(',').reduce<number[]>((acc, ca) => {
            const idx = (q.options as string[]).findIndex(
              (opt) => opt.trim() === ca.trim(),
            );
            if (idx >= 0) acc.push(idx);
            return acc;
          }, [])
        : null,
    feedback_enabled: null,
    quality_score: null,
    usage_count: null,
  }));
}
