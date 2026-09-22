import { useCallback, useEffect, useRef } from 'react';
import { setGainValueAtTime } from '../utils/audio';
import { useLazyRef } from '../utils/useLazyRef';

const IRs = {
  church: {
    path: 'IR_church.wav',
    gainFactor: 1,
  },
  basement: {
    path: 'IR_basement.wav',
    gainFactor: 1,
  },
  bathroom: {
    path: 'IR_bathroom.wav',
    gainFactor: 5.0,
  },
  pipe: {
    path: 'IR_pipe.wav',
    gainFactor: 5.0,
  },
};
export type IRType = keyof typeof IRs;

function getIRPath(selectedIR: IRType) {
  return `IR/${IRs[selectedIR].path}`;
}

const irCache = new Map<string, Promise<AudioBuffer>>();

function loadIR(
  audioContext: AudioContext,
  selectedIR: IRType,
): Promise<AudioBuffer> {
  const path = getIRPath(selectedIR);
  const cached = irCache.get(path);
  if (cached) return cached;

  const promise = fetch(path)
    .then((response) => response.arrayBuffer())
    .then((buffer) => audioContext.decodeAudioData(buffer));

  irCache.set(path, promise);
  promise.catch(() => irCache.delete(path));

  return promise;
}

export function useReverb({
  selectedIR = 'basement',
  dryGain = 0.5,
  wetGain = 0.5,
  destination,
  audioContext,
}: {
  selectedIR?: IRType;
  dryGain?: number;
  wetGain?: number;
  destination: AudioNode;
  audioContext: AudioContext;
}): {
  dry: AudioNode;
  wet: AudioNode;
  setDryGain: (value: number) => void;
  setWetGain: (value: number) => void;
  setSelectedIR: (selectedIR: IRType) => void;
} {
  const dryGainRef = useLazyRef(
    () => new GainNode(audioContext, { gain: dryGain }),
  );
  const IRFactorGainRef = useLazyRef(
    () => new GainNode(audioContext, { gain: IRs[selectedIR].gainFactor }),
  );
  const wetGainRef = useLazyRef(
    () => new GainNode(audioContext, { gain: wetGain }),
  );
  const convolverRef = useLazyRef(
    () => new ConvolverNode(audioContext, { buffer: null }),
  );
  const latestRequestedIRRef = useRef<IRType>(selectedIR);

  useEffect(() => {
    const convolver = convolverRef.current;
    const wet = wetGainRef.current;
    const irFactor = IRFactorGainRef.current;
    const dry = dryGainRef.current;

    convolver.connect(wet);
    wet.connect(irFactor);
    irFactor.connect(destination);
    dry.connect(destination);

    // Disconnect on unmount so a StrictMode remount (or a destination change)
    // doesn't leave doubled routing edges feeding the bus.
    return () => {
      convolver.disconnect(wet);
      wet.disconnect(irFactor);
      irFactor.disconnect(destination);
      dry.disconnect(destination);
    };
  }, [convolverRef, wetGainRef, IRFactorGainRef, dryGainRef, destination]);

  const setSelectedIR = useCallback(
    async (selectedIR: IRType) => {
      console.info('Setting selected IR:', selectedIR);

      latestRequestedIRRef.current = selectedIR;

      try {
        const audioBuffer = await loadIR(audioContext, selectedIR);
        if (latestRequestedIRRef.current !== selectedIR) return;

        convolverRef.current.buffer = audioBuffer;
        setGainValueAtTime({
          gain: IRs[selectedIR].gainFactor,
          timeElapse: 0.05,
          gainNode: IRFactorGainRef.current,
          audioContext,
        });
      } catch (error) {
        if (latestRequestedIRRef.current !== selectedIR) return;
        console.error('Failed to load impulse response:', selectedIR, error);
      }
    },
    [audioContext, convolverRef, IRFactorGainRef],
  );

  useEffect(() => {
    setSelectedIR(selectedIR);
  }, [selectedIR, setSelectedIR]);

  const setDryGain = useCallback(
    (gain: number) =>
      setGainValueAtTime({
        gain,
        timeElapse: 0.05,
        gainNode: dryGainRef.current,
        audioContext,
      }),
    [audioContext, dryGainRef],
  );

  const setWetGain = useCallback(
    (gain: number) =>
      setGainValueAtTime({
        gain,
        timeElapse: 0.05,
        gainNode: wetGainRef.current,
        audioContext,
      }),
    [audioContext, wetGainRef],
  );

  return {
    dry: dryGainRef.current,
    wet: convolverRef.current,
    setDryGain,
    setWetGain,
    setSelectedIR,
  };
}
