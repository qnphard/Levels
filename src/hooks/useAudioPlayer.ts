import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';

export default function useAudioPlayer() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);
  const isPlayingRef = useRef(false);
  const positionRef = useRef(0);
  const durationRef = useRef(0);
  const sourcesRef = useRef<any[]>([]);
  const indexRef = useRef(0);
  const durationsRef = useRef<number[]>([]);
  const basePositionRef = useRef(0);
  const prefetchTokenRef = useRef(0);
  const loadTokenRef = useRef(0);

  useEffect(() => {
    // Configure audio mode with error handling
    Audio.setIsEnabledAsync(true).catch(() => undefined);

    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      // Avoid silent playback due to interruptions/mixing
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      shouldDuckAndroid: false,
      playThroughEarpieceAndroid: false,
    }).catch((error) => {
      console.warn('Error setting audio mode:', error);
    });
  }, []);

  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);

  // Cleanup sound when component unmounts
  useEffect(() => {
    return () => {
      const s = soundRef.current;
      if (s) {
        s.unloadAsync().catch((error) => {
          console.warn('Error unloading sound:', error);
        });
      }
    };
  }, []);

  const onPlaybackStatusUpdate = useCallback(async (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    const currentIndex = indexRef.current;
    const currentDuration = status.durationMillis || 0;

    // Track per-segment duration when it becomes available
    if (currentDuration > 0) {
      const d = durationsRef.current.slice();
      d[currentIndex] = currentDuration;
      durationsRef.current = d;
    }

    // Compute global timeline
    const globalPosition = basePositionRef.current + status.positionMillis;
    const knownTotal = durationsRef.current.reduce((acc, ms) => acc + (ms || 0), 0);
    const globalDuration = knownTotal;

    setPosition(globalPosition);
    setDuration(globalDuration);
    setIsPlaying(status.isPlaying);
    positionRef.current = globalPosition;
    durationRef.current = globalDuration;
    isPlayingRef.current = status.isPlaying;

    // Advance to next segment automatically
    if (status.didJustFinish) {
      const sources = sourcesRef.current;
      const activeSound = soundRef.current;
      if (sources.length > 1 && currentIndex < sources.length - 1 && activeSound) {
        try {
          basePositionRef.current += currentDuration;
          indexRef.current = currentIndex + 1;
          await activeSound.stopAsync().catch(() => undefined);
          await activeSound.unloadAsync().catch(() => undefined);
          await activeSound.loadAsync(
            sources[indexRef.current],
            { shouldPlay: true, volume: 1.0, isMuted: false },
            true
          );
          activeSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
          return;
        } catch (e) {
          console.warn('Error advancing playlist:', e);
        }
      }

      // Finished last segment (or single track)
      setIsPlaying(false);
      setPosition(0);
      isPlayingRef.current = false;
      positionRef.current = 0;
      basePositionRef.current = 0;
      indexRef.current = 0;
    }
  }, []);

  const prefetchDurations = useCallback(async (sources: any[], token: number) => {
    // Best-effort: preload duration metadata so the scrubber works better for playlists.
    const durations: number[] = new Array(sources.length).fill(0);
    for (let i = 0; i < sources.length; i++) {
      if (prefetchTokenRef.current !== token) return; // cancelled / replaced
      try {
        const { sound: tmp, status } = await Audio.Sound.createAsync(sources[i], { shouldPlay: false });
        if (status.isLoaded) {
          durations[i] = status.durationMillis || 0;
        }
        await tmp.unloadAsync().catch(() => undefined);
      } catch {
        // ignore
      }
    }

    if (prefetchTokenRef.current !== token) return;
    durationsRef.current = durations;
    const total = durations.reduce((acc, ms) => acc + (ms || 0), 0);
    setDuration(total);
    durationRef.current = total;
  }, []);

  const loadAudio = useCallback(async (sourceOrSources: any | any[]) => {
    try {
      const token = loadTokenRef.current + 1;
      loadTokenRef.current = token;

      const sources = Array.isArray(sourceOrSources) ? sourceOrSources : [sourceOrSources];

      // Validate source
      if (!sources.length || !sources[0]) {
        console.warn('Cannot load audio: no source provided');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      sourcesRef.current = sources;
      indexRef.current = 0;
      basePositionRef.current = 0;
      durationsRef.current = new Array(sources.length).fill(0);
      setPosition(0);
      setDuration(0);
      positionRef.current = 0;
      durationRef.current = 0;

      // Unload previous sound if exists
      const prevSound = soundRef.current;
      if (prevSound) {
        try {
          await prevSound.stopAsync().catch(() => undefined);
          await prevSound.unloadAsync();
        } catch (error) {
          console.warn('Error unloading previous sound:', error);
        }
      }

      // If a newer load started while we were unloading, abort.
      if (loadTokenRef.current !== token) {
        setIsLoading(false);
        return;
      }

      // Load new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        sources[0],
        { shouldPlay: false, volume: 1.0, isMuted: false },
        onPlaybackStatusUpdate,
        true
      );

      // If a newer load started while we were creating the sound, discard this one.
      if (loadTokenRef.current !== token) {
        await newSound.unloadAsync().catch(() => undefined);
        setIsLoading(false);
        return;
      }

      setSound(newSound);
      setIsLoading(false);

      // Prefetch durations in background for better seeking UI
      if (sources.length > 1) {
        const token = prefetchTokenRef.current + 1;
        prefetchTokenRef.current = token;
        prefetchDurations(sources, token);
      }
    } catch (error) {
      console.error('Error loading audio:', error);
      setIsLoading(false);
      // Reset sound state on error
      setSound(null);
    }
  }, [onPlaybackStatusUpdate, prefetchDurations]);

  const unload = useCallback(async () => {
    // Invalidate any in-flight loads
    loadTokenRef.current += 1;

    const s = soundRef.current;
    try {
      if (s) {
        await s.stopAsync().catch(() => undefined);
        await s.unloadAsync().catch(() => undefined);
      }
    } finally {
      soundRef.current = null;
      setSound(null);
      setIsLoading(false);
      setIsPlaying(false);
      setPosition(0);
      setDuration(0);
      isPlayingRef.current = false;
      positionRef.current = 0;
      durationRef.current = 0;
      sourcesRef.current = [];
      indexRef.current = 0;
      basePositionRef.current = 0;
      durationsRef.current = [];
    }
  }, []);

  const playPause = useCallback(async () => {
    const s = soundRef.current;
    if (!s) return;

    try {
      if (isPlayingRef.current) {
        await s.pauseAsync();
      } else {
        // Defensive: sometimes a device ends up muted/volume=0 after interruptions.
        await s.setIsMutedAsync(false).catch(() => undefined);
        await s.setVolumeAsync(1.0).catch(() => undefined);
        await s.playAsync();
      }
    } catch (error) {
      console.error('Error playing/pausing audio:', error);
    }
  }, []);

  const seekTo = useCallback(async (positionMillis: number) => {
    const s = soundRef.current;
    if (!s) return;

    try {
      // If we have full per-segment durations, map global position to the right segment.
      const durations = durationsRef.current;
      const sources = sourcesRef.current;
      const hasAllDurations = durations.length === sources.length && durations.every((d) => d > 0);

      if (!hasAllDurations || sources.length <= 1) {
        // Best-effort: seek within current segment only
        await s.setPositionAsync(Math.max(0, positionMillis - basePositionRef.current));
        return;
      }

      let remaining = Math.max(0, positionMillis);
      let targetIndex = 0;
      while (targetIndex < durations.length && remaining > durations[targetIndex]) {
        remaining -= durations[targetIndex];
        targetIndex += 1;
      }
      targetIndex = Math.min(targetIndex, sources.length - 1);

      if (targetIndex !== indexRef.current) {
        indexRef.current = targetIndex;
        basePositionRef.current = durations.slice(0, targetIndex).reduce((acc, ms) => acc + ms, 0);
        await s.stopAsync().catch(() => undefined);
        await s.unloadAsync().catch(() => undefined);
        await s.loadAsync(
          sources[targetIndex],
          { shouldPlay: false, volume: 1.0, isMuted: false },
          true
        );
        s.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      }

      await s.setPositionAsync(Math.max(0, remaining));
    } catch (error) {
      console.error('Error seeking audio:', error);
    }
  }, [onPlaybackStatusUpdate]);

  const skip = useCallback(async (seconds: number) => {
    const s = soundRef.current;
    if (!s) return;

    try {
      const newPosition = Math.max(0, Math.min(durationRef.current, positionRef.current + seconds * 1000));
      await seekTo(newPosition);
    } catch (error) {
      console.error('Error skipping audio:', error);
    }
  }, [seekTo]);

  const stop = useCallback(async () => {
    const s = soundRef.current;
    if (!s) return;

    try {
      await s.stopAsync().catch(() => undefined);
      indexRef.current = 0;
      basePositionRef.current = 0;
      setPosition(0);
      setIsPlaying(false);

      const sources = sourcesRef.current;
      if (sources.length) {
        await s.unloadAsync().catch(() => undefined);
        await s.loadAsync(sources[0], { shouldPlay: false, volume: 1.0, isMuted: false }, true);
        s.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      } else {
        await s.setPositionAsync(0);
      }

      setIsPlaying(false);
      setPosition(0);
      isPlayingRef.current = false;
      positionRef.current = 0;
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  }, [onPlaybackStatusUpdate]);

  return useMemo(
    () => ({
      isPlaying,
      position,
      duration,
      isLoading,
      loadAudio,
      playPause,
      seekTo,
      skip,
      stop,
      unload,
    }),
    [isPlaying, position, duration, isLoading, loadAudio, playPause, seekTo, skip, stop, unload]
  );
}
