import { useCallback, useEffect, useState } from 'react';
import { KeyHandlers } from './types';

interface UseKeyboardProps {
  keyMappings: Record<string, KeyHandlers>;
}
export default function useKeyboard({ keyMappings }: UseKeyboardProps) {
  const [_keysPressed, setKeysPressed] = useState<string[]>([]);

  const keyDownHandler = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      setKeysPressed((prev) => {
        if (prev.includes(key)) {
          return prev;
        }

        keyMappings[key]?.onKeyDown?.();
        return [...prev, key];
      });
    },
    [keyMappings],
  );

  const keyUpHandler = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      setKeysPressed((prev) => {
        if (!prev.includes(key)) {
          return prev;
        }

        keyMappings[key]?.onKeyUp?.();
        return prev.filter((k) => k !== key);
      });
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
