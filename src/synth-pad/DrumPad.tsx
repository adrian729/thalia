import { ClassValue } from 'clsx';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { MainAudioContext } from '../audio-context/MainAudioContext';
import { useReverb } from '../audio-context/useReverb';
import {
  playCymbal1,
  playCymbal2,
  playCymbal3,
  playHihat,
  playKick,
  playSnare,
  playTom1,
  playTom2,
  playTom3,
} from '../utils/audio';
import { cn } from '../utils/styles';

type DrumPadConfigItem = {
  playInstrument: ({
    audioContext,
    destination,
  }: {
    audioContext: AudioContext;
    destination: AudioNode;
  }) => void;
  playingClasses?: ClassValue;
  extraClasses?: ClassValue;
  keys: string[];
};
const drumPadConfig: DrumPadConfigItem[] = [
  {
    playInstrument: playCymbal1,
    extraClasses: 'bg-violet-300',
    playingClasses: 'bg-violet-100',
    keys: ['7'],
  },
  {
    playInstrument: playCymbal2,
    extraClasses: 'bg-indigo-300',
    playingClasses: 'bg-indigo-100',
    keys: ['8'],
  },
  {
    playInstrument: playCymbal3,
    extraClasses: 'bg-red-300',
    playingClasses: 'bg-red-100',
    keys: ['9'],
  },
  {
    playInstrument: playTom1,
    extraClasses: 'bg-emerald-300',
    playingClasses: 'bg-emerald-100',
    keys: ['4'],
  },
  {
    playInstrument: playTom2,
    extraClasses: 'bg-lime-300',
    playingClasses: 'bg-lime-100',
    keys: ['5'],
  },
  {
    playInstrument: playTom3,
    extraClasses: 'bg-yellow-300',
    playingClasses: 'bg-yellow-100',
    keys: ['6'],
  },
  {
    playInstrument: playKick,
    extraClasses: 'bg-orange-300',
    playingClasses: 'bg-orange-100',
    keys: ['1'],
  },
  {
    playInstrument: playSnare,
    extraClasses: 'bg-sky-300',
    playingClasses: 'bg-sky-100',
    keys: ['2'],
  },
  {
    playInstrument: playHihat,
    extraClasses: 'bg-pink-300',
    playingClasses: 'bg-pink-100',
    keys: ['3'],
  },
] as const;

export default function DrumPad() {
  const mainAudioContext = useContext(MainAudioContext);
  const { audioContext, mainNode } = mainAudioContext.state;
  const destinationRef = useRef(new GainNode(audioContext, { gain: 1 }));
  const { dry, wet } = useReverb({
    selectedIR: 'basement',
    dryGain: 0.5,
    wetGain: 0.06,
    destination: mainNode,
    audioContext: audioContext,
  });

  useEffect(() => {
    destinationRef.current.connect(dry);
    destinationRef.current.connect(wet);
  }, [destinationRef, dry, wet]);

  return (
    <div className='w-xs aspect-square p-6 border-2 border-gray-400 rounded-xl grid grid-cols-3 gap-4'>
      {drumPadConfig.map((configItem, index) => (
        <DrumPadButton
          key={index}
          configItem={configItem}
          destination={destinationRef.current}
          audioContext={audioContext}
        />
      ))}
    </div>
  );
}

function DrumPadButton({
  configItem,
  destination,
  audioContext,
}: {
  configItem: DrumPadConfigItem;
  destination: AudioNode;
  audioContext: AudioContext;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const { playInstrument, keys, extraClasses, playingClasses } = configItem;
  const keyDownHandler = useCallback(
    (event: KeyboardEvent) => {
      if (audioContext && destination && keys.includes(event.key)) {
        setIsPlaying(true);
        playInstrument({
          audioContext,
          destination: destination,
        });
      }
    },
    [audioContext, destination, keys, playInstrument],
  );

  const keyUpHandler = useCallback(
    (event: KeyboardEvent) => {
      if (keys.includes(event.key)) {
        setIsPlaying(false);
      }
    },
    [keys],
  );

  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
    };
  }, [keyDownHandler, keyUpHandler]);

  return (
    <button
      type='button'
      className={cn([
        'cursor-pointer w-full aspect-square bg-gray-300 rounded',
        extraClasses,
        isPlaying && playingClasses,
      ])}
      onMouseDown={() => {
        setIsPlaying(true);
        if (!audioContext || !destination) return;
        playInstrument({
          audioContext,
          destination,
        });
      }}
      onMouseUp={() => {
        setIsPlaying(false);
      }}
      onMouseLeave={() => {
        setIsPlaying(false);
      }}
    ></button>
  );
}
