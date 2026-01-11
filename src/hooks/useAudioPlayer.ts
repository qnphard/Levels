import { useState, useEffect, useRef } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Meditation } from '../types';

export default function useAudioPlayer() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Configure audio mode with error handling
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch((error) => {
      console.warn('Error setting audio mode:', error);
    });
  }, []);

  // Cleanup sound when component unmounts
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync().catch((error) => {
          console.warn('Error unloading sound:', error);
        });
      }
    };
  }, [sound]);

  const loadAudio = async (source: any) => {
    try {
      // Validate source
      if (!source) {
        console.warn('Cannot load audio: no source provided');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      // Unload previous sound if exists
      if (sound) {
        try {
          await sound.unloadAsync();
        } catch (error) {
          console.warn('Error unloading previous sound:', error);
        }
      }
      // Load new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        source,
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading audio:', error);
      setIsLoading(false);
      // Reset sound state on error
      setSound(null);
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);

      // Handle when playback finishes
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  const playPause = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      console.error('Error playing/pausing audio:', error);
    }
  };

  const seekTo = async (positionMillis: number) => {
    if (!sound) return;

    try {
      await sound.setPositionAsync(positionMillis);
    } catch (error) {
      console.error('Error seeking audio:', error);
    }
  };

  const skip = async (seconds: number) => {
    if (!sound) return;

    try {
      const newPosition = Math.max(0, Math.min(duration, position + seconds * 1000));
      await sound.setPositionAsync(newPosition);
    } catch (error) {
      console.error('Error skipping audio:', error);
    }
  };

  const stop = async () => {
    if (!sound) return;

    try {
      await sound.stopAsync();
      await sound.setPositionAsync(0);
      setIsPlaying(false);
      setPosition(0);
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  return {
    isPlaying,
    position,
    duration,
    isLoading,
    loadAudio,
    playPause,
    seekTo,
    skip,
    stop,
  };
}
