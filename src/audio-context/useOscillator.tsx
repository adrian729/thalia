import { MainAudioContext } from "./MainAudioContext";
import useSafeContext from "../utils/useSafeContext";

const epsilon = 0.03;

type UseOscillatorProps = {
  gain?: number;
  frequency: number;
  type?: OscillatorType;
  destination: AudioNode;
};
type UseOscillatorType = {
  start: (gain: number) => () => void;
};
export function useOscillator({
  frequency,
  type = "sine",
  destination,
}: UseOscillatorProps): UseOscillatorType {
  const {
    state: { audioContext },
  } = useSafeContext(MainAudioContext);

  return {
    start: (gain: number) => {
      if (frequency < 20 || frequency > 20000) {
        throw new Error("Frequency must be between 20 and 20000 Hz");
      }

      const currentTime = audioContext.currentTime;

      const oscillator = new OscillatorNode(audioContext, {
        frequency,
        type,
      });

      const gainNode = new GainNode(audioContext, { gain: 0.001 });
      gainNode.gain.exponentialRampToValueAtTime(gain, currentTime + epsilon);

      oscillator.connect(gainNode).connect(destination);
      oscillator.start();

      const stop = () => {
        const currentTime = audioContext.currentTime;

        gainNode.gain.setValueAtTime(gain, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          currentTime + epsilon
        );

        oscillator?.stop(currentTime + 2 * epsilon);
        setTimeout(() => {
          oscillator?.disconnect();
          gainNode?.disconnect();
        }, 2 * epsilon * 1000);
      };

      return stop;
    },
  };
}
