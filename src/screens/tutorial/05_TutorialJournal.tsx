import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, typography } from '../../theme/colors';
import { useOnboardingStore } from '../../store/onboardingStore';

type NavigationProp = NativeStackNavigationProp<any>;

const TutorialJournal = () => {
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
                    <View style={styles.lockBadge}>
                        <Ionicons name="lock-closed" size={20} color={theme.primaryContrast} />
                    </View>
                    <Ionicons name="journal-outline" size={60} color={theme.primary} />
                </View>

                <Text style={[styles.title, { color: theme.textPrimary }]}>
                    Your Private Journal 🔒
                </Text>

                <Text style={[styles.description, { color: theme.textSecondary }]}>
                    Your journal is password protected. Feel safe sharing your deepest feelings here.
                </Text>

                <View style={[styles.purposeCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.purposeTitle, { color: theme.primary }]}>The Purpose</Text>
                    <Text style={[styles.purposeText, { color: theme.textSecondary }]}>
                        By writing your thoughts down, you learn to distance yourself from them.
                    </Text>
                    <Text style={[styles.purposeHighlight, { color: theme.textPrimary }]}>
                        They're just thoughts—not you.
                    </Text>
                    <Text style={[styles.purposeText, { color: theme.textSecondary }]}>
                        Let the weight of them discharge as you lay them here.
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.progress}>
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dotActive, { backgroundColor: theme.primary }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                </View>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={() => navigation.navigate('TutorialSettings')}
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
        position: 'relative',
    },
    lockBadge: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
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
        marginBottom: 24,
        fontWeight: typography.regular,
    },
    purposeCard: {
        width: '100%',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        gap: 12,
    },
    purposeTitle: {
        fontSize: 14,
        fontWeight: typography.semibold,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    purposeText: {
        fontSize: 15,
        lineHeight: 22,
        fontWeight: typography.regular,
    },
    purposeHighlight: {
        fontSize: 16,
        fontWeight: typography.semibold,
        fontStyle: 'italic',
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

export default TutorialJournal;
