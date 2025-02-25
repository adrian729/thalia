export function createNoiseBuffer(audioContext: AudioContext) {
  const bufferSize = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(
    1,
    bufferSize,
    audioContext.sampleRate
  );
  const output = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

  return buffer;
}

export function playSynth({
  frequency,
  audioContext,
  destination,
}: {
  frequency: number;
  audioContext: AudioContext;
  destination: AudioNode;
}) {
  const currentTime = audioContext.currentTime;
  let currentFrequency = frequency;
  if (frequency < 20 || frequency > 20000) currentFrequency = 440;

  const gainControl = audioContext.createGain();
  gainControl.gain.setValueAtTime(0.8, currentTime);
  gainControl.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.5);
  gainControl.connect(destination);

  const oscillator = audioContext.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(currentFrequency, currentTime);
  oscillator.connect(gainControl);

  const squareGain = audioContext.createGain();
  squareGain.gain.setValueAtTime(0.1, currentTime);
  gainControl.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.5);
  squareGain.connect(gainControl);

  const squareOscillator = audioContext.createOscillator();
  squareOscillator.type = "square";
  squareOscillator.frequency.setValueAtTime(currentFrequency, currentTime);
  squareOscillator.connect(squareGain);

  oscillator.start(currentTime);
  oscillator.stop(currentTime + 0.5);

  squareOscillator.start(currentTime);
  squareOscillator.stop(currentTime + 0.5);
}

export function playKick({
  audioContext,
  destination,
}: {
  audioContext: AudioContext;
  destination: AudioNode;
}) {
  const currentTime = audioContext.currentTime;

  // Mixer
  const oscillatorGainControl = audioContext.createGain();
  const noiseGainControl = audioContext.createGain();

  oscillatorGainControl.gain.setValueAtTime(0.5, currentTime);
  noiseGainControl.gain.setValueAtTime(5, currentTime);

  oscillatorGainControl.connect(destination);
  noiseGainControl.connect(destination);

  // Oscillator
  const kickOscillator = audioContext.createOscillator();
  kickOscillator.frequency.setValueAtTime(150, currentTime);
  kickOscillator.frequency.exponentialRampToValueAtTime(
    0.001,
    currentTime + 0.5
  );

  // Rand Oscillator (to give some color between hits)
  const randOscillator = audioContext.createOscillator();
  randOscillator.frequency.setValueAtTime(
    100 + 100 * Math.random(),
    currentTime
  );
  randOscillator.frequency.exponentialRampToValueAtTime(
    0.001,
    currentTime + 0.5
  );

  const kickGain = audioContext.createGain();
  kickGain.gain.setValueAtTime(1, currentTime);
  kickGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.5);

  kickOscillator.connect(kickGain);
  randOscillator.connect(kickGain);
  kickGain.connect(oscillatorGainControl);

  // Noise
  const noiseSource = audioContext.createBufferSource();
  noiseSource.buffer = createNoiseBuffer(audioContext);

  const noiseFilter = audioContext.createBiquadFilter();
  noiseFilter.type = "lowpass";
  noiseFilter.frequency.value = 100;

  const noiseEnvelope = audioContext.createGain();
  noiseEnvelope.gain.setValueAtTime(1, currentTime);
  noiseEnvelope.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.1);

  noiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseEnvelope);
  noiseEnvelope.connect(noiseGainControl);

  kickOscillator.start(currentTime);
  randOscillator.start(currentTime);
  kickOscillator.stop(currentTime + 0.5);
  randOscillator.stop(currentTime + 0.5);

  noiseSource.start(currentTime);
  noiseSource.stop(currentTime + 0.5);
}

export function playSnare({
  audioContext,
  destination,
}: {
  audioContext: AudioContext;
  destination: AudioNode;
}) {
  const currentTime = audioContext.currentTime;

  const gainControl = audioContext.createGain();
  gainControl.gain.setValueAtTime(0.4, currentTime);
  gainControl.connect(destination);

  // Setup snare
  const snareSource = audioContext.createBufferSource();
  snareSource.buffer = createNoiseBuffer(audioContext);

  const snareFilter = audioContext.createBiquadFilter();
  snareFilter.type = "highpass";
  snareFilter.frequency.value = 1000;

  snareSource.connect(snareFilter);

  const snareEnvelope = audioContext.createGain();
  snareFilter.connect(snareEnvelope);
  snareEnvelope.connect(gainControl);

  const snareOscillator = audioContext.createOscillator();
  snareOscillator.type = "triangle";

  const oscillatorEnvelope = audioContext.createGain();
  snareOscillator.connect(oscillatorEnvelope);
  oscillatorEnvelope.connect(gainControl);

  // Trigger
  snareEnvelope.gain.setValueAtTime(1, currentTime);
  snareEnvelope.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.2);
  snareSource.start(currentTime);

  snareOscillator.frequency.setValueAtTime(
    100 + 15 * Math.random(),
    currentTime
  );
  oscillatorEnvelope.gain.setValueAtTime(0.7, currentTime);
  oscillatorEnvelope.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.1);
  snareOscillator.start(currentTime);

  snareOscillator.stop(currentTime + 0.2);
  snareSource.stop(currentTime + 0.2);
}

