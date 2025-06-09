import { useEffect, useMemo, useRef } from 'react';

export default function useAnalyser({
  nodeToAnalyze,
  audioContext,
  precission = 'uint',
}: {
  nodeToAnalyze: AudioNode;
  audioContext: AudioContext;
  precission?: 'float' | 'uint';
}) {
  const analyser = useRef<AnalyserNode>(
    new AnalyserNode(audioContext, {
      fftSize: 2048,
      minDecibels: -90,
      maxDecibels: -10,
      smoothingTimeConstant: 0.85,
    }),
  );

  const dataArray = useMemo(
    () =>
      precission === 'uint'
        ? new Uint8Array(analyser.current.fftSize)
        : new Float32Array(analyser.current.fftSize),
    [analyser.current.fftSize],
  );

  useEffect(() => {
    nodeToAnalyze.connect(analyser.current);
    return () => {
      nodeToAnalyze.disconnect(analyser.current);
    };
  }, [nodeToAnalyze]);

  return {
    analyser: analyser.current,
    dataArray,
  };
}
