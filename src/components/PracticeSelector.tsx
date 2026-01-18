import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    useThemeColors,
    typography,
    borderRadius,
    ThemeColors,
    toRgba,
    useGlowEnabled
} from '../theme/colors';

export type PracticeType = 'breathing' | 'technique';

export interface Practice {
    id: string;
    type: PracticeType;
    name: string;
    description: string;
    explanation: string;
    bestFor: string;
    pattern?: {
        inhale: number;
        holdIn?: number;
        exhale: number;
        holdOut?: number;
    };
    totalDuration: number;
    icon: keyof typeof Ionicons.glyphMap;
    instruction: string;
}

export const PRACTICES: Practice[] = [
    // Breathing
    {
        id: 'box',
        type: 'breathing',
        name: 'Box Breathing',
        description: 'Equal counts for inhale, hold, exhale, and hold.',
        explanation: 'Box breathing is a powerful technique used by Navy SEALs to stay calm and focused under extreme pressure. By equalizing the phases of your breath, you reset your autonomic nervous system and bring your mind back to center.',
        bestFor: 'Stress & Focus',
        pattern: { inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },
        totalDuration: 60,
        icon: 'cube-outline',
        instruction: 'Follow the rhythm of the circle...',
    },
    {
        id: '478',
        type: 'breathing',
        name: '4-7-8 Breathing',
        description: 'Long exhale activates your calm nervous system.',
        explanation: 'The 4-7-8 technique acts as a natural tranquilizer for the nervous system. The long, slow exhale forces the body to release CO2 and signals the vagus nerve to initiate a deep relaxation response. It is highly effective for reducing anxiety and preparing for sleep.',
        bestFor: 'Anxiety & Sleep',
        pattern: { inhale: 4, holdIn: 7, exhale: 8 },
        totalDuration: 60,
        icon: 'moon-outline',
        instruction: 'Inhale 4, Hold 7, Exhale 8...',
    },
    {
        id: 'sigh',
        type: 'breathing',
        name: 'Physiological Sigh',
        description: 'Double inhale followed by a long exhale.',
        explanation: 'The Physiological Sigh is the body\'s natural way of offloading rising CO2 levels. By performing a double inhale (opening as many alveoli as possible) followed by a long sigh, you can lower your heart rate and acute stress levels in seconds.',
        bestFor: 'Acute Stress & Anger',
        pattern: { inhale: 3, holdIn: 2, exhale: 7 },
        totalDuration: 60,
        icon: 'flash-outline',
        instruction: 'Deep inhale, small sip, then long sigh...',
    },
    {
        id: 'belly',
        type: 'breathing',
        name: 'Simple Belly Breath',
        description: 'Gentle, rhythmic breathing into your belly.',
        explanation: 'Belly breathing (diaphragmatic breathing) is the most efficient way to breathe. Many people under stress breathe shallowly from the chest. This practice re-trains your body to use the full capacity of your lungs, promoting a steady state of calm.',
        bestFor: 'Beginners & Calm',
        pattern: { inhale: 4, exhale: 4 },
        totalDuration: 60,
        icon: 'leaf-outline',
        instruction: 'Gentle breath in, gentle breath out...',
    },
    // Techniques
    {
        id: 'shaking',
        type: 'technique',
        name: 'Shaking Release',
        description: 'Release pent-up fear and tension energy through movement.',
        explanation: 'Notice how animals shake after a stressful event, or how people shake when they are afraid. This is the body\'s natural, biological reaction to release suppressed and repressed emotions. Instead of suppressing it, we use it consciously in a safe place to "shake off" fear and tension without judgment.',
        bestFor: 'Fear & Anxiety',
        totalDuration: 60,
        icon: 'body-outline',
        instruction: '1. Stand or sit in a safe place.\n2. Begin to shake your hands, arms, and body.\n3. Let the vibration move through you.\n4. Do not judge the movement.',
    },
    {
        id: 'eyes',
        type: 'technique',
        name: 'Through the Eyes',
        description: 'Clear fear and grief by shifting your point of observation.',
        explanation: 'Spirit vision is diffuse and context-oriented, focusing on the "whole," while the Ego is oriented toward specifics and linear content. Based on the Tratak tradition, this practice clears "grief/fear lenses" by using an unwavering gaze to dissolve distractions. Traditionally, a candle flame is recommended, but the glowing circle in this app works as well.',
        bestFor: 'Grief & Vision',
        totalDuration: 60,
        icon: 'eye-outline',
        instruction: '1. Use a candle flame or the circle below.\n2. Stare without blinking (one-pointed mind).\n3. Notice discomfort as energy surfaces.\n4. Close eyes once you feel release.',
    },
    {
        id: 'letting-go-basic',
        type: 'technique',
        name: 'Core Letting Go',
        description: 'The fundamental practice of surrendering internal resistance.',
        explanation: 'The essence of letting go is the decision to stop resisting a feeling. By focusing on the physical sensation rather than the thoughts about it, we allow the energy to run its course. It is not about "getting rid of" a feeling, but about being willing to feel it fully until it dissolves.',
        bestFor: 'Any Emotion',
        totalDuration: 60,
        icon: 'heart-outline',
        instruction: '1. Focus on the feeling in your body.\n2. Ignore the thoughts about the feeling.\n3. Surrender all resistance to the sensation.\n4. Stay with it until the energy shifts.',
    },
];

interface PracticeSelectorProps {
    onSelect: (practice: Practice) => void;
    onSkip?: () => void;
}

