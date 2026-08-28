import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AuditLogItem {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  description: string;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export interface SystemErrorLogItem {
  id: string;
  user_id: string | null;
  error_type: string;
  message: string;
  stack_trace: string | null;
  component_name: string | null;
  url_path: string;
  device_info: {
    browser?: string;
    os?: string;
    userAgent?: string;
    screenWidth?: number;
    screenHeight?: number;
    isOnline?: boolean;
    language?: string;
    extra?: Record<string, unknown>;
  } | null;
  severity: 'critical' | 'error' | 'warning';
  is_resolved: boolean;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export interface AuditFilters {
  search?: string;
  action?: string;
  entityType?: string;
  userId?: string;
}

export interface ErrorLogFilters {
  search?: string;
  severity?: string;
  isResolved?: boolean;
  errorType?: string;
}

/**
 * Fetch Audit Logs with filtering
 */
export function useAuditLogsList(filters?: AuditFilters) {
  return useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: async (): Promise<AuditLogItem[]> => {
      let query = supabase
        .from('audit_logs')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (filters?.action && filters.action !== 'all') {
        query = query.eq('action', filters.action);
      }
      if (filters?.entityType && filters.entityType !== 'all') {
        query = query.eq('entity_type', filters.entityType);
      }
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }

      const { data, error } = await query;
      if (error) {
        // Table might be created freshly or empty
        console.warn('Error fetching audit logs:', error);
        return [];
      }

      let results = (data ?? []) as unknown as AuditLogItem[];
      if (filters?.search?.trim()) {
        const s = filters.search.toLowerCase();
        results = results.filter(
          (item) =>
            item.description?.toLowerCase().includes(s) ||
            item.action?.toLowerCase().includes(s) ||
            item.entity_type?.toLowerCase().includes(s) ||
            item.profiles?.full_name?.toLowerCase().includes(s)
        );
      }

      return results;
    },
    staleTime: 30 * 1000,
  });
}

/**
 * Fetch System Error Logs with filtering
 */
export function useSystemErrorLogsList(filters?: ErrorLogFilters) {
  return useQuery({
    queryKey: ['system-error-logs', filters],
    queryFn: async (): Promise<SystemErrorLogItem[]> => {
      let query = supabase
        .from('system_error_logs')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (filters?.severity && filters.severity !== 'all') {
        query = query.eq('severity', filters.severity);
      }
      if (filters?.isResolved !== undefined) {
        query = query.eq('is_resolved', filters.isResolved);
      }
      if (filters?.errorType && filters.errorType !== 'all') {
        query = query.eq('error_type', filters.errorType);
      }

      const { data, error } = await query;
      if (error) {
        console.warn('Error fetching system error logs:', error);
        return [];
      }

      let results = (data ?? []) as unknown as SystemErrorLogItem[];
      if (filters?.search?.trim()) {
        const s = filters.search.toLowerCase();
        results = results.filter(
          (item) =>
            item.message?.toLowerCase().includes(s) ||
            item.component_name?.toLowerCase().includes(s) ||
            item.url_path?.toLowerCase().includes(s) ||
            item.profiles?.full_name?.toLowerCase().includes(s)
        );
      }

      return results;
    },
    staleTime: 15 * 1000,
  });
}

/**
 * Toggle resolution status of a system error log
 */
export function useResolveErrorLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ errorId, isResolved }: { errorId: string; isResolved: boolean }) => {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUserId = sessionData?.session?.user?.id || null;

      const { error } = await supabase
        .from('system_error_logs')
        .update({
          is_resolved: isResolved,
          resolved_by: isResolved ? currentUserId : null,
          resolved_at: isResolved ? new Date().toISOString() : null,
        })
        .eq('id', errorId);

      if (error) throw error;
    },
    onSuccess: (_, { isResolved }) => {
      queryClient.invalidateQueries({ queryKey: ['system-error-logs'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs-stats'] });
      toast.success(isResolved ? 'Xəta "Həll edildi" olaraq qeyd edildi' : 'Xəta statusu yeniləndi');
    },
    onError: (err: Error) => {
      toast.error(`Xəta statusu dəyişdirilə bilmədi: ${err.message}`);
    },
  });
}

/**
 * Get summary stats for Audit & Error Monitoring
 */
export function useAuditLogsStats() {
  return useQuery({
    queryKey: ['audit-logs-stats'],
    queryFn: async () => {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      // Total errors & unresolved criticals
      const { data: errors } = await supabase
        .from('system_error_logs')
        .select('severity, is_resolved, created_at');

      const totalErrors = errors?.length || 0;
      const unresolvedErrors = errors?.filter((e) => !e.is_resolved).length || 0;
      const criticalErrors = errors?.filter((e) => e.severity === 'critical' && !e.is_resolved).length || 0;
      const errors24h = errors?.filter((e) => e.created_at >= oneDayAgo).length || 0;

      // Total audit events
      const { count: totalAudits } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true });

      const { count: audits24h } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneDayAgo);

      return {
        totalErrors,
        unresolvedErrors,
        criticalErrors,
        errors24h,
        totalAudits: totalAudits || 0,
        audits24h: audits24h || 0,
      };
    },
    staleTime: 30 * 1000,
  });
}
