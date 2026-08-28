import { supabase } from '@/integrations/supabase/client';

export type ErrorSeverity = 'critical' | 'error' | 'warning';
export type ErrorType = 'runtime_error' | 'api_error' | 'network_error' | 'unhandled_rejection' | 'component_crash';

export interface LogErrorParams {
  message: string;
  error?: Error | unknown;
  stackTrace?: string;
  componentName?: string;
  urlPath?: string;
  severity?: ErrorSeverity;
  errorType?: ErrorType;
  userId?: string | null;
  extraInfo?: Record<string, unknown>;
}

export interface LogAuditParams {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'ROLE_CHANGE' | 'PERMISSION_CHANGE' | 'SETTINGS_CHANGE' | 'AUTH' | 'BULK_ACTION';
  entityType: 'quiz' | 'question' | 'category' | 'user' | 'role' | 'permission' | 'ai_config' | 'system';
  entityId?: string | null;
  description: string;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  userId?: string | null;
}

// In-memory cache for throttling duplicate errors (10 second debounce window)
const recentErrors = new Map<string, number>();
const THROTTLE_MS = 10000;

function getDeviceInfo() {
  if (typeof window === 'undefined') return null;

  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let os = 'Unknown';

  // Detect browser
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('SamsungBrowser')) browser = 'Samsung Internet';
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
  else if (ua.includes('Trident')) browser = 'Internet Explorer';
  else if (ua.includes('Edge') || ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';

  // Detect OS
  if (ua.includes('Win')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return {
    browser,
    os,
    userAgent: ua,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    isOnline: navigator.onLine,
    language: navigator.language,
  };
}

export const loggerService = {
  /**
   * Log an unexpected exception or frontend runtime crash to system_error_logs
   */
  async logError({
    message,
    error,
    stackTrace,
    componentName,
    urlPath,
    severity = 'error',
    errorType = 'runtime_error',
    userId,
    extraInfo,
  }: LogErrorParams): Promise<void> {
    try {
      const currentUrl = urlPath || (typeof window !== 'undefined' ? window.location.pathname + window.location.search : '');
      const key = `${message}:${currentUrl}:${componentName || ''}`;
      const now = Date.now();

      // Check throttle window
      const lastLogged = recentErrors.get(key);
      if (lastLogged && now - lastLogged < THROTTLE_MS) {
        return; // Skip duplicate spam
      }
      recentErrors.set(key, now);

      // Clean up old entries
      if (recentErrors.size > 50) {
        for (const [k, time] of recentErrors.entries()) {
          if (now - time > THROTTLE_MS) {
            recentErrors.delete(k);
          }
        }
      }

      // Extract stack trace if available
      let extractedStack = stackTrace;
      if (!extractedStack && error instanceof Error) {
        extractedStack = error.stack;
      }

      // Get current user if not provided
      let finalUserId = userId;
      if (!finalUserId) {
        const { data } = await supabase.auth.getSession();
        finalUserId = data?.session?.user?.id || null;
      }

      const deviceInfo = {
        ...getDeviceInfo(),
        extra: extraInfo || null,
      };

      await supabase.from('system_error_logs').insert({
        user_id: finalUserId,
        error_type: errorType,
        message: message.slice(0, 1000), // Protect against huge payloads
        stack_trace: extractedStack ? extractedStack.slice(0, 5000) : null,
        component_name: componentName || null,
        url_path: currentUrl || '/',
        device_info: deviceInfo,
        severity,
        is_resolved: false,
      });
    } catch (e) {
      // Fail gracefully without crashing the application
      console.warn('Failed to send error log to Supabase:', e);
    }
  },

  /**
   * Log an audit event (creation, modification, deletion, permission change) to audit_logs
   */
  async logAudit({
    action,
    entityType,
    entityId,
    description,
    oldValues,
    newValues,
    userId,
  }: LogAuditParams): Promise<void> {
    try {
      let finalUserId = userId;
      if (!finalUserId) {
        const { data } = await supabase.auth.getSession();
        finalUserId = data?.session?.user?.id || null;
      }

      const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : null;

      await supabase.from('audit_logs').insert({
        user_id: finalUserId,
        action,
        entity_type: entityType,
        entity_id: entityId || null,
        description,
        old_values: oldValues || null,
        new_values: newValues || null,
        user_agent: userAgent,
      });
    } catch (e) {
      console.warn('Failed to record audit log:', e);
    }
  },
};
