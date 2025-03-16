import { ClassValue } from "clsx";
import {
  JSX,
  SVGProps,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useOscillator } from "../../audio-context/useOscillator";
import { IRType } from "../../audio-context/useReverb";
import {
  A,
  B,
  BEMOL,
  C,
  D,
  E,
  F,
  G,
  NATURAL,
  notes,
  SHARP,
} from "../../utils/notes";
import { cn } from "../../utils/styles";
import useSafeContext from "../../utils/useSafeContext";
import { ThaliaPadBoardContext } from "./ThaliaPadBoardContext";
import { ThaliaPadBoardProvider } from "./ThaliaPadBoardContextProvider";
import { ThaliaPadJoystick } from "./ThaliaPadJoystick";

type ThaliaPadConfigItem = {
  id: number;
  scaleValue: number;
  playingClasses: ClassValue;
  extraClasses: ClassValue;
};

// 1+ / 2- / 2+ / 3- / 3+ / 4+ / 5- / 5+ / 6- / 6+ / 7- / 7+ / 8+
// 00 / 01 / 02 / 03 / 04 / 05 / 06 / 07 / 08 / 09 / 10 / 11 / 12
// 12 / 13 / 14 / 15 / 16 / 17 / 18 / 19 / 20 / 21 / 22 / 23 / 24

const thaliaConfigItems: ThaliaPadConfigItem[] = [
  {
    id: 0,
    scaleValue: 1,
    extraClasses: "bg-red-300",
    playingClasses: "bg-red-100",
  },
  {
    id: 1,
    scaleValue: -2,
    extraClasses: "bg-orange-300",
    playingClasses: "bg-orange-100",
  },
  {
    id: 2,
    scaleValue: 2,
    extraClasses: "bg-amber-300",
    playingClasses: "bg-amber-100",
  },
  {
    id: 3,
    scaleValue: -3,
    extraClasses: "bg-yellow-300",
    playingClasses: "bg-yellow-100",
  },
  {
    id: 4,
    scaleValue: 3,
    extraClasses: "bg-lime-300",
    playingClasses: "bg-lime-100",
  },
  {
    id: 5,
    scaleValue: 4,
    extraClasses: "bg-green-300",
    playingClasses: "bg-green-100",
  },
  {
    id: 6,
    scaleValue: -5,
    extraClasses: "bg-emerald-300",
    playingClasses: "bg-emerald-100",
  },
  {
    id: 7,
    scaleValue: 5,
    extraClasses: "bg-sky-300",
    playingClasses: "bg-sky-100",
  },
  {
    id: 8,
    scaleValue: -6,
    extraClasses: "bg-indigo-300",
    playingClasses: "bg-indigo-100",
  },
  {
    id: 9,
    scaleValue: 6,
    extraClasses: "bg-violet-300",
    playingClasses: "bg-violet-100",
  },
  {
    id: 10,
    scaleValue: -7,
    extraClasses: "bg-purple-300",
    playingClasses: "bg-purple-100",
  },
  {
    id: 11,
    scaleValue: 7,
    extraClasses: "bg-fuchsia-300",
    playingClasses: "bg-fuchsia-100",
  },
];

// TODO: mirror left/right pad so they are symetric instead of similar to a piano
const leftKeys: string[][] = [
  ["a"],
  ["q"],
  ["z"],
  ["w"],
  ["s"],
  ["x"],
  ["c"],
  ["d"],
  ["e"],
  ["v"],
  ["r"],
  ["f"],
];

const rightKeys: string[][] = [
  ["j"],
  ["u"],
  ["m"],
  ["i"],
  ["k"],
  [","],
  ["."],
  ["l"],
  ["o"],
  ["/"],
  ["p"],
  [";"],
];

