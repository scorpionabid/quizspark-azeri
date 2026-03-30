import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  CheckCircle2,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
  Trash2,
} from 'lucide-react';

interface ImportSummaryBarProps {
  validCount: number;
  invalidCount: number;
  totalCount: number;
  showStats: boolean;
  onToggleStats: () => void;
  onBulkEnhance?: () => void;
  isBulkEnhancing?: boolean;
  onCheckDuplicates?: () => void;
  isCheckingDuplicates?: boolean;
  onClearInvalid?: () => void;
}

export function ImportSummaryBar({
  validCount,
  invalidCount,
  totalCount,
  showStats,
  onToggleStats,
  onBulkEnhance,
  isBulkEnhancing,
  onCheckDuplicates,
  isCheckingDuplicates,
  onClearInvalid,
}: ImportSummaryBarProps) {
  return (
    <div className="flex items-center justify-between text-sm flex-wrap gap-2">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 text-emerald-500 font-medium">
          <CheckCircle2 className="h-4 w-4" />
          {validCount} hazır
        </span>
        {invalidCount > 0 && (
          <span className="flex items-center gap-1 text-amber-500 font-medium">
            <AlertTriangle className="h-4 w-4" />
            {invalidCount} natamam
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {invalidCount > 0 && onClearInvalid && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearInvalid}
            className="h-7 px-2 text-[10px] gap-1.5 bg-rose-500/5 text-rose-600 border-rose-500/20 hover:bg-rose-500/10 transition-all font-bold"
          >
            <Trash2 className="h-3 w-3" />
            Xətalıları sil
          </Button>
        )}
        {onBulkEnhance && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkEnhance}
            disabled={isBulkEnhancing || totalCount === 0}
            className="h-7 px-2 text-[10px] gap-1.5 bg-amber-500/5 text-amber-600 border-amber-500/20 hover:bg-amber-500/10 transition-all font-bold"
          >
            {isBulkEnhancing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
            Toplu Təkmilləşdir
          </Button>
        )}
        {onCheckDuplicates && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCheckDuplicates}
            disabled={isCheckingDuplicates || totalCount === 0}
            className="h-7 px-2 text-[10px] gap-1.5 bg-rose-500/5 text-rose-600 border-rose-500/20 hover:bg-rose-500/10 transition-all font-bold"
          >
            {isCheckingDuplicates ? <Loader2 className="h-3 w-3 animate-spin" /> : <AlertTriangle className="h-3 w-3" />}
            Dublikatları Yoxla
          </Button>
        )}
        <span className="text-muted-foreground">{totalCount} sual</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs gap-1 text-muted-foreground"
          onClick={onToggleStats}
        >
          <BarChart2 className="h-3.5 w-3.5" />
          Statistika
          {showStats ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </Button>
      </div>
    </div>
  );
}
