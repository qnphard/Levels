import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import useAudioPlayer from '../hooks/useAudioPlayer';
import {
  useThemeColors,
  spacing,
  typography,
  borderRadius,
  ThemeColors,
} from '../theme/colors';

type PlayerScreenRouteProp = RouteProp<RootStackParamList, 'Player'>;
type PlayerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Player'>;

export default function PlayerScreen() {
  const route = useRoute<PlayerScreenRouteProp>();
  const navigation = useNavigation<PlayerScreenNavigationProp>();
  const { meditation } = route.params;
  const theme = useThemeColors();
  const styles = getStyles(theme);
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
      loadAudio(meditation.audioUrl);
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
      colors={theme.gradients.horizonNight}
      style={styles.container}
    >
      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name="chevron-down"
          size={32}
          color={theme.headingOnGradient}
        />
      </TouchableOpacity>

      {/* Meditation Info */}
      <View style={styles.infoContainer}>
        <View style={styles.thumbnailPlaceholder}>
          <Ionicons
            name="musical-notes"
            size={80}
            color={theme.headingOnGradient}
          />
        </View>

        <Text style={styles.title}>{meditation.title}</Text>
        <Text style={styles.instructor}>
          {meditation.instructor || 'Guided Meditation'}
        </Text>
        <View style={styles.categoryBadge}>
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
          minimumTrackTintColor={theme.accentGold}
          maximumTrackTintColor="rgba(255,255,255,0.2)"
          thumbTintColor={theme.buttons.primary.background}
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
          <Ionicons name="play-back" size={36} color={theme.headingOnGradient} />
          <Text style={styles.skipText}>15</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={playPause}
          style={styles.playButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <Ionicons name="hourglass" size={48} color={theme.accentTeal} />
          ) : (
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={48}
              color={theme.deepMist}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => skip(15)}
          style={styles.controlButton}
        >
          <Ionicons name="play-forward" size={36} color={theme.headingOnGradient} />
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

const getStyles = (theme: ThemeColors) =>
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
      backgroundColor: 'rgba(255,255,255,0.08)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    title: {
      fontSize: typography.h2,
      fontWeight: typography.bold,
      color: theme.headingOnGradient,
      textAlign: 'center',
      marginBottom: spacing.xs,
    },
    instructor: {
      fontSize: typography.body,
      color: theme.textLight,
      marginBottom: spacing.sm,
    },
    categoryBadge: {
      backgroundColor: 'rgba(255,255,255,0.15)',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.round,
    },
    categoryText: {
      color: theme.headingOnGradient,
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
      color: theme.textLight,
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
      backgroundColor: theme.accentPeach,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: spacing.lg,
      shadowColor: theme.buttons.primary.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    skipText: {
      position: 'absolute',
      fontSize: typography.tiny,
      color: theme.headingOnGradient,
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
      color: theme.textLight,
      textAlign: 'center',
      lineHeight: 24,
    },
  });
