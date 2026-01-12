import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, typography } from '../../theme/colors';
import { useOnboardingStore } from '../../store/onboardingStore';

type NavigationProp = NativeStackNavigationProp<any>;

const TutorialLevelChapter = () => {
    const navigation = useNavigation<NavigationProp>();
    const theme = useThemeColors();
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
                    <Ionicons name="book-outline" size={60} color={theme.primary} />
                </View>

                <Text style={[styles.title, { color: theme.textPrimary }]}>
                    Level Chapters
                </Text>

                <Text style={[styles.description, { color: theme.textSecondary }]}>
                    Each level has its own chapter filled with content to help you understand and transcend that state.
                </Text>

                <View style={styles.featureList}>
                    <View style={styles.featureItem}>
                        <View style={[styles.featureIcon, { backgroundColor: theme.surface }]}>
                            <Ionicons name="headset-outline" size={20} color={theme.primary} />
                        </View>
                        <View style={styles.featureContent}>
                            <Text style={[styles.featureTitle, { color: theme.textPrimary }]}>Meditations</Text>
                            <Text style={[styles.featureDesc, { color: theme.textMuted }]}>Guided practices for deep work</Text>
                        </View>
                    </View>
                    <View style={styles.featureItem}>
                        <View style={[styles.featureIcon, { backgroundColor: theme.surface }]}>
                            <Ionicons name="document-text-outline" size={20} color={theme.primary} />
                        </View>
                        <View style={styles.featureContent}>
                            <Text style={[styles.featureTitle, { color: theme.textPrimary }]}>Articles</Text>
                            <Text style={[styles.featureDesc, { color: theme.textMuted }]}>Understanding and insights</Text>
                        </View>
                    </View>
                    <View style={styles.featureItem}>
                        <View style={[styles.featureIcon, { backgroundColor: theme.surface }]}>
                            <Ionicons name="compass-outline" size={20} color={theme.primary} />
                        </View>
                        <View style={styles.featureContent}>
                            <Text style={[styles.featureTitle, { color: theme.textPrimary }]}>Overview</Text>
                            <Text style={[styles.featureDesc, { color: theme.textMuted }]}>Quick summary of each state</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.progress}>
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dotActive, { backgroundColor: theme.primary }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                </View>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={() => navigation.navigate('TutorialCheckIn')}
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
    featureList: {
        width: '100%',
        gap: 20,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    featureIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: typography.semibold,
    },
    featureDesc: {
        fontSize: 14,
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

export default TutorialLevelChapter;
