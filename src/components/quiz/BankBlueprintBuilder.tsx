import { Database, Sparkles, AlertTriangle, CheckCircle2, Hash, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BankTopicStats, TopicBlueprintSlot } from '@/utils/examBlueprint';

interface BankTopicPickerProps {
  subject: string;
  grade: number;
  topicStats: BankTopicStats[];
  isLoading: boolean;
  includeUntagged: boolean;
  onToggleIncludeUntagged: (val: boolean) => void;
  selectedSlots: TopicBlueprintSlot[];
  onToggleTopic: (stat: BankTopicStats) => void;
  onSelectAllTopics: () => void;
}

export function BankTopicPicker({
  subject,
  grade,
  topicStats,
  isLoading,
  includeUntagged,
  onToggleIncludeUntagged,
  selectedSlots,
  onToggleTopic,
  onSelectAllTopics,
}: BankTopicPickerProps) {
  const selectedTopicsSet = new Set(selectedSlots.map((s) => s.topic));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-academic-line bg-academic-surface/60 p-3.5">
        <div className="flex items-start gap-2.5">
          <Database className="h-4 w-4 text-academic-accent mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-academic-ink">
              Sual Bankı Mövzuları — {grade}-ci sinif · {subject}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              İmtahana daxil ediləcək mövzuları seçin. Növbəti addımda hər mövzudan neçə sual və neçə bal olacağını təyin edəcəksiniz.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs cursor-pointer text-muted-foreground">
            <Checkbox
              checked={includeUntagged}
              onCheckedChange={(c) => onToggleIncludeUntagged(Boolean(c))}
            />
            <span>Bütün bank mövzularını göstər</span>
          </label>
          {topicStats.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSelectAllTopics}
              className="h-7 text-xs"
            >
              Hamısını seç ({topicStats.length})
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <p className="text-xs text-muted-foreground py-4 text-center">
          Sual bankı mövzuları yüklənir...
        </p>
      ) : topicStats.length === 0 ? (
        <div className="rounded-xl border border-dashed border-academic-line p-6 text-center space-y-2">
          <p className="text-sm font-medium text-foreground">
            {grade}-ci sinif {subject} üzrə Sual Bankında mövzu tapılmadı.
          </p>
          <p className="text-xs text-muted-foreground">
            Yuxarıda &ldquo;Bütün bank mövzularını göstər&rdquo; seçimini aktivləşdirə, Sual Bankına `.md` fayl yükləyə və ya &ldquo;AI Generasiya&rdquo; rejiminə keçə bilərsiniz.
          </p>
        </div>
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {topicStats.map((stat) => {
            const isSelected = selectedTopicsSet.has(stat.topic);
            return (
              <div
                key={stat.topic}
                onClick={() => onToggleTopic(stat)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onToggleTopic(stat);
                  }
                }}
                className={`cursor-pointer rounded-xl border p-3 transition-colors space-y-2 ${
                  isSelected
                    ? 'border-academic-accent bg-academic-soft/50 ring-1 ring-academic-accent/30'
                    : 'border-academic-line bg-card hover:border-academic-accent/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleTopic(stat)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-0.5 shrink-0"
                    />
                    <span className="text-sm font-semibold text-foreground leading-snug break-words">
                      {stat.topic}
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="shrink-0 text-[11px] font-bold tabular-nums bg-academic-soft text-academic-accent"
                  >
                    {stat.count} sual
                  </Badge>
                </div>

                {/* Level breakdown & standards */}
                <div className="flex flex-wrap items-center gap-1.5 pl-6 text-[11px] tabular-nums">
                  {(['I', 'II', 'III', 'IV'] as const).map((lvl) =>
                    stat.levelCounts[lvl] > 0 ? (
                      <span
                        key={lvl}
                        className="rounded bg-background/80 border border-academic-line px-1.5 py-0.5 text-muted-foreground"
                      >
                        {lvl}: <strong className="text-foreground">{stat.levelCounts[lvl]}</strong>
                      </span>
                    ) : null
                  )}
                  {stat.standards.slice(0, 2).map((std) => (
                    <span
                      key={std}
                      className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                    >
                      <Hash className="h-2.5 w-2.5" />
                      {std}
                    </span>
                  ))}
                  {stat.standards.length > 2 && (
                    <span className="text-[10px] text-muted-foreground">
                      +{stat.standards.length - 2}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface BankBlueprintMatrixProps {
  sourceMode: 'bank' | 'hybrid';
  slots: TopicBlueprintSlot[];
  topicStatsMap: Map<string, BankTopicStats>;
  onUpdateSlot: (topic: string, updater: (slot: TopicBlueprintSlot) => TopicBlueprintSlot) => void;
  onRemoveSlot: (topic: string) => void;
  onNormalizeBlueprintTo100: () => void;
}

export function BankBlueprintMatrix({
  sourceMode,
  slots,
  topicStatsMap,
  onUpdateSlot,
  onRemoveSlot,
  onNormalizeBlueprintTo100,
}: BankBlueprintMatrixProps) {
  const totalQuestions = slots.reduce((s, slot) => s + slot.count, 0);
  const totalPoints = slots.reduce((s, slot) => {
    const stat = topicStatsMap.get(slot.topic);
    const unitPts = slot.useBankWeight ? (stat?.avgWeight ?? slot.pointsPerQuestion) : slot.pointsPerQuestion;
    return s + Math.round(slot.count * unitPts);
  }, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-bold text-academic-ink">
            Mövzu-Bal Blueprint Matrisi
          </h3>
          <p className="text-xs text-muted-foreground">
            Hər mövzudan neçə sual götürüləcəyini, çətinlik paylanmasını və hər sualın balını təyin edin.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onNormalizeBlueprintTo100}
          disabled={totalQuestions === 0}
          className="h-8 gap-1.5 text-xs border-academic-line"
        >
          <Calculator className="h-3.5 w-3.5 text-academic-accent" />
          100 bala böl
        </Button>
      </div>

      {slots.length === 0 ? (
        <div className="rounded-xl border border-dashed border-academic-line p-6 text-center text-sm text-muted-foreground">
          Heç bir mövzu seçilməyib. Zəhmət olmasa 2-ci addıma qayıdıb mövzu seçin.
        </div>
      ) : (
        <div className="space-y-2.5">
          {slots.map((slot) => {
            const stat = topicStatsMap.get(slot.topic);
            const available = stat?.count ?? 0;
            const shortage = Math.max(0, slot.count - available);
            const estUnit = slot.useBankWeight
              ? (stat?.avgWeight ?? slot.pointsPerQuestion)
              : slot.pointsPerQuestion;
            const rowPoints = Math.round(slot.count * estUnit);

            return (
              <div
                key={slot.topic}
                className="rounded-xl border border-academic-line bg-card p-3.5 space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <span className="font-semibold text-sm text-foreground">{slot.topic}</span>
                    <Badge variant="secondary" className="text-[11px] tabular-nums">
                      Bazada: {available} sual
                    </Badge>
                    {shortage > 0 && (
                      <Badge
                        variant="outline"
                        className={`text-[11px] gap-1 ${
                          sourceMode === 'hybrid'
                            ? 'border-academic-accent/40 bg-academic-soft text-academic-accent'
                            : 'border-amber-400 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                        }`}
                      >
                        {sourceMode === 'hybrid' ? (
                          <>
                            <Sparkles className="h-3 w-3" /> +{shortage} AI tamamlayacaq
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-3 w-3" /> Max {available} mövcuddur
                          </>
                        )}
                      </Badge>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveSlot(slot.topic)}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    Çıxar
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 items-center">
                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-1">Sual sayı</span>
                    <Input
                      type="number"
                      min={1}
                      max={50}
                      value={slot.count}
                      onChange={(e) =>
                        onUpdateSlot(slot.topic, (s) => ({
                          ...s,
                          count: Math.max(1, Math.min(50, Number(e.target.value) || 1)),
                        }))
                      }
                      className="h-8 text-xs text-center tabular-nums"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-1">Səviyyə / Çətinlik</span>
                    <Select
                      value={slot.difficultyFilter}
                      onValueChange={(v) =>
                        onUpdateSlot(slot.topic, (s) => ({
                          ...s,
                          difficultyFilter: v as TopicBlueprintSlot['difficultyFilter'],
                        }))
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanced" className="text-xs">Balanslı (I–IV)</SelectItem>
                        <SelectItem value="all" className="text-xs">Hamısı (Qarışıq)</SelectItem>
                        <SelectItem value="I" className="text-xs">Yalnız I səviyyə</SelectItem>
                        <SelectItem value="II" className="text-xs">Yalnız II səviyyə</SelectItem>
                        <SelectItem value="III" className="text-xs">Yalnız III səviyyə</SelectItem>
                        <SelectItem value="IV" className="text-xs">Yalnız IV səviyyə</SelectItem>
                        <SelectItem value="asan" className="text-xs">Asan</SelectItem>
                        <SelectItem value="orta" className="text-xs">Orta</SelectItem>
                        <SelectItem value="çətin" className="text-xs">Çətin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-1">Hər suala bal</span>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      disabled={slot.useBankWeight}
                      value={slot.pointsPerQuestion}
                      onChange={(e) =>
                        onUpdateSlot(slot.topic, (s) => ({
                          ...s,
                          pointsPerQuestion: Math.max(1, Math.min(100, Number(e.target.value) || 1)),
                        }))
                      }
                      className="h-8 text-xs text-center tabular-nums"
                    />
                  </div>

                  <div className="pt-4">
                    <label className="flex items-center gap-1.5 text-xs cursor-pointer text-muted-foreground">
                      <Checkbox
                        checked={slot.useBankWeight}
                        onCheckedChange={(c) =>
                          onUpdateSlot(slot.topic, (s) => ({ ...s, useBankWeight: Boolean(c) }))
                        }
                      />
                      <span>Öz balını saxla</span>
                    </label>
                  </div>

                  <div className="text-right pt-3 tabular-nums">
                    <span className="text-xs text-muted-foreground block">Mövzu cəmi</span>
                    <span className="text-sm font-bold text-academic-ink">
                      {slot.useBankWeight ? `~${rowPoints}` : rowPoints} bal
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Live Blueprint Total Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-academic-line bg-academic-surface px-4 py-3 text-sm font-semibold tabular-nums">
        <span>Cəmi seçilən: {totalQuestions} sual ({slots.length} mövzu)</span>
        <span
          className={`inline-flex items-center gap-1.5 ${
            totalPoints === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-academic-accent'
          }`}
        >
          {totalPoints === 100 && <CheckCircle2 className="h-4 w-4" />}
          Təxmini cəmi bal: {totalPoints} bal
        </span>
      </div>
    </div>
  );
}