function MapIdToThaliaPadButton(
  midiId: number,
  configItem: ThaliaPadConfigItem,
  keys: string[]
): JSX.Element {
  const { initialMidiId } = useSafeContext(ThaliaPadBoardContext);

  return (
    <ThaliaPadButton
      key={midiId}
      frequency={notes[midiId + initialMidiId].frequency}
      configItem={configItem}
      keys={keys}
    />
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
const octaveClasses = [
  "text-rose-900 bg-rose-300",
  "text-blue-900 bg-blue-300",
  "text-green-900 bg-green-300",
  "text-teal-900 bg-teal-300",
  "text-emerald-900 bg-emerald-300",
] as const;

const notesNames = [C, D, E, F, G, A, B] as const;
const noteValues = [0, 2, 4, 5, 7, 9, 11] as const;
const noteClasses = [
  "text-red-900 bg-red-300",
  "text-amber-900 bg-amber-300",
  "text-lime-900 bg-lime-300",
  "text-green-900 bg-green-300",
  "text-sky-900 bg-sky-300",
  "text-violet-900 bg-violet-300",
  "text-fuchsia-900 bg-fuchsia-300",
] as const;

const accidental = [BEMOL, NATURAL, SHARP] as const;
const accidentalClasses = [
  "text-pink-900 bg-pink-300",
  "text-blue-900 bg-blue-300 pb-2",
  "text-emerald-900 bg-emerald-300",
] as const;

function PadKeySelectionButtons({
  initialOctaveIndex = 1,
  initialNoteIndex = 0,
  initialAccidentalIndex = 1,
  nextOctaveKeys,
  nextNoteKeys,
  nextAccidentalKeys,
}: {
  initialOctaveIndex?: number;
  initialNoteIndex?: number;
  initialAccidentalIndex?: number;
  nextOctaveKeys?: string[];
  nextNoteKeys?: string[];
  nextAccidentalKeys?: string[];
}) {
  const { setInitialMidiId } = useSafeContext(ThaliaPadBoardContext);
  const [octaveIndex, setOctaveIndex] = useState(initialOctaveIndex);
  const [noteIndex, setNoteIndex] = useState(initialNoteIndex);
  const [accidentalIndex, setAccidentalIndex] = useState(
    initialAccidentalIndex
  );
  const [keysPressed, setKeysPressed] = useState<string[]>([]);

  useEffect(() => {
    const initialMidiId = 36;
    const octave = 12 * (octaveIndex - 1);
    const accidental = accidentalIndex - 1;
    setInitialMidiId(
      octave + noteValues[noteIndex] + accidental + initialMidiId
    );
  }, [octaveIndex, noteIndex, accidentalIndex, setInitialMidiId]);

  const setNextOctaveIndex = useCallback(
    () => setOctaveIndex((prev) => (prev + 1) % 5),
    [setOctaveIndex]
  );
  const setNextNoteIndex = useCallback(
    () => setNoteIndex((prev) => (prev + 1) % notesNames.length),
    [setNoteIndex]
  );
  const setNextAccidentalIndex = useCallback(
    () => setAccidentalIndex((prev) => (prev + 1) % accidental.length),
    [setAccidentalIndex]
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
    ]
  );

  const keyUpHandler = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    setKeysPressed((prev) => prev.filter((k) => k !== key));
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
    };
  }, [keyDownHandler, keyUpHandler]);

  return (
    <>
      <button
        type='button'
        className={cn(
          "cursor-pointer w-9 aspect-square rounded-full bg-gray-300 text-gray-900 font-bold",
          octaveClasses[octaveIndex]
        )}
        onClick={setNextOctaveIndex}
      >
        <OctaveSymbol index={octaveIndex} />
      </button>
      <button
        type='button'
        className={cn(
          "cursor-pointer w-9 aspect-square rounded-full bg-gray-300 text-gray-900 font-bold text-xl",
          noteClasses[noteIndex]
        )}
        onClick={setNextNoteIndex}
      >
        {notesNames[noteIndex]}
      </button>
      <button
        type='button'
        className={cn(
          "cursor-pointer w-9 aspect-square rounded-full bg-gray-300 text-gray-900 font-bold text-xl",
          accidentalIndex === 1 && "pb-2",
          accidentalClasses[accidentalIndex]
        )}
        onClick={setNextAccidentalIndex}
      >
        {accidental[accidentalIndex]}
      </button>
    </>
  );
}

