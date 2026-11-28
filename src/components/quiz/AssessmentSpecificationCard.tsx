import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { getQuestionTypeLabelAz, normalizeDifficultyLevel } from '@/utils/assessmentSpec';

export interface SpecificationQuestionItem {
  question_type?: string | null;
  weight?: number | null;
  difficulty?: string | null;
  level?: string | null;
  subjectLabel?: string | null;
}

export interface AssessmentSpecificationCardProps {
  questions: SpecificationQuestionItem[];
  title?: string;
  subtitle?: string;
  variant?: 'screen' | 'print';
  className?: string;
}

const LEVEL_ORDER = ['I', 'II', 'III', 'IV'] as const;

const LEVEL_LABELS: Record<string, string> = {
  I: 'I səviyyə (Asan)',
  II: 'II səviyyə (Orta)',
  III: 'III səviyyə (Yüksək)',
  IV: 'IV səviyyə (Çətin)',
};

const SEGMENT_OPACITIES = [0.4, 0.6, 0.8, 1];

interface SpecRow {
  key: string;
  label: string;
  count: number;
  points: number;
  percentage: number;
}

export function AssessmentSpecificationCard({
  questions,
  title = 'Spesifikasiya cədvəli',
  subtitle,
  variant = 'screen',
  className,
}: AssessmentSpecificationCardProps) {
  const { rows, totalCount, totalPoints, groupMode } = useMemo(() => {
    const total = questions.length;
    const ptsTotal = questions.reduce((sum, q) => sum + (q.weight ?? 10), 0);

    const hasExplicitLevels = questions.some(
      (q) => normalizeDifficultyLevel(q.level ?? q.difficulty) !== null
    );

    if (hasExplicitLevels) {
      const map = new Map<string, { count: number; points: number }>();
      for (const lvl of LEVEL_ORDER) {
        map.set(lvl, { count: 0, points: 0 });
      }
      for (const q of questions) {
        const lvl = normalizeDifficultyLevel(q.level ?? q.difficulty) ?? 'II';
        const cur = map.get(lvl) ?? { count: 0, points: 0 };
        cur.count += 1;
        cur.points += q.weight ?? 10;
        map.set(lvl, cur);
      }

      const builtRows: SpecRow[] = LEVEL_ORDER.filter((lvl) => (map.get(lvl)?.count ?? 0) > 0).map(
        (lvl) => {
          const item = map.get(lvl)!;
          return {
            key: lvl,
            label: LEVEL_LABELS[lvl],
            count: item.count,
            points: item.points,
            percentage: ptsTotal > 0 ? Math.round((item.points / ptsTotal) * 100) : 0,
          };
        }
      );

      return {
        rows: builtRows,
        totalCount: total,
        totalPoints: ptsTotal,
        groupMode: 'level' as const,
      };
    }

    // Fallback: group by question type so breakdown always reflects real exam data
    const typeMap = new Map<string, { count: number; points: number }>();
    for (const q of questions) {
      const key = q.question_type || 'multiple_choice';
      const cur = typeMap.get(key) ?? { count: 0, points: 0 };
      cur.count += 1;
      cur.points += q.weight ?? 10;
      typeMap.set(key, cur);
    }

    const builtRows: SpecRow[] = Array.from(typeMap.entries()).map(([key, item]) => ({
      key,
      label: getQuestionTypeLabelAz(key),
      count: item.count,
      points: item.points,
      percentage: ptsTotal > 0 ? Math.round((item.points / ptsTotal) * 100) : 0,
    }));

    return {
      rows: builtRows,
      totalCount: total,
      totalPoints: ptsTotal,
      groupMode: 'type' as const,
    };
  }, [questions]);

  if (questions.length === 0) return null;

  const isPrint = variant === 'print';

  return (
    <section
      aria-label={title}
      className={cn(
        isPrint
          ? 'break-inside-avoid rounded-lg border border-gray-300 bg-white p-4 text-black'
          : 'academic-card p-5',
        className
      )}
    >
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3
            className={cn(
              'font-display text-sm font-bold tracking-tight',
              isPrint ? 'text-black uppercase' : 'text-academic-ink'
            )}
          >
            {title}
          </h3>
          {subtitle && (
            <p className={cn('text-xs mt-0.5', isPrint ? 'text-gray-600' : 'text-muted-foreground')}>
              {subtitle}
            </p>
          )}
        </div>
        <span
          className={cn(
            'text-xs font-medium tabular-nums',
            isPrint ? 'text-gray-700' : 'text-muted-foreground'
          )}
        >
          {totalCount} sual · {totalPoints} bal
        </span>
      </div>

      {/* Stepped monochrome proportional specification bar */}
      <div
        className="mb-4 flex h-2.5 w-full gap-[3px] overflow-hidden rounded-full"
        role="img"
        aria-label="İmtahan bal bölgüsü diaqramı"
      >
        {rows.map((row, idx) => {
          const opacity = SEGMENT_OPACITIES[idx % SEGMENT_OPACITIES.length];
          return (
            <div
              key={row.key}
              title={`${row.label}: ${row.count} sual (${row.points} bal, ${row.percentage}%)`}
              style={{
                flexGrow: Math.max(row.points, 1),
                opacity,
                backgroundColor: isPrint ? '#0f5d4a' : undefined,
              }}
              className={cn(
                'h-full first:rounded-l-full last:rounded-r-full transition-all',
                !isPrint && 'bg-academic-accent'
              )}
            />
          );
        })}
      </div>

      {/* Hairline breakdown table with tabular numerals */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr
              className={cn(
                'border-b text-left',
                isPrint
                  ? 'border-gray-400 text-gray-700'
                  : 'border-academic-line text-muted-foreground'
              )}
            >
              <th className="py-1.5 pr-3 font-semibold">
                {groupMode === 'level' ? 'Səviyyə' : 'Sual tipi'}
              </th>
              <th className="py-1.5 px-2 text-right font-semibold">Sual</th>
              <th className="py-1.5 px-2 text-right font-semibold">Bal</th>
              <th className="py-1.5 pl-2 text-right font-semibold">Pay</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {rows.map((row, idx) => {
              const opacity = SEGMENT_OPACITIES[idx % SEGMENT_OPACITIES.length];
              return (
                <tr
                  key={row.key}
                  className={cn(
                    'border-b last:border-b-0',
                    isPrint ? 'border-gray-200' : 'border-academic-line/70'
                  )}
                >
                  <td className="py-1.5 pr-3 font-medium">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={cn(
                          'inline-block h-2.5 w-2.5 rounded-sm shrink-0',
                          !isPrint && 'bg-academic-accent'
                        )}
                        style={{
                          opacity,
                          backgroundColor: isPrint ? '#0f5d4a' : undefined,
                        }}
                      />
                      <span>{row.label}</span>
                    </span>
                  </td>
                  <td className="py-1.5 px-2 text-right">{row.count}</td>
                  <td className="py-1.5 px-2 text-right font-medium">{row.points}</td>
                  <td className="py-1.5 pl-2 text-right text-muted-foreground">
                    {row.percentage}%
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr
              className={cn(
                'border-t font-bold tabular-nums',
                isPrint
                  ? 'border-black text-black'
                  : 'border-academic-line text-academic-ink'
              )}
            >
              <td className="pt-2 pr-3">Cəmi</td>
              <td className="pt-2 px-2 text-right">{totalCount}</td>
              <td className="pt-2 px-2 text-right">{totalPoints}</td>
              <td className="pt-2 pl-2 text-right">100%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
