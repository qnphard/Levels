import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, typography } from '../../theme/colors';
import { useOnboardingStore } from '../../store/onboardingStore';

const { width, height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<any>;

const TutorialJourneyMap = () => {
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
                    <Ionicons name="map-outline" size={60} color={theme.primary} />
                </View>

                <Text style={[styles.title, { color: theme.textPrimary }]}>
                    The Journey Map
                </Text>

                <Text style={[styles.description, { color: theme.textSecondary }]}>
                    This is your Journey Map. Each card represents a state of consciousness you can explore.
                </Text>

                <View style={styles.featureList}>
                    <View style={styles.featureItem}>
                        <Ionicons name="heart-outline" size={24} color={theme.primary} />
                        <Text style={[styles.featureText, { color: theme.textSecondary }]}>
                            <Text style={{ fontWeight: typography.semibold, color: theme.textPrimary }}>Healing</Text> - Transform dense emotions
                        </Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Ionicons name="flash-outline" size={24} color={theme.primary} />
                        <Text style={[styles.featureText, { color: theme.textSecondary }]}>
                            <Text style={{ fontWeight: typography.semibold, color: theme.textPrimary }}>Empowerment</Text> - Build inner strength
                        </Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Ionicons name="planet-outline" size={24} color={theme.primary} />
                        <Text style={[styles.featureText, { color: theme.textSecondary }]}>
                            <Text style={{ fontWeight: typography.semibold, color: theme.textPrimary }}>Spiritual</Text> - Heart-centered living
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.progress}>
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dotActive, { backgroundColor: theme.primary }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                </View>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={() => navigation.navigate('TutorialLevelChapter')}
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
        gap: 16,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    featureText: {
        fontSize: 15,
        flex: 1,
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

export default TutorialJourneyMap;
