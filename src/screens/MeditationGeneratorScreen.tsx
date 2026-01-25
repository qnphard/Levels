/**
 * MeditationGeneratorScreen
 * Generate custom meditations using F5-TTS with binaural beats (cloud-based)
 */

import React, { useMemo, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMeditationGenerationStore } from '../store/meditationGenerationStore';
import * as voiceService from '../services/voiceTTSService';
import type { MeditationPurpose, MeditationDuration, MeditationStyle } from '../services/geminiService';
import { RootStackParamList } from '../navigation/types';

const PURPOSE_LABELS: Record<MeditationPurpose, string> = {
    sleepRest: 'Sleep & Rest',
    findingCalm: 'Finding Calm',
    focusClarity: 'Focus & Clarity',
    morningAwakening: 'Morning Awakening',
    stressRelief: 'Stress Relief',
    selfCompassion: 'Self-Compassion',
};

const STYLE_LABELS: Record<MeditationStyle, string> = {
    mindfulness: 'Mindfulness',
    ericksonian: 'Ericksonian',
    alignedAction: 'Aligned Action',
    lettingGo: 'Letting Go',
};

const STYLE_DESCRIPTIONS: Record<MeditationStyle, string> = {
    mindfulness: 'Non-judgmental awareness, presence, and stabilizing attention.',
    ericksonian: 'Permissive language and gentle metaphors without suggestion.',
    alignedAction: 'Clarity and readiness without goal forcing or outcome visualization.',
    lettingGo: 'Hawkins-style letting go: allow, soften resistance, rest as awareness.',
};

const STYLE_ICONS: Record<MeditationStyle, string> = {
    mindfulness: 'leaf',
    ericksonian: 'color-wand',
    alignedAction: 'rocket',
    lettingGo: 'water',
};