export function playHihat({
  audioContext,
  destination,
}: {
  audioContext: AudioContext;
  destination: AudioNode;
}) {
  // Hihat as described in http://joesul.li/van/synthesizing-hi-hats/
  const fundamental = 40;
  const ratios = [2, 3, 4.16, 5.43, 6.79, 8.21];

  const currentTime = audioContext.currentTime;

  const gainControl = audioContext.createGain();
  gainControl.gain.setValueAtTime(2, currentTime);
  gainControl.connect(destination);

  const hihatGain = audioContext.createGain();

  // Bandpass
  const bandpass = audioContext.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 10000;
  // Highpass
  const highpass = audioContext.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 7000;
  // Connect graph
  bandpass.connect(highpass);
  highpass.connect(hihatGain);
  hihatGain.connect(gainControl);

  // Oscillators
  ratios.forEach((ratio) => {
    const osc = audioContext.createOscillator();
    osc.type = "square";
    osc.frequency.value = fundamental * ratio;
    osc.connect(bandpass);
    osc.start(currentTime);
    osc.stop(currentTime + 0.3);
  });

  // Volume envelope
  hihatGain.gain.setValueAtTime(0.00001, currentTime);
  hihatGain.gain.exponentialRampToValueAtTime(1, currentTime + 0.02);
  hihatGain.gain.exponentialRampToValueAtTime(0.3, currentTime + 0.03);
  hihatGain.gain.exponentialRampToValueAtTime(0.00001, currentTime + 0.3);
}

export function playCymbal1({
  audioContext,
  destination,
}: {
  audioContext: AudioContext;
  destination: AudioNode;
}) {
  // Hihat as described in http://joesul.li/van/synthesizing-hi-hats/
  const fundamental = 50 + 1 * Math.random();
  const ratios = [2, 3, 4.16, 5.43, 6.79, 8.21];

  const currentTime = audioContext.currentTime;

  const gainControl = audioContext.createGain();
  gainControl.gain.setValueAtTime(2, currentTime);
  gainControl.connect(destination);

  const hihatGain = audioContext.createGain();

  // Bandpass
  const bandpass = audioContext.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 8000;
  // Highpass
  const highpass = audioContext.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 7000;
  // Connect graph
  bandpass.connect(highpass);
  highpass.connect(hihatGain);
  hihatGain.connect(gainControl);

  // Oscillators
  ratios.forEach((ratio) => {
    const osc = audioContext.createOscillator();
    osc.type = "square";
    osc.frequency.value = fundamental * ratio;
    osc.connect(bandpass);
    osc.start(currentTime);
    osc.stop(currentTime + 2);
  });

  // Volume envelope
  hihatGain.gain.setValueAtTime(0.00001, currentTime);
  hihatGain.gain.exponentialRampToValueAtTime(1, currentTime + 0.02);
  hihatGain.gain.exponentialRampToValueAtTime(0.3, currentTime + 0.03);
  hihatGain.gain.exponentialRampToValueAtTime(0.00001, currentTime + 1.5);
}

export function playCymbal2({
  audioContext,
  destination,
}: {
  audioContext: AudioContext;
  destination: AudioNode;
}) {
  // Hihat as described in http://joesul.li/van/synthesizing-hi-hats/
  const fundamental = 100 + 2 * Math.random();
  const ratios = [2, 3, 4.16, 5.43, 6.79, 8.21];

  const currentTime = audioContext.currentTime;

  const gainControl = audioContext.createGain();
  gainControl.gain.setValueAtTime(2, currentTime);
  gainControl.connect(destination);

  const hihatGain = audioContext.createGain();

  // Bandpass
  const bandpass = audioContext.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 10000;
  // Highpass
  const highpass = audioContext.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 7000;
  // Connect graph
  bandpass.connect(highpass);
  highpass.connect(hihatGain);
  hihatGain.connect(gainControl);

  // Oscillators
  ratios.forEach((ratio) => {
    const osc = audioContext.createOscillator();
    osc.type = "square";
    osc.frequency.value = fundamental * ratio;
    osc.connect(bandpass);
    osc.start(currentTime);
    osc.stop(currentTime + 2);
  });

  // Volume envelope
  hihatGain.gain.setValueAtTime(0.00001, currentTime);
  hihatGain.gain.exponentialRampToValueAtTime(1, currentTime + 0.02);
  hihatGain.gain.exponentialRampToValueAtTime(0.3, currentTime + 0.03);
  hihatGain.gain.exponentialRampToValueAtTime(0.00001, currentTime + 1.5);
}

