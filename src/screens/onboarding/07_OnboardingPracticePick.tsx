import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStackTypes';
import { useThemeColors, typography, spacing } from '../../theme/colors';
import PracticeSelector, { Practice } from '../../components/PracticeSelector';

type Nav = NativeStackNavigationProp<OnboardingStackParamList, 'PracticePick'>;

/**
 * Breathing / letting-go practice chooser — entered from “Emergency Relief” on the Intention screen.
 */
export default function OnboardingPracticePickScreen() {
  const theme = useThemeColors();
  const navigation = useNavigation<Nav>();

  const continueToSpectrum = () => {
    navigation.navigate('SpectrumCheck');
  };

  const handleSelect = (_practice: Practice) => {
    continueToSpectrum();
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()} hitSlop={12}>
          <Text style={[styles.backText, { color: theme.primary }]}>← Back</Text>
        </TouchableOpacity>
        <PracticeSelector onSelect={handleSelect} onSkip={continueToSpectrum} compact />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  back: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  backText: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
  },
});