export default function MeditationGeneratorScreen() {
    const insets = useSafeAreaInsets();
    // System TTS removed or used via store? Store handles it.
    // We'll keep local UI state here.

    const PURPOSES: MeditationPurpose[] = [
        'sleepRest',
        'findingCalm',
        'focusClarity',
        'morningAwakening',
        'stressRelief',
        'selfCompassion',
    ];

    const STYLES: MeditationStyle[] = ['mindfulness', 'ericksonian', 'alignedAction', 'lettingGo'];

    const PURPOSE_ICONS: Record<MeditationPurpose, string> = {
        sleepRest: 'moon',
        findingCalm: 'leaf',
        focusClarity: 'eye',
        morningAwakening: 'sunny',
        stressRelief: 'heart',
        selfCompassion: 'flower',
    };

    const BRAINWAVE_ICONS: Record<string, string> = {
        none: 'remove-circle-outline',
        delta: 'moon',
        theta: 'cloudy-night',
        alpha: 'leaf',
        beta: 'flash',
    };

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { startGeneration, isGenerating } = useMeditationGenerationStore();

    // Local UI state
    const [purpose, setPurpose] = useState<MeditationPurpose>('findingCalm');
    const [duration, setDuration] = useState<MeditationDuration>('medium');
    const [style, setStyle] = useState<MeditationStyle>('mindfulness');

    // Voice settings
    const [speed, setSpeed] = useState(1.0);
    const [voiceId, setVoiceId] = useState<string>('Joanna');
    const [voiceLocaleFilter, setVoiceLocaleFilter] = useState<'all' | 'en-US' | 'en-GB'>('all');
    const [voiceGenderFilter, setVoiceGenderFilter] = useState<'all' | 'Female' | 'Male'>('all');
    const [voiceVibeFilter, setVoiceVibeFilter] = useState<'all' | 'calm' | 'warm' | 'grounded' | 'bright'>('calm');
    const [selectedBrainwave, setSelectedBrainwave] = useState('theta');
    const [binauralVolume, setBinauralVolume] = useState(0.15);
    const [selectedAmbient, setSelectedAmbient] = useState('none');
    const [ambientVolume, setAmbientVolume] = useState(0.1);
    const [usePremiumVoice, setUsePremiumVoice] = useState(true);

    const filteredVoices = useMemo(() => {
        return voiceService.POLLY_VOICE_PRESETS.filter((v) => {
            if (voiceLocaleFilter !== 'all' && v.locale !== voiceLocaleFilter) return false;
            if (voiceGenderFilter !== 'all' && v.gender !== voiceGenderFilter) return false;
            if (voiceVibeFilter !== 'all' && v.vibe !== voiceVibeFilter) return false;
            return true;
        });
    }, [voiceLocaleFilter, voiceGenderFilter, voiceVibeFilter]);

    const handleGenerate = useCallback(() => {
        // Start background generation
        startGeneration({
            purpose,
            duration,
            style,
            speed,
            voiceId,
            brainwave: selectedBrainwave,
            binauralVolume,
            ambient: selectedAmbient,
            ambientVolume,
            usePremiumVoice,
        });

        // We rely on the global toast to inform the user.
        // Staying on the screen allows them to generate another or leave manually.
    }, [purpose, duration, style, usePremiumVoice, speed, selectedBrainwave, binauralVolume, selectedAmbient, ambientVolume, startGeneration, navigation]);


    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <LinearGradient
                colors={['#1a1a2e', '#16213e', '#0f0f23']}
                style={StyleSheet.absoluteFill}
            />

            {/* AI Brewing Overlay */}


            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Create Meditation</Text>
                    <Text style={styles.subtitle}>
                        Generate a personalized meditation with premium voice and binaural beats
                    </Text>

                    <TouchableOpacity
                        style={styles.savedButton}
                        onPress={() => navigation.navigate('YourMeditations')}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="bookmark-outline" size={18} color="#ffffff" />
                        <Text style={styles.savedButtonText}>Your Meditations</Text>
                    </TouchableOpacity>
                </View>

                {/* Purpose Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Purpose</Text>
                    <View style={styles.optionsGrid}>
                        {PURPOSES.map((p) => (
                            <TouchableOpacity
                                key={p}
                                style={[
                                    styles.optionCard,
                                    purpose === p && styles.optionCardSelected,
                                ]}
                                onPress={() => setPurpose(p)}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={PURPOSE_ICONS[p] as any}
                                    size={24}
                                    color={purpose === p ? '#ffffff' : '#8b8ba7'}
                                />
                                <Text
                                    style={[
                                        styles.optionText,
                                        purpose === p && styles.optionTextSelected,
                                    ]}
                                >
                                    {PURPOSE_LABELS[p]}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Duration Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Duration</Text>
                    <Text style={styles.sectionSubtitle}>How long should your meditation be?</Text>
                    <View style={styles.durationRow}>
                        {[
                            { id: 'short', label: 'Short', range: '3-5 min', value: 'short' as const },
                            { id: 'medium', label: 'Medium', range: '5-10 min', value: 'medium' as const },
                            { id: 'long', label: 'Long', range: '15-20 min', value: 'long' as const },
                        ].map((d) => (
                            <TouchableOpacity
                                key={d.id}
                                style={[
                                    styles.durationCard,
                                    duration === d.value && styles.durationCardSelected,
                                ]}
                                onPress={() => setDuration(d.value)}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.durationLabel,
                                        duration === d.value && styles.durationLabelSelected,
                                    ]}
                                >
                                    {d.label}
                                </Text>
                                <Text style={styles.durationRange}>{d.range}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Expert Style Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Expert Style</Text>
                    <Text style={styles.sectionSubtitle}>Choose the psychological framework</Text>
                    <View style={styles.vibeGrid}>
                        {STYLES.map((v) => (
                            <TouchableOpacity
                                key={v}
                                style={[
                                    styles.vibeCard,
                                    style === v && styles.vibeCardSelected,
                                ]}
                                onPress={() => setStyle(v)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.vibeHeader}>
                                    <View style={[
                                        styles.vibeIconContainer,
                                        style === v && styles.vibeIconContainerSelected
                                    ]}>
                                        <Ionicons
                                            name={STYLE_ICONS[v] as any}
                                            size={18}
                                            color={style === v ? '#ffffff' : '#6366f1'}
                                        />
                                    </View>
                                    <Text
                                        style={[
                                            styles.vibeLabel,
                                            style === v && styles.vibeLabelSelected,
                                        ]}
                                    >
                                        {STYLE_LABELS[v]}
                                    </Text>
                                </View>
                                <Text style={styles.vibeDescription}>
                                    {STYLE_DESCRIPTIONS[v]}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Binaural Beats Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Binaural Beats</Text>
                    <Text style={styles.sectionSubtitle}>Use headphones for best effect</Text>
                    <View style={styles.brainwaveGrid}>
                        {voiceService.BRAINWAVE_PRESETS.map((preset) => (
                            <TouchableOpacity
                                key={preset.id}
                                style={[
                                    styles.brainwaveCard,
                                    selectedBrainwave === preset.id && styles.brainwaveCardSelected,
                                ]}
                                onPress={() => setSelectedBrainwave(preset.id)}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={BRAINWAVE_ICONS[preset.id] as any}
                                    size={20}
                                    color={selectedBrainwave === preset.id ? '#ffffff' : '#8b8ba7'}
                                />
                                <Text
                                    style={[
                                        styles.brainwaveLabel,
                                        selectedBrainwave === preset.id && styles.brainwaveLabelSelected,
                                    ]}
                                >
                                    {preset.name}
                                </Text>
                                {preset.hz > 0 && (
                                    <Text style={styles.brainwaveHz}>{preset.hz} Hz</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {selectedBrainwave !== 'none' && (
                        <View style={styles.volumeContainer}>
                            <Text style={styles.volumeLabel}>
                                Volume: {Math.round(binauralVolume * 100)}%
                            </Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={0.5}
                                value={binauralVolume}
                                onValueChange={setBinauralVolume}
                                minimumTrackTintColor="#6366f1"
                                maximumTrackTintColor="#3e3e5e"
                                thumbTintColor="#ffffff"
                            />
                        </View>
                    )}
                </View>

                {/* Ambient Background Sound */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Background Sound</Text>
                    <Text style={styles.sectionSubtitle}>Natural ambience mixed with voice</Text>
                    <View style={styles.brainwaveGrid}>
                        {voiceService.AMBIENT_PRESETS.map((preset) => (
                            <TouchableOpacity
                                key={preset.id}
                                style={[
                                    styles.brainwaveCard,
                                    selectedAmbient === preset.id && styles.brainwaveCardSelected,
                                ]}
                                onPress={() => setSelectedAmbient(preset.id)}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={preset.icon as any}
                                    size={20}
                                    color={selectedAmbient === preset.id ? '#ffffff' : '#8b8ba7'}
                                />
                                <Text
                                    style={[
                                        styles.brainwaveLabel,
                                        selectedAmbient === preset.id && styles.brainwaveLabelSelected,
                                    ]}
                                >
                                    {preset.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {selectedAmbient !== 'none' && (
                        <View style={styles.volumeContainer}>
                            <Text style={styles.volumeLabel}>
                                Volume: {Math.round(ambientVolume * 100)}%
                            </Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={0.5}
                                value={ambientVolume}
                                onValueChange={setAmbientVolume}
                                minimumTrackTintColor="#6366f1"
                                maximumTrackTintColor="#3e3e5e"
                                thumbTintColor="#ffffff"
                            />
                        </View>
                    )}
                </View>

                {/* Voice Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Voice Tuning</Text>
                    <View style={styles.voiceInfoCard}>
                        <View style={styles.voiceIconContainer}>
                            <Ionicons name="mic-outline" size={24} color="#6366f1" />
                        </View>
                        <View style={styles.voiceInfoText}>
                            <Text style={styles.voiceInfoTitle}>Polly Neural Voice</Text>
                            <Text style={styles.voiceInfoSubtitle}>{voiceService.getPollyVoiceLabel(voiceId)}</Text>
                        </View>
                        {usePremiumVoice && (
                            <Ionicons name="sparkles" size={16} color="#6366f1" />
                        )}
                    </View>

                    <View style={styles.voicePickerContainer}>
                        <Text style={styles.sectionSubtitle}>Choose a voice</Text>
                        <View style={styles.voiceFilterBlock}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.voiceFiltersRow}>
                                <TouchableOpacity
                                    style={[styles.filterChip, voiceLocaleFilter === 'all' && styles.filterChipSelected]}
                                    onPress={() => setVoiceLocaleFilter('all')}
                                >
                                    <Text style={[styles.filterChipText, voiceLocaleFilter === 'all' && styles.filterChipTextSelected]}>All</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.filterChip, voiceLocaleFilter === 'en-US' && styles.filterChipSelected]}
                                    onPress={() => setVoiceLocaleFilter('en-US')}
                                >
                                    <Text style={[styles.filterChipText, voiceLocaleFilter === 'en-US' && styles.filterChipTextSelected]}>US</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.filterChip, voiceLocaleFilter === 'en-GB' && styles.filterChipSelected]}
                                    onPress={() => setVoiceLocaleFilter('en-GB')}
                                >
                                    <Text style={[styles.filterChipText, voiceLocaleFilter === 'en-GB' && styles.filterChipTextSelected]}>UK</Text>
                                </TouchableOpacity>

                                <View style={styles.filterDivider} />

                                <TouchableOpacity
                                    style={[styles.filterChip, voiceGenderFilter === 'all' && styles.filterChipSelected]}
                                    onPress={() => setVoiceGenderFilter('all')}
                                >
                                    <Text style={[styles.filterChipText, voiceGenderFilter === 'all' && styles.filterChipTextSelected]}>Any</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.filterChip, voiceGenderFilter === 'Female' && styles.filterChipSelected]}
                                    onPress={() => setVoiceGenderFilter('Female')}
                                >
                                    <Text style={[styles.filterChipText, voiceGenderFilter === 'Female' && styles.filterChipTextSelected]}>Female</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.filterChip, voiceGenderFilter === 'Male' && styles.filterChipSelected]}
                                    onPress={() => setVoiceGenderFilter('Male')}
                                >
                                    <Text style={[styles.filterChipText, voiceGenderFilter === 'Male' && styles.filterChipTextSelected]}>Male</Text>
                                </TouchableOpacity>
                            </ScrollView>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.voiceFiltersRow}>
                                {(['all', 'calm', 'warm', 'grounded', 'bright'] as const).map((vibe) => {
                                    const selected = voiceVibeFilter === vibe;
                                    const label =
                                        vibe === 'all' ? 'Any vibe'
                                            : vibe === 'calm' ? 'Calm'
                                                : vibe === 'warm' ? 'Warm'
                                                    : vibe === 'grounded' ? 'Grounded'
                                                        : 'Bright';
                                    return (
                                        <TouchableOpacity
                                            key={vibe}
                                            style={[styles.filterChip, selected && styles.filterChipSelected]}
                                            onPress={() => setVoiceVibeFilter(vibe)}
                                        >
                                            <Text style={[styles.filterChipText, selected && styles.filterChipTextSelected]}>{label}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>

                        <View style={styles.voiceGrid}>
                            {(filteredVoices.length ? filteredVoices : voiceService.POLLY_VOICE_PRESETS).map((v) => {
                                const selected = voiceId === v.id;
                                return (
                                    <TouchableOpacity
                                        key={v.id}
                                        style={[
                                            styles.voiceCard,
                                            selected && styles.voiceCardSelected,
                                        ]}
                                        onPress={() => setVoiceId(v.id)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[styles.voiceName, selected && styles.voiceNameSelected]}>
                                            {v.name}
                                        </Text>
                                        <Text style={styles.voiceMeta}>
                                            {v.locale} • {v.gender} • {v.vibe}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <View style={styles.speedContainer}>
                        <Text style={styles.volumeLabel}>
                            Speaking Pace: {speed.toFixed(1)}x
                        </Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={0.5}
                            maximumValue={1.5}
                            value={speed}
                            onValueChange={setSpeed}
                            minimumTrackTintColor="#6366f1"
                            maximumTrackTintColor="#3e3e5e"
                            thumbTintColor="#ffffff"
                        />
                    </View>
                </View>

                {/* Error display */}


                {/* Generate Button */}
                <TouchableOpacity
                    style={styles.generateButton}
                    onPress={handleGenerate}
                    activeOpacity={0.8}
                    disabled={isGenerating}
                >
                    <Ionicons name="sparkles" size={24} color="#ffffff" />
                    <Text style={styles.generateButtonText}>
                        {isGenerating ? 'Generating...' : 'Generate & Play'}
                    </Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#8b8ba7',
        lineHeight: 24,
    },
    savedButton: {
        marginTop: 14,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.10)',
    },
    savedButtonText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 13,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8b8ba7',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    sectionSubtitle: {
        fontSize: 12,
        color: '#6b6b8a',
        marginBottom: 12,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    optionCard: {
        width: '47%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    optionCardSelected: {
        backgroundColor: 'rgba(99,102,241,0.3)',
        borderColor: '#6366f1',
    },
    optionText: {
        fontSize: 14,
        color: '#8b8ba7',
        marginTop: 8,
        textAlign: 'center',
    },
    optionTextSelected: {
        color: '#ffffff',
    },
    durationRow: {
        flexDirection: 'row',
        gap: 12,
    },
    durationCard: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    durationCardSelected: {
        backgroundColor: 'rgba(99,102,241,0.3)',
        borderColor: '#6366f1',
    },
    durationLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#8b8ba7',
    },
    durationLabelSelected: {
        color: '#ffffff',
    },
    durationRange: {
        fontSize: 12,
        color: '#6b6b8a',
        marginTop: 4,
    },
    vibeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    vibeCard: {
        width: '47%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    vibeCardSelected: {
        backgroundColor: 'rgba(99,102,241,0.3)',
        borderColor: '#6366f1',
    },
    vibeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    vibeIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: 'rgba(99,102,241,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    vibeIconContainerSelected: {
        backgroundColor: '#6366f1',
    },
    vibeLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8b8ba7',
    },
    vibeLabelSelected: {
        color: '#ffffff',
    },
    vibeDescription: {
        fontSize: 11,
        color: '#6b6b8a',
        lineHeight: 16,
    },
    brainwaveGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    brainwaveCard: {
        flex: 1,
        minWidth: '18%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    brainwaveCardSelected: {
        backgroundColor: 'rgba(99,102,241,0.3)',
        borderColor: '#6366f1',
    },
    brainwaveLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#8b8ba7',
        marginTop: 6,
    },
    brainwaveLabelSelected: {
        color: '#ffffff',
    },
    brainwaveHz: {
        fontSize: 10,
        color: '#6b6b8a',
        marginTop: 2,
    },
    volumeContainer: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    speedContainer: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    volumeLabel: {
        fontSize: 14,
        color: '#8b8ba7',
        marginBottom: 8,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    voiceInfoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.3)',
    },
    voiceIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    voiceInfoText: {
        flex: 1,
    },
    voiceInfoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    voiceInfoSubtitle: {
        fontSize: 12,
        color: '#8b8ba7',
        marginTop: 2,
    },
    voicePickerContainer: {
        marginTop: 12,
    },
    voiceFilterBlock: {
        marginTop: 8,
        gap: 10,
    },
    voiceFiltersRow: {
        paddingRight: 6,
        gap: 8,
        alignItems: 'center',
    },
    filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.10)',
    },
    filterChipSelected: {
        backgroundColor: 'rgba(99,102,241,0.30)',
        borderColor: '#6366f1',
    },
    filterChipText: {
        color: '#c7c7dd',
        fontSize: 12,
        fontWeight: '700',
    },
    filterChipTextSelected: {
        color: '#ffffff',
    },
    filterDivider: {
        width: 1,
        height: 22,
        backgroundColor: 'rgba(255,255,255,0.12)',
        marginHorizontal: 4,
    },
    voiceGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 10,
    },
    voiceCard: {
        width: '47%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 14,
        padding: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.10)',
    },
    voiceCardSelected: {
        backgroundColor: 'rgba(99,102,241,0.3)',
        borderColor: '#6366f1',
    },
    voiceName: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 13,
        marginBottom: 4,
    },
    voiceNameSelected: {
        color: '#ffffff',
    },
    voiceMeta: {
        color: '#8b8ba7',
        fontSize: 10,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(239,68,68,0.1)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.3)',
    },
    errorText: {
        flex: 1,
        fontSize: 13,
        color: '#ef4444',
    },
    brewingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15, 15, 35, 0.9)',
        zIndex: 100,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    brewingCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.3)',
    },
    brewingTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#ffffff',
        marginTop: 20,
        textAlign: 'center',
    },
    brewingSubtitle: {
        fontSize: 14,
        color: '#8b8ba7',
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 20,
    },
    loadingBar: {
        width: '100%',
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        marginTop: 24,
        overflow: 'hidden',
    },
    loadingBarFill: {
        width: '40%',
        height: '100%',
        backgroundColor: '#6366f1',
        borderRadius: 2,
    },
    generateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6366f1',
        borderRadius: 16,
        paddingVertical: 18,
        gap: 10,
    },
    generateButtonActive: {
        backgroundColor: '#ef4444',
    },
    generateButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
    },
    previewSection: {
        marginTop: 24,
    },
    previewCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    previewText: {
        fontSize: 14,
        color: '#9b9bb8',
        lineHeight: 22,
    },
});
