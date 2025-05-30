import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { MainAudioContextProvider } from './audio-context/MainAudioContextProvider.tsx';
import './index.css';

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
