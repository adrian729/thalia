import { createContext } from 'react';
import { AudioSetup } from './types';
import { getAudioEngine } from './useAudioSetup';

export interface MainAudioContextType {
  state: AudioSetup;
}
export const MainAudioContext = createContext<MainAudioContextType>({
  // Share the single audio-engine instance so there is exactly one AudioContext,
  // whether consumed via this default or via the provider.
  state: getAudioEngine(),
});
