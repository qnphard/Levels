import React, { useState } from 'react';
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
import ContentBuilder from '../components/ContentBuilder';
import { useContentStructure } from '../hooks/useContentStructure';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function WhatYouReallyAreScreen() {
  const navigation = useNavigation<NavigationProp>();
  const theme = useThemeColors();
  const styles = getStyles(theme);
  const [structureRefreshKey, setStructureRefreshKey] = useState(0);
  
  // Load content structure
  const { structure, refreshStructure } = useContentStructure('what-you-really-are', 'main');
  
  const handleStructureChange = () => {
    refreshStructure();
    setStructureRefreshKey(prev => prev + 1);
  };

  return (
    <LinearGradient
      colors={theme.appBackgroundGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.45, 1]}
    >
      <EditModeIndicator />
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
        <View style={styles.section} key={structureRefreshKey}>
          <EditableText
            screen="what-you-really-are"
            section="simple-version"
            id="title"
            originalContent="Simple Version"
            textStyle={styles.sectionTitle}
            type="title"
          />
          
          <View style={styles.conceptCard}>
            <EditableText
              screen="what-you-really-are"
              section="simple-version"
              id="body-title"
              originalContent="Body"
              textStyle={styles.conceptTitle}
              type="title"
            />
            <EditableText
              screen="what-you-really-are"
              section="simple-version"
              id="body-para-1"
              originalContent={"The body can't experience itself."}
              textStyle={styles.conceptBody}
              type="paragraph"
            />
            <EditableText
              screen="what-you-really-are"
              section="simple-version"
              id="body-para-2"
              originalContent={"Your arm doesn't know it's an arm; your chest doesn't know it's tight."}
              textStyle={styles.conceptBody}
              type="paragraph"
            />
            <EditableText
              screen="what-you-really-are"
              section="simple-version"
              id="body-para-3"
              originalContent={"The body is felt — but it's felt in the mind."}
              textStyle={styles.conceptBody}
              type="paragraph"
            />
          </View>

          <View style={styles.conceptCard}>
            <EditableText
              screen="what-you-really-are"
              section="simple-version"
              id="mind-title"
              originalContent="Mind"
              textStyle={styles.conceptTitle}
              type="title"
            />
            <EditableText
              screen="what-you-really-are"
              section="simple-version"
              id="mind-para-1"
              originalContent={"Thoughts, memories, feelings also can't experience themselves."}
              textStyle={styles.conceptBody}
              type="paragraph"
            />
            <EditableText
              screen="what-you-really-are"
              section="simple-version"
              id="mind-para-2"
              originalContent={'A thought doesn\'t "know" it\'s a thought; it just appears.'}
              textStyle={styles.conceptBody}
              type="paragraph"
            />
            <EditableText
              screen="what-you-really-are"
              section="simple-version"
              id="mind-para-3"
              originalContent="The whole movie of the mind is known inside something bigger."
              textStyle={styles.conceptBody}
              type="paragraph"
            />
            <EditableText
              screen="what-you-really-are"
              section="simple-version"
              id="mind-para-4"
              originalContent={'That "something" is consciousness.'}
              textStyle={styles.conceptBody}
              type="paragraph"
            />
          </View>

          <View style={styles.conceptCard}>
            <EditableText
              screen="what-you-really-are"
              section="simple-version"
              id="consciousness-title"
              originalContent="Consciousness"
              textStyle={styles.conceptTitle}
              type="title"
            />
            <EditableText
              screen="what-you-really-are"
              section="simple-version"
              id="consciousness-para-1"
              originalContent="Consciousness is like the screen everything plays on: body sensations, thoughts, emotions, images."
              textStyle={styles.conceptBody}
              type="paragraph"
            />
            <EditableText
              screen="what-you-really-are"
              section="simple-version"
              id="consciousness-para-2"
              originalContent={'Because there is consciousness, you can notice: "I have a body," "I\'m having this thought," "This feeling is here."'}
              textStyle={styles.conceptBody}
              type="paragraph"
            />
          </View>

          <View style={styles.conceptCard}>
            <EditableText
              screen="what-you-really-are"
              section="simple-version"
              id="awareness-title"
              originalContent="Awareness"
              textStyle={styles.conceptTitle}
              type="title"
            />
            <EditableText
              screen="what-you-really-are"
              section="simple-version"
              id="awareness-para-1"
              originalContent="Even consciousness (all these experiences) is noticed."
              textStyle={styles.conceptBody}
              type="paragraph"
            />
            <EditableText
              screen="what-you-really-are"
              section="simple-version"
              id="awareness-para-2"
              originalContent="That quiet noticing is awareness."
              textStyle={styles.conceptBody}
              type="paragraph"
            />
            <EditableText
              screen="what-you-really-are"
              section="simple-version"
              id="awareness-para-3"
              originalContent={"Awareness doesn't come and go with moods. It's the steady background that everything appears in."}
              textStyle={styles.conceptBody}
              type="paragraph"
            />
            <EditableText
              screen="what-you-really-are"
              section="simple-version"
              id="awareness-para-4"
              originalContent="The more you rest as that awareness, the less trapped you feel by what passes through it."
              textStyle={styles.conceptBody}
              type="paragraph"
            />
          </View>

          <View style={styles.summaryCard}>
            <EditableText
              screen="what-you-really-are"
              section="simple-version"
              id="summary"
              originalContent="You are not just a hurting body or a chaotic mind. You are the awareness that can notice, hold, and gently heal what shows up."
              textStyle={styles.summaryText}
              type="paragraph"
            />
          </View>
          
          <ContentBuilder
            screen="what-you-really-are"
            section="simple-version"
            onStructureChange={handleStructureChange}
          />
        </View>

        {/* Why This Matters Section */}
        <View style={styles.section} key={`why-matters-${structureRefreshKey}`}>
          <EditableText
            screen="what-you-really-are"
            section="why-matters"
            id="title"
            originalContent={"Why This Matters When You're Suffering"}
            textStyle={styles.sectionTitle}
            type="title"
          />
          <EditableText
            screen="what-you-really-are"
            section="why-matters"
            id="para-1"
            originalContent="When you believe you are the pain, the panic, or the story in your head, everything feels life-or-death."
            textStyle={styles.sectionBody}
            type="paragraph"
          />
          <EditableText
            screen="what-you-really-are"
            section="why-matters"
            id="para-2"
            originalContent="Seeing the layers gives you space:"
            textStyle={styles.sectionBody}
            type="paragraph"
          />
          <View style={styles.bulletList}>
            <EditableText
              screen="what-you-really-are"
              section="why-matters"
              id="bullet-1"
              originalContent="Signals arise in the body."
              textStyle={styles.bulletItem}
              type="paragraph"
            />
            <EditableText
              screen="what-you-really-are"
              section="why-matters"
              id="bullet-2"
              originalContent="The actual experience of pain and emotion happens in the mind."
              textStyle={styles.bulletItem}
              type="paragraph"
            />
            <EditableText
              screen="what-you-really-are"
              section="why-matters"
              id="bullet-3"
              originalContent="All sensations, thoughts, and feelings appear in consciousness."
              textStyle={styles.bulletItem}
              type="paragraph"
            />
            <EditableText
              screen="what-you-really-are"
              section="why-matters"
              id="bullet-4"
              originalContent="All of this is held in awareness, which is not broken."
              textStyle={styles.bulletItem}
              type="paragraph"
            />
          </View>
          <EditableText
            screen="what-you-really-are"
            section="why-matters"
            id="para-3"
            originalContent="From this view:"
            textStyle={styles.sectionBody}
            type="paragraph"
          />
          <View style={styles.bulletList}>
            <EditableText
              screen="what-you-really-are"
              section="why-matters"
              id="bullet-5"
              originalContent={"The body isn't your enemy."}
              textStyle={styles.bulletItem}
              type="paragraph"
            />
            <EditableText
              screen="what-you-really-are"
              section="why-matters"
              id="bullet-6"
              originalContent={"The mind isn't the final truth."}
              textStyle={styles.bulletItem}
              type="paragraph"
            />
            <EditableText
              screen="what-you-really-are"
              section="why-matters"
              id="bullet-7"
              originalContent="Pain is something appearing to you, not the whole of you."
              textStyle={styles.bulletItem}
              type="paragraph"
            />
          </View>
          <EditableText
            screen="what-you-really-are"
            section="why-matters"
            id="para-4"
            originalContent="That space is what makes tools like"
            textStyle={styles.sectionBody}
            type="paragraph"
          />
          <View style={styles.bulletList}>
            <EditableText
              screen="what-you-really-are"
              section="why-matters"
              id="bullet-8"
              originalContent="understanding feelings,"
              textStyle={styles.bulletItem}
              type="paragraph"
            />
            <EditableText
              screen="what-you-really-are"
              section="why-matters"
              id="bullet-9"
              originalContent="letting go,"
              textStyle={styles.bulletItem}
              type="paragraph"
            />
            <EditableText
              screen="what-you-really-are"
              section="why-matters"
              id="bullet-10"
              originalContent="and working at the root of stress"
              textStyle={styles.bulletItem}
              type="paragraph"
            />
          </View>
          <EditableText
            screen="what-you-really-are"
            section="why-matters"
            id="para-5"
            originalContent="start to land as real support instead of fake positivity."
            textStyle={styles.sectionBody}
            type="paragraph"
          />
          <EditableText
            screen="what-you-really-are"
            section="why-matters"
            id="para-6"
            originalContent={'Just a quiet, practical sense of: "There\'s more to me than this storm."'}
            textStyle={styles.sectionBody}
            type="paragraph"
          />
          
          <ContentBuilder
            screen="what-you-really-are"
            section="why-matters"
            onStructureChange={handleStructureChange}
          />
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