export function playCymbal3({
  audioContext,
  destination,
}: {
  audioContext: AudioContext;
  destination: AudioNode;
}) {
  // Hihat as described in http://joesul.li/van/synthesizing-hi-hats/
  const fundamental = 20 + 1 * Math.random();
  const ratios = [2, 3, 4.16, 5.43, 6.79, 8.21];

  const currentTime = audioContext.currentTime;

  const gainControl = audioContext.createGain();
  gainControl.gain.setValueAtTime(2, currentTime);
  gainControl.connect(destination);

  const hihatGain = audioContext.createGain();

  // Bandpass
  const bandpass = audioContext.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 5000;
  // Highpass
  const highpass = audioContext.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 3000;
  // Connect graph
  bandpass.connect(highpass);
  highpass.connect(hihatGain);
  hihatGain.connect(gainControl);

  // Oscillators
  ratios.forEach((ratio) => {
    const osc = audioContext.createOscillator();
    osc.type = "square";
    osc.frequency.value = fundamental * ratio;
    osc.connect(bandpass);
    osc.start(currentTime);
    osc.stop(currentTime + 3);
  });

  // Volume envelope
  hihatGain.gain.setValueAtTime(0.00001, currentTime);
  hihatGain.gain.exponentialRampToValueAtTime(1, currentTime + 0.02);
  hihatGain.gain.exponentialRampToValueAtTime(0.3, currentTime + 0.03);
  hihatGain.gain.exponentialRampToValueAtTime(0.00001, currentTime + 2.5);
}

export function playTom1({
  audioContext,
  destination,
}: {
  audioContext: AudioContext;
  destination: AudioNode;
}) {
  const currentTime = audioContext.currentTime;

  const gainControl = audioContext.createGain();
  gainControl.gain.setValueAtTime(3, currentTime);
  gainControl.connect(destination);

  const tomFilter = audioContext.createBiquadFilter();
  tomFilter.type = "highpass";
  tomFilter.frequency.value = 1500;

  const tomOscillator = audioContext.createOscillator();
  tomOscillator.type = "triangle";
  tomOscillator.frequency.setValueAtTime(150 + 1 * Math.random(), currentTime);

  const tomGain = audioContext.createGain();
  tomGain.gain.setValueAtTime(1, currentTime);
  tomGain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.3);

  tomOscillator.connect(tomFilter);
  tomFilter.connect(tomGain);
  tomGain.connect(gainControl);

  tomOscillator.start(currentTime);
  tomOscillator.stop(currentTime + 0.3);
}

export function playTom2({
  audioContext,
  destination,
}: {
  audioContext: AudioContext;
  destination: AudioNode;
}) {
  const currentTime = audioContext.currentTime;

  const gainControl = audioContext.createGain();
  gainControl.gain.setValueAtTime(3, currentTime);
  gainControl.connect(destination);

  const tomFilter = audioContext.createBiquadFilter();
  tomFilter.type = "highpass";
  tomFilter.frequency.value = 1500;

  const tomOscillator = audioContext.createOscillator();
  tomOscillator.type = "triangle";
  tomOscillator.frequency.setValueAtTime(120 + 5 * Math.random(), currentTime);
  tomOscillator.frequency.exponentialRampToValueAtTime(80, currentTime + 0.1);

  const tomGain = audioContext.createGain();
  tomGain.gain.setValueAtTime(2, currentTime);
  tomGain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.2);

  tomOscillator.connect(tomFilter);
  tomFilter.connect(tomGain);
  tomGain.connect(gainControl);

  tomOscillator.start(currentTime);
  tomOscillator.stop(currentTime + 0.2);
}

export function playTom3({
  audioContext,
  destination,
}: {
  audioContext: AudioContext;
  destination: AudioNode;
}) {
  const currentTime = audioContext.currentTime;

  // Oscillator
  const gainControl = audioContext.createGain();
  gainControl.gain.setValueAtTime(1, currentTime);
  gainControl.connect(destination);

  const tomFilter = audioContext.createBiquadFilter();
  tomFilter.type = "lowpass";
  tomFilter.frequency.setValueAtTime(300 + 20 * Math.random(), currentTime);
  tomFilter.frequency.linearRampToValueAtTime(50, currentTime + 0.5);

  const tomOscillator = audioContext.createOscillator();
  tomOscillator.type = "triangle";
  tomOscillator.frequency.setValueAtTime(50 + 1 * Math.random(), currentTime);

  const tomGain = audioContext.createGain();
  tomGain.gain.setValueAtTime(1, currentTime);
  tomGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 1.5);

  tomOscillator.connect(tomFilter);
  tomFilter.connect(tomGain);
  tomGain.connect(gainControl);

  tomOscillator.start(currentTime);
  tomOscillator.stop(currentTime + 1.5);

  // Noise
  const noiseGain = audioContext.createGain();
  noiseGain.gain.setValueAtTime(0.2, currentTime);
  noiseGain.connect(destination);

  const noiseSource = audioContext.createBufferSource();
  noiseSource.buffer = createNoiseBuffer(audioContext);

  const noiseFilter = audioContext.createBiquadFilter();
  noiseFilter.type = "lowpass";
  noiseFilter.frequency.value = 500;

  const noiseEnvelope = audioContext.createGain();
  noiseEnvelope.gain.setValueAtTime(0.5, currentTime);
  noiseEnvelope.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.5);

  noiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseEnvelope);
  noiseEnvelope.connect(noiseGain);

  noiseSource.start(currentTime);
  noiseSource.stop(currentTime + 1.5);
}
