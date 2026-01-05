import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, Zap, Calendar, TrendingUp } from "lucide-react";
import { AIUsageStats } from "@/types/ai-config";

interface UsageStatsCardProps {
  stats: AIUsageStats | null;
  dailyLimit: number;
  isLoading?: boolean;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export function UsageStatsCard({ stats, dailyLimit, isLoading }: UsageStatsCardProps) {
  const todayPercentage = stats ? Math.min((stats.today.requests / dailyLimit) * 100, 100) : 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            İstifadə Statistikası
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          İstifadə Statistikası
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Period stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-primary/10">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <Zap className="h-4 w-4" />
              <span className="text-xs font-medium">Bugün</span>
            </div>
            <p className="text-2xl font-bold">{formatNumber(stats?.today.requests || 0)}</p>
            <p className="text-xs text-muted-foreground">
              {formatNumber(stats?.today.tokens || 0)} token
            </p>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center justify-center gap-1 text-secondary-foreground mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium">Bu həftə</span>
            </div>
            <p className="text-2xl font-bold">{formatNumber(stats?.week.requests || 0)}</p>
            <p className="text-xs text-muted-foreground">
              {formatNumber(stats?.week.tokens || 0)} token
            </p>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-muted">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Bu ay</span>
            </div>
            <p className="text-2xl font-bold">{formatNumber(stats?.month.requests || 0)}</p>
            <p className="text-xs text-muted-foreground">
              {formatNumber(stats?.month.tokens || 0)} token
            </p>
          </div>
        </div>

        {/* Daily limit progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Gündəlik limit</span>
            <span className="font-medium">
              {stats?.today.requests.toLocaleString() || 0} / {dailyLimit.toLocaleString()}
            </span>
          </div>
          <Progress 
            value={todayPercentage} 
            className={todayPercentage > 80 ? "bg-destructive/20" : ""}
          />
          {todayPercentage > 80 && (
            <p className="text-xs text-destructive">
              Diqqət: Gündəlik limitin {Math.round(todayPercentage)}%-i istifadə edilib
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
