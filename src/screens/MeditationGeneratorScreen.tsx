/**
 * MeditationGeneratorScreen
 * Generate custom meditations using on-device TTS with binaural beats
 */

import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useTTS } from '../hooks/useTTS';
import { useSherpaTTS } from '../hooks/useSherpaTTS';
import { geminiService } from '../services/geminiService';
import { AI_CONFIG } from '../config/aiConfig';
import { useBinauralBeats, BrainwaveType, BRAINWAVE_PRESETS } from '../hooks/useBinauralBeats';
import {
    generateMeditationScript,
    sectionsToText,
    MeditationPurpose,
    MeditationDuration,
    MeditationVibe,
    PURPOSE_LABELS,
    VIBE_LABELS,
    VIBE_ICONS,
    VIBE_DESCRIPTIONS,
} from '../data/meditationScripts';

const PURPOSES: MeditationPurpose[] = [
    'sleep',
    'calm',
    'focus',
    'morning',
    'stress_relief',
    'self_compassion',
];

const DURATIONS: MeditationDuration[] = [5, 10, 15, 20];
const VIBES: MeditationVibe[] = ['mindfulness', 'clinical_hypnosis', 'ericksonian', 'performance'];

const PURPOSE_ICONS: Record<MeditationPurpose, string> = {
    sleep: 'moon',
    calm: 'leaf',
    focus: 'eye',
    morning: 'sunny',
    stress_relief: 'heart',
    self_compassion: 'flower',
};

const BRAINWAVE_ICONS: Record<BrainwaveType, string> = {
    delta: 'moon',
    theta: 'cloudy-night',
    alpha: 'leaf',
    beta: 'flash',
};

const BRAINWAVES: BrainwaveType[] = ['delta', 'theta', 'alpha', 'beta'];

