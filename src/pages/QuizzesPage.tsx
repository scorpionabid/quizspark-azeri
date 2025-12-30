import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QuizCard, Quiz } from "@/components/quiz/QuizCard";
import { CategoryFilter } from "@/components/quiz/CategoryFilter";
import { useAuth } from "@/contexts/AuthContext";
import { sampleQuizzes, categories } from "@/data/sampleQuizzes";
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

  const isGuest = !user || user.role === 'guest';

  const filteredQuizzes = sampleQuizzes
    .filter((quiz) => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || 
        quiz.subject.toLowerCase().includes(selectedCategory.toLowerCase());
      
      const matchesDifficulty = difficulty === "all" || quiz.difficulty === difficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.playCount - a.playCount;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return b.isNew ? 1 : -1;
        case "questions":
          return b.questionCount - a.questionCount;
        default:
          return 0;
      }
    });

  const handlePlayQuiz = (quiz: Quiz) => {
    navigate(`/quiz/${quiz.id}`);
  };

  const handlePreviewQuiz = (quiz: Quiz) => {
    navigate(`/quiz/${quiz.id}?preview=true`);
  };

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
            categories={categories}
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
            <p className="mb-4 text-muted-foreground">Filterləri dəyişdirməyə çalışın</p>
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setSelectedCategory(null);
              setDifficulty("all");
            }}>
              Filterləri Sıfırla
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
