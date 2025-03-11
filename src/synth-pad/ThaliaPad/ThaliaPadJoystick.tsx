import { useCallback, useEffect, useRef, useState } from "react";
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

function clientToContainerCoords(
  clientX: number,
  clientY: number,
  containerBox: Box
) {
  const { width, height, top, left } = containerBox;
  const x = (clientX - left) / width;
  const y = (clientY - top) / height;
  return { x, y };
}

export function ThaliaPadJoystick() {
  const { setDetune } = useSafeContext(ThaliaPadBoardContext);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerBox, setContainerBox] = useState<Box>({ ...defaultBox });
  const tipRef = useRef<HTMLDivElement>(null);
  const [tipBox, setTipBox] = useState<Box>({ ...defaultBox });
  const [tipPosition, setTipPosition] = useState({ x: 0, y: 0 }); // -- relative to container, [0, 1], (0, 0) -> top-left, (1, 1) -> bottom-right

  console.log("!!!con", containerBox);
  console.log("!!!tip", tipBox);

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
        setTipPosition({ x: 0.5, y: 0.5 });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [pressedArrowKeys, setPressedArrowKeys] = useState<ArrowKey[]>([]);

  const keyDownHandler = useCallback((event: KeyboardEvent) => {
    if (event.key === "ArrowUp") {
      setTipPosition((prev) => ({ x: prev.x, y: 0 }));
      setPressedArrowKeys((prev) => [...prev, "ArrowUp"]);
    } else if (event.key === "ArrowDown") {
      setTipPosition((prev) => ({ x: prev.x, y: 1 }));
      setPressedArrowKeys((prev) => [...prev, "ArrowDown"]);
    } else if (event.key === "ArrowLeft") {
      setTipPosition((prev) => ({ x: 0, y: prev.y }));
      setPressedArrowKeys((prev) => [...prev, "ArrowLeft"]);
    } else if (event.key === "ArrowRight") {
      setTipPosition((prev) => ({ x: 1, y: prev.y }));
      setPressedArrowKeys((prev) => [...prev, "ArrowRight"]);
    }
  }, []);

  const keyUpHandler = useCallback(
    (event: KeyboardEvent) => {
      if (isArrowKey(event.key) && pressedArrowKeys.includes(event.key)) {
        setPressedArrowKeys((prev) => {
          const pressedKeys = prev.filter((key) => key !== event.key);
          setTipPosition(() => {
            let x = 0.5;
            let y = 0.5;
            if (pressedKeys.includes("ArrowUp")) {
              y = 0;
            } else if (pressedKeys.includes("ArrowDown")) {
              y = 1;
            }
            if (pressedKeys.includes("ArrowLeft")) {
              x = 0;
            } else if (pressedKeys.includes("ArrowRight")) {
              x = 1;
            }
            return { x, y };
          });
          return pressedKeys;
        });
      }
    },
    [pressedArrowKeys]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
    };
  }, [keyDownHandler, keyUpHandler]);

  useEffect(() => {
    setDetune((1 - 2 * tipPosition.y) * 1200 - (1 - 2 * tipPosition.x) * 700);
  }, [tipPosition, setDetune]);

  return (
    <div
      ref={containerRef}
      className='relative w-16 aspect-square rounded-full bg-gray-500/15'
      onClick={(event) => {
        console.log("!!!event", event);
        const { clientX, clientY } = event;
        console.log("!!!container", containerBox);
        console.log("!!!client", clientX, clientY);
        console.log(
          "!!!coords",
          clientToContainerCoords(clientX, clientY, containerBox)
        );
        setTipPosition(clientToContainerCoords(clientX, clientY, containerBox));
      }}
    >
      <div
        ref={tipRef}
        className='absolute w-8 aspect-square rounded-full bg-fuchsia-400'
        style={{
          left: `${tipPosition.x * containerBox.width - tipBox.width / 2}px`,
          top: `${tipPosition.y * containerBox.height - tipBox.height / 2}px`,
        }}
      ></div>
    </div>
  );
}
