import { createContext } from "react";
import { AudioSetup } from "./types";

const defaultAudioContext = new AudioContext();
export type MainAudioContextType = {
  state: AudioSetup;
};
export const MainAudioContext = createContext<MainAudioContextType>({
  state: {
    audioContext: defaultAudioContext,
    mainNode: new GainNode(defaultAudioContext, { gain: 1 }),
  },
});
