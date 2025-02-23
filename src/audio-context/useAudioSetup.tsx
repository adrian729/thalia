import { useEffect, useRef } from "react";
import { AudioSetup } from "./types";

export function useAudioSetup({
  sampleRate = 48000,
}: {
  sampleRate?: number;
}): AudioSetup {
  const audioContextRef = useRef<AudioContext>(
    new AudioContext({ sampleRate })
  );
  const mainNodeRef = useRef<AudioNode>(
    new GainNode(audioContextRef.current, { gain: 1 })
  );

  useEffect(() => {
    const audioContext = audioContextRef?.current;
    const mainNode = mainNodeRef?.current;
    if (audioContextRef.current && mainNode) {
      mainNode.connect(audioContext.destination);
    }
  }, [audioContextRef, mainNodeRef]);

  return {
    audioContext: audioContextRef.current,
    mainNode: mainNodeRef.current,
  };
}
