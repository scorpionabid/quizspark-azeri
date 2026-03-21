import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { DIFFICULTY_COLORS, TYPE_LABELS } from './constants';
import { PreviewStats } from './utils';

interface ImportStatsPanelProps {
  visible: boolean;
  stats: PreviewStats;
  totalQuestions: number;
}

export function ImportStatsPanel({ visible, stats, totalQuestions }: ImportStatsPanelProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-3 gap-3 p-3 bg-muted/40 rounded-lg border border-border/50 text-xs">
            {/* Kateqoriyalar */}
            <div>
              <p className="font-medium text-muted-foreground mb-1.5">Kateqoriyalar</p>
              <div className="space-y-1">
                {stats.topCategories.map(([cat, count]) => (
                  <div key={cat} className="flex justify-between gap-2">
                    <span className="truncate text-foreground/80">{cat}</span>
                    <span className="font-mono text-muted-foreground shrink-0">{count}</span>
                  </div>
                ))}
                {Object.keys(stats.categoryMap).length > 5 && (
                  <span className="text-muted-foreground">
                    +{Object.keys(stats.categoryMap).length - 5} daha
                  </span>
                )}
              </div>
            </div>

            {/* Çətinlik */}
            <div>
              <p className="font-medium text-muted-foreground mb-1.5">Çətinlik</p>
              <div className="space-y-1">
                {Object.entries(stats.diffMap).map(([diff, count]) => (
                  <div key={diff} className="flex justify-between gap-2">
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 h-4 ${DIFFICULTY_COLORS[diff] ?? ''}`}
                    >
                      {diff}
                    </Badge>
                    <span className="font-mono text-muted-foreground">
                      {Math.round((count / totalQuestions) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sual tipi */}
            <div>
              <p className="font-medium text-muted-foreground mb-1.5">Sual tipi</p>
              <div className="space-y-1">
                {Object.entries(stats.typeMap).map(([type, count]) => (
                  <div key={type} className="flex justify-between gap-2">
                    <span className="truncate text-foreground/80">
                      {TYPE_LABELS[type] ?? type}
                    </span>
                    <span className="font-mono text-muted-foreground shrink-0">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
