import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/types';
import { useSavedMeditationsStore } from '../store/savedMeditationsStore';
import { getPollyVoiceLabel, getPollyEngineLabel } from '../services/voiceTTSService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PURPOSE_LABELS: Record<string, string> = {
  sleepRest: 'Sleep & Rest',
  findingCalm: 'Finding Calm',
  focusClarity: 'Focus & Clarity',
  morningAwakening: 'Morning Awakening',
  stressRelief: 'Stress Relief',
  selfCompassion: 'Self-Compassion',
};

const DURATION_LABELS: Record<string, string> = {
  short: 'Short',
  medium: 'Medium',
  long: 'Long',
};

export default function YourMeditationsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const meditations = useSavedMeditationsStore((s) => s.meditations);
  const removeMeditation = useSavedMeditationsStore((s) => s.removeMeditation);
  const clearAll = useSavedMeditationsStore((s) => s.clearAll);
  const handleOpenPlayer = useCallback(
    (m: any) => {
      const purposeLabel = PURPOSE_LABELS[m.purpose] ?? String(m.purpose);
      const audioUrls: string[] = Array.isArray(m.audioUris) ? m.audioUris : [];
      if (!audioUrls.length) {
        Alert.alert('No audio', 'This meditation has no audio attached.');
        return;
      }

      navigation.navigate('Player', {
        meditation: {
          id: m.id,
          title: purposeLabel,
          description: '',
          duration: 0,
          audioUrl: audioUrls[0],
          audioUrls,
          category: 'Find Peace',
          isPremium: true,
          instructor: `Voice: ${getPollyVoiceLabel(String(m.voiceId ?? 'Joanna'))}${
            m.pollyEngine ? ` · ${getPollyEngineLabel(m.pollyEngine)}` : ''
          }`,
          // Layered audio (optional)
          brainwave: (m.brainwave ?? 'none') as any,
          binauralVolume: typeof m.binauralVolume === 'number' ? m.binauralVolume : 0.15,
          ambient: (m.ambient ?? 'none') as any,
          ambientVolume: typeof m.ambientVolume === 'number' ? m.ambientVolume : 0.1,
        },
      });
    },
    [navigation]
  );

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert('Delete meditation?', 'This will remove it from Your Meditations.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeMeditation(id);
          },
        },
      ]);
    },
    [removeMeditation]
  );

  const handleClearAll = useCallback(() => {
    if (meditations.length === 0) return;
    Alert.alert('Clear all?', 'This will delete all saved meditations.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          clearAll();
        },
      },
    ]);
  }, [clearAll, meditations.length]);

  const empty = useMemo(() => meditations.length === 0, [meditations.length]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={['#1a1a2e', '#16213e', '#0f0f23']} style={StyleSheet.absoluteFill} />

      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerIconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#ffffff" />
        </TouchableOpacity>

        <Text style={styles.title}>Your Meditations</Text>

        <TouchableOpacity style={styles.headerIconButton} onPress={handleClearAll} disabled={empty}>
          <Ionicons name="trash-outline" size={20} color={empty ? 'rgba(255,255,255,0.35)' : '#ffffff'} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {empty ? (
          <View style={styles.emptyCard}>
            <Ionicons name="bookmark-outline" size={26} color="#8b8ba7" />
            <Text style={styles.emptyTitle}>No saved meditations yet</Text>
            <Text style={styles.emptySubtitle}>Generate a meditation and it’ll appear here automatically.</Text>
          </View>
        ) : (
          meditations.map((m) => {
            const purposeLabel = PURPOSE_LABELS[m.purpose] ?? m.purpose;
            const durationLabel = DURATION_LABELS[m.duration] ?? m.duration;
            const created = new Date(m.createdAt);

            return (
              <View key={m.id} style={styles.card}>
                <View style={styles.cardTopRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{purposeLabel}</Text>
                    <Text style={styles.cardMeta}>
                      {durationLabel} • {created.toLocaleDateString()} {created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.iconPill, !m.audioUris?.length && styles.iconPillDisabled]}
                    onPress={() => handleOpenPlayer(m)}
                    disabled={!m.audioUris?.length}
                  >
                    <Ionicons name="play" size={16} color="#ffffff" />
                    <Text style={styles.iconPillText}>Open Player</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.iconPill, styles.iconPillDanger]} onPress={() => handleDelete(m.id)}>
                    <Ionicons name="trash-outline" size={16} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyCard: {
    marginTop: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: '#8b8ba7',
    textAlign: 'center',
    lineHeight: 18,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    marginBottom: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  cardMeta: {
    marginTop: 4,
    fontSize: 12,
    color: '#8b8ba7',
  },
  iconPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#6366f1',
  },
  iconPillDisabled: {
    backgroundColor: 'rgba(99,102,241,0.35)',
  },
  iconPillDanger: {
    backgroundColor: 'rgba(239,68,68,0.75)',
    paddingHorizontal: 10,
  },
  iconPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  scriptToggleRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scriptToggleText: {
    fontSize: 12,
    color: '#8b8ba7',
    fontWeight: '600',
  },
  scriptBox: {
    marginTop: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  scriptText: {
    color: '#c7c7dd',
    fontSize: 12,
    lineHeight: 18,
  },
});

