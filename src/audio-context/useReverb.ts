import { useCallback, useEffect, useRef } from 'react';
import { setGainValueAtTime } from '../utils/audio';

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
  const dryGainRef = useRef<GainNode>(
    new GainNode(audioContext, { gain: dryGain }),
  );
  const IRFactorGainRef = useRef<GainNode>(
    new GainNode(audioContext, { gain: IRs[selectedIR].gainFactor }),
  );
  const wetGainRef = useRef<GainNode>(
    new GainNode(audioContext, { gain: wetGain }),
  );
  const convolverRef = useRef<ConvolverNode>(
    new ConvolverNode(audioContext, { buffer: null }),
  );

  useEffect(() => {
    convolverRef.current.connect(wetGainRef.current);
    wetGainRef.current.connect(IRFactorGainRef.current);
    IRFactorGainRef.current.connect(destination);
    dryGainRef.current.connect(destination);
  }, [
    convolverRef,
    dryGainRef,
    IRFactorGainRef,
    wetGainRef,
    destination,
    audioContext,
  ]);

  const setSelectedIR = useCallback(
    async (selectedIR: IRType) => {
      console.info('Setting selected IR:', selectedIR);
      fetch(getIRPath(selectedIR)).then((response) =>
        response.arrayBuffer().then((buffer) => {
          audioContext.decodeAudioData(buffer).then((audioBuffer) => {
            convolverRef.current.buffer = audioBuffer;
            setGainValueAtTime({
              gain: IRs[selectedIR].gainFactor,
              timeElapse: 0.05,
              gainNode: IRFactorGainRef.current,
              audioContext,
            });
          });
        }),
      );
    },
    [audioContext, convolverRef, IRFactorGainRef],
  );

  useEffect(() => {
    setSelectedIR(selectedIR);
  }, [selectedIR, setSelectedIR]);

  return {
    dry: dryGainRef.current,
    wet: convolverRef.current,
    setDryGain: (gain: number) =>
      setGainValueAtTime({
        gain,
        timeElapse: 0.05,
        gainNode: dryGainRef.current,
        audioContext,
      }),
    setWetGain: (gain: number) =>
      setGainValueAtTime({
        gain,
        timeElapse: 0.05,
        gainNode: wetGainRef.current,
        audioContext,
      }),
    setSelectedIR,
  };
}
