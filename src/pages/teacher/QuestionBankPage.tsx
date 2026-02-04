import { useState, useMemo, useCallback } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  QuestionBankItem,
  QuestionFilters as Filters,
} from '@/hooks/useQuestionBank';
import { useQuestionCategories, QuestionCategory } from '@/hooks/useQuestionCategories';

import { QuestionFilters } from '@/components/question-bank/QuestionFilters';
import { BulkActionsBar } from '@/components/question-bank/BulkActionsBar';
import { QuestionTable } from '@/components/question-bank/QuestionTable';
import { QuestionEditDialog } from '@/components/question-bank/QuestionEditDialog';
import { QuestionViewDialog } from '@/components/question-bank/QuestionViewDialog';
import { ImportExportDialog } from '@/components/question-bank/ImportExportDialog';
import { CategoryManagementDialog } from '@/components/question-bank/CategoryManagementDialog';

const PAGE_SIZE = 50;

export default function QuestionBankPage() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  
  // Filter state
  const [filters, setFilters] = useState<Filters>({});
  
  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [importExportOpen, setImportExportOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  
  // Current question for dialogs
  const [currentQuestion, setCurrentQuestion] = useState<QuestionBankItem | null>(null);
  const [editMode, setEditMode] = useState<'create' | 'edit'>('create');
  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null);

  // Queries
  const { data: questionData, isLoading: questionsLoading } = useQuestionBankList(
    { page: currentPage, pageSize: PAGE_SIZE },
    filters
  );
  const { data: stats } = useQuestionBankStats();
  const { data: questionCategories = [] } = useQuestionCategories();
  
  // Extract category names for filters and other components
  const categories = useMemo(() => 
    questionCategories.map((c: QuestionCategory) => c.name), 
    [questionCategories]
  );

  // Mutations
  const createQuestion = useCreateQuestionBank();
  const updateQuestion = useUpdateQuestionBank();
  const deleteQuestion = useDeleteQuestionBank();
  const bulkDelete = useBulkDeleteQuestionBank();
  const bulkUpdate = useBulkUpdateQuestionBank();
  const bulkCreate = useBulkCreateQuestionBank();

  // Handlers
  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(0);
    setSelectedIds(new Set());
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(0);
  }, []);

  const handleSelectChange = useCallback((id: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected && questionData?.questions) {
      setSelectedIds(new Set(questionData.questions.map((q) => q.id)));
    } else {
      setSelectedIds(new Set());
    }
  }, [questionData?.questions]);

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

  const handleDeleteClick = (id: string) => {
    setDeleteQuestionId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDuplicateClick = (question: QuestionBankItem) => {
    const duplicate = {
      ...question,
      question_text: `${question.question_text} (kopya)`,
    };
    createQuestion.mutate({
      question_text: duplicate.question_text,
      question_type: duplicate.question_type,
      options: duplicate.options,
      correct_answer: duplicate.correct_answer,
      explanation: duplicate.explanation,
      category: duplicate.category,
      difficulty: duplicate.difficulty,
      bloom_level: duplicate.bloom_level,
      tags: duplicate.tags,
      user_id: null,
      source_document_id: null,
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

  const handleBulkDelete = () => {
    setBulkDeleteConfirmOpen(true);
  };

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

  // Pagination
  const totalPages = questionData?.totalPages || 0;
  const paginationItems = useMemo(() => {
    const items = [];
    const start = Math.max(0, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 3);
    
    for (let i = start; i < end; i++) {
      items.push(i);
    }
    return items;
  }, [currentPage, totalPages]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sual Bankı"
        description="Bütün suallarınızı bir yerdə idarə edin"
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCategoryDialogOpen(true)}>
            <FolderOpen className="h-4 w-4 mr-2" />
            Kateqoriyalar
          </Button>
          <Button variant="outline" onClick={() => setImportExportOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import/Export
          </Button>
          <Button onClick={handleCreateClick}>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Sual
          </Button>
        </div>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <CardTitle className="text-sm font-medium">Çətinlik Paylanması</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 text-xs">
              <span className="text-green-600">
                Asan: {stats?.difficultyCounts?.['asan'] || 0}
              </span>
              <span className="text-yellow-600">
                Orta: {stats?.difficultyCounts?.['orta'] || 0}
              </span>
              <span className="text-red-600">
                Çətin: {stats?.difficultyCounts?.['çətin'] || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <QuestionFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        categories={categories}
        onClearFilters={handleClearFilters}
      />

      {/* Bulk Actions */}
      <BulkActionsBar
        selectedCount={selectedIds.size}
        categories={categories}
        onBulkDelete={handleBulkDelete}
        onBulkUpdateCategory={handleBulkUpdateCategory}
        onBulkUpdateDifficulty={handleBulkUpdateDifficulty}
        onClearSelection={() => setSelectedIds(new Set())}
        isDeleting={bulkDelete.isPending}
        isUpdating={bulkUpdate.isPending}
      />

      {/* Question Table */}
      <QuestionTable
        questions={questionData?.questions || []}
        selectedIds={selectedIds}
        onSelectChange={handleSelectChange}
        onSelectAll={handleSelectAll}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onDuplicate={handleDuplicateClick}
        onView={handleViewClick}
        isLoading={questionsLoading}
      />

      {/* Pagination */}
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

      {/* Results info */}
      <div className="text-sm text-muted-foreground text-center">
        {questionData?.totalCount || 0} sualdan{' '}
        {currentPage * PAGE_SIZE + 1}-
        {Math.min((currentPage + 1) * PAGE_SIZE, questionData?.totalCount || 0)} göstərilir
      </div>

      {/* Dialogs */}
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
