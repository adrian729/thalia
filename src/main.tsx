import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { MainAudioContextProvider } from './audio-context/MainAudioContextProvider.tsx';
import './index.css';

if (import.meta.env.DEV) {
  import('react-scan').then(({ scan }) => scan());
}

const root = document.getElementById('root');

if (root !== null) {
  createRoot(root).render(
    <StrictMode>
      <MainAudioContextProvider>
        <App />
      </MainAudioContextProvider>
    </StrictMode>,
  );
}
