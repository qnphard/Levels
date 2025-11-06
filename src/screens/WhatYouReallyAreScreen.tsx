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

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function WhatYouReallyAreScreen() {
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
      {/* Header */}
      <View style={styles.header} accessibilityRole="header">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          What You Really Are
        </Text>
        <View style={styles.backButton} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Simple Version</Text>
          
          <View style={styles.conceptCard}>
            <Text style={styles.conceptTitle}>Body</Text>
            <Text style={styles.conceptBody}>
              The body can't experience itself.
            </Text>
            <Text style={styles.conceptBody}>
              Your arm doesn't know it's an arm; your chest doesn't know it's tight.
            </Text>
            <Text style={styles.conceptBody}>
              The body is felt — but it's felt in the mind.
            </Text>
          </View>

          <View style={styles.conceptCard}>
            <Text style={styles.conceptTitle}>Mind</Text>
            <Text style={styles.conceptBody}>
              Thoughts, memories, feelings also can't experience themselves.
            </Text>
            <Text style={styles.conceptBody}>
              A thought doesn't "know" it's a thought; it just appears.
            </Text>
            <Text style={styles.conceptBody}>
              The whole movie of the mind is known inside something bigger.
            </Text>
            <Text style={styles.conceptBody}>
              That "something" is consciousness.
            </Text>
          </View>

          <View style={styles.conceptCard}>
            <Text style={styles.conceptTitle}>Consciousness</Text>
            <Text style={styles.conceptBody}>
              Consciousness is like the screen everything plays on: body sensations, thoughts, emotions, images.
            </Text>
            <Text style={styles.conceptBody}>
              Because there is consciousness, you can notice: "I have a body," "I'm having this thought," "This feeling is here."
            </Text>
          </View>

          <View style={styles.conceptCard}>
            <Text style={styles.conceptTitle}>Awareness</Text>
            <Text style={styles.conceptBody}>
              Even consciousness (all these experiences) is noticed.
            </Text>
            <Text style={styles.conceptBody}>
              That quiet noticing is awareness.
            </Text>
            <Text style={styles.conceptBody}>
              Awareness doesn't come and go with moods. It's the steady background that everything appears in.
            </Text>
            <Text style={styles.conceptBody}>
              The more you rest as that awareness, the less trapped you feel by what passes through it.
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>
              You are not just a hurting body or a chaotic mind. You are the awareness that can notice, hold, and gently heal what shows up.
            </Text>
          </View>
        </View>

        {/* Why This Matters Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why This Matters When You're Suffering</Text>
          <Text style={styles.sectionBody}>
            When you believe you are the pain, the panic, or the story in your head, everything feels life-or-death.
          </Text>
          <Text style={styles.sectionBody}>
            Seeing the layers gives you space:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>Signals arise in the body.</Text>
            <Text style={styles.bulletItem}>The actual experience of pain and emotion happens in the mind.</Text>
            <Text style={styles.bulletItem}>All sensations, thoughts, and feelings appear in consciousness.</Text>
            <Text style={styles.bulletItem}>All of this is held in awareness, which is not broken.</Text>
          </View>
          <Text style={styles.sectionBody}>
            From this view:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>The body isn't your enemy.</Text>
            <Text style={styles.bulletItem}>The mind isn't the final truth.</Text>
            <Text style={styles.bulletItem}>Pain is something appearing to you, not the whole of you.</Text>
          </View>
          <Text style={styles.sectionBody}>
            That space is what makes tools like
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>understanding feelings,</Text>
            <Text style={styles.bulletItem}>letting go,</Text>
            <Text style={styles.bulletItem}>and working at the root of stress</Text>
          </View>
          <Text style={styles.sectionBody}>
            start to land as real support instead of fake positivity.
          </Text>
          <Text style={styles.sectionBody}>
            Just a quiet, practical sense of: "There's more to me than this storm."
          </Text>
        </View>
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
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: typography.h3,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginBottom: spacing.lg,
    },
    sectionBody: {
      fontSize: typography.body + 1, // Slightly larger for readability
      color: theme.mode === 'dark' ? theme.textPrimary : theme.textSecondary,
      lineHeight: 26,
      marginBottom: spacing.md,
    },
    conceptCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
    },
    conceptTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginBottom: spacing.sm,
    },
    conceptBody: {
      fontSize: typography.body + 1, // Slightly larger for readability
      color: theme.mode === 'dark' ? theme.textPrimary : theme.textSecondary,
      lineHeight: 26,
      marginBottom: spacing.xs,
    },
    summaryCard: {
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(139, 92, 246, 0.15)'
        : 'rgba(139, 92, 246, 0.08)',
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      marginTop: spacing.md,
      borderWidth: 1,
      borderColor: theme.primary + '30',
    },
    summaryText: {
      fontSize: typography.body,
      fontWeight: typography.medium,
      color: theme.textPrimary,
      lineHeight: 24,
      fontStyle: 'italic',
    },
    bulletList: {
      marginBottom: spacing.md,
      marginLeft: spacing.xs,
    },
    bulletItem: {
      fontSize: typography.body + 1, // Slightly larger for readability
      color: theme.mode === 'dark' ? theme.textPrimary : theme.textSecondary,
      lineHeight: 26,
      marginBottom: spacing.xs,
      paddingLeft: spacing.xs,
    },
  });

