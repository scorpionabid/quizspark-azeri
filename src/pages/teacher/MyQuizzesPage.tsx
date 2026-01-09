import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Copy,
  BarChart3,
  Archive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMyQuizzes, useDeleteQuiz } from "@/hooks/useQuizzes";
import { PageLoader } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";

const difficultyLabels: Record<string, string> = {
  easy: 'Asan',
  medium: 'Orta',
  hard: 'Çətin',
};

export default function MyQuizzesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);

  const { data: quizzes = [], isLoading, error } = useMyQuizzes();
  const deleteQuiz = useDeleteQuiz();

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && quiz.is_published) ||
      (statusFilter === "draft" && !quiz.is_published);
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async () => {
    if (!quizToDelete) return;
    try {
      await deleteQuiz.mutateAsync(quizToDelete);
      setDeleteDialogOpen(false);
      setQuizToDelete(null);
    } catch (error) {
      toast.error("Quiz silinərkən xəta baş verdi");
    }
  };

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
          action={{
            label: "Yenidən cəhd et",
            onClick: () => window.location.reload(),
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Quizlərim</h1>
            <p className="text-muted-foreground">Yaratdığınız bütün quizlər</p>
          </div>
          <Button variant="game" onClick={() => navigate('/teacher/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Quiz
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Quiz axtar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
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
        </div>

        {/* Quiz List */}
        <div className="space-y-4">
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="rounded-2xl bg-gradient-card border border-border/50 p-5 transition-all hover:border-primary/30"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-bold text-foreground">
                        {quiz.title}
                      </h3>
                      <Badge variant={quiz.is_published ? 'success' : 'warning'}>
                        {quiz.is_published ? 'Dərc Olunmuş' : 'Qaralama'}
                      </Badge>
                      {quiz.difficulty && (
                        <Badge variant={quiz.difficulty}>
                          {difficultyLabels[quiz.difficulty] || quiz.difficulty}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {quiz.subject && <span>{quiz.subject}</span>}
                      {quiz.grade && (
                        <>
                          <span>•</span>
                          <span>{quiz.grade}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{quiz.play_count || 0} oyun</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/quiz/${quiz.id}?preview=true`)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Baxış
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/teacher/edit/${quiz.id}`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Redaktə
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Kopyala
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Statistika
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="mr-2 h-4 w-4" />
                          Arxivlə
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
            ))
          ) : (
            <EmptyState
              icon="📝"
              title="Quiz tapılmadı"
              description="Axtarış filterini dəyişdirin və ya yeni quiz yaradın"
              action={{
                label: "Yeni Quiz Yarat",
                onClick: () => navigate('/teacher/create'),
              }}
            />
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Quizi silmək istəyirsiniz?"
        description="Bu əməliyyat geri qaytarıla bilməz. Quiz və bütün suallar silinəcək."
        confirmLabel="Sil"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
