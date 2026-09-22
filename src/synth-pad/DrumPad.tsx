import { ClassValue } from 'cn';
import { useContext, useEffect, useMemo, useState } from 'react';
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
import { KeyHandlers } from '../utils/types';
import useKeyboard from '../utils/useKeyboard';
import { useLazyRef } from '../utils/useLazyRef';

interface DrumPadConfigItem {
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
  name: string;
}
const drumPadConfig: DrumPadConfigItem[] = [
  {
    playInstrument: playCymbal1,
    name: 'Cymbal 1',
    extraClasses: 'bg-violet-300',
    playingClasses: 'bg-violet-100',
    keys: ['7'],
  },
  {
    playInstrument: playCymbal2,
    name: 'Cymbal 2',
    extraClasses: 'bg-indigo-300',
    playingClasses: 'bg-indigo-100',
    keys: ['8'],
  },
  {
    playInstrument: playCymbal3,
    name: 'Cymbal 3',
    extraClasses: 'bg-red-300',
    playingClasses: 'bg-red-100',
    keys: ['9'],
  },
  {
    playInstrument: playTom1,
    name: 'Tom 1',
    extraClasses: 'bg-emerald-300',
    playingClasses: 'bg-emerald-100',
    keys: ['4'],
  },
  {
    playInstrument: playTom2,
    name: 'Tom 2',
    extraClasses: 'bg-lime-300',
    playingClasses: 'bg-lime-100',
    keys: ['5'],
  },
  {
    playInstrument: playTom3,
    name: 'Tom 3',
    extraClasses: 'bg-yellow-300',
    playingClasses: 'bg-yellow-100',
    keys: ['6'],
  },
  {
    playInstrument: playKick,
    name: 'Kick',
    extraClasses: 'bg-orange-300',
    playingClasses: 'bg-orange-100',
    keys: ['1'],
  },
  {
    playInstrument: playSnare,
    name: 'Snare',
    extraClasses: 'bg-sky-300',
    playingClasses: 'bg-sky-100',
    keys: ['2'],
  },
  {
    playInstrument: playHihat,
    name: 'Hi-hat',
    extraClasses: 'bg-pink-300',
    playingClasses: 'bg-pink-100',
    keys: ['3'],
  },
] as const;

export default function DrumPad() {
  const mainAudioContext = useContext(MainAudioContext);
  const { audioContext, mainNode } = mainAudioContext.state;
  const destinationRef = useLazyRef(
    () => new GainNode(audioContext, { gain: 1 }),
  );
  const { dry, wet } = useReverb({
    selectedIR: 'basement',
    dryGain: 0.5,
    wetGain: 0.06,
    destination: mainNode,
    audioContext: audioContext,
  });

  useEffect(() => {
    const node = destinationRef.current;
    node.connect(dry);
    node.connect(wet);
    return () => {
      node.disconnect(dry);
      node.disconnect(wet);
    };
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

  const { playInstrument, keys, extraClasses, playingClasses, name } =
    configItem;

  const keyMappings = useMemo(() => {
    return keys.reduce(
      (acc, key) => {
        acc[key.toLowerCase()] = {
          onKeyDown: () => {
            if (audioContext && destination) {
              setIsPlaying(true);
              playInstrument({
                audioContext,
                destination: destination,
              });
            }
          },
          onKeyUp: () => setIsPlaying(false),
        };
        return acc;
      },
      {} as Record<string, KeyHandlers>,
    );
  }, [keys, playInstrument, audioContext, destination]);

  useKeyboard({ keyMappings });

  return (
    <button
      type='button'
      aria-label={name}
      className={cn([
        'cursor-pointer w-full aspect-square bg-gray-300 rounded touch-none select-none',
        extraClasses,
        isPlaying && playingClasses,
      ])}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        setIsPlaying(true);
        if (!audioContext || !destination) return;
        playInstrument({
          audioContext,
          destination,
        });
      }}
      onPointerUp={() => {
        setIsPlaying(false);
      }}
      onPointerCancel={() => {
        setIsPlaying(false);
      }}
    ></button>
  );
}
