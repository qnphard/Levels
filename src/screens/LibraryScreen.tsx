// LibraryScreen - Browse all meditations with lavender gradient
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { sampleMeditations } from '../data/meditations';
import { RootStackParamList } from '../navigation/AppNavigator';
import MeditationCard from '../components/MeditationCard';
import FeelingsExplainedCard from '../components/FeelingsExplainedCard';
import WhyFeelingSheet from '../components/WhyFeelingSheet';
import EditableLibraryCard from '../components/EditableLibraryCard';
import CardBuilder from '../components/CardBuilder';
import EditModeIndicator from '../components/EditModeIndicator';
import FeatureExplanationOverlay from '../components/FeatureExplanationOverlay';
import { useOnboardingStore } from '../store/onboardingStore';
import { useContentEdit, CardData } from '../context/ContentEditContext';
import {
  useThemeColors,
  useGlowEnabled,
  spacing,
  typography,
  borderRadius,
  ThemeColors,
} from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Helper to convert hex to rgba
const toRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const clampedAlpha = Math.min(1, Math.max(0, alpha));
  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
};

// Default library cards
const defaultLibraryCards: CardData[] = [
  {
    id: 'essentials',
    type: 'library',
    title: 'Essentials',
    description: 'The core things to know about you, your mind, and your feelings.',
    order: 0,
    isOriginal: true,
    icon: 'sparkles',
    navigationTarget: 'Essentials',
  },
  {
    id: 'letting-go',
    type: 'library',
    title: 'Letting Go (Releasing Emotions)',
    description: 'A kinder way to be with your feelings, instead of fighting them.',
    order: 1,
    isOriginal: true,
    icon: 'leaf-outline',
    navigationTarget: 'Chapter',
  },
  {
    id: 'common-traps',
    type: 'library',
    title: 'Common Traps',
    description: 'Common mistakes and misconceptions on the spiritual path.',
    order: 2,
    isOriginal: true,
    icon: 'warning-outline',
    navigationTarget: 'CommonTraps',
  },
];

