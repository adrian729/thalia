import { PropsWithChildren } from 'react';
import { MainAudioContext } from './MainAudioContext';
import { useAudioSetup } from './useAudioSetup';
import { useAudioUnlock } from './useAudioUnlock';

export function MainAudioContextProvider({ children }: PropsWithChildren) {
  const audioSetup = useAudioSetup({});
  useAudioUnlock(audioSetup.audioContext);

  return (
    <MainAudioContext.Provider value={{ state: audioSetup }}>
      {children}
    </MainAudioContext.Provider>
  );
}
