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
import {
  LeftThaliaPadOptions,
  RightThaliaPadOptions,
} from './ThaliaPadOptions';
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
          <LeftThaliaPadOptions
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
                audioContext={audioContext}
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
                  audioContext={audioContext}
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
                  audioContext={audioContext}
                  destination={destinationRef.current}
                  helperEnabled={helperEnabled}
                />
              ))}
            </div>
          </div>
        </div>
        {optionsPosition === 'right' && (
          <RightThaliaPadOptions
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
  audioContext,
  destination,
  helperEnabled,
}: {
  midiId: number;
  initialMidiId: number;
  configItem: ThaliaPadConfigItem;
  keys: string[];
  enabledOscillatorTypes: OscillatorType[];
  detune: number;
  audioContext: AudioContext;
  destination: AudioNode;
  helperEnabled: boolean;
}) {
  const frequency = useMemo(
    () => notes[midiId + initialMidiId].frequency,
    [midiId, initialMidiId],
  );

  const { extraClasses, playingClasses } = configItem;
  const [isPlaying, setIsPlaying] = useState(false);
  const { start: startSine } = useOscillator({
    frequency,
    destination,
    type: 'sine',
  });
  const { start: startSquare } = useOscillator({
    frequency,
    destination,
    type: 'square',
  });
  const { start: startSawtooth } = useOscillator({
    frequency,
    destination,
    type: 'sawtooth',
  });
  const { start: startTriangle } = useOscillator({
    frequency,
    destination,
    type: 'triangle',
  });
  const oscillatorSineRef = useRef<OscillatorNode | null>(null);
  const stopSineRef = useRef<() => void>(null);
  const oscillatorSquareRef = useRef<OscillatorNode | null>(null);
  const stopSquareRef = useRef<() => void>(null);
  const oscillatorSawtoothRef = useRef<OscillatorNode | null>(null);
  const stopSawtoothRef = useRef<() => void>(null);
  const oscillatorTriangleRef = useRef<OscillatorNode | null>(null);
  const stopTriangleRef = useRef<() => void>(null);

  const playOscillator = useCallback(() => {
    const numOscillators = enabledOscillatorTypes.length || 1;
    if (audioContext && destination && !isPlaying) {
      if (!stopSineRef.current && enabledOscillatorTypes.includes('sine')) {
        const { stop, oscillator } = startSine({
          gain: 2 / numOscillators,
          detune,
        });
        oscillatorSineRef.current = oscillator;
        stopSineRef.current = stop;
      }
      if (!stopSquareRef.current && enabledOscillatorTypes.includes('square')) {
        const { stop, oscillator } = startSquare({
          gain: 0.3 / numOscillators,
          detune,
        });
        oscillatorSquareRef.current = oscillator;
        stopSquareRef.current = stop;
      }
      if (
        !stopSawtoothRef.current &&
        enabledOscillatorTypes.includes('sawtooth')
      ) {
        const { stop, oscillator } = startSawtooth({
          gain: 0.3 / numOscillators,
          detune,
        });
        oscillatorSawtoothRef.current = oscillator;
        stopSawtoothRef.current = stop;
      }
      if (
        !stopTriangleRef.current &&
        enabledOscillatorTypes.includes('triangle')
      ) {
        const { stop, oscillator } = startTriangle({
          gain: 2 / numOscillators,
          detune,
        });
        oscillatorTriangleRef.current = oscillator;
        stopTriangleRef.current = stop;
      }
      setIsPlaying(true);
    }
  }, [
    audioContext,
    destination,
    detune,
    isPlaying,
    startSawtooth,
    startSine,
    startSquare,
    startTriangle,
  ]);

  const stopOscillator = useCallback(() => {
    if (!isPlaying) {
      return;
    }
    if (stopSineRef.current) {
      stopSineRef.current();
      stopSineRef.current = null;
    }
    if (stopSquareRef.current) {
      stopSquareRef.current();
      stopSquareRef.current = null;
    }
    if (stopSawtoothRef.current) {
      stopSawtoothRef.current();
      stopSawtoothRef.current = null;
    }
    if (stopTriangleRef.current) {
      stopTriangleRef.current();
      stopTriangleRef.current = null;
    }
    setIsPlaying(false);
  }, [isPlaying]);

  useEffect(() => {
    const currentTime = audioContext.currentTime;
    if (oscillatorSineRef.current) {
      oscillatorSineRef.current.detune.setValueAtTime(detune, currentTime);
    }
    if (oscillatorSquareRef.current) {
      oscillatorSquareRef.current.detune.setValueAtTime(detune, currentTime);
    }
    if (oscillatorSawtoothRef.current) {
      oscillatorSawtoothRef.current.detune.setValueAtTime(detune, currentTime);
    }
    if (oscillatorTriangleRef.current) {
      oscillatorTriangleRef.current.detune.setValueAtTime(detune, currentTime);
    }
  }, [audioContext.currentTime, detune]);

  const keyDownHandler = useCallback(
    (event: KeyboardEvent) => {
      if (keys.includes(event.key.toLowerCase())) {
        playOscillator();
      }
    },
    [keys, playOscillator],
  );

  const keyUpHandler = useCallback(
    (event: KeyboardEvent) => {
      if (keys.includes(event.key.toLowerCase())) {
        stopOscillator();
      }
    },
    [keys, stopOscillator],
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
        'cursor-pointer w-20 aspect-square rounded-full font-bold text-lg bg-gray-300',
        extraClasses,
        isPlaying && playingClasses,
      ])}
      onMouseDown={playOscillator}
      onMouseUp={stopOscillator}
      onMouseLeave={stopOscillator}
    >
      {helperEnabled && `${keys[0]}`}
    </button>
  );
}