export default function MeditationGeneratorScreen() {
    const insets = useSafeAreaInsets();
    const systemTTS = useTTS();
    const sherpaTTS = useSherpaTTS();
    const binaural = useBinauralBeats();

    const [isUsingHighQuality, setIsUsingHighQuality] = useState(sherpaTTS.isAvailable);

    const [purpose, setPurpose] = useState<MeditationPurpose>('calm');
    const [duration, setDuration] = useState<MeditationDuration>(10);
    const [vibe, setVibe] = useState<MeditationVibe>('mindfulness');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isBrewingAI, setIsBrewingAI] = useState(false);
    const [generatedScript, setGeneratedScript] = useState<string>('');
    const [showVoices, setShowVoices] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);

    // Binaural beat settings
    const [binauralEnabled, setBinauralEnabled] = useState(true);
    const [selectedBrainwave, setSelectedBrainwave] = useState<BrainwaveType>('theta');
    const [binauralVolume, setBinauralVolume] = useState(0.3);

    const handleGenerate = useCallback(async () => {
        setIsGenerating(true);
        setGenerationError(null);

        let script = '';

        // Generate the script via Gemini if API key is present
        if (AI_CONFIG.GEMINI_API_KEY) {
            try {
                setIsBrewingAI(true);
                script = await geminiService.generateScript({
                    purpose,
                    durationMinutes: duration,
                    vibe,
                });
                setIsBrewingAI(false);
            } catch (err: any) {
                console.warn('Gemini generation failed, falling back to templates:', err);
                setIsBrewingAI(false);
                // Fallback to local templates
                const sections = generateMeditationScript(purpose, duration);
                script = sectionsToText(sections);
            }
        } else {
            // No API key - standard template generation
            const sections = generateMeditationScript(purpose, duration);
            script = sectionsToText(sections);
        }

        setGeneratedScript(script);

        // Start binaural beats if enabled
        if (binauralEnabled) {
            binaural.setVolume(binauralVolume);
            binaural.start(200, BRAINWAVE_PRESETS[selectedBrainwave].hz);
        }

        // Determine which TTS to use
        if (isUsingHighQuality && sherpaTTS.isInitialized) {
            await sherpaTTS.speak(script);
            setIsGenerating(false);
            // Keep binaural going for a bit after speech ends
            setTimeout(() => {
                if (binauralEnabled) {
                    binaural.stop();
                }
            }, 5000);
        } else {
            // Fallback to system TTS
            systemTTS.speak(script, {
                rate: 0.8,
                onDone: () => {
                    setIsGenerating(false);
                    setTimeout(() => {
                        if (binauralEnabled) binaural.stop();
                    }, 5000);
                },
                onError: (error) => {
                    console.error('System TTS Error:', error);
                    setIsGenerating(false);
                    binaural.stop();
                },
            });
        }
    }, [purpose, duration, vibe, isUsingHighQuality, sherpaTTS, systemTTS, binauralEnabled, selectedBrainwave, binauralVolume, binaural]);

    const handleStop = useCallback(() => {
        if (isUsingHighQuality) {
            sherpaTTS.stop();
        } else {
            systemTTS.stop();
        }
        binaural.stop();
        setIsGenerating(false);
    }, [isUsingHighQuality, sherpaTTS, systemTTS, binaural]);

    const handleBrainwaveChange = useCallback((type: BrainwaveType) => {
        setSelectedBrainwave(type);
        if (binaural.isPlaying) {
            binaural.setBrainwave(type);
        }
    }, [binaural]);

    const handleVolumeChange = useCallback((value: number) => {
        setBinauralVolume(value);
        if (binaural.isPlaying) {
            binaural.setVolume(value);
        }
    }, [binaural]);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <LinearGradient
                colors={['#1a1a2e', '#16213e', '#0f0f23']}
                style={StyleSheet.absoluteFill}
            />

            {/* AI Brewing Overlay */}
            {isBrewingAI && (
                <View style={styles.brewingOverlay}>
                    <View style={styles.brewingCard}>
                        <Ionicons name="sparkles" size={48} color="#6366f1" />
                        <Text style={styles.brewingTitle}>Brewing Your Meditation</Text>
                        <Text style={styles.brewingSubtitle}>Gemini is composing a unique session for you...</Text>
                        <View style={styles.loadingBar}>
                            <View style={styles.loadingBarFill} />
                        </View>
                    </View>
                </View>
            )}

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Create Meditation</Text>
                    <Text style={styles.subtitle}>
                        Generate a personalized meditation with voice and binaural beats
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
                    <Text style={styles.sectionSubtitle}>Choose the psychological framework for your session</Text>
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
                    <View style={styles.binauralHeader}>
                        <View>
                            <Text style={styles.sectionTitle}>Binaural Beats</Text>
                            <Text style={styles.binauralSubtitle}>
                                {binaural.isAvailable
                                    ? 'Use headphones for effect'
                                    : 'Requires development build'}
                            </Text>
                        </View>
                        <Switch
                            value={binauralEnabled && binaural.isAvailable}
                            onValueChange={setBinauralEnabled}
                            disabled={!binaural.isAvailable}
                            trackColor={{ false: '#3e3e5e', true: '#6366f1' }}
                            thumbColor={(binauralEnabled && binaural.isAvailable) ? '#ffffff' : '#8b8ba7'}
                        />
                    </View>

                    {!binaural.isAvailable && (
                        <View style={styles.unavailableNotice}>
                            <Ionicons name="information-circle" size={18} color="#f59e0b" />
                            <Text style={styles.unavailableText}>
                                Binaural beats require a development build. Run 'npx expo run:android' instead of Expo Go.
                            </Text>
                        </View>
                    )}

                    {binauralEnabled && (
                        <>
                            {/* Brainwave Type */}
                            <View style={styles.brainwaveGrid}>
                                {BRAINWAVES.map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.brainwaveCard,
                                            selectedBrainwave === type && styles.brainwaveCardSelected,
                                        ]}
                                        onPress={() => handleBrainwaveChange(type)}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons
                                            name={BRAINWAVE_ICONS[type] as any}
                                            size={20}
                                            color={selectedBrainwave === type ? '#ffffff' : '#8b8ba7'}
                                        />
                                        <Text
                                            style={[
                                                styles.brainwaveLabel,
                                                selectedBrainwave === type && styles.brainwaveLabelSelected,
                                            ]}
                                        >
                                            {BRAINWAVE_PRESETS[type].label.split(' ')[0]}
                                        </Text>
                                        <Text style={styles.brainwaveHz}>
                                            {BRAINWAVE_PRESETS[type].hz} Hz
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Volume Slider */}
                            <View style={styles.volumeContainer}>
                                <Text style={styles.volumeLabel}>
                                    Volume: {Math.round(binauralVolume * 100)}%
                                </Text>
                                <Slider
                                    style={styles.slider}
                                    minimumValue={0}
                                    maximumValue={1}
                                    value={binauralVolume}
                                    onValueChange={handleVolumeChange}
                                    minimumTrackTintColor="#6366f1"
                                    maximumTrackTintColor="#3e3e5e"
                                    thumbTintColor="#ffffff"
                                />
                            </View>
                        </>
                    )}
                </View>

                {/* Voice Selection */}
                <View style={styles.section}>
                    <View style={styles.voiceHeader}>
                        <View>
                            <Text style={styles.sectionTitle}>High-Quality Voices</Text>
                            <Text style={styles.binauralSubtitle}>
                                {sherpaTTS.isAvailable
                                    ? 'Professional offline voices'
                                    : 'Requires development build'}
                            </Text>
                        </View>
                        <Switch
                            value={isUsingHighQuality && sherpaTTS.isAvailable}
                            onValueChange={setIsUsingHighQuality}
                            disabled={!sherpaTTS.isAvailable}
                            trackColor={{ false: '#3e3e5e', true: '#6366f1' }}
                            thumbColor={(isUsingHighQuality && sherpaTTS.isAvailable) ? '#ffffff' : '#8b8ba7'}
                        />
                    </View>

                    {isUsingHighQuality && sherpaTTS.isAvailable ? (
                        <View style={styles.sherpaContainer}>
                            {sherpaTTS.isDownloading ? (
                                <View style={styles.downloadContainer}>
                                    <Text style={styles.downloadStatus}>{sherpaTTS.downloadStatus}</Text>
                                    <View style={styles.progressBarBg}>
                                        <View
                                            style={[
                                                styles.progressBarFill,
                                                { width: `${Math.round(sherpaTTS.downloadProgress * 100)}%` }
                                            ]}
                                        />
                                    </View>
                                    <Text style={styles.progressText}>
                                        {Math.round(sherpaTTS.downloadProgress * 100)}%
                                    </Text>
                                </View>
                            ) : (
                                <View style={styles.voiceGrid}>
                                    {sherpaTTS.availableVoices.map((voice) => (
                                        <TouchableOpacity
                                            key={voice.id}
                                            style={[
                                                styles.voiceCard,
                                                sherpaTTS.selectedVoice.id === voice.id && styles.voiceCardSelected,
                                            ]}
                                            onPress={() => sherpaTTS.setupVoice(voice)}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons
                                                name={voice.gender === 'female' ? 'woman' : 'man'}
                                                size={20}
                                                color={sherpaTTS.selectedVoice.id === voice.id ? '#ffffff' : '#8b8ba7'}
                                            />
                                            <Text
                                                style={[
                                                    styles.voiceCardName,
                                                    sherpaTTS.selectedVoice.id === voice.id && styles.voiceCardNameSelected,
                                                ]}
                                            >
                                                {voice.name}
                                            </Text>
                                            {!sherpaTTS.isInitialized && (
                                                <Text style={styles.voiceQuality}>Tap to setup</Text>
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                            {sherpaTTS.error && (
                                <Text style={styles.errorText}>{sherpaTTS.error}</Text>
                            )}
                        </View>
                    ) : (
                        <>
                            <TouchableOpacity
                                style={styles.voiceSelector}
                                onPress={() => setShowVoices(!showVoices)}
                                activeOpacity={0.7}
                                disabled={isUsingHighQuality}
                            >
                                <View>
                                    <Text style={styles.voiceLabel}>
                                        {systemTTS.voices.find(v => v.identifier === systemTTS.selectedVoice)?.name || 'System Default'}
                                    </Text>
                                </View>
                                <Ionicons
                                    name={showVoices ? 'chevron-up' : 'chevron-down'}
                                    size={20}
                                    color="#8b8ba7"
                                />
                            </TouchableOpacity>

                            {showVoices && (
                                <ScrollView style={styles.voiceList} nestedScrollEnabled>
                                    {systemTTS.voices.map((voice) => (
                                        <TouchableOpacity
                                            key={voice.identifier}
                                            style={[
                                                styles.voiceItem,
                                                systemTTS.selectedVoice === voice.identifier && styles.voiceItemSelected,
                                            ]}
                                            onPress={() => {
                                                systemTTS.setSelectedVoice(voice.identifier);
                                                setShowVoices(false);
                                            }}
                                        >
                                            <Text style={styles.voiceName}>{voice.name}</Text>
                                            <Text style={styles.voiceQuality}>{voice.quality}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </>
                    )}
                </View>

                {/* Generate Button */}
                <TouchableOpacity
                    style={[
                        styles.generateButton,
                        (systemTTS.isSpeaking || sherpaTTS.isSpeaking || isGenerating) && styles.generateButtonActive,
                    ]}
                    onPress={(systemTTS.isSpeaking || sherpaTTS.isSpeaking) ? handleStop : handleGenerate}
                    activeOpacity={0.8}
                    disabled={isUsingHighQuality && !sherpaTTS.isInitialized && !sherpaTTS.isDownloading}
                >
                    {isGenerating && !(systemTTS.isSpeaking || sherpaTTS.isSpeaking) ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (systemTTS.isSpeaking || sherpaTTS.isSpeaking) ? (
                        <>
                            <Ionicons name="stop" size={24} color="#ffffff" />
                            <Text style={styles.generateButtonText}>Stop</Text>
                        </>
                    ) : (
                        <>
                            <Ionicons name="play" size={24} color="#ffffff" />
                            <Text style={styles.generateButtonText}>
                                {isUsingHighQuality && !sherpaTTS.isInitialized ? 'Setup Voice First' : 'Generate & Play'}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Binaural playing indicator */}
                {binaural.isPlaying && (
                    <View style={styles.playingIndicator}>
                        <View style={styles.pulseDot} />
                        <Text style={styles.playingText}>
                            Binaural beats active ({BRAINWAVE_PRESETS[selectedBrainwave].hz} Hz)
                        </Text>
                    </View>
                )}

                {/* Preview */}
                {generatedScript !== '' && (
                    <View style={styles.previewSection}>
                        <Text style={styles.sectionTitle}>Generated Script</Text>
                        <View style={styles.previewCard}>
                            <Text style={styles.previewText}>{generatedScript}</Text>
                        </View>
                    </View>
                )}
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
    // Binaural Beat Styles
    binauralHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    binauralSubtitle: {
        fontSize: 12,
        color: '#6b6b8a',
        marginTop: 2,
    },
    unavailableNotice: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: 'rgba(245,158,11,0.1)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(245,158,11,0.3)',
    },
    unavailableText: {
        flex: 1,
        fontSize: 13,
        color: '#f59e0b',
        lineHeight: 18,
    },
    brainwaveGrid: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    brainwaveCard: {
        flex: 1,
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
        fontSize: 12,
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
    volumeLabel: {
        fontSize: 14,
        color: '#8b8ba7',
        marginBottom: 8,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    // Voice styles
    voiceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sherpaContainer: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    downloadContainer: {
        alignItems: 'center',
        padding: 10,
    },
    downloadStatus: {
        fontSize: 14,
        color: '#8b8ba7',
        marginBottom: 12,
    },
    progressBarBg: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#6366f1',
    },
    progressText: {
        fontSize: 12,
        color: '#ffffff',
        fontWeight: '600',
    },
    voiceGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    voiceCard: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    voiceCardSelected: {
        backgroundColor: 'rgba(99,102,241,0.3)',
        borderColor: '#6366f1',
    },
    voiceCardName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8b8ba7',
        marginTop: 8,
    },
    voiceCardNameSelected: {
        color: '#ffffff',
    },
    errorText: {
        fontSize: 12,
        color: '#ef4444',
        marginTop: 10,
        textAlign: 'center',
    },
    // AI Brewing Styles
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
    voiceSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    voiceLabel: {
        fontSize: 16,
        color: '#ffffff',
        marginTop: 4,
    },
    voiceList: {
        maxHeight: 200,
        marginTop: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    voiceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    voiceItemSelected: {
        backgroundColor: 'rgba(99,102,241,0.2)',
    },
    voiceName: {
        fontSize: 15,
        color: '#ffffff',
    },
    voiceQuality: {
        fontSize: 12,
        color: '#8b8ba7',
    },
    // Generate button
    generateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#6366f1',
        borderRadius: 16,
        paddingVertical: 18,
        marginTop: 8,
    },
    generateButtonActive: {
        backgroundColor: '#ef4444',
    },
    generateButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
    },
    // Playing indicator
    playingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        gap: 8,
    },
    pulseDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10b981',
    },
    playingText: {
        fontSize: 13,
        color: '#10b981',
    },
    // Vibe Selection Styles
    sectionSubtitle: {
        fontSize: 14,
        color: '#8b8ba7',
        marginTop: 4,
        marginBottom: 16,
    },
    vibeGrid: {
        gap: 12,
    },
    vibeCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    vibeCardSelected: {
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        borderColor: '#6366f1',
    },
    vibeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    vibeIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    vibeIconContainerSelected: {
        backgroundColor: '#6366f1',
    },
    vibeLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    vibeLabelSelected: {
        color: '#ffffff',
    },
    vibeDescription: {
        fontSize: 13,
        color: '#8b8ba7',
        lineHeight: 18,
    },
    // Preview
    previewSection: {
        marginTop: 32,
    },
    previewCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    previewText: {
        fontSize: 15,
        color: '#d1d1e9',
        lineHeight: 24,
    },
});
