import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { QuizCard } from "@/components/quiz/QuizCard";
import { CategoryFilter } from "@/components/quiz/CategoryFilter";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePublicQuizzes, useQuizzesMeta, Quiz as DbQuiz } from "@/hooks/useQuizzes";
import { getSubjectIcon } from "@/lib/constants/subjects";
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
  const { t } = useLanguage();
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
      const subj = q.subject?.trim() || t('category_all', 'Ümumi');
      counts[subj] = (counts[subj] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      id: name,
      name,
      icon: getSubjectIcon(name),
      count
    })).sort((a, b) => b.count - a.count);
  }, [quizzes, t]);

  // Filter and sort
  const filteredQuizzes = quizzes
    .filter((quiz) => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (quiz.description && quiz.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = !selectedCategory ||
        (quiz.subject?.trim().toLowerCase() === selectedCategory.trim().toLowerCase()) ||
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
        case "questions":
          return (b.question_count || 0) - (a.question_count || 0);
        default:
          return 0;
      }
    });

  const handlePlayQuiz = (quiz: DbQuiz) => {
    if (quiz.exam_category === 'official_exam') {
      navigate('/imtahan');
      return;
    }
    navigate(`/quiz/${quiz.id}`);
  };

  const handlePreviewQuiz = (quiz: DbQuiz) => {
    if (quiz.exam_category === 'official_exam') {
      navigate('/imtahan');
      return;
    }
    navigate(`/quiz/${quiz.id}?preview=true`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
        <PageLoader text={t('quizzes_loading', 'Quizlər yüklənir...')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <EmptyState
            icon="❌"
            title={t('error_title', 'Xəta baş verdi')}
            description={t('error_desc', 'Quizlər yüklənərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.')}
            action={{
              label: t('retry_btn', 'Yenidən cəhd et'),
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
          <h1 className="mb-2 font-display text-3xl font-bold text-foreground">
            {t('quizzes_page_title', 'Quizlər və Kurslar')}
          </h1>
          <p className="text-muted-foreground">
            {t('quizzes_page_subtitle', 'Müxtəlif fənlər və ixtisaslar üzrə sınaq və imtahan kurslarını kəşf et')}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          {/* Search and Sort */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('quizzes_search_placeholder', 'Quiz axtar...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder={t('filter_difficulty', 'Çətinlik')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('diff_all', 'Hamısı')}</SelectItem>
                  <SelectItem value="easy">{t('diff_easy', 'Asan')}</SelectItem>
                  <SelectItem value="medium">{t('diff_medium', 'Orta')}</SelectItem>
                  <SelectItem value="hard">{t('diff_hard', 'Çətin')}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <SelectValue placeholder={t('filter_sort', 'Sırala')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">{t('sort_popular', 'Populyarlıq')}</SelectItem>
                  <SelectItem value="rating">{t('sort_rating', 'Reytinq')}</SelectItem>
                  <SelectItem value="newest">{t('sort_newest', 'Ən Yeni')}</SelectItem>
                  <SelectItem value="questions">{t('sort_questions', 'Sual Sayı')}</SelectItem>
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
            {filteredQuizzes.length} {t('quizzes_found', 'quiz tapıldı')}
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
            title={t('no_quizzes_found', 'Quiz tapılmadı')}
            description={t('no_quizzes_match_criteria', 'Filterləri dəyişdirməyə çalışın')}
            action={{
              label: t('clear_filters', 'Filterləri Sıfırla'),
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
