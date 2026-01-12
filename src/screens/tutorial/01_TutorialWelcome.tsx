import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, typography } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

type TutorialStackParamList = {
    TutorialWelcome: undefined;
    TutorialJourneyMap: undefined;
    TutorialLevelChapter: undefined;
    TutorialCheckIn: undefined;
    TutorialJournal: undefined;
    TutorialSettings: undefined;
    TutorialComplete: undefined;
};

type NavigationProp = NativeStackNavigationProp<TutorialStackParamList, 'TutorialWelcome'>;

const TutorialWelcome = () => {
    const navigation = useNavigation<NavigationProp>();
    const theme = useThemeColors();

    return (
        <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../../assets/images/levels-thumbnail.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <Text style={[styles.title, { color: theme.textPrimary }]}>
                    Welcome to Levels
                </Text>

                <Text style={[styles.description, { color: theme.textSecondary }]}>
                    This app is your companion for transcending heavy emotional states and rising toward inner peace.
                </Text>

                <Text style={[styles.description, { color: theme.textSecondary }]}>
                    Based on the Map of Consciousness, Levels helps you understand where you are emotionally, and provides meditations, articles, and practices to help you gently rise above suffering.
                </Text>

                <Text style={[styles.tagline, { color: theme.primary }]}>
                    Your journey toward lightness begins here.
                </Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={() => navigation.navigate('TutorialJourneyMap')}
                >
                    <Text style={[styles.buttonText, { color: theme.primaryContrast }]}>
                        Let's take a quick tour
                    </Text>
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
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logoContainer: {
        marginBottom: 40,
    },
    logo: {
        width: 120,
        height: 120,
    },
    title: {
        fontSize: 32,
        fontWeight: typography.bold,
        textAlign: 'center',
        marginBottom: 24,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 16,
        fontWeight: typography.regular,
    },
    tagline: {
        fontSize: 18,
        fontWeight: typography.semibold,
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
    },
    footer: {
        paddingBottom: 40,
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

export default TutorialWelcome;
