import { 
  Users, 
  BookOpen, 
  Shield, 
  Activity,
  TrendingUp,
  AlertTriangle,
  Server,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface SystemStat {
  label: string;
  value: number;
  max: number;
  color: string;
}

const systemStats: SystemStat[] = [
  { label: "CPU İstifadəsi", value: 45, max: 100, color: "bg-primary" },
  { label: "Yaddaş", value: 68, max: 100, color: "bg-secondary" },
  { label: "Disk", value: 32, max: 100, color: "bg-accent" },
  { label: "Şəbəkə", value: 25, max: 100, color: "bg-success" },
];

const recentActivity = [
  { id: 1, action: "Yeni istifadəçi qeydiyyatı", user: "student@test.com", time: "5 dəq əvvəl", type: "user" },
  { id: 2, action: "Quiz yaradıldı", user: "teacher@test.com", time: "15 dəq əvvəl", type: "quiz" },
  { id: 3, action: "Rol dəyişikliyi", user: "admin@test.com", time: "1 saat əvvəl", type: "permission" },
  { id: 4, action: "Sistem yeniləməsi", user: "Sistem", time: "3 saat əvvəl", type: "system" },
];

const alerts = [
  { id: 1, message: "AI API limiti 80%-ə çatdı", severity: "warning" },
  { id: 2, message: "5 yeni istifadəçi təsdiq gözləyir", severity: "info" },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Admin Paneli</h1>
          <p className="text-muted-foreground">Sistem idarəetməsi və monitorinq</p>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-8 space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl p-4",
                  alert.severity === "warning" ? "bg-warning/10 border border-warning/30" : "bg-primary/10 border border-primary/30"
                )}
              >
                <AlertTriangle className={cn(
                  "h-5 w-5",
                  alert.severity === "warning" ? "text-warning" : "text-primary"
                )} />
                <span className="flex-1 text-sm text-foreground">{alert.message}</span>
                <Button variant="ghost" size="sm">
                  Bax
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-gradient-card border border-border/50 p-5 card-hover">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Users className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold text-foreground">1,245</div>
            <div className="text-sm text-muted-foreground">Ümumi İstifadəçilər</div>
            <Badge variant="success" className="mt-2">+12% bu ay</Badge>
          </div>

          <div className="rounded-2xl bg-gradient-card border border-border/50 p-5 card-hover">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20 text-secondary">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold text-foreground">156</div>
            <div className="text-sm text-muted-foreground">Aktiv Quizlər</div>
            <Badge variant="success" className="mt-2">+8 yeni</Badge>
          </div>

          <div className="rounded-2xl bg-gradient-card border border-border/50 p-5 card-hover">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-accent">
              <Shield className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold text-foreground">24</div>
            <div className="text-sm text-muted-foreground">Müəllimlər</div>
            <Badge variant="muted" className="mt-2">Sabit</Badge>
          </div>

          <div className="rounded-2xl bg-gradient-card border border-border/50 p-5 card-hover">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-success/20 text-success">
              <Activity className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold text-foreground">89%</div>
            <div className="text-sm text-muted-foreground">Sistem Sağlamlığı</div>
            <Badge variant="success" className="mt-2">Normal</Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* System Stats */}
          <div className="lg:col-span-1 rounded-2xl bg-gradient-card border border-border/50 p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                <Server className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground">Sistem Statusu</h2>
            </div>

            <div className="space-y-4">
              {systemStats.map((stat) => (
                <div key={stat.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{stat.label}</span>
                    <span className="font-medium text-foreground">{stat.value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full transition-all", stat.color)}
                      style={{ width: `${stat.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 rounded-2xl bg-gradient-card border border-border/50 p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/20">
                <TrendingUp className="h-5 w-5 text-secondary" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground">Son Fəaliyyətlər</h2>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={activity.id}
                  className={cn(
                    "flex items-center gap-4 rounded-xl bg-muted/30 p-4",
                    index !== recentActivity.length - 1 && "border-b border-border/30"
                  )}
                >
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    activity.type === "user" ? "bg-primary/20 text-primary" :
                    activity.type === "quiz" ? "bg-secondary/20 text-secondary" :
                    activity.type === "permission" ? "bg-accent/20 text-accent" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {activity.type === "user" ? <Users className="h-5 w-5" /> :
                     activity.type === "quiz" ? <BookOpen className="h-5 w-5" /> :
                     activity.type === "permission" ? <Shield className="h-5 w-5" /> :
                     <Cpu className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{activity.action}</div>
                    <div className="text-sm text-muted-foreground">{activity.user}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline" className="h-auto flex-col gap-2 p-6">
            <Users className="h-6 w-6 text-primary" />
            <span>İstifadəçilər</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 p-6">
            <Shield className="h-6 w-6 text-secondary" />
            <span>İcazələr</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 p-6">
            <Cpu className="h-6 w-6 text-accent" />
            <span>AI Konfiq</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 p-6">
            <Server className="h-6 w-6 text-success" />
            <span>Sistem</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
