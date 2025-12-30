import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Clock, 
  PlusCircle,
  FileText,
  BarChart3,
  Trophy
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const stats: StatCard[] = [
  {
    title: "Ümumi Quizlər",
    value: "24",
    change: "+3 bu ay",
    changeType: "positive",
    icon: BookOpen,
    color: "text-primary",
  },
  {
    title: "Aktiv Tələbələr",
    value: "156",
    change: "+12 bu həftə",
    changeType: "positive",
    icon: Users,
    color: "text-secondary",
  },
  {
    title: "Orta Nəticə",
    value: "78%",
    change: "+5% artım",
    changeType: "positive",
    icon: TrendingUp,
    color: "text-success",
  },
  {
    title: "Gözləyən Yoxlamalar",
    value: "8",
    change: "3 yeni",
    changeType: "neutral",
    icon: Clock,
    color: "text-warning",
  },
];

const recentQuizzes = [
  { id: 1, title: "Cəbr Əsasları", plays: 45, avgScore: 82, status: "active" },
  { id: 2, title: "Həndəsə: Üçbucaqlar", plays: 38, avgScore: 75, status: "active" },
  { id: 3, title: "Tənliklər Sistemi", plays: 52, avgScore: 68, status: "draft" },
  { id: 4, title: "Faiz Hesablamaları", plays: 29, avgScore: 85, status: "active" },
];

const topStudents = [
  { name: "Əli Həsənov", score: 95, quizzes: 12 },
  { name: "Leyla Məmmədova", score: 92, quizzes: 10 },
  { name: "Tural Quliyev", score: 88, quizzes: 11 },
  { name: "Nigar Əliyeva", score: 85, quizzes: 9 },
];

export default function TeacherDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Müəllim Paneli</h1>
            <p className="text-muted-foreground">Quizlərinizi və tələbə nəticələrini idarə edin</p>
          </div>
          <Button variant="game" onClick={() => navigate('/teacher/create')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Yeni Quiz Yarat
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-2xl bg-gradient-card border border-border/50 p-5 card-hover"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-muted", stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <Badge 
                  variant={stat.changeType === 'positive' ? 'success' : stat.changeType === 'negative' ? 'destructive' : 'muted'}
                  className="text-xs"
                >
                  {stat.change}
                </Badge>
              </div>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
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
                <h2 className="font-display text-xl font-bold text-foreground">Son Quizlər</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/teacher/my-quizzes')}>
                Hamısına Bax
              </Button>
            </div>

            <div className="space-y-4">
              {recentQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex items-center gap-4 rounded-xl bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-medium text-foreground">{quiz.title}</span>
                      <Badge variant={quiz.status === 'active' ? 'success' : 'muted'}>
                        {quiz.status === 'active' ? 'Aktiv' : 'Qaralama'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{quiz.plays} oyun</span>
                      <span>•</span>
                      <span>Orta: {quiz.avgScore}%</span>
                    </div>
                  </div>
                  <div className="w-24">
                    <Progress value={quiz.avgScore} className="h-2" />
                  </div>
                  <Button variant="ghost" size="sm">
                    Redaktə
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Top Students */}
          <div className="rounded-2xl bg-gradient-card border border-border/50 p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/20">
                <Trophy className="h-5 w-5 text-secondary" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground">Ən Yaxşı Tələbələr</h2>
            </div>

            <div className="space-y-4">
              {topStudents.map((student, index) => (
                <div
                  key={student.name}
                  className="flex items-center gap-4"
                >
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                    index === 0 ? "bg-warning/20 text-warning" :
                    index === 1 ? "bg-muted text-muted-foreground" :
                    index === 2 ? "bg-secondary/20 text-secondary" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{student.name}</div>
                    <div className="text-xs text-muted-foreground">{student.quizzes} quiz tamamladı</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">{student.score}%</div>
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
            onClick={() => navigate('/teacher/create')}
          >
            <PlusCircle className="h-6 w-6 text-primary" />
            <span>Quiz Yarat</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto flex-col gap-2 p-6"
            onClick={() => navigate('/teacher/my-quizzes')}
          >
            <FileText className="h-6 w-6 text-secondary" />
            <span>Quizlərim</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto flex-col gap-2 p-6"
            onClick={() => navigate('/teacher/ai-assistant')}
          >
            <BarChart3 className="h-6 w-6 text-accent" />
            <span>AI Köməkçi</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto flex-col gap-2 p-6"
          >
            <Users className="h-6 w-6 text-success" />
            <span>Tələbələr</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
