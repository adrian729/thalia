import { useRef } from 'react';
import Canvas from '../utils/Canvas';
import useAnalyser from './useAnalyser';

function draw(
  canvasCtx: CanvasRenderingContext2D,
  analyser: AnalyserNode,
  dataArray: Uint8Array,
  deltaTime: DOMHighResTimeStamp,
  showFps: boolean,
) {
  const fps = 1000 / deltaTime;

  const WIDTH = canvasCtx.canvas.width;
  const HEIGHT = canvasCtx.canvas.height;

  const bufferLength = analyser.fftSize;

  analyser.getByteTimeDomainData(dataArray);

  // sky-300, matching the pad button palette
  canvasCtx.fillStyle = 'rgb(125 211 252)';
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  canvasCtx.lineWidth = 2;
  // sky-900
  canvasCtx.strokeStyle = 'rgb(12 74 110)';

  canvasCtx.beginPath();
  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * HEIGHT) / 2;

    const x = (i * WIDTH) / bufferLength;
    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }
  }

  canvasCtx.lineTo(WIDTH, HEIGHT / 2);
  canvasCtx.stroke();

  if (showFps) {
    canvasCtx.font = '12px Arial';
    canvasCtx.fillStyle = 'rgb(12 74 110)';
    canvasCtx.fillText(`${Math.round(fps)} fps`, 10, 20);
  }
}

export default function Analyser({
  nodeToAnalyze,
  audioContext,
  showFps,
}: {
  nodeToAnalyze: AudioNode;
  audioContext: AudioContext;
  showFps: boolean;
}) {
  const fpsRef = useRef(8); // seems to work pretty well with low values, if we manage to get current freq (or just pass it for the keyboard) then we could use the first octave for each note
  const { analyser, dataArray } = useAnalyser({ nodeToAnalyze, audioContext });

  return (
    <div className='p-4 bg-gray-50 border-2 border-gray-400 rounded-xl'>
      <div className='overflow-hidden rounded-xl'>
        <Canvas
          draw={(
            canvasCtx: CanvasRenderingContext2D,
            _timestamp: DOMHighResTimeStamp,
            deltaTime: DOMHighResTimeStamp,
            _frameCount: number,
          ) =>
            draw(canvasCtx, analyser, dataArray as Uint8Array, deltaTime, showFps)
          }
          fpsRef={fpsRef}
        />
      </div>
    </div>
  );
}
