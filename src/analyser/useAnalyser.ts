import { useEffect, useMemo } from 'react';
import { useLazyRef } from '../utils/useLazyRef';

const FFT_SIZE = 2048;

export default function useAnalyser({
  nodeToAnalyze,
  audioContext,
  precission = 'uint',
}: {
  nodeToAnalyze: AudioNode;
  audioContext: AudioContext;
  precission?: 'float' | 'uint';
}) {
  const analyserRef = useLazyRef(
    () =>
      new AnalyserNode(audioContext, {
        fftSize: FFT_SIZE,
        minDecibels: -90,
        maxDecibels: -10,
        smoothingTimeConstant: 0.85,
      }),
  );

  const dataArray = useMemo(
    () =>
      precission === 'uint'
        ? new Uint8Array(FFT_SIZE)
        : new Float32Array(FFT_SIZE),
    [precission],
  );

  useEffect(() => {
    const analyser = analyserRef.current;
    nodeToAnalyze.connect(analyser);
    return () => {
      nodeToAnalyze.disconnect(analyser);
    };
  }, [nodeToAnalyze, analyserRef]);

  return {
    analyser: analyserRef.current,
    dataArray,
  };
}
