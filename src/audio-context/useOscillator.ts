import { useCallback, useContext, useEffect, useRef } from 'react';
import { clamp } from '../utils/math';
import { MainAudioContext } from './MainAudioContext';

const EPSILON = 0.1;

type UseOscillatorProps = {
  gain: number;
  frequency: number;
  detune?: number;
  type?: OscillatorType;
  destination: AudioNode;
};
type UseOscillatorType = {
  oscillator: OscillatorNode | null;
  gainNode: GainNode | null;
  start: () => void;
  stop: () => void;
  isPlaying: boolean;
};
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

  if (audioContext && oscillatorRef.current) {
    oscillatorRef.current.detune.setValueAtTime(
      detune,
      audioContext.currentTime,
    );
  }

  const stop = useCallback(() => {
    if (!oscillatorRef.current || !gainNodeRef.current) {
      return;
    }

    const currentTime = audioContext.currentTime;

    const oscillator = oscillatorRef.current;
    const gainNode = gainNodeRef.current;
    oscillatorRef.current = null;
    gainNodeRef.current = null;

    setGainValueAtTime(gainNode, 0, currentTime);

    setTimeout(
      () => {
        oscillator.stop(currentTime + 10 * EPSILON);
        gainNode.disconnect();
      },
      10 * EPSILON * 1000,
    );
  }, [gainNodeRef, oscillatorRef, audioContext]);

  const start = useCallback(() => {
    stop();
    const currentTime = audioContext.currentTime;

    const gainNode = new GainNode(audioContext, { gain: 0.001 });
    setGainValueAtTime(gainNode, gainValue, currentTime);

    const oscillator = new OscillatorNode(audioContext, {
      frequency,
      type,
      detune,
    });
    oscillator.connect(gainNode).connect(destination);
    oscillator.start();

    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
  }, [stop, audioContext, gainValue, frequency, type, detune, destination]);

  useEffect(() => {
    if (gainNodeRef.current) {
      setGainValueAtTime(
        gainNodeRef.current,
        gainValue,
        audioContext.currentTime,
      );
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

  return {
    oscillator: oscillatorRef.current,
    gainNode: gainNodeRef.current,
    start,
    stop,
    isPlaying: !!oscillatorRef.current && !!gainNodeRef.current,
  };
}

function setGainValueAtTime(
  gainNode: GainNode,
  value: number,
  currentTime: number,
) {
  gainNode.gain.cancelAndHoldAtTime(currentTime + EPSILON);
  gainNode.gain.exponentialRampToValueAtTime(
    Math.max(0.001, value),
    currentTime + 2 * EPSILON,
  );
  gainNode.gain.setValueAtTime(value, currentTime + 3 * EPSILON);
}