export default function LibraryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showWhyFeelingSheet, setShowWhyFeelingSheet] = useState(false);
  const [libraryCards, setLibraryCards] = useState<CardData[]>(defaultLibraryCards);
  const [cardsLoaded, setCardsLoaded] = useState(false);
  const [showExploreExplanation, setShowExploreExplanation] = useState(false);

  const theme = useThemeColors();
  const glowEnabled = useGlowEnabled();
  const { getCards, saveCards } = useContentEdit();
  const seenExplanations = useOnboardingStore((s) => s.seenExplanations);
  const markExplanationAsSeen = useOnboardingStore((s) => s.markExplanationAsSeen);
  const hasSeenTutorial = useOnboardingStore((s) => s.hasSeenTutorial);

  const styles = getStyles(theme);

  // Show exploration overlay if not seen and tutorial was seen (or skipped)
  useEffect(() => {
    if (hasSeenTutorial && !seenExplanations.includes('explore')) {
      const timer = setTimeout(() => {
        setShowExploreExplanation(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasSeenTutorial, seenExplanations]);

  // Load cards from storage
  useEffect(() => {
    const loadCards = async () => {
      const storedCards = await getCards('library', 'cards');
      if (storedCards && storedCards.length > 0) {
        setLibraryCards(storedCards);
      } else {
        // Initialize with defaults
        await saveCards('library', 'cards', defaultLibraryCards);
        setLibraryCards(defaultLibraryCards);
      }
      setCardsLoaded(true);
    };
    loadCards();
  }, []);

  const handleCardPress = (card: CardData) => {
    if (card.navigationTarget === 'Essentials') {
      navigation.navigate('Essentials');
    } else if (card.navigationTarget === 'Chapter' && card.id === 'letting-go') {
      navigation.navigate('Chapter', { chapterId: 'letting-go' });
    } else if (card.navigationTarget === 'CommonTraps') {
      navigation.navigate('CommonTraps' as never);
    }
  };

  const handleStructureChange = async () => {
    const storedCards = await getCards('library', 'cards');
    if (storedCards) {
      setLibraryCards(storedCards);
    }
  };

  const filteredMeditations = sampleMeditations.filter(
    (meditation) =>
      meditation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meditation.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meditation.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LinearGradient
      colors={theme.appBackgroundGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <EditModeIndicator />
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={theme.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search meditations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={theme.textMuted}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {!searchQuery && cardsLoaded && (
            <>
              {/* Editable Library Cards */}
              {libraryCards
                .sort((a, b) => a.order - b.order)
                .map((card, index) => (
                  <EditableLibraryCard
                    key={card.id}
                    card={card}
                    index={index}
                    totalCards={libraryCards.length}
                    onPress={() => handleCardPress(card)}
                    onStructureChange={handleStructureChange}
                  />
                ))}

              {/* Card Builder - Add new cards */}
              <CardBuilder
                screen="library"
                section="cards"
                cardType="library"
                onStructureChange={handleStructureChange}
              />

              {/* Feelings Explained Card (special component with buttons) */}
              <FeelingsExplainedCard
                onOpenChapters={() => navigation.navigate('LearnHub')}
                onOpenQuickHelp={() => setShowWhyFeelingSheet(true)}
                style={styles.feelingsCard}
              />
            </>
          )}

          <Text style={styles.sectionTitle}>
            {searchQuery
              ? `Found ${filteredMeditations.length} meditations`
              : 'All Meditations'}
          </Text>

          {filteredMeditations.length > 0 ? (
            filteredMeditations.map((meditation) => (
              <MeditationCard
                key={meditation.id}
                meditation={meditation}
                onPress={() => navigation.navigate('Player', { meditation })}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={64} color={theme.highlightMist} />
              <Text style={styles.emptyText}>No meditations found</Text>
              <Text style={styles.emptySubtext}>
                Try a different search term
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <WhyFeelingSheet
        visible={showWhyFeelingSheet}
        onClose={() => setShowWhyFeelingSheet(false)}
      />

      <FeatureExplanationOverlay
        visible={showExploreExplanation}
        title="Explore & Discover"
        description="Find meditations and articles tailored to your current state of consciousness."
        icon="library-outline"
        onClose={() => {
          setShowExploreExplanation(false);
          markExplanationAsSeen('explore');
        }}
      />
    </LinearGradient>
  );
}

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.cardBackground,
      marginHorizontal: spacing.md,
      marginTop: 60,
      marginBottom: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadowSoft,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    searchIcon: {
      marginRight: spacing.sm,
    },
    searchInput: {
      flex: 1,
      paddingVertical: spacing.sm + 4,
      fontSize: typography.body,
      color: theme.textPrimary,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: spacing.md,
    },
    essentialsCardContainer: {
      marginBottom: spacing.lg,
      position: 'relative',
    },
    essentialsCard: {
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      minHeight: 100,
    },
    essentialsCardContent: {
      padding: spacing.lg,
    },
    essentialsCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    essentialsCardTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    essentialsCardTitle: {
      fontSize: typography.h3,
      fontWeight: typography.bold,
      color: theme.textPrimary,
    },
    essentialsCardSubtitleContainer: {
      marginTop: spacing.xs,
    },
    essentialsCardSubtitle: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 22,
    },
    feelingsCard: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: typography.h3,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginBottom: spacing.md,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xl,
    },
    emptyText: {
      fontSize: typography.h4,
      fontWeight: typography.semibold,
      color: theme.textSecondary,
      marginTop: spacing.md,
    },
    emptySubtext: {
      fontSize: typography.small,
      color: theme.textMuted,
      marginTop: spacing.xs,
    },
    lettingGoCardContainer: {
      marginBottom: spacing.md,
    },
    lightLiftShadow: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 12,
      bottom: -12,
      borderRadius: borderRadius.lg,
      zIndex: 0,
      ...(Platform.OS === 'web'
        ? ({ boxShadow: '0 30px 60px rgba(2, 6, 23, 0.25), 0 10px 24px rgba(2, 6, 23, 0.12)' } as any)
        : null),
    },
    lettingGoCard: {
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      padding: spacing.lg,
    },
    lettingGoCardContent: {
      gap: spacing.sm,
    },
    lettingGoCardSubtitleContainer: {
      marginTop: spacing.sm,
    },
    lettingGoCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    lettingGoCardTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      flex: 1,
    },
    lettingGoCardSubtitle: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 22,
    },
  });