const reverbs: (IRType | null)[] = [
  null,
  "basement",
  "church",
  "bathroom",
  "pipe",
];

function WaveTypeToggle({
  waveType,
  bgColor,
  textColor,
  icon,
}: {
  waveType: OscillatorType;
  bgColor: string;
  textColor: string;
  icon: JSX.Element;
}) {
  const { oscillatorTypes, toggleWaveType } = useContext(ThaliaPadBoardContext);

  return (
    <button
      type='button'
      className={cn(
        "cursor-pointer w-9 aspect-square rounded bg-gray-300 text-gray-600",
        oscillatorTypes.includes(waveType) && [bgColor, textColor]
      )}
      onClick={() => toggleWaveType(waveType)}
    >
      <div className='w-6 mx-auto'>{icon}</div>
    </button>
  );
}

function WaveTypeSelectionOptions() {
  return (
    <div className='h-full flex flex-col justify-between items-center gap-2'>
      <WaveTypeToggle
        waveType='sine'
        bgColor='bg-pink-300'
        textColor='text-pink-900'
        icon={<SineWaveIcon />}
      />
      <WaveTypeToggle
        waveType='square'
        bgColor='bg-green-300'
        textColor='text-green-900'
        icon={<SquareWaveIcon />}
      />
      <WaveTypeToggle
        waveType='sawtooth'
        bgColor='bg-yellow-300'
        textColor='text-yellow-900'
        icon={<SawtoothWaveIcon />}
      />
      <WaveTypeToggle
        waveType='triangle'
        bgColor='bg-red-300'
        textColor='text-red-900'
        icon={<TriangularWaveIcon />}
      />
    </div>
  );
}

// #region Left ThaliaPad Board
function LeftThaliaPadOptions() {
  const { reverbEnabled, toggleReverb, setSelectedIR } = useContext(
    ThaliaPadBoardContext
  );
  const [reverbIdx, setReverbIdx] = useState(1);
  const currentReverb = useMemo(() => reverbs[reverbIdx], [reverbIdx]);

  useEffect(() => {
    if (
      (reverbEnabled && !currentReverb) ||
      (!reverbEnabled && currentReverb)
    ) {
      toggleReverb();
    }
  }, [currentReverb, reverbEnabled, toggleReverb]);

  return (
    <div className='p-4 w-fit bg-fuchsia-100 border-r-2 border-y-2 rounded-r-xl border-gray-400 flex flex-col gap-4 justify-between items-center'>
      <div className='w-full grid grid-cols-2 gap-4 justify-center items-center'>
        <div className='h-full flex flex-col justify-between items-center gap-2'>
          <button
            type='button'
            className={cn(
              "cursor-pointer w-9 aspect-square rounded-full bg-gray-300 text-gray-600",
              reverbEnabled &&
                ((currentReverb === "basement" && "text-sky-900 bg-sky-300") ||
                  (currentReverb === "church" && "text-teal-900 bg-teal-300") ||
                  (currentReverb === "bathroom" &&
                    "text-purple-900 bg-purple-300") ||
                  (currentReverb === "pipe" && "text-pink-900 bg-pink-300"))
            )}
            onClick={() => {
              setReverbIdx((prevIdx) => {
                const newIdx = (prevIdx + 1) % reverbs.length;
                const nextReverb = reverbs[newIdx];
                if (nextReverb) {
                  setSelectedIR(nextReverb);
                }
                return newIdx;
              });
            }}
          >
            <div className='w-5 mx-auto'>
              <ReverbIcon />
            </div>
          </button>
          <PadKeySelectionButtons
            nextOctaveKeys={["t"]}
            nextNoteKeys={["g"]}
            nextAccidentalKeys={["b"]}
          />
        </div>
        <WaveTypeSelectionOptions />
      </div>
      <div className='w-full flex justify-end items-end'>
        <ThaliaPadJoystick />
      </div>
    </div>
  );
}

