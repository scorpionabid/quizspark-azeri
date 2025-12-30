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
import { cn } from "@/lib/utils";

interface TeacherQuiz {
  id: string;
  title: string;
  subject: string;
  grade: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  playCount: number;
  avgScore: number;
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

const myQuizzes: TeacherQuiz[] = [
  {
    id: '1',
    title: 'Cəbr Əsasları: Tənliklər',
    subject: 'Riyaziyyat',
    grade: '9-cu sinif',
    difficulty: 'medium',
    questionCount: 15,
    playCount: 145,
    avgScore: 78,
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
  },
  {
    id: '2',
    title: 'Həndəsə: Üçbucaqlar',
    subject: 'Riyaziyyat',
    grade: '8-ci sinif',
    difficulty: 'easy',
    questionCount: 10,
    playCount: 89,
    avgScore: 82,
    status: 'active',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
  },
  {
    id: '3',
    title: 'Tənliklər Sistemi',
    subject: 'Riyaziyyat',
    grade: '10-cu sinif',
    difficulty: 'hard',
    questionCount: 20,
    playCount: 0,
    avgScore: 0,
    status: 'draft',
    createdAt: '2024-01-22',
    updatedAt: '2024-01-22',
  },
  {
    id: '4',
    title: 'Faiz Hesablamaları',
    subject: 'Riyaziyyat',
    grade: '7-ci sinif',
    difficulty: 'easy',
    questionCount: 12,
    playCount: 67,
    avgScore: 85,
    status: 'active',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-12',
  },
  {
    id: '5',
    title: 'Köhnə Quiz',
    subject: 'Riyaziyyat',
    grade: '6-cı sinif',
    difficulty: 'easy',
    questionCount: 8,
    playCount: 234,
    avgScore: 75,
    status: 'archived',
    createdAt: '2023-12-01',
    updatedAt: '2024-01-01',
  },
];

const difficultyLabels = {
  easy: 'Asan',
  medium: 'Orta',
  hard: 'Çətin',
};

const statusLabels = {
  draft: 'Qaralama',
  active: 'Aktiv',
  archived: 'Arxiv',
};

export default function MyQuizzesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredQuizzes = myQuizzes.filter((quiz) => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || quiz.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
              <SelectItem value="active">Aktiv</SelectItem>
              <SelectItem value="draft">Qaralama</SelectItem>
              <SelectItem value="archived">Arxiv</SelectItem>
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
                      <Badge variant={
                        quiz.status === 'active' ? 'success' : 
                        quiz.status === 'draft' ? 'warning' : 'muted'
                      }>
                        {statusLabels[quiz.status]}
                      </Badge>
                      <Badge variant={quiz.difficulty}>
                        {difficultyLabels[quiz.difficulty]}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span>{quiz.subject}</span>
                      <span>•</span>
                      <span>{quiz.grade}</span>
                      <span>•</span>
                      <span>{quiz.questionCount} sual</span>
                      {quiz.status !== 'draft' && (
                        <>
                          <span>•</span>
                          <span>{quiz.playCount} oyun</span>
                          <span>•</span>
                          <span>Orta: {quiz.avgScore}%</span>
                        </>
                      )}
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
                        <DropdownMenuItem className="text-destructive">
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
            <div className="flex flex-col items-center justify-center rounded-2xl bg-card/50 py-16 text-center">
              <div className="mb-4 text-6xl">📝</div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Quiz tapılmadı</h3>
              <p className="mb-4 text-muted-foreground">Axtarış filterini dəyişdirin və ya yeni quiz yaradın</p>
              <Button variant="game" onClick={() => navigate('/teacher/create')}>
                <Plus className="mr-2 h-4 w-4" />
                Yeni Quiz Yarat
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
