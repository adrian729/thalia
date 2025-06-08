import { IRType } from '../../audio-context/useReverb';
import { A, B, BEMOL, C, D, E, F, G, NATURAL, SHARP } from '../../utils/notes';
import { Position, ThaliaPadConfigItem } from './types';

export const OSCILLATOR_TYPES: OscillatorType[] = [
  'sine',
  'square',
  'sawtooth',
  'triangle',
] as const;

export const REVERB_TYPES: (IRType | null)[] = [
  null,
  'basement',
  'church',
  'bathroom',
  'pipe',
] as const;

export const OCTAVE_CLASSES = [
  'text-rose-900 bg-rose-300',
  'text-blue-900 bg-blue-300',
  'text-green-900 bg-green-300',
  'text-teal-900 bg-teal-300',
  'text-emerald-900 bg-emerald-300',
] as const;

export const NOTE_NAMES = [C, D, E, F, G, A, B] as const;
export const NOTE_VALUES = [0, 2, 4, 5, 7, 9, 11] as const;
export const NOTE_CLASSES = [
  'text-red-900 bg-red-300',
  'text-amber-900 bg-amber-300',
  'text-lime-900 bg-lime-300',
  'text-green-900 bg-green-300',
  'text-sky-900 bg-sky-300',
  'text-violet-900 bg-violet-300',
  'text-fuchsia-900 bg-fuchsia-300',
] as const;

export const ACCIDENTALS = [BEMOL, NATURAL, SHARP] as const;
export const ACCIDENTAL_CLASSES = [
  'text-pink-900 bg-pink-300',
  'text-blue-900 bg-blue-300',
  'text-emerald-900 bg-emerald-300',
] as const;

// 1+ / 2- / 2+ / 3- / 3+ / 4+ / 5- / 5+ / 6- / 6+ / 7- / 7+ / 8+
// 00 / 01 / 02 / 03 / 04 / 05 / 06 / 07 / 08 / 09 / 10 / 11 / 12
// 12 / 13 / 14 / 15 / 16 / 17 / 18 / 19 / 20 / 21 / 22 / 23 / 24
export const THALIA_CONFIG_ITEMS: ThaliaPadConfigItem[] = [
  {
    id: 0,
    scaleValue: 1,
    extraClasses: 'bg-red-300',
    playingClasses: 'bg-red-100',
  },
  {
    id: 1,
    scaleValue: -2,
    extraClasses: 'bg-orange-300',
    playingClasses: 'bg-orange-100',
  },
  {
    id: 2,
    scaleValue: 2,
    extraClasses: 'bg-amber-300',
    playingClasses: 'bg-amber-100',
  },
  {
    id: 3,
    scaleValue: -3,
    extraClasses: 'bg-yellow-300',
    playingClasses: 'bg-yellow-100',
  },
  {
    id: 4,
    scaleValue: 3,
    extraClasses: 'bg-lime-300',
    playingClasses: 'bg-lime-100',
  },
  {
    id: 5,
    scaleValue: 4,
    extraClasses: 'bg-green-300',
    playingClasses: 'bg-green-100',
  },
  {
    id: 6,
    scaleValue: -5,
    extraClasses: 'bg-emerald-300',
    playingClasses: 'bg-emerald-100',
  },
  {
    id: 7,
    scaleValue: 5,
    extraClasses: 'bg-sky-300',
    playingClasses: 'bg-sky-100',
  },
  {
    id: 8,
    scaleValue: -6,
    extraClasses: 'bg-indigo-300',
    playingClasses: 'bg-indigo-100',
  },
  {
    id: 9,
    scaleValue: 6,
    extraClasses: 'bg-violet-300',
    playingClasses: 'bg-violet-100',
  },
  {
    id: 10,
    scaleValue: -7,
    extraClasses: 'bg-purple-300',
    playingClasses: 'bg-purple-100',
  },
  {
    id: 11,
    scaleValue: 7,
    extraClasses: 'bg-fuchsia-300',
    playingClasses: 'bg-fuchsia-100',
  },
] as const;

// TODO: mirror left/right pad so they are symetric instead of similar to a piano
export const KEYS_MAPPING: Record<Position, string[][]> = {
  left: [
    ['a'],
    ['q'],
    ['z'],
    ['w'],
    ['s'],
    ['x'],
    ['c'],
    ['d'],
    ['e'],
    ['v'],
    ['r'],
    ['f'],
  ],
  right: [
    ['j'],
    ['u'],
    ['m'],
    ['i'],
    ['k'],
    [','],
    ['.'],
    ['l'],
    ['o'],
    ['/'],
    ['p'],
    [';'],
  ],
} as const;

export const INITIAL_MIDI_ID = 36; // C2
