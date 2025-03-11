import { createContext, Dispatch, SetStateAction } from "react";
import { IRType } from "../../audio-context/useReverb";

const defaultAudioContext = new AudioContext();

type ThaliaPadBoardContextType = {
  helperEnabled: boolean;
  setHelperEnabled: Dispatch<SetStateAction<boolean>>;

  oscillatorTypes: OscillatorType[];
  setOscillatorTypes: Dispatch<SetStateAction<OscillatorType[]>>;
  toggleWaveType: (oscillatorType: OscillatorType) => void;

  reverbEnabled: boolean;
  setReverbEnabled: Dispatch<SetStateAction<boolean>>;
  toggleReverb: () => void;
  setSelectedIR: (selectedIR: IRType) => void;

  detune: number;
  setDetune: Dispatch<SetStateAction<number>>;

  audioContext: AudioContext;
  destination: AudioNode;
};
export const ThaliaPadBoardContext = createContext<ThaliaPadBoardContextType>({
  helperEnabled: false,
  setHelperEnabled: () => {},

  oscillatorTypes: ["sine", "square", "sawtooth", "triangle"],
  setOscillatorTypes: () => {},
  toggleWaveType: () => {},

  reverbEnabled: false,
  setReverbEnabled: () => {},
  toggleReverb: () => {},
  setSelectedIR: () => {},

  detune: 0,
  setDetune: () => {},

  audioContext: defaultAudioContext,
  destination: new GainNode(defaultAudioContext, { gain: 1 }),
});
