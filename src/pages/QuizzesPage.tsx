import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QuizCard } from "@/components/quiz/QuizCard";
import { CategoryFilter } from "@/components/quiz/CategoryFilter";
import { useAuth } from "@/contexts/AuthContext";
import { usePublicQuizzes, useQuizzesMeta, Quiz as DbQuiz } from "@/hooks/useQuizzes";
import { PageLoader } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function QuizzesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");

  const { data: quizzes = [], isLoading, error } = usePublicQuizzes();
  const quizIds = React.useMemo(() => quizzes.map(q => q.id), [quizzes]);
  const { data: quizzesMeta } = useQuizzesMeta(quizIds);

  const isGuest = !user || user.role === 'guest';

  const dynamicCategories = React.useMemo(() => {
    const counts: Record<string, number> = {};
    quizzes.forEach(q => {
      const subj = q.subject || 'Digər';
      counts[subj] = (counts[subj] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count], index) => ({
      id: `cat-${index}`,
      name,
      icon: '📚', // Default icon, could map further if needed
      count
    })).sort((a, b) => b.count - a.count);
  }, [quizzes]);

  // No mapping needed since DbQuiz satisfies QuizCard
  const filteredQuizzes = quizzes
    .filter((quiz) => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (quiz.description && quiz.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = !selectedCategory ||
        (quiz.subject && quiz.subject.toLowerCase().includes(selectedCategory.toLowerCase()));

      const matchesDifficulty = difficulty === "all" || quiz.difficulty === difficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return (b.play_count || 0) - (a.play_count || 0);
        case "rating":
          return (Number(b.rating) || 0) - (Number(a.rating) || 0);
        case "newest":
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case "questions": {
          const qb = quizzesMeta?.[b.id]?.question_count || 0;
          const qa = quizzesMeta?.[a.id]?.question_count || 0;
          return qb - qa;
        }
        default:
          return 0;
      }
    });

  const handlePlayQuiz = (quiz: DbQuiz) => {
    navigate(`/quiz/${quiz.id}`);
  };

  const handlePreviewQuiz = (quiz: DbQuiz) => {
    navigate(`/quiz/${quiz.id}?preview=true`);
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
        <div className="mx-auto max-w-7xl">
          <EmptyState
            icon="❌"
            title="Xəta baş verdi"
            description="Quizlər yüklənərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin."
            action={{
              label: "Yenidən cəhd et",
              onClick: () => window.location.reload(),
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 font-display text-3xl font-bold text-foreground">Quizlər</h1>
          <p className="text-muted-foreground">Müxtəlif fənlər üzrə quizləri kəşf et</p>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          {/* Search and Sort */}
          <div className="flex flex-col gap-4 sm:flex-row">
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
            <div className="flex gap-2">
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Çətinlik" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Hamısı</SelectItem>
                  <SelectItem value="easy">Asan</SelectItem>
                  <SelectItem value="medium">Orta</SelectItem>
                  <SelectItem value="hard">Çətin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sırala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Populyarlıq</SelectItem>
                  <SelectItem value="rating">Reytinq</SelectItem>
                  <SelectItem value="newest">Ən Yeni</SelectItem>
                  <SelectItem value="questions">Sual Sayı</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Categories */}
          <CategoryFilter
            categories={dynamicCategories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {filteredQuizzes.length} quiz tapıldı
          </span>
        </div>

        {/* Quiz Grid */}
        {filteredQuizzes.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                questionCount={quizzesMeta?.[quiz.id]?.question_count || 0}
                onPlay={handlePlayQuiz}
                onPreview={handlePreviewQuiz}
                isGuest={isGuest}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🔍"
            title="Quiz tapılmadı"
            description="Filterləri dəyişdirməyə çalışın"
            action={{
              label: "Filterləri Sıfırla",
              onClick: () => {
                setSearchQuery("");
                setSelectedCategory(null);
                setDifficulty("all");
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
