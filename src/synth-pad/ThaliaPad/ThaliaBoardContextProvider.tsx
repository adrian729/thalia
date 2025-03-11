import {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MainAudioContext } from "../../audio-context/MainAudioContext";
import { useReverb } from "../../audio-context/useReverb";
import { ThaliaPadBoardContext } from "./ThaliaPadBoardContext";

export function ThaliaPadBoardProvider({ children }: PropsWithChildren) {
  const [helperEnabled, setHelperEnabled] = useState(false);

  const [oscillatorTypes, setOscillatorTypes] = useState<OscillatorType[]>([
    "sine",
    "square",
    "sawtooth",
    "triangle",
  ]);
  const toggleWaveType = useCallback((oscillatorType: OscillatorType) => {
    setOscillatorTypes((prev) => {
      if (prev.includes(oscillatorType)) {
        return prev.filter((type) => type !== oscillatorType);
      }
      return [...prev, oscillatorType];
    });
  }, []);

  const mainAudioContext = useContext(MainAudioContext);
  const { audioContext, mainNode } = mainAudioContext.state;
  const destinationRef = useRef(new GainNode(audioContext, { gain: 1 }));

  const [reverbEnabled, setReverbEnabled] = useState(true);
  const wetGainValue = useMemo(() => 0.2, []);
  const { dry, wet, setWetGain, setSelectedIR } = useReverb({
    selectedIR: "basement",
    dryGain: 0.5,
    wetGain: wetGainValue,
    destination: mainNode,
    audioContext: audioContext,
  });

  useEffect(() => {
    destinationRef.current.connect(dry);
    destinationRef.current.connect(wet);
  }, [destinationRef, dry, wet]);

  const toggleReverb = useCallback(() => {
    setReverbEnabled((prev) => {
      setWetGain(prev ? 0 : wetGainValue);
      return !prev;
    });
  }, [setWetGain, wetGainValue]);

  const [detune, setDetune] = useState(0);

  return (
    <ThaliaPadBoardContext.Provider
      value={{
        helperEnabled,
        setHelperEnabled,

        oscillatorTypes,
        setOscillatorTypes,
        toggleWaveType,

        reverbEnabled,
        setReverbEnabled,
        toggleReverb,
        setSelectedIR,

        detune,
        setDetune,

        audioContext: audioContext!,
        destination: destinationRef.current,
      }}
    >
      {children}
    </ThaliaPadBoardContext.Provider>
  );
}