function LeftThaliaPadBoard() {
  return (
    <div className='h-fit flex'>
      <div className='bg-gray-50 border-2 border-gray-400 rounded-tl-xl rounded-bl-[8rem]'>
        <div className='w-fit pl-8 pr-4 pt-6 flex flex-nowrap gap-2'>
          {/* 2-/3-/6-/7- */}
          {[1, 3, 8, 10].map((midiId) =>
            MapIdToThaliaPadButton(
              midiId,
              thaliaConfigItems[midiId % 12],
              leftKeys[midiId % 12]
            )
          )}
        </div>
        <div className='pl-11'>
          <div className='w-fit pl-8 pr-4 flex flex-nowrap gap-2'>
            {/* 1/3/5/7 */}
            {[0, 4, 7, 11].map((midiId) =>
              MapIdToThaliaPadButton(
                midiId,
                thaliaConfigItems[midiId % 12],
                leftKeys[midiId % 12]
              )
            )}
          </div>
        </div>
        <div className='pl-22'>
          <div className='w-fit pl-8 pr-4 pb-6 flex flex-nowrap gap-2'>
            {/* 2/4/5-/6 */}
            {[2, 5, 6, 9].map((midiId) =>
              MapIdToThaliaPadButton(
                midiId,
                thaliaConfigItems[midiId % 12],
                leftKeys[midiId % 12]
              )
            )}
          </div>
        </div>
      </div>
      <LeftThaliaPadOptions />
    </div>
  );
}
// #regionend

// #region Right ThaliaPad Board
function RightThaliaPadOptions() {
  const { reverbEnabled, toggleReverb, setSelectedIR } = useContext(
    ThaliaPadBoardContext
  );
  const [reverbIdx, setReverbIdx] = useState(1);
  const currentReverb = useMemo(() => reverbs[reverbIdx], [reverbIdx]);

  useEffect(() => {
    if (
      (reverbEnabled && !currentReverb) ||
      (!reverbEnabled && currentReverb)
    ) {
      toggleReverb();
    }
  }, [currentReverb, reverbEnabled, toggleReverb]);

  return (
    <div className='p-4 w-fit bg-blue-100 border-l-2 border-y-2 rounded-l-xl border-gray-400 flex flex-col gap-4 justify-between items-center'>
      <div className='w-full grid grid-cols-2 gap-4 justify-center items-center'>
        <WaveTypeSelectionOptions />
        <div className='h-full flex flex-col justify-between items-center gap-2'>
          <button
            type='button'
            className={cn(
              "cursor-pointer w-9 aspect-square rounded-full bg-gray-300 text-gray-600",
              reverbEnabled &&
                ((currentReverb === "basement" && "text-sky-900 bg-sky-300") ||
                  (currentReverb === "church" && "text-teal-900 bg-teal-300") ||
                  (currentReverb === "bathroom" &&
                    "text-purple-900 bg-purple-300") ||
                  (currentReverb === "pipe" && "text-pink-900 bg-pink-300"))
            )}
            onClick={() => {
              setReverbIdx((prevIdx) => {
                const newIdx = (prevIdx + 1) % reverbs.length;
                const nextReverb = reverbs[newIdx];
                if (nextReverb) {
                  setSelectedIR(nextReverb);
                }
                return newIdx;
              });
            }}
          >
            <div className='w-5 mx-auto'>
              <ReverbIcon />
            </div>
          </button>
          <PadKeySelectionButtons
            initialOctaveIndex={2}
            nextOctaveKeys={["y"]}
            nextNoteKeys={["h"]}
            nextAccidentalKeys={["n"]}
          />
        </div>
      </div>
      <div className='w-full flex justify-start items-end'>
        <ThaliaPadJoystick />
      </div>
    </div>
  );
}

