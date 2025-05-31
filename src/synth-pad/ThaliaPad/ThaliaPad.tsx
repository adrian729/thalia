import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { MainAudioContext } from '../../audio-context/MainAudioContext';
import { useOscillator } from '../../audio-context/useOscillator';
import { useReverb } from '../../audio-context/useReverb';
import { notes } from '../../utils/notes';
import { cn } from '../../utils/styles';
import { KeyHandlers } from '../../utils/types';
import useKeyboard from '../../utils/useKeyboard';
import { ThaliaPadOptions } from './ThaliaPadOptions';
import {
  INITIAL_MIDI_ID,
  KEYS_MAPPING,
  THALIA_CONFIG_ITEMS,
} from './constants';
import { Position, ThaliaPadConfigItem } from './types';

export default function ThaliaPad({
  keysMappingKey = 'left',
  optionsPosition = 'right',
  helperEnabled,
}: {
  keysMappingKey: Position;
  optionsPosition: Position;
  helperEnabled: boolean;
}) {
  const [initialMidiId, setInitialMidiId] = useState(INITIAL_MIDI_ID);
  const [enabledOscillatorTypes, setEnabledOscillatorTypes] = useState<
    OscillatorType[]
  >(['sine', 'square', 'sawtooth', 'triangle']);

  const mainAudioContext = useContext(MainAudioContext);
  const { audioContext, mainNode } = mainAudioContext.state;
  const destinationRef = useRef(new GainNode(audioContext, { gain: 1 }));

  const [reverbEnabled, setReverbEnabled] = useState(true);
  const wetGainValue = useMemo(() => 0.2, []);
  const { dry, wet, setWetGain, setSelectedIR } = useReverb({
    selectedIR: 'basement',
    dryGain: 0.5,
    wetGain: wetGainValue,
    destination: mainNode,
    audioContext: audioContext,
  });

  useEffect(() => {
    destinationRef.current.connect(dry);
    destinationRef.current.connect(wet);
  }, [destinationRef, dry, wet]);

  const toggleReverb = useCallback(() => {
    setReverbEnabled((prev) => {
      setWetGain(prev ? 0 : wetGainValue);
      return !prev;
    });
  }, [setWetGain, wetGainValue]);

  const [detune, setDetune] = useState(0);

  return (
    <div className='h-fit flex'>
      {optionsPosition === 'left' && (
        <ThaliaPadOptions
          optionsPosition={optionsPosition}
          setInitialMidiId={setInitialMidiId}
          enabledOscillatorTypes={enabledOscillatorTypes}
          setEnabledOscillatorTypes={setEnabledOscillatorTypes}
          reverbEnabled={reverbEnabled}
          toggleReverb={toggleReverb}
          setSelectedIR={setSelectedIR}
          setDetune={setDetune}
        />
      )}
      <div
        className={cn(
          'bg-gray-50 border-2 border-gray-400',
          optionsPosition === 'left' && 'rounded-br-xl rounded-tr-[8rem]',
          optionsPosition === 'right' && 'rounded-tl-xl rounded-bl-[8rem]',
        )}
      >
        <div className='w-fit pl-8 pr-4 pt-6 flex flex-nowrap gap-2'>
          {/* 2-/3-/6-/7- */}
          {[1, 3, 8, 10].map((midiId) => (
            <ThaliaPadButton
              key={midiId}
              midiId={midiId}
              initialMidiId={initialMidiId}
              configItem={THALIA_CONFIG_ITEMS[midiId % 12]}
              keys={KEYS_MAPPING[keysMappingKey][midiId % 12]}
              enabledOscillatorTypes={enabledOscillatorTypes}
              detune={detune}
              destination={destinationRef.current}
              helperEnabled={helperEnabled}
            />
          ))}
        </div>
        <div className='pl-11'>
          <div className='w-fit pl-8 pr-4 flex flex-nowrap gap-2'>
            {/* 1/3/5/7 */}
            {[0, 4, 7, 11].map((midiId) => (
              <ThaliaPadButton
                key={midiId}
                midiId={midiId}
                initialMidiId={initialMidiId}
                configItem={THALIA_CONFIG_ITEMS[midiId % 12]}
                keys={KEYS_MAPPING[keysMappingKey][midiId % 12]}
                enabledOscillatorTypes={enabledOscillatorTypes}
                detune={detune}
                destination={destinationRef.current}
                helperEnabled={helperEnabled}
              />
            ))}
          </div>
        </div>
        <div className='pl-22'>
          <div className='w-fit pl-8 pr-4 pb-6 flex flex-nowrap gap-2'>
            {/* 2/4/5-/6 */}
            {[2, 5, 6, 9].map((midiId) => (
              <ThaliaPadButton
                key={midiId}
                midiId={midiId}
                initialMidiId={initialMidiId}
                configItem={THALIA_CONFIG_ITEMS[midiId % 12]}
                keys={KEYS_MAPPING[keysMappingKey][midiId % 12]}
                enabledOscillatorTypes={enabledOscillatorTypes}
                detune={detune}
                destination={destinationRef.current}
                helperEnabled={helperEnabled}
              />
            ))}
          </div>
        </div>
      </div>
      {optionsPosition === 'right' && (
        <ThaliaPadOptions
          optionsPosition={optionsPosition}
          setInitialMidiId={setInitialMidiId}
          enabledOscillatorTypes={enabledOscillatorTypes}
          setEnabledOscillatorTypes={setEnabledOscillatorTypes}
          reverbEnabled={reverbEnabled}
          toggleReverb={toggleReverb}
          setSelectedIR={setSelectedIR}
          setDetune={setDetune}
        />
      )}
    </div>
  );
}

