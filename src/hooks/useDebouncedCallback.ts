import { useCallback, useRef } from 'react';

/**
 * useDebouncedCallback
 * 创建一个防抖函数的稳定引用
 */
export function useDebouncedCallback<T extends (...args: any[]) => void>(fn: T, delayMs: number) {
  const timerRef = useRef<number | undefined>(undefined);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => fn(...args), delayMs);
    },
    [fn, delayMs]
  );
}

export default useDebouncedCallback;


