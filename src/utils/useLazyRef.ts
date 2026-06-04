import { useRef } from 'react';

/**
 * Like `useRef`, but the initial value is produced lazily by `init()` on the
 * first render only — instead of being constructed on every render and thrown
 * away (the `useRef(new Node())` anti-pattern). Use this for Web Audio nodes so
 * we don't allocate a throwaway node per render. `.current` is always present.
 */
export function useLazyRef<T>(init: () => T): { current: T } {
  const ref = useRef<T | null>(null);
  if (ref.current === null) {
    ref.current = init();
  }
  return ref as { current: T };
}
