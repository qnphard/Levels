import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Dimensions,
  Clipboard,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { useNavigation } from '@react-navigation/native';
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

const { width } = Dimensions.get('window');

export default function LettingGoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const theme = useThemeColors();
  const styles = getStyles(theme);
  const chapterId = 'letting-go';
  const chapter = getChapterById(chapterId);
  const { content, title, sections } = useMarkdownChapter(chapterId);
  const [activeTab, setActiveTab] = useState(sections.length > 0 ? sections[0].id : null);
  const [isTimerVisible, setIsTimerVisible] = useState(false);
  const [timer, setTimer] = useState(120);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerVisible && timer > 0) {
      interval = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerVisible, timer]);

  const startTimer = () => {
    setTimer(120);
    setIsTimerVisible(true);
  };

  const copyToClipboard = () => {
    const practiceSection = sections.find(s => s.id === 'practice-2-minute-quick-release');
    if (practiceSection) {
      Clipboard.setString(practiceSection.rawContent);
      alert('Practice copied to clipboard!');
    }
  };

  if (!chapter) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Chapter not found</Text>
      </View>
    );
  }

  const glowColor = theme.feelingsChapters[chapter.glowColor];

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
  };

  return (
    <LinearGradient
      colors={theme.appBackgroundGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.45, 1]}
    >
      <View style={styles.header} accessibilityRole="header">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {chapter.title}
        </Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {sections.map((section) => {
            const isActive = activeTab === section.id;
            return (
              <Pressable
                key={section.id}
                onPress={() => setActiveTab(section.id)}
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
                  {section.title}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {sections.map(section => {
          if (section.id === activeTab) {
            return (
              <View key={section.id}>
                {section.id === 'practice-2-minute-quick-release' && (
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>Quick Practice</Text>
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity onPress={startTimer} style={styles.timerButton}>
                        <Ionicons name="timer-outline" size={24} color={theme.textPrimary} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
                        <Ionicons name="copy-outline" size={24} color={theme.textPrimary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                <Markdown style={markdownStyles}>{section.rawContent}</Markdown>
              </View>
            )
          }
          return null;
        })}

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This content does not replace medical care. Seek professional help as needed.
          </Text>
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isTimerVisible}
        onRequestClose={() => {
          setIsTimerVisible(!isTimerVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setIsTimerVisible(!isTimerVisible)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.md,
      borderRadius: borderRadius.md,
      marginBottom: spacing.lg,
      backgroundColor: theme.cardBackground,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    calloutTitle: {
      fontSize: typography.h4,
      fontWeight: typography.bold,
      color: theme.textPrimary,
    },
    copyButton: {
      padding: spacing.sm,
    },
    disclaimer: {
      marginTop: spacing.xl,
      padding: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    disclaimerText: {
      fontSize: typography.small,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    timerButton: {
      padding: spacing.sm,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
      fontSize: 30,
    },
    errorText: {
      fontSize: typography.body,
      color: theme.error,
      textAlign: 'center',
      marginTop: spacing.xl,
    },
  });
