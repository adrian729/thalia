import { ClassValue } from "clsx";
import { MainAudioContext } from "../audio-context/MainAudioContext";
import { cn } from "../utils/styles";
import {
  createContext,
  Dispatch,
  JSX,
  PropsWithChildren,
  SetStateAction,
  SVGProps,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { notes } from "../utils/notes";
import { playSynth } from "../utils/audio";
import { IRType, useReverb } from "../audio-context/useReverb";

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

function mapIdToThaliaPadButton(
  midiId: number,
  configItem: ThaliaPadConfigItem,
  keys: string[]
): JSX.Element {
  return (
    <ThaliaPadButton
      key={midiId}
      frequency={notes[midiId + 36].frequency}
      configItem={configItem}
      keys={keys}
    />
  );
}

const defaultAudioContext = new AudioContext();
type ThaliaPadBoardContextType = {
  helperEnabled: boolean;
  setHelperEnabled: Dispatch<SetStateAction<boolean>>;
  oscillatorTypes: OscillatorType[];
  setOscillatorTypes: Dispatch<SetStateAction<OscillatorType[]>>;
  toggleWaveType: (oscillatorType: OscillatorType) => void;
  reverbEnabled: boolean;
  setReverbEnabled: Dispatch<SetStateAction<boolean>>;
  toggleReverb: () => void;
  setSelectedIR: (selectedIR: IRType) => void;
  audioContext: AudioContext;
  destination: AudioNode;
};
const ThaliaPadBoardContext = createContext<ThaliaPadBoardContextType>({
  helperEnabled: false,
  setHelperEnabled: () => {},
  oscillatorTypes: ["sine", "square", "sawtooth", "triangle"],
  setOscillatorTypes: () => {},
  toggleWaveType: () => {},
  reverbEnabled: false,
  setReverbEnabled: () => {},
  toggleReverb: () => {},
  setSelectedIR: () => {},
  audioContext: defaultAudioContext,
  destination: new GainNode(defaultAudioContext, { gain: 1 }),
});
export function ThaliaPadBoardProvider({ children }: PropsWithChildren) {
  const [helperEnabled, setHelperEnabled] = useState(false);

  const [oscillatorTypes, setOscillatorTypes] = useState<OscillatorType[]>([
    "sine",
    "square",
    "sawtooth",
    "triangle",
  ]);
  const toggleWaveType = useCallback((oscillatorType: OscillatorType) => {
    setOscillatorTypes((prev) => {
      if (prev.includes(oscillatorType)) {
        return prev.filter((type) => type !== oscillatorType);
      }
      return [...prev, oscillatorType];
    });
  }, []);

  const mainAudioContext = useContext(MainAudioContext);
  const { audioContext, mainNode } = mainAudioContext.state;
  const destinationRef = useRef(new GainNode(audioContext, { gain: 1 }));
  const [reverbEnabled, setReverbEnabled] = useState(true);
  const wetGainValue = useMemo(() => 0.2, []);
  const { dry, wet, setWetGain, setSelectedIR } = useReverb({
    selectedIR: "basement",
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

  return (
    <ThaliaPadBoardContext.Provider
      value={{
        helperEnabled,
        setHelperEnabled,
        oscillatorTypes,
        setOscillatorTypes,
        toggleWaveType,
        reverbEnabled,
        setReverbEnabled,
        toggleReverb,
        setSelectedIR,
        audioContext: audioContext!,
        destination: destinationRef.current,
      }}
    >
      {children}
    </ThaliaPadBoardContext.Provider>
  );
}

const reverbs: (IRType | null)[] = [
  null,
  "basement",
  "church",
  "bathroom",
  "pipe",
];

function LeftThaliaPadOptions() {
  const {
    oscillatorTypes,
    toggleWaveType,
    reverbEnabled,
    toggleReverb,
    setSelectedIR,
  } = useContext(ThaliaPadBoardContext);
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
              "cursor-pointer w-9 aspect-square rounded bg-gray-300 text-gray-600",
              oscillatorTypes.includes("sine") && "text-pink-900 bg-pink-300"
            )}
            onClick={() => toggleWaveType("sine")}
          >
            <div className='w-6 mx-auto'>
              <SineWaveIcon />
            </div>
          </button>
          <button
            type='button'
            className={cn(
              "cursor-pointer w-9 aspect-square rounded text-gray-900 bg-gray-300",
              oscillatorTypes.includes("square") &&
                "text-green-900 bg-green-300"
            )}
            onClick={() => toggleWaveType("square")}
          >
            <div className='w-6 mx-auto'>
              <SquareWaveIcon />
            </div>
          </button>
          <button
            type='button'
            className={cn(
              "cursor-pointer w-9 aspect-square rounded text-gray-900 bg-gray-300",
              oscillatorTypes.includes("sawtooth") &&
                "text-yellow-900 bg-yellow-300"
            )}
            onClick={() => toggleWaveType("sawtooth")}
          >
            <div className='w-6 mx-auto'>
              <SawtoothWaveIcon />
            </div>
          </button>
          <button
            type='button'
            className={cn(
              "cursor-pointer w-9 aspect-square rounded text-gray-900 bg-gray-300",
              oscillatorTypes.includes("triangle") && "text-red-900 bg-red-300"
            )}
            onClick={() => toggleWaveType("triangle")}
          >
            <div className='w-6 mx-auto'>
              <TriangularWaveIcon />
            </div>
          </button>
        </div>
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
        </div>
      </div>
      <div className='w-full flex justify-end items-end'>
        <div className='relative w-16 aspect-square rounded-full bg-gray-300'>
          {/* // TODO: move "joystick" around, calc (x,y) coordinates and translate to absolute positions. 
        // ! We need to take into account the "joystick" size also (0,0) -> (w_full - joy_size, h_full - joy_size) */}
          <div className='absolute top-0 left-0 w-8 aspect-square rounded-full bg-fuchsia-400'></div>
        </div>
      </div>
    </div>
  );
}

