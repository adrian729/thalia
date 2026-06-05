# Thalia

A browser-based synthesizer playground built with React and the Web Audio API. Play melodies on two keyboard-mapped synth pads, tap out beats on a drum pad, and watch the output on a live audio analyser.

**Live demo:** https://adrian729.github.io/thalia/

## Features

- **Thalia pads** — two 12-note chromatic pads (left and right hand), playable with mouse or keyboard
  - Mix and match oscillator types: sine, square, sawtooth, triangle
  - Detune control and octave/root note selection
  - Convolution reverb with selectable impulse responses (basement, church, bathroom, pipe)
- **Drum pad** — 9 synthesized percussion sounds (kick, snare, hi-hat, toms, cymbals), mapped to keys `1`–`9`
- **Analyser** — real-time visualization of the main audio output

### Keyboard mapping

- **Left pad:** `q w e r` / `a s d f` / `z x c v`
- **Right pad:** `u i o p` / `j k l ;` / `m , . /`
- **Drums:** `1`–`9`

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for dev/build tooling
- [Tailwind CSS 4](https://tailwindcss.com/) for styling
- Web Audio API (oscillators, gain nodes, convolver reverb, analyser) — no audio libraries

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (default http://localhost:5173/thalia/) and click anywhere to unlock the audio context if prompted.

## Scripts

| Command                   | Description                              |
| ------------------------- | ---------------------------------------- |
| `npm run dev`             | Start the dev server                     |
| `npm run build`           | Type-check and build for production      |
| `npm run preview`         | Preview the production build locally     |
| `npm run lint`            | Run ESLint                               |
| `npm run prettier-format` | Format the codebase with Prettier        |
| `npm run deploy`          | Build and publish to GitHub Pages        |

## Project structure

```
src/
├── analyser/        # Audio analyser visualization
├── audio-context/   # AudioContext provider, oscillator & reverb hooks
├── synth-pad/
│   ├── ThaliaPad/   # Melodic pad: buttons, options, key mappings
│   └── DrumPad.tsx  # Percussion pad with synthesized drum sounds
└── utils/           # Notes/frequencies, drum synthesis, keyboard handling
public/
└── IR/              # Impulse response WAVs for the convolution reverb
```

## License

See [LICENSE](LICENSE).
