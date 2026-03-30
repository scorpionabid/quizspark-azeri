import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Upload,
  Database,
  TrendingUp,
  Layers,
  BarChart3,
  FolderOpen,
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  useQuestionBankList,
  useQuestionBankStats,
  useCreateQuestionBank,
  useUpdateQuestionBank,
  useDeleteQuestionBank,
  useBulkDeleteQuestionBank,
  useBulkUpdateQuestionBank,
  useBulkCreateQuestionBank,
  useShareQuestion,
  useCopyToMyBank,
  QuestionBankItem,
  SortParams,
  QuestionFilters as Filters,
  QuestionBankMode,
} from '@/hooks/useQuestionBank';
import { useQuestionCategories, QuestionCategory } from '@/hooks/useQuestionCategories';

import { QuestionFilters } from '@/components/question-bank/QuestionFilters';
import { BulkActionsBar } from '@/components/question-bank/BulkActionsBar';
import { QuestionTable } from '@/components/question-bank/QuestionTable';
import { SharedWithMeTable } from '@/components/question-bank/SharedWithMeTable';
import { ShareQuestionDialog } from '@/components/question-bank/ShareQuestionDialog';
import { QuestionEditDialog } from '@/components/question-bank/QuestionEditDialog';
import { QuestionViewDialog } from '@/components/question-bank/QuestionViewDialog';
import { ImportExportDialog } from '@/components/question-bank/ImportExportDialog';
import { CategoryManagementDialog } from '@/components/question-bank/CategoryManagementDialog';
import { QuestionEnhanceDialog } from '@/components/question-bank/QuestionEnhanceDialog';
import { SubscriptionGate } from '@/components/subscription/SubscriptionGate';
import { BloomAnalytics } from '@/components/question-bank/BloomAnalytics';

const PAGE_SIZE = 50;

