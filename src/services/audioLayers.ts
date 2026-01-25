import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';

type AmbientId = 'none' | 'rain' | 'ocean' | 'forest' | 'wind';
type BrainwaveId = 'none' | 'delta' | 'theta' | 'alpha' | 'beta';

export type AudioLayersConfig = {
  ambient?: AmbientId;
  ambientVolume?: number; // 0..0.5-ish from UI
  brainwave?: BrainwaveId;
  binauralVolume?: number; // 0..0.5-ish from UI
};

const { documentDirectory, cacheDirectory, makeDirectoryAsync, getInfoAsync, writeAsStringAsync } = FileSystem;

const AMBIENT_URLS: Record<Exclude<AmbientId, 'none'>, string> = {
  rain: 'https://actions.google.com/sounds/v1/weather/light_rain.ogg',
  ocean: 'https://actions.google.com/sounds/v1/water/water_lapping_wind.ogg',
  forest: 'https://actions.google.com/sounds/v1/weather/forest_wind_summer.ogg',
  wind: 'https://actions.google.com/sounds/v1/weather/wind.ogg',
};

const BINAURAL_HZ: Record<Exclude<BrainwaveId, 'none'>, number> = {
  delta: 2,
  theta: 6,
  alpha: 10,
  beta: 18,
};

let ambientSound: Audio.Sound | null = null;
let binauralSound: Audio.Sound | null = null;
let audioModeConfigured = false;

async function ensureAudioMode() {
  if (audioModeConfigured) return;
  audioModeConfigured = true;

  await Audio.setIsEnabledAsync(true).catch(() => undefined);
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    staysActiveInBackground: true,
    playsInSilentModeIOS: true,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    shouldDuckAndroid: false,
    playThroughEarpieceAndroid: false,
  }).catch(() => undefined);
}

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function resolveBinauralDir() {
  const base = documentDirectory ?? cacheDirectory ?? null;
  return base ? `${base}binaural/` : null;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  try {
    return btoa(binary);
  } catch {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let base64 = '';
    for (let i = 0; i < bytes.length; i += 3) {
      const a = bytes[i] ?? 0;
      const b = bytes[i + 1] ?? 0;
      const c = bytes[i + 2] ?? 0;
      const chunk = (a << 16) | (b << 8) | c;
      base64 +=
        chars[(chunk >> 18) & 63] +
        chars[(chunk >> 12) & 63] +
        chars[(chunk >> 6) & 63] +
        chars[chunk & 63];
    }
    return base64;
  }
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}

function makeStereoWav({
  sampleRate,
  seconds,
  leftHz,
  rightHz,
  amp,
}: {
  sampleRate: number;
  seconds: number;
  leftHz: number;
  rightHz: number;
  amp: number;
}) {
  const numChannels = 2;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const numSamples = Math.floor(sampleRate * seconds);
  const dataSize = numSamples * numChannels * bytesPerSample;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');

  // fmt chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // audio format PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true); // byte rate
  view.setUint16(32, numChannels * bytesPerSample, true); // block align
  view.setUint16(34, bitsPerSample, true);

  // data chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  const fadeSeconds = Math.min(0.5, seconds / 10);
  const fadeSamples = Math.floor(sampleRate * fadeSeconds);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const left = Math.sin(2 * Math.PI * leftHz * t);
    const right = Math.sin(2 * Math.PI * rightHz * t);

    // gentle fade-in/out to reduce clicks
    const fadeIn = fadeSamples > 0 ? Math.min(1, i / fadeSamples) : 1;
    const fadeOut = fadeSamples > 0 ? Math.min(1, (numSamples - 1 - i) / fadeSamples) : 1;
    const env = Math.min(fadeIn, fadeOut);

    const l = Math.max(-1, Math.min(1, left * amp * env));
    const r = Math.max(-1, Math.min(1, right * amp * env));

    view.setInt16(offset, Math.round(l * 32767), true);
    view.setInt16(offset + 2, Math.round(r * 32767), true);
    offset += 4;
  }

  return buffer;
}

async function getOrCreateBinauralFile(beatHz: number): Promise<string | null> {
  const dir = resolveBinauralDir();
  if (!dir || typeof makeDirectoryAsync !== 'function' || typeof getInfoAsync !== 'function') return null;

  try {
    await makeDirectoryAsync(dir, { intermediates: true });
  } catch {
    // ignore
  }

  const fileUri = `${dir}binaural_${beatHz}hz.wav`;
  try {
    const info = await getInfoAsync(fileUri);
    if (info.exists) return fileUri;
  } catch {
    // ignore
  }

  if (typeof writeAsStringAsync !== 'function') return null;

  // 20s loopable-ish binaural tone (lightweight, meditation-friendly)
  const sampleRate = 44100;
  const seconds = 20;
  const carrier = 220;
  const buffer = makeStereoWav({
    sampleRate,
    seconds,
    leftHz: carrier,
    rightHz: carrier + beatHz,
    amp: 0.08,
  });

  const base64 = arrayBufferToBase64(buffer);
  await writeAsStringAsync(fileUri, base64, { encoding: 'base64' });
  return fileUri;
}

async function stopSound(s: Audio.Sound | null) {
  if (!s) return;
  await s.stopAsync().catch(() => undefined);
  await s.unloadAsync().catch(() => undefined);
}

export async function stopAudioLayers() {
  const a = ambientSound;
  const b = binauralSound;
  ambientSound = null;
  binauralSound = null;
  await Promise.all([stopSound(a), stopSound(b)]);
}

export async function startAudioLayers(config: AudioLayersConfig) {
  await ensureAudioMode();

  const ambient = (config.ambient ?? 'none') as AmbientId;
  const brainwave = (config.brainwave ?? 'none') as BrainwaveId;

  const ambientVol = clamp01((config.ambientVolume ?? 0.1) * 2); // UI max 0.5 -> 1.0
  const binauralVol = clamp01((config.binauralVolume ?? 0.15) * 2);

  // Reset previous layers before starting new ones
  await stopAudioLayers();

  // Ambient
  if (ambient !== 'none') {
    const uri = AMBIENT_URLS[ambient];
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true, isLooping: true, volume: ambientVol },
        undefined,
        true
      );
      ambientSound = sound;
    } catch {
      // ignore
    }
  }

  // Binaural
  if (brainwave !== 'none') {
    const beatHz = BINAURAL_HZ[brainwave];
    const fileUri = await getOrCreateBinauralFile(beatHz);
    if (fileUri) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: fileUri },
          { shouldPlay: true, isLooping: true, volume: binauralVol },
          undefined,
          true
        );
        binauralSound = sound;
      } catch {
        // ignore
      }
    }
  }
}

export async function setAudioLayersVolume(volumes: { ambient?: number; binaural?: number }) {
  if (ambientSound && typeof volumes.ambient === 'number') {
    await ambientSound.setVolumeAsync(clamp01(volumes.ambient)).catch(() => undefined);
  }
  if (binauralSound && typeof volumes.binaural === 'number') {
    await binauralSound.setVolumeAsync(clamp01(volumes.binaural)).catch(() => undefined);
  }
}

