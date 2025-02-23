import { useContext, useMemo } from "react";
import "./App.css";
import { MainAudioContext } from "./audio-context/MainAudioContext";
import {
  playKick,
  playSnare,
  playTom1,
  playTom2,
  playTom3,
} from "./utils/audio";
import { AudioSetup } from "./audio-context/types";

function App() {
  const mainAudioContext = useContext(MainAudioContext);
  const { audioContext, mainNode } = mainAudioContext?.state ?? {};

  if (!mainAudioContext?.state || !audioContext || !mainNode) {
    return (
      <div className='w-full h-screen flex justify-center items-center bg-slate-800'>
        <div className='flex flex-col justify-center items-center'>
          <h1 className='text-3xl font-bold text-slate-200'>
            Audio Context not ready!
          </h1>
          <p className='text-slate-300'>
            If this persists, try reloading the page :/
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full h-screen flex justify-center items-center bg-slate-800'>
      <div className='flex flex-col justify-center items-center gap-4'>
        <div className='flex flex-col justify-center items-center'>
          <h1 className='text-3xl font-bold text-slate-200'>TEST!</h1>
          <p className='text-slate-300'>This is a test :)</p>
        </div>
        <button
          type='button'
          className='cursor-pointer px-4 py-2 font-bold bg-slate-500 border-4 border-slate-900'
          onMouseDown={() => {
            playKick({ audioContext, destination: mainNode });
          }}
        >
          Kick
        </button>
        <button
          type='button'
          className='cursor-pointer px-4 py-2 font-bold bg-slate-500 border-4 border-slate-900'
          onMouseDown={() => {
            playSnare({ audioContext, destination: mainNode });
          }}
        >
          Snare
        </button>
        <button
          type='button'
          className='cursor-pointer px-4 py-2 font-bold bg-slate-500 border-4 border-slate-900'
          onMouseDown={() => {
            playTom1({ audioContext, destination: mainNode });
          }}
        >
          Tom 1
        </button>
        <button
          type='button'
          className='cursor-pointer px-4 py-2 font-bold bg-slate-500 border-4 border-slate-900'
          onMouseDown={() => {
            playTom2({ audioContext, destination: mainNode });
          }}
        >
          Tom 2
        </button>
        <button
          type='button'
          className='cursor-pointer px-4 py-2 font-bold bg-slate-500 border-4 border-slate-900'
          onMouseDown={() => {
            playTom3({ audioContext, destination: mainNode });
          }}
        >
          Tom 3
        </button>
      </div>
    </div>
  );
}

export default App;
