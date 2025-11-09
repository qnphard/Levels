import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  useThemeColors,
  spacing,
  typography,
  borderRadius,
  ThemeColors,
} from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import EditableText from '../components/EditableText';
import EditModeIndicator from '../components/EditModeIndicator';
import MusicVibrationAnimation from '../components/animations/MusicVibrationAnimation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MusicAsToolScreen() {
  const navigation = useNavigation<NavigationProp>();
  const theme = useThemeColors();
  const styles = getStyles(theme);

  return (
    <LinearGradient
      colors={theme.appBackgroundGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.45, 1]}
    >
      <EditModeIndicator />
      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Music as a Tool</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <EditableText
          screen="music-as-tool"
          section="main"
          id="intro"
          originalContent="Music can be measured from the point of view of consciousness levels. The energy quality of the music affects us and is very important—which music we listen to matters."
          textStyle={styles.paragraph}
          type="paragraph"
        />

        <View style={styles.animationContainer}>
          <MusicVibrationAnimation autoPlay={true} />
        </View>

        <EditableText
          screen="music-as-tool"
          section="main"
          id="anger-music"
          originalContent="There is music that can make us feel empowered because there is a lot of energy in it (anger-based music). But the actual effect is detrimental. It might help one get out of depression temporarily since anger is higher than grief, but it's not a long-term solution. It's like using a stimulant—it gives temporary energy but drains you in the long run."
          textStyle={styles.paragraph}
          type="paragraph"
        />

        <View style={styles.keyPointsCard}>
          <EditableText
            screen="music-as-tool"
            section="main"
            id="classical-title"
            originalContent="Higher Levels"
            textStyle={styles.keyPointsTitle}
            type="title"
          />
          <EditableText
            screen="music-as-tool"
            section="main"
            id="classical"
            originalContent="A lot of classical music can reach the level of love (consciousness level 500). This music can be used as a tool to calm yourself, relax, and reach momentarily higher levels. It can help you shift from lower states to higher states, acting as a bridge to higher consciousness."
            textStyle={styles.keyPoint}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="music-as-tool"
          section="main"
          id="words"
          originalContent="The words carry a heavy weight as well. Be wary of the message of the songs. Even if the music itself is uplifting, negative lyrics can program your mind with limiting beliefs. The combination of music and words creates a powerful influence on your consciousness."
          textStyle={styles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="music-as-tool"
          section="main"
          id="practice"
          originalContent="Use music consciously as a tool. Notice how different music makes you feel. Choose music that elevates your consciousness rather than dragging it down. Classical music, spiritual music, and music with positive messages can be powerful allies on your journey."
          textStyle={styles.paragraph}
          type="paragraph"
        />
      </ScrollView>
    </LinearGradient>
  );
}

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 60,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      flex: 1,
      fontSize: typography.h3,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      textAlign: 'center',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.lg,
      paddingBottom: spacing.xl,
    },
    paragraph: {
      fontSize: typography.body,
      color: theme.textPrimary,
      lineHeight: 24,
      marginBottom: spacing.md,
    },
    keyPointsCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
    },
    keyPointsTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginBottom: spacing.sm,
    },
    keyPoint: {
      fontSize: typography.body,
      color: theme.textPrimary,
      lineHeight: 22,
    },
    animationContainer: {
      marginVertical: spacing.lg,
      alignItems: 'center',
    },
  });

