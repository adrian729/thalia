import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  mapCircleToSquare,
  mapSquareToCircle,
  scale,
  Vec2,
} from "../../utils/math";
import useSafeContext from "../../utils/useSafeContext";
import { ThaliaPadBoardContext } from "./ThaliaPadBoardContext";

const ArrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"] as const;
type ArrowKey = (typeof ArrowKeys)[number];
function isArrowKey(key: unknown): key is ArrowKey {
  return ArrowKeys.includes(key as ArrowKey);
}

type Box = {
  width: number;
  height: number;
  top: number;
  left: number;
};
const defaultBox = {
  width: 0,
  height: 0,
  top: 0,
  left: 0,
};

/**
 * Get the coordinates of the pitch from the pressed arrow keys.
 * @param pressedArrowKeys arrow keys that are currently pressed.
 * @returns coordinates {x, y} with x and y in [-1, 1]. left to right (-1 -> 1) and bottom to top (-1 -> 1).
 */
function pitchCoordsFromPressedArrowKeys(pressedArrowKeys: ArrowKey[]) {
  const coords = { x: 0, y: 0 };
  if (pressedArrowKeys.includes("ArrowLeft")) {
    coords.x = -1;
  } else if (pressedArrowKeys.includes("ArrowRight")) {
    coords.x = 1;
  }
  if (pressedArrowKeys.includes("ArrowUp")) {
    coords.y = 1;
  } else if (pressedArrowKeys.includes("ArrowDown")) {
    coords.y = -1;
  }
  return coords;
}

/**
 * Maps pitch coordinates in a square to relative coordinates in the circular container box.
 * @param pitchCoordinates coordinates representing pitch values, square P = {(x, y) | x, y in [-1, 1]}
 * @param container container box.
 * @param tip tip box. Circle
 * @returns coordinates relative to the container box
 */
function pitchCoordsToRelativeCoords(pitchCoordinates: Vec2, container: Box) {
  const { width, height } = container;
  const { x, y } = scale(0.5, mapSquareToCircle(pitchCoordinates));

  return {
    x: 0.5 * width + x * width,
    y: 0.5 * height - y * height,
  };
}

/**
 * Maps relative coordinates in the circular container box to pitch coordinates in a square.
 * @param relativeCoords coordinates relative to the container box.
 * @param container container box.
 * @returns coordinates representing pitch values, square P = {(x, y) | x, y in [-1, 1]}
 */
function relativeCoordsToPitchCoords(relativeCoords: Vec2, container: Box) {
  const { width, height } = container;
  const radius = Math.min(width, height) / 2;
  const squareSize = 2;
  const { x, y } = relativeCoords;
  return mapCircleToSquare(
    { x: x - 0.5 * width, y: -y + 0.5 * width },
    radius,
    squareSize
  );
}

function clientCoordsToPitchCoords(clientCoords: Vec2, containerBox: Box) {
  const { x, y } = clientCoords;
  const { top, left } = containerBox;
  return relativeCoordsToPitchCoords(
    {
      x: x - left,
      y: y - top,
    },
    containerBox
  );
}

/**
 *Get the detune value from a given value in [-1, 1]
 * @param val value in [-1, 1]
 * @returns detune value for a fifth down or up in [-700, 700]
 */
function getFifthDetune(val: number) {
  return val * 700;
}

/**
 *Get the detune value from a given value in [-1, 1]
 * @param val value in [-1, 1]
 * @returns detune value for an octave down or up in [-1200, 1200]
 */
function getOctaveDetune(val: number) {
  return val * 1200;
}

export function ThaliaPadJoystick() {
  const { setDetune } = useSafeContext(ThaliaPadBoardContext);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerBox, setContainerBox] = useState<Box>({ ...defaultBox });
  const tipRef = useRef<HTMLDivElement>(null);
  const [tipBox, setTipBox] = useState<Box>({ ...defaultBox });
  const [isDragging, setIsDragging] = useState(false);
  const [pitchCoords, setPitchCoords] = useState<Vec2>({ x: 0, y: 0 }); // -- square, P = {(x, y) | x, y in [-1, 1]}
  const relativeCoords = useMemo(
    () => pitchCoordsToRelativeCoords(pitchCoords, containerBox),
    [containerBox, pitchCoords]
  );

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && tipRef.current) {
        const {
          width: cWidth,
          height: cHeight,
          top: cTop,
          left: cLeft,
        } = containerRef.current.getBoundingClientRect();
        setContainerBox({
          width: cWidth,
          height: cHeight,
          top: cTop,
          left: cLeft,
        });

        const {
          width: tWidth,
          height: tHeight,
          top: tTop,
          left: tLeft,
        } = tipRef.current.getBoundingClientRect();
        setTipBox({
          width: tWidth,
          height: tHeight,
          top: tTop,
          left: tLeft,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [pressedArrowKeys, setPressedArrowKeys] = useState<ArrowKey[]>([]);

  useEffect(() => {
    setPitchCoords(pitchCoordsFromPressedArrowKeys(pressedArrowKeys));
  }, [pressedArrowKeys]);

  const keyDownHandler = useCallback((event: KeyboardEvent) => {
    if (isArrowKey(event.key)) {
      setPressedArrowKeys((prev) => [...prev, event.key as ArrowKey]);
    }
  }, []);

  const keyUpHandler = useCallback((event: KeyboardEvent) => {
    if (isArrowKey(event.key)) {
      setPressedArrowKeys((prev) => prev.filter((key) => key !== event.key));
    }
  }, []);

  const mouseMoveHandler = useCallback(
    (event: MouseEvent) => {
      if (isDragging) {
        const { clientX, clientY } = event;
        setPitchCoords(
          clientCoordsToPitchCoords({ x: clientX, y: clientY }, containerBox)
        );
      }
    },
    [containerBox, isDragging]
  );

  const mouseUpHandler = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [keyDownHandler, keyUpHandler, mouseMoveHandler, mouseUpHandler]);

  useEffect(() => {
    setDetune(getOctaveDetune(pitchCoords.y) + getFifthDetune(pitchCoords.x));
  }, [pitchCoords, setDetune]);

  return (
    <div className='p-2 w-16 aspect-square rounded-full flex items-center justify-center bg-gray-500/15'>
      <div
        ref={containerRef}
        className='relative w-full aspect-square rounded-full'
        onMouseDown={(event) => {
          const { clientX, clientY } = event;
          setPitchCoords(
            clientCoordsToPitchCoords({ x: clientX, y: clientY }, containerBox)
          );
          setIsDragging(true);
        }}
      >
        <div
          ref={tipRef}
          className='absolute w-5 aspect-square rounded-full bg-fuchsia-400'
          style={{
            left: `${relativeCoords.x - 0.5 * tipBox.width}px`,
            top: `${relativeCoords.y - 0.5 * tipBox.height}px`,
          }}
        ></div>
      </div>
    </div>
  );
}