function RightThaliaPadBoard() {
  return (
    <div className='h-fit flex'>
      <RightThaliaPadOptions />
      <div className='bg-gray-50 border-2 border-gray-400 rounded-br-xl rounded-tr-[8rem]'>
        <div className='w-fit pl-8 pr-4 pt-6 flex flex-nowrap gap-2'>
          {/* 2-/3-/6-/7- */}
          {[1, 3, 8, 10].map((midiId) =>
            MapIdToThaliaPadButton(
              midiId,
              thaliaConfigItems[midiId % 12],
              rightKeys[midiId % 12]
            )
          )}
        </div>
        <div className='pl-11'>
          <div className='w-fit pl-8 pr-4 flex flex-nowrap gap-2'>
            {/* 1/3/5/7 */}
            {[0, 4, 7, 11].map((midiId) =>
              MapIdToThaliaPadButton(
                midiId,
                thaliaConfigItems[midiId % 12],
                rightKeys[midiId % 12]
              )
            )}
          </div>
        </div>
        <div className='pl-22'>
          <div className='w-fit pl-8 pr-4 pb-6 flex flex-nowrap gap-2'>
            {/* 2/4/5-/6 */}
            {[2, 5, 6, 9].map((midiId) =>
              MapIdToThaliaPadButton(
                midiId,
                thaliaConfigItems[midiId % 12],
                rightKeys[midiId % 12]
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// #regionend

// #region ThaliaPad
export default function ThaliaPad() {
  return (
    <div className='flex gap-2'>
      <ThaliaPadBoardProvider>
        <LeftThaliaPadBoard />
      </ThaliaPadBoardProvider>
      <ThaliaPadBoardProvider>
        <RightThaliaPadBoard />
      </ThaliaPadBoardProvider>
    </div>
  );
}
// #regionend

// #region ThaliaPadButton
function ThaliaPadButton({
  frequency,
  configItem,
  keys,
}: {
  frequency: number;
  configItem: ThaliaPadConfigItem;
  keys: string[];
}) {
  const { oscillatorTypes, helperEnabled, detune, audioContext, destination } =
    useContext(ThaliaPadBoardContext);
  const { extraClasses, playingClasses } = configItem;
  const [isPlaying, setIsPlaying] = useState(false);
  const { start: startSine } = useOscillator({
    frequency,
    destination,
    type: "sine",
  });
  const { start: startSquare } = useOscillator({
    frequency,
    destination,
    type: "square",
  });
  const { start: startSawtooth } = useOscillator({
    frequency,
    destination,
    type: "sawtooth",
  });
  const { start: startTriangle } = useOscillator({
    frequency,
    destination,
    type: "triangle",
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
    const numOscillators = oscillatorTypes.length || 1;
    if (audioContext && destination && !isPlaying) {
      if (!stopSineRef.current && oscillatorTypes.includes("sine")) {
        const { stop, oscillator } = startSine({
          gain: 2 / numOscillators,
          detune,
        });
        oscillatorSineRef.current = oscillator;
        stopSineRef.current = stop;
      }
      if (!stopSquareRef.current && oscillatorTypes.includes("square")) {
        const { stop, oscillator } = startSquare({
          gain: 0.3 / numOscillators,
          detune,
        });
        oscillatorSquareRef.current = oscillator;
        stopSquareRef.current = stop;
      }
      if (!stopSawtoothRef.current && oscillatorTypes.includes("sawtooth")) {
        const { stop, oscillator } = startSawtooth({
          gain: 0.3 / numOscillators,
          detune,
        });
        oscillatorSawtoothRef.current = oscillator;
        stopSawtoothRef.current = stop;
      }
      if (!stopTriangleRef.current && oscillatorTypes.includes("triangle")) {
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
    oscillatorTypes,
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
    [keys, playOscillator]
  );

  const keyUpHandler = useCallback(
    (event: KeyboardEvent) => {
      if (keys.includes(event.key.toLowerCase())) {
        stopOscillator();
      }
    },
    [keys, stopOscillator]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
    };
  }, [keyDownHandler, keyUpHandler]);

  return (
    <button
      type='button'
      className={cn([
        "cursor-pointer w-20 aspect-square rounded-full font-bold text-lg bg-gray-300",
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
// #regionend

// #region Icons
export function ArrowUpBold({
  title = "Arrow Up",
  ...props
}: { title?: string } & SVGProps<SVGSVGElement>) {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        viewBox='0 0 24 24'
        aria-hidden='true'
        {...props}
      >
        <title>{title}</title>
        <path
          fill='currentColor'
          d='m3.165 19.503l7.362-16.51c.59-1.324 2.355-1.324 2.946 0l7.362 16.51c.667 1.495-.814 3.047-2.202 2.306l-5.904-3.152c-.459-.245-1-.245-1.458 0l-5.904 3.152c-1.388.74-2.87-.81-2.202-2.306'
        ></path>
      </svg>
      <span className='sr-only'>{title}</span>
    </>
  );
}

export function ArrowUpOutline({
  title = "Arrow Up",
  ...props
}: { title?: string } & SVGProps<SVGSVGElement>) {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        viewBox='0 0 24 24'
        aria-hidden='true'
        {...props}
      >
        <title>{title}</title>
        <path
          fill='currentColor'
          fillRule='evenodd'
          d='M21.047 22.013c.654-.685.94-1.768.473-2.816l-7.363-16.51a2.338 2.338 0 0 0-4.315 0L2.48 19.197a2.55 2.55 0 0 0 .473 2.816c.659.69 1.735 1.009 2.767.458l-.353-.662l.353.662l5.904-3.152l-.354-.662l.354.662a.79.79 0 0 1 .752 0l5.904 3.152l.353-.662l-.353.662c1.032.55 2.108.232 2.767-.458m-2.06-.866l-.351.657zl-5.904-3.152a2.29 2.29 0 0 0-2.165 0l-5.903 3.152c-.356.19-.715.103-.976-.171a1.05 1.05 0 0 1-.188-1.169l7.362-16.51c.326-.73 1.25-.73 1.575 0l7.363 16.51c.2.448.08.889-.188 1.169c-.262.274-.62.36-.976.17'
          clipRule='evenodd'
        ></path>
      </svg>
      <span className='sr-only'>{title}</span>
    </>
  );
}

const SineWaveIcon = ({
  title = "Sine Wave",
  ...props
}: { title?: string } & SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        viewBox='0 0 24 24'
        fill='none'
        aria-hidden='true'
        {...props}
      >
        <title>{title}</title>
        <path
          d='M2 12c2-6 4-6 6 0s4 6 6 0 4-6 6 0 4 6 6 0'
          stroke='currentColor'
          strokeWidth='2'
          fill='none'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
      <span className='sr-only'>{title}</span>
    </>
  );
};

const SquareWaveIcon = ({
  title = "Square Wave",
  ...props
}: { title?: string } & SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        viewBox='0 0 24 24'
        fill='none'
        aria-hidden='true'
        {...props}
      >
        <title>{title}</title>
        <g transform='translate(0, 10)'>
          <path
            d='M2 4h4V-2h4v6h4V-2h4v6h4'
            stroke='currentColor'
            strokeWidth='2'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
      </svg>
      <span className='sr-only'>{title}</span>
    </>
  );
};

const SawtoothWaveIcon = ({
  title = "Sawtooth Wave",
  ...props
}: { title?: string } & SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        viewBox='0 0 24 24'
        fill='none'
        aria-hidden='true'
        {...props}
      >
        <title>{title}</title>
        <g transform='translate(0, 12)'>
          <path
            d='M2 4l6 -8v8l6 -8v8l6 -8v8'
            stroke='currentColor'
            strokeWidth='2'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
      </svg>
      <span className='sr-only'>{title}</span>
    </>
  );
};

const TriangularWaveIcon = ({
  title = "Triangular Wave",
  ...props
}: { title?: string } & SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        viewBox='0 0 24 24'
        fill='none'
        aria-hidden='true'
        {...props}
      >
        <title>{title}</title>
        <g transform='translate(0, 11)'>
          <path
            d='M2 4l6 -4l6 4l6 -4l6 4'
            stroke='currentColor'
            strokeWidth='2'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
      </svg>
      <span className='sr-only'>{title}</span>
    </>
  );
};

const ReverbIcon = ({
  title = "Triangular Wave",
  ...props
}: { title?: string } & SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        viewBox='0 0 24 24'
        fill='none'
        aria-hidden='true'
        {...props}
      >
        <title>{title}</title>
        <g transform='translate(0, 5.1)'>
          <path
            d='M8 12c-2 -3 -2 -7 0 -10'
            stroke='currentColor'
            strokeWidth='2'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M16 12c2 -3 2 -7 0 -10'
            stroke='currentColor'
            strokeWidth='2'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M4 14c-3 -4 -3 -10 0 -14'
            stroke='currentColor'
            strokeWidth='2'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M20 14c3 -4 3 -10 0 -14'
            stroke='currentColor'
            strokeWidth='2'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
      </svg>
      <span className='sr-only'>{title}</span>
    </>
  );
};

const MinusIcon = ({
  title = "Minus Icon",
  ...props
}: { title?: string } & SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        viewBox='0 0 24 24'
        fill='none'
        aria-hidden='true'
        {...props}
      >
        <title>{title}</title>
        <path
          d='M5 12h14'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
      <span className='sr-only'>{title}</span>
    </>
  );
};

const NullIcon = ({
  title = "Null Icon",
  ...props
}: { title?: string } & SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        viewBox='0 0 24 24'
        fill='none'
        aria-hidden='true'
        {...props}
      >
        <title>{title}</title>
        <circle
          cx='12'
          cy='12'
          r='6'
          stroke='currentColor'
          strokeWidth='2'
          fill='none'
        />
        <path
          d='M18 6L6 18'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
      <span className='sr-only'>{title}</span>
    </>
  );
};

const PlusIcon = ({
  title = "Plus Icon",
  ...props
}: { title?: string } & SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        viewBox='0 0 24 24'
        fill='none'
        aria-hidden='true'
        {...props}
      >
        <title>{title}</title>
        <path
          d='M12 5v14M5 12h14'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
      <span className='sr-only'>{title}</span>
    </>
  );
};

const DoublePlusIcon = ({
  title = "Double Plus Icon",
  ...props
}: { title?: string } & SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        viewBox='0 0 24 24'
        fill='none'
        aria-hidden='true'
        {...props}
      >
        <title>{title}</title>
        <path
          d='M8 5v14M1 12h14'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M16 5v14M9 12h14'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
      <span className='sr-only'>{title}</span>
    </>
  );
};

const TriplePlusIcon = ({
  title = "Triple Plus Icon",
  ...props
}: { title?: string } & SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        viewBox='0 0 24 24'
        fill='none'
        aria-hidden='true'
        {...props}
      >
        <title>{title}</title>
        <g transform='translate(0, 2)'>
          <path
            d='M12 4v4M10 6h4'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M8 10v4M6 12h4'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M16 10v4M14 12h4'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
      </svg>
      <span className='sr-only'>{title}</span>
    </>
  );
};
// #regionend
