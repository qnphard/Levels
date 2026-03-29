import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStackTypes';
import { useUserStore } from '../../store/userStore';
import { Zone } from '../../store/onboardingStore';
import { useThemeColors, typography, spacing } from '../../theme/colors';
import EnergyCheckPanel from '../../components/EnergyCheckPanel';

type Nav = NativeStackNavigationProp<OnboardingStackParamList, 'EnergyCheck'>;

/**
 * Feelings / energy pulse check — entered from “Understanding” on the Intention screen.
 */
export default function OnboardingEnergyCheckScreen() {
  const theme = useThemeColors();
  const navigation = useNavigation<Nav>();
  const addCheckIn = useUserStore((s) => s.addCheckIn);

  const goSpectrum = () => {
    navigation.navigate('SpectrumCheck');
  };

  const handleAcknowledge = (zone: Zone) => {
    addCheckIn(zone);
    goSpectrum();
  };

  const handleSkip = () => {
    goSpectrum();
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()} hitSlop={12}>
        <Text style={[styles.backText, { color: theme.primary }]}>← Back</Text>
      </TouchableOpacity>
      <EnergyCheckPanel
        sliderHeightRatio={0.5}
        onAcknowledge={handleAcknowledge}
        onSkip={handleSkip}
        onBack={() => navigation.goBack()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  back: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  backText: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
  },
});
