import { useState, useEffect } from 'react';

/**
 * Verilmiş dəyəri müəyyən edilmiş gecikmə ilə qaytaran hook.
 * Axtarış sətiri kimi tez-tez dəyişən dəyərlər üçün DB sorğularını azaltmaq məqsədilə istifadə olunur.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
