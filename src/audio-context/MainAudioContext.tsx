import { createContext } from "react";
import { AudioSetup } from "./types";

export type MainAudioContextType = {
  state: AudioSetup;
};
export const MainAudioContext = createContext<MainAudioContextType | null>(
  null
);
