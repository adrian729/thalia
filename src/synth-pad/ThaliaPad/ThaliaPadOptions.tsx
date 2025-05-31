import {
  Dispatch,
  JSX,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { IRType } from '../../audio-context/useReverb';
import {
  DoublePlusIcon,
  MinusIcon,
  NullIcon,
  PlusIcon,
  ReverbIcon,
  SawtoothWaveIcon,
  SineWaveIcon,
  SquareWaveIcon,
  TriangularWaveIcon,
  TriplePlusIcon,
} from '../../icons';
import { cn } from '../../utils/styles';
import { ThaliaPadJoystick } from './ThaliaPadJoystick';
import {
  ACCIDENTAL_CLASSES,
  ACCIDENTALS,
  NOTE_CLASSES,
  NOTE_NAMES,
  NOTE_VALUES,
  OCTAVE_CLASSES,
  REVERB_TYPES,
} from './constants';
import { Position } from './types';

interface ThaliaPadOptionsProps {
  optionsPosition?: Position;
  setInitialMidiId: Dispatch<SetStateAction<number>>;
  enabledOscillatorTypes: OscillatorType[];
  setEnabledOscillatorTypes: Dispatch<SetStateAction<OscillatorType[]>>;
  reverbEnabled: boolean;
  toggleReverb: () => void;
  setSelectedIR: (selectedIR: IRType) => void;
  setDetune: Dispatch<SetStateAction<number>>;
}


export function ThaliaPadOptions({
  optionsPosition = 'left',
  setInitialMidiId,
  enabledOscillatorTypes,
  setEnabledOscillatorTypes,
  reverbEnabled,
  toggleReverb,
  setSelectedIR,
  setDetune,
}: ThaliaPadOptionsProps) {
  const [reverbIdx, setReverbIdx] = useState(1);
  const currentReverb = useMemo(() => REVERB_TYPES[reverbIdx], [reverbIdx]);

  useEffect(() => {
    if (
      (reverbEnabled && !currentReverb) ||
      (!reverbEnabled && currentReverb)
    ) {
      toggleReverb();
    }
  }, [currentReverb, reverbEnabled, toggleReverb]);

  const selectNextReverb = useCallback(() => {
    setReverbIdx((prevIdx) => {
      const newIdx = (prevIdx + 1) % REVERB_TYPES.length;
      const nextReverb = REVERB_TYPES[newIdx];
      if (nextReverb) {
        setSelectedIR(nextReverb);
      }
      return newIdx;
    });
  }, [setReverbIdx, setSelectedIR]);

  return (
    <div className={cn(
        'p-4 w-fit border-y-2 border-gray-400 flex flex-col gap-4 justify-between items-center',
        optionsPosition === 'left' && 'bg-blue-100 border-l-2 rounded-l-xl',
        optionsPosition === 'right' && 'bg-fuchsia-100 border-r-2 rounded-r-xl',
      )}>
      <div className='w-full grid grid-cols-2 gap-4 justify-center items-center'>
        {optionsPosition === 'left' && (<WaveTypeSelectionOptions
          enabledOscillatorTypes={enabledOscillatorTypes}
          setEnabledOscillatorTypes={setEnabledOscillatorTypes}
        />)}
        <div className='h-full flex flex-col justify-between items-center gap-2'>
          <button
            type='button'
            className={cn(
              'cursor-pointer w-9 aspect-square rounded-full bg-gray-300 text-gray-600',
              reverbEnabled &&
                ((currentReverb === 'basement' && 'text-sky-900 bg-sky-300') ||
                  (currentReverb === 'church' && 'text-teal-900 bg-teal-300') ||
                  (currentReverb === 'bathroom' &&
                    'text-purple-900 bg-purple-300') ||
                  (currentReverb === 'pipe' && 'text-pink-900 bg-pink-300')),
            )}
            onClick={selectNextReverb}
          >
            <div className='w-5 mx-auto'>
              <ReverbIcon />
            </div>
          </button>
          <PadKeySelectionButtons
            initialOctaveIndex={2}
            nextOctaveKeys={['y']}
            nextNoteKeys={['h']}
            nextAccidentalKeys={['n']}
            setInitialMidiId={setInitialMidiId}
          />
        </div>
        {optionsPosition === 'right' && (<WaveTypeSelectionOptions
          enabledOscillatorTypes={enabledOscillatorTypes}
          setEnabledOscillatorTypes={setEnabledOscillatorTypes}
        />)}
      </div>
      <div className='w-full flex justify-start items-end'>
        <ThaliaPadJoystick setDetune={setDetune} />
      </div>
    </div>
  );
}

function PadKeySelectionButtons({
  initialOctaveIndex = 1,
  initialNoteIndex = 0,
  initialAccidentalIndex = 1,
  nextOctaveKeys,
  nextNoteKeys,
  nextAccidentalKeys,
  setInitialMidiId,
}: {
  initialOctaveIndex?: number;
  initialNoteIndex?: number;
  initialAccidentalIndex?: number;
  nextOctaveKeys?: string[];
  nextNoteKeys?: string[];
  nextAccidentalKeys?: string[];
  setInitialMidiId: Dispatch<SetStateAction<number>>;
}) {
  const [octaveIndex, setOctaveIndex] = useState(initialOctaveIndex);
  const [noteIndex, setNoteIndex] = useState(initialNoteIndex);
  const [accidentalIndex, setAccidentalIndex] = useState(
    initialAccidentalIndex,
  );
  const [keysPressed, setKeysPressed] = useState<string[]>([]);

  useEffect(() => {
    const initialMidiId = 36;
    const octave = 12 * (octaveIndex - 1);
    const accidental = accidentalIndex - 1;
    setInitialMidiId(
      octave + NOTE_VALUES[noteIndex] + accidental + initialMidiId,
    );
  }, [octaveIndex, noteIndex, accidentalIndex, setInitialMidiId]);

  const setNextOctaveIndex = useCallback(
    () => setOctaveIndex((prev) => (prev + 1) % 5),
    [setOctaveIndex],
  );
  const setNextNoteIndex = useCallback(
    () => setNoteIndex((prev) => (prev + 1) % NOTE_NAMES.length),
    [setNoteIndex],
  );
  const setNextAccidentalIndex = useCallback(
    () => setAccidentalIndex((prev) => (prev + 1) % ACCIDENTALS.length),
    [setAccidentalIndex],
  );

  const keyDownHandler = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (keysPressed.includes(key)) {
        return;
      }
      setKeysPressed((prev) => [...prev, key]);
      if (nextOctaveKeys?.includes(key)) {
        setNextOctaveIndex();
      }
      if (nextNoteKeys?.includes(key)) {
        setNextNoteIndex();
      }
      if (nextAccidentalKeys?.includes(key)) {
        setNextAccidentalIndex();
      }
    },
    [
      keysPressed,
      nextAccidentalKeys,
      nextNoteKeys,
      nextOctaveKeys,
      setNextAccidentalIndex,
      setNextNoteIndex,
      setNextOctaveIndex,
    ],
  );

  const keyUpHandler = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    setKeysPressed((prev) => prev.filter((k) => k !== key));
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
    };
  }, [keyDownHandler, keyUpHandler]);

  return (
    <>
      <button
        type='button'
        className={cn(
          'cursor-pointer w-9 aspect-square rounded-full bg-gray-300 text-gray-900 font-bold',
          OCTAVE_CLASSES[octaveIndex],
        )}
        onClick={setNextOctaveIndex}
      >
        <OctaveSymbol index={octaveIndex} />
      </button>
      <button
        type='button'
        className={cn(
          'cursor-pointer w-9 aspect-square rounded-full bg-gray-300 text-gray-900 font-bold text-xl',
          NOTE_CLASSES[noteIndex],
        )}
        onClick={setNextNoteIndex}
      >
        {NOTE_NAMES[noteIndex]}
      </button>
      <button
        type='button'
        className={cn(
          'cursor-pointer w-9 aspect-square rounded-full bg-gray-300 text-gray-900 font-bold text-xl',
          accidentalIndex === 1 && 'pb-2',
          ACCIDENTAL_CLASSES[accidentalIndex],
        )}
        onClick={setNextAccidentalIndex}
      >
        {ACCIDENTALS[accidentalIndex]}
      </button>
    </>
  );
}

