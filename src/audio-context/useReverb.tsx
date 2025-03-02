import { useRef, useEffect } from "react";

export function useReverb({
  irPath = "IR/IR_basement.wav",
  dryGain = 0.5,
  wetGain = 0.2,
  destination,
  audioContext,
}: {
  irPath?: string;
  dryGain?: number;
  wetGain?: number;
  destination: AudioNode;
  audioContext: AudioContext;
}): { dry: AudioNode; wet: AudioNode } {
  const dryGainRef = useRef<GainNode>(
    new GainNode(audioContext, { gain: dryGain })
  );
  const wetGainRef = useRef<GainNode>(
    new GainNode(audioContext, { gain: wetGain })
  );
  const convolverRef = useRef<ConvolverNode>(
    new ConvolverNode(audioContext, { buffer: null })
  );

  useEffect(() => {
    convolverRef.current.connect(wetGainRef.current);
    wetGainRef.current.connect(destination);
    dryGainRef.current.connect(destination);
  }, [convolverRef, dryGainRef, wetGainRef, destination, audioContext]);

  useEffect(() => {
    fetch(irPath).then((response) =>
      response.arrayBuffer().then((buffer) => {
        audioContext.decodeAudioData(buffer).then((audioBuffer) => {
          convolverRef.current.buffer = audioBuffer;
        });
      })
    );
  }, [audioContext, convolverRef, irPath]);

  return {
    dry: dryGainRef.current,
    wet: convolverRef.current,
  };
}
