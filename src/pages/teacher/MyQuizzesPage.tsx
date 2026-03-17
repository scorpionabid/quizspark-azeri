import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
  BarChart3,
  Archive,
  ArchiveRestore,
  BookOpen,
  Users,
  TrendingUp,
  Clock,
  ArrowUpDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useMyQuizzes,
  useDeleteQuiz,
  useQuizzesMeta,
  useDuplicateQuiz,
  useArchiveQuiz,
} from '@/hooks/useQuizzes';
import { PageLoader } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { QuizStatsSheet } from '@/components/teacher/quiz-stats/QuizStatsSheet';
import { toast } from 'sonner';

// ─── Constants ────────────────────────────────────────────────────────────────

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Asan',
  medium: 'Orta',
  hard: 'Çətin',
};

const SORT_OPTIONS = [
  { value: 'newest', label: 'Ən yeni' },
  { value: 'oldest', label: 'Ən köhnə' },
  { value: 'name', label: 'Ada görə' },
  { value: 'attempts', label: 'Ən çox cəhd' },
  { value: 'score', label: 'Ən yüksək orta bal' },
] as const;

type SortOption = (typeof SORT_OPTIONS)[number]['value'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeTime(dateStr: string | null): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'indicə';
  if (mins < 60) return `${mins} dəq əvvəl`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} saat əvvəl`;
  return `${Math.floor(hours / 24)} gün əvvəl`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyQuizzesPage() {
  const navigate = useNavigate();

  // ── filter / sort state ──
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showArchived, setShowArchived] = useState(false);

  // ── dialog state ──
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const [statsQuizId, setStatsQuizId] = useState<string | null>(null);
  const [statsQuizTitle, setStatsQuizTitle] = useState('');
  const [statsPassPct, setStatsPassPct] = useState(60);

  // ── debounce search ──
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ── data hooks ──
  const { data: quizzes = [], isLoading, error } = useMyQuizzes({ isArchived: showArchived });
  const quizIds = useMemo(() => quizzes.map(q => q.id), [quizzes]);
  const { data: quizzesMeta } = useQuizzesMeta(quizIds);

  const deleteQuiz = useDeleteQuiz();
  const duplicateQuiz = useDuplicateQuiz();
  const archiveQuiz = useArchiveQuiz();

  // ── derived subject list ──
  const subjects = useMemo(() => {
    const set = new Set(quizzes.map(q => q.subject).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [quizzes]);

  // ── filter + sort ──
  const filteredQuizzes = useMemo(() => {
    const filtered = quizzes.filter(quiz => {
      if (debouncedSearch && !quiz.title.toLowerCase().includes(debouncedSearch.toLowerCase()))
        return false;
      if (statusFilter === 'active' && !quiz.is_published) return false;
      if (statusFilter === 'draft' && quiz.is_published) return false;
      if (difficultyFilter !== 'all' && quiz.difficulty !== difficultyFilter) return false;
      if (subjectFilter !== 'all' && quiz.subject !== subjectFilter) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'name':
          return a.title.localeCompare(b.title, 'az');
        case 'attempts':
          return (
            (quizzesMeta?.[b.id]?.attempt_count ?? 0) -
            (quizzesMeta?.[a.id]?.attempt_count ?? 0)
          );
        case 'score':
          return (
            (quizzesMeta?.[b.id]?.avg_score ?? -1) -
            (quizzesMeta?.[a.id]?.avg_score ?? -1)
          );
        default:
          return 0;
      }
    });
  }, [quizzes, quizzesMeta, debouncedSearch, statusFilter, difficultyFilter, subjectFilter, sortBy]);

  // ── handlers ──
  const handleDelete = async () => {
    if (!quizToDelete) return;
    try {
      await deleteQuiz.mutateAsync(quizToDelete);
      setDeleteDialogOpen(false);
      setQuizToDelete(null);
    } catch {
      toast.error('Quiz silinərkən xəta baş verdi');
    }
  };

  const handleDuplicate = async (quizId: string) => {
    await duplicateQuiz.mutateAsync(quizId);
  };

  const handleArchive = async (quizId: string, archived: boolean) => {
    await archiveQuiz.mutateAsync({ quizId, archived });
  };

  const handleOpenStats = (quizId: string, title: string, passPct?: number) => {
    setStatsQuizId(quizId);
    setStatsQuizTitle(title);
    setStatsPassPct(passPct ?? 60);
  };

  // ── loading / error ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
        <PageLoader text="Quizlər yüklənir..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
        <EmptyState
          icon="❌"
          title="Xəta baş verdi"
          description="Quizlər yüklənərkən xəta baş verdi."
          action={{ label: 'Yenidən cəhd et', onClick: () => window.location.reload() }}
        />
      </div>
    );
  }

  const activeFilterCount = [
    statusFilter !== 'all',
    difficultyFilter !== 'all',
    subjectFilter !== 'all',
    debouncedSearch !== '',
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">

        {/* ── Header ── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              {showArchived ? 'Arxiv' : 'Quizlərim'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {showArchived
                ? 'Arxivlənmiş quizlər'
                : `${quizzes.length} quiz · ${quizzes.filter(q => q.is_published).length} dərc olunmuş`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowArchived(s => !s);
                setSubjectFilter('all');
                setDifficultyFilter('all');
                setStatusFilter('all');
              }}
              className={showArchived ? 'border-amber-500/50 text-amber-600' : ''}
            >
              {showArchived ? (
                <>
                  <ArchiveRestore className="mr-2 h-4 w-4" />
                  Aktiv quizlər
                </>
              ) : (
                <>
                  <Archive className="mr-2 h-4 w-4" />
                  Arxiv
                </>
              )}
            </Button>
            {!showArchived && (
              <Button variant="game" onClick={() => navigate('/teacher/create')}>
                <Plus className="mr-2 h-4 w-4" />
                Yeni Quiz
              </Button>
            )}
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="mb-5 space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Quiz axtar..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Hamısı</SelectItem>
                <SelectItem value="active">Dərc Olunmuş</SelectItem>
                <SelectItem value="draft">Qaralama</SelectItem>
              </SelectContent>
            </Select>

            {/* Difficulty */}
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Çətinlik" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün çətinliklər</SelectItem>
                <SelectItem value="easy">Asan</SelectItem>
                <SelectItem value="medium">Orta</SelectItem>
                <SelectItem value="hard">Çətin</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={v => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[175px]">
                <ArrowUpDown className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(o => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject filter (shown only if subjects exist) */}
          {subjects.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSubjectFilter('all')}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  subjectFilter === 'all'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                Hamısı
              </button>
              {subjects.map(s => (
                <button
                  key={s}
                  onClick={() => setSubjectFilter(s === subjectFilter ? 'all' : s)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    subjectFilter === s
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Active filter indicator */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{filteredQuizzes.length} nəticə göstərilir</span>
              <button
                onClick={() => {
                  setSearchInput('');
                  setStatusFilter('all');
                  setDifficultyFilter('all');
                  setSubjectFilter('all');
                }}
                className="text-primary hover:underline"
              >
                Filterləri sıfırla
              </button>
            </div>
          )}
        </div>

        {/* ── Quiz List ── */}
        <div className="space-y-3">
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map(quiz => {
              const meta = quizzesMeta?.[quiz.id];
              return (
                <div
                  key={quiz.id}
                  className={`rounded-2xl bg-gradient-card border border-border/50 p-5 transition-all hover:border-primary/30 ${
                    quiz.is_archived ? 'opacity-70' : ''
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    {/* Left: info */}
                    <div className="flex-1 min-w-0">
                      {/* Title + badges */}
                      <div className="mb-1.5 flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-lg font-bold text-foreground leading-tight">
                          {quiz.title}
                        </h3>
                        <Badge variant={quiz.is_published ? 'success' : 'warning'}>
                          {quiz.is_published ? 'Dərc Olunmuş' : 'Qaralama'}
                        </Badge>
                        {quiz.difficulty && (
                          <Badge variant={quiz.difficulty}>
                            {DIFFICULTY_LABELS[quiz.difficulty] || quiz.difficulty}
                          </Badge>
                        )}
                        {quiz.is_archived && (
                          <Badge variant="outline" className="text-amber-500 border-amber-500/30 text-[10px]">
                            arxivdə
                          </Badge>
                        )}
                      </div>

                      {/* Subject / grade */}
                      {(quiz.subject || quiz.grade) && (
                        <div className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground mb-2">
                          {quiz.subject && <span>{quiz.subject}</span>}
                          {quiz.subject && quiz.grade && <span>·</span>}
                          {quiz.grade && <span>{quiz.grade}</span>}
                        </div>
                      )}

                      {/* Meta row: question count, attempts, avg score, last played */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {meta?.question_count ?? '—'} sual
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {meta?.attempt_count ?? 0} cəhd
                        </span>
                        {meta?.avg_score != null && (
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {meta.avg_score.toFixed(0)}% orta bal
                          </span>
                        )}
                        {meta?.last_played && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {relativeTime(meta.last_played)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/quiz/${quiz.id}?preview=true`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Baxış
                      </Button>
                      {!showArchived && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/teacher/edit/${quiz.id}`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Redaktə
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!showArchived && (
                            <DropdownMenuItem
                              onClick={() => handleDuplicate(quiz.id)}
                              disabled={duplicateQuiz.isPending}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Kopyala
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() =>
                              handleOpenStats(quiz.id, quiz.title, quiz.pass_percentage)
                            }
                          >
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Statistika
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleArchive(quiz.id, !quiz.is_archived)}
                          >
                            {quiz.is_archived ? (
                              <>
                                <ArchiveRestore className="mr-2 h-4 w-4" />
                                Arxivdən çıxar
                              </>
                            ) : (
                              <>
                                <Archive className="mr-2 h-4 w-4" />
                                Arxivlə
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setQuizToDelete(quiz.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <EmptyState
              icon={showArchived ? '📦' : '📝'}
              title={showArchived ? 'Arxiv boşdur' : 'Quiz tapılmadı'}
              description={
                showArchived
                  ? 'Arxivlənmiş quiz yoxdur'
                  : activeFilterCount > 0
                  ? 'Axtarış filterini dəyişdirin'
                  : 'İlk quizinizi yaradın'
              }
              action={
                !showArchived && activeFilterCount === 0
                  ? { label: 'Yeni Quiz Yarat', onClick: () => navigate('/teacher/create') }
                  : undefined
              }
            />
          )}
        </div>
      </div>

      {/* ── Dialogs & Sheets ── */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Quizi silmək istəyirsiniz?"
        description="Bu əməliyyat geri qaytarıla bilməz. Quiz və bütün suallar silinəcək."
        confirmLabel="Sil"
        variant="destructive"
        onConfirm={handleDelete}
      />

      <QuizStatsSheet
        quizId={statsQuizId}
        quizTitle={statsQuizTitle}
        passPercentage={statsPassPct}
        onClose={() => setStatsQuizId(null)}
      />
    </div>
  );
}
