import { useEffect } from 'react';

const UNLOCK_EVENTS = ['pointerdown', 'keydown'] as const;

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
