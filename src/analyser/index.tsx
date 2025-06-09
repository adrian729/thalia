import Canvas from '../utils/Canvas';
import useAnalyser from './useAnalyser';

function draw(
  canvasCtx: CanvasRenderingContext2D,
  analyser: AnalyserNode,
  dataArray: Uint8Array,
) {
  const WIDTH = canvasCtx.canvas.width;
  const HEIGHT = canvasCtx.canvas.height;

  const bufferLength = analyser.fftSize;

  analyser.getByteTimeDomainData(dataArray);

  canvasCtx.fillStyle = 'rgb(200 200 200)';
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = 'rgb(0 0 0)';

  const sliceWidth = (WIDTH) / bufferLength;
  let x = 0;

  canvasCtx.beginPath();
  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * HEIGHT) / 2;

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(WIDTH, HEIGHT / 2);
  canvasCtx.stroke();
}

export default function Analyser({
  nodeToAnalyze,
  audioContext,
}: {
  nodeToAnalyze: AudioNode;
  audioContext: AudioContext;
}) {
  const { analyser, dataArray } = useAnalyser({ nodeToAnalyze, audioContext });

  return (
    <Canvas
      draw={(canvasCtx: CanvasRenderingContext2D) =>
        draw(canvasCtx, analyser, dataArray as Uint8Array)
      }
    />
  );
}
