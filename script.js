let audioCtx;

let layers = {};
let gains = {};
let panner;

function init() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  createLayer("rain", "sounds/rain.mp3", 0.5);
  createLayer("cafe", "sounds/cafe.mp3", 0);
  createLayer("wind", "sounds/wind.mp3", 0);
  createLayer("thunder", "sounds/thunder.mp3", 0);

  panner = audioCtx.createStereoPanner();

  Object.values(layers).forEach(layer => {
    layer.source.connect(panner).connect(audioCtx.destination);
  });
}

function createLayer(name, file, volume) {
  const audio = new Audio(file);
  audio.loop = true;

  const source = audioCtx.createMediaElementSource(audio);
  const gain = audioCtx.createGain();

  gain.gain.value = volume;

  source.connect(gain);

  layers[name] = { audio, source, gain };
  gains[name] = gain;
}

function toggleSound() {
  if (!audioCtx) {
    init();
    Object.values(layers).forEach(l => l.audio.play());
  } else {
    if (audioCtx.state === "running") {
      audioCtx.suspend();
    } else {
      audioCtx.resume();
    }
  }
}

function setMode(mode) {
  if (mode === "sleep") gains.rain.gain.value = 0.3;
  if (mode === "focus") gains.rain.gain.value = 0.5;
  if (mode === "relax") gains.rain.gain.value = 0.4;
  if (mode === "anxiety") gains.rain.gain.value = 0.2;
}

function setEmotion(emotion) {
  if (emotion === "calm") gains.rain.gain.value *= 0.9;
  if (emotion === "deep") gains.rain.gain.value *= 1.1;
  if (emotion === "warm") gains.rain.gain.value *= 0.95;
}

function setPan(value) {
  if (panner) panner.pan.value = value;
}

function toggleLayer(name) {
  if (!gains[name]) return;

  if (gains[name].gain.value === 0) {
    gains[name].gain.value = 0.3;
  } else {
    gains[name].gain.value = 0;
  }
}
