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

  // Losing focus means the matching keyup is never delivered to this document,
  // so held keys would stay "pressed" forever: the note keeps sounding and the
  // next keydown for that key is swallowed by the guard above.
  const releaseAllHandler = useCallback(() => {
    if (pressed.current.size === 0) {
      return;
    }
    const keys = [...pressed.current];
    pressed.current.clear();
    keys.forEach((key) => keyMappings[key]?.onKeyUp?.());
  }, [keyMappings]);

  const visibilityChangeHandler = useCallback(() => {
    if (document.visibilityState === 'hidden') {
      releaseAllHandler();
    }
  }, [releaseAllHandler]);

  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    window.addEventListener('blur', releaseAllHandler);
    document.addEventListener('visibilitychange', visibilityChangeHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
      window.removeEventListener('blur', releaseAllHandler);
      document.removeEventListener('visibilitychange', visibilityChangeHandler);
    };
  }, [
    keyDownHandler,
    keyUpHandler,
    releaseAllHandler,
    visibilityChangeHandler,
  ]);
}