export default function QuestionBankPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Active tab — synced with URL ?tab=...
  const [activeTab, setActiveTab] = useState<QuestionBankMode>(() => {
    const tab = searchParams.get('tab');
    return tab === 'shared-with-me' ? 'shared-with-me' : 'my-questions';
  });

  const handleTabChange = (tab: string) => {
    const mode = tab as QuestionBankMode;
    setActiveTab(mode);
    if (mode === 'shared-with-me') {
      setSearchParams({ tab: 'shared-with-me' });
    } else {
      setSearchParams({});
    }
  };

  // ── My Questions state ──────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState<Filters>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortParams | undefined>({ column: 'created_at', direction: 'desc' });

  // ── Shared With Me state ────────────────────────────────────────
  const [sharedPage, setSharedPage] = useState(0);

  // ── Dialog states ───────────────────────────────────────────────
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [importExportOpen, setImportExportOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [enhanceDialogOpen, setEnhanceDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState<QuestionBankItem | null>(null);
  const [editMode, setEditMode] = useState<'create' | 'edit'>('create');
  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null);
  const [shareTargetQuestions, setShareTargetQuestions] = useState<QuestionBankItem[]>([]);

  // ── Queries ─────────────────────────────────────────────────────
  const { data: questionData, isLoading: questionsLoading } = useQuestionBankList(
    { page: currentPage, pageSize: PAGE_SIZE },
    filters,
    sort,
    'my-questions'
  );

  const { data: sharedData, isLoading: sharedLoading } = useQuestionBankList(
    { page: sharedPage, pageSize: PAGE_SIZE },
    {},
    undefined,
    'shared-with-me'
  );

  const { data: stats } = useQuestionBankStats();
  const { data: questionCategories = [] } = useQuestionCategories();

  const categories = useMemo(
    () => questionCategories.map((c: QuestionCategory) => c.name),
    [questionCategories]
  );

  // ── Mutations ────────────────────────────────────────────────────
  const createQuestion = useCreateQuestionBank();
  const updateQuestion = useUpdateQuestionBank();
  const deleteQuestion = useDeleteQuestionBank();
  const bulkDelete = useBulkDeleteQuestionBank();
  const bulkUpdate = useBulkUpdateQuestionBank();
  const bulkCreate = useBulkCreateQuestionBank();
  const shareQuestion = useShareQuestion();
  const copyToMyBank = useCopyToMyBank();

  // ── My Questions handlers ────────────────────────────────────────
  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(0);
    setSelectedIds(new Set());
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(0);
  }, []);

  const handleSort = useCallback((column: string) => {
    setSort((prev) => {
      if (prev?.column === column) {
        return { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { column, direction: 'desc' };
    });
  }, []);

  const handleSelectChange = useCallback((id: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(
    (selected: boolean) => {
      if (selected && questionData?.questions) {
        setSelectedIds(new Set(questionData.questions.map((q) => q.id)));
      } else {
        setSelectedIds(new Set());
      }
    },
    [questionData?.questions]
  );

  const handleCreateClick = () => {
    setEditMode('create');
    setCurrentQuestion(null);
    setEditDialogOpen(true);
  };

  const handleEditClick = (question: QuestionBankItem) => {
    setEditMode('edit');
    setCurrentQuestion(question);
    setEditDialogOpen(true);
  };

  const handleViewClick = (question: QuestionBankItem) => {
    setCurrentQuestion(question);
    setViewDialogOpen(true);
  };

  const handleEnhanceClick = (question: QuestionBankItem) => {
    setCurrentQuestion(question);
    setEnhanceDialogOpen(true);
  };

  const handleEnhanceApply = (updates: Partial<QuestionBankItem>) => {
    if (currentQuestion) {
      updateQuestion.mutate({ id: currentQuestion.id, ...updates });
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteQuestionId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDuplicateClick = (question: QuestionBankItem) => {
    createQuestion.mutate({
      question_text: `${question.question_text} (kopya)`,
      title: question.title ? `${question.title} (kopya)` : null,
      question_type: question.question_type,
      options: question.options,
      correct_answer: question.correct_answer,
      explanation: question.explanation,
      category: question.category,
      difficulty: question.difficulty,
      bloom_level: question.bloom_level,
      tags: question.tags,
      user_id: null,
      source_document_id: null,
      question_image_url: question.question_image_url || null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      option_images: (question as any).option_images || null,
      media_type: question.media_type || null,
      media_url: question.media_url || null,
      weight: question.weight || 1.0,
      hint: question.hint || null,
      time_limit: question.time_limit || null,
      video_url: question.video_url || null,
      video_start_time: question.video_start_time || null,
      video_end_time: question.video_end_time || null,
      model_3d_url: question.model_3d_url || null,
      model_3d_type: question.model_3d_type || 'glb',
      fill_blank_template: question.fill_blank_template || null,
      numerical_answer: question.numerical_answer ?? null,
      numerical_tolerance: question.numerical_tolerance ?? 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      matching_pairs: (question as any).matching_pairs || null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sequence_items: (question as any).sequence_items || null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      hotspot_data: (question as any).hotspot_data || null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      per_option_explanations: (question as any).per_option_explanations || null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      feedback_enabled: (question as any).feedback_enabled || false,
      quality_score: null,
      usage_count: null,
    });
  };

  const handleSaveQuestion = (data: Partial<QuestionBankItem>) => {
    if (editMode === 'create') {
      createQuestion.mutate(data as Parameters<typeof createQuestion.mutate>[0], {
        onSuccess: () => setEditDialogOpen(false),
      });
    } else if (data.id) {
      updateQuestion.mutate(data as Parameters<typeof updateQuestion.mutate>[0], {
        onSuccess: () => setEditDialogOpen(false),
      });
    }
  };

  const handleConfirmDelete = () => {
    if (deleteQuestionId) {
      deleteQuestion.mutate(deleteQuestionId, {
        onSuccess: () => {
          setDeleteConfirmOpen(false);
          setDeleteQuestionId(null);
        },
      });
    }
  };

  const handleBulkDelete = () => setBulkDeleteConfirmOpen(true);

  const handleConfirmBulkDelete = () => {
    bulkDelete.mutate(Array.from(selectedIds), {
      onSuccess: () => {
        setSelectedIds(new Set());
        setBulkDeleteConfirmOpen(false);
      },
    });
  };

  const handleBulkUpdateCategory = (category: string) => {
    bulkUpdate.mutate(
      { ids: Array.from(selectedIds), updates: { category } },
      { onSuccess: () => setSelectedIds(new Set()) }
    );
  };

  const handleBulkUpdateDifficulty = (difficulty: string) => {
    bulkUpdate.mutate(
      { ids: Array.from(selectedIds), updates: { difficulty } },
      { onSuccess: () => setSelectedIds(new Set()) }
    );
  };

  const handleImport = (questions: Parameters<typeof bulkCreate.mutate>[0]) => {
    bulkCreate.mutate(questions, {
      onSuccess: () => setImportExportOpen(false),
    });
  };

  // ── Sharing handlers ─────────────────────────────────────────────
  const handleShareClick = (question: QuestionBankItem) => {
    setShareTargetQuestions([question]);
    setShareDialogOpen(true);
  };

  const handleBulkShare = () => {
    const selected = questionData?.questions.filter((q) => selectedIds.has(q.id)) ?? [];
    setShareTargetQuestions(selected);
    setShareDialogOpen(true);
  };

  const handleShare = (recipientIds: string[], message?: string) => {
    shareQuestion.mutate(
      {
        questionIds: shareTargetQuestions.map((q) => q.id),
        recipientIds,
        message,
      },
      {
        onSuccess: () => {
          setShareDialogOpen(false);
          setSelectedIds(new Set());
        },
      }
    );
  };

  const handleCopyToMyBank = (question: QuestionBankItem) => {
    copyToMyBank.mutate(question);
  };

  // ── Pagination helpers ───────────────────────────────────────────
  const totalPages = questionData?.totalPages || 0;
  const sharedTotalPages = sharedData?.totalPages || 0;

  const paginationItems = useMemo(() => {
    const items: number[] = [];
    const start = Math.max(0, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 3);
    for (let i = start; i < end; i++) items.push(i);
    return items;
  }, [currentPage, totalPages]);

  const sharedPaginationItems = useMemo(() => {
    const items: number[] = [];
    const start = Math.max(0, sharedPage - 2);
    const end = Math.min(sharedTotalPages, sharedPage + 3);
    for (let i = start; i < end; i++) items.push(i);
    return items;
  }, [sharedPage, sharedTotalPages]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sual Bankı"
        description="Bütün suallarınızı bir yerdə idarə edin"
      >
        <div className="flex flex-wrap gap-2">
          <SubscriptionGate variant="inline" feature="question_bank_write">
            <Button variant="outline" onClick={() => setCategoryDialogOpen(true)}>
              <FolderOpen className="h-4 w-4 mr-2" />
              Kateqoriyalar
            </Button>
          </SubscriptionGate>
          <SubscriptionGate variant="inline" feature="question_bank_write">
            <Button variant="outline" onClick={() => setImportExportOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Import/Export
            </Button>
          </SubscriptionGate>
          <SubscriptionGate variant="inline" feature="question_bank_write">
            <Button onClick={handleCreateClick}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Sual
            </Button>
          </SubscriptionGate>
        </div>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ümumi Suallar</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalQuestions || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Kateqoriyalar</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(stats?.categoryCounts || {}).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bu Həftə</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.thisWeekCount || 0}</div>
            <p className="text-xs text-muted-foreground">yeni sual əlavə edildi</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Çətinlik</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-green-600">Asan: {stats?.difficultyCounts?.['asan'] || 0}</span>
              <span className="text-yellow-600">Orta: {stats?.difficultyCounts?.['orta'] || 0}</span>
              <span className="text-red-600">Çətin: {stats?.difficultyCounts?.['çətin'] || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bloom Analytics */}
      <BloomAnalytics stats={stats?.bloomLevelCounts || {}} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="my-questions">Mənim Suallarım</TabsTrigger>
          <TabsTrigger value="shared-with-me" className="gap-2">
            Mənə Paylaşılanlar
            {(sharedData?.totalCount ?? 0) > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                {sharedData!.totalCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ── My Questions Tab ── */}
        <TabsContent value="my-questions" className="space-y-4 mt-4">
          <QuestionFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            categories={categories}
            onClearFilters={handleClearFilters}
          />

          <BulkActionsBar
            selectedCount={selectedIds.size}
            categories={categories}
            onBulkDelete={handleBulkDelete}
            onBulkUpdateCategory={handleBulkUpdateCategory}
            onBulkUpdateDifficulty={handleBulkUpdateDifficulty}
            onClearSelection={() => setSelectedIds(new Set())}
            onBulkShare={selectedIds.size > 0 ? handleBulkShare : undefined}
            isDeleting={bulkDelete.isPending}
            isUpdating={bulkUpdate.isPending}
          />

          <QuestionTable
            questions={questionData?.questions || []}
            selectedIds={selectedIds}
            onSelectChange={handleSelectChange}
            onSelectAll={handleSelectAll}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onDuplicate={handleDuplicateClick}
            onView={handleViewClick}
            onEnhance={handleEnhanceClick}
            onShare={handleShareClick}
            onSort={handleSort}
            sort={sort}
            isLoading={questionsLoading}
          />

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    className={currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {paginationItems.map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                    className={currentPage >= totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}

          <div className="text-sm text-muted-foreground text-center">
            {questionData?.totalCount || 0} sualdan{' '}
            {currentPage * PAGE_SIZE + 1}–
            {Math.min((currentPage + 1) * PAGE_SIZE, questionData?.totalCount || 0)} göstərilir
          </div>
        </TabsContent>

        {/* ── Shared With Me Tab ── */}
        <TabsContent value="shared-with-me" className="space-y-4 mt-4">
          <SharedWithMeTable
            questions={sharedData?.questions || []}
            isLoading={sharedLoading}
            onView={handleViewClick}
            onCopy={handleCopyToMyBank}
          />

          {sharedTotalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setSharedPage((p) => Math.max(0, p - 1))}
                    className={sharedPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {sharedPaginationItems.map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setSharedPage(page)}
                      isActive={sharedPage === page}
                      className="cursor-pointer"
                    >
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setSharedPage((p) => Math.min(sharedTotalPages - 1, p + 1))}
                    className={sharedPage >= sharedTotalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}

          {(sharedData?.totalCount ?? 0) > 0 && (
            <div className="text-sm text-muted-foreground text-center">
              {sharedData!.totalCount} paylaşılmış sualdan{' '}
              {sharedPage * PAGE_SIZE + 1}–
              {Math.min((sharedPage + 1) * PAGE_SIZE, sharedData!.totalCount)} göstərilir
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ── Dialogs ── */}
      <CategoryManagementDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
      />

      <QuestionEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        question={currentQuestion}
        categories={categories}
        onSave={handleSaveQuestion}
        isLoading={createQuestion.isPending || updateQuestion.isPending}
        mode={editMode}
      />

      <QuestionEnhanceDialog
        open={enhanceDialogOpen}
        onOpenChange={setEnhanceDialogOpen}
        question={currentQuestion}
        onApply={handleEnhanceApply}
      />

      <QuestionViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        question={currentQuestion}
      />

      <ImportExportDialog
        open={importExportOpen}
        onOpenChange={setImportExportOpen}
        questions={questionData?.questions || []}
        onImport={handleImport}
        isImporting={bulkCreate.isPending}
      />

      <ShareQuestionDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        questions={shareTargetQuestions}
        onShare={handleShare}
        isSharing={shareQuestion.isPending}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Sualı sil?"
        description="Bu əməliyyat geri alına bilməz. Sual həmişəlik silinəcək."
        confirmLabel="Sil"
        cancelLabel="Ləğv et"
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />

      <ConfirmDialog
        open={bulkDeleteConfirmOpen}
        onOpenChange={setBulkDeleteConfirmOpen}
        title={`${selectedIds.size} sualı sil?`}
        description="Bu əməliyyat geri alına bilməz. Seçilmiş suallar həmişəlik silinəcək."
        confirmLabel="Hamısını sil"
        cancelLabel="Ləğv et"
        onConfirm={handleConfirmBulkDelete}
        variant="destructive"
      />
    </div>
  );
}
