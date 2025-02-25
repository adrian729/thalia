import { ClassValue } from "clsx";
import { MainAudioContext } from "../audio-context/MainAudioContext";
import { cn } from "../utils/styles";
import {
  JSX,
  SVGProps,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { notes } from "../utils/notes";
import { playSynth } from "../utils/audio";

type ThaliaPadConfigItem = {
  id: number;
  scaleValue: number;
  playingClasses: ClassValue;
  extraClasses: ClassValue;
  keys: string[];
};

// 1+ / 2- / 2+ / 3- / 3+ / 4+ / 5- / 5+ / 6- / 6+ / 7- / 7+ / 8+
// 00 / 01 / 02 / 03 / 04 / 05 / 06 / 07 / 08 / 09 / 10 / 11 / 12
// 12 / 13 / 14 / 15 / 16 / 17 / 18 / 19 / 20 / 21 / 22 / 23 / 24

const leftThaliaConfigItems: ThaliaPadConfigItem[] = [
  {
    id: 0,
    scaleValue: 1,
    extraClasses: "bg-red-300",
    playingClasses: "bg-red-100",
    keys: ["a"],
  },
  {
    id: 1,
    scaleValue: -2,
    extraClasses: "bg-orange-300",
    playingClasses: "bg-orange-100",
    keys: ["q"],
  },
  {
    id: 2,
    scaleValue: 2,
    extraClasses: "bg-amber-300",
    playingClasses: "bg-amber-100",
    keys: ["z"],
  },
  {
    id: 3,
    scaleValue: -3,
    extraClasses: "bg-yellow-300",
    playingClasses: "bg-yellow-100",
    keys: ["w"],
  },
  {
    id: 4,
    scaleValue: 3,
    extraClasses: "bg-lime-300",
    playingClasses: "bg-lime-100",
    keys: ["s"],
  },
  {
    id: 5,
    scaleValue: 4,
    extraClasses: "bg-green-300",
    playingClasses: "bg-green-100",
    keys: ["x"],
  },
  {
    id: 6,
    scaleValue: -5,
    extraClasses: "bg-emerald-300",
    playingClasses: "bg-emerald-100",
    keys: ["c"],
  },
  {
    id: 7,
    scaleValue: 5,
    extraClasses: "bg-sky-300",
    playingClasses: "bg-sky-100",
    keys: ["d"],
  },
  {
    id: 8,
    scaleValue: -6,
    extraClasses: "bg-indigo-300",
    playingClasses: "bg-indigo-100",
    keys: ["e"],
  },
  {
    id: 9,
    scaleValue: 6,
    extraClasses: "bg-violet-300",
    playingClasses: "bg-violet-100",
    keys: ["v"],
  },
  {
    id: 10,
    scaleValue: -7,
    extraClasses: "bg-purple-300",
    playingClasses: "bg-purple-100",
    keys: ["r"],
  },
  {
    id: 11,
    scaleValue: 7,
    extraClasses: "bg-fuchsia-300",
    playingClasses: "bg-fuchsia-100",
    keys: ["f"],
  },
];

const rightThaliaConfigItems: ThaliaPadConfigItem[] = [
  {
    id: 0,
    scaleValue: 1,
    extraClasses: "bg-red-300",
    playingClasses: "bg-red-100",
    keys: ["j"],
  },
  {
    id: 1,
    scaleValue: -2,
    extraClasses: "bg-orange-300",
    playingClasses: "bg-orange-100",
    keys: ["u"],
  },
  {
    id: 2,
    scaleValue: 2,
    extraClasses: "bg-amber-300",
    playingClasses: "bg-amber-100",
    keys: ["m"],
  },
  {
    id: 3,
    scaleValue: -3,
    extraClasses: "bg-yellow-300",
    playingClasses: "bg-yellow-100",
    keys: ["i"],
  },
  {
    id: 4,
    scaleValue: 3,
    extraClasses: "bg-lime-300",
    playingClasses: "bg-lime-100",
    keys: ["k"],
  },
  {
    id: 5,
    scaleValue: 4,
    extraClasses: "bg-green-300",
    playingClasses: "bg-green-100",
    keys: [","],
  },
  {
    id: 6,
    scaleValue: -5,
    extraClasses: "bg-emerald-300",
    playingClasses: "bg-emerald-100",
    keys: ["."],
  },
  {
    id: 7,
    scaleValue: 5,
    extraClasses: "bg-sky-300",
    playingClasses: "bg-sky-100",
    keys: ["l"],
  },
  {
    id: 8,
    scaleValue: -6,
    extraClasses: "bg-indigo-300",
    playingClasses: "bg-indigo-100",
    keys: ["o"],
  },
  {
    id: 9,
    scaleValue: 6,
    extraClasses: "bg-violet-300",
    playingClasses: "bg-violet-100",
    keys: ["/"],
  },
  {
    id: 10,
    scaleValue: -7,
    extraClasses: "bg-purple-300",
    playingClasses: "bg-purple-100",
    keys: ["p"],
  },
  {
    id: 11,
    scaleValue: 7,
    extraClasses: "bg-fuchsia-300",
    playingClasses: "bg-fuchsia-100",
    keys: [";"],
  },
];

export default function ThaliaPad() {
  const mapIdToThaliaPadButton = useCallback(
    (midiId: number, configItem: ThaliaPadConfigItem): JSX.Element => {
      return (
        <ThaliaPadButton
          key={midiId}
          frequency={notes[midiId + 24].frequency}
          configItem={configItem}
        />
      );
    },
    []
  );

  return (
    <div className='border-2 border-gray-900 rounded-xl rounded-bl-[8rem] rounded-tr-[8rem]'>
      <div className='w-fit px-8 pt-6 flex flex-nowrap gap-2'>
        {/* 2-/3-/6-/7- */}
        {[1, 3, 8, 10].map((midiId) =>
          mapIdToThaliaPadButton(midiId, leftThaliaConfigItems[midiId % 12])
        )}
        <button
          type='button'
          className={cn([
            "cursor-pointer w-20 aspect-square rounded-full bg-teal-600",
          ])}
          onMouseDown={() => {}}
        >
          <div className='w-12 mx-auto text-pink-300'>
            <ArrowUpOutline />
          </div>
        </button>
        <button
          type='button'
          className={cn([
            "cursor-pointer w-20 aspect-square rounded-full bg-teal-600",
          ])}
          onMouseDown={() => {}}
        >
          <div className='w-12 mx-auto text-pink-300'>
            <ArrowUpOutline />
          </div>
        </button>
        {/* '2-/'3-/'6-/'7- */}
        {[13, 15, 20, 22].map((midiId) =>
          mapIdToThaliaPadButton(midiId, rightThaliaConfigItems[midiId % 12])
        )}
      </div>
      <div className='pl-11'>
        <div className='w-fit px-8 flex flex-nowrap gap-2'>
          {/* 1/3/5/7 */}
          {[0, 4, 7, 11].map((midiId) =>
            mapIdToThaliaPadButton(midiId, leftThaliaConfigItems[midiId % 12])
          )}
          <button
            type='button'
            className={cn([
              "cursor-pointer w-20 aspect-square rounded-full bg-gray-300",
            ])}
            onMouseDown={() => {}}
          >
            <div className='w-12 mx-auto text-red-400'>
              <ArrowUpBold />
            </div>
          </button>
          <button
            type='button'
            className={cn([
              "cursor-pointer w-20 aspect-square rounded-full bg-gray-300",
            ])}
            onMouseDown={() => {}}
          >
            <div className='w-12 mx-auto text-red-400'>
              <ArrowUpBold />
            </div>
          </button>
          {/* 1/3/5/7 */}
          {[12, 16, 19, 23].map((midiId) =>
            mapIdToThaliaPadButton(midiId, rightThaliaConfigItems[midiId % 12])
          )}
        </div>
      </div>
      <div className='pl-22'>
        <div className='w-fit px-8 pb-6 flex flex-nowrap gap-2'>
          {/* 2/4/5-/6 */}
          {[2, 5, 6, 9].map((midiId) =>
            mapIdToThaliaPadButton(midiId, leftThaliaConfigItems[midiId % 12])
          )}
          <button
            type='button'
            className={cn([
              "cursor-pointer w-20 aspect-square rounded-full bg-gray-300",
            ])}
            onMouseDown={() => {}}
          >
            <div className='w-12 mx-auto text-red-400'>
              <ArrowUpBold />
            </div>
          </button>
          <button
            type='button'
            className={cn([
              "cursor-pointer w-20 aspect-square rounded-full bg-gray-300",
            ])}
            onMouseDown={() => {}}
          >
            <div className='w-12 mx-auto text-red-400'>
              <ArrowUpBold />
            </div>
          </button>
          {/* 2/4/5-/6 */}
          {[14, 17, 18, 21].map((midiId) =>
            mapIdToThaliaPadButton(midiId, rightThaliaConfigItems[midiId % 12])
          )}
        </div>
      </div>
    </div>
  );
}

function ThaliaPadButton({
  frequency,
  configItem,
}: {
  frequency: number;
  configItem: ThaliaPadConfigItem;
}) {
  const mainAudioContext = useContext(MainAudioContext);
  const { audioContext, mainNode: destination } = mainAudioContext?.state ?? {};
  const [isPlaying, setIsPlaying] = useState(false);
  const { keys, extraClasses, playingClasses } = configItem;

  const keyDownHandler = useCallback(
    (event: KeyboardEvent) => {
      if (frequency < 20 || frequency > 20000) {
        return;
      }
      if (audioContext && destination && keys.includes(event.key)) {
        setIsPlaying(true);
        playSynth({
          frequency,
          audioContext,
          destination,
        });
      }
    },
    [audioContext, destination, frequency, keys]
  );

  const keyUpHandler = useCallback(
    (event: KeyboardEvent) => {
      if (keys.includes(event.key)) {
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
        "cursor-pointer w-20 aspect-square rounded-full bg-gray-300",
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