function ThaliaPadButton({
  midiId,
  initialMidiId,
  configItem,
  keys,
  enabledOscillatorTypes,
  detune,
  destination,
  helperEnabled,
}: {
  midiId: number;
  initialMidiId: number;
  configItem: ThaliaPadConfigItem;
  keys: string[];
  enabledOscillatorTypes: OscillatorType[];
  detune: number;
  destination: AudioNode;
  helperEnabled: boolean;
}) {
  const frequency = useMemo(
    () => notes[midiId + initialMidiId].frequency,
    [midiId, initialMidiId],
  );

  const { extraClasses, playingClasses } = configItem;
  const numOscillators = enabledOscillatorTypes.length || 1;

  const [isPlaying, setIsPlaying] = useState(false);

  const { start: startSine, stop: stopSine } = useOscillator({
    gain: enabledOscillatorTypes.includes('sine')
      ? (1.5 + (numOscillators - 1) * 0.1) / numOscillators
      : 0,
    frequency,
    detune,
    destination,
    type: 'sine',
  });
  const { start: startSquare, stop: stopSquare } = useOscillator({
    gain: enabledOscillatorTypes.includes('square')
      ? (0.2 + (numOscillators - 1) * 0.08) / numOscillators
      : 0,
    frequency,
    detune,
    destination,
    type: 'square',
  });
  const { start: startSawtooth, stop: stopSawtooth } = useOscillator({
    gain: enabledOscillatorTypes.includes('sawtooth')
      ? (0.3 + (numOscillators - 1) * 0.1) / numOscillators
      : 0,
    frequency,
    detune,
    destination,
    type: 'sawtooth',
  });
  const { start: startTriangle, stop: stopTriangle } = useOscillator({
    gain: enabledOscillatorTypes.includes('triangle')
      ? (1 + (numOscillators - 1) * 0.1) / numOscillators
      : 0,
    frequency,
    detune,
    destination,
    type: 'triangle',
  });

  const playOscillators = useCallback(() => {
    if (!isPlaying) {
      startSine();
      startSquare();
      startSawtooth();
      startTriangle();
      setIsPlaying(true);
    }
  }, [isPlaying, startSine, startSquare, startSawtooth, startTriangle]);

  const stopOscillators = useCallback(() => {
    if (isPlaying) {
      stopSine();
      stopSquare();
      stopSawtooth();
      stopTriangle();
      setIsPlaying(false);
    }
  }, [isPlaying, stopSine, stopSquare, stopSawtooth, stopTriangle]);

  const keyMappings = useMemo(() => {
    return keys.reduce((acc, key) => {
      acc[key] = {
        onKeyDown: playOscillators,
        onKeyUp: stopOscillators,
      };
      return acc;
    }, {} as Record<string, KeyHandlers>);
  }, [keys, playOscillators, stopOscillators]);

  useKeyboard({ keyMappings });

  return (
    <button
      type='button'
      className={cn([
        'cursor-pointer w-20 aspect-square rounded-full font-bold text-lg bg-gray-300',
        extraClasses,
        isPlaying && playingClasses,
      ])}
      onMouseDown={playOscillators}
      onMouseUp={stopOscillators}
      onMouseLeave={stopOscillators}
    >
      {helperEnabled && `${keys[0]}`}
    </button>
  );
}
