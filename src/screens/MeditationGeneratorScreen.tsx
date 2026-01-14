/**
 * MeditationGeneratorScreen
 * Generate custom meditations using F5-TTS with binaural beats (cloud-based)
 */

import React, { useState, useCallback } from 'react';
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
import { useMeditationGenerationStore } from '../store/meditationGenerationStore';
import * as voiceService from '../services/voiceTTSService';
import {
    MeditationPurpose,
    MeditationDuration,
    MeditationVibe,
    PURPOSE_LABELS,
    VIBE_LABELS,
    VIBE_ICONS,
    VIBE_DESCRIPTIONS,
} from '../data/meditationScripts';

export default function MeditationGeneratorScreen() {
    const insets = useSafeAreaInsets();
    // System TTS removed or used via store? Store handles it.
    // We'll keep local UI state here.

    const PURPOSES: MeditationPurpose[] = [
        'sleep',
        'calm',
        'focus',
        'morning',
        'stress_relief',
        'self_compassion',
    ];

    const DURATIONS: MeditationDuration[] = [5, 10, 15, 20];
    const VIBES: MeditationVibe[] = ['mindfulness', 'ericksonian', 'performance'];

    const PURPOSE_ICONS: Record<MeditationPurpose, string> = {
        sleep: 'moon',
        calm: 'leaf',
        focus: 'eye',
        morning: 'sunny',
        stress_relief: 'heart',
        self_compassion: 'flower',
    };

    const BRAINWAVE_ICONS: Record<string, string> = {
        none: 'remove-circle-outline',
        delta: 'moon',
        theta: 'cloudy-night',
        alpha: 'leaf',
        beta: 'flash',
    };

    const navigation = useNavigation();
    const { startGeneration, isGenerating } = useMeditationGenerationStore();

    // Local UI state
    const [purpose, setPurpose] = useState<MeditationPurpose>('calm');
    const [duration, setDuration] = useState<MeditationDuration>(10);
    const [vibe, setVibe] = useState<MeditationVibe>('mindfulness');

    // Voice settings
    const [speed, setSpeed] = useState(1.0);
    const [selectedBrainwave, setSelectedBrainwave] = useState('theta');
    const [binauralVolume, setBinauralVolume] = useState(0.15);
    const [selectedAmbient, setSelectedAmbient] = useState('none');
    const [ambientVolume, setAmbientVolume] = useState(0.1);
    const [usePremiumVoice, setUsePremiumVoice] = useState(true);

    const handleGenerate = useCallback(() => {
        // Start background generation
        startGeneration({
            purpose,
            duration,
            vibe,
            speed,
            brainwave: selectedBrainwave,
            binauralVolume,
            ambient: selectedAmbient,
            ambientVolume,
            usePremiumVoice,
        });

        // We rely on the global toast to inform the user.
        // Staying on the screen allows them to generate another or leave manually.
    }, [purpose, duration, vibe, usePremiumVoice, speed, selectedBrainwave, binauralVolume, selectedAmbient, ambientVolume, startGeneration, navigation]);


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
                    <View style={styles.durationRow}>
                        {DURATIONS.map((d) => (
                            <TouchableOpacity
                                key={d}
                                style={[
                                    styles.durationButton,
                                    duration === d && styles.durationButtonSelected,
                                ]}
                                onPress={() => setDuration(d)}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.durationText,
                                        duration === d && styles.durationTextSelected,
                                    ]}
                                >
                                    {d} min
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Expert Style Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Expert Style</Text>
                    <Text style={styles.sectionSubtitle}>Choose the psychological framework</Text>
                    <View style={styles.vibeGrid}>
                        {VIBES.map((v) => (
                            <TouchableOpacity
                                key={v}
                                style={[
                                    styles.vibeCard,
                                    vibe === v && styles.vibeCardSelected,
                                ]}
                                onPress={() => setVibe(v)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.vibeHeader}>
                                    <View style={[
                                        styles.vibeIconContainer,
                                        vibe === v && styles.vibeIconContainerSelected
                                    ]}>
                                        <Ionicons
                                            name={VIBE_ICONS[v] as any}
                                            size={18}
                                            color={vibe === v ? '#ffffff' : '#6366f1'}
                                        />
                                    </View>
                                    <Text
                                        style={[
                                            styles.vibeLabel,
                                            vibe === v && styles.vibeLabelSelected,
                                        ]}
                                    >
                                        {VIBE_LABELS[v]}
                                    </Text>
                                </View>
                                <Text style={styles.vibeDescription}>
                                    {VIBE_DESCRIPTIONS[v]}
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
                            <Text style={styles.voiceInfoTitle}>Custom Cloned Voice</Text>
                            <Text style={styles.voiceInfoSubtitle}>Using your unique voice signature</Text>
                        </View>
                        {usePremiumVoice && (
                            <Ionicons name="sparkles" size={16} color="#6366f1" />
                        )}
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
    durationButton: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    durationButtonSelected: {
        backgroundColor: 'rgba(99,102,241,0.3)',
        borderColor: '#6366f1',
    },
    durationText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#8b8ba7',
    },
    durationTextSelected: {
        color: '#ffffff',
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
