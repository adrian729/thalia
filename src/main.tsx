import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { MainAudioContextProvider } from "./audio-context/MainAudioContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainAudioContextProvider>
      <App />
    </MainAudioContextProvider>
  </StrictMode>
);
