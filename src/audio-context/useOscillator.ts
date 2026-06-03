import { useCallback, useContext, useEffect, useRef } from 'react';
import { setGainValueAtTime } from '../utils/audio';
import { clamp } from '../utils/math';
import { MainAudioContext } from './MainAudioContext';

// Short, click-free fades (seconds). Anchoring the ramp at the gain param's
// current value (see setGainValueAtTime) is what actually prevents pops; these
// just keep the attack/release fast enough to feel instant.
const ATTACK = 0.01;
const RELEASE = 0.03;

interface UseOscillatorProps {
  gain: number;
  frequency: number;
  detune?: number;
  type?: OscillatorType;
  destination: AudioNode;
}
interface UseOscillatorType {
  oscillator: OscillatorNode | null;
  gainNode: GainNode | null;
  start: () => void;
  stop: () => void;
  isPlaying: boolean;
}
export function useOscillator({
  gain: gainValue,
  frequency: _frequency,
  detune = 0,
  type = 'sine',
  destination,
}: UseOscillatorProps): UseOscillatorType {
  const frequency = clamp(_frequency, 20, 20000);

  const {
    state: { audioContext },
  } = useContext(MainAudioContext);

  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const stop = useCallback(() => {
    const oscillator = oscillatorRef.current;
    const gainNode = gainNodeRef.current;
    if (!oscillator || !gainNode) {
      return;
    }
    oscillatorRef.current = null;
    gainNodeRef.current = null;

    // Ramp down to near-silence, then stop and tear down once the oscillator
    // ends. Scheduling everything off a freshly-read currentTime (instead of a
    // setTimeout with a stale timestamp) keeps the release tight and click-free.
    setGainValueAtTime({
      gain: 0.0001,
      timeElapse: RELEASE,
      gainNode,
      audioContext,
    });
    oscillator.stop(audioContext.currentTime + RELEASE);
    oscillator.onended = () => {
      gainNode.disconnect();
    };
  }, [audioContext]);

  const start = useCallback(() => {
    stop();

    const gainNode = new GainNode(audioContext, { gain: 0.0001 });
    const oscillator = new OscillatorNode(audioContext, {
      frequency,
      type,
      detune,
    });
    oscillator.connect(gainNode).connect(destination);
    oscillator.start();

    // Click-free attack: ramp from near-silence up to the target gain.
    setGainValueAtTime({
      gain: gainValue,
      timeElapse: ATTACK,
      gainNode,
      audioContext,
    });

    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
  }, [stop, audioContext, gainValue, frequency, type, detune, destination]);

  useEffect(() => {
    if (gainNodeRef.current) {
      setGainValueAtTime({
        gain: gainValue,
        timeElapse: ATTACK,
        gainNode: gainNodeRef.current,
        audioContext,
      });
    }
  }, [gainValue, audioContext]);

  useEffect(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.frequency.setValueAtTime(
        frequency,
        audioContext.currentTime,
      );
    }
  }, [frequency, audioContext]);

  useEffect(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.detune.setValueAtTime(
        detune,
        audioContext.currentTime,
      );
    }
  }, [detune, audioContext]);

  return {
    oscillator: oscillatorRef.current,
    gainNode: gainNodeRef.current,
    start,
    stop,
    isPlaying: !!oscillatorRef.current && !!gainNodeRef.current,
  };
}
