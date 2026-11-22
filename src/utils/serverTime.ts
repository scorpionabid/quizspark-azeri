import { supabase } from '@/integrations/supabase/client';

let serverTimeOffsetMs = 0;
let lastSyncTimestamp = 0;
let syncPromise: Promise<number> | null = null;

/**
 * Synchronizes client clock with database server time.
 * Calculates network latency to provide accurate offset.
 */
export async function syncServerClock(force = false): Promise<number> {
  const now = Date.now();
  // Throttle sync to at most once per 60 seconds unless forced
  if (!force && lastSyncTimestamp > 0 && now - lastSyncTimestamp < 60000) {
    return serverTimeOffsetMs;
  }

  if (syncPromise) {
    return syncPromise;
  }

  syncPromise = (async () => {
    try {
      const clientBefore = Date.now();
      const { data, error } = await supabase.rpc('get_current_server_time');
      const clientAfter = Date.now();

      if (!error && data) {
        const serverTimestamp = new Date(data).getTime();
        const latency = (clientAfter - clientBefore) / 2;
        serverTimeOffsetMs = serverTimestamp - (clientBefore + latency);
        lastSyncTimestamp = Date.now();
      }
    } catch (e) {
      console.warn('Clock synchronization skipped (using client time):', e);
    } finally {
      syncPromise = null;
    }
    return serverTimeOffsetMs;
  })();

  return syncPromise;
}

/**
 * Returns current timestamp in milliseconds, synchronized with server clock.
 */
export function getSynchronizedServerNow(): number {
  return Date.now() + serverTimeOffsetMs;
}
