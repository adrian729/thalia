import { useContext } from "react";
import { MainAudioContext } from "./audio-context/MainAudioContext";
import DrumPad from "./synth-pad/DrumPad";
import ThaliaPad from "./synth-pad/ThaliaPad/ThaliaPad";

function App() {
  const mainAudioContext = useContext(MainAudioContext);
  const { audioContext, mainNode } = mainAudioContext.state;

  if (!mainAudioContext?.state || !audioContext || !mainNode) {
    return (
      <div className='w-full h-screen flex justify-center items-center bg-gray-200'>
        <div className='flex flex-col justify-center items-center'>
          <h1 className='text-3xl font-bold text-gray-700'>
            Audio Context not ready!
          </h1>
          <p className='text-gray-500'>
            If this persists, try reloading the page :(
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full h-screen flex justify-center items-center bg-gray-100'>
      <div className='flex flex-col justify-center items-center gap-4'>
        <ThaliaPad />
        <div className='border-b-2 border-gray-500 w-full'></div>
        <DrumPad />
        <div className='border-b-2 border-gray-500 w-full'></div>
      </div>
    </div>
  );
}

export default App;
