import { useEffect } from 'react';

// A genuine user gesture is required to unlock audio on Safari/iOS, which
// (unlike Chrome) does not auto-resume a suspended AudioContext on its own.
const UNLOCK_EVENTS = ['pointerdown', 'keydown'] as const;

/**
 * Keeps `audioContext` running across the two ways mobile browsers can leave
 * it stuck:
 *  - Never started: resumed on the first real gesture (pointerdown/keydown),
 *    then the listeners are removed so they don't linger for the app's life.
 *  - Interrupted: iOS drops a running context to `'interrupted'` (and
 *    sometimes `'suspended'`) on backgrounding or an incoming call, and does
 *    not recover it by itself — re-resumed once the tab is visible again.
 */
export function useAudioUnlock(audioContext: AudioContext): void {
  useEffect(() => {
    if (audioContext.state === 'running') {
      return;
    }

    const unlock = () => {
      if (audioContext.state !== 'running') {
        audioContext.resume().catch(() => undefined);
      }
      UNLOCK_EVENTS.forEach((event) =>
        window.removeEventListener(event, unlock),
      );
    };

    UNLOCK_EVENTS.forEach((event) => window.addEventListener(event, unlock));

    return () => {
      UNLOCK_EVENTS.forEach((event) =>
        window.removeEventListener(event, unlock),
      );
    };
  }, [audioContext]);

  useEffect(() => {
    const resumeIfInterrupted = () => {
      // 'interrupted' is iOS-specific and missing from TS's AudioContextState.
      const state = audioContext.state as string;
      if (
        document.visibilityState === 'visible' &&
        (state === 'suspended' || state === 'interrupted')
      ) {
        audioContext.resume().catch(() => undefined);
      }
    };

    document.addEventListener('visibilitychange', resumeIfInterrupted);
    audioContext.addEventListener('statechange', resumeIfInterrupted);

    return () => {
      document.removeEventListener('visibilitychange', resumeIfInterrupted);
      audioContext.removeEventListener('statechange', resumeIfInterrupted);
    };
  }, [audioContext]);
}
