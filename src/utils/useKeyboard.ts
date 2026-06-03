import { useCallback, useEffect, useRef } from 'react';
import { KeyHandlers } from './types';

interface UseKeyboardProps {
  keyMappings: Record<string, KeyHandlers>;
}
export default function useKeyboard({ keyMappings }: UseKeyboardProps) {
  // Track held keys in a ref (mutable, imperative) rather than state. The handlers
  // fire audio side effects, so they must run OUTSIDE any setState updater:
  // StrictMode double-invokes updaters, which previously double-triggered notes.
  const pressed = useRef<Set<string>>(new Set());

  const keyDownHandler = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (pressed.current.has(key)) {
        return;
      }
      pressed.current.add(key);
      keyMappings[key]?.onKeyDown?.();
    },
    [keyMappings],
  );

  const keyUpHandler = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (!pressed.current.has(key)) {
        return;
      }
      pressed.current.delete(key);
      keyMappings[key]?.onKeyUp?.();
    },
    [keyMappings],
  );

  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
    };
  }, [keyDownHandler, keyUpHandler]);
}
