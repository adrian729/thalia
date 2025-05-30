import { useEffect, useRef } from 'react';
import { AudioSetup } from './types';

export function useAudioSetup({
  sampleRate = 48000,
}: {
  sampleRate?: number;
}): AudioSetup {
  const audioContextRef = useRef<AudioContext>(
    new AudioContext({ sampleRate }),
  );
  const gainNodeRef = useRef<GainNode>(
    new GainNode(audioContextRef.current, { gain: 1 }),
  );

  useEffect(() => {
    gainNodeRef.current.connect(audioContextRef.current.destination);
  }, [gainNodeRef, audioContextRef]);

  return {
    audioContext: audioContextRef.current,
    mainNode: gainNodeRef.current,
  };
}
