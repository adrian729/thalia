import { createContext, Dispatch, SetStateAction } from 'react';
import { IRType } from '../../audio-context/useReverb';

const defaultAudioContext = new AudioContext();

interface ThaliaPadBoardContextType {
  reverbEnabled: boolean;
  setReverbEnabled: Dispatch<SetStateAction<boolean>>;
  toggleReverb: () => void;
  setSelectedIR: (selectedIR: IRType) => void;

  detune: number;
  setDetune: Dispatch<SetStateAction<number>>;

  audioContext: AudioContext;
  destination: AudioNode;
}
export const ThaliaPadBoardContext = createContext<ThaliaPadBoardContextType>({
  reverbEnabled: false,
  setReverbEnabled: () => {},
  toggleReverb: () => {},
  setSelectedIR: () => {},

  detune: 0,
  setDetune: () => {},

  audioContext: defaultAudioContext,
  destination: new GainNode(defaultAudioContext, { gain: 1 }),
});
