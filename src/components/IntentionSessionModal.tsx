import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ONBOARDING_INTENTION_OPTIONS } from '../data/onboardingIntentions';
import { Intention, Zone, useOnboardingStore } from '../store/onboardingStore';
import { useUserStore } from '../store/userStore';
import { RootStackParamList } from '../navigation/types';
import { useThemeColors, typography, spacing, borderRadius } from '../theme/colors';
import EnergyCheckPanel, { ENERGY_ZONE_TO_LEVEL_ID } from './EnergyCheckPanel';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type IntentionSessionFinishOptions = {
  /** User checked “Don’t ask me again today” — suppress until next local midnight. */
  snoozeToday?: boolean;
};

interface IntentionSessionModalProps {
  visible: boolean;
  onFinished: (opts?: IntentionSessionFinishOptions) => void;
}

type Step = 'intentions' | 'energy';

/**
 * Same three choices as first-run onboarding (“What brings you here today?”).
 * Understanding opens the feelings pulse; Emergency Relief → Practices; Daily Practice → Journal.
 */
export default function IntentionSessionModal({
  visible,
  onFinished,
}: IntentionSessionModalProps) {
  const theme = useThemeColors();
  const navigation = useNavigation<NavigationProp>();
  const addCheckIn = useUserStore((s) => s.addCheckIn);
  const setIntention = useOnboardingStore((s) => s.setIntention);
  const setHasCompletedIntentionPrompt = useOnboardingStore(
    (s) => s.setHasCompletedIntentionPrompt
  );

  const [step, setStep] = useState<Step>('intentions');
  const [snoozeChecked, setSnoozeChecked] = useState(false);

  useEffect(() => {
    if (!visible) {
      setStep('intentions');
      setSnoozeChecked(false);
    }
  }, [visible]);

  const finish = (opts?: IntentionSessionFinishOptions) => {
    onFinished(opts);
  };

  const completePrompt = (value: Intention) => {
    setIntention(value);
    setHasCompletedIntentionPrompt(true);
    finish({ snoozeToday: snoozeChecked });
  };

  const handleSelect = (value: Intention) => {
    if (value === Intention.Understanding) {
      setStep('energy');
      return;
    }
    if (value === Intention.EmergencyRelief) {
      setIntention(Intention.EmergencyRelief);
      setHasCompletedIntentionPrompt(true);
      finish({ snoozeToday: snoozeChecked });
      navigation.navigate('Main', { screen: 'Practices' });
      return;
    }
    if (value === Intention.DailyPractice) {
      setIntention(Intention.DailyPractice);
      setHasCompletedIntentionPrompt(true);
      finish({ snoozeToday: snoozeChecked });
      navigation.navigate('Main', { screen: 'Journal' });
      return;
    }
    completePrompt(value);
  };

  const handleSkip = () => {
    setIntention(Intention.DailyPractice);
    setHasCompletedIntentionPrompt(true);
    finish({ snoozeToday: snoozeChecked });
  };

  const handleEnergyAcknowledge = (zone: Zone) => {
    addCheckIn(zone);
    setIntention(Intention.Understanding);
    setHasCompletedIntentionPrompt(true);
    finish({ snoozeToday: snoozeChecked });

    const levelId = ENERGY_ZONE_TO_LEVEL_ID[zone];
    if (levelId) {
      navigation.navigate('LevelChapter', { levelId, initialView: 'overview' });
    }
  };

  /** Understanding path without logging a check-in */
  const handleEnergySkip = () => {
    setIntention(Intention.Understanding);
    setHasCompletedIntentionPrompt(true);
    finish({ snoozeToday: snoozeChecked });
  };

  const handleRequestClose = () => {
    if (step === 'energy') {
      setStep('intentions');
      return;
    }
    handleSkip();
  };

  if (!visible) return null;

  if (step === 'energy') {
    return (
      <Modal visible animationType="slide" presentationStyle="fullScreen" onRequestClose={handleRequestClose}>
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top', 'bottom']}>
          <TouchableOpacity
            style={styles.snoozeRowEnergy}
            onPress={() => setSnoozeChecked((v) => !v)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={snoozeChecked ? 'checkbox' : 'square-outline'}
              size={22}
              color={theme.primary}
            />
            <Text style={[styles.snoozeLabel, { color: theme.textSecondary }]}>
              Don't ask me again today
            </Text>
          </TouchableOpacity>
          <EnergyCheckPanel
            sliderHeightRatio={0.5}
            onAcknowledge={handleEnergyAcknowledge}
            onSkip={handleEnergySkip}
            onBack={() => setStep('intentions')}
          />
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <Modal visible animationType="fade" transparent onRequestClose={handleRequestClose}>
      <Pressable
        style={[styles.backdrop, { backgroundColor: 'rgba(15, 23, 42, 0.5)' }]}
        onPress={handleSkip}
      >
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={[styles.title, { color: theme.textPrimary }]}>What brings you here today?</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            This helps us personalize your experience
          </Text>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {ONBOARDING_INTENTION_OPTIONS.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.option,
                  {
                    borderColor: theme.border,
                    backgroundColor:
                      theme.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
                  },
                ]}
                onPress={() => handleSelect(item.value)}
                activeOpacity={0.85}
              >
                <View style={[styles.iconWrap, { backgroundColor: `${item.accent}22` }]}>
                  <Ionicons name={item.icon} size={22} color={item.accent} />
                </View>
                <View style={styles.optionText}>
                  <Text style={[styles.optionTitle, { color: item.accent }]}>{item.title}</Text>
                  <Text style={[styles.optionSub, { color: theme.textSecondary }]}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.snoozeRow}
            onPress={() => setSnoozeChecked((v) => !v)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={snoozeChecked ? 'checkbox' : 'square-outline'}
              size={22}
              color={theme.primary}
            />
            <Text style={[styles.snoozeLabel, { color: theme.textSecondary }]}>
              Don't ask me again today
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipBtn} onPress={handleSkip} activeOpacity={0.7}>
            <Text style={[styles.skipText, { color: theme.textSecondary }]}>Skip for now</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  sheet: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.lg,
    maxWidth: 440,
    width: '100%',
    maxHeight: '88%',
    alignSelf: 'center',
  },
  title: {
    fontSize: typography.h3,
    fontWeight: typography.bold,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.body,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  scroll: {
    maxHeight: 420,
  },
  scrollContent: {
    paddingBottom: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
    marginBottom: 2,
  },
  optionSub: {
    fontSize: typography.small,
  },
  snoozeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  snoozeRowEnergy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  snoozeLabel: {
    fontSize: typography.small,
    flex: 1,
  },
  skipBtn: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  skipText: {
    fontSize: typography.body,
    textDecorationLine: 'underline',
  },
});