const PracticeSelector: React.FC<PracticeSelectorProps> = ({ onSelect, onSkip }) => {
    const [activeTab, setActiveTab] = useState<PracticeType>('breathing');
    const theme = useThemeColors();
    const glowEnabled = useGlowEnabled();
    const styles = useMemo(() => createStyles(theme, glowEnabled), [theme, glowEnabled]);

    const filteredPractices = PRACTICES.filter(p => p.type === activeTab);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Choose Your Practice</Text>
            <Text style={styles.subtitle}>
                Select a tool to help shift your state of being.
            </Text>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'breathing' && styles.activeTab]}
                    onPress={() => setActiveTab('breathing')}
                >
                    <Text style={[styles.tabText, activeTab === 'breathing' && styles.activeTabText]}>Breathing Techniques</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'technique' && styles.activeTab]}
                    onPress={() => setActiveTab('technique')}
                >
                    <Text style={[styles.tabText, activeTab === 'technique' && styles.activeTabText]}>Letting Go Techniques</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {filteredPractices.map((practice) => (
                    <TouchableOpacity
                        key={practice.id}
                        style={[
                            styles.practiceCard,
                            glowEnabled && {
                                borderColor: practice.type === 'breathing' ? 'rgba(167, 139, 250, 0.64)' : 'rgba(244, 114, 182, 0.64)',
                                shadowColor: practice.type === 'breathing' ? '#A78BFA' : '#F472B6',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: theme.mode === 'dark' ? 0.27 : 0.2,
                                shadowRadius: 24,
                                borderWidth: 2,
                                // No elevation for dark mode to match MeditationCard style
                                ...(theme.mode !== 'dark' && { elevation: 6 }),
                                backgroundColor: theme.mode === 'dark' ? 'rgba(9, 19, 28, 0.85)' : theme.cardBackground, // Dark Glass: Blocks bleed but keeps depth
                                boxShadow: [
                                    `0 0 25px ${practice.type === 'breathing'
                                        ? (theme.mode === 'dark' ? toRgba('#A78BFA', 0.48) : toRgba('#A78BFA', 0.32))
                                        : (theme.mode === 'dark' ? toRgba('#F472B6', 0.48) : toRgba('#F472B6', 0.32))}`,
                                    `0 0 50px ${practice.type === 'breathing'
                                        ? (theme.mode === 'dark' ? toRgba('#A78BFA', 0.2) : toRgba('#A78BFA', 0.16))
                                        : (theme.mode === 'dark' ? toRgba('#F472B6', 0.2) : toRgba('#F472B6', 0.16))}`,
                                    `inset 0 0 20px ${practice.type === 'breathing'
                                        ? toRgba('#A78BFA', 0.12)
                                        : toRgba('#F472B6', 0.12)}`,
                                ].join(', '),
                            }
                        ]}
                        onPress={() => onSelect(practice)}
                        activeOpacity={0.8}
                    >
                        {glowEnabled && (
                            <View
                                pointerEvents="none"
                                style={{
                                    position: 'absolute',
                                    top: -8,
                                    left: -8,
                                    right: -8,
                                    bottom: -8,
                                    borderRadius: borderRadius.lg + 8,
                                    opacity: 0.8,
                                    backgroundColor: practice.type === 'breathing'
                                        ? toRgba('#A78BFA', theme.mode === 'dark' ? 0.12 : 0.04)
                                        : toRgba('#F472B6', theme.mode === 'dark' ? 0.12 : 0.04),
                                }}
                            />
                        )}
                        <View style={[
                            styles.iconContainer,
                            practice.type === 'technique' && { backgroundColor: 'rgba(244, 114, 182, 0.15)' }
                        ]}>
                            <Ionicons
                                name={practice.icon}
                                size={28}
                                color={practice.type === 'breathing' ? "#A78BFA" : "#F472B6"}
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.practiceName}>{practice.name}</Text>
                            <Text style={styles.practiceDescription}>{practice.description}</Text>
                            <View style={styles.tagContainer}>
                                <Text style={[
                                    styles.tag,
                                    practice.type === 'technique' && { color: '#F472B6', backgroundColor: 'rgba(244, 114, 182, 0.15)' }
                                ]}>
                                    {practice.bestFor}
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {onSkip && (
                <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
                    <Text style={styles.skipText}>Skip for now</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const createStyles = (theme: ThemeColors, glowEnabled: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingTop: 60,
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: theme.textPrimary,
        textAlign: 'center',
        marginBottom: 8,
        paddingHorizontal: 24,
    },
    subtitle: {
        fontSize: 15,
        color: theme.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
        paddingHorizontal: 24,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
        marginHorizontal: 24,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.textMuted,
    },
    activeTabText: {
        color: theme.textPrimary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 32,
        paddingBottom: 120,
    },
    practiceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 40,
        borderWidth: 1,
        borderColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        overflow: 'hidden',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: 'rgba(167, 139, 250, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    textContainer: {
        flex: 1,
    },
    practiceName: {
        fontSize: 17,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: 4,
    },
    practiceDescription: {
        fontSize: 13,
        color: theme.textSecondary,
        lineHeight: 18,
        marginBottom: 8,
    },
    tagContainer: {
        flexDirection: 'row',
    },
    tag: {
        fontSize: 11,
        color: '#A78BFA',
        backgroundColor: 'rgba(167, 139, 250, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        overflow: 'hidden',
        fontWeight: '500',
    },
    skipButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    skipText: {
        fontSize: 15,
        color: theme.textMuted,
    },
});

export default PracticeSelector;
