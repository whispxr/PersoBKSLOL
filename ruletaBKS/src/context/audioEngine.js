// src/context/audioEngine.js
// Motor de sonido con Web Audio: decodifica los clips al cargar y recorta su silencio inicial

const AudioCtx = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioCtx();

const SILENCE_THRESHOLD = 0.02;
const buffers = new Map();
const activeSources = new Map();

const findSoundStart = (buffer) => {
  const data = buffer.getChannelData(0);
  let i = 0;
  while (i < data.length && Math.abs(data[i]) < SILENCE_THRESHOLD) i++;
  return Math.max(0, i / buffer.sampleRate - 0.02);
};

export const unlockAudio = () => {
  if (ctx.state === 'suspended') ctx.resume();
};

// El navegador solo permite sonar tras una interaccion del usuario
window.addEventListener('pointerdown', unlockAudio);
window.addEventListener('keydown', unlockAudio);

export const preloadClip = (url) => {
  if (!buffers.has(url)) {
    const loading = fetch(url)
      .then(res => res.arrayBuffer())
      .then(data => ctx.decodeAudioData(data))
      .then(buffer => ({ buffer, offset: findSoundStart(buffer) }));
    buffers.set(url, loading);
  }
  return buffers.get(url);
};

export const stopClip = (url) => {
  activeSources.get(url)?.forEach(source => {
    try {
      source.stop();
    } catch {
      // ya estaba detenido
    }
  });
};

// Resuelve cuando el clip termina (o falla), para poder encadenar audios
export const playClip = async (url, volume = 1) => {
  try {
    unlockAudio();
    const { buffer, offset } = await preloadClip(url);
    stopClip(url);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = volume;
    source.connect(gain).connect(ctx.destination);

    if (!activeSources.has(url)) activeSources.set(url, new Set());
    activeSources.get(url).add(source);

    await new Promise(resolve => {
      source.onended = () => {
        activeSources.get(url)?.delete(source);
        resolve();
      };
      source.start(0, offset);
    });
  } catch (error) {
    console.error("Error al reproducir el sonido:", error);
  }
};
