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
  ThemeColors,
} from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import EditableText from '../components/EditableText';
import EditModeIndicator from '../components/EditModeIndicator';
import { createCardStyles, CARD_COLORS } from '../utils/cardStyles';
import RelatedNextCard from '../components/RelatedNextCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function WhatYouReallyAreScreen() {
  const navigation = useNavigation<NavigationProp>();
  const theme = useThemeColors();
  const cardStyles = createCardStyles(theme);
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
        <Text style={styles.headerTitle}>What You Really Are</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={cardStyles.keyInsightCard}>
          <View style={cardStyles.keyInsightHeader}>
            <Ionicons name="eye-outline" size={20} color={CARD_COLORS.keyInsight} />
            <EditableText
              screen="what-you-really-are"
              section="main"
              id="key-insight-title"
              originalContent="The Observer is the Doorway"
              textStyle={cardStyles.keyInsightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="what-you-really-are"
            section="main"
            id="key-insight"
            originalContent="You are not your body, your thoughts, or your feelings. You are the infinite, changeless awareness in which they all appear and disappear."
            textStyle={cardStyles.keyInsightText}
            type="paragraph"
          />
        </View>

        <EditableText
          screen="what-you-really-are"
          section="main"
          id="intro"
          originalContent="The greatest illusion of the human experience is identity. We believe we are the 'main character' in a drama, a small 'i' that is vulnerable, limited, and mortal. But a simple investigation reveals that everything we think is 'me' is actually something we are *observing*."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <EditableText
          screen="what-you-really-are"
          section="main"
          id="layers-title"
          originalContent="Dis-identifying with the Layers"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <View style={cardStyles.comparisonCard}>
          <EditableText
            screen="what-you-really-are"
            section="main"
            id="comparison-title"
            originalContent="Subject vs. Object"
            textStyle={cardStyles.comparisonTitle}
            type="title"
          />
          <View style={cardStyles.comparisonRow}>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="body-outline" size={18} color={CARD_COLORS.force} />
              <View style={{ flex: 1 }}>
                <EditableText
                  screen="what-you-really-are"
                  section="main"
                  id="body-layer-title"
                  originalContent="The Body (Object)"
                  textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                  type="paragraph"
                />
                <EditableText
                  screen="what-you-really-are"
                  section="main"
                  id="body-layer"
                  originalContent="The body is felt and perceived. Since it is perceived *by* you, it cannot *be* you. You are the witness of the body."
                  textStyle={cardStyles.comparisonText}
                  type="paragraph"
                />
              </View>
            </View>
            <View style={cardStyles.comparisonItem}>
              <Ionicons name="chatbubbles-outline" size={18} color={CARD_COLORS.force} />
              <View style={{ flex: 1 }}>
                <EditableText
                  screen="what-you-really-are"
                  section="main"
                  id="mind-layer-title"
                  originalContent="The Mind (Object)"
                  textStyle={[cardStyles.comparisonText, { fontWeight: typography.bold }]}
                  type="paragraph"
                />
                <EditableText
                  screen="what-you-really-are"
                  section="main"
                  id="mind-layer"
                  originalContent="Thoughts and feelings come and go like clouds. Since you are there to notice their arrival and departure, you are not them."
                  textStyle={cardStyles.comparisonText}
                  type="paragraph"
                />
              </View>
            </View>
          </View>
        </View>

        <EditableText
          screen="what-you-really-are"
          section="main"
          id="witness-title"
          originalContent="The Silent Witness"
          textStyle={cardStyles.sectionTitle}
          type="title"
        />

        <EditableText
          screen="what-you-really-are"
          section="main"
          id="witness-desc"
          originalContent="Behind the noise of the world and the chatter of the mind, there is a quiet, steady Presence. It has no name, no age, and no history. It is the 'I' that remains the same whether you are 5 years old or 80 years old. This is the Self (capital S)—the part of you that is connected to the Infinite."
          textStyle={cardStyles.paragraph}
          type="paragraph"
        />

        <View style={cardStyles.warningCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="alert-circle-outline" size={20} color={CARD_COLORS.warning} />
            <EditableText
              screen="what-you-really-are"
              section="main"
              id="ego-trap-title"
              originalContent="The Ego's Mimicry"
              textStyle={cardStyles.warningTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="what-you-really-are"
            section="main"
            id="ego-trap-text"
            originalContent="The ego (the small 'i') will try to 'claim' enlightenment. It will say, 'I am now the witness!' Realize that even this thought is being witnessed. True awareness doesn't have a voice; it is the silence in which the voice of the ego is heard."
            textStyle={cardStyles.warningText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.insightCard}>
          <View style={cardStyles.cardIconHeader}>
            <Ionicons name="infinite-outline" size={20} color={CARD_COLORS.insight} />
            <EditableText
              screen="what-you-really-are"
              section="main"
              id="insight-title"
              originalContent="Subjectivity is All"
              textStyle={cardStyles.insightTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="what-you-really-are"
            section="main"
            id="insight-text"
            originalContent="Truth is not 'out there' to be found objectively. Truth is the subjectivity of the Witness. As you stop looking at the 'content' of experience and start noticing the 'context' of Awareness itself, the ultimate reality reveals itself as your very own being."
            textStyle={cardStyles.insightText}
            type="paragraph"
          />
        </View>

        <View style={cardStyles.practiceCard}>
          <View style={cardStyles.practiceHeader}>
            <Ionicons name="compass-outline" size={20} color={CARD_COLORS.practice} />
            <EditableText
              screen="what-you-really-are"
              section="main"
              id="practice-title"
              originalContent="Practice: Resting as Presence"
              textStyle={cardStyles.practiceTitle}
              type="title"
            />
          </View>
          <EditableText
            screen="what-you-really-are"
            section="main"
            id="practice-guide"
            originalContent="1. Close your eyes and notice a sound in the room.\n2. Ask: 'Who is aware of this sound?'\n3. Notice a thought. Ask: 'Who is aware of this thought?'\n4. Notice a feeling. Ask: 'Who is aware of this feeling?'\n5. Now, turn your attention back toward the One who is aware. Don't look for an image, but feel the 'quality' of the Awareness itself.\n6. Rest in that Awareness for as long as possible. Feel its peace, its silence, and its absolute safety."
            textStyle={cardStyles.practiceText}
            type="paragraph"
          />
        </View>

        <RelatedNextCard
          relatedIds={['natural-happiness', 'feelings-explained', 'letting-go']}
          currentScreenId="what-you-really-are"
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
  });
