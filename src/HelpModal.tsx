import { ReactNode, useEffect } from 'react';
import { CloseIcon } from './icons';

const LEFT_PAD_KEY_ROWS = [
  ['q', 'w', 'e', 'r'],
  ['a', 's', 'd', 'f'],
  ['z', 'x', 'c', 'v'],
] as const;
const RIGHT_PAD_KEY_ROWS = [
  ['u', 'i', 'o', 'p'],
  ['j', 'k', 'l', ';'],
  ['m', ',', '.', '/'],
] as const;

const DRUM_KEYS = [
  { key: '1', name: 'Kick' },
  { key: '2', name: 'Snare' },
  { key: '3', name: 'Hi-hat' },
  { key: '4', name: 'Tom 1' },
  { key: '5', name: 'Tom 2' },
  { key: '6', name: 'Tom 3' },
  { key: '7', name: 'Cymbal 1' },
  { key: '8', name: 'Cymbal 2' },
  { key: '9', name: 'Cymbal 3' },
] as const;

export default function HelpModal({
  open,
  onClose,
  helperEnabled,
  setHelperEnabled,
  showFps,
  setShowFps,
}: {
  open: boolean;
  onClose: () => void;
  helperEnabled: boolean;
  setHelperEnabled: (enabled: boolean) => void;
  showFps: boolean;
  setShowFps: (enabled: boolean) => void;
}) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className='fixed inset-0 z-50 flex justify-center items-center bg-black/40 p-4'
      onMouseDown={onClose}
    >
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='help-modal-title'
        className='relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-50 border-2 border-gray-400 rounded-xl p-6 flex flex-col gap-4'
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type='button'
          className='cursor-pointer absolute top-4 right-4 w-8 aspect-square rounded-full bg-gray-300 text-gray-600 hover:bg-gray-400'
          onClick={onClose}
        >
          <div className='w-5 mx-auto'>
            <CloseIcon />
          </div>
        </button>

        <h2 id='help-modal-title' className='text-2xl font-bold text-gray-700'>
          Thalia
        </h2>
        <p className='text-gray-600'>
          A browser synthesizer playground. Play melodies on the two Thalia
          pads, tap out beats on the drum pad, and watch the live analyser
          visualize the output.
        </p>

        <Section title='How to use'>
          <ul className='list-disc list-inside text-gray-600 flex flex-col gap-1'>
            <li>
              Press and hold the pad buttons with the mouse, or use the
              keyboard keys below.
            </li>
            <li>
              The wave buttons toggle the oscillator types (sine, square,
              sawtooth, triangle) mixed into each note.
            </li>
            <li>
              The reverb button cycles through impulse responses: off,
              basement, church, bathroom, pipe.
            </li>
            <li>
              The three round buttons set the pad&apos;s octave, root note, and
              accidental (♭ / ♮ / ♯).
            </li>
            <li>Drag the joystick to detune the pad&apos;s oscillators.</li>
          </ul>
        </Section>

        <Section title='Key mappings'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <KeyGroup label='Left pad — notes'>
              {LEFT_PAD_KEY_ROWS.map((row, index) => (
                <div key={index} className='flex gap-1'>
                  {row.map((key) => (
                    <Kbd key={key}>{key}</Kbd>
                  ))}
                </div>
              ))}
            </KeyGroup>
            <KeyGroup label='Right pad — notes'>
              {RIGHT_PAD_KEY_ROWS.map((row, index) => (
                <div key={index} className='flex gap-1'>
                  {row.map((key) => (
                    <Kbd key={key}>{key}</Kbd>
                  ))}
                </div>
              ))}
            </KeyGroup>
            <KeyGroup label='Left pad — options'>
              <KeyRow keyName='t' description='next octave' />
              <KeyRow keyName='g' description='next root note' />
              <KeyRow keyName='b' description='next accidental' />
            </KeyGroup>
            <KeyGroup label='Right pad — options'>
              <KeyRow keyName='y' description='next octave' />
              <KeyRow keyName='h' description='next root note' />
              <KeyRow keyName='n' description='next accidental' />
            </KeyGroup>
          </div>
          <KeyGroup label='Drum pad'>
            <div className='grid grid-cols-3 gap-x-4 gap-y-1'>
              {DRUM_KEYS.map(({ key, name }) => (
                <KeyRow key={key} keyName={key} description={name} />
              ))}
            </div>
          </KeyGroup>
        </Section>

        <label className='flex items-center gap-2 text-gray-600 cursor-pointer select-none'>
          <input
            type='checkbox'
            checked={helperEnabled}
            onChange={(event) => setHelperEnabled(event.target.checked)}
          />
          Show keyboard keys on the pad buttons
        </label>
        <label className='flex items-center gap-2 text-gray-600 cursor-pointer select-none'>
          <input
            type='checkbox'
            checked={showFps}
            onChange={(event) => setShowFps(event.target.checked)}
          />
          Show FPS on the analyser
        </label>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className='flex flex-col gap-2'>
      <h3 className='text-lg font-bold text-gray-700'>{title}</h3>
      {children}
    </div>
  );
}

function KeyGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className='flex flex-col gap-1'>
      <h4 className='font-semibold text-gray-700'>{label}</h4>
      {children}
    </div>
  );
}

function KeyRow({
  keyName,
  description,
}: {
  keyName: string;
  description: string;
}) {
  return (
    <div className='flex items-center gap-2'>
      <Kbd>{keyName}</Kbd>
      <span className='text-gray-600'>{description}</span>
    </div>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className='min-w-7 px-1.5 py-0.5 text-center font-mono text-sm text-gray-700 bg-gray-200 border border-gray-400 rounded shadow-[0_1px_0_1px] shadow-gray-400'>
      {children}
    </kbd>
  );
}
