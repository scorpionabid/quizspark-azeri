import { useQuery } from "@tanstack/react-query";
import { BarChart3, Sparkles, Coins, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface GenerationStatsProps {
  className?: string;
}

export function GenerationStats({ className }: GenerationStatsProps) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['ai-generation-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      // Get today's usage
      const { data: todayUsage } = await supabase
        .from('ai_daily_usage')
        .select('total_requests, total_tokens')
        .eq('user_id', user.id)
        .eq('usage_date', today)
        .single();

      // Get weekly usage
      const { data: weeklyUsage } = await supabase
        .from('ai_daily_usage')
        .select('total_requests, total_tokens')
        .eq('user_id', user.id)
        .gte('usage_date', weekAgo.toISOString().split('T')[0]);

      // Get questions created today from question_bank
      const { count: todayQuestions } = await supabase
        .from('question_bank')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', today);

      // Get weekly question count
      const { count: weeklyQuestions } = await supabase
        .from('question_bank')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', weekAgo.toISOString());

      // Get user's daily limit
      const { data: config } = await supabase
        .from('ai_config')
        .select('teacher_daily_limit')
        .single();

      const dailyLimit = config?.teacher_daily_limit || 500;
      const todayTokens = todayUsage?.total_tokens || 0;
      const weeklyTokens = weeklyUsage?.reduce((sum, d) => sum + (d.total_tokens || 0), 0) || 0;
      
      return {
        todayQuestions: todayQuestions || 0,
        weeklyQuestions: weeklyQuestions || 0,
        todayTokens,
        weeklyTokens,
        dailyLimit,
        todayRequests: todayUsage?.total_requests || 0,
        weeklyRequests: weeklyUsage?.reduce((sum, d) => sum + (d.total_requests || 0), 0) || 0,
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className={className}>
        <div className="rounded-xl bg-gradient-card border border-border/50 p-4">
          <Skeleton className="h-4 w-32 mb-3" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const usagePercent = Math.min((stats.todayTokens / (stats.dailyLimit * 100)) * 100, 100);

  return (
    <div className={className}>
      <div className="rounded-xl bg-gradient-card border border-border/50 p-4">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Yaratma Statistikası</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-success" />
              <span className="text-xs text-muted-foreground">Bugün</span>
            </div>
            <p className="text-xl font-bold text-foreground">{stats.todayQuestions}</p>
            <p className="text-xs text-muted-foreground">sual yaradıldı</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs text-muted-foreground">Bu həftə</span>
            </div>
            <p className="text-xl font-bold text-foreground">{stats.weeklyQuestions}</p>
            <p className="text-xs text-muted-foreground">sual yaradıldı</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-warning" />
              <span className="text-xs text-muted-foreground">Token istifadəsi</span>
            </div>
            <span className="text-xs font-medium text-foreground">
              {stats.todayTokens.toLocaleString()} / {(stats.dailyLimit * 100).toLocaleString()}
            </span>
          </div>
          <Progress value={usagePercent} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            {usagePercent.toFixed(0)}% istifadə edilib
          </p>
        </div>
      </div>
    </div>
  );
}
