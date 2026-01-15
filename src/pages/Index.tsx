import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp, Sparkles, Trophy, Target, BookOpen, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QuizCard, Quiz } from "@/components/quiz/QuizCard";
import { CategoryFilter } from "@/components/quiz/CategoryFilter";
import { QuizFilters, QuizFilterValues } from "@/components/quiz/QuizFilters";
import { useAuth } from "@/contexts/AuthContext";
import { sampleQuizzes, categories } from "@/data/sampleQuizzes";

const defaultFilters: QuizFilterValues = {
  difficulty: "all",
  duration: "all",
  sortBy: "newest",
};

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState<QuizFilterValues>(defaultFilters);

  const isGuest = !user || user.role === 'guest';
  const isLoggedIn = !!user && user.role !== 'guest';

  const filteredQuizzes = useMemo(() => {
    let result = sampleQuizzes.filter((quiz) => {
      // Search filter
      const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.subject.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = !selectedCategory || 
        quiz.subject.toLowerCase().includes(selectedCategory.toLowerCase());
      
      // Difficulty filter
      const matchesDifficulty = filters.difficulty === "all" || 
        quiz.difficulty === filters.difficulty;
      
      // Duration filter
      let matchesDuration = true;
      if (filters.duration !== "all") {
        if (filters.duration === "short") {
          matchesDuration = quiz.duration <= 10;
        } else if (filters.duration === "medium") {
          matchesDuration = quiz.duration > 10 && quiz.duration <= 20;
        } else if (filters.duration === "long") {
          matchesDuration = quiz.duration > 20;
        }
      }
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesDuration;
    });

    // Sort
    switch (filters.sortBy) {
      case "popular":
        result = [...result].sort((a, b) => b.playCount - a.playCount);
        break;
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case "questions":
        result = [...result].sort((a, b) => b.questionCount - a.questionCount);
        break;
      case "newest":
      default:
        // Keep original order for newest
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, filters]);

  const popularQuizzes = sampleQuizzes.filter(q => q.isPopular);
  const newQuizzes = sampleQuizzes.filter(q => q.isNew);

  const handlePlayQuiz = (quiz: Quiz) => {
    navigate(`/quiz/${quiz.id}`);
  };

  const handlePreviewQuiz = (quiz: Quiz) => {
    navigate(`/quiz/${quiz.id}?preview=true`);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setSelectedCategory(null);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Yeni quizlər əlavə edildi!</span>
          </div>

          <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            Öyrənmək <span className="text-gradient-primary">Əyləncəli</span> Ola Bilər
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
            Müxtəlif fənlər üzrə interaktiv quizlərlə biliklərini test et, 
            yeni şeylər öyrən və liderlik lövhəsində yarış!
          </p>

          {/* Search */}
          <div className="mx-auto mb-8 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Quiz axtar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 rounded-2xl border-border/50 bg-card/50 pl-12 pr-4 text-base backdrop-blur-sm focus:border-primary focus:ring-primary"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto grid max-w-2xl grid-cols-3 gap-4 sm:gap-8">
            <div className="rounded-2xl bg-card/50 p-4 backdrop-blur-sm">
              <div className="mb-1 flex items-center justify-center gap-2 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-foreground sm:text-3xl">150+</div>
              <div className="text-xs text-muted-foreground sm:text-sm">Quizlər</div>
            </div>
            <div className="rounded-2xl bg-card/50 p-4 backdrop-blur-sm">
              <div className="mb-1 flex items-center justify-center gap-2 text-secondary">
                <Target className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-foreground sm:text-3xl">10K+</div>
              <div className="text-xs text-muted-foreground sm:text-sm">İştirakçı</div>
            </div>
            <div className="rounded-2xl bg-card/50 p-4 backdrop-blur-sm">
              <div className="mb-1 flex items-center justify-center gap-2 text-accent">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-foreground sm:text-3xl">8</div>
              <div className="text-xs text-muted-foreground sm:text-sm">Fənn</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 pb-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </section>

      {/* Advanced Filters - Show for logged in users */}
      {isLoggedIn && (
        <section className="px-4 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-2xl border border-border/50 bg-card/30 p-4 backdrop-blur-sm">
              <QuizFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>
        </section>
      )}

      {/* Popular Quizzes */}
      {!searchQuery && !selectedCategory && popularQuizzes.length > 0 && (
        <section className="px-4 pb-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/20">
                <TrendingUp className="h-5 w-5 text-secondary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">Populyar Quizlər</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {popularQuizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onPlay={handlePlayQuiz}
                  onPreview={handlePreviewQuiz}
                  isGuest={isGuest}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Quizzes */}
      {!searchQuery && !selectedCategory && newQuizzes.length > 0 && (
        <section className="px-4 pb-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                <Zap className="h-5 w-5 text-accent" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">Yeni Əlavə Edilən</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {newQuizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onPlay={handlePlayQuiz}
                  onPreview={handlePreviewQuiz}
                  isGuest={isGuest}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Quizzes */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {searchQuery || selectedCategory ? 'Axtarış Nəticələri' : 'Bütün Quizlər'}
            </h2>
            <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
              {filteredQuizzes.length} quiz
            </span>
          </div>

          {filteredQuizzes.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredQuizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onPlay={handlePlayQuiz}
                  onPreview={handlePreviewQuiz}
                  isGuest={isGuest}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-card/50 py-16 text-center">
              <div className="mb-4 text-6xl">🔍</div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Quiz tapılmadı</h3>
              <p className="text-muted-foreground">Axtarış sorğunuzu dəyişdirməyə çalışın</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
