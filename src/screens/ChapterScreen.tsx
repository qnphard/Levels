import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  useThemeColors,
  spacing,
  typography,
  borderRadius,
  ThemeColors,
} from '../theme/colors';
import { getChapterById, feelingsChapters } from '../data/feelingsChapters';
import { useMarkdownChapter, ParsedSection } from '../hooks/useMarkdownChapter';
import { useChapterProgress } from '../hooks/useChapterProgress';
import { RootStackParamList } from '../navigation/AppNavigator';
import EditableText from '../components/EditableText';
import EditModeIndicator from '../components/EditModeIndicator';
import EditableMarkdown from '../components/EditableMarkdown';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Chapter'>;
type ChapterRouteProp = RouteProp<RootStackParamList, 'Chapter'>;

const { width } = Dimensions.get('window');

// Main component - checks chapterId BEFORE calling any hooks
export default function ChapterScreen() {
  const route = useRoute<ChapterRouteProp>();
  const { chapterId } = route.params;
  
  // Route to specialized screen for "Letting Go" chapter
  // MUST check this BEFORE calling any hooks that depend on chapterId
  // to avoid "Rendered more hooks than during the previous render" error
  if (chapterId === 'letting-go') {
    const LettingGoChapterScreen = require('./LettingGoChapterScreen').default;
    return <LettingGoChapterScreen />;
  }
  
  // Render the regular chapter screen
  return <ChapterScreenContent chapterId={chapterId} />;
}

