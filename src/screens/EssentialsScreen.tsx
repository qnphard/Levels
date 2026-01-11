import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  useThemeColors,
  useGlowEnabled,
  spacing,
  typography,
  borderRadius,
  ThemeColors,
} from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import { essentialItems, getFoundationItems } from '../data/essentials';
import EditableText from '../components/EditableText';
import EditModeIndicator from '../components/EditModeIndicator';
import { useContentStructure } from '../hooks/useContentStructure';
import RadialMenuLayout from '../components/RadialMenuLayout';
import OrientationSheet, { useOrientationStatus } from '../components/OrientationSheet';
import StartHereCard from '../components/StartHereCard';
import HowToUseModal from '../components/HowToUseModal';
import FeatureExplanationOverlay from '../components/FeatureExplanationOverlay';
import { useOnboardingStore } from '../store/onboardingStore';
import { useUserStore } from '../store/userStore';
import TopicPreviewSheet from '../components/TopicPreviewSheet';
import { getRecommendedMandalaId } from '../services/recommendationEngine';
import { EssentialItem } from '../data/essentials';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Helper to convert hex to rgba
const toRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const clampedAlpha = Math.min(1, Math.max(0, alpha));
  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
};

export default function EssentialsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const theme = useThemeColors();
  const glowEnabled = useGlowEnabled();
  const styles = getStyles(theme);
  const [structureRefreshKey, setStructureRefreshKey] = useState(0);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [showOrientation, setShowOrientation] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(false);
  const [showEssentialsExplanation, setShowEssentialsExplanation] = useState(false);
  const [previewItem, setPreviewItem] = useState<EssentialItem | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const seenExplanations = useOnboardingStore((s) => s.seenExplanations);
  const markExplanationAsSeen = useOnboardingStore((s) => s.markExplanationAsSeen);
  const hasSeenTutorial = useOnboardingStore((s) => s.hasSeenTutorial);
  const userIntention = useOnboardingStore((s) => s.intention);
  const currentZone = useOnboardingStore((s) => s.currentZone);

  const completedTopics = useUserStore((s) => s.completedTopics);

  // Show essentials overlay if not seen and tutorial was seen (or skipped)
  useEffect(() => {
    if (hasSeenTutorial && !seenExplanations.includes('essentials')) {
      const timer = setTimeout(() => {
        setShowEssentialsExplanation(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasSeenTutorial, seenExplanations]);

  // Check orientation status
  const { hasSeenOrientation } = useOrientationStatus();

  // Show orientation on first launch
  useEffect(() => {
    if (hasSeenOrientation === false) {
      setShowOrientation(true);
    }
  }, [hasSeenOrientation]);

  // Determine recommended ID
  const recommendedId = useMemo(() =>
    getRecommendedMandalaId(userIntention, currentZone),
    [userIntention, currentZone]
  );

  // Load content structure
  const { structure, refreshStructure } = useContentStructure('essentials', 'main');

  const handleStructureChange = () => {
    refreshStructure();
    setStructureRefreshKey(prev => prev + 1);
  };

  // Get foundation items
  const foundationItems = getFoundationItems();

  const handleEssentialPress = useCallback((item: EssentialItem) => {
    setPreviewItem(item);
    setShowPreview(true);
    setSelectedId(item.id);
  }, []);

  const handleNavigateToTopic = useCallback((item: EssentialItem) => {
    setShowPreview(false);

    if (item.route.screen === 'Chapter' || item.route.screen === 'LearnHub') {
      navigation.navigate(item.route.screen as any, item.route.params as any);
    } else {
      // For all other screens named exactly as in RootStackParamList
      navigation.navigate(item.route.screen as any);
    }
  }, [navigation]);

  const handleOrientationComplete = useCallback(() => {
    setShowOrientation(false);
  }, []);

  const handleStartFoundations = useCallback(() => {
    setShowOrientation(false);
    // Navigate to first foundation item
    if (foundationItems.length > 0) {
      handleEssentialPress(foundationItems[0]);
    }
  }, [foundationItems, handleEssentialPress]);

  // Force dark mystical theme for this screen
  const darkGradient: readonly [string, string, string] = ['#0a0a1a', '#0f1629', '#1a1a2e'];

  return (
    <LinearGradient
      colors={darkGradient}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <EditModeIndicator />

      {/* Header */}
      <View style={styles.header} accessibilityRole="header">
        {navigation.canGoBack() ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#e0f2fe" />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}
        <Text style={[styles.headerTitle, { color: '#e0f2fe' }]} numberOfLines={1}>
          Essentials
        </Text>
        {/* Info button */}
        <TouchableOpacity
          onPress={() => setShowHowToUse(true)}
          style={styles.backButton}
        >
          <Ionicons name="information-circle-outline" size={24} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Start Here Card */}
      <StartHereCard
        foundationItems={foundationItems}
        onItemPress={handleEssentialPress}
        onInfoPress={() => setShowHowToUse(true)}
      />

      {/* Floating Subtitle */}
      <View style={styles.floatingSubtitleContainer}>
        <Text style={[styles.subtitle, { color: '#94a3b8' }]}>
          Explore the full map below
        </Text>
      </View>

      {/* Radial Layout */}
      <View style={styles.contentContainer}>
        <RadialMenuLayout
          items={essentialItems}
          onItemPress={handleEssentialPress}
          selectedId={selectedId}
          recommendedId={recommendedId}
          completedIds={completedTopics}
        />
      </View>

      {/* Preview Sheet */}
      <TopicPreviewSheet
        visible={showPreview}
        item={previewItem}
        onClose={() => setShowPreview(false)}
        onExplore={handleNavigateToTopic}
      />

      {/* Orientation Modal */}
      <OrientationSheet
        visible={showOrientation}
        onComplete={handleOrientationComplete}
        onStartFoundations={handleStartFoundations}
      />

      {/* How To Use Modal */}
      <HowToUseModal
        visible={showHowToUse}
        onClose={() => setShowHowToUse(false)}
      />

      <FeatureExplanationOverlay
        visible={showEssentialsExplanation}
        title="The Mandala"
        description="The Essentials page contains core concepts and the Mandala—a visual map for understanding your inner world."
        icon="sparkles-outline"
        onClose={() => {
          setShowEssentialsExplanation(false);
          markExplanationAsSeen('essentials');
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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 50,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.sm,
      zIndex: 100, // Stay on top
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
    floatingSubtitleContainer: {
      paddingHorizontal: spacing.xl,
      marginTop: -spacing.sm,
      zIndex: 50,
    },
    subtitle: {
      fontSize: 13,
      color: theme.textSecondary,
      textAlign: 'center',
      fontStyle: 'italic',
      lineHeight: 18,
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 110, // Increased to offset the absolute tab bar and move mandala into visible center
      marginTop: -20, // Pull up to reduce excessive top space
    },
  });
