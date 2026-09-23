import { CanvasHTMLAttributes, RefObject, useEffect, useRef } from 'react';

export default function Canvas({
  draw,
  fpsRef,
  ...rest
}: CanvasHTMLAttributes<HTMLCanvasElement> & {
  draw: (
    canvasCtx: CanvasRenderingContext2D,
    timestamp: DOMHighResTimeStamp,
    renderTimestamp: DOMHighResTimeStamp,
    frameCount: number,
  ) => void;
  fpsRef?: RefObject<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTimestampRef = useRef<DOMHighResTimeStamp | undefined>(undefined);
  // Lazy init: avoids calling performance.now() on every render.
  if (renderTimestampRef.current === undefined) {
    renderTimestampRef.current = performance.now();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas?.getContext('2d');
    if (!canvas || !canvasCtx) {
      console.error('Canvas context is not available');
      return;
    }

    // Back the canvas with dpr-scaled pixels but keep drawing in CSS pixel coordinates.
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
    canvasCtx.scale(dpr, dpr);

    let frameCount = 0;
    let currentFrameId: number;
    const render = (timestamp: DOMHighResTimeStamp) => {
      currentFrameId = window.requestAnimationFrame(render);

      const deltaTime = timestamp - (renderTimestampRef.current ?? timestamp);
      const fpsInterval = 1000 / (fpsRef?.current ?? 60);
      if (deltaTime >= fpsInterval) {
        renderTimestampRef.current = timestamp - (deltaTime % fpsInterval);
        frameCount++;
        draw(canvasCtx, timestamp, deltaTime, frameCount);
      }
    };

    render(performance.now());

    return () => {
      window.cancelAnimationFrame(currentFrameId);
    };
  }, [draw, fpsRef]);

  return <canvas ref={canvasRef} {...rest} />;
}