function OctaveSymbol({ index }: { index: number }) {
  switch (index) {
    case 0:
      return <MinusIcon />;
    case 1:
      return <NullIcon />;
    case 2:
      return <PlusIcon />;
    case 3:
      return <DoublePlusIcon />;
    case 4:
      return <TriplePlusIcon />;
    default:
      return null;
  }
}

function WaveTypeSelectionOptions({
  enabledOscillatorTypes,
  setEnabledOscillatorTypes,
}: {
  enabledOscillatorTypes: OscillatorType[];
  setEnabledOscillatorTypes: Dispatch<SetStateAction<OscillatorType[]>>;
}) {
  return (
    <div className='h-full flex flex-col justify-between items-center gap-2'>
      <WaveTypeToggle
        waveType='sine'
        bgColor='bg-pink-300'
        textColor='text-pink-900'
        icon={<SineWaveIcon />}
        enabledOscillatorTypes={enabledOscillatorTypes}
        setEnabledOscillatorTypes={setEnabledOscillatorTypes}
      />
      <WaveTypeToggle
        waveType='square'
        bgColor='bg-green-300'
        textColor='text-green-900'
        icon={<SquareWaveIcon />}
        enabledOscillatorTypes={enabledOscillatorTypes}
        setEnabledOscillatorTypes={setEnabledOscillatorTypes}
      />
      <WaveTypeToggle
        waveType='sawtooth'
        bgColor='bg-yellow-300'
        textColor='text-yellow-900'
        icon={<SawtoothWaveIcon />}
        enabledOscillatorTypes={enabledOscillatorTypes}
        setEnabledOscillatorTypes={setEnabledOscillatorTypes}
      />
      <WaveTypeToggle
        waveType='triangle'
        bgColor='bg-red-300'
        textColor='text-red-900'
        icon={<TriangularWaveIcon />}
        enabledOscillatorTypes={enabledOscillatorTypes}
        setEnabledOscillatorTypes={setEnabledOscillatorTypes}
      />
    </div>
  );
}

function WaveTypeToggle({
  waveType,
  bgColor,
  textColor,
  icon,
  enabledOscillatorTypes,
  setEnabledOscillatorTypes,
}: {
  waveType: OscillatorType;
  bgColor: string;
  textColor: string;
  icon: JSX.Element;
  enabledOscillatorTypes: OscillatorType[];
  setEnabledOscillatorTypes: Dispatch<SetStateAction<OscillatorType[]>>;
}) {
  const toggleWaveType = useCallback(() => {
    setEnabledOscillatorTypes((prev) => {
      if (prev.includes(waveType)) {
        return prev.filter((type) => type !== waveType);
      }
      return [...prev, waveType];
    });
  }, [waveType]);

  return (
    <button
      type='button'
      className={cn(
        'cursor-pointer w-9 aspect-square rounded bg-gray-300 text-gray-600',
        enabledOscillatorTypes.includes(waveType) && [bgColor, textColor],
      )}
      onClick={toggleWaveType}
    >
      <div className='w-6 mx-auto'>{icon}</div>
    </button>
  );
}
