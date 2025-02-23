import { PropsWithChildren } from "react";
import { MainAudioContext } from "./MainAudioContext";
import { useAudioSetup } from "./useAudioSetup";

export function MainAudioContextProvider({ children }: PropsWithChildren) {
  const audioSetup = useAudioSetup({});
  return (
    <MainAudioContext.Provider value={{ state: audioSetup }}>
      {children}
    </MainAudioContext.Provider>
  );
}
