import { CanvasHTMLAttributes, useEffect, useRef } from 'react';

function defaultDraw(ctx: CanvasRenderingContext2D, frameCount: number) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(50, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI);
  ctx.fill();
}

export default function Canvas({
  draw = defaultDraw,
  ...rest
}: CanvasHTMLAttributes<HTMLCanvasElement> & {
  draw: (canvasCtx: CanvasRenderingContext2D, frameCount: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasCtx = canvasRef.current?.getContext('2d');
    if (!canvasCtx) {
      console.error('Canvas context is not available');
      return;
    }

    let frameCount = 0;
    const render = () => {
      frameCount++;
      draw(canvasCtx, frameCount);
      return window.requestAnimationFrame(render);
    };

    const animationFrameId = render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return <canvas ref={canvasRef} {...rest} />;
}