// Content component - calls all hooks unconditionally
function ChapterScreenContent({ chapterId }: { chapterId: string }) {
  const navigation = useNavigation<NavigationProp>();
  const theme = useThemeColors();
  const styles = getStyles(theme);
  
  const chapter = getChapterById(chapterId);
  const { content, title, sections } = useMarkdownChapter(chapterId);
  const { updateProgress, getProgress } = useChapterProgress();
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const progress = getProgress(chapterId);

  // Get related chapters
  const relatedChapters = chapter
    ? chapter.relatedChapters
        .map((id) => getChapterById(id))
        .filter((c) => c !== undefined)
    : [];

  // Scroll spy - detect which section is visible
  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setScrollPosition(scrollY);

    // Simple scroll spy - find section closest to top
    // In a real implementation, you'd measure section positions
    // For now, we'll use a simple approximation
    const sectionIndex = Math.floor(scrollY / 300); // Approximate
    if (sections[sectionIndex]) {
      setActiveSection(sections[sectionIndex].id);
    }
  };

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    // In a real implementation, you'd measure the actual position
    // For now, find the section index and scroll approximately
    const index = sections.findIndex((s) => s.id === sectionId);
    if (index >= 0 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: index * 300, // Approximate position
        animated: true,
      });
      setActiveSection(sectionId);
    }
  };

  // Update progress as user scrolls
  useEffect(() => {
    if (content && scrollPosition > 0) {
      // Estimate progress based on scroll position
      // In production, you'd calculate this more accurately
      const estimatedProgress = Math.min(scrollPosition / 2000, 1);
      if (estimatedProgress > (progress?.readProgress || 0)) {
        updateProgress(chapterId, {
          readProgress: estimatedProgress,
        });
      }
    }
  }, [scrollPosition, content, chapterId, progress, updateProgress]);

  if (!chapter) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Chapter not found</Text>
      </View>
    );
  }

  const glowColor = theme.feelingsChapters[chapter.glowColor];

  // Markdown styles
  const markdownStyles = {
    body: {
      color: theme.textPrimary,
      fontSize: typography.body,
      lineHeight: 24,
    },
    heading1: {
      color: theme.textPrimary,
      fontSize: typography.h2,
      fontWeight: typography.bold,
      marginTop: spacing.xl,
      marginBottom: spacing.md,
    },
    heading2: {
      color: theme.textPrimary,
      fontSize: typography.h3,
      fontWeight: typography.bold,
      marginTop: spacing.xl,
      marginBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      paddingBottom: spacing.xs,
    },
    heading3: {
      color: theme.textPrimary,
      fontSize: typography.h4,
      fontWeight: typography.semibold,
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
    },
    paragraph: {
      color: theme.textSecondary,
      fontSize: typography.body,
      lineHeight: 24,
      marginBottom: spacing.md,
    },
    strong: {
      fontWeight: typography.bold,
      color: theme.textPrimary,
    },
    em: {
      fontStyle: 'italic',
    },
    blockquote: {
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.05)',
      borderLeftWidth: 3,
      borderLeftColor: glowColor,
      paddingLeft: spacing.md,
      paddingVertical: spacing.sm,
      marginVertical: spacing.md,
      marginLeft: spacing.md,
    },
    listItem: {
      color: theme.textSecondary,
      fontSize: typography.body,
      marginBottom: spacing.sm,
    },
    table: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.md,
      marginVertical: spacing.md,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    tableCell: {
      flex: 1,
      padding: spacing.sm,
      borderRightWidth: 1,
      borderRightColor: theme.border,
    },
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
          {String(title || chapter.title || 'Chapter')}
        </Text>
        <View style={styles.backButton} />
      </View>

      {/* Sticky Section Tabs */}
      {sections.length > 0 && (
        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}
          >
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <Pressable
                  key={section.id}
                  onPress={() => scrollToSection(section.id)}
                  style={[
                    styles.tab,
                    isActive && styles.tabActive,
                    isActive && {
                      borderBottomColor: glowColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      isActive && { color: glowColor },
                    ]}
                    numberOfLines={1}
                  >
                    {String(section.title || '')}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={100}
        showsVerticalScrollIndicator={false}
      >
        {/* Key Takeaways Callout */}
        <View
          style={[
            styles.callout,
            {
              backgroundColor: glowColor + '15',
              borderLeftColor: glowColor,
            },
          ]}
        >
          <Ionicons name="bulb-outline" size={24} color={glowColor} />
          <View style={styles.calloutContent}>
            <EditableText
              screen="chapter"
              section={chapterId}
              id="key-takeaways-title"
              originalContent="Key Takeaways"
              textStyle={styles.calloutTitle}
              type="title"
            />
            <EditableText
              screen="chapter"
              section={chapterId}
              id="key-takeaways-summary"
              originalContent={String(chapter.summary || '')}
              textStyle={styles.calloutText}
              type="paragraph"
            />
          </View>
        </View>

        {/* Markdown Content */}
        <View style={styles.markdownContainer}>
          <EditableMarkdown
            screen="chapter"
            section={chapterId}
            originalContent={content}
            markdownStyles={markdownStyles}
          />
        </View>

        {/* Related Chapters */}
        {relatedChapters.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>Related Chapters</Text>
            <View style={styles.relatedChips}>
              {relatedChapters.map((relatedChapter) => (
                <Pressable
                  key={relatedChapter.id}
                  onPress={() => {
                    // Use requestAnimationFrame to ensure navigation happens after current render cycle
                    requestAnimationFrame(() => {
                      navigation.replace('Chapter', { chapterId: relatedChapter.id });
                    });
                  }}
                  style={[
                    styles.relatedChip,
                    {
                      backgroundColor:
                        theme.feelingsChapters[relatedChapter.glowColor] + '20',
                      borderColor: theme.feelingsChapters[relatedChapter.glowColor],
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.relatedChipText,
                      { color: theme.feelingsChapters[relatedChapter.glowColor] },
                    ]}
                  >
                    {String(relatedChapter.title || '')}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
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
    tabsContainer: {
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.cardBackground,
    },
    tabsContent: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    tab: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginRight: spacing.sm,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    tabActive: {
      borderBottomWidth: 2,
    },
    tabText: {
      fontSize: typography.small,
      fontWeight: typography.medium,
      color: theme.textSecondary,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.lg,
    },
    callout: {
      flexDirection: 'row',
      padding: spacing.md,
      borderRadius: borderRadius.md,
      marginBottom: spacing.lg,
      borderLeftWidth: 4,
    },
    calloutContent: {
      flex: 1,
      marginLeft: spacing.md,
    },
    calloutTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textPrimary,
      marginBottom: spacing.xs,
    },
    calloutText: {
      fontSize: typography.body,
      color: theme.textSecondary,
      lineHeight: 22,
    },
    markdownContainer: {
      marginBottom: spacing.xl,
    },
    relatedSection: {
      marginTop: spacing.xl,
      paddingTop: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    relatedTitle: {
      fontSize: typography.h4,
      fontWeight: typography.semibold,
      color: theme.textPrimary,
      marginBottom: spacing.md,
    },
    relatedChips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    relatedChip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.round,
      borderWidth: 1,
    },
    relatedChipText: {
      fontSize: typography.small,
      fontWeight: typography.semibold,
    },
    errorText: {
      fontSize: typography.body,
      color: theme.error,
      textAlign: 'center',
      marginTop: spacing.xl,
    },
  });

