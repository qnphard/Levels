import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import useAudioPlayer from '../hooks/useAudioPlayer';
import { resolveAudioSource } from '../utils/audioMap';
import {
  useThemeColors,
  useGlowEnabled,
  spacing,
  typography,
  borderRadius,
  ThemeColors,
} from '../theme/colors';

type PlayerScreenRouteProp = RouteProp<RootStackParamList, 'Player'>;
type PlayerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Player'>;

// Helper to convert hex to rgba
const toRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const clampedAlpha = Math.min(1, Math.max(0, alpha));
  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
};

export default function PlayerScreen() {
  const route = useRoute<PlayerScreenRouteProp>();
  const navigation = useNavigation<PlayerScreenNavigationProp>();
  const { meditation } = route.params;
  const theme = useThemeColors();
  const glowEnabled = useGlowEnabled();
  const styles = getStyles(theme, glowEnabled);
  const {
    isPlaying,
    position,
    duration,
    isLoading,
    loadAudio,
    playPause,
    seekTo,
    skip,
  } = useAudioPlayer();

  useEffect(() => {
    if (meditation.audioUrl) {
      const source = resolveAudioSource(meditation.audioUrl);
      loadAudio(source);
    }
  }, [meditation.audioUrl]);

  const formatTime = (millis: number): string => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? position / duration : 0;

  return (
    <LinearGradient
      colors={theme.appBackgroundGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name="chevron-down"
          size={32}
          color={theme.mode === 'dark' ? theme.textPrimary : theme.textPrimary}
        />
      </TouchableOpacity>

      {/* Meditation Info */}
      <View style={styles.infoContainer}>
        <View style={[
          styles.thumbnailPlaceholder,
          glowEnabled && theme.mode === 'dark' && {
            borderWidth: 2,
            borderColor: toRgba(theme.primary, 0.6),
            shadowColor: theme.primary,
            shadowOpacity: 0.35,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 2 },
            elevation: 0, // Remove elevation to prevent hexagon shape
          },
          glowEnabled && theme.mode === 'light' && {
            borderWidth: 2,
            borderColor: toRgba(theme.primary, 0.5),
            shadowColor: theme.primary,
            shadowOpacity: 0.25,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 2 },
            elevation: 0, // Remove elevation to prevent hexagon shape
          },
        ]}>
          <Ionicons
            name="musical-notes"
            size={80}
            color={theme.mode === 'dark' ? theme.textPrimary : theme.textPrimary}
          />
        </View>

        <Text style={styles.title}>{meditation.title}</Text>
        <Text style={styles.instructor}>
          {meditation.instructor || 'Guided Meditation'}
        </Text>
        <View style={[
          styles.categoryBadge,
          glowEnabled && theme.mode === 'dark' && {
            borderWidth: 1,
            borderColor: toRgba(theme.primary, 0.4),
            shadowColor: theme.primary,
            shadowOpacity: 0.2,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
          },
          glowEnabled && theme.mode === 'light' && {
            borderWidth: 1,
            borderColor: toRgba(theme.primary, 0.3),
            shadowColor: theme.primary,
            shadowOpacity: 0.15,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          },
        ]}>
          <Text style={styles.categoryText}>{meditation.category}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Slider
          style={styles.slider}
          value={progress}
          onValueChange={(value) => seekTo(value * duration)}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor={theme.primary}
          maximumTrackTintColor={theme.mode === 'dark' ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}
          thumbTintColor={theme.primary}
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => skip(-15)}
          style={styles.controlButton}
        >
          <Ionicons name="play-back" size={36} color={theme.mode === 'dark' ? theme.textPrimary : theme.textPrimary} />
          <Text style={styles.skipText}>15</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={playPause}
          style={[
            styles.playButton,
            glowEnabled && theme.mode === 'dark' && {
              shadowColor: theme.primary,
              shadowOpacity: 0.5,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 0 },
              elevation: 10,
              borderWidth: 2,
              borderColor: toRgba(theme.primary, 0.6),
            },
            glowEnabled && theme.mode === 'light' && {
              shadowColor: theme.primary,
              shadowOpacity: 0.4,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 0 },
              elevation: 8,
              borderWidth: 2,
              borderColor: toRgba(theme.primary, 0.5),
            },
          ]}
          disabled={isLoading}
        >
          {isLoading ? (
            <Ionicons name="hourglass" size={48} color={theme.mode === 'dark' ? theme.textPrimary : theme.white} />
          ) : (
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={48}
              color={theme.mode === 'dark' ? theme.textPrimary : theme.white}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => skip(15)}
          style={styles.controlButton}
        >
          <Ionicons name="play-forward" size={36} color={theme.mode === 'dark' ? theme.textPrimary : theme.textPrimary} />
          <Text style={styles.skipText}>15</Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{meditation.description}</Text>
      </View>
    </LinearGradient>
  );
}

