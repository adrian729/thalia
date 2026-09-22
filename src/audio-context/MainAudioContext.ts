import { Context, createContext } from 'react';
import { AudioSetup } from './types';

export interface MainAudioContextType {
  state: AudioSetup;
}
export const MainAudioContext: Context<MainAudioContextType | undefined> =
  createContext<MainAudioContextType | undefined>(undefined);
MainAudioContext.displayName = 'MainAudioContext';
