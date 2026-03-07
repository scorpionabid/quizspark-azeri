import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

const HEALTH_URL = `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/health`;
const FETCH_TIMEOUT_MS = 3000;
const MIN_INTERVAL_MS = 5_000;
const MAX_INTERVAL_MS = 60_000;

/**
 * Monitors local Supabase availability and shows a persistent toast
 * when the connection is lost, dismissing it automatically on recovery.
 * Uses exponential backoff when unhealthy to reduce console noise.
 * Only active when VITE_SUPABASE_URL points to localhost/127.0.0.1.
 */
export function useSupabaseHealth() {
  const toastIdRef = useRef<string | number | undefined>();
  const isUnhealthyRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | undefined>();
  const currentIntervalRef = useRef(MIN_INTERVAL_MS);

  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
    if (!url || (!url.includes('127.0.0.1') && !url.includes('localhost'))) return;

    const schedule = (delayMs: number) => {
      intervalRef.current = setTimeout(check, delayMs);
    };

    const check = async () => {
      try {
        const res = await fetch(HEALTH_URL, {
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        });

        if (res.ok) {
          if (isUnhealthyRef.current) {
            isUnhealthyRef.current = false;
            currentIntervalRef.current = MIN_INTERVAL_MS;
            if (toastIdRef.current !== undefined) toast.dismiss(toastIdRef.current);
            toast.success('Supabase bağlantısı bərpa edildi', { duration: 3000 });
          }
          schedule(MIN_INTERVAL_MS);
        } else {
          throw new Error('unhealthy');
        }
      } catch {
        if (!isUnhealthyRef.current) {
          isUnhealthyRef.current = true;
          toastIdRef.current = toast.error(
            'Supabase əlçatmazdır — yenidən qoşulunur...',
            { duration: Infinity }
          );
        }
        // Exponential backoff: double the interval up to MAX_INTERVAL_MS
        currentIntervalRef.current = Math.min(
          currentIntervalRef.current * 2,
          MAX_INTERVAL_MS
        );
        schedule(currentIntervalRef.current);
      }
    };

    check();
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, []);
}
