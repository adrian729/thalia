import { CanvasHTMLAttributes, RefObject, useEffect, useRef } from 'react';

function defaultDraw(ctx: CanvasRenderingContext2D, frameCount: number) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(50, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI);
  ctx.fill();
}

export default function Canvas({
  draw = defaultDraw,
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
  const renderTimestampRef = useRef<DOMHighResTimeStamp>(performance.now());

  useEffect(() => {
    const canvasCtx = canvasRef.current?.getContext('2d');
    if (!canvasCtx) {
      console.error('Canvas context is not available');
      return;
    }

    let frameCount = 0;
    const render = (timestamp: DOMHighResTimeStamp) => {
      const animationFrameID = window.requestAnimationFrame(render);

      const deltaTime = timestamp - renderTimestampRef.current;
      const fpsInterval = 1000 / (fpsRef?.current ?? 60);
      if (deltaTime >= fpsInterval) {
        renderTimestampRef.current = timestamp - (deltaTime % fpsInterval);
        frameCount++;
        draw(canvasCtx, timestamp, deltaTime, frameCount);
      }

      return animationFrameID;
    };

    const animationFrameId = render(performance.now());

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return <canvas ref={canvasRef} {...rest} />;
}
