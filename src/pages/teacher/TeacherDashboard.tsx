import {
  BookOpen,
  Users,
  TrendingUp,
  PlayCircle,
  PlusCircle,
  FileText,
  BarChart3,
  Trophy,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useMyQuizzes, useQuizzesMeta } from "@/hooks/useQuizzes";
import { supabase } from "@/integrations/supabase/client";

function useTeacherTopStudents(quizIds: string[]) {
  return useQuery({
    queryKey: ["teacher-top-students", quizIds],
    queryFn: async () => {
      if (!quizIds.length) return [];
      const { data } = await supabase
        .from("quiz_results")
        .select("user_id, percentage, profiles:user_id(full_name)")
        .in("quiz_id", quizIds);

      const userMap = new Map<
        string,
        { name: string; scores: number[]; count: number }
      >();
      for (const r of data || []) {
        if (!userMap.has(r.user_id)) {
          userMap.set(r.user_id, {
            name:
              (r.profiles as { full_name: string | null } | null)?.full_name ||
              "İsimsiz",
            scores: [],
            count: 0,
          });
        }
        const u = userMap.get(r.user_id)!;
        u.scores.push(r.percentage);
        u.count++;
      }

      return Array.from(userMap.values())
        .map((u) => ({
          name: u.name,
          quizzes: u.count,
          score: Math.round(
            u.scores.reduce((a, b) => a + b, 0) / u.scores.length
          ),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);
    },
    enabled: quizIds.length > 0,
    staleTime: 2 * 60 * 1000,
  });
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { data: myQuizzes = [], isLoading: quizzesLoading } = useMyQuizzes();
  const quizIds = myQuizzes.map((q) => q.id);
  const { data: meta = {}, isLoading: metaLoading } = useQuizzesMeta(quizIds);
  const { data: topStudents = [], isLoading: studentsLoading } =
    useTeacherTopStudents(quizIds);

  const isLoading = quizzesLoading || metaLoading;

  // Derived stats
  const totalQuizzes = myQuizzes.length;
  const totalPlays = Object.values(meta).reduce(
    (sum, m) => sum + m.attempt_count,
    0
  );
  const avgScores = Object.values(meta)
    .filter((m) => m.avg_score !== null)
    .map((m) => m.avg_score!);
  const overallAvg =
    avgScores.length > 0
      ? Math.round(avgScores.reduce((a, b) => a + b, 0) / avgScores.length)
      : 0;

  const recentQuizzes = myQuizzes.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Müəllim Paneli
            </h1>
            <p className="text-muted-foreground">
              Quizlərinizi və tələbə nəticələrini idarə edin
            </p>
          </div>
          <Button variant="game" onClick={() => navigate("/teacher/create")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Yeni Quiz Yarat
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Ümumi Quizlər",
              value: isLoading ? null : String(totalQuizzes),
              icon: BookOpen,
              color: "text-primary",
            },
            {
              title: "Ümumi Oynanma",
              value: isLoading ? null : String(totalPlays),
              icon: PlayCircle,
              color: "text-secondary",
            },
            {
              title: "Orta Nəticə",
              value: isLoading ? null : avgScores.length ? `${overallAvg}%` : "—",
              icon: TrendingUp,
              color: "text-success",
            },
            {
              title: "Unikal Tələbələr",
              value: studentsLoading ? null : String(topStudents.length > 0 ? "—" : "0"),
              icon: Users,
              color: "text-warning",
            },
          ].map((stat) => (
            <div
              key={stat.title}
              className="rounded-2xl bg-gradient-card border border-border/50 p-5 card-hover"
            >
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl bg-muted",
                    stat.color
                  )}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              {stat.value === null ? (
                <Skeleton className="h-8 w-16 mb-1" />
              ) : (
                <div className="text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
              )}
              <div className="text-sm text-muted-foreground">{stat.title}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Quizzes */}
          <div className="lg:col-span-2 rounded-2xl bg-gradient-card border border-border/50 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  Son Quizlər
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/teacher/my-quizzes")}
              >
                Hamısına Bax
              </Button>
            </div>

            <div className="space-y-4">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                  ))
                : recentQuizzes.length === 0
                ? (
                    <p className="text-center text-sm text-muted-foreground py-8">
                      Hələ quiz yoxdur.{" "}
                      <button
                        className="text-primary underline"
                        onClick={() => navigate("/teacher/create")}
                      >
                        İlk quizinizi yaradın
                      </button>
                    </p>
                  )
                : recentQuizzes.map((quiz) => {
                    const quizMeta = meta[quiz.id];
                    const avgScore = quizMeta?.avg_score
                      ? Math.round(quizMeta.avg_score)
                      : null;
                    return (
                      <div
                        key={quiz.id}
                        className="flex items-center gap-4 rounded-xl bg-muted/30 p-4 transition-colors hover:bg-muted/50 cursor-pointer"
                        onClick={() =>
                          navigate(`/teacher/create?edit=${quiz.id}`)
                        }
                      >
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              {quiz.title}
                            </span>
                            <Badge
                              variant={
                                quiz.status === "published" ? "success" : "muted"
                              }
                            >
                              {quiz.status === "published"
                                ? "Aktiv"
                                : "Qaralama"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{quizMeta?.attempt_count ?? 0} oyun</span>
                            {avgScore !== null && (
                              <>
                                <span>•</span>
                                <span>Orta: {avgScore}%</span>
                              </>
                            )}
                          </div>
                        </div>
                        {avgScore !== null && (
                          <div className="w-24">
                            <Progress value={avgScore} className="h-2" />
                          </div>
                        )}
                      </div>
                    );
                  })}
            </div>
          </div>

          {/* Top Students */}
          <div className="rounded-2xl bg-gradient-card border border-border/50 p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/20">
                <Trophy className="h-5 w-5 text-secondary" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground">
                Ən Yaxşı Tələbələr
              </h2>
            </div>

            <div className="space-y-4">
              {studentsLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-xl" />
                  ))
                : topStudents.length === 0
                ? (
                    <p className="text-center text-sm text-muted-foreground py-8">
                      Hələ nəticə yoxdur.
                    </p>
                  )
                : topStudents.map((student, index) => (
                    <div key={student.name} className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold shrink-0",
                          index === 0
                            ? "bg-warning/20 text-warning"
                            : index === 1
                            ? "bg-muted text-muted-foreground"
                            : index === 2
                            ? "bg-secondary/20 text-secondary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground truncate">
                          {student.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {student.quizzes} quiz tamamladı
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-primary">
                          {student.score}%
                        </div>
                        <div className="text-xs text-muted-foreground">orta</div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-6"
            onClick={() => navigate("/teacher/create")}
          >
            <PlusCircle className="h-6 w-6 text-primary" />
            <span>Quiz Yarat</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-6"
            onClick={() => navigate("/teacher/my-quizzes")}
          >
            <FileText className="h-6 w-6 text-secondary" />
            <span>Quizlərim</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-6"
            onClick={() => navigate("/teacher/ai-assistant")}
          >
            <BarChart3 className="h-6 w-6 text-accent" />
            <span>AI Köməkçi</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-6"
            onClick={() => navigate("/teacher/question-bank")}
          >
            <Users className="h-6 w-6 text-success" />
            <span>Sual Bankı</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
