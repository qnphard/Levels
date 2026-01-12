import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, useThemeMode, typography } from '../../theme/colors';
import { useOnboardingStore } from '../../store/onboardingStore';

type NavigationProp = NativeStackNavigationProp<any>;

const TutorialSettings = () => {
    const navigation = useNavigation<NavigationProp>();
    const theme = useThemeColors();
    const mode = useThemeMode();
    const setHasSeenTutorial = useOnboardingStore((s) => s.setHasSeenTutorial);

    const handleSkip = () => {
        setHasSeenTutorial(true);
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleSkip}>
                    <Text style={[styles.skipText, { color: theme.textMuted }]}>Skip tutorial</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: theme.surface }]}>
                    <Ionicons name="settings-outline" size={60} color={theme.primary} />
                </View>

                <Text style={[styles.title, { color: theme.textPrimary }]}>
                    Settings & Personalization
                </Text>

                <Text style={[styles.description, { color: theme.textSecondary }]}>
                    Make Levels feel like home.
                </Text>

                <View style={styles.settingsList}>
                    <View style={[styles.settingItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <View style={styles.settingInfo}>
                            <Ionicons name={mode === 'dark' ? 'moon' : 'sunny'} size={24} color={theme.primary} />
                            <View style={styles.settingText}>
                                <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>Theme</Text>
                                <Text style={[styles.settingDesc, { color: theme.textMuted }]}>
                                    Switch between Dark and Light
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.mockSwitch, { backgroundColor: theme.primary }]}>
                            <View style={[styles.switchKnob, { backgroundColor: theme.primaryContrast }]} />
                        </View>
                    </View>

                    <View style={[styles.settingItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="sparkles-outline" size={24} color={theme.primary} />
                            <View style={styles.settingText}>
                                <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>Glow Effects</Text>
                                <Text style={[styles.settingDesc, { color: theme.textMuted }]}>
                                    Toggle visual glow on/off
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.mockSwitch, { backgroundColor: theme.primary }]}>
                            <View style={[styles.switchKnob, { backgroundColor: theme.primaryContrast }]} />
                        </View>
                    </View>

                    <View style={[styles.settingItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="flower-outline" size={24} color={theme.primary} />
                            <View style={styles.settingText}>
                                <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>Daily Practices</Text>
                                <Text style={[styles.settingDesc, { color: theme.textMuted }]}>
                                    Show breathing & letting go practices on launch
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.mockSwitch, { backgroundColor: theme.primary }]}>
                            <View style={[styles.switchKnob, { backgroundColor: theme.primaryContrast }]} />
                        </View>
                    </View>
                </View>

                <Text style={[styles.hint, { color: theme.textMuted }]}>
                    Daily Practices is enabled by default. Disable it in Settings if you prefer to skip to the main app.
                </Text>
            </View>

            <View style={styles.footer}>
                <View style={styles.progress}>
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dotActive, { backgroundColor: theme.primary }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                </View>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={() => navigation.navigate('TutorialComplete')}
                >
                    <Text style={[styles.buttonText, { color: theme.primaryContrast }]}>Next</Text>
                    <Ionicons name="arrow-forward" size={20} color={theme.primaryContrast} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 20,
    },
    skipText: {
        fontSize: 16,
        fontWeight: typography.regular,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: typography.bold,
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        fontWeight: typography.regular,
    },
    settingsList: {
        width: '100%',
        gap: 16,
        marginBottom: 24,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    settingText: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: typography.semibold,
    },
    settingDesc: {
        fontSize: 13,
        fontWeight: typography.regular,
    },
    mockSwitch: {
        width: 50,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        paddingHorizontal: 3,
    },
    switchKnob: {
        width: 22,
        height: 22,
        borderRadius: 11,
        alignSelf: 'flex-end',
    },
    hint: {
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
        fontWeight: typography.regular,
    },
    footer: {
        paddingBottom: 40,
        gap: 20,
    },
    progress: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    dotActive: {
        width: 24,
        height: 8,
        borderRadius: 4,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        gap: 8,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: typography.semibold,
    },
});

export default TutorialSettings;
