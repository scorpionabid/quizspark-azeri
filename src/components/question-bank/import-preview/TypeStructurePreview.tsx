import { PreviewQuestion } from '@/utils/parsers/types';

/** Tip-spesifik compact strukturlu məlumatları göstərir */
export function TypeStructurePreview({ q }: { q: PreviewQuestion }) {
  const qt = q.question_type;

  if (qt === 'matching' && q.matching_pairs) {
    const pairs = Array.isArray(q.matching_pairs)
      ? (q.matching_pairs as unknown as Array<{ left: string; right: string }>)
      : Object.entries(q.matching_pairs).map(([left, right]) => ({ left, right }));
    if (!pairs.length) return null;
    return (
      <div className="mt-1.5 flex flex-wrap gap-1">
        {pairs.slice(0, 3).map((p, i) => (
          <span key={i} className="text-[10px] bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800/40 px-1.5 py-0.5 rounded-md font-mono">
            {p.left} ↔ {p.right}
          </span>
        ))}
        {pairs.length > 3 && (
          <span className="text-[10px] text-muted-foreground">+{pairs.length - 3} cüt</span>
        )}
      </div>
    );
  }

  if (qt === 'ordering' && q.sequence_items?.length) {
    return (
      <div className="mt-1.5 flex flex-wrap gap-1">
        {q.sequence_items.slice(0, 3).map((item, i) => (
          <span key={i} className="text-[10px] bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 px-1.5 py-0.5 rounded-md">
            {i + 1}. {item.length > 20 ? item.slice(0, 20) + '…' : item}
          </span>
        ))}
        {q.sequence_items.length > 3 && (
          <span className="text-[10px] text-muted-foreground">+{q.sequence_items.length - 3} element</span>
        )}
      </div>
    );
  }

  if (qt === 'numerical') {
    const ans = q.numerical_answer ?? (q.correct_answer ? parseFloat(q.correct_answer) : null);
    if (ans == null) return null;
    return (
      <div className="mt-1 text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
        = {ans}{(q.numerical_tolerance ?? 0) > 0 ? ` ±${q.numerical_tolerance}` : ''}
      </div>
    );
  }

  if (qt === 'fill_blank') {
    const tmpl = q.fill_blank_template || q.question_text || '';
    const blanks = (tmpl.match(/___+/g) || []).length;
    if (!blanks) return null;
    return (
      <div className="mt-1 text-[10px] text-amber-700 dark:text-amber-400">
        {blanks} boşluq · cavab: <span className="font-mono">{(q.correct_answer || '').replace('|', ' / ')}</span>
      </div>
    );
  }

  if (qt === 'code') {
    const lang = q.hint?.startsWith('lang:') ? q.hint.slice(5) : null;
    const snippet = q.fill_blank_template;
    if (!lang && !snippet) return null;
    return (
      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-neutral-500">
        {lang && <span className="font-mono bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border">{lang}</span>}
        {snippet && <span className="italic truncate max-w-[160px]">{snippet.split('\n')[0]}</span>}
      </div>
    );
  }

  return null;
}