function LeftThaliaPadBoard() {
  return (
    <div className='h-fit flex'>
      <div className='border-2 border-gray-400 rounded-tl-xl rounded-bl-[8rem]'>
        <div className='w-fit pl-8 pr-4 pt-6 flex flex-nowrap gap-2'>
          {/* 2-/3-/6-/7- */}
          {[1, 3, 8, 10].map((midiId) =>
            mapIdToThaliaPadButton(
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
              mapIdToThaliaPadButton(
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
              mapIdToThaliaPadButton(
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

// TODO: once we have things "finished", update right board to be like left board
function RightThaliaPadBoard() {
  const { oscillatorTypes, toggleWaveType } = useContext(ThaliaPadBoardContext);
  return (
    <div className='flex'>
      <div className='py-8 bg-blue-100 border-l-2 border-y-2 rounded-l-xl border-gray-400 px-4 grid grid-cols-1 justify-center items-center gap-4'>
        <button
          type='button'
          className={cn(
            "cursor-pointer w-12 aspect-square bg-gray-300 text-gray-600",
            oscillatorTypes.includes("sine") && "text-pink-900 bg-pink-300"
          )}
          onClick={() => toggleWaveType("sine")}
        >
          <div className='w-8 mx-auto'>
            <SineWaveIcon />
          </div>
        </button>
        <button
          type='button'
          className={cn(
            "cursor-pointer w-12 aspect-square text-gray-900 bg-gray-300",
            oscillatorTypes.includes("square") && "text-green-900 bg-green-300"
          )}
          onClick={() => toggleWaveType("square")}
        >
          <div className='w-8 mx-auto'>
            <SquareWaveIcon />
          </div>
        </button>
        <button
          type='button'
          className={cn(
            "cursor-pointer w-12 aspect-square text-gray-900 bg-gray-300",
            oscillatorTypes.includes("sawtooth") &&
              "text-yellow-900 bg-yellow-300"
          )}
          onClick={() => toggleWaveType("sawtooth")}
        >
          <div className='w-8 mx-auto'>
            <SawtoothWaveIcon />
          </div>
        </button>
        <button
          type='button'
          className={cn(
            "cursor-pointer w-12 aspect-square text-gray-900 bg-gray-300",
            oscillatorTypes.includes("triangle") && "text-red-900 bg-red-300"
          )}
          onClick={() => toggleWaveType("triangle")}
        >
          <div className='w-8 mx-auto'>
            <TriangularWaveIcon />
          </div>
        </button>
      </div>
      <div className='border-2 border-gray-400 rounded-br-xl rounded-tr-[8rem]'>
        <div className='w-fit pr-8 pl-4 pt-6 flex flex-nowrap gap-2'>
          {/* '2-/'3-/'6-/'7- */}
          {[13, 15, 20, 22].map((midiId) =>
            mapIdToThaliaPadButton(
              midiId,
              thaliaConfigItems[midiId % 12],
              rightKeys[midiId % 12]
            )
          )}
        </div>
        <div className='pl-11'>
          <div className='w-fit pr-8 pl-4 flex flex-nowrap gap-2'>
            {/* 1/3/5/7 */}
            {[12, 16, 19, 23].map((midiId) =>
              mapIdToThaliaPadButton(
                midiId,
                thaliaConfigItems[midiId % 12],
                rightKeys[midiId % 12]
              )
            )}
          </div>
        </div>
        <div className='pl-22'>
          <div className='w-fit pr-8 pl-4 pb-6 flex flex-nowrap gap-2'>
            {/* 2/4/5-/6 */}
            {[14, 17, 18, 21].map((midiId) =>
              mapIdToThaliaPadButton(
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
  const [isPlaying, setIsPlaying] = useState(false);
  const { oscillatorTypes, helperEnabled, audioContext, destination } =
    useContext(ThaliaPadBoardContext);
  const { extraClasses, playingClasses } = configItem;

  const keyDownHandler = useCallback(
    (event: KeyboardEvent) => {
      if (frequency < 20 || frequency > 20000) {
        return;
      }
      if (
        !isPlaying &&
        audioContext &&
        destination &&
        keys.includes(event.key.toLowerCase())
      ) {
        setIsPlaying(true);
        playSynth({
          frequency,
          audioContext,
          destination,
          oscillatorTypes,
        });
      }
    },
    [audioContext, destination, frequency, isPlaying, keys, oscillatorTypes]
  );

  const keyUpHandler = useCallback(
    (event: KeyboardEvent) => {
      if (keys.includes(event.key.toLowerCase())) {
        setIsPlaying(false);
      }
    },
    [keys]
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
      onMouseDown={() => {
        setIsPlaying(true);
        if (
          !audioContext ||
          !destination ||
          frequency < 20 ||
          frequency > 20000
        ) {
          return;
        }
        playSynth({
          frequency,
          audioContext,
          destination,
          oscillatorTypes,
        });
      }}
      onMouseUp={() => {
        setIsPlaying(false);
      }}
      onMouseLeave={() => {
        setIsPlaying(false);
      }}
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
        <g transform='translate(0, 11)'>
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
// #regionend
