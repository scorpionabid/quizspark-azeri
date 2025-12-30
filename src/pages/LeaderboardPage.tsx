import { Trophy, Medal, Star, TrendingUp, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  quizzesCompleted: number;
  streak: number;
  badge?: string;
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "Əli Həsənov", avatar: "👨‍🎓", score: 9850, quizzesCompleted: 145, streak: 12, badge: "🏆" },
  { rank: 2, name: "Leyla Məmmədova", avatar: "👩‍🎓", score: 9420, quizzesCompleted: 138, streak: 8, badge: "🥈" },
  { rank: 3, name: "Tural Quliyev", avatar: "🧑‍🎓", score: 8990, quizzesCompleted: 125, streak: 15, badge: "🥉" },
  { rank: 4, name: "Nigar Əliyeva", avatar: "👩‍💼", score: 8750, quizzesCompleted: 120, streak: 6 },
  { rank: 5, name: "Orxan Hüseynov", avatar: "👨‍💻", score: 8320, quizzesCompleted: 112, streak: 4 },
  { rank: 6, name: "Günel Rəhimova", avatar: "👩‍🔬", score: 7980, quizzesCompleted: 105, streak: 9 },
  { rank: 7, name: "Kamran Nəsirov", avatar: "🧑‍🏫", score: 7650, quizzesCompleted: 98, streak: 3 },
  { rank: 8, name: "Aytac Sultanova", avatar: "👩‍🎨", score: 7420, quizzesCompleted: 94, streak: 7 },
  { rank: 9, name: "Farid Əhmədov", avatar: "👨‍⚕️", score: 7180, quizzesCompleted: 89, streak: 2 },
  { rank: 10, name: "Səbinə Vəliyeva", avatar: "👩‍💻", score: 6950, quizzesCompleted: 85, streak: 5 },
];

export default function LeaderboardPage() {
  const topThree = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);

  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-2 text-sm text-secondary">
            <Trophy className="h-4 w-4" />
            <span>Həftəlik Liderlik Lövhəsi</span>
          </div>
          <h1 className="mb-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Ən Yaxşı Oyunçular
          </h1>
          <p className="text-muted-foreground">
            Bu həftə ən yüksək bal toplayan tələbələr
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="mb-8 flex items-end justify-center gap-4">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <div className="mb-2 text-4xl">{topThree[1].avatar}</div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-gray-300 to-gray-400 text-2xl font-bold text-gray-800">
              2
            </div>
            <div className="mt-3 h-24 w-20 rounded-t-lg bg-gradient-to-b from-gray-400/50 to-gray-500/50 sm:w-28" />
            <div className="w-20 rounded-b-lg bg-card p-2 text-center sm:w-28">
              <p className="text-sm font-medium text-foreground truncate">{topThree[1].name}</p>
              <p className="text-xs text-muted-foreground">{topThree[1].score.toLocaleString()} xal</p>
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <Crown className="absolute -top-6 left-1/2 h-8 w-8 -translate-x-1/2 text-warning" />
              <div className="text-5xl">{topThree[0].avatar}</div>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600 text-2xl font-bold text-yellow-900 shadow-glow">
              1
            </div>
            <div className="mt-3 h-32 w-24 rounded-t-lg bg-gradient-to-b from-yellow-400/50 to-yellow-600/50 sm:w-32" />
            <div className="w-24 rounded-b-lg bg-card p-2 text-center sm:w-32">
              <p className="text-sm font-medium text-foreground truncate">{topThree[0].name}</p>
              <p className="text-xs text-warning font-semibold">{topThree[0].score.toLocaleString()} xal</p>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <div className="mb-2 text-4xl">{topThree[2].avatar}</div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-amber-600 to-amber-800 text-2xl font-bold text-amber-100">
              3
            </div>
            <div className="mt-3 h-20 w-20 rounded-t-lg bg-gradient-to-b from-amber-600/50 to-amber-800/50 sm:w-28" />
            <div className="w-20 rounded-b-lg bg-card p-2 text-center sm:w-28">
              <p className="text-sm font-medium text-foreground truncate">{topThree[2].name}</p>
              <p className="text-xs text-muted-foreground">{topThree[2].score.toLocaleString()} xal</p>
            </div>
          </div>
        </div>

        {/* Rest of Leaderboard */}
        <div className="rounded-2xl bg-gradient-card border border-border/50 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 border-b border-border/50 bg-muted/30 px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:px-6">
            <div className="col-span-1">Sıra</div>
            <div className="col-span-5 sm:col-span-4">Oyunçu</div>
            <div className="col-span-3 text-right sm:col-span-2">Xal</div>
            <div className="col-span-3 hidden text-center sm:block">Quizlər</div>
            <div className="col-span-3 text-right sm:col-span-2">Seriya</div>
          </div>

          {rest.map((entry, index) => (
            <div
              key={entry.rank}
              className={cn(
                "grid grid-cols-12 gap-4 px-4 py-4 transition-colors hover:bg-muted/30 sm:px-6",
                index !== rest.length - 1 && "border-b border-border/30"
              )}
            >
              <div className="col-span-1 flex items-center font-bold text-muted-foreground">
                {entry.rank}
              </div>
              <div className="col-span-5 flex items-center gap-3 sm:col-span-4">
                <div className="text-2xl">{entry.avatar}</div>
                <span className="font-medium text-foreground truncate">{entry.name}</span>
              </div>
              <div className="col-span-3 flex items-center justify-end sm:col-span-2">
                <span className="font-semibold text-primary">{entry.score.toLocaleString()}</span>
              </div>
              <div className="col-span-3 hidden items-center justify-center sm:flex">
                <Badge variant="muted">{entry.quizzesCompleted}</Badge>
              </div>
              <div className="col-span-3 flex items-center justify-end gap-1 sm:col-span-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="font-medium text-success">{entry.streak}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-warning" />
            <span>Xal - Ümumi bal</span>
          </div>
          <div className="flex items-center gap-2">
            <Medal className="h-4 w-4 text-primary" />
            <span>Quizlər - Tamamlanan</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <span>Seriya - Ardıcıl günlər</span>
          </div>
        </div>
      </div>
    </div>
  );
}