const getStyles = (theme: ThemeColors, glowEnabled: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: spacing.lg,
    },
    closeButton: {
      alignSelf: 'flex-start',
      padding: spacing.sm,
      marginTop: spacing.sm,
    },
    infoContainer: {
      alignItems: 'center',
      marginTop: spacing.xl,
    },
    thumbnailPlaceholder: {
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(167, 139, 250, 0.15)'
        : 'rgba(167, 139, 250, 0.12)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.lg,
      borderWidth: glowEnabled ? (theme.mode === 'dark' ? 2 : 2) : 1,
      borderColor: glowEnabled
        ? (theme.mode === 'dark' ? toRgba(theme.primary, 0.6) : toRgba(theme.primary, 0.5))
        : (theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'),
    },
    title: {
      fontSize: typography.h2,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      textAlign: 'center',
      marginBottom: spacing.xs,
    },
    instructor: {
      fontSize: typography.body,
      color: theme.mode === 'dark' ? theme.textSecondary : theme.textSecondary,
      marginBottom: spacing.sm,
    },
    categoryBadge: {
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(167, 139, 250, 0.18)'
        : 'rgba(167, 139, 250, 0.12)',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.round,
      borderWidth: glowEnabled ? 1 : 0,
      borderColor: glowEnabled
        ? (theme.mode === 'dark' ? toRgba(theme.primary, 0.4) : toRgba(theme.primary, 0.3))
        : 'transparent',
    },
    categoryText: {
      color: theme.textPrimary,
      fontWeight: typography.semibold,
    },
    progressContainer: {
      marginTop: spacing.xl,
      marginBottom: spacing.md,
    },
    slider: {
      width: '100%',
      height: 40,
    },
    timeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.xs,
    },
    timeText: {
      color: theme.mode === 'dark' ? theme.textSecondary : theme.textSecondary,
      fontSize: typography.small,
    },
    controls: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: spacing.lg,
      marginBottom: spacing.xl,
    },
    controlButton: {
      padding: spacing.md,
      position: 'relative',
    },
    playButton: {
      width: 86,
      height: 86,
      borderRadius: 43,
      backgroundColor: theme.mode === 'dark'
        ? theme.primary
        : theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: spacing.lg,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: glowEnabled ? (theme.mode === 'dark' ? 0.5 : 0.4) : 0.3,
      shadowRadius: glowEnabled ? 20 : 8,
      elevation: glowEnabled ? 10 : 5,
      borderWidth: glowEnabled ? (theme.mode === 'dark' ? 2 : 2) : 0,
      borderColor: glowEnabled
        ? (theme.mode === 'dark' ? toRgba(theme.primary, 0.6) : toRgba(theme.primary, 0.5))
        : 'transparent',
    },
    skipText: {
      position: 'absolute',
      fontSize: typography.tiny,
      color: theme.textPrimary,
      fontWeight: typography.bold,
      bottom: spacing.sm,
      alignSelf: 'center',
    },
    descriptionContainer: {
      flex: 1,
      justifyContent: 'flex-start',
    },
    description: {
      fontSize: typography.body,
      color: theme.mode === 'dark' ? theme.textSecondary : theme.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
  });
