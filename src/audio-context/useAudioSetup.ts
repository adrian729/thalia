import { AudioSetup } from './types';

const DEFAULT_SAMPLE_RATE = 48000;

let engine: AudioSetup | null = null;

/**
 * The audio engine is a persistent, mutable singleton that lives OUTSIDE React's
 * render/effect lifecycle. An AudioContext is a browser-limited, clock-bearing
 * resource: it must survive StrictMode remounts and the whole page lifetime, so
 * it is created exactly once and never closed. (Closing/recreating it would leave
 * a suspended context that needs a fresh user gesture, for no benefit.)
 *
 * `sampleRate` only takes effect on the first call that creates the engine.
 */
export function getAudioEngine(sampleRate = DEFAULT_SAMPLE_RATE): AudioSetup {
  if (engine === null) {
    const audioContext = new AudioContext({ sampleRate });
    const mainNode = new GainNode(audioContext, { gain: 1 });
    mainNode.connect(audioContext.destination);
    engine = { audioContext, mainNode };
  }
  return engine;
}

export function useAudioSetup({
  sampleRate = DEFAULT_SAMPLE_RATE,
}: {
  sampleRate?: number;
}): AudioSetup {
  return getAudioEngine(sampleRate);
}
