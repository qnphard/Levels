import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, typography } from '../../theme/colors';
import { useOnboardingStore } from '../../store/onboardingStore';

type NavigationProp = NativeStackNavigationProp<any>;

const TutorialComplete = () => {
    const navigation = useNavigation<NavigationProp>();
    const theme = useThemeColors();
    const setHasSeenTutorial = useOnboardingStore((s) => s.setHasSeenTutorial);

    const handleComplete = () => {
        setHasSeenTutorial(true);
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            })
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.content}>
                <View style={styles.iconRow}>
                    <View style={[styles.tabIcon, { backgroundColor: theme.surface }]}>
                        <Ionicons name="map-outline" size={28} color={theme.primary} />
                        <Text style={[styles.tabLabel, { color: theme.textMuted }]}>Journey</Text>
                    </View>
                    <View style={[styles.tabIcon, { backgroundColor: theme.surface }]}>
                        <Ionicons name="library-outline" size={28} color={theme.primary} />
                        <Text style={[styles.tabLabel, { color: theme.textMuted }]}>Explore</Text>
                    </View>
                    <View style={[styles.tabIcon, { backgroundColor: theme.surface }]}>
                        <Ionicons name="journal-outline" size={28} color={theme.primary} />
                        <Text style={[styles.tabLabel, { color: theme.textMuted }]}>Journal</Text>
                    </View>
                    <View style={[styles.tabIcon, { backgroundColor: theme.surface }]}>
                        <Ionicons name="person-outline" size={28} color={theme.primary} />
                        <Text style={[styles.tabLabel, { color: theme.textMuted }]}>Profile</Text>
                    </View>
                </View>

                <Text style={[styles.title, { color: theme.textPrimary }]}>
                    You're Ready! ✨
                </Text>

                <Text style={[styles.description, { color: theme.textSecondary }]}>
                    You're free to explore any level at any time. There's no gatekeeping here.
                </Text>

                <Text style={[styles.encouragement, { color: theme.primary }]}>
                    Every level is accessible from the start. Revisiting is sacred and encouraged.
                </Text>
            </View>

            <View style={styles.footer}>
                <View style={styles.progress}>
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dot, { backgroundColor: theme.textMuted }]} />
                    <View style={[styles.dotActive, { backgroundColor: theme.primary }]} />
                </View>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={handleComplete}
                >
                    <Text style={[styles.buttonText, { color: theme.primaryContrast }]}>
                        Start Exploring
                    </Text>
                    <Ionicons name="rocket-outline" size={20} color={theme.primaryContrast} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 40,
    },
    tabIcon: {
        width: 70,
        height: 70,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: typography.medium,
    },
    title: {
        fontSize: 32,
        fontWeight: typography.bold,
        textAlign: 'center',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
        fontWeight: typography.regular,
    },
    encouragement: {
        fontSize: 15,
        textAlign: 'center',
        fontStyle: 'italic',
        paddingHorizontal: 20,
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

export default TutorialComplete;
